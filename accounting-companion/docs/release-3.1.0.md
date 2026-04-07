# AccCalc 3.1.0 Release Notes

## Theme
Cleaner workflows, stronger educational context, and broader worksheet-style tools.

## Highlights
- Restored richer About this tool guidance across calculator pages.
- Reduced mobile friction with calmer headers, integrated bottom navigation, and no forced mobile search keyboard.
- Reorganized settings and history into cleaner, collapsible, app-like surfaces.
- Upgraded the general calculator into a stronger scientific calculator.
- Added new accounting, economics, and entrepreneurship workspaces with shared analytics and charts.

## New tools and workspaces
### Accounting
- Adjusting Entries Workspace
- Working Capital Planner
- Inventory Control Workspace

### Economics
- Economics Analysis Workspace

### Entrepreneurship
- Entrepreneurship Toolkit

## Product impact
`3.1.0` makes AccCalc feel more teachable and less overwhelming while still expanding capability. The release reduces mobile annoyance, restores educational meaning at the tool level, and adds more worksheet-style workflows that are useful in class, review, and practical planning.

## Main technical areas
- `src/components/ToolAboutPanel.tsx`
- `src/features/layout/AppLayout.tsx`
- `src/features/meta/SettingsContent.tsx`
- `src/features/meta/HistoryPage.tsx`
- `src/features/basic/BasicCalculatorPage.tsx`
- `src/features/accounting/*WorkspacePage.tsx`
- `src/features/economics/EconomicsAnalysisWorkspacePage.tsx`
- `src/features/entrepreneurship/EntrepreneurshipToolkitPage.tsx`
- `src/utils/calculatorMath.ts`

## Notes
- The new workspaces stay deterministic and local-browser based.
- Smart Solver now discovers the new workspaces better, but still falls back safely when a prompt is too vague.
- Offline support still depends on the current release being cached once online.
