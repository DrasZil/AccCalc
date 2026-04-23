# AccCalc System Overview v12.0.0

## Release Positioning

Version `12.0.0` is an app-wide information-hierarchy and page-focus release. It builds on the curriculum and reliability work from earlier versions by reducing page noise, formalizing progressive disclosure, and making main workflows easier to identify under pressure.

## Key Architectural Surfaces

### Shared Page Organization

- `src/components/CalculatorPageLayout.tsx`
- `src/components/ContextualPageMenu.tsx`
- `src/components/PageHeader.tsx`
- `src/components/DisclosurePanel.tsx`

These files now carry the main focus-first rules:

- primary work stays visible first
- secondary support stays discoverable on demand
- page-level supporting material is grouped instead of scattered

### Homepage And Discovery

- `src/features/home/HomePage.tsx`

The homepage now behaves more like a next-step launcher than a product dump. It emphasizes active workflows first and pushes broader browsing into grouped disclosures.

### Study Hub

- `src/features/study/StudyHubPage.tsx`
- `src/features/study/StudyTopicPage.tsx`
- `src/features/study/components/StudyLessonLayout.tsx`

The lesson system remains textbook-like, but secondary side references are lighter and more intentional.

### Workpaper Studio

- `src/features/workpapers/WorkpaperStudioPage.tsx`
- `src/features/workpapers/workpaperTemplates.ts`

`12.0.0` adds a real focus mode so the worksheet remains the dominant editing surface when students want less surrounding support content.

## Design Direction

The main design goals in `12.0.0` are:

- one clear page purpose
- stronger primary vs secondary hierarchy
- less equal-weight card competition
- more progressive disclosure
- cleaner first-screen decisions
- calmer supporting rails

## Known Heavy Surfaces

Heavy surfaces still worth watching:

- `appCatalog`
- `SmartSolverPage`
- `ScanCheckPage`
- `WorkpaperStudioPage`
- `formulaSolveDefinitions`

This release improves organization more than raw bundle size, although the homepage and shared calculator layout now do less default rendering work than before.
