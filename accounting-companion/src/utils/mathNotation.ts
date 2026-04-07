const SUPERSCRIPT_MAP: Record<string, string> = {
    "0": "\u2070",
    "1": "\u00b9",
    "2": "\u00b2",
    "3": "\u00b3",
    "4": "\u2074",
    "5": "\u2075",
    "6": "\u2076",
    "7": "\u2077",
    "8": "\u2078",
    "9": "\u2079",
    "+": "\u207a",
    "-": "\u207b",
    "(": "\u207d",
    ")": "\u207e",
    n: "\u207f",
};

const SUBSCRIPT_MAP: Record<string, string> = {
    "0": "\u2080",
    "1": "\u2081",
    "2": "\u2082",
    "3": "\u2083",
    "4": "\u2084",
    "5": "\u2085",
    "6": "\u2086",
    "7": "\u2087",
    "8": "\u2088",
    "9": "\u2089",
    "+": "\u208a",
    "-": "\u208b",
    "(": "\u208d",
    ")": "\u208e",
    a: "\u2090",
    e: "\u2091",
    h: "\u2095",
    i: "\u1d62",
    j: "\u2c7c",
    k: "\u2096",
    l: "\u2097",
    m: "\u2098",
    n: "\u2099",
    o: "\u2092",
    p: "\u209a",
    r: "\u1d63",
    s: "\u209b",
    t: "\u209c",
    u: "\u1d64",
    v: "\u1d65",
    x: "\u2093",
};

const BASIC_SYMBOL_REPLACEMENTS: Array<[RegExp, string]> = [
    [/\bpi\b/giu, "\u03c0"],
    [/\btheta\b/giu, "\u03b8"],
    [/\bdelta\b/giu, "\u0394"],
    [/\bmu\b/giu, "\u03bc"],
    [/\bsigma\b/giu, "\u03c3"],
    [/\bsum\b/giu, "\u2211"],
    [/<=/g, "\u2264"],
    [/>=/g, "\u2265"],
    [/!=/g, "\u2260"],
    [/\+-|\+\/-/g, "\u00b1"],
    [/\b(sqrt)\b/giu, "\u221a"],
];

function mapUnicodeScript(value: string, table: Record<string, string>) {
    return value
        .split("")
        .map((character) => table[character] ?? character)
        .join("");
}

export function applyUnicodeScripts(input: string) {
    return input
        .replace(/\^([0-9n()+-]+)/g, (_, exponent: string) =>
            mapUnicodeScript(exponent, SUPERSCRIPT_MAP)
        )
        .replace(/_([0-9a-z()+-]+)/gi, (_, subscript: string) =>
            mapUnicodeScript(subscript.toLowerCase(), SUBSCRIPT_MAP)
        );
}

export function polishMathText(input: string) {
    let next = input
        .replace(/\b([A-Za-z])\s*\*\s*([A-Za-z0-9(])/g, "$1 \u00d7 $2")
        .replace(/(\d)\s*\*\s*([A-Za-z0-9(])/g, "$1 \u00d7 $2")
        .replace(/([A-Za-z0-9)])\s*\/\s*([A-Za-z0-9(])/g, "$1 \u00f7 $2")
        .replace(/(^|[\s(])-(?=\d)/g, "$1\u2212");

    for (const [pattern, replacement] of BASIC_SYMBOL_REPLACEMENTS) {
        next = next.replace(pattern, replacement);
    }

    next = next.replace(/\b([A-Za-z]+)_([0-9a-z]+)/gi, "$1_$2");
    return applyUnicodeScripts(next);
}

export function looksLikeStandaloneMathText(input: string) {
    const normalized = input.trim();
    if (!normalized) return false;

    const wordMatches = normalized.match(/[A-Za-z]{2,}/g) ?? [];
    const wordCount = wordMatches.length;
    const hasStrongMathSignal =
        /[=^_]|<=|>=|!=|\bsqrt\b|\bpi\b|\btheta\b|\bsigma\b|\bdelta\b|\bmu\b|\bsum\b/iu.test(
            normalized
        ) ||
        /\d\s*[+\-*/]\s*\d/.test(normalized) ||
        /[A-Za-z0-9)]\s*[=]\s*[A-Za-z0-9(]/.test(normalized) ||
        /\b[A-Za-z]\d+\b|\b\d+[A-Za-z]\b/.test(normalized);

    if (hasStrongMathSignal) return true;
    if (wordCount >= 5) return false;
    if (/[.?!:]/.test(normalized) && wordCount >= 3) return false;

    return /[+\-*/%]/.test(normalized) && wordCount <= 3;
}

export function looksLikeMathText(input: string) {
    return looksLikeStandaloneMathText(input);
}

export function plainTextToLatex(input: string) {
    return input
        .replace(/\\/g, "\\textbackslash ")
        .replace(/\bpi\b/giu, "\\pi")
        .replace(/\btheta\b/giu, "\\theta")
        .replace(/\bdelta\b/giu, "\\Delta")
        .replace(/\bmu\b/giu, "\\mu")
        .replace(/\bsigma\b/giu, "\\sigma")
        .replace(/\bsum\b/giu, "\\sum")
        .replace(/<=/g, "\\le")
        .replace(/>=/g, "\\ge")
        .replace(/!=/g, "\\ne")
        .replace(/([A-Za-z0-9)])\s*\^\s*([A-Za-z0-9()+-]+)/g, "$1^{$2}")
        .replace(/([A-Za-z0-9)])_([A-Za-z0-9()+-]+)/g, "$1_{$2}")
        .replace(/\bsqrt\s*\(?([^)]+)\)?/giu, "\\sqrt{$1}")
        .replace(/([A-Za-z0-9)])\s*\*\s*([A-Za-z0-9(])/g, "$1 \\times $2")
        .replace(/([A-Za-z0-9)])\s*\/\s*([A-Za-z0-9(])/g, "$1 \\div $2");
}
