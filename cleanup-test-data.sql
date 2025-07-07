-- Script para limpiar datos de prueba del historial
-- Ejecuta esto si quieres empezar desde cero

-- 1. Ver cuántos registros hay actualmente
SELECT 'Estado actual:' as info;
SELECT 
  'user_progress' as table_name,
  COUNT(*) as total_records
FROM user_progress;

-- 2. Ver los datos existentes antes de limpiar
SELECT 'Datos existentes antes de limpiar:' as step;
SELECT 
  up.user_id,
  up.tour_id,
  up.progress,
  up.completed,
  up.started_at,
  t.title as tour_name
FROM user_progress up
LEFT JOIN tours t ON up.tour_id = t.id
ORDER BY up.started_at DESC;

-- 3. Limpiar SOLO los datos de prueba recientes (últimas 24 horas)
DELETE FROM user_progress 
WHERE started_at >= NOW() - INTERVAL '24 hours';

-- 4. Verificar que se limpiaron los datos
SELECT 'Después de limpiar datos de prueba:' as step;
SELECT 
  'user_progress' as table_name,
  COUNT(*) as total_records
FROM user_progress;

-- 5. Mostrar datos restantes (si los hay)
SELECT 'Datos restantes:' as step;
SELECT 
  up.user_id,
  up.tour_id,
  up.progress,
  up.completed,
  up.started_at,
  t.title as tour_name
FROM user_progress up
LEFT JOIN tours t ON up.tour_id = t.id
ORDER BY up.started_at DESC;

-- 6. OPCIÓN NUCLEAR: Limpiar TODOS los datos (descomenta si quieres resetear todo)
/*
TRUNCATE user_progress;
SELECT 'Todos los datos de user_progress han sido eliminados' as status;
*/
