# AccCalc 6.0.0 Maintenance Playbook

## Start Here If You Have Low Context

1. Read [`README.md`](/E:/AccCalc/accounting-companion/README.md:1)
2. Read [`docs/system-overview-v6.0.0.md`](/E:/AccCalc/accounting-companion/docs/system-overview-v6.0.0.md:1)
3. Open [`src/App.tsx`](/E:/AccCalc/accounting-companion/src/App.tsx:1)
4. Trace the relevant route into its page
5. Check `calculatorMath.ts`, `formulaSolveDefinitions.ts`, and the test file before changing logic

## Maintenance Priorities

- Do not break the app shell or Workpaper Studio
- Preserve mobile readability and the 5.7.0 workpaper fixes
- Keep route metadata, Smart Solver, OCR, and workpapers aligned when adding features
- Keep time-sensitive tax assumptions centralized
- Prefer incremental, explainable changes over rewrites

## How To Trace a Feature

### Formula-based calculator

1. `App.tsx`
2. page wrapper in `src/features/*`
3. `FormulaSolveWorkspace.tsx`
4. `formulaSolveDefinitions.ts`
5. `calculatorMath.ts`
6. `formulaStudyContent.tsx`
7. `tests/calculatorMath.test.ts`

### Smart Solver route

1. `smartSolver.engine.ts`
2. `smartSolver.targets.ts`
3. destination route in `appCatalog.ts`
4. destination page and solve definition

### OCR route suggestion

1. OCR extraction and classification files
2. `ocrRouting.ts`
3. route metadata and page destination

### Workpaper template

1. `workpaperTemplates.ts`
2. `WorkpaperStudioPage.tsx`
3. any calculator-to-template relationship in related route metadata or study links

## Files To Update Together

When adding a new formula page, update these as a set:

- `src/App.tsx`
- route page component
- `src/utils/appCatalog.ts`
- `src/utils/calculatorMath.ts`
- `src/utils/formulaSolveDefinitions.ts`
- `src/utils/formulaStudyContent.tsx` if needed
- `src/features/smart/smartSolver.engine.ts` if discoverability matters
- `src/features/smart/smartSolver.targets.ts` if reverse solving matters
- `src/features/scan-check/services/ocr/ocrRouting.ts` if scan routing matters
- `src/features/workpapers/workpaperTemplates.ts` if the workflow needs a schedule
- `tests/calculatorMath.test.ts`

## Tax Maintenance

Tax defaults now live in:

- [`src/utils/taxConfig.ts`](/E:/AccCalc/accounting-companion/src/utils/taxConfig.ts:1)

If rates or assumption notes change:

1. Update `taxConfig.ts`
2. Confirm solve-definition placeholders and assumption notes still read correctly
3. Re-run `npm test` and `npm run build`
4. Update release notes or docs if the change is user-visible

## Versioning Checklist

For a release version bump:

- `package.json`
- `package-lock.json`
- `src/utils/appRelease.ts`
- release notes in `docs/`
- `README.md`

## Build and Test Checklist

Before finishing a change:

```bash
npm test
npm run build
```

If tests fail:

- inspect shared math first
- inspect search/alias expectations second
- inspect solve-definition formatting and output wording third

## Chunk Size and Performance Notes

The current build passes, but large chunks remain in:

- `WorkpaperStudioPage`
- `appCatalog`
- `main`

If future maintainers want to optimize further, low-risk targets are:

- splitting some larger subject bundles more aggressively
- reviewing whether catalog-heavy pages can defer part of their payload
- keeping big workspace features isolated behind lazy routes

## Safe Refactor Rules

- Do not rewrite Workpaper Studio casually
- Do not hide tax assumptions in scattered page strings
- Do not add reverse solves unless the algebra is safe
- Do not add pages without updating discovery metadata
- Do not add unsupported “exactness” claims to educational tax or AFAR helpers

## Known Risk Areas

- Smart Solver field growth can become noisy if aliases are duplicated carelessly
- Route metadata can drift from page behavior if app catalog changes are skipped
- Workpaper formulas are powerful enough that small utility changes can cause wide regressions
- OCR routing is pattern-based and needs careful wording rather than overbroad regexes

## Best Next Improvements After 6.0.0

- deeper chunk-splitting and route payload optimization
- additional statement builders such as a budgeted statement of financial position
- broader AFAR elimination support beyond inventory and PPE
- more granular tests around OCR routing and Smart Solver ranking
