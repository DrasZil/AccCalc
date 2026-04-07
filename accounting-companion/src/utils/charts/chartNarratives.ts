export function buildTrendNarrative(points: Array<{ label: string; value: number }>) {
    if (points.length < 2) {
        return "Add at least two points to read a trend.";
    }

    const first = points[0];
    const last = points[points.length - 1];
    const delta = last.value - first.value;

    if (delta > 0) {
        return `${last.label} ends above ${first.label}, which suggests an upward trend overall.`;
    }

    if (delta < 0) {
        return `${last.label} ends below ${first.label}, which suggests a downward trend overall.`;
    }

    return "The first and last points are similar, so the series looks broadly stable.";
}

export function buildComparisonNarrative(items: Array<{ label: string; value: number }>) {
    if (items.length < 2) {
        return "Add another comparison point to explain the spread.";
    }

    const sorted = [...items].sort((left, right) => right.value - left.value);
    const strongest = sorted[0];
    const runnerUp = sorted[1];
    const gap = strongest.value - runnerUp.value;

    return `${strongest.label} leads by ${gap.toLocaleString()} over ${runnerUp.label}, so it is currently the dominant driver in the chart.`;
}

