import { useEffect } from "react";

type ScanToastProps = {
    open: boolean;
    title: string;
    body?: string;
    tone?: "info" | "success" | "warning";
    onClose: () => void;
};

export default function ScanToast({
    open,
    title,
    body,
    tone = "info",
    onClose,
}: ScanToastProps) {
    useEffect(() => {
        if (!open) return;
        const timeout = window.setTimeout(onClose, 4200);
        return () => window.clearTimeout(timeout);
    }, [onClose, open]);

    if (!open) return null;

    const toneClass =
        tone === "success"
            ? "app-tone-success"
            : tone === "warning"
              ? "app-tone-warning"
              : "app-tone-info";

    return (
        <div className="pointer-events-none fixed inset-x-3 bottom-4 z-[80] flex justify-center md:bottom-6 md:justify-end">
            <div
                className={[
                    "pointer-events-auto w-full max-w-md rounded-[1.2rem] border px-4 py-3 shadow-[var(--app-shadow-lg)] backdrop-blur-xl animate-[fade-rise_220ms_ease]",
                    toneClass,
                ].join(" ")}
                role="status"
                aria-live="polite"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                            {title}
                        </p>
                        {body ? (
                            <p className="mt-1 break-words text-xs leading-5 text-[color:var(--app-text-secondary)]">
                                {body}
                            </p>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="app-button-ghost rounded-full px-2.5 py-1 text-xs font-semibold"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
