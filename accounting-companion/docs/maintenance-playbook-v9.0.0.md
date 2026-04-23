# AccCalc v9.0.0 Maintenance Playbook

## Start Here

If you are coming back with low context, start with these files:

- `src/App.tsx`
- `src/utils/appCatalog.ts`
- `src/features/study/studyContent.ts`
- `src/features/study/studyExpansion450.ts`
- `src/features/study/StudyHubPage.tsx`
- `src/features/study/StudyTopicPage.tsx`
- `src/features/scan-check/services/ocr/ocrParser.ts`
- `src/features/smart/smartSolver.engine.ts`
- `src/utils/calculatorMath.ts`

Those files explain most of the app's structure.

## Safe Change Order

### Adding Or Editing A Calculator

1. update or add shared math in `src/utils/calculatorMath.ts`
2. add or update solve definitions in `src/utils/formulaSolveDefinitions.ts` if needed
3. update the route page
4. register the route in `src/App.tsx`
5. wire the route into `src/utils/appCatalog.ts`
6. update Smart Solver and OCR mappings
7. add study or formula-linked support
8. add tests

### Adding Or Editing A Lesson

1. choose `studyContent.ts` for richer hand-authored topics or `studyExpansion450.ts` for broader reviewer coverage
2. set `keywords`, `scanSignals`, and `relatedCalculatorPaths`
3. check topic relationships through `relatedTopicIds`
4. verify the lesson renders cleanly in `StudyLessonLayout`
5. check Study Hub grouping and breadcrumb return behavior

### Editing OCR

Use this order:

1. `src/utils/numberParsing.ts`
2. `ocrMathCleanup.ts`
3. `ocrParser.ts`
4. `accountingFieldExtractor.ts`
5. UI review components

Do not jump directly to route autofill logic first. Most OCR problems are upstream normalization or label-value pairing issues.

## Important v9.0.0 Notes

### Study Hub Navigation

`StudyHubPage.tsx` now reads and writes `?track=`. That means:

- lesson breadcrumbs can return users to the correct module shelf
- changing the active module updates the URL

If this breaks, users can feel lost even when the lesson data itself is correct.

### OCR Structured Fields

Structured fields now carry:

- `value`
- `normalizedValue`
- `valueKind`
- `sourceLine`
- `confidence`
- `needsReview`

Do not remove those fields casually. They are the main reason OCR review is now more transparent.

### Smart Solver Numeric Parsing

`smartSolver.engine.ts` now depends on `src/utils/numberParsing.ts`. If you change number parsing, test both:

- solver prompt extraction
- OCR structured field normalization

## Validation Commands

```bash
npm test
npm run build
```

Use those before updating docs.

## Known Ongoing Limits

- The biggest production bundles are still `WorkpaperStudioPage`, `appCatalog`, `formulaSolveDefinitions`, and `main`
- OCR remains a guided review flow, not guaranteed perfect autofill
- Some curriculum expansion is lesson-first rather than calculator-first, which is intentional for law, AIS, governance, and strategic subjects
