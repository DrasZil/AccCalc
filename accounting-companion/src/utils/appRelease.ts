export const APP_VERSION = "3.3.3";
export const APP_RELEASE_DATE = "2026-04-11";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "Desktop panels now reflow before they collapse",
        body: "The shared layout system now prefers readable two-column or stacked sections over squeezing companion panels into skinny vertical rails.",
    },
    {
        title: "Scan & Check reads like a real workspace",
        body: "The scan review surface now keeps the main extraction area dominant while helper cards fall into readable rows or lower sections instead of collapsing.",
    },
    {
        title: "Formula and study text are cleaner",
        body: "Shared formula rendering now separates prose from equations, structures long formula logic into readable statements, and fixes more merged-word output at the utility level.",
    },
    {
        title: "Charts are less cluttered and more readable",
        body: "Shared chart components now keep only the key point on the plot and move supporting detail into cleaner cards below the graph for both mobile and desktop.",
    },
];

export const APP_RELEASE_NOTES = [
    "3.3.3: Reworked shared desktop reflow logic so calculator, study, and scan companion panels wrap or drop below the main content instead of collapsing into unreadable rails.",
    "3.3.3: Simplified Scan & Check desktop composition so preview, route guidance, summary, and next-step panels stay readable without forcing a brittle side column.",
    "3.3.3: Refined shared formula detection and rendering so long instructional strings stop being treated like decorative equation blocks and semicolon-heavy logic becomes readable statements.",
    "3.3.3: Rebuilt the guide-text normalizer to repair spacing, split more jammed labels, and keep currency-value text cleaner across learning cards, steps, and interpretations.",
    "3.3.3: Cleaned up shared chart behavior so the plot highlights only the most important point directly while the rest of the meaning moves into clearer supporting cards.",
    "3.3.3: Tightened shared input, related-tool, and study grids so wide screens use space better without creating mobile regressions.",
];
