@echo off
echo.
echo 🚀 Iniciando servidor local de DrifTour...
echo.
echo 📁 Directorio: %CD%
echo 🌐 URL: http://localhost:3000
echo.
echo ⚡ Opciones disponibles:
echo    1. Python:     python -m http.server 3000
echo    2. Node.js:    npx serve . -p 3000
echo    3. PHP:        php -S localhost:8000
echo.
echo 🔄 Intentando iniciar con Python...
echo.

python -m http.server 3000

if %errorlevel% neq 0 (
    echo.
    echo ❌ Python no encontrado. Intentando con Node.js...
    echo.
    npx serve . -p 3000
    
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Node.js no encontrado. 
        echo.
        echo 💡 Soluciones:
        echo    1. Instalar Python: https://python.org
        echo    2. Instalar Node.js: https://nodejs.org
        echo    3. Usar Live Server extension en VS Code
        echo.
        pause
    )
)
