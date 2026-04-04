import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function NoteInterestPage() {
    const [principal, setPrincipal] = useState("");
    const [rate, setRate] = useState("");
    const [time, setTime] = useState("");
    const [timeUnit, setTimeUnit] = useState("years");

    useSmartSolverConnector({
        principal: setPrincipal,
        rate: setRate,
        time: setTime,
        timeUnit: setTimeUnit,
    });

    const result = useMemo(() => {
        if (principal.trim() === "" || rate.trim() === "" || time.trim() === "") return null;

        const principalNumber = Number(principal);
        const rateNumber = Number(rate);
        const timeNumber = Number(time);

        if (Number.isNaN(principalNumber) || Number.isNaN(rateNumber) || Number.isNaN(timeNumber)) {
            return {
                error: "All entered values must be valid numbers.",
            };
        }

        if (principalNumber <= 0 || rateNumber < 0 || timeNumber <= 0) {
            return {
                error: "Principal and time must be greater than zero, and rate cannot be negative.",
            };
        }

        let convertedTime = timeNumber;
        let timeExplanation = `${timeNumber} year(s)`;

        if (timeUnit === "months") {
            convertedTime = timeNumber / 12;
            timeExplanation = `${timeNumber} month(s) = ${convertedTime.toFixed(4)} year(s)`;
        } else if (timeUnit === "days") {
            convertedTime = timeNumber / 360;
            timeExplanation = `${timeNumber} day(s) = ${convertedTime.toFixed(4)} year(s) using a 360-day year`;
        }

        const rateDecimal = rateNumber / 100;
        const interest = principalNumber * rateDecimal * convertedTime;
        const maturityValue = principalNumber + interest;

        return {
            interest,
            maturityValue,
            formula: "Interest = Principal x Rate x Time",
            steps: [
                `Principal = ${formatPHP(principalNumber)}`,
                `Annual rate = ${rateNumber.toFixed(2)}% = ${rateDecimal.toFixed(4)}`,
                timeExplanation,
                `Interest = ${formatPHP(principalNumber)} x ${rateDecimal.toFixed(4)} x ${convertedTime.toFixed(4)} = ${formatPHP(interest)}`,
                `Maturity Value = ${formatPHP(principalNumber)} + ${formatPHP(interest)} = ${formatPHP(maturityValue)}`,
            ],
            glossary: [
                { term: "Principal", meaning: "The face amount or original amount of the note." },
                { term: "Maturity Value", meaning: "The total amount due at the note's maturity date, including principal and interest." },
                { term: "360-day Year", meaning: "A common classroom and banking convention for simple interest problems involving days." },
            ],
            interpretation: `Using simple interest, the note earns ${formatPHP(interest)} over the term and matures at ${formatPHP(maturityValue)}.`,
        };
    }, [principal, rate, time, timeUnit]);

    return (
        <CalculatorPageLayout
            badge="Accounting"
            title="Notes Interest Solver"
            description="Compute interest and maturity value for notes receivable or notes payable using principal, annual rate, and time."
            inputSection={
                <div className="space-y-4">
                    <InputGrid>
                        <InputCard
                            label="Principal"
                            value={principal}
                            onChange={setPrincipal}
                            placeholder="10000"
                        />
                        <InputCard
                            label="Annual Rate (%)"
                            value={rate}
                            onChange={setRate}
                            placeholder="12"
                        />
                        <InputCard
                            label="Time"
                            value={time}
                            onChange={setTime}
                            placeholder="6"
                        />
                    </InputGrid>

                    <SectionCard>
                        <label className="mb-4 block text-sm font-medium text-gray-300">
                            Time Unit
                        </label>
                        <select
                            value={timeUnit}
                            onChange={(event) => setTimeUnit(event.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-green-400/40 focus:ring-2 focus:ring-green-400/20"
                        >
                            <option value="years" className="bg-neutral-900 text-white">
                                Years
                            </option>
                            <option value="months" className="bg-neutral-900 text-white">
                                Months
                            </option>
                            <option value="days" className="bg-neutral-900 text-white">
                                Days
                            </option>
                        </select>
                    </SectionCard>
                </div>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="border-yellow-400/20 bg-yellow-500/10">
                        <p className="text-sm font-medium text-yellow-300">Input notice</p>
                        <p className="mt-2 text-sm leading-6 text-yellow-200">
                            {result.error}
                        </p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={2}>
                        <ResultCard title="Interest" value={formatPHP(result.interest)} />
                        <ResultCard title="Maturity Value" value={formatPHP(result.maturityValue)} />
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
