import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeRetailMarkupMarkdown } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

export default function RetailMarkupMarkdownPage() {
    const [unitCost, setUnitCost] = useState("");
    const [initialRetailPrice, setInitialRetailPrice] = useState("");
    const [markdownPercent, setMarkdownPercent] = useState("");
    const [unitsSold, setUnitsSold] = useState("");

    const result = useMemo(() => {
        const values = [unitCost, initialRetailPrice, markdownPercent, unitsSold];
        if (values.some((value) => value.trim() === "")) return null;
        const numeric = values.map(Number);
        if (numeric.some(Number.isNaN)) return { error: "All retail pricing inputs must be valid numbers." };
        if (numeric[0] < 0 || numeric[1] < 0 || numeric[2] < 0 || numeric[2] > 100 || numeric[3] < 0) {
            return { error: "Use non-negative costs, prices, units, and a markdown from 0% to 100%." };
        }

        return computeRetailMarkupMarkdown({
            unitCost: numeric[0],
            initialRetailPrice: numeric[1],
            markdownPercent: numeric[2],
            unitsSold: numeric[3],
        });
    }, [initialRetailPrice, markdownPercent, unitCost, unitsSold]);

    return (
        <CalculatorPageLayout
            badge="Retail / Pricing"
            title="Retail Markup and Markdown Planner"
            description="Connect cost accounting, retail management, and pricing by showing initial markup, markdown impact, maintained margin, and gross profit."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Unit Cost" value={unitCost} onChange={setUnitCost} placeholder="480" />
                        <InputCard label="Initial Retail Price" value={initialRetailPrice} onChange={setInitialRetailPrice} placeholder="800" />
                        <InputCard label="Markdown (%)" value={markdownPercent} onChange={setMarkdownPercent} placeholder="15" />
                        <InputCard label="Units Sold" value={unitsSold} onChange={setUnitsSold} placeholder="250" />
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
                    <ResultGrid columns={3}>
                        <ResultCard title="Final Retail Price" value={formatPHP(result.finalRetailPrice)} tone="accent" />
                        <ResultCard title="Markup on Cost" value={formatPercent(result.markupOnCostPercent)} />
                        <ResultCard title="Maintained Margin" value={formatPercent(result.maintainedMarginPercent)} />
                        <ResultCard title="Markdown Amount" value={formatPHP(result.markdownAmount)} />
                        <ResultCard title="Sales Revenue" value={formatPHP(result.salesRevenue)} />
                        <ResultCard title="Gross Profit" value={formatPHP(result.grossProfit)} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Final retail price = initial retail price - markdown; maintained margin = (final retail price - cost) / final retail price"
                        steps={[
                            `Markdown = ${formatPHP(Number(initialRetailPrice))} x ${formatPercent(Number(markdownPercent))} = ${formatPHP(result.markdownAmount)}.`,
                            `Final retail price = ${formatPHP(Number(initialRetailPrice))} - ${formatPHP(result.markdownAmount)} = ${formatPHP(result.finalRetailPrice)}.`,
                            `Gross profit = (${formatPHP(result.finalRetailPrice)} - ${formatPHP(Number(unitCost))}) x ${Number(unitsSold).toFixed(2)} = ${formatPHP(result.grossProfit)}.`,
                        ]}
                        interpretation="Use this when a pricing or retail case needs both cost-side markup language and selling-price-side margin language."
                    />
                ) : null
            }
        />
    );
}
