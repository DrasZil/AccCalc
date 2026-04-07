import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeCashRunway } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

export default function CashRunwayPlannerPage() {
    const [openingCash, setOpeningCash] = useState("");
    const [averageMonthlyInflows, setAverageMonthlyInflows] = useState("");
    const [averageMonthlyOutflows, setAverageMonthlyOutflows] = useState("");
    const [plannedGrowthPercent, setPlannedGrowthPercent] = useState("0");

    const result = useMemo(() => {
        const values = [openingCash, averageMonthlyInflows, averageMonthlyOutflows, plannedGrowthPercent];
        if (values.some((value) => value.trim() === "")) return null;

        const parsed = values.map((value) => Number(value));
        if (parsed.some((value) => Number.isNaN(value) || value < 0)) {
            return { error: "All runway inputs must be valid non-negative numbers." };
        }

        return computeCashRunway({
            openingCash: parsed[0],
            averageMonthlyInflows: parsed[1],
            averageMonthlyOutflows: parsed[2],
            plannedGrowthPercent: parsed[3],
        });
    }, [averageMonthlyInflows, averageMonthlyOutflows, openingCash, plannedGrowthPercent]);

    return (
        <CalculatorPageLayout
            badge="Entrepreneurship / Cash"
            title="Cash Runway Planner"
            description="Estimate how long current cash can support operations based on recurring inflows, outflows, and a growth assumption."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Opening Cash" value={openingCash} onChange={setOpeningCash} placeholder="300000" />
                        <InputCard label="Average Monthly Inflows" value={averageMonthlyInflows} onChange={setAverageMonthlyInflows} placeholder="90000" />
                        <InputCard label="Average Monthly Outflows" value={averageMonthlyOutflows} onChange={setAverageMonthlyOutflows} placeholder="120000" />
                        <InputCard label="Planned Inflow Growth (%)" value={plannedGrowthPercent} onChange={setPlannedGrowthPercent} placeholder="5" />
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
                    <ResultGrid columns={4}>
                        <ResultCard title="Adjusted Inflows" value={formatPHP(result.adjustedInflows)} />
                        <ResultCard title="Monthly Net Cash Flow" value={formatPHP(result.monthlyNetCashFlow)} />
                        <ResultCard title="Runway" value={Number.isFinite(result.runwayMonths) ? `${result.runwayMonths.toFixed(2)} months` : "No cash burn"} tone="accent" />
                        <ResultCard title="Status" value={result.status} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Runway months = opening cash / monthly burn, where monthly burn = outflows - adjusted inflows."
                        steps={[
                            `Adjusted inflows = ${formatPHP(Number(averageMonthlyInflows))} with ${Number(plannedGrowthPercent).toFixed(2)}% growth = ${formatPHP(result.adjustedInflows)}.`,
                            `Monthly burn = ${formatPHP(Number(averageMonthlyOutflows))} - ${formatPHP(result.adjustedInflows)} = ${formatPHP(result.monthlyBurn)}.`,
                            Number.isFinite(result.runwayMonths)
                                ? `Runway = ${formatPHP(Number(openingCash))} / ${formatPHP(result.monthlyBurn)} = ${result.runwayMonths.toFixed(2)} months.`
                                : "There is no cash burn because adjusted inflows cover or exceed outflows.",
                        ]}
                        interpretation={`The current plan is assessed as "${result.status.toLowerCase()}". This is a simple planning view for cash pressure, not a full cash-budget schedule.`}
                        warnings={[
                            "If cash burn changes sharply across months, use a full cash budget instead of a single average runway assumption.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
