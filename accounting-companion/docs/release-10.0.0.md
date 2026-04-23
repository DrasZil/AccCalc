# AccCalc v10.0.0 Release Notes

Release date: `2026-04-23`

## Summary

AccCalc `10.0.0` is a library-driven curriculum expansion on top of the current Study Hub, Smart Solver, OCR, and workpaper systems. It uses the user's curriculum list as the master target and the visible accounting, cost, financial-statement-analysis, statistics, marketing, and retail books as topic-family inspiration. All calculator logic, explanations, examples, and reviewer content are original.

## New Calculators And Workspaces

- `DuPont ROE Analyzer` at `/accounting/dupont-analysis`
- `Earnings Quality and Accruals Analyzer` at `/accounting/earnings-quality-analysis`
- `Confidence Interval Helper` at `/statistics/confidence-interval`
- `Retail Markup and Markdown Planner` at `/operations/retail-markup-markdown`
- `Capital Rationing Prioritizer` at `/finance/capital-rationing-prioritizer`
- `Provision Expected Value Planner` at `/far/provision-expected-value`
- `Franchise Revenue Workspace` at `/afar/franchise-revenue-workspace`

## Academic Coverage Added

- FAR: provisions, contingencies, probability-weighted estimates, and recognition caution.
- AFAR: franchise-fee revenue, satisfied performance obligations, collectability pressure, and contract liability.
- Financial statement analysis: DuPont ROE, margin, turnover, leverage, accrual ratio, cash conversion, and earnings-quality interpretation.
- Statistics and analytics: standard error, margin of error, and large-sample confidence interval support.
- Operations and retail: markup, markdown, maintained margin, sales revenue, and gross profit.
- Management services and finance: capital rationing, profitability-index ranking, and constrained project selection.

## Integration

Every new route was wired into:

- `src/App.tsx`
- `src/utils/appCatalog.ts`
- `src/features/smart/smartSolver.engine.ts`
- `src/features/smart/smartSolver.targets.ts`
- `src/features/scan-check/services/ocr/ocrRouting.ts`
- `src/features/study/studyExpansion450.ts`
- `src/features/workpapers/workpaperTemplates.ts`
- `tests/calculatorMath.test.ts`

## Reliability

The shared math layer now contains tested helpers for DuPont analysis, earnings quality, confidence intervals, provision expected value, retail markup/markdown, franchise revenue, and capital rationing.

## Known Limits

- The confidence interval helper uses common large-sample z critical values. Small-sample t intervals still require the exact t critical value expected by the course.
- Capital rationing uses a classroom profitability-index ranking approach. Complex indivisible combinations can require full optimization.
- Franchise revenue and provisions remain educational helpers; real recognition depends on the contract, obligation, and applicable standards.

## Validation

```bash
npm test
npm run build
```

Both commands passed for the final `10.0.0` state.
