import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeQuasiReorganization } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

export default function QuasiReorganizationPage() {
    const [deficit, setDeficit] = useState("");
    const [sharePremium, setSharePremium] = useState("");
    const [revaluationSurplus, setRevaluationSurplus] = useState("");
    const [capitalReduction, setCapitalReduction] = useState("");

    const result = useMemo(() => {
        if ([deficit, sharePremium, revaluationSurplus, capitalReduction].some((value) => value.trim() === "")) return null;
        const parsed = [deficit, sharePremium, revaluationSurplus, capitalReduction].map(Number);
        if (parsed.some(Number.isNaN)) return { error: "All quasi-reorganization inputs must be valid numbers." };
        if (parsed.some((value) => value < 0)) return { error: "Use non-negative deficit and equity-relief amounts." };
        return computeQuasiReorganization({
            deficit: parsed[0],
            sharePremium: parsed[1],
            revaluationSurplus: parsed[2],
            capitalReduction: parsed[3],
        });
    }, [capitalReduction, deficit, revaluationSurplus, sharePremium]);

    return (
        <CalculatorPageLayout
            badge="FAR"
            title="Quasi-Reorganization Deficit Cleanup"
            description="Estimate whether share premium, revaluation surplus, and capital reduction are enough to eliminate an accumulated deficit in a classroom quasi-reorganization case."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Accumulated Deficit" value={deficit} onChange={setDeficit} placeholder="1800000" />
                        <InputCard label="Share Premium Available" value={sharePremium} onChange={setSharePremium} placeholder="450000" />
                        <InputCard label="Revaluation Surplus Available" value={revaluationSurplus} onChange={setRevaluationSurplus} placeholder="350000" />
                        <InputCard label="Capital Reduction / Restatement" value={capitalReduction} onChange={setCapitalReduction} placeholder="1000000" />
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
                        <ResultCard title="Total Deficit Relief" value={formatPHP(result.totalDeficitRelief)} />
                        <ResultCard title="Remaining Deficit" value={formatPHP(result.remainingDeficit)} tone={result.cleanSurplusAchieved ? "accent" : "default"} />
                        <ResultCard title="Excess Relief" value={formatPHP(result.excessRelief)} />
                        <ResultCard title="Clean Surplus?" value={result.cleanSurplusAchieved ? "Yes" : "No"} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Remaining deficit = accumulated deficit - share premium - revaluation surplus - capital reduction"
                        steps={[
                            `Total relief = ${formatPHP(Number(sharePremium))} + ${formatPHP(Number(revaluationSurplus))} + ${formatPHP(Number(capitalReduction))} = ${formatPHP(result.totalDeficitRelief)}.`,
                            `Remaining deficit = ${formatPHP(Number(deficit))} - ${formatPHP(result.totalDeficitRelief)} = ${formatPHP(result.remainingDeficit)}.`,
                        ]}
                        interpretation={result.cleanSurplusAchieved ? "The entered relief sources are enough to eliminate the deficit under the simplified classroom setup." : "The entered relief sources do not fully eliminate the deficit."}
                        warnings={["Quasi-reorganization depends on legal and standards-based requirements. This helper only checks the arithmetic of the deficit cleanup presented in a class problem."]}
                    />
                ) : null
            }
        />
    );
}
