/// <reference lib="webworker" />

import { APP_VERSION } from "./utils/appRelease";
import { clientsClaim } from "workbox-core";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope;

type CacheStatusMessage = {
    type: "SW_CACHE_STATUS" | "SW_ASSETS_READY";
    version: string;
    ready: boolean;
    assetCount: number;
    failedCount?: number;
    checkedAt?: number;
};

const CACHE_PREFIX = "acccalc-v";
const CACHE_VERSION = `${CACHE_PREFIX}${APP_VERSION}`;
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const MEDIA_CACHE = `${CACHE_VERSION}-media`;
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

const shellStrategy = new NetworkFirst({
    cacheName: APP_SHELL_CACHE,
    networkTimeoutSeconds: 4,
    plugins: [
        new CacheableResponsePlugin({
            statuses: [200],
        }),
    ],
});

const assetStrategy = new StaleWhileRevalidate({
    cacheName: ASSET_CACHE,
    plugins: [
        new CacheableResponsePlugin({
            statuses: [200],
        }),
        new ExpirationPlugin({
            maxEntries: 80,
            maxAgeSeconds: 60 * 60 * 24 * 14,
        }),
    ],
});

const mediaStrategy = new StaleWhileRevalidate({
    cacheName: MEDIA_CACHE,
    plugins: [
        new CacheableResponsePlugin({
            statuses: [200],
        }),
        new ExpirationPlugin({
            maxEntries: 80,
            maxAgeSeconds: 60 * 60 * 24 * 30,
        }),
    ],
});

clientsClaim();

self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const shellCache = await caches.open(APP_SHELL_CACHE);
            await shellCache.addAll(APP_SHELL_URLS);

            const assets = await loadAssetManifest();
            const precacheResult = await warmAssetCache(assets);
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
            await Promise.all(
                cacheNames.map((cacheName) => {
                    if (
                        cacheName === APP_SHELL_CACHE ||
                        cacheName === ASSET_CACHE ||
                        cacheName === MEDIA_CACHE ||
                        cacheName === META_CACHE
                    ) {
                        return Promise.resolve();
                    }

                    if (!cacheName.startsWith(CACHE_PREFIX)) {
                        return Promise.resolve();
                    }

                    return caches.delete(cacheName);
                })
            );

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
                } satisfies CacheStatusMessage);
            })()
        );
    }
});

registerRoute(
    ({ request }) => request.mode === "navigate",
    async ({ event, request }) => {
        try {
            return await shellStrategy.handle({ event, request });
        } catch {
            return (await caches.match(OFFLINE_URL)) ?? Response.error();
        }
    }
);

registerRoute(
    ({ request }) => request.destination === "script" || request.destination === "style",
    async ({ request, event }) => {
        try {
            return await assetStrategy.handle({ request, event });
        } catch (error) {
            if (isVersionedAssetRequest(request)) {
                await broadcastMessage({
                    type: "SW_DEPLOYMENT_MISMATCH",
                    url: request.url,
                });
            }
            throw error;
        }
    }
);

registerRoute(
    ({ request, url }) =>
        request.destination === "image" ||
        request.destination === "font" ||
        request.destination === "manifest" ||
        url.pathname.endsWith("/asset-manifest.json"),
    ({ request, event }) => mediaStrategy.handle({ request, event })
);

async function loadAssetManifest() {
    try {
        const response = await fetch(ASSET_MANIFEST_URL, { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`Asset manifest failed with status ${response.status}.`);
        }

        const manifest = (await response.json()) as {
            assets?: string[];
        };
        if (!manifest.assets || !Array.isArray(manifest.assets)) {
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

async function warmAssetCache(assets: string[]) {
    const assetCache = await caches.open(ASSET_CACHE);
    const results = await Promise.allSettled(
        assets.map(async (assetUrl) => {
            const request = new Request(assetUrl, { cache: "no-store" });
            const response = await fetch(request);
            if (!response.ok) {
                throw new Error(`Failed to cache ${assetUrl} (${response.status}).`);
            }

            await assetCache.put(request, response.clone());
            return assetUrl;
        })
    );

    const failedCount = results.filter((result) => result.status === "rejected").length;
    return {
        ready: failedCount === 0,
        assetCount: assets.length - failedCount,
        failedCount,
        checkedAt: Date.now(),
    };
}

async function writeCacheStatus(status: {
    ready: boolean;
    assetCount: number;
    failedCount: number;
    checkedAt: number;
}) {
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
        const parsed = (await response.json()) as {
            ready?: boolean;
            assetCount?: number;
            failedCount?: number;
            checkedAt?: number;
        };
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

function isVersionedAssetRequest(request: Request) {
    const requestUrl = new URL(request.url);
    return requestUrl.pathname.includes("/assets/") && /\.(js|css)$/i.test(requestUrl.pathname);
}

async function broadcastMessage(message: Record<string, unknown>) {
    const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
    });

    clients.forEach((client) => {
        client.postMessage(message);
    });
}
