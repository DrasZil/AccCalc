import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeMarkupMargin } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function MarkupMarginPage() {
    const [cost, setCost] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");

    useSmartSolverConnector({
        cost: setCost,
        sellingPrice: setSellingPrice,
    });

    const result = useMemo(() => {
        if (cost.trim() === "" || sellingPrice.trim() === "") return null;

        const costNumber = Number(cost);
        const sellingPriceNumber = Number(sellingPrice);

        if ([costNumber, sellingPriceNumber].some((value) => Number.isNaN(value))) {
            return { error: "Both inputs must be valid numbers." };
        }

        if (costNumber <= 0 || sellingPriceNumber <= 0) {
            return { error: "Cost and selling price must both be greater than zero." };
        }

        const { profit, markup, margin } = computeMarkupMargin({
            cost: costNumber,
            sellingPrice: sellingPriceNumber,
        });

        return {
            profit,
            markup,
            margin,
            formula: "Markup % = (Selling Price - Cost) / Cost x 100\nMargin % = (Selling Price - Cost) / Selling Price x 100",
            steps: [
                `Cost = ${formatPHP(costNumber)}`,
                `Selling Price = ${formatPHP(sellingPriceNumber)}`,
                `Profit = ${formatPHP(sellingPriceNumber)} - ${formatPHP(costNumber)} = ${formatPHP(profit)}`,
                `Markup % = (${formatPHP(profit)} / ${formatPHP(costNumber)}) x 100 = ${markup.toFixed(2)}%`,
                `Margin % = (${formatPHP(profit)} / ${formatPHP(sellingPriceNumber)}) x 100 = ${margin.toFixed(2)}%`,
            ],
            glossary: [
                { term: "Markup", meaning: "How much profit is added relative to cost." },
                { term: "Margin", meaning: "How much of the selling price represents profit." },
            ],
            interpretation:
                profit >= 0
                    ? `The item earns ${formatPHP(profit)} in profit, equal to a markup of ${markup.toFixed(2)}% and a margin of ${margin.toFixed(2)}%.`
                    : `The item is selling below cost by ${formatPHP(Math.abs(profit))}, producing a negative markup and margin.`,
        };
    }, [cost, sellingPrice]);

    return (
        <CalculatorPageLayout
            badge="Business"
            title="Markup & Margin Calculator"
            description="Compute profit, markup percentage, and margin percentage using cost and selling price."
            inputSection={
                <InputGrid columns={3}>
                    <InputCard label="Cost" value={cost} onChange={setCost} placeholder="500" />
                    <InputCard
                        label="Selling Price"
                        value={sellingPrice}
                        onChange={setSellingPrice}
                        placeholder="800"
                    />
                </InputGrid>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="border-yellow-400/20 bg-yellow-500/10">
                        <p className="text-sm font-medium text-yellow-300">Input notice</p>
                        <p className="mt-2 text-sm leading-6 text-yellow-200">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={2}>
                        <ResultCard title="Profit" value={formatPHP(result.profit)} />
                        <ResultCard title="Markup %" value={`${result.markup.toFixed(2)}%`} />
                        <ResultCard title="Margin %" value={`${result.margin.toFixed(2)}%`} />
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
