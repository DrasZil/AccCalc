# AccCalc 13.4.0 Maintenance Playbook

## Adding Future Gap-Closure Topics

1. Audit the category first and decide whether the gap needs a calculator, reviewer workspace, lesson, quiz, workpaper, or mixed-review route.
2. Add shared computation or scoring logic in `src/utils/calculatorMath.ts` when the topic is computational or rubric-based.
3. Add the route-level page under the closest subject folder.
4. Register the route in `src/App.tsx`.
5. Add route metadata in `src/utils/appCatalog.ts`.
6. Add Smart Solver mapping in `src/features/smart/smartSolver.engine.ts`.
7. Add OCR routing patterns in `src/features/scan-check/services/ocr/ocrRouting.ts` when scanned prompts are likely.
8. Add original Study Hub lesson and quiz content in a versioned expansion file.
9. Add or update a workpaper template when the topic produces assumptions, schedules, conclusions, or review follow-up.
10. Add tests for math, search, Smart Solver, OCR, Study Hub, and templates.

## Integrated Review Rule

Mixed review should identify what failed, not only whether the final answer was wrong. Keep the five readiness areas stable unless a future release intentionally changes the model:

- topic identification
- computation accuracy
- explanation quality
- assumption discipline
- follow-up completion

## Page-Clarity Rule

Keep the first screen useful without a lecture. A page should show:

- what the page does
- when to use it
- what inputs matter
- what output it returns
- where to continue

Do not bury the primary calculator or reviewer flow under long explanatory panels.

## Educational-Scope Rule

Tax, audit, legal/RFBT, governance, AIS, and integrated-review pages must avoid overclaiming authority. Keep reminders clear and contextual. Use official sources or qualified advisers for current law, tax authority rules, professional standards, incident handling, and real engagement work.

## Validation Checklist

- `npm test`
- `npm run build`
- bounded `npm run dev` smoke probe
- open representative new pages
- verify Study Hub topics and quizzes
- verify Smart Solver and OCR routing
- verify workpaper template registration
- confirm no generated `.test-dist` artifacts are tracked or left dirty
