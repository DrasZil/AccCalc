import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeWorkingCapitalCycle } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

export default function WorkingCapitalCyclePage() {
    const [currentAssets, setCurrentAssets] = useState("");
    const [currentLiabilities, setCurrentLiabilities] = useState("");
    const [receivablesDays, setReceivablesDays] = useState("");
    const [inventoryDays, setInventoryDays] = useState("");
    const [payablesDays, setPayablesDays] = useState("");

    const result = useMemo(() => {
        const values = [
            currentAssets,
            currentLiabilities,
            receivablesDays,
            inventoryDays,
            payablesDays,
        ];

        if (values.some((value) => value.trim() === "")) return null;

        const parsed = values.map((value) => Number(value));
        if (parsed.some((value) => Number.isNaN(value))) {
            return { error: "All working-capital and cycle inputs must be valid numbers." };
        }

        if (parsed.some((value) => value < 0)) {
            return { error: "Working-capital and day-based inputs cannot be negative." };
        }

        return computeWorkingCapitalCycle({
            currentAssets: parsed[0],
            currentLiabilities: parsed[1],
            receivablesDays: parsed[2],
            inventoryDays: parsed[3],
            payablesDays: parsed[4],
        });
    }, [
        currentAssets,
        currentLiabilities,
        inventoryDays,
        payablesDays,
        receivablesDays,
    ]);

    return (
        <CalculatorPageLayout
            badge="Accounting / Analysis"
            title="Working Capital & Operating Cycle"
            description="Read short-term liquidity and operating-cycle timing from one compact worksheet instead of bouncing between separate cards."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard
                            label="Current Assets"
                            value={currentAssets}
                            onChange={setCurrentAssets}
                            placeholder="420000"
                        />
                        <InputCard
                            label="Current Liabilities"
                            value={currentLiabilities}
                            onChange={setCurrentLiabilities}
                            placeholder="180000"
                        />
                        <InputCard
                            label="Receivables Days"
                            value={receivablesDays}
                            onChange={setReceivablesDays}
                            placeholder="42"
                        />
                        <InputCard
                            label="Inventory Days"
                            value={inventoryDays}
                            onChange={setInventoryDays}
                            placeholder="58"
                        />
                        <InputCard
                            label="Payables Days"
                            value={payablesDays}
                            onChange={setPayablesDays}
                            placeholder="35"
                        />
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
                        <ResultCard title="Working Capital" value={formatPHP(result.workingCapital)} />
                        <ResultCard
                            title="Operating Cycle"
                            value={`${result.operatingCycle.toFixed(2)} days`}
                        />
                        <ResultCard
                            title="Cash Conversion Cycle"
                            value={`${result.cashConversionCycle.toFixed(2)} days`}
                        />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Working Capital = Current Assets - Current Liabilities; Operating Cycle = Receivables Days + Inventory Days; Cash Conversion Cycle = Operating Cycle - Payables Days"
                        steps={[
                            `Working capital = ${formatPHP(Number(currentAssets))} - ${formatPHP(Number(currentLiabilities))} = ${formatPHP(result.workingCapital)}.`,
                            `Operating cycle = ${Number(receivablesDays).toFixed(2)} + ${Number(inventoryDays).toFixed(2)} = ${result.operatingCycle.toFixed(2)} days.`,
                            `Cash conversion cycle = ${result.operatingCycle.toFixed(2)} - ${Number(payablesDays).toFixed(2)} = ${result.cashConversionCycle.toFixed(2)} days.`,
                        ]}
                        interpretation={`Working capital is ${formatPHP(result.workingCapital)}. The operating cycle runs for ${result.operatingCycle.toFixed(2)} days, and the cash conversion cycle is ${result.cashConversionCycle.toFixed(2)} days after considering supplier credit.`}
                        notes={[
                            "A shorter cash conversion cycle usually means the business turns invested operating cash back into cash more quickly.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
