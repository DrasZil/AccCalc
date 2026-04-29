import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeTargetCostingGap } from "../../utils/calculatorMath";

export default function TargetCostingWorkspacePage() {
    const [targetSellingPrice, setTargetSellingPrice] = useState("950");
    const [targetProfitMarginPercent, setTargetProfitMarginPercent] = useState("28");
    const [expectedUnitVolume, setExpectedUnitVolume] = useState("5000");
    const [currentEstimatedCostPerUnit, setCurrentEstimatedCostPerUnit] = useState("760");
    const [committedCostReductionPerUnit, setCommittedCostReductionPerUnit] = useState("35");

    const result = useMemo(() => {
        const values = [
            targetSellingPrice,
            targetProfitMarginPercent,
            expectedUnitVolume,
            currentEstimatedCostPerUnit,
            committedCostReductionPerUnit,
        ];
        if (values.some((value) => value.trim() === "")) return null;

        const numeric = values.map((value) => Number(value));
        if (numeric.some((value) => Number.isNaN(value))) {
            return { error: "All target-costing inputs must be valid numbers." };
        }
        if (numeric[0] <= 0 || numeric[2] < 0 || numeric[3] < 0) {
            return {
                error:
                    "Target selling price must be greater than zero. Volume and estimated cost cannot be negative.",
            };
        }
        if (numeric[1] < 0 || numeric[1] > 100) {
            return { error: "Target profit margin must be between 0 and 100 percent." };
        }

        return computeTargetCostingGap({
            targetSellingPrice: numeric[0],
            targetProfitMarginPercent: numeric[1],
            expectedUnitVolume: numeric[2],
            currentEstimatedCostPerUnit: numeric[3],
            committedCostReductionPerUnit: numeric[4],
        });
    }, [
        committedCostReductionPerUnit,
        currentEstimatedCostPerUnit,
        expectedUnitVolume,
        targetProfitMarginPercent,
        targetSellingPrice,
    ]);

    return (
        <CalculatorPageLayout
            badge="Strategic Cost Management"
            title="Target Costing Workspace"
            description="Convert market price and target profit into allowable cost, then measure the remaining strategic cost gap after planned design or process savings."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard
                            label="Target Selling Price"
                            value={targetSellingPrice}
                            onChange={setTargetSellingPrice}
                            placeholder="950"
                        />
                        <InputCard
                            label="Target Profit Margin (%)"
                            value={targetProfitMarginPercent}
                            onChange={setTargetProfitMarginPercent}
                            placeholder="28"
                        />
                        <InputCard
                            label="Expected Unit Volume"
                            value={expectedUnitVolume}
                            onChange={setExpectedUnitVolume}
                            placeholder="5000"
                        />
                        <InputCard
                            label="Current Estimated Cost / Unit"
                            value={currentEstimatedCostPerUnit}
                            onChange={setCurrentEstimatedCostPerUnit}
                            placeholder="760"
                        />
                        <InputCard
                            label="Committed Cost Reduction / Unit"
                            value={committedCostReductionPerUnit}
                            onChange={setCommittedCostReductionPerUnit}
                            placeholder="35"
                        />
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
                            <ResultCard
                                title="Allowable Cost / Unit"
                                value={formatPHP(result.allowableCostPerUnit)}
                                tone="accent"
                            />
                            <ResultCard
                                title="Revised Estimated Cost"
                                value={formatPHP(result.revisedCostPerUnit)}
                            />
                            <ResultCard
                                title="Remaining Gap / Unit"
                                value={formatPHP(result.remainingCostGapPerUnit)}
                                tone={result.remainingCostGapPerUnit > 0 ? "warning" : "success"}
                            />
                            <ResultCard
                                title="Total Cost Gap"
                                value={formatPHP(result.totalCostGap)}
                            />
                        </ResultGrid>
                        <SectionCard>
                            <p className="app-card-title text-sm">Strategic cost signal</p>
                            <p className="app-body-md mt-2 text-sm">{result.targetCostSignal}</p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Allowable cost = target selling price - target profit"
                        steps={[
                            `Target profit per unit = ${formatPHP(result.targetProfitPerUnit)}.`,
                            `Allowable cost per unit = ${formatPHP(Number(targetSellingPrice))} - ${formatPHP(result.targetProfitPerUnit)} = ${formatPHP(result.allowableCostPerUnit)}.`,
                            `Revised estimated cost = ${formatPHP(Number(currentEstimatedCostPerUnit))} - ${formatPHP(Number(committedCostReductionPerUnit))} = ${formatPHP(result.revisedCostPerUnit)}.`,
                            `Remaining cost gap = ${formatPHP(result.remainingCostGapPerUnit)} per unit, or ${formatPHP(result.totalCostGap)} across expected volume.`,
                        ]}
                        interpretation="Target costing starts from the market and required return, then asks whether design, supplier, process, or feature decisions can make the cost structure viable."
                        warnings={[
                            "A negative gap is favorable; a positive gap means the current design still misses the target.",
                            "Volume assumptions matter because a small per-unit gap can become material across the launch quantity.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
