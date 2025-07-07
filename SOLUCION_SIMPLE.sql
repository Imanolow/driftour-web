-- SOLUCIÓN DEFINITIVA: Crear tu perfil manualmente
-- Ejecuta SOLO este script en Supabase SQL Editor

-- Primero ver qué columnas tiene la tabla profiles
SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles';

-- Crear tu perfil con tu ID específico (solo con columnas que existen)
INSERT INTO profiles (id)
VALUES ('89357a6c-3327-4561-8651-bc35358c56dd')
ON CONFLICT (id) DO NOTHING;

-- Verificar que se creó
SELECT 'Perfil creado' as status;
SELECT * FROM profiles WHERE id = '89357a6c-3327-4561-8651-bc35358c56dd';
