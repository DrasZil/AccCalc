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
import StudySupportPanel from "../../components/StudySupportPanel";
import { buildStudyQuizPath, buildStudyTopicPath } from "../study/studyContent";
import { getCurrencySymbol } from "../../utils/currency";
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
            desktopLayout="result-focus"
            pageWidth="wide"
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
                                title="Required Units"
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
                                    emphasisLabel: `${result.breakEvenUnits.toFixed(2)} units`,
                                    note: "This is the sales level where operating income is exactly zero.",
                                },
                                {
                                    label: "Required sales for target profit",
                                    value: result.targetSales,
                                    accent: "highlight",
                                    emphasisLabel: `${result.targetUnits.toFixed(2)} units`,
                                    note: "This checkpoint includes both fixed-cost recovery and the target profit requirement.",
                                },
                                {
                                    label: "Expected sales",
                                    value: result.expectedSales,
                                    accent: "primary",
                                    emphasisLabel: `${Number(expectedUnitSales || 0).toFixed(2)} planned units`,
                                    note:
                                        result.expectedSales >= result.breakEvenSales
                                            ? "Current plan is above break-even."
                                            : "Current plan is still below break-even.",
                                },
                            ]}
                            formatter={formatPHP}
                            caption="Use the distance between expected sales and break-even sales as a quick visual read on margin of safety."
                        />

                        <CurvesChart
                            title="Revenue versus cost"
                            description="The break-even point is where the revenue line and total-cost line intersect. Above that point, contribution margin starts covering profit instead of just fixed costs."
                            series={[
                                {
                                    ...revenueCostSeries[0],
                                    note: `Revenue rises by ${formatPHP(Number(sellingPricePerUnit || 0))} for each extra unit sold.`,
                                },
                                {
                                    ...revenueCostSeries[1],
                                    note: `Total cost starts at fixed costs of ${formatPHP(Number(fixedCosts || 0))} and then rises with variable cost.`,
                                },
                            ]}
                            highlightPoint={{
                                label: "Break-even",
                                x: result.breakEvenUnits,
                                y: result.breakEvenSales,
                                note: `${result.breakEvenUnits.toFixed(2)} units | ${formatPHP(result.breakEvenSales)}`,
                            }}
                            referenceLines={[
                                {
                                    label: "Fixed-cost floor",
                                    y: Number(fixedCosts || 0),
                                    accent: "highlight",
                                },
                            ]}
                            xLabel="Units sold"
                            yLabel={`${getCurrencySymbol()} value`}
                            formatter={(value) => formatPHP(value)}
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
                    <div className="space-y-4">
                        <StudySupportPanel
                            topicId="cvp-core"
                            topicTitle="CVP Analysis"
                            lessonPath={buildStudyTopicPath("cvp-core")}
                            quizPath={buildStudyQuizPath("cvp-core")}
                            intro="Use this study layer to connect the calculator with the classroom procedure. It keeps the purpose, procedure, worked example, mistakes, and quick review prompts attached to the same topic."
                            sections={[
                                {
                                    key: "purpose",
                                    label: "What this tool is for",
                                    summary: "Use one CVP page to connect cost behavior, sales volume, and profit planning.",
                                    content: (
                                        <p>
                                            CVP analysis helps answer break-even, target-profit, margin-of-safety, and operating-leverage questions from one structured setup. It is most useful when the topic is single-product planning or when a course problem gives fixed costs, variable cost per unit, and selling price per unit.
                                        </p>
                                    ),
                                },
                                {
                                    key: "when-to-use",
                                    label: "When to use it",
                                    summary: "Best for short-run managerial decisions with stable assumptions.",
                                    content: (
                                        <p>
                                            Use this page when the problem asks how many units must be sold, how much sales revenue is required, or how sensitive current profit is to sales changes. If the problem depends on multiple products or sales mix, move to the sales-mix tool instead of forcing a single-product answer.
                                        </p>
                                    ),
                                },
                                {
                                    key: "worked-example",
                                    label: "Worked example",
                                    summary: "A live example built from the values already entered here.",
                                    content: (
                                        <p>
                                            The current inputs imply a contribution margin of {formatPHP(result.contributionMarginPerUnit)} per unit. That means fixed costs of {formatPHP(Number(fixedCosts || 0))} are covered after {result.breakEvenUnits.toFixed(2)} units, and reaching the target profit requires {result.targetUnits.toFixed(2)} units. This is the bridge between raw input values and the planning decision.
                                        </p>
                                    ),
                                },
                                {
                                    key: "common-mistakes",
                                    label: "Common mistakes",
                                    summary: "Most classroom CVP mistakes are input-logic mistakes, not arithmetic mistakes.",
                                    emphasis: "support",
                                    tone: "warning",
                                    content: (
                                        <ul className="list-disc space-y-2 pl-5">
                                            <li>Mixing variable cost per unit with total variable cost.</li>
                                            <li>Treating break-even as a profit target instead of zero operating income.</li>
                                            <li>Ignoring whether the final answer needs whole-unit interpretation for planning.</li>
                                            <li>Using operating leverage without checking whether operating income is near zero.</li>
                                        </ul>
                                    ),
                                },
                                {
                                    key: "self-check",
                                    label: "Self-check",
                                    summary: "Quick prompts for study review or recitation practice.",
                                    emphasis: "support",
                                    tone: "info",
                                    content: (
                                        <ul className="list-disc space-y-2 pl-5">
                                            <li>Why does contribution margin come before every other CVP measure?</li>
                                            <li>How would a lower selling price affect break-even and margin of safety?</li>
                                            <li>When is a sales-mix model more correct than this page?</li>
                                        </ul>
                                    ),
                                },
                            ]}
                            relatedTools={[
                                { path: "/business/sales-mix-break-even", label: "Sales Mix Break-even" },
                                { path: "/business/target-profit", label: "Target Profit" },
                                { path: "/business/operating-leverage", label: "Operating Leverage" },
                            ]}
                        />
                        <FormulaCard
                            formula="Core CVP logic: contribution margin per unit = selling price per unit - variable cost per unit; break-even units = fixed costs / contribution margin per unit; required units for target profit = (fixed costs + target profit) / contribution margin per unit."
                            steps={[
                                `Contribution margin per unit = ${formatPHP(Number(sellingPricePerUnit || 0))} - ${formatPHP(Number(variableCostPerUnit || 0))} = ${formatPHP(result.contributionMarginPerUnit)}.`,
                                `Break-even units = ${formatPHP(Number(fixedCosts || 0))} / ${formatPHP(result.contributionMarginPerUnit)} = ${result.breakEvenUnits.toFixed(2)} units.`,
                                `Required units for target profit = (${formatPHP(Number(fixedCosts || 0))} + ${formatPHP(Number(targetProfit || 0))}) / ${formatPHP(result.contributionMarginPerUnit)} = ${result.targetUnits.toFixed(2)} units.`,
                                `Expected sales = ${Number(expectedUnitSales || 0).toFixed(2)} x ${formatPHP(Number(sellingPricePerUnit || 0))} = ${formatPHP(result.expectedSales)}.`,
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
                    </div>
                ) : null
            }
        />
    );
}
