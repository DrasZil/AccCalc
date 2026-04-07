import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import ComparisonBarsChart from "../../components/ComparisonBarsChart";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeUnitEconomics } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

export default function UnitEconomicsPage() {
    const [sellingPrice, setSellingPrice] = useState("");
    const [variableCostPerUnit, setVariableCostPerUnit] = useState("");
    const [fixedCosts, setFixedCosts] = useState("");
    const [acquisitionCostPerCustomer, setAcquisitionCostPerCustomer] = useState("");
    const [unitsPerCustomer, setUnitsPerCustomer] = useState("1");

    const result = useMemo(() => {
        const values = [sellingPrice, variableCostPerUnit, fixedCosts, acquisitionCostPerCustomer, unitsPerCustomer];
        if (values.some((value) => value.trim() === "")) return null;

        const parsed = values.map((value) => Number(value));
        if (parsed.some((value) => Number.isNaN(value) || value < 0)) {
            return { error: "All unit-economics values must be valid non-negative numbers." };
        }

        if (parsed[4] <= 0) {
            return { error: "Units per customer must be greater than zero." };
        }

        return computeUnitEconomics({
            sellingPrice: parsed[0],
            variableCostPerUnit: parsed[1],
            fixedCosts: parsed[2],
            acquisitionCostPerCustomer: parsed[3],
            unitsPerCustomer: parsed[4],
        });
    }, [acquisitionCostPerCustomer, fixedCosts, sellingPrice, unitsPerCustomer, variableCostPerUnit]);

    return (
        <CalculatorPageLayout
            badge="Entrepreneurship / Unit Economics"
            title="Unit Economics Workspace"
            description="Read margin quality, customer contribution, and scale requirements from one startup-friendly worksheet."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Selling Price / Unit" value={sellingPrice} onChange={setSellingPrice} placeholder="900" />
                        <InputCard label="Variable Cost / Unit" value={variableCostPerUnit} onChange={setVariableCostPerUnit} placeholder="520" />
                        <InputCard label="Fixed Costs" value={fixedCosts} onChange={setFixedCosts} placeholder="150000" />
                        <InputCard label="Acquisition Cost / Customer" value={acquisitionCostPerCustomer} onChange={setAcquisitionCostPerCustomer} placeholder="250" />
                        <InputCard label="Units / Customer" value={unitsPerCustomer} onChange={setUnitsPerCustomer} placeholder="2" />
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
                            <ResultCard title="Contribution / Unit" value={formatPHP(result.contributionPerUnit)} tone="accent" />
                            <ResultCard title="Gross Margin" value={`${result.grossMarginPercent.toFixed(2)}%`} />
                            <ResultCard title="Break-even Units" value={Number.isFinite(result.breakEvenUnits) ? result.breakEvenUnits.toFixed(2) : "No break-even"} />
                            <ResultCard title="Break-even Customers" value={Number.isFinite(result.breakEvenCustomers) ? result.breakEvenCustomers.toFixed(2) : "No break-even"} />
                        </ResultGrid>

                        <ComparisonBarsChart
                            title="Per-customer contribution"
                            description="This view helps show how much contribution remains after customer acquisition costs are absorbed."
                            items={[
                                { label: "Contribution / Customer", value: result.contributionPerCustomer, accent: "primary" },
                                { label: "After Acquisition", value: result.contributionAfterAcquisition, accent: "secondary" },
                            ]}
                            formatter={(value) => formatPHP(value)}
                        />
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Contribution per unit = selling price - variable cost per unit. Break-even units = fixed costs / contribution per unit."
                        steps={[
                            `Contribution per unit = ${formatPHP(Number(sellingPrice))} - ${formatPHP(Number(variableCostPerUnit))} = ${formatPHP(result.contributionPerUnit)}.`,
                            `Gross margin = ${formatPHP(result.contributionPerUnit)} / ${formatPHP(Number(sellingPrice))} = ${result.grossMarginPercent.toFixed(2)}%.`,
                            Number.isFinite(result.breakEvenUnits)
                                ? `Break-even units = ${formatPHP(Number(fixedCosts))} / ${formatPHP(result.contributionPerUnit)} = ${result.breakEvenUnits.toFixed(2)} units.`
                                : "There is no break-even because contribution per unit is zero or negative.",
                        ]}
                        interpretation={`This business keeps ${formatPHP(result.contributionPerUnit)} per unit before fixed costs. After acquisition cost, each customer contributes ${formatPHP(result.contributionAfterAcquisition)} toward fixed costs and profit.`}
                        warnings={[
                            "If contribution after acquisition is negative, growth alone does not improve sustainability without changing price, cost, or acquisition efficiency.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
