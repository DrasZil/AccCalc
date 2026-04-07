const COMMON_REPLACEMENTS: Array<[RegExp, string]> = [
    [/\bO\b/g, "0"],
    [/\bl\b/g, "1"],
    [/x/g, "\u00d7"],
    [/÷/g, "\u00f7"],
    [/-/g, "\u2212"],
];

export function cleanupMathLikeText(input: string) {
    let next = input.replace(/\r/g, "");

    for (const [pattern, replacement] of COMMON_REPLACEMENTS) {
        next = next.replace(pattern, replacement);
    }

    return next
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

