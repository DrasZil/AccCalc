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

export default function ContributionMarginPage() {
    const [sales, setSales] = useState("");
    const [variableCosts, setVariableCosts] = useState("");

    useSmartSolverConnector({
        sales: setSales,
        variableCosts: setVariableCosts,
    });

    const result = useMemo(() => {
        if (sales.trim() === "" || variableCosts.trim() === "") return null;

        const salesNumber = Number(sales);
        const variableCostsNumber = Number(variableCosts);

        if ([salesNumber, variableCostsNumber].some((value) => Number.isNaN(value))) {
            return { error: "Both inputs must be valid numbers." };
        }

        if (salesNumber < 0 || variableCostsNumber < 0) {
            return { error: "Sales and variable costs cannot be negative." };
        }

        const contributionMargin = salesNumber - variableCostsNumber;
        const contributionMarginRatio =
            salesNumber === 0 ? null : (contributionMargin / salesNumber) * 100;

        return {
            contributionMargin,
            contributionMarginRatio,
            formula: "Contribution Margin = Sales - Variable Costs",
            steps: [
                `Sales = ${formatPHP(salesNumber)}`,
                `Variable Costs = ${formatPHP(variableCostsNumber)}`,
                `Contribution Margin = ${formatPHP(salesNumber)} - ${formatPHP(variableCostsNumber)} = ${formatPHP(contributionMargin)}`,
                salesNumber === 0
                    ? "Contribution Margin Ratio is not defined when sales is zero."
                    : `Contribution Margin Ratio = (${formatPHP(contributionMargin)} / ${formatPHP(salesNumber)}) x 100 = ${contributionMarginRatio?.toFixed(2)}%`,
            ],
            glossary: [
                { term: "Contribution Margin", meaning: "The amount left from sales after covering variable costs." },
                { term: "Contribution Margin Ratio", meaning: "The proportion of sales available to cover fixed costs and profit." },
            ],
            interpretation:
                salesNumber === 0
                    ? `Contribution margin is ${formatPHP(contributionMargin)}, but the ratio is not available because sales is zero.`
                    : `Each peso of sales contributes about ${contributionMarginRatio?.toFixed(2)}% toward fixed costs and profit.`,
        };
    }, [sales, variableCosts]);

    return (
        <CalculatorPageLayout
            badge="Business"
            title="Contribution Margin Calculator"
            description="Compute contribution margin and contribution margin ratio for business analysis and decision-making."
            inputSection={
                <InputGrid columns={3}>
                    <InputCard label="Sales" value={sales} onChange={setSales} placeholder="20000" />
                    <InputCard
                        label="Variable Costs"
                        value={variableCosts}
                        onChange={setVariableCosts}
                        placeholder="12000"
                    />
                </InputGrid>
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
                            title="Contribution Margin"
                            value={formatPHP(result.contributionMargin)}
                        />
                        <ResultCard
                            title="Contribution Margin Ratio"
                            value={
                                result.contributionMarginRatio === null
                                    ? "N/A"
                                    : `${result.contributionMarginRatio.toFixed(2)}%`
                            }
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
