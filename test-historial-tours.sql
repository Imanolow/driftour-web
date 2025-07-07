-- Script de prueba para verificar el historial de tours
-- Ejecuta esto después de aplicar fix-user-progress.sql

-- 1. Verificar que la tabla user_progress existe con la estructura correcta
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_progress' 
ORDER BY ordinal_position;

-- 2. Verificar que la función upsert_user_progress existe
SELECT 
  routine_name, 
  routine_type, 
  routine_definition
FROM information_schema.routines 
WHERE routine_name = 'upsert_user_progress';

-- 3. Obtener IDs reales para usar en las pruebas
-- Obtén tu user_id:
SELECT id as user_id FROM auth.users LIMIT 1;

-- Obtén algunos tour_ids:
SELECT id as tour_id, title FROM tours LIMIT 3;

-- 4. Script para insertar datos de prueba automáticamente
-- Este script obtiene IDs reales y los usa para insertar datos de prueba
DO $$
DECLARE
    test_user_id UUID;
    test_tour_id_1 UUID;
    test_tour_id_2 UUID;
BEGIN
    -- Obtener el primer usuario
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    -- Obtener los dos primeros tours diferentes
    SELECT id INTO test_tour_id_1 FROM tours ORDER BY created_at LIMIT 1;
    SELECT id INTO test_tour_id_2 FROM tours ORDER BY created_at LIMIT 1 OFFSET 1;
    
    -- Solo insertar si encontramos usuarios y tours
    IF test_user_id IS NOT NULL AND test_tour_id_1 IS NOT NULL THEN
        
        -- Limpiar datos de prueba previos para este usuario
        DELETE FROM user_progress 
        WHERE user_id = test_user_id 
        AND tour_id IN (test_tour_id_1, test_tour_id_2);
        
        -- Insertar primer tour por separado
        INSERT INTO user_progress (user_id, tour_id, current_location, total_points, progress, completed, started_at, completed_at)
        VALUES (test_user_id, test_tour_id_1, 5, 5, 5, true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day');
        
        -- Insertar segundo tour solo si es diferente del primero
        IF test_tour_id_2 IS NOT NULL AND test_tour_id_2 != test_tour_id_1 THEN
            INSERT INTO user_progress (user_id, tour_id, current_location, total_points, progress, completed, started_at, completed_at)
            VALUES (test_user_id, test_tour_id_2, 3, 5, 3, false, NOW() - INTERVAL '1 day', NULL);
        END IF;
          
        RAISE NOTICE 'Datos de prueba insertados correctamente';
        RAISE NOTICE 'User ID: %', test_user_id;
        RAISE NOTICE 'Tour ID 1: %', test_tour_id_1;
        RAISE NOTICE 'Tour ID 2: %', test_tour_id_2;
        
    ELSE
        RAISE NOTICE 'No se encontraron usuarios o tours para insertar datos de prueba';
        RAISE NOTICE 'Users found: %', (SELECT COUNT(*) FROM auth.users);
        RAISE NOTICE 'Tours found: %', (SELECT COUNT(*) FROM tours);
    END IF;
END
$$;

-- 5. Verificar que los datos se insertaron correctamente
SELECT 
  up.id,
  up.user_id,
  up.tour_id,
  up.current_location,
  up.total_points,
  up.progress,
  up.completed,
  up.started_at,
  up.completed_at,
  t.title as tour_name
FROM user_progress up
LEFT JOIN tours t ON up.tour_id = t.id
ORDER BY up.started_at DESC;

-- 6. Probar la función upsert_user_progress con IDs reales
DO $$
DECLARE
    test_user_id UUID;
    test_tour_id UUID;
BEGIN
    -- Obtener IDs reales
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    SELECT id INTO test_tour_id FROM tours LIMIT 1 OFFSET 2;
    
    -- Probar la función si tenemos IDs válidos
    IF test_user_id IS NOT NULL AND test_tour_id IS NOT NULL THEN
        PERFORM upsert_user_progress(
            test_user_id,
            test_tour_id,
            2,
            5,
            2,
            false
        );
        
        RAISE NOTICE 'Función upsert_user_progress probada exitosamente';
        RAISE NOTICE 'User ID: %', test_user_id;
        RAISE NOTICE 'Tour ID: %', test_tour_id;
    ELSE
        RAISE NOTICE 'No se pudieron obtener IDs para probar la función';
    END IF;
END
$$;

-- 7. Verificar que la función funcionó
SELECT 
  up.*,
  t.title as tour_name
FROM user_progress up
LEFT JOIN tours t ON up.tour_id = t.id
ORDER BY up.started_at DESC
LIMIT 10;

-- 8. Limpiar datos de prueba (opcional - descomenta para ejecutar)
/*
DELETE FROM user_progress 
WHERE created_at >= NOW() - INTERVAL '1 hour';
*/
