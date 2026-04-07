import Decimal from "decimal.js";
import { toDecimal } from "./numberSafety";

export function safeAdd(left: Decimal.Value, right: Decimal.Value) {
    return toDecimal(left).plus(toDecimal(right)).toNumber();
}

export function safeSubtract(left: Decimal.Value, right: Decimal.Value) {
    return toDecimal(left).minus(toDecimal(right)).toNumber();
}

export function safeMultiply(left: Decimal.Value, right: Decimal.Value) {
    return toDecimal(left).times(toDecimal(right)).toNumber();
}

export function safeDivide(left: Decimal.Value, right: Decimal.Value, fallback = 0) {
    const denominator = toDecimal(right);
    if (denominator.isZero()) return fallback;
    return toDecimal(left).div(denominator).toNumber();
}

export function safePow(base: Decimal.Value, exponent: Decimal.Value, fallback = 0) {
    try {
        return toDecimal(base).pow(toDecimal(exponent)).toNumber();
    } catch {
        return fallback;
    }
}

