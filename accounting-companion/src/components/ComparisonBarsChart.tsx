type ComparisonBarsChartProps = {
    title: string;
    description: string;
    items: Array<{
        label: string;
        value: number;
        accent?: "primary" | "secondary" | "highlight";
        note?: string;
    }>;
    formatter?: (value: number) => string;
};

const ACCENT_CLASS_MAP = {
    primary: "var(--app-accent)",
    secondary: "var(--app-accent-secondary)",
    highlight: "var(--app-highlight)",
} as const;

export default function ComparisonBarsChart({
    title,
    description,
    items,
    formatter = (value) => value.toLocaleString(),
}: ComparisonBarsChartProps) {
    const maxValue = Math.max(...items.map((item) => Math.abs(item.value)), 1);

    return (
        <div className="app-panel rounded-[var(--app-radius-lg)] p-5 md:p-6">
            <div className="max-w-2xl">
                <p className="app-section-kicker">Chart</p>
                <h3 className="app-section-title mt-2 text-xl">{title}</h3>
                <p className="app-body-md mt-2 text-sm">{description}</p>
            </div>

            <div className="mt-5 space-y-4">
                {items.map((item) => {
                    const width = `${Math.max(8, (Math.abs(item.value) / maxValue) * 100)}%`;

                    return (
                        <div key={item.label} className="space-y-2">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                    {item.label}
                                </p>
                                <p className="text-sm font-medium text-[color:var(--app-text-secondary)]">
                                    {formatter(item.value)}
                                </p>
                            </div>
                            <div className="app-subtle-surface overflow-hidden rounded-full px-1 py-1">
                                <div
                                    className="h-3 rounded-full"
                                    style={{
                                        width,
                                        background: ACCENT_CLASS_MAP[item.accent ?? "primary"],
                                    }}
                                />
                            </div>
                            {item.note ? (
                                <p className="app-helper text-xs">{item.note}</p>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
