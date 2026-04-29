# AccCalc Maintenance Playbook v13.0.0

## First Read

Maintain `13.0.0` around academic depth, not raw content count. New material should strengthen a real curriculum loop: lesson, quiz, calculator or reviewer workspace, related links, Smart Solver/OCR discovery, and workpaper support when useful.

## Academic Integrity Rules

1. Use book/photo subject signals only as topic anchors.
2. Do not copy textbook wording or examples.
3. Keep examples original and short enough to audit.
4. Make assumptions explicit, especially for tax, audit, and standards-based topics.
5. Use reviewer pages for judgment-heavy topics instead of forcing every topic into numeric calculation.

## Files To Check When Adding Academic Coverage

- `src/utils/calculatorMath.ts`
- relevant `src/features/.../*Page.tsx`
- `src/features/study/studyContent.ts`
- `src/features/study/studyExpansion1300.ts` or a later expansion file
- `src/utils/appCatalog.ts`
- `src/features/smart/smartSolver.engine.ts`
- `src/features/scan-check/services/ocr/ocrRouting.ts`
- `src/features/workpapers/workpaperTemplates.ts`
- `tests/calculatorMath.test.ts`
- `README.md`
- release notes, system overview, and maintenance playbook

## Validation Checklist

- `npm test`
- `npm run build`
- Confirm the new route appears in app search.
- Confirm Smart Solver chooses the new route for specific prompts but preserves broader category routes for broad prompts.
- Confirm OCR routing recommends the new route for scanned problem language.
- Confirm related lessons and quizzes appear from calculator page menus.
- Confirm quiz explanations teach route choice and not only answer correctness.

