# AccCalc

AccCalc is a browser-first accounting learning and productivity system for solving, checking, organizing, and reviewing accounting coursework in one place. Version `11.0.0` is the strongest platform-level update so far: a major shell, navigation, Study Hub, weak-track completion, and Workpaper upgrade built to make the app feel more structured, more premium, and easier to trust under pressure.

## What 11.0.0 Changes

- Added a stronger shell and homepage structure with route-surface context, curriculum track snapshots, and clearer “you may also need” guidance.
- Upgraded Study Hub browsing so lessons feel more like a connected module system and less like a flat catalog.
- Added new integrated tools for weak tracks:
  - `AIS`: Business Continuity Planner
  - `Governance`: Control Environment Review
  - `RFBT`: Defective Contracts Classifier
  - `Strategic`: Business Case Analysis Planner
- Added matching Study Hub lessons, Smart Solver mappings, OCR routing rules, app-catalog entries, and workpaper templates for those new tracks.
- Upgraded Workpaper Studio with a workbook-context panel so active sheet status, template source, related routes, and next steps stay visible while editing.
- Improved theme personalization with richer preview cards in settings while keeping persistence and contrast safety intact.
- Expanded shared governance, continuity, and strategic decision helpers with regression coverage.

## Main Product Areas

- `Smart Tools`: Smart Solver, Scan & Check, OCR-assisted review, route discovery
- `Study Hub`: module browsing, lessons, quizzes, related-topic continuity, resume/progress behavior
- `Workpapers`: assignment-friendly templates, workbook editing, calculator-to-workpaper support
- `FAR / AFAR`: statements, assets, equity, leases, share-based payments, combinations, foreign currency, partnerships, branch and special topics
- `Cost / Managerial / MS`: CVP, decision tools, budgets, process costing, variances, planning, performance
- `Taxation`: VAT, withholding, percentage tax, estate, donor’s, DST, book-tax and compliance review support
- `Audit / AIS / Governance / RFBT / Strategic`: reviewer workspaces, lessons, and connected support tools

## New Completion Track Support In 11.0.0

The release focuses on tracks that were still relatively fragmented:

- `AIS / IT Controls`
  - continuity and recovery planning
  - IT control matrix support
  - access-control and systems-control routes
- `Governance / Ethics / Risk`
  - control-environment scoring and interpretation
  - risk-control-matrix review
  - ethics decision framing
- `RFBT / Business Law`
  - defective-contract classification
  - obligations and contracts issue flow
  - broader business-law and commercial-transactions review
- `Strategic / Integrative`
  - business-case recommendation planning
  - strategic business analysis
  - balanced scorecard and integrative routing support

## Shell And Navigation Design

The app is broad enough that organization matters as much as feature count.

`11.0.0` improves app-wide information architecture through:

- shell-level route context rails
- curriculum-track snapshots
- route-surface labeling such as calculator, study module, analyzer, or workspace
- stronger sibling-route suggestions
- clearer lesson-to-calculator continuity
- stronger grouped discovery from the homepage and Study Hub

The goal is to make AccCalc feel like a coherent academic product rather than a growing list of pages.

## Study Hub Architecture

Study Hub uses:

- `src/features/study/StudyHubPage.tsx` for curriculum browsing and progress-aware discovery
- `src/features/study/StudyTopicPage.tsx` for lesson rendering
- `src/features/study/components/StudyLessonLayout.tsx` for textbook-style reading layout
- `src/features/study/studyContent.ts`
- `src/features/study/studyExpansion450.ts`
- `src/features/study/studyExpansion1100.ts`

Lessons support:

- breadcrumbs and hierarchy
- progress and return/resume continuity
- related calculators
- related lessons
- worked examples
- recap / common mistake blocks
- quiz handoff

## Smart Solver And OCR

The routing stack is layered intentionally:

- `src/utils/appCatalog.ts` holds route metadata, aliases, curriculum groups, and route descriptions
- `src/utils/appSearch.ts` powers route discovery
- `src/features/smart/smartSolver.engine.ts` ranks routes from natural-language prompts
- `src/features/smart/smartSolver.targets.ts` handles solve-target hints
- `src/features/scan-check/services/ocr/ocrRouting.ts` recommends routes from OCR text
- `src/utils/numberParsing.ts` normalizes grouped numbers, percents, and parenthesized negatives safely

`11.0.0` extends Solver/OCR coverage for continuity, control-environment, defective-contract, and business-case prompts so those newer tracks are reachable through advanced word-problem flows instead of being hidden catalog pages.

The system still prefers review-before-trust behavior when confidence is weak.

## Workpaper Studio

Workpaper Studio continues to be a browser-based coursework engine, not a desktop spreadsheet replacement.

Important files:

- `src/features/workpapers/WorkpaperStudioPage.tsx`
- `src/features/workpapers/workpaperTemplates.ts`
- `src/features/workpapers/workpaperStore.ts`
- `src/features/workpapers/workpaperUtils.ts`
- `src/features/workpapers/workpaperFormula.ts`
- `src/features/workpapers/workpaperFile.ts`

`11.0.0` strengthens Workpaper Studio by:

- surfacing workbook context more clearly while editing
- keeping template-to-route connections more visible
- improving next-step discovery from active workbooks
- preserving the narrow-screen hardening from earlier survivability passes

## Theme And Personalization System

Theme state is stored through:

- `src/utils/appSettings.ts`
- `src/utils/themePreferences.ts`

Supported families remain:

- `classic`
- `ocean`
- `slate`
- `rose`
- `blossom`
- `lavender`
- `sunset`
- `emerald`

`11.0.0` improves the settings experience with richer showcase previews while keeping persistence, readability, and contrast behavior stable.

## Running The App

```bash
npm install
npm run dev
```

## Common Development Commands

```bash
npm run dev
npm test
npm run build
npm run lint
```

## Project Structure

```text
accounting-companion/
  src/
    components/               Shared UI blocks and reading surfaces
    features/                 Route-level product areas
      accounting/
      afar/
      ais/
      audit/
      business/
      far/
      governance/
      layout/
      meta/
      operations/
      rfbt/
      scan-check/
      smart/
      strategic/
      study/
      tax/
      workpapers/
    utils/                    Shared math, release data, search, parsing, settings, and assumptions
  tests/                      Shared math, route discovery, workpaper, and regression coverage
  docs/                       Release notes, system overview, maintenance notes, HTML/PDF handoff docs
```

## How To Add A New Calculator Or Workspace

1. Add the route page under `src/features/...`.
2. Put reusable math in `src/utils/calculatorMath.ts` when the logic belongs in shared helpers.
3. Add or update solve-for logic in `src/utils/formulaSolveDefinitions.ts` only when reverse solving is mathematically safe.
4. Register the route in `src/App.tsx`.
5. Add route metadata in `src/utils/appCatalog.ts`.
6. Add Smart Solver support in `src/features/smart/smartSolver.engine.ts`.
7. Add OCR routing support in `src/features/scan-check/services/ocr/ocrRouting.ts` when the topic should be scanner-discoverable.
8. Add Study Hub support in `studyContent.ts`, `studyExpansion450.ts`, or `studyExpansion1100.ts`.
9. Add a workpaper template in `src/features/workpapers/workpaperTemplates.ts` if the route benefits from a worksheet.
10. Add regression coverage in `tests/calculatorMath.test.ts`.

## Reliability Rules For Future Maintainers

- Keep assumptions explicit.
- Keep formulas, results, and interpretation text synchronized.
- Prefer shared helpers over duplicated page logic.
- Add discovery wiring for any meaningful new route.
- Treat OCR and Smart Solver as review assistants, not infallible automation.
- Prefer safe route additions and shell consistency over flashy isolated features.

## Validation Status For 11.0.0

The final `11.0.0` release is validated with:

```bash
npm test
npm run build
npm run dev
```

The dev check should remain a bounded probe so no long-running local server is left hanging in the terminal.
