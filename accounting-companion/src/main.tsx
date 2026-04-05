import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { APP_VERSION } from "./utils/appRelease";
const SW_URL = `${import.meta.env.BASE_URL}sw.js`;

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

if ("serviceWorker" in navigator && import.meta.env.PROD) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register(SW_URL)
            .then((registration) => {
                registration.update();

                if (registration.waiting) {
                    registration.waiting.postMessage({ type: "SKIP_WAITING" });
                }

                registration.addEventListener("updatefound", () => {
                    const installingWorker = registration.installing;
                    if (!installingWorker) return;

                    installingWorker.addEventListener("statechange", () => {
                        if (
                            installingWorker.state === "installed" &&
                            navigator.serviceWorker.controller
                        ) {
                            installingWorker.postMessage({ type: "SKIP_WAITING" });
                        }
                    });
                });

                let hasReloaded = false;

                navigator.serviceWorker.addEventListener("controllerchange", () => {
                    if (hasReloaded) return;
                    hasReloaded = true;
                    window.sessionStorage.setItem(
                        "accalc-update-banner",
                        JSON.stringify({ version: APP_VERSION, at: Date.now() })
                    );
                    window.location.reload();
                });
            })
            .catch((error) =>
                console.error("Service worker registration failed:", error)
            );
    });
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
