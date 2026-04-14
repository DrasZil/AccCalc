import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeShareBasedPayment } from "../../utils/calculatorMath";

function formatPercent(value: number) {
    return `${(value * 100).toFixed(2)}%`;
}

export default function ShareBasedPaymentPage() {
    const [grantDateFairValuePerOption, setGrantDateFairValuePerOption] = useState("");
    const [optionsGranted, setOptionsGranted] = useState("");
    const [estimatedForfeitureRatePercent, setEstimatedForfeitureRatePercent] = useState("");
    const [vestingYears, setVestingYears] = useState("");
    const [serviceYearsRendered, setServiceYearsRendered] = useState("");

    const result = useMemo(() => {
        const rawValues = [
            grantDateFairValuePerOption,
            optionsGranted,
            estimatedForfeitureRatePercent,
            vestingYears,
            serviceYearsRendered,
        ];

        if (rawValues.some((value) => value.trim() === "")) return null;

        const numeric = rawValues.map((value) => Number(value));
        if (numeric.some((value) => Number.isNaN(value))) {
            return { error: "All share-based payment inputs must be valid numbers." };
        }

        return computeShareBasedPayment({
            grantDateFairValuePerOption: numeric[0],
            optionsGranted: numeric[1],
            estimatedForfeitureRatePercent: numeric[2],
            vestingYears: numeric[3],
            serviceYearsRendered: numeric[4],
        });
    }, [
        estimatedForfeitureRatePercent,
        grantDateFairValuePerOption,
        optionsGranted,
        serviceYearsRendered,
        vestingYears,
    ]);

    return (
        <CalculatorPageLayout
            badge="FAR"
            title="Share-Based Payment Workspace"
            description="Estimate expected vesting, cumulative compensation cost, and current-period expense for equity-settled share-based awards."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Grant-Date Fair Value / Option" value={grantDateFairValuePerOption} onChange={setGrantDateFairValuePerOption} placeholder="18.50" />
                        <InputCard label="Options Granted" value={optionsGranted} onChange={setOptionsGranted} placeholder="100000" />
                        <InputCard label="Estimated Forfeiture Rate (%)" value={estimatedForfeitureRatePercent} onChange={setEstimatedForfeitureRatePercent} placeholder="6" />
                        <InputCard label="Vesting Years" value={vestingYears} onChange={setVestingYears} placeholder="4" />
                        <InputCard label="Service Years Rendered" value={serviceYearsRendered} onChange={setServiceYearsRendered} placeholder="2" helperText="Use cumulative service rendered to date when reading cumulative compensation cost." />
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
                        <ResultCard title="Expected Vesting Rate" value={formatPercent(result.expectedVestPercent)} tone="accent" />
                        <ResultCard title="Expected Options to Vest" value={result.expectedOptionsToVest.toFixed(0)} />
                        <ResultCard title="Cumulative Compensation Cost" value={formatPHP(result.cumulativeCompensationCost)} />
                        <ResultCard title="Current-Period Expense Signal" value={formatPHP(result.currentPeriodExpense)} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Expected compensation cost = grant-date fair value x expected options to vest; cumulative cost = total expected cost x service rendered / vesting period"
                        steps={[
                            `Expected options to vest = ${Number(optionsGranted).toFixed(0)} x ${formatPercent(result.expectedVestPercent)} = ${result.expectedOptionsToVest.toFixed(0)}.`,
                            `Total expected compensation cost = ${formatPHP(result.totalCompensationCost)}.`,
                            `Cumulative cost recognized to date = ${formatPHP(result.cumulativeCompensationCost)}.`,
                            `A simple current-period expense signal is ${formatPHP(result.currentPeriodExpense)} per year when assumptions remain unchanged.`,
                        ]}
                        interpretation="Grant-date fair value stays central for equity-settled awards. The expense is recognized over the service period based on the awards expected to vest."
                        warnings={[
                            "If forfeiture expectations change, cumulative catch-up adjustments may be needed.",
                            "This first-pass workspace does not yet model graded vesting or cash-settled remeasurement.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
