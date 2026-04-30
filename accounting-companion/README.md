# AccCalc

AccCalc is a browser-first accounting learning and productivity system for solving, checking, organizing, and reviewing accounting coursework in one place. Version `13.3.0` is a super-completion release focused on curriculum coverage, reviewer depth, stronger practice loops, page clarity, and survivable integration across learn, practice, solve, and review.

## What 13.3.0 Changes

- adds Installment Sales Gross Profit Review for AFAR deferred gross profit, realized gross profit, collection-based recognition, and repossession signals
- adds Going Concern Review Workspace for adverse conditions, management plans, evidence support, residual doubt, and audit completion response
- adds Tax Remedy Timeline Review with educational-only deadline pressure, evidence completeness, materiality, and procedural-complexity triage
- adds AIS Incident Response Triage for confidentiality, integrity, availability, containment, evidence readiness, and IT-audit escalation
- adds original Study Hub lessons and quizzes for AFAR installment sales, audit going concern, tax remedies, AIS incident response, FAR disclosure, bookkeeping closing/reversing, RFBT corporation lifecycle, and integrated CPA cases
- adds a v13.3 Super-Completion Review Map workpaper template for linking lessons, quizzes, workspaces, results, assumptions, and next actions
- adds first-screen page clarity strips across calculator/reviewer pages so users can quickly see when to use a page, what it returns, and where to continue
- wires the new routes into app search, Smart Solver, Scan & Check OCR routing, related page menus, Study Hub, workpapers, and regression tests

## Onboarding And Boundary Cleanup

The 13.2.0 onboarding and limitation-cleanup pass remains included:

- first-time tutorial for Home, navigation, search, Smart Solver, calculators, Study Hub, Workpapers, and Settings replay
- returning-user quick tour prompt with skip and do-not-show-again choices
- real tutorial action detection for navigation, search, route changes, Settings, and calculator input interaction
- Settings controls to replay the full tutorial, replay the quick tour, or reset tutorial progress
- contextual educational-use notices for tax, audit, legal/RFBT, governance, and AIS reviewer pages
- test compilation output kept in an ignored cache instead of tracked `.test-dist` artifacts

## Academic Expansion Tracks

The 13.3.0 and 13.1.0 academic completion passes now cover:

- AFAR installment-sales review, deferred gross profit, franchise revenue, consignment, branch loading, corporate liquidation, and joint arrangements
- audit materiality, misstatement pressure, evidence programs, sampling, going concern, completion, opinion, and cycle review
- tax payable, book-tax differences, VAT, withholding, transfer taxes, compliance, incentives, and remedy triage with educational-use boundaries
- AIS revenue-cycle controls, access, segregation of duties, continuity, enterprise systems, and incident-response triage
- RFBT corporation lifecycle, commercial transactions, negotiable instruments, obligations/contracts, defective contracts, and securities/governance review
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
- `src/features/afar/InstallmentSalesReviewPage.tsx`
- `src/features/audit/GoingConcernReviewPage.tsx`
- `src/features/tax/TaxRemedyTimelineReviewPage.tsx`
- `src/features/ais/IncidentResponseTriagePage.tsx`
- `src/features/audit/AuditMaterialityPlannerPage.tsx`
- `src/features/tax/IncomeTaxPayableReviewPage.tsx`
- `src/features/ais/RevenueCycleControlReviewPage.tsx`
- `src/features/governance/FraudRiskResponsePlannerPage.tsx`
- `src/features/rfbt/NegotiableInstrumentsIssueSpotterPage.tsx`
- `src/features/study/studyExpansion1310.ts`
- `src/features/study/studyExpansion1330.ts`
- `src/utils/appCatalog.ts`
- `src/features/smart/smartSolver.engine.ts`
- `src/features/scan-check/services/ocr/ocrRouting.ts`
- `src/features/workpapers/workpaperTemplates.ts`

Coverage priorities in `13.3.0`:

- Super-completion: weak but important curriculum areas receive lesson, quiz, workspace, discovery, and workpaper support
- Page clarity: important pages explain use case, expected output, and next action on the first screen
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
- Smart Solver and OCR route scanned or typed prompts toward the v13.3 academic tools
- Workpaper Studio includes v13.1 and v13.3 support templates for mixed audit, tax, AIS, governance, AFAR, and RFBT review
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

## Validation Status For 13.3.0

The `13.3.0` release should be validated with:

```bash
npm test
npm run build
npm run dev
```

The dev check should remain a bounded probe so no long-running local server is left hanging in the terminal. The final manual pass for `13.3.0` should include:

- new AFAR installment-sales, audit going-concern, tax-remedy, and AIS incident-response workspaces
- Study Hub lessons and quizzes from `studyExpansion1330.ts`
- Smart Solver/search/OCR discovery for the new 13.3 routes
- calculator/reviewer page clarity strips on desktop and mobile
- v13.3 Super-Completion Review Map workpaper template
