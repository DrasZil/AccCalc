import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computePartnershipSalaryInterestAllocation } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function PartnershipSalaryInterestPage() {
    const [partnershipAmount, setPartnershipAmount] = useState("");
    const [partnerASalary, setPartnerASalary] = useState("");
    const [partnerBSalary, setPartnerBSalary] = useState("");
    const [partnerAAverageCapital, setPartnerAAverageCapital] = useState("");
    const [partnerBAverageCapital, setPartnerBAverageCapital] = useState("");
    const [interestRatePercent, setInterestRatePercent] = useState("");
    const [partnerARemainderRatio, setPartnerARemainderRatio] = useState("");
    const [partnerBRemainderRatio, setPartnerBRemainderRatio] = useState("");

    useSmartSolverConnector({
        partnershipAmount: setPartnershipAmount,
        partnerASalary: setPartnerASalary,
        partnerBSalary: setPartnerBSalary,
        partnerAAverageCapital: setPartnerAAverageCapital,
        partnerBAverageCapital: setPartnerBAverageCapital,
        interestRatePercent: setInterestRatePercent,
        partnerARemainderRatio: setPartnerARemainderRatio,
        partnerBRemainderRatio: setPartnerBRemainderRatio,
    });

    const result = useMemo(() => {
        if (
            partnershipAmount.trim() === "" ||
            partnerASalary.trim() === "" ||
            partnerBSalary.trim() === "" ||
            partnerAAverageCapital.trim() === "" ||
            partnerBAverageCapital.trim() === "" ||
            interestRatePercent.trim() === "" ||
            partnerARemainderRatio.trim() === "" ||
            partnerBRemainderRatio.trim() === ""
        ) {
            return null;
        }

        const parsedValues = [
            Number(partnershipAmount),
            Number(partnerASalary),
            Number(partnerBSalary),
            Number(partnerAAverageCapital),
            Number(partnerBAverageCapital),
            Number(interestRatePercent),
            Number(partnerARemainderRatio),
            Number(partnerBRemainderRatio),
        ];

        if (parsedValues.some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        const [
            totalAmount,
            salaryA,
            salaryB,
            averageCapitalA,
            averageCapitalB,
            interestRate,
            ratioA,
            ratioB,
        ] = parsedValues;

        if ([salaryA, salaryB, averageCapitalA, averageCapitalB, interestRate].some((value) => value < 0)) {
            return { error: "Salary allowances, average capitals, and interest rate cannot be negative." };
        }

        if (ratioA < 0 || ratioB < 0) {
            return { error: "Remainder ratios cannot be negative." };
        }

        if (ratioA + ratioB <= 0) {
            return { error: "The remainder ratio total must be greater than zero." };
        }

        const allocation = computePartnershipSalaryInterestAllocation({
            partnershipAmount: totalAmount,
            partnerASalary: salaryA,
            partnerBSalary: salaryB,
            partnerAAverageCapital: averageCapitalA,
            partnerBAverageCapital: averageCapitalB,
            interestRatePercent: interestRate,
            partnerARemainderRatio: ratioA,
            partnerBRemainderRatio: ratioB,
        });

        return {
            ...allocation,
            formula: "Final share = Salary allowance + Interest allowance + Share in remainder",
            steps: [
                `Partner A interest allowance = ${formatPHP(averageCapitalA)} x ${(interestRate / 100).toFixed(4)} = ${formatPHP(allocation.interestShareA)}`,
                `Partner B interest allowance = ${formatPHP(averageCapitalB)} x ${(interestRate / 100).toFixed(4)} = ${formatPHP(allocation.interestShareB)}`,
                `Remainder = ${formatPHP(totalAmount)} - ${formatPHP(allocation.totalAppropriation)} = ${formatPHP(allocation.remainder)}`,
                `Partner A final share = ${formatPHP(salaryA)} + ${formatPHP(allocation.interestShareA)} + ${formatPHP(allocation.remainderShareA)} = ${formatPHP(allocation.finalShareA)}`,
                `Partner B final share = ${formatPHP(salaryB)} + ${formatPHP(allocation.interestShareB)} + ${formatPHP(allocation.remainderShareB)} = ${formatPHP(allocation.finalShareB)}`,
            ],
            glossary: [
                {
                    term: "Salary allowance",
                    meaning: "An agreed allocation used in dividing partnership income, not an operating expense of the partnership.",
                },
                {
                    term: "Interest allowance",
                    meaning: "An agreed allocation based on capital balances before the remainder is divided.",
                },
                {
                    term: "Remainder",
                    meaning: "The balance of partnership income or loss left after salary and interest allowances.",
                },
            ],
            interpretation:
                allocation.remainder >= 0
                    ? `After allowances, the partnership still has ${formatPHP(allocation.remainder)} left to divide using the remainder ratio.`
                    : `Allowances exceed the partnership amount by ${formatPHP(Math.abs(allocation.remainder))}, so the negative remainder reduces the partners' final shares using the remainder ratio.`,
            assumptions: [
                "Salary and interest are partnership income allocations, not expenses deducted before computing net income.",
                "Average capital balances are treated as already adjusted for the period required by the problem.",
            ],
            warnings: [
                "If the problem requires weighted-time capital computations or multiple partners beyond A and B, prepare those schedules first before using this simplified allocation page.",
            ],
        };
    }, [
        interestRatePercent,
        partnerAAverageCapital,
        partnerARemainderRatio,
        partnerASalary,
        partnerBAverageCapital,
        partnerBRemainderRatio,
        partnerBSalary,
        partnershipAmount,
    ]);

    return (
        <CalculatorPageLayout
            badge="Accounting | Partnership"
            title="Partnership Salary and Interest"
            description="Allocate partnership income or loss when salary allowances, capital interest, and a remainder ratio all apply."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Partnership Profit or Loss"
                            value={partnershipAmount}
                            onChange={setPartnershipAmount}
                            placeholder="150000 or -40000"
                        />
                        <InputCard
                            label="Interest Rate (%)"
                            value={interestRatePercent}
                            onChange={setInterestRatePercent}
                            placeholder="10"
                        />
                        <InputCard
                            label="Partner A Salary Allowance"
                            value={partnerASalary}
                            onChange={setPartnerASalary}
                            placeholder="30000"
                        />
                        <InputCard
                            label="Partner B Salary Allowance"
                            value={partnerBSalary}
                            onChange={setPartnerBSalary}
                            placeholder="20000"
                        />
                        <InputCard
                            label="Partner A Average Capital"
                            value={partnerAAverageCapital}
                            onChange={setPartnerAAverageCapital}
                            placeholder="200000"
                        />
                        <InputCard
                            label="Partner B Average Capital"
                            value={partnerBAverageCapital}
                            onChange={setPartnerBAverageCapital}
                            placeholder="150000"
                        />
                        <InputCard
                            label="Partner A Remainder Ratio"
                            value={partnerARemainderRatio}
                            onChange={setPartnerARemainderRatio}
                            placeholder="3"
                        />
                        <InputCard
                            label="Partner B Remainder Ratio"
                            value={partnerBRemainderRatio}
                            onChange={setPartnerBRemainderRatio}
                            placeholder="2"
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
                    <ResultGrid columns={3}>
                        <ResultCard title="Partner A Final Share" value={formatPHP(result.finalShareA)} />
                        <ResultCard title="Partner B Final Share" value={formatPHP(result.finalShareB)} />
                        <ResultCard title="Remainder After Allowances" value={formatPHP(result.remainder)} />
                        <ResultCard title="Partner A Interest" value={formatPHP(result.interestShareA)} />
                        <ResultCard title="Partner B Interest" value={formatPHP(result.interestShareB)} />
                        <ResultCard title="Total Allowances" value={formatPHP(result.totalAppropriation)} />
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
                        assumptions={result.assumptions}
                        warnings={result.warnings}
                    />
                ) : null
            }
        />
    );
}
