export const APP_VERSION = "2.6.0";
export const APP_RELEASE_DATE = "2026-04-06";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "Accounting depth expansion",
        body: "The release adds bond amortization, lower-of-cost-or-NRV valuation, weighted-average equivalent units, and more variance coverage to deepen intermediate and managerial accounting workflows.",
    },
    {
        title: "Budgeting and planning tools",
        body: "Cash Budget, Flexible Budget, and Discounted Payback Period extend the app from formula lookup into more realistic planning and capital-budgeting support.",
    },
    {
        title: "Curriculum-shaped navigation",
        body: "Sidebar groups now break into subtopics like Receivables and Cash, Inventory, Liabilities, Budgeting, and Variances so the larger catalog stays teachable and scannable.",
    },
    {
        title: "Smart Solver broader reach",
        body: "Smart Solver now recognizes more budgeting, valuation, and bond-language prompts, with route metadata and search aligned to the larger tool system.",
    },
    {
        title: "Offline-safe feature growth",
        body: "All newly added local tools stay inside the existing truthful offline/PWA model so the expansion increases coverage without weakening route reliability.",
    },
];

export const APP_RELEASE_NOTES = [
    "Added Lower of Cost or NRV, Bond Amortization Schedule, Cash Budget, Flexible Budget, Equivalent Units (Weighted Average), Materials Quantity Variance, Labor Efficiency Variance, and Discounted Payback Period.",
    "Expanded accounting coverage across inventory valuation, liabilities, process costing, budgeting, and standard-cost variance analysis without adding disconnected filler tools.",
    "Reorganized sidebar groups into curriculum-aware subtopics so the growing catalog remains easier to scan on both desktop and mobile.",
    "Broadened search coverage and Smart Solver vocabulary for bond, budgeting, valuation, and variance prompts.",
    "Kept the calculator-first layout, compact mobile headers, resilient result-card system, and modular formula guides from the previous UI passes.",
    "Preserved truthful offline route behavior for the new locally computed tools, including route availability checks and stale-deploy protection.",
    "Added new shared math helpers and regression tests so the expanded feature set stays standardized across routes and future updates.",
];
