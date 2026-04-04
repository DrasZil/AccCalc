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

export default function UnitsOfProductionDepreciationPage() {
    const [cost, setCost] = useState("");
    const [salvageValue, setSalvageValue] = useState("");
    const [totalEstimatedUnits, setTotalEstimatedUnits] = useState("");
    const [unitsProduced, setUnitsProduced] = useState("");

    useSmartSolverConnector({
        cost: setCost,
        salvageValue: setSalvageValue,
        totalEstimatedUnits: setTotalEstimatedUnits,
        unitsProduced: setUnitsProduced,
    });

    const result = useMemo(() => {
        if (
            cost.trim() === "" ||
            salvageValue.trim() === "" ||
            totalEstimatedUnits.trim() === "" ||
            unitsProduced.trim() === ""
        ) return null;

        const parsedCost = Number(cost);
        const parsedSalvageValue = Number(salvageValue);
        const parsedTotalEstimatedUnits = Number(totalEstimatedUnits);
        const parsedUnitsProduced = Number(unitsProduced);

        if ([parsedCost, parsedSalvageValue, parsedTotalEstimatedUnits, parsedUnitsProduced].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedCost < 0 || parsedSalvageValue < 0) {
            return { error: "Cost and salvage value cannot be negative." };
        }

        if (parsedTotalEstimatedUnits <= 0 || parsedUnitsProduced < 0 || parsedCost < parsedSalvageValue) {
            return { error: "Total estimated units must be greater than zero, units produced cannot be negative, and cost must not be lower than salvage value." };
        }

        if (parsedUnitsProduced > parsedTotalEstimatedUnits) {
            return { error: "Units produced for the period cannot exceed the total estimated units used by this simple depreciation model." };
        }

        const depreciableCost = parsedCost - parsedSalvageValue;
        const depreciationPerUnit = depreciableCost / parsedTotalEstimatedUnits;
        const depreciationExpense = depreciationPerUnit * parsedUnitsProduced;

        return {
            depreciableCost,
            depreciationPerUnit,
            depreciationExpense,
            formula: "Depreciation Expense = [(Cost - Salvage Value) / Total Estimated Units] × Units Produced",
            steps: [
                `Depreciable cost = ${formatPHP(parsedCost)} - ${formatPHP(parsedSalvageValue)} = ${formatPHP(depreciableCost)}`,
                `Depreciation per unit = ${formatPHP(depreciableCost)} / ${parsedTotalEstimatedUnits} = ${depreciationPerUnit.toFixed(4)}`,
                `Depreciation expense = ${depreciationPerUnit.toFixed(4)} × ${parsedUnitsProduced} = ${formatPHP(depreciationExpense)}`,
            ],
            glossary: [
                { term: "Depreciable Cost", meaning: "The portion of the asset's cost that will be allocated over its useful output." },
                { term: "Units of Production Method", meaning: "A depreciation method based on actual usage or output rather than the passage of time." },
                { term: "Depreciation per Unit", meaning: "The amount of depreciation assigned to each unit of production." },
            ],
            interpretation: `At ${parsedUnitsProduced.toLocaleString()} units of activity, the depreciation expense for the period is ${formatPHP(depreciationExpense)}.`,
        };
    }, [cost, salvageValue, totalEstimatedUnits, unitsProduced]);

    return (
        <CalculatorPageLayout
            badge="Accounting"
            title="Units of Production Depreciation"
            description="Compute depreciation expense based on actual production output for the period."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Cost" value={cost} onChange={setCost} placeholder="500000" />
                        <InputCard label="Salvage Value" value={salvageValue} onChange={setSalvageValue} placeholder="50000" />
                        <InputCard label="Total Estimated Units" value={totalEstimatedUnits} onChange={setTotalEstimatedUnits} placeholder="100000" />
                        <InputCard label="Units Produced" value={unitsProduced} onChange={setUnitsProduced} placeholder="12000" />
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
                        <ResultCard title="Depreciable Cost" value={formatPHP(result.depreciableCost)} />
                        <ResultCard title="Depreciation per Unit" value={result.depreciationPerUnit.toFixed(4)} />
                        <ResultCard title="Depreciation Expense" value={formatPHP(result.depreciationExpense)} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard formula={result.formula} steps={result.steps} glossary={result.glossary} interpretation={result.interpretation} />
                ) : null
            }
        />
    );
}
