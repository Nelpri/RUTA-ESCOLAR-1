// Configuración de seguridad
const SECURITY_CONFIG = {
    // Configuración de tokens
    TOKEN: {
        SECRET: 'ruta_escolar_secret_key_2025',
        EXPIRY_HOURS: 24,
        REFRESH_THRESHOLD: 2 // Horas antes de expirar para refrescar
    },
    
    // Configuración de sesión
    SESSION: {
        TIMEOUT_MINUTES: 30, // Timeout de inactividad
        MAX_LOGIN_ATTEMPTS: 5,
        LOCKOUT_DURATION_MINUTES: 15
    },
    
    // Configuración de validación
    VALIDATION: {
        PASSWORD_MIN_LENGTH: 8,
        USERNAME_MIN_LENGTH: 3,
        MAX_LOGIN_ATTEMPTS: 5
    },
    
    // Configuración de API
    API: {
        RATE_LIMIT_REQUESTS: 100, // Requests por minuto
        RATE_LIMIT_WINDOW: 60000, // 1 minuto en ms
        TIMEOUT_MS: 10000 // 10 segundos
    }
};

// Sistema de rate limiting simple
class RateLimiter {
    constructor() {
        this.requests = new Map();
    }
    
    isAllowed(identifier) {
        const now = Date.now();
        const windowStart = now - SECURITY_CONFIG.API.RATE_LIMIT_WINDOW;
        
        if (!this.requests.has(identifier)) {
            this.requests.set(identifier, []);
        }
        
        const userRequests = this.requests.get(identifier);
        
        // Limpiar requests antiguos
        const recentRequests = userRequests.filter(time => time > windowStart);
        this.requests.set(identifier, recentRequests);
        
        // Verificar límite
        if (recentRequests.length >= SECURITY_CONFIG.API.RATE_LIMIT_REQUESTS) {
            return false;
        }
        
        // Agregar request actual
        recentRequests.push(now);
        return true;
    }
}

// Sistema de detección de intentos de login
class LoginAttemptTracker {
    constructor() {
        this.attempts = new Map();
        this.lockedAccounts = new Map();
    }
    
    recordAttempt(username, success) {
        const now = Date.now();
        
        if (success) {
            // Limpiar intentos exitosos
            this.attempts.delete(username);
            this.lockedAccounts.delete(username);
            return true;
        }
        
        // Registrar intento fallido
        if (!this.attempts.has(username)) {
            this.attempts.set(username, []);
        }
        
        const attempts = this.attempts.get(username);
        attempts.push(now);
        
        // Verificar si excede el límite
        const recentAttempts = attempts.filter(time => 
            now - time < SECURITY_CONFIG.SESSION.LOCKOUT_DURATION_MINUTES * 60 * 1000
        );
        
        if (recentAttempts.length >= SECURITY_CONFIG.VALIDATION.MAX_LOGIN_ATTEMPTS) {
            this.lockedAccounts.set(username, now);
            return false;
        }
        
        return true;
    }
    
    isLocked(username) {
        if (!this.lockedAccounts.has(username)) {
            return false;
        }
        
        const lockTime = this.lockedAccounts.get(username);
        const now = Date.now();
        const lockDuration = SECURITY_CONFIG.SESSION.LOCKOUT_DURATION_MINUTES * 60 * 1000;
        
        if (now - lockTime > lockDuration) {
            this.lockedAccounts.delete(username);
            return false;
        }
        
        return true;
    }
    
    getRemainingLockTime(username) {
        if (!this.isLocked(username)) {
            return 0;
        }
        
        const lockTime = this.lockedAccounts.get(username);
        const now = Date.now();
        const lockDuration = SECURITY_CONFIG.SESSION.LOCKOUT_DURATION_MINUTES * 60 * 1000;
        const remaining = lockDuration - (now - lockTime);
        
        return Math.max(0, remaining);
    }
}

// Validaciones de seguridad
class SecurityValidator {
    static validatePassword(password) {
        if (!password || password.length < SECURITY_CONFIG.VALIDATION.PASSWORD_MIN_LENGTH) {
            return {
                valid: false,
                message: `La contraseña debe tener al menos ${SECURITY_CONFIG.VALIDATION.PASSWORD_MIN_LENGTH} caracteres`
            };
        }
        
        // Verificar complejidad básica
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        
        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
            return {
                valid: false,
                message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
            };
        }
        
        return { valid: true };
    }
    
    static validateUsername(username) {
        if (!username || username.length < SECURITY_CONFIG.VALIDATION.USERNAME_MIN_LENGTH) {
            return {
                valid: false,
                message: `El nombre de usuario debe tener al menos ${SECURITY_CONFIG.VALIDATION.USERNAME_MIN_LENGTH} caracteres`
            };
        }
        
        // Verificar caracteres válidos
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return {
                valid: false,
                message: 'El nombre de usuario solo puede contener letras, números y guiones bajos'
            };
        }
        
        return { valid: true };
    }
    
    static sanitizeInput(input) {
        if (typeof input !== 'string') {
            return input;
        }
        
        // Escapar caracteres HTML
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }
}

// Crear instancias globales
const rateLimiter = new RateLimiter();
const loginTracker = new LoginAttemptTracker();

// Función para verificar seguridad antes de operaciones sensibles
function checkSecurity(operation, identifier) {
    // Verificar rate limiting
    if (!rateLimiter.isAllowed(identifier)) {
        throw new Error('Demasiadas solicitudes. Intenta más tarde.');
    }
    
    // Verificar si la cuenta está bloqueada
    if (loginTracker.isLocked(identifier)) {
        const remainingTime = loginTracker.getRemainingLockTime(identifier);
        const minutes = Math.ceil(remainingTime / (60 * 1000));
        throw new Error(`Cuenta bloqueada. Intenta en ${minutes} minutos.`);
    }
    
    return true;
}

// Función para registrar intentos de login
function recordLoginAttempt(username, success) {
    return loginTracker.recordAttempt(username, success);
}
