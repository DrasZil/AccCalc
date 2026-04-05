const APP_VERSION = "2.2.0";
const CACHE_VERSION = `acccalc-v${APP_VERSION}`;
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const APP_SCOPE_URL = new URL(self.registration.scope);
const SHELL_URL = new URL("", APP_SCOPE_URL).toString();
const OFFLINE_URL = new URL("offline.html", APP_SCOPE_URL).toString();
const APP_SHELL_URLS = [
    SHELL_URL,
    new URL("offline.html", APP_SCOPE_URL).toString(),
    new URL("manifest.webmanifest", APP_SCOPE_URL).toString(),
    new URL("icon-192.png", APP_SCOPE_URL).toString(),
    new URL("icon-512.png", APP_SCOPE_URL).toString(),
].map((url) => url.toString());

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(APP_SHELL_CACHE)
            .then((cache) => cache.addAll(APP_SHELL_URLS))
            .then(() => broadcastMessage({ type: "SW_UPDATE_READY", version: APP_VERSION }))
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
            .then(() => broadcastMessage({ type: "SW_ACTIVATED", version: APP_VERSION }))
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
        event.respondWith(handleNavigationRequest(request));
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

async function handleNavigationRequest(request) {
    try {
        const networkResponse = await fetch(request, { cache: "no-store" });
        if (networkResponse.ok) {
            const cache = await caches.open(APP_SHELL_CACHE);
            cache.put(SHELL_URL, networkResponse.clone());
            return networkResponse;
        }
        throw new Error(`Navigation failed with status ${networkResponse.status}.`);
    } catch {
        const cachedShell = await caches.match(SHELL_URL);
        if (cachedShell) return cachedShell;

        const offlinePage = await caches.match(OFFLINE_URL);
        if (offlinePage) return offlinePage;

        return new Response("Offline", {
            status: 503,
            statusText: "Offline",
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
    }
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    const networkPromise = fetch(request)
        .then((networkResponse) => {
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(() => cachedResponse);

    return cachedResponse || networkPromise;
}

async function broadcastMessage(message) {
    const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
    });

    clients.forEach((client) => {
        client.postMessage(message);
    });
}
