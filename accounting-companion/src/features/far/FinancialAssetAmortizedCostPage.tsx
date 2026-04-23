import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeFinancialAssetAmortizedCost } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

export default function FinancialAssetAmortizedCostPage() {
    const [openingCarryingAmount, setOpeningCarryingAmount] = useState("");
    const [faceValue, setFaceValue] = useState("");
    const [statedRatePercent, setStatedRatePercent] = useState("");
    const [effectiveRatePercent, setEffectiveRatePercent] = useState("");
    const [expectedCreditLoss, setExpectedCreditLoss] = useState("");

    const result = useMemo(() => {
        const values = [openingCarryingAmount, faceValue, statedRatePercent, effectiveRatePercent, expectedCreditLoss || "0"];
        if (values.slice(0, 4).some((value) => value.trim() === "")) return null;
        const parsed = values.map(Number);
        if (parsed.some(Number.isNaN)) return { error: "All financial asset inputs must be valid numbers." };
        if (parsed.some((value) => value < 0)) return { error: "Financial asset inputs cannot be negative." };

        return computeFinancialAssetAmortizedCost({
            openingCarryingAmount: parsed[0],
            faceValue: parsed[1],
            statedRatePercent: parsed[2],
            effectiveRatePercent: parsed[3],
            expectedCreditLoss: parsed[4],
        });
    }, [effectiveRatePercent, expectedCreditLoss, faceValue, openingCarryingAmount, statedRatePercent]);

    return (
        <CalculatorPageLayout
            badge="FAR"
            title="Financial Asset Amortized Cost Schedule"
            description="Compute effective-interest revenue, cash interest, amortization, ending gross carrying amount, and ECL-adjusted net carrying amount."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Opening Carrying Amount" value={openingCarryingAmount} onChange={setOpeningCarryingAmount} placeholder="960000" />
                        <InputCard label="Face Value" value={faceValue} onChange={setFaceValue} placeholder="1000000" />
                        <InputCard label="Stated Rate %" value={statedRatePercent} onChange={setStatedRatePercent} placeholder="8" />
                        <InputCard label="Effective Rate %" value={effectiveRatePercent} onChange={setEffectiveRatePercent} placeholder="9" />
                        <InputCard label="Expected Credit Loss Allowance" value={expectedCreditLoss} onChange={setExpectedCreditLoss} placeholder="12000" />
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
                    <ResultGrid columns={4}>
                        <ResultCard title="Interest Revenue" value={formatPHP(result.interestRevenue)} />
                        <ResultCard title="Cash Interest" value={formatPHP(result.cashInterest)} />
                        <ResultCard title="Amortization" value={formatPHP(result.amortization)} />
                        <ResultCard title="Net Carrying Amount" value={formatPHP(result.netCarryingAmount)} tone="accent" />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Ending gross carrying amount = opening carrying amount + effective-interest revenue - cash interest"
                        steps={[
                            `Interest revenue = ${formatPHP(Number(openingCarryingAmount))} x ${Number(effectiveRatePercent).toFixed(2)}% = ${formatPHP(result.interestRevenue)}.`,
                            `Cash interest = ${formatPHP(Number(faceValue))} x ${Number(statedRatePercent).toFixed(2)}% = ${formatPHP(result.cashInterest)}.`,
                            `Ending gross carrying amount = ${formatPHP(result.endingGrossCarryingAmount)}; net of ECL = ${formatPHP(result.netCarryingAmount)}.`,
                        ]}
                        interpretation={result.measurementSignal}
                        warnings={["This is an amortized-cost classroom schedule. Classification, fair-value election, and impairment staging require separate standard-specific judgment."]}
                    />
                ) : null
            }
        />
    );
}
