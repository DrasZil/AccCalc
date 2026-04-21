# AccCalc

AccCalc is a production-minded accounting companion for students, reviewees, instructors, and future maintainers who need a broad and dependable workspace for solving, checking, studying, and documenting accounting problems.

Version: `7.0.0`  
Release date: `2026-04-21`

## What Changed In 7.0.0

AccCalc `7.0.0` is a deeper academic-expansion release built on top of the earlier `6.0.0` breadth pass. This update focuses especially on managerial accounting, management services, and operations support while also improving search performance, discovery, workpaper continuity, and release survivability.

Major additions in this release:

- `Special Order Analysis`
- `Make-or-Buy Analysis`
- `Sell-or-Process-Further`
- `Constrained Resource Product Mix`
- `Budget Variance Analysis`
- `Moving Average Forecast`

The release also broadens:

- relevant-cost decision support
- bottleneck and contribution-margin analysis
- performance-reporting and budget-variance interpretation
- operations forecasting discovery and workpaper support
- Smart Solver, OCR, Study Hub, and related-route continuity
- route-search performance for the larger app catalog

## Who The App Is For

- Accounting students working across FAR, AFAR, cost and managerial, audit, tax, AIS, RFBT, and operations-adjacent courses
- Reviewees preparing for board-style mixed-topic problems
- Instructors who want fast classroom support tools and reusable schedules
- Future developers who may need to maintain or extend the app with limited context later

## Core Product Areas

- `FAR`: cash control, receivables, inventory, PPE, impairment, leases, share-based payments, equity, and statements
- `AFAR`: business combinations, NCI-oriented support, equity method, intercompany inventory/PPE, foreign currency, and construction revenue
- `Cost / Managerial / Management Services`: CVP, budgeting, job order costing, variances, relevant costing, bottleneck analysis, and performance reporting
- `Taxation`: VAT, withholding tax, book-tax difference support, compliance review, and centralized assumptions
- `Audit / Assurance`: planning, cycles, completion, opinions, and audit-review workspaces
- `AIS / Governance / Internal Control`: IT controls, lifecycle and recovery, control matrices, and governance-linked reviewer support
- `RFBT / Strategic / Integrative`: business law review, integrative case mapping, and strategic analysis support
- `Operations / Supply Chain`: EOQ, reorder point, forecasting, capacity, and operations-linked study flows
- `Workpapers`: spreadsheet-style workbook support with reusable templates and import-export tools
- `Study Hub`: progressive-disclosure lessons, quizzes, and calculator-linked review paths

## Key Features

- Curriculum-organized route metadata in [src/utils/appCatalog.ts](/E:/AccCalc/accounting-companion/src/utils/appCatalog.ts:1)
- Shared calculation helpers in [src/utils/calculatorMath.ts](/E:/AccCalc/accounting-companion/src/utils/calculatorMath.ts:1)
- Reusable solve-for-target logic in [src/utils/formulaSolveDefinitions.ts](/E:/AccCalc/accounting-companion/src/utils/formulaSolveDefinitions.ts:1)
- Linked learning support in [src/utils/formulaStudyContent.tsx](/E:/AccCalc/accounting-companion/src/utils/formulaStudyContent.tsx:1)
- Smart Solver extraction and route matching in [src/features/smart/smartSolver.engine.ts](/E:/AccCalc/accounting-companion/src/features/smart/smartSolver.engine.ts:1)
- OCR route suggestion logic in [src/features/scan-check/services/ocr/ocrRouting.ts](/E:/AccCalc/accounting-companion/src/features/scan-check/services/ocr/ocrRouting.ts:1)
- Template-driven workbook support in [src/features/workpapers/workpaperTemplates.ts](/E:/AccCalc/accounting-companion/src/features/workpapers/workpaperTemplates.ts:1)
- Release/version metadata in [src/utils/appRelease.ts](/E:/AccCalc/accounting-companion/src/utils/appRelease.ts:1)

## Screenshots / Placeholders

Suggested screenshot set for future asset capture:

1. Home page with curriculum-aligned tracks
2. Smart Solver prompt routing
3. Workpaper Studio with a budgeting or decision-analysis template open
4. A FormulaSolveWorkspace page in reverse-solve mode
5. A Study Hub lesson with progressive disclosure expanded
6. Scan & Check with OCR review and route suggestions

The repository does not currently store a maintained screenshot set, so this section is intentionally ready for future image drops.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- KaTeX and MathJax-backed formula rendering support
- Tesseract.js for OCR
- Workbox for service worker and offline behavior
- XLSX for workbook import and export

## Install

```bash
npm install
```

## Development Commands

```bash
npm run dev
npm test
npm run build
npm run preview
```

## Project Structure

```text
accounting-companion/
|-- public/                        Static assets, manifest, and install surfaces
|-- src/
|   |-- components/                Shared UI primitives and calculator shells
|   |-- features/
|   |   |-- accounting/            Foundational accounting and FAR-oriented tools
|   |   |-- afar/                  AFAR and consolidation-oriented tools
|   |   |-- audit/                 Audit and assurance workspaces
|   |   |-- business/              Cost, budgeting, relevant costing, and management tools
|   |   |-- operations/            Forecasting and operations support pages
|   |   |-- scan-check/            OCR review pipeline
|   |   |-- smart/                 Natural-language solver analysis and routing
|   |   |-- study/                 Lessons, quizzes, study maps, and learning support
|   |   '-- workpapers/            Workbook model, templates, and studio page
|   |-- utils/                     Shared math, metadata, release, offline, and study helpers
|   '-- App.tsx                    Route registration and lazy loading
|-- tests/                         Shared regression coverage
|-- docs/                          Release notes, architecture docs, and generated handoff docs
 '-- README.md
```

## How Calculators Are Organized

- Routes are lazy-registered in [src/App.tsx](/E:/AccCalc/accounting-companion/src/App.tsx:1)
- Route metadata, aliases, tags, and curriculum grouping live in [src/utils/appCatalog.ts](/E:/AccCalc/accounting-companion/src/utils/appCatalog.ts:1)
- Many calculators are thin wrappers around [src/components/FormulaSolveWorkspace.tsx](/E:/AccCalc/accounting-companion/src/components/FormulaSolveWorkspace.tsx:1)
- Shared computations live in [src/utils/calculatorMath.ts](/E:/AccCalc/accounting-companion/src/utils/calculatorMath.ts:1)
- Shared solve-target behavior and explanations live in [src/utils/formulaSolveDefinitions.ts](/E:/AccCalc/accounting-companion/src/utils/formulaSolveDefinitions.ts:1)

## How Shared Formula Logic Works

High-level flow:

1. A route renders a page component, often a thin wrapper around `FormulaSolveWorkspace`
2. The page provides a solve definition from `formulaSolveDefinitions.ts`
3. `FormulaSolveWorkspace` renders target-specific inputs and result sections
4. The solve definition calls shared helpers in `calculatorMath.ts`
5. The page returns formatted result cards, steps, interpretation, assumptions, warnings, and linked study support

This lets AccCalc broaden reverse-solve coverage without duplicating algebra, result formatting, or learning logic in every page component.

## How Smart Solver, OCR, Workpapers, and Study Content Connect

- `Smart Solver` ranks likely calculators from natural-language prompts
- `OCR routing` reads extracted text and maps worksheet or problem wording to likely routes
- `appCatalog.ts` keeps aliases, tags, and descriptions consistent across search, routing, and discovery
- `formulaStudyContent.tsx` and the Study Hub topic bank connect calculators back into reviewer-style learning paths
- `workpaperTemplates.ts` provides assignment-ready support sheets aligned to calculators and workflow families
- Homepage collections surface related calculators as guided families instead of isolated links

## How To Add a New Calculator

1. Add or extend the shared helper in [src/utils/calculatorMath.ts](/E:/AccCalc/accounting-companion/src/utils/calculatorMath.ts:1)
2. Add a solve definition in [src/utils/formulaSolveDefinitions.ts](/E:/AccCalc/accounting-companion/src/utils/formulaSolveDefinitions.ts:1) if the calculator fits the shared workspace pattern
3. Add study support in [src/utils/formulaStudyContent.tsx](/E:/AccCalc/accounting-companion/src/utils/formulaStudyContent.tsx:1)
4. Create the route page in the appropriate `src/features/*` folder
5. Register the lazy route in [src/App.tsx](/E:/AccCalc/accounting-companion/src/App.tsx:1)
6. Add aliases, keywords, tags, category links, and descriptions in [src/utils/appCatalog.ts](/E:/AccCalc/accounting-companion/src/utils/appCatalog.ts:1)
7. Add Smart Solver support in [src/features/smart/smartSolver.engine.ts](/E:/AccCalc/accounting-companion/src/features/smart/smartSolver.engine.ts:1)
8. Add solve-target hints in [src/features/smart/smartSolver.targets.ts](/E:/AccCalc/accounting-companion/src/features/smart/smartSolver.targets.ts:1) when reverse-solving matters
9. Add OCR wording in [src/features/scan-check/services/ocr/ocrRouting.ts](/E:/AccCalc/accounting-companion/src/features/scan-check/services/ocr/ocrRouting.ts:1) when scanned prompts are likely
10. Add workpaper support in [src/features/workpapers/workpaperTemplates.ts](/E:/AccCalc/accounting-companion/src/features/workpapers/workpaperTemplates.ts:1) when a schedule or worksheet adds real value
11. Add regression coverage in [tests/calculatorMath.test.ts](/E:/AccCalc/accounting-companion/tests/calculatorMath.test.ts:1)

## How To Update Formula Logic Safely

- Prefer editing shared helpers before page-level code
- Keep formula text, steps, interpretation, and assumptions aligned with the actual computation
- Add reverse-solve targets only when the algebra is valid and the result is not misleading
- Surface assumption notes when tax, rates, or costing logic depends on time-sensitive or classroom-specific rules
- Extend tests whenever shared math, route search, or solve-target behavior changes

## How To Update Study Content

- Add or extend topic-bank coverage in [src/features/study/studyExpansion450.ts](/E:/AccCalc/accounting-companion/src/features/study/studyExpansion450.ts:1)
- Add calculator-linked support in [src/utils/formulaStudyContent.tsx](/E:/AccCalc/accounting-companion/src/utils/formulaStudyContent.tsx:1)
- Keep related calculators and study-next flows current so the learning graph remains navigable

## Troubleshooting

- `npm test` fails:
  Check shared helper changes in `calculatorMath.ts`, route-search expectations, or solve-definition outputs.
- `npm run build` fails:
  Check route imports in `App.tsx`, metadata additions in `appCatalog.ts`, and type coverage in Smart Solver field maps.
- Search cannot find a new page:
  Add aliases, tags, and keywords in `appCatalog.ts`.
- Smart Solver misses a route:
  Add field metadata, calculator config, extraction aliases, and solve-target rules in the `smart` feature.
- OCR suggests the wrong page:
  Expand `ocrRouting.ts` with stronger wording, patterns, and route bonuses.
- Tax assumptions need updating:
  Edit [src/utils/taxConfig.ts](/E:/AccCalc/accounting-companion/src/utils/taxConfig.ts:1) so the defaults and notes remain centralized.

## Documentation Set

- [7.0.0 release notes](/E:/AccCalc/accounting-companion/docs/release-7.0.0.md:1)
- [7.0.0 system overview](/E:/AccCalc/accounting-companion/docs/system-overview-v7.0.0.md:1)
- [7.0.0 maintenance playbook](/E:/AccCalc/accounting-companion/docs/maintenance-playbook-v7.0.0.md:1)
- [7.0.0 printable HTML documentation](/E:/AccCalc/accounting-companion/docs/AccCalc-v7.0.0-Documentation.html:1)
- PDF package: `docs/AccCalc-v7.0.0-Documentation.pdf`

## Contribution and Handoff Notes

- Prefer broad, coherent improvements over scattered one-off additions
- Keep route metadata, Smart Solver, OCR, workpapers, and study support aligned when adding features
- Preserve mobile readability and Workpaper Studio stability
- Keep tax assumptions centralized and visible
- Favor explainable improvements over risky rewrites
- When future context is low, start with the docs in `docs/`, then trace the route through `App.tsx` -> page -> shared math -> study support -> tests
