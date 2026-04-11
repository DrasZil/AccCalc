import type { Decimal as DecimalType } from "decimal.js";
import { toDecimal } from "./numberSafety.js";

export function safeAdd(left: DecimalType.Value, right: DecimalType.Value) {
    return toDecimal(left).plus(toDecimal(right)).toNumber();
}

export function safeSubtract(left: DecimalType.Value, right: DecimalType.Value) {
    return toDecimal(left).minus(toDecimal(right)).toNumber();
}

export function safeMultiply(left: DecimalType.Value, right: DecimalType.Value) {
    return toDecimal(left).times(toDecimal(right)).toNumber();
}

export function safeDivide(left: DecimalType.Value, right: DecimalType.Value, fallback = 0) {
    const denominator = toDecimal(right);
    if (denominator.isZero()) return fallback;
    return toDecimal(left).div(denominator).toNumber();
}

export function safePow(base: DecimalType.Value, exponent: DecimalType.Value, fallback = 0) {
    try {
        return toDecimal(base).pow(toDecimal(exponent)).toNumber();
    } catch {
        return fallback;
    }
}
