import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computePertEstimate } from "../../utils/calculatorMath";

export default function PertProjectEstimatePage() {
    const [optimistic, setOptimistic] = useState("");
    const [mostLikely, setMostLikely] = useState("");
    const [pessimistic, setPessimistic] = useState("");

    const result = useMemo(() => {
        if ([optimistic, mostLikely, pessimistic].some((value) => value.trim() === "")) return null;
        const parsed = [optimistic, mostLikely, pessimistic].map(Number);
        if (parsed.some(Number.isNaN)) return { error: "All PERT time estimates must be valid numbers." };
        if (parsed.some((value) => value < 0) || parsed[0] > parsed[1] || parsed[1] > parsed[2]) {
            return { error: "Use non-negative estimates with optimistic <= most likely <= pessimistic." };
        }
        return computePertEstimate({ optimistic: parsed[0], mostLikely: parsed[1], pessimistic: parsed[2] });
    }, [mostLikely, optimistic, pessimistic]);

    return (
        <CalculatorPageLayout
            badge="Operations"
            title="PERT Project Estimate Helper"
            description="Estimate expected activity time, variance, and standard deviation from optimistic, most-likely, and pessimistic project estimates."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Optimistic Time" value={optimistic} onChange={setOptimistic} placeholder="4" />
                        <InputCard label="Most Likely Time" value={mostLikely} onChange={setMostLikely} placeholder="7" />
                        <InputCard label="Pessimistic Time" value={pessimistic} onChange={setPessimistic} placeholder="13" />
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
                        <ResultCard title="Expected Time" value={result.expectedTime.toFixed(2)} tone="accent" />
                        <ResultCard title="Standard Deviation" value={result.standardDeviation.toFixed(2)} />
                        <ResultCard title="Variance" value={result.variance.toFixed(2)} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Expected time = (optimistic + 4 x most likely + pessimistic) / 6"
                        steps={[
                            `Expected time = (${Number(optimistic).toFixed(2)} + 4 x ${Number(mostLikely).toFixed(2)} + ${Number(pessimistic).toFixed(2)}) / 6 = ${result.expectedTime.toFixed(2)}.`,
                            `Standard deviation = (${Number(pessimistic).toFixed(2)} - ${Number(optimistic).toFixed(2)}) / 6 = ${result.standardDeviation.toFixed(2)}.`,
                        ]}
                        interpretation="Use this for operations, project management, audit scheduling, or implementation planning cases where uncertainty is shown through three time estimates."
                    />
                ) : null
            }
        />
    );
}
