const APP_VERSION = "2.6.0";
const CACHE_PREFIX = "acccalc-v";
const CACHE_VERSION = `${CACHE_PREFIX}${APP_VERSION}`;
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const META_CACHE = `${CACHE_VERSION}-meta`;
const CACHE_STATUS_URL = `https://acccalc.local/__cache-status__/${APP_VERSION}`;
const APP_SCOPE_URL = new URL(self.registration.scope);
const SHELL_URL = new URL("", APP_SCOPE_URL).toString();
const OFFLINE_URL = new URL("offline.html", APP_SCOPE_URL).toString();
const ASSET_MANIFEST_URL = new URL("asset-manifest.json", APP_SCOPE_URL).toString();
const APP_SHELL_URLS = [
    SHELL_URL,
    OFFLINE_URL,
    new URL("manifest.webmanifest", APP_SCOPE_URL).toString(),
    new URL("icon-192.png", APP_SCOPE_URL).toString(),
    new URL("icon-512.png", APP_SCOPE_URL).toString(),
].map((url) => url.toString());

self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const shellCache = await caches.open(APP_SHELL_CACHE);
            await shellCache.addAll(APP_SHELL_URLS);

            const assets = await loadAssetManifest();
            const precacheResult = await precacheAssets(assets);
            await writeCacheStatus(precacheResult);

            await broadcastMessage({
                type: "SW_ASSETS_READY",
                version: APP_VERSION,
                ready: precacheResult.ready,
                assetCount: precacheResult.assetCount,
                failedCount: precacheResult.failedCount,
                checkedAt: precacheResult.checkedAt,
            });
            await broadcastMessage({ type: "SW_UPDATE_READY", version: APP_VERSION });
        })()
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            const preservedAssetCaches = getPreservedAssetCaches(cacheNames);

            await Promise.all(
                cacheNames.map((cacheName) => {
                    if (
                        cacheName === APP_SHELL_CACHE ||
                        cacheName === ASSET_CACHE ||
                        cacheName === META_CACHE ||
                        preservedAssetCaches.has(cacheName)
                    ) {
                        return Promise.resolve();
                    }

                    return caches.delete(cacheName);
                })
            );

            await self.clients.claim();

            const cacheStatus = await readCacheStatus();
            await broadcastMessage({
                type: "SW_CACHE_STATUS",
                version: APP_VERSION,
                ready: cacheStatus.ready,
                assetCount: cacheStatus.assetCount,
                failedCount: cacheStatus.failedCount,
                checkedAt: cacheStatus.checkedAt,
            });
            await broadcastMessage({ type: "SW_ACTIVATED", version: APP_VERSION });
        })()
    );
});

self.addEventListener("message", (event) => {
    if (event.data?.type === "SKIP_WAITING") {
        self.skipWaiting();
        return;
    }

    if (event.data?.type === "GET_CACHE_STATUS") {
        const replyPort = event.ports?.[0];
        if (!replyPort) return;

        event.waitUntil(
            (async () => {
                const cacheStatus = await readCacheStatus();
                replyPort.postMessage({
                    type: "SW_CACHE_STATUS",
                    version: APP_VERSION,
                    ready: cacheStatus.ready,
                    assetCount: cacheStatus.assetCount,
                    failedCount: cacheStatus.failedCount,
                    checkedAt: cacheStatus.checkedAt,
                });
            })()
        );
    }
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;

    const requestUrl = new URL(request.url);
    if (requestUrl.origin !== self.location.origin) return;

    if (request.mode === "navigate") {
        event.respondWith(handleNavigationRequest());
        return;
    }

    const destination = request.destination;
    if (destination === "script" || destination === "style") {
        event.respondWith(handleImmutableAssetRequest(request));
        return;
    }

    if (["image", "font", "manifest"].includes(destination)) {
        event.respondWith(staleWhileRevalidate(request));
    }
});

async function handleNavigationRequest() {
    try {
        const networkResponse = await fetch(SHELL_URL, { cache: "no-store" });
        if (!networkResponse.ok) {
            throw new Error(`Navigation failed with status ${networkResponse.status}.`);
        }

        const cache = await caches.open(APP_SHELL_CACHE);
        await cache.put(SHELL_URL, networkResponse.clone());
        return networkResponse;
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

async function handleImmutableAssetRequest(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request, { cache: "no-store" });
        if (networkResponse.ok) {
            const cache = await caches.open(ASSET_CACHE);
            await cache.put(request, networkResponse.clone());
            return networkResponse;
        }

        if (isVersionedAssetRequest(request)) {
            await broadcastMessage({
                type: "SW_DEPLOYMENT_MISMATCH",
                url: request.url,
            });
        }

        return networkResponse;
    } catch (error) {
        if (cachedResponse) {
            return cachedResponse;
        }

        if (isVersionedAssetRequest(request)) {
            await broadcastMessage({
                type: "SW_DEPLOYMENT_MISMATCH",
                url: request.url,
            });
        }

        throw error;
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(ASSET_CACHE);
    const cachedResponse = await caches.match(request);

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

async function loadAssetManifest() {
    try {
        const response = await fetch(ASSET_MANIFEST_URL, { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`Asset manifest failed with status ${response.status}.`);
        }

        const manifest = await response.json();
        if (!manifest || !Array.isArray(manifest.assets)) {
            return [];
        }

        return manifest.assets
            .map((assetPath) => new URL(assetPath, APP_SCOPE_URL).toString())
            .filter((assetUrl) => !APP_SHELL_URLS.includes(assetUrl));
    } catch (error) {
        console.error("AccCalc asset manifest load failed:", error);
        return [];
    }
}

async function precacheAssets(assets) {
    const assetCache = await caches.open(ASSET_CACHE);
    const results = await Promise.allSettled(
        assets.map(async (assetUrl) => {
            const request = new Request(assetUrl, { cache: "no-store" });
            const response = await fetch(request);
            if (!response.ok) {
                throw new Error(`Failed to precache ${assetUrl} (${response.status}).`);
            }

            await assetCache.put(request, response.clone());
            return assetUrl;
        })
    );

    const failedCount = results.filter((result) => result.status === "rejected").length;
    return {
        ready: assets.length > 0 && failedCount === 0,
        assetCount: assets.length - failedCount,
        failedCount,
        checkedAt: Date.now(),
    };
}

async function writeCacheStatus(status) {
    const metaCache = await caches.open(META_CACHE);
    await metaCache.put(
        CACHE_STATUS_URL,
        new Response(JSON.stringify(status), {
            headers: { "Content-Type": "application/json; charset=utf-8" },
        })
    );
}

async function readCacheStatus() {
    const metaCache = await caches.open(META_CACHE);
    const response = await metaCache.match(CACHE_STATUS_URL);
    if (!response) {
        return {
            ready: false,
            assetCount: 0,
            failedCount: 0,
            checkedAt: Date.now(),
        };
    }

    try {
        const parsed = await response.json();
        return {
            ready: Boolean(parsed.ready),
            assetCount: typeof parsed.assetCount === "number" ? parsed.assetCount : 0,
            failedCount: typeof parsed.failedCount === "number" ? parsed.failedCount : 0,
            checkedAt: typeof parsed.checkedAt === "number" ? parsed.checkedAt : Date.now(),
        };
    } catch {
        return {
            ready: false,
            assetCount: 0,
            failedCount: 0,
            checkedAt: Date.now(),
        };
    }
}

function isVersionedAssetRequest(request) {
    const requestUrl = new URL(request.url);
    return (
        requestUrl.pathname.includes("/assets/") &&
        /\.(js|css)$/i.test(requestUrl.pathname)
    );
}

function getPreservedAssetCaches(cacheNames) {
    const assetCaches = cacheNames
        .filter(
            (cacheName) =>
                cacheName.startsWith(CACHE_PREFIX) &&
                cacheName.endsWith("-assets") &&
                cacheName !== ASSET_CACHE
        )
        .sort(compareCacheVersions)
        .reverse()
        .slice(0, 1);

    return new Set(assetCaches);
}

function compareCacheVersions(left, right) {
    const leftVersion = extractCacheVersion(left);
    const rightVersion = extractCacheVersion(right);
    const maxLength = Math.max(leftVersion.length, rightVersion.length);

    for (let index = 0; index < maxLength; index += 1) {
        const leftPart = leftVersion[index] ?? 0;
        const rightPart = rightVersion[index] ?? 0;

        if (leftPart !== rightPart) {
            return leftPart - rightPart;
        }
    }

    return left.localeCompare(right);
}

function extractCacheVersion(cacheName) {
    const match = cacheName.match(/acccalc-v(\d+(?:\.\d+)*)/i);
    if (!match) return [0];
    return match[1].split(".").map((value) => Number(value) || 0);
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
