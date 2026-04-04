import SettingsContent from "./SettingsContent";

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
                            App preferences
                        </h2>
                        <p className="app-body-md mt-2 text-sm">
                            Adjust appearance, navigation behavior, Smart Solver presentation, and study preferences without leaving your current page.
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
    return (
        <>
            <button
                type="button"
                aria-label="Close settings overlay"
                onClick={onClose}
                className={[
                    "app-backdrop fixed inset-0 z-[96] transition duration-300 xl:hidden",
                    open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
                ].join(" ")}
            />

            <aside
                aria-hidden={!open}
                className={[
                    "app-panel-elevated fixed inset-y-0 right-0 z-[97] flex w-full max-w-xl flex-col rounded-none border-l transition-transform duration-300 xl:hidden",
                    open ? "translate-x-0" : "translate-x-full",
                ].join(" ")}
            >
                <SettingsPanelBody onClose={onClose} />
            </aside>
        </>
    );
}
