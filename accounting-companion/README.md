# AccCalc

AccCalc is a browser-first accounting learning and productivity system for solving, checking, organizing, and reviewing accounting coursework in one place. Version `12.4.0` is the personalization and settings cleanup release: it expands the theme system with palette-led families, makes Appearance much more compact in Settings, and applies theme state earlier so customization feels premium instead of intrusive.

## What 12.4.0 Changes

- preserves the existing Classic theme while adding Butter, Moss, Palm, Guava, Sunset, Sangria, Seabreeze, Lagoon, and Odyssey
- reorganizes Appearance around a compact summary card, a small mode selector, a quick family strip, and a discoverable theme gallery
- keeps light, dark, and system mode behavior persistent and reliable across reloads
- maps older stored theme-family values to the closest new palette family during the upgrade
- reduces settings bulk so the theme system feels richer without turning Settings into a playground

## Theme System

Important files:

- `src/utils/themePreferences.ts`
- `src/utils/appSettings.ts`
- `src/features/layout/AppLayout.tsx`
- `src/main.tsx`
- `src/index.css`

Theme-system rules in `12.4.0`:

- Classic remains the safe default.
- Every family works in light, dark, and system mode.
- Theme families are palette-led, not random one-off color swaps.
- Legacy stored families migrate safely to the closest new family.
- Theme state applies before React mounts to reduce flicker.

## Appearance Settings Direction

Important files:

- `src/features/meta/SettingsContent.tsx`
- `src/features/meta/SettingsDrawer.tsx`
- `src/features/meta/SettingsPage.tsx`

Appearance now follows one rule:

- essential controls visible first
- richer browsing discoverable on demand

Practical application:

- current mode and family are visible in one compact summary card
- quick family switching happens from a smaller swatch strip
- the full gallery stays available without dominating the page
- contrast and motion controls remain nearby, but no longer feel buried under theme cards

## Main Product Areas

- `Smart Tools`: Smart Solver, Scan & Check, OCR-assisted review, route discovery
- `Study Hub`: module browsing, lessons, quizzes, progress, resume behavior
- `Workpapers`: assignment-friendly templates, workbook editing, calculator-to-workpaper flows
- `FAR / AFAR`: statements, leases, foreign currency, partnerships, combinations, reporting support
- `Cost / Managerial / MS`: CVP, decision tools, budgets, costing, variances, planning, performance
- `Taxation`: VAT, withholding, percentage tax, estate, donor's, DST, book-tax and compliance review support
- `Audit / AIS / Governance / RFBT / Strategic`: reviewer workspaces, lessons, and connected decision support tools

## Running The App

```bash
npm install
npm run dev
```

## Common Development Commands

```bash
npm run dev
npm test
npm run build
npm run lint
```

## Project Structure

```text
accounting-companion/
  src/
    components/               Shared UI blocks, overlays, and page shells
    features/                 Route-level product areas
    hooks/                    Shared behavioral hooks such as scroll locking
    utils/                    Shared math, release data, search, parsing, settings, and assumptions
  tests/                      Shared math, discovery, workpaper, and regression coverage
  docs/                       Release notes, system overview, maintenance notes, HTML/PDF handoff docs
```

## Rules For Future Pages

1. Define the page's single dominant task before adding sections.
2. Keep the main action and main result visible before secondary help.
3. Remove redundant labels and explanation chrome that only describe the system itself.
4. Move optional details into disclosures, menus, or secondary panels when they are not needed immediately.
5. When adding overlays, use the shared viewport portal and shell metrics instead of inventing a new sizing model.
6. Prefer small, safe responsiveness wins over flashy but fragile layout tricks.
7. Add regression coverage when shared logic changes.

## Validation Status For 12.4.0

The final `12.4.0` release is validated with:

```bash
npm test
npm run build
npm run dev
```

The dev check should remain a bounded probe so no long-running local server is left hanging in the terminal. For theme and settings work, the final manual pass should include light/dark/system switching, family persistence, and a narrow-screen review of the Appearance section.
