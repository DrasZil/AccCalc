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

export default function SinkingFundDepositPage() {
    const [futureValue, setFutureValue] = useState("");
    const [rate, setRate] = useState("");
    const [periods, setPeriods] = useState("");

    useSmartSolverConnector({
        futureValue: setFutureValue,
        rate: setRate,
        periods: setPeriods,
    });

    const result = useMemo(() => {
        if (!futureValue || !rate || !periods) return null;

        const targetAmount = Number(futureValue);
        const periodicRatePercent = Number(rate);
        const totalPeriods = Number(periods);

        if ([targetAmount, periodicRatePercent, totalPeriods].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (targetAmount <= 0 || periodicRatePercent < 0 || totalPeriods <= 0) {
            return { error: "Target amount and periods must be greater than zero, and rate cannot be negative." };
        }

        const periodicRate = periodicRatePercent / 100;
        const requiredDeposit =
            periodicRate === 0
                ? targetAmount / totalPeriods
                : targetAmount / (((1 + periodicRate) ** totalPeriods - 1) / periodicRate);

        return {
            requiredDeposit,
            formula: "Periodic Deposit = Future Value / [((1 + r)^n - 1) / r]",
            steps: [
                `Future value target = ${targetAmount}`,
                `Rate per period = ${periodicRatePercent}% = ${periodicRate}`,
                `Number of periods = ${totalPeriods}`,
                `Periodic deposit = ${targetAmount} / [((1 + ${periodicRate})^${totalPeriods} - 1) / ${periodicRate || 1}] = ${requiredDeposit}`,
            ],
            glossary: [
                { term: "Sinking Fund", meaning: "A fund built through periodic deposits in order to reach a future amount." },
                { term: "Future Value Target", meaning: "The amount you want the fund to accumulate at the end of the saving period." },
                { term: "Periodic Deposit", meaning: "The equal amount invested each period to build the fund." },
            ],
            interpretation: `To accumulate ${formatPHP(targetAmount)} in ${totalPeriods} periods at ${periodicRatePercent}% per period, you need to deposit ${formatPHP(requiredDeposit)} each period.`,
        };
    }, [futureValue, periods, rate]);

    return (
        <CalculatorPageLayout
            badge="Finance"
            title="Sinking Fund Deposit"
            description="Find the regular deposit needed to accumulate a target future amount over a set number of periods."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard
                            label="Future Value Target"
                            value={futureValue}
                            onChange={setFutureValue}
                            placeholder="100000"
                        />
                        <InputCard
                            label="Rate per Period (%)"
                            value={rate}
                            onChange={setRate}
                            placeholder="2"
                        />
                        <InputCard
                            label="Number of Periods"
                            value={periods}
                            onChange={setPeriods}
                            placeholder="24"
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
                        <ResultCard title="Required Deposit per Period" value={formatPHP(result.requiredDeposit)} />
                        <ResultCard title="Target Future Value" value={formatPHP(Number(futureValue))} />
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
