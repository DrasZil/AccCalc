# AccCalc System Overview v11.0.0

## Release Positioning

Version `11.0.0` is a platform-quality upgrade that strengthens shell structure, curriculum organization, Study Hub continuity, and weak-track completion without abandoning the survivability work introduced in `10.5.0`.

## Key Architectural Surfaces

### Shell And Navigation

- `src/features/layout/AppLayout.tsx`
- `src/utils/appCatalog.ts`
- `src/utils/appExperience.ts`

The shell now provides stronger route context, curriculum-track summaries, sibling-route suggestions, and lesson handoff cues. This reduces flat-catalog sprawl and improves route orientation.

### Homepage And Discovery

- `src/features/home/HomePage.tsx`

The homepage now works more like a control tower:

- curriculum-track coverage snapshot
- route-surface lane grouping
- track-strength spotlighting

### Study Hub

- `src/features/study/StudyHubPage.tsx`
- `src/features/study/StudyTopicPage.tsx`
- `src/features/study/components/StudyLessonLayout.tsx`
- `src/features/study/studyContent.ts`
- `src/features/study/studyExpansion450.ts`
- `src/features/study/studyExpansion1100.ts`

The Study Hub continues the module/textbook architecture while now surfacing track-level lesson depth more directly.

### Workpaper Studio

- `src/features/workpapers/WorkpaperStudioPage.tsx`
- `src/features/workpapers/workpaperTemplates.ts`

`11.0.0` builds on Workpaper 2.0 by improving context visibility during editing and adding new templates aligned to weak-track completion work.

### Solver / OCR Routing

- `src/features/smart/smartSolver.engine.ts`
- `src/features/scan-check/services/ocr/ocrRouting.ts`
- `src/utils/numberParsing.ts`

The routing layer now includes continuity, control-environment, defective-contract, and business-case support so those newer tracks remain discoverable from problem prompts and OCR review flows.

## New Shared Helpers

`src/utils/calculatorMath.ts` now includes:

- `computeBusinessContinuityReadiness`
- `computeControlEnvironmentStrength`
- `computeBusinessCaseScore`

These helpers are covered by regression tests in `tests/calculatorMath.test.ts`.

## Design Direction

The main design goals in `11.0.0` are:

- stronger hierarchy
- calmer surfaces
- less card-wall fatigue
- better next-step guidance
- more explicit route and curriculum context

## Known Heavy Surfaces

Heavy surfaces still worth watching:

- `appCatalog`
- `SmartSolverPage`
- `ScanCheckPage`
- `WorkpaperStudioPage`
- `formulaSolveDefinitions`

This release improves organization and route clarity, but those bundles still deserve future slimming if more maintenance time appears.
