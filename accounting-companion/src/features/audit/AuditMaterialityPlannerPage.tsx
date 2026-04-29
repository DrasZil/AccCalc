import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeAuditMaterialityPlan } from "../../utils/calculatorMath";

export default function AuditMaterialityPlannerPage() {
    const [benchmarkAmount, setBenchmarkAmount] = useState("5000000");
    const [planningMaterialityPercent, setPlanningMaterialityPercent] = useState("5");
    const [performanceMaterialityPercent, setPerformanceMaterialityPercent] = useState("75");
    const [clearlyTrivialPercent, setClearlyTrivialPercent] = useState("5");
    const [expectedMisstatement, setExpectedMisstatement] = useState("120000");
    const [identifiedUncorrectedMisstatement, setIdentifiedUncorrectedMisstatement] =
        useState("90000");

    const result = useMemo(() => {
        const values = [
            benchmarkAmount,
            planningMaterialityPercent,
            performanceMaterialityPercent,
            clearlyTrivialPercent,
            expectedMisstatement,
            identifiedUncorrectedMisstatement,
        ];
        if (values.some((value) => value.trim() === "")) return null;

        const numeric = values.map((value) => Number(value));
        if (numeric.some((value) => Number.isNaN(value))) {
            return { error: "All materiality inputs must be valid numbers." };
        }
        if (numeric[0] < 0 || numeric[4] < 0 || numeric[5] < 0) {
            return { error: "Benchmark and misstatement amounts cannot be negative." };
        }
        if (numeric.slice(1, 4).some((value) => value < 0 || value > 100)) {
            return { error: "Materiality percentages must be between 0 and 100." };
        }

        return computeAuditMaterialityPlan({
            benchmarkAmount: numeric[0],
            planningMaterialityPercent: numeric[1],
            performanceMaterialityPercent: numeric[2],
            clearlyTrivialPercent: numeric[3],
            expectedMisstatement: numeric[4],
            identifiedUncorrectedMisstatement: numeric[5],
        });
    }, [
        benchmarkAmount,
        clearlyTrivialPercent,
        expectedMisstatement,
        identifiedUncorrectedMisstatement,
        performanceMaterialityPercent,
        planningMaterialityPercent,
    ]);

    return (
        <CalculatorPageLayout
            badge="Audit & Assurance | Planning"
            title="Audit Materiality and Misstatement Planner"
            description="Plan classroom audit thresholds, compare expected and identified misstatements with performance materiality, and decide when follow-up work is needed."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard
                            label="Benchmark Amount"
                            value={benchmarkAmount}
                            onChange={setBenchmarkAmount}
                            placeholder="5000000"
                        />
                        <InputCard
                            label="Planning Materiality (%)"
                            value={planningMaterialityPercent}
                            onChange={setPlanningMaterialityPercent}
                            placeholder="5"
                        />
                        <InputCard
                            label="Performance Materiality (%)"
                            value={performanceMaterialityPercent}
                            onChange={setPerformanceMaterialityPercent}
                            placeholder="75"
                        />
                        <InputCard
                            label="Clearly Trivial (%)"
                            value={clearlyTrivialPercent}
                            onChange={setClearlyTrivialPercent}
                            placeholder="5"
                        />
                        <InputCard
                            label="Expected Misstatement"
                            value={expectedMisstatement}
                            onChange={setExpectedMisstatement}
                            placeholder="120000"
                        />
                        <InputCard
                            label="Identified Uncorrected"
                            value={identifiedUncorrectedMisstatement}
                            onChange={setIdentifiedUncorrectedMisstatement}
                            placeholder="90000"
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
                                title="Clearly Trivial"
                                value={formatPHP(result.clearlyTrivialThreshold)}
                            />
                            <ResultCard
                                title="Cushion"
                                value={formatPHP(result.remainingPerformanceCushion)}
                                tone={result.remainingPerformanceCushion < 0 ? "warning" : "default"}
                            />
                        </ResultGrid>
                        <SectionCard>
                            <p className="app-card-title text-sm">Audit response signal</p>
                            <p className="app-body-md mt-2 text-sm">{result.responseSignal}</p>
                            <p className="app-helper mt-3 text-xs">
                                Aggregate misstatement pressure is {result.pressureRatio.toFixed(1)}%
                                of performance materiality.
                            </p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Planning materiality = benchmark x planning percentage; performance materiality = planning materiality x performance percentage"
                        steps={[
                            `Planning materiality = ${formatPHP(Number(benchmarkAmount))} x ${Number(planningMaterialityPercent).toFixed(2)}% = ${formatPHP(result.planningMateriality)}.`,
                            `Performance materiality = ${formatPHP(result.planningMateriality)} x ${Number(performanceMaterialityPercent).toFixed(2)}% = ${formatPHP(result.performanceMateriality)}.`,
                            `Misstatement pressure = expected ${formatPHP(Number(expectedMisstatement))} + identified uncorrected ${formatPHP(Number(identifiedUncorrectedMisstatement))} = ${formatPHP(result.aggregateMisstatementPressure)}.`,
                        ]}
                        interpretation="Materiality is a planning and evaluation aid. Classroom thresholds should still be adjusted for qualitative factors such as fraud risk, debt covenants, regulatory sensitivity, related-party effects, and management bias."
                        warnings={[
                            "Do not treat clearly trivial as permission to ignore patterns. Individually small items may still indicate control or fraud risk.",
                            "A quantitative threshold alone is not an audit opinion decision.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
