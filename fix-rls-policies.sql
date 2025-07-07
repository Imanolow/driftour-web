-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Users can view their own favorites" ON user_favorites;
DROP POLICY IF EXISTS "Users can insert their own favorites" ON user_favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON user_favorites;

-- Crear políticas más robustas
CREATE POLICY "Enable read access for users to their own favorites" 
ON user_favorites FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for users to create their own favorites" 
ON user_favorites FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete access for users to remove their own favorites" 
ON user_favorites FOR DELETE 
USING (auth.uid() = user_id);

-- Verificar que las políticas están activas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_favorites';
