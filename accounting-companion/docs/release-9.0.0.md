# AccCalc v9.0.0 Release Notes

Release date: `2026-04-23`

## Summary

AccCalc `9.0.0` is a major academic-depth and learning-experience release on top of `8.1.0`. It pushes the app closer to full curriculum coverage by expanding the thinnest reviewer tracks, rebuilding the Study Hub lesson experience into a textbook-style reader, and making OCR plus Smart Solver more reliable for long accounting word problems.

## Major Product Changes

- Rebuilt Study Hub lessons around a reusable lesson reader with:
  - breadcrumbs
  - chapter outline
  - active section tracking
  - section-review progress
  - continue-reading state
  - previous / next lesson navigation
- Added major new reviewer modules across:
  - FAR refinements
  - AFAR partnership life cycle
  - audit risk and evidence linkage
  - tax compliance depth
  - RFBT contracts and corporation law
  - AIS control layers
  - governance and internal control
  - operations planning and quality
  - strategic performance integration
- Improved OCR cleanup and structured-field extraction so scan review keeps:
  - normalized values
  - value kinds
  - source lines
  - confidence
  - review-needed flags
- Improved Smart Solver numeric parsing so currency-marked values, grouped numbers, percentages, and parenthesized negatives survive longer prompts more safely
- Fixed Study Hub breadcrumb return behavior by making `track` query navigation real instead of decorative

## Academic Expansion Highlights

New `9.0.0` lesson modules include:

- `far-financial-assets-provisions-and-unearned-revenue`
- `afar-partnership-life-cycle-formation-admission-retirement`
- `audit-materiality-risk-and-evidence-linkage`
- `tax-withholding-local-remedies-and-compliance`
- `rfbt-obligations-contracts-and-defective-agreements`
- `rfbt-corporation-opc-merger-and-liquidation`
- `ais-general-vs-application-controls-and-it-audit`
- `governance-control-environment-risk-and-monitoring`
- `operations-aggregate-planning-scheduling-and-quality-management`
- `strategic-planning-budgeting-forecasting-and-performance-integration`

These topics were added through `src/features/study/studyExpansion450.ts` and automatically feed:

- Study Hub browsing
- OCR lesson recommendation
- lesson-to-calculator linking
- related-topic navigation

## Study Hub Revamp

The biggest UX change in `9.0.0` is the lesson architecture.

`src/features/study/StudyTopicPage.tsx` now uses `src/features/study/components/StudyLessonLayout.tsx`, which standardizes:

- lesson metadata
- progress display
- sticky lesson outline
- "You are here" tracking
- related calculators
- related lessons
- module context

`src/features/study/StudyHubPage.tsx` now behaves more like a curriculum shelf than a dashboard wall. It adds:

- module cards by track
- focused-track browsing
- track-aware progress
- better "continue reading" behavior
- `?track=` support so breadcrumbs return to the right shelf

## OCR And Smart Solver Improvements

New and changed files:

- `src/utils/numberParsing.ts`
- `src/features/scan-check/services/ocr/ocrMathCleanup.ts`
- `src/features/scan-check/services/ocr/ocrParser.ts`
- `src/features/scan-check/services/accounting/accountingFieldExtractor.ts`
- `src/features/scan-check/components/ScanStructuredFieldsEditor.tsx`
- `src/features/scan-check/pages/ScanCheckPage.tsx`
- `src/features/smart/smartSolver.engine.ts`

The new behavior is intentionally confidence-aware:

- OCR no longer tries to behave like a perfect autofill engine
- normalized values are shown as suggestions, not hidden replacements
- source lines are preserved for reviewer confirmation
- Smart Solver now reuses safer loose-number parsing instead of a narrower number regex path

## Reliability And Performance

- Added shared parsing utilities instead of duplicating number parsing between OCR and Smart Solver
- Reduced Study Hub grouping overhead by using direct grouped accumulation instead of repeated object reconstruction
- Added `content-visibility` to long grouped lesson sections to keep larger Study Hub views lighter on render

## Validation

```bash
npm test
npm run build
```

Both commands passed for the final `9.0.0` state.

## Known Remaining Limits

- `WorkpaperStudioPage`, `appCatalog`, `formulaSolveDefinitions`, and `main` still contribute the largest production chunks
- OCR is still confidence-aware review support, not guaranteed perfect extraction
- The broader reviewer expansion in `9.0.0` leans more heavily on lessons and integrated review modules than on brand-new standalone calculators
