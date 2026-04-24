# AccCalc System Overview v12.3.0

## Release Positioning

Version `12.3.0` is a decision-pipeline hardening release for Smart Solver and OCR. It leaves the broader product model intact, but changes how prompts are interpreted, how fields are extracted, and how route state is reflected in the UI.

## Key Architectural Surfaces

### Smart Solver Routing Core

- `src/features/smart/smartSolver.engine.ts`
- `src/features/smart/smartSolver.types.ts`
- `src/features/smart/smartSolver.targets.ts`

These files now define the durable routing rules:

- classify topic family before route extraction
- gate unrelated route families when topic evidence is strong
- keep secondary routes separated from the primary route state
- reject suspicious year/date/percent mappings before they reach prepared inputs

### Smart Solver UI State

- `src/features/smart/SmartSolverPage.tsx`
- `src/features/smart/utils/solverConfidence.ts`
- `src/features/smart/utils/valueExtraction.ts`
- `src/features/smart/utils/extractedInputReview.ts`

These files now enforce:

- one selected-route source of truth for summaries and actions
- route-aware confidence instead of generic top-score confidence
- clearer review-first states when topic-family evidence is weak or contradictory

### OCR Parsing And Routing

- `src/features/scan-check/services/ocr/ocrParser.ts`
- `src/features/scan-check/services/ocr/ocrRouting.ts`
- `src/features/scan-check/services/accounting/accountingFieldExtractor.ts`

This release makes OCR more structurally aware:

- OCR text normalization preserves comma-separated amounts
- Smart Solver topic-family analysis can shape OCR field extraction
- route-specific OCR values are preferred over noisy generic number dumps when confidence is better

## Confidence Model

The routing confidence model in `12.3.0` now reflects:

- topic-family strength
- missing required fields
- contradiction and family-gating pressure
- warning states such as study-first prompts or ambiguous topic families
- route completeness for the currently selected route

## Evaluation Pack

- `src/features/smart/smartSolver.evaluationPack.ts`
- `tests/calculatorMath.test.ts`

The evaluation pack exists to catch routing regressions across:

- direct prompts
- normal classroom wording
- longer assignment-style wording
- OCR-assisted route detection
- uncertainty states where the solver should remain review-first

## Known Limitations

- OCR still benefits from a manual confirmation step for weak images or low-confidence scans.
- Topic-first routing is stronger, but very broad multi-topic prompts can still require a human to choose the final route.
- The release improves correctness and consistency more than bundle size; heavy Smart Solver and Scan & Check surfaces are still worth future performance work.
