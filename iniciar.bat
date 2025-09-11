@echo off
echo 🚌 Iniciando Ruta Escolar Segura...
echo.
echo Verificando Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python no está instalado o no está en el PATH
    echo Por favor instala Python desde https://python.org
    pause
    exit /b 1
)

echo ✅ Python encontrado
echo.
echo Iniciando servidor...
echo.
echo 🌐 Servidor disponible en: http://localhost:8000
echo 👤 Panel de Usuario: http://localhost:8000/index%%20ruta1.html
echo 👨‍💼 Panel de Administrador: http://localhost:8000/index.html
echo 📋 Credenciales Admin: usuario='conductor', contraseña='password'
echo.
echo ⏹️  Presiona Ctrl+C para detener el servidor
echo.

python servidor-python.py
