import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import formatPHP from "../../utils/formatPHP";

export default function StraightLineDepreciationPage() { 
    const [cost, setCost] = useState("");
    const [salvageValue, setSalvageValue] = useState("");
    const [usefulLife, setUsefulLife] = useState("");

    const result = useMemo(() => {
        if (!cost || !salvageValue || !usefulLife) return null; 
        
        const costNumber = Number(cost);
        const salvageNumber = Number(salvageValue);
        const lifeNumber = Number(usefulLife);

        if (
            isNaN(costNumber) || isNaN(salvageNumber) || isNaN(lifeNumber)
        ) {
            return null;
        }

        if (lifeNumber <= 0 || costNumber < 0 || salvageNumber < 0) return null;

        const annualDepreciation = (costNumber - salvageNumber) / lifeNumber;

        return {
            annualDepreciation,
            formula: <>Annual Depreciation = (Cost - Salvage Value) / Useful Life</>,
            steps: [
                <>Cost = {costNumber}</>,
                <>Salvage Value = {salvageNumber}</>,
                <>Useful Life = {lifeNumber}</>,
                <>
                    Annual Depreciation = ({costNumber} - {salvageNumber}) / {lifeNumber}
                </>,
                <>Annual Depreciation = {annualDepreciation}</>,
            ],
        };
    }, [cost, salvageValue, usefulLife]);

    return (
    <CalculatorPageLayout
        badge="Accounting"
        title="Straight-Line Depreciation"
        description="Compute annual depreciation expense using the straight-line depreciation method."
        inputSection={
            <InputGrid columns={3}>
            <InputCard
                label="Asset Cost"
                value={cost}
                onChange={setCost}
                placeholder="50000"
            />
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
            result ? (
            <ResultGrid columns={1}>
                <ResultCard
                title="Annual Depreciation"
                value={formatPHP(result.annualDepreciation)}
                />
            </ResultGrid>
            ) : null
        }
        explanationSection={
            result ? <FormulaCard formula={result.formula} steps={result.steps} /> : null
        }
        />
    );
}