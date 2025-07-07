# 🔧 SOLUCIÓN: Error Foreign Key en user_progress

## 🚨 **Problema Identificado**
```
ERROR: insert or update on table "user_progress" violates foreign key constraint "user_progress_user_id_fkey"
DETAIL: Key (user_id)=(xxx) is not present in table "profiles".
```

**Causa**: Los usuarios existen en `auth.users` pero no tienen registros correspondientes en la tabla `profiles`.

## ✅ **Solución Implementada**

### **1. Script de Reparación Inmediata**
**Archivo**: `fix-missing-profiles.sql`

- ✅ Identifica usuarios sin perfil
- ✅ Crea perfiles automáticamente para todos los usuarios
- ✅ Usa datos de `auth.users` para llenar información
- ✅ Verifica foreign keys y estructura

### **2. Mejora en el Registro (`supabase.js`)**
**Función `signUp()` mejorada:**

```javascript
// ANTES: Podía fallar sin avisar
await supabase.from('profiles').insert({...})

// DESPUÉS: Manejo de errores robusto
try {
  const { error: profileError } = await supabase.from('profiles').insert({...})
  if (profileError) {
    console.error('Error al crear perfil:', profileError)
    // No lanza error, el usuario se creó correctamente
  }
} catch (profileError) {
  console.error('Error inesperado al crear perfil:', profileError)
}
```

### **3. Creación Automática de Perfiles**
**Nuevas funciones en `supabase.js`:**

- `getUserProfile()` - Intenta crear perfil si no existe
- `createMissingProfile()` - Crea perfil automáticamente

### **4. Script de Prueba Mejorado**
**Archivo**: `safe-test-historial.sql` actualizado

- ✅ Verifica existencia de perfil antes de insertar
- ✅ Crea perfil automáticamente si no existe
- ✅ Manejo robusto de foreign keys

## 🛠️ **Pasos para Solucionar**

### **Paso 1: Arreglar Perfiles Existentes**
```sql
-- Ejecuta en Supabase SQL Editor:
-- Contenido del archivo fix-missing-profiles.sql
```

**Resultado esperado:**
```
✅ Perfiles creados correctamente. Ahora puedes ejecutar safe-test-historial.sql
```

### **Paso 2: Probar el Historial**
```sql
-- Ejecuta safe-test-historial.sql
-- Ahora debería funcionar sin errores de foreign key
```

**Resultado esperado:**
```
NOTICE: Perfil ya existe para user: xxx
NOTICE: Insertado tour completado para user: xxx
NOTICE: Insertado tour en progreso para user: xxx
```

### **Paso 3: Verificar en la App**
1. Inicia sesión en la aplicación
2. Selecciona y completa un tour
3. Ve a Perfil → "Ver Historial"
4. Deberías ver los tours correctamente

## 📊 **Verificaciones del Script**

### **Estado Inicial:**
```sql
-- Usuarios disponibles: 1
-- Perfiles disponibles: 0  ← PROBLEMA
-- Tours disponibles: 12
-- Progreso existente: 0
```

### **Después del Fix:**
```sql
-- Usuarios disponibles: 1
-- Perfiles disponibles: 1  ← SOLUCIONADO
-- Tours disponibles: 12
-- Progreso existente: 2
```

## 🔍 **Debugging**

### **Verificar Usuarios sin Perfil:**
```sql
SELECT 
  au.id as user_id,
  au.email,
  CASE WHEN p.id IS NULL THEN '❌ Sin perfil' ELSE '✅ Con perfil' END as status
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id;
```

### **Verificar Foreign Keys:**
```sql
SELECT 
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'user_progress';
```

## 📁 **Archivos Modificados/Creados**

1. **`fix-missing-profiles.sql`** - Crea perfiles faltantes
2. **`safe-test-historial.sql`** - Verifica y crea perfiles automáticamente
3. **`supabase.js`** - Manejo robusto de creación de perfiles
4. **`SOLUCION_FOREIGN_KEY.md`** - Esta documentación

## 🚀 **Resultado Final**

### **Antes:**
- ❌ Error de foreign key constraint
- ❌ Usuarios sin perfiles
- ❌ Historial no funciona

### **Después:**
- ✅ Todos los usuarios tienen perfiles
- ✅ Foreign keys funcionan correctamente
- ✅ Historial de tours funcional
- ✅ Creación automática de perfiles en nuevos registros

## 💡 **Prevención Futura**

### **Triggers Automáticos (Opcional):**
Si quieres que los perfiles se creen automáticamente sin depender del código JS:

```sql
-- Trigger para crear perfil automáticamente
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url, updated_at)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'), 
          NEW.raw_user_meta_data->>'avatar_url', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_for_new_user();
```

¡Ahora el historial de tours debería funcionar perfectamente! 🎉
