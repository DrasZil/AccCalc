# AccCalc Maintenance Playbook v13.2.0

## Onboarding Rules

1. Keep tutorial steps concise and action-oriented.
2. Prefer real completion checks over passive Next-only slides.
3. Every route, action, or input step needs a fallback so users cannot get stuck.
4. Add new steps in `onboardingTours.ts`; avoid scattering copy across shell components.
5. Use `data-onboarding-target` and `data-onboarding-action` for new targets.
6. Keep Settings replay controls working after any shell or settings refactor.

## State Rules

- Onboarding state is local to the browser.
- Storage must sanitize corrupted or missing values.
- First-run and returning-user behavior must remain version-aware.
- Replay should not permanently alter the user's ability to dismiss future prompts.

## Responsive QA Checklist

- Mobile tutorial cards stay above the bottom nav.
- Desktop cards anchor near the target without covering it.
- Missing targets show fallback guidance.
- Search, Settings, navigation, route, and input steps can auto-complete.
- Skip, close, back, and continue-anyway behavior remains available.

## Educational-Use Notices

Keep notices present for tax, audit, legal/RFBT, governance, and AIS reviewer surfaces. The goal is clear scoped guidance, not noisy legal text.

## Generated Test Output

Do not re-track `.test-dist`. Tests compile into `node_modules/.cache/accalc-test-dist`, which is ignored through `node_modules/`.

