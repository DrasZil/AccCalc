import { toDecimal } from "./numberSafety.js";
export function safeAdd(left, right) {
    return toDecimal(left).plus(toDecimal(right)).toNumber();
}
export function safeSubtract(left, right) {
    return toDecimal(left).minus(toDecimal(right)).toNumber();
}
export function safeMultiply(left, right) {
    return toDecimal(left).times(toDecimal(right)).toNumber();
}
export function safeDivide(left, right, fallback = 0) {
    const denominator = toDecimal(right);
    if (denominator.isZero())
        return fallback;
    return toDecimal(left).div(denominator).toNumber();
}
export function safePow(base, exponent, fallback = 0) {
    try {
        return toDecimal(base).pow(toDecimal(exponent)).toNumber();
    }
    catch {
        return fallback;
    }
}
