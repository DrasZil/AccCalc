# AccCalc v10.0.0 Maintenance Playbook

## Start Here

For the v10 expansion, inspect these files first:

- `src/utils/calculatorMath.ts`
- `src/App.tsx`
- `src/utils/appCatalog.ts`
- `src/features/study/studyExpansion450.ts`
- `src/features/smart/smartSolver.engine.ts`
- `src/features/smart/smartSolver.targets.ts`
- `src/features/scan-check/services/ocr/ocrRouting.ts`
- `src/features/workpapers/workpaperTemplates.ts`
- `tests/calculatorMath.test.ts`

## Adding A New Calculator

1. Put reusable math in `calculatorMath.ts`.
2. Build the route page with `CalculatorPageLayout`.
3. Register the route in `App.tsx`.
4. Add `appCatalog.ts` metadata with aliases, tags, and keywords.
5. Add Smart Solver and OCR patterns.
6. Add Study Hub content and workpaper templates if relevant.
7. Add tests for math and discovery.

## Accuracy Rules

- Keep page formulas aligned with shared math.
- Surface assumptions when recognition, tax, or standards-based judgment is involved.
- Do not hardcode hidden rules for time-sensitive topics.
- Prefer warnings over false certainty.

## v10 Topic Assumptions

- Confidence intervals use common large-sample z critical values.
- Capital rationing uses a profitability-index ranking approach.
- Provision expected value is a measurement aid and does not decide recognition by itself.
- Franchise revenue is an educational contract-obligation helper, not a legal conclusion.

## Validation

Run:

```bash
npm test
npm run build
```

Use a short-lived `npm run dev` probe only when needed so a local server is not left running.
