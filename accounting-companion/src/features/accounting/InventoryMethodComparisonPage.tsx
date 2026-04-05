import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import ComparisonBarsChart from "../../components/ComparisonBarsChart";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import ToolPinButton from "../../components/ToolPinButton";
import formatPHP from "../../utils/formatPHP";
import { computeInventoryMethodComparison } from "../../utils/calculatorMath";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function InventoryMethodComparisonPage() {
    const [beginningUnits, setBeginningUnits] = useState("");
    const [beginningCost, setBeginningCost] = useState("");
    const [purchase1Units, setPurchase1Units] = useState("");
    const [purchase1Cost, setPurchase1Cost] = useState("");
    const [purchase2Units, setPurchase2Units] = useState("");
    const [purchase2Cost, setPurchase2Cost] = useState("");
    const [unitsSold, setUnitsSold] = useState("");

    useSmartSolverConnector({
        beginningUnits: setBeginningUnits,
        beginningCost: setBeginningCost,
        purchase1Units: setPurchase1Units,
        purchase1Cost: setPurchase1Cost,
        purchase2Units: setPurchase2Units,
        purchase2Cost: setPurchase2Cost,
        unitsSold: setUnitsSold,
    });

    const result = useMemo(() => {
        const rawValues = [
            beginningUnits,
            beginningCost,
            purchase1Units,
            purchase1Cost,
            purchase2Units,
            purchase2Cost,
            unitsSold,
        ];

        if (rawValues.some((value) => value.trim() === "")) return null;

        const parsedValues = rawValues.map(Number);
        if (parsedValues.some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedValues.some((value) => value < 0)) {
            return { error: "Inventory units and unit costs cannot be negative." };
        }

        const [
            parsedBeginningUnits,
            parsedBeginningCost,
            parsedPurchase1Units,
            parsedPurchase1Cost,
            parsedPurchase2Units,
            parsedPurchase2Cost,
            parsedUnitsSold,
        ] = parsedValues;

        const totalUnitsAvailable =
            parsedBeginningUnits + parsedPurchase1Units + parsedPurchase2Units;

        if (totalUnitsAvailable === 0) {
            return { error: "Total units available must be greater than zero." };
        }

        if (parsedUnitsSold > totalUnitsAvailable) {
            return { error: "Units sold cannot exceed total units available." };
        }

        return computeInventoryMethodComparison({
            beginningUnits: parsedBeginningUnits,
            beginningCost: parsedBeginningCost,
            purchase1Units: parsedPurchase1Units,
            purchase1Cost: parsedPurchase1Cost,
            purchase2Units: parsedPurchase2Units,
            purchase2Cost: parsedPurchase2Cost,
            unitsSold: parsedUnitsSold,
        });
    }, [
        beginningCost,
        beginningUnits,
        purchase1Cost,
        purchase1Units,
        purchase2Cost,
        purchase2Units,
        unitsSold,
    ]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Inventory"
            title="Inventory Method Comparison"
            description="Compare FIFO and weighted-average results using one shared inventory data set so the cost-flow difference becomes easier to understand."
            headerActions={
                <ToolPinButton
                    path="/accounting/inventory-method-comparison"
                    label="Inventory Method Comparison"
                />
            }
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-card-title text-base">Inventory layers</p>
                        <p className="app-body-md mt-2 text-sm">
                            Enter the same inventory data once, then review how FIFO and weighted average distribute cost differently.
                        </p>
                        <div className="mt-4 space-y-3">
                            <InputGrid columns={2}>
                                <InputCard label="Beginning Units" value={beginningUnits} onChange={setBeginningUnits} placeholder="100" />
                                <InputCard label="Beginning Unit Cost" value={beginningCost} onChange={setBeginningCost} placeholder="50" />
                            </InputGrid>
                            <InputGrid columns={2}>
                                <InputCard label="Purchase 1 Units" value={purchase1Units} onChange={setPurchase1Units} placeholder="80" />
                                <InputCard label="Purchase 1 Unit Cost" value={purchase1Cost} onChange={setPurchase1Cost} placeholder="55" />
                            </InputGrid>
                            <InputGrid columns={2}>
                                <InputCard label="Purchase 2 Units" value={purchase2Units} onChange={setPurchase2Units} placeholder="120" />
                                <InputCard label="Purchase 2 Unit Cost" value={purchase2Cost} onChange={setPurchase2Cost} placeholder="60" />
                            </InputGrid>
                            <InputGrid columns={1}>
                                <InputCard label="Units Sold" value={unitsSold} onChange={setUnitsSold} placeholder="150" />
                            </InputGrid>
                        </div>
                    </SectionCard>
                </div>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="app-tone-warning">
                        <p className="app-card-title text-sm">Input notice</p>
                        <p className="app-body-md mt-2 text-sm">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <div className="space-y-4">
                        <ResultGrid columns={2}>
                            <ResultCard title="FIFO COGS" value={formatPHP(result.fifo.costOfGoodsSold)} />
                            <ResultCard title="Weighted Average COGS" value={formatPHP(result.weightedAverage.costOfGoodsSold)} />
                            <ResultCard title="FIFO Ending Inventory" value={formatPHP(result.fifo.endingInventory)} />
                            <ResultCard title="Weighted Average Ending Inventory" value={formatPHP(result.weightedAverage.endingInventory)} />
                            <ResultCard
                                title="COGS Difference"
                                value={formatPHP(result.deltas.costOfGoodsSold)}
                                supportingText="FIFO minus weighted average"
                                tone="accent"
                            />
                            <ResultCard
                                title="Ending Inventory Difference"
                                value={formatPHP(result.deltas.endingInventory)}
                                supportingText="FIFO minus weighted average"
                                tone="accent"
                            />
                        </ResultGrid>

                        <ComparisonBarsChart
                            title="Cost-flow comparison"
                            description="Compare how each inventory method shifts value between cost of goods sold and ending inventory."
                            formatter={formatPHP}
                            items={[
                                { label: "FIFO COGS", value: result.fifo.costOfGoodsSold, accent: "primary" },
                                { label: "Weighted Average COGS", value: result.weightedAverage.costOfGoodsSold, accent: "secondary" },
                                { label: "FIFO Ending Inventory", value: result.fifo.endingInventory, accent: "highlight" },
                                { label: "Weighted Average Ending Inventory", value: result.weightedAverage.endingInventory, accent: "primary" },
                            ]}
                        />
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="FIFO uses the earliest cost layers first. Weighted average spreads total available cost across all available units."
                        steps={[
                            `Total units available = ${result.totalUnitsAvailable.toLocaleString()} unit(s).`,
                            `Total cost available = ${formatPHP(result.totalCostAvailable)}.`,
                            `Weighted average unit cost = ${formatPHP(result.weightedAverageUnitCost)}.`,
                            ...result.fifo.issueLines.map(
                                (line) =>
                                    `${line.label}: ${line.units.toLocaleString()} unit(s) x ${formatPHP(line.unitCost)} = ${formatPHP(line.amount)}`
                            ),
                            `FIFO cost of goods sold = ${formatPHP(result.fifo.costOfGoodsSold)}.`,
                            `Weighted average cost of goods sold = ${formatPHP(result.weightedAverage.costOfGoodsSold)}.`,
                            `FIFO ending inventory = ${formatPHP(result.fifo.endingInventory)}.`,
                            `Weighted average ending inventory = ${formatPHP(result.weightedAverage.endingInventory)}.`,
                        ]}
                        notes={[
                            result.costTrendDirection === "rising"
                                ? "The input costs are trending upward. In rising-price conditions, FIFO usually reports lower COGS and higher ending inventory than weighted average."
                                : result.costTrendDirection === "falling"
                                  ? "The input costs are trending downward. In falling-price conditions, FIFO may push more cost into COGS earlier than weighted average."
                                  : "The cost trend is mixed, so the difference between methods depends on how many units were sold from each layer.",
                        ]}
                        interpretation={`This comparison shows how method choice changes both reported cost of goods sold and ending inventory. Use it to understand how the same physical inventory flow can produce different accounting outcomes.`}
                    />
                ) : null
            }
        />
    );
}
