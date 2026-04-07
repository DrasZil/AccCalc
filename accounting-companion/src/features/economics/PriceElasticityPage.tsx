import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import ComparisonBarsChart from "../../components/ComparisonBarsChart";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computePriceElasticity } from "../../utils/calculatorMath";

export default function PriceElasticityPage() {
    const [initialPrice, setInitialPrice] = useState("");
    const [finalPrice, setFinalPrice] = useState("");
    const [initialQuantity, setInitialQuantity] = useState("");
    const [finalQuantity, setFinalQuantity] = useState("");

    const result = useMemo(() => {
        const values = [initialPrice, finalPrice, initialQuantity, finalQuantity];
        if (values.some((value) => value.trim() === "")) return null;

        const parsed = values.map((value) => Number(value));
        if (parsed.some((value) => Number.isNaN(value) || value <= 0)) {
            return { error: "Prices and quantities must all be valid numbers greater than zero." };
        }

        return computePriceElasticity({
            initialPrice: parsed[0],
            finalPrice: parsed[1],
            initialQuantity: parsed[2],
            finalQuantity: parsed[3],
        });
    }, [finalPrice, finalQuantity, initialPrice, initialQuantity]);

    return (
        <CalculatorPageLayout
            badge="Economics / Elasticity"
            title="Price Elasticity of Demand"
            description="Use the midpoint method to measure how responsive quantity demanded is to a price change."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Initial Price" value={initialPrice} onChange={setInitialPrice} placeholder="120" />
                        <InputCard label="Final Price" value={finalPrice} onChange={setFinalPrice} placeholder="100" />
                        <InputCard label="Initial Quantity" value={initialQuantity} onChange={setInitialQuantity} placeholder="240" />
                        <InputCard label="Final Quantity" value={finalQuantity} onChange={setFinalQuantity} placeholder="300" />
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
                    <div className="space-y-4">
                        <ResultGrid columns={4}>
                            <ResultCard title="Elasticity" value={result.elasticity.toFixed(3)} tone="accent" />
                            <ResultCard
                                title="Demand Type"
                                value={result.classification}
                                tone={
                                    result.absElasticity > 1
                                        ? "success"
                                        : result.absElasticity < 1
                                          ? "warning"
                                          : "default"
                                }
                            />
                            <ResultCard title="Price Change" value={`${result.priceChangePercent.toFixed(2)}%`} />
                            <ResultCard title="Quantity Change" value={`${result.quantityChangePercent.toFixed(2)}%`} />
                        </ResultGrid>

                        <ComparisonBarsChart
                            title="Response comparison"
                            description="The midpoint method compares the percentage movement in price with the percentage movement in quantity demanded."
                            items={[
                                { label: "Price", value: result.priceChangePercent, accent: "highlight" },
                                { label: "Quantity", value: result.quantityChangePercent, accent: "primary" },
                            ]}
                            formatter={(value) => `${value.toFixed(2)}%`}
                        />
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Elasticity = (% change in quantity demanded) / (% change in price), using midpoint percentages."
                        steps={[
                            `Price change = ${result.priceChangePercent.toFixed(2)}%.`,
                            `Quantity change = ${result.quantityChangePercent.toFixed(2)}%.`,
                            `Elasticity = ${result.quantityChangePercent.toFixed(2)}% / ${result.priceChangePercent.toFixed(2)}% = ${result.elasticity.toFixed(3)}.`,
                        ]}
                        interpretation={`Demand is ${result.classification.toLowerCase()} in this price range. Revenue moved from ${result.initialRevenue.toLocaleString()} to ${result.finalRevenue.toLocaleString()}.`}
                        notes={[
                            result.absElasticity > 1
                                ? "Elastic demand means quantity responds proportionally more than price."
                                : result.absElasticity < 1
                                  ? "Inelastic demand means buyers respond proportionally less than price."
                                  : "Unit elastic demand means total revenue tends to stay relatively stable around the observed range.",
                        ]}
                        warnings={[
                            "This calculator uses the midpoint formula for arc elasticity, not point elasticity at a single price.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
