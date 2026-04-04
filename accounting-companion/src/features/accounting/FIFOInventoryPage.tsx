import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";

type Layer = {
    label: string;
    units: number;
    unitCost: number;
};

export default function FIFOInventoryPage() {
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

        const layers: Layer[] = [
            { label: "Beginning Inventory", units: bUnits, unitCost: bCost },
            { label: "Purchase 1", units: p1Units, unitCost: p1Cost },
            { label: "Purchase 2", units: p2Units, unitCost: p2Cost },
        ];

        const totalAvailableUnits = layers.reduce((sum, layer) => sum + layer.units, 0);

        if (sold > totalAvailableUnits) {
            return {
                error: "Units sold cannot be greater than total units available.",
            };
        }

        let unitsToIssue = sold;
        let cogs = 0;
        const issueSteps: string[] = [];
        const remainingLayers = layers.map((layer) => ({ ...layer }));

        for (const layer of remainingLayers) {
            if (unitsToIssue === 0) break;

            const unitsFromLayer = Math.min(layer.units, unitsToIssue);
            const layerCost = unitsFromLayer * layer.unitCost;

            if (unitsFromLayer > 0) {
                issueSteps.push(
                    `${unitsFromLayer} unit(s) x ${formatPHP(layer.unitCost)} from ${layer.label} = ${formatPHP(layerCost)}`
                );
            }

            cogs += layerCost;
            layer.units -= unitsFromLayer;
            unitsToIssue -= unitsFromLayer;
        }

        const endingInventory = remainingLayers.reduce(
            (sum, layer) => sum + layer.units * layer.unitCost,
            0
        );

        const remainingInventoryLines = remainingLayers
            .filter((layer) => layer.units > 0)
            .map(
                (layer) =>
                    `${layer.label}: ${layer.units} unit(s) x ${formatPHP(layer.unitCost)} = ${formatPHP(
                        layer.units * layer.unitCost
                    )}`
            );

        return {
            cogs,
            endingInventory,
            formula: <>FIFO: earliest costs are assigned to units sold first</>,
            steps: [
                `Total available units = ${bUnits} + ${p1Units} + ${p2Units} = ${totalAvailableUnits}`,
                `Units sold = ${sold}`,
                "Cost of goods sold is taken from the oldest inventory layers first:",
                ...issueSteps,
                `Total cost of goods sold = ${formatPHP(cogs)}`,
                "Remaining inventory layers:",
                ...remainingInventoryLines,
                `Ending inventory = ${formatPHP(endingInventory)}`,
            ],
            interpretation: `FIFO assigns the earliest inventory layers to the ${sold} units sold first. That produces cost of goods sold of ${formatPHP(cogs)} and leaves ${formatPHP(endingInventory)} in ending inventory from the newer remaining layers.`,
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
            title="FIFO Inventory Calculator"
            description="Compute cost of goods sold and ending inventory using the FIFO method."
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
                        <p className="mt-2 text-sm leading-6 text-yellow-200">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={2}>
                        <ResultCard title="Cost of Goods Sold" value={formatPHP(result.cogs)} />
                        <ResultCard
                            title="Ending Inventory"
                            value={formatPHP(result.endingInventory)}
                        />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula={result.formula}
                        steps={result.steps}
                        interpretation={result.interpretation}
                    />
                ) : null
            }
        />
    );
}
