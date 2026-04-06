export const APP_VERSION = "2.7.0";
export const APP_RELEASE_DATE = "2026-04-06";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "Capital-budgeting coverage grows up",
        body: "IRR joins NPV, profitability index, and discounted payback, while NPV and PI now support terminal cash flows and clearer decision support.",
    },
    {
        title: "Working-paper schedules arrive",
        body: "Cash collections and cash disbursements schedules now connect budgeting work to the cash-budget workflow instead of forcing one-number receipt and payment estimates.",
    },
    {
        title: "Accounting workflows deepen",
        body: "Bank reconciliation now covers interest income and notes collected by bank, receivables aging adds adjustment guidance, and factory overhead variances plus a ratio-analysis workspace broaden classroom and review use.",
    },
    {
        title: "Smarter routing and clearer discovery",
        body: "Smart Solver, search, home workflows, and sidebar metadata now understand IRR, schedule-based budgeting, overhead variance prompts, and ratio-analysis language more reliably.",
    },
    {
        title: "Release stays production-safe",
        body: "The 2.7.0 tools use shared helpers, added regression coverage, and the existing truthful offline/PWA route model so feature growth does not weaken deployment reliability.",
    },
];

export const APP_RELEASE_NOTES = [
    "Added Internal Rate of Return, Cash Collections Schedule, Cash Disbursements Schedule, Factory Overhead Variances, and Ratio Analysis Workspace.",
    "Upgraded Net Present Value and Profitability Index with optional terminal cash flow handling and stronger decision summaries.",
    "Expanded Bank Reconciliation with bank charges, interest income, notes collected by bank, and clearer bank-side versus book-side breakdowns.",
    "Added receivables-aging adjustment guidance and broadened sales-mix analysis into target-profit and margin-of-safety planning.",
    "Extended Smart Solver and search metadata for IRR, ratio analysis, cash receipts and payments schedules, bank-reconciliation additions, and overhead-variance language.",
    "Tightened shared mobile input density and accessibility with better numeric input defaults, textarea density, and safer form labeling across touched pages.",
    "Added developer-facing architecture and extension documentation plus new regression tests for capital budgeting, schedules, overhead variances, ratio analysis, and route search.",
];
