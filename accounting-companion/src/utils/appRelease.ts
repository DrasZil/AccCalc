export const APP_VERSION = "4.1.1";
export const APP_RELEASE_DATE = "2026-04-11";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "Rendering routes are safer and more stable",
        body: "Browser-unsafe MathJax version-loading paths were removed from the shared render flow so affected calculator and study routes can load normally again.",
    },
    {
        title: "Study Hub browsing is cleaner on narrow widths",
        body: "Dense calculator-family coverage now uses collapsible related-link panels with stronger wrapping and card-grid rules, which keeps Study Hub easier to scan on smaller screens.",
    },
    {
        title: "Related Tools now stays tucked away until needed",
        body: "Shared collapsible Related Tools and Related Topics panels now reduce page length and content overload across calculator, study, and support surfaces.",
    },
    {
        title: "Platform features fail more gracefully",
        body: "Worker-backed scan and Smart Solver processing now recover more safely from worker errors, while formula blocks and page headers use stronger shared layout and text handling.",
    },
];

export const APP_RELEASE_NOTES = [
    "4.1.1: Fixed the runtime route failure caused by a browser-unsafe MathJax version-loading path so affected calculators can render without throwing 'require is not defined'.",
    "4.1.1: Hardened the shared math-render wrapper with an explicit browser-safe lazy load path and a typed fallback declaration for the shipped MathJax browser bundle.",
    "4.1.1: Added a reusable RelatedLinksPanel so Related tools, calculators, and topics can stay collapsible across calculator pages, study pages, and support panels.",
    "4.1.1: Replaced always-open Study Hub calculator-family pill walls with collapsible related-link grids so narrow widths stop feeling crowded and brittle.",
    "4.1.1: Fixed the compact readable-card grid primitive at the shared CSS layer so compact card groups actually render as grids instead of inheriting broken narrow-width behavior.",
    "4.1.1: Hardened shared list-link, page-header, and grid min-width rules so dense card rows, wrapped controls, and narrow-width action clusters stay readable.",
    "4.1.1: Reworked FormulaBlock statement normalization so bullet-separated formula explanations split into readable instructional lines instead of one jammed decorative block.",
    "4.1.1: Added stronger worker failure cleanup for Scan parsing and Smart Solver analysis so a crashed worker no longer leaves the browser session stuck on a poisoned instance.",
    "4.1.1: Preserved the existing 4.1.0 MathJax, service-worker, worker, IndexedDB, and Study Hub layers while tightening the shared integration boundaries that sit underneath them.",
    "4.1.0: Added a reusable MathJax-based formula rendering layer so lessons, formula cards, and quiz explanations can show cleaner textbook-style equations without forcing prose into math styling.",
    "4.1.0: Reworked dynamic math markup through one controlled rendering path to reduce ad-hoc HTML injection and keep math-vs-prose rendering explicit.",
    "4.1.0: Replaced the old static service worker with a module-built Workbox service worker that preserves AccCalc's existing update messaging while improving offline route reliability and asset caching.",
    "4.1.0: Kept the existing update and offline-status lifecycle intact, but upgraded it to work with a safer service-worker build path and app-shell warming strategy.",
    "4.1.0: Moved scan parsing and Smart Solver matching into typed background-worker adapters with graceful direct fallbacks so large OCR and routing tasks stop competing with the main UI thread.",
    "4.1.0: Upgraded Study Hub progress persistence to an IndexedDB-backed local store with localStorage mirroring so bookmarks, notes, reviewed sections, and quiz history survive more reliably.",
    "4.1.0: Added ResizeObserver-backed chart sizing so chart labels, callouts, and comparison bars adapt better to their actual containers instead of relying on coarse viewport assumptions.",
    "4.1.0: Reworked Study Hub lesson pages into progressive-disclosure reading surfaces so large topics, worked examples, and review sections stay easier to digest on both mobile and desktop.",
    "4.1.0: Added transition-safe lesson and quiz navigation polish for the Study Hub flow while respecting reduced-motion users and unsupported browsers.",
    "4.1.0: Expanded Study Hub coverage at the system level by surfacing calculator-family coverage directly from the app catalog so every current calculator family is reachable from the learning center.",
    "4.1.0: Preserved the existing 4.0.0 Study Hub, quiz, bookmark, scan-to-learn, and layout fixes while layering the new platform features behind shared abstractions instead of page-specific rewrites.",
];
