const CACHE_NAME = "acccalc-v2.6";
const URLS_TO_CACHE = [
    "/",
    "/manifest.webmanifest"
    ];

    self.addEventListener("install", (installEvent) => {
    self.skipWaiting();

    installEvent.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(URLS_TO_CACHE);
        })
    );
    });

    self.addEventListener("activate", (activateEvent) => {
    activateEvent.waitUntil(
        caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
                return caches.delete(cacheName);
            }
            })
        );
        }).then(() => self.clients.claim())
    );
    });

    self.addEventListener("fetch", (fetchEvent) => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then((cachedResponse) => {
        return cachedResponse || fetch(fetchEvent.request);
        })
    );
});