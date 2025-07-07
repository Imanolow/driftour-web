@echo off
echo 🚀 SETUP CORDOVA - ALTERNATIVA SIMPLE
echo.

echo ✅ 1. Instalando Cordova...
npm install -g cordova

echo ✅ 2. Creando proyecto Cordova...
cordova create DrifTourApp com.driftour.app DrifTour

echo ✅ 3. Copiando archivos web...
xcopy /s /y *.html DrifTourApp\www\
xcopy /s /y *.css DrifTourApp\www\
xcopy /s /y *.js DrifTourApp\www\
xcopy /s /y *.json DrifTourApp\www\

echo ✅ 4. Configurando Android...
cd DrifTourApp
cordova platform add android

echo ✅ 5. Compilando APK...
cordova build android

echo.
echo 🎉 ¡APK LISTA!
echo 📁 Ubicación: DrifTourApp\platforms\android\app\build\outputs\apk\debug\app-debug.apk
echo.
pause
