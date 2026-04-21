# AccCalc 6.0.0 Release Notes

Release date: `2026-04-21`

## Summary

AccCalc 6.0.0 is a mass-completion release focused on breadth, continuity, and survivability. The update expands curriculum coverage across budgeting, FAR, and AFAR while keeping the product maintainable through shared abstractions, stronger discovery wiring, centralized assumptions, and a fuller documentation set.

## Major User-Facing Additions

- `Direct Labor Budget`
- `Factory Overhead Budget`
- `Budgeted Income Statement`
- `Notes Receivable Discounting`
- `Equity Method Investment`
- `Intercompany PPE Transfer`

## Breadth Improvements

- Completed more of the master-budget flow beyond sales, production, materials, inventory, and operating expenses
- Added FAR receivables depth for discounted notes
- Added AFAR coverage for associate investments and transferred-PPE eliminations
- Added aligned workpaper templates so the new tools are assignment-ready
- Added new Study Hub topics so new calculators are supported by reviewer-style reading paths

## Discovery Improvements

- Expanded route aliases and keywords in `appCatalog.ts`
- Added Smart Solver field coverage and calculator configs for the new pages
- Added new solve-target mapping rules in `smartSolver.targets.ts`
- Added OCR route patterns for new budgeting, FAR, and AFAR workflows

## Maintainability Improvements

- Centralized time-sensitive Philippine tax assumptions in `src/utils/taxConfig.ts`
- Kept new solve logic inside shared `calculatorMath.ts` and `formulaSolveDefinitions.ts`
- Added regression coverage in `tests/calculatorMath.test.ts`
- Replaced the placeholder README with production-oriented handoff docs

## Documentation Deliverables

- Rewritten `README.md`
- `docs/system-overview-v6.0.0.md`
- `docs/maintenance-playbook-v6.0.0.md`
- `docs/AccCalc-v6.0.0-Documentation.html`
- `docs/AccCalc-v6.0.0-Documentation.pdf`

## Validation

- `npm test`: passed
- `npm run build`: passed

## Known Limitations

- The build still reports large chunks for some major bundles such as `WorkpaperStudioPage`, `appCatalog`, and `main`; the release keeps stability first and leaves deeper chunk-splitting as a later optimization pass.
- Tax tools remain educational helpers, not legal advice or filing automation.
- Some advanced AFAR, lease, and tax topics remain first-pass support tools rather than fully exhaustive professional systems.
