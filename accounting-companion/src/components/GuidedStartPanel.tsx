import type { ReactNode } from "react";

export type GuidedStartStep = {
    title: string;
    description: string;
    badge?: string;
};

type GuidedStartPanelProps = {
    badge?: string;
    title: string;
    summary: string;
    steps: GuidedStartStep[];
    actions?: ReactNode;
    compact?: boolean;
};

export default function GuidedStartPanel({
    badge = "Start here",
    title,
    summary,
    steps,
    actions,
    compact = false,
}: GuidedStartPanelProps) {
    return (
        <section
            className={[
                "app-guided-start app-panel rounded-[var(--app-radius-xl)]",
                compact ? "p-4 md:p-5" : "p-4.5 md:p-6",
            ].join(" ")}
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                    <p className="app-kicker text-[0.68rem]">{badge}</p>
                    <h2 className="mt-2.5 text-[clamp(1.1rem,1rem+0.6vw,1.5rem)] font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                        {title}
                    </h2>
                    <p className="app-body-md mt-2 text-sm">{summary}</p>
                </div>

                {actions ? (
                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">{actions}</div>
                ) : null}
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
                {steps.map((step, index) => (
                    <div
                        key={`${step.title}-${index}`}
                        className="app-guided-start__step app-subtle-surface rounded-[1.15rem] px-4 py-4"
                    >
                        <div className="flex items-center gap-3">
                            <span className="app-guided-start__index inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                                {index + 1}
                            </span>
                            <span className="app-helper text-[0.72rem] font-semibold uppercase tracking-[0.14em]">
                                {step.badge ?? `Step ${index + 1}`}
                            </span>
                        </div>
                        <p className="mt-3 text-sm font-semibold text-[color:var(--app-text)]">
                            {step.title}
                        </p>
                        <p className="app-helper mt-1.5 text-xs leading-5">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
