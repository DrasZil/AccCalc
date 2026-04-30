import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeTaxRemedyTimelineReview } from "../../utils/calculatorMath";

export default function TaxRemedyTimelineReviewPage() {
    const [daysUntilDeadline, setDaysUntilDeadline] = useState("30");
    const [evidenceCompletenessPercent, setEvidenceCompletenessPercent] = useState("70");
    const [amountMaterialityPercent, setAmountMaterialityPercent] = useState("25");
    const [proceduralComplexity, setProceduralComplexity] = useState("2");

    const result = useMemo(() => {
        const values = [
            daysUntilDeadline,
            evidenceCompletenessPercent,
            amountMaterialityPercent,
            proceduralComplexity,
        ];
        if (values.some((value) => value.trim() === "")) return null;

        const numeric = values.map((value) => Number(value));
        if (numeric.some((value) => Number.isNaN(value))) {
            return { error: "All tax-remedy review inputs must be valid numbers." };
        }
        if (numeric[1] < 0 || numeric[1] > 100 || numeric[2] < 0 || numeric[3] < 0 || numeric[3] > 5) {
            return {
                error:
                    "Evidence completeness must be 0-100%, materiality cannot be negative, and procedural complexity must be 0-5.",
            };
        }

        return computeTaxRemedyTimelineReview({
            daysUntilDeadline: numeric[0],
            evidenceCompletenessPercent: numeric[1],
            amountMaterialityPercent: numeric[2],
            proceduralComplexity: numeric[3],
        });
    }, [
        amountMaterialityPercent,
        daysUntilDeadline,
        evidenceCompletenessPercent,
        proceduralComplexity,
    ]);

    return (
        <CalculatorPageLayout
            badge="Taxation | Remedies"
            title="Tax Remedy Timeline Review"
            description="Triage a classroom tax-remedy scenario by entered deadline pressure, evidence completeness, amount materiality, and procedural complexity."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Days Until Entered Deadline" value={daysUntilDeadline} onChange={setDaysUntilDeadline} />
                        <InputCard label="Evidence Completeness (%)" value={evidenceCompletenessPercent} onChange={setEvidenceCompletenessPercent} />
                        <InputCard label="Amount Materiality (%)" value={amountMaterialityPercent} onChange={setAmountMaterialityPercent} />
                        <InputCard label="Procedural Complexity (0-5)" value={proceduralComplexity} onChange={setProceduralComplexity} />
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
                        <ResultGrid columns={3}>
                            <ResultCard title="Urgency Score" value={result.urgencyScore.toFixed(2)} tone="accent" />
                            <ResultCard title="Evidence Gap" value={`${result.evidenceGapPercent.toFixed(2)}%`} />
                            <ResultCard title="Risk Score" value={result.riskScore.toFixed(2)} tone={result.riskScore >= 8 ? "warning" : "default"} />
                        </ResultGrid>
                        <SectionCard>
                            <p className="app-card-title text-sm">Review direction</p>
                            <p className="app-body-md mt-2 text-sm">{result.actionBand}</p>
                            <p className="app-helper mt-3 text-xs">{result.educationNotice}</p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Risk score = urgency + evidence gap factor + materiality factor + complexity"
                        steps={[
                            `Urgency score = ${result.urgencyScore.toFixed(2)} based on the entered days until deadline.`,
                            `Evidence gap = 100% - completeness = ${result.evidenceGapPercent.toFixed(2)}%.`,
                            `Risk score = ${result.riskScore.toFixed(2)}.`,
                        ]}
                        interpretation="This reviewer helps organize tax-remedy study prompts. It intentionally uses user-entered deadlines and does not provide official current tax authority guidance."
                        warnings={[
                            "Always verify current filing periods, remedies, forms, and procedural requirements from official sources or qualified advisers.",
                            "Do not use this page as legal or tax advice.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
