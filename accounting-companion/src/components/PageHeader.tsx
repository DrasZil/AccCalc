import type { ReactNode } from "react";

type PageHeaderProps = {
    title: string;
    description: string;
    badge?: string;
    actions?: ReactNode;
    meta?: ReactNode;
};

export default function PageHeader({
    title,
    description,
    badge,
    actions,
    meta,
}: PageHeaderProps) {
    return (
        <div className="app-panel-elevated app-hero-panel rounded-[var(--app-radius-xl)] p-5 md:p-7 lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 max-w-4xl">
                    <div className="flex flex-wrap items-center gap-2">
                        {badge ? (
                            <p className="app-chip-accent inline-flex items-center rounded-full px-3 py-1">
                                {badge}
                            </p>
                        ) : null}
                        {meta}
                    </div>
                    <h1 className="mt-4 max-w-4xl text-[clamp(1.85rem,1.3rem+2vw,3.45rem)] font-bold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                        {title}
                    </h1>
                    <p className="app-body-lg mt-3 max-w-3xl text-sm md:text-base">
                        {description}
                    </p>
                </div>

                {actions ? (
                    <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
                        {actions}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
