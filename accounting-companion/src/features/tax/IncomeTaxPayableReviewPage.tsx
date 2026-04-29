import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeIncomeTaxPayableReview } from "../../utils/calculatorMath";

export default function IncomeTaxPayableReviewPage() {
    const [taxableIncome, setTaxableIncome] = useState("1800000");
    const [incomeTaxRatePercent, setIncomeTaxRatePercent] = useState("25");
    const [withholdingCredits, setWithholdingCredits] = useState("160000");
    const [quarterlyPayments, setQuarterlyPayments] = useState("180000");
    const [refundableCredits, setRefundableCredits] = useState("20000");
    const [penaltiesAndInterest, setPenaltiesAndInterest] = useState("5000");

    const result = useMemo(() => {
        const values = [
            taxableIncome,
            incomeTaxRatePercent,
            withholdingCredits,
            quarterlyPayments,
            refundableCredits,
            penaltiesAndInterest,
        ];
        if (values.some((value) => value.trim() === "")) return null;

        const numeric = values.map((value) => Number(value));
        if (numeric.some((value) => Number.isNaN(value))) {
            return { error: "All income-tax payable inputs must be valid numbers." };
        }
        if (numeric[1] < 0 || numeric[1] > 100) {
            return { error: "Income-tax rate must be between 0 and 100 percent." };
        }
        if (numeric.slice(2).some((value) => value < 0)) {
            return { error: "Credits, payments, penalties, and interest cannot be negative." };
        }

        return computeIncomeTaxPayableReview({
            taxableIncome: numeric[0],
            incomeTaxRatePercent: numeric[1],
            withholdingCredits: numeric[2],
            quarterlyPayments: numeric[3],
            refundableCredits: numeric[4],
            penaltiesAndInterest: numeric[5],
        });
    }, [
        incomeTaxRatePercent,
        penaltiesAndInterest,
        quarterlyPayments,
        refundableCredits,
        taxableIncome,
        withholdingCredits,
    ]);

    return (
        <CalculatorPageLayout
            badge="Taxation | Compliance"
            title="Income Tax Payable and Credits Review"
            description="Reconcile taxable income, computed tax, withholding credits, installment payments, refundable credits, and penalties into a final payable or overpayment signal."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard
                            label="Taxable Income"
                            value={taxableIncome}
                            onChange={setTaxableIncome}
                            placeholder="1800000"
                        />
                        <InputCard
                            label="Income Tax Rate (%)"
                            value={incomeTaxRatePercent}
                            onChange={setIncomeTaxRatePercent}
                            placeholder="25"
                        />
                        <InputCard
                            label="Withholding Credits"
                            value={withholdingCredits}
                            onChange={setWithholdingCredits}
                            placeholder="160000"
                        />
                        <InputCard
                            label="Quarterly Payments"
                            value={quarterlyPayments}
                            onChange={setQuarterlyPayments}
                            placeholder="180000"
                        />
                        <InputCard
                            label="Refundable Credits"
                            value={refundableCredits}
                            onChange={setRefundableCredits}
                            placeholder="20000"
                        />
                        <InputCard
                            label="Penalties and Interest"
                            value={penaltiesAndInterest}
                            onChange={setPenaltiesAndInterest}
                            placeholder="5000"
                        />
                    </InputGrid>
                </SectionCard>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="app-tone-warning">
                        <p className="app-card-title text-sm">Input notice</p>
                        <p className="app-body-md mt-2 text-sm">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <div className="space-y-4">
                        <ResultGrid columns={4}>
                            <ResultCard
                                title="Gross Tax Due"
                                value={formatPHP(result.grossIncomeTaxDue)}
                                tone="accent"
                            />
                            <ResultCard
                                title="Credits / Payments"
                                value={formatPHP(result.totalCreditsAndPayments)}
                            />
                            <ResultCard
                                title="Final Payable"
                                value={formatPHP(result.finalTaxPayable)}
                                tone={result.finalTaxPayable > 0 ? "warning" : "default"}
                            />
                            <ResultCard
                                title="Overpayment"
                                value={formatPHP(result.overpayment)}
                                tone={result.overpayment > 0 ? "success" : "default"}
                            />
                        </ResultGrid>
                        <SectionCard>
                            <p className="app-card-title text-sm">Compliance review signal</p>
                            <p className="app-body-md mt-2 text-sm">{result.reviewSignal}</p>
                            <p className="app-helper mt-3 text-xs">
                                Effective tax rate on taxable income: {result.effectiveTaxRate.toFixed(2)}%.
                            </p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Final tax payable = taxable income x tax rate - credits and payments + penalties and interest"
                        steps={[
                            `Gross income tax due = ${formatPHP(Number(taxableIncome))} x ${Number(incomeTaxRatePercent).toFixed(2)}% = ${formatPHP(result.grossIncomeTaxDue)}.`,
                            `Total credits and payments = withholding ${formatPHP(Number(withholdingCredits))} + quarterly ${formatPHP(Number(quarterlyPayments))} + refundable credits ${formatPHP(Number(refundableCredits))} = ${formatPHP(result.totalCreditsAndPayments)}.`,
                            `Net tax before penalties = ${formatPHP(result.netTaxBeforePenalties)}; final payable after entered penalties and interest = ${formatPHP(result.finalTaxPayable)}.`,
                        ]}
                        interpretation="This is an academic reconciliation tool. Use current tax law, forms, deadlines, taxpayer classification, and credit limitations before treating any result as a filing answer."
                        warnings={[
                            "A credit may be refundable, creditable, or limited depending on law and facts.",
                            "This workspace does not replace statutory schedules, preferential rates, minimum taxes, or filing-system validation.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
