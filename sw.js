// PG Manager Restaurant — separate cache from the personal app.
const CACHE = 'pg-manager-restaurant-v2.4.8';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS.map(asset => new Request(asset, {cache: 'reload'})))));
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('pg-manager-restaurant-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  // Keep the current app shell together until the user accepts a new version.
  const isAppAsset = ASSETS.some(asset => new URL(asset, self.registration.scope).pathname === new URL(event.request.url).pathname);
  if (isAppAsset) {
    event.respondWith(caches.open(CACHE).then(cache => cache.match(event.request, {ignoreSearch:true})).then(cached => cached || fetch(event.request)));
    return;
  }
  event.respondWith(fetch(event.request));
});
