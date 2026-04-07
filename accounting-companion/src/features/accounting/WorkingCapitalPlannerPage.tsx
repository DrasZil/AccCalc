import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import ComparisonBarsChart from "../../components/ComparisonBarsChart";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import {
    computeCurrentRatio,
    computeTurnoverWithDayBasis,
    computeWorkingCapitalCycle,
} from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

export default function WorkingCapitalPlannerPage() {
    const [currentAssets, setCurrentAssets] = useState("");
    const [currentLiabilities, setCurrentLiabilities] = useState("");
    const [averageReceivables, setAverageReceivables] = useState("");
    const [netCreditSales, setNetCreditSales] = useState("");
    const [averageInventory, setAverageInventory] = useState("");
    const [costOfGoodsSold, setCostOfGoodsSold] = useState("");
    const [averagePayables, setAveragePayables] = useState("");
    const [netCreditPurchases, setNetCreditPurchases] = useState("");
    const [dayBasis, setDayBasis] = useState("365");

    const result = useMemo(() => {
        const values = [
            currentAssets,
            currentLiabilities,
            averageReceivables,
            netCreditSales,
            averageInventory,
            costOfGoodsSold,
            averagePayables,
            netCreditPurchases,
            dayBasis,
        ];
        if (values.some((value) => value.trim() === "")) return null;

        const parsed = values.map((value) => Number(value));
        if (parsed.some((value) => Number.isNaN(value) || value <= 0)) {
            return { error: "All working-capital inputs must be valid positive numbers." };
        }

        const receivables = computeTurnoverWithDayBasis({
            numerator: parsed[3],
            denominator: parsed[2],
            dayBasis: parsed[8],
        });
        const inventory = computeTurnoverWithDayBasis({
            numerator: parsed[5],
            denominator: parsed[4],
            dayBasis: parsed[8],
        });
        const payables = computeTurnoverWithDayBasis({
            numerator: parsed[7],
            denominator: parsed[6],
            dayBasis: parsed[8],
        });
        const cycle = computeWorkingCapitalCycle({
            currentAssets: parsed[0],
            currentLiabilities: parsed[1],
            receivablesDays: receivables.days,
            inventoryDays: inventory.days,
            payablesDays: payables.days,
        });
        const liquidity = computeCurrentRatio({
            currentAssets: parsed[0],
            currentLiabilities: parsed[1],
        });

        return {
            receivables,
            inventory,
            payables,
            cycle,
            liquidity,
        };
    }, [
        averageInventory,
        averagePayables,
        averageReceivables,
        costOfGoodsSold,
        currentAssets,
        currentLiabilities,
        dayBasis,
        netCreditPurchases,
        netCreditSales,
    ]);

    return (
        <CalculatorPageLayout
            badge="Accounting"
            title="Working Capital Planner"
            description="See liquidity, collection days, inventory days, payables days, operating cycle, and cash conversion cycle in one planning view."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Current Assets" value={currentAssets} onChange={setCurrentAssets} placeholder="250000" />
                        <InputCard label="Current Liabilities" value={currentLiabilities} onChange={setCurrentLiabilities} placeholder="150000" />
                        <InputCard label="Day Basis" value={dayBasis} onChange={setDayBasis} placeholder="365" />
                        <InputCard label="Average Receivables" value={averageReceivables} onChange={setAverageReceivables} placeholder="85000" />
                        <InputCard label="Net Credit Sales" value={netCreditSales} onChange={setNetCreditSales} placeholder="620000" />
                        <InputCard label="Average Inventory" value={averageInventory} onChange={setAverageInventory} placeholder="93000" />
                        <InputCard label="Cost of Goods Sold" value={costOfGoodsSold} onChange={setCostOfGoodsSold} placeholder="480000" />
                        <InputCard label="Average Payables" value={averagePayables} onChange={setAveragePayables} placeholder="64000" />
                        <InputCard label="Net Credit Purchases" value={netCreditPurchases} onChange={setNetCreditPurchases} placeholder="420000" />
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
                            <ResultCard title="Working Capital" value={formatPHP(result.cycle.workingCapital)} tone="accent" />
                            <ResultCard title="Current Ratio" value={result.liquidity.currentRatio.toFixed(2)} />
                            <ResultCard title="Operating Cycle" value={`${result.cycle.operatingCycle.toFixed(1)} days`} />
                            <ResultCard title="Cash Conversion Cycle" value={`${result.cycle.cashConversionCycle.toFixed(1)} days`} />
                        </ResultGrid>

                        <ComparisonBarsChart
                            title="Working-capital timing"
                            description="Use the timing view to see which stage is stretching cash the most."
                            items={[
                                { label: "Receivables days", value: result.receivables.days, accent: "primary" },
                                { label: "Inventory days", value: result.inventory.days, accent: "highlight" },
                                { label: "Payables days", value: result.payables.days, accent: "secondary" },
                            ]}
                            formatter={(value) => `${value.toFixed(1)} days`}
                        />
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Operating cycle = receivables days + inventory days. Cash conversion cycle = operating cycle - payables days."
                        steps={[
                            `Receivables days = ${result.receivables.days.toFixed(1)}.`,
                            `Inventory days = ${result.inventory.days.toFixed(1)}.`,
                            `Payables days = ${result.payables.days.toFixed(1)}.`,
                            `Operating cycle = ${result.cycle.operatingCycle.toFixed(1)} days.`,
                            `Cash conversion cycle = ${result.cycle.cashConversionCycle.toFixed(1)} days.`,
                        ]}
                        interpretation={`This planner shows how quickly cash tied up in receivables and inventory comes back compared with how long payables help finance operations. A shorter cash conversion cycle usually means less pressure on working capital.`}
                    />
                ) : null
            }
        />
    );
}
