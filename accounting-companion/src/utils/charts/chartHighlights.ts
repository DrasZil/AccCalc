export type ChartHighlight = {
    title: string;
    value: string;
    supportingText?: string;
    tone?: "accent" | "success" | "warning";
};

type HighlightOptions = {
    formatter?: (value: number) => string;
};

export function buildChartHighlights(
    items: Array<{ label: string; value: number }>,
    options: HighlightOptions = {}
) {
    if (!items.length) return [];

    const formatter = options.formatter ?? ((value: number) => value.toLocaleString());
    const highest = items.reduce((best, item) => (item.value > best.value ? item : best), items[0]);
    const lowest = items.reduce((best, item) => (item.value < best.value ? item : best), items[0]);
    const average = items.reduce((sum, item) => sum + item.value, 0) / items.length;
    const spread = highest.value - lowest.value;

    return [
        {
            title: "Highest driver",
            value: `${highest.label}: ${formatter(highest.value)}`,
            supportingText: `${items.length} plotted checkpoints in this comparison.`,
            tone: "accent",
        },
        {
            title: "Lowest driver",
            value: `${lowest.label}: ${formatter(lowest.value)}`,
            supportingText:
                highest.label === lowest.label
                    ? "Only one data point is currently available."
                    : `Gap from the highest point: ${formatter(spread)}.`,
        },
        {
            title: spread === 0 ? "Clustered values" : "Average checkpoint",
            value: spread === 0 ? formatter(average) : formatter(average),
            supportingText:
                spread === 0
                    ? "The plotted values currently sit at the same level."
                    : `Average across all points: ${formatter(average)}.`,
            tone: spread === 0 ? "success" : spread > Math.abs(average) ? "warning" : "success",
        },
    ] satisfies ChartHighlight[];
}
