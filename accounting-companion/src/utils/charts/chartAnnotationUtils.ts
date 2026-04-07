export function formatAxisLabel(label: string, unit?: string) {
    return unit ? `${label} (${unit})` : label;
}

export function buildThresholdBand(value: number, threshold: number) {
    return {
        state: value >= threshold ? "above-threshold" : "below-threshold",
        difference: value - threshold,
    };
}

