-- Script seguro para probar el historial de tours
-- Este script verifica antes de insertar para evitar conflictos

-- 1. Verificar estado actual
SELECT 'Verificando estado actual...' as step;

-- Ver usuarios disponibles
SELECT 'Usuarios disponibles:' as info, COUNT(*) as count FROM auth.users;

-- Ver perfiles disponibles
SELECT 'Perfiles disponibles:' as info, COUNT(*) as count FROM profiles;

-- Ver tours disponibles
SELECT 'Tours disponibles:' as info, COUNT(*) as count FROM tours;

-- Ver progreso existente
SELECT 'Progreso existente:' as info, COUNT(*) as count FROM user_progress;

-- Verificar usuarios sin perfil
SELECT 'Usuarios sin perfil:' as step;
SELECT 
  au.id as user_id,
  au.email,
  CASE WHEN p.id IS NULL THEN 'Sin perfil' ELSE 'Con perfil' END as status
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC
LIMIT 5;

-- 2. Mostrar datos existentes
SELECT 'Datos existentes en user_progress:' as step;
SELECT 
  up.user_id,
  up.tour_id,
  up.progress,
  up.completed,
  t.title as tour_name
FROM user_progress up
LEFT JOIN tours t ON up.tour_id = t.id
ORDER BY up.started_at DESC
LIMIT 5;

-- 3. Insertar datos de prueba de forma segura
DO $$
DECLARE
    test_user_id UUID;
    test_tour_id_1 UUID;
    test_tour_id_2 UUID;
    existing_count INTEGER;
    profile_exists INTEGER;
BEGIN
    -- Obtener primer usuario
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    -- Obtener tours diferentes
    SELECT id INTO test_tour_id_1 FROM tours ORDER BY title LIMIT 1;
    SELECT id INTO test_tour_id_2 FROM tours ORDER BY title LIMIT 1 OFFSET 1;
    
    IF test_user_id IS NOT NULL AND test_tour_id_1 IS NOT NULL THEN
        
        -- Verificar si existe el perfil del usuario
        SELECT COUNT(*) INTO profile_exists 
        FROM profiles 
        WHERE id = test_user_id;
        
        -- Crear perfil si no existe
        IF profile_exists = 0 THEN
            INSERT INTO profiles (id, full_name, avatar_url, updated_at)
            VALUES (test_user_id, 'Usuario de Prueba', NULL, NOW());
            
            RAISE NOTICE 'Perfil creado para user: %', test_user_id;
        ELSE
            RAISE NOTICE 'Perfil ya existe para user: %', test_user_id;
        END IF;
        
        -- Verificar si ya existe progreso para este usuario y tour
        SELECT COUNT(*) INTO existing_count 
        FROM user_progress 
        WHERE user_id = test_user_id AND tour_id = test_tour_id_1;
        
        -- Solo insertar si no existe
        IF existing_count = 0 THEN
            INSERT INTO user_progress (user_id, tour_id, current_location, total_points, progress, completed, started_at, completed_at)
            VALUES (test_user_id, test_tour_id_1, 5, 5, 5, true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day');
            
            RAISE NOTICE 'Insertado tour completado para user: %', test_user_id;
        ELSE
            RAISE NOTICE 'Ya existe progreso para este usuario y tour 1';
        END IF;
        
        -- Hacer lo mismo para el segundo tour
        IF test_tour_id_2 IS NOT NULL AND test_tour_id_2 != test_tour_id_1 THEN
            SELECT COUNT(*) INTO existing_count 
            FROM user_progress 
            WHERE user_id = test_user_id AND tour_id = test_tour_id_2;
            
            IF existing_count = 0 THEN
                INSERT INTO user_progress (user_id, tour_id, current_location, total_points, progress, completed, started_at, completed_at)
                VALUES (test_user_id, test_tour_id_2, 3, 5, 3, false, NOW() - INTERVAL '1 day', NULL);
                
                RAISE NOTICE 'Insertado tour en progreso para user: %', test_user_id;
            ELSE
                RAISE NOTICE 'Ya existe progreso para este usuario y tour 2';
            END IF;
        END IF;
        
    ELSE
        RAISE NOTICE 'No se encontraron usuarios o tours suficientes';
        RAISE NOTICE 'User ID: %', test_user_id;
        RAISE NOTICE 'Tour ID 1: %', test_tour_id_1;
        RAISE NOTICE 'Tour ID 2: %', test_tour_id_2;
    END IF;
END
$$;

-- 4. Verificar resultado final
SELECT 'Resultado final:' as step;
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
  t.title as tour_name,
  t.type as tour_type
FROM user_progress up
LEFT JOIN tours t ON up.tour_id = t.id
ORDER BY up.started_at DESC
LIMIT 10;

-- 5. Probar la función upsert_user_progress
DO $$
DECLARE
    test_user_id UUID;
    test_tour_id UUID;
BEGIN
    -- Obtener IDs diferentes para la prueba
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    SELECT id INTO test_tour_id FROM tours ORDER BY title LIMIT 1 OFFSET 2;
    
    IF test_user_id IS NOT NULL AND test_tour_id IS NOT NULL THEN
        -- Probar la función upsert
        PERFORM upsert_user_progress(
            test_user_id,
            test_tour_id,
            2,
            5,
            2,
            false
        );
        
        RAISE NOTICE 'Función upsert_user_progress ejecutada exitosamente';
        RAISE NOTICE 'User ID: %', test_user_id;
        RAISE NOTICE 'Tour ID: %', test_tour_id;
    ELSE
        RAISE NOTICE 'No se pudieron obtener IDs para probar upsert_user_progress';
    END IF;
END
$$;

-- 6. Verificar que la función funcionó
SELECT 'Verificación final de la función upsert:' as step;
SELECT 
  up.*,
  t.title as tour_name
FROM user_progress up
LEFT JOIN tours t ON up.tour_id = t.id
ORDER BY up.started_at DESC
LIMIT 10;
