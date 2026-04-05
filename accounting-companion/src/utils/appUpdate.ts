import { useSyncExternalStore } from "react";

export type AppUpdatePhase =
    | "idle"
    | "checking"
    | "update-available"
    | "applying"
    | "refresh-required";

export type AppUpdateState = Readonly<{
    supported: boolean;
    currentVersion: string;
    availableVersion: string | null;
    phase: AppUpdatePhase;
    updateReady: boolean;
    lastCheckedAt: number;
    lastReadyAt: number;
    lastActivatedAt: number;
    deferredUntil: number;
    waitingForReload: boolean;
}>;

type ServiceWorkerMessage =
    | {
          type: "SW_UPDATE_READY";
          version: string;
      }
    | {
          type: "SW_ACTIVATED";
          version: string;
      };

const DEFAULT_STATE: AppUpdateState = Object.freeze({
    supported: false,
    currentVersion: "",
    availableVersion: null,
    phase: "idle",
    updateReady: false,
    lastCheckedAt: 0,
    lastReadyAt: 0,
    lastActivatedAt: 0,
    deferredUntil: 0,
    waitingForReload: false,
});

const UPDATE_BANNER_KEY = "accalc-update-banner";
const UPDATE_DEFER_KEY = "accalc-update-defer";
const UPDATE_RELOAD_KEY = "accalc-update-reload-version";
const CHECK_INTERVAL_MS = 15 * 60 * 1000;
const VISIBILITY_CHECK_THROTTLE_MS = 90 * 1000;
const PROMPT_DEFER_MS = 30 * 60 * 1000;

let currentState = DEFAULT_STATE;
let initialized = false;
let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
let lastInteractionAt = 0;
let hasUserInteracted = false;
let lastVisibilityTriggeredCheckAt = 0;
let autoApplyTimer: number | null = null;
let applyingUpdate = false;

const listeners = new Set<() => void>();

function emitState(nextState: AppUpdateState) {
    if (
        currentState.supported === nextState.supported &&
        currentState.currentVersion === nextState.currentVersion &&
        currentState.availableVersion === nextState.availableVersion &&
        currentState.phase === nextState.phase &&
        currentState.updateReady === nextState.updateReady &&
        currentState.lastCheckedAt === nextState.lastCheckedAt &&
        currentState.lastReadyAt === nextState.lastReadyAt &&
        currentState.lastActivatedAt === nextState.lastActivatedAt &&
        currentState.deferredUntil === nextState.deferredUntil &&
        currentState.waitingForReload === nextState.waitingForReload
    ) {
        return;
    }

    currentState = Object.freeze(nextState);
    listeners.forEach((listener) => listener());
}

function patchState(patch: Partial<AppUpdateState>) {
    emitState(
        Object.freeze({
            ...currentState,
            ...patch,
        })
    );
}

function readDeferredState(version: string | null) {
    if (typeof window === "undefined" || !version) return 0;

    try {
        const raw = window.localStorage.getItem(UPDATE_DEFER_KEY);
        if (!raw) return 0;
        const parsed = JSON.parse(raw) as { version?: string; until?: number };
        if (parsed.version !== version) return 0;
        return typeof parsed.until === "number" ? parsed.until : 0;
    } catch {
        return 0;
    }
}

function storeDeferredState(version: string | null, until: number) {
    if (typeof window === "undefined" || !version) return;

    window.localStorage.setItem(
        UPDATE_DEFER_KEY,
        JSON.stringify({ version, until })
    );
}

function clearDeferredState(version?: string | null) {
    if (typeof window === "undefined") return;

    if (!version) {
        window.localStorage.removeItem(UPDATE_DEFER_KEY);
        return;
    }

    const until = readDeferredState(version);
    if (until > 0) {
        window.localStorage.removeItem(UPDATE_DEFER_KEY);
    }
}

function markUserInteraction() {
    hasUserInteracted = true;
    lastInteractionAt = Date.now();
}

function hasFocusedEditableElement() {
    if (typeof document === "undefined") return false;

    const activeElement = document.activeElement as HTMLElement | null;
    if (!activeElement) return false;

    if (activeElement.closest("[data-allow-auto-update='true']")) {
        return false;
    }

    return Boolean(
        activeElement.matches("input, textarea, select, [contenteditable='true']")
    );
}

function hasLikelyActiveWork() {
    if (typeof document === "undefined") return false;

    if (hasFocusedEditableElement()) return true;

    const mainRoot =
        document.querySelector("main") ?? document.getElementById("root") ?? document.body;

    const fields = Array.from(
        mainRoot.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
            "input, textarea, select"
        )
    ).filter(
        (field) =>
            !field.disabled &&
            field.type !== "hidden" &&
            !field.closest("[data-allow-auto-update='true']")
    );

    return fields.some((field) => {
        if (field instanceof HTMLInputElement) {
            if (field.type === "checkbox" || field.type === "radio") {
                return field.checked;
            }
        }

        return field.value.trim() !== "";
    });
}

function isDeferred(version: string | null) {
    return readDeferredState(version) > Date.now();
}

function canAutoApplyUpdate() {
    if (typeof document === "undefined" || typeof navigator === "undefined") {
        return false;
    }

    if (!navigator.onLine) return false;
    if (document.visibilityState === "hidden") return true;
    if (hasLikelyActiveWork()) return false;
    if (!hasUserInteracted) return true;

    return Date.now() - lastInteractionAt > 45_000;
}

function clearAutoApplyTimer() {
    if (autoApplyTimer !== null) {
        window.clearTimeout(autoApplyTimer);
        autoApplyTimer = null;
    }
}

function reloadToActivatedVersion(version: string | null) {
    if (typeof window === "undefined") return;

    const reloadVersion = version ?? "latest";
    const lastReloadedVersion = window.sessionStorage.getItem(UPDATE_RELOAD_KEY);

    if (lastReloadedVersion === reloadVersion) {
        return;
    }

    window.sessionStorage.setItem(
        UPDATE_BANNER_KEY,
        JSON.stringify({ version: reloadVersion, at: Date.now() })
    );
    window.sessionStorage.setItem(UPDATE_RELOAD_KEY, reloadVersion);
    window.location.reload();
}

function maybePromptForRefresh(version: string | null) {
    patchState({
        availableVersion: version,
        updateReady: true,
        waitingForReload: true,
        phase: "refresh-required",
        deferredUntil: readDeferredState(version),
    });
}

function applyWaitingUpdate(mode: "auto" | "manual") {
    if (!serviceWorkerRegistration?.waiting) {
        return false;
    }

    applyingUpdate = true;
    clearDeferredState(currentState.availableVersion);
    patchState({
        phase: "applying",
        deferredUntil: 0,
    });

    serviceWorkerRegistration.waiting.postMessage({
        type: "SKIP_WAITING",
        mode,
    });
    return true;
}

function scheduleAutoApplyIfSafe() {
    clearAutoApplyTimer();

    if (!currentState.updateReady || !serviceWorkerRegistration?.waiting) {
        return;
    }

    if (!canAutoApplyUpdate()) {
        patchState({
            phase: currentState.waitingForReload ? "refresh-required" : "update-available",
        });
        return;
    }

    if (document.visibilityState === "hidden") {
        applyWaitingUpdate("auto");
        return;
    }

    autoApplyTimer = window.setTimeout(() => {
        autoApplyTimer = null;
        if (currentState.updateReady && canAutoApplyUpdate()) {
            applyWaitingUpdate("auto");
        }
    }, hasUserInteracted ? 2500 : 1200);
}

function markUpdateReady(version: string | null) {
    const deferredUntil = readDeferredState(version);

    patchState({
        availableVersion: version,
        phase: "update-available",
        updateReady: true,
        lastReadyAt: Date.now(),
        waitingForReload: false,
        deferredUntil,
    });

    if (!isDeferred(version)) {
        scheduleAutoApplyIfSafe();
    }
}

function handleWorkerMessage(event: MessageEvent<ServiceWorkerMessage>) {
    const message = event.data;
    if (!message || typeof message !== "object" || !("type" in message)) return;

    if (message.type === "SW_UPDATE_READY") {
        if (
            typeof navigator !== "undefined" &&
            !navigator.serviceWorker.controller &&
            !serviceWorkerRegistration?.waiting
        ) {
            return;
        }

        markUpdateReady(message.version);
        return;
    }

    if (message.type === "SW_ACTIVATED") {
        clearAutoApplyTimer();
        patchState({
            availableVersion: message.version,
            lastActivatedAt: Date.now(),
        });

        if (applyingUpdate || canAutoApplyUpdate()) {
            reloadToActivatedVersion(message.version);
        } else {
            maybePromptForRefresh(message.version);
        }
    }
}

function handleControllerChange() {
    if (typeof navigator === "undefined" || !navigator.serviceWorker.controller) {
        return;
    }

    clearAutoApplyTimer();

    if (applyingUpdate || canAutoApplyUpdate()) {
        reloadToActivatedVersion(currentState.availableVersion);
    } else {
        maybePromptForRefresh(currentState.availableVersion);
    }
}

async function checkForUpdatesInternal(reason: string) {
    if (!serviceWorkerRegistration || typeof navigator === "undefined" || !navigator.onLine) {
        return false;
    }

    patchState({
        phase:
            currentState.updateReady || currentState.waitingForReload
                ? currentState.phase
                : "checking",
        lastCheckedAt: Date.now(),
    });

    try {
        await serviceWorkerRegistration.update();

        if (serviceWorkerRegistration.waiting) {
            markUpdateReady(currentState.availableVersion);
        } else if (!currentState.updateReady && !currentState.waitingForReload) {
            patchState({ phase: "idle" });
        }

        return true;
    } catch (error) {
        console.error(`AccCalc update check failed during ${reason}:`, error);
        if (!currentState.updateReady && !currentState.waitingForReload) {
            patchState({ phase: "idle" });
        }
        return false;
    }
}

function installLifecycleListeners() {
    if (typeof window === "undefined" || initialized) {
        return;
    }

    window.addEventListener("pointerdown", markUserInteraction, { passive: true });
    window.addEventListener("keydown", markUserInteraction);
    window.addEventListener("input", markUserInteraction, true);

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            if (currentState.updateReady && serviceWorkerRegistration?.waiting) {
                applyWaitingUpdate("auto");
            }
            return;
        }

        const now = Date.now();
        if (now - lastVisibilityTriggeredCheckAt >= VISIBILITY_CHECK_THROTTLE_MS) {
            lastVisibilityTriggeredCheckAt = now;
            checkForUpdatesInternal("visibility");
        }

        if (currentState.updateReady && !isDeferred(currentState.availableVersion)) {
            scheduleAutoApplyIfSafe();
        }
    });

    window.addEventListener("online", () => {
        checkForUpdatesInternal("online");
        if (currentState.updateReady && !isDeferred(currentState.availableVersion)) {
            scheduleAutoApplyIfSafe();
        }
    });

    window.addEventListener("focus", () => {
        const now = Date.now();
        if (now - lastVisibilityTriggeredCheckAt >= VISIBILITY_CHECK_THROTTLE_MS) {
            lastVisibilityTriggeredCheckAt = now;
            checkForUpdatesInternal("focus");
        }
    });
}

export function initializeAppUpdateLifecycle(swUrl: string, version: string) {
    if (initialized || typeof window === "undefined") {
        return;
    }

    initialized = true;
    const existingReloadVersion = window.sessionStorage.getItem(UPDATE_RELOAD_KEY);
    if (existingReloadVersion === version) {
        window.sessionStorage.removeItem(UPDATE_RELOAD_KEY);
    }

    emitState(
        Object.freeze({
            ...DEFAULT_STATE,
            supported: "serviceWorker" in navigator,
            currentVersion: version,
            deferredUntil: readDeferredState(null),
        })
    );

    if (!("serviceWorker" in navigator) || !import.meta.env.PROD) {
        return;
    }

    installLifecycleListeners();

    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register(swUrl, { updateViaCache: "none" })
            .then((registration) => {
                serviceWorkerRegistration = registration;
                patchState({ supported: true, phase: "idle" });

                if (registration.waiting) {
                    markUpdateReady(currentState.availableVersion);
                }

                registration.addEventListener("updatefound", () => {
                    const installingWorker = registration.installing;
                    if (!installingWorker) return;

                    installingWorker.addEventListener("statechange", () => {
                        if (
                            installingWorker.state === "installed" &&
                            navigator.serviceWorker.controller
                        ) {
                            markUpdateReady(currentState.availableVersion);
                        }
                    });
                });

                navigator.serviceWorker.addEventListener("message", handleWorkerMessage);
                navigator.serviceWorker.addEventListener(
                    "controllerchange",
                    handleControllerChange
                );

                void checkForUpdatesInternal("load");

                window.setInterval(() => {
                    void checkForUpdatesInternal("interval");
                }, CHECK_INTERVAL_MS);
            })
            .catch((error) => {
                console.error("Service worker registration failed:", error);
                patchState({ supported: false });
            });
    });
}

export function useAppUpdateState() {
    return useSyncExternalStore(
        (callback) => {
            listeners.add(callback);
            return () => listeners.delete(callback);
        },
        () => currentState,
        () => DEFAULT_STATE
    );
}

export function deferAppUpdatePrompt() {
    const version = currentState.availableVersion;
    if (!version) return;

    const until = Date.now() + PROMPT_DEFER_MS;
    storeDeferredState(version, until);
    patchState({
        deferredUntil: until,
        phase: currentState.waitingForReload ? "refresh-required" : "update-available",
    });
}

export function applyAppUpdateNow() {
    if (currentState.waitingForReload) {
        reloadToActivatedVersion(currentState.availableVersion);
        return true;
    }

    return applyWaitingUpdate("manual");
}

export function checkForAppUpdates() {
    return checkForUpdatesInternal("manual");
}
