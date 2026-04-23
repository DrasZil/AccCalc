# AccCalc v10.5.0 System Overview

Version `10.5.0` keeps the React/Vite architecture and hardens the student-facing reliability layer.

## Release Theme

The main theme is survivability. AccCalc already has broad curriculum coverage, so v10.5 focuses on preventing the common failure modes that hurt students: oversized saved state, risky OCR routing, ambiguous Smart Solver jumps, heavy workpaper chunks, and unclear assumptions.

## Workpaper System

Important files:

- `src/features/workpapers/WorkpaperStudioPage.tsx` renders the workbook editor, formula bar, template panel, mobile edit dock, workbook health strip, and import/export actions.
- `src/features/workpapers/workpaperUtils.ts` owns shared row/column caps, sheet creation, cell references, formatting helpers, range helpers, and formula-shift utilities.
- `src/features/workpapers/workpaperStore.ts` reads, sanitizes, migrates, and persists local workpaper state.
- `src/features/workpapers/workpaperFile.ts` imports and exports spreadsheet files. It dynamically imports `xlsx` only when file work is requested.
- `src/features/workpapers/workpaperTemplates.ts` registers assignment-ready starter sheets.

The v10.5 guardrail is simple: browser workpapers are student work surfaces, not unlimited spreadsheet replacements. The shared caps keep the editor responsive and predictable on mobile, laptop, and desktop screens.

## Smart Solver And OCR

Important files:

- `src/features/smart/SmartSolverPage.tsx` now blocks a blind route jump when the current solver signature is low confidence or has warning signals.
- `src/features/smart/utils/solverConfidence.ts` summarizes confidence from route score and missing fields.
- `src/features/scan-check/pages/ScanCheckPage.tsx` now opens review before routing when OCR/parse confidence or structured fields indicate risk.
- `src/features/scan-check/services/ocr/ocrParser.ts` continues to separate cleaned text, structured fields, likely issues, route ambiguity, and study recommendations.

The system still helps students move quickly, but it now asks for a second confirmation before using uncertain extracted values.

## Computation And Assumptions

Shared calculation logic remains centered in `src/utils/calculatorMath.ts`. Formula solve behavior remains centered in `src/utils/formulaSolveDefinitions.ts`.

Student-trust behavior means assumptions should be visible:

- z confidence intervals require known population standard deviation.
- t confidence intervals are used when standard deviation is estimated from the sample.
- capital-rationing exact search assumes independent, indivisible projects and caps exact enumeration at 20 positive-NPV projects.
- workpaper import caps are intentional browser survivability limits.

## Performance

The largest concrete v10.5 performance improvement is moving `xlsx` out of the default Workpaper Studio route chunk. Workpaper import/export still works, but spreadsheet library code is loaded only when needed.

The build still has large shared catalog and formula surfaces, but Workpaper Studio is no longer dominated by spreadsheet import/export code.

## Tests

`tests/calculatorMath.test.ts` includes regression coverage for shared calculations, search/discovery, workpaper formula helpers, workpaper templates, and the new workpaper dimension cap.
