# 🔑 Configuración de Claves de API

## Supabase Setup

### 1. Obtener las claves
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia:
   - **Project URL**: `https://tu-proyecto-id.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2. Configurar localmente
1. Copia `config.example.js` a `config.js`
2. Rellena con tus claves reales:
   ```javascript
   export const SUPABASE_URL = 'https://tu-proyecto-id.supabase.co'
   export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tu-clave-real'
   ```

### 3. Configurar base de datos
En Supabase SQL Editor, ejecuta:

```sql
-- Crear tabla de perfiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  user_type TEXT DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Crear tabla de tours
CREATE TABLE tours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  duration INTEGER, -- en minutos
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de ratings
CREATE TABLE tour_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID REFERENCES tours(id),
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de progreso de usuario
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  tour_id UUID REFERENCES tours(id),
  completed BOOLEAN DEFAULT false,
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can read their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can read tours" ON tours FOR SELECT USING (true);
CREATE POLICY "Users can create ratings" ON tour_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read their own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
```

## Stripe Setup (próximamente)

Cuando esté listo para pagos:
1. Ve a [Stripe Dashboard](https://dashboard.stripe.com)
2. Copia las claves de prueba
3. Añade a `config.js`:
   ```javascript
   export const STRIPE_PUBLISHABLE_KEY = 'pk_test_tu-clave-aqui'
   ```

## ⚠️ Seguridad

- **NUNCA** subas `config.js` a GitHub
- Las claves están en `.gitignore` para protegerlas
- Usa claves de prueba durante desarrollo
- Cambia a claves de producción antes del lanzamiento
