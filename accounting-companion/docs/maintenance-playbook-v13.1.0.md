# AccCalc Maintenance Playbook v13.1.0

## First Read

Maintain `13.1.0` as an academic-completion release. Future edits should improve the learn, practice, solve, review, and continue loop instead of adding disconnected calculators or broad shell changes.

## Academic Integrity Rules

1. Use curriculum and book-inspired subject signals only as topic anchors.
2. Do not copy textbook wording, examples, tables, or quiz items.
3. Keep explanations original, auditable, and tied to AccCalc routes.
4. State assumptions for tax, audit, governance, AIS, and law topics.
5. Use reviewer workspaces for judgment-heavy topics instead of forcing numeric calculators.

## Files To Check When Adding Similar Coverage

- `src/utils/calculatorMath.ts`
- relevant `src/features/.../*Page.tsx`
- `src/features/study/studyContent.ts`
- the newest `src/features/study/studyExpansion*.ts`
- `src/utils/appCatalog.ts`
- `src/features/smart/smartSolver.engine.ts`
- `src/features/smart/smartSolver.targets.ts`
- `src/features/scan-check/services/ocr/ocrRouting.ts`
- `src/features/workpapers/workpaperTemplates.ts`
- `tests/calculatorMath.test.ts`
- `README.md`
- release notes, system overview, maintenance playbook, HTML/PDF docs

## Validation Checklist

- Run `npm test`.
- Run `npm run build`.
- Confirm app search surfaces new routes from natural academic phrases.
- Confirm Smart Solver chooses specific routes for specific prompts and broader routes for broad prompts.
- Confirm OCR routing recommends new routes for scanned problem language.
- Confirm Study Hub topics exist and link to calculators or reviewer workspaces.
- Confirm quiz explanations teach route choice and not only answer selection.
- Confirm workpaper templates include relevant support sheets when a topic benefits from documentation.

## Remaining Weakness Watchlist

- More jurisdiction-specific tax detail should be added only when the app can state current assumptions clearly.
- RFBT can grow further through corporate, securities, credit, and insolvency practice, but each topic should remain original and route-connected.
- AIS and governance should favor case-review workspaces and evidence checklists over shallow scoring widgets.
