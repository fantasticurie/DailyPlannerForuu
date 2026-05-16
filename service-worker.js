const CACHE_NAME = 'ee-planner-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Install Service Worker dan simpan file ke cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache berhasil dibuka');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ambil data dari cache kalau lagi offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Kalau file ada di cache, pakai yang itu
        if (response) {
          return response;
        }
        // Kalau nggak ada, baru ambil dari internet
        return fetch(event.request);
      }
    )
  );
});

// Bersihkan cache lama kalau ada update
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
