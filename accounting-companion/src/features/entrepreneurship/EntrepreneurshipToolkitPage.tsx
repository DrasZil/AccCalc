import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import ComparisonBarsChart from "../../components/ComparisonBarsChart";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import {
    computeCustomerPayback,
    computeOwnerSplit,
    computePricingPlanner,
} from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

type ToolkitMode = "pricing" | "owner-split" | "payback";

export default function EntrepreneurshipToolkitPage() {
    const [mode, setMode] = useState<ToolkitMode>("pricing");
    const [first, setFirst] = useState("");
    const [second, setSecond] = useState("");
    const [third, setThird] = useState("");
    const [fourth, setFourth] = useState("");

    const result = useMemo(() => {
        if (first.trim() === "" || second.trim() === "") return null;
        const firstValue = Number(first);
        const secondValue = Number(second);
        const thirdValue = third.trim() === "" ? 0 : Number(third);
        const fourthValue = fourth.trim() === "" ? 0 : Number(fourth);
        if ([firstValue, secondValue, thirdValue, fourthValue].some((value) => Number.isNaN(value))) {
            return { error: "All filled values must be valid numbers." };
        }

        if (mode === "pricing") {
            return computePricingPlanner({
                unitCost: firstValue,
                targetMarginPercent: secondValue,
                targetMonthlyIncome: thirdValue,
                contributionPerUnit: fourthValue,
            });
        }

        if (mode === "owner-split") {
            return computeOwnerSplit({
                distributableProfit: firstValue,
                ratioA: secondValue,
                ratioB: thirdValue,
                ratioC: fourthValue,
            });
        }

        return computeCustomerPayback({
            acquisitionCost: firstValue,
            monthlyContributionPerCustomer: secondValue,
        });
    }, [first, fourth, mode, second, third]);

    const labels =
        mode === "pricing"
            ? ["Unit Cost", "Target Margin (%)", "Target Monthly Income", "Contribution / Unit"]
            : mode === "owner-split"
              ? ["Distributable Profit", "Owner A Ratio", "Owner B Ratio", "Owner C Ratio"]
              : ["Acquisition Cost / Customer", "Monthly Contribution / Customer", "", ""];
    const pricingResult =
        result && !("error" in result) && "suggestedSellingPrice" in result ? result : null;
    const ownerSplitResult =
        result && !("error" in result) && "shareA" in result ? result : null;
    const paybackResult =
        result && !("error" in result) && "paybackMonths" in result ? result : null;

    return (
        <CalculatorPageLayout
            badge="Entrepreneurship"
            title="Entrepreneurship Toolkit"
            description="Use one workspace for pricing targets, owner profit splits, and customer payback checks."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { key: "pricing", label: "Pricing target" },
                                { key: "owner-split", label: "Owner split" },
                                { key: "payback", label: "Customer payback" },
                            ].map((item) => (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => setMode(item.key as ToolkitMode)}
                                    className={[
                                        "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                                        mode === item.key ? "app-button-primary" : "app-button-ghost",
                                    ].join(" ")}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <InputGrid columns={2}>
                            <InputCard label={labels[0]} value={first} onChange={setFirst} placeholder="500" />
                            <InputCard label={labels[1]} value={second} onChange={setSecond} placeholder="30" />
                            {labels[2] ? (
                                <InputCard label={labels[2]} value={third} onChange={setThird} placeholder="40000" />
                            ) : null}
                            {labels[3] ? (
                                <InputCard label={labels[3]} value={fourth} onChange={setFourth} placeholder="120" />
                            ) : null}
                        </InputGrid>
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
                    pricingResult ? (
                        <div className="space-y-4">
                            <ResultGrid columns={3}>
                                <ResultCard title="Suggested Selling Price" value={formatPHP(pricingResult.suggestedSellingPrice)} tone="accent" />
                                <ResultCard title="Markup %" value={`${pricingResult.markUpPercent.toFixed(2)}%`} />
                                <ResultCard title="Units Needed" value={Number.isFinite(pricingResult.unitsNeededForTargetIncome) ? pricingResult.unitsNeededForTargetIncome.toFixed(1) : "Add contribution"} />
                            </ResultGrid>
                            <ComparisonBarsChart
                                title="Pricing view"
                                description="See how the selling price lifts above unit cost to support the target margin."
                                items={[
                                    { label: "Unit cost", value: Number(first), accent: "secondary" },
                                    { label: "Selling price", value: pricingResult.suggestedSellingPrice, accent: "primary" },
                                ]}
                                formatter={(value) => formatPHP(value)}
                            />
                        </div>
                    ) : ownerSplitResult ? (
                        <ResultGrid columns={3}>
                            <ResultCard title="Owner A" value={formatPHP(ownerSplitResult.shareA)} tone="accent" />
                            <ResultCard title="Owner B" value={formatPHP(ownerSplitResult.shareB)} />
                            <ResultCard title="Owner C" value={formatPHP(ownerSplitResult.shareC)} />
                        </ResultGrid>
                    ) : paybackResult ? (
                        <ResultGrid columns={2}>
                            <ResultCard title="Payback Months" value={Number.isFinite(paybackResult.paybackMonths) ? paybackResult.paybackMonths.toFixed(2) : "No payback"} tone="accent" />
                            <ResultCard title="Status" value={paybackResult.status} />
                        </ResultGrid>
                    ) : null
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Toolkit outputs depend on the active planning mode: target margin pricing, owner-ratio allocation, or customer payback."
                        steps={[
                            mode === "pricing"
                                ? "Pricing mode combines unit cost and target margin to suggest a selling price."
                                : mode === "owner-split"
                                  ? "Owner split mode allocates distributable profit using the stated sharing ratios."
                                  : "Customer payback mode compares acquisition cost with monthly contribution per customer.",
                            mode === "pricing"
                                ? `Suggested selling price = ${pricingResult ? formatPHP(pricingResult.suggestedSellingPrice) : "n/a"}.`
                                : mode === "owner-split"
                                  ? `Primary owner share = ${ownerSplitResult ? formatPHP(ownerSplitResult.shareA) : "n/a"}.`
                                  : `Estimated payback = ${paybackResult ? paybackResult.paybackMonths.toFixed(2) : "n/a"} months.`,
                        ]}
                        interpretation="This toolkit groups common small-business planning questions into one page so you can move from pricing to ownership or payback checks without leaving the entrepreneurship category."
                    />
                ) : null
            }
        />
    );
}
