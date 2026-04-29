# AccCalc

AccCalc is a browser-first accounting learning and productivity system for solving, checking, organizing, and reviewing accounting coursework in one place. Version `13.2.0` adds a polished, action-aware onboarding system and cleans up educational-use boundaries and generated test artifacts.

## What 13.2.0 Changes

- adds a first-time tutorial for Home, navigation, search, Smart Solver, calculators, Study Hub, Workpapers, and Settings replay
- adds a returning-user quick tour prompt for the first open after this release, with skip and do-not-show-again choices
- detects real tutorial actions such as opening navigation, using search, reaching routes, opening Settings, and interacting with calculator inputs
- adds Settings controls to replay the full tutorial, replay the quick tour, or reset tutorial progress
- adds contextual educational-use notices for tax, audit, legal/RFBT, governance, and AIS reviewer pages
- moves test compilation output into an ignored cache and removes tracked `.test-dist` artifacts from the repository index

## Academic Expansion Tracks

The 13.1.0 academic completion pass remains included:

- adds an Audit Materiality and Misstatement Planner for planning thresholds, clearly trivial amounts, and completion-stage pressure
- adds an Income Tax Payable and Credits Review for gross tax due, credits, payments, final payable, and overpayment signals
- adds an AIS Revenue Cycle Control Review for order-to-cash controls, assertions, walkthrough evidence, and weak-control gaps
- adds a Governance Fraud Risk Response Planner for fraud-triangle, management-override, evidence-quality, and escalation review
- adds an RFBT Negotiable Instruments Issue Spotter for holder status, defenses, party liability, presentment, dishonor, and notice
- adds original Study Hub lessons and quizzes for the new weak-track routes plus intermediate-accounting route discipline
- wires the new academic routes into app search, Smart Solver, OCR routing, related panels, category hubs, and a v13.1 workpaper template
- keeps the book-inspired expansion original: visible book/photo subject areas guide priorities, but no book text is copied

Important files:

- `src/features/onboarding/OnboardingCoach.tsx`
- `src/features/onboarding/onboardingState.ts`
- `src/features/onboarding/onboardingTours.ts`
- `src/features/onboarding/onboardingEvents.ts`
- `src/components/EducationalUseNotice.tsx`
- `src/components/CalculatorPageLayout.tsx`
- `src/features/meta/SettingsContent.tsx`
- `src/features/audit/AuditMaterialityPlannerPage.tsx`
- `src/features/tax/IncomeTaxPayableReviewPage.tsx`
- `src/features/ais/RevenueCycleControlReviewPage.tsx`
- `src/features/governance/FraudRiskResponsePlannerPage.tsx`
- `src/features/rfbt/NegotiableInstrumentsIssueSpotterPage.tsx`
- `src/features/study/studyExpansion1310.ts`
- `src/utils/appCatalog.ts`
- `src/features/smart/smartSolver.engine.ts`
- `src/features/scan-check/services/ocr/ocrRouting.ts`
- `src/features/workpapers/workpaperTemplates.ts`

Coverage priorities in `13.2.0`:

- Onboarding: first-run tutorial, returning quick tour, replay, reset, route/action/input completion checks
- Auditing: materiality, performance materiality, clearly trivial thresholds, misstatement pressure, evidence response
- Taxation: taxable-income bridge plus final payable, credits, payments, overpayment, and compliance review
- AIS: revenue-cycle controls, order-to-cash walkthroughs, assertion mapping, access/control follow-up
- Governance / Ethics / Risk: fraud-risk cues, management override, evidence quality, escalation, oversight response
- RFBT / Law: negotiable-instrument holder status, defenses, party liability, presentment, dishonor, and notice
- Intermediate Accounting / FAR: route discipline across recognition, measurement, presentation, disclosure, and schedules

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
- Smart Solver and OCR route scanned or typed prompts toward the new v13.1 academic tools
- Workpaper Studio includes a v13.1 support template for mixed audit, tax, AIS, governance, and RFBT review
- tutorial state is local, version-aware, replayable from Settings, and resilient to missing or corrupted storage

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
