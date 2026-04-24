import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeSegregationOfDutiesConflict } from "../../utils/calculatorMath";

type RiskLevel = "low" | "moderate" | "high";

const SCORE: Record<RiskLevel, number> = {
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
    value: RiskLevel;
    onChange: (value: RiskLevel) => void;
}) {
    return (
        <SectionCard>
            <p className="app-card-title text-sm">{title}</p>
            <div className="mt-3 flex flex-wrap gap-2">
                {(["low", "moderate", "high"] as RiskLevel[]).map((level) => (
                    <button
                        key={level}
                        type="button"
                        onClick={() => onChange(level)}
                        className={[
                            "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize",
                            value === level ? "app-button-primary" : "app-button-ghost",
                        ].join(" ")}
                    >
                        {level}
                    </button>
                ))}
            </div>
        </SectionCard>
    );
}

export default function SegregationOfDutiesConflictPage() {
    const [authorizationCustodyConflict, setAuthorizationCustodyConflict] =
        useState<RiskLevel>("high");
    const [custodyRecordingConflict, setCustodyRecordingConflict] =
        useState<RiskLevel>("moderate");
    const [recordingReconciliationConflict, setRecordingReconciliationConflict] =
        useState<RiskLevel>("moderate");
    const [privilegedAccessConflict, setPrivilegedAccessConflict] =
        useState<RiskLevel>("high");
    const [compensatingReviewStrength, setCompensatingReviewStrength] =
        useState<RiskLevel>("low");

    const result = useMemo(
        () =>
            computeSegregationOfDutiesConflict({
                authorizationCustodyConflict: SCORE[authorizationCustodyConflict],
                custodyRecordingConflict: SCORE[custodyRecordingConflict],
                recordingReconciliationConflict: SCORE[recordingReconciliationConflict],
                privilegedAccessConflict: SCORE[privilegedAccessConflict],
                compensatingReviewStrength: SCORE[compensatingReviewStrength],
            }),
        [
            authorizationCustodyConflict,
            compensatingReviewStrength,
            custodyRecordingConflict,
            privilegedAccessConflict,
            recordingReconciliationConflict,
        ]
    );

    return (
        <CalculatorPageLayout
            badge="AIS / IT Controls"
            title="Segregation of Duties Conflict Matrix"
            description="Score incompatible-duty conflicts and compensating review strength so AIS, IT-audit, and control-evaluation cases keep role overlap and override exposure visible."
            inputSection={
                <div className="space-y-4">
                    <RatingRow
                        title="Authorization and custody overlap"
                        value={authorizationCustodyConflict}
                        onChange={setAuthorizationCustodyConflict}
                    />
                    <RatingRow
                        title="Custody and recording overlap"
                        value={custodyRecordingConflict}
                        onChange={setCustodyRecordingConflict}
                    />
                    <RatingRow
                        title="Recording and reconciliation overlap"
                        value={recordingReconciliationConflict}
                        onChange={setRecordingReconciliationConflict}
                    />
                    <RatingRow
                        title="Privileged access override risk"
                        value={privilegedAccessConflict}
                        onChange={setPrivilegedAccessConflict}
                    />
                    <RatingRow
                        title="Compensating review strength"
                        value={compensatingReviewStrength}
                        onChange={setCompensatingReviewStrength}
                    />
                </div>
            }
            resultSection={
                <div className="space-y-4">
                    <ResultGrid columns={4}>
                        <ResultCard
                            title="Raw Conflict Score"
                            value={result.rawConflictScore.toFixed(2)}
                            tone="accent"
                        />
                        <ResultCard
                            title="Mitigation Credit"
                            value={result.mitigationCredit.toFixed(2)}
                        />
                        <ResultCard
                            title="Net Conflict Score"
                            value={result.netConflictScore.toFixed(2)}
                        />
                        <ResultCard
                            title="Dominant Exposure"
                            value={result.dominantConflict}
                        />
                    </ResultGrid>

                    <SectionCard>
                        <p className="app-card-title text-sm">{result.riskLabel}</p>
                        <p className="app-body-md mt-2 text-sm">
                            {result.recommendedResponse}
                        </p>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-card-title text-sm">How to read this matrix</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                            <li>
                                Start with the role overlap that exposes authorization,
                                custody, recording, or reconciliation to the same person or
                                privileged-access profile.
                            </li>
                            <li>
                                Treat compensating review as support, not as an excuse to ignore
                                a severe conflict.
                            </li>
                            <li>
                                If privileged access can bypass normal approval, the case usually
                                needs stronger review than the raw staffing chart suggests.
                            </li>
                        </ul>
                    </SectionCard>

                    <RelatedLinksPanel
                        title="Continue with AIS control work"
                        summary="Move into access, ITGC, or lesson support once the role-conflict map is clear."
                        badge="3 routes"
                        items={[
                            {
                                path: "/ais/access-control-review",
                                label: "Access Control Review Workspace",
                                description:
                                    "Use this when the segregation problem becomes a broader access and monitoring case.",
                            },
                            {
                                path: "/ais/it-control-matrix",
                                label: "IT Control Matrix",
                                description:
                                    "Open the wider ITGC and application-control map when the issue expands beyond user roles.",
                            },
                            {
                                path: "/study/topics/ais-general-vs-application-controls-and-it-audit",
                                label: "AIS control-layers lesson",
                                description:
                                    "Review how ITGC, application controls, and audit consequence fit together.",
                            },
                        ]}
                        showDescriptions
                    />
                </div>
            }
        />
    );
}
