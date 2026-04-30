# AccCalc 13.3.0 System Overview

## Product Spine

AccCalc is organized around a learn-practice-solve-review loop:

1. Study Hub teaches a topic.
2. Topic quizzes test route choice and interpretation.
3. Calculators and reviewer workspaces structure the answer.
4. Related page menus point to nearby lessons, quizzes, and tools.
5. Workpapers preserve assumptions, results, limitations, and next actions.

## 13.3.0 Academic Additions

- `src/features/afar/InstallmentSalesReviewPage.tsx`
- `src/features/audit/GoingConcernReviewPage.tsx`
- `src/features/tax/TaxRemedyTimelineReviewPage.tsx`
- `src/features/ais/IncidentResponseTriagePage.tsx`
- `src/features/study/studyExpansion1330.ts`

Shared math lives in `src/utils/calculatorMath.ts`.

## Discovery And Routing

- `src/utils/appCatalog.ts` registers labels, aliases, curriculum grouping, offline metadata, and search terms.
- `src/features/smart/smartSolver.engine.ts` maps typed prompts to the new routes.
- `src/features/scan-check/services/ocr/ocrRouting.ts` routes scanned text to the new workspaces.
- `src/features/workpapers/workpaperTemplates.ts` includes the 13.3 Super-Completion Review Map.

## Page Clarity

`CalculatorPageLayout` now shows first-screen guidance for important pages: use case, expected output, and next action. This keeps pages self-explanatory even when users return after time away.

## Educational Boundary

Tax, audit, legal/RFBT, governance, and AIS surfaces continue to use educational-use notices. The app supports study and classroom review; it does not provide official legal, tax, professional standards, security, or audit advice.
