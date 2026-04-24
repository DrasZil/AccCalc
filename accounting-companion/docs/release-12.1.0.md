# AccCalc v12.1.0 Release Notes

AccCalc `12.1.0` is the stabilized focus-first release. It finishes the shell and organization work started in `12.0.0` by fixing the release-blocking mobile navigation bug, reducing shell noise, and making the highest-value surfaces feel more single-purpose.

## Main Product Changes

- Fixed the mobile menu and overlay root cause by moving shell overlays into viewport portals and removing clipping from the shell layer.
- Added shared body scroll locking for mobile navigation, search, settings, and contextual page menus.
- Simplified the shell context rail and prevented bottom navigation from competing with transient overlays.
- Reorganized the homepage around return flows, pinned tools, quick actions, and delayed discovery.
- Moved lesson context into progressive disclosure and reorganized settings around clear category jumps.

## Mobile Menu Root Cause And Fix

Root cause:

- mobile overlays were rendered inside the shell surface instead of at the viewport layer
- shell containment and stacked chrome could clip or visually suppress fixed overlay content on some phones
- overlay state and background scrolling were not coordinated tightly enough across navigation, search, settings, and page menus

Fix:

- added `ViewportPortal` so shell overlays render against `document.body`
- added `useBodyScrollLock` so background content stops moving while overlays are open
- introduced a shared `--app-viewport-height` variable driven by `visualViewport` or `window.innerHeight`
- updated mobile sidebar, mobile search, settings drawer, and contextual page menu sizing to use the live viewport height
- suppressed competing mobile chrome while transient overlays are active

## Focus-First Organization Work

### Homepage

- The first screen now prioritizes best-next surfaces, continue flow, pinned tools, and major actions.
- Broader discovery is grouped into one lower-priority disclosure instead of several equal-weight sections.

### Shared Shell

- The shell context rail is lighter and more instructional.
- Global navigation, page actions, and temporary overlays are easier to distinguish.

### Study And Settings

- Lesson metadata now steps out of the reading path unless requested.
- Settings now begin with a category map so users can jump directly into the right control group.

## Shared Components And Files

- `src/components/ContextualPageMenu.tsx`
- `src/components/ViewportPortal.tsx`
- `src/hooks/useBodyScrollLock.ts`
- `src/features/layout/AppLayout.tsx`
- `src/features/home/HomePage.tsx`
- `src/features/meta/SettingsContent.tsx`
- `src/features/meta/SettingsDrawer.tsx`
- `src/features/study/components/StudyLessonLayout.tsx`
- `src/index.css`

## Validation

Final validation for `12.1.0` uses:

- `npm test`
- `npm run build`
- a bounded `npm run dev` probe
