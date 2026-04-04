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

export default function TimesInterestEarnedPage() {
    const [incomeBeforeInterestAndTaxes, setIncomeBeforeInterestAndTaxes] = useState("");
    const [interestExpense, setInterestExpense] = useState("");

    useSmartSolverConnector({
        incomeBeforeInterestAndTaxes: setIncomeBeforeInterestAndTaxes,
        interestExpense: setInterestExpense,
    });

    const result = useMemo(() => {
        if (!incomeBeforeInterestAndTaxes || !interestExpense) return null;

        const parsedIncomeBeforeInterestAndTaxes = Number(incomeBeforeInterestAndTaxes);
        const parsedInterestExpense = Number(interestExpense);

        if ([parsedIncomeBeforeInterestAndTaxes, parsedInterestExpense].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedInterestExpense === 0) {
            return { error: "Interest expense cannot be zero." };
        }

        const timesInterestEarned = parsedIncomeBeforeInterestAndTaxes / parsedInterestExpense;

        return {
            timesInterestEarned,
            formula: "Times Interest Earned = Income Before Interest and Taxes / Interest Expense",
            steps: [
                `Times interest earned = ${formatPHP(parsedIncomeBeforeInterestAndTaxes)} / ${formatPHP(parsedInterestExpense)} = ${timesInterestEarned.toFixed(2)}`,
            ],
            glossary: [
                { term: "EBIT", meaning: "Income before interest and taxes, used as a measure of operating earnings available to cover interest charges." },
                { term: "Interest Expense", meaning: "The financing cost incurred for borrowed funds during the period." },
                { term: "Times Interest Earned", meaning: "An interest coverage ratio that indicates how many times operating earnings can cover interest expense." },
            ],
            interpretation: `Operating earnings cover interest expense about ${timesInterestEarned.toFixed(2)} times for the period.`,
        };
    }, [incomeBeforeInterestAndTaxes, interestExpense]);

    return (
        <CalculatorPageLayout
            badge="Accounting"
            title="Times Interest Earned"
            description="Measure a company's ability to cover interest expense using EBIT."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Income Before Interest and Taxes" value={incomeBeforeInterestAndTaxes} onChange={setIncomeBeforeInterestAndTaxes} placeholder="250000" />
                        <InputCard label="Interest Expense" value={interestExpense} onChange={setInterestExpense} placeholder="50000" />
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
                    <ResultGrid columns={3}>
                        <ResultCard title="Times Interest Earned" value={result.timesInterestEarned.toFixed(2)} />
                        <ResultCard title="EBIT" value={formatPHP(Number(incomeBeforeInterestAndTaxes))} />
                        <ResultCard title="Interest Expense" value={formatPHP(Number(interestExpense))} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard formula={result.formula} steps={result.steps} glossary={result.glossary} interpretation={result.interpretation} />
                ) : null
            }
        />
    );
}
