# AccCalc 7.0.0 Maintenance Playbook

## Start Here If You Have Low Context

1. Read [README.md](/E:/AccCalc/accounting-companion/README.md:1)
2. Read [docs/system-overview-v7.0.0.md](/E:/AccCalc/accounting-companion/docs/system-overview-v7.0.0.md:1)
3. Open [src/App.tsx](/E:/AccCalc/accounting-companion/src/App.tsx:1)
4. Trace the route into its feature page
5. Check `calculatorMath.ts`, `formulaSolveDefinitions.ts`, and the test file before changing logic

## Maintenance Priorities

- Do not break the app shell or Workpaper Studio
- Preserve mobile readability and earlier workpaper fixes
- Keep route metadata, Smart Solver, OCR, Study Hub, and workpapers aligned when adding features
- Keep tax assumptions centralized
- Prefer incremental, explainable changes over rewrites

## How To Trace A Feature

### Formula-based calculator

1. `src/App.tsx`
2. route page in `src/features/*`
3. `src/components/FormulaSolveWorkspace.tsx`
4. `src/utils/formulaSolveDefinitions.ts`
5. `src/utils/calculatorMath.ts`
6. `src/utils/formulaStudyContent.tsx`
7. `tests/calculatorMath.test.ts`

### Smart Solver route

1. `src/features/smart/smartSolver.engine.ts`
2. `src/features/smart/smartSolver.targets.ts`
3. `src/utils/appCatalog.ts`
4. destination route page and solve definition

### OCR route suggestion

1. OCR extraction and classification files
2. `src/features/scan-check/services/ocr/ocrRouting.ts`
3. route metadata in `appCatalog.ts`
4. destination route and related study content

### Workpaper template

1. `src/features/workpapers/workpaperTemplates.ts`
2. `src/features/workpapers/WorkpaperStudioPage.tsx`
3. related calculator families and support links

## Files To Update Together

When adding a new calculator family, update these as a group:

- `src/App.tsx`
- route page component
- `src/utils/appCatalog.ts`
- `src/utils/calculatorMath.ts`
- `src/utils/formulaSolveDefinitions.ts`
- `src/utils/formulaStudyContent.tsx`
- `src/features/study/studyExpansion450.ts`
- `src/features/smart/smartSolver.engine.ts`
- `src/features/smart/smartSolver.targets.ts`
- `src/features/scan-check/services/ocr/ocrRouting.ts`
- `src/features/workpapers/workpaperTemplates.ts` when a worksheet adds value
- `tests/calculatorMath.test.ts`

## Accuracy Checklist

Before merging math changes:

- confirm units and rate assumptions are explicit
- confirm displayed formulas match computed values
- confirm reverse-solve paths are mathematically valid
- confirm warnings and assumptions are honest
- confirm interpretation text still matches the result sign or direction
- confirm rounding is consistent with existing helpers

## Search And Discovery Checklist

When adding or changing routes:

- add aliases and keywords in `appCatalog.ts`
- add Smart Solver field metadata and extraction aliases when needed
- add solve-target hints when the page supports reverse-solving
- add OCR wording if the topic appears in photographed or scanned problems
- verify the homepage or related-route panels surface the tool if it belongs in a guided family

## Performance Checklist

When the app feels slower:

- check `src/utils/appSearch.ts` for catalog-search overhead
- check whether a new route imported something heavy into the initial path
- keep large static content behind disclosure panels when possible
- prefer lazy route loading over broad shared imports
- avoid adding page-level re-renders for static result sections

## Tax Maintenance

Tax defaults live in:

- [src/utils/taxConfig.ts](/E:/AccCalc/accounting-companion/src/utils/taxConfig.ts:1)

If rates or labels change:

1. update `taxConfig.ts`
2. confirm solve-definition notes still read correctly
3. rerun `npm test`
4. rerun `npm run build`
5. update release notes if users will notice the change

## Versioning Checklist

When shipping a release:

1. update `package.json`
2. update `package-lock.json`
3. update `src/utils/appRelease.ts`
4. update `README.md`
5. add or refresh release notes in `docs/`
6. regenerate HTML and PDF documentation if those artifacts are maintained

## Validation Commands

```bash
npm test
npm run build
```

## Safe Extension Guidance

- Prefer shared solve definitions over one-off route logic when the pattern already fits
- Keep new pages thin and let shared helpers do the hard work
- Add tests whenever changing shared math or discovery behavior
- Do not remove old release docs unless the project explicitly wants a single-file history
