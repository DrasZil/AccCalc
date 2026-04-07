# AccCalc 2.9.0 Release Notes

## Theme
Foundation upgrade for a cleaner shell, stronger settings architecture, and smarter guided calculator behavior.

## Highlights
- Reworked the shell for compact mobile chrome and less top-heavy calculator pages.
- Added a category-driven settings system for appearance, calculator behavior, AI, offline use, accessibility, and updates.
- Added high-contrast mode and stronger shell-level accessibility treatment.
- Upgraded Smart Solver guidance with compute, beginner, and professional lenses.
- Tightened shared navigation and sidebar behavior for larger category volume.

## Product impact
`2.9.0` is the release that makes the app easier to scan, easier to control, and easier to grow without becoming messier.

## Main technical areas
- `src/features/layout/*`
- `src/components/CalculatorPageLayout.tsx`
- `src/features/meta/SettingsContent.tsx`
- `src/utils/appSettings.ts`
- `src/features/smart/SmartSolverPage.tsx`
- `src/index.css`

## Notes
- This release is foundational. It improves how the app behaves before adding broader 3.0 feature expansion.
- Offline behavior remains truthful and unchanged in principle: routes are offline-safe after the current release is cached.
