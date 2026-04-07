import type { SmartSolverAnalysis } from "../smartSolver.types";

export function buildExtractedInputReview(analysis: SmartSolverAnalysis) {
    if (analysis.extractedEntries.length === 0) {
        return "Type more of the problem statement so Smart Solver can extract values before routing.";
    }

    if (!analysis.isReadyToRoute) {
        return "Review the extracted values before solving because the current route is still missing information or confidence.";
    }

    return "The extracted values look usable, but confirm units, signs, and period bases before trusting the result.";
}
