type DonutChartProps = {
    title: string;
    description: string;
    items: Array<{
        label: string;
        value: number;
        accent?: "primary" | "secondary" | "highlight";
    }>;
    formatter?: (value: number) => string;
};

const ACCENT_COLORS = {
    primary: "var(--app-accent)",
    secondary: "var(--app-accent-secondary)",
    highlight: "var(--app-highlight)",
} as const;

export default function DonutChart({
    title,
    description,
    items,
    formatter = (value) => value.toLocaleString(),
}: DonutChartProps) {
    const safeItems = items.filter((item) => item.value > 0);
    const total = Math.max(
        safeItems.reduce((sum, item) => sum + item.value, 0),
        1
    );
    let offset = 0;

    return (
        <div className="app-panel rounded-[var(--app-radius-lg)] p-5 md:p-6">
            <div className="max-w-2xl">
                <p className="app-section-kicker">Distribution</p>
                <h3 className="app-section-title mt-2 text-xl">{title}</h3>
                <p className="app-body-md mt-2 text-sm">{description}</p>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-center">
                <div className="mx-auto">
                    <svg viewBox="0 0 120 120" className="h-48 w-48">
                        <circle
                            cx="60"
                            cy="60"
                            r="42"
                            fill="none"
                            stroke="var(--app-border-subtle)"
                            strokeWidth="14"
                        />
                        {safeItems.map((item) => {
                            const fraction = item.value / total;
                            const dashLength = fraction * 264;
                            const dashOffset = 264 - offset;
                            offset += dashLength;

                            return (
                                <circle
                                    key={item.label}
                                    cx="60"
                                    cy="60"
                                    r="42"
                                    fill="none"
                                    stroke={ACCENT_COLORS[item.accent ?? "primary"]}
                                    strokeWidth="14"
                                    strokeDasharray={`${dashLength} ${264 - dashLength}`}
                                    strokeDashoffset={dashOffset}
                                    transform="rotate(-90 60 60)"
                                    strokeLinecap="round"
                                />
                            );
                        })}
                        <text
                            x="60"
                            y="58"
                            textAnchor="middle"
                            className="fill-[color:var(--app-text)] text-[10px] font-semibold"
                        >
                            Total
                        </text>
                        <text
                            x="60"
                            y="72"
                            textAnchor="middle"
                            className="fill-[color:var(--app-text)] text-[9px]"
                        >
                            {formatter(total)}
                        </text>
                    </svg>
                </div>

                <div className="space-y-3">
                    {safeItems.map((item) => (
                        <div
                            key={item.label}
                            className="app-subtle-surface rounded-[1rem] px-4 py-3"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="h-3 w-3 rounded-full"
                                        style={{
                                            background:
                                                ACCENT_COLORS[item.accent ?? "primary"],
                                        }}
                                    />
                                    <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                        {item.label}
                                    </p>
                                </div>
                                <p className="text-sm font-medium text-[color:var(--app-text-secondary)]">
                                    {formatter(item.value)}
                                </p>
                            </div>
                            <p className="app-helper mt-1 text-xs">
                                {((item.value / total) * 100).toFixed(1)}% of total
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
