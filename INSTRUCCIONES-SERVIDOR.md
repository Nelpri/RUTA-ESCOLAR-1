# 🚌 Servidor Local para Ruta Escolar

## 📋 Requisitos

- **Python 3.6+** instalado en tu sistema
- Navegador web moderno

## 🚀 Instalación y Uso

### 1. Iniciar el Servidor

```bash
# En la carpeta del proyecto
python servidor-python.py
```

### 2. Acceder a la Aplicación

Una vez iniciado el servidor, abre tu navegador y ve a:

- **Panel de Usuario:** http://localhost:8000/index%20ruta1.html
- **Panel de Administrador:** http://localhost:8000/index.html

### 3. Funcionamiento

- ✅ **Datos compartidos:** Los datos se guardan en `data/registrations.json`
- ✅ **Sincronización automática:** Cambios en un panel se reflejan en el otro
- ✅ **Persistencia:** Los datos se mantienen entre sesiones
- ✅ **API REST:** Endpoints para operaciones CRUD

## 🔧 Características del Servidor

### Endpoints de la API

- `POST /api/registrations` - Operaciones CRUD de registros
- `POST /api/sync` - Sincronización de datos

### Operaciones Soportadas

- **Crear:** Nuevo registro de estudiante
- **Leer:** Obtener todos los registros
- **Actualizar:** Modificar estado de pago
- **Eliminar:** Remover registro

## 📁 Estructura de Archivos

```
ruta-escolar/
├── servidor-python.py          # Servidor principal
├── js/api.js                   # Cliente API
├── data/registrations.json     # Base de datos (se crea automáticamente)
├── index ruta1.html            # Panel de usuario
├── index.html                  # Panel de administrador
└── ... (otros archivos)
```

## 🛠️ Solución de Problemas

### Error: "Puerto en uso"
```bash
# Cambiar puerto en servidor-python.py
PORT = 8001  # O cualquier puerto disponible
```

### Error: "Servidor no disponible"
- Verifica que Python esté instalado
- Asegúrate de que el puerto 8000 esté libre
- Revisa que el archivo `servidor-python.py` esté en la carpeta correcta

### Datos no se sincronizan
- Verifica que ambos paneles estén abiertos en el mismo navegador
- Asegúrate de que el servidor esté ejecutándose
- Revisa la consola del navegador para errores

## 🔄 Flujo de Trabajo

1. **Iniciar servidor:** `python servidor-python.py`
2. **Abrir panel de usuario:** Inscribir estudiantes
3. **Abrir panel de administrador:** Verificar y gestionar pagos
4. **Sincronización automática:** Los cambios se reflejan en tiempo real

## 📊 Ventajas del Servidor

- ✅ **Datos centralizados:** Un solo archivo JSON para todos los datos
- ✅ **Sincronización real:** Cambios instantáneos entre paneles
- ✅ **Persistencia:** Los datos se mantienen entre reinicios
- ✅ **Escalabilidad:** Fácil migración a base de datos real
- ✅ **API estándar:** Endpoints REST para futuras integraciones

## 🚨 Importante

- **No cierres la terminal** mientras uses la aplicación
- **Guarda los datos** antes de cerrar el servidor
- **Usa Ctrl+C** para detener el servidor correctamente
