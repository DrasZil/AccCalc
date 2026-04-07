import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import ComparisonBarsChart from "../../components/ComparisonBarsChart";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeSurplusAtEquilibrium } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

export default function SurplusAnalysisPage() {
    const [demandIntercept, setDemandIntercept] = useState("");
    const [supplyIntercept, setSupplyIntercept] = useState("");
    const [equilibriumPrice, setEquilibriumPrice] = useState("");
    const [equilibriumQuantity, setEquilibriumQuantity] = useState("");

    const result = useMemo(() => {
        const values = [demandIntercept, supplyIntercept, equilibriumPrice, equilibriumQuantity];
        if (values.some((value) => value.trim() === "")) return null;

        const parsed = values.map((value) => Number(value));
        if (parsed.some((value) => Number.isNaN(value) || value < 0)) {
            return { error: "All values must be valid numbers and cannot be negative." };
        }

        return computeSurplusAtEquilibrium({
            demandIntercept: parsed[0],
            supplyIntercept: parsed[1],
            equilibriumPrice: parsed[2],
            equilibriumQuantity: parsed[3],
        });
    }, [demandIntercept, equilibriumPrice, equilibriumQuantity, supplyIntercept]);

    return (
        <CalculatorPageLayout
            badge="Economics / Welfare"
            title="Consumer and Producer Surplus"
            description="Estimate welfare triangles from an equilibrium price and quantity when demand and supply intercepts are known."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Demand Intercept" value={demandIntercept} onChange={setDemandIntercept} placeholder="120" />
                        <InputCard label="Supply Intercept" value={supplyIntercept} onChange={setSupplyIntercept} placeholder="20" />
                        <InputCard label="Equilibrium Price" value={equilibriumPrice} onChange={setEquilibriumPrice} placeholder="53.33" />
                        <InputCard label="Equilibrium Quantity" value={equilibriumQuantity} onChange={setEquilibriumQuantity} placeholder="33.33" />
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
                        <ResultGrid columns={3}>
                            <ResultCard title="Consumer Surplus" value={formatPHP(result.consumerSurplus)} tone="accent" />
                            <ResultCard title="Producer Surplus" value={formatPHP(result.producerSurplus)} tone="accent" />
                            <ResultCard title="Total Surplus" value={formatPHP(result.totalSurplus)} tone="success" />
                        </ResultGrid>

                        <ComparisonBarsChart
                            title="Welfare composition"
                            description="Use the surplus split to see how total market gains are divided between buyers and sellers."
                            items={[
                                { label: "Consumer Surplus", value: result.consumerSurplus, accent: "primary" },
                                { label: "Producer Surplus", value: result.producerSurplus, accent: "secondary" },
                                { label: "Total Surplus", value: result.totalSurplus, accent: "highlight" },
                            ]}
                            formatter={(value) => formatPHP(value)}
                        />
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Consumer Surplus = 1/2 × (Demand Intercept - Equilibrium Price) × Equilibrium Quantity; Producer Surplus = 1/2 × (Equilibrium Price - Supply Intercept) × Equilibrium Quantity."
                        steps={[
                            `Consumer surplus = 1/2 × (${Number(demandIntercept)} - ${Number(equilibriumPrice)}) × ${Number(equilibriumQuantity)} = ${formatPHP(result.consumerSurplus)}.`,
                            `Producer surplus = 1/2 × (${Number(equilibriumPrice)} - ${Number(supplyIntercept)}) × ${Number(equilibriumQuantity)} = ${formatPHP(result.producerSurplus)}.`,
                        ]}
                        interpretation={`Total gains from trade equal ${formatPHP(result.totalSurplus)} at the stated equilibrium. This is the combined welfare captured by consumers and producers.`}
                        warnings={[
                            "This worksheet assumes linear demand and supply, so surplus areas are treated as triangles.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
