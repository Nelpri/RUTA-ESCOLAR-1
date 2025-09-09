# 📁 Estructura de Archivos - Sistema Ruta Escolar

## 🎯 Archivos Principales

### **Servidor y Configuración**
- `servidor-python.py` - Servidor HTTP con API REST
- `iniciar-servidor.bat` - Script de inicio automático (Windows)
- `README.md` - Documentación principal

### **Interfaces de Usuario**
- `index ruta1.html` - **Panel de Usuario** (inscripciones)
- `index.html` - **Panel de Administrador** (gestión)

### **Estilos CSS**
- `css/styles.css` - Estilos generales
- `css/admin.css` - Estilos del panel de administrador

### **Lógica JavaScript**
- `js/api.js` - Cliente API para comunicación con servidor
- `js/script.js` - Lógica del panel de usuario
- `js/admin.js` - Lógica del panel de administrador
- `js/config.js` - Configuración de la aplicación
- `js/auth.js` - Sistema de autenticación
- `js/notification.js` - Sistema de notificaciones

### **Recursos**
- `assets/` - Imágenes (logos, iconos)
- `data/registrations.json` - Base de datos (se crea automáticamente)

## 🔄 Flujo de Datos

```
Panel Usuario → API → Servidor Python → Base de Datos
     ↓              ↓
Panel Admin ← API ← Servidor Python ← Base de Datos
```

## ✅ Estado Actual

- ✅ **Sin conflictos de merge**
- ✅ **Archivos duplicados eliminados**
- ✅ **Código de autorización implementado**
- ✅ **Sincronización entre paneles**
- ✅ **API REST funcional**
- ✅ **Documentación completa**

## 🚀 Para Iniciar

1. Ejecutar: `iniciar-servidor.bat`
2. Abrir: http://localhost:8000
3. Usar panel de usuario o administrador según necesidad
