import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import ResultCard from "../../components/resultCard";
import formatPHP from "../../utils/formatPHP";
import InputGrid from "../../components/InputGrid";
import ResultGrid from "../../components/ResultGrid";

export default function ContributionMarginPage() {
    const [sales, setSales] = useState("");
    const [variableCosts, setVariableCosts] = useState("");

    const result = useMemo(() => {
        if (!sales || !variableCosts) {
        return null;
        }

        const salesNumber = Number(sales);
        const variableCostsNumber = Number(variableCosts);

        if (Number.isNaN(salesNumber) || Number.isNaN(variableCostsNumber)) {
        return null;
        }

        const contributionMargin = salesNumber - variableCostsNumber;
        const contributionMarginRatio =
        salesNumber !== 0 ? (contributionMargin / salesNumber) * 100 : 0;

        return {
        contributionMargin,
        contributionMarginRatio,
        formula: "Contribution Margin = Sales - Variable Costs",
        steps: [
            `Sales = ${salesNumber}`,
            `Variable Costs = ${variableCostsNumber}`,
            `Contribution Margin = ${salesNumber} - ${variableCostsNumber} = ${contributionMargin}`,
            `Contribution Margin Ratio = (${contributionMargin} / ${salesNumber}) × 100 = ${contributionMarginRatio}%`,
        ],
        };
    }, [sales, variableCosts]);

    return (
        <CalculatorPageLayout
        badge="Business"
        title="Contribution Margin Calculator"
        description="Compute contribution margin and contribution margin ratio for business analysis and decision-making."
        inputSection={
            <InputGrid columns={3}>
            <InputCard
                label="Sales"
                value={sales}
                onChange={setSales}
                placeholder="20000"
            />
            <InputCard
                label="Variable Costs"
                value={variableCosts}
                onChange={setVariableCosts}
                placeholder="12000"
            />
            </InputGrid>
        }
        resultSection={
            result ? (
            <ResultGrid columns={2}>
                <ResultCard
                title="Contribution Margin"
                value={formatPHP(result.contributionMargin)}
                />
                <ResultCard
                title="Contribution Margin Ratio"
                value={`${result.contributionMarginRatio.toFixed(2)}%`}
                />
            </ResultGrid>
            ) : null
        }
        explanationSection={
            result ? (
            <FormulaCard formula={result.formula} steps={result.steps} />
            ) : null
        }
        />
    );
}