export const APP_VERSION = "3.2.0";
export const APP_RELEASE_DATE = "2026-04-07";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "Scan & Check arrives in 3.2",
        body: "AccCalc now includes a browser-first multi-image Scan & Check workflow with OCR review, confidence-aware parsing, preprocessing previews, and Smart Solver handoff.",
    },
    {
        title: "Math notation and UI polish",
        body: "Important formulas, notes, and result labels now use stronger notation, upgraded typography, and cleaner visual hierarchy without regressing the compact shell.",
    },
    {
        title: "Smarter guidance and permissions",
        body: "Smart Solver now surfaces extraction review, solver-confidence context, and likely prompt issues, while Settings now includes permission-first controls for camera, notifications, storage, and support.",
    },
    {
        title: "Richer chart and note interpretation",
        body: "Shared interpretation blocks, chart insights, and stronger narrative helpers now make analytical pages easier to read and explain.",
    },
    {
        title: "Still production-safe",
        body: "The release stays metadata-driven, lazy-routed, and honest about browser-only OCR and local-notification limits instead of pretending cloud-grade capabilities.",
    },
];

export const APP_RELEASE_NOTES = [
    "3.2.0: Added Scan & Check as a lazy-loaded browser-first OCR workflow with multi-image queueing, preprocessing, editable extracted text, confidence-aware parsing, and Smart Solver handoff.",
    "3.2.0: Added permission-first settings for camera, notifications, storage retention, reminder preferences, and donation QR support.",
    "3.2.0: Upgraded formula and result rendering with stronger math notation, better typography, and KaTeX-backed rendering for important formulas.",
    "3.2.0: Extended Smart Solver with extracted-input review, solver-confidence summaries, likely prompt-mistake hints, and scan-origin prompt handoff.",
    "3.2.0: Expanded shared interpretation blocks and chart insight helpers so graph-heavy pages can explain what changed and why it matters.",
    "3.2.0: Kept browser-only OCR and local reminders honest about their constraints instead of overclaiming handwriting or push reliability.",
];
