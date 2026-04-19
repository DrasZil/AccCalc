type NarrativeOptions = {
    formatter?: (value: number) => string;
};

export function buildTrendNarrative(
    points: Array<{ label: string; value: number }>,
    options: NarrativeOptions = {}
) {
    if (points.length < 2) {
        return "Add at least two points to read a trend.";
    }

    const formatter = options.formatter ?? ((value: number) => value.toLocaleString());
    const first = points[0];
    const last = points[points.length - 1];
    const delta = last.value - first.value;

    if (delta > 0) {
        return `${last.label} ends ${formatter(delta)} above ${first.label}, which suggests an upward trend overall.`;
    }

    if (delta < 0) {
        return `${last.label} ends ${formatter(Math.abs(delta))} below ${first.label}, which suggests a downward trend overall.`;
    }

    return "The first and last points are similar, so the series looks broadly stable.";
}

export function buildComparisonNarrative(
    items: Array<{ label: string; value: number }>,
    options: NarrativeOptions = {}
) {
    if (items.length < 2) {
        return "Add another comparison point to explain the spread.";
    }

    const formatter = options.formatter ?? ((value: number) => value.toLocaleString());
    const sorted = [...items].sort((left, right) => right.value - left.value);
    const strongest = sorted[0];
    const runnerUp = sorted[1];
    const gap = strongest.value - runnerUp.value;

    if (gap === 0) {
        return `${strongest.label} and ${runnerUp.label} are currently tied, so the chart reads as closely balanced rather than clearly dominated by one driver.`;
    }

    if (Math.abs(gap) < Math.max(Math.abs(strongest.value), Math.abs(runnerUp.value)) * 0.08) {
        return `${strongest.label} is only narrowly ahead of ${runnerUp.label} by ${formatter(gap)}, so the chart suggests a close comparison rather than a decisive lead.`;
    }

    return `${strongest.label} leads by ${formatter(gap)} over ${runnerUp.label}, so it is currently the dominant driver in the chart.`;
}
