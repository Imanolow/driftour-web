# DrifTour - Descubre Bilbao

Una aplicación web moderna para descubrir tours y experiencias en Bilbao con integración completa de Supabase.

## 🚀 Características

- **Tours Interactivos**: Explora Bilbao con tours guiados y experiencias únicas
- **Mapas Integrados**: Utiliza OpenStreetMap para navegación y localización
- **Autenticación Segura**: Sistema de login y registro con Supabase
- **Perfil de Usuario**: Estadísticas personales y progreso de tours
- **Historial de Tours**: Seguimiento de tours completados y en progreso
- **Sistema de Favoritos**: Guarda tus tours favoritos para acceso rápido
- **Valoraciones**: Califica tours y deja feedback
- **Modo Premium**: Acceso a tours exclusivos y características avanzadas
- **Diseño Responsivo**: Compatible con dispositivos móviles y escritorio
- **Modo Nocturno**: Interfaz adaptable para diferentes condiciones de luz
- **PWA**: Instalable como aplicación nativa

## 📁 Estructura del Proyecto

```
separated/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript principal
├── supabase.js         # Integración con Supabase
├── stripe.js           # Integración con Stripe (futuro)
├── config.js           # Configuración (no incluido en git)
├── config.example.js   # Ejemplo de configuración
├── manifest.json       # PWA manifest
├── service-worker.js   # Service Worker para PWA
├── server.py           # Servidor local de desarrollo
├── *.sql               # Scripts de base de datos
└── README.md           # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Mapas**: OpenStreetMap
- **PWA**: Service Worker, Manifest
- **Futuro**: Stripe (Pagos)

## 🚀 Cómo Ejecutar

1. Clona el repositorio
2. Configura Supabase siguiendo `SETUP.md`
3. Copia `config.example.js` a `config.js` y configura tus claves
4. Ejecuta `python server.py` para iniciar el servidor local
5. Abre `http://localhost:3000` en tu navegador

## 📋 Características Implementadas

- ✅ **Autenticación**: Login/registro con Supabase
- ✅ **Tours Dinámicos**: Carga de tours desde base de datos
- ✅ **Perfil de Usuario**: Estadísticas y datos personales
- ✅ **Historial**: Seguimiento de tours completados
- ✅ **Favoritos**: Sistema de tours favoritos
- ✅ **Valoraciones**: Calificación y feedback de tours
- ✅ **PWA**: Instalación como app nativa
- ✅ **Modo Nocturno**: Tema oscuro/claro
- ✅ **Diseño Responsivo**: Móvil y escritorio

## � Próximas Mejoras

- [ ] Optimización de rendimiento
- [ ] Tests automatizados
- [ ] Sistema de notificaciones push
- [ ] Tours con realidad aumentada
- [ ] Integración con Stripe para pagos
- [ ] API REST completa
- [ ] Aplicación móvil con Expo
- [ ] Migración a Next.js

## 🤝 Contribuir

Este proyecto está en desarrollo activo. Las contribuciones son bienvenidas.

## 📖 Documentación

- `SETUP.md` - Guía de configuración
- `API_SETUP.md` - Configuración de APIs
- `MIGRATION_GUIDE.md` - Guía de migración

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
