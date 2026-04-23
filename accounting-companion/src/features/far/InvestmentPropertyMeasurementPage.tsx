import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeInvestmentPropertyMeasurement } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

export default function InvestmentPropertyMeasurementPage() {
    const [carryingAmount, setCarryingAmount] = useState("");
    const [fairValue, setFairValue] = useState("");
    const [annualDepreciation, setAnnualDepreciation] = useState("");
    const [impairmentLoss, setImpairmentLoss] = useState("");

    const result = useMemo(() => {
        const required = [carryingAmount, fairValue];
        if (required.some((value) => value.trim() === "")) return null;
        const parsed = [carryingAmount, fairValue, annualDepreciation || "0", impairmentLoss || "0"].map(Number);
        if (parsed.some(Number.isNaN)) return { error: "All investment property inputs must be valid numbers." };
        if (parsed.some((value) => value < 0)) return { error: "Investment property inputs cannot be negative." };
        return computeInvestmentPropertyMeasurement({
            carryingAmount: parsed[0],
            fairValue: parsed[1],
            annualDepreciation: parsed[2],
            impairmentLoss: parsed[3],
        });
    }, [annualDepreciation, carryingAmount, fairValue, impairmentLoss]);

    return (
        <CalculatorPageLayout
            badge="FAR"
            title="Investment Property Measurement Helper"
            description="Compare fair value model gain or loss with cost-model carrying amount after depreciation and impairment assumptions."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Current Carrying Amount" value={carryingAmount} onChange={setCarryingAmount} placeholder="4200000" />
                        <InputCard label="Fair Value at Reporting Date" value={fairValue} onChange={setFairValue} placeholder="4550000" />
                        <InputCard label="Cost Model Depreciation" value={annualDepreciation} onChange={setAnnualDepreciation} placeholder="160000" />
                        <InputCard label="Cost Model Impairment" value={impairmentLoss} onChange={setImpairmentLoss} placeholder="0" />
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
                    <ResultGrid columns={3}>
                        <ResultCard title="Fair Value Gain / Loss" value={formatPHP(result.fairValueGainOrLoss)} tone="accent" />
                        <ResultCard title="Fair Value Carrying Amount" value={formatPHP(result.fairValueEndingCarryingAmount)} />
                        <ResultCard title="Cost Model Carrying Amount" value={formatPHP(result.costModelEndingCarryingAmount)} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Fair value gain or loss = fair value - carrying amount"
                        steps={[
                            `Fair value gain/loss = ${formatPHP(Number(fairValue))} - ${formatPHP(Number(carryingAmount))} = ${formatPHP(result.fairValueGainOrLoss)}.`,
                            `Cost model carrying amount = carrying amount - depreciation - impairment = ${formatPHP(result.costModelEndingCarryingAmount)}.`,
                        ]}
                        interpretation={result.measurementSignal}
                        warnings={["Investment property classification depends on use, owner-occupation, and development facts. This helper compares measurement effects after classification is already appropriate."]}
                    />
                ) : null
            }
        />
    );
}
