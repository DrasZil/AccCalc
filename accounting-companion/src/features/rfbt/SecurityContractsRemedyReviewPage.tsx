import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeSecurityContractRemedyReview } from "../../utils/calculatorMath";

export default function SecurityContractsRemedyReviewPage() {
    const [obligationAmount, setObligationAmount] = useState("900000");
    const [collateralFairValue, setCollateralFairValue] = useState("760000");
    const [priorityClaims, setPriorityClaims] = useState("90000");
    const [documentationStrength, setDocumentationStrength] = useState("3");
    const [defaultSeverity, setDefaultSeverity] = useState("4");
    const [remedyCost, setRemedyCost] = useState("50000");

    const result = useMemo(() => {
        const values = [obligationAmount, collateralFairValue, priorityClaims, documentationStrength, defaultSeverity, remedyCost];
        if (values.some((value) => value.trim() === "")) return null;

        const numeric = values.map((value) => Number(value));
        if (numeric.some((value) => Number.isNaN(value))) {
            return { error: "All security-contract inputs must be valid numbers." };
        }
        if (numeric.slice(0, 3).some((value) => value < 0) || numeric[3] < 0 || numeric[3] > 5 || numeric[4] < 0 || numeric[4] > 5 || numeric[5] < 0) {
            return { error: "Amounts and costs cannot be negative. Documentation and default severity must be rated from 0 to 5." };
        }

        return computeSecurityContractRemedyReview({
            obligationAmount: numeric[0],
            collateralFairValue: numeric[1],
            priorityClaims: numeric[2],
            documentationStrength: numeric[3],
            defaultSeverity: numeric[4],
            remedyCost: numeric[5],
        });
    }, [collateralFairValue, defaultSeverity, documentationStrength, obligationAmount, priorityClaims, remedyCost]);

    return (
        <CalculatorPageLayout
            badge="RFBT | Credit transactions"
            title="Security Contracts Remedy Review"
            description="Review collateral coverage, priority claims, remedy costs, documentation strength, default severity, and possible deficiency for credit-transaction and security-contract cases."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Obligation Amount" value={obligationAmount} onChange={setObligationAmount} />
                        <InputCard label="Collateral Fair Value" value={collateralFairValue} onChange={setCollateralFairValue} />
                        <InputCard label="Priority Claims" value={priorityClaims} onChange={setPriorityClaims} />
                        <InputCard label="Documentation Strength (0-5)" value={documentationStrength} onChange={setDocumentationStrength} />
                        <InputCard label="Default Severity (0-5)" value={defaultSeverity} onChange={setDefaultSeverity} />
                        <InputCard label="Remedy Cost" value={remedyCost} onChange={setRemedyCost} />
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
                            <ResultCard title="Net Recovery" value={formatPHP(result.netRecoveryAfterCost)} tone="accent" />
                            <ResultCard title="Deficiency" value={formatPHP(result.deficiency)} tone={result.deficiency > 0 ? "warning" : "default"} />
                            <ResultCard title="Recovery Ratio" value={`${result.recoveryRatio.toFixed(2)}%`} />
                            <ResultCard title="Remedy Risk" value={result.remedyRiskScore.toFixed(2)} />
                        </ResultGrid>
                        <SectionCard>
                            <p className="app-card-title text-sm">Remedy signal</p>
                            <p className="app-body-md mt-2 text-sm">{result.remedySignal}</p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Net recovery = collateral fair value - priority claims - remedy cost"
                        steps={[
                            `Net collateral coverage = ${formatPHP(result.netCollateralCoverage)}.`,
                            `Net recovery after cost = ${formatPHP(result.netRecoveryAfterCost)}.`,
                            `Deficiency = ${formatPHP(result.deficiency)}.`,
                            `Recovery ratio = ${result.recoveryRatio.toFixed(2)}%.`,
                        ]}
                        interpretation="This is an RFBT reviewer aid for security-contract and credit-transaction issue spotting. It does not provide legal advice."
                        warnings={[
                            "Priority, documentation, statutory requirements, and remedy limits can change the legal result.",
                            "Use official legal materials or qualified counsel for real disputes.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
