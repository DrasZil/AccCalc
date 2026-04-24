import type { ScanPageType } from "../../types.js";

const PAGE_HINTS: Array<{
    pageType: ScanPageType;
    patterns: RegExp[];
}> = [
    {
        pageType: "department-2-worksheet",
        patterns: [/department\s*2/i, /\bdept\.?\s*2\b/i, /transferred[- ]in/i],
    },
    {
        pageType: "department-1-worksheet",
        patterns: [/department\s*1/i, /\bdept\.?\s*1\b/i, /units started/i],
    },
    {
        pageType: "cost-schedule-page",
        patterns: [/cost of production report/i, /costs accounted for/i, /costs to be accounted for/i],
    },
    {
        pageType: "answer-page",
        patterns: [/completed and transferred out/i, /ending wip/i, /final answer/i],
    },
    {
        pageType: "problem-statement",
        patterns: [/equivalent units of production/i, /process costing/i, /instructions/i],
    },
];

export function classifyAccountingWorksheet(text: string) {
    let bestType: ScanPageType = "unknown";
    let bestScore = 0;

    PAGE_HINTS.forEach((entry) => {
        const score = entry.patterns.reduce(
            (sum, pattern) => sum + (pattern.test(text) ? 1 : 0),
            0
        );
        if (score > bestScore) {
            bestScore = score;
            bestType = entry.pageType;
        }
    });

    return {
        pageType: bestType,
        confidence: Math.min(95, 35 + bestScore * 22),
    } satisfies { pageType: ScanPageType; confidence: number };
}
