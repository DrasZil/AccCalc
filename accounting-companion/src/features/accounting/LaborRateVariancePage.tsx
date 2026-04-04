import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";

export default function LaborRateVariancePage() {
    const [actualHours, setActualHours] = useState("");
    const [actualRate, setActualRate] = useState("");
    const [standardRate, setStandardRate] = useState("");

    const result = useMemo(() => {
        if (actualHours.trim() === "" || actualRate.trim() === "" || standardRate.trim() === "") {
            return null;
        }

        const parsedActualHours = Number(actualHours);
        const parsedActualRate = Number(actualRate);
        const parsedStandardRate = Number(standardRate);

        if (
            [parsedActualHours, parsedActualRate, parsedStandardRate].some((value) =>
                Number.isNaN(value)
            )
        ) {
            return { error: "All fields must contain valid numbers." };
        }

        if (parsedActualHours < 0 || parsedActualRate < 0 || parsedStandardRate < 0) {
            return {
                error: "Actual hours, actual rate, and standard rate cannot be negative.",
            };
        }

        const variance = parsedActualHours * (parsedActualRate - parsedStandardRate);
        const direction =
            variance > 0
                ? "Unfavorable"
                : variance < 0
                  ? "Favorable"
                  : "None";
        const interpretation =
            variance > 0
                ? "Unfavorable variance. Actual labor rate exceeded the standard rate."
                : variance < 0
                  ? "Favorable variance. Actual labor rate was below the standard rate."
                  : "No variance. Actual labor rate matched the standard rate.";

        return {
            variance,
            direction,
            formula: "Labor Rate Variance = Actual Hours x (Actual Rate - Standard Rate)",
            steps: [
                `Variance = ${parsedActualHours} x (${formatPHP(parsedActualRate)} - ${formatPHP(parsedStandardRate)}) = ${formatPHP(variance)}`,
            ],
            glossary: [
                {
                    term: "Actual hours",
                    meaning: "The real labor hours worked during production.",
                },
                {
                    term: "Actual rate",
                    meaning: "The actual wage rate paid per direct labor hour.",
                },
                {
                    term: "Standard rate",
                    meaning: "The expected or benchmark wage rate per direct labor hour.",
                },
            ],
            interpretation,
        };
    }, [actualHours, actualRate, standardRate]);

    return (
        <CalculatorPageLayout
            badge="Managerial & Cost"
            title="Labor Rate Variance"
            description="Check whether actual direct labor wage rates were above or below the standard labor rate."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard
                            label="Actual Hours"
                            value={actualHours}
                            onChange={setActualHours}
                            placeholder="2400"
                        />
                        <InputCard
                            label="Actual Rate per Hour"
                            value={actualRate}
                            onChange={setActualRate}
                            placeholder="180"
                        />
                        <InputCard
                            label="Standard Rate per Hour"
                            value={standardRate}
                            onChange={setStandardRate}
                            placeholder="170"
                        />
                    </InputGrid>
                </SectionCard>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="border-yellow-400/20 bg-yellow-500/10">
                        <p className="text-sm font-medium text-yellow-300">Input notice</p>
                        <p className="mt-2 text-sm leading-6 text-yellow-200">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={2}>
                        <ResultCard title="Labor Rate Variance" value={formatPHP(result.variance)} />
                        <ResultCard title="Variance Direction" value={result.direction} />
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
