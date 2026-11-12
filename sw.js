// Keeps the app available offline: pages are fetched fresh when online and served from the cache when not.
const C = 'self-barber-7a649cfb';
const PRE = ['./', './1/', './2/', './1/manifest.webmanifest', './2/manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800&display=swap'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => Promise.allSettled(PRE.map(u => c.add(u)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const ours = u.origin === location.origin || ['cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'].includes(u.hostname);
  if (!ours) return;
  e.respondWith((async () => {
    const c = await caches.open(C);
    if (r.mode === 'navigate') {
      try { const n = await fetch(r); if (n.ok) c.put(r, n.clone()); return n; }
      catch { return (await c.match(r, { ignoreSearch: true })) || (await c.match('./')) || Response.error(); }
    }
    const hit = await c.match(r);
    const net = fetch(r).then(n => { if (n && (n.ok || n.type === 'opaque')) c.put(r, n.clone()); return n; }).catch(() => null);
    return hit || (await net) || Response.error();
  })());
});
