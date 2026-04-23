import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";
import { computeBusinessContinuityReadiness } from "../../utils/calculatorMath";

type ReadinessBand = 0 | 25 | 50 | 75 | 100;

const READINESS_OPTIONS: Array<{ label: string; value: ReadinessBand }> = [
    { label: "Weak", value: 25 },
    { label: "Developing", value: 50 },
    { label: "Strong", value: 75 },
    { label: "Mature", value: 100 },
];

function scoreLabel(score: number) {
    if (score >= 85) return "Resilient continuity posture";
    if (score >= 65) return "Usable but exposed continuity posture";
    if (score >= 45) return "Fragile continuity posture";
    return "High disruption exposure";
}

export default function BusinessContinuityPlannerPage() {
    const [backupRecovery, setBackupRecovery] = useState<ReadinessBand>(75);
    const [incidentResponse, setIncidentResponse] = useState<ReadinessBand>(50);
    const [vendorResilience, setVendorResilience] = useState<ReadinessBand>(50);
    const [communicationsReadiness, setCommunicationsReadiness] = useState<ReadinessBand>(75);
    const [recoveryTimeObjectiveHours, setRecoveryTimeObjectiveHours] = useState("24");
    const [expectedRecoveryHours, setExpectedRecoveryHours] = useState("30");

    const result = useMemo(() => {
        return computeBusinessContinuityReadiness({
            backupRecovery,
            incidentResponse,
            vendorResilience,
            communicationsReadiness,
            recoveryTimeObjectiveHours: Number(recoveryTimeObjectiveHours || 0),
            expectedRecoveryHours: Number(expectedRecoveryHours || 0),
        });
    }, [
        backupRecovery,
        communicationsReadiness,
        expectedRecoveryHours,
        incidentResponse,
        recoveryTimeObjectiveHours,
        vendorResilience,
    ]);

    const readinessRows = [
        ["Backup and recovery", backupRecovery, setBackupRecovery],
        ["Incident response", incidentResponse, setIncidentResponse],
        ["Vendor resilience", vendorResilience, setVendorResilience],
        ["Communications readiness", communicationsReadiness, setCommunicationsReadiness],
    ] as const;

    return (
        <CalculatorPageLayout
            badge="AIS / BSAIS"
            title="Business Continuity Planner"
            description="Score continuity readiness, compare expected recovery time with the target RTO, and translate AIS continuity cases into a clearer control narrative."
            inputSection={
                <div className="space-y-4">
                    {readinessRows.map(([label, value, setter]) => (
                        <SectionCard key={label}>
                            <p className="app-card-title text-sm">{label}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {READINESS_OPTIONS.map((option) => (
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

                    <SectionCard>
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="space-y-2">
                                <span className="app-label block">Recovery-time objective (hours)</span>
                                <input
                                    value={recoveryTimeObjectiveHours}
                                    onChange={(event) =>
                                        setRecoveryTimeObjectiveHours(event.target.value)
                                    }
                                    inputMode="decimal"
                                    className="app-field w-full rounded-[1rem] px-3.5 py-2.5 outline-none"
                                />
                            </label>
                            <label className="space-y-2">
                                <span className="app-label block">Expected recovery (hours)</span>
                                <input
                                    value={expectedRecoveryHours}
                                    onChange={(event) =>
                                        setExpectedRecoveryHours(event.target.value)
                                    }
                                    inputMode="decimal"
                                    className="app-field w-full rounded-[1rem] px-3.5 py-2.5 outline-none"
                                />
                            </label>
                        </div>
                    </SectionCard>
                </div>
            }
            resultSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-section-kicker text-[0.68rem]">Continuity readiness</p>
                        <h2 className="app-section-title mt-2">
                            {result.readinessPercent.toFixed(1)}%
                        </h2>
                        <p className="app-body-md mt-3 text-sm">
                            {scoreLabel(result.readinessPercent)}. {result.continuitySignal}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.68rem]">
                                Average score {result.readinessAverage.toFixed(2)} / 100
                            </span>
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.68rem]">
                                Recovery gap {result.recoveryGapHours.toFixed(1)} hour
                                {Math.abs(result.recoveryGapHours) === 1 ? "" : "s"}
                            </span>
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.68rem]">
                                {result.withinObjective ? "Within RTO" : "Outside RTO"}
                            </span>
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">Coursework interpretation</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                            <li>State which recovery layer is weakest before recommending controls.</li>
                            <li>Explain whether the expected recovery time meets the case objective.</li>
                            <li>Separate backup design from communications and vendor dependency risk.</li>
                            <li>Document the manual fallback if automation or interfaces fail.</li>
                        </ul>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-card-title text-sm">Assumption note</p>
                        <p className="app-body-md mt-2 text-sm">
                            This workspace is a structured AIS reviewer, not a formal disaster-recovery
                            certification model. The score helps students explain continuity posture,
                            recovery gaps, and follow-up priorities in class-style cases.
                        </p>
                    </SectionCard>
                    <RelatedLinksPanel
                        title="Continue with related control work"
                        summary="Use the linked AIS and governance routes when the continuity case expands into ITGC, access, or broader control-environment issues."
                        badge="3 routes"
                        items={[
                            {
                                path: "/ais/ais-lifecycle-and-recovery",
                                label: "AIS Lifecycle and Recovery Review",
                                description:
                                    "Use for systems life cycle, incident handling, and recovery-documentation review.",
                            },
                            {
                                path: "/ais/it-control-matrix",
                                label: "IT Control Matrix",
                                description:
                                    "Move here when the problem becomes a general versus application-control matrix.",
                            },
                            {
                                path: "/study/topics/ais-business-continuity-and-recovery-governance",
                                label: "Continuity lesson module",
                                description:
                                    "Open the Study Hub lesson for continuity, recovery, and AIS governance reading support.",
                            },
                        ]}
                        showDescriptions
                    />
                </div>
            }
        />
    );
}
