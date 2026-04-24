# AccCalc v12.4.0 Release Notes

AccCalc `12.4.0` is a combined personalization and academic-expansion release. It keeps Appearance compact and polished, but more importantly it adds practical classroom coverage in weaker tracks and tightens the lesson -> practice -> solve loop so the app feels more complete as a study-and-solving system.

## Main Product Changes

- Added `Audit Misstatement Evaluation Workspace` for tolerable-misstatement follow-up, sampling-risk allowance, and qualitative concern framing.
- Added `Segregation of Duties Conflict Matrix` for AIS and IT-audit prompts about incompatible duties, compensating review, and role-overlap risk.
- Added `Governance Escalation Planner` for management-override, stakeholder-exposure, documentation, and escalation-tier judgment.
- Added new study topics and quiz support for receivables estimation with cash discounts and for managerial cost behavior with margin of safety.
- Tightened Study Hub, Practice Hub, and quiz result linking so students can move directly between lesson, quiz, and calculator instead of bouncing through generic hubs.
- Preserved the familiar working themes while keeping the compact Appearance summary, quick family strip, and discoverable gallery model.

## Calculator And Tool Expansion

- `/audit/misstatement-evaluation-workspace`
- `/ais/segregation-of-duties-conflict-matrix`
- `/governance/governance-escalation-planner`

These are not toy formulas. Each one is built as a structured academic workspace with interpretation, judgment guidance, and related-study links.

## Learning And Practice Expansion

New study additions in `12.4.0`:

- `far-receivables-estimation-and-cash-discount-discipline`
- `managerial-cost-behavior-and-margin-safety`

Lesson support now includes:

- topic-specific summaries and worked guidance
- related calculator wiring
- topic-level quiz sets
- better return paths from quiz results back to the lesson or tool

## Integration Loop

The release strengthens one rule across the touched topics:

- learn in the lesson
- practice in the quiz
- solve in the calculator
- return to the weak point quickly

Concrete changes:

- Study Hub topic cards can open the first linked tool directly.
- Practice Hub now surfaces weak topics for review and can open the nearest linked calculator.
- Quiz results now recommend the lesson and related tools instead of only generic study navigation.
- Smart Solver and app search now recognize the new audit, AIS, and governance routes.

## Personalization And Settings

Appearance remains compact:

- summary first
- light/dark/system visible first
- quick family strip visible first
- richer gallery on demand

Theme coverage now includes both:

- restored familiar families: `Classic`, `Ocean`, `Slate`, `Rose`, `Blossom`, `Lavender`, `Emerald`
- palette-led additions: `Butter`, `Moss`, `Palm`, `Guava`, `Sunset`, `Sangria`, `Seabreeze`, `Lagoon`, `Odyssey`

## Validation

Final validation for `12.4.0` uses:

- `npm test`
- `npm run build`
- a bounded `npm run dev -- --host 127.0.0.1` probe

Manual spot checks should still include:

- Study Hub and Practice Hub lesson/tool/quiz links
- Smart Solver routing for the new audit, AIS, and governance prompts
- Appearance switching and persistence across reload
