import type { RankedCalculator, SmartSolverAnalysis } from "../smartSolver.types";

export function buildExtractedInputReview(
    analysis: SmartSolverAnalysis,
    route: RankedCalculator | null = analysis.best
) {
    const topicFamilyConfidence = analysis.topicFamily?.confidence ?? "low";
    const routeNeedsReview =
        !route ||
        route.score < 55 ||
        route.missing.length > 0 ||
        topicFamilyConfidence === "low" ||
        analysis.warnings.length > 0 ||
        (route.familyGatePenalty ?? 0) > 0;

    if (analysis.extractedEntries.length === 0) {
        return "Type more of the problem statement so Smart Solver can extract values before routing.";
    }

    if (analysis.warnings.length > 0) {
        return "Review the extracted values before solving because the topic reading is still mixed or the prompt behaves more like a study request.";
    }

    if (routeNeedsReview) {
        return "Review the extracted values before solving because the current route is still missing information or confidence.";
    }

    return "The extracted values look usable, but confirm units, signs, and period bases before trusting the result.";
}
