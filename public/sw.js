// Basic Service Worker to enable PWA installability
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('fetch', (event) => {
  // Let the browser handle everything normally, no offline caching for now.
  event.respondWith(fetch(event.request));
});
