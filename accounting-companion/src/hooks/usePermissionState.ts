import { useEffect, useState } from "react";
import { getPersistentStorageState } from "../services/storage/storageConsent";
import { isBrowserNotificationRuntimeSupported } from "../services/notifications/notificationScheduler";

type PermissionViewState = "enabled" | "blocked" | "unavailable" | "ask" | "unsupported";

type PermissionStateSummary = {
    camera: PermissionViewState;
    notifications: PermissionViewState;
    storage: PermissionViewState;
    persistentStorage: {
        supported: boolean;
        persisted: boolean;
        quota: number | null;
        usage: number | null;
    };
};

function mapPermissionState(value?: PermissionState | NotificationPermission | null): PermissionViewState {
    if (!value) return "ask";
    if (value === "granted") return "enabled";
    if (value === "denied") return "blocked";
    if (value === "prompt") return "ask";
    return "unavailable";
}

export function usePermissionState() {
    const [state, setState] = useState<PermissionStateSummary>({
        camera: "ask",
        notifications: isBrowserNotificationRuntimeSupported()
            ? mapPermissionState(Notification.permission)
            : "unsupported",
        storage: "ask",
        persistentStorage: {
            supported: false,
            persisted: false,
            quota: null,
            usage: null,
        },
    });

    useEffect(() => {
        let active = true;

        async function sync() {
            const next: PermissionStateSummary = {
                camera: "ask",
                notifications: isBrowserNotificationRuntimeSupported()
                    ? mapPermissionState(Notification.permission)
                    : "unsupported",
                storage: "ask",
                persistentStorage: {
                    supported: false,
                    persisted: false,
                    quota: null,
                    usage: null,
                },
            };

            if (typeof navigator !== "undefined" && "permissions" in navigator) {
                try {
                    const cameraStatus = await navigator.permissions.query({
                        name: "camera" as PermissionName,
                    });
                    next.camera = mapPermissionState(cameraStatus.state);
                } catch {
                    next.camera = "unavailable";
                }
            } else {
                next.camera = "unsupported";
            }

            next.notifications = isBrowserNotificationRuntimeSupported()
                ? mapPermissionState(Notification.permission)
                : "unsupported";

            const storage = await getPersistentStorageState();
            next.persistentStorage = storage;
            next.storage = !storage.supported
                ? "unsupported"
                : storage.persisted
                  ? "enabled"
                  : "ask";

            if (active) {
                setState(next);
            }
        }

        void sync();
        return () => {
            active = false;
        };
    }, []);

    return state;
}
