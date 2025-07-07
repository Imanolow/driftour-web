# Configuración de Supabase para DrifTour

## 🚀 Configuración Inicial

### 1. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto llamado "driftour"
3. Copia la URL del proyecto y la clave anónima

### 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

### 3. Ejecutar el schema de base de datos
1. Ve a SQL Editor en tu dashboard de Supabase
2. Ejecuta el contenido del archivo `supabase-schema.sql`

### 4. Configurar autenticación
1. Ve a Authentication > Settings
2. Configura el Site URL: `https://imanolow.github.io/driftour-web/`
3. Añade redirect URLs si es necesario

## 📊 Estructura de la Base de Datos

### Tablas principales:
- `profiles`: Perfiles de usuarios
- `tours`: Tours disponibles
- `tour_ratings`: Valoraciones de tours
- `user_progress`: Progreso del usuario
- `subscriptions`: Suscripciones premium

## 🔧 Comandos útiles

```bash
# Instalar Supabase CLI
npm install -g @supabase/cli

# Inicializar proyecto local
supabase init

# Iniciar base de datos local
supabase start

# Hacer reset de la base de datos
supabase db reset

# Generar tipos TypeScript
supabase gen types typescript --local > types/supabase.ts
```

## 🔐 Configuración de Stripe

### 1. Crear cuenta en Stripe
1. Ve a [stripe.com](https://stripe.com)
2. Crea una cuenta de desarrollo
3. Obtén las claves API

### 2. Crear productos y precios
1. Ve a Products en tu dashboard
2. Crea un producto "DrifTour Premium"
3. Configura precio mensual de 4.99€
4. Copia el Price ID

### 3. Configurar webhooks
1. Ve a Webhooks en tu dashboard
2. Añade endpoint: `https://tu-dominio.com/api/webhooks/stripe`
3. Selecciona eventos: `invoice.payment_succeeded`, `customer.subscription.deleted`

## 🗺️ Configuración de Mapas

### OpenStreetMap con Leaflet
- Ya integrado en el proyecto
- No requiere API key
- Gratuito y open source

### Configuración adicional:
1. Personalizar tiles si es necesario
2. Configurar marcadores personalizados
3. Añadir capas adicionales (transporte, etc.)

## 📱 PWA Setup

### 1. Generar iconos
Usa [PWA Asset Generator](https://www.pwabuilder.com/generate) para crear iconos:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

### 2. Registrar Service Worker
El service worker se registra automáticamente en `script.js`

### 3. Configurar manifest
El `manifest.json` ya está configurado con:
- Nombre de la app
- Iconos
- Configuración de pantalla
- Shortcuts

## 🚀 Despliegue

### GitHub Pages
1. Push a GitHub
2. Configurar GitHub Pages
3. La app estará disponible en: `https://imanolow.github.io/driftour-web/`

### Vercel (Alternativa)
1. Conectar repo con Vercel
2. Configurar variables de entorno
3. Despliegue automático

## 🧪 Testing

### Probar funcionalidades:
1. Registro/Login de usuarios
2. Selección de tours
3. Proceso de pago
4. Funcionalidades offline
5. Instalación como PWA

## 📝 Notas importantes

- Las claves de Supabase y Stripe deben configurarse antes del despliegue
- Los pagos están en modo test hasta configurar cuentas de producción
- El service worker cachea recursos para uso offline
- Los iconos PWA deben generarse para todas las resoluciones
