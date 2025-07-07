@echo off
echo 🚀 DRIFTOUR - SOLUCIÓN RÁPIDA PARA MÓVIL
echo.
echo 📱 MÉTODO 1: PWA (Progressive Web App)
echo Esta es la forma MÁS RÁPIDA de probar en móvil
echo.

echo ✅ Iniciando servidor local...
cd /d "d:\Apps_low\DrifTour_web\separated"

REM Verificar si live-server está instalado
npm list live-server >nul 2>&1
if errorlevel 1 (
    echo Instalando live-server...
    npm install -g live-server
)

echo ✅ Obteniendo IP local...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do set "LOCAL_IP=%%a"
set LOCAL_IP=%LOCAL_IP: =%

echo.
echo 🌐 SERVIDOR INICIADO
echo.
echo 📱 PASOS PARA INSTALAR EN MÓVIL:
echo 1. Conecta tu móvil a la misma WiFi que este PC
echo 2. Abre el navegador en tu móvil
echo 3. Ve a: http://%LOCAL_IP%:3000
echo 4. En Chrome/Safari: Menú → "Añadir a pantalla de inicio"
echo 5. ¡Ya tienes la app instalada como PWA!
echo.
echo 💡 VENTAJAS PWA:
echo - Se instala como app nativa
echo - Funciona offline (con service worker)
echo - Recibe notificaciones
echo - Se actualiza automáticamente
echo.
echo ⚠️  MANTÉN ESTA VENTANA ABIERTA mientras uses la app
echo.

REM Iniciar servidor
live-server --port=3000 --host=0.0.0.0 --open=false --no-browser

pause
