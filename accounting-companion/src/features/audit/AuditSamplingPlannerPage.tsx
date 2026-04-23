import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeAuditSamplingPlan } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

export default function AuditSamplingPlannerPage() {
    const [populationBookValue, setPopulationBookValue] = useState("");
    const [tolerableMisstatement, setTolerableMisstatement] = useState("");
    const [expectedMisstatement, setExpectedMisstatement] = useState("");
    const [confidenceFactor, setConfidenceFactor] = useState("3");

    const result = useMemo(() => {
        const values = [populationBookValue, tolerableMisstatement, expectedMisstatement, confidenceFactor];
        if (values.some((value) => value.trim() === "")) return null;
        const parsed = values.map(Number);
        if (parsed.some(Number.isNaN)) return { error: "All sampling inputs must be valid numbers." };
        if (parsed[0] <= 0 || parsed[1] <= 0 || parsed[2] < 0 || parsed[3] <= 0) return { error: "Use a positive population, tolerable misstatement, and confidence factor, with non-negative expected misstatement." };
        return computeAuditSamplingPlan({
            populationBookValue: parsed[0],
            tolerableMisstatement: parsed[1],
            expectedMisstatement: parsed[2],
            confidenceFactor: parsed[3],
        });
    }, [confidenceFactor, expectedMisstatement, populationBookValue, tolerableMisstatement]);

    return (
        <CalculatorPageLayout
            badge="Audit & Assurance"
            title="Audit Sampling Planner"
            description="Plan a classroom monetary-unit sampling size from population value, tolerable misstatement, expected misstatement, and confidence factor."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Population Book Value" value={populationBookValue} onChange={setPopulationBookValue} placeholder="12000000" />
                        <InputCard label="Tolerable Misstatement" value={tolerableMisstatement} onChange={setTolerableMisstatement} placeholder="600000" />
                        <InputCard label="Expected Misstatement" value={expectedMisstatement} onChange={setExpectedMisstatement} placeholder="120000" />
                        <InputCard label="Confidence Factor" value={confidenceFactor} onChange={setConfidenceFactor} placeholder="3" helperText="Use the factor assigned by your class table or audit sampling guide." />
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
                    <ResultGrid columns={3}>
                        <ResultCard title="Allowance for Sampling Risk" value={formatPHP(result.allowanceForSamplingRisk)} />
                        <ResultCard title="Sample Size" value={Number.isFinite(result.sampleSize) ? result.sampleSize.toFixed(0) : "Not workable"} tone="accent" />
                        <ResultCard title="Sampling Interval" value={Number.isFinite(result.samplingInterval) ? formatPHP(result.samplingInterval) : "N/A"} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Sample size = population book value x confidence factor / (tolerable misstatement - expected misstatement)"
                        steps={[
                            `Allowance for sampling risk = ${formatPHP(Number(tolerableMisstatement))} - ${formatPHP(Number(expectedMisstatement))} = ${formatPHP(result.allowanceForSamplingRisk)}.`,
                            `Sample size = ${formatPHP(Number(populationBookValue))} x ${Number(confidenceFactor).toFixed(2)} / ${formatPHP(result.allowanceForSamplingRisk)} = ${Number.isFinite(result.sampleSize) ? result.sampleSize.toFixed(0) : "not workable"}.`,
                        ]}
                        interpretation={result.riskSignal}
                        warnings={["This is an educational planning helper. Use the confidence factor, tolerable misstatement, and method required by your audit sampling table or class problem."]}
                    />
                ) : null
            }
        />
    );
}
