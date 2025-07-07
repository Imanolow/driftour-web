@echo off
echo 🚀 INSTALADOR DE GRADLE CON CHOCOLATEY
echo.
echo Este script debe ejecutarse como ADMINISTRADOR
echo.

echo ✅ Verificando permisos de administrador...
net session >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Este script debe ejecutarse como administrador
    echo.
    echo 📋 INSTRUCCIONES:
    echo 1. Abre PowerShell como administrador
    echo 2. Ejecuta: choco install gradle -y
    echo 3. Cierra y vuelve a abrir PowerShell normal
    echo 4. Ejecuta: gradle --version
    echo.
    pause
    exit /b 1
)

echo ✅ Instalando Gradle con Chocolatey...
choco install gradle -y

echo ✅ Instalando herramientas adicionales...
choco install androidstudio -y

echo.
echo 🎉 ¡INSTALACIÓN COMPLETADA!
echo.
echo 📋 SIGUIENTE PASO:
echo 1. Cierra todas las ventanas de PowerShell/CMD
echo 2. Abre PowerShell nuevo
echo 3. Ejecuta: gradle --version
echo 4. Ejecuta: build-driftour-cordova.bat
echo.
pause
