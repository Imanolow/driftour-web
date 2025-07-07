# 🚨 Error: "user_favorites does not exist"

## 📋 **Problema**
El error `relation "public.user_favorites" does not exist` indica que la tabla de favoritos no se ha creado en tu base de datos de Supabase.

## ✅ **Solución (Paso a Paso)**

### **1. Accede a Supabase**
```
🌐 https://app.supabase.com
```

### **2. Selecciona tu proyecto**
- Busca tu proyecto "DrifTour" 
- Haz clic para entrar

### **3. Abre el SQL Editor**
- En el menú lateral izquierdo
- Clic en "SQL Editor"

### **4. Crea Nueva Consulta**
- Botón "+ New query"
- Pega el código de abajo

### **5. Ejecuta este código SQL:**

```sql
-- Crear tabla de favoritos de usuario
CREATE TABLE IF NOT EXISTS user_favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tour_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tour_id)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_tour_id ON user_favorites(tour_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo puedan ver sus propios favoritos
CREATE POLICY "Users can view their own favorites" ON user_favorites
    FOR SELECT USING (auth.uid() = user_id);

-- Política para que los usuarios solo puedan insertar sus propios favoritos
CREATE POLICY "Users can insert their own favorites" ON user_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios solo puedan eliminar sus propios favoritos
CREATE POLICY "Users can delete their own favorites" ON user_favorites
    FOR DELETE USING (auth.uid() = user_id);
```

### **6. Ejecuta el Script**
- Haz clic en el botón verde "Run"
- Deberías ver: "Success. No rows returned"

### **7. Verifica la Tabla**
- Ve a "Table Editor" en el menú lateral
- Deberías ver la tabla `user_favorites` listada

### **8. Reinicia tu Aplicación**
- Recarga la página: http://localhost:3000
- Los favoritos deberían funcionar sin errores

## 🔍 **Verificación**
Después de ejecutar el script, podrás:
- ❤️ Hacer clic en los corazones de los tours
- ⭐ Ver "Tour agregado a favoritos" 
- 📱 Acceder a "Mis Favoritos" en el menú de usuario

## 🆘 **Si aún tienes problemas:**

1. **Verifica tu configuración:**
   - Revisa que `config.js` tenga las claves correctas
   - Confirma que estás en el proyecto correcto de Supabase

2. **Revisa la consola:**
   - Abre las herramientas de desarrollo (F12)
   - Ve a la pestaña "Console"
   - Busca mensajes de error adicionales

3. **Tabla creada pero sigue el error:**
   - Espera unos minutos (caché de Supabase)
   - Limpia el caché del navegador
   - Recarga la página

## 📞 **Contacto**
Si sigues teniendo problemas, comparte:
- Screenshot del error en la consola
- Screenshot de tus tablas en Supabase
- El mensaje exacto del error

¡Una vez solucionado, los favoritos funcionarán perfectamente! 🎉
