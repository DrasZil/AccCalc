import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "katex/dist/katex.min.css";
import { initializeAppUpdateLifecycle } from "./utils/appUpdate";
import { APP_VERSION } from "./utils/appRelease";
import { initializeOfflineStatusLifecycle } from "./utils/offlineStatus";
const SW_URL = `${import.meta.env.BASE_URL}service-worker.js`;

if (typeof window !== "undefined" && !window.location.hash.startsWith("#/")) {
    const baseUrl = new URL(import.meta.env.BASE_URL, window.location.origin);
    const basePath = baseUrl.pathname.endsWith("/")
        ? baseUrl.pathname
        : `${baseUrl.pathname}/`;
    const currentPath = window.location.pathname;
    const isRootPath = currentPath === basePath || currentPath === basePath.slice(0, -1);

    if (!isRootPath) {
        const normalizedRoute = currentPath.startsWith(basePath)
            ? currentPath.slice(basePath.length - 1)
            : currentPath;
        const nextHash = `#${normalizedRoute}${window.location.search}`;
        window.history.replaceState(null, "", `${basePath}${nextHash}`);
    }
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);

if (import.meta.env.PROD) {
    initializeAppUpdateLifecycle(SW_URL, APP_VERSION);
    initializeOfflineStatusLifecycle();
} else if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
            registration.unregister();
        });
    });

    if ("caches" in window) {
        caches.keys().then((cacheKeys) => {
            cacheKeys.forEach((cacheKey) => {
                caches.delete(cacheKey);
            });
        });
    }
}
