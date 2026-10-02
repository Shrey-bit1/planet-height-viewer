const CACHE = 'planet-viewer-v1';
self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', 'manifest.json', 'icon.png', 'apple-touch-icon.png']))); });
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const isData = new URL(e.request.url).pathname.includes('/data/');
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(e.request);
    if (isData && hit) return hit;                       // planet data never changes: use the saved copy
    try { const res = await fetch(e.request); if (res.ok) cache.put(e.request, res.clone()); return res; } // page: newest version when online
    catch (err) { if (hit) return hit; throw err; }      // offline: fall back to the saved copy
  })());
});
