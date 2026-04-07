# AccCalc Developer Guide

## 1. Release overview
AccCalc `3.0.0` ships as a two-layer upgrade on top of the `2.8.0` baseline.

- `2.9.0` is the foundation release:
  - mobile-first shell tightening
  - category-driven settings architecture
  - stronger contrast and responsive shell behavior
  - richer Smart Solver guidance modes
  - cleaner shared navigation rules
- `3.0.0` is the expansion release:
  - new Economics category
  - new Entrepreneurship category
  - broader Smart Solver discovery and teaching support
  - more practical analysis and planning workflows

## 2. App overview
AccCalc is a React + Vite + TypeScript + Tailwind calculator platform for accounting, finance, managerial accounting, business math, economics, entrepreneurship, and review support. The app is route-based, metadata-driven, mobile-first, and intentionally honest about offline behavior after the current release has been cached.

## 3. Architecture overview
- `src/App.tsx`: lazy routes, app shell wiring, and route-level recovery
- `src/features/*`: page-level calculators, workspaces, settings, and Smart Solver UI
- `src/components/*`: shared inputs, adaptive calculator layouts, result surfaces, formula cards, charts, disclosures, and formula-solve workspace UI
- `src/utils/calculatorMath.ts`: shared math, schedule logic, analysis helpers, and new economics / entrepreneurship utilities
- `src/utils/formulaIntelligence.ts`: solve-target contracts and reusable formula-definition types
- `src/utils/formulaSolveDefinitions.ts`: supported formula catalogs with forward and reverse solve logic
- `src/utils/appCatalog.ts`: route metadata, sidebar organization, related tools, offline labels, and new-feature flags
- `src/utils/appSettings.ts`: persisted settings model and sanitization
- `src/features/smart/*`: Smart Solver extraction, routing, target-intent parsing, and explanation behavior
- `public/sw.js`: service worker versioning, cache lifecycle, and offline/update behavior

## 4. Route and category structure
Every first-class tool must exist in both:
1. `src/App.tsx`
2. `src/utils/appCatalog.ts`

Current top-level groups:
- Accounting
- Finance
- Managerial and Cost
- Business Math / Statistics
- Economics
- Entrepreneurship
- Smart Tools
- Meta / system routes

Current catalog logic is subtopic-aware. Add tools to an existing subtopic before creating a new cluster. Current category examples:
- Accounting: fundamentals, reporting and analysis, receivables and cash, inventory, liabilities, long-lived assets, equity and partnership
- Finance: time value, capital budgeting, lending and valuation
- Managerial and Cost: CVP, budgeting, process costing, variances, decision support
- Economics: elasticity, equilibrium, market analysis, inflation / rates
- Entrepreneurship: startup planning, pricing, sales planning, runway and feasibility

## 5. Shared UI and shell rules
The `2.9.0` foundation update changed how shell-level UI should be extended.

Core rules:
- mobile-first first viewport
- compact chrome on phones
- richer context only when space supports it
- progressive disclosure for secondary reading
- no duplicate page metadata across header, body, and support panels
- keep primary actions closer to the top than support content

Primary shell files:
- `src/features/layout/AppLayout.tsx`
- `src/components/CalculatorPageLayout.tsx`
- `src/components/PageHeader.tsx`
- `src/features/layout/ShellChrome.tsx`
- `src/index.css`

When adding new sections or controls:
- respect `compactMobileChrome`
- avoid creating a new always-open top card if a disclosure or secondary panel will do
- keep button groups compact on narrow screens
- prefer shared panel and disclosure components over one-off wrappers

## 6. Settings architecture
Settings are now category-driven instead of one long surface.

Primary settings file:
- `src/features/meta/SettingsContent.tsx`

Persisted settings model:
- `src/utils/appSettings.ts`

Current settings sections:
- Appearance
- Calculator behavior
- AI / Solver
- Saved data
- Offline / PWA
- Accessibility
- About / Updates

Important current settings additions:
- `compactMobileChrome`
- `smartSolverDefaultMode`
- `smartSolverPreferGuidedSetup`
- `smartSolverShowStudyNotes`
- `highContrastMode`

When adding a setting:
1. extend `AppSettings`
2. extend `DEFAULT_APP_SETTINGS`
3. sanitize it in `sanitizeSettings`
4. add UI in the appropriate settings section
5. wire the setting into the consuming component without page-local storage hacks

## 7. Formula-intelligence and solve-for system
The formula-intelligence layer from `2.8.0` remains the main path for safe reverse solving.

Core pieces:
- `src/utils/formulaIntelligence.ts`
- `src/utils/formulaSolveDefinitions.ts`
- `src/components/FormulaSolveWorkspace.tsx`
- `src/features/smart/smartSolver.targets.ts`

Use it when:
- the calculator has a stable named formula
- reverse solving is mathematically safe
- domain rules are explainable
- the UI can stay understandable on mobile

Do not use it for:
- underdetermined multi-row schedules
- ledger workflows that need a full working paper
- ambiguous models with multiple materially different valid answers unless that ambiguity is part of the product design

## 8. Smart Solver architecture and extension points
Smart Solver now supports both topic routing and presentation-mode behavior.

Primary files:
- `src/features/smart/smartSolver.engine.ts`
- `src/features/smart/smartSolver.targets.ts`
- `src/features/smart/SmartSolverPage.tsx`
- `src/features/smart/smartSolver.types.ts`

Current guidance modes:
- `compute`
- `beginner`
- `professional`

Current guidance-related settings:
- default mode selection
- guided setup preference
- study-note visibility
- prompt-example visibility

To add a new Smart Solver topic:
1. add calculator config in `smartSolver.engine.ts`
2. extend route metadata and search keywords in `appCatalog.ts`
3. add prompt examples when the topic deserves direct discoverability
4. add tests for routing and search discoverability

To add solve-target intent:
1. extend `smartSolver.targets.ts`
2. keep the phrasing rules narrow
3. return `null` when confidence is weak
4. let the page open without a forced target when confidence is not strong enough

## 9. Shared math, validation, and result conventions
Use `src/utils/calculatorMath.ts` when:
- the logic is nontrivial
- more than one page can reuse it
- the result needs direct regression coverage
- a schedule or planner has multiple derived outputs

Validation rules:
- blank required fields should produce a clear empty state
- parsing failures must not leak `NaN`
- divide-by-zero paths must be blocked
- sign and domain rules must be explicit
- iterative/numerical flows need clear failure messaging

Shared UI surfaces to prefer:
- `CalculatorPageLayout`
- `FormulaSolveWorkspace`
- `ResultGrid`
- `ResultCard`
- `FormulaCard`
- `EditableRowsCard`
- `DisclosurePanel`
- `TrendLineChart`
- `ComparisonBarsChart`

Rendering rules:
- show the primary answer first
- use compact supporting metrics
- separate formula, interpretation, assumptions, and warnings
- keep long explanations modular instead of pushing them into the first viewport

## 10. Metadata, search, and catalog rules
Every new calculator or workspace needs:
- a route registration
- a `RouteMeta` entry
- category, subtopic, aliases, keywords, and offline-support metadata
- related-tool links when workflow discovery matters

The catalog drives:
- sidebar organization
- search indexing
- home-page highlights and workflows
- Smart Solver metadata context
- new-feature indicators

If a tool is hard to discover:
- improve aliases and keywords first
- improve related-tool links second
- add new UI chrome only if metadata-based discovery is still not enough

## 11. Offline, PWA, and deployment notes
AccCalc still uses a truthful offline model:
- local-browser calculators can work offline after the current release is cached
- lazy route chunks join the precache pipeline through the asset-manifest build
- online-only behavior must be labeled honestly

Release safety files:
- `package.json`
- `package-lock.json`
- `src/utils/appRelease.ts`
- `public/sw.js`

Release checklist:
1. update release metadata
2. verify new routes are in `App.tsx` and `appCatalog.ts`
3. run `tsc -b`
4. run `npm test`
5. run `npm run build`

## 12. Testing strategy
Primary regression coverage lives in `tests/calculatorMath.test.ts`.

At minimum, new feature work should test:
- helper-level math correctness
- validation and domain guards
- reverse solve behavior when supported
- search discoverability for new tools
- Smart Solver routing or target-intent rules when supported

Prefer helper-level tests for deterministic logic, then add route-level interaction tests only when the UI behavior cannot be verified through shared abstractions.

## 13. How to add a new calculator
1. Decide whether the tool is:
   - simple formula page
   - formula-intelligence page
   - row-based workspace
   - schedule / planner page
2. Move reusable math into `calculatorMath.ts`.
3. Build the page with shared layout and result surfaces.
4. Register the lazy route in `src/App.tsx`.
5. Add route metadata in `src/utils/appCatalog.ts`.
6. Extend Smart Solver and search only when there is clear discoverability value.
7. Add regression coverage.
8. Check mobile density before considering the page done.

## 14. Known limitations and future roadmap
Current intentional limits:
- solve-for mode is limited to safe reverse paths
- Smart Solver does not auto-build arbitrary multi-row schedules from messy prose
- helper-level regression coverage is stronger than route-level UI coverage
- offline use still depends on the release being cached once online

High-value future work:
- richer multi-period analysis workspaces
- broader guided setup for structured accounting workpapers
- more route-level interaction coverage for adaptive states
- deeper cross-tool learning bundles and case-based study flows
