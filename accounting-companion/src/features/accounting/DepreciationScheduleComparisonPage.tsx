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
import TrendLineChart from "../../components/TrendLineChart";
import formatPHP from "../../utils/formatPHP";
import { computeDepreciationComparisonSchedule } from "../../utils/calculatorMath";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function DepreciationScheduleComparisonPage() {
    const [cost, setCost] = useState("");
    const [salvageValue, setSalvageValue] = useState("");
    const [usefulLife, setUsefulLife] = useState("");

    useSmartSolverConnector({
        cost: setCost,
        salvageValue: setSalvageValue,
        usefulLife: setUsefulLife,
    });

    const result = useMemo(() => {
        if ([cost, salvageValue, usefulLife].some((value) => value.trim() === "")) {
            return null;
        }

        const parsedCost = Number(cost);
        const parsedSalvage = Number(salvageValue);
        const parsedLife = Number(usefulLife);

        if ([parsedCost, parsedSalvage, parsedLife].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedCost < 0 || parsedSalvage < 0) {
            return { error: "Cost and salvage value cannot be negative." };
        }

        if (parsedSalvage > parsedCost) {
            return { error: "Salvage value cannot be greater than cost." };
        }

        if (parsedLife <= 0 || !Number.isInteger(parsedLife)) {
            return { error: "Useful life must be a whole number greater than zero." };
        }

        return computeDepreciationComparisonSchedule({
            cost: parsedCost,
            salvageValue: parsedSalvage,
            usefulLifeYears: parsedLife,
        });
    }, [cost, salvageValue, usefulLife]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Depreciation"
            title="Depreciation Schedule Comparison"
            description="Compare straight-line and double-declining depreciation schedules across the full life of an asset so method differences become easier to explain."
            headerActions={
                <ToolPinButton
                    path="/accounting/depreciation-schedule-comparison"
                    label="Depreciation Schedule Comparison"
                />
            }
            inputSection={
                <SectionCard>
                    <p className="app-card-title text-base">Asset assumptions</p>
                    <p className="app-body-md mt-2 text-sm">
                        Use one asset profile and compare how evenly or aggressively each method recognizes depreciation.
                    </p>
                    <div className="mt-4">
                        <InputGrid columns={3}>
                            <InputCard label="Asset Cost" value={cost} onChange={setCost} placeholder="500000" />
                            <InputCard label="Salvage Value" value={salvageValue} onChange={setSalvageValue} placeholder="50000" />
                            <InputCard label="Useful Life (years)" value={usefulLife} onChange={setUsefulLife} placeholder="5" />
                        </InputGrid>
                    </div>
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
                            <ResultCard title="Straight-line Annual Expense" value={formatPHP(result.straightLineAmount)} />
                            <ResultCard title="Double-declining Rate" value={`${(result.ddbRate * 100).toFixed(2)}%`} />
                            <ResultCard title="Total Depreciable Amount" value={formatPHP(result.totalDepreciation)} tone="accent" />
                        </ResultGrid>

                        <div className="grid gap-4 xl:grid-cols-2">
                            <TrendLineChart
                                title="Straight-line book value"
                                description="Book value falls evenly because straight-line expense stays constant each year."
                                formatter={formatPHP}
                                points={result.schedule.map((entry) => ({
                                    label: `Year ${entry.year}`,
                                    value: entry.straightLineBookValue,
                                }))}
                            />
                            <TrendLineChart
                                title="Double-declining book value"
                                description="Book value drops faster in earlier years because double-declining front-loads depreciation."
                                formatter={formatPHP}
                                accent="secondary"
                                points={result.schedule.map((entry) => ({
                                    label: `Year ${entry.year}`,
                                    value: entry.ddbBookValue,
                                }))}
                            />
                        </div>

                        <ComparisonBarsChart
                            title="Annual depreciation emphasis"
                            description="Compare first-year and final-year expense emphasis to see how aggressive the accelerated method is."
                            formatter={formatPHP}
                            items={[
                                {
                                    label: "Straight-line year 1",
                                    value: result.schedule[0]?.straightLineExpense ?? 0,
                                    accent: "primary",
                                },
                                {
                                    label: "Double-declining year 1",
                                    value: result.schedule[0]?.ddbExpense ?? 0,
                                    accent: "secondary",
                                },
                                {
                                    label: "Straight-line final year",
                                    value: result.schedule.at(-1)?.straightLineExpense ?? 0,
                                    accent: "highlight",
                                },
                                {
                                    label: "Double-declining final year",
                                    value: result.schedule.at(-1)?.ddbExpense ?? 0,
                                    accent: "secondary",
                                },
                            ]}
                        />
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <SectionCard>
                        <p className="app-section-kicker text-xs">Schedule</p>
                        <div className="mt-3 overflow-x-auto scrollbar-premium">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-[color:var(--app-text-muted)]">
                                        <th className="px-3 py-2">Year</th>
                                        <th className="px-3 py-2">Straight-line Expense</th>
                                        <th className="px-3 py-2">SL Book Value</th>
                                        <th className="px-3 py-2">DDB Expense</th>
                                        <th className="px-3 py-2">DDB Book Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.schedule.map((entry) => (
                                        <tr key={entry.year} className="border-t app-divider">
                                            <td className="px-3 py-2">{entry.year}</td>
                                            <td className="px-3 py-2">{formatPHP(entry.straightLineExpense)}</td>
                                            <td className="px-3 py-2">{formatPHP(entry.straightLineBookValue)}</td>
                                            <td className="px-3 py-2">{formatPHP(entry.ddbExpense)}</td>
                                            <td className="px-3 py-2">{formatPHP(entry.ddbBookValue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <FormulaCard
                            formula="Straight-line expense = (Cost - Salvage Value) / Useful Life. Double-declining expense = Beginning Book Value × (2 / Useful Life), limited so book value never drops below salvage value."
                            steps={[
                                `Straight-line annual depreciation = ${formatPHP(result.straightLineAmount)}.`,
                                `Double-declining rate = ${(result.ddbRate * 100).toFixed(2)}%.`,
                                "Straight-line keeps the same depreciation expense each year.",
                                "Double-declining records larger expense earlier, then tapers off as book value declines.",
                            ]}
                            interpretation="Use straight-line when you want even expense recognition across the asset’s life. Use double-declining when the asset is expected to deliver more benefit in earlier periods or when accelerated recognition is appropriate."
                        />
                    </SectionCard>
                ) : null
            }
        />
    );
}
