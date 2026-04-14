import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeEconomicOrderQuantity } from "../../utils/calculatorMath";

export default function EoqReorderPointPage() {
    const [annualDemandUnits, setAnnualDemandUnits] = useState("");
    const [orderingCostPerOrder, setOrderingCostPerOrder] = useState("");
    const [annualCarryingCostPerUnit, setAnnualCarryingCostPerUnit] = useState("");
    const [dailyDemandUnits, setDailyDemandUnits] = useState("");
    const [leadTimeDays, setLeadTimeDays] = useState("");
    const [safetyStockUnits, setSafetyStockUnits] = useState("");

    const result = useMemo(() => {
        const required = [
            annualDemandUnits,
            orderingCostPerOrder,
            annualCarryingCostPerUnit,
            dailyDemandUnits,
            leadTimeDays,
        ];

        if (required.some((value) => value.trim() === "")) return null;

        const values = [
            Number(annualDemandUnits),
            Number(orderingCostPerOrder),
            Number(annualCarryingCostPerUnit),
            Number(dailyDemandUnits),
            Number(leadTimeDays),
        ];
        const safetyStock =
            safetyStockUnits.trim() === "" ? 0 : Number(safetyStockUnits);

        if (values.some((value) => Number.isNaN(value)) || Number.isNaN(safetyStock)) {
            return { error: "All numeric inventory-planning inputs must be valid numbers." };
        }

        return computeEconomicOrderQuantity({
            annualDemandUnits: values[0],
            orderingCostPerOrder: values[1],
            annualCarryingCostPerUnit: values[2],
            dailyDemandUnits: values[3],
            leadTimeDays: values[4],
            safetyStockUnits: safetyStock,
        });
    }, [
        annualCarryingCostPerUnit,
        annualDemandUnits,
        dailyDemandUnits,
        leadTimeDays,
        orderingCostPerOrder,
        safetyStockUnits,
    ]);

    return (
        <CalculatorPageLayout
            badge="Operations & Supply Chain"
            title="EOQ and Reorder Point"
            description="Plan order quantity, order frequency, and reorder point from one inventory-management workspace."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Annual Demand Units"
                            value={annualDemandUnits}
                            onChange={setAnnualDemandUnits}
                            placeholder="24000"
                        />
                        <InputCard
                            label="Ordering Cost per Order"
                            value={orderingCostPerOrder}
                            onChange={setOrderingCostPerOrder}
                            placeholder="1200"
                        />
                        <InputCard
                            label="Annual Carrying Cost per Unit"
                            value={annualCarryingCostPerUnit}
                            onChange={setAnnualCarryingCostPerUnit}
                            placeholder="18"
                        />
                        <InputCard
                            label="Daily Demand Units"
                            value={dailyDemandUnits}
                            onChange={setDailyDemandUnits}
                            placeholder="80"
                        />
                        <InputCard
                            label="Lead Time Days"
                            value={leadTimeDays}
                            onChange={setLeadTimeDays}
                            placeholder="6"
                        />
                        <InputCard
                            label="Safety Stock Units (optional)"
                            value={safetyStockUnits}
                            onChange={setSafetyStockUnits}
                            placeholder="120"
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
                            <ResultCard title="EOQ" value={result.eoq.toFixed(2)} tone="accent" />
                            <ResultCard title="Orders / Year" value={result.ordersPerYear.toFixed(2)} />
                            <ResultCard title="Reorder Point" value={result.reorderPointUnits.toFixed(2)} />
                            <ResultCard
                                title="Average Inventory"
                                value={result.averageInventoryUnits.toFixed(2)}
                            />
                        </ResultGrid>

                        <ResultGrid columns={3}>
                            <ResultCard
                                title="Annual Ordering Cost"
                                value={result.annualOrderingCost.toFixed(2)}
                            />
                            <ResultCard
                                title="Annual Carrying Cost"
                                value={result.annualCarryingCost.toFixed(2)}
                            />
                            <ResultCard
                                title="Relevant Inventory Cost"
                                value={result.relevantInventoryCost.toFixed(2)}
                            />
                        </ResultGrid>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="EOQ = sqrt((2 x annual demand x ordering cost) / annual carrying cost per unit)"
                        steps={[
                            `EOQ = ${result.eoq.toFixed(2)} units.`,
                            `Orders per year = ${result.ordersPerYear.toFixed(2)}.`,
                            `Reorder point = (Daily demand x Lead time) + Safety stock = ${result.reorderPointUnits.toFixed(2)} units.`,
                            `Relevant ordering and carrying cost = ${result.relevantInventoryCost.toFixed(2)}.`,
                        ]}
                        interpretation="Use EOQ to balance ordering and carrying cost, then use the reorder point to decide when to trigger the next replenishment order."
                        warnings={[
                            "EOQ assumes relatively stable demand and lead time. Real operations still need judgment for seasonality, stockout risk, and supply-chain disruptions.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
