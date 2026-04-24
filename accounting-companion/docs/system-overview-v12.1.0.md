# AccCalc System Overview v12.1.0

## Release Positioning

Version `12.1.0` is the shell-hardening and organization-stabilization release for the focus-first UI direction. It keeps the single-purpose page system from `12.0.0`, but turns the shared shell into a safer foundation for mobile overlays, responsive navigation, and calmer page framing.

## Key Architectural Surfaces

### Shared Shell And Overlay System

- `src/features/layout/AppLayout.tsx`
- `src/components/ViewportPortal.tsx`
- `src/hooks/useBodyScrollLock.ts`
- `src/components/ContextualPageMenu.tsx`
- `src/features/meta/SettingsDrawer.tsx`
- `src/index.css`

These files now carry the shell rules:

- transient overlays render at the viewport layer
- background scroll is locked while overlays are open
- overlay heights follow the live viewport instead of static screen assumptions
- mobile chrome yields to the active temporary surface

### Shared Page Organization

- `src/components/CalculatorPageLayout.tsx`
- `src/components/PageHeader.tsx`
- `src/components/DisclosurePanel.tsx`

These files continue to enforce the focus-first rules:

- the main task stays visible first
- supporting material stays discoverable on demand
- secondary route context stays grouped instead of scattered

### Homepage And Discovery

- `src/features/home/HomePage.tsx`

The homepage now behaves more like a launchpad than a catalog wall. Return flows and primary entry points dominate. Broader discovery is intentionally delayed.

### Study And Settings

- `src/features/study/StudyHubPage.tsx`
- `src/features/study/components/StudyLessonLayout.tsx`
- `src/features/meta/SettingsPage.tsx`
- `src/features/meta/SettingsContent.tsx`

Study remains textbook-like, but lesson context is quieter. Settings are grouped into clearer jump targets and category sections.

## Design Direction

The main design goals in `12.1.0` are:

- one clear page purpose
- stronger primary versus secondary hierarchy
- calmer shell chrome
- viewport-safe overlays
- more progressive disclosure
- more reliable small-screen behavior

## Known Heavy Surfaces

Heavy surfaces still worth watching:

- `SmartSolverPage`
- `ScanCheckPage`
- `WorkpaperStudioPage`
- `appCatalog`
- `formulaSolveDefinitions`

This release improves shell reliability and first-screen clarity more than raw bundle size.
