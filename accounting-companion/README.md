# AccCalc

AccCalc is a browser-first accounting learning and productivity system for solving, checking, organizing, and reviewing accounting coursework in one place. Version `12.0.0` is the app-wide focus-first organization release: a major UI and information-hierarchy overhaul built to help students see the main task first and open supporting detail only when they need it.

## What 12.0.0 Changes

- Reorganized the shared calculator shell so inputs, solve targets, and primary results stay dominant while lower-priority guidance moves behind a page menu and collapsed learning surfaces.
- Rebuilt the homepage around a smaller set of next-step decisions: quick solve, quick scan, continue study, workpapers, and focused discovery.
- Added a shared dynamic page-menu pattern for secondary content such as orientation help, related study, nearby tools, assumptions, and route context.
- Reduced study-side clutter by moving module flow and lesson signals into lighter progressive-disclosure panels.
- Added a Workpaper Studio focus mode so workbook health, workbook context, and panel utilities can move out of the active editing path when students need a cleaner worksheet surface.
- Kept the broader curriculum and weak-track additions from `11.0.0` intact while making them easier to reach without flooding the first screen with choices.

## Focus-First Page Philosophy

Every major page now follows one principle:

- Important now = visible now
- Useful later = discoverable on demand

Practical rules for the app:

- calculator pages should show inputs and results first
- homepage should answer “what should I do next?”
- study pages should feel like reading flows, not dashboards
- workpapers should prioritize the active sheet over surrounding metadata
- secondary content should move into disclosures, page menus, or secondary rails

## Main Product Areas

- `Smart Tools`: Smart Solver, Scan & Check, OCR-assisted review, route discovery
- `Study Hub`: module browsing, lessons, quizzes, progress, resume behavior
- `Workpapers`: assignment-friendly templates, workbook editing, calculator-to-workpaper flows
- `FAR / AFAR`: statements, leases, foreign currency, partnerships, combinations, reporting support
- `Cost / Managerial / MS`: CVP, decision tools, budgets, costing, variances, planning, performance
- `Taxation`: VAT, withholding, percentage tax, estate, donor’s, DST, book-tax and compliance review support
- `Audit / AIS / Governance / RFBT / Strategic`: reviewer workspaces, lessons, and connected decision support tools

## Shared Page Organization System

Important shared files:

- `src/components/CalculatorPageLayout.tsx`
- `src/components/ContextualPageMenu.tsx`
- `src/components/DisclosurePanel.tsx`
- `src/components/PageHeader.tsx`
- `src/features/home/HomePage.tsx`
- `src/features/study/components/StudyLessonLayout.tsx`
- `src/features/workpapers/WorkpaperStudioPage.tsx`

The new organization model works like this:

- the main page body shows the core task
- explanation and related learning stay collapsed until requested
- page-level menus hold secondary route context and related follow-up links
- broader browsing is grouped behind disclosures instead of being dumped above the fold

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

`12.0.0` keeps the textbook/module direction but reduces side-rail noise so the current lesson stays primary.

## Smart Solver And OCR

The routing stack remains layered intentionally:

- `src/utils/appCatalog.ts` holds route metadata, aliases, curriculum groups, and route descriptions
- `src/utils/appSearch.ts` powers route discovery
- `src/features/smart/smartSolver.engine.ts` ranks routes from natural-language prompts
- `src/features/smart/smartSolver.targets.ts` handles solve-target hints
- `src/features/scan-check/services/ocr/ocrRouting.ts` recommends routes from OCR text
- `src/utils/numberParsing.ts` normalizes grouped numbers, percents, and parenthesized negatives safely

The focus-first release does not hide those tools. It makes their entry points easier to find without turning the homepage or calculator headers into feature walls.

## Workpaper Studio

Workpaper Studio continues to be a browser-based coursework engine, not a desktop spreadsheet replacement.

Important files:

- `src/features/workpapers/WorkpaperStudioPage.tsx`
- `src/features/workpapers/workpaperTemplates.ts`
- `src/features/workpapers/workpaperStore.ts`
- `src/features/workpapers/workpaperUtils.ts`
- `src/features/workpapers/workpaperFormula.ts`
- `src/features/workpapers/workpaperFile.ts`

`12.0.0` adds:

- a focus mode for cleaner worksheet editing
- less always-visible workbook support chrome
- cleaner separation between sheet work and optional utility panels
- preserved template, transfer, and detail flows without forcing them into the main editing path

## Theme And Personalization

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

The app keeps the richer preview cards introduced earlier while making page hierarchy calmer and more consistent across themes.

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
    components/               Shared UI blocks, page shells, and organization patterns
    features/                 Route-level product areas
      accounting/
      afar/
      ais/
      audit/
      business/
      far/
      governance/
      home/
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
  tests/                      Shared math, discovery, workpaper, and regression coverage
  docs/                       Release notes, system overview, maintenance notes, HTML/PDF handoff docs
```

## How To Add A New Page Without Reintroducing Clutter

1. Add the route page under `src/features/...`.
2. Register the route in `src/App.tsx`.
3. Add route metadata in `src/utils/appCatalog.ts`.
4. Use shared shells such as `CalculatorPageLayout` or the Study Hub lesson layout instead of inventing a new page structure.
5. Keep the page’s main task above the fold.
6. Move secondary notes, related tools, assumptions, and deep references into disclosures or the page menu when they are not critical to the first task.
7. Add Smart Solver support in `src/features/smart/smartSolver.engine.ts` when the route should be reachable by prompt.
8. Add OCR routing support in `src/features/scan-check/services/ocr/ocrRouting.ts` when the route should be scanner-discoverable.
9. Add Study Hub support when the route belongs to a real curriculum family.
10. Add a workpaper template when the route benefits from a worksheet.
11. Add regression coverage in `tests/calculatorMath.test.ts` when shared logic changes.

## Reliability Rules For Future Maintainers

- Keep assumptions explicit.
- Keep formulas, results, and interpretation synchronized.
- Prefer shared helpers over duplicated page logic.
- Keep secondary content discoverable, not dominant.
- Treat OCR and Smart Solver as review assistants, not infallible automation.
- Prefer calm hierarchy and stable workflows over flashy page density.

## Validation Status For 12.0.0

The final `12.0.0` release is validated with:

```bash
npm test
npm run build
npm run dev
```

The dev check should remain a bounded probe so no long-running local server is left hanging in the terminal.
