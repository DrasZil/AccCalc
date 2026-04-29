# AccCalc System Overview v13.2.0

## Release Positioning

Version `13.2.0` focuses on product onboarding and prior limitation cleanup. The academic system from `13.1.0` remains intact, while the new tutorial layer helps users understand how to move through the app.

## Tutorial Architecture

The onboarding system is split into maintainable pieces:

- `src/features/onboarding/onboardingTours.ts`: structured first-run and quick-tour definitions.
- `src/features/onboarding/onboardingState.ts`: localStorage-backed, version-aware onboarding state.
- `src/features/onboarding/onboardingEvents.ts`: lightweight action events for shell and search completion.
- `src/features/onboarding/OnboardingCoach.tsx`: responsive overlay, spotlight, prompt, action detection, route detection, input detection, skip, close, back, and timeout fallback.

## User Modes

First-time users receive the fuller tutorial. It teaches the app purpose, Home, navigation, search, Smart Solver, calculator inputs, Study Hub, Workpapers, and Settings replay.

Returning users receive a compact reintroduction prompt for this release. They can start the quick tour, skip it, or dismiss future prompts.

## Settings Replay

Settings includes a Guided tutorial section with:

- Replay tutorial
- Run quick tour
- Reset tutorial state

These controls are local-device actions and do not require sign-in.

## Educational-Use Boundaries

`EducationalUseNotice` is surfaced through `CalculatorPageLayout` for tax, audit, legal/RFBT, governance, and AIS-related pages. The notices clarify that these pages are classroom/reviewer support and must not be treated as current tax authority guidance, professional standards, legal advice, audit opinions, or organization-specific policy.

## Generated Artifacts

Test output now compiles to `node_modules/.cache/accalc-test-dist`, and `.test-dist/` is ignored. The tracked generated `.test-dist` tree has been removed from the Git index to prevent validation runs from dirtying the worktree.

