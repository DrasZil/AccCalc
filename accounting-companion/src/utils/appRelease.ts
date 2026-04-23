export const APP_VERSION = "10.0.0";
export const APP_RELEASE_DATE = "2026-04-23";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "AccCalc 10.0.0 expands the library-driven curriculum layer",
        body: "New calculators and lessons deepen financial statement analysis, statistics, retail pricing, capital rationing, FAR provisions, and AFAR franchise revenue using original content inspired by major accounting, analytics, and business topic families.",
    },
    {
        title: "Statement analysis is more professional and diagnostic",
        body: "DuPont ROE and earnings-quality routes now connect margin, turnover, leverage, operating cash flow, accrual pressure, and related workpaper support.",
    },
    {
        title: "Statistics and business analytics coverage is broader",
        body: "A confidence interval helper adds margin-of-error and standard-error support for audit sampling, forecasting, quality, and marketing-research style cases.",
    },
    {
        title: "Retail, pricing, and capital selection are better connected",
        body: "Retail markup/markdown and capital-rationing tools strengthen the bridge between cost accounting, management services, retail planning, and investment selection.",
    },
    {
        title: "FAR and AFAR special-topic coverage is more balanced",
        body: "Provision expected-value and franchise revenue workspaces convert previously lesson-heavy topics into usable assignment-support tools with visible assumptions.",
    },
] as const;

export const APP_RELEASE_NOTES = [
    "10.0.0: Added DuPont ROE Analyzer and Earnings Quality and Accruals Analyzer for deeper financial statement analysis.",
    "10.0.0: Added Confidence Interval Helper for statistics, analytics, audit sampling, forecasting, and market-research estimate support.",
    "10.0.0: Added Retail Markup and Markdown Planner plus Capital Rationing Prioritizer for pricing and management-services decision support.",
    "10.0.0: Added FAR Provision Expected Value Planner and AFAR Franchise Revenue Workspace with explicit recognition and assumption notes.",
    "10.0.0: Added Study Hub modules, OCR route patterns, Smart Solver route matches, and workpaper templates for all new v10 topic families.",
    "10.0.0: Added regression tests for the new shared math helpers and discovery paths.",
    "10.0.0: Stabilized the production build script around the direct TypeScript project compile path used by the current Vite setup.",
] as const;
