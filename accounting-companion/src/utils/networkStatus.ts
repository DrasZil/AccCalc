import { useSyncExternalStore } from "react";

export type NetworkStatus = Readonly<{
    online: boolean;
}>;

const ONLINE_SNAPSHOT: NetworkStatus = Object.freeze({ online: true });
const OFFLINE_SNAPSHOT: NetworkStatus = Object.freeze({ online: false });

export function getNetworkStatusSnapshot(isOnline: boolean): NetworkStatus {
    return isOnline ? ONLINE_SNAPSHOT : OFFLINE_SNAPSHOT;
}

function readNetworkStatus(): NetworkStatus {
    if (typeof navigator === "undefined") {
        return ONLINE_SNAPSHOT;
    }

    return getNetworkStatusSnapshot(navigator.onLine);
}

function subscribe(callback: () => void) {
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
