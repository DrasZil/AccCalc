# AccCalc Developer Guide

## 1. Release overview
AccCalc `2.8.0` introduces a reusable formula-intelligence layer for safe solve-for-any-variable flows, expands statement-analysis workspaces, and keeps the app aligned with the current offline/PWA model.

Primary release themes:
- shared forward and reverse solve support for formula-driven calculators
- stronger accounting analysis workspaces
- smarter Smart Solver target-intent routing
- tighter mobile-safe form and result behavior
- deeper regression coverage for math, routing, and reverse-solve safety

## 2. App overview
AccCalc is a React + Vite + TypeScript + Tailwind calculator platform for accounting, finance, managerial accounting, business math, and review support. The app is route-based, metadata-driven, and designed to stay truthful about offline support after the current release finishes caching.

## 3. Architecture overview
- `src/App.tsx`: lazy routes, app shell wiring, and route-level recovery
- `src/features/*`: page-level calculators and workspaces
- `src/components/*`: shared inputs, panels, result surfaces, formula surfaces, disclosures, and adaptive workspaces
- `src/utils/calculatorMath.ts`: shared math and schedule logic
- `src/utils/formulaIntelligence.ts`: solve-target contracts and reusable formula-definition types
- `src/utils/formulaSolveDefinitions.ts`: supported formula catalogs with forward and reverse solve logic
- `src/utils/appCatalog.ts`: route metadata, sidebar organization, offline labels, and related-tool signals
- `src/utils/appSearch.ts`: route search and ranking
- `src/features/smart/*`: Smart Solver extraction, ranking, target-intent parsing, and UI
- `public/sw.js`: service worker versioning, cache lifecycle, and offline/update behavior

## 4. Route and category structure
Every first-class tool must exist in both:
1. `src/App.tsx`
2. `src/utils/appCatalog.ts`

Major groups stay metadata-driven so expansion does not require hand-built navigation chrome. Keep new tools inside existing academic or workflow clusters before creating a new subtopic.

Common 2.8.0 clusters:
- Accounting: fundamentals, reporting and analysis, receivables and cash, inventory, liabilities, long-lived assets, equity and partnership
- Finance: time value, capital budgeting, lending and valuation
- Managerial and Cost: CVP, budgeting, process costing, variances, decision support
- Business Math / Statistics: foundational quantitative helpers

## 5. Formula-intelligence and solve-for system
The `2.8.0` solve-for system is designed for calculators with a stable named formula and a safe reverse path.

Core pieces:
- `FormulaCalculatorDefinition`: declares fields, targets, default target, visible inputs, empty state, and solve behavior
- `FormulaFieldDefinition`: defines label, placeholder, and display kind
- `FormulaTargetDefinition`: defines solve-target label and summary
- `FormulaSolveWorkspace`: renders target selection, adaptive inputs, validation, results, and formula explanation from the definition

Current strong-fit solve-for pages include:
- simple interest
- compound interest
- future value
- present value
- profit and loss
- markup and margin
- break-even
- contribution margin
- straight-line depreciation
- current ratio
- quick ratio
- gross profit rate
- return on assets
- return on equity
- inventory turnover
- receivables turnover

## 6. How to add solve-for support to an existing calculator
1. Confirm the formula has a stable forward path and a clear reverse path.
2. Move shared math into `calculatorMath.ts` if it is not already there.
3. Create or extend a definition in `formulaSolveDefinitions.ts`.
4. Define:
   - fields
   - targets
   - default target
   - visible input keys per target
   - empty-state text
   - solve logic
5. Replace the route page body with `FormulaSolveWorkspace` when the page is fully formula-driven.
6. Add route metadata and Smart Solver support if discoverability is warranted.
7. Add forward and reverse regression tests.

## 7. How to define a safe reverse-solve path
Reverse solve is allowed only when all of the following are true:
- the missing variable can be isolated directly, or numerically with stable bounds
- the result is singular or ambiguity is explicitly detected
- domain constraints can be enforced in plain language
- the interpretation stays understandable for student and practitioner use

Do not add reverse solve when the model is:
- underdetermined
- circular without stable convergence
- likely to return multiple materially different answers
- dependent on a full schedule or ledger state that the UI is not collecting

If numerical solving is necessary:
- use bounded search
- enforce max iterations
- use explicit tolerance
- return a clear failure message when convergence does not occur
- warn when multiple solutions may exist

## 8. Numerical-safety and validation rules
Validation is route-local or definition-local, but the safety bar is shared:
- blank required fields return an empty state, not fake zeros
- invalid parses return visible errors
- divide-by-zero paths are blocked before calculation
- negative-value rules are enforced where the model requires non-negative inputs
- non-positive denominators are rejected for ratio-style solves
- logarithmic and root-based reverse solves must guard against invalid domains
- numerical failure must surface as a plain-language error, not `NaN`

When several pages repeat the same domain rule, move it into a shared helper.

## 9. Adaptive validation and result behavior
Solve-for pages must adapt to the selected target:
- hide the derived target from the input list
- update validation text to reflect the current solve target
- update empty-state guidance to describe the visible-input set
- update the primary result title, formula, steps, and interpretation
- keep supporting results contextual rather than duplicating the primary answer

`FormulaSolveWorkspace` and shared result surfaces already handle most of this. Prefer extending those shared components over page-specific branching.

## 10. Smart Solver logic and target-intent extension points
Smart Solver now has two related extension surfaces:
- `smartSolver.engine.ts`: topic routing, field extraction, and calculator ranking
- `smartSolver.targets.ts`: solve-target intent detection for supported formula pages

To add a new Smart Solver topic:
1. Add calculator config and route metadata in `smartSolver.engine.ts`
2. Add safe field aliases only for values the prompt can support reliably
3. Add examples in `SmartSolverPage.tsx`
4. Add routing tests

To add solve-target intent:
1. Add rules to `smartSolver.targets.ts`
2. Keep rules narrow enough to avoid false forcing
3. Return `null` when target confidence is weak
4. Pass the target through route state instead of hardcoding page logic

## 11. Metadata, search, and catalog implications
Every new calculator or workspace needs:
- a route registration
- a `RouteMeta` entry
- category, subtopic, tags, aliases, keywords, and offline-support metadata
- related-tool links where the workflow connection matters

If a tool is hard to discover:
- improve aliases and keywords first
- only then consider UI additions

## 12. Shared math, result, and formula rendering conventions
Use shared math in `calculatorMath.ts` when:
- the logic is nontrivial
- more than one page uses the same formula family
- the result needs direct regression coverage

Use shared UI surfaces whenever possible:
- `CalculatorPageLayout`
- `FormulaSolveWorkspace`
- `ResultGrid`
- `ResultCard`
- `FormulaCard`
- `EditableRowsCard`
- `DisclosurePanel`

Rendering rules:
- primary answer first
- compact supporting metrics second
- formula and steps after the core answer
- assumptions, notes, and warnings separated clearly
- long text must use shared result-card behavior, not ad hoc typography

## 13. Testing strategy for forward and reverse solve flows
Current regression coverage centers on `tests/calculatorMath.test.ts`.

At minimum, new formula-intelligence work should test:
- forward solve
- reverse solve
- invalid combinations
- denominator and domain guards
- numerical edge cases
- Smart Solver target intent when supported
- search discoverability for new tools

Prefer helper-level tests for numerical correctness, then add route-level interaction coverage only when behavior cannot be validated through shared logic alone.

## 14. Offline, PWA, deployment, and versioning
AccCalc uses a truthful offline model:
- local-browser calculators can work offline after the current release is cached
- lazy route chunks join the precache pipeline through the asset-manifest build
- online-only behavior must be labeled honestly

Release checklist:
1. update `package.json`
2. update `package-lock.json`
3. update `src/utils/appRelease.ts`
4. update `public/sw.js`
5. verify route metadata for new tools
6. run `tsc -b`
7. run `npm test`
8. run `npm run build`

## 15. Known limitations and future roadmap
Current intentional limits:
- solve-for mode is limited to calculators with safe reverse paths
- Smart Solver does not auto-build arbitrary multi-row schedules from messy prose
- route-level browser interaction tests remain lighter than helper-level regression tests
- offline support still depends on the release being cached once online

High-value future work:
- multi-period ratio trend analysis
- broader safe reverse solve for selected schedule summaries
- more route-level UI regression coverage for adaptive calculator states
- deeper accounting statement and budgeting workpaper flows
