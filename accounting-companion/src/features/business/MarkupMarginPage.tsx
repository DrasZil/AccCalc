import { useMemo, useState } from "react";
import InputCard from "../../components/INputCard";
import ResultCard from "../../components/resultCard";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import formatPHP from "../../utils/formatPHP";
import InputGrid from "../../components/InputGrid";
import ResultGrid from "../../components/ResultGrid";
import FormulaCard from "../../components/FormulaCard";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function MarkupMarginPage() {
    const [cost, setCost] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");

    useSmartSolverConnector({
        cost: setCost,
        sellingPrice: setSellingPrice
    })

    const result = useMemo(() => {
        if (!cost || !sellingPrice) return null;

        const costNumber = Number(cost);
        const sellingPriceNumber = Number(sellingPrice);

        if (Number.isNaN(costNumber) || Number.isNaN(sellingPriceNumber)) {
        return null;
        }

        if (costNumber <= 0 || sellingPriceNumber <= 0) {
            return null;
        }

        const profit = sellingPriceNumber - costNumber;
        const markup = (profit / costNumber) * 100;
        const margin = (profit / sellingPriceNumber) * 100;

        return {
            profit,
            markup,
            margin,
            formula: "Markup % = (Selling Price - Cost) / Cost × 100\nMargin % = (Selling Price - Cost) / Selling Price × 100",
            steps: [
                `Cost = ${costNumber}`,
                `Selling Price = ${sellingPriceNumber}`,
                `Profit = ${sellingPriceNumber} - ${costNumber} = ${profit}`,
                `Markup % = (${profit} / ${costNumber}) × 100 = ${markup}%`,
                `Margin % = (${profit} / ${sellingPriceNumber}) × 100 = ${margin}%`,
            ],
        };
    }, [cost, sellingPrice]);

    return (
        <CalculatorPageLayout 
            badge="Business"
            title="Markup & Margin Calculator"
            description="Compute profit, markup percentage, and margin percentage using cost and selling price"
            inputSection={
                <InputGrid columns={3}>
                    <InputCard 
                        label="cost"
                        value={cost}
                        onChange={setCost}
                        placeholder="500"
                    />

                    <InputCard 
                        label="Selling Price"
                        value={sellingPrice}
                        onChange={setSellingPrice}
                        placeholder="800"
                    />
                </InputGrid>
            }

            resultSection={
                result ? (
                    <ResultGrid columns={2}>
                        <ResultCard 
                            title="Profit"
                            value={formatPHP(result.profit)}
                        />
                        <ResultCard 
                            title="Markup %"
                            value={`${result.markup.toFixed(2)}%`}
                        />
                        <ResultCard 
                            title="Margin %"
                            value={`${result.margin.toFixed(2)}%`}
                        />
                    </ResultGrid>
                ) : null
            }
            
            explanationSection={
                result ? (
                    <FormulaCard formula={result.formula} steps={result.steps}/>
                ) : null
            }
        />
    );
        }