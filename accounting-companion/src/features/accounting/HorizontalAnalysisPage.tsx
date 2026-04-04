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

export default function HorizontalAnalysisPage() {
    const [basePeriodAmount, setBasePeriodAmount] = useState("");
    const [currentPeriodAmount, setCurrentPeriodAmount] = useState("");

    useSmartSolverConnector({
        basePeriodAmount: setBasePeriodAmount,
        currentPeriodAmount: setCurrentPeriodAmount,
    });

    const result = useMemo(() => {
        if (basePeriodAmount.trim() === "" || currentPeriodAmount.trim() === "") return null;

        const parsedBasePeriodAmount = Number(basePeriodAmount);
        const parsedCurrentPeriodAmount = Number(currentPeriodAmount);

        if (Number.isNaN(parsedBasePeriodAmount) || Number.isNaN(parsedCurrentPeriodAmount)) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedBasePeriodAmount === 0) {
            return { error: "Base period amount cannot be zero when computing percentage change." };
        }

        const amountChange = parsedCurrentPeriodAmount - parsedBasePeriodAmount;
        const percentageChange = (amountChange / parsedBasePeriodAmount) * 100;

        return {
            amountChange,
            percentageChange,
            formula:
                "Horizontal Analysis Percentage = (Current Period Amount - Base Period Amount) / Base Period Amount",
            steps: [
                `Amount change = ${formatPHP(parsedCurrentPeriodAmount)} - ${formatPHP(parsedBasePeriodAmount)} = ${formatPHP(amountChange)}`,
                `Percentage change = ${formatPHP(amountChange)} / ${formatPHP(parsedBasePeriodAmount)} = ${percentageChange.toFixed(2)}%`,
            ],
            glossary: [
                { term: "Base Period Amount", meaning: "The earlier period used as the comparison benchmark." },
                { term: "Current Period Amount", meaning: "The more recent period amount being compared against the base period." },
                { term: "Horizontal Analysis", meaning: "A comparison of financial statement changes from one period to another." },
            ],
            interpretation:
                amountChange >= 0
                    ? `The item increased by ${formatPHP(amountChange)}, which is ${percentageChange.toFixed(2)}% above the base period.`
                    : `The item decreased by ${formatPHP(Math.abs(amountChange))}, which is ${Math.abs(percentageChange).toFixed(2)}% below the base period.`,
        };
    }, [basePeriodAmount, currentPeriodAmount]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Analysis"
            title="Horizontal Analysis"
            description="Compute amount change and percentage change between a base period and a current period."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Base Period Amount" value={basePeriodAmount} onChange={setBasePeriodAmount} placeholder="120000" />
                        <InputCard label="Current Period Amount" value={currentPeriodAmount} onChange={setCurrentPeriodAmount} placeholder="150000" />
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
                        <ResultCard title="Amount Change" value={formatPHP(result.amountChange)} />
                        <ResultCard title="Percentage Change" value={`${result.percentageChange.toFixed(2)}%`} />
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
