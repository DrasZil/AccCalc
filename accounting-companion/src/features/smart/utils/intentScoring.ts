import type { SmartSolverAnalysis } from "../smartSolver.types";

export type IntentScore = {
    label: string;
    score: number;
};

export function scoreSmartIntent(
    prompt: string,
    analysis: SmartSolverAnalysis
) {
    const normalized = prompt.toLowerCase();
    const intents: IntentScore[] = [
        {
            label: "check",
            score: /check|compare|is this right|correct/i.test(normalized) ? 82 : 28,
        },
        {
            label: "solve",
            score: /solve|find|compute|calculate/i.test(normalized) ? 84 : 36,
        },
        {
            label: "route",
            score: /open|route|use the|which tool/i.test(normalized) ? 78 : 30,
        },
        {
            label: "review extracted values",
            score:
                analysis.extractedEntries.length >= 3 && !analysis.isReadyToRoute ? 76 : 34,
        },
    ];

    return intents.sort((left, right) => right.score - left.score);
}

