# 🌐 SOLUCIÓN DOMINIO GITHUB PAGES

## ❌ PROBLEMA ACTUAL
```
The custom domain `driftour` is not properly formatted
```

## 🔧 SOLUCIONES

### **Opción 1: Usar GitHub Pages URL (RECOMENDADO)**
```
https://imanolow.github.io/driftour-web/
```
- ✅ Funciona inmediatamente
- ✅ Gratis
- ✅ SSL automático

### **Opción 2: Comprar dominio personalizado**
Si quieres usar `driftour.com`:
1. Comprar dominio en: Namecheap, GoDaddy, etc.
2. Configurar DNS records:
   ```
   Type: CNAME
   Name: www
   Value: imanolow.github.io
   ```
3. Añadir archivo CNAME en el repo

### **Opción 3: Usar subdominios gratuitos**
- `driftour.github.io` (no disponible - requiere GitHub Pro)
- `driftour.netlify.app` (si cambias a Netlify)
- `driftour.vercel.app` (si cambias a Vercel)

## 🚀 CONFIGURACIÓN GITHUB PAGES

### Para usar la URL de GitHub Pages:
1. Ve a Settings → Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: / (root)
5. **QUITAR** el custom domain
6. La app estará en: `https://imanolow.github.io/driftour-web/`

## 🔄 ACTUALIZAR CONFIGURACIÓN

Si usas la URL de GitHub Pages, actualiza estos archivos:

### `manifest.json`:
```json
{
  "start_url": "/driftour-web/",
  "scope": "/driftour-web/"
}
```

### `service-worker.js`:
```javascript
const CACHE_NAME = 'driftour-v1.0';
const BASE_PATH = '/driftour-web';
```

---
**🎯 RECOMENDACIÓN**: Usar GitHub Pages URL por ahora, comprar dominio más tarde
