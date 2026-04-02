const CACHE_NAME = "acccalc-v1";
const URLS_TO_CACHE = ["/", "/manifest.webmanifest"];

self.addEventListener("install", (installEvent) => {
    installEvent.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(URLS_TO_CACHE);
        })
    );
    });

    self.addEventListener("fetch", (fetchEvent) => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then((cachedResponse) => {
        return cachedResponse || fetch(fetchEvent.request);
        })
    );
});