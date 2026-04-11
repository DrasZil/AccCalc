const GUIDE_WORDS = [
    "accounting",
    "actual",
    "admission",
    "allowance",
    "amount",
    "analysis",
    "assumption",
    "average",
    "balance",
    "basis",
    "bonus",
    "book",
    "break",
    "budget",
    "capital",
    "carrying",
    "cash",
    "change",
    "check",
    "classification",
    "collections",
    "common",
    "comparison",
    "compound",
    "contribution",
    "conversion",
    "cost",
    "current",
    "days",
    "debt",
    "decision",
    "deficiency",
    "depreciation",
    "difference",
    "discount",
    "dissolution",
    "distribution",
    "earnings",
    "ending",
    "entry",
    "equity",
    "estimated",
    "expense",
    "explanation",
    "fixed",
    "flow",
    "forecast",
    "formula",
    "funding",
    "future",
    "gain",
    "goodwill",
    "gross",
    "income",
    "interest",
    "inventory",
    "investment",
    "issue",
    "label",
    "learn",
    "liabilities",
    "liability",
    "liquidation",
    "loss",
    "margin",
    "market",
    "meaning",
    "method",
    "minimum",
    "mix",
    "months",
    "multi",
    "net",
    "notes",
    "operating",
    "outstanding",
    "partnership",
    "payable",
    "payment",
    "percentage",
    "period",
    "planning",
    "point",
    "price",
    "practical",
    "present",
    "problem",
    "procedure",
    "process",
    "profit",
    "quantity",
    "quick",
    "ratio",
    "realization",
    "recommended",
    "reconciliation",
    "remaining",
    "revenue",
    "risk",
    "sales",
    "schedule",
    "sensitivity",
    "settlement",
    "share",
    "sharing",
    "solve",
    "solution",
    "startup",
    "statement",
    "step",
    "subtotal",
    "target",
    "text",
    "tool",
    "total",
    "units",
    "value",
    "variable",
    "warning",
    "weighted",
    "withdrawal",
    "work",
    "years",
];

const WORD_LOOKUP = new Set(GUIDE_WORDS);
const NORMALIZATION_REPLACEMENTS: Array<[RegExp, string]> = [
    [/Ã—/g, "×"],
    [/Ã·/g, "÷"],
    [/â‰¥/g, "≥"],
    [/â‰¤/g, "≤"],
    [/â‰ /g, "≠"],
    [/âˆ’/g, "-"],
    [/â€¢/g, "•"],
    [/â‚±|₱/g, "PHP "],
    [/\bpesos?\b/gi, "PHP"],
    [/\bphp\b/gi, "PHP"],
];

function splitCamelAndPascalCase(input: string) {
    return input
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
}

function segmentLowercaseToken(token: string) {
    if (!/^[a-z]{10,}$/.test(token)) return token;

    const lower = token.toLowerCase();
    const best = new Map<number, string[] | null>();

    function solve(index: number): string[] | null {
        if (index === lower.length) return [];
        if (best.has(index)) return best.get(index) ?? null;

        let answer: string[] | null = null;

        for (let end = index + 2; end <= lower.length; end += 1) {
            const part = lower.slice(index, end);
            if (!WORD_LOOKUP.has(part)) continue;

            const tail = solve(end);
            if (!tail) continue;

            const candidate = [part, ...tail];
            const coversWholeToken = candidate.join("").length === lower.length;
            if (!coversWholeToken) continue;

            if (!answer || candidate.length < answer.length) {
                answer = candidate;
            }
        }

        best.set(index, answer);
        return answer;
    }

    const result = solve(0);
    return result && result.length > 1 ? result.join(" ") : token;
}

function normalizeKnownEncodings(input: string) {
    return NORMALIZATION_REPLACEMENTS.reduce(
        (current, [pattern, replacement]) => current.replace(pattern, replacement),
        input
    );
}

function normalizeTokenSpacing(token: string) {
    return token
        .replace(/([A-Za-z])(?=PHP\b)/g, "$1 ")
        .replace(/(?<=\d)(?=PHP\b)/g, " ")
        .replace(/(?<=\d)(?=[A-Za-z]{3,}\b)/g, " ")
        .replace(/(?<=[A-Za-z])(?=\d{2,}\b)/g, " ");
}

export function formatGuideText(input: string) {
    const normalized = normalizeKnownEncodings(input);

    return normalized
        .split(/(\s+)/)
        .map((token) => {
            if (/^\s+$/.test(token)) return token;

            const splitToken = splitCamelAndPascalCase(token);
            return splitToken
                .split(" ")
                .map((part) => normalizeTokenSpacing(segmentLowercaseToken(part)))
                .join(" ");
        })
        .join("")
        .replace(/(?<=[:;,.])(?=\S)/g, " ")
        .replace(/(?<=\S)\s*([=+*/×÷<>≤≥])\s*(?=\S)/g, " $1 ")
        .replace(/(?<=\d)\s*-\s*(?=\d)/g, " - ")
        .replace(/(?<=\S)\s*•\s*(?=\S)/g, " • ")
        .replace(/\(\s+/g, "(")
        .replace(/\s+\)/g, ")")
        .replace(/\s{2,}/g, " ")
        .trim();
}
