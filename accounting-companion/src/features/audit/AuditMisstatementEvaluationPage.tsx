import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import {
    computeAuditMisstatementEvaluation,
} from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

function formatPercent(value: number) {
    return `${(value * 100).toFixed(2)}%`;
}

const QUALITATIVE_OPTIONS = [
    { label: "None", value: 0 },
    { label: "Isolated", value: 1 },
    { label: "Several", value: 2 },
    { label: "Pervasive", value: 3 },
] as const;

export default function AuditMisstatementEvaluationPage() {
    const [tolerableMisstatement, setTolerableMisstatement] = useState("");
    const [projectedMisstatement, setProjectedMisstatement] = useState("");
    const [allowanceForSamplingRisk, setAllowanceForSamplingRisk] = useState("");
    const [clearlyTrivialThreshold, setClearlyTrivialThreshold] = useState("");
    const [qualitativeConcernCount, setQualitativeConcernCount] = useState(1);

    const result = useMemo(() => {
        const values = [
            tolerableMisstatement,
            projectedMisstatement,
            allowanceForSamplingRisk,
            clearlyTrivialThreshold,
        ];

        if (values.some((value) => value.trim() === "")) return null;

        const parsed = values.map(Number);
        if (parsed.some(Number.isNaN)) {
            return { error: "All misstatement-evaluation inputs must be valid numbers." };
        }

        if (parsed.some((value) => value < 0) || parsed[0] === 0) {
            return {
                error: "Use a positive tolerable misstatement and non-negative projected, allowance, and clearly trivial inputs.",
            };
        }

        return computeAuditMisstatementEvaluation({
            tolerableMisstatement: parsed[0],
            projectedMisstatement: parsed[1],
            allowanceForSamplingRisk: parsed[2],
            clearlyTrivialThreshold: parsed[3],
            qualitativeConcernCount,
        });
    }, [
        allowanceForSamplingRisk,
        clearlyTrivialThreshold,
        projectedMisstatement,
        qualitativeConcernCount,
        tolerableMisstatement,
    ]);

    return (
        <CalculatorPageLayout
            badge="Audit & Assurance"
            title="Audit Misstatement Evaluation Workspace"
            description="Compare projected misstatement plus sampling allowance against tolerable misstatement, then keep qualitative issues visible before deciding whether more work or adjustment is needed."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <InputGrid columns={2}>
                            <InputCard
                                label="Tolerable Misstatement"
                                value={tolerableMisstatement}
                                onChange={setTolerableMisstatement}
                                placeholder="250000"
                            />
                            <InputCard
                                label="Projected Misstatement"
                                value={projectedMisstatement}
                                onChange={setProjectedMisstatement}
                                placeholder="180000"
                            />
                            <InputCard
                                label="Allowance for Sampling Risk"
                                value={allowanceForSamplingRisk}
                                onChange={setAllowanceForSamplingRisk}
                                placeholder="45000"
                                helperText="Use the allowance from your class sampling plan or case facts."
                            />
                            <InputCard
                                label="Clearly Trivial Threshold"
                                value={clearlyTrivialThreshold}
                                onChange={setClearlyTrivialThreshold}
                                placeholder="10000"
                                helperText="Use the threshold specified by the case or your classroom planning guidance."
                            />
                        </InputGrid>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">Qualitative concern pressure</p>
                        <p className="app-body-md mt-2 text-sm">
                            Use this to reflect fraud indicators, intentional bias, pervasive presentation issues, or other qualitative red flags that make the numeric result harder to accept blindly.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {QUALITATIVE_OPTIONS.map((option) => (
                                <button
                                    key={option.label}
                                    type="button"
                                    onClick={() => setQualitativeConcernCount(option.value)}
                                    className={[
                                        "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                                        qualitativeConcernCount === option.value
                                            ? "app-button-primary"
                                            : "app-button-ghost",
                                    ].join(" ")}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </SectionCard>
                </div>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="app-tone-warning">
                        <p className="app-card-title text-sm">Input notice</p>
                        <p className="app-body-md mt-2 text-sm">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <div className="space-y-4">
                        <ResultGrid columns={4}>
                            <ResultCard
                                title="Upper Misstatement Limit"
                                value={formatPHP(result.upperMisstatementLimit)}
                                tone="accent"
                            />
                            <ResultCard
                                title="Headroom"
                                value={formatPHP(result.headroom)}
                                tone={result.headroom < 0 ? "warning" : undefined}
                            />
                            <ResultCard
                                title="Utilization"
                                value={formatPercent(result.utilizationRate)}
                            />
                            <ResultCard
                                title="Clearly Trivial"
                                value={
                                    result.aboveClearlyTrivial
                                        ? "Above threshold"
                                        : "Below threshold"
                                }
                            />
                        </ResultGrid>

                        <SectionCard>
                            <p className="app-card-title text-sm">Evaluation signal</p>
                            <p className="app-body-md mt-2 text-sm">{result.conclusion}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                    Qualitative penalty {formatPercent(result.qualitativePenalty)}
                                </span>
                                <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                    Adjusted risk index {result.adjustedRiskIndex.toFixed(2)}
                                </span>
                            </div>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <div className="space-y-4">
                        <FormulaCard
                            formula="Upper misstatement limit = projected misstatement + allowance for sampling risk"
                            steps={[
                                `Upper misstatement limit = ${formatPHP(Number(projectedMisstatement))} + ${formatPHP(Number(allowanceForSamplingRisk))} = ${formatPHP(result.upperMisstatementLimit)}.`,
                                `Headroom = ${formatPHP(Number(tolerableMisstatement))} - ${formatPHP(result.upperMisstatementLimit)} = ${formatPHP(result.headroom)}.`,
                                `Utilization = ${formatPHP(result.upperMisstatementLimit)} / ${formatPHP(Number(tolerableMisstatement))} = ${formatPercent(result.utilizationRate)}.`,
                            ]}
                            interpretation={result.conclusion}
                            warnings={[
                                "A case can still need adjustment even when the quantitative range looks acceptable if the qualitative concerns are serious.",
                                "Use the clearly trivial threshold and tolerable misstatement basis required by your class or audit case.",
                            ]}
                        />

                        <RelatedLinksPanel
                            title="Continue the audit workflow"
                            summary="Move backward into planning and sampling or forward into completion and reporting judgment."
                            badge="3 routes"
                            items={[
                                {
                                    path: "/audit/audit-planning-workspace",
                                    label: "Audit Planning Workspace",
                                    description:
                                        "Recheck planning and performance materiality if the evaluation feels too tight.",
                                },
                                {
                                    path: "/audit/audit-sampling-planner",
                                    label: "Audit Sampling Planner",
                                    description:
                                        "Revisit the allowance for sampling risk or sample-size pressure behind the evaluation.",
                                },
                                {
                                    path: "/audit/audit-completion-and-opinion",
                                    label: "Audit Completion and Opinion Workspace",
                                    description:
                                        "Use completion judgment once misstatement evaluation starts affecting the reporting conclusion.",
                                },
                            ]}
                            showDescriptions
                        />
                    </div>
                ) : null
            }
        />
    );
}
