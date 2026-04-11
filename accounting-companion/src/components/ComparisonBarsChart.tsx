import { useElementSize } from "../hooks/useElementSize";

type ComparisonBarsChartProps = {
    title: string;
    description: string;
    items: Array<{
        label: string;
        value: number;
        accent?: "primary" | "secondary" | "highlight";
        note?: string;
        emphasisLabel?: string;
    }>;
    formatter?: (value: number) => string;
    caption?: string;
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
    caption,
}: ComparisonBarsChartProps) {
    const { ref, width } = useElementSize<HTMLDivElement>();
    const maxValue = Math.max(...items.map((item) => Math.abs(item.value)), 1);
    const isCompact = width > 0 && width < 420;

    return (
        <div ref={ref} className="app-panel rounded-[var(--app-radius-lg)] p-5 md:p-6">
            <div className="max-w-2xl">
                <p className="app-section-kicker">Chart</p>
                <h3 className="app-section-title mt-2 text-xl">{title}</h3>
                <p className="app-body-md mt-2 text-sm">{description}</p>
            </div>

            <div className="app-card-grid-readable mt-5">
                {items.map((item) => {
                    const normalizedWidth = Math.abs(item.value) / maxValue;
                    const width = `${Math.max(12, normalizedWidth * 100)}%`;

                    return (
                        <div
                            key={item.label}
                            className="app-subtle-surface flex min-w-0 flex-col rounded-[1.1rem] px-4 py-4"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                        {item.label}
                                    </p>
                                    <p className="app-helper mt-1 text-xs">
                                        {item.emphasisLabel ??
                                            (isCompact
                                                ? `${Math.round(normalizedWidth * 100)}% of the largest checkpoint.`
                                                : `${Math.round(normalizedWidth * 100)}% of the largest current checkpoint.`)}
                                    </p>
                                </div>
                                <p className="shrink-0 text-sm font-medium text-[color:var(--app-text-secondary)]">
                                    {formatter(item.value)}
                                </p>
                            </div>
                            <div className="app-subtle-surface overflow-hidden rounded-full px-1 py-1">
                                <div
                                    className="relative h-3 rounded-full"
                                    style={{
                                        width,
                                        background: ACCENT_CLASS_MAP[item.accent ?? "primary"],
                                    }}
                                >
                                    <span className="absolute inset-y-0 right-0 w-px bg-white/35" />
                                </div>
                            </div>
                            {item.note ? (
                                <p className="app-helper mt-2 text-xs">{item.note}</p>
                            ) : null}
                        </div>
                    );
                })}
            </div>

            {caption ? <p className="app-helper mt-4 text-xs leading-5">{caption}</p> : null}
        </div>
    );
}
