import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import ComparisonBarsChart from "../../components/ComparisonBarsChart";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import TrendLineChart from "../../components/TrendLineChart";
import {
    computeLoanAmortization,
    computeLoanAmortizationSchedule,
} from "../../utils/calculatorMath";
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
        const schedule = computeLoanAmortizationSchedule({
            principal,
            annualRatePercent: rate,
            termYears,
        });
        const firstYear = schedule.yearlySummary[0];
        const finalYear = schedule.yearlySummary.at(-1);

        return {
            monthlyPayment,
            totalPaid,
            totalInterest,
            schedule,
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
                    : `The loan requires a monthly payment of ${formatPHP(monthlyPayment)}, and total interest over the term is ${formatPHP(totalInterest)}. Early payments are more interest-heavy, while later payments shift more strongly toward principal reduction.`,
            assumptions: [
                "This schedule assumes a fixed annual rate, equal monthly payments, and no extra principal payments, fees, penalties, or payment holidays.",
                "The result is a payment-planning estimate. Actual lender schedules can differ because of rounding policy, insurance, origination charges, or variable-rate clauses.",
            ],
            warnings:
                rate === 0
                    ? []
                    : [
                          "If the loan uses a changing rate or includes material fees, this calculator should not be treated as a complete borrowing-cost disclosure.",
                      ],
            notes: firstYear && finalYear
                ? [
                      `In year 1, about ${formatPHP(firstYear.interestPaid)} goes to interest and ${formatPHP(firstYear.principalPaid)} goes to principal.`,
                      `By the final year, the remaining balance is pushed down to ${formatPHP(finalYear.endingBalance)} and the payment mix is much more principal-focused.`,
                  ]
                : [],
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
                    <div className="space-y-4">
                        <ResultGrid columns={3}>
                            <ResultCard
                                title="Monthly Payment"
                                value={formatPHP(result.monthlyPayment)}
                                tone="accent"
                            />
                            <ResultCard title="Total Paid" value={formatPHP(result.totalPaid)} />
                            <ResultCard
                                title="Total Interest"
                                value={formatPHP(result.totalInterest)}
                                supportingText={
                                    result.totalPaid > 0
                                        ? `${((result.totalInterest / result.totalPaid) * 100).toFixed(1)}% of total cash outflow`
                                        : undefined
                                }
                            />
                        </ResultGrid>

                        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                            <TrendLineChart
                                title="Balance payoff trend"
                                description="The outstanding balance falls slowly early in the loan when interest takes a larger share of each payment."
                                points={result.schedule.yearlySummary.map((year) => ({
                                    label: `Year ${year.year}`,
                                    value: year.endingBalance,
                                }))}
                                formatter={(value) => formatPHP(value)}
                            />
                            <ComparisonBarsChart
                                title="Principal vs interest"
                                description="This compares how much cash goes to repaying borrowed principal versus financing cost over the full term."
                                items={[
                                    {
                                        label: "Principal",
                                        value: result.schedule.totalPrincipal,
                                        accent: "primary",
                                    },
                                    {
                                        label: "Interest",
                                        value: result.schedule.totalInterest,
                                        accent: "secondary",
                                    },
                                ]}
                                formatter={(value) => formatPHP(value)}
                            />
                        </div>

                        <SectionCard>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="app-section-kicker text-xs">Yearly schedule</p>
                                    <h3 className="app-section-title mt-2 text-xl">How the loan burns down over time</h3>
                                </div>
                            </div>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full border-separate border-spacing-y-2 text-sm">
                                    <thead>
                                        <tr className="text-left text-[color:var(--app-text-secondary)]">
                                            <th className="px-3 py-2 font-medium">Year</th>
                                            <th className="px-3 py-2 font-medium">Interest Paid</th>
                                            <th className="px-3 py-2 font-medium">Principal Paid</th>
                                            <th className="px-3 py-2 font-medium">Ending Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.schedule.yearlySummary.map((year) => (
                                            <tr key={year.year} className="app-subtle-surface">
                                                <td className="rounded-l-2xl px-3 py-3 font-semibold text-[color:var(--app-text)]">
                                                    Year {year.year}
                                                </td>
                                                <td className="px-3 py-3 text-[color:var(--app-text)]">
                                                    {formatPHP(year.interestPaid)}
                                                </td>
                                                <td className="px-3 py-3 text-[color:var(--app-text)]">
                                                    {formatPHP(year.principalPaid)}
                                                </td>
                                                <td className="rounded-r-2xl px-3 py-3 text-[color:var(--app-text)]">
                                                    {formatPHP(year.endingBalance)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </SectionCard>
                    </div>
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
                        notes={result.notes}
                    />
                ) : null
            }
        />
    );
}
