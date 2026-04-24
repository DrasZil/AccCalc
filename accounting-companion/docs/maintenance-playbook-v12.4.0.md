# AccCalc Maintenance Playbook v12.4.0

## First Read

This version is maintained around five rules:

- weaker tracks should receive academically useful tools before dense tracks get more filler
- every touched topic should support learn, practice, and solve paths
- Study Hub and Practice Hub should recommend the nearest useful next step
- Smart Solver discovery should treat new academic tools as first-class routes
- Appearance should stay compact even as theme coverage grows

## Main Files To Know

- `src/utils/calculatorMath.ts`
- `src/features/audit/AuditMisstatementEvaluationPage.tsx`
- `src/features/ais/SegregationOfDutiesConflictPage.tsx`
- `src/features/governance/GovernanceEscalationPlannerPage.tsx`
- `src/features/study/studyExpansion450.ts`
- `src/features/study/studyExpansion1100.ts`
- `src/features/study/StudyHubPage.tsx`
- `src/features/study/StudyPracticeHubPage.tsx`
- `src/features/study/TopicQuizPage.tsx`
- `src/features/smart/smartSolver.engine.ts`
- `src/features/smart/smartSolver.evaluationPack.ts`
- `src/utils/themePreferences.ts`
- `src/features/meta/SettingsContent.tsx`
- `src/utils/appRelease.ts`

## Academic Expansion Rules

1. Add new calculator math in `src/utils/calculatorMath.ts` first, then build the page around that shared function.
2. When a new tool is added, wire it into `App.tsx`, `appCatalog.ts`, and Smart Solver discovery in the same pass.
3. Every meaningful new calculator should have lesson support, quiz support, or both.
4. Prefer small, topic-specific quiz sets with good explanations over large filler banks.
5. If a study card or quiz result already knows the closest tool, surface it directly instead of forcing the user back through a generic hub.

## Smart Solver Rules

1. Add new route definitions in `src/features/smart/smartSolver.engine.ts`.
2. Add a matching evaluation case in `src/features/smart/smartSolver.evaluationPack.ts`.
3. Watch for route contamination when a new specialized tool overlaps with a broader existing tool.
4. Keep topic-specific wording on the specialized route so it can beat generic matches when the prompt is distinctive.

## Theme And Appearance Rules

1. Keep the familiar theme families available unless there is an explicit migration plan.
2. Add new families in `src/utils/themePreferences.ts` and token overrides in `src/index.css`.
3. Keep Appearance summary-first and compact in `SettingsContent.tsx`.
4. Avoid turning the settings page into a large theme gallery by default.

## Validation

Minimum release validation:

- `npm test`
- `npm run build`
- bounded `npm run dev -- --host 127.0.0.1` probe
- manual Study Hub and Practice Hub link checks
- manual Smart Solver checks for new routes and route-family conflicts
- manual theme persistence and Appearance density review
