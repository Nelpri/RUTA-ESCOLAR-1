// Sistema JWT simple para autenticación
class JWTManager {
    constructor() {
        this.secret = 'ruta_escolar_secret_key_2025';
    }

    // Generar token JWT simple
    generateToken(payload) {
        const header = {
            alg: 'HS256',
            typ: 'JWT'
        };

        const now = Math.floor(Date.now() / 1000);
        const tokenPayload = {
            ...payload,
            iat: now,
            exp: now + (24 * 60 * 60) // 24 horas
        };

        const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
        const encodedPayload = this.base64UrlEncode(JSON.stringify(tokenPayload));
        
        const signature = this.createSignature(encodedHeader, encodedPayload);
        
        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }

    // Verificar token JWT
    verifyToken(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }

            const [header, payload, signature] = parts;
            
            // Verificar firma
            const expectedSignature = this.createSignature(header, payload);
            if (signature !== expectedSignature) {
                return null;
            }

            // Decodificar payload
            const decodedPayload = JSON.parse(this.base64UrlDecode(payload));
            
            // Verificar expiración
            const now = Math.floor(Date.now() / 1000);
            if (decodedPayload.exp < now) {
                return null;
            }

            return decodedPayload;
        } catch (error) {
            console.error('Error verificando token:', error);
            return null;
        }
    }

    // Crear firma HMAC-SHA256 simple
    createSignature(header, payload) {
        const data = `${header}.${payload}`;
        return this.simpleHash(data + this.secret);
    }

    // Hash simple (en producción usar crypto.subtle)
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir a 32bit integer
        }
        return Math.abs(hash).toString(36);
    }

    // Codificar base64 URL-safe
    base64UrlEncode(str) {
        return btoa(str)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    // Decodificar base64 URL-safe
    base64UrlDecode(str) {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        while (str.length % 4) {
            str += '=';
        }
        return atob(str);
    }

    // Obtener token del localStorage
    getStoredToken() {
        return localStorage.getItem('auth_token');
    }

    // Guardar token en localStorage
    storeToken(token) {
        localStorage.setItem('auth_token', token);
    }

    // Eliminar token
    clearToken() {
        localStorage.removeItem('auth_token');
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        const token = this.getStoredToken();
        if (!token) return false;
        
        const payload = this.verifyToken(token);
        return payload !== null;
    }

    // Obtener información del usuario autenticado
    getCurrentUser() {
        const token = this.getStoredToken();
        if (!token) return null;
        
        return this.verifyToken(token);
    }
}

// Crear instancia global
const jwtManager = new JWTManager();
