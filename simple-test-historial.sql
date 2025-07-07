-- Script simple para verificar el historial de tours
-- Ejecuta paso a paso en Supabase SQL Editor

-- PASO 1: Verificar que la tabla user_progress existe
SELECT 
  column_name, 
  data_type, 
  is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_progress' 
ORDER BY ordinal_position;

-- PASO 2: Verificar que hay usuarios registrados
SELECT COUNT(*) as total_users FROM auth.users;

-- PASO 3: Verificar que hay tours disponibles
SELECT COUNT(*) as total_tours FROM tours;

-- PASO 4: Ver algunos tours disponibles
SELECT id, title, type FROM tours LIMIT 5;

-- PASO 5: Ver usuarios registrados (solo IDs)
SELECT id FROM auth.users LIMIT 3;

-- PASO 6: Verificar si ya hay progreso registrado
SELECT COUNT(*) as total_progress FROM user_progress;

-- PASO 7: Ver progreso existente (si lo hay)
SELECT 
  up.user_id,
  up.tour_id,
  up.progress,
  up.completed,
  t.title as tour_name
FROM user_progress up
LEFT JOIN tours t ON up.tour_id = t.id
LIMIT 10;

-- PASO 8: Verificar que la función upsert_user_progress existe
SELECT 
  routine_name, 
  routine_type
FROM information_schema.routines 
WHERE routine_name = 'upsert_user_progress';

-- PASO 9: Verificar políticas RLS
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd
FROM pg_policies 
WHERE tablename = 'user_progress';

-- PASO 10: Ver estructura completa de user_progress
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default,
  ordinal_position
FROM information_schema.columns 
WHERE table_name = 'user_progress' 
ORDER BY ordinal_position;
