# 🚌 Ruta Escolar Segura

Sistema de gestión de transporte escolar con panel de usuario para inscripciones y panel administrativo para gestión.

## 📋 Características

### Panel de Usuario (`index ruta1.html`)
- ✅ Formulario de inscripción completo
- ✅ Sistema de términos y condiciones obligatorio
- ✅ Generación de comprobantes de pago
- ✅ Validación en tiempo real
- ✅ Interfaz responsive y moderna

### Panel de Administración (`index.html`)
- ✅ Dashboard con estadísticas
- ✅ Gestión de estudiantes inscritos
- ✅ Control de pagos (verificar/marcar pendiente)
- ✅ Exportación de datos a CSV
- ✅ Control de asistencia
- ✅ Sistema de autenticación

### Servidor Local
- ✅ Servidor Python integrado
- ✅ API REST para operaciones CRUD
- ✅ Almacenamiento en archivos JSON
- ✅ Sincronización en tiempo real

## 🚀 Instalación y Uso

### Opción 1: Servidor Local (Recomendado)
```bash
# Ejecutar el servidor Python
python servidor-python.py
```

Luego abrir en el navegador:
- **Aplicación Unificada:** http://localhost:8000/app.html (Recomendado)

### Opción 2: Abrir Directamente
Abrir `app.html` directamente en el navegador (funciona con localStorage).

## 🔐 Credenciales de Usuario

- **Conductor:** `conductor` / `password` - Gestión de ruta asignada
- **Administrador:** `admin` / `admin123` - Acceso completo al sistema
- **Supervisor:** `supervisor` / `super123` - Supervisión de operaciones

## 🛡️ Seguridad

### Características de Seguridad Implementadas:
- ✅ **Autenticación JWT** - Tokens seguros con expiración
- ✅ **Sistema de Roles** - 3 niveles de acceso (Admin, Supervisor, Conductor)
- ✅ **Sincronización Automática** - Datos siempre actualizados
- ✅ **Rate Limiting** - Protección contra ataques de fuerza bruta
- ✅ **Validación de entrada** - Sanitización de datos
- ✅ **Sesiones seguras** - Timeout automático de inactividad
- ✅ **Protección de API** - Autenticación requerida para operaciones sensibles
- ✅ **Detección de intentos** - Bloqueo temporal por intentos fallidos

### Configuración de Seguridad:
- Tokens JWT con expiración de 24 horas
- Máximo 5 intentos de login antes del bloqueo
- Bloqueo temporal de 15 minutos por intentos fallidos
- Rate limiting de 100 requests por minuto

## 📁 Estructura del Proyecto

```
ruta-escolar/
├── app.html                   # Aplicación unificada
├── servidor-python.py        # Servidor local
├── README.md                 # Documentación
├── css/
│   ├── styles.css           # Estilos principales
│   └── admin.css            # Estilos del admin
├── js/
│   ├── config.js            # Configuración
│   ├── api.js               # API del servidor
│   ├── auth.js              # Autenticación
│   ├── admin.js             # Lógica del admin
│   ├── script.js            # Lógica del usuario
│   └── notification.js      # Notificaciones
├── assets/                  # Imágenes y recursos
└── data/                    # Datos del servidor (se crea automáticamente)
```

## 💰 Precios del Servicio

- **Media Ruta:** $168,000 - $180,000
- **Ruta Completa:** $284,000

## 🔧 Configuración

### Modificar Precios
Editar `js/config.js`:
```javascript
PRICES: {
    media168: 168000,
    media180: 180000,
    completa: 284000
}
```

### Cambiar Credenciales
Editar `js/auth.js`:
```javascript
if (username === 'conductor' && password === 'password') {
    // Cambiar aquí las credenciales
}
```

## 📱 Funcionalidades

### Para Usuarios
1. Leer términos y condiciones
2. Completar formulario de inscripción
3. Generar comprobante de pago
4. Esperar verificación del administrador

### Para Administradores
1. Iniciar sesión
2. Ver estadísticas generales
3. Gestionar estudiantes inscritos
4. Verificar pagos
5. Exportar datos
6. Control de asistencia

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript ES6
- **Backend:** Python 3 (servidor local)
- **Almacenamiento:** localStorage + archivos JSON
- **Librerías:** Font Awesome, html2pdf.js
- **Servidor:** Python HTTP Server

## 📞 Soporte

Desarrollado por Nelson Prieto - 2025

Para soporte técnico o consultas, contactar al desarrollador.

## 📄 Licencia

© 2025 Ruta Escolar - Todos los derechos reservados
