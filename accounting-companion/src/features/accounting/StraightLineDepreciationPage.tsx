import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeStraightLineDepreciation } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function StraightLineDepreciationPage() {
    const [cost, setCost] = useState("");
    const [salvageValue, setSalvageValue] = useState("");
    const [usefulLife, setUsefulLife] = useState("");

    useSmartSolverConnector({
        cost: setCost,
        salvageValue: setSalvageValue,
        usefulLife: setUsefulLife,
    });

    const result = useMemo(() => {
        if (cost.trim() === "" || salvageValue.trim() === "" || usefulLife.trim() === "") {
            return null;
        }

        const costNumber = Number(cost);
        const salvageNumber = Number(salvageValue);
        const lifeNumber = Number(usefulLife);

        if ([costNumber, salvageNumber, lifeNumber].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (lifeNumber <= 0) {
            return { error: "Useful life must be greater than zero." };
        }

        if (costNumber < 0 || salvageNumber < 0) {
            return { error: "Cost and salvage value cannot be negative." };
        }

        if (salvageNumber > costNumber) {
            return { error: "Salvage value cannot exceed cost." };
        }

        const { depreciableCost, annualDepreciation } = computeStraightLineDepreciation({
            cost: costNumber,
            salvageValue: salvageNumber,
            usefulLifeYears: lifeNumber,
        });

        return {
            annualDepreciation,
            formula: "Annual Depreciation = (Cost - Salvage Value) / Useful Life",
            steps: [
                `Cost = ${formatPHP(costNumber)}`,
                `Salvage Value = ${formatPHP(salvageNumber)}`,
                `Depreciable Cost = ${formatPHP(costNumber)} - ${formatPHP(salvageNumber)} = ${formatPHP(depreciableCost)}`,
                `Annual Depreciation = ${formatPHP(depreciableCost)} / ${lifeNumber} = ${formatPHP(annualDepreciation)}`,
            ],
            glossary: [
                { term: "Cost", meaning: "The amount capitalized for the asset." },
                { term: "Salvage Value", meaning: "The estimated residual value at the end of useful life." },
                { term: "Useful Life", meaning: "The expected service period of the asset." },
            ],
            interpretation: `Using straight-line depreciation, the asset depreciates by ${formatPHP(annualDepreciation)} each year over ${lifeNumber} year(s).`,
        };
    }, [cost, salvageValue, usefulLife]);

    return (
        <CalculatorPageLayout
            badge="Accounting"
            title="Straight-Line Depreciation"
            description="Compute annual depreciation expense using the straight-line depreciation method."
            inputSection={
                <InputGrid columns={3}>
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
                </InputGrid>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="border-yellow-400/20 bg-yellow-500/10">
                        <p className="text-sm font-medium text-yellow-300">Input notice</p>
                        <p className="mt-2 text-sm leading-6 text-yellow-200">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={1}>
                        <ResultCard title="Annual Depreciation" value={formatPHP(result.annualDepreciation)} />
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
