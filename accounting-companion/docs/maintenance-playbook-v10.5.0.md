# AccCalc v10.5.0 Maintenance Playbook

Use this playbook when maintaining the reliability-focused v10.5 codebase.

## Workpaper Guardrails

- Keep row and column caps centralized in `src/features/workpapers/workpaperUtils.ts`.
- If the caps change, recheck Workpaper Studio rendering, narrow-screen layout, imported-file behavior, transfer append behavior, CSV/XLSX export, and test coverage.
- Do not bypass `createEmptySheet` for user-facing sheets. It applies the shared bounds.
- Keep saved-state sanitation in `workpaperStore.ts` strict. Old or malformed local data should degrade into a safe workbook state, not crash the editor.
- Keep `xlsx` dynamically imported in `workpaperFile.ts`; static imports will bloat the Workpaper Studio route again.

## OCR And Smart Solver Safety

- Low-confidence OCR should lead to review, not blind autofill.
- Smart Solver route jumps should remain gated when confidence is low, prompt mistakes exist, or extracted values need review.
- If users complain that the extra click feels cautious, prefer improving confidence logic rather than removing the review gate.
- Route confidence, extraction confidence, and OCR confidence are related but not identical. Keep those concepts separate in copy and code.

## Calculation Assumptions

- Do not hide classroom assumptions. Put them in page copy, result interpretation, or shared helper result metadata.
- Keep exact capital-rationing search capped unless a more scalable optimization model is implemented.
- Keep confidence interval wording aligned with z-versus-t method selection.

## Validation Checklist

1. Run `npm test`.
2. Run `npm run build`.
3. Use a short bounded `npm run dev` probe.
4. Open Workpaper Studio and confirm template search, formula editing, workbook health, and import/export controls still render.
5. Try a low-confidence Smart Solver prompt and confirm the review warning appears before opening a tool.
6. Try a low-confidence Scan & Check item and confirm advanced review opens before routing.

## Known Survivability Limits

- Workpaper Studio is intentionally bounded. For full archival spreadsheet editing, students should keep the source XLSX file.
- OCR can still misread handwriting, decimals, percentages, and labels. The review flow is a guardrail, not a promise of perfect extraction.
- Large shared catalog and formula-definition surfaces remain future optimization candidates.
