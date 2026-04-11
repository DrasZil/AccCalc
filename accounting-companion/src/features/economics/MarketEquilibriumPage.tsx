import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import CurvesChart from "../../components/CurvesChart";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import ChartInsightPanel from "../../components/charts/ChartInsightPanel";
import ChartModeTabs from "../../components/charts/ChartModeTabs";
import CommonMistakesBlock from "../../components/notes/CommonMistakesBlock";
import InterpretationBlock from "../../components/notes/InterpretationBlock";
import PracticalMeaningBlock from "../../components/notes/PracticalMeaningBlock";
import { computeMarketEquilibrium } from "../../utils/calculatorMath";
import { formatAxisLabel } from "../../utils/charts/chartAnnotationUtils";
import { buildChartHighlights } from "../../utils/charts/chartHighlights";

export default function MarketEquilibriumPage() {
    const [demandIntercept, setDemandIntercept] = useState("");
    const [demandSlope, setDemandSlope] = useState("");
    const [supplyIntercept, setSupplyIntercept] = useState("");
    const [supplySlope, setSupplySlope] = useState("");
    const [chartMode, setChartMode] = useState<
        "chart" | "table" | "interpretation" | "comparison"
    >("chart");

    const result = useMemo(() => {
        const values = [demandIntercept, demandSlope, supplyIntercept, supplySlope];
        if (values.some((value) => value.trim() === "")) return null;

        const parsed = values.map((value) => Number(value));
        if (parsed.some((value) => Number.isNaN(value))) {
            return { error: "All equation inputs must be valid numbers." };
        }

        if (parsed[1] <= 0 || parsed[3] <= 0) {
            return {
                error: "Demand and supply slopes must both be greater than zero.",
            };
        }

        const equilibrium = computeMarketEquilibrium({
            demandIntercept: parsed[0],
            demandSlope: parsed[1],
            supplyIntercept: parsed[2],
            supplySlope: parsed[3],
        });

        if (!equilibrium.isFeasible) {
            return {
                error: "These equations do not produce a non-negative equilibrium price and quantity.",
            };
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
                        <InputCard
                            label="Demand Intercept (a)"
                            value={demandIntercept}
                            onChange={setDemandIntercept}
                            placeholder="120"
                        />
                        <InputCard
                            label="Demand Slope (b)"
                            value={demandSlope}
                            onChange={setDemandSlope}
                            placeholder="2"
                        />
                        <InputCard
                            label="Supply Intercept (c)"
                            value={supplyIntercept}
                            onChange={setSupplyIntercept}
                            placeholder="20"
                        />
                        <InputCard
                            label="Supply Slope (d)"
                            value={supplySlope}
                            onChange={setSupplySlope}
                            placeholder="1"
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
                                title="Equilibrium Price"
                                value={result.equilibriumPrice.toFixed(2)}
                                tone="accent"
                            />
                            <ResultCard
                                title="Equilibrium Quantity"
                                value={result.equilibriumQuantity.toFixed(2)}
                                tone="accent"
                            />
                            <ResultCard
                                title="Demand Zero-Price Quantity"
                                value={result.demandAtZeroPrice.toFixed(2)}
                            />
                            <ResultCard
                                title="Supply Zero-Price Quantity"
                                value={result.supplyAtZeroPrice.toFixed(2)}
                            />
                        </ResultGrid>

                        <ChartModeTabs value={chartMode} onChange={setChartMode} />

                        {chartMode === "chart" || chartMode === "comparison" ? (
                            <CurvesChart
                                title="Supply and demand view"
                                description="The equilibrium point is where the demand and supply curves intersect."
                                xLabel={formatAxisLabel("Quantity")}
                                yLabel={formatAxisLabel("Price")}
                                series={[
                                    {
                                        label: "Demand",
                                        accent: "primary",
                                        note: `Demand falls by ${Number(demandSlope).toFixed(2)} price units for each added unit of quantity.`,
                                        points: [
                                            { x: 0, y: Number(demandIntercept) },
                                            { x: result.demandAtZeroPrice, y: 0 },
                                        ],
                                    },
                                    {
                                        label: "Supply",
                                        accent: "secondary",
                                        note: `Supply rises by ${Number(supplySlope).toFixed(2)} price units for each added unit of quantity.`,
                                        points: [
                                            { x: 0, y: Number(supplyIntercept) },
                                            {
                                                x: result.equilibriumQuantity * 1.5,
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
                                    note: `Q = ${result.equilibriumQuantity.toFixed(2)}, P = ${result.equilibriumPrice.toFixed(2)}`,
                                }}
                                formatter={(value) => value.toFixed(2)}
                            />
                        ) : chartMode === "table" ? (
                            <SectionCard>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="app-subtle-surface rounded-[1rem] px-4 py-3">
                                        <p className="app-card-title text-sm">Demand equation</p>
                                        <p className="app-body-md mt-2 text-sm">
                                            P = {Number(demandIntercept).toFixed(2)} −{" "}
                                            {Number(demandSlope).toFixed(2)}Q
                                        </p>
                                    </div>
                                    <div className="app-subtle-surface rounded-[1rem] px-4 py-3">
                                        <p className="app-card-title text-sm">Supply equation</p>
                                        <p className="app-body-md mt-2 text-sm">
                                            P = {Number(supplyIntercept).toFixed(2)} +{" "}
                                            {Number(supplySlope).toFixed(2)}Q
                                        </p>
                                    </div>
                                </div>
                            </SectionCard>
                        ) : (
                            <ChartInsightPanel
                                title="Equilibrium interpretation"
                                meaning={`The market clears at price ${result.equilibriumPrice.toFixed(2)} and quantity ${result.equilibriumQuantity.toFixed(2)} because demand and supply are equal at that point.`}
                                importance="This is the baseline used for later changes in taxes, shortages, surplus, welfare, or elasticity comparisons."
                                highlights={buildChartHighlights([
                                    {
                                        label: "Equilibrium price",
                                        value: result.equilibriumPrice,
                                    },
                                    {
                                        label: "Equilibrium quantity",
                                        value: result.equilibriumQuantity,
                                    },
                                ])}
                            />
                        )}
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <div className="space-y-4">
                        <FormulaCard
                            formula="Set demand equal to supply: a - bQ = c + dQ, then solve Q = (a - c) / (b + d). Substitute Q back into either equation to get P."
                            steps={[
                                `Q* = (${Number(demandIntercept)} - ${Number(supplyIntercept)}) / (${Number(demandSlope)} + ${Number(supplySlope)}) = ${result.equilibriumQuantity.toFixed(2)}.`,
                                `P* = ${Number(demandIntercept)} - ${Number(demandSlope)} * ${result.equilibriumQuantity.toFixed(2)} = ${result.equilibriumPrice.toFixed(2)}.`,
                            ]}
                            interpretation={`The market clears at price ${result.equilibriumPrice.toFixed(2)} and quantity ${result.equilibriumQuantity.toFixed(2)}. At that point, planned buying and selling match.`}
                            notes={[
                                "This worksheet assumes linear demand and supply equations with quantity on the horizontal axis.",
                            ]}
                        />
                        <InterpretationBlock body="If the market price stays above equilibrium, supply tends to exceed demand. If it stays below equilibrium, demand tends to exceed supply." />
                        <CommonMistakesBlock
                            mistakes={[
                                "Do not add slopes with the wrong sign. Demand slope is subtracted in the demand equation.",
                                "Check that the resulting price and quantity are non-negative before treating the equilibrium as feasible.",
                            ]}
                        />
                        <PracticalMeaningBlock body="Equilibrium is the anchor point for policy analysis, break-even-style market reasoning, and later welfare comparisons." />
                    </div>
                ) : null
            }
        />
    );
}
