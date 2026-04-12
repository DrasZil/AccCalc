export const APP_VERSION = "4.3.0";
export const APP_RELEASE_DATE = "2026-04-12";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "Navigation now frees reading space more intelligently",
        body: "The mobile bottom navigation now hides on downward scroll and returns on upward scroll, while the shared page shell uses desktop width more intentionally for dense workspaces and study pages.",
    },
    {
        title: "Formula and disclosure rendering are harder to break",
        body: "Shared formula, disclosure, and narrow-width card styling now handle long headings, action clusters, and KaTeX accessibility markup more safely so lesson and calculator surfaces stay readable.",
    },
    {
        title: "Study Hub coverage now reaches deeper into cash-control learning",
        body: "Bank reconciliation now has a full topic lesson, quiz path, calculator-study linkage, and smarter search/routing vocabulary instead of living as a formula-only page.",
    },
    {
        title: "Labels and planning terminology are more consistent",
        body: "CVP wording now aligns more closely across formulas, lessons, and results by using clearer planning language such as required units for target profit instead of mixed labels.",
    },
];

export const APP_RELEASE_NOTES = [
    "4.3.0: Added bottom-navigation hide-on-scroll behavior so mobile reading surfaces gain space on downward scroll and restore navigation predictably on upward scroll.",
    "4.3.0: Added a new data-dense page-shell mode and widened shared desktop layout rules so analysis, scan, quiz, schedule, and workspace routes use wide screens more intelligently.",
    "4.3.0: Hardened shared disclosure-panel headers so titles, summaries, pills, and action buttons wrap instead of crushing the summary column on narrow widths.",
    "4.3.0: Fixed duplicated KaTeX formula output by hiding accessibility-only math markup correctly, which removes the visible double-render issue in affected lesson and calculator formula blocks.",
    "4.3.0: Polished the shared return button presentation so deeper lesson, quiz, and calculator routes keep subtle back navigation without adding noisy chrome.",
    "4.3.0: Added a full Study Hub topic and quiz path for Bank Reconciliation and Cash Control, then linked the calculator back into lesson and practice flow through StudySupportPanel.",
    "4.3.0: Broadened route-search and Smart Solver language for bank reconciliation, cash collections schedules, cash budgets, and target-profit wording with stronger classroom-style aliases.",
    "4.3.0: Tightened CVP naming consistency by standardizing required units for target profit across study content, result labels, and worked explanations.",
    "4.2.0: Fixed the remaining narrow-width study-panel collapse by changing the shared disclosure-header layout so action clusters wrap instead of starving the summary column.",
    "4.2.0: Hardened shared math-container styling and formula-card rendering so prose-heavy study content stays in readable UI text while symbolic equations remain in the dedicated math display path.",
    "4.2.0: Removed duplicated formula heading output from study-topic formula cards and tightened mobile wrapping for formula, step, and explanatory content.",
    "4.2.0: Added a new Job Order Cost Sheet calculator for direct materials, direct labor, applied overhead, total job cost, prime cost, conversion cost, and unit-cost reading.",
    "4.2.0: Integrated Job Order Cost Sheet into Smart Solver routing so classroom wording like job cost sheet, batch cost, prime cost, and applied manufacturing overhead routes more accurately.",
    "4.2.0: Added a full Study Hub lesson and quiz path for Job Order Costing Foundations, including worked examples, self-check prompts, and common-mistake guidance.",
    "4.2.0: Connected the new job-order topic back to process costing, budgeting, and accounting-foundation review paths so manufacturing-cost learning flows stay linked instead of isolated.",
    "4.1.1: Fixed the runtime route failure caused by a browser-unsafe formula-render path so affected calculators can render without throwing 'require is not defined'.",
    "4.1.1: Hardened the shared math-render wrapper with a browser-safe rendering path and safer fallback behavior for route stability.",
    "4.1.1: Added a reusable RelatedLinksPanel so related tools, calculators, and topics can stay collapsible across calculator pages, study pages, and support panels.",
    "4.1.1: Replaced always-open Study Hub calculator-family pill walls with collapsible related-link grids so narrow widths stop feeling crowded and brittle.",
    "4.1.1: Fixed the compact readable-card grid primitive at the shared CSS layer so compact card groups actually render as grids instead of inheriting broken narrow-width behavior.",
    "4.1.1: Hardened shared list-link, page-header, and grid min-width rules so dense card rows, wrapped controls, and narrow-width action clusters stay readable.",
    "4.1.1: Reworked FormulaBlock statement normalization so bullet-separated formula explanations split into readable instructional lines instead of one jammed decorative block.",
    "4.1.1: Added stronger worker failure cleanup for Scan parsing and Smart Solver analysis so a crashed worker no longer leaves the browser session stuck on a poisoned instance.",
    "4.1.1: Preserved the existing 4.1.0 formula-rendering, service-worker, worker, IndexedDB, and Study Hub layers while tightening the shared integration boundaries that sit underneath them.",
    "4.1.0: Added a reusable formula-rendering layer so lessons, formula cards, and quiz explanations can show cleaner textbook-style equations without forcing prose into math styling.",
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
