export function signLabel(value: number) {
    if (value > 0) return "positive";
    if (value < 0) return "negative";
    return "neutral";
}

export function signMismatch(expected: number, actual: number) {
    if (expected === 0 || actual === 0) return false;
    return Math.sign(expected) !== Math.sign(actual);
}

export function signedDelta(current: number, baseline: number) {
    return current - baseline;
}

