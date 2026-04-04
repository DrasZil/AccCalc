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

export default function ReturnOnEquityPage() {
    const [netIncome, setNetIncome] = useState("");
    const [averageEquity, setAverageEquity] = useState("");

    useSmartSolverConnector({
        netIncome: setNetIncome,
        averageEquity: setAverageEquity,
    });

    const result = useMemo(() => {
        if (!netIncome || !averageEquity) return null;

        const parsedNetIncome = Number(netIncome);
        const parsedAverageEquity = Number(averageEquity);

        if ([parsedNetIncome, parsedAverageEquity].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedAverageEquity === 0) {
            return { error: "Average equity cannot be zero." };
        }

        const returnOnEquity = (parsedNetIncome / parsedAverageEquity) * 100;

        return {
            returnOnEquity,
            formula: "Return on Equity = Net Income / Average Equity",
            steps: [
                `Net income = ${formatPHP(parsedNetIncome)}`,
                `Average equity = ${formatPHP(parsedAverageEquity)}`,
                `Return on equity = ${formatPHP(parsedNetIncome)} / ${formatPHP(parsedAverageEquity)} = ${returnOnEquity.toFixed(2)}%`,
            ],
            glossary: [
                { term: "Net Income", meaning: "Profit earned for the period after all expenses and taxes." },
                { term: "Average Equity", meaning: "The average owners' equity invested during the period." },
                { term: "Return on Equity", meaning: "A profitability ratio showing how much income was earned relative to owners' investment." },
            ],
            interpretation: `The business earned ${returnOnEquity.toFixed(2)}% on the owners' average equity for the period.`,
        };
    }, [averageEquity, netIncome]);

    return (
        <CalculatorPageLayout
            badge="Accounting"
            title="Return on Equity"
            description="Measure the rate of return earned on the owners' average equity investment."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Net Income"
                            value={netIncome}
                            onChange={setNetIncome}
                            placeholder="120000"
                        />
                        <InputCard
                            label="Average Equity"
                            value={averageEquity}
                            onChange={setAverageEquity}
                            placeholder="480000"
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
                    <ResultGrid columns={3}>
                        <ResultCard title="Return on Equity" value={`${result.returnOnEquity.toFixed(2)}%`} />
                        <ResultCard title="Net Income" value={formatPHP(Number(netIncome))} />
                        <ResultCard title="Average Equity" value={formatPHP(Number(averageEquity))} />
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
