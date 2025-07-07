# Guía de Migración de DrifTour

Esta guía documenta el proceso de migración de DrifTour desde un archivo HTML monolítico hacia una arquitectura web moderna.

## 📋 Estado Actual

### ✅ Completado
- [x] Separación de HTML, CSS y JavaScript en archivos independientes
- [x] Estructura de proyecto profesional con README y package.json
- [x] Configuración de Git y .gitignore
- [x] Documentación básica del proyecto

### 🔄 En Progreso
- [ ] Subida a GitHub
- [ ] Configuración de GitHub Pages
- [ ] Integración con Supabase
- [ ] Integración con Stripe

### 📅 Próximos Pasos
- [ ] Migración a framework moderno (React/Next.js)
- [ ] Aplicación móvil con Expo
- [ ] Testing automatizado
- [ ] CI/CD pipeline

## 🛠️ Tecnologías por Integrar

### Supabase (Base de datos y autenticación)
```bash
# Instalar Supabase CLI
npm install -g @supabase/cli

# Inicializar proyecto
supabase init

# Configurar base de datos
supabase db start
```

### Stripe (Pagos)
```bash
# Instalar Stripe
npm install stripe

# Configurar webhook endpoints
# Manejar pagos de suscripciones premium
```

### OpenStreetMap (Mapas)
```javascript
// Usar Leaflet.js para mapas
// Reemplazar Google Maps APIs
```

## 📁 Estructura Final Propuesta

```
driftour-web/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── backend/
│   ├── api/
│   ├── services/
│   └── package.json
├── mobile/
│   ├── src/
│   ├── assets/
│   └── package.json
├── docs/
└── README.md
```

## 🔧 Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Construir para producción
npm run build

# Desplegar a GitHub Pages
npm run deploy

# Instalar dependencias
npm install

# Ejecutar tests
npm test
```

## 🚀 Despliegue

### GitHub Pages
1. Habilitar GitHub Pages en configuración del repositorio
2. Seleccionar rama `main` como fuente
3. La web estará disponible en `https://tu-usuario.github.io/driftour-web/`

### Vercel (Alternativa)
1. Conectar repositorio de GitHub con Vercel
2. Configurar build settings
3. Despliegue automático en cada push

## 📚 Recursos

- [Documentación Supabase](https://supabase.com/docs)
- [Documentación Stripe](https://stripe.com/docs)
- [Leaflet.js para mapas](https://leafletjs.com/)
- [GitHub Pages](https://pages.github.com/)
- [Vercel](https://vercel.com/)

## ❓ Troubleshooting

### Problemas comunes y soluciones
- **Git no reconocido**: Instalar Git desde [git-scm.com](https://git-scm.com/)
- **Node.js no encontrado**: Instalar desde [nodejs.org](https://nodejs.org/)
- **Errores de permisos**: Ejecutar terminal como administrador
- **Problemas de CORS**: Configurar servidor local con live-server
