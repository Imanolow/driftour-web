-- Script para crear perfiles faltantes y arreglar foreign keys
-- Ejecuta esto antes de probar el historial

-- 1. Verificar usuarios sin perfil
SELECT 'Usuarios sin perfil:' as step;
SELECT 
  au.id as user_id,
  au.email,
  au.created_at,
  CASE WHEN p.id IS NULL THEN '❌ Sin perfil' ELSE '✅ Con perfil' END as status
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC;

-- 2. Contar usuarios sin perfil
SELECT 
  'Total usuarios:' as metric,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Total perfiles:' as metric,
  COUNT(*) as count
FROM profiles
UNION ALL
SELECT 
  'Usuarios sin perfil:' as metric,
  COUNT(*) as count
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 3. Crear perfiles para usuarios que no los tienen
INSERT INTO profiles (id, full_name, avatar_url, updated_at)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', 'Usuario') as full_name,
  au.raw_user_meta_data->>'avatar_url' as avatar_url,
  NOW() as updated_at
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 4. Verificar que se crearon los perfiles
SELECT 'Después de crear perfiles:' as step;
SELECT 
  'Total usuarios:' as metric,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Total perfiles:' as metric,
  COUNT(*) as count
FROM profiles
UNION ALL
SELECT 
  'Usuarios sin perfil:' as metric,
  COUNT(*) as count
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 5. Mostrar perfiles creados
SELECT 'Perfiles en la base de datos:' as step;
SELECT 
  p.id,
  p.full_name,
  p.avatar_url,
  p.updated_at,
  au.email
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
ORDER BY p.updated_at DESC
LIMIT 10;

-- 6. Verificar foreign keys de user_progress
SELECT 'Verificando foreign keys:' as step;
SELECT 
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'user_progress';

-- 7. Mensaje de éxito
SELECT '✅ Perfiles creados correctamente. Ahora puedes ejecutar safe-test-historial.sql' as status;
