# AccCalc 7.0.0 System Overview

## Project Overview

AccCalc is a React and TypeScript accounting companion that combines calculators, guided workspaces, OCR-assisted review, study content, and workbook-style workpapers. The application is organized around curriculum tracks, which helps both users and maintainers understand where a route belongs and what it connects to.

## Architecture Overview

The app is easiest to understand as six connected layers:

1. Routing and shell  
   `src/App.tsx` registers routes with lazy loading and connects the shared shell.
2. Shared UI scaffolding  
   `src/components/` contains calculator shells, result cards, disclosure panels, math rendering, and reusable layouts.
3. Route-level feature pages  
   `src/features/*` holds the actual page components grouped by subject area or workflow.
4. Shared domain logic  
   `src/utils/` contains the reusable math, route metadata, release metadata, search support, study mappings, and assumption config.
5. Discovery systems  
   `src/features/smart/*`, OCR routing, and route search tie natural-language prompts and scanned text back to calculators.
6. Regression coverage  
   `tests/calculatorMath.test.ts` verifies shared calculations, workpaper helpers, search behavior, and solve-target routing.

## Routing and Page Structure

The route registry lives in [src/App.tsx](/E:/AccCalc/accounting-companion/src/App.tsx:1).

Key responsibilities:

- lazy-load route components for a lighter initial load
- keep feature families grouped and readable
- route users into subject-specific pages without loading everything up front

Important route families:

- `accounting/*`
- `far/*`
- `afar/*`
- `business/*`
- `operations/*`
- `tax/*`
- `audit/*`
- `ais/*`
- `rfbt/*`
- `strategic/*`
- `study/*`
- `smart/*`
- `scan-check`
- `workpapers`

## Important Folders

### `src/components`

Shared user-interface building blocks.

Important files:

- [src/components/CalculatorPageLayout.tsx](/E:/AccCalc/accounting-companion/src/components/CalculatorPageLayout.tsx:1)  
  Shared page shell for calculator pages.
- [src/components/FormulaSolveWorkspace.tsx](/E:/AccCalc/accounting-companion/src/components/FormulaSolveWorkspace.tsx:1)  
  Generic solve-for-target workspace used by many routes.
- [src/components/FeatureSearch.tsx](/E:/AccCalc/accounting-companion/src/components/FeatureSearch.tsx:1)  
  Search UI for route discovery.
- [src/components/StudySupportPanel.tsx](/E:/AccCalc/accounting-companion/src/components/StudySupportPanel.tsx:1)  
  Links calculators back into learning content.

### `src/features/business`

Managerial-accounting, budgeting, and management-services routes.

Important `7.0.0` additions:

- [src/features/business/SpecialOrderDecisionPage.tsx](/E:/AccCalc/accounting-companion/src/features/business/SpecialOrderDecisionPage.tsx:1)
- [src/features/business/MakeOrBuyDecisionPage.tsx](/E:/AccCalc/accounting-companion/src/features/business/MakeOrBuyDecisionPage.tsx:1)
- [src/features/business/SellProcessFurtherPage.tsx](/E:/AccCalc/accounting-companion/src/features/business/SellProcessFurtherPage.tsx:1)
- [src/features/business/ConstrainedResourceProductMixPage.tsx](/E:/AccCalc/accounting-companion/src/features/business/ConstrainedResourceProductMixPage.tsx:1)
- [src/features/business/BudgetVarianceAnalysisPage.tsx](/E:/AccCalc/accounting-companion/src/features/business/BudgetVarianceAnalysisPage.tsx:1)

These pages are intentionally thin wrappers around shared solve definitions, which makes expansion cheaper and safer.

### `src/features/operations`

Operations and supply-chain support.

Important `7.0.0` addition:

- [src/features/operations/MovingAverageForecastPage.tsx](/E:/AccCalc/accounting-companion/src/features/operations/MovingAverageForecastPage.tsx:1)

### `src/features/smart`

Natural-language solver and route discovery support.

Important files:

- [src/features/smart/smartSolver.engine.ts](/E:/AccCalc/accounting-companion/src/features/smart/smartSolver.engine.ts:1)  
  Defines field metadata, extraction aliases, and calculator matching configs.
- [src/features/smart/smartSolver.targets.ts](/E:/AccCalc/accounting-companion/src/features/smart/smartSolver.targets.ts:1)  
  Maps wording like “find the principal” or “solve for spending variance” to the right solve target.
- [src/features/smart/smartSolver.types.ts](/E:/AccCalc/accounting-companion/src/features/smart/smartSolver.types.ts:1)  
  Shared key and field typing.

### `src/features/scan-check/services/ocr`

OCR parsing and route suggestions.

Important file:

- [src/features/scan-check/services/ocr/ocrRouting.ts](/E:/AccCalc/accounting-companion/src/features/scan-check/services/ocr/ocrRouting.ts:1)  
  Maps OCR-extracted wording to likely routes and route bonuses.

### `src/features/workpapers`

Workbook and working-paper support.

Important files:

- [src/features/workpapers/WorkpaperStudioPage.tsx](/E:/AccCalc/accounting-companion/src/features/workpapers/WorkpaperStudioPage.tsx:1)
- [src/features/workpapers/workpaperTemplates.ts](/E:/AccCalc/accounting-companion/src/features/workpapers/workpaperTemplates.ts:1)
- [src/features/workpapers/workpaperFormula.ts](/E:/AccCalc/accounting-companion/src/features/workpapers/workpaperFormula.ts:1)
- [src/features/workpapers/workpaperUtils.ts](/E:/AccCalc/accounting-companion/src/features/workpapers/workpaperUtils.ts:1)

`7.0.0` added new templates for the decision-support and forecasting routes so workbook use keeps pace with calculator growth.

### `src/utils`

Shared domain and application utilities.

Important files:

- [src/utils/calculatorMath.ts](/E:/AccCalc/accounting-companion/src/utils/calculatorMath.ts:1)  
  Shared business logic for calculators. This is where most formulas belong.
- [src/utils/formulaSolveDefinitions.ts](/E:/AccCalc/accounting-companion/src/utils/formulaSolveDefinitions.ts:1)  
  Shared input definitions, target metadata, steps, assumptions, and interpretation.
- [src/utils/appCatalog.ts](/E:/AccCalc/accounting-companion/src/utils/appCatalog.ts:1)  
  The route catalog, curriculum taxonomy, aliases, and tags.
- [src/utils/appSearch.ts](/E:/AccCalc/accounting-companion/src/utils/appSearch.ts:1)  
  Search scoring and the precomputed route index.
- [src/utils/formulaStudyContent.tsx](/E:/AccCalc/accounting-companion/src/utils/formulaStudyContent.tsx:1)  
  Learning support attached to calculator families.
- [src/utils/taxConfig.ts](/E:/AccCalc/accounting-companion/src/utils/taxConfig.ts:1)  
  Centralized tax assumptions and labels.
- [src/utils/appRelease.ts](/E:/AccCalc/accounting-companion/src/utils/appRelease.ts:1)  
  App versioning and release metadata.

## How Data Flows Through A Typical Calculator

For a shared formula page, the flow is:

1. `App.tsx` lazy-loads a route page
2. The page imports a solve definition
3. `FormulaSolveWorkspace` renders inputs for the selected target
4. The solve definition validates and calls a helper in `calculatorMath.ts`
5. The solve definition formats the results, steps, assumptions, and interpretation
6. `formulaStudyContent.tsx` and related route metadata provide learning and discovery follow-up
7. Tests in `tests/calculatorMath.test.ts` protect the shared logic

## How Modules Connect

- `appCatalog.ts` feeds navigation, search, homepage discovery, Smart Solver context, and related links
- `calculatorMath.ts` feeds solve definitions rather than route pages directly in many cases
- `formulaSolveDefinitions.ts` sits between raw math and UI rendering
- `smartSolver.engine.ts` and `ocrRouting.ts` both depend on route metadata and shared naming discipline
- `workpaperTemplates.ts` benefits from calculator family growth because users often need a schedule after a numeric result

## What 7.0.0 Added To The Shared System

- new relevant-costing helpers in `calculatorMath.ts`
- new solve definitions for decision support and forecasting
- new Smart Solver fields, extraction aliases, and target rules
- new OCR wording patterns for relevant-cost and forecasting problems
- a precomputed search index for lower repeated search cost
- new workpaper templates and Study Hub topic coverage for the new routes

## Tests

Main regression coverage is in [tests/calculatorMath.test.ts](/E:/AccCalc/accounting-companion/tests/calculatorMath.test.ts:1).

The test suite now covers:

- shared accounting and finance helpers
- workpaper formula behavior and workbook utilities
- route-search discoverability
- solve-target intent detection
- `6.0.0` budgeting and AFAR helpers
- `7.0.0` managerial decision and forecasting helpers

## Known Design Constraints

- The app prefers safe additive expansion over large rewrites, so some large bundles still need future chunk-splitting work.
- Some advanced topics are intentionally educational first-pass helpers rather than professional-grade enterprise systems.
- Tax content must stay assumption-driven because rules can change.
