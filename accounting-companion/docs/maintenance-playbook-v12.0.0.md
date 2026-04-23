# AccCalc Maintenance Playbook v12.0.0

## First Read

This version formalizes a focus-first page system. Future work should preserve clarity of purpose before adding more visible surface area.

## Main Files To Know

- `src/components/CalculatorPageLayout.tsx`
- `src/components/ContextualPageMenu.tsx`
- `src/components/DisclosurePanel.tsx`
- `src/features/home/HomePage.tsx`
- `src/features/study/StudyTopicPage.tsx`
- `src/features/workpapers/WorkpaperStudioPage.tsx`
- `src/utils/appCatalog.ts`
- `src/utils/appRelease.ts`

## Focus-First Rules For Future Pages

When adding or refactoring a page:

1. Define the page’s single dominant purpose.
2. Keep the main action and main output visible first.
3. Move supporting references, related tools, and longer explanatory blocks into disclosures or the page menu when they are not needed immediately.
4. Do not bury essential warnings, assumptions, or main actions.
5. Avoid reintroducing equal-weight card walls near the main task.

## Safe Extension Workflow

When adding a meaningful new route:

1. Add the page in `src/features/...`
2. Register the route in `src/App.tsx`
3. Add metadata in `src/utils/appCatalog.ts`
4. Use shared shells instead of inventing a new layout pattern unless there is a strong reason
5. Add Smart Solver mapping when the route should be reachable by prompt
6. Add OCR routing when the route should be reachable by scan review
7. Add Study Hub content if the route belongs to a real curriculum family
8. Add a workpaper template when the route benefits from a worksheet
9. Add regression coverage in `tests/calculatorMath.test.ts`

## Workpaper Notes

- Focus mode exists to keep the sheet primary. Do not add new always-visible support panels lightly.
- Keep workbook utilities accessible, but secondary.
- Prefer assignment-friendly improvements over spreadsheet complexity for its own sake.

## Homepage Notes

- Treat the first screen as a next-step launcher.
- Broader discovery belongs in grouped disclosures, not in the hero path.
- If a new homepage section does not help a user decide what to do now, it probably belongs lower or hidden by default.

## Validation

Minimum release validation:

- `npm test`
- `npm run build`
- bounded `npm run dev` probe
