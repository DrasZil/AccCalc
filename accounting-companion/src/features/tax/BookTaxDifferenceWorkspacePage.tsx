import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeBookTaxDifference } from "../../utils/calculatorMath";

function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

export default function BookTaxDifferenceWorkspacePage() {
    const [accountingIncomeBeforeTax, setAccountingIncomeBeforeTax] = useState("");
    const [permanentDifferences, setPermanentDifferences] = useState("");
    const [temporaryDifferences, setTemporaryDifferences] = useState("");
    const [taxRatePercent, setTaxRatePercent] = useState("");

    const result = useMemo(() => {
        const values = [
            accountingIncomeBeforeTax,
            permanentDifferences,
            temporaryDifferences,
            taxRatePercent,
        ];

        if (values.some((value) => value.trim() === "")) return null;

        const numeric = values.map((value) => Number(value));
        if (numeric.some((value) => Number.isNaN(value))) {
            return { error: "All book-tax difference inputs must be valid numbers." };
        }

        return computeBookTaxDifference({
            accountingIncomeBeforeTax: numeric[0],
            permanentDifferences: numeric[1],
            temporaryDifferences: numeric[2],
            taxRatePercent: numeric[3],
        });
    }, [
        accountingIncomeBeforeTax,
        permanentDifferences,
        taxRatePercent,
        temporaryDifferences,
    ]);

    return (
        <CalculatorPageLayout
            badge="Taxation"
            title="Book-Tax Difference Workspace"
            description="Bridge accounting income and taxable income, then estimate current tax and deferred tax effect from one educational reconciliation workspace."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Accounting Income Before Tax"
                            value={accountingIncomeBeforeTax}
                            onChange={setAccountingIncomeBeforeTax}
                            placeholder="1850000"
                        />
                        <InputCard
                            label="Permanent Differences"
                            value={permanentDifferences}
                            onChange={setPermanentDifferences}
                            placeholder="120000"
                            helperText="Use positive amounts when they increase taxable income and negative amounts when they reduce it."
                        />
                        <InputCard
                            label="Temporary Differences"
                            value={temporaryDifferences}
                            onChange={setTemporaryDifferences}
                            placeholder="-80000"
                            helperText="Use the net temporary difference for the period."
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
                                title="Current Tax Expense"
                                value={formatPHP(result.currentTaxExpense)}
                            />
                            <ResultCard
                                title="Deferred Tax Effect"
                                value={formatPHP(result.deferredTaxEffect)}
                            />
                            <ResultCard
                                title="Current Effective Tax Rate"
                                value={formatPercent(result.effectiveTaxRate)}
                            />
                        </ResultGrid>

                        <SectionCard>
                            <p className="app-card-title text-sm">Use with care</p>
                            <p className="app-body-md mt-2 text-sm">
                                This workspace is for study and reconciliation practice. It is not a
                                substitute for jurisdiction-specific tax filing rules, detailed tax bases,
                                or current legal advice.
                            </p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Taxable income = Accounting income before tax +/- permanent differences +/- temporary differences"
                        steps={[
                            `Taxable income = ${formatPHP(Number(accountingIncomeBeforeTax))} + ${formatPHP(Number(permanentDifferences))} + ${formatPHP(Number(temporaryDifferences))} = ${formatPHP(result.taxableIncome)}.`,
                            `Current tax expense = ${formatPHP(result.taxableIncome)} x ${Number(taxRatePercent).toFixed(2)}% = ${formatPHP(result.currentTaxExpense)}.`,
                            `Deferred tax effect = ${formatPHP(Number(temporaryDifferences))} x ${Number(taxRatePercent).toFixed(2)}% = ${formatPHP(result.deferredTaxEffect)}.`,
                        ]}
                        interpretation="Permanent differences affect the effective tax rate but do not reverse. Temporary differences create timing differences that can produce deferred tax effects."
                        warnings={[
                            "The sign of the temporary difference matters. Use the same sign convention consistently throughout the reconciliation.",
                            "Current tax and deferred tax presentation can differ by case setup and jurisdiction-specific rules.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
