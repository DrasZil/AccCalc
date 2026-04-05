export const APP_VERSION = "2.1.0";
export const APP_RELEASE_DATE = "2026-04-05";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "Compact calculator workspace",
        body: "Calculator pages now use mobile-friendly section switching, tighter cards, and clearer action grouping to reduce unnecessary scrolling.",
    },
    {
        title: "Smarter product home",
        body: "The dashboard now surfaces pinned tools, recent tools, featured accounting workflows, Smart Solver examples, and release notes in one place.",
    },
    {
        title: "Pinned and recent tools",
        body: "You can pin frequently used calculators and jump back into recently opened tools faster from the sidebar, home, and history views.",
    },
    {
        title: "New accounting planners",
        body: "New comparison and working-capital helpers add inventory method comparison, depreciation schedule comparison, and cash conversion cycle analysis.",
    },
    {
        title: "Sharper Smart Solver",
        body: "Natural-language routing now handles broader wording, shorthand, and ambiguity cues while offering better match explanations and next-step guidance.",
    },
    {
        title: "Render-loop hardening and practical schedules",
        body: "The app now guards network-state subscriptions and Smart Solver prefill sync more safely, while key tools such as loan amortization show more practical payoff detail.",
    },
];

export const APP_RELEASE_NOTES = [
    "Fixed a root render-loop issue caused by an unstable network-status subscription snapshot and hardened cross-route state application paths.",
    "Redesigned the shell for narrower screens with a bottom navigation bar, mobile search sheet, and clearer header actions.",
    "Introduced pinned tools, richer history summaries, and stronger homepage discovery for students and repeat users.",
    "Added most-used tool surfacing, guided workflow collections, and deeper app-icon integration across the shell and install/error states.",
    "Upgraded calculator page layout with section tabs, compact cards, clearer formula panels, and better mobile reachability.",
    "Added inventory comparison, depreciation schedule comparison, and cash conversion cycle tools with contextual charts and interpretations, then expanded loan amortization with payoff trend and yearly schedule insight.",
    "Improved validation, edge-case handling, and reusable accounting math helpers for more trustworthy outputs.",
    "Expanded Smart Solver matching, examples, and result organization to feel more assistant-like and less rigid.",
];
