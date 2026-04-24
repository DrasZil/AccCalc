# AccCalc System Overview v12.2.0

## Release Positioning

Version `12.2.0` is the polish-and-stabilization follow-through release for the focus-first UI direction. It does not change the app's overall product model. Instead, it hardens shell behavior, reduces visual ceremony, and improves repeated-use comfort across study, settings, and temporary surfaces.

## Key Architectural Surfaces

### Shared Shell And Overlay System

- `src/features/layout/AppLayout.tsx`
- `src/features/layout/ShellChrome.tsx`
- `src/components/ViewportPortal.tsx`
- `src/components/ContextualPageMenu.tsx`
- `src/features/meta/SettingsDrawer.tsx`
- `src/hooks/useBodyScrollLock.ts`
- `src/index.css`

These files now define the durable shell rules:

- overlays render at the viewport layer
- overlays reserve usable space between header and bottom navigation
- background scroll locks while temporary surfaces are open
- mobile, tablet, and narrow-window behavior derive from shared shell metrics instead of one-off sizing

### Shared Page Organization

- `src/components/PageHeader.tsx`
- `src/components/DisclosurePanel.tsx`
- `src/components/CalculatorPageLayout.tsx`

These files continue to enforce:

- one dominant page purpose
- progressive disclosure for secondary detail
- less explanatory chrome near the main task

### Study And Settings

- `src/features/study/StudyHubPage.tsx`
- `src/features/study/components/StudyLessonLayout.tsx`
- `src/features/meta/SettingsContent.tsx`
- `src/features/settings/components/PermissionCenter.tsx`

This release makes those surfaces more practical:

- Study Hub reaches shelves and recent lessons faster
- settings rows reflow more gracefully across wider screens
- optional content stays available without dominating first-view density

## Design Direction

The main design goals in `12.2.0` are:

- less clutter
- less redundant chrome
- stronger viewport-fit logic
- calmer repeated-use surfaces
- more graceful text wrapping
- faster-feeling interaction without risky rewrites

## Known Heavy Surfaces

Heavy surfaces still worth watching:

- `SmartSolverPage`
- `ScanCheckPage`
- `WorkpaperStudioPage`
- `appCatalog`
- `formulaSolveDefinitions`

`12.2.0` improves perceived responsiveness in shared UI paths, but it does not attempt a bundle-level rewrite of the heaviest feature surfaces.
