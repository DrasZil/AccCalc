# AccCalc System Overview v8.1.0

## Project Overview

AccCalc is a browser-based accounting companion that combines calculators, solve-for systems, OCR-assisted discovery, study content, reviewer topics, and workpaper templates.

Version `8.1.0` keeps the `8.0.0` academic breadth but improves day-to-day maintainability by fixing the Windows Vite startup path and smoothing the personalized theme settings experience.

## Architecture Overview

The app is organized around shared layers:

1. Route pages in `src/features/...`
2. Shared math and assumptions in `src/utils/...`
3. Discovery systems through catalog, search, Smart Solver, and OCR routing
4. Learning systems through Study Hub and formula-linked study content
5. Workpaper support through template registration and workbook utilities

## Important Folders

- `src/components`: reusable UI, charts, math display, result cards, layout helpers
- `src/features`: route pages and domain-specific modules
- `src/utils`: shared math, catalog metadata, settings, release metadata, assumptions, formatting, search
- `tests`: regression tests for shared math, solve definitions, discovery, and workpaper logic
- `docs`: release and handoff documentation

## Important Shared Files

- `src/utils/calculatorMath.ts`: reusable accounting, finance, tax, and managerial math helpers
- `src/utils/formulaSolveDefinitions.ts`: solve-target definitions, results, warnings, and interpretation logic
- `src/utils/appCatalog.ts`: route metadata, aliases, categories, and new-feature surfacing
- `src/utils/appSearch.ts`: precomputed route search index and grouping helpers
- `src/utils/formulaStudyContent.tsx`: calculator-linked short study panels
- `src/features/study/studyExpansion450.ts`: broader reviewer-topic expansion and related-topic navigation
- `src/utils/appSettings.ts`: saved settings and theme preference persistence
- `src/utils/themePreferences.ts`: theme families, labels, swatches, and mode helpers
- `src/utils/taxConfig.ts`: editable tax assumptions and visible note source of truth
- `src/utils/appRelease.ts`: current release highlights and notes shown inside the app

## Routing And Page Structure

Routes are registered centrally in `src/App.tsx`. Many calculator routes use lightweight page wrappers around shared solve definitions, while larger reviewer or workspace routes own their own layout and interaction logic.

## Data Flow

A common calculator route usually flows like this:

1. Route registration in `App.tsx`
2. Page component in `src/features/...`
3. Solve definition in `formulaSolveDefinitions.ts`
4. Shared math helper in `calculatorMath.ts`
5. Shared result rendering components
6. Study support from `formulaStudyContent.tsx`
7. Reviewer coverage from `studyExpansion450.ts`
8. Search and discovery from catalog, Smart Solver, and OCR routing
9. Optional workpaper support from `workpaperTemplates.ts`

## Smart Solver Flow

- field keys are typed in `src/features/smart/smartSolver.types.ts`
- field metadata and calculator routing live in `src/features/smart/smartSolver.engine.ts`
- explicit solve-target wording maps through `src/features/smart/smartSolver.targets.ts`
- route scoring combines aliases, keywords, required fields, and extracted facts

`8.1.0` specifically extends this layer with transfer-pricing field metadata and target intent mapping.

## OCR Routing Flow

- scanned worksheet text is classified into likely accounting intents
- `src/features/scan-check/services/ocr/ocrRouting.ts` maps those signals to likely routes
- the user can move from scan review into a calculator, Smart Solver, or study path

`8.1.0` adds transfer-pricing wording such as minimum transfer price, divisional transfer price, and outside market price.

## Workpaper System

`Workpaper Studio` remains the assignment-support layer. Templates are registered in `src/features/workpapers/workpaperTemplates.ts`, workbook state lives in the workpaper feature modules, and supported calculators can transfer structured output into workbook-style sheets.

`8.1.0` adds a `Transfer Pricing Support Sheet`.

## Theme System In v8.1.0

The theme system has two axes:

- mode: `system`, `light`, `dark`
- family: `classic`, `ocean`, `slate`, `rose`, `blossom`, `lavender`, `sunset`, `emerald`

Theme state is restored before paint, then the shell applies `data-theme` and `data-theme-family` attributes so CSS variables can control cards, borders, text, chips, and supporting surfaces consistently.

`8.1.0` improves the appearance settings UI by:

- using a more forgiving theme-card grid
- wrapping the swatches instead of forcing a single crowded row
- keeping selected-state styling intact on larger screens

## Vite Config And Local Development

The runtime Vite config now lives in `vite.config.mjs`.

Why this changed:

- the previous startup path allowed Vite config loading to bundle through a path that choked on Tailwind's native Windows dependency
- `8.1.0` switches runtime loading to `--configLoader native`
- the config now reads `package.json` in a BOM-safe way before injecting `PACKAGE_VERSION`

`vite.config.d.ts` exists only to keep project metadata explicit for TypeScript tooling without reintroducing runtime coupling.

## Testing Structure

The current test suite focuses on shared reliability. It covers:

- calculator math helpers
- solve-definition alignment
- search behavior
- Smart Solver target behavior
- workpaper formula behavior
- template registration

`8.1.0` adds regression checks for transfer-pricing math, transfer-pricing solve definitions, route search, and Smart Solver target selection.

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

## 8.1.0 Scope Highlights

This release is smaller than `8.0.0`, but it delivers three durable wins:

- local development works again on Windows
- the personalized theme settings experience is cleaner
- transfer-pricing support is now a first-class managerial-accounting route
