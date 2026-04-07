export const APP_VERSION = "3.2.5";
export const APP_RELEASE_DATE = "2026-04-08";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "OCR quality is stronger in 3.2.5",
        body: "Scan & Check now applies more image-aware preprocessing so screenshots, textbook photos, soft captures, and accounting tables clean up more reliably before OCR runs.",
    },
    {
        title: "Digits and symbols separate more safely",
        body: "Numeric cleanup now treats commas, decimals, percentages, and currency more carefully so short values like 6 are less likely to keep stray punctuation or merge with nearby text.",
    },
    {
        title: "Handwriting and blur are flagged more honestly",
        body: "The scan flow now detects softer handwriting-like images and mild blur earlier, cleans what is safe, and leaves questionable values closer to raw OCR when confidence is weak.",
    },
    {
        title: "Cleaned and raw text are easier to compare",
        body: "Review panels now make a clearer distinction between cleaned text, raw OCR, and flagged numeric values so users can verify critical accounting amounts faster.",
    },
    {
        title: "The OCR upgrade stays modular",
        body: "This release extends the existing preprocessing, parser, and review layers without disturbing the working mobile camera flow, session persistence, preview modal, or toast system.",
    },
];

export const APP_RELEASE_NOTES = [
    "3.2.5: Added stronger image-aware preprocessing with border trimming, adaptive contrast tuning, and mild sharpening for soft screenshots, textbook photos, and accounting-style tables.",
    "3.2.5: Improved OCR cleanup for accounting text so currency, percentages, grouped numbers, and list formatting display more like readable digital text.",
    "3.2.5: Tightened number and punctuation handling so obvious stray endings like 6, are cleaned more safely without blindly rewriting uncertain values.",
    "3.2.5: Added clearer flagged-value handling so low-confidence commas, decimals, and handwriting-like digits stay closer to raw OCR and surface as review warnings.",
    "3.2.5: Added cleaned-vs-raw merged text review plus per-image cleanup notes and image-type summaries inside the existing scan result flow.",
    "3.2.5: Preserved the 3.2.4 camera capture, session restore, preview modal, toast system, and responsive layout fixes while improving OCR robustness on top of them.",
];
