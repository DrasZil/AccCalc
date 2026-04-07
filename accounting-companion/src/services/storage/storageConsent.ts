const SCAN_RETENTION_KEY = "accalc-scan-retention";

export function readScanRetentionConsent() {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem(SCAN_RETENTION_KEY) !== "off";
}

export function updateScanRetentionConsent(enabled: boolean) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SCAN_RETENTION_KEY, enabled ? "on" : "off");
}

export async function getPersistentStorageState() {
    if (typeof navigator === "undefined" || !("storage" in navigator)) {
        return {
            supported: false,
            persisted: false,
            quota: null as number | null,
            usage: null as number | null,
        };
    }

    const estimate = navigator.storage.estimate
        ? await navigator.storage.estimate()
        : null;
    const persisted = navigator.storage.persisted
        ? await navigator.storage.persisted()
        : false;

    return {
        supported: true,
        persisted,
        quota: estimate?.quota ?? null,
        usage: estimate?.usage ?? null,
    };
}

