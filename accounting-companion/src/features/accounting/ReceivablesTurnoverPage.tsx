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

export default function ReceivablesTurnoverPage() {
    const [netCreditSales, setNetCreditSales] = useState("");
    const [averageAccountsReceivable, setAverageAccountsReceivable] = useState("");

    useSmartSolverConnector({
        netCreditSales: setNetCreditSales,
        averageAccountsReceivable: setAverageAccountsReceivable,
    });

    const result = useMemo(() => {
        if (netCreditSales.trim() === "" || averageAccountsReceivable.trim() === "") {
            return null;
        }

        const sales = Number(netCreditSales);
        const receivables = Number(averageAccountsReceivable);

        if (Number.isNaN(sales) || Number.isNaN(receivables)) {
            return { error: "All inputs must be valid numbers." };
        }

        if (sales < 0 || receivables < 0) {
            return { error: "Net credit sales and average receivables cannot be negative." };
        }

        if (receivables === 0) {
            return { error: "Average accounts receivable cannot be zero for turnover analysis." };
        }

        const receivablesTurnover = sales / receivables;
        const averageCollectionPeriod = 365 / receivablesTurnover;

        return {
            receivablesTurnover,
            averageCollectionPeriod,
            formula: (
                <>
                    Accounts Receivable Turnover = Net Credit Sales / Average Accounts Receivable
                    <br />
                    Average Collection Period = 365 / Accounts Receivable Turnover
                </>
            ),
            steps: [
                `Receivables Turnover = ${formatPHP(sales)} / ${formatPHP(receivables)} = ${receivablesTurnover.toFixed(2)} times`,
                `Average Collection Period = 365 / ${receivablesTurnover.toFixed(2)} = ${averageCollectionPeriod.toFixed(2)} days`,
            ],
            glossary: [
                { term: "Net Credit Sales", meaning: "Sales made on account after deductions such as returns and allowances." },
                { term: "Average Accounts Receivable", meaning: "Average receivables balance for the period." },
                { term: "Receivables Turnover", meaning: "How many times receivables are converted into cash during the period." },
                { term: "Average Collection Period", meaning: "Estimated number of days it takes to collect receivables." },
            ],
            interpretation: `Receivables are collected about ${receivablesTurnover.toFixed(2)} times per year, or roughly every ${averageCollectionPeriod.toFixed(2)} days.`,
        };
    }, [averageAccountsReceivable, netCreditSales]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Receivables"
            title="Accounts Receivable Turnover"
            description="Compute receivables turnover and average collection period for statement analysis problems."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Net Credit Sales"
                            value={netCreditSales}
                            onChange={setNetCreditSales}
                            placeholder="600000"
                        />
                        <InputCard
                            label="Average Accounts Receivable"
                            value={averageAccountsReceivable}
                            onChange={setAverageAccountsReceivable}
                            placeholder="75000"
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
                        <ResultCard
                            title="Receivables Turnover"
                            value={`${result.receivablesTurnover.toFixed(2)} times`}
                        />
                        <ResultCard
                            title="Average Collection Period"
                            value={`${result.averageCollectionPeriod.toFixed(2)} days`}
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
