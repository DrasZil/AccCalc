export const APP_VERSION = "10.5.0";
export const APP_RELEASE_DATE = "2026-04-23";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "AccCalc 10.5.0 focuses on student reliability",
        body: "This release hardens existing tools, Workpaper Studio, OCR review, Smart Solver routing, and saved-state safety so students can trust the app under deadline pressure.",
    },
    {
        title: "Workpaper Studio becomes Workpaper 2.0",
        body: "Workpapers now clamp oversized imported or saved sheets, surface workbook health, keep template search responsive, and protect narrow-screen editing from heavy storage work.",
    },
    {
        title: "Smart Solver and OCR are safer when uncertain",
        body: "Low-confidence or flagged routes now pause for review before opening tools, making manual correction the default safety valve instead of blind automation.",
    },
    {
        title: "Saved workpaper state is more survivable",
        body: "Malformed, oversized, or migrated workbook data is sanitized before rendering so old local data is less likely to crash or overload the spreadsheet surface.",
    },
    {
        title: "Computation hardening stays visible",
        body: "Confidence intervals keep explicit z/t assumptions, capital rationing keeps exact-search limits visible, and regression coverage protects the core classroom math paths.",
    },
    {
        title: "The app is easier to hand off",
        body: "Release notes, system overview, maintenance guidance, and generated documentation now describe the reliability guardrails and remaining assumptions for future maintainers.",
    },
] as const;

export const APP_RELEASE_NOTES = [
    "10.5.0: Hardened Workpaper Studio with workbook health cues, bounded imported/saved sheets, and safer autosave/template filtering behavior.",
    "10.5.0: Added review-before-route guards for low-confidence Smart Solver and Scan & Check suggestions.",
    "10.5.0: Clamped workpaper dimensions at creation, import, save, and transfer boundaries to protect narrow screens and heavy surfaces.",
    "10.5.0: Updated docs and README around student-trust assumptions, Workpaper 2.0 behavior, OCR/Smart Solver uncertainty, and known limitations.",
    "10.1.0: Added Segmented Income Statement Analyzer and PERT Project Estimate Helper for managerial, responsibility-accounting, and operations coverage.",
    "10.1.0: Added Audit Sampling Planner, AIS Access Control Review Workspace, and RFBT Obligations and Contracts Issue Flow.",
    "10.1.0: Added FAR Quasi-Reorganization Deficit Cleanup and AFAR Corporate Liquidation Recovery Planner.",
    "10.1.0: Added Study Hub completion modules, Smart Solver matches, OCR routing rules, search catalog entries, and workpaper templates for all new tools.",
    "10.1.0: Added regression tests for new shared calculation helpers, discovery aliases, workpaper templates, and solve-target suggestions.",
    "10.1.0: Hardened Workpaper Studio narrow-screen editing, deferred live formula preview work, searchable template filtering, and idle-time autosave scheduling.",
    "10.1.0: Upgraded Confidence Interval Helper with z/t method selection and upgraded Capital Rationing Prioritizer with exact combination comparison.",
    "10.1.0: Added Activity-Based Costing, Financial Asset Amortized Cost, Investment Property Measurement, Joint Arrangement Share, and Quality Control Chart helpers with integrated lessons and workpapers.",
    "10.0.0: Added the library-driven expansion layer with DuPont, earnings quality, confidence intervals, retail pricing, capital rationing, provisions, and franchise revenue.",
] as const;
