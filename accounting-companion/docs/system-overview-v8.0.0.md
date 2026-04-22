# AccCalc System Overview v8.0.0

## Project Overview

AccCalc is a browser-based accounting companion that combines calculators, formula solve-for systems, OCR-assisted discovery, study content, reviewer topics, and workpaper templates.

## Architecture Overview

The app is organized around shared layers:

1. Route pages in `src/features/...`
2. Shared math and assumptions in `src/utils/...`
3. Discovery systems through catalog, search, Smart Solver, and OCR routing
4. Learning systems through Study Hub and formula-linked study content
5. Workpaper support through template registration and workbook utilities

## Important Folders

- `src/components`: reusable UI, charts, layout blocks, math display, result cards
- `src/features`: domain-specific route pages and feature modules
- `src/utils`: shared math, catalog metadata, settings, release metadata, assumptions, formatting
- `tests`: shared regression tests for math, solve definitions, search, and workpapers
- `docs`: release and handoff documentation

## Important Shared Files

- `src/utils/calculatorMath.ts`: reusable accounting and finance math helpers
- `src/utils/formulaSolveDefinitions.ts`: solve-target definitions, notes, and result formatting
- `src/utils/appCatalog.ts`: route metadata, aliases, categories, and new-feature surfacing
- `src/utils/appSearch.ts`: precomputed route search index and grouping helpers
- `src/utils/formulaStudyContent.tsx`: short study panels directly tied to formula routes
- `src/features/study/studyExpansion450.ts`: broader reviewer-topic expansion and related-topic navigation
- `src/utils/appSettings.ts`: saved settings and theme preference persistence
- `src/utils/themePreferences.ts`: theme families, labels, swatches, and mode helpers
- `src/utils/taxConfig.ts`: editable tax assumptions and visible note source of truth

## Routing And Page Structure

Routes are registered centrally in `src/App.tsx`. Most formula-based routes use a wrapper page that points to a shared solve definition, while more specialized reviewer or workspace pages keep their own layout and interaction logic.

## Data Flow

A common formula route usually flows like this:

1. Route in `App.tsx`
2. Page component in `src/features/...`
3. Solve definition in `formulaSolveDefinitions.ts`
4. Shared math helper in `calculatorMath.ts`
5. Result rendering through shared workspace components
6. Study support from `formulaStudyContent.tsx`
7. Related reviewer coverage from `studyExpansion450.ts`
8. Search and discovery from catalog, Smart Solver, and OCR routing
9. Optional workpaper support from `workpaperTemplates.ts`

## Smart Solver Flow

- field keys are typed in `smartSolver.types.ts`
- field metadata and route scoring live in `smartSolver.engine.ts`
- explicit solve-target wording maps through `smartSolver.targets.ts`
- the best route is scored from required fields, aliases, keywords, and extracted facts

## OCR Routing Flow

- scan classification produces routing hints
- `ocrRouting.ts` maps worksheet wording and page signals to likely routes
- the user can move from scan review into a calculator, Smart Solver, or study path

## Workpaper System

`Workpaper Studio` remains the assignment-support layer. Templates are registered in `workpaperTemplates.ts`, workbook state lives in the workpaper store modules, and supported calculators can transfer structured output into workbook-like sheets.

## Theme System In v8.0.0

The theme system now has two axes:

- mode: system, light, dark
- family: classic, ocean, slate, rose, blossom, lavender, sunset, emerald

Theme state is restored before paint from local storage, then the shell updates `data-theme` and `data-theme-family` attributes so CSS variables can control cards, borders, text, chips, and supporting surfaces consistently.

## Testing Structure

The current test suite focuses on shared reliability.

It covers:

- calculator math helpers
- solve-definition alignment
- search behavior
- workpaper formula behavior
- route discovery behavior

## How To Safely Add Or Edit A Calculator

- change shared math first
- add or update the solve definition
- create or update the route page
- register the route in `App.tsx`
- update catalog metadata and aliases
- update Smart Solver extraction and solve-target hints
- update OCR patterns if the route should be discoverable from scanned pages
- add study content and workpaper templates when appropriate
- run `npm test` and `npm run build`

## 8.0.0 Scope Highlights

This release added nine new academic routes plus the persistent multi-family theme system. It also extended search, Smart Solver, OCR routing, study content, and workpaper support for the new academic breadth.
