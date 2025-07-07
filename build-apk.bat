@echo off
echo 🚀 COMPILAR APK DRIFTOUR
echo.
echo Ejecutando comandos finales...
echo.

cd /d "d:\Apps_low\DrifTour_web\separated"

echo ✅ 1. Sincronizando proyecto...
npx cap sync android

echo ✅ 2. Abriendo Android Studio...
npx cap open android

echo.
echo 📱 SIGUIENTE PASO:
echo En Android Studio: Build ^> Generate Signed Bundle / APK
echo.
pause
