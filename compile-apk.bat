@echo off
echo 🚀 DRIFTOUR - COMPILAR APK AUTOMÁTICO
echo.
echo ===================================
echo Compilando APK de DrifTour...
echo ===================================
echo.

cd /d "d:\Apps_low\DrifTour_web\separated"

echo ✅ 1. Sincronizando archivos web...
npx cap copy android
npx cap sync android

echo.
echo ✅ 2. Compilando APK...
cd android
.\gradlew assembleDebug

echo.
echo 🎉 ¡APK COMPILADA!
echo.
echo 📁 Ubicación:
echo android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 📱 Instala en tu móvil:
echo adb install android\app\build\outputs\apk\debug\app-debug.apk
echo.
pause
