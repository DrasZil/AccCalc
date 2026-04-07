export const APP_VERSION = "3.2.2";
export const APP_RELEASE_DATE = "2026-04-08";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "Scan & Check is simpler in 3.2.2",
        body: "The scan flow now auto-processes images, shows clearer progress phases, highlights one suggested next action, and hides deeper OCR controls until review is needed.",
    },
    {
        title: "Smarter automatic routing",
        body: "AccCalc now does more automatic topic detection for equations, worked solutions, textbook pages, accounting worksheets, and broader study pages before suggesting the best next tool.",
    },
    {
        title: "Calmer progress and mobile review",
        body: "Multi-image scan sessions now expose clearer image-by-image progress, cleaner mobile cards, and less button-heavy review surfaces.",
    },
    {
        title: "Accounting continuity stays strong",
        body: "The process-costing session logic, page-role detection, structured extraction, and workspace handoff remain in place while the review flow is lighter and more guided.",
    },
    {
        title: "Still future-proof and honest",
        body: "OCR stays behind modular preprocessing, classification, extraction, and routing seams so stronger document models can be added later without rewriting the scan UI.",
    },
];

export const APP_RELEASE_NOTES = [
    "3.2.2: Redesigned Scan & Check into a simpler capture > processing > review > result flow with automatic OCR, classification, extraction, and route suggestion after upload.",
    "3.2.2: Replaced the button-heavy default scan surface with one prioritized next action, calmer progress feedback, and expandable advanced review for per-image controls.",
    "3.2.2: Added clearer processing phases, session-level progress, image-quality warnings, and broader routing support for equations, worked solutions, textbook pages, notes, business/econ prompts, and accounting worksheets.",
    "3.2.2: Kept process-costing worksheet detection, structured accounting extraction, page-role grouping, and merged accounting sessions while presenting them in a lighter review flow.",
    "3.2.2: Improved mobile scan usability with more touch-friendly controls, less clutter, and a cleaner image-by-image review layout.",
    "3.2.2: Preserved the OCR adapter-style architecture so stronger browser or server OCR providers can be added later without a scan-flow rewrite.",
];
