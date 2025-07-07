@echo off
echo 🚀 COMPILAR APK DRIFTOUR - SCRIPT OPTIMIZADO
echo.

cd /d "d:\Apps_low\DrifTour_web\separated\DrifTourApp"

echo ✅ 1. Verificando requisitos del sistema...

REM Verificar Java
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Java no está instalado
    echo Instala Java desde: https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)

REM Verificar Gradle
gradle --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Gradle no está instalado
    echo.
    echo 📋 SOLUCIÓN RÁPIDA:
    echo 1. Abre PowerShell como ADMINISTRADOR
    echo 2. Ejecuta: choco install gradle -y
    echo 3. Cierra PowerShell y vuelve a abrirlo
    echo 4. Ejecuta este script de nuevo
    echo.
    echo 📋 ALTERNATIVA:
    echo Ejecuta: install-gradle-admin.bat (como administrador)
    echo.
    pause
    exit /b 1
)

REM Configurar Android
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set PATH=%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\cmdline-tools\latest\bin;%PATH%

echo ✅ 2. Verificando estructura del proyecto...
if not exist "platforms\android" (
    echo ❌ Error: Plataforma Android no encontrada
    echo Ejecutando: cordova platform add android
    cordova platform add android
    if errorlevel 1 (
        echo ❌ Error al añadir plataforma Android
        pause
        exit /b 1
    )
)

echo ✅ 3. Copiando archivos actualizados...
copy /y "..\index.html" "www\"
copy /y "..\*.css" "www\"
copy /y "..\*.js" "www\"
copy /y "..\manifest.json" "www\"
xcopy /s /y "..\icons" "www\icons\"

echo ✅ 4. Compilando APK...
cordova build android

echo ✅ 5. Verificando APK generado...
if exist "platforms\android\app\build\outputs\apk\debug\app-debug.apk" (
    echo 🎉 ¡APK COMPILADO EXITOSAMENTE!
    echo 📁 Ubicación: platforms\android\app\build\outputs\apk\debug\app-debug.apk
) else (
    echo ❌ Error: APK no encontrado
    echo Verificando carpetas alternativas...
    dir /s "platforms\android\app\build\outputs\apk\*.apk"
)

echo.
echo 📱 SIGUIENTE PASO:
echo 1. Instalar en dispositivo: adb install platforms\android\app\build\outputs\apk\debug\app-debug.apk
echo 2. O transferir APK a dispositivo manualmente
echo.
pause
