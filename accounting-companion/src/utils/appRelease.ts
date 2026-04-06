export const APP_VERSION = "2.8.0";
export const APP_RELEASE_DATE = "2026-04-06";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "Solve-for mode becomes a first-class system",
        body: "Core finance, pricing, break-even, depreciation, liquidity, profitability, and turnover pages can now solve for the missing variable with adaptive validation, formulas, and interpretation.",
    },
    {
        title: "Statement analysis gets broader",
        body: "Common-size income statement, common-size balance sheet, horizontal analysis, and working-capital-cycle tools turn AccCalc into a stronger worksheet and review companion for reporting analysis.",
    },
    {
        title: "Capital budgeting becomes a workspace",
        body: "A comparison tool now places NPV, PI, IRR, and discounted payback side by side for one project so students and reviewers can compare methods without jumping between isolated pages.",
    },
    {
        title: "Smart Solver understands missing-variable intent",
        body: "Queries like find the principal, solve for current liabilities, or what selling price gives a target margin can route to the right calculator and preselect a safe solve target.",
    },
    {
        title: "Release stays production-safe",
        body: "The new solve-for layer is shared, tested, mobile-aware, and aligned with the current truthful offline/PWA route model so capability growth does not weaken stability.",
    },
];

export const APP_RELEASE_NOTES = [
    "Added a reusable solve-for-any-variable system for safe formula-driven calculators, with adaptive targets, inputs, validation, formulas, and interpretation.",
    "Upgraded simple interest, compound interest, future value, present value, profit and loss, markup and margin, break-even, contribution margin, straight-line depreciation, current ratio, quick ratio, gross profit rate, return on assets, return on equity, inventory turnover, and receivables turnover.",
    "Added Common-Size Income Statement, Common-Size Balance Sheet, Working Capital and Cycle, and Capital Budgeting Comparison workspaces, plus a stronger multi-line Horizontal Analysis page.",
    "Extended Smart Solver to detect missing-variable intent and route supported calculators with safe solve-target preselection when confidence is high.",
    "Expanded home highlights, route metadata, and search coverage for solve-for workflows, statement analysis, and capital-budgeting comparison.",
    "Added shared formula-intelligence utilities, adaptive result panels, editable analysis rows, and new regression coverage for forward and reverse solve paths.",
    "Kept the existing offline/PWA model truthful and production-safe while updating release metadata, documentation, and route-chunk coverage for 2.8.0.",
];
