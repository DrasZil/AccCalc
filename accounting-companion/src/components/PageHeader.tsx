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
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(82,197,135,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.24)] md:p-8">
        {badge && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-green-300">
            {badge}
            </p>
        )}
        <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-white md:text-5xl">
            {title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-300 md:text-base">
            {description}
        </p>
        </div>
    );
}
