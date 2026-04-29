# AccCalc System Overview v13.0.0

## Release Positioning

Version `13.0.0` shifts the product forward as an academic accounting system. The release expands weak but important curriculum loops where students need to learn the concept, practice route choice, solve the case, and review the consequence.

## New Academic Workspaces

- FAR: Conceptual Framework Recognition Helper
- FAR: Revenue Allocation Workspace
- Taxation: Taxable Income Bridge
- Audit & Assurance: Audit Evidence Program Builder
- Strategic / Integrative: Target Costing Workspace

## Curriculum Coverage Movement

- Financial Accounting and Reporting: stronger conceptual-framework and revenue-recognition support.
- Intermediate Accounting: better recognition, measurement, allocation, and contract-balance routing.
- Taxation: clearer income-tax computation support beyond VAT and compliance pages.
- Auditing: stronger evidence and procedure-program support beyond planning and completion review.
- Strategic Cost Management: practical target-costing computation and interpretation.
- CPA-review integration: mixed practical financial accounting route mapping across FAR, tax, audit, and strategic cost.

## Integration Model

Each major v13 addition follows:

1. Learn: original Study Hub lesson.
2. Practice: topic quiz with route-choice explanations.
3. Solve: calculator, reviewer, or workspace route.
4. Review: result interpretation, warnings, related routes, and workpaper support.
5. Continue: Smart Solver, OCR, and category discovery keep the next route visible.

## Main Files

- `src/utils/calculatorMath.ts`
- `src/features/far/ConceptualFrameworkRecognitionPage.tsx`
- `src/features/far/RevenueAllocationWorkspacePage.tsx`
- `src/features/tax/TaxableIncomeBridgePage.tsx`
- `src/features/audit/AuditEvidenceProgramPage.tsx`
- `src/features/strategic/TargetCostingWorkspacePage.tsx`
- `src/features/study/studyExpansion1300.ts`
- `src/utils/appCatalog.ts`
- `src/features/smart/smartSolver.engine.ts`
- `src/features/scan-check/services/ocr/ocrRouting.ts`
- `src/features/workpapers/workpaperTemplates.ts`

## Known Limits

- Tax calculations are educational and assumption-based; students should check current law and class-specific instructions for actual filings.
- Audit scoring is a planning aid, not a substitute for professional standards or engagement methodology.
- Revenue allocation assumes two performance obligations for a focused classroom workflow.

