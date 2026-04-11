const CURRENCY_SYMBOLS = new Set([
    "$",
    "\u20b1",
    "\u20ac",
    "\u00a3",
    "\u00a5",
    "\u20b9",
    "\u20a9",
]);
const SOFT_BREAK_AFTER = new Set([",", "/", ":", "\u00b7"]);

export type ResultValueSegment = {
    text: string;
    breakAfter?: boolean;
};

function groupPlainNumberToken(token: string) {
    if (token.includes(",")) return token;

    const match = token.match(/^(-?)(\d+)(\.\d+)?$/);
    if (!match) return token;

    const [, sign, integer, decimal = ""] = match;
    const groupedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${sign}${groupedInteger}${decimal}`;
}

export function normalizeResultValue(value: string) {
    return value.replace(/-?\d+(?:\.\d+)?/g, (token) => groupPlainNumberToken(token));
}

export function getResultValueTone(value: string) {
    const trimmed = value.trim();
    const words = trimmed.split(/\s+/).filter(Boolean);
    const alphaCount = (trimmed.match(/[A-Za-z]/g) ?? []).length;
    const numericCount = (trimmed.match(/[0-9]/g) ?? []).length;
    const hasSentenceLength = trimmed.length >= 38 || words.length >= 6;
    const looksMostlyNumeric =
        numericCount > 0 &&
        alphaCount <= Math.max(4, Math.floor(trimmed.length * 0.18)) &&
        words.length <= 4;

    if (looksMostlyNumeric) return "numeric";
    if (hasSentenceLength) return "sentence";
    return "label";
}

export function isWideResultValue(options: {
    title: string;
    value: string;
    supportingText?: string;
}) {
    const normalizedValue = normalizeResultValue(options.value);
    const wordCount = normalizedValue.trim().split(/\s+/).filter(Boolean).length;

    return (
        normalizedValue.length >= 18 ||
        wordCount >= 5 ||
        options.title.length >= 22 ||
        (options.supportingText?.length ?? 0) >= 56
    );
}

export function getResultValueSegments(value: string): ResultValueSegment[] {
    const normalized = normalizeResultValue(value);
    const segments: ResultValueSegment[] = [];
    let token = "";

    function pushToken(breakAfter = false) {
        if (!token) return;
        segments.push({ text: token, breakAfter });
        token = "";
    }

    for (const character of normalized) {
        if (CURRENCY_SYMBOLS.has(character)) {
            pushToken();
            segments.push({ text: character, breakAfter: true });
            continue;
        }

        if (character === " ") {
            pushToken();
            segments.push({ text: " " });
            continue;
        }

        token += character;

        if (SOFT_BREAK_AFTER.has(character)) {
            pushToken(true);
        }
    }

    pushToken();

    return segments;
}
