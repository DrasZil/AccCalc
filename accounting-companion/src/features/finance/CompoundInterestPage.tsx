import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeCompoundInterest } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function CompoundInterestPage() {
    const [principal, setPrincipal] = useState("");
    const [rate, setRate] = useState("");
    const [timesCompounded, setTimesCompounded] = useState("");
    const [time, setTime] = useState("");

    useSmartSolverConnector({
        principal: setPrincipal,
        rate: setRate,
        timesCompounded: setTimesCompounded,
        time: setTime,
    });

    const result = useMemo(() => {
        if (
            principal.trim() === "" ||
            rate.trim() === "" ||
            timesCompounded.trim() === "" ||
            time.trim() === ""
        ) {
            return null;
        }

        const p = Number(principal);
        const r = Number(rate);
        const n = Number(timesCompounded);
        const t = Number(time);

        if ([p, r, n, t].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (p <= 0) {
            return { error: "Principal must be greater than zero." };
        }

        if (r < 0 || n <= 0 || t < 0) {
            return {
                error: "Rate cannot be negative, times compounded must be greater than zero, and time cannot be negative.",
            };
        }

        const { rateDecimal, totalAmount, compoundInterest } = computeCompoundInterest({
            principal: p,
            annualRatePercent: r,
            compoundsPerYear: n,
            timeYears: t,
        });

        return {
            compoundInterest,
            totalAmount,
            formula: "Amount = Principal x (1 + rate / compounds per year)^(compounds per year x time)",
            steps: [
                `Principal = ${formatPHP(p)}`,
                `Rate = ${r.toFixed(2)}% = ${rateDecimal.toFixed(4)}`,
                `Compounds per year = ${n}`,
                `Time = ${t} year(s)`,
                `Total Amount = ${formatPHP(p)} x (1 + ${rateDecimal.toFixed(4)} / ${n})^(${n} x ${t}) = ${formatPHP(totalAmount)}`,
                `Compound Interest = ${formatPHP(totalAmount)} - ${formatPHP(p)} = ${formatPHP(compoundInterest)}`,
            ],
            glossary: [
                { term: "Principal", meaning: "The original amount invested or borrowed." },
                { term: "Compounding", meaning: "Interest being added back to the balance and earning additional interest." },
                { term: "Compound Interest", meaning: "Interest earned on both the principal and previously accumulated interest." },
            ],
            interpretation:
                r === 0 || t === 0
                    ? `With a zero rate or zero time period, the balance remains ${formatPHP(totalAmount)}.`
                    : `The balance grows to ${formatPHP(totalAmount)}, so the compound interest earned is ${formatPHP(compoundInterest)}.`,
        };
    }, [principal, rate, timesCompounded, time]);

    return (
        <CalculatorPageLayout
            badge="Finance"
            title="Compound Interest Calculator"
            description="Compute compound interest and total accumulated amount based on principal, rate, compounding frequency, and time."
            inputSection={
                <InputGrid columns={2}>
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
                        label="Compounded Per Year"
                        value={timesCompounded}
                        onChange={setTimesCompounded}
                        placeholder="4"
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
                        <ResultCard
                            title="Compound Interest"
                            value={formatPHP(result.compoundInterest)}
                        />
                        <ResultCard
                            title="Total Amount"
                            value={formatPHP(result.totalAmount)}
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
