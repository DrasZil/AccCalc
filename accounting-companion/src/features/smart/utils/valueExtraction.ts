import type { SmartSolverAnalysis } from "../smartSolver.types";

export function summarizeExtractedValues(analysis: SmartSolverAnalysis) {
    const extractedCount = analysis.extractedEntries.length;
    const missingCount = analysis.best?.missing.length ?? 0;

    return {
        extractedCount,
        missingCount,
        requiresConfirmation:
            extractedCount > 0 && (!analysis.isReadyToRoute || (analysis.best?.score ?? 0) < 80),
        summary:
            extractedCount === 0
                ? "No structured values were extracted yet."
                : missingCount > 0
                  ? `${extractedCount} values were extracted, but ${missingCount} required inputs still look incomplete.`
                  : `${extractedCount} values were extracted and the selected route looks structurally complete.`,
    };
}

