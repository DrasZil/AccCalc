# AccCalc v12.2.0 Release Notes

AccCalc `12.2.0` is the shell-tightening and density-control release. It keeps the focus-first direction from `12.1.0`, but removes the remaining daily-use friction: temporary surfaces now fit the usable shell viewport more reliably, Learning Hub reaches useful content faster, settings reflow cleanly on larger screens, and repeated-use surfaces feel less sluggish.

## Main Product Changes

- Finished the shell viewport-fit pass so menus, drawers, sheets, and reminders reserve top chrome, bottom chrome, safe areas, and live viewport height.
- Simplified Learning Hub by removing redundant wrappers, low-value chips, and self-explanatory study chrome.
- Rebuilt repeated settings row layouts with more resilient grid and wrapping behavior.
- Deferred hidden disclosure rendering and reduced repeated homepage metadata subscriptions for smoother interaction.

## Mobile Menu And Partial-Screen Root Cause

Remaining root cause:

- some overlays were still using raw viewport assumptions at specific breakpoints
- some temporary surfaces still behaved like edge-attached panels instead of fitting the usable area between shell chrome
- one-off overlay layouts could still ignore bottom navigation or top-bar spacing

Fix:

- standardized overlay sizing around `--app-shell-overlay-top`, `--app-shell-overlay-bottom`, and `--app-shell-overlay-height`
- updated page-menu sizing rules so responsive overrides stop reintroducing raw `vh` behavior
- moved settings and reminder surfaces onto the same reserved shell-area model
- kept viewport portals and body-scroll locking as the shared overlay foundation

## Learning Hub Simplification

- shortened the page header and removed redundant system-language copy
- removed the extra guided-start wrapper
- moved module shelves earlier so the useful track cards appear sooner
- reduced chip-heavy metadata on topic and module cards
- simplified category section summaries so they orient without crowding the lesson list

## Settings Overflow Strategy

- converted repeated split rows from rigid flex alignment to more resilient grid layouts
- gave labels and helper text stronger `min-w-0` / wrap behavior
- let buttons and selects reflow below content when space is tighter
- softened several grid patterns so cards fit more naturally across laptop and desktop widths
- updated permission-related cards to wrap status badges and actions more gracefully

## Responsiveness And Performance

- `DisclosurePanel` now mounts hidden content lazily after first open
- homepage route cards no longer create repeated network/offline subscriptions
- lower-value helper copy and chips were trimmed from repeated-use surfaces
- shared overlay sizing reduces layout thrash and odd viewport jumps when opening menus

## Validation

Final validation for `12.2.0` uses:

- `npm test`
- `npm run build`
- a bounded `npm run dev` probe
