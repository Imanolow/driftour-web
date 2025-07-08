const CACHE_NAME = 'driftour-mobile-v1';
// Service Worker para PWA móvil - Ubicado en raíz para GitHub Pages
const BASE_PATH = '/driftour-web';

console.log('🚀 Service Worker móvil iniciando desde raíz');

const urlsToCache = [
  BASE_PATH + '/',
  BASE_PATH + '/index.html',
  BASE_PATH + '/styles.css',
  BASE_PATH + '/script.js',
  BASE_PATH + '/supabase.js',
  BASE_PATH + '/config.js',
  BASE_PATH + '/manifest.json',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

// Instalar el service worker
self.addEventListener('install', (event) => {
  console.log('📱 SW móvil: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('💾 Cache móvil abierto:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ SW móvil: Instalación completada');
        self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ SW móvil: Error en instalación:', error);
      })
  );
});

// Activar y tomar control
self.addEventListener('activate', (event) => {
  console.log('🔄 SW móvil: Activando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Eliminando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ SW móvil activado y listo');
      self.clients.claim();
    })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match(BASE_PATH + '/');
        }
      })
  );
});
