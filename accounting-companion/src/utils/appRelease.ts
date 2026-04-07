export const APP_VERSION = "3.2.6";
export const APP_RELEASE_DATE = "2026-04-08";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "Home is cleaner in 3.2.6",
        body: "The optional donation surface was removed from Home so the landing page stays visually consistent and focused on primary workflows.",
    },
    {
        title: "Scan & Check opens reliably again",
        body: "Saved scan sessions are now normalized before hydration so old or partially malformed OCR payloads do not crash the route during load.",
    },
    {
        title: "Older session data is repaired safely",
        body: "Missing arrays like likely issues, notes, or flagged values now default safely during restore, and invalid saved entries are ignored or rewritten cleanly.",
    },
    {
        title: "Defensive scan rendering is tighter",
        body: "Scan review panels now guard nested arrays and summary data more carefully, reducing regression risk from partial OCR or persistence state.",
    },
    {
        title: "Settings still keeps support easy to find",
        body: "Donation support remains available in Settings through the themed support section, but it no longer distracts from the Home experience.",
    },
];

export const APP_RELEASE_NOTES = [
    "3.2.6: Removed the donation spotlight card from Home so the landing page stays on-theme and focused on primary calculators and scan workflows.",
    "3.2.6: Kept donation support available from Settings through the existing themed support section instead of the Home layout.",
    "3.2.6: Fixed the Scan & Check load crash caused by restored session objects that were missing nested arrays such as likely issues, notes, or flagged values.",
    "3.2.6: Added scan-session normalization during persistence restore so malformed or older saved payloads are repaired, sanitized, or dropped safely.",
    "3.2.6: Added safer render defaults across Scan & Check so nested arrays and summary values no longer assume fully shaped OCR data.",
    "3.2.6: Preserved the current scan camera, preview, OCR, responsive layout, and session persistence improvements while stabilizing the route.",
];
