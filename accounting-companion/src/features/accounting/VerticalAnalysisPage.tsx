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

export default function VerticalAnalysisPage() {
    const [statementItemAmount, setStatementItemAmount] = useState("");
    const [statementBaseAmount, setStatementBaseAmount] = useState("");

    useSmartSolverConnector({
        statementItemAmount: setStatementItemAmount,
        statementBaseAmount: setStatementBaseAmount,
    });

    const result = useMemo(() => {
        if (statementItemAmount.trim() === "" || statementBaseAmount.trim() === "") return null;

        const parsedStatementItemAmount = Number(statementItemAmount);
        const parsedStatementBaseAmount = Number(statementBaseAmount);

        if (Number.isNaN(parsedStatementItemAmount) || Number.isNaN(parsedStatementBaseAmount)) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedStatementBaseAmount === 0) {
            return { error: "Statement base amount cannot be zero." };
        }

        const commonSizePercentage =
            (parsedStatementItemAmount / parsedStatementBaseAmount) * 100;

        return {
            commonSizePercentage,
            formula: "Vertical Analysis Percentage = Statement Item Amount / Statement Base Amount",
            steps: [
                `Common-size percentage = ${formatPHP(parsedStatementItemAmount)} / ${formatPHP(parsedStatementBaseAmount)} = ${commonSizePercentage.toFixed(2)}%`,
            ],
            glossary: [
                { term: "Statement Item Amount", meaning: "The specific line item being analyzed, such as cash, cost of sales, or operating expense." },
                { term: "Statement Base Amount", meaning: "The total used as the base, such as net sales on an income statement or total assets on a balance sheet." },
                { term: "Vertical Analysis", meaning: "A method that expresses each statement item as a percentage of a common base amount." },
            ],
            interpretation: `This item represents ${commonSizePercentage.toFixed(2)}% of the selected statement base amount.`,
        };
    }, [statementBaseAmount, statementItemAmount]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Analysis"
            title="Vertical Analysis"
            description="Compute the percentage of a statement item against a chosen base total for common-size analysis."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Statement Item Amount" value={statementItemAmount} onChange={setStatementItemAmount} placeholder="45000" />
                        <InputCard label="Statement Base Amount" value={statementBaseAmount} onChange={setStatementBaseAmount} placeholder="300000" />
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
                        <ResultCard title="Common-size Percentage" value={`${result.commonSizePercentage.toFixed(2)}%`} />
                        <ResultCard title="Statement Item Amount" value={formatPHP(Number(statementItemAmount))} />
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
