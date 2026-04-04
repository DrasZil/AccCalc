import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import TextAreaCard from "../../components/TextAreaCard";
import { computeStandardDeviation } from "../../utils/calculatorMath";
import { parseNumberList } from "../../utils/listParsers";

export default function StandardDeviationPage() {
    const [valuesInput, setValuesInput] = useState("");
    const [mode, setMode] = useState<"population" | "sample">("population");

    const result = useMemo(() => {
        if (valuesInput.trim() === "") return null;

        const parsedValues = parseNumberList(valuesInput);
        if (parsedValues.error) return { error: parsedValues.error };

        if (parsedValues.values.length < 2) {
            return { error: "Enter at least two values for standard deviation." };
        }

        if (mode === "sample" && parsedValues.values.length < 2) {
            return { error: "Sample standard deviation requires at least two observations." };
        }

        const { count, mean, variance, standardDeviation, sumOfSquaredDeviations } =
            computeStandardDeviation(parsedValues.values, mode === "sample");

        return {
            count,
            mean,
            variance,
            standardDeviation,
            sumOfSquaredDeviations,
            formula:
                mode === "sample"
                    ? "Sample variance = Sum of squared deviations / (n - 1); sample standard deviation = square root of sample variance"
                    : "Population variance = Sum of squared deviations / n; population standard deviation = square root of population variance",
            steps: [
                `Count = ${count}`,
                `Mean = ${mean.toFixed(4)}`,
                ...parsedValues.values.map(
                    (value) =>
                        `Deviation for ${value} = (${value} - ${mean.toFixed(4)})^2 = ${Math.pow(value - mean, 2).toFixed(4)}`
                ),
                `Sum of squared deviations = ${sumOfSquaredDeviations.toFixed(4)}`,
                `Variance = ${variance.toFixed(4)}`,
                `Standard deviation = ${standardDeviation.toFixed(4)}`,
            ],
            glossary: [
                { term: "Mean", meaning: "The arithmetic average of the dataset." },
                { term: "Variance", meaning: "The average squared spread from the mean." },
                { term: "Standard deviation", meaning: "The square root of variance and a common measure of dispersion." },
            ],
            interpretation: `The dataset has a ${mode} standard deviation of ${standardDeviation.toFixed(4)}, which describes how far the values typically spread around the mean.`,
        };
    }, [mode, valuesInput]);

    return (
        <CalculatorPageLayout
            badge="Statistics"
            title="Standard Deviation"
            description="Compute the mean, variance, and standard deviation for a list of numeric values."
            inputSection={
                <div className="space-y-4">
                    <TextAreaCard
                        label="Values"
                        value={valuesInput}
                        onChange={setValuesInput}
                        placeholder="12, 15, 18, 19, 22"
                    />
                    <SectionCard>
                        <label className="mb-4 block text-sm font-medium text-gray-300">
                            Calculation Mode
                        </label>
                        <select
                            value={mode}
                            onChange={(event) =>
                                setMode(event.target.value as "population" | "sample")
                            }
                            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-green-400/40 focus:ring-2 focus:ring-green-400/20"
                        >
                            <option value="population" className="bg-neutral-900 text-white">
                                Population
                            </option>
                            <option value="sample" className="bg-neutral-900 text-white">
                                Sample
                            </option>
                        </select>
                    </SectionCard>
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
                        <ResultCard title="Mean" value={result.mean.toFixed(4)} />
                        <ResultCard title="Variance" value={result.variance.toFixed(4)} />
                        <ResultCard title="Standard Deviation" value={result.standardDeviation.toFixed(4)} />
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
