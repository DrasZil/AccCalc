import { useElementSize } from "../hooks/useElementSize";

type CurvePoint = {
    x: number;
    y: number;
};

type CurveSeries = {
    label: string;
    points: CurvePoint[];
    accent?: "primary" | "secondary" | "highlight";
    note?: string;
};

type CurvesChartProps = {
    title: string;
    description: string;
    series: CurveSeries[];
    highlightPoint?: { label: string; x: number; y: number; note?: string };
    referenceLines?: Array<{
        label: string;
        y: number;
        accent?: "primary" | "secondary" | "highlight";
    }>;
    xLabel?: string;
    yLabel?: string;
    formatter?: (value: number) => string;
};

const CURVE_COLORS = {
    primary: "var(--app-accent)",
    secondary: "var(--app-accent-secondary)",
    highlight: "var(--app-highlight)",
} as const;

const PLOT_BOUNDS = {
    left: 12,
    right: 94,
    top: 8,
    bottom: 60,
};

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function buildScale(
    allPoints: CurvePoint[],
    referenceLines: Array<{ y: number }>,
    highlightPoint?: { x: number; y: number }
) {
    const maxX = Math.max(...allPoints.map((point) => point.x), highlightPoint?.x ?? 0, 1);
    const minY = Math.min(
        ...allPoints.map((point) => point.y),
        ...referenceLines.map((line) => line.y),
        highlightPoint?.y ?? 0,
        0
    );
    const maxY = Math.max(
        ...allPoints.map((point) => point.y),
        ...referenceLines.map((line) => line.y),
        highlightPoint?.y ?? 0,
        1
    );
    const rangeY = Math.max(maxY - minY, 1);

    return {
        maxX,
        minY,
        maxY,
        rangeY,
        mapX(value: number) {
            const usableWidth = PLOT_BOUNDS.right - PLOT_BOUNDS.left;
            return PLOT_BOUNDS.left + (value / Math.max(maxX, 1)) * usableWidth;
        },
        mapY(value: number) {
            const usableHeight = PLOT_BOUNDS.bottom - PLOT_BOUNDS.top;
            return PLOT_BOUNDS.bottom - ((value - minY) / rangeY) * usableHeight;
        },
    };
}

function buildPolyline(points: CurvePoint[], scale: ReturnType<typeof buildScale>) {
    return points.map((point) => `${scale.mapX(point.x)},${scale.mapY(point.y)}`).join(" ");
}

export default function CurvesChart({
    title,
    description,
    series,
    highlightPoint,
    referenceLines = [],
    xLabel = "Quantity",
    yLabel = "Value",
    formatter = (value) => value.toLocaleString(),
}: CurvesChartProps) {
    const { ref, width } = useElementSize<HTMLDivElement>();
    const allPoints = series.flatMap((entry) => entry.points);
    const scale = buildScale(allPoints, referenceLines, highlightPoint);
    const isCompact = width > 0 && width < 430;
    const yTicks = (isCompact ? [0, 0.5, 1] : [0, 0.33, 0.66, 1]).map(
        (fraction) => scale.minY + scale.rangeY * fraction
    );

    const highlightCoordinates = highlightPoint
        ? {
              x: scale.mapX(highlightPoint.x),
              y: scale.mapY(highlightPoint.y),
          }
        : null;

    const calloutDirection =
        highlightCoordinates && highlightCoordinates.x > (PLOT_BOUNDS.left + PLOT_BOUNDS.right) / 2
            ? "left"
            : "right";
    const calloutLineEndX = highlightCoordinates
        ? clamp(
              highlightCoordinates.x + (calloutDirection === "left" ? -12 : 12),
              PLOT_BOUNDS.left + 4,
              PLOT_BOUNDS.right - 4
          )
        : null;
    const calloutTextX =
        calloutLineEndX === null ? null : calloutLineEndX + (calloutDirection === "left" ? -1.5 : 1.5);

    return (
        <div ref={ref} className="app-panel rounded-[var(--app-radius-lg)] p-5 md:p-6">
            <div className="max-w-2xl">
                <p className="app-section-kicker">Visual</p>
                <h3 className="app-section-title mt-2 text-xl">{title}</h3>
                <p className="app-body-md mt-2 text-sm">{description}</p>
            </div>

            <div className="app-subtle-surface mt-5 rounded-[1.35rem] p-4 md:p-5">
                <svg
                    viewBox="0 0 100 68"
                    className={isCompact ? "h-48 w-full" : "h-56 w-full md:h-64"}
                    preserveAspectRatio="xMidYMid meet"
                >
                    <path
                        d={`M${PLOT_BOUNDS.left} ${PLOT_BOUNDS.top}v${PLOT_BOUNDS.bottom - PLOT_BOUNDS.top}`}
                        stroke="var(--app-border-subtle)"
                        strokeWidth="0.8"
                    />
                    <path
                        d={`M${PLOT_BOUNDS.left} ${PLOT_BOUNDS.bottom}h${PLOT_BOUNDS.right - PLOT_BOUNDS.left}`}
                        stroke="var(--app-border-subtle)"
                        strokeWidth="0.8"
                    />

                    {yTicks.map((tick, index) => {
                        const y = scale.mapY(tick);
                        return (
                            <g key={`tick-${index}`}>
                                <path
                                    d={`M${PLOT_BOUNDS.left} ${y}h${PLOT_BOUNDS.right - PLOT_BOUNDS.left}`}
                                    stroke="var(--app-border-subtle)"
                                    strokeWidth="0.5"
                                    strokeDasharray="1.8 2.4"
                                />
                                <text
                                    x="0.5"
                                    y={y + 1.2}
                                    className="fill-[color:var(--app-text-muted)] text-[3.2px]"
                                >
                                    {formatter(tick)}
                                </text>
                            </g>
                        );
                    })}

                    {referenceLines.map((line) => {
                        const y = scale.mapY(line.y);
                        return (
                            <path
                                key={line.label}
                                d={`M${PLOT_BOUNDS.left} ${y}h${PLOT_BOUNDS.right - PLOT_BOUNDS.left}`}
                                stroke={CURVE_COLORS[line.accent ?? "highlight"]}
                                strokeWidth="0.75"
                                strokeDasharray="2.8 2.2"
                                opacity="0.92"
                            />
                        );
                    })}

                    {series.map((entry) => (
                        <polyline
                            key={entry.label}
                            points={buildPolyline(entry.points, scale)}
                            fill="none"
                            stroke={CURVE_COLORS[entry.accent ?? "primary"]}
                            strokeWidth="2.2"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                    ))}

                    {highlightCoordinates &&
                    highlightPoint &&
                    calloutLineEndX !== null &&
                    calloutTextX !== null &&
                    !isCompact ? (
                        <>
                            <circle
                                cx={highlightCoordinates.x}
                                cy={highlightCoordinates.y}
                                r="2.1"
                                fill="var(--app-highlight)"
                            />
                            <path
                                d={`M${highlightCoordinates.x} ${highlightCoordinates.y} L${calloutLineEndX} ${highlightCoordinates.y - 5}`}
                                stroke="var(--app-highlight)"
                                strokeWidth="0.9"
                            />
                            <text
                                x={calloutTextX}
                                y={highlightCoordinates.y - 6}
                                textAnchor={calloutDirection === "left" ? "end" : "start"}
                                className="fill-[color:var(--app-text)] text-[3.9px]"
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

                <div className="app-card-grid-readable mt-4">
                    {highlightPoint ? (
                        <div className="app-tone-accent rounded-[1rem] px-4 py-3">
                            <p className="app-card-title text-sm">{highlightPoint.label}</p>
                            <p className="app-helper mt-1 text-xs leading-5">
                                {formatter(highlightPoint.y)} at {highlightPoint.x.toFixed(2)} units
                            </p>
                            {highlightPoint.note ? (
                                <p className="app-helper mt-2 text-xs leading-5">
                                    {highlightPoint.note}
                                </p>
                            ) : null}
                        </div>
                    ) : null}

                    {referenceLines.map((line) => (
                        <div
                            key={`reference-${line.label}`}
                            className="app-subtle-surface rounded-[1rem] px-4 py-3"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{
                                        background: CURVE_COLORS[line.accent ?? "highlight"],
                                    }}
                                />
                                <p className="app-card-title text-sm">{line.label}</p>
                            </div>
                            <p className="app-helper mt-2 text-xs leading-5">
                                {formatter(line.y)}
                            </p>
                        </div>
                    ))}

                    {series.map((entry) => (
                        <div
                            key={entry.label}
                            className="app-subtle-surface rounded-[1rem] px-4 py-3"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-3 w-3 rounded-full"
                                    style={{
                                        background: CURVE_COLORS[entry.accent ?? "primary"],
                                    }}
                                />
                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                    {entry.label}
                                </p>
                            </div>
                            {entry.note ? (
                                <p className="app-helper mt-2 text-xs leading-5">{entry.note}</p>
                            ) : null}
                        </div>
                    ))}
                </div>

                {highlightPoint && isCompact ? (
                    <div className="app-tone-accent mt-4 rounded-[1rem] px-4 py-3">
                        <p className="app-card-title text-sm">{highlightPoint.label}</p>
                        <p className="app-helper mt-2 text-xs leading-5">
                            {formatter(highlightPoint.y)} at {highlightPoint.x.toFixed(2)} units
                        </p>
                        {highlightPoint.note ? (
                            <p className="app-helper mt-2 text-xs leading-5">
                                {highlightPoint.note}
                            </p>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
