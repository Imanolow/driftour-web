-- Actualizar tabla tours para agregar columnas faltantes
-- Ejecuta esto en Supabase SQL Editor

-- Agregar columnas que faltan
ALTER TABLE tours ADD COLUMN IF NOT EXISTS locations JSONB;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'easy';

-- Actualizar la columna type para incluir todos los tipos
ALTER TABLE tours DROP CONSTRAINT IF EXISTS tours_type_check;
ALTER TABLE tours ADD CONSTRAINT tours_type_check 
  CHECK (type IN ('simple', 'adventure', 'historic', 'themed', 'theatrical'));

-- Verificar que las columnas se crearon correctamente
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'tours' 
ORDER BY ordinal_position;
