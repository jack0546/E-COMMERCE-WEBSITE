/* ============================================
   Service Worker - Offline Support & Caching
   AutoGhana Car Marketplace
   ============================================ */

const CACHE_NAME = 'autoghana-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './inventory.html',
  './car-details.html',
  './login.html',
  './register.html',
  './dashboard.html',
  './admin.html',
  './brands.html',
  './css/styles.css',
  './js/database/db.js',
  './js/database/seed.js',
  './js/security/security.js',
  './js/auth/auth.js',
  './js/messaging/messaging.js',
  './js/installment/installment.js',
  './js/ui/ui.js'
];

// Install - Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Cache-first strategy for static, network-first for dynamic
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // For HTML pages and static assets - cache first, fallback to network
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        }).catch(() => cached);

        return cached || fetchPromise;
      })
    );
  }
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
