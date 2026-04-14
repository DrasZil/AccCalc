import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeAuditPlanning } from "../../utils/calculatorMath";

function formatPercent(value: number) {
    return `${(value * 100).toFixed(2)}%`;
}

export default function AuditPlanningWorkspacePage() {
    const [benchmarkAmount, setBenchmarkAmount] = useState("");
    const [materialityPercent, setMaterialityPercent] = useState("");
    const [performanceMaterialityPercent, setPerformanceMaterialityPercent] = useState("");
    const [inherentRiskPercent, setInherentRiskPercent] = useState("");
    const [controlRiskPercent, setControlRiskPercent] = useState("");

    const result = useMemo(() => {
        const values = [
            benchmarkAmount,
            materialityPercent,
            performanceMaterialityPercent,
            inherentRiskPercent,
            controlRiskPercent,
        ];

        if (values.some((value) => value.trim() === "")) return null;

        const numeric = values.map((value) => Number(value));
        if (numeric.some((value) => Number.isNaN(value))) {
            return { error: "All audit-planning inputs must be valid numbers." };
        }

        return computeAuditPlanning({
            benchmarkAmount: numeric[0],
            materialityPercent: numeric[1],
            performanceMaterialityPercent: numeric[2],
            inherentRiskPercent: numeric[3],
            controlRiskPercent: numeric[4],
        });
    }, [
        benchmarkAmount,
        controlRiskPercent,
        inherentRiskPercent,
        materialityPercent,
        performanceMaterialityPercent,
    ]);

    return (
        <CalculatorPageLayout
            badge="Audit & Assurance"
            title="Audit Planning Workspace"
            description="Estimate planning materiality, performance materiality, and an audit-risk response signal from one reviewer-friendly planning workspace."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Benchmark Amount"
                            value={benchmarkAmount}
                            onChange={setBenchmarkAmount}
                            placeholder="12500000"
                            helperText="Use the benchmark base selected in the case, such as profit before tax, revenue, or total assets."
                        />
                        <InputCard
                            label="Materiality (%)"
                            value={materialityPercent}
                            onChange={setMaterialityPercent}
                            placeholder="5"
                        />
                        <InputCard
                            label="Performance Materiality (%)"
                            value={performanceMaterialityPercent}
                            onChange={setPerformanceMaterialityPercent}
                            placeholder="75"
                            helperText="Applied as a percentage of planning materiality."
                        />
                        <InputCard
                            label="Inherent Risk (%)"
                            value={inherentRiskPercent}
                            onChange={setInherentRiskPercent}
                            placeholder="80"
                        />
                        <InputCard
                            label="Control Risk (%)"
                            value={controlRiskPercent}
                            onChange={setControlRiskPercent}
                            placeholder="60"
                        />
                    </InputGrid>
                </SectionCard>
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
                                title="Planning Materiality"
                                value={formatPHP(result.planningMateriality)}
                                tone="accent"
                            />
                            <ResultCard
                                title="Performance Materiality"
                                value={formatPHP(result.performanceMateriality)}
                            />
                            <ResultCard
                                title="Risk of Material Misstatement"
                                value={formatPercent(result.riskOfMaterialMisstatement)}
                            />
                            <ResultCard
                                title="Planned Detection Risk"
                                value={formatPercent(result.plannedDetectionRisk)}
                            />
                        </ResultGrid>

                        <SectionCard>
                            <p className="app-card-title text-sm">Planning implication</p>
                            <p className="app-body-md mt-2 text-sm">{result.auditFocus}</p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Planning materiality = benchmark x materiality %; Planned detection risk = target audit risk / (IR x CR)"
                        steps={[
                            `Planning materiality = ${formatPHP(Number(benchmarkAmount))} x ${Number(materialityPercent).toFixed(2)}% = ${formatPHP(result.planningMateriality)}.`,
                            `Performance materiality = ${formatPHP(result.planningMateriality)} x ${Number(performanceMaterialityPercent).toFixed(2)}% = ${formatPHP(result.performanceMateriality)}.`,
                            `Risk of material misstatement = ${Number(inherentRiskPercent).toFixed(2)}% x ${Number(controlRiskPercent).toFixed(2)}% = ${formatPercent(result.riskOfMaterialMisstatement)}.`,
                            `Planned detection risk signal = ${formatPercent(result.plannedDetectionRisk)}.`,
                        ]}
                        interpretation="This workspace supports classroom audit-planning logic. It does not replace professional judgment about benchmark choice, qualitative materiality, or the exact risk model used by a firm."
                        warnings={[
                            "A lower planned detection risk usually means stronger substantive procedures are needed.",
                            "Materiality is not purely mechanical; qualitative factors can still override the calculated amount.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
