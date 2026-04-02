import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import formatPHP from "../../utils/formatPHP";

export default function PresentValuePage() {
    const [futureValue, setFutureValue] = useState("");
    const [rate, setRate] = useState("");
    const [time, setTime] = useState("");

    const result = useMemo(() => {
        if (!futureValue || !rate || !time) return null;

        const fv = Number(futureValue);
        const r = Number(rate);
        const t = Number(time);

        if (Number.isNaN(fv) || Number.isNaN(r) || Number.isNaN(t)) {
        return null;
        }

        const rateDecimal = r / 100;
        const presentValue = fv / Math.pow(1 + rateDecimal, t);

        return {
        presentValue,
        formula: (
        <>
            PV = FV / (1 + r)
            <sup>t</sup>
        </>
        ),
        steps: [
        <>FV = {fv}</>,
        <>r = {rateDecimal}</>,
        <>t = {t}</>,
        <>
            PV = {fv} / (1 + {rateDecimal})
            <sup>{t}</sup>
        </>,
        <>PV = {presentValue}</>,
        ],
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
            result ? (
            <ResultGrid columns={1}>
                <ResultCard
                title="Present Value"
                value={formatPHP(result.presentValue)}
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