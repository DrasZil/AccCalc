import { useEffect } from "react";
import SettingsContent from "./SettingsContent";
import ViewportPortal from "../../components/ViewportPortal";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";

type SettingsDrawerProps = {
    open: boolean;
    onClose: () => void;
};

function CloseIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        >
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
        </svg>
    );
}

export function SettingsPanelBody({
    onClose,
    compact = true,
}: {
    onClose: () => void;
    compact?: boolean;
}) {
    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="border-b app-divider px-5 py-4 md:px-6 md:py-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="app-kicker text-[0.68rem]">Settings</p>
                        <h2 className="mt-2 text-[1.55rem] font-bold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)] md:text-[1.8rem]">
                            App settings
                        </h2>
                        <p className="app-body-md mt-2 text-sm">
                            Manage appearance, calculator behavior, Smart Solver, offline use, and accessibility from one organized panel.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close settings"
                        className="app-icon-button rounded-xl p-2.5"
                    >
                        <CloseIcon />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 scrollbar-premium md:p-6">
                <SettingsContent compact={compact} onNavigate={onClose} />
            </div>
        </div>
    );
}

export default function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
    const shouldLockBody =
        open &&
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 1279px)").matches;
    useBodyScrollLock(shouldLockBody);

    useEffect(() => {
        if (!open) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose, open]);

    return (
        <ViewportPortal>
            <>
                <button
                    type="button"
                    aria-label="Close settings overlay"
                    onClick={onClose}
                    className={[
                        "app-backdrop fixed inset-0 z-[100] transition duration-300 xl:hidden",
                        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
                    ].join(" ")}
                />

                <aside
                    aria-hidden={!open}
                    role="dialog"
                    aria-modal="true"
                    aria-label="App settings"
                    className={[
                        "app-settings-drawer app-panel-elevated fixed inset-0 z-[101] flex w-screen flex-col border-0 transition-transform duration-300 xl:hidden",
                        open ? "translate-x-0" : "translate-x-full",
                    ].join(" ")}
                    style={{
                        height: "var(--app-mobile-panel-height, var(--app-viewport-height, 100dvh))",
                        paddingTop: "env(safe-area-inset-top, 0px)",
                        paddingBottom: "env(safe-area-inset-bottom, 0px)",
                    }}
                >
                    <SettingsPanelBody onClose={onClose} />
                </aside>
            </>
        </ViewportPortal>
    );
}
