# AccCalc System Overview v12.4.0

## Release Positioning

Version `12.4.0` is a personalization-system and settings-organization release. It does not change the app's functional accounting coverage. Instead, it expands theme options, tightens the token model, and reduces appearance-setting bulk.

## Key Architectural Surfaces

### Theme Definition Layer

- `src/utils/themePreferences.ts`
- `src/utils/appSettings.ts`

These files now define:

- the active theme-family registry
- the legacy-family migration map
- theme meta colors for light and dark mode
- persistent theme preference and family storage

### Early Theme Application

- `src/main.tsx`
- `src/features/layout/AppLayout.tsx`

This release now applies theme state in two phases:

- before React mounts, the app reads stored settings and applies theme, family, contrast, motion, and meta theme-color
- after mount, AppLayout keeps the document state synchronized with live settings changes

### Appearance Settings UI

- `src/features/meta/SettingsContent.tsx`
- `src/features/meta/SettingsDrawer.tsx`
- `src/features/meta/SettingsPage.tsx`

This release changes the Appearance IA:

- summary first
- core controls visible first
- full theme browsing behind a lighter secondary gallery

## Theme Token Direction

The token system remains CSS-variable driven in `src/index.css`, but now has a clearer family-driven structure for:

- accent and secondary accent
- border emphasis
- chrome atmosphere and background orbs
- chip tones
- chart accents
- workspace atmosphere and overlay tint

## Known Limitations

- The theme gallery is still an inline secondary panel rather than a dedicated modal or sheet.
- Theme previews are representative UI samples, not full live embedded page previews.
- The release improves appearance density and polish more than raw bundle size.
