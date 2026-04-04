import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeFutureValue } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function FutureValuePage() {
    const [presentValue, setPresentValue] = useState("");
    const [rate, setRate] = useState("");
    const [time, setTime] = useState("");

    useSmartSolverConnector({
        presentValue: setPresentValue,
        rate: setRate,
        time: setTime,
    });

    const result = useMemo(() => {
        if (presentValue.trim() === "" || rate.trim() === "" || time.trim() === "") return null;

        const pv = Number(presentValue);
        const r = Number(rate);
        const t = Number(time);

        if ([pv, r, t].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (pv <= 0) {
            return { error: "Present value must be greater than zero." };
        }

        if (t < 0) {
            return { error: "Time cannot be negative." };
        }

        if (r <= -100) {
            return { error: "Rate must be greater than -100%." };
        }

        const { rateDecimal, futureValue } = computeFutureValue({
            amount: pv,
            annualRatePercent: r,
            timeYears: t,
        });

        return {
            futureValue,
            formula: "Future Value = Present Value x (1 + rate)^time",
            steps: [
                `Present Value = ${formatPHP(pv)}`,
                `Rate = ${r.toFixed(2)}% = ${rateDecimal.toFixed(4)}`,
                `Time = ${t} year(s)`,
                `Future Value = ${formatPHP(pv)} x (1 + ${rateDecimal.toFixed(4)})^${t} = ${formatPHP(futureValue)}`,
            ],
            glossary: [
                { term: "Future Value", meaning: "The amount a present sum will grow to after compounding." },
                { term: "Growth Rate", meaning: "The periodic rate used to accumulate value over time." },
            ],
            interpretation:
                t === 0 || r === 0
                    ? `With zero growth impact, the future value remains ${formatPHP(futureValue)}.`
                    : `${formatPHP(pv)} grows to ${formatPHP(futureValue)} at ${r.toFixed(2)}% over ${t} year(s).`,
        };
    }, [presentValue, rate, time]);

    return (
        <CalculatorPageLayout
            badge="Finance"
            title="Future Value Calculator"
            description="Estimate how much a present amount will grow to in the future based on rate and time."
            inputSection={
                <InputGrid columns={3}>
                    <InputCard
                        label="Present Value"
                        value={presentValue}
                        onChange={setPresentValue}
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
                        placeholder="3"
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
                        <ResultCard title="Future Value" value={formatPHP(result.futureValue)} />
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
