export const APP_VERSION = "9.0.0";
export const APP_RELEASE_DATE = "2026-04-23";

export const APP_RELEASE_HIGHLIGHTS = [
    {
        title: "AccCalc 9.0.0 turns Study Hub into a textbook-style lesson system",
        body: "Lessons now open inside a reusable module reader with breadcrumbs, section anchors, progress, resume state, module flow, and clearer previous/next navigation instead of feeling like disconnected cards.",
    },
    {
        title: "Curriculum depth expanded across the thinnest reviewer tracks",
        body: "New module lessons now cover FAR refinements, partnership life-cycle review, audit risk and evidence linkage, tax compliance depth, RFBT contracts and corporation law, AIS control layers, governance and COSO-style control review, operations planning, and strategic integration.",
    },
    {
        title: "Scan & Check now reviews structured fields instead of dumping raw OCR only",
        body: "OCR cleanup now separates labels from values more carefully, keeps normalized candidate values, tags likely value kinds, and flags low-certainty structured fields for manual review before autofill or route handoff.",
    },
    {
        title: "Smart Solver is better at real accounting word-problem numbers",
        body: "Shared numeric parsing now handles grouped digits, parenthesized negatives, currency markers, and percent forms more safely so longer accounting prompts are less likely to lose the actual values being asked about.",
    },
    {
        title: "Documentation was regenerated after the shipped code changes",
        body: "README, release notes, system overview, maintenance notes, and the HTML/PDF handoff package now describe the final 9.0.0 lesson architecture, OCR review model, and curriculum expansion.",
    },
] as const;

export const APP_RELEASE_NOTES = [
    "9.0.0: Rebuilt Study Hub lessons around a reusable textbook-style lesson layout with breadcrumbs, section anchors, chapter flow, resume state, progress indicators, and clearer next-step navigation.",
    "9.0.0: Added a major new batch of curriculum-aligned reviewer modules across FAR, AFAR partnership flow, audit, taxation, RFBT, AIS, governance, operations, and strategic integration.",
    "9.0.0: Added track-aware Study Hub browsing so lesson breadcrumbs can return to the correct module shelf instead of dropping users back into a flat mixed catalog.",
    "9.0.0: Introduced a shared number-parsing utility so Smart Solver and Scan & Check can read grouped numbers, parenthesized negatives, percentages, and currency markers more safely.",
    "9.0.0: Reworked OCR cleanup and structured-field extraction so labels, values, normalized candidates, source lines, and review-needed flags are preserved for manual verification.",
    "9.0.0: Upgraded Scan & Check summaries to show structured-field counts and to use live route metadata instead of a stale hardcoded route-label table.",
    "9.0.0: Expanded on-device study progress with better last-section resume behavior so long lessons behave more like a real module reader.",
    "9.0.0: Updated README and the handoff documentation set to describe the new lesson architecture, OCR parser layer, and curriculum expansion.",
] as const;
