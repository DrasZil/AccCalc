# AccCalc 13.4.0 System Overview

## Product Spine

AccCalc remains organized around a learn-practice-solve-review loop:

1. Study Hub teaches a topic.
2. Topic quizzes test route choice and interpretation.
3. Calculators and reviewer workspaces structure the answer.
4. Smart Solver and OCR discovery help users reach the right route.
5. Workpapers preserve assumptions, results, limitations, and next actions.

## 13.4.0 Academic Additions

- `src/features/audit/AnalyticalProceduresReviewPage.tsx`
- `src/features/tax/DeductionSubstantiationReviewPage.tsx`
- `src/features/rfbt/SecurityContractsRemedyReviewPage.tsx`
- `src/features/strategic/IntegratedReviewStudioPage.tsx`
- `src/features/study/studyExpansion1340.ts`

Shared scoring helpers live in `src/utils/calculatorMath.ts`:

- `computeAuditAnalyticalProcedureReview`
- `computeTaxDeductionSubstantiationReview`
- `computeSecurityContractRemedyReview`
- `computeIntegratedReviewReadiness`

## Discovery And Routing

- `src/utils/appCatalog.ts` registers the new route labels, aliases, curriculum grouping, release freshness, and search terms.
- `src/features/smart/smartSolver.engine.ts` maps typed prompts to the new workspaces.
- `src/features/scan-check/services/ocr/ocrRouting.ts` routes scanned text to the new reviewer tools.
- `src/features/workpapers/workpaperTemplates.ts` includes the v13.4 Category Gap and Mixed Review template.

## Integrated Review Layer

The CPA Integrated Review Studio is the center of the 13.4 mixed-review addition. It scores topic identification, computation, explanation, assumptions, and follow-up completion so a learner can repair the weakest step before repeating a mixed case.

## Page Clarity

New pages continue the compact first-screen guidance pattern: purpose, best-use context, expected inputs, expected outputs, next-step links, and a visible educational-use boundary where the subject could be mistaken for professional guidance.

## Educational Boundary

Tax, audit, RFBT/law, governance, AIS, and mixed-review surfaces support classroom learning and reviewer practice only. Current tax, legal, professional standards, audit engagement, and security-incident decisions require current official sources and qualified professional judgment.
