import { looksLikeMathText, polishMathText } from "./mathNotation";

export function formatMathValue(value: string | number, digits = 6) {
    if (typeof value === "number") {
        if (!Number.isFinite(value)) return "Not available";
        return Number(value.toFixed(digits)).toString();
    }

    return looksLikeMathText(value) ? polishMathText(value) : value;
}

export function formatMathLabel(label: string) {
    return polishMathText(label);
}

export function formatUnitLabel(unit: string) {
    return polishMathText(unit.replace(/\bper\b/gi, "/"));
}

export function formatSignedMathValue(value: number, digits = 4) {
    if (!Number.isFinite(value)) return "Not available";
    const normalized = Number(value.toFixed(digits));
    return `${normalized > 0 ? "+" : normalized < 0 ? "\u2212" : ""}${Math.abs(normalized)}`;
}

