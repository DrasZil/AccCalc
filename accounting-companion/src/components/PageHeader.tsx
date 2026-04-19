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
        <div className="app-page-header app-panel rounded-[var(--app-radius-xl)] p-4.5 md:p-6">
            <div className="app-page-header__row flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="app-page-header__intro min-w-0 max-w-3xl">
                    <div className="app-page-header__meta flex flex-wrap items-center gap-2">
                        {badge ? (
                            <p className="app-kicker inline-flex items-center text-[0.66rem]">
                                {badge}
                            </p>
                        ) : null}
                        <div className="md:hidden">{mobileMeta}</div>
                        <div className="hidden flex-wrap items-center gap-2 md:flex">{meta}</div>
                    </div>
                    <h1 className="app-wrap-anywhere mt-3 max-w-3xl text-[clamp(1.28rem,1.08rem+1vw,2.3rem)] font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                        {title}
                    </h1>
                    <p
                        className={[
                            "app-body-md app-wrap-anywhere max-w-[68ch] text-sm md:text-[0.95rem]",
                            compactDescriptionOnMobile
                                ? "mt-2 hidden md:block"
                                : "mt-2.5",
                        ].join(" ")}
                    >
                        {description}
                    </p>
                </div>

                {actions ? (
                    <div className="app-page-header__actions flex flex-wrap items-center gap-2 lg:justify-end">
                        {actions}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
