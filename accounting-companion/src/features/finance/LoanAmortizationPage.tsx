import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeLoanAmortization } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function LoanAmortizationPage() {
    const [loanAmount, setLoanAmount] = useState("");
    const [annualRate, setAnnualRate] = useState("");
    const [years, setYears] = useState("");

    useSmartSolverConnector({
        loanAmount: setLoanAmount,
        annualRate: setAnnualRate,
        years: setYears,
    });

    const result = useMemo(() => {
        if (loanAmount.trim() === "" || annualRate.trim() === "" || years.trim() === "") {
            return null;
        }

        const principal = Number(loanAmount);
        const rate = Number(annualRate);
        const termYears = Number(years);

        if ([principal, rate, termYears].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (principal <= 0 || termYears <= 0) {
            return { error: "Loan amount and loan term must be greater than zero." };
        }

        if (rate < 0) {
            return { error: "Annual interest rate cannot be negative." };
        }

        const { monthlyRate, totalPayments, monthlyPayment, totalPaid, totalInterest } =
            computeLoanAmortization({
                principal,
                annualRatePercent: rate,
                termYears,
            });

        return {
            monthlyPayment,
            totalPaid,
            totalInterest,
            formula: "Monthly Payment = Principal x [r(1 + r)^n] / [(1 + r)^n - 1]",
            steps: [
                `Principal = ${formatPHP(principal)}`,
                `Annual Rate = ${rate.toFixed(2)}%`,
                `Monthly Rate = ${monthlyRate.toFixed(6)}`,
                `Number of Payments = ${totalPayments.toFixed(0)}`,
                `Monthly Payment = ${formatPHP(monthlyPayment)}`,
                `Total Paid = ${formatPHP(totalPaid)}`,
                `Total Interest = ${formatPHP(totalInterest)}`,
            ],
            glossary: [
                { term: "Monthly Payment", meaning: "The equal payment required each month to fully settle the loan." },
                { term: "Total Paid", meaning: "The sum of all monthly payments over the loan term." },
                { term: "Total Interest", meaning: "The total borrowing cost paid over the life of the loan." },
            ],
            interpretation:
                rate === 0
                    ? `With a zero-interest loan, the monthly payment is ${formatPHP(monthlyPayment)} for ${totalPayments.toFixed(0)} months.`
                    : `The loan requires a monthly payment of ${formatPHP(monthlyPayment)}, and total interest over the term is ${formatPHP(totalInterest)}.`,
        };
    }, [loanAmount, annualRate, years]);

    return (
        <CalculatorPageLayout
            badge="Finance"
            title="Loan / Amortization Calculator"
            description="Estimate monthly payment, total paid, and total interest for a loan."
            inputSection={
                <InputGrid columns={3}>
                    <InputCard
                        label="Loan Amount"
                        value={loanAmount}
                        onChange={setLoanAmount}
                        placeholder="100000"
                    />
                    <InputCard
                        label="Annual Interest Rate (%)"
                        value={annualRate}
                        onChange={setAnnualRate}
                        placeholder="6"
                    />
                    <InputCard
                        label="Loan Term (years)"
                        value={years}
                        onChange={setYears}
                        placeholder="5"
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
                    <ResultGrid columns={3}>
                        <ResultCard title="Monthly Payment" value={formatPHP(result.monthlyPayment)} />
                        <ResultCard title="Total Paid" value={formatPHP(result.totalPaid)} />
                        <ResultCard title="Total Interest" value={formatPHP(result.totalInterest)} />
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
