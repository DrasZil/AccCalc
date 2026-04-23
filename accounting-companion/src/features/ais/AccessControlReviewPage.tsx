import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";

type AccessRisk = "low" | "moderate" | "high";
type AccessRiskRow = [label: string, value: AccessRisk, setter: (next: AccessRisk) => void];

const SCORE: Record<AccessRisk, number> = { low: 1, moderate: 2, high: 3 };

export default function AccessControlReviewPage() {
    const [privilegeRisk, setPrivilegeRisk] = useState<AccessRisk>("high");
    const [changeRisk, setChangeRisk] = useState<AccessRisk>("moderate");
    const [monitoringRisk, setMonitoringRisk] = useState<AccessRisk>("moderate");

    const result = useMemo(() => {
        const score = SCORE[privilegeRisk] + SCORE[changeRisk] + SCORE[monitoringRisk];
        const response =
            score >= 8
                ? "High-risk access environment. Prioritize privileged-access review, emergency access logs, independent approval, and monitoring evidence."
                : score >= 6
                  ? "Moderate-risk access environment. Tie role design, change approval, and monitoring to the relevant business process."
                  : "Lower access risk, but still document user provisioning, periodic review, and segregation-of-duties evidence.";
        return { score, response };
    }, [changeRisk, monitoringRisk, privilegeRisk]);

    const riskRows: AccessRiskRow[] = [
        ["Privilege risk", privilegeRisk, setPrivilegeRisk],
        ["Change risk", changeRisk, setChangeRisk],
        ["Monitoring risk", monitoringRisk, setMonitoringRisk],
    ];

    return (
        <CalculatorPageLayout
            badge="AIS / BSAIS"
            title="Access Control Review Workspace"
            description="Review logical access, privileged access, change risk, and monitoring quality so AIS and IT-audit cases become more practical."
            inputSection={
                <SectionCard>
                    <div className="grid gap-4 md:grid-cols-3">
                        {riskRows.map(([label, value, setter]) => (
                            <div key={label}>
                                <p className="app-card-title text-sm">{label}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {(["low", "moderate", "high"] as AccessRisk[]).map((level) => (
                                        <button key={level} type="button" onClick={() => setter(level)} className={["rounded-full px-3 py-1.5 text-xs font-semibold capitalize", value === level ? "app-button-primary" : "app-button-ghost"].join(" ")}>
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            }
            resultSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-section-kicker text-[0.68rem]">Access control risk score</p>
                        <h2 className="app-section-title mt-2">{result.score} / 9</h2>
                        <p className="app-body-md mt-3 text-sm">{result.response}</p>
                    </SectionCard>
                    <SectionCard>
                        <p className="app-card-title text-sm">Evidence checklist</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                            <li>User provisioning and deprovisioning approvals</li>
                            <li>Privileged access logs and emergency access review</li>
                            <li>Segregation-of-duties conflict review</li>
                            <li>Periodic access recertification</li>
                        </ul>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <RelatedLinksPanel
                    title="AIS next steps"
                    summary="Connect access conclusions to ITGC, application controls, and enterprise-system data flow."
                    badge="2 routes"
                    items={[
                        { path: "/ais/it-control-matrix", label: "IT Control Matrix", description: "Use for general and application controls." },
                        { path: "/ais/enterprise-systems-control-mapper", label: "Enterprise Systems Control Mapper", description: "Use when ERP, SCM, CRM, BI, or interfaces drive the risk." },
                    ]}
                    showDescriptions
                />
            }
        />
    );
}
