# AccCalc System Overview v13.1.0

## Release Positioning

Version `13.1.0` completes a focused academic expansion pass. The audit showed the broad calculator library was already strongest in FAR, accounting, finance, and managerial areas, while AIS, governance, RFBT, audit completion logic, and tax payable review still had high-value gaps. This release fills those gaps with original tools, lessons, quizzes, routing, OCR discovery, and workpaper support.

## New Academic Workspaces

- Audit & Assurance: Audit Materiality and Misstatement Planner
- Taxation: Income Tax Payable and Credits Review
- AIS / IT Controls: Revenue Cycle Control Review
- Governance / Ethics / Risk: Fraud Risk Response Planner
- RFBT / Business Law: Negotiable Instruments Issue Spotter

## New Study And Practice Layer

The new `studyExpansion1310.ts` package adds lessons and quizzes for:

- audit materiality and misstatement response
- income-tax payable, credits, and overpayment
- AIS revenue-cycle controls and assertions
- RFBT negotiable-instrument issue spotting
- fraud risk, governance, and audit response
- intermediate-accounting route discipline

Each topic includes original reviewer notes, worked examples, checkpoint examples, mistake traps, quiz questions, linked routes, scan signals, and next-step prompts.

## Integration Model

Each v13.1 subject family follows:

1. Learn: Study Hub topic with original reviewer notes.
2. Practice: topic quiz with route-choice feedback.
3. Solve: calculator, reviewer, or workspace route.
4. Review: response signal, assumption warning, and related routes.
5. Continue: Smart Solver, OCR routing, app search, and workpaper support keep the next step available.

## Main Files

- `src/utils/calculatorMath.ts`
- `src/features/audit/AuditMaterialityPlannerPage.tsx`
- `src/features/tax/IncomeTaxPayableReviewPage.tsx`
- `src/features/ais/RevenueCycleControlReviewPage.tsx`
- `src/features/governance/FraudRiskResponsePlannerPage.tsx`
- `src/features/rfbt/NegotiableInstrumentsIssueSpotterPage.tsx`
- `src/features/study/studyExpansion1310.ts`
- `src/utils/appCatalog.ts`
- `src/features/smart/smartSolver.engine.ts`
- `src/features/smart/smartSolver.targets.ts`
- `src/features/scan-check/services/ocr/ocrRouting.ts`
- `src/features/workpapers/workpaperTemplates.ts`
- `tests/calculatorMath.test.ts`

## Known Limits

- Tax outputs remain educational and assumption-based; current law, taxpayer classification, forms, and credit limitations must be checked separately.
- Audit and governance scores are structured reviewer aids, not professional judgments or audit opinions.
- RFBT issue spotting is for classroom review and does not provide legal advice.
- AIS control review depends on the quality of actual walkthrough evidence and cannot prove operating effectiveness by itself.
