# Formula Intelligence in AccCalc 3.0.0

## Purpose
The formula-intelligence layer lets a calculator solve for different variables without turning each page into a custom reverse-solve implementation. It remains the preferred pattern for formula-driven tools where the reverse path is safe, stable, and explainable.

## Design goals
- reusable across many calculators
- safe by default
- explicit about assumptions and limits
- easy to extend
- compatible with Smart Solver route state
- compact enough for mobile-first UI

## Main pieces
- `src/utils/formulaIntelligence.ts`: shared types for fields, targets, results, and definitions
- `src/utils/formulaSolveDefinitions.ts`: supported formula catalogs and solve logic
- `src/components/FormulaSolveWorkspace.tsx`: shared adaptive UI
- `src/features/smart/smartSolver.targets.ts`: target-intent suggestions from user prompts

## Flow
1. A page selects one `FormulaCalculatorDefinition`.
2. The workspace resolves the active solve target.
3. The target determines which fields stay visible as inputs.
4. The solve function validates the visible inputs and computes the target.
5. The workspace renders the primary result, supporting metrics, formula, steps, assumptions, and warnings.

## Safe reverse-solve checklist
Only implement reverse solve when:
- the target can be isolated algebraically or with bounded numerical solving
- invalid domains can be detected early
- the result can be explained in plain language
- the calculator remains usable on mobile without exposing too many moving parts

Avoid reverse solve when:
- multiple materially different solutions are expected
- the user has not provided enough structure
- the workflow really belongs in a schedule or table workspace

If numerical solving is required:
- use bounded search or deterministic iteration
- enforce maximum iterations
- enforce explicit tolerance
- return a plain-language failure state when convergence does not occur
- warn when multiple valid answers may exist

## Adaptive validation rules
Each solve target should define:
- which fields remain visible
- which values cannot be zero or negative
- domain-specific constraints
- empty-state guidance that mentions the currently needed inputs
- warnings or assumptions that matter for the chosen target

The shared workspace should do most of the UI work. Keep target-specific branching inside the definition, not scattered across pages.

## Smart Solver handoff
Smart Solver may pass:
- route selection
- target selection
- extracted field hints

It should only preselect a target when intent is strong enough. Weak target confidence should still open the correct calculator without forcing a mode the user did not clearly ask for.

## Testing guidance
For each supported target:
- test one standard forward case
- test at least one reverse case when applicable
- test at least one invalid-domain case
- test target-specific failure messaging when numerical solving is involved
- test Smart Solver target intent when the target is discoverable from natural language

## Extension notes
When adding a new definition:
- keep field keys stable
- keep target summaries short
- reuse shared math helpers
- prefer route-state preselection over page-local parsing
- add Smart Solver target rules only when phrasing is distinctive enough
- avoid turning a schedule-style page into a fake universal solver
