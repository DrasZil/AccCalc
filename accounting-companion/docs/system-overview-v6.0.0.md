# AccCalc 6.0.0 System Overview

## Project Overview

AccCalc is a React and TypeScript accounting companion that mixes calculators, guided workspaces, OCR-assisted review, study content, and workbook-style workpapers. The application is organized around curriculum tracks instead of purely technical modules, which makes the product easier to use for students and easier to extend with additional accounting topics.

## Architecture Overview

At a high level, the app has five connected layers:

1. Routing and shell
   `src/App.tsx` registers routes with lazy loading and feeds the app shell.
2. Shared UI and page scaffolding
   `src/components/` holds calculator shells, result cards, formula displays, and disclosure patterns.
3. Feature pages
   `src/features/*` contains route-level pages grouped by subject or workflow.
4. Shared logic
   `src/utils/` holds calculator math, release metadata, route metadata, offline/update helpers, and study support mappings.
5. Validation and regression coverage
   `tests/calculatorMath.test.ts` checks shared calculations, route discovery, workpaper helpers, and solve-target behavior.

## Routing and Page Structure

The main route registry is [`src/App.tsx`](/E:/AccCalc/accounting-companion/src/App.tsx:1).

Responsibilities:

- Lazy-load most pages for lower initial route cost
- Wrap routes with error boundaries
- Connect route metadata through `getRouteMeta`
- Keep subject areas readable because route imports are grouped by feature family

Important route families:

- `accounting/*`
- `business/*`
- `far/*`
- `afar/*`
- `tax/*`
- `audit/*`
- `study/*`
- `smart/*`
- `scan-check`
- `workpapers`

## File and Folder Map

### `src/components`

Shared visual and workflow primitives used across many pages.

Important files:

- [`CalculatorPageLayout.tsx`](/E:/AccCalc/accounting-companion/src/components/CalculatorPageLayout.tsx:1)
  Shared page shell with input, result, explanation, and support regions.
- [`FormulaSolveWorkspace.tsx`](/E:/AccCalc/accounting-companion/src/components/FormulaSolveWorkspace.tsx:1)
  Generic solve-for workspace used by many formula pages.
- [`FormulaCard.tsx`](/E:/AccCalc/accounting-companion/src/components/FormulaCard.tsx:1)
  Displays formulas, steps, glossary items, assumptions, notes, and warnings.
- [`StudySupportPanel.tsx`](/E:/AccCalc/accounting-companion/src/components/StudySupportPanel.tsx:1)
  Attaches learning support to formula pages.

### `src/features/accounting`

Contains FAR/foundational accounting calculators and workspaces such as:

- bank reconciliation
- petty cash
- notes interest
- note discounting
- receivables aging
- adjusting entries
- ratios
- inventory tools
- depreciation tools

The new 6.0.0 FAR receivables addition is:

- [`NotesReceivableDiscountingPage.tsx`](/E:/AccCalc/accounting-companion/src/features/accounting/NotesReceivableDiscountingPage.tsx:1)

### `src/features/business`

Contains cost and managerial pages such as CVP, budget schedules, cost behavior, performance measures, and planning tools.

Key 6.0.0 additions:

- [`DirectLaborBudgetPage.tsx`](/E:/AccCalc/accounting-companion/src/features/business/DirectLaborBudgetPage.tsx:1)
- [`FactoryOverheadBudgetPage.tsx`](/E:/AccCalc/accounting-companion/src/features/business/FactoryOverheadBudgetPage.tsx:1)
- [`BudgetedIncomeStatementPage.tsx`](/E:/AccCalc/accounting-companion/src/features/business/BudgetedIncomeStatementPage.tsx:1)

### `src/features/afar`

Contains AFAR and consolidation helpers.

Important pages:

- business combinations
- intercompany inventory profit
- foreign currency translation
- construction revenue
- equity method investment
- intercompany PPE transfer

New 6.0.0 AFAR pages:

- [`EquityMethodInvestmentPage.tsx`](/E:/AccCalc/accounting-companion/src/features/afar/EquityMethodInvestmentPage.tsx:1)
- [`IntercompanyPpeTransferPage.tsx`](/E:/AccCalc/accounting-companion/src/features/afar/IntercompanyPpeTransferPage.tsx:1)

### `src/features/smart`

This folder powers the prompt-to-tool routing layer.

Important files:

- [`smartSolver.engine.ts`](/E:/AccCalc/accounting-companion/src/features/smart/smartSolver.engine.ts:1)
  Field metadata, extraction aliases, calculator configs, and ranking logic.
- [`smartSolver.targets.ts`](/E:/AccCalc/accounting-companion/src/features/smart/smartSolver.targets.ts:1)
  Explicit solve-target mapping from natural-language prompts.
- [`smartSolver.connector.ts`](/E:/AccCalc/accounting-companion/src/features/smart/smartSolver.connector.ts:1)
  Connects solver output into calculator inputs.

### `src/features/scan-check`

This is the OCR-assisted review pipeline.

Important files:

- [`ocrRouting.ts`](/E:/AccCalc/accounting-companion/src/features/scan-check/services/ocr/ocrRouting.ts:1)
  Maps extracted wording to likely tools.
- `ocrEngine.ts`, `ocrParser.ts`, `ocrClassifier.ts`
  Process OCR text and document classification.

### `src/features/workpapers`

This folder contains the workbook system.

Important files:

- [`WorkpaperStudioPage.tsx`](/E:/AccCalc/accounting-companion/src/features/workpapers/WorkpaperStudioPage.tsx:1)
  Main spreadsheet-style route.
- [`workpaperTemplates.ts`](/E:/AccCalc/accounting-companion/src/features/workpapers/workpaperTemplates.ts:1)
  Starter templates aligned to calculators and study tasks.
- `workpaperFormula.ts`
  Spreadsheet formula evaluation.
- `workpaperUtils.ts`
  Cell helpers, workbook manipulation, styling, and range logic.

### `src/features/study`

Study Hub content and quiz flows live here.

Important files:

- [`studyContent.ts`](/E:/AccCalc/accounting-companion/src/features/study/studyContent.ts:1)
  Study topic types, category metadata, and topic-path helpers.
- [`studyExpansion450.ts`](/E:/AccCalc/accounting-companion/src/features/study/studyExpansion450.ts:1)
  Large curriculum topic bank with reviewer-style topic seeds.
- `StudyHubPage.tsx`, `StudyTopicPage.tsx`, `TopicQuizPage.tsx`
  Learning-center UI.

## Shared Formula and Math Systems

### `calculatorMath.ts`

This is the central computation file.

Role:

- Stores reusable calculation helpers across finance, FAR, cost, tax, AFAR, and operations
- Keeps page components lighter and more maintainable
- Makes regression testing easier because shared logic can be tested once and reused everywhere

6.0.0 additions include:

- direct labor budget math
- factory overhead budget math
- budgeted income statement math
- notes receivable discounting math
- equity method rollforward math
- intercompany PPE transfer math

### `formulaSolveDefinitions.ts`

This file defines how formula-based pages behave.

Each definition can include:

- fields
- targets
- input selection per target
- validation
- reverse solving
- result cards
- formulas
- worked steps
- interpretations
- assumptions and warnings

This is the main place to extend solve-for capability safely.

## Warnings, Assumptions, and Time-Sensitive Defaults

Time-sensitive tax defaults are now centralized in:

- [`src/utils/taxConfig.ts`](/E:/AccCalc/accounting-companion/src/utils/taxConfig.ts:1)

Purpose:

- make future tax maintenance easier
- prevent hidden rate assumptions
- let future developers update one file instead of hunting through many pages

## App Catalog, Search, and Discovery

### `appCatalog.ts`

This is the route metadata authority for:

- labels
- descriptions
- aliases
- keywords
- tags
- subject grouping
- “new” state
- offline support notes

When a route is not discoverable enough, this is one of the first files to inspect.

### `appSearch.ts`

Uses catalog metadata to produce searchable route results.

Trace for a new calculator:

1. Add the route in `App.tsx`
2. Add metadata in `appCatalog.ts`
3. Search now sees aliases and tags through the shared catalog

## Smart Solver Flow

User flow:

1. A user types a natural-language problem
2. `smartSolver.engine.ts` extracts visible values by alias patterns
3. The engine ranks calculator configs against the extracted facts and keywords
4. `smartSolver.targets.ts` optionally chooses a reverse-solve target
5. `smartSolver.connector.ts` sends the chosen values and target into a page like `FormulaSolveWorkspace`

Why this matters:

- It keeps routing improvements mostly data-driven
- It reduces page-specific wiring
- It makes subject expansion cheaper over time

## OCR Routing Flow

OCR flow:

1. `Scan & Check` captures or uploads an image
2. OCR services extract text
3. `ocrRouting.ts` scores likely destinations using route rules and bonuses
4. The app suggests tools that fit the scanned wording

6.0.0 added new OCR rule coverage for:

- direct labor budgets
- factory overhead budgets
- budgeted income statements
- note discounting
- equity method cases
- intercompany PPE transfer problems

## Workpaper System and Templates

The workpaper system is one of the product’s biggest differentiators.

Why it matters:

- turns one-off answers into assignment-ready support sheets
- gives students a place to document assumptions
- makes the app more useful for instructors and reviewers

6.0.0 template additions:

- direct labor budget
- factory overhead budget
- budgeted income statement
- note discounting
- equity method rollforward
- intercompany PPE transfer

## Offline, Update, and PWA Systems

Important shared files:

- [`src/service-worker.ts`](/E:/AccCalc/accounting-companion/src/service-worker.ts:1)
- [`src/utils/appUpdate.ts`](/E:/AccCalc/accounting-companion/src/utils/appUpdate.ts:1)
- [`src/utils/offlineStatus.ts`](/E:/AccCalc/accounting-companion/src/utils/offlineStatus.ts:1)
- [`src/features/layout/AppNotifications.tsx`](/E:/AccCalc/accounting-companion/src/features/layout/AppNotifications.tsx:1)

These files handle:

- caching and install behavior
- stale bundle/update prompts
- offline support messaging
- calmer runtime notifications

## Charts and Interpretation Layers

Important files:

- `src/utils/charts/*`
- `src/components/charts/*`
- page-level interpretation blocks on analysis-oriented pages

The app uses charts mainly to explain outputs, not just decorate pages.

## Test Structure

Primary regression file:

- [`tests/calculatorMath.test.ts`](/E:/AccCalc/accounting-companion/tests/calculatorMath.test.ts:1)

This file covers:

- shared math helpers
- workpaper formulas and utilities
- route search behavior
- solve-target behavior
- new 6.0.0 shared budgeting and AFAR helpers

## Data Flow: Route to Result

Typical trace:

1. Route is registered in `App.tsx`
2. Page component renders
3. User enters values into shared input components
4. Solve definition chooses inputs and target
5. `calculatorMath.ts` computes values
6. Result cards and explanation panels render
7. Formula study support links nearby study content
8. Search, Smart Solver, OCR, and workpapers point back to the same route

## Safe Extension Guidance

When adding or editing a calculator:

- reuse shared math where possible
- keep reverse-solve logic inside `formulaSolveDefinitions.ts`
- add route metadata and aliases immediately
- extend Smart Solver and OCR only as far as the topic deserves
- add workpaper support when the workflow naturally needs a schedule
- add or update regression tests before finishing

## Known Limitations

- Some chunks remain large after build, especially the main app shell, app catalog, and Workpaper Studio bundle
- Some advanced professional accounting scenarios remain intentionally simplified for student-safe use
- Tax pages use visible assumptions and editable defaults, but they still require human review when rules change
