import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import TextAreaCard from "../../components/TextAreaCard";
import { computeWeightedMean } from "../../utils/calculatorMath";
import { parseNumberList } from "../../utils/listParsers";

export default function WeightedMeanPage() {
    const [valuesInput, setValuesInput] = useState("");
    const [weightsInput, setWeightsInput] = useState("");

    const result = useMemo(() => {
        if (valuesInput.trim() === "" || weightsInput.trim() === "") return null;

        const parsedValues = parseNumberList(valuesInput);
        const parsedWeights = parseNumberList(weightsInput);

        if (parsedValues.error) return { error: parsedValues.error };
        if (parsedWeights.error) return { error: parsedWeights.error };

        if (parsedValues.values.length !== parsedWeights.values.length) {
            return { error: "Values and weights must contain the same number of entries." };
        }

        if (parsedWeights.values.some((weight) => weight < 0)) {
            return { error: "Weights cannot be negative." };
        }

        const { weightedMean, totalWeight, weightedSum } = computeWeightedMean(
            parsedValues.values,
            parsedWeights.values
        );

        if (totalWeight === 0) {
            return { error: "The total weight must be greater than zero." };
        }

        return {
            weightedMean,
            totalWeight,
            weightedSum,
            formula: "Weighted mean = Sum of value x weight / Sum of weights",
            steps: [
                ...parsedValues.values.map(
                    (value, index) =>
                        `Entry ${index + 1}: ${value} x ${parsedWeights.values[index]} = ${(value * parsedWeights.values[index]).toFixed(4)}`
                ),
                `Weighted sum = ${weightedSum.toFixed(4)}`,
                `Total weight = ${totalWeight.toFixed(4)}`,
                `Weighted mean = ${weightedSum.toFixed(4)} / ${totalWeight.toFixed(4)} = ${weightedMean.toFixed(4)}`,
            ],
            glossary: [
                { term: "Weight", meaning: "The relative importance or frequency assigned to a value." },
                { term: "Weighted mean", meaning: "An average that gives different importance to each value." },
            ],
            interpretation: `The weighted mean is ${weightedMean.toFixed(4)} based on a total weight of ${totalWeight.toFixed(4)}.`,
        };
    }, [valuesInput, weightsInput]);

    return (
        <CalculatorPageLayout
            badge="Business Math"
            title="Weighted Mean"
            description="Compute a weighted mean from a list of values and a matching list of weights."
            inputSection={
                <div className="grid gap-4 md:grid-cols-2">
                    <TextAreaCard
                        label="Values"
                        value={valuesInput}
                        onChange={setValuesInput}
                        placeholder="85, 90, 78, 92"
                    />
                    <TextAreaCard
                        label="Weights"
                        value={weightsInput}
                        onChange={setWeightsInput}
                        placeholder="0.2, 0.3, 0.2, 0.3"
                    />
                </div>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="border-yellow-400/20 bg-yellow-500/10">
                        <p className="text-sm font-medium text-yellow-300">Input notice</p>
                        <p className="mt-2 text-sm leading-6 text-yellow-200">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={3}>
                        <ResultCard title="Weighted Mean" value={result.weightedMean.toFixed(4)} />
                        <ResultCard title="Weighted Sum" value={result.weightedSum.toFixed(4)} />
                        <ResultCard title="Total Weight" value={result.totalWeight.toFixed(4)} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula={result.formula}
                        steps={result.steps}
                        glossary={result.glossary}
                        interpretation={result.interpretation}
                    />
                ) : null
            }
        />
    );
}
