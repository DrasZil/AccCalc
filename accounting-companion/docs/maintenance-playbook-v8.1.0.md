# AccCalc Maintenance Playbook v8.1.0

## First Steps For A Returning Maintainer

1. Read `README.md`
2. Read `docs/release-8.1.0.md`
3. Read `docs/system-overview-v8.1.0.md`
4. Open `src/App.tsx`, `src/utils/appCatalog.ts`, `src/utils/calculatorMath.ts`, and `src/utils/formulaSolveDefinitions.ts`
5. Run `npm test`
6. Run `npm run build`

## Safe Extension Pattern

When adding or fixing features, prefer this sequence:

1. shared math
2. solve definition or workspace logic
3. page route
4. catalog and aliases
5. Smart Solver
6. OCR routing
7. study content
8. workpaper template
9. tests
10. docs

## Files To Check Together

For new calculator routes:

- `src/App.tsx`
- `src/utils/appCatalog.ts`
- `src/utils/calculatorMath.ts`
- `src/utils/formulaSolveDefinitions.ts`
- `src/features/smart/smartSolver.engine.ts`
- `src/features/smart/smartSolver.targets.ts`
- `src/features/scan-check/services/ocr/ocrRouting.ts`
- `src/utils/formulaStudyContent.tsx`
- `src/features/study/studyExpansion450.ts`
- `src/features/workpapers/workpaperTemplates.ts`
- `tests/calculatorMath.test.ts`

## Local Development And Vite Notes

`8.1.0` fixes a real Windows startup regression.

The important rules now are:

- runtime Vite loading lives in `vite.config.mjs`
- dev and build scripts explicitly use `--config vite.config.mjs --configLoader native`
- package metadata reads in config time should stay BOM-safe
- do not move version injection back into fragile config-bundling patterns without retesting `npm run dev` on Windows

`vite.config.d.ts` is only a lightweight TypeScript-side stub. Do not treat it as the runtime config source.

## Theme Maintenance

Theme work spans:

- `src/utils/appSettings.ts`
- `src/utils/themePreferences.ts`
- `src/features/meta/SettingsContent.tsx`
- `src/features/layout/AppLayout.tsx`
- `src/index.css`
- `index.html`

When adding a new theme family:

- define it in `themePreferences.ts`
- add CSS token overrides in `index.css`
- surface it in settings
- verify light and dark readability
- verify swatches, labels, and selected states at tablet, laptop, and desktop widths

## Release Metadata Maintenance

Keep `src/utils/appRelease.ts` focused on the current shipping release only.

Do not keep appending large historical note blocks there. Older release history belongs in `docs/`, not in runtime metadata shipped to every client.

## Tax Maintenance

Do not scatter tax assumptions through route pages.

Use:

- `src/utils/taxConfig.ts`

That is the correct place for rates, dates, labels, and visible notes.

## Performance Priorities After 8.1.0

The next safe optimization targets are still:

- `WorkpaperStudioPage` chunk weight
- `appCatalog` bundle weight
- `formulaSolveDefinitions` chunk size
- main shell chunk size

## Validation Standard

Before closing a meaningful change:

```bash
npm test
npm run build
```

Avoid leaving `npm run dev` running for a long unattended session during scripted validation. It is a live server, not a one-shot command.

## Beginner Handoff Advice

If you return months later with low context, trace one feature end-to-end from route to math to study support before making broad edits. The app is large enough now that the shared systems matter more than page-local tweaks.
