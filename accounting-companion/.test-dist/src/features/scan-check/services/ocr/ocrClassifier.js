const KIND_PATTERNS = {
    equation: [
        /\bsolve for\b/i,
        /\bevaluate\b/i,
        /\bsimplify\b/i,
        /\bfind x\b/i,
        /[A-Za-z0-9)]\s*=\s*[A-Za-z0-9(]/,
        /\d\s*[+\-*/]\s*\d/,
    ],
    "word-problem": [
        /\bhow many\b/i,
        /\bwhat is\b/i,
        /\bdetermine\b/i,
        /\bgiven\b/i,
        /\bphp\b/i,
        /\brate\b/i,
        /\bunits?\b/i,
    ],
    "worked-solution": [
        /\bsolution\b/i,
        /\bstep\s*\d+\b/i,
        /\btherefore\b/i,
        /\banswer\b[:=]/i,
        /\bcheck\b[:=]/i,
    ],
    "answer-check": [
        /\bis it right\b/i,
        /\bcompare\b/i,
        /\bmy answer\b/i,
        /\bcorrect answer\b/i,
        /\bverify\b/i,
    ],
    "textbook-page": [
        /\bchapter\b/i,
        /\billustration\b/i,
        /\bexercise\b/i,
        /\bdiscussion\b/i,
        /\btable of contents\b/i,
    ],
    "notes-reference": [
        /\bnotes?\b/i,
        /\bsummary\b/i,
        /\bformula sheet\b/i,
        /\bkey idea\b/i,
        /\bmeaning\b/i,
        /\bdefinition\b/i,
    ],
    "accounting-worksheet": [/^$/],
    unknown: [/^$/],
};
export function classifyScanText(text) {
    const normalized = text.trim();
    if (!normalized)
        return "unknown";
    const scores = Object.entries(KIND_PATTERNS)
        .filter(([kind]) => kind !== "accounting-worksheet" && kind !== "unknown")
        .map(([kind, patterns]) => ({
        kind,
        score: patterns.filter((pattern) => pattern.test(normalized)).length,
    }))
        .sort((left, right) => right.score - left.score);
    const best = scores[0];
    if (!best || best.score === 0)
        return "unknown";
    if (best.kind === "equation" &&
        /\bchapter\b|\bdiscussion\b|\bsummary\b/i.test(normalized)) {
        return "notes-reference";
    }
    return best.kind;
}
