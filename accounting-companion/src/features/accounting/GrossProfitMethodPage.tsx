import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function GrossProfitMethodPage() {
    const [netSales, setNetSales] = useState("");
    const [grossProfitRate, setGrossProfitRate] = useState("");
    const [costOfGoodsAvailable, setCostOfGoodsAvailable] = useState("");

    useSmartSolverConnector({
        netSales: setNetSales,
        grossProfitRate: setGrossProfitRate,
        costOfGoodsAvailable: setCostOfGoodsAvailable,
    });

    const result = useMemo(() => {
        if (
        netSales.trim() === "" ||
        grossProfitRate.trim() === "" ||
        costOfGoodsAvailable.trim() === ""
        ) {
        return null;
        }

        const sales = Number(netSales);
        const rate = Number(grossProfitRate);
        const goodsAvailable = Number(costOfGoodsAvailable);

        if (
        Number.isNaN(sales) ||
        Number.isNaN(rate) ||
        Number.isNaN(goodsAvailable)
        ) {
        return {
            error: "All inputs must be valid numbers.",
        };
        }

        if (sales < 0 || rate < 0 || goodsAvailable < 0) {
        return {
            error: "Values cannot be negative.",
        };
        }

        if (rate > 100) {
        return {
            error: "Gross profit rate cannot be greater than 100%.",
        };
        }

        const grossProfitRateDecimal = rate / 100;
        const estimatedGrossProfit = sales * grossProfitRateDecimal;
        const estimatedCOGS = sales - estimatedGrossProfit;
        const estimatedEndingInventory = goodsAvailable - estimatedCOGS;

        if (estimatedEndingInventory < 0) {
        return {
            error:
            "Estimated ending inventory is negative. Check your inputs because cost of goods sold cannot exceed cost of goods available.",
        };
        }

        return {
        sales,
        rate,
        goodsAvailable,
        grossProfitRateDecimal,
        estimatedGrossProfit,
        estimatedCOGS,
        estimatedEndingInventory,
        formula: (
            <>
            Gross Profit = Net Sales × Gross Profit Rate
            <br />
            Cost of Goods Sold = Net Sales − Gross Profit
            <br />
            Ending Inventory = Cost of Goods Available for Sale − Cost of Goods
            Sold
            </>
        ),
        steps: [
            `Gross Profit Rate = ${rate.toFixed(2)}% = ${grossProfitRateDecimal.toFixed(
            4
            )}`,
            `Estimated Gross Profit = ${formatPHP(sales)} × ${grossProfitRateDecimal.toFixed(
            4
            )} = ${formatPHP(estimatedGrossProfit)}`,
            `Estimated Cost of Goods Sold = ${formatPHP(
            sales
            )} − ${formatPHP(estimatedGrossProfit)} = ${formatPHP(estimatedCOGS)}`,
            `Estimated Ending Inventory = ${formatPHP(
            goodsAvailable
            )} − ${formatPHP(estimatedCOGS)} = ${formatPHP(
            estimatedEndingInventory
            )}`,
        ],
        };
    }, [netSales, grossProfitRate, costOfGoodsAvailable]);

    return (
        <CalculatorPageLayout
        badge="Accounting • Merchandising"
        title="Gross Profit Method"
        description="Estimate gross profit, cost of goods sold, and ending inventory using net sales, gross profit rate, and cost of goods available for sale."
        inputSection={
            <SectionCard>
            <InputGrid columns={3}>
                <InputCard
                label="Net Sales"
                value={netSales}
                onChange={setNetSales}
                placeholder="e.g. 1500"
                />
                <InputCard
                label="Gross Profit Rate (%)"
                value={grossProfitRate}
                onChange={setGrossProfitRate}
                placeholder="e.g. 25"
                />
                <InputCard
                label="Cost of Goods Available for Sale"
                value={costOfGoodsAvailable}
                onChange={setCostOfGoodsAvailable}
                placeholder="e.g. 1100"
                />
            </InputGrid>
            </SectionCard>
        }
        resultSection={
            result && "error" in result ? (
            <SectionCard>
                <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
                <p className="font-semibold">Input notice</p>
                <p className="mt-1">{result.error}</p>
                </div>
            </SectionCard>
            ) : result ? (
            <ResultGrid columns={3}>
                <ResultCard
                title="Estimated Gross Profit"
                value={formatPHP(result.estimatedGrossProfit)}
                />
                <ResultCard
                title="Estimated Cost of Goods Sold"
                value={formatPHP(result.estimatedCOGS)}
                />
                <ResultCard
                title="Estimated Ending Inventory"
                value={formatPHP(result.estimatedEndingInventory)}
                />
            </ResultGrid>
            ) : null
        }
        explanationSection={
            result && !("error" in result) ? (
            <FormulaCard formula={result.formula} steps={result.steps} />
            ) : null
        }
        />
    );
}