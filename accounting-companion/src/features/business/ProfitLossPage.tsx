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

export default function ProfitLossPage() {
    const [cost, setCost] = useState("");
    const [revenue, setRevenue] = useState("");

    useSmartSolverConnector({
        cost: setCost,
        revenue: setRevenue,
    });

    const result = useMemo(() => {
        if (cost.trim() === "" || revenue.trim() === "") return null;

        const costNumber = Number(cost);
        const revenueNumber = Number(revenue);

        if ([costNumber, revenueNumber].some((value) => Number.isNaN(value))) {
            return { error: "Both inputs must be valid numbers." };
        }

        if (costNumber < 0 || revenueNumber < 0) {
            return { error: "Cost and revenue cannot be negative." };
        }

        const difference = revenueNumber - costNumber;
        const status = difference > 0 ? "Profit" : difference < 0 ? "Loss" : "Break-even";

        return {
            difference,
            status,
            formula: "Profit or Loss = Revenue - Cost",
            steps: [
                `Revenue = ${formatPHP(revenueNumber)}`,
                `Cost = ${formatPHP(costNumber)}`,
                `Profit or Loss = ${formatPHP(revenueNumber)} - ${formatPHP(costNumber)} = ${formatPHP(difference)}`,
            ],
            glossary: [
                { term: "Revenue", meaning: "The amount earned from sales or services." },
                { term: "Cost", meaning: "The amount incurred to generate the revenue." },
                { term: "Profit", meaning: "Revenue exceeds cost." },
                { term: "Loss", meaning: "Cost exceeds revenue." },
            ],
            interpretation:
                difference > 0
                    ? `Revenue exceeds cost by ${formatPHP(difference)}, so the business generated a profit.`
                    : difference < 0
                      ? `Cost exceeds revenue by ${formatPHP(Math.abs(difference))}, so the business incurred a loss.`
                      : "Revenue and cost are equal, so the business is at break-even.",
        };
    }, [cost, revenue]);

    return (
        <CalculatorPageLayout
            badge="Business"
            title="Profit / Loss Calculator"
            description="Compare revenue and cost to determine whether the outcome is profit, loss, or break-even."
            inputSection={
                <InputGrid columns={3}>
                    <InputCard label="Cost" value={cost} onChange={setCost} placeholder="5000" />
                    <InputCard
                        label="Revenue"
                        value={revenue}
                        onChange={setRevenue}
                        placeholder="8000"
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
                        <ResultCard title="Result Type" value={result.status} />
                        <ResultCard title="Amount" value={formatPHP(Math.abs(result.difference))} />
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
