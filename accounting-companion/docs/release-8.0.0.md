# AccCalc v8.0.0 Release Notes

Release date: `2026-04-22`

## Summary

AccCalc `8.0.0` is a broad academic-expansion and personalization release. It extends the calculator catalog again across managerial accounting, FAR, AFAR, taxation, and operations support while also adding a persistent multi-family theme system.

## Major Additions

- Sales Volume Variance
- Sales Mix Variance
- Safety Stock Planner
- Dividend Allocation
- Estate Tax Helper
- Donor's Tax Helper
- Documentary Stamp Tax Helper
- Consignment Settlement
- Branch Inventory Loading

## Discovery And Integration Work

The new tools were wired through:

- route registration in `src/App.tsx`
- catalog metadata and aliases in `src/utils/appCatalog.ts`
- Smart Solver field metadata, extraction, and calculator routing in `src/features/smart/smartSolver.engine.ts`
- solve-target hints in `src/features/smart/smartSolver.targets.ts`
- OCR route recommendation rules in `src/features/scan-check/services/ocr/ocrRouting.ts`
- calculator-linked study support in `src/utils/formulaStudyContent.tsx`
- reviewer topic expansion in `src/features/study/studyExpansion450.ts`
- new workpaper templates in `src/features/workpapers/workpaperTemplates.ts`

## Theme Personalization

This release adds:

- persistent light and dark modes
- theme families: Classic, Ocean, Slate, Rose, Blossom, Lavender, Sunset, Emerald
- pre-paint theme restoration in `index.html`
- centralized theme metadata in `src/utils/themePreferences.ts`
- settings UI support in `src/features/meta/SettingsContent.tsx`

## Reliability And Maintainability

- tax assumptions continue to stay centralized in `src/utils/taxConfig.ts`
- new route math uses shared helpers in `src/utils/calculatorMath.ts`
- release metadata is centralized in `src/utils/appRelease.ts`
- build and tests passed after the `8.0.0` implementation

## Validation

```bash
npm test
npm run build
```

Both commands passed for the final `8.0.0` state.

## Known Remaining Limits

- `WorkpaperStudioPage`, `appCatalog`, `main`, and `formulaSolveDefinitions` still contribute large chunks in production builds
- the new tax helpers remain classroom-oriented support tools, not filing or legal-advice systems
- search and discovery are broader than before, but the growing catalog will still benefit from future category-hub refinement
