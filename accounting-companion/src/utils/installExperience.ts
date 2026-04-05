import { useSyncExternalStore } from "react";

export type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export type InstallPlatformKind =
    | "installed"
    | "ios-safari"
    | "ios-other"
    | "android-chromium"
    | "android-other"
    | "desktop-chromium"
    | "desktop-other";

export type InstallExperienceSnapshot = Readonly<{
    platform: InstallPlatformKind;
    browserLabel: string;
    isStandalone: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    isSafari: boolean;
    isChromium: boolean;
    canNativePrompt: boolean;
    canShare: boolean;
}>;

const INSTALL_DISMISS_KEY = "accalc-install-dismissed-until";
const INSTALL_UPDATED_EVENT = "accalc-install-state-updated";

const SERVER_SNAPSHOT: InstallExperienceSnapshot = Object.freeze({
    platform: "desktop-other",
    browserLabel: "Browser",
    isStandalone: false,
    isIOS: false,
    isAndroid: false,
    isSafari: false,
    isChromium: false,
    canNativePrompt: false,
    canShare: false,
});

let installPromptEvent: BeforeInstallPromptEvent | null = null;
let cachedSnapshot = SERVER_SNAPSHOT;
let installStoreInitialized = false;
const listeners = new Set<() => void>();

function getNavigator() {
    return typeof window !== "undefined" ? window.navigator : null;
}

function detectInstallSnapshot(): InstallExperienceSnapshot {
    const navigatorRef = getNavigator();

    if (!navigatorRef || typeof window === "undefined") {
        return SERVER_SNAPSHOT;
    }

    const userAgent = navigatorRef.userAgent.toLowerCase();
    const platform = navigatorRef.platform?.toLowerCase?.() ?? "";
    const touchPoints = navigatorRef.maxTouchPoints ?? 0;
    const isIOS =
        /iphone|ipad|ipod/.test(userAgent) ||
        (platform.includes("mac") && touchPoints > 1);
    const isAndroid = /android/.test(userAgent);
    const isChromium =
        /chrome|chromium|crios|edg|opr/.test(userAgent) &&
        !/fxios/.test(userAgent);
    const isSafari =
        /safari/.test(userAgent) &&
        !/chrome|chromium|crios|fxios|edg|opr|android/.test(userAgent);
    const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigatorRef as Navigator & { standalone?: boolean }).standalone === true;

    let platformKind: InstallPlatformKind;
    if (isStandalone) {
        platformKind = "installed";
    } else if (isIOS && isSafari) {
        platformKind = "ios-safari";
    } else if (isIOS) {
        platformKind = "ios-other";
    } else if (isAndroid && isChromium) {
        platformKind = "android-chromium";
    } else if (isAndroid) {
        platformKind = "android-other";
    } else if (isChromium) {
        platformKind = "desktop-chromium";
    } else {
        platformKind = "desktop-other";
    }

    const browserLabel = isIOS
        ? isSafari
            ? "Safari on iPhone or iPad"
            : "iPhone or iPad browser"
        : isAndroid
          ? isChromium
              ? "Android Chromium browser"
              : "Android browser"
          : isChromium
            ? "Chromium-based desktop browser"
            : isSafari
              ? "Safari"
              : "Desktop browser";

    return Object.freeze({
        platform: platformKind,
        browserLabel,
        isStandalone,
        isIOS,
        isAndroid,
        isSafari,
        isChromium,
        canNativePrompt: Boolean(installPromptEvent),
        canShare: typeof navigatorRef.share === "function",
    });
}

function emitInstallSnapshot() {
    const nextSnapshot = detectInstallSnapshot();

    if (
        cachedSnapshot.platform === nextSnapshot.platform &&
        cachedSnapshot.browserLabel === nextSnapshot.browserLabel &&
        cachedSnapshot.isStandalone === nextSnapshot.isStandalone &&
        cachedSnapshot.isIOS === nextSnapshot.isIOS &&
        cachedSnapshot.isAndroid === nextSnapshot.isAndroid &&
        cachedSnapshot.isSafari === nextSnapshot.isSafari &&
        cachedSnapshot.isChromium === nextSnapshot.isChromium &&
        cachedSnapshot.canNativePrompt === nextSnapshot.canNativePrompt &&
        cachedSnapshot.canShare === nextSnapshot.canShare
    ) {
        return;
    }

    cachedSnapshot = nextSnapshot;
    listeners.forEach((listener) => listener());
}

function ensureInstallStore() {
    if (installStoreInitialized || typeof window === "undefined") {
        return;
    }

    installStoreInitialized = true;
    cachedSnapshot = detectInstallSnapshot();

    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        installPromptEvent = event as BeforeInstallPromptEvent;
        emitInstallSnapshot();
    });

    window.addEventListener("appinstalled", () => {
        installPromptEvent = null;
        emitInstallSnapshot();
    });
}

function subscribeInstallExperience(listener: () => void) {
    if (typeof window === "undefined") {
        return () => undefined;
    }

    ensureInstallStore();
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

export function readInstallExperience(): InstallExperienceSnapshot {
    ensureInstallStore();
    return cachedSnapshot;
}

export function useInstallExperience(): InstallExperienceSnapshot {
    return useSyncExternalStore(
        subscribeInstallExperience,
        readInstallExperience,
        () => SERVER_SNAPSHOT
    );
}

export async function triggerNativeInstallPrompt() {
    if (!installPromptEvent) {
        return "unavailable" as const;
    }

    const promptEvent = installPromptEvent;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    installPromptEvent = null;
    emitInstallSnapshot();
    return choice.outcome;
}

function readDismissedUntilRaw() {
    if (typeof window === "undefined") return 0;

    const raw = window.localStorage.getItem(INSTALL_DISMISS_KEY);
    const value = raw ? Number(raw) : 0;
    return Number.isFinite(value) ? value : 0;
}

export function readInstallPromptDismissedUntil() {
    return readDismissedUntilRaw();
}

export function isInstallPromptDismissed() {
    return readDismissedUntilRaw() > Date.now();
}

export function dismissInstallPrompt(days = 10) {
    if (typeof window === "undefined") return;

    const nextValue = Date.now() + days * 24 * 60 * 60 * 1000;
    window.localStorage.setItem(INSTALL_DISMISS_KEY, String(nextValue));
    window.dispatchEvent(new Event(INSTALL_UPDATED_EVENT));
}

export function clearInstallPromptDismissal() {
    if (typeof window === "undefined") return;

    window.localStorage.removeItem(INSTALL_DISMISS_KEY);
    window.dispatchEvent(new Event(INSTALL_UPDATED_EVENT));
}

export function getInstallGuidance(snapshot: InstallExperienceSnapshot) {
    switch (snapshot.platform) {
        case "installed":
            return {
                headline: "AccCalc is already installed",
                summary:
                    "Launches should open in the standalone app shell on this device.",
                steps: [
                    "Use the home screen or app launcher shortcut to reopen it quickly.",
                    "Keep the app online occasionally so updated calculator logic and assets can refresh safely.",
                ],
            };
        case "ios-safari":
            return {
                headline: "Install from Safari with Add to Home Screen",
                summary:
                    "iPhone and iPad browsers do not expose the same native install prompt used by Chromium browsers.",
                steps: [
                    "Open AccCalc in Safari.",
                    "Tap Share in the browser toolbar.",
                    "Choose Add to Home Screen. If you do not see it, open Edit Actions and enable it there.",
                    "Launch from the new home-screen icon for the standalone web-app view.",
                ],
            };
        case "ios-other":
            return {
                headline: "Use Safari for iPhone and iPad installation",
                summary:
                    "This browser can browse AccCalc, but iOS home-screen installation is handled through Safari.",
                steps: [
                    "Open the same AccCalc link in Safari.",
                    "Tap Share, then Add to Home Screen. If that entry is missing, check Edit Actions first.",
                    "Return to the new icon to launch the standalone experience.",
                ],
            };
        case "android-chromium":
            return {
                headline: snapshot.canNativePrompt
                    ? "This browser can show the install prompt"
                    : "Android install is available from the browser UI",
                summary:
                    "Android Chromium browsers can install directly when browser heuristics allow it.",
                steps: snapshot.canNativePrompt
                    ? [
                          "Use the Install button in AccCalc to trigger the native prompt.",
                          "If you dismiss it, you can reopen the install guide later from Settings.",
                      ]
                    : [
                          "Open the browser menu.",
                          "Choose Install app or Add to Home Screen if the browser offers it.",
                          "If the menu option is missing, keep using the cached browser version until the prompt becomes available.",
                      ],
            };
        case "android-other":
            return {
                headline: "Android support depends on the current browser",
                summary:
                    "Some Android browsers support installation only through their own menu, while others do not expose app install controls.",
                steps: [
                    "Check the browser menu for Install app or Add to Home Screen.",
                    "If no install option exists, AccCalc can still work offline in the browser after the necessary assets are cached.",
                ],
            };
        case "desktop-chromium":
            return {
                headline: snapshot.canNativePrompt
                    ? "Desktop installation is ready"
                    : "Desktop installation depends on browser availability",
                summary:
                    "Chromium-based desktop browsers can install AccCalc, but the prompt is still controlled by browser heuristics.",
                steps: snapshot.canNativePrompt
                    ? [
                          "Use the Install button to open the native browser prompt.",
                          "After installation, reopen AccCalc from your desktop or app launcher.",
                      ]
                    : [
                          "Check the address bar or browser menu for Install app.",
                          "If no install entry appears, continue using the browser version. Offline-safe features still work after caching.",
                      ],
            };
        default:
            return {
                headline: "Use the browser version with offline caching where supported",
                summary:
                    "This browser may not provide a native install prompt, so AccCalc focuses on a consistent browser experience and honest offline guidance.",
                steps: [
                    "Bookmark the app or pin the tab if install is unavailable.",
                    "Load the calculators you use most while online so the browser can cache them for offline-safe reuse later.",
                ],
            };
    }
}
