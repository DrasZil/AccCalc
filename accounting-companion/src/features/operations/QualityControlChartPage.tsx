import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeQualityControlChart } from "../../utils/calculatorMath";

function parseObservations(value: string) {
    return value
        .split(/[,\s]+/)
        .map((item) => item.trim())
        .filter(Boolean)
        .map(Number);
}

export default function QualityControlChartPage() {
    const [processMean, setProcessMean] = useState("");
    const [processStandardDeviation, setProcessStandardDeviation] = useState("");
    const [sampleSize, setSampleSize] = useState("");
    const [observations, setObservations] = useState("");

    const result = useMemo(() => {
        if ([processMean, processStandardDeviation, sampleSize].some((value) => value.trim() === "")) return null;
        const parsedCore = [processMean, processStandardDeviation, sampleSize].map(Number);
        const parsedObservations = parseObservations(observations);
        if (parsedCore.some(Number.isNaN) || parsedObservations.some(Number.isNaN)) {
            return { error: "Enter valid process inputs and comma-separated observations." };
        }
        if (parsedCore[1] < 0 || parsedCore[2] <= 0) {
            return { error: "Standard deviation cannot be negative and sample size must be greater than zero." };
        }

        return computeQualityControlChart({
            processMean: parsedCore[0],
            processStandardDeviation: parsedCore[1],
            sampleSize: parsedCore[2],
            observations: parsedObservations,
        });
    }, [observations, processMean, processStandardDeviation, sampleSize]);

    return (
        <CalculatorPageLayout
            badge="Operations"
            title="Quality Control Chart Helper"
            description="Build three-sigma control limits for operations, quality-cost, and statistical quality-control review cases."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Process Mean" value={processMean} onChange={setProcessMean} placeholder="50" />
                        <InputCard label="Process Standard Deviation" value={processStandardDeviation} onChange={setProcessStandardDeviation} placeholder="4.8" />
                        <InputCard label="Sample Size" value={sampleSize} onChange={setSampleSize} placeholder="9" />
                        <InputCard label="Observed Sample Means" value={observations} onChange={setObservations} placeholder="47.9, 51.2, 55.4" />
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
                        <ResultCard title="Standard Error" value={result.standardError.toFixed(4)} />
                        <ResultCard title="Lower Control Limit" value={result.lowerControlLimit.toFixed(4)} />
                        <ResultCard title="Upper Control Limit" value={result.upperControlLimit.toFixed(4)} />
                        <ResultCard title="Out-of-Control Points" value={String(result.outOfControlCount)} tone={result.outOfControlCount > 0 ? "warning" : "accent"} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Control limits = process mean +/- 3 x (standard deviation / sqrt(sample size))"
                        steps={[
                            `Standard error = ${Number(processStandardDeviation).toFixed(4)} / sqrt(${Number(sampleSize).toFixed(0)}) = ${result.standardError.toFixed(4)}.`,
                            `Control limits = ${Number(processMean).toFixed(4)} +/- 3 x ${result.standardError.toFixed(4)}.`,
                            result.outOfControlObservations.length
                                ? `Out-of-control observations: ${result.outOfControlObservations.join(", ")}.`
                                : "No entered observation is outside the computed limits.",
                        ]}
                        interpretation={result.controlSignal}
                        warnings={["Three-sigma limits are a teaching model. Real quality-control work may also inspect runs, trends, attribute charts, and process-specific standards."]}
                    />
                ) : null
            }
        />
    );
}
