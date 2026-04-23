import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeConfidenceInterval } from "../../utils/calculatorMath";

export default function ConfidenceIntervalPage() {
    const [sampleMean, setSampleMean] = useState("");
    const [sampleStandardDeviation, setSampleStandardDeviation] = useState("");
    const [populationStandardDeviation, setPopulationStandardDeviation] = useState("");
    const [sampleSize, setSampleSize] = useState("");
    const [confidenceLevel, setConfidenceLevel] = useState("95");
    const [standardDeviationSource, setStandardDeviationSource] = useState<"sample" | "population">("sample");

    const result = useMemo(() => {
        const deviationInput = standardDeviationSource === "population" ? populationStandardDeviation : sampleStandardDeviation;
        if ([sampleMean, deviationInput, sampleSize, confidenceLevel].some((value) => value.trim() === "")) return null;
        const numeric = [sampleMean, deviationInput, sampleSize, confidenceLevel].map(Number);
        if (numeric.some(Number.isNaN)) return { error: "All confidence interval inputs must be valid numbers." };
        if (numeric[1] < 0 || numeric[2] <= 1) return { error: "Standard deviation must be non-negative and sample size must be greater than 1." };

        return computeConfidenceInterval({
            sampleMean: numeric[0],
            sampleStandardDeviation: standardDeviationSource === "sample" ? numeric[1] : 0,
            populationStandardDeviation: standardDeviationSource === "population" ? numeric[1] : undefined,
            sampleSize: numeric[2],
            confidenceLevelPercent: numeric[3],
        });
    }, [confidenceLevel, populationStandardDeviation, sampleMean, sampleSize, sampleStandardDeviation, standardDeviationSource]);

    return (
        <CalculatorPageLayout
            badge="Statistics & Analytics"
            title="Confidence Interval Helper"
            description="Build a classroom confidence interval for business, audit sampling, forecasting, or marketing-research estimates using z logic when population standard deviation is known and t logic when it is estimated from the sample."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <div className="mb-4 flex flex-wrap gap-2">
                            {(["sample", "population"] as const).map((source) => (
                                <button
                                    key={source}
                                    type="button"
                                    onClick={() => setStandardDeviationSource(source)}
                                    className={[
                                        "rounded-full px-3 py-1.5 text-xs font-semibold",
                                        standardDeviationSource === source ? "app-button-primary" : "app-button-ghost",
                                    ].join(" ")}
                                >
                                    {source === "sample" ? "Sample SD unknown population σ (t)" : "Known population σ (z)"}
                                </button>
                            ))}
                        </div>
                        <InputGrid columns={2}>
                            <InputCard label="Sample Mean" value={sampleMean} onChange={setSampleMean} placeholder="42.5" />
                            {standardDeviationSource === "sample" ? (
                                <InputCard label="Sample Standard Deviation" value={sampleStandardDeviation} onChange={setSampleStandardDeviation} placeholder="6.2" />
                            ) : (
                                <InputCard label="Population Standard Deviation" value={populationStandardDeviation} onChange={setPopulationStandardDeviation} placeholder="6.2" />
                            )}
                            <InputCard label="Sample Size" value={sampleSize} onChange={setSampleSize} placeholder="64" />
                            <InputCard label="Confidence Level (%)" value={confidenceLevel} onChange={setConfidenceLevel} placeholder="95" />
                        </InputGrid>
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
                        <ResultCard title={`${result.criticalMethod.toUpperCase()} Critical`} value={result.criticalValue.toFixed(3)} />
                        <ResultCard title="Standard Error" value={result.standardError.toFixed(4)} />
                        <ResultCard title="Margin of Error" value={result.marginOfError.toFixed(4)} />
                        <ResultCard title="Interval" value={`${result.lowerBound.toFixed(4)} to ${result.upperBound.toFixed(4)}`} tone="accent" />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula={`Confidence interval = sample mean +/- ${result.criticalMethod} critical x standard error`}
                        steps={[
                            `${result.criticalMethod === "t" ? `Population standard deviation is not known, so t is used with df = ${result.degreesOfFreedom}.` : "Population standard deviation is known, so z is used."}`,
                            `Standard error = ${result.standardDeviationUsed.toFixed(4)} / sqrt(${Number(sampleSize).toFixed(0)}) = ${result.standardError.toFixed(4)}.`,
                            `Margin of error = ${result.criticalValue.toFixed(3)} x ${result.standardError.toFixed(4)} = ${result.marginOfError.toFixed(4)}.`,
                        ]}
                        interpretation={`Using ${result.confidenceLevelUsed}% ${result.criticalMethod}-based logic, the interval is ${result.lowerBound.toFixed(4)} to ${result.upperBound.toFixed(4)}.`}
                        warnings={[
                            "The t path uses a classroom critical-value table with nearest supported confidence levels. Use instructor-provided exact critical values when required.",
                            "A confidence interval communicates estimation uncertainty. It is not a guarantee that a single future observation will fall inside the range.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
