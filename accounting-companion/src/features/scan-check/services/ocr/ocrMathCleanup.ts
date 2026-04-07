type CleanupResult = {
    cleanedText: string;
    cleanupNotes: string[];
    flaggedValues: string[];
};

const COMMON_REPLACEMENTS: Array<[RegExp, string]> = [
    [/ÃƒÂ·/g, "/"],
    [/Ãƒâ€”/g, "x"],
    [/[â€â€‘â€’â€“â€”]/g, "-"],
    [/\bphp\b/gi, "PHP"],
    [/\bpeso(?:s)?\b/gi, "PHP"],
    [/[â‚±]\s*/g, "PHP "],
];

function isLikelyNumberToken(token: string) {
    return /\d/.test(token) || /(?:PHP|[%$])/i.test(token);
}

function isValidThousandsGrouping(value: string) {
    return /^\d{1,3}(,\d{3})+$/.test(value);
}

function normalizeGroupedInteger(value: string) {
    if (!value.includes(",")) return value;
    if (isValidThousandsGrouping(value)) return value;
    return value.replace(/,/g, "");
}

function normalizeDecimalStructure(
    value: string,
    confidence: number,
    flags: Set<string>
) {
    if (!/[.,]/.test(value)) return value;

    const trailingComma = value.match(/^-?\d+,$/);
    if (trailingComma) {
        flags.add(`Removed a trailing comma from ${trailingComma[0]}.`);
        return trailingComma[0].slice(0, -1);
    }

    const trailingPeriod = value.match(/^-?\d+\.$/);
    if (trailingPeriod) {
        flags.add(`Removed a trailing period from ${trailingPeriod[0]}.`);
        return trailingPeriod[0].slice(0, -1);
    }

    if (value.includes(".") && value.includes(",")) {
        const [integerPart, decimalPart = ""] = value.split(".");
        return `${normalizeGroupedInteger(integerPart)}.${decimalPart.replace(/[^\d]/g, "")}`;
    }

    if (value.includes(",")) {
        const segments = value.split(",");
        if (segments.length === 2 && /^\d{1,4}$/.test(segments[0]) && /^\d{1,2}$/.test(segments[1])) {
            if (confidence >= 82) {
                flags.add(`Interpreted ${value} as a decimal value.`);
                return `${segments[0]}.${segments[1]}`;
            }
            flags.add(`Kept ${value} as raw because the comma may be a decimal or grouping separator.`);
            return value;
        }

        return normalizeGroupedInteger(value);
    }

    const pieces = value.split(".");
    if (pieces.length > 2) {
        const decimalPart = pieces.pop() ?? "";
        return `${pieces.join("")}.${decimalPart}`;
    }

    return value;
}

function normalizeNumericToken(
    token: string,
    confidence: number,
    flags: Set<string>
) {
    const original = token;
    let next = token;
    const prefixMatch = next.match(/^(PHP|[$])\s*/i);
    const prefix = prefixMatch?.[0] ?? "";
    if (prefix) {
        next = next.slice(prefix.length);
    }

    const suffixMatch = next.match(/(%|units?|days?|years?|months?|hours?)$/i);
    const suffix = suffixMatch?.[0] ?? "";
    if (suffix) {
        next = next.slice(0, -suffix.length);
    }

    if (/\d/.test(next)) {
        next = next
            .replace(/(?<=\d)[Oo](?=\d|[.,%])/g, "0")
            .replace(/(?<=\d)[Il|](?=\d|[.,%])/g, "1")
            .replace(/(?<=\d)S(?=\d|[.,%])/g, "5")
            .replace(/(?<=\d)B(?=\d|[.,%])/g, "8")
            .replace(/(?<=\d)Z(?=\d|[.,%])/g, "2");

        if (confidence >= 76) {
            next = next
                .replace(/(?<=\d)[Oo](?=$|[^\w])/g, "0")
                .replace(/(?<=\d)[Il|](?=$|[^\w])/g, "1");
        } else if (/[OoIl|SBZ]/.test(next)) {
            flags.add(`Kept ${original} close to raw because letters and digits may be mixed.`);
        }
    }

    next = next
        .replace(/[,:;]{2,}/g, ",")
        .replace(/(?<=\d)\s+(?=[.,]\d)/g, "")
        .replace(/\s+/g, "");

    next = normalizeDecimalStructure(next, confidence, flags);

    const normalizedPrefix = prefix ? "PHP " : "";
    const normalizedSuffix = suffix ? (suffix.startsWith("%") ? "%" : ` ${suffix}`) : "";
    const result = `${normalizedPrefix}${next}${normalizedSuffix}`.trim();

    if (result !== original && confidence < 62 && /\d/.test(result)) {
        flags.add(`Numeric cleanup adjusted ${original}. Review the value if it is important.`);
    }

    return result;
}

function normalizeListLine(line: string) {
    return line
        .replace(/^(\d+)\s*[,)]\s+/g, "$1. ")
        .replace(/^([A-Za-z])\s*[,)]\s+/g, "$1. ");
}

function normalizeLineSpacing(line: string) {
    return line
        .replace(/[^\S\r\n]+/g, " ")
        .replace(/\s*([:;])\s*/g, "$1 ")
        .replace(/\s*([=+\-x/])\s*/g, " $1 ")
        .replace(/\(\s+/g, "(")
        .replace(/\s+\)/g, ")")
        .replace(/\s*%\b/g, "%")
        .replace(/(?<=\d)\s*(units?|days?|years?|months?|hours?)\b/gi, " $1")
        .replace(/\s{2,}/g, " ")
        .trim();
}

function shouldDropLine(line: string) {
    return /^[~`|_=.:,\-]{4,}$/.test(line);
}

function cleanLine(line: string, confidence: number, flags: Set<string>) {
    let next = normalizeListLine(line);

    for (const [pattern, replacement] of COMMON_REPLACEMENTS) {
        next = next.replace(pattern, replacement);
    }

    next = normalizeLineSpacing(next);

    const tokens = next.split(" ").map((token) => {
        if (!isLikelyNumberToken(token)) return token;
        return normalizeNumericToken(token, confidence, flags);
    });

    next = tokens
        .join(" ")
        .replace(/\bPHP\s+PHP\b/g, "PHP")
        .replace(/\s{2,}/g, " ")
        .replace(/(?<!\d),(?!\d)/g, ",")
        .replace(/\brequired\b:/i, "Required:")
        .replace(/\bsolution\b:/i, "Solution:")
        .replace(/\bending work in process\b/gi, "Ending work in process")
        .trim();

    return shouldDropLine(next) ? "" : next;
}

function joinBrokenLines(lines: string[]) {
    const joined: string[] = [];

    lines.forEach((line) => {
        if (!line) return;
        const previous = joined[joined.length - 1];
        if (
            previous &&
            !/[.:?)]$/.test(previous) &&
            /^[a-z(]/.test(line) &&
            previous.length < 90
        ) {
            joined[joined.length - 1] = `${previous} ${line}`;
            return;
        }
        joined.push(line);
    });

    return joined;
}

export function cleanupMathLikeText(input: string, confidence = 70): CleanupResult {
    const cleanupNotes = new Set<string>();
    const flaggedValues = new Set<string>();
    const normalizedLines = input
        .replace(/\r/g, "")
        .replace(/\t/g, " ")
        .split("\n")
        .map((line) => cleanLine(line, confidence, flaggedValues))
        .filter(Boolean);

    const joinedLines = joinBrokenLines(normalizedLines);
    const cleanedText = joinedLines
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[ \t]+/g, " ")
        .trim();

    cleanupNotes.add("Cleaned obvious OCR spacing and punctuation for easier review.");

    if (/\bPHP\s+\d/.test(cleanedText) || /%/.test(cleanedText)) {
        cleanupNotes.add("Normalized accounting-style currency, percentages, and numeric spacing.");
    }
    if (flaggedValues.size > 0) {
        cleanupNotes.add("Preserved some uncertain numeric text close to the raw OCR output.");
    }

    return {
        cleanedText,
        cleanupNotes: Array.from(cleanupNotes),
        flaggedValues: Array.from(flaggedValues).slice(0, 8),
    };
}
