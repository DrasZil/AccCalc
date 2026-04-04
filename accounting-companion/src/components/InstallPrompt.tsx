import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppSettings } from "../utils/appSettings";

type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type NavigatorWithStandalone = Navigator & {
    standalone?: boolean;
};

export default function InstallPrompt() {
    const location = useLocation();
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallCard, setShowInstallCard] = useState(true);
    const [copied, setCopied] = useState(false);
    const settings = useAppSettings();

    const isHomePage = location.pathname === "/";

    const isIOS = useMemo(() => /iphone|ipad|ipod/i.test(window.navigator.userAgent), []);

    const isStandalone = useMemo(() => {
        const navigatorWithStandalone = window.navigator as NavigatorWithStandalone;

        return (
            window.matchMedia("(display-mode: standalone)").matches ||
            navigatorWithStandalone.standalone === true
        );
    }, []);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setDeferredPrompt(event as BeforeInstallPromptEvent);
        };

        const handleAppInstalled = () => {
            setDeferredPrompt(null);
            setShowInstallCard(false);
        };

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt as EventListener
        );
        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt as EventListener
            );
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    async function handleInstall() {
        if (!deferredPrompt) return;

        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;

        if (choice.outcome === "accepted" || choice.outcome === "dismissed") {
            setDeferredPrompt(null);
        }
    }

    async function handleShare() {
        const shareData = {
            title: "AccCalc",
            text: "Try AccCalc, an accounting calculator and learning companion.",
            url: window.location.origin,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }

            await navigator.clipboard.writeText(window.location.origin);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Share failed:", error);
        }
    }

    if (!settings.showInstallPrompt || !isHomePage || isStandalone || !showInstallCard) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[95] mx-auto max-w-lg">
            <div className="app-panel-elevated rounded-[var(--app-radius-lg)] p-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                            Install or Share AccCalc
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[color:var(--app-text-secondary)]">
                            Save AccCalc to your device for faster access, or share it with
                            classmates and friends.
                        </p>

                        {isIOS ? (
                            <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-secondary)]">
                                On iPhone or iPad, tap <strong>Share</strong> then choose{" "}
                                <strong>Add to Home Screen</strong>.
                            </p>
                        ) : deferredPrompt ? (
                            <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-secondary)]">
                                Your browser supports installation. Tap <strong>Install</strong>{" "}
                                below.
                            </p>
                        ) : (
                            <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-secondary)]">
                                If install is not shown automatically, use your browser menu and
                                look for <strong>Install app</strong> or{" "}
                                <strong>Add to Home Screen</strong>.
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowInstallCard(false)}
                        className="app-icon-button rounded-xl p-2.5"
                        aria-label="Close install prompt"
                    >
                        x
                    </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                    {!isIOS && deferredPrompt ? (
                        <button
                            type="button"
                            onClick={handleInstall}
                            className="app-button-primary rounded-xl px-4 py-2 text-sm font-medium"
                        >
                            Install
                        </button>
                    ) : null}

                    <button
                        type="button"
                        onClick={handleShare}
                        className="app-button-secondary rounded-xl px-4 py-2 text-sm"
                    >
                        {copied ? "Link copied" : "Share"}
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowInstallCard(false)}
                        className="app-button-ghost rounded-xl px-4 py-2 text-sm"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}
