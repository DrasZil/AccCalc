# AccCalc System Overview v12.4.0

## Release Positioning

Version `12.4.0` combines two layers of work:

- compact personalization and settings cleanup
- academic expansion across calculators, lessons, quizzes, and discovery

The important architectural shift is that the app now treats lesson, quiz, and calculator routing as one connected study system instead of three loosely related surfaces.

## Key Academic Surfaces

### New Calculator Coverage

- `src/features/audit/AuditMisstatementEvaluationPage.tsx`
- `src/features/ais/SegregationOfDutiesConflictPage.tsx`
- `src/features/governance/GovernanceEscalationPlannerPage.tsx`
- `src/utils/calculatorMath.ts`

These workspaces extend weak curriculum tracks with structured academic helpers that mix calculation, interpretation, and follow-up guidance.

### Study Content Expansion

- `src/features/study/studyExpansion450.ts`
- `src/features/study/studyExpansion1100.ts`
- `src/features/study/studyContent.ts`

The study layer now has stronger support for:

- receivables estimation and cash discount discipline
- managerial cost behavior and margin-of-safety review
- tighter tool mapping from weak-track lessons into calculators

### Practice And Return Paths

- `src/features/study/StudyHubPage.tsx`
- `src/features/study/StudyPracticeHubPage.tsx`
- `src/features/study/TopicQuizPage.tsx`
- `src/utils/studyProgress.ts`

This release changes the study flow in three practical ways:

- topic cards can open the nearest linked calculator directly
- Practice Hub can surface weaker quiz topics for return study
- quiz results can point students into the relevant lesson or calculator instead of a generic fallback page

### Discovery And Smart Routing

- `src/utils/appCatalog.ts`
- `src/features/smart/smartSolver.engine.ts`
- `src/features/smart/smartSolver.evaluationPack.ts`

Discovery now treats the new academic tools as first-class routes. The AIS logic also separates segregation-of-duties conflict prompts from the broader access-control workspace more clearly.

## Personalization Layer

### Theme Definition And Persistence

- `src/utils/themePreferences.ts`
- `src/utils/appSettings.ts`
- `src/main.tsx`
- `src/index.css`

The personalization model still matters in `12.4.0` because the same release keeps Settings compact while preserving and extending the theme families.

Theme state still follows these rules:

- apply early before React mounts
- keep familiar families available
- add palette-led families through shared tokens
- avoid component-level color hardcoding

### Appearance Settings UI

- `src/features/meta/SettingsContent.tsx`
- `src/features/meta/SettingsDrawer.tsx`
- `src/features/meta/SettingsPage.tsx`

Appearance remains summary-first and compact so the new academic surfaces do not compete with a bulky settings experience elsewhere in the product.

## Known Limitations

- The new academic coverage improves weaker tracks, but it is still a targeted expansion rather than full curriculum parity across every category.
- Study quizzes remain lightweight mini-checks, not large adaptive exams.
- Theme previews are representative UI samples rather than full embedded live-page previews.
- Final confidence still benefits from manual prompt testing on edge Smart Solver phrasing even though the regression pack now covers the new routes.
