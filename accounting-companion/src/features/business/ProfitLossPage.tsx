import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import ResultCard from "../../components/resultCard";
import formatPHP from "../../utils/formatPHP";
import InputGrid from "../../components/InputGrid";
import ResultGrid from "../../components/ResultGrid";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function ProfitLossPage() {
    const [cost, setCost] = useState("");
    const [revenue, setRevenue] = useState("");

    useSmartSolverConnector({
        cost: setCost,
        revenue: setRevenue
    });

    const result = useMemo(() => {
        if (!cost || !revenue) return null;

        const costNumber = Number(cost);
        const revenueNumber = Number(revenue);

        if (Number.isNaN(costNumber) || Number.isNaN(revenueNumber)) {
        return null;
        }

        const difference = revenueNumber - costNumber;

        let status = "Break-even";
        if (difference > 0) status = "Profit";
        else if (difference < 0) status = "Loss";

        return {
        difference,
        status,
        formula: "Profit/Loss = Revenue - Cost",
        steps: [
            `Revenue = ${revenueNumber}`,
            `Cost = ${costNumber}`,
            `Profit/Loss = ${revenueNumber} - ${costNumber} = ${difference}`,
        ],
        };
    }, [cost, revenue]);

    return (
        <CalculatorPageLayout
        badge="Business"
        title="Profit / Loss Calculator"
        description="Compare revenue and cost to determine whether the outcome is profit, loss, or break-even."
        inputSection={
            <InputGrid columns={3}>
            <InputCard
                label="Cost"
                value={cost}
                onChange={setCost}
                placeholder="5000"
            />
            <InputCard
                label="Revenue"
                value={revenue}
                onChange={setRevenue}
                placeholder="8000"
            />
            </InputGrid>
        }
        resultSection={
            result ? (
            <ResultGrid columns={2}>
                <ResultCard title="Result Type" value={result.status} />
                <ResultCard
                title="Amount"
                value={formatPHP(Math.abs(result.difference))}
                />
            </ResultGrid>
            ) : null
        }
        explanationSection={
            result ? (
            <FormulaCard formula={result.formula} steps={result.steps} />
            ) : null
        }
        />
    );
}