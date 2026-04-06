import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeFlexibleBudget } from "../../utils/calculatorMath";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

function varianceDirection(value: number) {
    if (Math.abs(value) < 0.005) return "On budget";
    return value > 0 ? "Unfavorable" : "Favorable";
}

export default function FlexibleBudgetPage() {
    const [budgetedUnits, setBudgetedUnits] = useState("");
    const [actualUnits, setActualUnits] = useState("");
    const [fixedCosts, setFixedCosts] = useState("");
    const [variableCostPerUnit, setVariableCostPerUnit] = useState("");
    const [actualCost, setActualCost] = useState("");

    useSmartSolverConnector({
        budgetedUnits: setBudgetedUnits,
        actualUnits: setActualUnits,
        fixedCosts: setFixedCosts,
        variableCostPerUnit: setVariableCostPerUnit,
        actualCost: setActualCost,
    });

    const result = useMemo(() => {
        if (
            budgetedUnits.trim() === "" ||
            actualUnits.trim() === "" ||
            fixedCosts.trim() === "" ||
            variableCostPerUnit.trim() === "" ||
            actualCost.trim() === ""
        ) {
            return null;
        }

        const values = [
            Number(budgetedUnits),
            Number(actualUnits),
            Number(fixedCosts),
            Number(variableCostPerUnit),
            Number(actualCost),
        ];

        if (values.some((value) => Number.isNaN(value))) {
            return { error: "Budget inputs must all be valid numbers." };
        }

        if (values.some((value) => value < 0)) {
            return { error: "Budget inputs cannot be negative." };
        }

        return computeFlexibleBudget({
            budgetedUnits: values[0],
            actualUnits: values[1],
            fixedCosts: values[2],
            variableCostPerUnit: values[3],
            actualCost: values[4],
        });
    }, [actualCost, actualUnits, budgetedUnits, fixedCosts, variableCostPerUnit]);

    return (
        <CalculatorPageLayout
            badge="Managerial & Cost / Budgeting"
            title="Flexible Budget"
            description="Compare static budget, flexible budget, and actual cost so activity variance and spending variance stay clearly separated."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Budgeted Units"
                            value={budgetedUnits}
                            onChange={setBudgetedUnits}
                            placeholder="10000"
                        />
                        <InputCard
                            label="Actual Units"
                            value={actualUnits}
                            onChange={setActualUnits}
                            placeholder="12000"
                        />
                        <InputCard
                            label="Fixed Costs"
                            value={fixedCosts}
                            onChange={setFixedCosts}
                            placeholder="150000"
                        />
                        <InputCard
                            label="Variable Cost per Unit"
                            value={variableCostPerUnit}
                            onChange={setVariableCostPerUnit}
                            placeholder="22"
                        />
                        <InputCard
                            label="Actual Cost"
                            value={actualCost}
                            onChange={setActualCost}
                            placeholder="422000"
                        />
                    </InputGrid>
                </SectionCard>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="app-tone-warning">
                        <p className="app-card-title text-sm">Input notice</p>
                        <p className="app-body-md mt-2 text-sm">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={4}>
                        <ResultCard title="Static Budget" value={formatPHP(result.staticBudget)} />
                        <ResultCard
                            title="Flexible Budget"
                            value={formatPHP(result.flexibleBudget)}
                        />
                        <ResultCard
                            title="Activity Variance"
                            value={`${formatPHP(result.activityVariance)} | ${varianceDirection(result.activityVariance)}`}
                        />
                        <ResultCard
                            title="Spending Variance"
                            value={`${formatPHP(result.spendingVariance)} | ${varianceDirection(result.spendingVariance)}`}
                        />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Flexible budget = fixed costs + (actual units x variable cost per unit)."
                        steps={[
                            `Static budget = ${formatPHP(Number(fixedCosts || 0))} + (${Number(budgetedUnits || 0)} x ${formatPHP(Number(variableCostPerUnit || 0))}) = ${formatPHP(result.staticBudget)}.`,
                            `Flexible budget = ${formatPHP(Number(fixedCosts || 0))} + (${Number(actualUnits || 0)} x ${formatPHP(Number(variableCostPerUnit || 0))}) = ${formatPHP(result.flexibleBudget)}.`,
                            `Activity variance = flexible budget - static budget = ${formatPHP(result.activityVariance)}.`,
                            `Spending variance = actual cost - flexible budget = ${formatPHP(result.spendingVariance)}.`,
                            `Static-budget variance = actual cost - static budget = ${formatPHP(result.staticBudgetVariance)}.`,
                        ]}
                        interpretation={`At the actual activity level, the flexible budget is ${formatPHP(result.flexibleBudget)}. The activity variance is ${varianceDirection(result.activityVariance).toLowerCase()}, while the spending variance is ${varianceDirection(result.spendingVariance).toLowerCase()}.`}
                        assumptions={[
                            "Variable cost per unit is assumed constant within the relevant range and fixed costs are assumed unchanged for the period.",
                        ]}
                        warnings={[
                            "A favorable or unfavorable label here assumes this is a cost budget. Revenue budgets reverse that interpretation logic.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
