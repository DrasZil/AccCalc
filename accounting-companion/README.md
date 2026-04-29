# AccCalc

AccCalc is a browser-first accounting learning and productivity system for solving, checking, organizing, and reviewing accounting coursework in one place. Version `13.0.0` is a major academic expansion release focused on calculators, reviewer material, quizzes, and study-to-solve integration across the accounting curriculum.

## What 13.0.0 Changes

- adds FAR conceptual-framework recognition and revenue-allocation workspaces
- adds an income-tax taxable-income bridge with permanent, temporary, current-tax, and deferred-tax signals
- adds an audit evidence-program builder for assertion risk, reliability, relevance, coverage, and contradiction pressure
- adds a strategic cost-management target-costing workspace for allowable cost and cost-gap analysis
- adds original Study Hub lessons and quizzes for the new FAR, tax, audit, strategic, and integrated CPA-review tracks
- wires the new academic routes into app search, Smart Solver, OCR routing, related panels, category hubs, and a v13 workpaper template
- keeps the book-inspired expansion original: visible book/photo subject areas guide priorities, but no book text is copied

## Academic Expansion Tracks

Important files:

- `src/features/far/ConceptualFrameworkRecognitionPage.tsx`
- `src/features/far/RevenueAllocationWorkspacePage.tsx`
- `src/features/tax/TaxableIncomeBridgePage.tsx`
- `src/features/audit/AuditEvidenceProgramPage.tsx`
- `src/features/strategic/TargetCostingWorkspacePage.tsx`
- `src/features/study/studyExpansion1300.ts`
- `src/utils/appCatalog.ts`
- `src/features/smart/smartSolver.engine.ts`
- `src/features/scan-check/services/ocr/ocrRouting.ts`

Coverage priorities in `13.0.0`:

- Intermediate Accounting / FAR: conceptual framework, recognition, revenue allocation, contract balances, measurement routing
- Taxation: income-tax bridge from accounting income to taxable income, plus current and deferred tax signals
- Auditing: evidence sufficiency, procedure design, assertion risk, and contradictory evidence follow-up
- Strategic Cost Management: target costing, allowable cost, kaizen-style savings, and cost-gap interpretation
- CPA-review integration: practical financial accounting cases that map FAR, tax, audit, and strategic routes before solving

## Theme System

Important files:

- `src/utils/themePreferences.ts`
- `src/utils/appSettings.ts`
- `src/features/meta/SettingsContent.tsx`
- `src/main.tsx`
- `src/index.css`

Theme-system rules remain:

- Classic remains the safe default.
- Familiar and palette-led families stay available.
- Every family works in light, dark, and system mode.
- Theme state applies before React mounts to reduce flicker.

## Appearance Settings Direction

Important files:

- `src/features/meta/SettingsContent.tsx`
- `src/features/meta/SettingsDrawer.tsx`
- `src/features/meta/SettingsPage.tsx`

Appearance now follows one rule:

- essential controls visible first
- richer browsing discoverable on demand

Practical application:

- current mode and family are visible in one compact summary card
- quick family switching happens from a smaller swatch strip
- the full gallery stays available without dominating the page
- contrast and motion controls remain nearby, but no longer feel buried under theme cards

## Learn, Practice, Solve

The academic loop is the working product spine:

- lessons recommend related calculators and quizzes
- calculators surface related lessons and practice through page menus and related panels
- quizzes explain route choice and send students back to the lesson or forward into the solving workspace
- Smart Solver and OCR route scanned or typed prompts toward the new v13 academic tools
- Workpaper Studio includes a v13 support template for mixed revenue, tax, audit, and target-costing review

## Main Product Areas

- `Smart Tools`: Smart Solver, Scan & Check, OCR-assisted review, route discovery
- `Study Hub`: module browsing, lessons, quizzes, progress, resume behavior
- `Workpapers`: assignment-friendly templates, workbook editing, calculator-to-workpaper flows
- `FAR / AFAR`: statements, leases, foreign currency, partnerships, combinations, reporting support
- `Cost / Managerial / MS`: CVP, decision tools, budgets, costing, variances, planning, performance
- `Taxation`: VAT, withholding, percentage tax, estate, donor's, DST, book-tax and compliance review support
- `Audit / AIS / Governance / RFBT / Strategic`: reviewer workspaces, lessons, and connected decision support tools

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
    components/               Shared UI blocks, overlays, and page shells
    features/                 Route-level product areas
    hooks/                    Shared behavioral hooks such as scroll locking
    utils/                    Shared math, release data, search, parsing, settings, and assumptions
  tests/                      Shared math, discovery, workpaper, and regression coverage
  docs/                       Release notes, system overview, maintenance notes, HTML/PDF handoff docs
```

## Rules For Future Pages

1. Define the page's single dominant task before adding sections.
2. Keep the main action and main result visible before secondary help.
3. Remove redundant labels and explanation chrome that only describe the system itself.
4. Move optional details into disclosures, menus, or secondary panels when they are not needed immediately.
5. When adding substantial overlays, use the shared viewport portal, `--app-mobile-panel-height`, full-height desktop sizing, and safe-area-aware internal padding instead of inventing a new sizing model.
6. Prefer small, safe responsiveness wins over flashy but fragile layout tricks.
7. Add regression coverage when shared logic changes.

## Validation Status For 13.0.0

The final `13.0.0` release is validated with:

```bash
npm test
npm run build
npm run dev
```

The dev check should remain a bounded probe so no long-running local server is left hanging in the terminal. The final manual pass for `13.0.0` should include:

- new FAR conceptual framework and revenue-allocation pages
- new taxable-income bridge
- new audit evidence-program builder
- new target-costing workspace
- Study Hub lessons and quizzes for the v13 topics
- Smart Solver/search/OCR discovery for the new academic routes
- v13 integrated workpaper template
