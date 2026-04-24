# AccCalc Maintenance Playbook v12.3.0

## First Read

This version hardens Smart Solver and OCR around four rules:

- topic family first
- route-aware extraction second
- one selected-route source of truth in the UI
- review-first behavior when the signal is mixed

## Main Files To Know

- `src/features/smart/smartSolver.engine.ts`
- `src/features/smart/smartSolver.types.ts`
- `src/features/smart/SmartSolverPage.tsx`
- `src/features/smart/utils/solverConfidence.ts`
- `src/features/smart/utils/valueExtraction.ts`
- `src/features/smart/utils/extractedInputReview.ts`
- `src/features/scan-check/services/ocr/ocrParser.ts`
- `src/features/smart/smartSolver.evaluationPack.ts`
- `src/utils/appRelease.ts`

## Routing Rules For Future Work

1. Do topic-family classification before generic field extraction.
2. Prefer narrowing to one or two likely route families over extracting across the whole app.
3. Keep secondary routes separated from primary prepared inputs.
4. Add contradiction pressure when wording strongly conflicts with a route family.
5. Do not let generic finance words outrank distinctive accounting-topic evidence.

## Extraction Rules

1. Preserve comma-separated amounts during normalization.
2. Reject calendar years from money or percent fields unless the field truly expects a year.
3. Keep percent extraction tied to percent-like wording.
4. Add route-specific wording patterns when classroom prompts are missing obvious field labels.
5. Prefer dropping a suspicious mapping over forcing it into a field.

## Smart Solver UI Rules

1. Best Match, confidence, prepared inputs, feedback, and actions must all derive from the active selected route.
2. If confidence is low, the CTA language must sound low-confidence too.
3. Do not show secondary-route fields inside the primary prepared-input view.
4. Keep low-confidence parser detail collapsed by default.

## Evaluation Workflow

1. Add or update cases in `src/features/smart/smartSolver.evaluationPack.ts` when routing logic changes.
2. Keep coverage for FAR, AFAR, Cost & Managerial, Audit, Tax, study-first, and OCR flows.
3. Validate both direct prompts and more natural classroom wording.
4. If a case is intentionally review-first, assert that it stays uncertain instead of forcing a match.

## Validation

Minimum release validation:

- `npm test`
- `npm run build`
- bounded `npm run dev -- --host 127.0.0.1` probe
- at least one Smart Solver prompt spot check
- at least one OCR-assisted parsing spot check
