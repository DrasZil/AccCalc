const GUIDE_WORDS = [
    "accounting",
    "allowance",
    "amortization",
    "amount",
    "assumption",
    "balance",
    "bond",
    "book",
    "break",
    "carrying",
    "cash",
    "change",
    "closing",
    "compute",
    "contingency",
    "contribution",
    "cost",
    "current",
    "debt",
    "discount",
    "earnings",
    "ending",
    "equity",
    "expense",
    "even",
    "fixed",
    "flow",
    "funding",
    "future",
    "gross",
    "income",
    "in",
    "interest",
    "inventory",
    "issue",
    "liability",
    "margin",
    "maturity",
    "net",
    "operating",
    "outstanding",
    "payment",
    "percentage",
    "period",
    "present",
    "price",
    "profit",
    "quantity",
    "rate",
    "recommended",
    "revenue",
    "sales",
    "schedule",
    "startup",
    "step",
    "subtotal",
    "total",
    "units",
    "value",
    "variable",
];

const WORD_LOOKUP = new Set(GUIDE_WORDS);

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
            if (!answer || candidate.join("").length > answer.join("").length) {
                answer = candidate;
            }
        }

        best.set(index, answer);
        return answer;
    }

    const result = solve(0);
    return result && result.length > 1 ? result.join(" ") : token;
}

export function formatGuideText(input: string) {
    return input
        .split(/(\s+)/)
        .map((token) => {
            if (/^\s+$/.test(token)) return token;
            const splitToken = splitCamelAndPascalCase(token);
            return splitToken
                .split(" ")
                .map((part) => segmentLowercaseToken(part))
                .join(" ");
        })
        .join("")
        .replace(/([A-Za-z])(?=PHP|[$])/g, "$1 ")
        .replace(/([A-Za-z])(?=₱)/g, "$1 ")
        .replace(/(?<=[:;,.])(?=\S)/g, " ")
        .replace(/(?<=\S)\s*([=+*/x×÷])\s*(?=\S)/g, " $1 ")
        .replace(/(?<=\d)(?=PHP|₱)/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim();
}
