export const CONFIG = {
    // Configuración de precios con descripciones
    PRICES: {
        media168: {
            amount: 168000,
            description: 'Media Ruta - Mañana',
            currency: 'COP'
        },
        media180: {
            amount: 180000,
            description: 'Media Ruta - Tarde',
            currency: 'COP'
        },
        completa: {
            amount: 284000,
            description: 'Ruta Completa',
            currency: 'COP'
        }
    },

    // Patrones de validación con mensajes de error
    VALIDATION: {
        namePattern: {
            regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
            message: 'Solo letras y espacios, entre 2 y 50 caracteres',
            minLength: 2,
            maxLength: 50
        },
        phonePattern: {
            regex: /^[0-9]{10}$/,
            message: 'Debe contener 10 dígitos numéricos',
            length: 10
        },
        emailPattern: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Ingrese un correo electrónico válido'
        }
    },

    // Configuración de seguridad
    SECURITY: {
        driverPassword: process.env.DRIVER_PASSWORD || 'admin123', // Mejor usar variable de entorno
        passwordMinLength: 8,
        maxLoginAttempts: 3,
        sessionTimeout: 30 * 60 * 1000, // 30 minutos en milisegundos
        tokenExpiration: '24h'
    },

    // Configuración de recibos por mes
    RECEIPT_BASES: {
        Febrero: {
            base: 250201,
            startDate: '2025-02-01',
            endDate: '2025-02-28'
        },
        Marzo: {
            base: 250301,
            startDate: '2025-03-01',
            endDate: '2025-03-31'
        },
        Abril: {
            base: 250401,
            startDate: '2025-04-01',
            endDate: '2025-04-30'
        },
        Mayo: {
            base: 250501,
            startDate: '2025-05-01',
            endDate: '2025-05-31'
        },
        Junio: {
            base: 250601,
            startDate: '2025-06-01',
            endDate: '2025-06-30'
        },
        Julio: {
            base: 250701,
            startDate: '2025-07-01',
            endDate: '2025-07-31'
        },
        Agosto: {
            base: 350801,
            startDate: '2025-08-01',
            endDate: '2025-08-31'
        },
        Septiembre: {
            base: 250901,
            startDate: '2025-09-01',
            endDate: '2025-09-30'
        },
        Octubre: {
            base: 251001,
            startDate: '2025-10-01',
            endDate: '2025-10-31'
        },
        Noviembre: {
            base: 251101,
            startDate: '2025-11-01',
            endDate: '2025-11-30'
        }
    },

    // Configuración de la aplicación
    APP: {
        name: 'Ruta Escolar Segura',
        version: '1.0.0',
        supportEmail: 'yoyotzq913@gmail.com',
        supportPhone: '3153287083',
        paymentDueDay: 5,
        locale: 'es-CO',
        timezone: 'America/Bogota'
    },

    // Configuración de notificaciones
    NOTIFICATIONS: {
        paymentReminder: {
            daysBeforeDue: 3,
            message: 'Recuerda realizar el pago antes del día 5'
        },
        successMessages: {
            registration: 'Inscripción realizada con éxito',
            payment: 'Pago registrado correctamente',
            receipt: 'Comprobante generado exitosamente'
        },
        errorMessages: {
            registration: 'Error en la inscripción',
            payment: 'Error al procesar el pago',
            receipt: 'Error al generar el comprobante'
        }
    },

    // Configuración de PDF
    PDF: {
        options: {
            format: 'letter',
            orientation: 'portrait',
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            }
        },
        filename: {
            prefix: 'recibo-',
            dateFormat: 'YYYYMMDD'
        }
    }
};

// Objeto congelado para prevenir modificaciones accidentales
Object.freeze(CONFIG);