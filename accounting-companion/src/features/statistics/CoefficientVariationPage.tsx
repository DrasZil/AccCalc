import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import StudySupportPanel from "../../components/StudySupportPanel";
import TextAreaCard from "../../components/TextAreaCard";
import { computeCoefficientOfVariation } from "../../utils/calculatorMath";
import { parseNumberList } from "../../utils/listParsers";
import { buildStudyQuizPath, buildStudyTopicPath } from "../study/studyContent";

function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

export default function CoefficientVariationPage() {
    const [valuesInput, setValuesInput] = useState("");
    const [mode, setMode] = useState<"population" | "sample">("sample");

    const result = useMemo(() => {
        if (valuesInput.trim() === "") return null;

        const parsedValues = parseNumberList(valuesInput);
        if (parsedValues.error) return { error: parsedValues.error };

        if (parsedValues.values.length < 2) {
            return { error: "Enter at least two values to compare relative variability." };
        }

        const computed = computeCoefficientOfVariation(
            parsedValues.values,
            mode === "sample"
        );

        if (computed.mean === 0) {
            return {
                error: "Coefficient of variation is not meaningful when the mean is zero.",
            };
        }

        return computed;
    }, [mode, valuesInput]);

    return (
        <CalculatorPageLayout
            badge="Statistics / Analytics"
            title="Coefficient of Variation"
            description="Compare relative variability by scaling the standard deviation to the mean, which is useful when two datasets use different average levels."
            inputSection={
                <div className="space-y-4">
                    <TextAreaCard
                        label="Dataset values"
                        value={valuesInput}
                        onChange={setValuesInput}
                        placeholder="42, 47, 45, 49, 52"
                    />
                    <SectionCard>
                        <label className="mb-4 block text-sm font-medium text-[color:var(--app-text)]">
                            Dispersion basis
                        </label>
                        <select
                            value={mode}
                            onChange={(event) =>
                                setMode(event.target.value as "population" | "sample")
                            }
                            className="app-field w-full rounded-[1rem] px-4 py-3 text-sm outline-none"
                        >
                            <option value="population">Population</option>
                            <option value="sample">Sample</option>
                        </select>
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
                    <ResultGrid columns={4}>
                        <ResultCard title="Mean" value={result.mean.toFixed(4)} />
                        <ResultCard
                            title="Standard Deviation"
                            value={result.standardDeviation.toFixed(4)}
                        />
                        <ResultCard
                            title="Coefficient of Variation"
                            value={formatPercent(result.coefficientOfVariation)}
                            tone="accent"
                        />
                        <ResultCard
                            title="Dataset Size"
                            value={result.count.toString()}
                            supportingText={`Using the ${mode} basis for dispersion.`}
                        />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <div className="space-y-4">
                        <FormulaCard
                            formula="Coefficient of variation = (Standard deviation / Mean) x 100"
                            steps={[
                                `Mean = ${result.mean.toFixed(4)}.`,
                                `Standard deviation = ${result.standardDeviation.toFixed(4)}.`,
                                `Coefficient of variation = (${result.standardDeviation.toFixed(4)} / ${result.mean.toFixed(4)}) x 100 = ${formatPercent(result.coefficientOfVariation)}.`,
                            ]}
                            glossary={[
                                {
                                    term: "Coefficient of variation",
                                    meaning:
                                        "A relative measure of spread that compares variability to the average level of the dataset.",
                                },
                                {
                                    term: "Relative variability",
                                    meaning:
                                        "Useful when two datasets have different means and standard deviations that are not directly comparable in raw units.",
                                },
                            ]}
                            interpretation={`This dataset has a ${mode} coefficient of variation of ${formatPercent(result.coefficientOfVariation)}. Use that percentage to compare volatility or consistency against another dataset with a different mean.`}
                            warnings={[
                                "Do not compare coefficients of variation when the mean is zero or very close to zero because the ratio becomes unstable.",
                            ]}
                        />

                        <StudySupportPanel
                            topicId="descriptive-statistics-review"
                            topicTitle="Descriptive Statistics and Relative Variation Review"
                            intro="Use the lesson flow when you need to connect mean, variance, standard deviation, and coefficient of variation instead of treating them as isolated formulas."
                            lessonPath={buildStudyTopicPath("descriptive-statistics-review")}
                            quizPath={buildStudyQuizPath("descriptive-statistics-review")}
                            relatedTools={[
                                {
                                    path: "/statistics/standard-deviation",
                                    label: "Standard Deviation",
                                },
                                {
                                    path: "/business-math/weighted-mean",
                                    label: "Weighted Mean",
                                },
                            ]}
                            sections={[
                                {
                                    key: "when-to-use",
                                    label: "When to use it",
                                    summary: "Use coefficient of variation when raw spread alone is not enough.",
                                    content: (
                                        <p>
                                            Use this metric when two datasets have different means and you need
                                            a relative variability comparison, such as comparing sales volatility
                                            across products with different average demand levels.
                                        </p>
                                    ),
                                },
                                {
                                    key: "mistake-check",
                                    label: "Common mistake check",
                                    summary: "The most common issue is treating CV like a raw standard deviation.",
                                    emphasis: "support",
                                    content: (
                                        <p>
                                            A larger standard deviation does not automatically mean a dataset is
                                            more unstable overall. Relative variation matters when the averages
                                            are different.
                                        </p>
                                    ),
                                },
                            ]}
                        />
                    </div>
                ) : null
            }
        />
    );
}
