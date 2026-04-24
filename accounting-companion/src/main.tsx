import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "katex/dist/katex.min.css";
import { initializeAppUpdateLifecycle } from "./utils/appUpdate";
import { readAppSettings } from "./utils/appSettings";
import { APP_VERSION } from "./utils/appRelease";
import { initializeOfflineStatusLifecycle } from "./utils/offlineStatus";
import { getThemeMetaColor, resolveThemeMode } from "./utils/themePreferences";
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

if (typeof window !== "undefined" && typeof document !== "undefined") {
    const initialSettings = readAppSettings();
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolvedTheme = resolveThemeMode(
        initialSettings.themePreference,
        systemPrefersDark
    );
    const resolvedThemeFamily = initialSettings.themeFamily;

    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.dataset.themeFamily = resolvedThemeFamily;
    document.documentElement.dataset.contrast = initialSettings.highContrastMode
        ? "high"
        : "normal";
    document.body.dataset.theme = resolvedTheme;
    document.body.dataset.themeFamily = resolvedThemeFamily;
    document.body.dataset.contrast = initialSettings.highContrastMode ? "high" : "normal";
    document.body.dataset.motion = initialSettings.enableMotionEffects ? "on" : "off";

    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
        themeColorMeta.setAttribute(
            "content",
            getThemeMetaColor(resolvedTheme, resolvedThemeFamily)
        );
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
