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
    const [sampleSize, setSampleSize] = useState("");
    const [confidenceLevel, setConfidenceLevel] = useState("95");

    const result = useMemo(() => {
        if ([sampleMean, sampleStandardDeviation, sampleSize, confidenceLevel].some((value) => value.trim() === "")) return null;
        const numeric = [sampleMean, sampleStandardDeviation, sampleSize, confidenceLevel].map(Number);
        if (numeric.some(Number.isNaN)) return { error: "All confidence interval inputs must be valid numbers." };
        if (numeric[1] < 0 || numeric[2] <= 1) return { error: "Sample standard deviation must be non-negative and sample size must be greater than 1." };

        return computeConfidenceInterval({
            sampleMean: numeric[0],
            sampleStandardDeviation: numeric[1],
            sampleSize: numeric[2],
            confidenceLevelPercent: numeric[3],
        });
    }, [confidenceLevel, sampleMean, sampleSize, sampleStandardDeviation]);

    return (
        <CalculatorPageLayout
            badge="Statistics & Analytics"
            title="Confidence Interval Helper"
            description="Build a classroom confidence interval for business, audit sampling, forecasting, or marketing-research estimates using a transparent large-sample z approximation."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Sample Mean" value={sampleMean} onChange={setSampleMean} placeholder="42.5" />
                        <InputCard label="Sample Standard Deviation" value={sampleStandardDeviation} onChange={setSampleStandardDeviation} placeholder="6.2" />
                        <InputCard label="Sample Size" value={sampleSize} onChange={setSampleSize} placeholder="64" />
                        <InputCard label="Confidence Level (%)" value={confidenceLevel} onChange={setConfidenceLevel} placeholder="95" />
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
                        <ResultCard title="z Critical" value={result.zCritical.toFixed(3)} />
                        <ResultCard title="Standard Error" value={result.standardError.toFixed(4)} />
                        <ResultCard title="Margin of Error" value={result.marginOfError.toFixed(4)} />
                        <ResultCard title="Interval" value={`${result.lowerBound.toFixed(4)} to ${result.upperBound.toFixed(4)}`} tone="accent" />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Confidence interval = sample mean +/- z critical x standard error"
                        steps={[
                            `Standard error = ${Number(sampleStandardDeviation).toFixed(4)} / sqrt(${Number(sampleSize).toFixed(0)}) = ${result.standardError.toFixed(4)}.`,
                            `Margin of error = ${result.zCritical.toFixed(3)} x ${result.standardError.toFixed(4)} = ${result.marginOfError.toFixed(4)}.`,
                        ]}
                        interpretation={`Using the selected large-sample approximation, the interval is ${result.lowerBound.toFixed(4)} to ${result.upperBound.toFixed(4)}.`}
                        warnings={[
                            "This route uses common z critical values for 90%, 95%, and 99%. For small-sample t intervals, use the exact t critical value required by your class.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
