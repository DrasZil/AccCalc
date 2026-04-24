# AccCalc Maintenance Playbook v12.4.0

## First Read

This version hardens the personalization system around four rules:

- keep Classic safe
- add new families through shared tokens
- keep Appearance compact by default
- apply theme state before React mounts

## Main Files To Know

- `src/utils/themePreferences.ts`
- `src/utils/appSettings.ts`
- `src/main.tsx`
- `src/features/layout/AppLayout.tsx`
- `src/features/meta/SettingsContent.tsx`
- `src/index.css`
- `src/utils/appRelease.ts`

## Theme Rules For Future Work

1. Add new families in `src/utils/themePreferences.ts` first.
2. Keep the theme registry palette-led and intentional.
3. Update `getThemeMetaColor()` when a new family is added.
4. Extend the CSS token overrides in `src/index.css` rather than hardcoding component-level colors.
5. If an old stored family is replaced, add a migration mapping instead of breaking persistence.

## Appearance Settings Rules

1. Keep mode switching and current-theme summary visible first.
2. Put richer gallery browsing behind a secondary interaction.
3. Do not let Appearance dominate the full settings page height.
4. Keep family tiles compact and clearly selected.
5. Preserve clean wrapping on mobile, tablet, laptop, and desktop widths.

## Validation

Minimum release validation:

- `npm test`
- `npm run build`
- bounded `npm run dev -- --host 127.0.0.1` probe
- manual light, dark, and system switching
- manual persistence check across reload
- manual narrow-screen review of the Appearance section
