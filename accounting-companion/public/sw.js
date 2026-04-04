const APP_VERSION = "1.5.0";
const CACHE_VERSION = `acccalc-v${APP_VERSION}`;
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const APP_SCOPE_URL = new URL(self.registration.scope);
const APP_SHELL_URLS = ["", "manifest.webmanifest", "icon-192.png", "icon-512.png"].map(
    (path) => new URL(path, APP_SCOPE_URL).toString()
);

self.addEventListener("install", (event) => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(APP_SHELL_CACHE).then((cache) => {
            return cache.addAll(APP_SHELL_URLS);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) =>
                Promise.all(
                    cacheNames.map((cacheName) => {
                        if (![APP_SHELL_CACHE, ASSET_CACHE].includes(cacheName)) {
                            return caches.delete(cacheName);
                        }
                        return Promise.resolve();
                    })
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener("message", (event) => {
    if (event.data?.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

self.addEventListener("fetch", (event) => {
    const { request } = event;

    if (request.method !== "GET") return;

    const requestUrl = new URL(request.url);
    const isSameOrigin = requestUrl.origin === self.location.origin;

    if (!isSameOrigin) return;

    if (request.mode === "navigate") {
        event.respondWith(networkFirst(request, APP_SHELL_CACHE, APP_SHELL_URLS[0]));
        return;
    }

    const destination = request.destination;
    const shouldUseAssetStrategy = ["script", "style", "image", "font", "manifest"].includes(
        destination
    );

    if (shouldUseAssetStrategy) {
        event.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
    }
});

async function networkFirst(request, cacheName, fallbackUrl) {
    try {
        const networkResponse = await fetch(request, { cache: "no-store" });
        if (!networkResponse.ok && request.mode === "navigate") {
            throw new Error(`Navigation request failed with status ${networkResponse.status}.`);
        }
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;

        const fallbackResponse = await caches.match(fallbackUrl);
        if (fallbackResponse) return fallbackResponse;

        throw new Error("Offline and no cached response available.");
    }
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    const networkPromise = fetch(request)
        .then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
        })
        .catch(() => cachedResponse);

    return cachedResponse || networkPromise;
}
