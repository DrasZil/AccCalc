import type { RankedCalculator, SmartSolverAnalysis } from "../smartSolver.types";

export function summarizeExtractedValues(
    analysis: SmartSolverAnalysis,
    route: RankedCalculator | null = analysis.best
) {
    const extractedCount = analysis.extractedEntries.length;
    const missingCount = route?.missing.length ?? 0;
    const topicFamilyConfidence = analysis.topicFamily?.confidence ?? "low";
    const routeIsReady =
        Boolean(route) &&
        (route?.score ?? 0) >= 55 &&
        missingCount === 0 &&
        topicFamilyConfidence !== "low" &&
        analysis.warnings.length === 0 &&
        (route?.familyGatePenalty ?? 0) === 0;

    return {
        extractedCount,
        missingCount,
        requiresConfirmation:
            extractedCount > 0 && (!routeIsReady || (route?.score ?? 0) < 80),
        summary:
            extractedCount === 0
                ? "No structured values were extracted yet."
                : missingCount > 0
                  ? `${extractedCount} values were extracted, but ${missingCount} required inputs still look incomplete.`
                  : analysis.warnings.length > 0
                    ? `${extractedCount} route-relevant values were extracted, but Smart Solver still wants a human review before treating the route as settled.`
                    : routeIsReady
                      ? `${extractedCount} route-relevant values were extracted and the selected route looks structurally complete.`
                      : `${extractedCount} route-relevant values were extracted, but the selected route still needs review before it should auto-open.`,
    };
}
