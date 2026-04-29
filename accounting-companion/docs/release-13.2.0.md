# AccCalc v13.2.0 Release Notes

AccCalc `13.2.0` is a focused onboarding, tutorial, and reliability release. It adds a dynamic in-app walkthrough without changing the broader shell design.

## Onboarding Additions

- Added a first-time tutorial covering Home, navigation, search, Smart Solver, calculator inputs, Study Hub, Workpapers, and Settings replay.
- Added a returning-user quick reintroduction prompt for the first open after this release.
- Added replay controls in Settings for the full tutorial, quick tour, and local tutorial-state reset.
- Added responsive tutorial placement: bottom-sheet behavior on mobile and anchored coach cards with spotlight targeting on wider screens.

## Action-Aware Behavior

- Tutorial steps can complete from real route changes.
- Shell steps can detect navigation, search, and Settings actions.
- Calculator guidance can wait for actual input focus or editing.
- Steps include timeout and missing-target fallbacks so users are never trapped.

## Limitation Cleanup

- Added contextual educational-use notices for tax, audit, legal/RFBT, governance, and AIS reviewer pages.
- Moved test compilation output to `node_modules/.cache/accalc-test-dist`.
- Added `.test-dist/` to `.gitignore`.
- Removed tracked `.test-dist` generated files from the repository index.

## Validation

- `npm test`
- `npm run build`
- bounded `npm run dev -- --host 127.0.0.1` probe when practical

