-- Mejoras en la tabla user_progress para el historial de tours

-- Eliminar la tabla existente para recrearla con los campos correctos
DROP TABLE IF EXISTS user_progress CASCADE;

-- Crear tabla de progreso de usuario con los campos necesarios
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
  current_location INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, tour_id)
);

-- Habilitar RLS en la tabla user_progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Crear política para que los usuarios puedan manejar su propio progreso
CREATE POLICY "Users can manage their own progress" ON user_progress
    FOR ALL USING (auth.uid() = user_id);

-- Función para crear/actualizar progreso del tour
CREATE OR REPLACE FUNCTION upsert_user_progress(
    p_user_id UUID,
    p_tour_id UUID,
    p_current_location INTEGER,
    p_total_points INTEGER,
    p_progress INTEGER,
    p_completed BOOLEAN DEFAULT FALSE
) RETURNS VOID AS $$
BEGIN
    INSERT INTO user_progress (user_id, tour_id, current_location, total_points, progress, completed, completed_at)
    VALUES (p_user_id, p_tour_id, p_current_location, p_total_points, p_progress, p_completed, 
            CASE WHEN p_completed THEN NOW() ELSE NULL END)
    ON CONFLICT (user_id, tour_id) DO UPDATE SET
        current_location = EXCLUDED.current_location,
        total_points = EXCLUDED.total_points,
        progress = EXCLUDED.progress,
        completed = EXCLUDED.completed,
        completed_at = CASE WHEN EXCLUDED.completed THEN COALESCE(user_progress.completed_at, NOW()) ELSE NULL END;
END;
$$ LANGUAGE plpgsql;
