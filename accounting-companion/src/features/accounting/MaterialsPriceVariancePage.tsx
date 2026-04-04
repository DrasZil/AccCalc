import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";

export default function MaterialsPriceVariancePage() {
    const [actualQuantity, setActualQuantity] = useState("");
    const [actualPrice, setActualPrice] = useState("");
    const [standardPrice, setStandardPrice] = useState("");

    const result = useMemo(() => {
        if (
            actualQuantity.trim() === "" ||
            actualPrice.trim() === "" ||
            standardPrice.trim() === ""
        ) {
            return null;
        }

        const parsedActualQuantity = Number(actualQuantity);
        const parsedActualPrice = Number(actualPrice);
        const parsedStandardPrice = Number(standardPrice);

        if (
            [parsedActualQuantity, parsedActualPrice, parsedStandardPrice].some((value) =>
                Number.isNaN(value)
            )
        ) {
            return { error: "All fields must contain valid numbers." };
        }

        const variance =
            parsedActualQuantity * (parsedActualPrice - parsedStandardPrice);
        const interpretation =
            variance > 0
                ? "Unfavorable variance. Actual material price exceeded the standard price."
                : variance < 0
                  ? "Favorable variance. Actual material price was lower than the standard price."
                  : "No variance. Actual material price matched the standard price.";

        return {
            variance,
            formula: "Materials Price Variance = Actual Quantity Purchased x (Actual Price - Standard Price)",
            steps: [
                `Variance = ${parsedActualQuantity} x (${formatPHP(parsedActualPrice)} - ${formatPHP(parsedStandardPrice)}) = ${formatPHP(variance)}`,
            ],
            glossary: [
                {
                    term: "Actual quantity",
                    meaning: "The number of material units actually purchased or used for the variance basis.",
                },
                {
                    term: "Actual price",
                    meaning: "The real cost paid per unit of direct material.",
                },
                {
                    term: "Standard price",
                    meaning: "The benchmark cost per unit set for planning or control.",
                },
            ],
            interpretation,
        };
    }, [actualPrice, actualQuantity, standardPrice]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Cost"
            title="Materials Price Variance"
            description="Measure whether direct materials were bought at a price above or below the standard cost."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Actual Quantity" value={actualQuantity} onChange={setActualQuantity} placeholder="5000" />
                        <InputCard label="Actual Price per Unit" value={actualPrice} onChange={setActualPrice} placeholder="22" />
                        <InputCard label="Standard Price per Unit" value={standardPrice} onChange={setStandardPrice} placeholder="20" />
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
                        <ResultCard title="Price Variance" value={formatPHP(result.variance)} />
                        <ResultCard title="Variance Direction" value={result.interpretation} />
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
