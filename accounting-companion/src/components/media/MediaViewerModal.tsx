import { useEffect, useState, type ReactNode } from "react";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import ViewportPortal from "../ViewportPortal";

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
    useBodyScrollLock(open);

    useEffect(() => {
        if (!open) return;

        setImageState(imageSrc ? "loading" : "error");
    }, [imageSrc, open]);

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

    if (!open) return null;

    return (
        <ViewportPortal>
            <div
                className="app-support-modal-layer"
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={onClose}
            >
                <div
                    className="app-support-modal-panel"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="app-support-modal-panel__header">
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

                    <div className="app-support-modal-panel__body">
                        <div className="app-support-modal-panel__grid">
                            <div className="app-support-modal-panel__media">
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
                                                "app-support-modal-panel__image",
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
        </ViewportPortal>
    );
}
