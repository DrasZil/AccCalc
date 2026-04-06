import { useId, useState, type ReactNode } from "react";

type DisclosurePanelProps = {
    title: string;
    summary?: string;
    badge?: string;
    defaultOpen?: boolean;
    compact?: boolean;
    className?: string;
    contentClassName?: string;
    headerActions?: ReactNode;
    children: ReactNode;
};

function Chevron({ open }: { open: boolean }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={["h-4 w-4 transition-transform duration-200", open ? "rotate-180" : ""].join(
                " "
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 9l6 6 6-6" />
        </svg>
    );
}

export default function DisclosurePanel({
    title,
    summary,
    badge,
    defaultOpen = false,
    compact = false,
    className = "",
    contentClassName = "",
    headerActions,
    children,
}: DisclosurePanelProps) {
    const [open, setOpen] = useState(defaultOpen);
    const contentId = useId();

    return (
        <section className={["app-panel rounded-[var(--app-radius-lg)]", className].join(" ")}>
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
                aria-controls={contentId}
                className={[
                    "flex w-full items-start justify-between gap-4 text-left",
                    compact ? "px-3.5 py-3 md:px-4 md:py-3.5" : "px-4 py-4 md:px-5",
                ].join(" ")}
            >
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3
                            className={[
                                "font-semibold tracking-[-0.02em] text-[color:var(--app-text)]",
                                compact ? "text-[0.92rem]" : "text-[0.96rem]",
                            ].join(" ")}
                        >
                            {title}
                        </h3>
                        {badge ? (
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                {badge}
                            </span>
                        ) : null}
                    </div>
                    {summary ? <p className="app-helper mt-1.5 text-xs leading-5">{summary}</p> : null}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    {headerActions}
                    <span
                        className={[
                            "app-button-ghost inline-flex items-center gap-2 rounded-full font-semibold uppercase tracking-[0.14em]",
                            compact ? "px-2.5 py-1.5 text-[0.64rem]" : "px-3 py-1.5 text-[0.68rem]",
                        ].join(" ")}
                    >
                        {open ? "Hide" : "Show"}
                        <Chevron open={open} />
                    </span>
                </div>
            </button>

            <div
                id={contentId}
                className={[
                    "grid overflow-hidden transition-all duration-300",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                ].join(" ")}
            >
                <div className="min-h-0 overflow-hidden">
                    <div
                        className={[
                            "border-t app-divider",
                            compact ? "px-3.5 py-3.5 md:px-4 md:py-4" : "px-4 py-4 md:px-5",
                            contentClassName,
                        ].join(" ")}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}
