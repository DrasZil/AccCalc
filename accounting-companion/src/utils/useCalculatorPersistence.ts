import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppSettings } from "./appSettings";

function readStoredValue(storageKey: string, fallbackValue: string) {
    if (typeof window === "undefined") return fallbackValue;

    try {
        return window.localStorage.getItem(storageKey) ?? fallbackValue;
    } catch {
        return fallbackValue;
    }
}

export function usePersistedCalculatorField(fieldKey: string, initialValue = "") {
    const { pathname } = useLocation();
    const settings = useAppSettings();
    const storageKey = useMemo(
        () => `accalc-tool-draft:${pathname}:${fieldKey}`,
        [fieldKey, pathname]
    );

    const [value, setValue] = useState(() =>
        settings.saveOfflineHistory
            ? readStoredValue(storageKey, initialValue)
            : initialValue
    );

    useEffect(() => {
        const nextValue = settings.saveOfflineHistory
            ? readStoredValue(storageKey, initialValue)
            : initialValue;

        const timer = window.setTimeout(() => {
            setValue(nextValue);
        }, 0);

        return () => window.clearTimeout(timer);
    }, [initialValue, settings.saveOfflineHistory, storageKey]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            if (!settings.saveOfflineHistory || value.trim() === "") {
                window.localStorage.removeItem(storageKey);
                return;
            }

            window.localStorage.setItem(storageKey, value);
        } catch {
            // Ignore storage write failures so calculations keep working.
        }
    }, [settings.saveOfflineHistory, storageKey, value]);

    return [value, setValue] as const;
}
