import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import ComparisonBarsChart from "../../components/ComparisonBarsChart";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import ToolPinButton from "../../components/ToolPinButton";
import { computeCashConversionCycle } from "../../utils/calculatorMath";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function CashConversionCyclePage() {
    const [receivablesDays, setReceivablesDays] = useState("");
    const [inventoryDays, setInventoryDays] = useState("");
    const [payablesDays, setPayablesDays] = useState("");

    useSmartSolverConnector({
        receivablesDays: setReceivablesDays,
        inventoryDays: setInventoryDays,
        payablesDays: setPayablesDays,
    });

    const result = useMemo(() => {
        if ([receivablesDays, inventoryDays, payablesDays].some((value) => value.trim() === "")) {
            return null;
        }

        const parsedReceivablesDays = Number(receivablesDays);
        const parsedInventoryDays = Number(inventoryDays);
        const parsedPayablesDays = Number(payablesDays);

        if (
            [parsedReceivablesDays, parsedInventoryDays, parsedPayablesDays].some((value) =>
                Number.isNaN(value)
            )
        ) {
            return { error: "All inputs must be valid numbers." };
        }

        if (
            parsedReceivablesDays < 0 ||
            parsedInventoryDays < 0 ||
            parsedPayablesDays < 0
        ) {
            return { error: "Operating-cycle days cannot be negative." };
        }

        return computeCashConversionCycle({
            receivablesDays: parsedReceivablesDays,
            inventoryDays: parsedInventoryDays,
            payablesDays: parsedPayablesDays,
        });
    }, [inventoryDays, payablesDays, receivablesDays]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Working Capital"
            title="Cash Conversion Cycle"
            description="Measure how long cash stays tied up in operations by combining collection days, inventory days, and supplier payment timing."
            headerActions={
                <ToolPinButton
                    path="/accounting/cash-conversion-cycle"
                    label="Cash Conversion Cycle"
                />
            }
            inputSection={
                <SectionCard>
                    <p className="app-card-title text-base">Cycle assumptions</p>
                    <p className="app-body-md mt-2 text-sm">
                        Enter the average days to collect receivables, move inventory, and pay suppliers.
                    </p>
                    <div className="mt-4">
                        <InputGrid columns={3}>
                            <InputCard label="Receivables Days" value={receivablesDays} onChange={setReceivablesDays} placeholder="36" helperText="Average collection period" />
                            <InputCard label="Inventory Days" value={inventoryDays} onChange={setInventoryDays} placeholder="52" helperText="Average days inventory stays on hand" />
                            <InputCard label="Payables Days" value={payablesDays} onChange={setPayablesDays} placeholder="28" helperText="Average supplier payment period" />
                        </InputGrid>
                    </div>
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
                        <ResultGrid columns={3}>
                            <ResultCard title="Operating Cycle" value={`${result.operatingCycle.toFixed(1)} days`} />
                            <ResultCard
                                title="Cash Conversion Cycle"
                                value={`${result.cashConversionCycle.toFixed(1)} days`}
                                tone="accent"
                            />
                            <ResultCard title="Working Capital Pressure" value={result.pressureLevel} supportingText="Low, moderate, elevated, or high pressure" />
                        </ResultGrid>

                        <ComparisonBarsChart
                            title="Working-capital timing"
                            description="Positive days extend the time cash is tied up. Payables days shorten the cycle because suppliers help finance operations for a while."
                            formatter={(value) => `${value.toFixed(1)} days`}
                            items={[
                                { label: "Receivables days", value: Number(receivablesDays), accent: "primary" },
                                { label: "Inventory days", value: Number(inventoryDays), accent: "highlight" },
                                { label: "Payables days", value: Number(payablesDays), accent: "secondary" },
                                { label: "Net cash conversion cycle", value: result.cashConversionCycle, accent: "primary" },
                            ]}
                        />
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Operating Cycle = Receivables Days + Inventory Days. Cash Conversion Cycle = Operating Cycle − Payables Days."
                        steps={[
                            `Operating cycle = ${Number(receivablesDays).toFixed(1)} + ${Number(inventoryDays).toFixed(1)} = ${result.operatingCycle.toFixed(1)} days.`,
                            `Cash conversion cycle = ${result.operatingCycle.toFixed(1)} − ${Number(payablesDays).toFixed(1)} = ${result.cashConversionCycle.toFixed(1)} days.`,
                        ]}
                        glossary={[
                            { term: "Receivables Days", meaning: "Average time required to collect from customers." },
                            { term: "Inventory Days", meaning: "Average time inventory stays in the business before sale." },
                            { term: "Payables Days", meaning: "Average time the business takes to pay suppliers." },
                        ]}
                        interpretation={
                            result.cashConversionCycle <= 0
                                ? "A zero or negative cash conversion cycle means supplier financing covers or exceeds the operating cycle. That usually eases working-capital pressure."
                                : `The business keeps cash tied up for about ${result.cashConversionCycle.toFixed(1)} days before it returns through collections. Shortening receivable or inventory days, or carefully extending payable days, would improve liquidity.`
                        }
                        notes={[
                            "This tool is best used together with receivables turnover, inventory turnover, and accounts payable turnover for a fuller working-capital review.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
