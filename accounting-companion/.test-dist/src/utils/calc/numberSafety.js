import { Decimal } from "decimal.js";
export function toFiniteNumber(value) {
    const parsed = typeof value === "number"
        ? value
        : typeof value === "string" && value.trim() !== ""
            ? Number(value)
            : Number.NaN;
    return Number.isFinite(parsed) ? parsed : null;
}
export function toDecimal(value) {
    const decimal = new Decimal(value);
    if (!decimal.isFinite()) {
        throw new Error("Calculation produced a non-finite result.");
    }
    return decimal;
}
export function normalizeNegativeZero(value) {
    return Object.is(value, -0) ? 0 : value;
}
export function sanitizeNumberOutput(value, fallback = 0) {
    return Number.isFinite(value) ? normalizeNegativeZero(value) : fallback;
}
export function clampNonNegative(value) {
    return value < 0 ? 0 : value;
}
