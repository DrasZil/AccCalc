# AccCalc Developer Guide

## 1. App overview
AccCalc is a React + Vite + TypeScript + Tailwind calculator platform focused on accounting, finance, managerial accounting, business math, and related study or workplace support. The app is route-based, offline-aware after caching, and centered on shared helpers so new tools stay consistent with the rest of the product.

## 2. Architecture overview
- `src/App.tsx`: lazy route registration and route shell/error handling
- `src/features/*`: page-level tools grouped by domain
- `src/components/*`: shared layout, result, formula, disclosure, and input surfaces
- `src/utils/calculatorMath.ts`: shared math and schedule logic
- `src/utils/appCatalog.ts`: route metadata, sidebar structure, offline labels, and related-tool signals
- `src/utils/appSearch.ts`: metadata search and ranking
- `src/features/smart/*`: Smart Solver types, extraction, ranking, and UI
- `public/sw.js`: service worker versioning and offline/update behavior

## 3. Route and category structure
The catalog is metadata-driven. Every tool route should exist in both `src/App.tsx` and `src/utils/appCatalog.ts`.

Current major groups:
- General
- Core Tools
- Smart Tools
- Accounting
- Finance
- Managerial & Cost
- Business Math
- Statistics

Subtopics are inferred in `appCatalog.ts` so large groups stay scannable in the sidebar and search. Keep new tools inside an existing subtopic when possible before inventing a new one.

## 4. Smart Solver logic and extension points
Smart Solver works through:
1. `smartSolver.types.ts` for field keys and config types
2. `smartSolver.engine.ts` for field metadata, extraction aliases, calculator configs, ranking, and prefill generation
3. `SmartSolverPage.tsx` for the user-facing prompt UI
4. `smartSolver.connector.ts` for safe route-state prefill into calculators

To extend Smart Solver for a new calculator:
1. Add any needed field keys to `smartSolver.types.ts`
2. Add field metadata and aliases in `smartSolver.engine.ts`
3. Add extraction rules only for values that can be inferred safely
4. Add a `CALCULATORS` entry with keywords, aliases, route, and required fields
5. Connect the calculator page with `useSmartSolverConnector` if prefill is appropriate
6. Add prompt examples and tests

## 5. Shared math and helper utilities
`calculatorMath.ts` is the main shared logic surface. Prefer adding reusable functions there when:
- the math is used by more than one route
- the logic is substantial enough to warrant direct test coverage
- the result needs to stay standardized across tools

Recent shared helpers cover:
- capital budgeting: NPV, PI, IRR, payback, discounted payback
- receivables: aging schedule, bank reconciliation
- budgeting: cash budget, collections schedule, disbursements schedule, flexible budget
- managerial and cost: sales mix, equivalent units, material/labor variances, factory overhead variances
- reporting and ratios: liquidity, turnover, and profitability helpers

## 6. Validation strategy
Validation is primarily route-local and follows these rules:
- blank required inputs should return `null` state, not fake results
- invalid numeric input should produce a visible warning card
- negative values are rejected when the academic method does not support them
- divide-by-zero inputs should be blocked before calculation
- optional fields should default safely, usually to zero or blank-driven omission
- method-specific constraints should be stated in user-facing language

If the same validation rule appears in several pages, move it into a helper.

## 7. Metadata and search system
Every first-class route needs:
- a `RouteMeta` entry in `appCatalog.ts`
- category, description, tags, aliases, keywords, offline support details, and optional short label
- reasonable `isNew` handling for the active release if the route is newly introduced

Search in `appSearch.ts` uses:
- title matching
- aliases
- keywords
- category and subtopic
- typo-tolerant token matching

If a route is hard to find, improve metadata before adding more UI chrome.

## 8. Result and formula rendering conventions
Use the shared surfaces:
- `CalculatorPageLayout`
- `ResultGrid`
- `ResultCard`
- `FormulaCard`
- `SectionCard`
- `DisclosurePanel`

Guidelines:
- keep inputs first and guide content secondary
- results should surface the main answer immediately
- formulas should separate equation, steps, interpretation, assumptions, notes, and warnings
- long text results should use shared result-card behavior instead of custom large typography

## 9. Offline and PWA behavior
AccCalc uses a truthful offline model:
- local routes can work offline after the current release finishes caching
- route chunks are precached through the asset-manifest/service-worker flow
- offline labels must reflect actual route behavior
- online-only actions must say so clearly

Do not mark a route as offline-safe if it depends on network data or an uncached external destination.

## 10. Testing strategy
Main regression coverage currently lives in `tests/calculatorMath.test.ts`.

Tests should cover:
- shared helper math
- route-search discoverability for important aliases
- new schedule logic and rounding behavior
- new Smart Solver vocabulary where appropriate
- edge cases like zero rates, invalid horizons, or non-balanced states

When a new page adds nontrivial math, add helper-level tests before relying on manual browser QA alone.

## 11. How to add a new calculator
1. Add or reuse shared math in `calculatorMath.ts`
2. Create the route page in the appropriate `src/features/*` folder
3. Register the lazy route in `src/App.tsx`
4. Add route metadata to `src/utils/appCatalog.ts`
5. Ensure search keywords, aliases, and tags are present
6. Add home/workflow visibility only if the tool is high-signal
7. Add tests
8. Update release metadata if the tool is part of the active release

## 12. How to add Smart Solver support for a new calculator
1. Add only the fields you can extract safely
2. Avoid pretending to infer multi-row schedules from ambiguous prompts
3. Use keywords and aliases for route-level discovery even when prefill is intentionally limited
4. Prefer safe partial prefill plus user review over aggressive guessing
5. Add at least one search or routing regression test for the new tool

## 13. Release and versioning process
For each release:
- update `package.json`
- update `package-lock.json`
- update `src/utils/appRelease.ts`
- update `public/sw.js`
- verify route metadata and new-feature flags
- run `tsc -b`, `npm test`, and `npm run build`

Keep release highlights short and user-facing. Keep deeper implementation detail in commit history or docs.

## 14. Deployment notes
The app is designed for static deployment, including Render static hosting.

Deployment expectations:
- route chunks must stay consistent with the service-worker cache model
- stale deploys should fail gracefully through the existing route error boundaries
- lazy route additions should automatically join the build manifest and caching model through the normal build
- build verification matters because route-based code splitting is a core production behavior

## 15. Known limitations and future enhancements
Current intentional limits:
- Smart Solver does not fully auto-build complex multi-row schedules from raw prose when confidence is low
- offline support still depends on the current release having been cached at least once online
- tests are strongest at the shared-helper level and lighter on route-level interaction flows

High-value future work:
- fuller ratio-analysis benchmarking and trend comparison
- more multi-period budgeting rollforwards
- additional process-costing methods and overhead presentations
- broader route-level UI tests beyond helper math regression
