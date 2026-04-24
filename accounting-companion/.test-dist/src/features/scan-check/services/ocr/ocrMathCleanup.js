const COMMON_REPLACEMENTS = [
    [/\bphp\b/gi, "₱"],
    [/\bpeso(?:s)?\b/gi, "₱"],
    [/[$€£¥₹₩]\s*/g, (match) => `${match.trim()} `],
    [/[‐‑–—]/g, "-"],
    [/[×x](?=\s*\d)/g, "×"],
    [/•/g, "•"],
];
const LIST_LINE_PATTERN = /^((?:\d+|[A-Za-z])(?:[.)]|-))\s*/;
const CURRENCY_PREFIX = /^(?:₱|[$€£¥₹₩])\s*/i;
const UNIT_SUFFIX = /(%|units?|days?|years?|months?|hours?|kg|g|cm|mm|m|km)$/i;
function isLikelyNumberToken(token) {
    return /\d/.test(token) || /(?:₱|[%$€£¥₹₩])/i.test(token);
}
function normalizeGroupedInteger(value) {
    if (!value.includes(","))
        return value;
    if (/^\d{1,3}(,\d{3})+$/.test(value))
        return value;
    return value.replace(/,/g, "");
}
function normalizeDecimalStructure(value, confidence, flags) {
    if (!/[.,]/.test(value))
        return value;
    if (/^-?\d+[.,]$/.test(value)) {
        flags.add(`Removed a trailing separator from ${value}.`);
        return value.slice(0, -1);
    }
    if (value.includes(".") && value.includes(",")) {
        const [integerPart, decimalPart = ""] = value.split(".");
        return `${normalizeGroupedInteger(integerPart)}.${decimalPart.replace(/[^\d]/g, "")}`;
    }
    if (value.includes(",")) {
        const pieces = value.split(",");
        const looksDecimal = pieces.length === 2 &&
            /^\d{1,4}$/.test(pieces[0]) &&
            /^\d{1,2}$/.test(pieces[1]);
        if (looksDecimal && confidence >= 84) {
            flags.add(`Interpreted ${value} as a decimal value.`);
            return `${pieces[0]}.${pieces[1]}`;
        }
        if (looksDecimal && confidence < 84) {
            flags.add(`Kept ${value} close to raw because the comma could be decimal or thousands grouping.`);
            return value;
        }
        return normalizeGroupedInteger(value);
    }
    const pieces = value.split(".");
    if (pieces.length > 2) {
        const decimalPart = pieces.pop() ?? "";
        flags.add(`Collapsed repeated decimal separators in ${value}.`);
        return `${pieces.join("")}.${decimalPart}`;
    }
    return value;
}
function normalizeNumericToken(token, confidence, flags) {
    const original = token;
    let next = token;
    const prefixMatch = next.match(CURRENCY_PREFIX);
    const prefix = prefixMatch?.[0]?.trim() ?? "";
    if (prefixMatch) {
        next = next.slice(prefixMatch[0].length);
    }
    const suffixMatch = next.match(UNIT_SUFFIX);
    const suffix = suffixMatch?.[0] ?? "";
    if (suffix) {
        next = next.slice(0, -suffix.length);
    }
    const negativeByParens = /^\(.*\)$/.test(next.trim());
    next = next.replace(/[()]/g, "");
    if (/\d/.test(next)) {
        next = next
            .replace(/(?<=\d)[Oo](?=\d|[.,%])/g, "0")
            .replace(/(?<=\d)[Il|](?=\d|[.,%])/g, "1")
            .replace(/(?<=\d)S(?=\d|[.,%])/g, "5")
            .replace(/(?<=\d)B(?=\d|[.,%])/g, "8")
            .replace(/(?<=\d)Z(?=\d|[.,%])/g, "2");
        if (confidence < 70 && /[OoIl|SBZ]/.test(next)) {
            flags.add(`Kept ${original} close to raw because letters and digits may still be mixed.`);
        }
        if (/[A-Za-z]/.test(next)) {
            flags.add(`OCR may have left letters inside the numeric token ${original}.`);
        }
    }
    next = next
        .replace(/[,:;]{2,}/g, ",")
        .replace(/\s+/g, "")
        .replace(/(?<=\d)-(?=\d)/g, " - ");
    next = normalizeDecimalStructure(next, confidence, flags);
    if (negativeByParens && !next.startsWith("-")) {
        next = `-${next}`;
    }
    const normalizedSuffix = suffix
        ? suffix === "%"
            ? "%"
            : ` ${suffix.toLowerCase()}`
        : "";
    const result = `${prefix}${next}${normalizedSuffix}`.trim();
    if (result !== original && confidence < 62 && /\d/.test(result)) {
        flags.add(`Numeric cleanup adjusted ${original}. Review it against the raw OCR text if the exact value matters.`);
    }
    return result;
}
function normalizeLineSpacing(line) {
    return line
        .replace(/[^\S\r\n]+/g, " ")
        .replace(/([A-Za-z])(?=[₱$€£¥₹₩])/g, "$1 ")
        .replace(/(?<=\d)(?=[₱$€£¥₹₩])/g, " ")
        .replace(/(?<=\d)(?=[A-Za-z]{3,}\b)/g, " ")
        .replace(/(?<=[A-Za-z])(?=\d{1,3}(?:[,.]\d{3})*(?:\.\d+)?\b)/g, " ")
        .replace(/(?<=[A-Za-z])(?=\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b)/g, " ")
        .replace(/\s*([:;])\s*/g, "$1 ")
        .replace(/\s*([=+×÷*/])\s*/g, " $1 ")
        .replace(/\s*-\s*(?=\d)/g, " - ")
        .replace(/\(\s+/g, "(")
        .replace(/\s+\)/g, ")")
        .replace(/\s*%\b/g, "%")
        .replace(/\s{2,}/g, " ")
        .trim();
}
function shouldDropLine(line) {
    return /^[~`|_=.:,\-]{4,}$/.test(line);
}
function cleanLine(line, confidence, flags) {
    let next = line;
    for (const [pattern, replacement] of COMMON_REPLACEMENTS) {
        next =
            typeof replacement === "string"
                ? next.replace(pattern, replacement)
                : next.replace(pattern, replacement);
    }
    next = next.replace(LIST_LINE_PATTERN, (_, marker) => {
        const normalizedMarker = marker.endsWith(")") ? `${marker[0]}.` : marker;
        return `${normalizedMarker} `;
    });
    next = normalizeLineSpacing(next);
    const tokens = next.split(" ").map((token) => {
        if (!isLikelyNumberToken(token))
            return token;
        return normalizeNumericToken(token, confidence, flags);
    });
    next = tokens
        .join(" ")
        .replace(/([₱$€£¥₹₩])\s+\1/g, "$1")
        .replace(/\s{2,}/g, " ")
        .replace(/\brequired\b:/i, "Required:")
        .replace(/\bsolution\b:/i, "Solution:")
        .trim();
    return shouldDropLine(next) ? "" : next;
}
function shouldJoinLines(previous, next) {
    if (!previous || !next)
        return false;
    if (/[.:?]$/.test(previous))
        return false;
    if (/^•|^\d+\.|^[A-Za-z]\./.test(next))
        return false;
    if (/^[a-z(]/.test(next))
        return true;
    if (/^[A-Z][a-z]/.test(next) && previous.length < 70)
        return true;
    return false;
}
function rebuildParagraphs(lines) {
    const joined = [];
    lines.forEach((line) => {
        if (!line)
            return;
        const previous = joined[joined.length - 1];
        if (previous && shouldJoinLines(previous, line)) {
            joined[joined.length - 1] = `${previous} ${line}`;
            return;
        }
        joined.push(line);
    });
    return joined;
}
export function cleanupMathLikeText(input, confidence = 70) {
    const cleanupNotes = new Set();
    const flaggedValues = new Set();
    const normalizedLines = input
        .replace(/\r/g, "")
        .replace(/\t/g, " ")
        .split("\n")
        .map((line) => cleanLine(line, confidence, flaggedValues))
        .filter(Boolean);
    const rebuiltLines = rebuildParagraphs(normalizedLines);
    const cleanedText = rebuiltLines
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[ \t]+/g, " ")
        .trim();
    cleanupNotes.add("Cleaned obvious OCR spacing, punctuation, and line merges so the scan reads more like digital text.");
    if (/[₱$€£¥₹₩]/.test(cleanedText) || /%/.test(cleanedText)) {
        cleanupNotes.add("Normalized currency, percentages, and operator spacing without forcing uncertain values into one interpretation.");
    }
    if (flaggedValues.size > 0) {
        cleanupNotes.add("Some numbers were kept close to the raw OCR output because commas, decimals, handwriting, or merged tokens were still uncertain.");
    }
    return {
        cleanedText,
        cleanupNotes: Array.from(cleanupNotes),
        flaggedValues: Array.from(flaggedValues).slice(0, 10),
    };
}
