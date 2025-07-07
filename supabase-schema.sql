-- Crear tabla de perfiles de usuarios
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  user_type TEXT DEFAULT 'free' CHECK (user_type IN ('free', 'premium')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Crear tabla de tours
CREATE TABLE IF NOT EXISTS tours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('simple', 'adventure', 'historic', 'themed', 'theatrical')),
  price DECIMAL(10,2) DEFAULT 0.00,
  duration INTEGER, -- en minutos
  difficulty TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  locations JSONB, -- array de ubicaciones
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de ratings de tours
CREATE TABLE IF NOT EXISTS tour_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tour_id, user_id)
);

-- Crear tabla de progreso de usuario
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
  current_location INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, tour_id)
);

-- Crear tabla de suscripciones premium
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar tours de ejemplo
INSERT INTO tours (title, description, type, price, duration, difficulty, locations, is_premium) VALUES
('Tour Simple', 'Descubre los 5 lugares más emblemáticos de Bilbao con explicaciones detalladas.', 'simple', 0.00, 30, 'easy', '[
  {"name": "Casco Viejo - Siete Calles", "lat": 43.2567, "lng": -2.9234, "description": "El corazón histórico de la ciudad"},
  {"name": "Catedral de Santiago", "lat": 43.2564, "lng": -2.9254, "description": "La catedral principal de Bilbao"},
  {"name": "Plaza Nueva", "lat": 43.2563, "lng": -2.9241, "description": "La plaza principal del Casco Viejo"},
  {"name": "Mercado de la Ribera", "lat": 43.2558, "lng": -2.9248, "description": "El mercado más grande de Europa"},
  {"name": "Puente de San Antón", "lat": 43.2562, "lng": -2.9251, "description": "El puente histórico de Bilbao"}
]', FALSE),

('Tour Aventura', 'Resuelve pistas y descubre lugares secretos en una experiencia gamificada única.', 'adventure', 0.00, 60, 'medium', '[
  {"name": "Casco Viejo - Siete Calles", "lat": 43.2567, "lng": -2.9234, "description": "Encuentra la primera pista en la calle más antigua"},
  {"name": "Plaza de Unamuno", "lat": 43.2565, "lng": -2.9240, "description": "Descifra el mensaje oculto en la estatua"},
  {"name": "Iglesia de San Nicolás", "lat": 43.2569, "lng": -2.9243, "description": "Busca el símbolo secreto en la fachada"},
  {"name": "Arenal", "lat": 43.2570, "lng": -2.9250, "description": "Resuelve el acertijo del jardín"},
  {"name": "Teatro Arriaga", "lat": 43.2571, "lng": -2.9252, "description": "Encuentra la entrada secreta"}
]', FALSE),

('Tour Histórico', 'Camina junto a Miguel de Unamuno y descubre la historia profunda de cada rincón.', 'historic', 0.00, 90, 'easy', '[
  {"name": "Universidad de Deusto", "lat": 43.2701, "lng": -2.9501, "description": "Donde estudió Unamuno"},
  {"name": "Casco Viejo", "lat": 43.2567, "lng": -2.9234, "description": "El Bilbao medieval"},
  {"name": "Gran Vía", "lat": 43.2630, "lng": -2.9350, "description": "La modernización de la ciudad"},
  {"name": "Palacio de la Diputación", "lat": 43.2633, "lng": -2.9348, "description": "El poder político"},
  {"name": "Puente de La Salve", "lat": 43.2688, "lng": -2.9394, "description": "La conexión con el futuro"}
]', FALSE),

('Tour Medieval', 'Revive la fundación de Bilbao con actores caracterizados como comerciantes medievales del siglo XIV', 'theatrical', 20.00, 120, 'medium', '[
  {"name": "Casco Viejo - Siete Calles", "lat": 43.2567, "lng": -2.9234, "description": "El nacimiento de la villa"},
  {"name": "Iglesia de Santiago", "lat": 43.2564, "lng": -2.9254, "description": "El primer templo"},
  {"name": "Plaza Nueva", "lat": 43.2563, "lng": -2.9241, "description": "El mercado medieval"},
  {"name": "Puente de San Antón", "lat": 43.2562, "lng": -2.9251, "description": "La conexión comercial"}
]', TRUE),

('Tour Txikitero', 'La historia de los bares y pintxos más emblemáticos de Bilbao. ¡Delicioso!', 'themed', 25.00, 180, 'easy', '[
  {"name": "Calle Ledesma", "lat": 43.2565, "lng": -2.9238, "description": "La calle de los pintxos"},
  {"name": "Plaza Nueva", "lat": 43.2563, "lng": -2.9241, "description": "Terrazas tradicionales"},
  {"name": "Calle Jardines", "lat": 43.2566, "lng": -2.9245, "description": "Bares centenarios"},
  {"name": "Mercado de la Ribera", "lat": 43.2558, "lng": -2.9248, "description": "Productos frescos"}
]', TRUE);

-- Habilitar Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Tours are viewable by everyone" ON tours
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own ratings" ON tour_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own ratings" ON tour_ratings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);
