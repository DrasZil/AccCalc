import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import ResultCard from "../../components/resultCard";
import SectionCard from "../../components/SectionCard";
import { computeBreakEven } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import InputGrid from "../../components/InputGrid";
import ResultGrid from "../../components/ResultGrid";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function BreakEvenPage() {
    const [fixedCosts, setFixedCosts] = useState("");
    const [sellingPricePerUnit, setSellingPricePerUnit] = useState("");
    const [variableCostPerUnit, setVariableCostPerUnit] = useState("");

    useSmartSolverConnector({
        fixedCosts: setFixedCosts,
        sellingPricePerUnit: setSellingPricePerUnit,
        variableCostPerUnit: setVariableCostPerUnit,
    });

    const result = useMemo(() => {
        if (
            fixedCosts.trim() === "" ||
            sellingPricePerUnit.trim() === "" ||
            variableCostPerUnit.trim() === ""
        ) {
            return null;
        }

        const fixed = Number(fixedCosts);
        const selling = Number(sellingPricePerUnit);
        const variable = Number(variableCostPerUnit);

        if (Number.isNaN(fixed) || Number.isNaN(selling) || Number.isNaN(variable)) {
            return {
                error: "All inputs must be valid numbers.",
            };
        }

        if (fixed < 0 || selling <= 0 || variable < 0) {
            return {
                error: "Fixed costs cannot be negative, selling price must be greater than zero, and variable cost cannot be negative.",
            };
        }

        const contributionMarginPerUnit = selling - variable;

        if (contributionMarginPerUnit <= 0) {
            return {
                error:
                    "Selling price per unit must be greater than variable cost per unit to have a valid break-even point.",
            };
        }

        const { breakEvenUnits, practicalUnits, breakEvenSales, practicalSales } =
            computeBreakEven({
                fixedCosts: fixed,
                sellingPricePerUnit: selling,
                variableCostPerUnit: variable,
            });

        return {
            contributionMarginPerUnit,
            breakEvenUnits,
            practicalUnits,
            breakEvenSales,
            practicalSales,
            formula:
                "Break-even Units = Fixed Costs / (Selling Price per Unit - Variable Cost per Unit)",
            steps: [
                `Fixed Costs = ${formatPHP(fixed)}`,
                `Selling Price per Unit = ${formatPHP(selling)}`,
                `Variable Cost per Unit = ${formatPHP(variable)}`,
                `Contribution Margin per Unit = ${formatPHP(selling)} - ${formatPHP(variable)} = ${formatPHP(contributionMarginPerUnit)}`,
                `Break-even Units = ${formatPHP(fixed)} / ${formatPHP(contributionMarginPerUnit)} = ${breakEvenUnits.toFixed(4)} units`,
                `Break-even Sales = ${breakEvenUnits.toFixed(4)} x ${formatPHP(selling)} = ${formatPHP(breakEvenSales)}`,
                `Practical whole-unit target = ${practicalUnits.toLocaleString()} units, which is about ${formatPHP(practicalSales)} in sales.`,
            ],
            glossary: [
                { term: "Fixed Costs", meaning: "Costs that remain constant in total within the relevant range." },
                { term: "Variable Cost per Unit", meaning: "The cost assigned to each unit sold or produced." },
                { term: "Contribution Margin per Unit", meaning: "The amount from each unit that helps cover fixed costs and profit." },
                { term: "Break-even Point", meaning: "The level where total revenue exactly equals total cost." },
            ],
            interpretation: `The mathematical break-even point is ${breakEvenUnits.toFixed(2)} units or ${formatPHP(breakEvenSales)} in sales. In practice, the business should target at least ${practicalUnits.toLocaleString()} whole units, or about ${formatPHP(practicalSales)}, to fully cover costs.`,
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
                            title="Practical Whole Units"
                            value={result.practicalUnits.toLocaleString()}
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
