import type { SmartSolverAnalysis } from "../smartSolver.types";

export function summarizeSolverConfidence(analysis: SmartSolverAnalysis) {
    const bestScore = analysis.best?.score ?? 0;
    const missingCount = analysis.best?.missing.length ?? 0;

    return {
        label:
            bestScore >= 80 && missingCount === 0
                ? "High"
                : bestScore >= 60
                  ? "Medium"
                  : "Low",
        reason:
            missingCount > 0
                ? `${missingCount} required fields still look incomplete for the top route.`
                : bestScore >= 80
                  ? "The top route has strong vocabulary and value alignment."
                  : "The prompt is still somewhat ambiguous, so the route should be reviewed.",
    };
}

