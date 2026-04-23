import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computePricingPlanner } from "../../utils/calculatorMath";

function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

export default function CostPlusPricingPage() {
    const [unitCost, setUnitCost] = useState("");
    const [targetMarginPercent, setTargetMarginPercent] = useState("");
    const [targetMonthlyIncome, setTargetMonthlyIncome] = useState("");
    const [contributionPerUnit, setContributionPerUnit] = useState("");

    const result = useMemo(() => {
        const values = [unitCost, targetMarginPercent, targetMonthlyIncome, contributionPerUnit];
        if (values.some((value) => value.trim() === "")) return null;

        const numeric = values.map((value) => Number(value));
        if (numeric.some((value) => Number.isNaN(value))) {
            return { error: "All pricing inputs must be valid numbers." };
        }
        if (numeric[0] < 0 || numeric[1] < 0 || numeric[1] >= 100 || numeric[2] < 0 || numeric[3] <= 0) {
            return {
                error: "Use a non-negative unit cost and target income, a target margin below 100%, and a positive contribution per unit.",
            };
        }

        return computePricingPlanner({
            unitCost: numeric[0],
            targetMarginPercent: numeric[1],
            targetMonthlyIncome: numeric[2],
            contributionPerUnit: numeric[3],
        });
    }, [contributionPerUnit, targetMarginPercent, targetMonthlyIncome, unitCost]);

    return (
        <CalculatorPageLayout
            badge="Operations & Supply Chain"
            title="Cost-Plus Pricing Planner"
            description="Bridge costing and pricing by estimating a suggested selling price from target margin, then reading the markup and unit volume needed for a target monthly income."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Unit Cost"
                            value={unitCost}
                            onChange={setUnitCost}
                            placeholder="720"
                            helperText="Use the cost base the case wants priced, such as full cost or variable-plus-allocated cost."
                        />
                        <InputCard
                            label="Target Margin (%)"
                            value={targetMarginPercent}
                            onChange={setTargetMarginPercent}
                            placeholder="28"
                            helperText="This is margin on selling price, not markup on cost."
                        />
                        <InputCard
                            label="Target Monthly Income"
                            value={targetMonthlyIncome}
                            onChange={setTargetMonthlyIncome}
                            placeholder="180000"
                        />
                        <InputCard
                            label="Contribution per Unit"
                            value={contributionPerUnit}
                            onChange={setContributionPerUnit}
                            placeholder="55"
                            helperText="Use the contribution expected from each unit sold when converting the profit target into units needed."
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
                        <ResultGrid columns={3}>
                            <ResultCard
                                title="Suggested Selling Price"
                                value={formatPHP(result.suggestedSellingPrice)}
                                tone="accent"
                            />
                            <ResultCard
                                title="Markup on Cost"
                                value={formatPercent(result.markUpPercent)}
                            />
                            <ResultCard
                                title="Units Needed for Target Income"
                                value={result.unitsNeededForTargetIncome.toFixed(2)}
                            />
                        </ResultGrid>

                        <SectionCard>
                            <p className="app-card-title text-sm">Pricing read</p>
                            <p className="app-body-md mt-2 text-sm">
                                This planner keeps cost-based pricing and volume planning connected.
                                Use the suggested price as a starting point, then compare it with market,
                                customer, and competitor constraints before treating it as a final quotation.
                            </p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Suggested selling price = unit cost / (1 - target margin); Units needed = target income / contribution per unit"
                        steps={[
                            `Suggested selling price = ${formatPHP(Number(unitCost))} / (1 - ${Number(targetMarginPercent).toFixed(2)}%) = ${formatPHP(result.suggestedSellingPrice)}.`,
                            `Markup on cost = (${formatPHP(result.suggestedSellingPrice)} - ${formatPHP(Number(unitCost))}) / ${formatPHP(Number(unitCost))} = ${formatPercent(result.markUpPercent)}.`,
                            `Units needed = ${formatPHP(Number(targetMonthlyIncome))} / ${Number(contributionPerUnit).toFixed(2)} = ${result.unitsNeededForTargetIncome.toFixed(2)} units.`,
                        ]}
                        interpretation="This route is useful for costing-and-pricing classes because it keeps margin language, markup language, and profit-volume planning visible in one place."
                        warnings={[
                            "Target margin and markup are different measures, so do not report one as though it were the other.",
                            "A mathematically valid price can still be unrealistic if market demand, competitor pricing, or channel terms are ignored.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
