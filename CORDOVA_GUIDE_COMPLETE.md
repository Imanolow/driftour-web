# 📱 DRIFTOUR - GUÍA COMPLETA CORDOVA

## 🎯 ESTADO ACTUAL
✅ **Cordova instalado**: Versión 12.0.0  
✅ **Proyecto creado**: DrifTourApp  
✅ **Plataforma Android**: Añadida  
✅ **Archivos web**: Copiados  
🔄 **Compilación**: En progreso  

## 📂 ESTRUCTURA DEL PROYECTO
```
DrifTour_web/separated/
├── DrifTourApp/                 # Proyecto Cordova
│   ├── www/                     # Archivos web
│   │   ├── index.html
│   │   ├── styles.css
│   │   ├── script.js
│   │   ├── supabase.js
│   │   └── icons/
│   ├── platforms/android/       # Proyecto Android
│   └── config.xml              # Configuración
├── build-driftour-cordova.bat   # Script de compilación optimizado
└── [archivos originales]
```

## 🚀 COMANDOS PARA COMPILAR

### **Método 1: Script Automático**
```batch
# Ejecutar el script optimizado
.\build-driftour-cordova.bat
```

### **Método 2: Comandos Manuales**
```batch
# 1. Ir al proyecto Cordova
cd DrifTourApp

# 2. Actualizar archivos web
cordova prepare android

# 3. Compilar APK
cordova build android

# 4. Localizar APK
dir /s platforms\android\app\build\outputs\apk\*.apk
```

## 📍 UBICACIÓN DEL APK
Una vez compilado, el APK estará en:
```
DrifTourApp\platforms\android\app\build\outputs\apk\debug\app-debug.apk
```

## 🔧 SOLUCIÓN DE PROBLEMAS COMUNES

### **Error: Android SDK no encontrado**
```batch
# Instalar Android Studio
# Configurar variables de entorno:
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
```

### **Error: Java not found**
```batch
# Verificar Java
java -version
# Si no está instalado, descargar Java 8 JDK
```

### **Error: Gradle**
```batch
# Limpiar proyecto
cd DrifTourApp
cordova clean android
cordova build android
```

## 📱 INSTALAR EN DISPOSITIVO

### **Método 1: ADB (Android Debug Bridge)**
```batch
# Habilitar "Depuración USB" en el dispositivo
adb devices
adb install platforms\android\app\build\outputs\apk\debug\app-debug.apk
```

### **Método 2: Transferencia manual**
1. Copiar el archivo APK al dispositivo
2. Habilitar "Orígenes desconocidos" en configuración
3. Abrir el APK en el dispositivo
4. Seguir las instrucciones de instalación

## 🌟 FUNCIONALIDADES DE LA APP

### **Características principales:**
- 🗺️ Tours interactivos por Bilbao
- 📱 Interfaz optimizada para móvil
- 🎧 Controles de audio
- ⭐ Sistema de valoraciones
- 👤 Perfiles de usuario
- 🌙 Modo nocturno

### **Configuración actual:**
- **ID**: com.driftour.app
- **Nombre**: DrifTour
- **Versión**: 1.0.0
- **Min SDK**: Android 5.1 (API 22)
- **Target SDK**: Android 13 (API 33)

## 🔄 ACTUALIZAR LA APP

Para actualizar después de cambios en el código:

```batch
# 1. Ejecutar script de actualización
.\build-driftour-cordova.bat

# 2. O manualmente:
cd DrifTourApp
# Copiar archivos actualizados
copy /y ..\index.html www\
copy /y ..\*.css www\
copy /y ..\*.js www\
# Recompilar
cordova build android
```

## 📋 CHECKLIST FINAL

- [x] Cordova instalado y configurado
- [x] Proyecto DrifTourApp creado
- [x] Plataforma Android añadida
- [x] Archivos web copiados
- [x] Config.xml configurado
- [x] Script de compilación creado
- [ ] APK compilado exitosamente
- [ ] APK probado en dispositivo
- [ ] App funcionando correctamente

## 🆘 CONTACTO Y SOPORTE

Si hay problemas en la compilación:
1. Verificar que Java esté instalado
2. Verificar que Android SDK esté configurado
3. Ejecutar `cordova requirements android`
4. Revisar logs de error en detalle

---
*Guía actualizada: 07/07/2025*
