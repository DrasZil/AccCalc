import { useSyncExternalStore } from "react";
const ONLINE_SNAPSHOT = Object.freeze({ online: true });
const OFFLINE_SNAPSHOT = Object.freeze({ online: false });
export function getNetworkStatusSnapshot(isOnline) {
    return isOnline ? ONLINE_SNAPSHOT : OFFLINE_SNAPSHOT;
}
function readNetworkStatus() {
    if (typeof navigator === "undefined") {
        return ONLINE_SNAPSHOT;
    }
    return getNetworkStatusSnapshot(navigator.onLine);
}
function subscribe(callback) {
    if (typeof window === "undefined") {
        return () => undefined;
    }
    window.addEventListener("online", callback);
    window.addEventListener("offline", callback);
    return () => {
        window.removeEventListener("online", callback);
        window.removeEventListener("offline", callback);
    };
}
export function useNetworkStatus() {
    return useSyncExternalStore(subscribe, readNetworkStatus, () => ONLINE_SNAPSHOT);
}
