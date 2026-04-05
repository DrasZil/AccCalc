type TrendPoint = {
    label: string;
    value: number;
};

type TrendLineChartProps = {
    title: string;
    description: string;
    points: TrendPoint[];
    formatter?: (value: number) => string;
    accent?: "primary" | "secondary";
};

function buildLine(points: TrendPoint[]) {
    const width = 100;
    const height = 56;
    const values = points.map((point) => point.value);
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const range = Math.max(max - min, 1);

    return points
        .map((point, index) => {
            const x = points.length === 1 ? width / 2 : (index / (points.length - 1)) * width;
            const y = height - ((point.value - min) / range) * height;
            return `${x},${y}`;
        })
        .join(" ");
}

export default function TrendLineChart({
    title,
    description,
    points,
    formatter = (value) => value.toLocaleString(),
    accent = "primary",
}: TrendLineChartProps) {
    const stroke = accent === "secondary" ? "var(--app-accent-secondary)" : "var(--app-accent)";
    const polyline = buildLine(points);

    return (
        <div className="app-panel rounded-[var(--app-radius-lg)] p-5 md:p-6">
            <div className="max-w-2xl">
                <p className="app-section-kicker">Trend</p>
                <h3 className="app-section-title mt-2 text-xl">{title}</h3>
                <p className="app-body-md mt-2 text-sm">{description}</p>
            </div>

            <div className="app-subtle-surface mt-5 rounded-[1.4rem] p-4">
                <svg viewBox="0 0 100 60" className="h-40 w-full" preserveAspectRatio="none">
                    <path
                        d="M0 59.5H100"
                        stroke="var(--app-border-subtle)"
                        strokeWidth="0.8"
                        fill="none"
                    />
                    <polyline
                        points={polyline}
                        fill="none"
                        stroke={stroke}
                        strokeWidth="2.4"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />
                    {points.map((point, index) => {
                        const x = points.length === 1 ? 50 : (index / (points.length - 1)) * 100;
                        const values = points.map((entry) => entry.value);
                        const max = Math.max(...values, 1);
                        const min = Math.min(...values, 0);
                        const range = Math.max(max - min, 1);
                        const y = 56 - ((point.value - min) / range) * 56;

                        return (
                            <circle
                                key={point.label}
                                cx={x}
                                cy={y}
                                r="1.8"
                                fill={stroke}
                            />
                        );
                    })}
                </svg>

                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {points.map((point) => (
                        <div key={point.label} className="rounded-2xl border app-divider px-3 py-3">
                            <p className="app-helper text-xs">{point.label}</p>
                            <p className="mt-1 text-sm font-semibold text-[color:var(--app-text)]">
                                {formatter(point.value)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
