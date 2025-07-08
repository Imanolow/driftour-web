const CACHE_NAME = 'driftour-v3';
// Detectar automáticamente si estamos en GitHub Pages o local
const isGitHubPages = self.location.hostname === 'imanolow.github.io';
const BASE_PATH = isGitHubPages ? '/driftour-web' : '';

console.log('🔍 Service Worker iniciando:', {
  hostname: self.location.hostname,
  isGitHubPages,
  BASE_PATH
});

const urlsToCache = [
  BASE_PATH + '/',
  BASE_PATH + '/index.html',
  BASE_PATH + '/styles.css',
  BASE_PATH + '/script.js',
  BASE_PATH + '/supabase.js',
  BASE_PATH + '/stripe.js',
  BASE_PATH + '/manifest.json',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://js.stripe.com/v3/',
  // Agregar más recursos según sea necesario
];

console.log('📦 URLs a cachear:', urlsToCache);

// Instalar el service worker
self.addEventListener('install', (event) => {
  console.log('⚙️ SW: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('💾 Cache abierto:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ SW: Instalación completada');
      })
      .catch((error) => {
        console.error('❌ SW: Error en instalación:', error);
      })
  );
});

// Interceptar peticiones y servir desde cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devolver desde cache si está disponible
        if (response) {
          return response;
        }
        
        // Sino, hacer petición a la red
        return fetch(event.request).then((response) => {
          // Verificar si la respuesta es válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clonar la respuesta
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});

// Actualizar el cache cuando sea necesario
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Manejar notificaciones push (para futuras funcionalidades)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'Ver Tour',
          icon: '/icons/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'Cerrar',
          icon: '/icons/icon-192x192.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    // Abrir la app en el tour específico
    event.waitUntil(
      clients.openWindow('/#map-screen')
    );
  }
});
