import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeSimpleInterest } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function SimpleInterestPage() {
    const [principal, setPrincipal] = useState("");
    const [rate, setRate] = useState("");
    const [time, setTime] = useState("");

    useSmartSolverConnector({
        principal: setPrincipal,
        rate: setRate,
        time: setTime,
    });

    const result = useMemo(() => {
        if (principal.trim() === "" || rate.trim() === "" || time.trim() === "") return null;

        const p = Number(principal);
        const r = Number(rate);
        const t = Number(time);

        if ([p, r, t].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (p <= 0) {
            return { error: "Principal must be greater than zero." };
        }

        if (r < 0 || t < 0) {
            return { error: "Rate and time cannot be negative." };
        }

        const { rateDecimal, interest, totalAmount } = computeSimpleInterest({
            principal: p,
            annualRatePercent: r,
            timeYears: t,
        });

        return {
            interest,
            totalAmount,
            formula: "Interest = Principal x Rate x Time",
            steps: [
                `Principal = ${formatPHP(p)}`,
                `Rate = ${r.toFixed(2)}% = ${rateDecimal.toFixed(4)}`,
                `Time = ${t} year(s)`,
                `Interest = ${formatPHP(p)} x ${rateDecimal.toFixed(4)} x ${t} = ${formatPHP(interest)}`,
                `Total Amount = ${formatPHP(p)} + ${formatPHP(interest)} = ${formatPHP(totalAmount)}`,
            ],
            glossary: [
                { term: "Principal", meaning: "The original amount borrowed or invested." },
                { term: "Rate", meaning: "The percentage charged or earned for each time period." },
                { term: "Time", meaning: "The number of years the money remains invested or borrowed." },
                { term: "Simple Interest", meaning: "Interest calculated only on the original principal amount." },
            ],
            interpretation:
                r === 0 || t === 0
                    ? `With a zero rate or zero time period, no simple interest is earned and the total amount remains ${formatPHP(totalAmount)}.`
                    : `The principal earns ${formatPHP(interest)} in simple interest, so the total amount after ${t} year(s) is ${formatPHP(totalAmount)}.`,
        };
    }, [principal, rate, time]);

    return (
        <CalculatorPageLayout
            badge="Finance"
            title="Simple Interest Calculator"
            description="Enter the principal, rate, and time to compute interest and total amount with step-by-step explanation."
            inputSection={
                <InputGrid columns={3}>
                    <InputCard
                        label="Principal"
                        value={principal}
                        onChange={setPrincipal}
                        placeholder="10000"
                    />
                    <InputCard
                        label="Rate (%)"
                        value={rate}
                        onChange={setRate}
                        placeholder="5"
                    />
                    <InputCard
                        label="Time (years)"
                        value={time}
                        onChange={setTime}
                        placeholder="2"
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
                    <ResultGrid columns={2}>
                        <ResultCard title="Interest" value={formatPHP(result.interest)} />
                        <ResultCard title="Total Amount" value={formatPHP(result.totalAmount)} />
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
