import type { ScanProblemKind } from "../../types";

export function classifyScanText(text: string): ScanProblemKind {
    const normalized = text.toLowerCase();

    if (/[=+\-*/^]|solve for|find x|evaluate/.test(normalized)) {
        return "equation";
    }

    if (/therefore|solution|step 1|step 2|answer:/i.test(text)) {
        return "worked-solution";
    }

    if (/compare|correct answer|my answer|is it right/i.test(normalized)) {
        return "answer-check";
    }

    if (/how many|what is|find the|given that|peso|php|rate|years/i.test(normalized)) {
        return "word-problem";
    }

    return "unknown";
}

