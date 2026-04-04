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

export default function MarginOfSafetyPage() {
    const [actualSales, setActualSales] = useState("");
    const [breakEvenSalesAmount, setBreakEvenSalesAmount] = useState("");

    useSmartSolverConnector({
        actualSales: setActualSales,
        breakEvenSalesAmount: setBreakEvenSalesAmount,
    });

    const result = useMemo(() => {
        if (actualSales.trim() === "" || breakEvenSalesAmount.trim() === "") return null;

        const actual = Number(actualSales);
        const breakEven = Number(breakEvenSalesAmount);

        if ([actual, breakEven].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (actual < 0 || breakEven < 0) {
            return { error: "Sales values cannot be negative." };
        }

        if (actual === 0) {
            return { error: "Actual sales must be greater than zero." };
        }

        const marginOfSafetyAmount = actual - breakEven;
        const marginOfSafetyRatio = (marginOfSafetyAmount / actual) * 100;

        return {
            marginOfSafetyAmount,
            marginOfSafetyRatio,
            formula: "Margin of Safety = Actual Sales - Break-even Sales",
            steps: [
                `Margin of Safety Amount = ${actual} - ${breakEven} = ${marginOfSafetyAmount}`,
                `Margin of Safety Ratio = ${marginOfSafetyAmount} / ${actual} = ${marginOfSafetyRatio}%`,
            ],
            glossary: [
                { term: "Actual Sales", meaning: "The sales level currently being achieved or expected." },
                { term: "Break-even Sales", meaning: "The sales level where total revenue equals total cost." },
                { term: "Margin of Safety", meaning: "The excess of actual sales over break-even sales." },
            ],
            interpretation:
                marginOfSafetyAmount >= 0
                    ? `Sales can decline by ${formatPHP(marginOfSafetyAmount)}, or ${marginOfSafetyRatio.toFixed(2)}%, before the business reaches break-even.`
                    : `The business is currently below break-even by ${formatPHP(Math.abs(marginOfSafetyAmount))}, which is ${Math.abs(marginOfSafetyRatio).toFixed(2)}% of actual sales.`,
        };
    }, [actualSales, breakEvenSalesAmount]);

    return (
        <CalculatorPageLayout
            badge="Business"
            title="Margin of Safety"
            description="Measure how much sales can fall before the business reaches break-even."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Actual Sales" value={actualSales} onChange={setActualSales} placeholder="400000" />
                        <InputCard
                            label="Break-even Sales"
                            value={breakEvenSalesAmount}
                            onChange={setBreakEvenSalesAmount}
                            placeholder="300000"
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
                    <ResultGrid columns={2}>
                        <ResultCard title="Margin of Safety Amount" value={formatPHP(result.marginOfSafetyAmount)} />
                        <ResultCard title="Margin of Safety Ratio" value={`${result.marginOfSafetyRatio.toFixed(2)}%`} />
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
