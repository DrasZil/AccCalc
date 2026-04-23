# AccCalc v10.0.0 System Overview

## Purpose

AccCalc is a curriculum-oriented accounting companion with calculators, Study Hub lessons, Smart Solver routing, OCR-assisted scan review, and workpaper templates.

Version `10.0.0` extends the existing architecture with a library-driven topic layer focused on financial statement analysis, statistics, retail pricing, FAR provisions, AFAR franchise revenue, and capital rationing.

## Main Data Flow

1. Routes are lazy-loaded from `src/App.tsx`.
2. Route metadata, aliases, category grouping, and search keywords live in `src/utils/appCatalog.ts`.
3. Shared calculations live in `src/utils/calculatorMath.ts`.
4. Study modules live in `src/features/study/studyExpansion450.ts` and render through the v9 textbook-style lesson UI.
5. Smart Solver route ranking lives in `src/features/smart/smartSolver.engine.ts`.
6. Solve-target hints live in `src/features/smart/smartSolver.targets.ts`.
7. OCR route suggestions live in `src/features/scan-check/services/ocr/ocrRouting.ts`.
8. Workpaper templates live in `src/features/workpapers/workpaperTemplates.ts`.
9. Regression tests live in `tests/calculatorMath.test.ts`.

## New v10 Shared Math

`src/utils/calculatorMath.ts` now includes:

- `computeDupontAnalysis`
- `computeEarningsQuality`
- `computeConfidenceInterval`
- `computeRetailMarkupMarkdown`
- `computeCapitalRationingSelection`
- `computeProvisionExpectedValue`
- `computeFranchiseRevenue`

These helpers keep page output, interpretation, and regression tests aligned.

## New v10 Route Families

- Financial statement analysis: `/accounting/dupont-analysis`, `/accounting/earnings-quality-analysis`
- Statistics: `/statistics/confidence-interval`
- Retail and operations: `/operations/retail-markup-markdown`
- Finance and management services: `/finance/capital-rationing-prioritizer`
- FAR: `/far/provision-expected-value`
- AFAR: `/afar/franchise-revenue-workspace`

## Study Hub

The v9 textbook-style Study Hub architecture remains the lesson shell. v10 adds original modules for:

- statement analysis, DuPont, and earnings quality
- confidence intervals for accounting and business estimates
- retail pricing and capital selection
- provisions and franchise revenue

## Discovery

New aliases and OCR patterns make longer prompts route to the correct tool. Examples:

- "DuPont ROE and equity multiplier" routes to DuPont analysis.
- "quality of earnings accrual ratio" routes to earnings quality.
- "confidence interval margin of error" routes to statistics.
- "initial franchise fee revenue" routes to AFAR franchise revenue.

## Maintenance Notes

When adding a future library-inspired topic, use the same path:

1. Add shared math if the topic is numeric.
2. Add a route page.
3. Add catalog metadata.
4. Add Smart Solver and OCR patterns.
5. Add Study Hub content.
6. Add a workpaper template where assignment support is useful.
7. Add tests.
