# AccCalc Maintenance Playbook v12.1.0

## First Read

This version stabilizes the focus-first shell. Future work should preserve both parts of the system:

- single-purpose page hierarchy
- viewport-safe overlay behavior

## Main Files To Know

- `src/features/layout/AppLayout.tsx`
- `src/components/ViewportPortal.tsx`
- `src/hooks/useBodyScrollLock.ts`
- `src/components/ContextualPageMenu.tsx`
- `src/components/DisclosurePanel.tsx`
- `src/features/home/HomePage.tsx`
- `src/features/meta/SettingsContent.tsx`
- `src/features/study/components/StudyLessonLayout.tsx`
- `src/utils/appRelease.ts`

## Focus-First Rules For Future Pages

When adding or refactoring a page:

1. Define the page's single dominant purpose.
2. Keep the main action and main output visible first.
3. Move supporting references, related tools, and longer explanatory blocks into disclosures or the page menu when they are not needed immediately.
4. Do not bury essential warnings, assumptions, or main actions.
5. Avoid equal-weight card walls near the main task.

## Shell Rules For Future Overlays

When adding menus, drawers, sheets, or temporary panels:

1. Render them through the shared viewport portal instead of inside clipping layout containers.
2. Lock background scroll while the overlay is open.
3. Size vertical overlays from `--app-viewport-height` instead of assuming `100vh` is correct on mobile browsers.
4. Check whether bottom navigation, page headers, and safe-area insets compete with the new surface.
5. Treat mobile overlay behavior as release-critical, not a visual polish pass.

## Safe Extension Workflow

When adding a meaningful new route:

1. Add the page in `src/features/...`
2. Register the route in `src/App.tsx`
3. Add metadata in `src/utils/appCatalog.ts`
4. Use shared shells instead of inventing a new layout pattern unless there is a strong reason
5. Add Smart Solver mapping when the route should be reachable by prompt
6. Add OCR routing when the route should be reachable by scan review
7. Add Study Hub content if the route belongs to a real curriculum family
8. Add a workpaper template when the route benefits from a worksheet
9. Add regression coverage in `tests/calculatorMath.test.ts`

## Homepage Notes

- Treat the first screen as a next-step launcher.
- Broader discovery belongs in grouped disclosures, not in the hero path.
- If a new homepage section does not help a user decide what to do now, it probably belongs lower or hidden by default.

## Validation

Minimum release validation:

- `npm test`
- `npm run build`
- bounded `npm run dev` probe
- a manual phone-width overlay check for menu, search, settings, and page-menu behavior
