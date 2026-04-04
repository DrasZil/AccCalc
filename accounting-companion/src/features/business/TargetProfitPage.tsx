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

export default function TargetProfitPage() {
    const [fixedCosts, setFixedCosts] = useState("");
    const [targetProfit, setTargetProfit] = useState("");
    const [sellingPricePerUnit, setSellingPricePerUnit] = useState("");
    const [variableCostPerUnit, setVariableCostPerUnit] = useState("");

    useSmartSolverConnector({
        fixedCosts: setFixedCosts,
        targetProfit: setTargetProfit,
        sellingPricePerUnit: setSellingPricePerUnit,
        variableCostPerUnit: setVariableCostPerUnit,
    });

    const result = useMemo(() => {
        if (!fixedCosts || !targetProfit || !sellingPricePerUnit || !variableCostPerUnit) {
            return null;
        }

        const fixed = Number(fixedCosts);
        const target = Number(targetProfit);
        const selling = Number(sellingPricePerUnit);
        const variable = Number(variableCostPerUnit);

        if ([fixed, target, selling, variable].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        const contributionMarginPerUnit = selling - variable;

        if (contributionMarginPerUnit <= 0) {
            return { error: "Selling price per unit must be greater than variable cost per unit." };
        }

        const requiredUnits = (fixed + target) / contributionMarginPerUnit;
        const requiredSales = requiredUnits * selling;

        return {
            contributionMarginPerUnit,
            requiredUnits,
            requiredSales,
            formula:
                "Required Units = (Fixed Costs + Target Profit) / (Selling Price per Unit - Variable Cost per Unit)",
            steps: [
                `Contribution Margin per Unit = ${selling} - ${variable} = ${contributionMarginPerUnit}`,
                `Required Units = (${fixed} + ${target}) / ${contributionMarginPerUnit} = ${requiredUnits}`,
                `Required Sales = ${requiredUnits} × ${selling} = ${requiredSales}`,
            ],
            glossary: [
                { term: "Target Profit", meaning: "The desired profit level that management wants to earn." },
                { term: "Contribution Margin per Unit", meaning: "The amount each unit contributes toward fixed costs and profit." },
                { term: "Required Units", meaning: "The sales volume needed to meet the target profit." },
            ],
            interpretation: `To earn a target profit of ${formatPHP(target)}, the business needs about ${requiredUnits.toFixed(2)} units in sales, equivalent to ${formatPHP(requiredSales)}.`,
        };
    }, [fixedCosts, sellingPricePerUnit, targetProfit, variableCostPerUnit]);

    return (
        <CalculatorPageLayout
            badge="Business"
            title="Target Profit"
            description="Compute the required units and sales needed to achieve a target profit."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Fixed Costs" value={fixedCosts} onChange={setFixedCosts} placeholder="100000" />
                        <InputCard label="Target Profit" value={targetProfit} onChange={setTargetProfit} placeholder="50000" />
                        <InputCard
                            label="Selling Price per Unit"
                            value={sellingPricePerUnit}
                            onChange={setSellingPricePerUnit}
                            placeholder="250"
                        />
                        <InputCard
                            label="Variable Cost per Unit"
                            value={variableCostPerUnit}
                            onChange={setVariableCostPerUnit}
                            placeholder="150"
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
                        <ResultCard title="Contribution Margin / Unit" value={formatPHP(result.contributionMarginPerUnit)} />
                        <ResultCard title="Required Units" value={result.requiredUnits.toFixed(2)} />
                        <ResultCard title="Required Sales" value={formatPHP(result.requiredSales)} />
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
