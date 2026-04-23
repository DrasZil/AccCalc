# AccCalc

AccCalc is a browser-first accounting companion for solving, checking, organizing, and reviewing accounting coursework in one app. Version `10.0.0` is a library-driven curriculum expansion focused on three product pillars:

- broader calculator coverage from accounting, analysis, statistics, cost, retail, and AFAR topic families
- deeper Study Hub reviewer support connected to the new tools
- stronger discovery through catalog, search, Smart Solver, OCR routing, and workpaper templates

## Who It Is For

- Accounting students who need calculators plus linked explanations
- Reviewees covering FAR, AFAR, cost and managerial accounting, taxation, audit, AIS, RFBT, operations, governance, and strategic integration
- Tutors and instructors who want assignment-friendly workpaper support
- Future maintainers who may return with low context and still need to extend the app safely

## What's New In 10.0.0

- Added `DuPont ROE Analyzer` and `Earnings Quality and Accruals Analyzer` for stronger financial statement analysis
- Added `Confidence Interval Helper` for statistics, audit sampling, forecasting, and marketing-research style estimates
- Added `Retail Markup and Markdown Planner` for retail pricing, maintained margin, markdown, and gross-profit support
- Added `Capital Rationing Prioritizer` for management-services project selection under a limited capital budget
- Added `Provision Expected Value Planner` for FAR provisions and contingencies
- Added `Franchise Revenue Workspace` for AFAR initial-fee revenue and contract-liability timing
- Added new Study Hub modules, OCR route patterns, Smart Solver matches, and workpaper templates for every new route
- Preserved the `9.0.0` textbook-style Study Hub and OCR structured-review model without regression

## Major Product Areas

- Smart Tools: Smart Solver, Scan & Check, OCR-assisted routing, natural-language route suggestions
- Study System: Study Hub, topic lessons, quizzes, related-topic navigation, module progress, lesson notes
- Workpapers: workbook-style templates, calculator-to-workpaper transfer flows, starter schedules
- FAR / AFAR: statement support, equity, impairments, leases, share-based payments, partnership flow, intercompany tools, consignment, branch support
- Cost / Managerial: CVP, budgets, variances, decision tools, forecasting, process costing, performance workspaces
- Taxation: VAT, withholding tax, percentage tax, estate tax, donor's tax, documentary stamp tax, book-tax review support
- Audit / AIS / Governance / RFBT / Strategic: reviewer workspaces and connected study modules

## New Academic Depth In 10.0.0

The v10 release uses the visible accounting and business library topic families as inspiration, while keeping all content original. New emphasis areas include:

- Intermediate accounting: provisions, contingencies, and revenue obligations
- Advanced accounting: franchise-fee revenue and contract liability
- Financial statement analysis: DuPont, earnings quality, cash conversion, accrual ratio
- Statistics and management analytics: confidence intervals and margin of error
- Costing, pricing, and retail: markup, markdown, maintained margin, gross profit
- Management services: capital rationing and profitability-index ranking

These are wired into the existing Study Hub search and OCR lesson recommendation flow through `src/features/study/studyExpansion450.ts` and `src/features/study/studyContent.ts`.

## Study Hub Architecture

The Study Hub is no longer just a topic-card wall.

`src/features/study/StudyHubPage.tsx` now acts more like a module shelf:

- module cards by curriculum track
- recent lesson activity
- progress and bookmark summaries
- track-aware browsing via `?track=...`
- lesson discovery grouped by curriculum area

`src/features/study/StudyTopicPage.tsx` now renders each topic inside `src/features/study/components/StudyLessonLayout.tsx`, which provides:

- breadcrumbs
- lesson header metadata
- section outline with "You are here"
- lesson progress bar
- sticky sidebar on large screens
- resume-from-last-section behavior
- related calculators and related lessons
- previous / next lesson flow

Progress is stored in `src/utils/studyProgress.ts`.

## Smart Solver And OCR

The routing stack is intentionally layered:

- `src/utils/appCatalog.ts` defines route metadata, aliases, curriculum grouping, and descriptions
- `src/utils/appSearch.ts` powers route search using a precomputed index
- `src/features/smart/smartSolver.engine.ts` scores calculators and workspaces from natural-language prompts
- `src/features/smart/smartSolver.targets.ts` maps explicit prompt wording to solve targets
- `src/features/scan-check/services/ocr/ocrRouting.ts` ranks likely routes from OCR text
- `src/features/study/studyContent.ts` recommends related lessons from OCR or route context

`9.0.0` adds `src/utils/numberParsing.ts` so Smart Solver and Scan & Check share safer parsing for:

- grouped numbers like `1,250,000`
- parenthesized negatives like `(4,500)`
- percentages like `18%`
- currency-marked values like `₱125,000`

The OCR review flow now keeps richer structured fields in `src/features/scan-check/types.ts`, including:

- raw value
- normalized value
- value kind
- source line
- confidence
- review-needed state

This makes the scanner more honest and easier to correct before autofill.

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

## Validation Status For 10.0.0

The final `10.0.0` implementation was validated with:

```bash
npm test
npm run build
```

Both commands passed after the release changes. A long-lived `npm run dev` server was not left running in the terminal after validation, but the earlier Windows-native Vite config fix remains in place.

## Project Structure

```text
accounting-companion/
  src/
    components/               Reusable UI blocks, cards, charts, math display, reading surfaces
    features/                 Route-level pages and domain modules
      accounting/
      afar/
      ais/
      audit/
      business/
      far/
      governance/
      layout/
      meta/
      operations/
      rfbt/
      scan-check/
      smart/
      strategic/
      study/
      tax/
      workpapers/
    utils/                    Shared math, search, release metadata, parsing, settings, assumptions
  tests/                      Shared math, solve-definition, search, and workpaper regression tests
  docs/                       Release notes, system overview, maintenance notes, HTML and PDF handoff docs
  vite.config.mjs             Runtime Vite config used by dev and build
```

## How Calculators And Lessons Are Organized

Routes are registered in `src/App.tsx`, then described centrally in `src/utils/appCatalog.ts`.

Most meaningful feature flows include:

1. A route page in `src/features/...`
2. Shared math in `src/utils/calculatorMath.ts`
3. Optional solve-for definitions in `src/utils/formulaSolveDefinitions.ts`
4. Formula-linked study support in `src/utils/formulaStudyContent.tsx`
5. Broader reviewer coverage in `src/features/study/studyExpansion450.ts`
6. Search aliases and route metadata in `src/utils/appCatalog.ts`
7. Smart Solver and OCR wiring in `src/features/smart/*` and `src/features/scan-check/services/ocr/*`
8. Optional workpaper templates in `src/features/workpapers/workpaperTemplates.ts`

## Updating Shared Formula Logic

- Keep the source of truth inside shared math helpers
- Keep result labels and interpretation text aligned with computed values
- Surface assumptions visibly, especially for tax logic and classroom-specific conventions
- Add reverse-solve behavior only when the target is mathematically safe

## Updating Study Content

Study content lives in two layers:

- `src/features/study/studyContent.ts` for richer hand-authored core topics and Study Hub helpers
- `src/features/study/studyExpansion450.ts` for broader curriculum-scale reviewer modules built through the `makeTopic(...)` seed pattern

When adding a new lesson:

1. Add the topic content in `studyContent.ts` or `studyExpansion450.ts`
2. Set `relatedCalculatorPaths` so lessons connect to tools
3. Set `scanSignals` and `keywords` so OCR and Study Hub search can find it
4. Add meaningful `relatedTopicIds` so next-step reading feels intentional
5. Verify the lesson renders cleanly inside `StudyLessonLayout`

## Updating OCR And Smart Solver

- Shared number parsing: `src/utils/numberParsing.ts`
- OCR cleanup: `src/features/scan-check/services/ocr/ocrMathCleanup.ts`
- OCR parse-to-structured-fields step: `src/features/scan-check/services/ocr/ocrParser.ts`
- Accounting worksheet extraction: `src/features/scan-check/services/accounting/accountingFieldExtractor.ts`
- Smart Solver ranking: `src/features/smart/smartSolver.engine.ts`
- Target hints: `src/features/smart/smartSolver.targets.ts`

If OCR feels off, prefer improving normalization, source-line review, or confidence labeling before adding blind autofill.

## Updating Themes

- Add new families in `src/utils/themePreferences.ts`
- Add corresponding CSS token overrides in `src/index.css`
- Keep both light and dark variants readable
- Surface the new family in `src/features/meta/SettingsContent.tsx`
- Check wrapping and selected-state clarity across mobile, laptop, and desktop widths

## Updating Workpaper Templates

- Register templates in `src/features/workpapers/workpaperTemplates.ts`
- Prefer assignment-friendly starter sheets with traceable labels and formulas
- Link templates back to related calculator paths so discovery stays connected

## Troubleshooting

- If `npm run dev` fails on Windows, confirm the scripts still point to `vite.config.mjs` with `--configLoader native`
- If a route exists but is hard to find, check `appCatalog.ts`, Smart Solver aliases, and OCR routing patterns together
- If a lesson breadcrumb returns to the wrong shelf, verify the `track` query-handling logic in `StudyHubPage.tsx`
- If OCR extracts the wrong number, compare the raw OCR text, cleaned text, and structured field source line before changing the solver mapping
- If a calculator result looks inconsistent, trace the path from page component to `calculatorMath.ts` and then to `formulaSolveDefinitions.ts`

## Handoff Notes

The project is organized around durable shared systems instead of page-local logic. Future maintainers should extend the shared layers first, then attach route UI, discovery, study support, and workpaper support around them.

The `docs/` folder contains the `10.0.0` release notes, system overview, maintenance playbook, and generated HTML plus PDF handoff package.
