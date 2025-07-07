# 🚨 SOLUCIÓN RÁPIDA: Error "user_favorites does not exist"

## 📋 **Pasos para solucionarlo:**

### **1. Ve a tu Dashboard de Supabase**
- Abre: https://app.supabase.com
- Selecciona tu proyecto DrifTour

### **2. Ejecuta el Script SQL**
- Ve a: `SQL Editor` (menú lateral)
- Crea una nueva consulta
- Copia y pega este código:

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

### **3. Ejecuta el Script**
- Haz clic en `Run` (botón verde)
- Deberías ver: `Success. No rows returned`

### **4. Verifica la Tabla**
- Ve a: `Table Editor` (menú lateral)  
- Deberías ver la tabla `user_favorites` creada

### **5. Recarga la App**
- Actualiza tu página en http://localhost:3000
- Los favoritos deberían funcionar correctamente

## ✅ **Verificación**
Si todo salió bien, deberías poder:
- ❤️ Marcar tours como favoritos
- 📱 Ver tus favoritos en el menú de usuario
- 🗑️ Eliminar favoritos

## 🔧 **Si sigue sin funcionar:**
1. Verifica que tu proyecto de Supabase esté correcto en `config.js`
2. Asegúrate de que el usuario esté logueado
3. Revisa la consola del navegador para más detalles del error

¡Después de esto, los favoritos funcionarán perfectamente! 🎉
