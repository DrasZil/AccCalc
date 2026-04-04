type PageHeaderProps = {
    title: string;
    description: string;
    badge?: string;
};

export default function PageHeader({
    title,
    description,
    badge,
}: PageHeaderProps) {
    return (
        <div className="app-panel-elevated rounded-[var(--app-radius-xl)] p-6 md:p-8 lg:p-10">
            {badge ? (
                <p className="app-chip-accent mb-3 inline-flex items-center rounded-full px-3 py-1">
                    {badge}
                </p>
            ) : null}
            <h1 className="max-w-4xl text-[clamp(2rem,1.45rem+2vw,3.7rem)] font-bold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                {title}
            </h1>
            <p className="app-body-lg mt-4 max-w-3xl text-sm md:text-base">
                {description}
            </p>
        </div>
    );
}
