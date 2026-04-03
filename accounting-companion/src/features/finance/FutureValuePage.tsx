import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
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
        if (!presentValue || !rate || !time) return null;

        const pv = Number(presentValue);
        const r = Number(rate);
        const t = Number(time);

        if (Number.isNaN(pv) || Number.isNaN(r) || Number.isNaN(t)) {
        return null;
        }

        const rateDecimal = r / 100;
        const futureValue = pv * Math.pow(1 + rateDecimal, t);

        return {
        futureValue,
        formula: (
        <>
            FV = PV(1 + r)
            <sup>t</sup>
        </>
        ),
        steps: [
        <>PV = {pv}</>,
        <>r = {rateDecimal}</>,
        <>t = {t}</>,
        <>
            FV = {pv}(1 + {rateDecimal})
            <sup>{t}</sup>
        </>,
        <>FV = {futureValue}</>,
        ],
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
            result ? (
            <ResultGrid columns={1}>
                <ResultCard
                title="Future Value"
                value={formatPHP(result.futureValue)}
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