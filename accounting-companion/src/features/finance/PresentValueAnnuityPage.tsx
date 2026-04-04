import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import {
    computePresentValueOfOrdinaryAnnuity,
} from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function PresentValueAnnuityPage() {
    const [periodicPayment, setPeriodicPayment] = useState("");
    const [rate, setRate] = useState("");
    const [periods, setPeriods] = useState("");

    useSmartSolverConnector({
        periodicPayment: setPeriodicPayment,
        rate: setRate,
        periods: setPeriods,
    });

    const result = useMemo(() => {
        if (periodicPayment.trim() === "" || rate.trim() === "" || periods.trim() === "") return null;

        const payment = Number(periodicPayment);
        const periodicRate = Number(rate);
        const totalPeriods = Number(periods);

        if ([payment, periodicRate, totalPeriods].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (payment < 0 || periodicRate < 0 || totalPeriods <= 0) {
            return { error: "Payment and rate cannot be negative, and periods must be greater than zero." };
        }

        const { rateDecimal, presentValue } = computePresentValueOfOrdinaryAnnuity(
            payment,
            periodicRate,
            totalPeriods
        );

        return {
            presentValue,
            formula: "PV of Ordinary Annuity = Payment x [(1 - (1 + r)^-n) / r]",
            steps: [
                `Payment = ${formatPHP(payment)}`,
                `Periodic Rate = ${periodicRate}% = ${rateDecimal}`,
                `Periods = ${totalPeriods}`,
                rateDecimal === 0
                    ? `Because the periodic rate is 0%, present value = ${formatPHP(payment)} x ${totalPeriods} = ${formatPHP(presentValue)}`
                    : `Present Value = ${formatPHP(payment)} x [(1 - (1 + ${rateDecimal})^-${totalPeriods}) / ${rateDecimal}] = ${formatPHP(presentValue)}`,
            ],
            glossary: [
                { term: "Present Value", meaning: "The amount today that is equivalent to future annuity payments." },
                { term: "Ordinary Annuity", meaning: "A stream of equal payments made at the end of each period." },
                { term: "Periods", meaning: "The number of equal payments in the annuity." },
            ],
            interpretation: `A stream of ${totalPeriods} equal payments of ${formatPHP(payment)} discounted at ${periodicRate}% per period has a present value of ${formatPHP(presentValue)}.`,
        };
    }, [periodicPayment, periods, rate]);

    return (
        <CalculatorPageLayout
            badge="Finance"
            title="Present Value of Annuity"
            description="Compute the present value of an ordinary annuity using periodic payment, periodic rate, and number of periods."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard
                            label="Periodic Payment"
                            value={periodicPayment}
                            onChange={setPeriodicPayment}
                            placeholder="5000"
                        />
                        <InputCard
                            label="Rate per Period (%)"
                            value={rate}
                            onChange={setRate}
                            placeholder="5"
                        />
                        <InputCard
                            label="Number of Periods"
                            value={periods}
                            onChange={setPeriods}
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
                    <ResultGrid columns={1}>
                        <ResultCard title="Present Value of Annuity" value={formatPHP(result.presentValue)} />
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
