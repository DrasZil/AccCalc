# AccCalc v8.1.0 Release Notes

Release date: `2026-04-22`

## Summary

AccCalc `8.1.0` is a focused follow-up release on top of `8.0.0`. It restores local Windows development, fixes the theme settings overlap on larger screens, tightens a few rough integration points, and adds another managerial-accounting tool that is fully wired into the existing discovery and learning systems.

## Major Fixes

- Fixed `npm run dev` so local Vite startup no longer crashes while loading config on Windows
- Moved runtime Vite loading to `vite.config.mjs`
- Made package-version loading BOM-safe inside the Vite config
- Updated build scripts so production builds explicitly use the runtime config file
- Fixed the theme family picker layout so swatches and cards wrap cleanly on laptop and desktop widths
- Fixed the settings quick-stats memo so theme-family changes update immediately

## New Academic Addition

- `Transfer Pricing Support`

This route adds:

- minimum transfer price analysis
- market-based ceiling reading
- negotiation-range width support
- Smart Solver target mapping
- OCR route detection
- search aliases and catalog metadata
- linked study content
- a workpaper template

## Reliability And Maintainability

- added missing Smart Solver field metadata for transfer-pricing inputs and outputs
- added regression tests for transfer-pricing math, solve definitions, search, Smart Solver intent, and workpaper registration
- replaced the oversized runtime release-history payload with concise `8.1.0` metadata in `src/utils/appRelease.ts`
- kept tax assumptions centralized in `src/utils/taxConfig.ts`

## Validation

```bash
npm test
npm run build
```

Both commands passed for the final `8.1.0` state.

`npm run dev` was intentionally not left running in the terminal after validation because it is a long-lived local server, but the original config-load crash path was removed by the runtime-config refactor.

## Known Remaining Limits

- `WorkpaperStudioPage`, `appCatalog`, `formulaSolveDefinitions`, and `main` still contribute the largest production chunks
- the new transfer-pricing route is an educational negotiation-range helper, not a full divisional-behavior simulator
- the tax tools remain classroom-oriented helpers rather than filing or legal-advice systems
