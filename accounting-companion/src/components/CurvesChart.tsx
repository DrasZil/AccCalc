type CurvePoint = {
    x: number;
    y: number;
};

type CurveSeries = {
    label: string;
    points: CurvePoint[];
    accent?: "primary" | "secondary" | "highlight";
};

type CurvesChartProps = {
    title: string;
    description: string;
    series: CurveSeries[];
    highlightPoint?: { label: string; x: number; y: number };
    xLabel?: string;
    yLabel?: string;
};

const CURVE_COLORS = {
    primary: "var(--app-accent)",
    secondary: "var(--app-accent-secondary)",
    highlight: "var(--app-highlight)",
} as const;

function buildPolyline(points: CurvePoint[], maxX: number, minY: number, rangeY: number) {
    return points
        .map((point) => {
            const x = (point.x / Math.max(maxX, 1)) * 100;
            const y = 60 - ((point.y - minY) / Math.max(rangeY, 1)) * 52;
            return `${x},${y}`;
        })
        .join(" ");
}

export default function CurvesChart({
    title,
    description,
    series,
    highlightPoint,
    xLabel = "Quantity",
    yLabel = "Value",
}: CurvesChartProps) {
    const allPoints = series.flatMap((entry) => entry.points);
    const maxX = Math.max(...allPoints.map((point) => point.x), highlightPoint?.x ?? 0, 1);
    const minY = Math.min(...allPoints.map((point) => point.y), highlightPoint?.y ?? 0, 0);
    const maxY = Math.max(...allPoints.map((point) => point.y), highlightPoint?.y ?? 0, 1);
    const rangeY = maxY - minY;

    return (
        <div className="app-panel rounded-[var(--app-radius-lg)] p-5 md:p-6">
            <div className="max-w-2xl">
                <p className="app-section-kicker">Visual</p>
                <h3 className="app-section-title mt-2 text-xl">{title}</h3>
                <p className="app-body-md mt-2 text-sm">{description}</p>
            </div>

            <div className="app-subtle-surface mt-5 rounded-[1.35rem] p-4">
                <svg viewBox="0 0 100 64" className="h-48 w-full" preserveAspectRatio="none">
                    <path d="M8 4v56" stroke="var(--app-border-subtle)" strokeWidth="0.8" />
                    <path d="M8 60h88" stroke="var(--app-border-subtle)" strokeWidth="0.8" />
                    {series.map((entry) => (
                        <polyline
                            key={entry.label}
                            points={buildPolyline(entry.points, maxX, minY, rangeY)}
                            fill="none"
                            stroke={CURVE_COLORS[entry.accent ?? "primary"]}
                            strokeWidth="2.2"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                    ))}
                    {highlightPoint ? (
                        <>
                            <circle
                                cx={(highlightPoint.x / Math.max(maxX, 1)) * 100}
                                cy={60 - ((highlightPoint.y - minY) / Math.max(rangeY, 1)) * 52}
                                r="2"
                                fill="var(--app-highlight)"
                            />
                            <text
                                x={(highlightPoint.x / Math.max(maxX, 1)) * 100 + 2}
                                y={60 - ((highlightPoint.y - minY) / Math.max(rangeY, 1)) * 52 - 2}
                                className="fill-[color:var(--app-text)] text-[4px]"
                            >
                                {highlightPoint.label}
                            </text>
                        </>
                    ) : null}
                </svg>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="app-helper text-xs">{xLabel}</p>
                    <p className="app-helper text-xs">{yLabel}</p>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {series.map((entry) => (
                        <div key={entry.label} className="rounded-2xl border app-divider px-3 py-3">
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-3 w-3 rounded-full"
                                    style={{
                                        background:
                                            CURVE_COLORS[entry.accent ?? "primary"],
                                    }}
                                />
                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                    {entry.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
