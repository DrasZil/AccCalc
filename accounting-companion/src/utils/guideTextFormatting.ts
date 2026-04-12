const GUIDE_WORDS = [
    "accounting",
    "actual",
    "admission",
    "allowance",
    "amount",
    "analysis",
    "assumption",
    "available",
    "average",
    "balance",
    "break",
    "budget",
    "capital",
    "cash",
    "change",
    "check",
    "checkpoint",
    "checkpoints",
    "common",
    "comparison",
    "confidence",
    "connect",
    "contribution",
    "conversion",
    "cost",
    "current",
    "decision",
    "deficiency",
    "depreciation",
    "discount",
    "dissolution",
    "distribution",
    "equity",
    "example",
    "expense",
    "expected",
    "explanation",
    "fixed",
    "flow",
    "for",
    "formula",
    "funding",
    "gain",
    "goodwill",
    "guide",
    "income",
    "interest",
    "inventory",
    "interpretation",
    "learn",
    "liabilities",
    "liability",
    "liquidation",
    "logic",
    "loss",
    "margin",
    "market",
    "meaning",
    "method",
    "mistake",
    "mistakes",
    "multi",
    "notes",
    "on",
    "operating",
    "or",
    "partnership",
    "percentage",
    "period",
    "planning",
    "point",
    "price",
    "problem",
    "procedure",
    "process",
    "profit",
    "quantity",
    "quick",
    "ratio",
    "realization",
    "reconciling",
    "recommended",
    "reconciliation",
    "related",
    "required",
    "results",
    "revenue",
    "review",
    "risk",
    "sales",
    "schedule",
    "self",
    "sensitivity",
    "share",
    "solution",
    "startup",
    "step",
    "study",
    "subtotal",
    "support",
    "target",
    "text",
    "tool",
    "top",
    "to",
    "total",
    "units",
    "use",
    "value",
    "variable",
    "warning",
    "warnings",
    "weighted",
    "when",
    "worked",
    "workflow",
];

const WORD_LOOKUP = new Set(GUIDE_WORDS);
const CURRENCY_SYMBOLS = /[$\u20ac\u00a3\u00a5\u20b1\u20b9\u20a9]/;
const OPERATOR_SPACING = /(?<=\S)\s*([=+*/\u00d7\u00f7<>\u2264\u2265])\s*(?=\S)/g;
const MOJIBAKE_REPLACEMENTS: Array<[RegExp, string]> = [
    [/Ãƒâ€”/g, "\u00d7"],
    [/ÃƒÂ·/g, "\u00f7"],
    [/Ã¢â€°Â¥/g, "\u2265"],
    [/Ã¢â€°Â¤/g, "\u2264"],
    [/Ã¢â€° "/g, "\u2260"],
    [/Ã¢â‚¬Â¢/g, "\u2022"],
    [/Ã¢â€šÂ±/g, "\u20b1"],
    [/Ã¢â‚¬â€œ|Ã¢â‚¬â€/g, "-"],
];

function normalizeEncodings(input: string) {
    return MOJIBAKE_REPLACEMENTS.reduce(
        (current, [pattern, replacement]) => current.replace(pattern, replacement),
        input
    );
}

function splitCamelAndPascalCase(input: string) {
    return input
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
}

function segmentLowercaseToken(token: string) {
    if (!/^[a-z]{8,}$/.test(token)) return token;

    const best = new Map<number, string[] | null>();

    function solve(index: number): string[] | null {
        if (index === token.length) return [];
        if (best.has(index)) return best.get(index) ?? null;

        let answer: string[] | null = null;

        for (let end = index + 2; end <= token.length; end += 1) {
            const part = token.slice(index, end);
            if (!WORD_LOOKUP.has(part)) continue;

            const tail = solve(end);
            if (!tail) continue;

            const candidate = [part, ...tail];
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

function normalizeTokenSpacing(token: string) {
    return token
        .replace(/\b(?:php|philippine peso(?:s)?|peso(?:s)?)\b/gi, "\u20b1")
        .replace(/([A-Za-z])(?=[$\u20ac\u00a3\u00a5\u20b1\u20b9\u20a9])/g, "$1 ")
        .replace(/(?<=\d)(?=[$\u20ac\u00a3\u00a5\u20b1\u20b9\u20a9])/g, " ")
        .replace(/(?<=[A-Za-z])(?=\d{1,3}(?:[,.]\d{3})*(?:\.\d+)?\b)/g, " ")
        .replace(/(?<=\d)(?=[A-Za-z]{3,}\b)/g, " ");
}

export function formatGuideText(input: string) {
    const normalized = normalizeEncodings(input)
        .replace(/\r\n/g, "\n")
        .replace(/\u00a0/g, " ")
        .replace(/\bpesos?\b/gi, "\u20b1")
        .replace(/\bphp\b/gi, "\u20b1");

    return normalized
        .split(/(\s+)/)
        .map((token) => {
            if (/^\s+$/.test(token)) return token;

            return splitCamelAndPascalCase(token)
                .split(" ")
                .map((part) =>
                    normalizeTokenSpacing(
                        segmentLowercaseToken(part.toLowerCase() === part ? part : part)
                    )
                )
                .join(" ");
        })
        .join("")
        .replace(/(?<=[:;,.])(?=\S)/g, " ")
        .replace(OPERATOR_SPACING, " $1 ")
        .replace(/(?<=\d)\s*-\s*(?=\d)/g, " - ")
        .replace(/(?<=\S)\s*\u2022\s*(?=\S)/g, " \u2022 ")
        .replace(/\(\s+/g, "(")
        .replace(/\s+\)/g, ")")
        .replace(/\s{2,}/g, " ")
        .replace(new RegExp(`(${CURRENCY_SYMBOLS.source})\\s+`, "g"), "$1")
        .trim();
}
