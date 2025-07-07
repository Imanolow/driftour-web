@echo off
echo 🚀 SOLUCION GRADLE - USANDO ANDROID STUDIO
echo.

echo 🔍 Verificando si Android Studio está instalado...
if exist "C:\Program Files\Android\Android Studio" (
    echo ✅ Android Studio encontrado
    set ANDROID_STUDIO_PATH=C:\Program Files\Android\Android Studio
) else if exist "C:\Users\%USERNAME%\AppData\Local\Android\Sdk" (
    echo ✅ Android SDK encontrado
    set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
) else (
    echo ❌ Android Studio no encontrado
    echo.
    echo 📋 OPCIONES:
    echo 1. Instalar Android Studio: https://developer.android.com/studio
    echo 2. O ejecutar: install-gradle.bat (como administrador)
    echo.
    pause
    exit /b 1
)

echo ✅ Configurando variables de entorno...
if defined ANDROID_HOME (
    setx ANDROID_HOME "%ANDROID_HOME%"
    setx PATH "%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools"
)

echo ✅ Usando Gradle Wrapper incluido en el proyecto...
cd /d "d:\Apps_low\DrifTour_web\separated\DrifTourApp"

echo ✅ Compilando con Gradle Wrapper...
if exist "platforms\android\gradlew.bat" (
    echo Usando gradlew.bat del proyecto...
    platforms\android\gradlew.bat assembleDebug -p platforms\android
) else (
    echo ❌ Gradle Wrapper no encontrado
    echo Intentando compilación directa...
    cordova build android --verbose
)

echo.
pause
