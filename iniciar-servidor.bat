@echo off
echo 🚌 Iniciando servidor para Ruta Escolar...
echo.
echo Verificando Python...
python --version
if %errorlevel% neq 0 (
    echo ❌ Python no está instalado o no está en el PATH
    echo Por favor instala Python 3.6+ desde https://python.org
    pause
    exit /b 1
)

echo.
echo ✅ Python encontrado
echo 🌐 Iniciando servidor en http://localhost:8000
echo.
echo 📱 Panel de Usuario: http://localhost:8000/index%%20ruta1.html
echo 👨‍💼 Panel de Administrador: http://localhost:8000/index.html
echo.
echo ⏹️  Presiona Ctrl+C para detener el servidor
echo ================================================
echo.

python servidor-python.py

echo.
echo 🛑 Servidor detenido
pause
