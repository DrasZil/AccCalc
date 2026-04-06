import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeFactoryOverheadVariances } from "../../utils/calculatorMath";

function varianceLabel(value: number) {
    if (Math.abs(value) < 0.005) return "None";
    return value > 0 ? "Unfavorable" : "Favorable";
}

export default function FactoryOverheadVariancePage() {
    const [actualVariableOverhead, setActualVariableOverhead] = useState("");
    const [actualFixedOverhead, setActualFixedOverhead] = useState("");
    const [actualHours, setActualHours] = useState("");
    const [standardHoursAllowed, setStandardHoursAllowed] = useState("");
    const [standardVariableOverheadRate, setStandardVariableOverheadRate] = useState("");
    const [budgetedFixedOverhead, setBudgetedFixedOverhead] = useState("");
    const [denominatorHours, setDenominatorHours] = useState("");

    const result = useMemo(() => {
        const values = [
            actualVariableOverhead,
            actualFixedOverhead,
            actualHours,
            standardHoursAllowed,
            standardVariableOverheadRate,
            budgetedFixedOverhead,
            denominatorHours,
        ];

        if (values.some((value) => value.trim() === "")) return null;

        const parsed = values.map(Number);

        if (parsed.some((value) => Number.isNaN(value))) {
            return { error: "All overhead-variance inputs must be valid numbers." };
        }

        if (parsed.some((value) => value < 0)) {
            return { error: "Overhead costs, hours, and rates cannot be negative." };
        }

        if (parsed[6] <= 0) {
            return { error: "Denominator hours must be greater than zero so the fixed-overhead rate can be computed safely." };
        }

        return computeFactoryOverheadVariances({
            actualVariableOverhead: parsed[0],
            actualFixedOverhead: parsed[1],
            actualHours: parsed[2],
            standardHoursAllowed: parsed[3],
            standardVariableOverheadRate: parsed[4],
            budgetedFixedOverhead: parsed[5],
            denominatorHours: parsed[6],
        });
    }, [
        actualFixedOverhead,
        actualHours,
        actualVariableOverhead,
        budgetedFixedOverhead,
        denominatorHours,
        standardHoursAllowed,
        standardVariableOverheadRate,
    ]);

    return (
        <CalculatorPageLayout
            badge="Managerial & Cost / Variances"
            title="Factory Overhead Variances"
            description="Separate variable and fixed factory-overhead variances into standard textbook components without forcing the analysis into a vague one-line overhead answer."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Actual Variable Overhead"
                            value={actualVariableOverhead}
                            onChange={setActualVariableOverhead}
                            placeholder="95500"
                        />
                        <InputCard
                            label="Actual Fixed Overhead"
                            value={actualFixedOverhead}
                            onChange={setActualFixedOverhead}
                            placeholder="81000"
                        />
                        <InputCard
                            label="Actual Hours"
                            value={actualHours}
                            onChange={setActualHours}
                            placeholder="4200"
                        />
                        <InputCard
                            label="Standard Hours Allowed"
                            value={standardHoursAllowed}
                            onChange={setStandardHoursAllowed}
                            placeholder="4000"
                        />
                        <InputCard
                            label="Standard Variable OH Rate per Hour"
                            value={standardVariableOverheadRate}
                            onChange={setStandardVariableOverheadRate}
                            placeholder="22"
                        />
                        <InputCard
                            label="Budgeted Fixed Overhead"
                            value={budgetedFixedOverhead}
                            onChange={setBudgetedFixedOverhead}
                            placeholder="80000"
                        />
                        <InputCard
                            label="Denominator Hours"
                            value={denominatorHours}
                            onChange={setDenominatorHours}
                            placeholder="5000"
                            helperText="Use the hours behind the predetermined fixed-overhead rate."
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
                    <div className="space-y-4">
                        <ResultGrid columns={4}>
                            <ResultCard
                                title="VOH Spending Variance"
                                value={formatPHP(result.variableOverheadSpendingVariance)}
                                supportingText={varianceLabel(result.variableOverheadSpendingVariance)}
                            />
                            <ResultCard
                                title="VOH Efficiency Variance"
                                value={formatPHP(result.variableOverheadEfficiencyVariance)}
                                supportingText={varianceLabel(result.variableOverheadEfficiencyVariance)}
                            />
                            <ResultCard
                                title="FOH Budget Variance"
                                value={formatPHP(result.fixedOverheadBudgetVariance)}
                                supportingText={varianceLabel(result.fixedOverheadBudgetVariance)}
                            />
                            <ResultCard
                                title="FOH Volume Variance"
                                value={formatPHP(result.fixedOverheadVolumeVariance)}
                                supportingText={varianceLabel(result.fixedOverheadVolumeVariance)}
                            />
                        </ResultGrid>

                        <SectionCard>
                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="app-subtle-surface rounded-[1.1rem] px-4 py-3.5">
                                    <p className="app-card-title text-sm">Applied overhead</p>
                                    <p className="app-body-md mt-2 text-sm">
                                        Applied variable OH: {formatPHP(result.appliedVariableOverhead)}
                                        <br />
                                        Applied fixed OH: {formatPHP(result.appliedFixedOverhead)}
                                        <br />
                                        Total applied OH: {formatPHP(result.totalAppliedOverhead)}
                                    </p>
                                </div>
                                <div className="app-subtle-surface rounded-[1.1rem] px-4 py-3.5">
                                    <p className="app-card-title text-sm">Overall reading</p>
                                    <p className="app-body-md mt-2 text-sm">
                                        Standard fixed OH rate: {formatPHP(result.standardFixedOverheadRate)} per hour
                                        <br />
                                        Total actual OH: {formatPHP(result.totalActualOverhead)}
                                        <br />
                                        Total overhead variance: {formatPHP(result.totalOverheadVariance)} ({varianceLabel(result.totalOverheadVariance)})
                                    </p>
                                </div>
                            </div>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Variable OH splits into spending and efficiency variances, while fixed OH splits into budget and volume variances."
                        steps={[
                            `VOH spending variance = actual variable OH ${formatPHP(Number(actualVariableOverhead || 0))} - (actual hours ${Number(actualHours || 0)} x standard variable OH rate ${formatPHP(Number(standardVariableOverheadRate || 0))}) = ${formatPHP(result.variableOverheadSpendingVariance)}.`,
                            `VOH efficiency variance = (actual hours ${Number(actualHours || 0)} - standard hours allowed ${Number(standardHoursAllowed || 0)}) x ${formatPHP(Number(standardVariableOverheadRate || 0))} = ${formatPHP(result.variableOverheadEfficiencyVariance)}.`,
                            `FOH budget variance = actual fixed OH ${formatPHP(Number(actualFixedOverhead || 0))} - budgeted fixed OH ${formatPHP(Number(budgetedFixedOverhead || 0))} = ${formatPHP(result.fixedOverheadBudgetVariance)}.`,
                            `FOH volume variance = budgeted fixed OH ${formatPHP(Number(budgetedFixedOverhead || 0))} - applied fixed OH ${formatPHP(result.appliedFixedOverhead)} = ${formatPHP(result.fixedOverheadVolumeVariance)}.`,
                        ]}
                        glossary={[
                            {
                                term: "Applied fixed overhead",
                                meaning:
                                    "Fixed overhead assigned to production using the predetermined fixed-overhead rate and standard hours allowed.",
                            },
                            {
                                term: "Volume variance",
                                meaning:
                                    "The difference between budgeted fixed overhead and the amount of fixed overhead applied to actual production.",
                            },
                        ]}
                        interpretation={`The total overhead variance is ${formatPHP(result.totalOverheadVariance)}. Use the four supporting variances to identify whether the gap comes from spending, efficiency, fixed-budget control, or volume of activity.`}
                        assumptions={[
                            "The standard variable-overhead rate is based on hours, and the fixed-overhead rate is derived from budgeted fixed overhead divided by denominator hours.",
                        ]}
                        warnings={[
                            "Textbook formats vary slightly. If your class uses a two-variance or three-variance presentation, these four core components can still be regrouped from the same underlying data.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
