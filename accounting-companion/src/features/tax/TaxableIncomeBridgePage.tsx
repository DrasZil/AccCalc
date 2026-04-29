import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeTaxableIncomeBridge } from "../../utils/calculatorMath";

export default function TaxableIncomeBridgePage() {
    const [accountingIncome, setAccountingIncome] = useState("1500000");
    const [permanentAdditions, setPermanentAdditions] = useState("80000");
    const [permanentDeductions, setPermanentDeductions] = useState("30000");
    const [taxableTemporaryDifferences, setTaxableTemporaryDifferences] = useState("120000");
    const [deductibleTemporaryDifferences, setDeductibleTemporaryDifferences] = useState("50000");
    const [nolDeduction, setNolDeduction] = useState("0");
    const [taxRatePercent, setTaxRatePercent] = useState("25");

    const result = useMemo(() => {
        const values = [
            accountingIncome,
            permanentAdditions,
            permanentDeductions,
            taxableTemporaryDifferences,
            deductibleTemporaryDifferences,
            nolDeduction,
            taxRatePercent,
        ];
        if (values.some((value) => value.trim() === "")) return null;

        const numeric = values.map((value) => Number(value));
        if (numeric.some((value) => Number.isNaN(value))) {
            return { error: "All income-tax bridge inputs must be valid numbers." };
        }
        if (numeric[6] < 0 || numeric[6] > 100) {
            return { error: "Tax rate must be between 0 and 100 percent." };
        }

        return computeTaxableIncomeBridge({
            accountingIncome: numeric[0],
            permanentAdditions: numeric[1],
            permanentDeductions: numeric[2],
            taxableTemporaryDifferences: numeric[3],
            deductibleTemporaryDifferences: numeric[4],
            nolDeduction: numeric[5],
            taxRatePercent: numeric[6],
        });
    }, [
        accountingIncome,
        deductibleTemporaryDifferences,
        nolDeduction,
        permanentAdditions,
        permanentDeductions,
        taxRatePercent,
        taxableTemporaryDifferences,
    ]);

    return (
        <CalculatorPageLayout
            badge="Taxation | Income Tax"
            title="Taxable Income Bridge"
            description="Bridge accounting income to taxable income by separating permanent items, temporary differences, loss deductions, and current tax."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard
                            label="Accounting Income"
                            value={accountingIncome}
                            onChange={setAccountingIncome}
                            placeholder="1500000"
                        />
                        <InputCard
                            label="Permanent Additions"
                            value={permanentAdditions}
                            onChange={setPermanentAdditions}
                            placeholder="80000"
                        />
                        <InputCard
                            label="Permanent Deductions"
                            value={permanentDeductions}
                            onChange={setPermanentDeductions}
                            placeholder="30000"
                        />
                        <InputCard
                            label="Taxable Temporary Differences"
                            value={taxableTemporaryDifferences}
                            onChange={setTaxableTemporaryDifferences}
                            placeholder="120000"
                        />
                        <InputCard
                            label="Deductible Temporary Differences"
                            value={deductibleTemporaryDifferences}
                            onChange={setDeductibleTemporaryDifferences}
                            placeholder="50000"
                        />
                        <InputCard
                            label="NOLCO or Loss Deduction"
                            value={nolDeduction}
                            onChange={setNolDeduction}
                            placeholder="0"
                        />
                        <InputCard
                            label="Tax Rate (%)"
                            value={taxRatePercent}
                            onChange={setTaxRatePercent}
                            placeholder="25"
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
                                title="Taxable Income"
                                value={formatPHP(result.taxableIncome)}
                                tone="accent"
                            />
                            <ResultCard
                                title="Current Tax"
                                value={formatPHP(result.currentTaxExpense)}
                            />
                            <ResultCard
                                title="Deferred Tax Liability"
                                value={formatPHP(result.deferredTaxLiability)}
                            />
                            <ResultCard
                                title="Deferred Tax Asset"
                                value={formatPHP(result.deferredTaxAsset)}
                            />
                        </ResultGrid>
                        <SectionCard>
                            <p className="app-card-title text-sm">Bridge signal</p>
                            <p className="app-body-md mt-2 text-sm">{result.bridgeSignal}</p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Taxable income = accounting income + additions - deductions + taxable temporary differences - deductible temporary differences - loss deduction"
                        steps={[
                            `Taxable income before loss deduction = ${formatPHP(result.taxableIncomeBeforeNol)}.`,
                            `Taxable income after loss deduction = ${formatPHP(result.taxableIncome)}.`,
                            `Current tax = ${formatPHP(result.taxableIncome)} x ${Number(taxRatePercent).toFixed(2)}% = ${formatPHP(result.currentTaxExpense)}.`,
                        ]}
                        interpretation="Use this as an educational bridge between financial-reporting income and income-tax computation. Actual filing rules, limitations, and updated statutory thresholds should be checked against current law."
                        warnings={[
                            "Permanent differences affect taxable income but do not reverse later.",
                            "Temporary differences support deferred-tax analysis and should not be mixed with permanent items.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
