import { useMemo, useState } from "react";
import InputCard from "../../components/INputCard";
import ResultCard from "../../components/resultCard";
import formatPHP from "../../utils/formatPHP";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import InputGrid from "../../components/InputGrid";
import ResultGrid from "../../components/ResultGrid";
import FormulaCard from "../../components/FormulaCard";
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
        if (!principal || !rate || !timesCompounded || !time) return null;

        const p = Number(principal);
        const r = Number(rate);
        const n = Number(timesCompounded);
        const t = Number(time);

        if (
            isNaN(p) || isNaN(r) || isNaN(n) || isNaN(t)
        ){
            return null;
        }

        if (p <= 0 || r <= 0 || n <= 0 || t <= 0) return null;

        const rateDecimal = r / 100;
        const totalAmount = p * Math.pow(1 + rateDecimal / n, n * t);
        const compoundInterest = totalAmount - p;
        

        return {
            compoundInterest,
            totalAmount,
            formula: (
                <>
                    A = P(1 + r / n)
                    <sup>(nt)</sup>
                </>
            ),
            steps: [
                <>
                    A = P(1 + r / n)
                    <sup>(nt)</sup>
                </>,
                <>Compounded per year (n): {n}</>,
                <>Time in years (t): {t}</>,
                <>
                    A = {p}(1 + {rateDecimal} / {n})
                    <sup>({n} × {t})</sup>
                </>,
                <>Total Amount = {totalAmount.toFixed(2)}</>,
                <>Compound Interest = Total Amount - {p} = {compoundInterest.toFixed(2)}</>,
            ],
        };
    }, [principal, rate, timesCompounded, time])

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
            result ? (
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
            result ? (
            <FormulaCard formula={result.formula} steps={result.steps} />
            ) : null
        }
        />
    );
}
