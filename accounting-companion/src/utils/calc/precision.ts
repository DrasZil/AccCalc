export function roundTo(value: number, digits = 6) {
    if (!Number.isFinite(value)) return 0;
    return Number(value.toFixed(digits));
}

export function compareWithTolerance(left: number, right: number, tolerance = 1e-6) {
    if (!Number.isFinite(left) || !Number.isFinite(right)) return false;
    return Math.abs(left - right) <= tolerance * Math.max(1, Math.abs(left), Math.abs(right));
}

export function getSuggestedDigits(kind: "money" | "ratio" | "percent" | "count" | "general") {
    switch (kind) {
        case "money":
            return 2;
        case "ratio":
            return 4;
        case "percent":
            return 4;
        case "count":
            return 0;
        default:
            return 6;
    }
}

