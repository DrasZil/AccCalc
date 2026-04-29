import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";

type RiskLevel = "low" | "moderate" | "high";
type RiskRow = [label: string, value: RiskLevel, setter: (next: RiskLevel) => void];

const SCORE: Record<RiskLevel, number> = { low: 1, moderate: 2, high: 3 };

export default function FraudRiskResponsePlannerPage() {
    const [pressure, setPressure] = useState<RiskLevel>("high");
    const [opportunity, setOpportunity] = useState<RiskLevel>("moderate");
    const [rationalization, setRationalization] = useState<RiskLevel>("moderate");
    const [managementOverride, setManagementOverride] = useState<RiskLevel>("high");
    const [evidenceQuality, setEvidenceQuality] = useState<RiskLevel>("moderate");
    const [caseFacts, setCaseFacts] = useState(
        "Revenue growth target is aggressive, manual journal entries increased near year-end, and review evidence is mostly internal."
    );

    const rows: RiskRow[] = [
        ["Pressure / incentive", pressure, setPressure],
        ["Opportunity", opportunity, setOpportunity],
        ["Rationalization signal", rationalization, setRationalization],
        ["Management override", managementOverride, setManagementOverride],
        ["Evidence quality concern", evidenceQuality, setEvidenceQuality],
    ];

    const result = useMemo(() => {
        const score = rows.reduce((sum, [, value]) => sum + SCORE[value], 0);
        const tier =
            score >= 12
                ? "High fraud-risk response"
                : score >= 8
                  ? "Focused fraud-risk response"
                  : "Baseline fraud-risk awareness";
        const response =
            score >= 12
                ? "Add unpredictability, expand journal-entry testing, corroborate management explanations externally where possible, and escalate governance visibility."
                : score >= 8
                  ? "Target the risk area with stronger inquiry, analytics, document inspection, and reviewer sign-off."
                  : "Keep professional skepticism documented and maintain routine fraud-risk procedures.";
        const governanceStep =
            managementOverride === "high" || evidenceQuality === "high"
                ? "Include audit committee or oversight escalation in the case answer."
                : "Document reviewer challenge and follow-up evidence before concluding.";

        return { score, tier, response, governanceStep };
    }, [evidenceQuality, managementOverride, rows]);

    return (
        <CalculatorPageLayout
            badge="Governance | Ethics | Audit"
            title="Fraud Risk Response Planner"
            description="Convert fraud-triangle and management-override signals into a documented response plan for audit, governance, ethics, and internal-control cases."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <label className="app-label mb-2 block" htmlFor="fraud-risk-facts">
                            Case facts
                        </label>
                        <textarea
                            id="fraud-risk-facts"
                            value={caseFacts}
                            onChange={(event) => setCaseFacts(event.target.value)}
                            className="app-field min-h-28 w-full rounded-[1rem] px-3.5 py-2.5 outline-none"
                        />
                    </SectionCard>
                    <SectionCard>
                        <div className="grid gap-4 md:grid-cols-2">
                            {rows.map(([label, value, setter]) => (
                                <div key={label} className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                    <p className="app-card-title text-sm">{label}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {(["low", "moderate", "high"] as RiskLevel[]).map((level) => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => setter(level)}
                                                className={[
                                                    "rounded-full px-3 py-1.5 text-xs font-semibold capitalize",
                                                    value === level ? "app-button-primary" : "app-button-ghost",
                                                ].join(" ")}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </div>
            }
            resultSection={
                <div className="space-y-4">
                    <ResultGrid columns={3}>
                        <ResultCard title="Risk Score" value={`${result.score} / 15`} tone="accent" />
                        <ResultCard
                            title="Response Tier"
                            value={result.tier}
                            tone={result.score >= 12 ? "warning" : "default"}
                        />
                        <ResultCard
                            title="Governance"
                            value={managementOverride === "high" ? "Escalate" : "Document"}
                        />
                    </ResultGrid>
                    <SectionCard>
                        <p className="app-card-title text-sm">Planned response</p>
                        <p className="app-body-md mt-2 text-sm">{result.response}</p>
                    </SectionCard>
                    <SectionCard>
                        <p className="app-card-title text-sm">Governance note</p>
                        <p className="app-body-md mt-2 text-sm">{result.governanceStep}</p>
                        <p className="app-helper mt-3 text-xs">
                            This is a reviewer aid for structured case answers, not a legal or audit-opinion conclusion.
                        </p>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <RelatedLinksPanel
                    title="Continue the case"
                    summary="Connect fraud risk to audit procedures, governance escalation, and control redesign."
                    badge="3 routes"
                    items={[
                        {
                            path: "/audit/evidence-program-builder",
                            label: "Audit Evidence Program Builder",
                            description: "Translate fraud risk into stronger evidence expectations.",
                        },
                        {
                            path: "/governance/governance-escalation-planner",
                            label: "Governance Escalation Planner",
                            description: "Choose an escalation tier when override or stakeholder exposure is high.",
                        },
                        {
                            path: "/governance/control-environment-review",
                            label: "Control Environment Review",
                            description: "Review tone at the top, board oversight, and accountability.",
                        },
                    ]}
                    showDescriptions
                />
            }
        />
    );
}
