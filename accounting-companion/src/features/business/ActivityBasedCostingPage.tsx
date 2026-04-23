import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeActivityBasedCosting } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

export default function ActivityBasedCostingPage() {
    const [directMaterials, setDirectMaterials] = useState("");
    const [directLabor, setDirectLabor] = useState("");
    const [units, setUnits] = useState("");
    const [activityOneCost, setActivityOneCost] = useState("");
    const [activityOneTotalDriver, setActivityOneTotalDriver] = useState("");
    const [activityOneProductDriver, setActivityOneProductDriver] = useState("");
    const [activityTwoCost, setActivityTwoCost] = useState("");
    const [activityTwoTotalDriver, setActivityTwoTotalDriver] = useState("");
    const [activityTwoProductDriver, setActivityTwoProductDriver] = useState("");

    const result = useMemo(() => {
        const values = [
            directMaterials,
            directLabor,
            units,
            activityOneCost,
            activityOneTotalDriver,
            activityOneProductDriver,
            activityTwoCost,
            activityTwoTotalDriver,
            activityTwoProductDriver,
        ];
        if (values.some((value) => value.trim() === "")) return null;
        const parsed = values.map(Number);
        if (parsed.some(Number.isNaN)) return { error: "All ABC inputs must be valid numbers." };
        if (parsed.some((value) => value < 0)) return { error: "ABC inputs cannot be negative." };
        if (parsed[2] <= 0) return { error: "Units must be greater than zero." };
        if (parsed[4] <= 0 || parsed[7] <= 0) return { error: "Total driver quantities must be greater than zero." };

        return computeActivityBasedCosting({
            directMaterials: parsed[0],
            directLabor: parsed[1],
            units: parsed[2],
            activityOneCost: parsed[3],
            activityOneTotalDriver: parsed[4],
            activityOneProductDriver: parsed[5],
            activityTwoCost: parsed[6],
            activityTwoTotalDriver: parsed[7],
            activityTwoProductDriver: parsed[8],
        });
    }, [
        activityOneCost,
        activityOneProductDriver,
        activityOneTotalDriver,
        activityTwoCost,
        activityTwoProductDriver,
        activityTwoTotalDriver,
        directLabor,
        directMaterials,
        units,
    ]);

    return (
        <CalculatorPageLayout
            badge="Cost & Managerial"
            title="Activity-Based Costing Allocator"
            description="Allocate two activity cost pools to a product using driver rates, then compute total and unit product cost."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Direct Materials" value={directMaterials} onChange={setDirectMaterials} placeholder="180000" />
                        <InputCard label="Direct Labor" value={directLabor} onChange={setDirectLabor} placeholder="120000" />
                        <InputCard label="Units Produced" value={units} onChange={setUnits} placeholder="5000" />
                        <InputCard label="Activity 1 Cost Pool" value={activityOneCost} onChange={setActivityOneCost} placeholder="300000" />
                        <InputCard label="Activity 1 Total Driver" value={activityOneTotalDriver} onChange={setActivityOneTotalDriver} placeholder="600" />
                        <InputCard label="Activity 1 Product Driver" value={activityOneProductDriver} onChange={setActivityOneProductDriver} placeholder="120" />
                        <InputCard label="Activity 2 Cost Pool" value={activityTwoCost} onChange={setActivityTwoCost} placeholder="240000" />
                        <InputCard label="Activity 2 Total Driver" value={activityTwoTotalDriver} onChange={setActivityTwoTotalDriver} placeholder="8000" />
                        <InputCard label="Activity 2 Product Driver" value={activityTwoProductDriver} onChange={setActivityTwoProductDriver} placeholder="1700" />
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
                        <ResultCard title="Activity 1 Rate" value={formatPHP(result.activityOneRate)} />
                        <ResultCard title="Activity 2 Rate" value={formatPHP(result.activityTwoRate)} />
                        <ResultCard title="Total Overhead" value={formatPHP(result.totalOverheadAssigned)} />
                        <ResultCard title="Unit Product Cost" value={formatPHP(result.unitProductCost)} tone="accent" />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Activity rate = cost pool / total driver; assigned overhead = rate x product driver"
                        steps={[
                            `Activity 1 assigned = ${formatPHP(result.activityOneRate)} x ${Number(activityOneProductDriver).toLocaleString()} = ${formatPHP(result.activityOneAssigned)}.`,
                            `Activity 2 assigned = ${formatPHP(result.activityTwoRate)} x ${Number(activityTwoProductDriver).toLocaleString()} = ${formatPHP(result.activityTwoAssigned)}.`,
                            `Total product cost = direct materials + direct labor + assigned overhead = ${formatPHP(result.totalProductCost)}.`,
                        ]}
                        interpretation={result.costSignal}
                        warnings={["ABC depends on valid cost-driver selection. If the driver does not cause the cost, the allocation may look precise but still be misleading."]}
                    />
                ) : null
            }
        />
    );
}
