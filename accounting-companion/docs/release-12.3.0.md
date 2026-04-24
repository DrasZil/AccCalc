# AccCalc v12.3.0 Release Notes

AccCalc `12.3.0` is the Smart Solver and OCR precision release. It hardens the decision pipeline around topic-first routing, route-family gating, cleaner extraction, and selected-route consistency so the product is safer to trust on longer classroom and assignment-style prompts.

## Main Product Changes

- Rebuilt Smart Solver so topic-family classification happens before extraction and calculator scoring.
- Added route-family gating and contradiction pressure so unrelated generic calculators lose ground when the topic evidence is distinctive.
- Kept secondary routes visible, but separate, so multi-concept prompts do not pollute the selected route's prepared inputs.
- Moved Smart Solver confidence, extraction review, and interpreter messaging onto the selected-route source of truth.
- Applied the same topic-first discipline to OCR parsing and preserved comma-separated classroom amounts during normalization.
- Added a reusable evaluation pack covering FAR, AFAR, Cost & Managerial, Audit, Tax, study-first, and OCR scenarios.

## Topic-First Routing

- Smart Solver now ranks likely topic families before it starts mapping values into fields.
- Strong family signals can gate out unrelated calculators earlier.
- When the family is still close between two routes, extraction can narrow to the top candidates instead of falling back to fully generic parsing.
- Secondary route suggestions remain available, but they no longer contaminate the primary prepared inputs.

## Extraction Hygiene

- stronger year/date guards prevent calendar years from filling money or rate fields
- stronger percent guards reduce false annual-rate or gross-profit-rate assignments
- route-aware field filtering keeps prepared inputs cleaner
- intercompany PPE prompts now recognize transfer-price wording like “sold equipment to subsidiary for …”
- comma-separated classroom amounts now stay intact during normalization instead of being split into partial values

## OCR Structure-First Update

- OCR parsing still cleans raw text first, but now hands the cleaned text through Smart Solver topic-family analysis
- route-aware structured fields are preferred when the routing evidence is stronger than the generic OCR hint set
- OCR recommendations can now reflect secondary related routes without flattening them into the primary autofill path
- low-confidence OCR states remain review-first

## Validation

Final validation for `12.3.0` uses:

- `npm test`
- `npm run build`
- a bounded `npm run dev -- --host 127.0.0.1` probe
