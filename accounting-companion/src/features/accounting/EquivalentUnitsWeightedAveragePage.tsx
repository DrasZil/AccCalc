import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeEquivalentUnitsWeightedAverage } from "../../utils/calculatorMath";

export default function EquivalentUnitsWeightedAveragePage() {
    const [beginningWorkInProcessUnits, setBeginningWorkInProcessUnits] = useState("");
    const [unitsStarted, setUnitsStarted] = useState("");
    const [unitsCompletedAndTransferred, setUnitsCompletedAndTransferred] = useState("");
    const [endingWorkInProcessUnits, setEndingWorkInProcessUnits] = useState("");
    const [endingMaterialsCompletionPercent, setEndingMaterialsCompletionPercent] = useState("");
    const [endingConversionCompletionPercent, setEndingConversionCompletionPercent] = useState("");
    const [totalMaterialsCosts, setTotalMaterialsCosts] = useState("");
    const [totalConversionCosts, setTotalConversionCosts] = useState("");

    const result = useMemo(() => {
        const values = [
            beginningWorkInProcessUnits,
            unitsStarted,
            unitsCompletedAndTransferred,
            endingWorkInProcessUnits,
            endingMaterialsCompletionPercent,
            endingConversionCompletionPercent,
            totalMaterialsCosts,
            totalConversionCosts,
        ];

        if (values.some((value) => value.trim() === "")) return null;

        const parsed = values.map((value) => Number(value));
        if (parsed.some((value) => Number.isNaN(value))) {
            return { error: "Equivalent-unit inputs must all be valid numbers." };
        }

        if (parsed.some((value) => value < 0)) {
            return { error: "Equivalent-unit inputs cannot be negative." };
        }

        if (parsed[4] > 100 || parsed[5] > 100) {
            return { error: "Ending completion percentages cannot exceed 100%." };
        }

        const computed = computeEquivalentUnitsWeightedAverage({
            beginningWorkInProcessUnits: parsed[0],
            unitsStarted: parsed[1],
            unitsCompletedAndTransferred: parsed[2],
            endingWorkInProcessUnits: parsed[3],
            endingMaterialsCompletionPercent: parsed[4],
            endingConversionCompletionPercent: parsed[5],
            totalMaterialsCosts: parsed[6],
            totalConversionCosts: parsed[7],
        });

        if (
            computed.materialsEquivalentUnits <= 0 ||
            computed.conversionEquivalentUnits <= 0
        ) {
            return {
                error: "Equivalent units must stay above zero for both materials and conversion.",
            };
        }

        if (Math.abs(computed.unitReconciliationDifference) > 0.005) {
            return {
                error: "Units to account for do not reconcile with units accounted for. Check beginning WIP, started, completed, and ending WIP amounts.",
            };
        }

        return computed;
    }, [
        beginningWorkInProcessUnits,
        endingConversionCompletionPercent,
        endingMaterialsCompletionPercent,
        endingWorkInProcessUnits,
        totalConversionCosts,
        totalMaterialsCosts,
        unitsCompletedAndTransferred,
        unitsStarted,
    ]);

    return (
        <CalculatorPageLayout
            badge="Accounting / Process Costing"
            title="Equivalent Units (Weighted Average)"
            description="Reconcile units, compute material and conversion equivalent units, and assign cost between transferred-out units and ending work in process."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard
                            label="Beginning WIP Units"
                            value={beginningWorkInProcessUnits}
                            onChange={setBeginningWorkInProcessUnits}
                            placeholder="1200"
                        />
                        <InputCard
                            label="Units Started"
                            value={unitsStarted}
                            onChange={setUnitsStarted}
                            placeholder="8800"
                        />
                        <InputCard
                            label="Units Completed and Transferred"
                            value={unitsCompletedAndTransferred}
                            onChange={setUnitsCompletedAndTransferred}
                            placeholder="9000"
                        />
                        <InputCard
                            label="Ending WIP Units"
                            value={endingWorkInProcessUnits}
                            onChange={setEndingWorkInProcessUnits}
                            placeholder="1000"
                        />
                        <InputCard
                            label="Ending Materials Completion (%)"
                            value={endingMaterialsCompletionPercent}
                            onChange={setEndingMaterialsCompletionPercent}
                            placeholder="100"
                        />
                        <InputCard
                            label="Ending Conversion Completion (%)"
                            value={endingConversionCompletionPercent}
                            onChange={setEndingConversionCompletionPercent}
                            placeholder="40"
                        />
                        <InputCard
                            label="Total Materials Costs"
                            value={totalMaterialsCosts}
                            onChange={setTotalMaterialsCosts}
                            placeholder="180000"
                        />
                        <InputCard
                            label="Total Conversion Costs"
                            value={totalConversionCosts}
                            onChange={setTotalConversionCosts}
                            placeholder="135000"
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
                                title="Materials Equivalent Units"
                                value={result.materialsEquivalentUnits.toFixed(2)}
                            />
                            <ResultCard
                                title="Conversion Equivalent Units"
                                value={result.conversionEquivalentUnits.toFixed(2)}
                            />
                            <ResultCard
                                title="Materials Cost / EU"
                                value={formatPHP(result.materialsCostPerEquivalentUnit)}
                            />
                            <ResultCard
                                title="Conversion Cost / EU"
                                value={formatPHP(result.conversionCostPerEquivalentUnit)}
                            />
                        </ResultGrid>

                        <ResultGrid columns={2}>
                            <ResultCard
                                title="Transferred-Out Cost"
                                value={formatPHP(result.transferredOutCost)}
                            />
                            <ResultCard
                                title="Ending WIP Cost"
                                value={formatPHP(result.endingWorkInProcessCost)}
                            />
                        </ResultGrid>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Weighted-average equivalent units = units completed and transferred + equivalent units in ending work in process."
                        steps={[
                            `Units to account for = ${Number(beginningWorkInProcessUnits || 0)} + ${Number(unitsStarted || 0)} = ${result.totalUnitsToAccountFor}.`,
                            `Units accounted for = ${Number(unitsCompletedAndTransferred || 0)} + ${Number(endingWorkInProcessUnits || 0)} = ${result.totalUnitsAccountedFor}.`,
                            `Materials equivalent units = ${Number(unitsCompletedAndTransferred || 0)} + (${Number(endingWorkInProcessUnits || 0)} x ${Number(endingMaterialsCompletionPercent || 0)}%) = ${result.materialsEquivalentUnits.toFixed(2)}.`,
                            `Conversion equivalent units = ${Number(unitsCompletedAndTransferred || 0)} + (${Number(endingWorkInProcessUnits || 0)} x ${Number(endingConversionCompletionPercent || 0)}%) = ${result.conversionEquivalentUnits.toFixed(2)}.`,
                            `Transferred-out cost = ${formatPHP(result.transferredOutCost)} and ending WIP cost = ${formatPHP(result.endingWorkInProcessCost)}.`,
                        ]}
                        interpretation={`Under the weighted-average method, transferred-out units absorb ${formatPHP(result.transferredOutCost)} while ending work in process carries ${formatPHP(result.endingWorkInProcessCost)} based on equivalent-unit completion.`}
                        assumptions={[
                            "This page follows weighted-average process costing rather than FIFO process costing.",
                            "Total materials and conversion costs are assumed to already include beginning work in process costs plus current-period additions.",
                        ]}
                        warnings={[
                            "If the assignment requires FIFO equivalent units, do not use this weighted-average result without relabeling the method.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
