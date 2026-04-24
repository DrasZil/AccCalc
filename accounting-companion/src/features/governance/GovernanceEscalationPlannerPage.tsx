import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeGovernanceEscalationPlan } from "../../utils/calculatorMath";

type Rating = "low" | "moderate" | "high";

const SCORE: Record<Rating, number> = {
    low: 1,
    moderate: 2,
    high: 3,
};

function RatingRow({
    title,
    value,
    onChange,
}: {
    title: string;
    value: Rating;
    onChange: (value: Rating) => void;
}) {
    return (
        <SectionCard>
            <p className="app-card-title text-sm">{title}</p>
            <div className="mt-3 flex flex-wrap gap-2">
                {(["low", "moderate", "high"] as Rating[]).map((rating) => (
                    <button
                        key={rating}
                        type="button"
                        onClick={() => onChange(rating)}
                        className={[
                            "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize",
                            value === rating ? "app-button-primary" : "app-button-ghost",
                        ].join(" ")}
                    >
                        {rating}
                    </button>
                ))}
            </div>
        </SectionCard>
    );
}

export default function GovernanceEscalationPlannerPage() {
    const [issueArea, setIssueArea] = useState("Revenue pressure and override risk");
    const [issueSeverity, setIssueSeverity] = useState<Rating>("high");
    const [overrideRisk, setOverrideRisk] = useState<Rating>("high");
    const [stakeholderExposure, setStakeholderExposure] = useState<Rating>("high");
    const [documentationStrength, setDocumentationStrength] =
        useState<Rating>("moderate");
    const [oversightReadiness, setOversightReadiness] =
        useState<Rating>("moderate");

    const result = useMemo(
        () =>
            computeGovernanceEscalationPlan({
                issueSeverity: SCORE[issueSeverity],
                overrideRisk: SCORE[overrideRisk],
                stakeholderExposure: SCORE[stakeholderExposure],
                documentationStrength: SCORE[documentationStrength],
                oversightReadiness: SCORE[oversightReadiness],
            }),
        [
            documentationStrength,
            issueSeverity,
            oversightReadiness,
            overrideRisk,
            stakeholderExposure,
        ]
    );

    return (
        <CalculatorPageLayout
            badge="Governance & Ethics"
            title="Governance Escalation Planner"
            description="Translate ethics, override, stakeholder, and oversight signals into a clearer escalation tier so governance cases move from diagnosis into defensible action."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <label className="app-label mb-2 block" htmlFor="issue-area">
                            Governance issue area
                        </label>
                        <input
                            id="issue-area"
                            value={issueArea}
                            onChange={(event) => setIssueArea(event.target.value)}
                            className="app-field w-full rounded-[1rem] px-3.5 py-2.5 text-[0.95rem] outline-none"
                        />
                    </SectionCard>
                    <RatingRow
                        title="Issue severity"
                        value={issueSeverity}
                        onChange={setIssueSeverity}
                    />
                    <RatingRow
                        title="Management override risk"
                        value={overrideRisk}
                        onChange={setOverrideRisk}
                    />
                    <RatingRow
                        title="Stakeholder exposure"
                        value={stakeholderExposure}
                        onChange={setStakeholderExposure}
                    />
                    <RatingRow
                        title="Documentation strength"
                        value={documentationStrength}
                        onChange={setDocumentationStrength}
                    />
                    <RatingRow
                        title="Oversight readiness"
                        value={oversightReadiness}
                        onChange={setOversightReadiness}
                    />
                </div>
            }
            resultSection={
                <div className="space-y-4">
                    <ResultGrid columns={4}>
                        <ResultCard
                            title="Escalation Score"
                            value={result.escalationScore.toFixed(0)}
                            tone="accent"
                        />
                        <ResultCard title="Urgency" value={result.urgency} />
                        <ResultCard
                            title="Escalation Tier"
                            value={result.escalationTier}
                        />
                        <ResultCard
                            title="Evidence Protection"
                            value={result.preserveEvidence ? "Required" : "Normal"}
                        />
                    </ResultGrid>

                    <SectionCard>
                        <p className="app-card-title text-sm">{issueArea}</p>
                        <p className="app-body-md mt-2 text-sm">
                            {result.recommendedMove}
                        </p>
                        <p className="app-helper mt-3 text-xs leading-5">
                            {result.governanceSignal}
                        </p>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-card-title text-sm">Decision prompts</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                            <li>Name the first governance body or role that should respond.</li>
                            <li>Explain whether the main danger is override, stakeholder harm, or weak oversight follow-through.</li>
                            <li>State whether evidence needs protection before escalation is challenged internally.</li>
                        </ul>
                    </SectionCard>

                    <RelatedLinksPanel
                        title="Continue with governance review"
                        summary="Use the linked pages when the issue expands into control environment, ethics, or residual-risk evaluation."
                        badge="3 routes"
                        items={[
                            {
                                path: "/governance/control-environment-review",
                                label: "Control Environment Review",
                                description:
                                    "Check whether tone at the top, accountability, and escalation discipline are strong enough.",
                            },
                            {
                                path: "/governance/ethics-decision-workspace",
                                label: "Ethics Decision Workspace",
                                description:
                                    "Return to the ethics framing when stakeholder impact and pressure signals need a cleaner diagnosis.",
                            },
                            {
                                path: "/study/topics/governance-control-environment-and-ethical-escalation",
                                label: "Governance escalation lesson",
                                description:
                                    "Open the lesson for textbook-style reviewer support on override and escalation logic.",
                            },
                        ]}
                        showDescriptions
                    />
                </div>
            }
        />
    );
}
