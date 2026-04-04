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

    const isIOS = useMemo(() => {
        return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    }, []);

    const isStandalone = useMemo(() => {
        const nav = window.navigator as NavigatorWithStandalone;

        return (
        window.matchMedia("(display-mode: standalone)").matches ||
        nav.standalone === true
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
        text: "Try AccCalc — an accounting calculator and learning companion.",
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

    if (!settings.showInstallPrompt || !isHomePage || isStandalone || !showInstallCard) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-white/10 bg-neutral-900/95 p-4 text-white shadow-xl backdrop-blur">
        <p className="text-sm font-semibold">Install or Share AccCalc</p>
        <p className="mt-2 text-sm text-gray-300">
            Save AccCalc to your device for faster access, or share it with classmates and friends.
        </p>

        {isIOS ? (
            <p className="mt-3 text-sm text-gray-300">
            On iPhone/iPad, tap <strong>Share</strong> then choose{" "}
            <strong>Add to Home Screen</strong>.
            </p>
        ) : deferredPrompt ? (
            <p className="mt-3 text-sm text-gray-300">
            Your browser supports installation. Tap <strong>Install</strong> below.
            </p>
        ) : (
            <p className="mt-3 text-sm text-gray-300">
            If install is not shown automatically, use your browser menu and look for{" "}
            <strong>Install app</strong> or <strong>Add to Home Screen</strong>.
            </p>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
            {!isIOS && deferredPrompt && (
            <button
                onClick={handleInstall}
                className="rounded-xl bg-green-500/80 px-4 py-2 text-sm font-medium text-white"
            >
                Install
            </button>
            )}

            <button
            onClick={handleShare}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm"
            >
            {copied ? "Link copied" : "Share"}
            </button>

            <button
            onClick={() => setShowInstallCard(false)}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm"
            >
            Close
            </button>
        </div>
        </div>
    );
}
