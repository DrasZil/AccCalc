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

export default function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
    return (
        <>
            <button
                type="button"
                aria-label="Close settings overlay"
                onClick={onClose}
                className={[
                    "fixed inset-x-0 bottom-0 top-[4.45rem] z-40 bg-black/55 backdrop-blur-[1px] transition duration-300 md:top-[5.2rem]",
                    open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
                ].join(" ")}
            />

            <aside
                aria-hidden={!open}
                className={[
                    "fixed bottom-0 right-0 top-[4.45rem] z-50 flex w-full max-w-xl flex-col rounded-tl-[2rem] border-l border-t border-white/10 bg-[linear-gradient(180deg,rgba(8,12,10,0.98),rgba(4,5,5,0.98))] shadow-[0_30px_80px_rgba(0,0,0,0.4)] transition-transform duration-300 md:top-[5.2rem]",
                    open ? "translate-x-0" : "translate-x-full",
                ].join(" ")}
            >
                <div className="flex h-full min-h-0 flex-col">
                    <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-300">
                                Settings
                            </p>
                            <h2 className="mt-2 text-xl font-bold tracking-tight text-white md:text-2xl">
                                App preferences
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-gray-400">
                                Adjust app behavior without leaving your current page.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close settings"
                            className="inline-flex rounded-xl border border-white/10 bg-white/5 p-2.5 text-white transition hover:bg-white/10"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 scrollbar-premium">
                        <SettingsContent compact onNavigate={onClose} />
                    </div>
                </div>
            </aside>
        </>
    );
}
