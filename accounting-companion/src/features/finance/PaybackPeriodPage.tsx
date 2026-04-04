import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import TextAreaCard from "../../components/TextAreaCard";
import { computePaybackPeriod } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { parseNumberList } from "../../utils/listParsers";

export default function PaybackPeriodPage() {
    const [initialInvestment, setInitialInvestment] = useState("");
    const [cashFlows, setCashFlows] = useState("");

    const result = useMemo(() => {
        if (initialInvestment.trim() === "" || cashFlows.trim() === "") return null;

        const investment = Number(initialInvestment);
        const parsedCashFlows = parseNumberList(cashFlows);

        if (Number.isNaN(investment)) {
            return { error: "Initial investment must be a valid number." };
        }

        if (investment <= 0) {
            return { error: "Initial investment must be greater than zero." };
        }

        if (parsedCashFlows.error) {
            return { error: parsedCashFlows.error };
        }

        if (parsedCashFlows.values.some((value) => value < 0)) {
            return { error: "Use net cash inflows per period for payback analysis in this tool." };
        }

        const { schedule, recovered, paybackPeriod, unrecoveredBalance } = computePaybackPeriod(
            investment,
            parsedCashFlows.values
        );
        const paybackValue = paybackPeriod ?? 0;

        return {
            recovered,
            paybackPeriod,
            unrecoveredBalance,
            paybackPeriodDisplay:
                recovered
                    ? `${paybackValue.toFixed(2)} periods`
                    : "Not reached",
            formula: "Payback period = full periods before recovery + unrecovered amount at start of final period / cash flow in final period",
            steps: [
                `Initial investment = ${formatPHP(investment)}`,
                ...schedule.map(
                    (entry) =>
                        `Period ${entry.period}: cumulative cash flow = ${formatPHP(entry.cumulativeCashFlow)}; unrecovered balance = ${formatPHP(entry.unrecoveredBalance)}`
                ),
                recovered
                    ? `Payback period = ${paybackValue.toFixed(4)} periods`
                    : `Investment is not fully recovered. Remaining unrecovered balance = ${formatPHP(unrecoveredBalance)}`,
            ],
            glossary: [
                { term: "Payback period", meaning: "The time required for cumulative cash inflows to recover the initial investment." },
                { term: "Unrecovered balance", meaning: "The investment amount still not covered by cumulative inflows." },
            ],
            interpretation:
                recovered
                    ? `The initial investment is recovered in about ${paybackValue.toFixed(2)} periods.`
                    : `The listed cash flows do not fully recover the initial investment; ${formatPHP(unrecoveredBalance)} remains unrecovered.`,
        };
    }, [cashFlows, initialInvestment]);

    return (
        <CalculatorPageLayout
            badge="Finance"
            title="Payback Period"
            description="Estimate how long cumulative cash inflows take to recover the initial investment."
            inputSection={
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                    <SectionCard>
                        <InputCard
                            label="Initial Investment"
                            value={initialInvestment}
                            onChange={setInitialInvestment}
                            placeholder="100000"
                        />
                    </SectionCard>
                    <TextAreaCard
                        label="Cash Inflows by Period"
                        value={cashFlows}
                        onChange={setCashFlows}
                        placeholder="30000, 25000, 28000, 35000"
                    />
                </div>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="border-yellow-400/20 bg-yellow-500/10">
                        <p className="text-sm font-medium text-yellow-300">Input notice</p>
                        <p className="mt-2 text-sm leading-6 text-yellow-200">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={2}>
                        <ResultCard
                            title="Payback Status"
                            value={result.recovered ? "Recovered" : "Not Recovered"}
                        />
                        <ResultCard
                            title="Payback Period"
                            value={result.paybackPeriodDisplay}
                        />
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
