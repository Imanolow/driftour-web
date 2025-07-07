# 📱 GUÍA: CONVERTIR DRIFTOUR A APP MÓVIL

## 🚀 OPCIÓN RÁPIDA: CAPACITOR

### **Paso 1: Preparar el proyecto**
```bash
cd d:\Apps_low\DrifTour_web\separated

# Instalar Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# Inicializar Capacitor
npx cap init DrifTour com.driftour.app
```

### **Paso 2: Configurar para móvil**
```bash
# Añadir plataforma Android
npx cap add android

# Copiar archivos web
npx cap copy android

# Sincronizar
npx cap sync android
```

### **Paso 3: Compilar APK**
```bash
# Abrir en Android Studio
npx cap open android

# O compilar directo
npx cap build android
```

## 📁 **ESTRUCTURA RESULTANTE**
```
DrifTour/
├── www/                 # Tu código web actual
│   ├── index.html
│   ├── script.js
│   ├── supabase.js
│   └── styles.css
├── android/             # Proyecto Android nativo
├── ios/                 # Proyecto iOS nativo
└── capacitor.config.ts  # Configuración
```

## 🔧 **CONFIGURACIÓN CAPACITOR**

### **capacitor.config.ts**
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.driftour.app',
  appName: 'DrifTour',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Geolocation: {
      permissions: ["ACCESS_FINE_LOCATION"]
    }
  }
};

export default config;
```

## 📱 **FUNCIONALIDADES MÓVILES EXTRA**

### **GPS Nativo**
```javascript
import { Geolocation } from '@capacitor/geolocation';

const getCurrentPosition = async () => {
  const coordinates = await Geolocation.getCurrentPosition();
  return coordinates;
};
```

### **Notificaciones Push**
```javascript
import { PushNotifications } from '@capacitor/push-notifications';

// Registrar para notificaciones
PushNotifications.requestPermissions();
```

## 🎯 **RESULTADO**
- ✅ APK para Android
- ✅ App para iOS
- ✅ Mismo código web
- ✅ APIs nativas disponibles
- ✅ Instalable desde stores

## ⚡ **COMANDOS RÁPIDOS**
```bash
# Setup completo
npm i @capacitor/core @capacitor/cli @capacitor/android
npx cap init DrifTour com.driftour.app
npx cap add android
npx cap copy && npx cap sync
npx cap open android
```

## 📋 **REQUISITOS**
- Node.js instalado
- Android Studio (para APK)
- Xcode (para iOS, solo en Mac)
