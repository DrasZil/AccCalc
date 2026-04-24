# AccCalc Maintenance Playbook v12.2.0

## First Read

This version keeps the focus-first system and tightens the rules around shell durability, density, and wrapping. Future changes should preserve all three:

- single-purpose page hierarchy
- viewport-safe overlay behavior
- graceful text and control reflow

## Main Files To Know

- `src/features/layout/AppLayout.tsx`
- `src/features/layout/ShellChrome.tsx`
- `src/components/ViewportPortal.tsx`
- `src/components/ContextualPageMenu.tsx`
- `src/components/DisclosurePanel.tsx`
- `src/features/study/StudyHubPage.tsx`
- `src/features/meta/SettingsContent.tsx`
- `src/features/meta/SettingsDrawer.tsx`
- `src/utils/appRelease.ts`

## Overlay Rules For Future Work

1. Render temporary surfaces through the shared viewport portal.
2. Lock background scroll while the surface is open.
3. Size vertical overlays from shared shell metrics, not raw `100vh`.
4. Reserve space for top chrome, bottom navigation, and safe-area insets.
5. Test temporary surfaces on narrow widths before treating the work as done.

## Density Rules For Future Work

1. Remove redundant labels when the page structure already communicates the same meaning.
2. Avoid repeated chip walls and helper text that only explains the organization system.
3. Let the main task appear sooner in the scroll path.
4. Prefer one useful summary line over several decorative meta blocks.

## Settings Layout Rules

1. Use resilient grid or wrap-friendly patterns for split rows.
2. Give text containers `min-w-0` and allow long labels to wrap.
3. Let buttons and selects drop below text when space is tighter.
4. Avoid desktop-only layouts that depend on labels staying unusually short.

## Safe Performance Workflow

1. Prefer lazy mounting hidden sections when state retention is not harmed.
2. Avoid repeated subscriptions or hooks inside large card grids when a parent can compute the same data once.
3. Trim low-value visual chrome before adding heavier UI affordances.
4. Treat perceived responsiveness as a product quality issue, not only a benchmark issue.

## Validation

Minimum release validation:

- `npm test`
- `npm run build`
- bounded `npm run dev` probe
- a manual phone-width pass for menu, search, settings, page-menu, and reminder overlay behavior
