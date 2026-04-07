import { safeDivide, safeMultiply } from "./safeOperators";

export function percentToDecimal(value: number) {
    return safeDivide(value, 100);
}

export function decimalToPercent(value: number) {
    return safeMultiply(value, 100);
}

export function applyPercentOf(base: number, percent: number) {
    return safeMultiply(base, percentToDecimal(percent));
}

export function percentChange(from: number, to: number) {
    if (from === 0) return 0;
    return safeMultiply(safeDivide(to - from, from), 100);
}

