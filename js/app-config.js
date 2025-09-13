// Configuración centralizada de la aplicación
const APP_CONFIG = {
    // Configuración de la aplicación
    APP: {
        NAME: 'Ruta Escolar Segura',
        VERSION: '2.0.0',
        DESCRIPTION: 'Sistema de gestión de transporte escolar',
        AUTHOR: 'Nelson Prieto',
        YEAR: '2025'
    },

    // Configuración de archivos
    FILES: {
        CSS: [
            'css/styles.css',
            'css/admin.css'
        ],
        JS: [
            'js/config.js',
            'js/jwt.js',
            'js/security.js',
            'js/roles.js',
            'js/templates.js',
            'js/auth.js',
            'js/notification.js',
            'js/api.js',
            'js/app.js',
            'js/script.js',
            'js/admin.js'
        ],
        EXTERNAL: {
            FONTS: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
            FONT_AWESOME: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
            HTML2PDF: 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
        }
    },

    // Configuración de rutas
    ROUTES: {
        MAIN: '/app.html',
        USER_LEGACY: '/index%20ruta1.html',
        ADMIN_LEGACY: '/index.html',
        API: {
            AUTH: '/api/auth/login',
            REGISTRATIONS: '/api/registrations',
            SYNC: '/api/sync'
        }
    },

    // Configuración de vistas
    VIEWS: {
        USER: 'user',
        ADMIN: 'admin'
    },

    // Configuración de roles
    ROLES: {
        ADMIN: 'admin',
        SUPERVISOR: 'supervisor',
        CONDUCTOR: 'conductor'
    },

    // Configuración de notificaciones
    NOTIFICATIONS: {
        DURATION: 5000,
        POSITION: 'top-right',
        TYPES: {
            SUCCESS: 'success',
            ERROR: 'error',
            WARNING: 'warning',
            INFO: 'info'
        }
    },

    // Configuración de sincronización
    SYNC: {
        INTERVAL: 30000, // 30 segundos
        AUTO_SYNC_ON_START: true,
        NOTIFY_ON_SYNC: true
    },

    // Configuración de validación
    VALIDATION: {
        DEBOUNCE_DELAY: 300,
        SHOW_ERRORS_IMMEDIATELY: true,
        CLEAR_ERRORS_ON_FOCUS: true
    },

    // Configuración de UI
    UI: {
        THEMES: {
            ADMIN: 'admin',
            CONDUCTOR: 'conductor',
            SUPERVISOR: 'supervisor',
            USER: 'user'
        },
        ANIMATIONS: {
            ENABLED: true,
            DURATION: 300
        },
        RESPONSIVE: {
            BREAKPOINTS: {
                MOBILE: 768,
                TABLET: 1024,
                DESKTOP: 1200
            }
        }
    },

    // Configuración de desarrollo
    DEV: {
        DEBUG: true,
        LOG_LEVEL: 'info', // debug, info, warn, error
        SHOW_LOADING: true
    }
};

// Función para obtener configuración
function getConfig(path) {
    const keys = path.split('.');
    let config = APP_CONFIG;
    
    for (const key of keys) {
        if (config && typeof config === 'object' && key in config) {
            config = config[key];
        } else {
            return undefined;
        }
    }
    
    return config;
}

// Función para establecer configuración
function setConfig(path, value) {
    const keys = path.split('.');
    let config = APP_CONFIG;
    
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in config) || typeof config[key] !== 'object') {
            config[key] = {};
        }
        config = config[key];
    }
    
    config[keys[keys.length - 1]] = value;
}

// Función para logging con niveles
function log(level, message, ...args) {
    if (!APP_CONFIG.DEV.DEBUG) return;
    
    const levels = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
    };
    
    const currentLevel = levels[APP_CONFIG.DEV.LOG_LEVEL] || 1;
    const messageLevel = levels[level] || 1;
    
    if (messageLevel >= currentLevel) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
        
        switch (level) {
            case 'debug':
                console.debug(prefix, message, ...args);
                break;
            case 'info':
                console.info(prefix, message, ...args);
                break;
            case 'warn':
                console.warn(prefix, message, ...args);
                break;
            case 'error':
                console.error(prefix, message, ...args);
                break;
        }
    }
}

// Hacer funciones globales
window.getConfig = getConfig;
window.setConfig = setConfig;
window.log = log;
