export type ChartHighlight = {
    title: string;
    value: string;
    tone?: "accent" | "success" | "warning";
};

export function buildChartHighlights(items: Array<{ label: string; value: number }>) {
    if (!items.length) return [];

    const highest = items.reduce((best, item) => (item.value > best.value ? item : best), items[0]);
    const lowest = items.reduce((best, item) => (item.value < best.value ? item : best), items[0]);

    return [
        {
            title: "Highest driver",
            value: `${highest.label}: ${highest.value.toLocaleString()}`,
            tone: "accent",
        },
        {
            title: "Lowest driver",
            value: `${lowest.label}: ${lowest.value.toLocaleString()}`,
        },
    ] satisfies ChartHighlight[];
}

