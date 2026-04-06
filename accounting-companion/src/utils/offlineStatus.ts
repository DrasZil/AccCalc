import { useSyncExternalStore } from "react";

type CacheStatusMessage = {
    type: "SW_CACHE_STATUS" | "SW_ASSETS_READY";
    version: string;
    ready: boolean;
    assetCount: number;
    failedCount?: number;
    checkedAt?: number;
};

type DeploymentMismatchMessage = {
    type: "SW_DEPLOYMENT_MISMATCH";
    url: string;
};

export type OfflineBundleStatus = Readonly<{
    supported: boolean;
    ready: boolean;
    version: string | null;
    assetCount: number;
    failedCount: number;
    checkedAt: number;
    deploymentMismatch: boolean;
    mismatchUrl: string | null;
}>;

const DEFAULT_STATUS: OfflineBundleStatus = Object.freeze({
    supported: false,
    ready: false,
    version: null,
    assetCount: 0,
    failedCount: 0,
    checkedAt: 0,
    deploymentMismatch: false,
    mismatchUrl: null,
});

let currentStatus = DEFAULT_STATUS;
let initialized = false;

const listeners = new Set<() => void>();

function emit(nextStatus: OfflineBundleStatus) {
    if (
        currentStatus.supported === nextStatus.supported &&
        currentStatus.ready === nextStatus.ready &&
        currentStatus.version === nextStatus.version &&
        currentStatus.assetCount === nextStatus.assetCount &&
        currentStatus.failedCount === nextStatus.failedCount &&
        currentStatus.checkedAt === nextStatus.checkedAt &&
        currentStatus.deploymentMismatch === nextStatus.deploymentMismatch &&
        currentStatus.mismatchUrl === nextStatus.mismatchUrl
    ) {
        return;
    }

    currentStatus = Object.freeze(nextStatus);
    listeners.forEach((listener) => listener());
}

function patchStatus(patch: Partial<OfflineBundleStatus>) {
    emit(
        Object.freeze({
            ...currentStatus,
            ...patch,
        })
    );
}

function applyCacheStatus(message: CacheStatusMessage) {
    patchStatus({
        supported: true,
        ready: message.ready,
        version: message.version,
        assetCount: message.assetCount,
        failedCount: message.failedCount ?? 0,
        checkedAt: message.checkedAt ?? Date.now(),
    });
}

function isDynamicImportFailure(reason: unknown) {
    const message =
        reason instanceof Error ? reason.message : typeof reason === "string" ? reason : "";

    return /dynamically imported module|Failed to fetch dynamically imported module|importing a module script failed/i.test(
        message
    );
}

function markDeploymentMismatch(url?: string | null) {
    patchStatus({
        deploymentMismatch: true,
        mismatchUrl: url ?? null,
        checkedAt: Date.now(),
    });
}

function queryServiceWorkerCacheStatus() {
    if (
        typeof navigator === "undefined" ||
        !("serviceWorker" in navigator) ||
        !navigator.serviceWorker.controller
    ) {
        patchStatus({
            supported: "serviceWorker" in navigator,
            ready: false,
            assetCount: 0,
        });
        return;
    }

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event: MessageEvent<CacheStatusMessage>) => {
        const message = event.data;
        if (!message || (message.type !== "SW_CACHE_STATUS" && message.type !== "SW_ASSETS_READY")) {
            return;
        }

        applyCacheStatus(message);
    };

    navigator.serviceWorker.controller.postMessage(
        { type: "GET_CACHE_STATUS" },
        [messageChannel.port2]
    );
}

function handleServiceWorkerMessage(
    event: MessageEvent<CacheStatusMessage | DeploymentMismatchMessage>
) {
    const message = event.data;
    if (!message || typeof message !== "object" || !("type" in message)) return;

    if (message.type === "SW_CACHE_STATUS" || message.type === "SW_ASSETS_READY") {
        applyCacheStatus(message);
        return;
    }

    if (message.type === "SW_DEPLOYMENT_MISMATCH") {
        markDeploymentMismatch(message.url);
    }
}

export function initializeOfflineStatusLifecycle() {
    if (initialized || typeof window === "undefined") {
        return;
    }

    initialized = true;
    patchStatus({
        supported: "serviceWorker" in navigator,
    });

    if (!("serviceWorker" in navigator)) {
        return;
    }

    navigator.serviceWorker.addEventListener("message", handleServiceWorkerMessage);
    navigator.serviceWorker.addEventListener("controllerchange", () => {
        queryServiceWorkerCacheStatus();
    });

    window.addEventListener("load", queryServiceWorkerCacheStatus);
    window.addEventListener("online", queryServiceWorkerCacheStatus);
    window.addEventListener("error", (event) => {
        if (isDynamicImportFailure(event.error ?? event.message)) {
            markDeploymentMismatch(null);
        }
    });
    window.addEventListener("unhandledrejection", (event) => {
        if (isDynamicImportFailure(event.reason)) {
            markDeploymentMismatch(null);
        }
    });

    queryServiceWorkerCacheStatus();
}

export function clearDeploymentMismatch() {
    if (!currentStatus.deploymentMismatch && !currentStatus.mismatchUrl) {
        return;
    }

    patchStatus({
        deploymentMismatch: false,
        mismatchUrl: null,
    });
}

export function useOfflineBundleStatus() {
    initializeOfflineStatusLifecycle();

    return useSyncExternalStore(
        (callback) => {
            listeners.add(callback);
            return () => listeners.delete(callback);
        },
        () => currentStatus,
        () => DEFAULT_STATUS
    );
}
