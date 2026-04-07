const COMMON_REPLACEMENTS: Array<[RegExp, string]> = [
    [/Ã·/g, "÷"],
    [/Ã—/g, "×"],
    [/[‐‑‒–—]/g, "−"],
    [/\bphp\b/gi, "PHP"],
    [/\bpeso(?:s)?\b/gi, "PHP"],
    [/[₱]\s*/g, "PHP "],
];

function normalizeNumericToken(token: string, confidence: number) {
    let next = token;

    if (/\d/.test(token)) {
        next = next
            .replace(/(?<=\d)[Oo](?=\d|[.,%])/g, "0")
            .replace(/(?<=\d)[Il|](?=\d|[.,%])/g, "1")
            .replace(/(?<=\d)S(?=\d|[.,%])/g, "5")
            .replace(/(?<=\d)B(?=\d|[.,%])/g, "8");
    }

    next = next
        .replace(/(\d)\s*%\b/g, "$1%")
        .replace(/(?<=\d)\s*,\s*(?=\d{3}\b)/g, ",")
        .replace(/(?<=\d)\s*\.\s*(?=\d)/g, ".")
        .replace(/PHP\s*(?=\d)/g, "PHP ");

    if (confidence >= 75) {
        next = next.replace(/(?<=\d)[Oo](?=\b)/g, "0");
    }

    return next;
}

function cleanLine(line: string, confidence: number) {
    let next = line;

    for (const [pattern, replacement] of COMMON_REPLACEMENTS) {
        next = next.replace(pattern, replacement);
    }

    next = next
        .replace(/[^\S\r\n]+/g, " ")
        .replace(/\s*([:;,.%])\s*/g, "$1 ")
        .replace(/\(\s+/g, "(")
        .replace(/\s+\)/g, ")")
        .replace(/([A-Za-z])\s{2,}([A-Za-z])/g, "$1 $2")
        .replace(/([A-Za-z])(?=\d)/g, "$1")
        .trim();

    next = next
        .split(" ")
        .map((token) => normalizeNumericToken(token, confidence))
        .join(" ")
        .replace(/\s{2,}/g, " ")
        .replace(/PHP\s+PHP/g, "PHP");

    if (/^[~`|_=.:,\-]{4,}$/.test(next)) {
        return "";
    }

    return next.trim();
}

export function cleanupMathLikeText(input: string, confidence = 70) {
    const lines = input
        .replace(/\r/g, "")
        .split("\n")
        .map((line) => cleanLine(line, confidence))
        .filter(Boolean);

    return lines
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[ \t]+/g, " ")
        .trim();
}
