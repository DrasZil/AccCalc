import type { ReactNode } from "react";

type PageHeaderProps = {
    title: string;
    description: string;
    badge?: string;
    actions?: ReactNode;
    meta?: ReactNode;
    mobileMeta?: ReactNode;
    compactDescriptionOnMobile?: boolean;
};

export default function PageHeader({
    title,
    description,
    badge,
    actions,
    meta,
    mobileMeta,
    compactDescriptionOnMobile = false,
}: PageHeaderProps) {
    return (
        <div className="app-page-header app-panel rounded-[var(--app-radius-xl)] p-3.5 md:p-5">
            <div className="app-page-header__row flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="app-page-header__intro min-w-0 max-w-3xl">
                    <div className="app-page-header__meta flex flex-wrap items-center gap-2">
                        {badge ? (
                            <p className="app-chip-accent inline-flex items-center rounded-full px-2.5 py-1 text-[0.62rem]">
                                {badge}
                            </p>
                        ) : null}
                        <div className="md:hidden">{mobileMeta}</div>
                        <div className="hidden flex-wrap items-center gap-2 md:flex">{meta}</div>
                    </div>
                    <h1 className="mt-2.5 max-w-3xl text-[clamp(1.2rem,1.04rem+1vw,2.15rem)] font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                        {title}
                    </h1>
                    <p
                        className={[
                            "app-body-md max-w-2xl text-sm",
                            compactDescriptionOnMobile
                                ? "mt-1.5 hidden md:block"
                                : "app-clamp-2 mt-2",
                        ].join(" ")}
                    >
                        {description}
                    </p>
                </div>

                {actions ? (
                    <div className="app-page-header__actions flex flex-wrap items-center gap-1.5 lg:justify-end">
                        {actions}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
