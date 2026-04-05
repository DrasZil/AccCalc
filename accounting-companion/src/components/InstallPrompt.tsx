import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppSettings } from "../utils/appSettings";
import {
    dismissInstallPrompt,
    getInstallGuidance,
    isInstallPromptDismissed,
    triggerNativeInstallPrompt,
    useInstallExperience,
} from "../utils/installExperience";
import AppBrandMark from "./AppBrandMark";

export default function InstallPrompt() {
    const location = useLocation();
    const install = useInstallExperience();
    const [dismissedThisSession, setDismissedThisSession] = useState(false);
    const [copied, setCopied] = useState(false);
    const [installStatus, setInstallStatus] = useState("");
    const settings = useAppSettings();

    const isHomePage = location.pathname === "/";
    const guidance = getInstallGuidance(install);
    const showInstallCard = !dismissedThisSession && !isInstallPromptDismissed();

    async function handleInstall() {
        const outcome = await triggerNativeInstallPrompt();

        if (outcome === "accepted") {
            setInstallStatus("Install prompt accepted.");
            return;
        }

        if (outcome === "dismissed") {
            setInstallStatus("Install prompt dismissed.");
            return;
        }

        setInstallStatus("Native install is not available in this browser right now.");
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

    function handleDismiss() {
        dismissInstallPrompt();
        setDismissedThisSession(true);
    }

    if (
        !settings.showInstallPrompt ||
        !isHomePage ||
        install.isStandalone ||
        !showInstallCard
    ) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[95] mx-auto max-w-lg">
            <div className="app-panel-elevated rounded-[var(--app-radius-lg)] p-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <AppBrandMark compact className="pr-4" />
                        <p className="mt-2 text-sm leading-6 text-[color:var(--app-text-secondary)]">
                            {guidance.summary}
                        </p>

                        {install.platform === "ios-safari" ? (
                            <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-secondary)]">
                                Install on iPhone or iPad through <strong>Safari</strong> using{" "}
                                <strong>Share &gt; Add to Home Screen</strong>.
                            </p>
                        ) : install.platform === "ios-other" ? (
                            <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-secondary)]">
                                Installation on iOS needs <strong>Safari</strong>. Use the guide
                                below for the exact steps.
                            </p>
                        ) : install.canNativePrompt ? (
                            <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-secondary)]">
                                Your browser is ready to show the native install prompt.
                            </p>
                        ) : (
                            <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-secondary)]">
                                If no native prompt appears, keep using the browser version or open
                                the install guide for the platform-specific path.
                            </p>
                        )}

                        {installStatus ? (
                            <p className="mt-3 text-xs leading-5 text-[color:var(--app-text-muted)]">
                                {installStatus}
                            </p>
                        ) : null}
                    </div>

                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="app-icon-button rounded-xl p-2.5"
                        aria-label="Close install prompt"
                    >
                        x
                    </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                    {install.canNativePrompt ? (
                        <button
                            type="button"
                            onClick={handleInstall}
                            className="app-button-primary rounded-xl px-4 py-2 text-sm font-medium"
                        >
                            Install
                        </button>
                    ) : (
                        <Link
                            to="/settings/install"
                            className="app-button-primary rounded-xl px-4 py-2 text-sm font-medium"
                        >
                            Open install guide
                        </Link>
                    )}

                    <button
                        type="button"
                        onClick={handleShare}
                        className="app-button-secondary rounded-xl px-4 py-2 text-sm"
                    >
                        {copied ? "Link copied" : "Share"}
                    </button>

                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="app-button-ghost rounded-xl px-4 py-2 text-sm"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}
