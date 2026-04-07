export type ResultConfidenceLevel = "high" | "medium" | "low";

export type ResultConfidenceSummary = {
    level: ResultConfidenceLevel;
    reasons: string[];
};

export function summarizeResultConfidence(values: number[]) {
    const reasons: string[] = [];

    if (values.some((value) => !Number.isFinite(value))) {
        reasons.push("A computed value is non-finite.");
    }

    if (values.some((value) => Math.abs(value) > 1e12)) {
        reasons.push("One result is unusually large and should be reviewed.");
    }

    if (values.some((value) => Math.abs(value) < 1e-12 && value !== 0)) {
        reasons.push("One result is extremely small and may reflect rounding sensitivity.");
    }

    return {
        level:
            reasons.length === 0 ? "high" : reasons.length === 1 ? "medium" : "low",
        reasons,
    } satisfies ResultConfidenceSummary;
}

