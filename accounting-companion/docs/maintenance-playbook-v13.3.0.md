# AccCalc 13.3.0 Maintenance Playbook

## Adding Future Completion Topics

1. Add the shared computation or scoring helper in `src/utils/calculatorMath.ts` when the topic is computational or rubric-based.
2. Add the page under the closest subject folder.
3. Register the route in `src/App.tsx`.
4. Add route metadata in `src/utils/appCatalog.ts`.
5. Add Smart Solver mapping in `src/features/smart/smartSolver.engine.ts`.
6. Add OCR routing patterns in `src/features/scan-check/services/ocr/ocrRouting.ts` when scanned prompts are likely.
7. Add a lesson and quiz in a study expansion file.
8. Add workpaper support if the topic produces assumptions, schedules, or multi-step conclusions.
9. Add tests for math, search, Smart Solver, OCR, study, and templates.

## Page-Clarity Rule

Keep the first screen useful without a lecture. A page should show:

- when to use it
- what inputs matter
- what output it returns
- where to continue

Do not bury the main calculator or reviewer flow under long explanatory panels.

## Educational-Scope Rule

Tax, audit, legal/RFBT, governance, and AIS pages must avoid overclaiming authority. Keep reminders clear and contextual. Use official sources or qualified advisers for current law, tax authority rules, professional standards, and real incident or engagement work.

## Validation Checklist

- `npm test`
- `npm run build`
- bounded `npm run dev` smoke probe
- open representative new pages
- verify Study Hub topics and quizzes
- verify Smart Solver and OCR routing
- verify workpaper template registration
