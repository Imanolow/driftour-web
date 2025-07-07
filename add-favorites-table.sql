-- Crear tabla de favoritos de usuario
CREATE TABLE IF NOT EXISTS user_favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tour_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tour_id)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_tour_id ON user_favorites(tour_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo puedan ver sus propios favoritos
CREATE POLICY "Users can view their own favorites" ON user_favorites
    FOR SELECT USING (auth.uid() = user_id);

-- Política para que los usuarios solo puedan insertar sus propios favoritos
CREATE POLICY "Users can insert their own favorites" ON user_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios solo puedan eliminar sus propios favoritos
CREATE POLICY "Users can delete their own favorites" ON user_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Comentarios para documentar la tabla
COMMENT ON TABLE user_favorites IS 'Tabla para almacenar los tours favoritos de cada usuario';
COMMENT ON COLUMN user_favorites.user_id IS 'ID del usuario que marcó el tour como favorito';
COMMENT ON COLUMN user_favorites.tour_id IS 'ID del tour marcado como favorito';
COMMENT ON COLUMN user_favorites.created_at IS 'Fecha y hora cuando se marcó como favorito';
