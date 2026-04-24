import type { RankedCalculator, SmartSolverAnalysis } from "../smartSolver.types";

export function summarizeSolverConfidence(
    analysis: SmartSolverAnalysis,
    route: RankedCalculator | null = analysis.best
) {
    const routeScore = route?.score ?? 0;
    const missingCount = route?.missing.length ?? 0;
    const topicFamilyConfidence = analysis.topicFamily?.confidence ?? "low";
    const ambiguityWarning = analysis.warnings.find((warning) =>
        /close between|held below auto-open|study or explanation/i.test(warning)
    );
    const contradictionSignal =
        (route?.contradictionPenalty ?? 0) > 0 || (route?.familyGatePenalty ?? 0) > 0;

    return {
        label:
            routeScore >= 82 &&
            missingCount === 0 &&
            topicFamilyConfidence === "high" &&
            !ambiguityWarning &&
            !contradictionSignal
                ? "High"
                : routeScore >= 60 &&
                    topicFamilyConfidence !== "low" &&
                    !contradictionSignal
                  ? "Medium"
                  : "Low",
        reason:
            ambiguityWarning
                ? ambiguityWarning
                : contradictionSignal
                  ? "The selected route still has contradiction or family-gating pressure, so review the route choice before trusting the prepared inputs."
                : missingCount > 0
                ? `${missingCount} required fields still look incomplete for the selected route.`
                : routeScore >= 80 && topicFamilyConfidence === "high"
                  ? "The selected route has strong topic evidence, cleaner extraction, and no major contradiction signals."
                  : "The prompt is still somewhat ambiguous, so the route should be reviewed.",
    };
}
