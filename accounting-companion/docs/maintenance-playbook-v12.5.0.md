# AccCalc Maintenance Playbook v12.5.0

## First Read

This version is maintained around four shell rules:

- mobile navigation and settings should feel like app panels, not modal cards
- safe-area padding belongs inside full-screen mobile panels
- background page scroll must stay locked while panel content can still scroll
- only one mobile transient surface should be open at a time

## Main Files To Know

- `src/features/layout/AppLayout.tsx`
- `src/features/meta/SettingsDrawer.tsx`
- `src/components/ContextualPageMenu.tsx`
- `src/components/ViewportPortal.tsx`
- `src/hooks/useBodyScrollLock.ts`
- `src/index.css`
- `src/utils/appRelease.ts`

## Overlay Rules

1. Use `ViewportPortal` for shell-level overlays so parent overflow and stacking contexts cannot clip them.
2. Use `--app-mobile-panel-height` for full-screen mobile panel height.
3. Put safe-area spacing inside the panel with `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
4. Keep long content in an internal `overflow-y-auto` region.
5. Do not size mobile menu or settings with leftover shell height, fixed outer margins, or desktop drawer width caps.
6. Close menu/search/settings peers before opening a new transient panel.

## Scroll Lock Rules

1. Keep `useBodyScrollLock` reference-counted.
2. Freeze the background page with fixed body positioning.
3. Preserve vertical panning inside overlay content.
4. Restore the original scroll position when the final lock is released.

## Validation

Minimum release validation:

- `npm test`
- `npm run build`
- bounded `npm run dev -- --host 127.0.0.1` probe
- manual phone-width menu check
- manual phone-width settings check
- manual tablet-width settings check
- manual long-panel scroll check
- manual backdrop/background interaction check
