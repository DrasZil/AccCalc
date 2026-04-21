# AccCalc

AccCalc is a production-minded accounting companion built for accounting students, reviewees, instructors, and future maintainers who need a broad, dependable workspace for solving, checking, studying, and documenting accounting problems.

Version: `6.0.0`  
Release date: `2026-04-21`

## What AccCalc Is For

AccCalc is designed for people who need more than a single calculator:

- Students working through FAR, AFAR, cost and managerial, tax, audit, operations, and related coursework
- Reviewees preparing for board-style mixed-topic problems
- Instructors who want quick classroom support tools and structured workpapers
- Future developers who may need to extend the app with limited context months later

The app combines:

- Formula-based calculators and workspaces
- Smart Solver routing for natural-language prompts
- OCR-assisted Scan & Check review
- Study Hub lessons and quizzes
- Workpaper Studio for reusable assignment support sheets
- PWA/offline support for static hosting and installable use

## 6.0.0 Highlights

- Expanded master-budget coverage with `Direct Labor Budget`, `Factory Overhead Budget`, and `Budgeted Income Statement`
- Added FAR receivables depth with `Notes Receivable Discounting`
- Added AFAR depth with `Equity Method Investment` and `Intercompany PPE Transfer`
- Centralized time-sensitive Philippine tax assumptions in [`src/utils/taxConfig.ts`](/E:/AccCalc/accounting-companion/src/utils/taxConfig.ts:1)
- Added new workpaper templates aligned to the new budgeting, FAR, and AFAR tools
- Expanded study content, Smart Solver targets, OCR routing, and route aliases for the new breadth
- Replaced the starter template README with handoff-friendly project documentation

## Major Coverage Areas

- `FAR`: receivables, cash control, inventory, depreciation, bonds, statements, equity rollforwards
- `AFAR`: business combinations, intercompany inventory profit, intercompany PPE transfers, equity method, foreign currency, construction revenue
- `Cost & Managerial`: CVP, budgeting, process costing, variances, job order costing, planning and performance tools
- `Taxation`: VAT, percentage tax, withholding tax, book-tax differences, compliance review
- `Audit & Assurance`: planning, cycles, completion, opinions
- `Operations / Supply Chain`: EOQ, reorder point, forecasting-oriented support
- `Study Hub`: curriculum-linked lessons, quizzes, related calculators, review sequencing
- `Workpapers`: template-driven spreadsheet-style support for assignments and reviewer workflows

## Key Product Features

- Curriculum-organized navigation through [`src/utils/appCatalog.ts`](/E:/AccCalc/accounting-companion/src/utils/appCatalog.ts:1)
- Shared calculator math in [`src/utils/calculatorMath.ts`](/E:/AccCalc/accounting-companion/src/utils/calculatorMath.ts:1)
- Shared solve-for-any-reasonable-unknown definitions in [`src/utils/formulaSolveDefinitions.ts`](/E:/AccCalc/accounting-companion/src/utils/formulaSolveDefinitions.ts:1)
- Contextual learning panels in [`src/utils/formulaStudyContent.tsx`](/E:/AccCalc/accounting-companion/src/utils/formulaStudyContent.tsx:1)
- Smart Solver matching and extraction in [`src/features/smart/smartSolver.engine.ts`](/E:/AccCalc/accounting-companion/src/features/smart/smartSolver.engine.ts:1)
- OCR route suggestions in [`src/features/scan-check/services/ocr/ocrRouting.ts`](/E:/AccCalc/accounting-companion/src/features/scan-check/services/ocr/ocrRouting.ts:1)
- Workpaper templates in [`src/features/workpapers/workpaperTemplates.ts`](/E:/AccCalc/accounting-companion/src/features/workpapers/workpaperTemplates.ts:1)

## Screenshots / Visual Placeholders

Suggested screenshot set for future polish:

1. Home page with curriculum-aligned tracks
2. Smart Solver prompt routing
3. Workpaper Studio with a budgeting template loaded
4. A FormulaSolveWorkspace page in solve-for mode
5. Study Hub lesson page with progressive disclosure open
6. Scan & Check OCR review surface

The repository does not currently store a maintained screenshot set, so this section is intentionally ready for later asset drops.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- KaTeX / MathJax support for formula rendering
- Tesseract.js for OCR
- Workbox for service worker and offline behavior
- XLSX for spreadsheet import/export

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
├─ public/                       Static assets and manifest-facing files
├─ src/
│  ├─ components/                Shared UI primitives and calculator shells
│  ├─ features/
│  │  ├─ accounting/             FAR and foundational accounting pages
│  │  ├─ afar/                   AFAR and consolidation pages
│  │  ├─ audit/                  Audit review workspaces
│  │  ├─ business/               Managerial and budgeting pages
│  │  ├─ scan-check/             OCR review pipeline
│  │  ├─ smart/                  Smart Solver analysis and matching
│  │  ├─ study/                  Study Hub lessons, quizzes, and topic maps
│  │  └─ workpapers/             Workbook model, templates, and studio page
│  ├─ utils/                     Shared math, catalog, release, offline, and study helpers
│  └─ App.tsx                    Route registration and lazy loading
├─ tests/                        Shared regression coverage
└─ docs/                         Release docs, architecture docs, and PDF package
```

## How Calculators Are Organized

- Page routes are lazy-registered in [`src/App.tsx`](/E:/AccCalc/accounting-companion/src/App.tsx:1)
- Route metadata, aliases, tags, and curriculum grouping live in [`src/utils/appCatalog.ts`](/E:/AccCalc/accounting-companion/src/utils/appCatalog.ts:1)
- Many calculators use [`src/components/FormulaSolveWorkspace.tsx`](/E:/AccCalc/accounting-companion/src/components/FormulaSolveWorkspace.tsx:1)
- Shared math lives in [`src/utils/calculatorMath.ts`](/E:/AccCalc/accounting-companion/src/utils/calculatorMath.ts:1)
- Shared solve behavior and explanation output live in [`src/utils/formulaSolveDefinitions.ts`](/E:/AccCalc/accounting-companion/src/utils/formulaSolveDefinitions.ts:1)

## How Shared Formula Logic Works

High-level flow:

1. A route renders a page component, often a thin wrapper around `FormulaSolveWorkspace`
2. The page passes a solve definition from `formulaSolveDefinitions.ts`
3. `FormulaSolveWorkspace` renders the correct inputs for the selected target
4. The solve definition calls shared helpers from `calculatorMath.ts`
5. The page renders structured result cards, steps, assumptions, warnings, and linked study support

This design keeps reverse-solve logic, interpretation, and validation in one reusable system instead of page-specific duplication.

## How Smart Solver, OCR, and Workpapers Connect

- `Smart Solver` reads typed natural-language prompts and ranks likely calculators
- `Scan & Check` extracts OCR text, classifies the page/problem type, and suggests routes
- `appCatalog.ts` keeps aliases and descriptions consistent across search and navigation
- `workpaperTemplates.ts` gives assignment-ready support sheets that align with calculator workflows
- Many workflows can move from calculator output into Workpaper Studio through shared workbook systems

## How To Add a New Calculator

1. Add the math helper to [`src/utils/calculatorMath.ts`](/E:/AccCalc/accounting-companion/src/utils/calculatorMath.ts:1)
2. Add a solve definition to [`src/utils/formulaSolveDefinitions.ts`](/E:/AccCalc/accounting-companion/src/utils/formulaSolveDefinitions.ts:1) if the calculator fits the shared solve workspace
3. Add study support to [`src/utils/formulaStudyContent.tsx`](/E:/AccCalc/accounting-companion/src/utils/formulaStudyContent.tsx:1) when the calculator deserves a learning panel
4. Create the page in the appropriate `src/features/*` folder
5. Register the lazy route in [`src/App.tsx`](/E:/AccCalc/accounting-companion/src/App.tsx:1)
6. Add route metadata, aliases, keywords, and grouping in [`src/utils/appCatalog.ts`](/E:/AccCalc/accounting-companion/src/utils/appCatalog.ts:1)
7. Add Smart Solver config in [`src/features/smart/smartSolver.engine.ts`](/E:/AccCalc/accounting-companion/src/features/smart/smartSolver.engine.ts:1)
8. Add solve-target hints in [`src/features/smart/smartSolver.targets.ts`](/E:/AccCalc/accounting-companion/src/features/smart/smartSolver.targets.ts:1) if reverse solving matters
9. Add OCR routing rules in [`src/features/scan-check/services/ocr/ocrRouting.ts`](/E:/AccCalc/accounting-companion/src/features/scan-check/services/ocr/ocrRouting.ts:1) when the topic is likely to appear in scanned prompts
10. Add tests in [`tests/calculatorMath.test.ts`](/E:/AccCalc/accounting-companion/tests/calculatorMath.test.ts:1)

## How To Update Formula Logic

- Prefer editing shared helpers before page code
- Keep validation close to the solve definition when the rule is page-specific
- Keep formula text, steps, interpretation, assumptions, and warnings aligned with the actual computation
- Expand reverse-solve targets only when the algebra is safe and not misleading

## How To Update Study Content

- Add or extend study topics in [`src/features/study/studyExpansion450.ts`](/E:/AccCalc/accounting-companion/src/features/study/studyExpansion450.ts:1)
- Add calculator-linked support in [`src/utils/formulaStudyContent.tsx`](/E:/AccCalc/accounting-companion/src/utils/formulaStudyContent.tsx:1)
- Keep related calculator paths and topic links current so the learning graph remains navigable

## Troubleshooting

- `npm test` fails:
  Check shared helper changes in `calculatorMath.ts`, route-search expectations, or solve-definition outputs.
- `npm run build` fails:
  Check route imports in `App.tsx`, metadata additions in `appCatalog.ts`, and type coverage in Smart Solver field maps.
- A calculator cannot be found by search:
  Add aliases, keywords, and tags in `appCatalog.ts`.
- Smart Solver misses a new route:
  Add field metadata, calculator config, extraction aliases, and solve-target rules in the `smart` feature.
- OCR suggests the wrong page:
  Expand `ocrRouting.ts` with better patterns, bonuses, and route wording.
- Tax assumptions need updating:
  Edit [`src/utils/taxConfig.ts`](/E:/AccCalc/accounting-companion/src/utils/taxConfig.ts:1) so the defaults and notes stay centralized.

## Documentation Set

- [6.0.0 release notes](/E:/AccCalc/accounting-companion/docs/release-6.0.0.md:1)
- [System overview](/E:/AccCalc/accounting-companion/docs/system-overview-v6.0.0.md:1)
- [Maintenance playbook](/E:/AccCalc/accounting-companion/docs/maintenance-playbook-v6.0.0.md:1)
- [Printable HTML documentation](/E:/AccCalc/accounting-companion/docs/AccCalc-v6.0.0-Documentation.html:1)
- PDF package: `docs/AccCalc-v6.0.0-Documentation.pdf`

## Contribution and Handoff Notes

- Prefer broad, coherent improvements over scattered single-use patches
- Avoid risky rewrites when shared abstractions can absorb new behavior safely
- Keep tax assumptions centralized and visible
- Preserve mobile usability and Workpaper Studio stability
- Extend tests whenever shared math, routing, or solve-target behavior changes
- When future maintenance context is low, start with the docs in `docs/` and then trace the route through `App.tsx` -> page -> shared math -> study support -> tests
