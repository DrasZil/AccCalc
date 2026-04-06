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
import { ShellIcon } from "../features/layout/ShellChrome";
import AppBrandMark from "./AppBrandMark";
import ShareAppButton from "./ShareAppButton";

export default function InstallPrompt({ blocked = false }: { blocked?: boolean }) {
    const location = useLocation();
    const install = useInstallExperience();
    const settings = useAppSettings();
    const [dismissedThisSession, setDismissedThisSession] = useState(false);
    const [installStatus, setInstallStatus] = useState("");

    const isHomePage = location.pathname === "/";
    const guidance = getInstallGuidance(install);
    const showInstallCard = !dismissedThisSession && !isInstallPromptDismissed();
    const canRender =
        settings.showInstallPrompt &&
        isHomePage &&
        !blocked &&
        !install.isStandalone &&
        showInstallCard;

    async function handleInstall() {
        const outcome = await triggerNativeInstallPrompt();

        if (outcome === "accepted") {
            setInstallStatus("Install prompt accepted. Finish the browser step to add AccCalc to your device.");
            return;
        }

        if (outcome === "dismissed") {
            setInstallStatus("Install prompt dismissed. You can reopen install guidance later from Settings.");
            return;
        }

        setInstallStatus("Native install is not available in this browser right now.");
    }

    function handleDismiss() {
        dismissInstallPrompt();
        setDismissedThisSession(true);
    }

    if (!canRender) {
        return null;
    }

    return (
        <section className="app-panel-elevated rounded-[1.7rem] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <AppBrandMark compact className="pr-4" />
                    <p className="app-kicker mt-3 text-[0.68rem]">Install and share</p>
                    <h2 className="mt-2 text-lg font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                        {guidance.headline}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--app-text-secondary)]">
                        {guidance.summary}
                    </p>

                    {install.platform === "ios-safari" ? (
                        <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-secondary)]">
                            Use <strong>Share</strong>, then <strong>Add to Home Screen</strong>.
                            If that action is missing, check <strong>Edit Actions</strong> in the
                            Share sheet.
                        </p>
                    ) : install.platform === "ios-other" ? (
                        <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-secondary)]">
                            Installation on iPhone or iPad needs <strong>Safari</strong>. This
                            browser can still use the cached web version, but the home-screen
                            install flow should be completed from Safari.
                        </p>
                    ) : install.canNativePrompt ? (
                        <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-secondary)]">
                            Your browser is ready to show the native install prompt.
                        </p>
                    ) : (
                        <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-secondary)]">
                            If no native prompt appears, open the install guide for the correct
                            browser-specific path instead of guessing.
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
                    className="app-icon-button shrink-0 rounded-xl p-2.5"
                    aria-label="Close install prompt"
                >
                    <ShellIcon kind="close" className="h-4 w-4" />
                </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                {install.canNativePrompt ? (
                    <button
                        type="button"
                        onClick={() => {
                            void handleInstall();
                        }}
                        className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
                    >
                        Install app
                    </button>
                ) : (
                    <Link
                        to="/settings/install"
                        className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
                    >
                        Open install guide
                    </Link>
                )}

                <ShareAppButton
                    label="Share app"
                    shareText="Try AccCalc for accounting, finance, and business calculations with guided installation and offline-safe local routes after caching."
                />

                {!install.canNativePrompt ? (
                    <Link
                        to="/settings/install"
                        className="app-button-ghost rounded-xl px-4 py-2.5 text-sm font-medium"
                    >
                        Install help
                    </Link>
                ) : null}

                <button
                    type="button"
                    onClick={handleDismiss}
                    className="app-button-ghost rounded-xl px-4 py-2.5 text-sm font-medium"
                >
                    Dismiss
                </button>
            </div>
        </section>
    );
}
