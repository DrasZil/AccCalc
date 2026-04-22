import { useSyncExternalStore } from "react";
import { isThemeFamily, type ThemeFamily } from "./themePreferences.js";

export type ThemePreference = "system" | "dark" | "light";

export type AppSettings = {
    autoExpandActiveNavGroup: boolean;
    compactMobileChrome: boolean;
    showInstallPrompt: boolean;
    smartSolverShowPromptExamples: boolean;
    smartSolverMaxSuggestions: number;
    smartSolverDefaultMode: "compute" | "beginner" | "professional";
    smartSolverPreferGuidedSetup: boolean;
    smartSolverShowStudyNotes: boolean;
    rememberDesktopSidebarVisibility: boolean;
    enableMotionEffects: boolean;
    highContrastMode: boolean;
    preferredCurrency: string;
    showFeedbackReminders: boolean;
    showOpeningAnimation: boolean;
    showNewFeatureIndicators: boolean;
    saveOfflineHistory: boolean;
    scanRetentionEnabled: boolean;
    reminderNotificationsEnabled: boolean;
    reminderCategory:
        | "study-motivation"
        | "struggle-motivation"
        | "comfort"
        | "focus"
        | "saved-work";
    reminderTone: "soft" | "focused" | "motivational" | "comforting" | "practical";
    reminderFrequency: "rare" | "light" | "moderate";
    themePreference: ThemePreference;
    themeFamily: ThemeFamily;
};

const STORAGE_KEY = "accalc-app-settings";
const SETTINGS_UPDATED_EVENT = "accalc-settings-updated";
let cachedSettingsRaw: string | null | undefined;
let cachedSettingsSnapshot: AppSettings;

export const DEFAULT_APP_SETTINGS: AppSettings = {
    autoExpandActiveNavGroup: false,
    compactMobileChrome: true,
    showInstallPrompt: true,
    smartSolverShowPromptExamples: true,
    smartSolverMaxSuggestions: 4,
    smartSolverDefaultMode: "beginner",
    smartSolverPreferGuidedSetup: true,
    smartSolverShowStudyNotes: true,
    rememberDesktopSidebarVisibility: true,
    enableMotionEffects: true,
    highContrastMode: false,
    preferredCurrency: "PHP",
    showFeedbackReminders: true,
    showOpeningAnimation: true,
    showNewFeatureIndicators: true,
    saveOfflineHistory: true,
    scanRetentionEnabled: true,
    reminderNotificationsEnabled: false,
    reminderCategory: "study-motivation",
    reminderTone: "soft",
    reminderFrequency: "rare",
    themePreference: "system",
    themeFamily: "classic",
};

cachedSettingsSnapshot = DEFAULT_APP_SETTINGS;

function sanitizeThemePreference(value: unknown): ThemePreference {
    return value === "dark" || value === "light" || value === "system"
        ? value
        : DEFAULT_APP_SETTINGS.themePreference;
}

function sanitizeSmartSolverMode(
    value: unknown
): AppSettings["smartSolverDefaultMode"] {
    return value === "compute" || value === "professional" || value === "beginner"
        ? value
        : DEFAULT_APP_SETTINGS.smartSolverDefaultMode;
}

function sanitizeThemeFamily(value: unknown): ThemeFamily {
    return isThemeFamily(value) ? value : DEFAULT_APP_SETTINGS.themeFamily;
}

function sanitizeSettings(value: Partial<AppSettings> | null | undefined): AppSettings {
    return {
        autoExpandActiveNavGroup:
            value?.autoExpandActiveNavGroup ?? DEFAULT_APP_SETTINGS.autoExpandActiveNavGroup,
        compactMobileChrome:
            value?.compactMobileChrome ?? DEFAULT_APP_SETTINGS.compactMobileChrome,
        showInstallPrompt: value?.showInstallPrompt ?? DEFAULT_APP_SETTINGS.showInstallPrompt,
        smartSolverShowPromptExamples:
            value?.smartSolverShowPromptExamples ??
            DEFAULT_APP_SETTINGS.smartSolverShowPromptExamples,
        smartSolverMaxSuggestions:
            typeof value?.smartSolverMaxSuggestions === "number"
                ? Math.min(6, Math.max(2, Math.round(value.smartSolverMaxSuggestions)))
                : DEFAULT_APP_SETTINGS.smartSolverMaxSuggestions,
        smartSolverDefaultMode: sanitizeSmartSolverMode(
            value?.smartSolverDefaultMode
        ),
        smartSolverPreferGuidedSetup:
            value?.smartSolverPreferGuidedSetup ??
            DEFAULT_APP_SETTINGS.smartSolverPreferGuidedSetup,
        smartSolverShowStudyNotes:
            value?.smartSolverShowStudyNotes ??
            DEFAULT_APP_SETTINGS.smartSolverShowStudyNotes,
        rememberDesktopSidebarVisibility:
            value?.rememberDesktopSidebarVisibility ??
            DEFAULT_APP_SETTINGS.rememberDesktopSidebarVisibility,
        enableMotionEffects:
            value?.enableMotionEffects ?? DEFAULT_APP_SETTINGS.enableMotionEffects,
        highContrastMode:
            value?.highContrastMode ?? DEFAULT_APP_SETTINGS.highContrastMode,
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
        scanRetentionEnabled:
            value?.scanRetentionEnabled ?? DEFAULT_APP_SETTINGS.scanRetentionEnabled,
        reminderNotificationsEnabled:
            value?.reminderNotificationsEnabled ??
            DEFAULT_APP_SETTINGS.reminderNotificationsEnabled,
        reminderCategory:
            value?.reminderCategory === "struggle-motivation" ||
            value?.reminderCategory === "comfort" ||
            value?.reminderCategory === "focus" ||
            value?.reminderCategory === "saved-work" ||
            value?.reminderCategory === "study-motivation"
                ? value.reminderCategory
                : DEFAULT_APP_SETTINGS.reminderCategory,
        reminderTone:
            value?.reminderTone === "focused" ||
            value?.reminderTone === "motivational" ||
            value?.reminderTone === "comforting" ||
            value?.reminderTone === "practical" ||
            value?.reminderTone === "soft"
                ? value.reminderTone
                : DEFAULT_APP_SETTINGS.reminderTone,
        reminderFrequency:
            value?.reminderFrequency === "light" ||
            value?.reminderFrequency === "moderate" ||
            value?.reminderFrequency === "rare"
                ? value.reminderFrequency
                : DEFAULT_APP_SETTINGS.reminderFrequency,
        themePreference: sanitizeThemePreference(value?.themePreference),
        themeFamily: sanitizeThemeFamily(value?.themeFamily),
    };
}

export function readAppSettings(): AppSettings {
    if (typeof window === "undefined") {
        return DEFAULT_APP_SETTINGS;
    }

    try {
        const rawValue = window.localStorage.getItem(STORAGE_KEY);
        if (rawValue === cachedSettingsRaw) {
            return cachedSettingsSnapshot;
        }

        if (!rawValue) {
            cachedSettingsRaw = rawValue;
            cachedSettingsSnapshot = DEFAULT_APP_SETTINGS;
            return cachedSettingsSnapshot;
        }

        const parsedValue = JSON.parse(rawValue) as Partial<AppSettings>;
        cachedSettingsRaw = rawValue;
        cachedSettingsSnapshot = sanitizeSettings(parsedValue);
        return cachedSettingsSnapshot;
    } catch {
        cachedSettingsRaw = null;
        cachedSettingsSnapshot = DEFAULT_APP_SETTINGS;
        return cachedSettingsSnapshot;
    }
}

export function updateAppSettings(nextValue: Partial<AppSettings>) {
    if (typeof window === "undefined") return;

    const mergedSettings = sanitizeSettings({
        ...readAppSettings(),
        ...nextValue,
    });

    const serializedSettings = JSON.stringify(mergedSettings);
    cachedSettingsRaw = serializedSettings;
    cachedSettingsSnapshot = mergedSettings;
    window.localStorage.setItem(STORAGE_KEY, serializedSettings);
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
