import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeGrossProfitRate } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function GrossProfitRatePage() {
    const [netSales, setNetSales] = useState("");
    const [costOfGoodsSold, setCostOfGoodsSold] = useState("");

    useSmartSolverConnector({
        netSales: setNetSales,
        costOfGoodsSold: setCostOfGoodsSold,
    });

    const result = useMemo(() => {
        if (netSales.trim() === "" || costOfGoodsSold.trim() === "") return null;

        const parsedNetSales = Number(netSales);
        const parsedCostOfGoodsSold = Number(costOfGoodsSold);

        if ([parsedNetSales, parsedCostOfGoodsSold].some(Number.isNaN)) {
            return { error: "Both inputs must be valid numbers." };
        }

        if (parsedNetSales <= 0 || parsedCostOfGoodsSold < 0) {
            return { error: "Net sales must be greater than zero, and cost of goods sold cannot be negative." };
        }

        const { grossProfit, grossProfitRate } = computeGrossProfitRate(
            parsedNetSales,
            parsedCostOfGoodsSold
        );

        return {
            grossProfit,
            grossProfitRate,
            formula: "Gross Profit Rate = (Net Sales - Cost of Goods Sold) / Net Sales",
            steps: [
                `Gross profit = ${formatPHP(parsedNetSales)} - ${formatPHP(parsedCostOfGoodsSold)} = ${formatPHP(grossProfit)}`,
                `Gross profit rate = ${formatPHP(grossProfit)} / ${formatPHP(parsedNetSales)} = ${grossProfitRate.toFixed(2)}%`,
            ],
            glossary: [
                { term: "Net Sales", meaning: "Sales revenue after returns, allowances, and discounts." },
                { term: "Cost of Goods Sold", meaning: "The cost assigned to merchandise or goods sold during the period." },
                { term: "Gross Profit Rate", meaning: "The percentage of net sales remaining after recovering the cost of goods sold." },
            ],
            interpretation:
                grossProfit >= 0
                    ? `The entity retains ${grossProfitRate.toFixed(2)}% of net sales as gross profit before operating expenses and other period costs.`
                    : `The negative gross profit rate of ${grossProfitRate.toFixed(2)}% indicates cost of goods sold exceeded net sales, which usually signals pricing or inventory issues.`,
        };
    }, [costOfGoodsSold, netSales]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Merchandising"
            title="Gross Profit Rate"
            description="Measure how much of each sales peso remains after cost of goods sold."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Net Sales" value={netSales} onChange={setNetSales} placeholder="150000" />
                        <InputCard
                            label="Cost of Goods Sold"
                            value={costOfGoodsSold}
                            onChange={setCostOfGoodsSold}
                            placeholder="90000"
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
                        <ResultCard title="Gross Profit" value={formatPHP(result.grossProfit)} />
                        <ResultCard title="Gross Profit Rate" value={`${result.grossProfitRate.toFixed(2)}%`} />
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
