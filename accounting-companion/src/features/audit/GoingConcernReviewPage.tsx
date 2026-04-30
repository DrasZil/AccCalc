import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeGoingConcernReview } from "../../utils/calculatorMath";

export default function GoingConcernReviewPage() {
    const [liquidityPressure, setLiquidityPressure] = useState("4");
    const [recurringLosses, setRecurringLosses] = useState("3");
    const [debtCovenantPressure, setDebtCovenantPressure] = useState("3");
    const [managementPlanQuality, setManagementPlanQuality] = useState("2");
    const [evidenceSupport, setEvidenceSupport] = useState("2");

    const result = useMemo(() => {
        const values = [
            liquidityPressure,
            recurringLosses,
            debtCovenantPressure,
            managementPlanQuality,
            evidenceSupport,
        ];
        if (values.some((value) => value.trim() === "")) return null;

        const numeric = values.map((value) => Number(value));
        if (numeric.some((value) => Number.isNaN(value))) {
            return { error: "All going-concern ratings must be valid numbers." };
        }
        if (numeric.some((value) => value < 0 || value > 5)) {
            return { error: "Use ratings from 0 to 5 for each condition and mitigating factor." };
        }

        return computeGoingConcernReview({
            liquidityPressure: numeric[0],
            recurringLosses: numeric[1],
            debtCovenantPressure: numeric[2],
            managementPlanQuality: numeric[3],
            evidenceSupport: numeric[4],
        });
    }, [
        debtCovenantPressure,
        evidenceSupport,
        liquidityPressure,
        managementPlanQuality,
        recurringLosses,
    ]);

    return (
        <CalculatorPageLayout
            badge="Audit | Completion"
            title="Going Concern Review Workspace"
            description="Score adverse conditions against management plans and evidence support so going-concern review questions produce a clear procedure and reporting direction."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Liquidity Pressure (0-5)" value={liquidityPressure} onChange={setLiquidityPressure} />
                        <InputCard label="Recurring Losses (0-5)" value={recurringLosses} onChange={setRecurringLosses} />
                        <InputCard label="Debt Covenant Pressure (0-5)" value={debtCovenantPressure} onChange={setDebtCovenantPressure} />
                        <InputCard label="Management Plan Quality (0-5)" value={managementPlanQuality} onChange={setManagementPlanQuality} />
                        <InputCard label="Evidence Support (0-5)" value={evidenceSupport} onChange={setEvidenceSupport} />
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
                            <ResultCard title="Adverse Conditions" value={result.adverseConditionScore.toFixed(2)} tone="accent" />
                            <ResultCard title="Mitigation Score" value={result.mitigationScore.toFixed(2)} />
                            <ResultCard
                                title="Residual Doubt"
                                value={result.residualDoubtScore.toFixed(2)}
                                tone={result.residualDoubtScore >= 6 ? "warning" : "default"}
                            />
                        </ResultGrid>
                        <SectionCard>
                            <p className="app-card-title text-sm">{result.conclusionBand}</p>
                            <p className="app-body-md mt-2 text-sm">{result.procedureSignal}</p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Residual doubt = adverse condition score - mitigation score"
                        steps={[
                            `Adverse condition score = ${result.adverseConditionScore.toFixed(2)}.`,
                            `Mitigation score = ${result.mitigationScore.toFixed(2)}.`,
                            `Residual doubt score = ${result.residualDoubtScore.toFixed(2)}.`,
                        ]}
                        interpretation="This workspace is an audit-theory reviewer aid. It structures facts and procedures but does not replace professional standards, firm methodology, or engagement-specific judgment."
                        warnings={[
                            "Management plans must be feasible and supported, not merely stated.",
                            "Going-concern conclusions also require disclosure and reporting assessment, not only a risk score.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
