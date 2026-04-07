import Decimal from "decimal.js";

export function toFiniteNumber(value: unknown) {
    const parsed =
        typeof value === "number"
            ? value
            : typeof value === "string" && value.trim() !== ""
              ? Number(value)
              : Number.NaN;

    return Number.isFinite(parsed) ? parsed : null;
}

export function toDecimal(value: Decimal.Value) {
    const decimal = new Decimal(value);
    if (!decimal.isFinite()) {
        throw new Error("Calculation produced a non-finite result.");
    }
    return decimal;
}

export function normalizeNegativeZero(value: number) {
    return Object.is(value, -0) ? 0 : value;
}

export function sanitizeNumberOutput(value: number, fallback = 0) {
    return Number.isFinite(value) ? normalizeNegativeZero(value) : fallback;
}

export function clampNonNegative(value: number) {
    return value < 0 ? 0 : value;
}

