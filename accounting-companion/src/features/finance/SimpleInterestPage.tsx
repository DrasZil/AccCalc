import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import ResultCard from "../../components/resultCard";
import formatPHP from "../../utils/formatPHP";
import InputGrid from "../../components/InputGrid";
import ResultGrid from "../../components/ResultGrid";
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
        if (!principal || !rate || !time) return null;

        const p = Number(principal);
        const r = Number(rate);
        const t = Number(time);

        if (Number.isNaN(p) || Number.isNaN(r) || Number.isNaN(t)) {
            return null;
        }

        const interest = p * (r / 100) * t;
        const totalAmount = p + interest;

        return {
            interest,
            totalAmount,
            formula: "I = P × R × T",
            steps: [
                `Principal = ${p}`,
                `Rate = ${r}% = ${r / 100}`,
                `Time = ${t}`,
                `Interest = ${p} × ${r / 100} × ${t} = ${interest}`,
                `Total Amount = ${p} + ${interest} = ${totalAmount}`,
            ],
            glossary: [
                { term: "Principal", meaning: "The original amount borrowed or invested." },
                { term: "Rate", meaning: "The percentage charged or earned for each time period." },
                { term: "Time", meaning: "The number of years the money remains invested or borrowed." },
                { term: "Simple Interest", meaning: "Interest calculated only on the original principal amount." },
            ],
            interpretation: `The principal earns ${formatPHP(interest)} in simple interest, so the total amount after ${t} year(s) is ${formatPHP(totalAmount)}.`,
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
                result ? (
                    <ResultGrid columns={2}>
                        <ResultCard title="Interest" value={formatPHP(result.interest)} />
                        <ResultCard title="Total Amount" value={formatPHP(result.totalAmount)} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result ? (
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
