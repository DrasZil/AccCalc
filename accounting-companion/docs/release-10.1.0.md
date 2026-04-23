# AccCalc v10.1.0 Release Notes

AccCalc `10.1.0` is a coverage-matrix completion release. It audits the current app against the full curriculum list and focuses on curriculum areas that were still lesson-heavy, calculator-thin, or weakly integrated.

## New Calculators And Workspaces

- `Segmented Income Statement Analyzer` adds contribution margin, segment margin, allocated common-cost effect, and responsibility-accounting interpretation.
- `Audit Sampling Planner` adds sample size, sampling interval, and allowance-for-sampling-risk support using visible classroom assumptions.
- `PERT Project Estimate Helper` adds expected activity time, standard deviation, and variance for operations and project-management review.
- `Quasi-Reorganization Deficit Cleanup` adds FAR deficit relief support using share premium, revaluation surplus, and capital-reduction assumptions.
- `Corporate Liquidation Recovery Planner` adds AFAR net estate, unsecured recovery, and deficiency support.
- `Obligations and Contracts Issue Flow` adds RFBT classification and remedy framing for obligations and defective-contract questions.
- `Access Control Review Workspace` adds AIS logical-access, privileged-access, monitoring, and evidence-review support.
- `Activity-Based Costing Allocator` adds cost-pool driver rates, assigned overhead, total product cost, and unit product cost support.
- `Financial Asset Amortized Cost Schedule` adds effective-interest revenue, cash interest, amortization, and ECL-adjusted carrying amount support.
- `Investment Property Measurement Helper` compares fair value model gain/loss with cost-model carrying amount after depreciation and impairment assumptions.
- `Joint Arrangement Share Analyzer` adds AFAR share-of-assets, liabilities, revenue, expenses, profit, and classification-caution support.
- `Quality Control Chart Helper` adds three-sigma control limits and out-of-control observation checks for operations and statistical quality-control review.

## Integration Work

Every new route was wired through `src/App.tsx`, `src/utils/appCatalog.ts`, Smart Solver route scoring, solve-target hints, OCR routing, Study Hub reviewer modules, and workpaper templates.

## Study Hub Additions

New completion modules connect the tools to lesson paths for:

- segment reporting and responsibility accounting
- audit sampling and access controls
- corporate liquidation and quasi-reorganization
- RFBT obligations/contracts and operations PERT
- FAR financial assets and investment property
- ABC costing, cost-driver allocation, and statistical quality control
- AFAR joint arrangements and classification framing

## Reliability

The release adds regression tests for the new shared math helpers, search/discovery aliases, workpaper template registration, and Smart Solver target suggestions.

## Workpaper Hardening Follow-Up

- Deferred live formula preview evaluation so typing in the selected cell and formula bar stays more responsive.
- Added searchable and topic-filtered template discovery so large template sets remain assignment-friendly instead of becoming a long card wall.
- Moved autosave persistence behind the debounce into `requestIdleCallback` where available so storage work avoids the urgent editing path.
- Added a narrow-screen edit dock that tells users where they are and gives a direct focus action for the formula bar.
- Replaced hardcoded frozen-cell offsets with shared CSS variables for row-header width and column-header height.
- Added a grid region label and improved mobile/touch behavior without reintroducing sticky formula-bar friction.

## Computation Hardening

- Confidence intervals now support a z path when population standard deviation is known and a t path when the interval is based on a sample standard deviation.
- Capital rationing now preserves profitability-index ranking while also running an exact combination search for independent, indivisible projects inside the capital budget.
- Exact capital-rationing search is capped at 20 positive-NPV projects; larger sets show the classroom PI fallback with an explicit responsiveness note instead of silently attempting exponential work.
- New ABC, FAR asset, AFAR joint-arrangement, and quality-control helpers were added to shared math with regression coverage so page output, search, workpapers, and solver hints stay aligned.

## Validation

`npm test`, `npm run build`, and a bounded `npm run dev` probe passed for the v10.1.0 implementation.
