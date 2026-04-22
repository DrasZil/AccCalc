# AccCalc Maintenance Playbook v8.0.0

## First Steps For A Returning Maintainer

1. Read `README.md`
2. Read `docs/release-8.0.0.md`
3. Read `docs/system-overview-v8.0.0.md`
4. Open `src/App.tsx`, `src/utils/appCatalog.ts`, `src/utils/calculatorMath.ts`, and `src/utils/formulaSolveDefinitions.ts`
5. Run `npm test` and `npm run build`

## Safe Extension Pattern

When adding features, prefer this sequence:

1. shared math
2. solve definition or workspace logic
3. page route
4. catalog and aliases
5. Smart Solver
6. OCR routing
7. study content
8. workpaper template
9. tests
10. docs

## Files To Check Together

For new calculator routes:

- `src/App.tsx`
- `src/utils/appCatalog.ts`
- `src/utils/calculatorMath.ts`
- `src/utils/formulaSolveDefinitions.ts`
- `src/features/smart/smartSolver.engine.ts`
- `src/features/smart/smartSolver.targets.ts`
- `src/features/scan-check/services/ocr/ocrRouting.ts`
- `src/utils/formulaStudyContent.tsx`
- `src/features/study/studyExpansion450.ts`
- `src/features/workpapers/workpaperTemplates.ts`
- `tests/calculatorMath.test.ts`

## Theme Maintenance

Theme work now spans:

- `src/utils/appSettings.ts`
- `src/utils/themePreferences.ts`
- `src/features/meta/SettingsContent.tsx`
- `src/features/layout/AppLayout.tsx`
- `src/index.css`
- `index.html`

When adding a new theme family:

- define it in `themePreferences.ts`
- add CSS token overrides in `index.css`
- surface it in settings
- verify both light and dark readability

## Tax Maintenance

Do not scatter tax assumptions through page components.

Use:

- `src/utils/taxConfig.ts`

This is the correct place for rates, dates, labels, and visible notes.

## Performance Priorities After 8.0.0

The next safe optimization targets are:

- `WorkpaperStudioPage` chunk weight
- `appCatalog` bundle weight
- `formulaSolveDefinitions` chunk size
- main shell chunk size

## Validation Standard

Before closing any major change:

```bash
npm test
npm run build
```

## Beginner Handoff Advice

If you return months later with low context, trace one feature end-to-end from route to math to study support before making broad edits. The app is large enough now that shared systems matter more than page-local tweaks.
