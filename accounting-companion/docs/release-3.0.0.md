# AccCalc 3.0.0 Release Notes

## Theme
Flagship expansion into broader business learning and practical planning workflows.

## Highlights
- Added a full Economics category.
- Added a full Entrepreneurship category.
- Expanded Smart Solver discoverability and guidance for the new categories.
- Added new chart-backed teaching and planning workspaces.
- Kept the release aligned with the existing offline/PWA model and shared architecture.

## New tools
### Economics
- Price Elasticity of Demand
- Market Equilibrium
- Consumer and Producer Surplus
- Real Interest Rate

### Entrepreneurship
- Startup Cost Planner
- Unit Economics Workspace
- Sales Forecast Planner
- Cash Runway Planner

## Product impact
`3.0.0` makes AccCalc feel broader and more professionally useful. The app is no longer only an accounting and finance calculator collection. It now supports economics review, startup planning, and cross-category study/workshop flows.

## Main technical areas
- `src/features/economics/*`
- `src/features/entrepreneurship/*`
- `src/utils/calculatorMath.ts`
- `src/utils/appCatalog.ts`
- `src/features/smart/smartSolver.engine.ts`
- `src/features/home/HomePage.tsx`

## Notes
- The new categories remain deterministic local-browser tools. They do not introduce online-only solver dependencies.
- Smart Solver routes these tools when topic confidence is strong, but still falls back safely when the prompt is too vague.
