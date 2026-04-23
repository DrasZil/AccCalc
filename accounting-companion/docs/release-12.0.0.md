# AccCalc v12.0.0 Release Notes

AccCalc `12.0.0` is the app-wide focus-first organization overhaul. This release is not mainly about adding more pages. It restructures the product so the primary task on each page is clearer, secondary detail stops competing with the main workflow, and broader discovery stays available without flooding the screen.

## Main Product Changes

- Added a shared page-menu pattern for lower-priority content such as orientation help, related study, nearby tools, and route context.
- Reworked the shared calculator shell so inputs and results stay primary while deeper explanation remains available through collapsed support.
- Rebuilt the homepage around next-step decisions instead of a broad feature wall.
- Lightened study side references so lesson reading stays primary.
- Added a Workpaper Studio focus mode so workbook support context can move out of the active editing path.

## Focus-First Organization Work

### Calculator Pages

- Inputs, solve targets, and results now dominate the page.
- Related study and adjacent tools now live behind an intentional page menu.
- Longer explanation stays available, but collapsed by default.

### Homepage

- The first screen now prioritizes:
  - quick solve
  - quick scan
  - workpapers
  - continue learning
  - recent or recommended next tools
- Broader browsing is now grouped into disclosures instead of showing everything up front.

### Study Pages

- Current-module flow and lesson signals are now lighter secondary references.
- The current lesson stays visually dominant.

### Workpaper Studio

- Added `Focus mode` for cleaner worksheet editing.
- Workbook health and workbook context can step out of the way when the user wants a calmer editing surface.
- Workspace utilities remain accessible without taking over the sheet.

## Shared Components And Files

- `src/components/CalculatorPageLayout.tsx`
- `src/components/ContextualPageMenu.tsx`
- `src/components/DisclosurePanel.tsx`
- `src/features/home/HomePage.tsx`
- `src/features/study/StudyTopicPage.tsx`
- `src/features/workpapers/WorkpaperStudioPage.tsx`
- `src/index.css`

## Validation

Final validation for `12.0.0` uses:

- `npm test`
- `npm run build`
- a bounded `npm run dev` probe
