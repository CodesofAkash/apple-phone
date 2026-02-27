const CACHE_NAME = 'apple-phone-v2';

// Only cache local static assets — never external URLs or media
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never intercept:
  // 1. Cloudinary CDN requests (videos/images/models)
  // 2. Railway API requests
  // 3. Any media (video/audio) requests
  // 4. Cross-origin requests
  if (
    url.hostname.includes('cloudinary.com') ||
    url.hostname.includes('railway.app') ||
    url.hostname.includes('sentry.io') ||
    request.destination === 'video' ||
    request.destination === 'audio' ||
    url.origin !== self.location.origin
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // API calls — network first, no caching
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: 'Offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    return;
  }

  // Local static assets — cache first
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          // Only cache valid same-origin responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
    )
  );
});