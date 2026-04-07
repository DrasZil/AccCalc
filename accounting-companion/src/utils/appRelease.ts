export const APP_VERSION = "3.2.3";
export const APP_RELEASE_DATE = "2026-04-08";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "Scan & Check is steadier in 3.2.3",
        body: "The scan flow now restores recent sessions, fits better on smaller screens, and handles image review with less overflow and less friction.",
    },
    {
        title: "Image review is more resilient",
        body: "Images now preview cleanly, fit their containers better, and stay available after navigation instead of disappearing when the user comes back.",
    },
    {
        title: "Cleaner OCR writing",
        body: "OCR output now gets better cleanup for currency, spacing, common OCR typos, and more readable digital text while still preserving raw OCR for review.",
    },
    {
        title: "Better mobile and desktop balance",
        body: "Scan cards, result panels, badges, and review sections now wrap and scale more gracefully on narrow screens while using desktop space more intentionally.",
    },
    {
        title: "Still future-proof and honest",
        body: "The release adds persistence and preview utilities around the existing modular OCR pipeline without flattening the architecture or pretending browser OCR is perfect.",
    },
];

export const APP_RELEASE_NOTES = [
    "3.2.3: Fixed Scan & Check overflow and width issues so result cards, chips, review panels, merged text, and image cards stay within the viewport on smaller screens.",
    "3.2.3: Added on-device scan-session persistence so uploaded images, extracted text, OCR results, and review state survive navigation and recent returns to the page.",
    "3.2.3: Improved image handling with cleaner aspect-ratio fitting, larger preview viewing, clearer remove/replace behavior, and more stable review updates after image changes.",
    "3.2.3: Refined OCR cleanup for spacing, currency, common OCR character confusion, and more readable digital display without hiding raw OCR text.",
    "3.2.3: Added non-intrusive scan toasts for processing, restore, update, remove, and retry feedback with automatic dismissal.",
    "3.2.3: Tightened desktop space usage and mobile scan flow so the page feels less sparse on wide screens and less cramped on phones.",
];
