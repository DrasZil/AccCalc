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
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7">
        {badge && (
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-green-300">
            {badge}
            </p>
        )}
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-300 md:text-base">
            {description}
        </p>
        </div>
    );
}