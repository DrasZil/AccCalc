# AccCalc Maintenance Playbook v11.0.0

## First Read

This version assumes the app may go months without active maintenance. Changes should favor safety, consistency, and discoverability over cleverness.

## Main Files To Know

- `src/App.tsx`
- `src/utils/appCatalog.ts`
- `src/utils/appExperience.ts`
- `src/utils/calculatorMath.ts`
- `src/features/smart/smartSolver.engine.ts`
- `src/features/scan-check/services/ocr/ocrRouting.ts`
- `src/features/study/studyContent.ts`
- `src/features/study/studyExpansion450.ts`
- `src/features/study/studyExpansion1100.ts`
- `src/features/workpapers/WorkpaperStudioPage.tsx`
- `src/features/workpapers/workpaperTemplates.ts`
- `src/utils/appRelease.ts`

## Safe Extension Workflow

When adding a meaningful new route:

1. Add the page in `src/features/...`
2. Register the route in `src/App.tsx`
3. Add metadata in `src/utils/appCatalog.ts`
4. Add Smart Solver mapping when the route should be reachable by prompt
5. Add OCR routing when the route should be reachable by scan review
6. Add Study Hub content if the route belongs to a real curriculum family
7. Add a workpaper template when the route benefits from a worksheet
8. Add regression coverage in `tests/calculatorMath.test.ts`

## Shell And Study Notes

- `AppLayout.tsx` now carries meaningful route-context logic. Keep additions disciplined or the shell will become noisy.
- `appExperience.ts` is a good place for shared route-surface and curriculum-snapshot logic that should not be duplicated across pages.
- `studyExpansion1100.ts` exists for the newer weak-track completion modules. Reuse the topic seed pattern instead of hardcoding inconsistent lesson structures.

## Workpaper Notes

- Prefer assignment-friendly templates over flashy spreadsheet behavior.
- Keep route handoffs obvious from active workbooks.
- Avoid adding large always-loaded spreadsheet dependencies to the main shell.

## Solver / OCR Notes

- Keep OCR and Smart Solver confidence-aware.
- If a route is uncertain, route to review first rather than pretending certainty.
- Improve parsing and route metadata before adding fragile one-off heuristics.

## Release Hygiene

For the next version:

- update `package.json`
- update `package-lock.json`
- update `src/utils/appRelease.ts`
- update `README.md`
- add new docs under `docs/`
- regenerate HTML/PDF docs if the release flow still expects them

## Validation

Minimum release validation:

- `npm test`
- `npm run build`
- bounded `npm run dev` probe
