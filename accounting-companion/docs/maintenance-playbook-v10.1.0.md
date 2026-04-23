# AccCalc v10.1.0 Maintenance Playbook

Use this playbook when extending or debugging the v10.1 completion-pass additions.

## Trace A New Tool

1. Start at the route page in `src/features/...`.
2. Check shared math in `src/utils/calculatorMath.ts`.
3. Confirm route registration in `src/App.tsx`.
4. Confirm discovery metadata in `src/utils/appCatalog.ts`.
5. Confirm Smart Solver route matching in `src/features/smart/smartSolver.engine.ts`.
6. Confirm solve-target hints in `src/features/smart/smartSolver.targets.ts` when the tool has numeric targets.
7. Confirm OCR routing in `src/features/scan-check/services/ocr/ocrRouting.ts`.
8. Confirm Study Hub coverage in `src/features/study/studyExpansion450.ts`.
9. Confirm workpaper support in `src/features/workpapers/workpaperTemplates.ts`.
10. Add or update regression tests in `tests/calculatorMath.test.ts`.

## Assumption Notes

- Audit sampling uses classroom-style confidence factors. Do not treat the planner as a substitute for professional sampling software.
- Confidence intervals use supported classroom z/t critical values. If a course supplies a different critical value, document that assumption before comparing answers.
- Capital rationing exact-combination mode assumes independent, indivisible projects with no dependency or mutual-exclusion constraints. Exact search is capped at 20 positive-NPV projects; larger sets intentionally use the PI fallback to avoid exponential UI work.
- Quasi-reorganization output depends on stated legal/classroom assumptions about available relief sources.
- Corporate liquidation support separates priority claims from unsecured recovery; keep this order visible.
- RFBT and AIS pages are reviewer workspaces, not legal or cybersecurity advice.
- PERT is an estimate model and should show uncertainty rather than promise exact project duration.
- ABC cost-driver output is only as reliable as the cost-pool and driver relationship selected by the user.
- Financial asset amortized-cost support assumes the asset is already classified for amortized-cost measurement; classification and impairment staging remain separate accounting judgments.
- Investment property measurement support compares model effects after classification is settled.
- Joint-arrangement share math supports the schedule, but rights to assets and obligations for liabilities drive classification.
- Quality-control charts use a three-sigma teaching model and do not replace process-specific statistical quality-control analysis.

## Safe Extension Pattern

Prefer completing a topic family over adding a hidden one-off page. A new curriculum tool should normally include route UI, shared math or reviewer logic, catalog aliases, Smart Solver/OCR discovery, Study Hub links, optional workpaper support, and tests.

## Workpaper Maintenance Notes

- Keep urgent typing responsive. If a new preview feature requires full-sheet evaluation, defer it or trigger it from an explicit action.
- Keep template filtering cheap. Workpaper Studio searches title, description, topic, tags, and related paths using a deferred query, so avoid adding expensive computed metadata in the render path.
- Keep autosave off the urgent edit path. The page debounces saves and uses idle callbacks where supported; preserve that behavior when adding persistence features.
- Frozen-cell geometry depends on `--workpaper-row-header-width` and `--workpaper-column-header-height` in `src/index.css`; update those variables instead of scattering hardcoded offsets.
- Check narrow screens after changing toolbar, formula bar, or grid CSS. The selected-cell editor and formula bar must remain usable without sticky overlap.

## Validation Checklist

- Run `npm test`.
- Run `npm run build`.
- Use a short-lived `npm run dev` probe instead of leaving a long server running in the terminal.
- Search for the new topic by plain-language aliases.
- Scan a representative OCR phrase and confirm the intended route appears.
- For completion-pass additions, also confirm the related Study Hub module and workpaper template appear through the calculator route.
