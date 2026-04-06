# Formula Intelligence in AccCalc 2.8.0

## Purpose
The formula-intelligence layer lets a calculator solve for different variables without turning each page into a custom reverse-solve implementation.

## Design goals
- reusable across many calculators
- safe by default
- explicit about assumptions and limits
- easy to extend
- compatible with Smart Solver route state

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

## Testing guidance
For each supported target:
- test a standard forward case
- test at least one reverse case
- test one invalid-domain case
- test the displayed or formatted output only when shared formatting matters

## Extension notes
When adding a new definition:
- keep field keys stable
- keep target summaries short
- reuse shared math helpers
- prefer route-state preselection over page-local parsing
- add Smart Solver target rules only when phrasing is distinctive enough
