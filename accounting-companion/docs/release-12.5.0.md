# AccCalc v12.5.0 Release Notes

AccCalc `12.5.0` is a focused mobile shell and overlay reliability release. It does not add broad new product areas; it makes the existing mobile menu, settings, and related transient panels behave like app-quality full-screen surfaces.

## Main Product Changes

- Rebuilt the mobile menu as a true full-screen viewport panel instead of a narrow drawer constrained by page chrome.
- Rebuilt mobile Settings as a full-screen panel for non-desktop shell widths, removing side offsets, max-width caps, and the card-like presentation.
- Kept close actions in reachable panel headers while applying safe-area padding for notches and bottom gesture areas.
- Preserved internal scrolling for long navigation and settings content while keeping the page behind the panel locked.
- Updated contextual page menus and mobile search to follow the same small-screen viewport-owned overlay model.
- Tightened menu, search, and settings state so opening one transient surface closes the others.

## Mobile Menu

The mobile menu now:

- mounts through the viewport portal
- fills the live mobile viewport with `--app-mobile-panel-height`
- applies safe-area padding inside the panel
- covers sticky top chrome and bottom navigation instead of negotiating leftover space with them
- keeps the navigation list scrollable inside the panel

## Mobile Settings

The Settings drawer now:

- opens full screen below the desktop breakpoint
- removes the previous `min(34rem, calc(100vw - 1rem))` card constraint
- removes the `0.5rem` right offset and chrome-subtracted height
- keeps settings groups scrollable inside the panel
- supports Escape-to-close in addition to the visible close button

## Overlay And Shell Fixes

- Added `--app-mobile-panel-height` as the small-screen full-panel height contract.
- Changed phone contextual page menus from constrained bottom sheets into full-screen panels.
- Kept tablet and desktop contextual page menus panel-like where that still fits the larger shell.
- Adjusted the shared body scroll lock so vertical panning remains available inside long overlay panels while the background page stays fixed.
- Prevented menu, search, and settings from stacking into confusing combined states.

## Validation

Final validation for `12.5.0` uses:

- `npm test`
- `npm run build`
- a bounded `npm run dev -- --host 127.0.0.1` probe

Manual checks should include:

- mobile menu at phone widths
- mobile Settings at phone and tablet widths
- long settings scroll behavior
- safe-area top and bottom spacing
- no background interaction while panels are open
