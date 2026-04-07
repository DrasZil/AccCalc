import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import CurvesChart from "../../components/CurvesChart";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeMarketEquilibrium } from "../../utils/calculatorMath";

export default function MarketEquilibriumPage() {
    const [demandIntercept, setDemandIntercept] = useState("");
    const [demandSlope, setDemandSlope] = useState("");
    const [supplyIntercept, setSupplyIntercept] = useState("");
    const [supplySlope, setSupplySlope] = useState("");

    const result = useMemo(() => {
        const values = [demandIntercept, demandSlope, supplyIntercept, supplySlope];
        if (values.some((value) => value.trim() === "")) return null;

        const parsed = values.map((value) => Number(value));
        if (parsed.some((value) => Number.isNaN(value))) {
            return { error: "All equation inputs must be valid numbers." };
        }

        if (parsed[1] <= 0 || parsed[3] <= 0) {
            return { error: "Demand and supply slopes must both be greater than zero." };
        }

        const equilibrium = computeMarketEquilibrium({
            demandIntercept: parsed[0],
            demandSlope: parsed[1],
            supplyIntercept: parsed[2],
            supplySlope: parsed[3],
        });

        if (!equilibrium.isFeasible) {
            return { error: "These equations do not produce a non-negative equilibrium price and quantity." };
        }

        return equilibrium;
    }, [demandIntercept, demandSlope, supplyIntercept, supplySlope]);

    return (
        <CalculatorPageLayout
            badge="Economics / Market"
            title="Supply and Demand Equilibrium"
            description="Solve the equilibrium quantity and price for linear demand and supply equations written as P = a - bQ and P = c + dQ."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Demand Intercept (a)" value={demandIntercept} onChange={setDemandIntercept} placeholder="120" />
                        <InputCard label="Demand Slope (b)" value={demandSlope} onChange={setDemandSlope} placeholder="2" />
                        <InputCard label="Supply Intercept (c)" value={supplyIntercept} onChange={setSupplyIntercept} placeholder="20" />
                        <InputCard label="Supply Slope (d)" value={supplySlope} onChange={setSupplySlope} placeholder="1" />
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
                            <ResultCard title="Equilibrium Price" value={result.equilibriumPrice.toFixed(2)} tone="accent" />
                            <ResultCard title="Equilibrium Quantity" value={result.equilibriumQuantity.toFixed(2)} tone="accent" />
                            <ResultCard title="Demand Zero-Price Quantity" value={result.demandAtZeroPrice.toFixed(2)} />
                            <ResultCard title="Supply Zero-Price Quantity" value={result.supplyAtZeroPrice.toFixed(2)} />
                        </ResultGrid>

                        <CurvesChart
                            title="Supply and demand view"
                            description="The equilibrium point is where the demand and supply curves intersect."
                            xLabel="Quantity"
                            yLabel="Price"
                            series={[
                                {
                                    label: "Demand",
                                    accent: "primary",
                                    points: [
                                        { x: 0, y: Number(demandIntercept) },
                                        { x: result.demandAtZeroPrice, y: 0 },
                                    ],
                                },
                                {
                                    label: "Supply",
                                    accent: "secondary",
                                    points: [
                                        { x: 0, y: Number(supplyIntercept) },
                                        {
                                            x:
                                                result.equilibriumQuantity * 1.5,
                                            y:
                                                Number(supplyIntercept) +
                                                Number(supplySlope) *
                                                    result.equilibriumQuantity *
                                                    1.5,
                                        },
                                    ],
                                },
                            ]}
                            highlightPoint={{
                                label: "Equilibrium",
                                x: result.equilibriumQuantity,
                                y: result.equilibriumPrice,
                            }}
                        />
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Set demand equal to supply: a - bQ = c + dQ, then solve Q = (a - c) / (b + d). Substitute Q back into either equation to get P."
                        steps={[
                            `Q* = (${Number(demandIntercept)} - ${Number(supplyIntercept)}) / (${Number(demandSlope)} + ${Number(supplySlope)}) = ${result.equilibriumQuantity.toFixed(2)}.`,
                            `P* = ${Number(demandIntercept)} - ${Number(demandSlope)} × ${result.equilibriumQuantity.toFixed(2)} = ${result.equilibriumPrice.toFixed(2)}.`,
                        ]}
                        interpretation={`The market clears at price ${result.equilibriumPrice.toFixed(2)} and quantity ${result.equilibriumQuantity.toFixed(2)}. At that point, planned buying and selling match.`}
                        notes={[
                            "This worksheet assumes linear demand and supply equations with quantity on the horizontal axis.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
