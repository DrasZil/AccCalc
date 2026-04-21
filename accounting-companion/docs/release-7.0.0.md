# AccCalc 7.0.0 Release Notes

Release date: `2026-04-21`

## Summary

AccCalc `7.0.0` is a major academic-expansion release that pushes beyond the earlier `6.0.0` breadth pass. The update focuses on heavier managerial-accounting and operations coverage, stronger decision-support continuity, faster discovery, and safer shared logic for future maintenance.

## Major User-Facing Additions

- `Special Order Analysis`
- `Make-or-Buy Analysis`
- `Sell-or-Process-Further`
- `Constrained Resource Product Mix`
- `Budget Variance Analysis`
- `Moving Average Forecast`

## Academic Expansion Highlights

- Expanded management-services and relevant-costing coverage with practical short-term decision tools
- Added bottleneck and contribution-margin ranking support for constrained-resource problems
- Added performance-reporting support for spending, activity, and total budget variance
- Added operations forecasting support through simple and weighted moving averages
- Added aligned Study Hub topics so new routes connect into reviewer-style study flows
- Added aligned workpaper templates so new tools can move into assignment-ready worksheet support

## Discovery and Routing Improvements

- Expanded route aliases and curriculum keywords in `appCatalog.ts`
- Added Smart Solver field coverage, extraction aliases, and calculator configs for the new tools
- Added solve-target mapping rules for the new decision-support calculators
- Added OCR routing patterns for relevant-costing, bottleneck, variance, and forecasting problem wording
- Expanded homepage workflow surfacing so the new family is easier to discover without searching exact route names

## Accuracy and Reliability Improvements

- Added shared helpers in `calculatorMath.ts` for the new managerial and forecasting workflows
- Added matching solve definitions in `formulaSolveDefinitions.ts` so interpretation, assumptions, and reverse-solve labels stay synchronized
- Added regression coverage for new shared math, route discovery, and solve-target behavior
- Preserved centralized tax assumptions and existing shared calculation infrastructure

## Performance and Survivability Improvements

- Added a precomputed route-search index in `appSearch.ts` to reduce repeated search work as the catalog keeps growing
- Reduced result-card noise in search by limiting surfaced tag clutter in `FeatureSearch.tsx`
- Kept the release additive and low-risk by using existing lazy-loading and shared workspace patterns rather than rewriting core route architecture

## Documentation Deliverables

- Updated `README.md`
- `docs/release-7.0.0.md`
- `docs/system-overview-v7.0.0.md`
- `docs/maintenance-playbook-v7.0.0.md`
- `docs/AccCalc-v7.0.0-Documentation.html`
- `docs/AccCalc-v7.0.0-Documentation.pdf`

## Validation

- `npm test`: passed
- `npm run build`: passed

## Known Limitations

- Vite still reports large chunks for a few heavy surfaces such as `WorkpaperStudioPage`, `appCatalog`, `main`, and some shared solve-definition bundles. The app builds successfully, but those are still the next safe chunk-splitting targets.
- The new constrained-resource route evaluates one product at a time. Full multi-product optimization still requires ranking across multiple products and additional demand or capacity constraints.
- Tax content remains educational support rather than legal advice or filing automation.
