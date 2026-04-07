import { compareWithTolerance } from "./precision";

export function getChartConsistencyWarnings(
    pairs: Array<{ label: string; expected: number; actual: number }>
) {
    return pairs.flatMap((pair) =>
        compareWithTolerance(pair.expected, pair.actual)
            ? []
            : [`${pair.label} chart value differs from the computed value.`]
    );
}

