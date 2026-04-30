import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeAuditAnalyticalProcedureReview } from "../../utils/calculatorMath";

export default function AnalyticalProceduresReviewPage() {
    const [priorAmount, setPriorAmount] = useState("1200000");
    const [currentAmount, setCurrentAmount] = useState("1540000");
    const [expectedAmount, setExpectedAmount] = useState("1440000");
    const [tolerableDifferencePercent, setTolerableDifferencePercent] = useState("5");
    const [inherentRiskRating, setInherentRiskRating] = useState("4");
    const [explanationQuality, setExplanationQuality] = useState("2");

    const result = useMemo(() => {
        const values = [
            priorAmount,
            currentAmount,
            expectedAmount,
            tolerableDifferencePercent,
            inherentRiskRating,
            explanationQuality,
        ];
        if (values.some((value) => value.trim() === "")) return null;

        const numeric = values.map((value) => Number(value));
        if (numeric.some((value) => Number.isNaN(value))) {
            return { error: "All analytical-procedure inputs must be valid numbers." };
        }
        if (numeric[3] < 0 || numeric[4] < 0 || numeric[4] > 5 || numeric[5] < 0 || numeric[5] > 5) {
            return { error: "Tolerance cannot be negative. Risk and explanation quality must be rated from 0 to 5." };
        }

        return computeAuditAnalyticalProcedureReview({
            priorAmount: numeric[0],
            currentAmount: numeric[1],
            expectedAmount: numeric[2],
            tolerableDifferencePercent: numeric[3],
            inherentRiskRating: numeric[4],
            explanationQuality: numeric[5],
        });
    }, [
        currentAmount,
        expectedAmount,
        explanationQuality,
        inherentRiskRating,
        priorAmount,
        tolerableDifferencePercent,
    ]);

    return (
        <CalculatorPageLayout
            badge="Audit | Analytical procedures"
            title="Analytical Procedures Review"
            description="Compare current results with prior and expected amounts, then read whether the unexplained difference needs follow-up based on tolerance, inherent risk, and explanation quality."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Prior Amount" value={priorAmount} onChange={setPriorAmount} />
                        <InputCard label="Current Amount" value={currentAmount} onChange={setCurrentAmount} />
                        <InputCard label="Expected Amount" value={expectedAmount} onChange={setExpectedAmount} />
                        <InputCard label="Tolerable Difference (%)" value={tolerableDifferencePercent} onChange={setTolerableDifferencePercent} />
                        <InputCard label="Inherent Risk (0-5)" value={inherentRiskRating} onChange={setInherentRiskRating} />
                        <InputCard label="Explanation Quality (0-5)" value={explanationQuality} onChange={setExplanationQuality} />
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
                            <ResultCard title="Actual Change" value={formatPHP(result.actualChange)} tone="accent" />
                            <ResultCard title="Change %" value={`${result.actualChangePercent.toFixed(2)}%`} />
                            <ResultCard title="Unexplained Difference" value={formatPHP(result.unexplainedDifference)} />
                            <ResultCard title="Risk Pressure" value={result.riskPressure.toFixed(2)} tone={result.excessDifference > 0 ? "warning" : "default"} />
                        </ResultGrid>
                        <SectionCard>
                            <p className="app-card-title text-sm">Procedure signal</p>
                            <p className="app-body-md mt-2 text-sm">{result.reviewSignal}</p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Unexplained difference = current amount - expected amount"
                        steps={[
                            `Actual change = ${formatPHP(Number(currentAmount))} - ${formatPHP(Number(priorAmount))} = ${formatPHP(result.actualChange)}.`,
                            `Tolerable difference = expected amount x tolerance = ${formatPHP(result.tolerableDifference)}.`,
                            `Excess difference = ${formatPHP(result.excessDifference)}.`,
                            `Risk pressure score = ${result.riskPressure.toFixed(2)}.`,
                        ]}
                        interpretation="This is an audit reviewer aid for planning or final analytical procedures. It structures follow-up thinking but does not replace audit standards, firm methodology, or engagement judgment."
                        warnings={[
                            "A plausible explanation should be corroborated, not merely accepted.",
                            "High-risk accounts can require follow-up even when the numeric difference is within tolerance.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
