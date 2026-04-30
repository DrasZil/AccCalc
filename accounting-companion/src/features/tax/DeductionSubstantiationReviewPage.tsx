import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeTaxDeductionSubstantiationReview } from "../../utils/calculatorMath";

export default function DeductionSubstantiationReviewPage() {
    const [grossIncome, setGrossIncome] = useState("2200000");
    const [claimedDeductions, setClaimedDeductions] = useState("850000");
    const [disallowedItems, setDisallowedItems] = useState("120000");
    const [substantiationPercent, setSubstantiationPercent] = useState("80");
    const [taxRatePercent, setTaxRatePercent] = useState("25");

    const result = useMemo(() => {
        const values = [grossIncome, claimedDeductions, disallowedItems, substantiationPercent, taxRatePercent];
        if (values.some((value) => value.trim() === "")) return null;

        const numeric = values.map((value) => Number(value));
        if (numeric.some((value) => Number.isNaN(value))) {
            return { error: "All deduction-review inputs must be valid numbers." };
        }
        if (numeric.slice(0, 3).some((value) => value < 0) || numeric[3] < 0 || numeric[3] > 100 || numeric[4] < 0) {
            return { error: "Amounts and tax rate cannot be negative. Substantiation must be between 0% and 100%." };
        }

        return computeTaxDeductionSubstantiationReview({
            grossIncome: numeric[0],
            claimedDeductions: numeric[1],
            disallowedItems: numeric[2],
            substantiationPercent: numeric[3],
            taxRatePercent: numeric[4],
        });
    }, [claimedDeductions, disallowedItems, grossIncome, substantiationPercent, taxRatePercent]);

    return (
        <CalculatorPageLayout
            badge="Taxation | Deductions"
            title="Deduction Substantiation Review"
            description="Separate potentially allowable deductions, disallowed items, documentation support, taxable income after review, and the tax effect of unsupported items."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Gross Income" value={grossIncome} onChange={setGrossIncome} />
                        <InputCard label="Claimed Deductions" value={claimedDeductions} onChange={setClaimedDeductions} />
                        <InputCard label="Disallowed Items" value={disallowedItems} onChange={setDisallowedItems} />
                        <InputCard label="Substantiation Supported (%)" value={substantiationPercent} onChange={setSubstantiationPercent} />
                        <InputCard label="Tax Rate (%)" value={taxRatePercent} onChange={setTaxRatePercent} />
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
                            <ResultCard title="Substantiated Deductions" value={formatPHP(result.substantiatedDeductions)} tone="accent" />
                            <ResultCard title="Unsupported Exposure" value={formatPHP(result.unsupportedDeductionExposure)} />
                            <ResultCard title="Taxable Income" value={formatPHP(result.taxableIncomeAfterReview)} />
                            <ResultCard title="Tax Effect" value={formatPHP(result.taxEffectOfUnsupportedItems)} tone={result.taxEffectOfUnsupportedItems > 0 ? "warning" : "default"} />
                        </ResultGrid>
                        <SectionCard>
                            <p className="app-card-title text-sm">Deduction review signal</p>
                            <p className="app-body-md mt-2 text-sm">{result.reviewSignal}</p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Substantiated deduction = (claimed deductions - disallowed items) x support percentage"
                        steps={[
                            `Potentially allowable deductions = ${formatPHP(result.potentiallyAllowableDeductions)}.`,
                            `Substantiated deductions = ${formatPHP(result.substantiatedDeductions)}.`,
                            `Taxable income after review = ${formatPHP(result.taxableIncomeAfterReview)}.`,
                            `Tax effect of unsupported or disallowed items = ${formatPHP(result.taxEffectOfUnsupportedItems)}.`,
                        ]}
                        interpretation="This page is educational support for income-tax deduction review. It does not provide official tax authority guidance or professional tax advice."
                        warnings={[
                            "Deductibility and documentation are separate questions.",
                            "Verify current rules, thresholds, forms, and official guidance before real-world use.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
