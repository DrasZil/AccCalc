import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeProvisionExpectedValue } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

export default function ProvisionExpectedValuePage() {
    const [lowAmount, setLowAmount] = useState("");
    const [lowProbability, setLowProbability] = useState("");
    const [baseAmount, setBaseAmount] = useState("");
    const [baseProbability, setBaseProbability] = useState("");
    const [highAmount, setHighAmount] = useState("");
    const [highProbability, setHighProbability] = useState("");

    const result = useMemo(() => {
        const values = [lowAmount, lowProbability, baseAmount, baseProbability, highAmount, highProbability];
        if (values.some((value) => value.trim() === "")) return null;

        const numeric = values.map(Number);
        if (numeric.some(Number.isNaN)) return { error: "All scenario amounts and probabilities must be valid numbers." };
        if (numeric.some((value) => value < 0)) return { error: "Scenario amounts and probabilities cannot be negative." };

        const output = computeProvisionExpectedValue([
            { label: "Low estimate", amount: numeric[0], probabilityPercent: numeric[1] },
            { label: "Base estimate", amount: numeric[2], probabilityPercent: numeric[3] },
            { label: "High estimate", amount: numeric[4], probabilityPercent: numeric[5] },
        ]);

        if (Math.abs(output.totalProbabilityPercent - 100) > 0.01) {
            return { error: `Probabilities must total 100%. Current total is ${formatPercent(output.totalProbabilityPercent)}.` };
        }

        return output;
    }, [baseAmount, baseProbability, highAmount, highProbability, lowAmount, lowProbability]);

    return (
        <CalculatorPageLayout
            badge="FAR"
            title="Provision Expected Value Planner"
            description="Estimate an expected-value provision from probability-weighted outcomes, then document the uncertainty and disclosure caution honestly."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Low Estimate" value={lowAmount} onChange={setLowAmount} placeholder="200000" />
                        <InputCard label="Low Probability (%)" value={lowProbability} onChange={setLowProbability} placeholder="25" />
                        <InputCard label="Base Estimate" value={baseAmount} onChange={setBaseAmount} placeholder="350000" />
                        <InputCard label="Base Probability (%)" value={baseProbability} onChange={setBaseProbability} placeholder="50" />
                        <InputCard label="High Estimate" value={highAmount} onChange={setHighAmount} placeholder="600000" />
                        <InputCard label="High Probability (%)" value={highProbability} onChange={setHighProbability} placeholder="25" />
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
                        <ResultCard title="Expected Provision" value={formatPHP(result.expectedValue)} tone="accent" />
                        <ResultCard title="Probability Check" value={formatPercent(result.totalProbabilityPercent)} />
                        <ResultCard title="Disclosure Cue" value="Judgment-sensitive" />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Expected value = sum of each outcome x its probability"
                        steps={result.rows.map((row) => `${row.label}: ${formatPHP(row.amount)} x ${formatPercent(row.probabilityPercent)} = ${formatPHP(row.weightedAmount)}`)}
                        interpretation={`The probability-weighted estimate is ${formatPHP(result.expectedValue)}. This is a measurement aid, not a substitute for deciding whether recognition criteria are met.`}
                        warnings={[
                            "Use this only after the case indicates a present obligation and reliable estimation.",
                            "Single most-likely outcome logic may be more appropriate for one-off obligations; this route is strongest for populations or multiple-outcome estimates.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
