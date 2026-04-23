export const APP_VERSION = "12.0.0";
export const APP_RELEASE_DATE = "2026-04-24";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "AccCalc 12.0.0 is the focus-first organization overhaul",
        body: "This release reorganizes the app around one rule: show the main job first, and keep supporting detail discoverable on demand instead of letting everything compete at once.",
    },
    {
        title: "Calculator pages are now tool-first",
        body: "Shared calculator layouts now keep inputs and results primary while orientation help, related study, and nearby tools move into an intentional page menu and collapsed learning sections.",
    },
    {
        title: "The homepage now answers what to do next",
        body: "Home now prioritizes quick solve, quick scan, workpapers, resume study, and recent routes first, while broader discovery moves into grouped disclosures instead of a feature wall.",
    },
    {
        title: "Study and workpaper support blocks are calmer",
        body: "Lesson side references are lighter and Workpaper Studio now offers a real focus mode so the active reading or editing surface stays dominant when students need less noise.",
    },
    {
        title: "Progressive disclosure is now a shared system",
        body: "Dynamic page menus, collapsible support blocks, and lighter secondary rails give the app a more premium and more intentional information hierarchy across major page families.",
    },
    {
        title: "The handoff story is updated for 12.0.0",
        body: "README, release notes, system overview, maintenance guidance, and generated docs now describe the focus-first page philosophy and how future pages should keep primary workflows visible.",
    },
] as const;

export const APP_RELEASE_NOTES = [
    "12.0.0: Added a shared page menu system so secondary guidance, related study, and nearby routes stop crowding calculator and workspace headers.",
    "12.0.0: Reworked CalculatorPageLayout to keep inputs and results primary while moving supporting detail into progressive-disclosure surfaces.",
    "12.0.0: Rebuilt the homepage around next-step decisions, primary entry points, and delayed discovery instead of a broad feature wall.",
    "12.0.0: Reduced study-page side clutter by converting module flow and lesson signals into lighter on-demand references.",
    "12.0.0: Added Workpaper Studio focus mode so workbook health, context, and side utilities can move out of the editing path when needed.",
    "12.0.0: Updated release docs and maintenance guidance to formalize the focus-first page philosophy for future additions.",
    "11.0.0: Added shell-level context rails, curriculum track snapshots, route-surface labels, and stronger next-step guidance across the homepage and main layout.",
    "11.0.0: Upgraded Study Hub with curriculum shelf summaries, stronger continuity cues, and better module orientation for broad-track browsing.",
    "11.0.0: Added Business Continuity Planner, Control Environment Review, Defective Contracts Classifier, and Business Case Analysis Planner.",
    "11.0.0: Added matching lesson modules, Smart Solver mappings, OCR routing rules, app catalog entries, and assignment-friendly workpaper templates for the new weak-track tools.",
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
