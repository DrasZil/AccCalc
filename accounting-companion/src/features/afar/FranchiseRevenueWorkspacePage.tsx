import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeFranchiseRevenue } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

export default function FranchiseRevenueWorkspacePage() {
    const [initialFee, setInitialFee] = useState("");
    const [satisfiedPercent, setSatisfiedPercent] = useState("");
    const [uncollectiblePercent, setUncollectiblePercent] = useState("");

    const result = useMemo(() => {
        if ([initialFee, satisfiedPercent, uncollectiblePercent].some((value) => value.trim() === "")) return null;
        const fee = Number(initialFee);
        const satisfied = Number(satisfiedPercent);
        const uncollectible = Number(uncollectiblePercent);
        if ([fee, satisfied, uncollectible].some(Number.isNaN)) return { error: "All franchise inputs must be valid numbers." };
        if (fee < 0 || satisfied < 0 || satisfied > 100 || uncollectible < 0 || uncollectible > 100) {
            return { error: "Use a non-negative fee and percentages from 0% to 100%." };
        }

        return computeFranchiseRevenue({
            initialFranchiseFee: fee,
            satisfiedPerformanceObligationPercent: satisfied,
            estimatedUncollectiblePercent: uncollectible,
        });
    }, [initialFee, satisfiedPercent, uncollectiblePercent]);

    return (
        <CalculatorPageLayout
            badge="AFAR"
            title="Franchise Revenue Workspace"
            description="Analyze an initial franchise fee by separating satisfied performance obligations, collectability pressure, and remaining contract liability."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Initial Franchise Fee" value={initialFee} onChange={setInitialFee} placeholder="1200000" />
                        <InputCard label="Satisfied Obligation (%)" value={satisfiedPercent} onChange={setSatisfiedPercent} placeholder="70" />
                        <InputCard label="Estimated Uncollectible (%)" value={uncollectiblePercent} onChange={setUncollectiblePercent} placeholder="5" />
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
                        <ResultCard title="Satisfied-Obligation Revenue" value={formatPHP(result.satisfiedRevenue)} />
                        <ResultCard title="Expected Collectible Amount" value={formatPHP(result.expectedCollectibleAmount)} />
                        <ResultCard title="Revenue Recognized" value={formatPHP(result.revenueRecognized)} tone="accent" />
                        <ResultCard title="Contract Liability" value={formatPHP(result.contractLiability)} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Revenue recognized = lower of satisfied-obligation amount and expected collectible amount under the classroom constraint selected"
                        steps={[
                            `Satisfied-obligation amount = ${formatPHP(Number(initialFee))} x ${formatPercent(Number(satisfiedPercent))} = ${formatPHP(result.satisfiedRevenue)}.`,
                            `Expected collectible amount = ${formatPHP(Number(initialFee))} x (1 - ${formatPercent(Number(uncollectiblePercent))}) = ${formatPHP(result.expectedCollectibleAmount)}.`,
                            `Remaining contract liability = ${formatPHP(Number(initialFee))} - ${formatPHP(result.revenueRecognized)} = ${formatPHP(result.contractLiability)}.`,
                        ]}
                        interpretation="Use this as an AFAR classroom helper for franchise cases where an initial fee must be split between performed services and obligations still owed."
                        warnings={[
                            "Real revenue recognition depends on the contract, performance obligations, and collectability assessment.",
                            "Do not use this as a legal conclusion; it is a structured review aid for assignment facts.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
