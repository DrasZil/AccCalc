export const APP_VERSION = "3.3.0";
export const APP_RELEASE_DATE = "2026-04-11";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "Scan text is cleaner and safer",
        body: "OCR cleanup now reconstructs spacing, punctuation, and currency more carefully while flagging uncertain numeric values instead of silently forcing risky corrections.",
    },
    {
        title: "Scan routing is smarter",
        body: "Scan & Check now ranks best-fit tools with reasons, supports stronger CVP and partnership detection, and falls back to Smart Solver only when the text stays ambiguous.",
    },
    {
        title: "Learn content is clearer across calculators",
        body: "The old Guide language has been replaced with Learn-focused wording, formulas stay inside their cards more reliably, and explanatory sections read more like educational text instead of accidental math styling.",
    },
    {
        title: "CVP and partnership coverage expanded",
        body: "AccCalc 3.3.0 adds a broader CVP Analysis page and a new Partnership Dissolution workflow while strengthening the existing CVP and partnership tool chain.",
    },
    {
        title: "Notifications and support prompts are calmer",
        body: "Global notices now deduplicate repeated events more reliably, and the optional donation prompt stays lightweight, dismissible, and separate from the main workflow.",
    },
];

export const APP_RELEASE_NOTES = [
    "3.3.0: Upgraded OCR cleanup to recover spacing, punctuation, operator separation, and currency formatting more safely while exposing uncertain numeric values for review.",
    "3.3.0: Added ranked scan-to-tool recommendations with reason text so Scan & Check can suggest the best-fit calculator or a short fallback list instead of a weak single guess.",
    "3.3.0: Reworked shared formula and learning rendering so formulas wrap more safely, plain explanatory text stays readable, and Learn replaces the older Guide label across calculator flows.",
    "3.3.0: Added a broader CVP Analysis page covering contribution margin, break-even, target profit, margin of safety, operating leverage, and quick sensitivity checks.",
    "3.3.0: Added Partnership Dissolution support with realization gain or loss, liquidation cash, and deficiency-aware partner settlement guidance.",
    "3.3.0: Rewrote the About page and refreshed the home messaging so AccCalc more clearly presents itself as a tool for solving, checking, and learning.",
    "3.3.0: Hardened global notices to reduce duplicate toasts and added a respectful optional support prompt that routes users to the donation section without interrupting work.",
];
