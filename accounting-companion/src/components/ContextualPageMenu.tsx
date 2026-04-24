import { useEffect, useId, useState, type ReactNode } from "react";
import useBodyScrollLock from "../hooks/useBodyScrollLock";
import ViewportPortal from "./ViewportPortal";

type ContextualPageMenuProps = {
    title: string;
    description: string;
    badge?: string;
    buttonLabel?: string;
    children: ReactNode;
};

export default function ContextualPageMenu({
    title,
    description,
    badge,
    buttonLabel = "Page menu",
    children,
}: ContextualPageMenuProps) {
    const [open, setOpen] = useState(false);
    const titleId = useId();
    useBodyScrollLock(open);

    useEffect(() => {
        if (!open) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [open]);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="app-button-secondary inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold"
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={titleId}
            >
                <span className="hidden sm:inline">{buttonLabel}</span>
                <span className="sm:hidden">Menu</span>
                <span aria-hidden="true">...</span>
            </button>

            {open ? (
                <ViewportPortal>
                    <div className="app-page-menu-layer" role="presentation">
                        <button
                            type="button"
                            className="app-page-menu-backdrop"
                            aria-label="Close page menu"
                            onClick={() => setOpen(false)}
                        />

                        <section
                            id={titleId}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={`${titleId}-heading`}
                            className="app-page-menu-panel"
                        >
                            <div className="app-page-menu-panel__header">
                                <div className="min-w-0">
                                    {badge ? (
                                        <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                            {badge}
                                        </span>
                                    ) : null}
                                    <h2
                                        id={`${titleId}-heading`}
                                        className="mt-3 text-[1.1rem] font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]"
                                    >
                                        {title}
                                    </h2>
                                    <p className="app-helper mt-2 text-sm leading-6">
                                        {description}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="app-button-ghost inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
                                    aria-label="Close page menu"
                                >
                                    X
                                </button>
                            </div>

                            <div className="app-page-menu-panel__body">{children}</div>
                        </section>
                    </div>
                </ViewportPortal>
            ) : null}
        </>
    );
}
