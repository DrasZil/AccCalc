import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import ComparisonBarsChart from "../../components/ComparisonBarsChart";
import CurvesChart from "../../components/CurvesChart";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeCvpAnalysis } from "../../utils/calculatorMath";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

function formatPercent(value: number) {
    return `${(value * 100).toFixed(2)}%`;
}

export default function CvpAnalysisPage() {
    const [fixedCosts, setFixedCosts] = useState("");
    const [sellingPricePerUnit, setSellingPricePerUnit] = useState("");
    const [variableCostPerUnit, setVariableCostPerUnit] = useState("");
    const [targetProfit, setTargetProfit] = useState("");
    const [expectedUnitSales, setExpectedUnitSales] = useState("");

    useSmartSolverConnector({
        fixedCosts: setFixedCosts,
        sellingPricePerUnit: setSellingPricePerUnit,
        variableCostPerUnit: setVariableCostPerUnit,
        targetProfit: setTargetProfit,
        actualUnits: setExpectedUnitSales,
    });

    const result = useMemo(() => {
        if (
            fixedCosts.trim() === "" ||
            sellingPricePerUnit.trim() === "" ||
            variableCostPerUnit.trim() === "" ||
            targetProfit.trim() === "" ||
            expectedUnitSales.trim() === ""
        ) {
            return null;
        }

        const fixed = Number(fixedCosts);
        const selling = Number(sellingPricePerUnit);
        const variable = Number(variableCostPerUnit);
        const target = Number(targetProfit);
        const expectedUnits = Number(expectedUnitSales);

        if ([fixed, selling, variable, target, expectedUnits].some((value) => Number.isNaN(value))) {
            return { error: "All CVP inputs must be valid numbers." };
        }

        if (fixed < 0 || target < 0 || expectedUnits < 0 || selling <= 0 || variable < 0) {
            return {
                error: "Fixed costs, target profit, and expected unit sales cannot be negative. Selling price must be greater than zero, and variable cost cannot be negative.",
            };
        }

        if (selling <= variable) {
            return {
                error: "Selling price per unit must be greater than variable cost per unit so contribution margin stays positive.",
            };
        }

        return computeCvpAnalysis({
            fixedCosts: fixed,
            sellingPricePerUnit: selling,
            variableCostPerUnit: variable,
            targetProfit: target,
            expectedUnitSales: expectedUnits,
        });
    }, [
        expectedUnitSales,
        fixedCosts,
        sellingPricePerUnit,
        targetProfit,
        variableCostPerUnit,
    ]);

    const revenueCostSeries = useMemo(() => {
        if (!result || "error" in result) return [];

        const maxUnits = Math.max(
            1,
            result.breakEvenUnits,
            result.targetUnits,
            Number(expectedUnitSales || 0)
        );
        const chartMaxUnits = Math.max(10, Math.ceil(maxUnits * 1.25));
        const steps = 6;

        const buildPoints = (resolver: (units: number) => number) =>
            Array.from({ length: steps + 1 }, (_, index) => {
                const units = (chartMaxUnits / steps) * index;
                return { x: units, y: resolver(units) };
            });

        return [
            {
                label: "Total revenue",
                accent: "primary" as const,
                points: buildPoints((units) => units * Number(sellingPricePerUnit || 0)),
            },
            {
                label: "Total cost",
                accent: "secondary" as const,
                points: buildPoints(
                    (units) =>
                        Number(fixedCosts || 0) + units * Number(variableCostPerUnit || 0)
                ),
            },
        ];
    }, [expectedUnitSales, fixedCosts, result, sellingPricePerUnit, variableCostPerUnit]);

    return (
        <CalculatorPageLayout
            badge="Managerial & Cost"
            title="CVP Analysis"
            description="Study contribution margin, break-even, target profit, margin of safety, operating leverage, and basic sensitivity from one cleaner decision-support page."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard
                            label="Fixed Costs"
                            value={fixedCosts}
                            onChange={setFixedCosts}
                            placeholder="150000"
                            helperText="Use the total fixed costs for the relevant period."
                        />
                        <InputCard
                            label="Selling Price per Unit"
                            value={sellingPricePerUnit}
                            onChange={setSellingPricePerUnit}
                            placeholder="120"
                        />
                        <InputCard
                            label="Variable Cost per Unit"
                            value={variableCostPerUnit}
                            onChange={setVariableCostPerUnit}
                            placeholder="70"
                        />
                        <InputCard
                            label="Target Profit"
                            value={targetProfit}
                            onChange={setTargetProfit}
                            placeholder="60000"
                            helperText="Set zero if you only want break-even analysis."
                        />
                        <InputCard
                            label="Expected Unit Sales"
                            value={expectedUnitSales}
                            onChange={setExpectedUnitSales}
                            placeholder="3200"
                            helperText="Used for margin of safety and operating leverage interpretation."
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
                                title="Contribution Margin / Unit"
                                value={formatPHP(result.contributionMarginPerUnit)}
                            />
                            <ResultCard
                                title="Contribution Margin Ratio"
                                value={formatPercent(result.contributionMarginRatio)}
                            />
                            <ResultCard
                                title="Break-even Units"
                                value={result.breakEvenUnits.toFixed(2)}
                            />
                            <ResultCard
                                title="Target Units"
                                value={result.targetUnits.toFixed(2)}
                            />
                            <ResultCard
                                title="Margin of Safety"
                                value={formatPHP(result.marginOfSafetyAmount)}
                                supportingText={formatPercent(result.marginOfSafetyRatio)}
                            />
                            <ResultCard
                                title="Operating Leverage"
                                value={
                                    Number.isFinite(result.degreeOfOperatingLeverage)
                                        ? result.degreeOfOperatingLeverage.toFixed(2)
                                        : "High risk"
                                }
                                supportingText={formatPHP(result.operatingIncome)}
                            />
                        </ResultGrid>

                        <ComparisonBarsChart
                            title="Sales checkpoints"
                            description="Compare the current volume against the break-even and target-profit requirements."
                            items={[
                                {
                                    label: "Break-even sales",
                                    value: result.breakEvenSales,
                                    accent: "secondary",
                                },
                                {
                                    label: "Target-profit sales",
                                    value: result.targetSales,
                                    accent: "highlight",
                                },
                                {
                                    label: "Expected sales",
                                    value: result.expectedSales,
                                    accent: "primary",
                                },
                            ]}
                            formatter={formatPHP}
                        />

                        <CurvesChart
                            title="Revenue versus cost"
                            description="The break-even point is where the revenue line and total-cost line intersect. Above that point, contribution margin starts covering profit instead of just fixed costs."
                            series={revenueCostSeries}
                            highlightPoint={{
                                label: "Break-even",
                                x: result.breakEvenUnits,
                                y: result.breakEvenSales,
                            }}
                            xLabel="Units sold"
                            yLabel="PHP"
                        />

                        <SectionCard>
                            <p className="app-card-title text-sm">Sensitivity snapshot</p>
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                                {result.scenarios.map((scenario) => (
                                    <div
                                        key={scenario.label}
                                        className="app-subtle-surface rounded-[1rem] px-4 py-3"
                                    >
                                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                            {scenario.label}
                                        </p>
                                        <p className="app-helper mt-1 text-xs">
                                            Break-even units: {scenario.breakEvenUnits.toFixed(2)}
                                        </p>
                                        <p className="app-helper mt-1 text-xs">
                                            Operating income: {formatPHP(scenario.operatingIncome)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Core CVP logic: contribution margin = selling price per unit - variable cost per unit; break-even units = fixed costs / contribution margin per unit; target units = (fixed costs + target profit) / contribution margin per unit."
                        steps={[
                            `Contribution margin per unit = ${formatPHP(Number(sellingPricePerUnit || 0))} - ${formatPHP(Number(variableCostPerUnit || 0))} = ${formatPHP(result.contributionMarginPerUnit)}.`,
                            `Break-even units = ${formatPHP(Number(fixedCosts || 0))} / ${formatPHP(result.contributionMarginPerUnit)} = ${result.breakEvenUnits.toFixed(2)} units.`,
                            `Target units = (${formatPHP(Number(fixedCosts || 0))} + ${formatPHP(Number(targetProfit || 0))}) / ${formatPHP(result.contributionMarginPerUnit)} = ${result.targetUnits.toFixed(2)} units.`,
                            `Expected sales = ${Number(expectedUnitSales || 0).toFixed(2)} × ${formatPHP(Number(sellingPricePerUnit || 0))} = ${formatPHP(result.expectedSales)}.`,
                            `Margin of safety = ${formatPHP(result.expectedSales)} - ${formatPHP(result.breakEvenSales)} = ${formatPHP(result.marginOfSafetyAmount)}.`,
                            Number.isFinite(result.degreeOfOperatingLeverage)
                                ? `Degree of operating leverage = ${formatPHP(result.expectedContributionMargin)} / ${formatPHP(result.operatingIncome)} = ${result.degreeOfOperatingLeverage.toFixed(2)}.`
                                : "Operating leverage is extremely high because expected operating income is at or below zero, so a small sales decline can erase profit quickly.",
                        ]}
                        glossary={[
                            {
                                term: "Contribution margin",
                                meaning:
                                    "The amount left from each unit sale after covering variable cost. This is the amount available for fixed costs first, then profit.",
                            },
                            {
                                term: "Margin of safety",
                                meaning:
                                    "The excess of expected or actual sales over break-even sales. It tells you how much sales can fall before the business reaches zero operating income.",
                            },
                            {
                                term: "Operating leverage",
                                meaning:
                                    "A sensitivity measure showing how strongly operating income reacts to a percentage change in sales at the current activity level.",
                            },
                        ]}
                        interpretation={`At the current assumptions, the product contributes ${formatPHP(result.contributionMarginPerUnit)} per unit or ${formatPercent(result.contributionMarginRatio)} of each sales peso. The business breaks even at ${result.breakEvenUnits.toFixed(2)} units, needs ${result.targetUnits.toFixed(2)} units to hit the target profit, and currently has a margin of safety of ${formatPHP(result.marginOfSafetyAmount)}. This means the result is not just a number to copy; it shows how much room the business has before profit disappears and which driver changes the answer fastest.`}
                        assumptions={[
                            "CVP analysis assumes selling price, variable cost per unit, and total fixed cost stay stable within the relevant range.",
                            "This page uses a single-product CVP structure for the main model. If the problem includes multiple products or a changing mix, use the Sales Mix Break-even tool or compare scenarios carefully.",
                        ]}
                        notes={[
                            "The sensitivity cards are not new formulas. They are quick what-if checks to show which assumption moves break-even and operating income the most.",
                            "Students should still explain whether the target units answer is practical. A decimal answer is mathematically valid, but planning usually requires whole units.",
                        ]}
                        warnings={[
                            "High operating leverage is powerful when sales rise, but it also means profit can collapse quickly when sales fall. Do not treat a high DOL as automatically good.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
