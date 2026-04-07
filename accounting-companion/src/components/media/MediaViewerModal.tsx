import { useEffect, useState, type ReactNode } from "react";

type MediaViewerModalProps = {
    open: boolean;
    title: string;
    subtitle?: string;
    imageSrc: string | null;
    imageAlt: string;
    helperText?: string;
    footer?: ReactNode;
    onClose: () => void;
};

export default function MediaViewerModal({
    open,
    title,
    subtitle,
    imageSrc,
    imageAlt,
    helperText,
    footer,
    onClose,
}: MediaViewerModalProps) {
    const [imageState, setImageState] = useState<"idle" | "loading" | "ready" | "error">("idle");

    useEffect(() => {
        if (!open) return;

        setImageState(imageSrc ? "loading" : "error");
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previous;
        };
    }, [imageSrc, open]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[70] bg-[color:rgba(8,13,20,0.82)] px-3 py-3 backdrop-blur-sm md:px-6 md:py-6"
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-[1.8rem] border border-white/10 bg-[color:var(--app-surface)] shadow-[0_30px_80px_rgba(0,0,0,0.34)]">
                <div className="flex items-start justify-between gap-4 border-b app-divider px-4 py-4 md:px-6">
                    <div className="min-w-0">
                        <p className="app-card-title text-base md:text-lg">{title}</p>
                        {subtitle ? (
                            <p className="app-body-md mt-1 text-sm">{subtitle}</p>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="app-button-ghost rounded-full px-3 py-1.5 text-sm font-semibold"
                    >
                        Close
                    </button>
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto px-4 py-4 md:px-6 md:py-6">
                    <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
                        <div className="flex min-h-[22rem] items-center justify-center rounded-[1.75rem] bg-white p-4 md:p-8">
                            {imageSrc ? (
                                <>
                                    {imageState === "loading" ? (
                                        <div className="w-full max-w-md animate-pulse space-y-3">
                                            <div className="h-4 rounded-full bg-slate-200" />
                                            <div className="h-[18rem] rounded-[1.2rem] bg-slate-200" />
                                        </div>
                                    ) : null}
                                    <img
                                        src={imageSrc}
                                        alt={imageAlt}
                                        onLoad={() => setImageState("ready")}
                                        onError={() => setImageState("error")}
                                        className={[
                                            "max-h-[70vh] w-full max-w-[34rem] rounded-[1.2rem] object-contain transition",
                                            imageState === "ready" ? "opacity-100" : "opacity-0",
                                        ].join(" ")}
                                    />
                                </>
                            ) : (
                                <div className="max-w-sm text-center">
                                    <p className="text-base font-semibold text-slate-900">
                                        No QR image configured yet
                                    </p>
                                    <p className="mt-2 text-sm text-slate-600">
                                        Add a support QR image to enable the full-screen donation view.
                                    </p>
                                </div>
                            )}

                            {imageState === "error" ? (
                                <div className="max-w-sm text-center">
                                    <p className="text-base font-semibold text-slate-900">
                                        This media could not be loaded
                                    </p>
                                    <p className="mt-2 text-sm text-slate-600">
                                        Check the configured source or try again after reconnecting.
                                    </p>
                                </div>
                            ) : null}
                        </div>

                        <div className="flex flex-col gap-4">
                            {helperText ? (
                                <div className="app-subtle-surface rounded-[1.25rem] px-4 py-4">
                                    <p className="app-body-md text-sm">{helperText}</p>
                                </div>
                            ) : null}
                            {footer}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
