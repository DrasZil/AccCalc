# AccCalc

AccCalc is a browser-first accounting learning and productivity system for solving, checking, organizing, and reviewing accounting coursework in one place. Version `12.5.0` is a focused mobile shell reliability release: it makes navigation and settings feel like true app panels on phones and tablets instead of cramped cards inside the page.

## What 12.5.0 Changes

- makes the mobile menu a true full-screen viewport panel with safe-area-aware top and bottom spacing
- makes Settings full-screen on mobile and non-desktop shell widths, removing the side-sheet card constraints
- keeps menu and settings content internally scrollable while the page behind the panel stays locked
- updates contextual page menus and mobile search to follow the same small-screen overlay sizing rules
- prevents menu, search, and settings from stacking into confusing transient states
- documents the mobile overlay contract for future shell work

## Mobile Overlay System

Important files:

- `src/features/layout/AppLayout.tsx`
- `src/features/meta/SettingsDrawer.tsx`
- `src/components/ContextualPageMenu.tsx`
- `src/hooks/useBodyScrollLock.ts`
- `src/index.css`

Overlay rules in `12.5.0`:

- mobile menu, mobile settings, mobile search, and phone page menus are portaled to `document.body`
- full-screen mobile panels use `--app-mobile-panel-height`, backed by the live viewport metric
- safe-area insets are applied inside the panel instead of creating outer margins
- bottom navigation and sticky shell chrome are hidden or covered while transient panels are active
- long panel content scrolls inside the panel while `useBodyScrollLock` freezes the background page
- larger desktop settings still use the existing side panel where it fits the shell

## Theme System

Important files:

- `src/utils/themePreferences.ts`
- `src/utils/appSettings.ts`
- `src/features/meta/SettingsContent.tsx`
- `src/main.tsx`
- `src/index.css`

Theme-system rules remain:

- Classic remains the safe default.
- Familiar and palette-led families stay available.
- Every family works in light, dark, and system mode.
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

## Learn, Practice, Solve

The academic loop remains the working product spine:

- lessons now link more deliberately to the most relevant calculators and quizzes
- practice cards surface linked tools so students can move from a weak quiz score into the exact workspace they need
- quiz results point back to the lesson and forward into related calculators instead of only sending students to a generic study hub
- calculator discovery covers the new audit, AIS, and governance workspaces in the app catalog and Smart Solver

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
5. When adding overlays, use the shared viewport portal, `--app-mobile-panel-height`, and safe-area-aware internal padding instead of inventing a new sizing model.
6. Prefer small, safe responsiveness wins over flashy but fragile layout tricks.
7. Add regression coverage when shared logic changes.

## Validation Status For 12.5.0

The final `12.5.0` release is validated with:

```bash
npm test
npm run build
npm run dev
```

The dev check should remain a bounded probe so no long-running local server is left hanging in the terminal. The final manual pass for `12.5.0` should include:

- mobile menu full-screen behavior at phone widths
- mobile settings full-screen behavior at phone and tablet widths
- safe-area spacing around panel headers and bottom scroll areas
- body scroll lock with long menu/settings content
- no visible competition with sticky top chrome or bottom navigation while panels are open
