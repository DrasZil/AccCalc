import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeDoubleDecliningBalance } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function DoubleDecliningBalancePage() {
    const [cost, setCost] = useState("");
    const [salvageValue, setSalvageValue] = useState("");
    const [usefulLife, setUsefulLife] = useState("");
    const [year, setYear] = useState("");

    useSmartSolverConnector({
        cost: setCost,
        salvageValue: setSalvageValue,
        usefulLife: setUsefulLife,
        year: setYear,
    });

    const result = useMemo(() => {
        if (
            cost.trim() === "" ||
            salvageValue.trim() === "" ||
            usefulLife.trim() === "" ||
            year.trim() === ""
        ) {
            return null;
        }

        const costNumber = Number(cost);
        const salvageNumber = Number(salvageValue);
        const lifeNumber = Number(usefulLife);
        const yearNumber = Number(year);

        if ([costNumber, salvageNumber, lifeNumber, yearNumber].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (costNumber <= 0) {
            return { error: "Asset cost must be greater than zero." };
        }

        if (salvageNumber < 0) {
            return { error: "Salvage value cannot be negative." };
        }

        if (salvageNumber > costNumber) {
            return { error: "Salvage value cannot exceed asset cost." };
        }

        if (!Number.isInteger(lifeNumber) || lifeNumber <= 0) {
            return { error: "Useful life must be a whole number greater than zero." };
        }

        if (!Number.isInteger(yearNumber) || yearNumber <= 0) {
            return { error: "Year number must be a whole number greater than zero." };
        }

        if (yearNumber > lifeNumber) {
            return { error: "Year number cannot exceed the asset's useful life." };
        }

        const { rate, beginningBookValue, depreciationExpense, endingBookValue } =
            computeDoubleDecliningBalance({
                cost: costNumber,
                salvageValue: salvageNumber,
                usefulLifeYears: lifeNumber,
                yearNumber,
            });

        return {
            depreciationExpense,
            beginningBookValue,
            endingBookValue,
            formula: "Depreciation = Beginning Book Value x (2 / Useful Life), limited by salvage value",
            steps: [
                `Cost = ${formatPHP(costNumber)}`,
                `Salvage Value = ${formatPHP(salvageNumber)}`,
                `Useful Life = ${lifeNumber} year(s)`,
                `Double Declining Rate = 2 / ${lifeNumber} = ${rate.toFixed(4)}`,
                `Beginning Book Value for Year ${yearNumber} = ${formatPHP(beginningBookValue)}`,
                `Depreciation for Year ${yearNumber} = ${formatPHP(depreciationExpense)}`,
                `Ending Book Value = ${formatPHP(beginningBookValue)} - ${formatPHP(depreciationExpense)} = ${formatPHP(endingBookValue)}`,
            ],
            glossary: [
                { term: "Beginning Book Value", meaning: "The carrying amount of the asset at the start of the year." },
                { term: "Double Declining Rate", meaning: "Twice the straight-line rate applied to the beginning book value." },
                { term: "Salvage Value", meaning: "The minimum residual amount that book value should not go below." },
            ],
            interpretation: `Under the double declining balance method, depreciation for year ${yearNumber} is ${formatPHP(depreciationExpense)}, leaving an ending book value of ${formatPHP(endingBookValue)}.`,
        };
    }, [cost, salvageValue, usefulLife, year]);

    return (
        <CalculatorPageLayout
            badge="Accounting"
            title="Double Declining Balance"
            description="Estimate depreciation expense and ending book value using the double declining balance method."
            inputSection={
                <InputGrid columns={2}>
                    <InputCard label="Asset Cost" value={cost} onChange={setCost} placeholder="50000" />
                    <InputCard
                        label="Salvage Value"
                        value={salvageValue}
                        onChange={setSalvageValue}
                        placeholder="5000"
                    />
                    <InputCard
                        label="Useful Life (years)"
                        value={usefulLife}
                        onChange={setUsefulLife}
                        placeholder="5"
                    />
                    <InputCard label="Year Number" value={year} onChange={setYear} placeholder="2" />
                </InputGrid>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="border-yellow-400/20 bg-yellow-500/10">
                        <p className="text-sm font-medium text-yellow-300">Input notice</p>
                        <p className="mt-2 text-sm leading-6 text-yellow-200">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={3}>
                        <ResultCard
                            title="Beginning Book Value"
                            value={formatPHP(result.beginningBookValue)}
                        />
                        <ResultCard
                            title="Depreciation Expense"
                            value={formatPHP(result.depreciationExpense)}
                        />
                        <ResultCard
                            title="Ending Book Value"
                            value={formatPHP(result.endingBookValue)}
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
