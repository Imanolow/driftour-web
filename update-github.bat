@echo off
echo 🚀 ACTUALIZAR DRIFTOUR EN GITHUB PAGES
echo.

cd /d "d:\Apps_low\DrifTour_web\separated"

echo ✅ 1. Añadiendo archivos actualizados...
git add .

echo ✅ 2. Creando commit...
git commit -m "📱 Actualizar app para GitHub Pages

🌐 Configuración GitHub Pages:
- Rutas actualizadas para /driftour-web/
- Service Worker configurado correctamente
- Manifest.json con scope correcto
- Solución para dominio personalizado

🔧 Mejoras:
- Archivos de configuración actualizados
- Documentación de dominio añadida
- URLs relativas para GitHub Pages"

echo ✅ 3. Subiendo a GitHub...
git push origin main

echo.
echo 🌐 ¡ACTUALIZACIÓN COMPLETADA!
echo.
echo 📱 Tu app estará disponible en:
echo https://imanolow.github.io/driftour-web/
echo.
echo ⏱️  Puede tardar unos minutos en actualizarse
echo.
pause
