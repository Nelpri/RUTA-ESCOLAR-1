# 🚌 Sistema de Ruta Escolar

Sistema completo para gestión de inscripciones y pagos de transporte escolar.

## 🚀 Inicio Rápido

### 1. Iniciar Servidor
```bash
# Opción 1: Script automático (Windows)
iniciar-servidor.bat

# Opción 2: Manual
python servidor-python.py
```

### 2. Acceder a la Aplicación
- **Panel de Usuario:** http://localhost:8000/index%20ruta1.html
- **Panel de Administrador:** http://localhost:8000/index.html

## 📋 Funcionalidades

### Panel de Usuario
- ✅ Inscripción de estudiantes
- ✅ Términos y condiciones obligatorios
- ✅ Comprobante de pago (pendiente de autorización)
- ✅ Notificación cuando el pago es autorizado
- ✅ Descarga de comprobante con código de autorización

### Panel de Administrador
- ✅ Login seguro (usuario: `conductor`, contraseña: `password`)
- ✅ Dashboard con estadísticas
- ✅ Lista de estudiantes inscritos
- ✅ Verificación de pagos con un clic
- ✅ Exportación de datos en CSV
- ✅ Sincronización automática

## 🔐 Código de Autorización

Cada comprobante autorizado incluye un código único:
- **Formato:** `AUTH-DDMMYY-NNNN`
- **Ejemplo:** `AUTH-080925-1234`
- **Incluye:** Fecha de inscripción + últimos 4 dígitos del comprobante

## 📁 Archivos Esenciales

```
ruta-escolar/
├── servidor-python.py          # Servidor principal
├── iniciar-servidor.bat        # Script de inicio (Windows)
├── index ruta1.html            # Panel de usuario
├── index.html                  # Panel de administrador
├── js/
│   ├── api.js                  # Cliente API
│   ├── script.js               # Lógica panel usuario
│   ├── admin.js                # Lógica panel admin
│   ├── config.js               # Configuración
│   ├── auth.js                 # Autenticación
│   └── notification.js         # Sistema notificaciones
├── css/
│   ├── styles.css              # Estilos generales
│   └── admin.css               # Estilos panel admin
└── data/
    └── registrations.json      # Base de datos (se crea automáticamente)
```

## 🔄 Flujo de Trabajo

1. **Estudiante se inscribe** → Panel de usuario
2. **Comprobante generado** → Estado "Pendiente"
3. **Administrador verifica pago** → Panel de administrador
4. **Comprobante autorizado** → Código de autorización generado
5. **Usuario descarga comprobante** → Con código de autorización

## 🛠️ Requisitos

- Python 3.6+
- Navegador web moderno
- Conexión a internet (para librerías externas)

## 📞 Soporte

Desarrollado por Nelson Prieto
- Teléfono: 315 328 7083
- Email: yoyotzq913@gmail.com
