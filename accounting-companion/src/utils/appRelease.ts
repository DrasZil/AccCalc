export const APP_VERSION = "3.2.8";
export const APP_RELEASE_DATE = "2026-04-08";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "Guide text is cleaner in 3.2.8",
        body: "Interpretation, assumptions, warnings, and step panels now render with a shared readable text style instead of drifting into inconsistent font, spacing, or overflow behavior.",
    },
    {
        title: "Plain text no longer looks like math by accident",
        body: "Formula guidance now distinguishes actual formulas from normal explanatory sentences more safely, so words, peso values, and full lines do not get pushed through math-style rendering unnecessarily.",
    },
    {
        title: "Wrapping is safer on smaller screens",
        body: "Long guide lines, warnings, and mixed text-plus-symbol content now wrap inside their cards more reliably on mobile without clipping or awkward overflow.",
    },
    {
        title: "Shared educational panels are more consistent",
        body: "Interpretation blocks, note cards, chart insight text, and formula-supporting panels now share tighter typography rules for font family, spacing, and line height.",
    },
    {
        title: "The patch stays low-risk",
        body: "This update fixes the shared rendering path instead of touching calculator math or per-tool business logic, so outputs and workflows stay intact.",
    },
];

export const APP_RELEASE_NOTES = [
    "3.2.8: Fixed shared interpretation and guide typography so calculator helper text uses the app reading font and spacing consistently instead of drifting into math-like styling.",
    "3.2.8: Tightened formula detection for shared explanatory content so full sentences with numbers, units, or symbols do not render as KaTeX unless they are actually formula-like.",
    "3.2.8: Added shared reading-content styles for interpretation panels, note blocks, chart insight copy, and formula-supporting sections to improve wrapping, spacing, and readability.",
    "3.2.8: Improved mobile handling for long guide lines, warning text, and mixed symbol content so they wrap inside cards instead of overflowing or clipping.",
    "3.2.8: Added a reusable guide-text formatter that inserts safer spaces for merged labels, operator spacing, and common calculator-generated wording.",
    "3.2.8: Kept the patch focused on shared rendering and styling so calculator logic, SmartSolver, scan, and persistence behavior are unchanged.",
];
