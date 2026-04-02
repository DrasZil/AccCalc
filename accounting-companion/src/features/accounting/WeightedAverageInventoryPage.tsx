import { useMemo, useState } from 'react';
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";

export default function WeightedAverageInventoryPage() {
    const [beginningUnits, setBeginningUnits] = useState("");
    const [beginningCost, setBeginningCost] = useState("");

    const [purchase1Units, setPurchase1Units] = useState("");
    const [purchase1Cost, setPurchase1Cost] = useState("");

    const [purchase2Units, setPurchase2Units] = useState("");
    const [purchase2Cost, setPurchase2Cost] = useState("");

    const [unitsSold, setUnitsSold] = useState("");

    const result = useMemo(() => {
        const values = [
        beginningUnits,
        beginningCost,
        purchase1Units,
        purchase1Cost,
        purchase2Units,
        purchase2Cost,
        unitsSold,
        ];

        if (values.some((value) => value.trim() === "")) return null;

        const bUnits = Number(beginningUnits);
        const bCost = Number(beginningCost);
        const p1Units = Number(purchase1Units);
        const p1Cost = Number(purchase1Cost);
        const p2Units = Number(purchase2Units);
        const p2Cost = Number(purchase2Cost);
        const sold = Number(unitsSold);

        const numericValues = [bUnits, bCost, p1Units, p1Cost, p2Units, p2Cost, sold];

        if (numericValues.some((value) => Number.isNaN(value))) {
        return {
            error: "All inputs must be valid numbers.",
        };
        }

        if (
        bUnits < 0 ||
        bCost < 0 ||
        p1Units < 0 ||
        p1Cost < 0 ||
        p2Units < 0 ||
        p2Cost < 0 ||
        sold < 0
        ) {
        return {
            error: "Values cannot be negative.",
        };
        }

        const totalUnitsAvailable = bUnits + p1Units + p2Units;
        const totalCostAvailable =
        bUnits * bCost + p1Units * p1Cost + p2Units * p2Cost;

        if (totalUnitsAvailable === 0) {
        return {
            error: "Total units available must be greater than 0.",
        };
        }

        if (sold > totalUnitsAvailable) {
        return {
            error: "Units sold cannot be greater than total units available.",
        };
        }

        const weightedAverageUnitCost = totalCostAvailable / totalUnitsAvailable;
        const cogs = sold * weightedAverageUnitCost;
        const endingUnits = totalUnitsAvailable - sold;
        const endingInventory = endingUnits * weightedAverageUnitCost;

        return {
        totalUnitsAvailable,
        totalCostAvailable,
        weightedAverageUnitCost,
        cogs,
        endingUnits,
        endingInventory,
        formula: (
            <>
            Weighted Average Unit Cost = Total Cost of Goods Available / Total Units Available
            </>
        ),
        steps: [
            `Beginning Inventory Cost = ${bUnits} unit(s) × ${formatPHP(bCost)} = ${formatPHP(
            bUnits * bCost
            )}`,
            `Purchase 1 Cost = ${p1Units} unit(s) × ${formatPHP(p1Cost)} = ${formatPHP(
            p1Units * p1Cost
            )}`,
            `Purchase 2 Cost = ${p2Units} unit(s) × ${formatPHP(p2Cost)} = ${formatPHP(
            p2Units * p2Cost
            )}`,
            `Total Units Available = ${bUnits} + ${p1Units} + ${p2Units} = ${totalUnitsAvailable}`,
            `Total Cost Available = ${formatPHP(totalCostAvailable)}`,
            `Weighted Average Unit Cost = ${formatPHP(totalCostAvailable)} / ${totalUnitsAvailable} = ${formatPHP(
            weightedAverageUnitCost
            )}`,
            `Cost of Goods Sold = ${sold} × ${formatPHP(weightedAverageUnitCost)} = ${formatPHP(
            cogs
            )}`,
            `Ending Units = ${totalUnitsAvailable} - ${sold} = ${endingUnits}`,
            `Ending Inventory = ${endingUnits} × ${formatPHP(weightedAverageUnitCost)} = ${formatPHP(
            endingInventory
            )}`,
        ],
        };
    }, [
        beginningUnits,
        beginningCost,
        purchase1Units,
        purchase1Cost,
        purchase2Units,
        purchase2Cost,
        unitsSold,
    ]);

    return (
        <CalculatorPageLayout
        badge="Accounting"
        title="Weighted Average Inventory Calculator"
        description="Compute weighted average unit cost, cost of goods sold, and ending inventory."
        inputSection={
            <div className="space-y-4">
            <SectionCard>
                <p className="text-sm font-medium text-gray-300">Beginning Inventory</p>
                <div className="mt-4">
                <InputGrid columns={2}>
                    <InputCard
                    label="Units"
                    value={beginningUnits}
                    onChange={setBeginningUnits}
                    placeholder="100"
                    />
                    <InputCard
                    label="Unit Cost"
                    value={beginningCost}
                    onChange={setBeginningCost}
                    placeholder="50"
                    />
                </InputGrid>
                </div>
            </SectionCard>

            <SectionCard>
                <p className="text-sm font-medium text-gray-300">Purchase 1</p>
                <div className="mt-4">
                <InputGrid columns={2}>
                    <InputCard
                    label="Units"
                    value={purchase1Units}
                    onChange={setPurchase1Units}
                    placeholder="80"
                    />
                    <InputCard
                    label="Unit Cost"
                    value={purchase1Cost}
                    onChange={setPurchase1Cost}
                    placeholder="55"
                    />
                </InputGrid>
                </div>
            </SectionCard>

            <SectionCard>
                <p className="text-sm font-medium text-gray-300">Purchase 2</p>
                <div className="mt-4">
                <InputGrid columns={2}>
                    <InputCard
                    label="Units"
                    value={purchase2Units}
                    onChange={setPurchase2Units}
                    placeholder="60"
                    />
                    <InputCard
                    label="Unit Cost"
                    value={purchase2Cost}
                    onChange={setPurchase2Cost}
                    placeholder="58"
                    />
                </InputGrid>
                </div>
            </SectionCard>

            <SectionCard>
                <InputGrid columns={1}>
                <InputCard
                    label="Units Sold"
                    value={unitsSold}
                    onChange={setUnitsSold}
                    placeholder="150"
                />
                </InputGrid>
            </SectionCard>
            </div>
        }
        resultSection={
            result && "error" in result ? (
            <SectionCard className="border-yellow-400/20 bg-yellow-500/10">
                <p className="text-sm font-medium text-yellow-300">Input notice</p>
                <p className="mt-2 text-sm leading-6 text-yellow-200">
                {result.error}
                </p>
            </SectionCard>
            ) : result ? (
            <ResultGrid columns={2}>
                <ResultCard
                title="Weighted Average Unit Cost"
                value={formatPHP(result.weightedAverageUnitCost)}
                />
                <ResultCard
                title="Cost of Goods Sold"
                value={formatPHP(result.cogs)}
                />
                <ResultCard
                title="Ending Units"
                value={String(result.endingUnits)}
                />
                <ResultCard
                title="Ending Inventory"
                value={formatPHP(result.endingInventory)}
                />
            </ResultGrid>
            ) : null
        }
        explanationSection={
            result && !("error" in result) ? (
            <FormulaCard formula={result.formula} steps={result.steps} />
            ) : null
        }
        />
    );
}