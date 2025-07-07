@echo off
echo 🔧 CONFIGURADOR DE ANDROID PARA CORDOVA
echo.

echo ✅ 1. Configurando variables de entorno...
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set PATH=%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\cmdline-tools\latest\bin;%PATH%

echo ✅ 2. Verificando Android SDK...
if not exist "%ANDROID_HOME%\platforms\android-35" (
    echo ❌ Android 35 no encontrado
    echo Instalando Android 35...
    sdkmanager "platforms;android-35"
)

echo ✅ 3. Verificando build-tools...
if not exist "%ANDROID_HOME%\build-tools" (
    echo Instalando build-tools...
    sdkmanager "build-tools;35.0.0"
)

echo ✅ 4. Verificando Gradle...
gradle --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Gradle no encontrado
    echo Instalando Gradle...
    winget install gradle.gradle
    if errorlevel 1 (
        echo ❌ Error instalando Gradle
        echo Prueba instalar manualmente desde: https://gradle.org/install/
        pause
        exit /b 1
    )
)

echo ✅ 5. Limpiando proyecto Cordova...
cd /d "d:\Apps_low\DrifTour_web\separated\DrifTourApp"
cordova clean android

echo ✅ 6. Verificando requisitos finales...
cordova requirements android

echo.
echo 🎉 ¡CONFIGURACIÓN COMPLETADA!
echo.
pause
