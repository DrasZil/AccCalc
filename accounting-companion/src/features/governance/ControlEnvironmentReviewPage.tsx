import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";
import { computeControlEnvironmentStrength } from "../../utils/calculatorMath";

type EnvironmentBand = 25 | 50 | 75 | 100;

const BAND_OPTIONS: Array<{ label: string; value: EnvironmentBand }> = [
    { label: "Weak", value: 25 },
    { label: "Developing", value: 50 },
    { label: "Strong", value: 75 },
    { label: "Leading", value: 100 },
];

export default function ControlEnvironmentReviewPage() {
    const [oversightStrength, setOversightStrength] = useState<EnvironmentBand>(75);
    const [ethicsProgramStrength, setEthicsProgramStrength] =
        useState<EnvironmentBand>(75);
    const [accountabilityStrength, setAccountabilityStrength] =
        useState<EnvironmentBand>(50);
    const [competenceStrength, setCompetenceStrength] = useState<EnvironmentBand>(75);
    const [escalationStrength, setEscalationStrength] = useState<EnvironmentBand>(50);

    const result = useMemo(
        () =>
            computeControlEnvironmentStrength({
                oversightStrength,
                ethicsProgramStrength,
                accountabilityStrength,
                competenceStrength,
                escalationStrength,
            }),
        [
            accountabilityStrength,
            competenceStrength,
            escalationStrength,
            ethicsProgramStrength,
            oversightStrength,
        ]
    );

    const rows = [
        ["Oversight strength", oversightStrength, setOversightStrength],
        ["Ethics program", ethicsProgramStrength, setEthicsProgramStrength],
        ["Accountability", accountabilityStrength, setAccountabilityStrength],
        ["Competence", competenceStrength, setCompetenceStrength],
        ["Escalation path", escalationStrength, setEscalationStrength],
    ] as const;

    return (
        <CalculatorPageLayout
            badge="Governance & Ethics"
            title="Control Environment Review"
            description="Evaluate oversight, ethics, accountability, competence, and escalation readiness so governance and internal-control answers feel more disciplined."
            inputSection={
                <div className="space-y-4">
                    {rows.map(([label, value, setter]) => (
                        <SectionCard key={label}>
                            <p className="app-card-title text-sm">{label}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {BAND_OPTIONS.map((option) => (
                                    <button
                                        key={option.label}
                                        type="button"
                                        onClick={() => setter(option.value)}
                                        className={[
                                            "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                                            value === option.value
                                                ? "app-button-primary"
                                                : "app-button-ghost",
                                        ].join(" ")}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </SectionCard>
                    ))}
                </div>
            }
            resultSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-section-kicker text-[0.68rem]">
                            Control-environment signal
                        </p>
                        <h2 className="app-section-title mt-2">
                            {result.controlEnvironmentAverage.toFixed(1)} / 100
                        </h2>
                        <p className="app-body-md mt-3 text-sm">{result.environmentSignal}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.68rem]">
                                Override risk index {result.overrideRiskIndex.toFixed(1)}
                            </span>
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.68rem]">
                                Strongest when escalation is usable
                            </span>
                        </div>
                    </SectionCard>
                    <SectionCard>
                        <p className="app-card-title text-sm">Review prompts</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                            <li>Say whether the weakness is tone-at-the-top, structure, or follow-through.</li>
                            <li>Link ethics, competence, and escalation instead of judging one in isolation.</li>
                            <li>State how override risk affects reporting, compliance, and assurance response.</li>
                            <li>Recommend one preventive and one monitoring improvement.</li>
                        </ul>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <RelatedLinksPanel
                    title="Governance next steps"
                    summary="Move into the ethics, risk, or study routes when the case expands beyond the control environment itself."
                    badge="3 routes"
                    items={[
                        {
                            path: "/governance/risk-control-matrix",
                            label: "Risk and Control Matrix",
                            description:
                                "Use for inherent-risk, control-design, and residual-risk framing.",
                        },
                        {
                            path: "/governance/ethics-decision-workspace",
                            label: "Ethics Decision Workspace",
                            description:
                                "Use when governance pressure and stakeholder consequences are the main issue.",
                        },
                        {
                            path: "/study/topics/governance-control-environment-and-ethical-escalation",
                            label: "Governance lesson module",
                            description:
                                "Open the lesson for control environment, override risk, and escalation continuity.",
                        },
                    ]}
                    showDescriptions
                />
            }
        />
    );
}
