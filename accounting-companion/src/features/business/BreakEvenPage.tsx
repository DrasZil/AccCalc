import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import ResultCard from "../../components/resultCard";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import InputGrid from "../../components/InputGrid";
import ResultGrid from "../../components/ResultGrid";

export default function BreakEvenPage() {
    const [fixedCosts, setFixedCosts] = useState("");
    const [sellingPricePerUnit, setSellingPricePerUnit] = useState("");
    const [variableCostPerUnit, setVariableCostPerUnit] = useState("");

    const result = useMemo(() => {
        if (!fixedCosts || !sellingPricePerUnit || !variableCostPerUnit) {
        return null;
        }

        const fixed = Number(fixedCosts);
        const selling = Number(sellingPricePerUnit);
        const variable = Number(variableCostPerUnit);

        if (Number.isNaN(fixed) || Number.isNaN(selling) || Number.isNaN(variable)) {
        return null;
        }

        const contributionMarginPerUnit = selling - variable;

        if (contributionMarginPerUnit <= 0) {
        return {
            error:
            "Selling price per unit must be greater than variable cost per unit to have a valid break-even point.",
        };
        }

        const breakEvenUnits = fixed / contributionMarginPerUnit;
        const breakEvenSales = breakEvenUnits * selling;

        return {
        contributionMarginPerUnit,
        breakEvenUnits,
        breakEvenSales,
        formula:
            "Break-even Units = Fixed Costs / (Selling Price per Unit - Variable Cost per Unit)",
        steps: [
            `Fixed Costs = ${fixed}`,
            `Selling Price per Unit = ${selling}`,
            `Variable Cost per Unit = ${variable}`,
            `Contribution Margin per Unit = ${selling} - ${variable} = ${contributionMarginPerUnit}`,
            `Break-even Units = ${fixed} / ${contributionMarginPerUnit} = ${breakEvenUnits}`,
            `Break-even Sales = ${breakEvenUnits} × ${selling} = ${breakEvenSales}`,
        ],
        };
    }, [fixedCosts, sellingPricePerUnit, variableCostPerUnit]);

    return (
        <CalculatorPageLayout
        badge="Business"
        title="Break-even Calculator"
        description="Find how many units and how much sales are needed to break even."
        inputSection={
            <InputGrid columns={3}>
            <InputCard
                label="Fixed Costs"
                value={fixedCosts}
                onChange={setFixedCosts}
                placeholder="10000"
            />
            <InputCard
                label="Selling Price per Unit"
                value={sellingPricePerUnit}
                onChange={setSellingPricePerUnit}
                placeholder="200"
            />
            <InputCard
                label="Variable Cost per Unit"
                value={variableCostPerUnit}
                onChange={setVariableCostPerUnit}
                placeholder="120"
            />
            </InputGrid>
        }
        resultSection={
            result && "error" in result ? (
            <SectionCard className="border-red-400/20 bg-red-500/10">
                <p className="text-sm font-medium text-red-300">Input issue</p>
                <p className="mt-2 text-sm leading-6 text-red-200">{result.error}</p>
            </SectionCard>
            ) : result ? (
            <ResultGrid columns={2}>
                <ResultCard
                title="Contribution Margin / Unit"
                value={formatPHP(result.contributionMarginPerUnit)}
                />
                <ResultCard
                title="Break-even Units"
                value={result.breakEvenUnits.toFixed(2)}
                />
                <ResultCard
                title="Break-even Sales"
                value={formatPHP(result.breakEvenSales)}
                />
            </ResultGrid>
            ) : null
        }
        explanationSection={
            result && !("error" in result) ? (
            <FormulaCard formula={result.formula} steps={result.steps} />
            ) : null
        }
        />
    );
}