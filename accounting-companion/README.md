# AccCalc

AccCalc is a browser-first accounting learning and productivity system for solving, checking, organizing, and reviewing accounting coursework in one place. Version `12.4.0` is a combined personalization and academic-expansion release: it keeps Settings compact while expanding calculator coverage, lesson depth, quiz support, and the learn-practice-solve loop across weaker curriculum tracks.

## What 12.4.0 Changes

- adds three new academically useful workspaces in weaker tracks:
  - Audit Misstatement Evaluation Workspace
  - Segregation of Duties Conflict Matrix
  - Governance Escalation Planner
- expands study coverage with new receivables/discounting and managerial cost-behavior modules plus topic-specific quiz sets
- tightens the lesson -> practice -> solve loop so Study Hub, Practice Hub, and quiz results now surface the nearest linked calculator directly
- improves Smart Solver discovery so segregation-of-duties prompts route to the conflict matrix instead of the broader access-control review when the prompt is really about incompatible duties
- keeps Appearance compact with a summary card, a small mode selector, a quick family strip, and a discoverable theme gallery
- preserves the familiar working themes while also supporting the newer palette-led families

## Theme System

Important files:

- `src/utils/themePreferences.ts`
- `src/utils/appSettings.ts`
- `src/features/layout/AppLayout.tsx`
- `src/main.tsx`
- `src/index.css`

Theme-system rules in `12.4.0`:

- Classic remains the safe default.
- Ocean, Slate, Rose, Blossom, Lavender, and Emerald remain available for students who already rely on the earlier color families.
- Butter, Moss, Palm, Guava, Sunset, Sangria, Seabreeze, Lagoon, and Odyssey extend the palette with more editorial families.
- Every family works in light, dark, and system mode.
- Theme families are palette-led, not random one-off color swaps.
- Legacy stored families migrate safely.
- Theme state applies before React mounts to reduce flicker.

## Academic Expansion

Important files:

- `src/utils/calculatorMath.ts`
- `src/features/audit/AuditMisstatementEvaluationPage.tsx`
- `src/features/ais/SegregationOfDutiesConflictPage.tsx`
- `src/features/governance/GovernanceEscalationPlannerPage.tsx`
- `src/features/study/studyExpansion450.ts`
- `src/features/study/studyExpansion1100.ts`
- `src/features/study/StudyHubPage.tsx`
- `src/features/study/StudyPracticeHubPage.tsx`
- `src/features/study/TopicQuizPage.tsx`
- `src/features/smart/smartSolver.engine.ts`

Academic rules in `12.4.0`:

- Prefer academically useful tools over toy formulas.
- Strengthen weaker tracks before adding more density to already strong ones.
- Every added or touched topic should answer how to learn it, practice it, and solve it.
- Study and practice surfaces should recommend the right tool, not a generic hub when a closer next step exists.
- Smart Solver and app discovery should recognize new academic tools as first-class routes, not dead-end additions.

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

The academic loop is tighter in `12.4.0`:

- lessons now link more deliberately to the most relevant calculators and quizzes
- practice cards surface linked tools so students can move from a weak quiz score into the exact workspace they need
- quiz results point back to the lesson and forward into related calculators instead of only sending students to a generic study hub
- calculator discovery covers the new audit, AIS, and governance workspaces in the app catalog and Smart Solver

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
5. When adding overlays, use the shared viewport portal and shell metrics instead of inventing a new sizing model.
6. Prefer small, safe responsiveness wins over flashy but fragile layout tricks.
7. Add regression coverage when shared logic changes.

## Validation Status For 12.4.0

The final `12.4.0` release is validated with:

```bash
npm test
npm run build
npm run dev
```

The dev check should remain a bounded probe so no long-running local server is left hanging in the terminal. The final manual pass for `12.4.0` should include:

- light, dark, and system switching
- theme persistence and restored familiar family coverage
- narrow-screen review of the Appearance section
- Study Hub and Practice Hub checks for lesson/tool/quiz linkage
- Smart Solver checks for the new audit, AIS, and governance routes
