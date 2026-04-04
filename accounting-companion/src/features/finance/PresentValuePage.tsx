import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computePresentValue } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function PresentValuePage() {
    const [futureValue, setFutureValue] = useState("");
    const [rate, setRate] = useState("");
    const [time, setTime] = useState("");

    useSmartSolverConnector({
        futureValue: setFutureValue,
        rate: setRate,
        time: setTime,
    });

    const result = useMemo(() => {
        if (futureValue.trim() === "" || rate.trim() === "" || time.trim() === "") return null;

        const fv = Number(futureValue);
        const r = Number(rate);
        const t = Number(time);

        if ([fv, r, t].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (fv <= 0) {
            return { error: "Future value must be greater than zero." };
        }

        if (t < 0) {
            return { error: "Time cannot be negative." };
        }

        if (r <= -100) {
            return { error: "Rate must be greater than -100%." };
        }

        const { rateDecimal, presentValue } = computePresentValue({
            amount: fv,
            annualRatePercent: r,
            timeYears: t,
        });

        return {
            presentValue,
            formula: "Present Value = Future Value / (1 + rate)^time",
            steps: [
                `Future Value = ${formatPHP(fv)}`,
                `Rate = ${r.toFixed(2)}% = ${rateDecimal.toFixed(4)}`,
                `Time = ${t} year(s)`,
                `Present Value = ${formatPHP(fv)} / (1 + ${rateDecimal.toFixed(4)})^${t} = ${formatPHP(presentValue)}`,
            ],
            glossary: [
                { term: "Present Value", meaning: "The amount today that is equivalent to a future amount after discounting." },
                { term: "Discount Rate", meaning: "The rate used to reduce a future amount back to present worth." },
            ],
            interpretation:
                t === 0 || r === 0
                    ? `With zero discounting impact, the present value remains ${formatPHP(presentValue)}.`
                    : `The future amount of ${formatPHP(fv)} is worth ${formatPHP(presentValue)} today at ${r.toFixed(2)}% for ${t} year(s).`,
        };
    }, [futureValue, rate, time]);

    return (
        <CalculatorPageLayout
            badge="Finance"
            title="Present Value Calculator"
            description="Find the present worth of a future amount using discounting based on rate and time."
            inputSection={
                <InputGrid columns={3}>
                    <InputCard
                        label="Future Value"
                        value={futureValue}
                        onChange={setFutureValue}
                        placeholder="12000"
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
                        <ResultCard title="Present Value" value={formatPHP(result.presentValue)} />
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
