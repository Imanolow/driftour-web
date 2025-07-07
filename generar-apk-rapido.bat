@echo off
echo 🚀 GENERAR APK DRIFTOUR - MÉTODO RÁPIDO
echo.
echo Solo necesitas una APK para probar, ¡vamos a hacerlo!
echo.

echo ✅ Paso 1: Instalando Gradle...
powershell -Command "Start-Process powershell -Verb runAs -ArgumentList '-Command choco install gradle -y; Write-Host APK generando...; timeout 5'"

echo.
echo ⏱️  Esperando 30 segundos para que Gradle se instale...
timeout /t 30 /nobreak

echo.
echo ✅ Paso 2: Configurando entorno...
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\cmdline-tools\latest\bin
refreshenv

echo ✅ Paso 3: Compilando APK...
cd /d "d:\Apps_low\DrifTour_web\separated\DrifTourApp"

echo Copiando archivos actualizados...
copy /y "..\index.html" "www\" >nul
copy /y "..\*.css" "www\" >nul
copy /y "..\*.js" "www\" >nul
copy /y "..\manifest.json" "www\" >nul

echo Iniciando compilación...
cordova build android --verbose

echo.
echo 🔍 Buscando APK generado...
for /r "platforms\android" %%i in (*.apk) do (
    echo 🎉 ¡APK ENCONTRADO!
    echo 📁 Ubicación: %%i
    echo.
    echo 📱 INSTRUCCIONES:
    echo 1. Copia este archivo a tu móvil
    echo 2. Habilita "Orígenes desconocidos" en Android
    echo 3. Instala el APK
    echo.
    goto :found
)

echo ❌ APK no encontrado. Revisando errores...
echo.
echo 📋 SOLUCIÓN MANUAL:
echo 1. Abre PowerShell como administrador
echo 2. Ejecuta: choco install gradle -y
echo 3. Reinicia PowerShell
echo 4. Ejecuta este script de nuevo
echo.

:found
pause
