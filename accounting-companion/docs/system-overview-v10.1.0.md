# AccCalc v10.1.0 System Overview

Version `10.1.0` keeps the existing React/Vite architecture and adds a focused curriculum-completion layer across calculators, lessons, Smart Solver, OCR routing, and workpapers.

## Route Layer

New pages live in focused feature folders:

- `src/features/business/SegmentedIncomeStatementPage.tsx`
- `src/features/audit/AuditSamplingPlannerPage.tsx`
- `src/features/operations/PertProjectEstimatePage.tsx`
- `src/features/far/QuasiReorganizationPage.tsx`
- `src/features/afar/CorporateLiquidationPage.tsx`
- `src/features/rfbt/ObligationsContractsFlowPage.tsx`
- `src/features/ais/AccessControlReviewPage.tsx`
- `src/features/business/ActivityBasedCostingPage.tsx`
- `src/features/far/FinancialAssetAmortizedCostPage.tsx`
- `src/features/far/InvestmentPropertyMeasurementPage.tsx`
- `src/features/afar/JointArrangementAnalyzerPage.tsx`
- `src/features/operations/QualityControlChartPage.tsx`

Routes are registered lazily in `src/App.tsx` so the added breadth does not force a route rewrite.

## Shared Math

`src/utils/calculatorMath.ts` now includes:

- `computeSegmentMargin`
- `computeAuditSamplingPlan`
- `computePertEstimate`
- `computeQuasiReorganization`
- `computeCorporateLiquidation`
- `computeActivityBasedCosting`
- `computeFinancialAssetAmortizedCost`
- `computeInvestmentPropertyMeasurement`
- `computeJointArrangementShare`
- `computeQualityControlChart`

These helpers keep page output, tests, and future solver work aligned.

The hardening follow-up also strengthens two earlier helpers:

- `computeConfidenceInterval` now returns z/t method metadata, critical value, degrees of freedom, standard error, and interval bounds.
- `computeCapitalRationingSelection` now returns both greedy PI-ranking selection and exact combination-search selection for independent, indivisible projects, with a capped exact-search path so large project sets remain responsive.

## Discovery And Smart Routing

`src/utils/appCatalog.ts` defines labels, aliases, keywords, curriculum groupings, and current-release badges for the v10.1 routes. `src/features/smart/smartSolver.engine.ts` adds route matches for advanced prompts, while `src/features/smart/smartSolver.targets.ts` adds solve-target hints for new calculator families including ABC, FAR asset measurement, joint arrangements, and quality-control charting.

## OCR Routing

`src/features/scan-check/services/ocr/ocrRouting.ts` now recognizes segment-margin wording, audit sampling terms, PERT estimate language, ABC cost pools and drivers, FAR asset-measurement terms, investment property, quality-control limits, quasi-reorganization, corporate liquidation, joint arrangements, obligations/contracts, and access-control signals.

## Study Hub

`src/features/study/studyExpansion450.ts` adds completion modules that connect lessons to calculators and related study paths. The newest modules cover FAR asset measurement, ABC and statistical quality control, and AFAR joint-arrangement classification. The v9 textbook-style lesson shell remains the rendering architecture.

## Workpapers

`src/features/workpapers/workpaperTemplates.ts` adds starter sheets for segment reporting, audit sampling, PERT, liquidation/quasi-reorganization, RFBT/AIS review, ABC and quality-control support, FAR financial-assets/investment-property support, and joint-arrangement support.

`src/features/workpapers/WorkpaperStudioPage.tsx` now defers live formula-preview evaluation, filters templates by search text and topic, opens templates through a shared launch action, schedules autosave work during idle time where supported, and exposes clearer narrow-screen editing guidance. `src/index.css` centralizes workpaper row-header and column-header dimensions with CSS variables so frozen rows and columns stay aligned across thin screens, and the template filter controls collapse cleanly on small screens.

## Tests

`tests/calculatorMath.test.ts` validates new shared math, discovery routes, workpaper templates, and Smart Solver target hints.
