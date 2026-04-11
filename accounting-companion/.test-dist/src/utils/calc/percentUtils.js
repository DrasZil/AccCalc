import { safeDivide, safeMultiply } from "./safeOperators.js";
export function percentToDecimal(value) {
    return safeDivide(value, 100);
}
export function decimalToPercent(value) {
    return safeMultiply(value, 100);
}
export function applyPercentOf(base, percent) {
    return safeMultiply(base, percentToDecimal(percent));
}
export function percentChange(from, to) {
    if (from === 0)
        return 0;
    return safeMultiply(safeDivide(to - from, from), 100);
}
