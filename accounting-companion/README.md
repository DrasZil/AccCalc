# AccCalc

AccCalc is a browser-first accounting companion for solving, checking, organizing, and reviewing accounting coursework in one app. Version `8.1.0` is a focused follow-up release that restores local Vite development on Windows, cleans up the theme settings experience, and adds another managerial-accounting tool without regressing the broader `8.0.0` curriculum expansion.

## Who It Is For

- Accounting students who need calculators plus linked explanations
- Reviewees covering FAR, AFAR, cost and managerial accounting, taxation, audit, AIS, RFBT, and related business topics
- Tutors and instructors who want assignment-friendly workpaper support
- Future maintainers who may come back with limited context and still need to extend the app safely

## What's New In 8.1.0

- Fixed the Windows Vite startup regression so `npm run dev` no longer crashes while loading config
- Moved runtime Vite loading to `vite.config.mjs` with native loading and BOM-safe package metadata parsing
- Fixed the theme family picker so cards and swatches wrap cleanly on laptop and larger screens
- Fixed the appearance quick-stats memo so theme-family changes update immediately
- Added `Transfer Pricing Support` with route, catalog, Smart Solver, OCR, study, and workpaper wiring
- Simplified runtime release metadata so the app ships only the current release summary instead of duplicated history

## Major Product Areas

- Smart Tools: Smart Solver, Scan & Check, OCR-assisted routing, natural-language route suggestions
- Study System: Study Hub, reviewer topics, formula-linked study panels, related-topic navigation
- Workpapers: workbook-style templates, workbook utilities, calculator-to-workpaper transfer flows
- FAR / AFAR: statement support, equity, impairments, leases, share-based payments, intercompany tools, consignment, branch support
- Cost / Managerial: CVP, budgets, variances, decision tools, forecasting, process costing, performance workspaces
- Taxation: VAT, withholding tax, percentage tax, estate tax, donor's tax, documentary stamp tax, book-tax review support
- Audit / AIS / Governance / RFBT / Strategic: reviewer workspaces and connected curriculum support

## Theme System

Theme preferences are persisted through `src/utils/appSettings.ts` and `src/utils/themePreferences.ts`.

The active theme has two axes:

- `themePreference`: `system`, `light`, or `dark`
- `themeFamily`: `classic`, `ocean`, `slate`, `rose`, `blossom`, `lavender`, `sunset`, or `emerald`

Theme state is restored before the main UI paints from `index.html`, then the shell applies `data-theme` and `data-theme-family` so cards, borders, text, inputs, and supporting surfaces inherit the right design tokens with less startup flicker.

## Installation And Setup

```bash
npm install
npm run dev
```

## Development Commands

```bash
npm run dev
npm test
npm run build
npm run lint
```

## Build And Validation Status For 8.1.0

The final `8.1.0` implementation was validated with:

```bash
npm test
npm run build
```

Both commands passed after the release changes. `npm run dev` was also fixed by moving runtime config loading to `vite.config.mjs` with `--configLoader native`.

## Project Structure

```text
accounting-companion/
  src/
    components/               Reusable UI blocks, result cards, charts, math display
    features/                 Route-level pages and domain modules
      accounting/
      afar/
      audit/
      business/
      far/
      layout/
      meta/
      operations/
      scan-check/
      smart/
      study/
      tax/
      workpapers/
    utils/                    Shared math, catalog metadata, settings, assumptions, release metadata
  tests/                      Shared math, solve-definition, search, and workpaper regression tests
  docs/                       Release notes, system overview, maintenance notes, HTML and PDF handoff docs
  vite.config.mjs             Runtime Vite config used by dev and build
  vite.config.d.ts            TypeScript stub so config-project metadata stays explicit without runtime coupling
```

## How Calculators Are Organized

Routes are registered in `src/App.tsx`, then described centrally in `src/utils/appCatalog.ts`.

Most meaningful calculator flows include:

1. A route page in `src/features/...`
2. Shared math in `src/utils/calculatorMath.ts`
3. Optional solve-for definitions in `src/utils/formulaSolveDefinitions.ts`
4. Study support in `src/utils/formulaStudyContent.tsx`
5. Broader reviewer coverage in `src/features/study/studyExpansion450.ts`
6. Search aliases and route metadata in `src/utils/appCatalog.ts`
7. Smart Solver and OCR wiring in `src/features/smart/*` and `src/features/scan-check/services/ocr/ocrRouting.ts`
8. Optional workpaper templates in `src/features/workpapers/workpaperTemplates.ts`

## Shared Formula Logic At A High Level

`src/utils/calculatorMath.ts` is the math source of truth. Route pages and solve-definition systems should call those helpers instead of re-implementing formulas inside page components.

`src/utils/formulaSolveDefinitions.ts` wraps shared math with:

- field metadata
- solve targets
- result cards
- assumptions
- warnings
- explanation text

This is where reverse-solve behavior belongs when the math is safe and not misleading.

## How Smart Solver, OCR, Workpapers, And Study Connect

- `appCatalog.ts` defines route metadata, aliases, categories, and new-feature surfacing
- `appSearch.ts` powers route search using a precomputed index
- `smartSolver.engine.ts` scores routes and field matches from natural-language prompts
- `smartSolver.targets.ts` maps explicit wording to solve targets
- `ocrRouting.ts` suggests likely routes from scanned worksheet vocabulary
- `workpaperTemplates.ts` registers assignment-ready starter sheets
- `formulaStudyContent.tsx` and `studyExpansion450.ts` connect solving routes back into learning and review

## Adding A New Calculator

1. Add or extend shared math in `src/utils/calculatorMath.ts`
2. Add a solve definition in `src/utils/formulaSolveDefinitions.ts` if the route uses the shared formula workspace pattern
3. Create the route page in the correct `src/features/...` folder
4. Register the route in `src/App.tsx`
5. Add route metadata, aliases, keywords, and category placement in `src/utils/appCatalog.ts`
6. Update Smart Solver in `src/features/smart/smartSolver.engine.ts`
7. Add solve-target hints in `src/features/smart/smartSolver.targets.ts` when needed
8. Add OCR route patterns in `src/features/scan-check/services/ocr/ocrRouting.ts`
9. Add study content and reviewer coverage where useful
10. Add a workpaper template if the route benefits from assignment support
11. Add or extend tests in `tests/calculatorMath.test.ts`

## Updating Formula Logic

- Keep the source of truth inside shared math helpers
- Keep result labels and interpretation text aligned with computed values
- Surface assumptions visibly, especially for tax logic and classroom-specific conventions
- Add reverse-solve behavior only when the target is mathematically safe

## Updating Themes

- Add new families in `src/utils/themePreferences.ts`
- Add corresponding CSS token overrides in `src/index.css`
- Keep both light and dark variants readable
- Surface the new family in `src/features/meta/SettingsContent.tsx`
- Check swatch wrapping and selected-state clarity at laptop and desktop widths

## Updating Workpaper Templates

- Register templates in `src/features/workpapers/workpaperTemplates.ts`
- Prefer assignment-friendly starter sheets with traceable labels and formulas
- Link templates back to related calculator paths so discovery stays connected

## Troubleshooting

- If `npm run dev` fails while loading Vite config on Windows, confirm the scripts still point to `vite.config.mjs` with `--configLoader native`
- If package metadata needs to be read in config time, keep the read path BOM-safe like the current `vite.config.mjs` implementation
- If a route exists but is hard to find, check `appCatalog.ts`, Smart Solver aliases, and OCR routing patterns together
- If a calculator result looks inconsistent, trace the path from page component to `calculatorMath.ts` and then to `formulaSolveDefinitions.ts`
- If a theme surface looks wrong, verify both `data-theme` and `data-theme-family` selectors in `src/index.css`

## Handoff Notes

The project is organized around durable shared systems instead of page-local logic. Future maintainers should extend the shared layers first, then attach route UI, discovery, study support, and workpaper support around them.

The `docs/` folder contains the `8.1.0` release notes, system overview, maintenance playbook, and generated HTML plus PDF handoff package.
