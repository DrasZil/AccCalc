import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

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
    const [showPrompt, setShowPrompt] = useState(false);
    const [showIOSHelp, setShowIOSHelp] = useState(true);

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
        setShowPrompt(true);
        };

        const handleAppInstalled = () => {
        setDeferredPrompt(null);
        setShowPrompt(false);
        setShowIOSHelp(false);
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
        setShowPrompt(false);
        }
    }

    if (!isHomePage || isStandalone) return null;

    if (isIOS && showIOSHelp) {
        return (
        <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-white/10 bg-neutral-900/95 p-4 text-white shadow-xl backdrop-blur">
            <p className="text-sm font-semibold">Install AccCalc</p>
            <p className="mt-2 text-sm text-gray-300">
            On iPhone/iPad, tap <strong>Share</strong> then choose{" "}
            <strong>Add to Home Screen</strong>.
            </p>
            <button
            onClick={() => setShowIOSHelp(false)}
            className="mt-3 rounded-xl bg-white/10 px-4 py-2 text-sm"
            >
            Close
            </button>
        </div>
        );
    }

    if (!showPrompt || !deferredPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-white/10 bg-neutral-900/95 p-4 text-white shadow-xl backdrop-blur">
        <p className="text-sm font-semibold">Install AccCalc</p>
        <p className="mt-2 text-sm text-gray-300">
            Add AccCalc to your device for faster access and a more app-like experience.
        </p>

        <div className="mt-4 flex gap-3">
            <button
            onClick={handleInstall}
            className="rounded-xl bg-green-500/80 px-4 py-2 text-sm font-medium text-white"
            >
            Install
            </button>
            <button
            onClick={() => setShowPrompt(false)}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm"
            >
            Not now
            </button>
        </div>
        </div>
    );
}