import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeTrialBalance } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

export default function TrialBalanceCheckerPage() {
    const [totalDebits, setTotalDebits] = useState("");
    const [totalCredits, setTotalCredits] = useState("");

    const result = useMemo(() => {
        if (totalDebits.trim() === "" || totalCredits.trim() === "") return null;

        const parsedTotalDebits = Number(totalDebits);
        const parsedTotalCredits = Number(totalCredits);

        if ([parsedTotalDebits, parsedTotalCredits].some((value) => Number.isNaN(value))) {
            return { error: "Total debits and total credits must both be valid numbers." };
        }

        if (parsedTotalDebits < 0 || parsedTotalCredits < 0) {
            return { error: "Total debits and total credits cannot be negative." };
        }

        const balance = computeTrialBalance(parsedTotalDebits, parsedTotalCredits);
        const possibleTransposition =
            !balance.isBalanced &&
            Number.isInteger(balance.amountToCorrect) &&
            balance.amountToCorrect % 9 === 0;

        return {
            ...balance,
            possibleTransposition,
            formula: "Difference = Total Debits - Total Credits",
            steps: [
                `Difference = ${formatPHP(parsedTotalDebits)} - ${formatPHP(parsedTotalCredits)} = ${formatPHP(balance.difference)}`,
                balance.isBalanced
                    ? "The trial balance is in balance because total debits equal total credits within rounding tolerance."
                    : `The ${balance.shortSide} side is short by ${formatPHP(balance.amountToCorrect)}.`,
            ],
            glossary: [
                {
                    term: "Balanced trial balance",
                    meaning: "A trial balance where total debits equal total credits.",
                },
                {
                    term: "Short side",
                    meaning: "The column that needs additional amount to match the other side.",
                },
            ],
            interpretation: balance.isBalanced
                ? "The totals agree, so the trial balance is arithmetically balanced. Errors of omission or incorrect account classification can still exist."
                : `The trial balance does not balance yet. ${formatPHP(balance.amountToCorrect)} is needed on the ${balance.shortSide} side to make the totals equal.`,
            warnings: possibleTransposition
                ? [
                      "Because the difference is divisible by 9, review for a possible transposition or slide error in one of the posted amounts.",
                  ]
                : [],
            assumptions: [
                "This checker confirms arithmetic balance only. A balanced trial balance does not guarantee every journal entry was correct.",
            ],
        };
    }, [totalCredits, totalDebits]);

    return (
        <CalculatorPageLayout
            badge="Accounting"
            title="Trial Balance Checker"
            description="Compare total debits and credits, identify the short side, and flag common classroom error patterns."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Total Debits"
                            value={totalDebits}
                            onChange={setTotalDebits}
                            placeholder="250000"
                        />
                        <InputCard
                            label="Total Credits"
                            value={totalCredits}
                            onChange={setTotalCredits}
                            placeholder="249500"
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
                    <ResultGrid columns={4}>
                        <ResultCard
                            title="Status"
                            value={result.isBalanced ? "Balanced" : "Not Balanced"}
                        />
                        <ResultCard title="Difference" value={formatPHP(Math.abs(result.difference))} />
                        <ResultCard
                            title="Short Side"
                            value={result.isBalanced ? "None" : result.shortSide}
                        />
                        <ResultCard
                            title="Amount to Correct"
                            value={formatPHP(result.amountToCorrect)}
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
                        warnings={result.warnings}
                        assumptions={result.assumptions}
                    />
                ) : null
            }
        />
    );
}
