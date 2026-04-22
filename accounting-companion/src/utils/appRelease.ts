export const APP_VERSION = "8.1.0";
export const APP_RELEASE_DATE = "2026-04-22";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "AccCalc 8.1.0 fixes the Windows Vite dev-start regression",
        body: "The app now uses a native-loaded Vite config so local development no longer crashes while bundling Tailwind's native Windows dependency during config startup.",
    },
    {
        title: "Theme settings now wrap cleanly on laptop and larger screens",
        body: "Theme-family cards now use a more forgiving grid, wrapped swatches, and corrected reactive summaries so appearance settings stay readable without overlap or clipping.",
    },
    {
        title: "Transfer Pricing Support is now a first-class managerial route",
        body: "The existing shared transfer-pricing logic is now exposed through a full calculator page with study support, OCR routing, Smart Solver hooks, workpaper support, and related-tool discovery.",
    },
    {
        title: "Release metadata is lighter, cleaner, and more accurate",
        body: "The runtime release surface no longer ships duplicated highlight history from older versions and now stays focused on the current shipping state.",
    },
    {
        title: "Documentation was refreshed after the code changes",
        body: "README, release notes, system overview, and maintenance notes now reflect the v8.1.0 fixes, the native Vite config approach, and the new transfer-pricing support route.",
    },
] as const;

export const APP_RELEASE_NOTES = [
    "8.1.0: Switched local development to a native-loaded Vite config so Windows dev startup no longer fails while prebundling Tailwind's native oxide dependency.",
    "8.1.0: Converted the Vite config into a native-load-friendly ESM file and made package metadata reading BOM-safe so version injection stays robust during config startup.",
    "8.1.0: Fixed the theme-family settings layout so swatches wrap, cards keep equal height more reliably, and laptop-sized screens no longer crowd the appearance panel.",
    "8.1.0: Fixed the appearance quick-stats summary so it updates when the saved theme family changes instead of holding onto stale memoized values.",
    "8.1.0: Added Transfer Pricing Support for minimum transfer price, market-based ceiling, and negotiation-range analysis inside the managerial performance family.",
    "8.1.0: Wired Transfer Pricing Support through routes, catalog search aliases, Smart Solver target hints, OCR routing, study support, and workpaper templates.",
    "8.1.0: Cleaned the runtime release metadata layer so current-release notes stay concise and no longer ship duplicated highlight history from older versions.",
    "8.1.0: Updated README and handoff documentation to explain the dev-start fix, the settings-layout cleanup, and the new transfer-pricing route.",
] as const;
