@echo off
echo 🔧 INSTALADOR DE GRADLE PARA DRIFTOUR
echo.
echo Este script descarga e instala Gradle manualmente
echo.

echo ✅ 1. Creando directorio para Gradle...
mkdir C:\Gradle 2>nul

echo ✅ 2. Descargando Gradle...
echo Descargando desde: https://services.gradle.org/distributions/gradle-8.5-bin.zip
powershell -Command "Invoke-WebRequest -Uri 'https://services.gradle.org/distributions/gradle-8.5-bin.zip' -OutFile 'C:\Gradle\gradle-8.5-bin.zip'"

echo ✅ 3. Extrayendo Gradle...
powershell -Command "Expand-Archive -Path 'C:\Gradle\gradle-8.5-bin.zip' -DestinationPath 'C:\Gradle' -Force"

echo ✅ 4. Configurando variables de entorno...
setx GRADLE_HOME "C:\Gradle\gradle-8.5" /M
setx PATH "%PATH%;C:\Gradle\gradle-8.5\bin" /M

echo ✅ 5. Limpiando archivos temporales...
del C:\Gradle\gradle-8.5-bin.zip

echo.
echo 🎉 ¡GRADLE INSTALADO!
echo.
echo 📋 SIGUIENTE PASO:
echo 1. Cierra y vuelve a abrir PowerShell/CMD
echo 2. Ejecuta: gradle --version
echo 3. Luego ejecuta: build-driftour-cordova.bat
echo.
pause
