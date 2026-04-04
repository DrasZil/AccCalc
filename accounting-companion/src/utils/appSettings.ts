import { useSyncExternalStore } from "react";

export type AppSettings = {
    autoExpandActiveNavGroup: boolean;
    showInstallPrompt: boolean;
    smartSolverShowPromptExamples: boolean;
    smartSolverMaxSuggestions: number;
    rememberDesktopSidebarVisibility: boolean;
    enableMotionEffects: boolean;
    preferredCurrency: string;
    showFeedbackReminders: boolean;
    showOpeningAnimation: boolean;
    showNewFeatureIndicators: boolean;
    saveOfflineHistory: boolean;
};

const STORAGE_KEY = "accalc-app-settings";
const SETTINGS_UPDATED_EVENT = "accalc-settings-updated";

export const DEFAULT_APP_SETTINGS: AppSettings = {
    autoExpandActiveNavGroup: false,
    showInstallPrompt: true,
    smartSolverShowPromptExamples: true,
    smartSolverMaxSuggestions: 4,
    rememberDesktopSidebarVisibility: true,
    enableMotionEffects: true,
    preferredCurrency: "PHP",
    showFeedbackReminders: true,
    showOpeningAnimation: true,
    showNewFeatureIndicators: true,
    saveOfflineHistory: true,
};

function sanitizeSettings(value: Partial<AppSettings> | null | undefined): AppSettings {
    return {
        autoExpandActiveNavGroup: value?.autoExpandActiveNavGroup ?? DEFAULT_APP_SETTINGS.autoExpandActiveNavGroup,
        showInstallPrompt: value?.showInstallPrompt ?? DEFAULT_APP_SETTINGS.showInstallPrompt,
        smartSolverShowPromptExamples:
            value?.smartSolverShowPromptExamples ?? DEFAULT_APP_SETTINGS.smartSolverShowPromptExamples,
        smartSolverMaxSuggestions:
            typeof value?.smartSolverMaxSuggestions === "number"
                ? Math.min(6, Math.max(2, Math.round(value.smartSolverMaxSuggestions)))
                : DEFAULT_APP_SETTINGS.smartSolverMaxSuggestions,
        rememberDesktopSidebarVisibility:
            value?.rememberDesktopSidebarVisibility ?? DEFAULT_APP_SETTINGS.rememberDesktopSidebarVisibility,
        enableMotionEffects:
            value?.enableMotionEffects ?? DEFAULT_APP_SETTINGS.enableMotionEffects,
        preferredCurrency:
            typeof value?.preferredCurrency === "string" && value.preferredCurrency.trim() !== ""
                ? value.preferredCurrency.toUpperCase()
                : DEFAULT_APP_SETTINGS.preferredCurrency,
        showFeedbackReminders:
            value?.showFeedbackReminders ?? DEFAULT_APP_SETTINGS.showFeedbackReminders,
        showOpeningAnimation:
            value?.showOpeningAnimation ?? DEFAULT_APP_SETTINGS.showOpeningAnimation,
        showNewFeatureIndicators:
            value?.showNewFeatureIndicators ?? DEFAULT_APP_SETTINGS.showNewFeatureIndicators,
        saveOfflineHistory:
            value?.saveOfflineHistory ?? DEFAULT_APP_SETTINGS.saveOfflineHistory,
    };
}

export function readAppSettings(): AppSettings {
    if (typeof window === "undefined") {
        return DEFAULT_APP_SETTINGS;
    }

    try {
        const rawValue = window.localStorage.getItem(STORAGE_KEY);
        if (!rawValue) return DEFAULT_APP_SETTINGS;

        const parsedValue = JSON.parse(rawValue) as Partial<AppSettings>;
        return sanitizeSettings(parsedValue);
    } catch {
        return DEFAULT_APP_SETTINGS;
    }
}

export function updateAppSettings(nextValue: Partial<AppSettings>) {
    if (typeof window === "undefined") return;

    const mergedSettings = sanitizeSettings({
        ...readAppSettings(),
        ...nextValue,
    });

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedSettings));
    window.dispatchEvent(new Event(SETTINGS_UPDATED_EVENT));
}

function subscribe(callback: () => void) {
    if (typeof window === "undefined") {
        return () => undefined;
    }

    const handleUpdate = () => callback();

    window.addEventListener("storage", handleUpdate);
    window.addEventListener(SETTINGS_UPDATED_EVENT, handleUpdate);

    return () => {
        window.removeEventListener("storage", handleUpdate);
        window.removeEventListener(SETTINGS_UPDATED_EVENT, handleUpdate);
    };
}

export function useAppSettings(): AppSettings {
    return useSyncExternalStore(subscribe, readAppSettings, () => DEFAULT_APP_SETTINGS);
}
