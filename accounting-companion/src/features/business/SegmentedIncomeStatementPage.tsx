import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeSegmentMargin } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

function formatPercent(value: number) {
    return `${(value * 100).toFixed(2)}%`;
}

export default function SegmentedIncomeStatementPage() {
    const [sales, setSales] = useState("");
    const [variableCosts, setVariableCosts] = useState("");
    const [traceableFixedCosts, setTraceableFixedCosts] = useState("");
    const [commonFixedCosts, setCommonFixedCosts] = useState("");

    const result = useMemo(() => {
        if ([sales, variableCosts, traceableFixedCosts].some((value) => value.trim() === "")) return null;
        const parsed = [sales, variableCosts, traceableFixedCosts, commonFixedCosts || "0"].map(Number);
        if (parsed.some(Number.isNaN)) return { error: "All segment reporting inputs must be valid numbers." };
        if (parsed[0] < 0 || parsed[1] < 0 || parsed[2] < 0 || parsed[3] < 0) return { error: "Segment reporting inputs cannot be negative." };

        return computeSegmentMargin({
            sales: parsed[0],
            variableCosts: parsed[1],
            traceableFixedCosts: parsed[2],
            commonFixedCosts: parsed[3],
        });
    }, [commonFixedCosts, sales, traceableFixedCosts, variableCosts]);

    return (
        <CalculatorPageLayout
            badge="Cost & Managerial"
            title="Segmented Income Statement Analyzer"
            description="Separate contribution margin, traceable fixed costs, segment margin, and common-cost allocation so responsibility accounting decisions stay clean."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Segment Sales" value={sales} onChange={setSales} placeholder="950000" />
                        <InputCard label="Variable Costs" value={variableCosts} onChange={setVariableCosts} placeholder="570000" />
                        <InputCard label="Traceable Fixed Costs" value={traceableFixedCosts} onChange={setTraceableFixedCosts} placeholder="180000" />
                        <InputCard label="Allocated Common Fixed Costs (optional)" value={commonFixedCosts} onChange={setCommonFixedCosts} placeholder="60000" />
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
                    <ResultGrid columns={4}>
                        <ResultCard title="Contribution Margin" value={formatPHP(result.contributionMargin)} />
                        <ResultCard title="Segment Margin" value={formatPHP(result.segmentMargin)} tone="accent" />
                        <ResultCard title="Segment Margin Ratio" value={formatPercent(result.segmentMarginRatio)} />
                        <ResultCard title="After Common Costs" value={formatPHP(result.incomeAfterAllocatedCommonCosts)} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Segment margin = sales - variable costs - traceable fixed costs"
                        steps={[
                            `Contribution margin = ${formatPHP(Number(sales))} - ${formatPHP(Number(variableCosts))} = ${formatPHP(result.contributionMargin)}.`,
                            `Segment margin = ${formatPHP(result.contributionMargin)} - ${formatPHP(Number(traceableFixedCosts))} = ${formatPHP(result.segmentMargin)}.`,
                            `After allocated common costs = ${formatPHP(result.segmentMargin)} - ${formatPHP(Number(commonFixedCosts || 0))} = ${formatPHP(result.incomeAfterAllocatedCommonCosts)}.`,
                        ]}
                        interpretation={result.decisionSignal}
                        warnings={["Do not discontinue a segment based only on allocated common costs. The avoidability of traceable costs drives the relevant-cost decision."]}
                    />
                ) : null
            }
        />
    );
}
