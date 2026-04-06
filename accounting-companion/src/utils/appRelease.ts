export const APP_VERSION = "2.4.0";
export const APP_RELEASE_DATE = "2026-04-06";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "Truthful offline route caching",
        body: "AccCalc now precaches the deployed route chunks for offline-safe local tools instead of relying only on the shell and whatever pages happened to be visited before going offline.",
    },
    {
        title: "Chunk mismatch recovery",
        body: "Lazy route failures now surface honest recovery guidance, stale deploy mismatches raise refresh notices, and the service worker keeps one prior asset cache to reduce broken stale-tab chunk loads.",
    },
    {
        title: "Capability-based offline labels",
        body: "Routes, search results, headers, and dashboard cards now distinguish fully offline-safe routes from limited-offline routes instead of using one blanket offline claim.",
    },
    {
        title: "Adaptive Smart Solver",
        body: "Smart Solver now shows route availability, expandable review fields, beginner and professional guidance modes, and stronger routing for aging-schedule and sales-mix workflows.",
    },
    {
        title: "Deeper accounting flexibility",
        body: "Allowance, COGM, and trial balance workflows now support more realistic setup modes, while new receivables aging and sales-mix break-even tools widen coverage in accounting and CVP.",
    },
];

export const APP_RELEASE_NOTES = [
    "Added a build-time asset manifest and updated the service worker to precache route chunks, track cache readiness, and report deployment mismatches to the app.",
    "Changed navigation handling to refresh the root shell safely, preserved one prior asset cache to soften stale-tab deploy mismatches, and added route-level lazy-load recovery UI.",
    "Reworked offline messaging across the shell, homepage, install guide, and search to distinguish full offline support, limited offline support, and still-online actions.",
    "Added offline availability checks to sidebar navigation and Smart Solver route opening so users are warned before entering an unavailable route while offline.",
    "Expanded Allowance for Doubtful Accounts with both percentage and aging-schedule methods, including required ending allowance and adjustment guidance.",
    "Added a dedicated Receivables Aging Schedule tool with dynamic aging buckets and net realizable value output.",
    "Expanded Cost of Goods Manufactured with a derived-materials-used setup for problems that provide a raw-materials schedule instead of direct materials used directly.",
    "Expanded Trial Balance Checker with a line-item entry mode so totals can be built and checked inside the tool itself.",
    "Added a Sales Mix Break-even tool for multi-product CVP analysis using composite units and weighted contribution margin.",
    "Upgraded Smart Solver with route-availability awareness, expandable review fields, new routing coverage, and clearer student-versus-practice guidance.",
    "Added tests for receivables aging math, sales-mix break-even math, and route search coverage for the new tools.",
];
