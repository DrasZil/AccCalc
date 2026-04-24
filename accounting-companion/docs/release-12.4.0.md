# AccCalc v12.4.0 Release Notes

AccCalc `12.4.0` is the personalization and settings cleanup release. It expands the theme system with palette-led families inspired by Butter, Moss, Palm, Guava, Sunset, Sangria, Seabreeze, Lagoon, and Odyssey while making Appearance in Settings much more compact and easier to browse.

## Main Product Changes

- Preserved `Classic` as the default theme and added nine palette-led families with light and dark behavior.
- Rebuilt Appearance so users start with a compact summary, mode selector, and quick family strip instead of a large always-visible theme wall.
- Moved the richer theme browsing experience into a discoverable gallery.
- Applied theme, family, contrast, motion, and meta theme-color state before React mounts.
- Added safe migration for older stored family values.

## Theme System

- `Classic`
- `Butter`
- `Moss`
- `Palm`
- `Guava`
- `Sunset`
- `Sangria`
- `Seabreeze`
- `Lagoon`
- `Odyssey`

These families are palette-led, not one-off color swaps. Each theme keeps the same product structure while shifting chrome, accents, and atmospheric tints more intentionally.

## Settings Organization

- Appearance now leads with one summary card instead of many large preview blocks.
- The light/dark/system control stays visible first.
- Quick theme switching happens through a compact family strip.
- The full gallery stays available on demand.
- Contrast and motion controls remain nearby without crowding the page.

## Validation

Final validation for `12.4.0` uses:

- `npm test`
- `npm run build`
- a bounded `npm run dev -- --host 127.0.0.1` probe
