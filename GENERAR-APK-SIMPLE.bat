@echo off
echo 📱 GENERADOR APK DRIFTOUR - SOLUCION COMPLETA
echo.
echo Este script hace TODO automaticamente para generar tu APK
echo.

echo ✅ PASO 1: Configurando entorno...
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set PATH=%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\cmdline-tools\latest\bin;%PATH%

echo ✅ PASO 2: Instalando Gradle automaticamente...
echo Descargando Gradle...
powershell -Command "if (!(Test-Path 'C:\Gradle')) { New-Item -ItemType Directory -Path 'C:\Gradle' -Force }"
powershell -Command "Invoke-WebRequest -Uri 'https://services.gradle.org/distributions/gradle-8.5-bin.zip' -OutFile 'C:\Gradle\gradle.zip'"
powershell -Command "Expand-Archive -Path 'C:\Gradle\gradle.zip' -DestinationPath 'C:\Gradle' -Force"
set GRADLE_HOME=C:\Gradle\gradle-8.5
set PATH=%GRADLE_HOME%\bin;%PATH%

echo ✅ PASO 3: Verificando instalacion...
C:\Gradle\gradle-8.5\bin\gradle.bat --version

echo ✅ PASO 4: Preparando proyecto Cordova...
cd /d "d:\Apps_low\DrifTour_web\separated\DrifTourApp"

echo ✅ PASO 5: Copiando archivos web...
copy /y "..\index.html" "www\"
copy /y "..\*.css" "www\"
copy /y "..\*.js" "www\"
copy /y "..\manifest.json" "www\"
xcopy /s /y "..\icons" "www\icons\"

echo ✅ PASO 6: Limpiando proyecto...
cordova clean android

echo ✅ PASO 7: COMPILANDO APK...
set PATH=C:\Gradle\gradle-8.5\bin;%PATH%
cordova build android --verbose

echo ✅ PASO 8: Buscando APK generado...
for /r "platforms\android" %%i in (*.apk) do (
    echo 🎉 APK ENCONTRADO: %%i
    copy "%%i" "..\driftour-app.apk"
    echo 📁 APK copiado a: d:\Apps_low\DrifTour_web\separated\driftour-app.apk
)

echo.
echo 🚀 RESULTADO:
if exist "..\driftour-app.apk" (
    echo ✅ APK GENERADO EXITOSAMENTE
    echo 📁 Ubicacion: d:\Apps_low\DrifTour_web\separated\driftour-app.apk
    echo 📱 Transfiere este archivo a tu movil e instalalo
) else (
    echo ❌ Error generando APK
    echo Verifica los logs arriba
)

echo.
pause
