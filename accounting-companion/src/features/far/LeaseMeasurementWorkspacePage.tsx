import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeLeaseMeasurement } from "../../utils/calculatorMath";

export default function LeaseMeasurementWorkspacePage() {
    const [periodicLeasePayment, setPeriodicLeasePayment] = useState("");
    const [numberOfPeriods, setNumberOfPeriods] = useState("");
    const [periodicDiscountRatePercent, setPeriodicDiscountRatePercent] = useState("");
    const [guaranteedResidualValue, setGuaranteedResidualValue] = useState("");
    const [bargainPurchaseOption, setBargainPurchaseOption] = useState("");
    const [initialDirectCosts, setInitialDirectCosts] = useState("");
    const [leaseIncentivesReceived, setLeaseIncentivesReceived] = useState("");

    const result = useMemo(() => {
        if (
            periodicLeasePayment.trim() === "" ||
            numberOfPeriods.trim() === "" ||
            periodicDiscountRatePercent.trim() === ""
        ) {
            return null;
        }

        const coreValues = [
            Number(periodicLeasePayment),
            Number(numberOfPeriods),
            Number(periodicDiscountRatePercent),
        ];

        if (coreValues.some((value) => Number.isNaN(value))) {
            return { error: "Lease payments, number of periods, and the discount rate must be valid numbers." };
        }

        return computeLeaseMeasurement({
            periodicLeasePayment: coreValues[0],
            numberOfPeriods: coreValues[1],
            periodicDiscountRatePercent: coreValues[2],
            guaranteedResidualValue:
                guaranteedResidualValue.trim() === "" ? 0 : Number(guaranteedResidualValue),
            bargainPurchaseOption:
                bargainPurchaseOption.trim() === "" ? 0 : Number(bargainPurchaseOption),
            initialDirectCosts:
                initialDirectCosts.trim() === "" ? 0 : Number(initialDirectCosts),
            leaseIncentivesReceived:
                leaseIncentivesReceived.trim() === "" ? 0 : Number(leaseIncentivesReceived),
        });
    }, [
        bargainPurchaseOption,
        guaranteedResidualValue,
        initialDirectCosts,
        leaseIncentivesReceived,
        numberOfPeriods,
        periodicDiscountRatePercent,
        periodicLeasePayment,
    ]);

    return (
        <CalculatorPageLayout
            badge="FAR"
            title="Lease Measurement Workspace"
            description="Estimate the initial lease liability and right-of-use asset using periodic lease payments, discounting, residual-value exposure, and related adjustments."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Periodic Lease Payment" value={periodicLeasePayment} onChange={setPeriodicLeasePayment} placeholder="85000" />
                        <InputCard label="Number of Periods" value={numberOfPeriods} onChange={setNumberOfPeriods} placeholder="5" />
                        <InputCard label="Periodic Discount Rate (%)" value={periodicDiscountRatePercent} onChange={setPeriodicDiscountRatePercent} placeholder="8" helperText="Use the rate per payment period, not the nominal annual rate unless they match." />
                        <InputCard label="Guaranteed Residual Value" value={guaranteedResidualValue} onChange={setGuaranteedResidualValue} placeholder="30000" />
                        <InputCard label="Bargain Purchase Option" value={bargainPurchaseOption} onChange={setBargainPurchaseOption} placeholder="0" />
                        <InputCard label="Initial Direct Costs" value={initialDirectCosts} onChange={setInitialDirectCosts} placeholder="5000" />
                        <InputCard label="Lease Incentives Received" value={leaseIncentivesReceived} onChange={setLeaseIncentivesReceived} placeholder="12000" />
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
                            <ResultCard title="Lease Liability" value={formatPHP(result.initialLeaseLiability)} tone="accent" />
                            <ResultCard title="Right-of-Use Asset" value={formatPHP(result.initialRightOfUseAsset)} />
                            <ResultCard title="Undiscounted Cash Commitment" value={formatPHP(result.totalUndiscountedPayments)} />
                            <ResultCard title="Total Finance Charge" value={formatPHP(result.totalFinanceCharge)} />
                        </ResultGrid>
                        <SectionCard>
                            <p className="app-card-title text-sm">Measurement note</p>
                            <p className="app-body-md mt-2 text-sm">
                                This workspace is designed for first-pass lease measurement under a lessee
                                view. It helps with present-value logic, but later amortization,
                                remeasurement, and classification details still need separate analysis.
                            </p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Lease liability = PV of lease payments + PV of guaranteed residual value or bargain option; ROU asset = lease liability + initial direct costs - lease incentives"
                        steps={[
                            `Present value of lease payments = ${formatPHP(result.presentValueOfLeasePayments)}.`,
                            `Discounted residual-value and option components = ${formatPHP(result.discountedResidualAndOption)}.`,
                            `Initial lease liability = ${formatPHP(result.initialLeaseLiability)}.`,
                            `Initial right-of-use asset = ${formatPHP(result.initialRightOfUseAsset)}.`,
                        ]}
                        interpretation="The liability reflects discounted future obligations. The right-of-use asset starts from that liability, then adjusts for direct costs and incentives."
                        warnings={[
                            "Use the rate per payment period and keep payment timing consistent with the chosen period count.",
                            "This page does not yet handle variable lease payments, remeasurement events, or separate lessor accounting.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
