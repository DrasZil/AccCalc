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

export default function OperatingLeveragePage() {
    const [sales, setSales] = useState("");
    const [variableCosts, setVariableCosts] = useState("");
    const [fixedCosts, setFixedCosts] = useState("");

    useSmartSolverConnector({
        sales: setSales,
        variableCosts: setVariableCosts,
        fixedCosts: setFixedCosts,
    });

    const result = useMemo(() => {
        if (!sales || !variableCosts || !fixedCosts) return null;

        const parsedSales = Number(sales);
        const parsedVariableCosts = Number(variableCosts);
        const parsedFixedCosts = Number(fixedCosts);

        if ([parsedSales, parsedVariableCosts, parsedFixedCosts].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        const contributionMargin = parsedSales - parsedVariableCosts;
        const operatingIncome = contributionMargin - parsedFixedCosts;

        if (parsedSales <= 0) {
            return { error: "Sales must be greater than zero." };
        }

        if (operatingIncome <= 0) {
            return { error: "Operating income must be greater than zero to compute degree of operating leverage." };
        }

        const degreeOfOperatingLeverage = contributionMargin / operatingIncome;

        return {
            contributionMargin,
            operatingIncome,
            degreeOfOperatingLeverage,
            formula: "Degree of Operating Leverage = Contribution Margin / Operating Income",
            steps: [
                `Contribution margin = ${formatPHP(parsedSales)} - ${formatPHP(parsedVariableCosts)} = ${formatPHP(contributionMargin)}`,
                `Operating income = ${formatPHP(contributionMargin)} - ${formatPHP(parsedFixedCosts)} = ${formatPHP(operatingIncome)}`,
                `Degree of operating leverage = ${formatPHP(contributionMargin)} / ${formatPHP(operatingIncome)} = ${degreeOfOperatingLeverage.toFixed(2)}`,
            ],
            glossary: [
                { term: "Contribution Margin", meaning: "Sales remaining after variable costs, available to cover fixed costs and profit." },
                { term: "Operating Income", meaning: "Income from operations after both variable and fixed operating costs are deducted." },
                { term: "Degree of Operating Leverage", meaning: "A measure of how sensitive operating income is to changes in sales." },
            ],
            interpretation: `A 1% change in sales is expected to produce about a ${degreeOfOperatingLeverage.toFixed(2)}% change in operating income at this activity level.`,
        };
    }, [fixedCosts, sales, variableCosts]);

    return (
        <CalculatorPageLayout
            badge="Business"
            title="Operating Leverage"
            description="Measure how sensitive operating income is to changes in sales using contribution margin and fixed costs."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Sales" value={sales} onChange={setSales} placeholder="600000" />
                        <InputCard
                            label="Variable Costs"
                            value={variableCosts}
                            onChange={setVariableCosts}
                            placeholder="360000"
                        />
                        <InputCard
                            label="Fixed Costs"
                            value={fixedCosts}
                            onChange={setFixedCosts}
                            placeholder="150000"
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
                        <ResultCard title="Contribution Margin" value={formatPHP(result.contributionMargin)} />
                        <ResultCard title="Operating Income" value={formatPHP(result.operatingIncome)} />
                        <ResultCard title="Degree of Operating Leverage" value={result.degreeOfOperatingLeverage.toFixed(2)} />
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
