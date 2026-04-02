import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import formatPHP from "../../utils/formatPHP";

export default function LoanAmortizationPage() {
    const [loanAmount, setLoanAmount] = useState("");
    const [annualRate, setAnnualRate] = useState("");
    const [years, setYears] = useState("");

    const result = useMemo(() => {
        if (!loanAmount || !annualRate || !years) return null;

        const principal = Number(loanAmount);
        const rate = Number(annualRate);
        const termYears = Number(years);

        if (
        Number.isNaN(principal) ||
        Number.isNaN(rate) ||
        Number.isNaN(termYears)
        ) {
        return null;
        }

        if (principal <= 0 || termYears <= 0) return null;

        const monthlyRate = rate / 100 / 12;
        const totalPayments = termYears * 12;

        const monthlyPayment =
        principal *
        (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);

        const totalPaid = monthlyPayment * totalPayments;
        const totalInterest = totalPaid - principal;

        return {
        monthlyPayment,
        totalPaid,
        totalInterest,
        formula: (
            <>
            M = P[r(1 + r)
            <sup>n</sup>] / [(1 + r)
            <sup>n</sup> - 1]
            </>
        ),
        steps: [
            <>Principal = {principal}</>,
            <>Annual Rate = {rate}%</>,
            <>Monthly Rate = {monthlyRate}</>,
            <>Number of Payments = {totalPayments}</>,
            <>Monthly Payment = {monthlyPayment}</>,
            <>Total Paid = {totalPaid}</>,
            <>Total Interest = {totalInterest}</>,
        ],
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
            result ? (
            <ResultGrid columns={3}>
                <ResultCard
                title="Monthly Payment"
                value={formatPHP(result.monthlyPayment)}
                />
                <ResultCard
                title="Total Paid"
                value={formatPHP(result.totalPaid)}
                />
                <ResultCard
                title="Total Interest"
                value={formatPHP(result.totalInterest)}
                />
            </ResultGrid>
            ) : null
        }
        explanationSection={
            result ? <FormulaCard formula={result.formula} steps={result.steps} /> : null
        }
        />
    );
}