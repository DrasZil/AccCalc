import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeEffectiveAnnualRate } from "../../utils/calculatorMath";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function EffectiveInterestRatePage() {
    const [annualRate, setAnnualRate] = useState("");
    const [timesCompounded, setTimesCompounded] = useState("");

    useSmartSolverConnector({
        annualRate: setAnnualRate,
        timesCompounded: setTimesCompounded,
    });

    const result = useMemo(() => {
        if (annualRate.trim() === "" || timesCompounded.trim() === "") return null;

        const nominalRate = Number(annualRate);
        const compoundsPerYear = Number(timesCompounded);

        if ([nominalRate, compoundsPerYear].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (nominalRate < 0 || compoundsPerYear <= 0 || !Number.isInteger(compoundsPerYear)) {
            return { error: "Rate cannot be negative, and times compounded must be a whole number greater than zero." };
        }

        const { nominalRateDecimal, effectiveRate } = computeEffectiveAnnualRate(
            nominalRate,
            compoundsPerYear
        );

        return {
            effectiveRate,
            formula: "Effective Annual Rate = (1 + Nominal Rate / m)^m - 1",
            steps: [
                `Nominal rate = ${nominalRate}% = ${nominalRateDecimal}`,
                `Compounding frequency = ${compoundsPerYear}`,
                `Effective annual rate = (1 + ${nominalRateDecimal} / ${compoundsPerYear})^${compoundsPerYear} - 1 = ${(effectiveRate / 100).toFixed(6)}`,
                `Effective annual rate = ${effectiveRate.toFixed(4)}%`,
            ],
            glossary: [
                { term: "Nominal Rate", meaning: "The stated annual rate before considering intra-year compounding." },
                { term: "Effective Annual Rate", meaning: "The actual annual yield or annual borrowing cost after compounding is considered." },
                { term: "Compounding Frequency", meaning: "How many times interest is applied during one year." },
            ],
            interpretation: `A nominal annual rate of ${nominalRate}% compounded ${compoundsPerYear} times per year is effectively ${effectiveRate.toFixed(4)}% for the full year.`,
        };
    }, [annualRate, timesCompounded]);

    return (
        <CalculatorPageLayout
            badge="Finance"
            title="Effective Interest Rate"
            description="Convert a nominal annual rate into its effective annual rate using the compounding frequency."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Nominal Annual Rate (%)"
                            value={annualRate}
                            onChange={setAnnualRate}
                            placeholder="12"
                        />
                        <InputCard
                            label="Times Compounded per Year"
                            value={timesCompounded}
                            onChange={setTimesCompounded}
                            placeholder="12"
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
                        <ResultCard title="Effective Annual Rate" value={`${result.effectiveRate.toFixed(4)}%`} />
                        <ResultCard title="Compounds per Year" value={timesCompounded} />
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
