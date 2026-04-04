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

export default function NetProfitMarginPage() {
    const [netIncome, setNetIncome] = useState("");
    const [netSales, setNetSales] = useState("");

    useSmartSolverConnector({
        netIncome: setNetIncome,
        netSales: setNetSales,
    });

    const result = useMemo(() => {
        if (netIncome.trim() === "" || netSales.trim() === "") return null;

        const parsedNetIncome = Number(netIncome);
        const parsedNetSales = Number(netSales);

        if ([parsedNetIncome, parsedNetSales].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedNetSales <= 0) {
            return { error: "Net sales must be greater than zero." };
        }

        const margin = (parsedNetIncome / parsedNetSales) * 100;

        return {
            margin,
            formula: "Net Profit Margin = Net Income / Net Sales",
            steps: [
                `Net income = ${formatPHP(parsedNetIncome)}`,
                `Net sales = ${formatPHP(parsedNetSales)}`,
                `Net profit margin = ${formatPHP(parsedNetIncome)} / ${formatPHP(parsedNetSales)} = ${margin.toFixed(2)}%`,
            ],
            glossary: [
                { term: "Net Income", meaning: "Profit remaining after operating costs, interest, and taxes are deducted." },
                { term: "Net Sales", meaning: "Sales revenue after sales returns, allowances, and discounts are deducted." },
                { term: "Net Profit Margin", meaning: "The percentage of each sales peso that becomes net income." },
            ],
            interpretation: `The business keeps about ${margin.toFixed(2)} centavos of net income for every peso of net sales.`,
        };
    }, [netIncome, netSales]);

    return (
        <CalculatorPageLayout
            badge="Business"
            title="Net Profit Margin"
            description="Measure how much of each sales peso remains as net income after all costs and expenses."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Net Income"
                            value={netIncome}
                            onChange={setNetIncome}
                            placeholder="85000"
                        />
                        <InputCard
                            label="Net Sales"
                            value={netSales}
                            onChange={setNetSales}
                            placeholder="625000"
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
                        <ResultCard title="Net Profit Margin" value={`${result.margin.toFixed(2)}%`} />
                        <ResultCard title="Net Income" value={formatPHP(Number(netIncome))} />
                        <ResultCard title="Net Sales" value={formatPHP(Number(netSales))} />
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
