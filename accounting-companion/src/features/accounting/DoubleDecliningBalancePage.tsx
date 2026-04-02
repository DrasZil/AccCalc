import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import formatPHP from "../../utils/formatPHP";

export default function DoubleDecliningBalancePage() {
    const [cost, setCost] = useState("");
    const [usefulLife, setUsefulLife] = useState("");
    const [year, setYear] = useState("");

    const result = useMemo(() => {
        if (!cost || !usefulLife || !year) return null;

        const costNumber = Number(cost);
        const lifeNumber = Number(usefulLife);
        const yearNumber = Number(year);

        if (
        Number.isNaN(costNumber) ||
        Number.isNaN(lifeNumber) ||
        Number.isNaN(yearNumber)
        ) {
        return null;
        }

        if (lifeNumber <= 0 || yearNumber <= 0) return null;

        const rate = (2 / lifeNumber);
        let bookValue = costNumber;
        let depreciationExpense = 0;

        for (let i = 1; i <= yearNumber; i++) {
        depreciationExpense = bookValue * rate;
        bookValue -= depreciationExpense;
        }

        return {
        depreciationExpense,
        endingBookValue: bookValue,
        formula: (
            <>
            Depreciation = Book Value × (2 / Useful Life)
            </>
        ),
        steps: [
            <>Cost = {costNumber}</>,
            <>Useful Life = {lifeNumber}</>,
            <>Year = {yearNumber}</>,
            <>Rate = 2 / {lifeNumber} = {rate}</>,
            <>Depreciation Expense for Year {yearNumber} = {depreciationExpense}</>,
            <>Ending Book Value = {bookValue}</>,
        ],
        };
    }, [cost, usefulLife, year]);

    return (
        <CalculatorPageLayout
        badge="Accounting"
        title="Double Declining Balance"
        description="Estimate depreciation expense and ending book value using the double declining balance method."
        inputSection={
            <InputGrid columns={3}>
            <InputCard
                label="Asset Cost"
                value={cost}
                onChange={setCost}
                placeholder="50000"
            />
            <InputCard
                label="Useful Life (years)"
                value={usefulLife}
                onChange={setUsefulLife}
                placeholder="5"
            />
            <InputCard
                label="Year Number"
                value={year}
                onChange={setYear}
                placeholder="2"
            />
            </InputGrid>
        }
        resultSection={
            result ? (
            <ResultGrid columns={2}>
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
            result ? <FormulaCard formula={result.formula} steps={result.steps} /> : null
        }
        />
    );
}