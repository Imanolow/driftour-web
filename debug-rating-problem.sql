-- Script para verificar el mapeo de tours y solucionar problemas de rating
-- Ejecuta esto en Supabase SQL Editor después de aplicar los cambios

-- 1. Verificar que los tours existen con sus tipos
SELECT id, title, type, is_premium 
FROM tours 
ORDER BY type, title;

-- 2. Verificar estructura de la tabla tour_ratings
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'tour_ratings' 
ORDER BY ordinal_position;

-- 3. Verificar que las políticas RLS están configuradas correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'tour_ratings';

-- 4. Insertar un rating de prueba (reemplaza con tus IDs reales)
-- Primero obtén tu user_id:
SELECT id as user_id FROM auth.users LIMIT 1;

-- Luego obtén un tour_id:
SELECT id as tour_id, title, type FROM tours WHERE type = 'simple' LIMIT 1;

-- Insertar rating de prueba (reemplaza los UUIDs con los reales)
/*
INSERT INTO tour_ratings (tour_id, user_id, rating, feedback)
VALUES 
  ('TOUR_ID_AQUI', 'USER_ID_AQUI', 5, 'Tour excelente de prueba');
*/

-- 5. Verificar que el rating se insertó correctamente
SELECT 
  tr.id,
  tr.tour_id,
  tr.user_id,
  tr.rating,
  tr.feedback,
  tr.created_at,
  t.title as tour_name,
  t.type as tour_type
FROM tour_ratings tr
LEFT JOIN tours t ON tr.tour_id = t.id
ORDER BY tr.created_at DESC
LIMIT 10;

-- 6. Verificar mapeo de tipos de tour (para debug)
SELECT 
  type,
  COUNT(*) as cantidad,
  string_agg(id::text, ', ') as tour_ids
FROM tours 
GROUP BY type 
ORDER BY type;

-- 7. Limpiar ratings de prueba (opcional)
-- DELETE FROM tour_ratings WHERE feedback = 'Tour excelente de prueba';
