const CACHE = 'localizador-v6';
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.min.js'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Estrategia: shell de la app (HTML/CSS/JS/iconos) desde caché primero, para apertura instantánea.
// Los tiles del mapa (OpenStreetMap) y cualquier otra petición van siempre a la red,
// porque son datos cambiantes que no tiene sentido cachear de forma indefinida.
self.addEventListener('fetch', (e)=>{
  const url = e.request.url;
  const esTile = url.includes('tile.openstreetmap.org');
  if(esTile){
    e.respondWith(fetch(e.request).catch(()=> new Response('', {status: 503})));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(resp=>{
        if(resp && resp.status===200){
          const clone = resp.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return resp;
      }).catch(()=> cached);
      return cached || fetchPromise;
    })
  );
});
