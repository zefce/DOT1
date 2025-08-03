const CACHE_NAME = 'dot-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/css/chats.css',
  '/css/buttons.css',
  '/css/animations.css',
  '/css/dot-menu.css',
  '/js/main.js',
  '/js/chats.js',
  '/js/theme.js',
  '/js/menu.js',
  '/img/dot192.png',
  '/img/dot512.png'
];

// Установка: кэшируем всё
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Активация: очищаем старые кэши
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Перехват запросов
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});