import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import TrendLineChart from "../../components/TrendLineChart";
import { computeSalesForecast } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

export default function SalesForecastPlannerPage() {
    const [startingSales, setStartingSales] = useState("");
    const [monthlyGrowthPercent, setMonthlyGrowthPercent] = useState("");
    const [months, setMonths] = useState("6");
    const [grossMarginPercent, setGrossMarginPercent] = useState("35");

    const result = useMemo(() => {
        const values = [startingSales, monthlyGrowthPercent, months, grossMarginPercent];
        if (values.some((value) => value.trim() === "")) return null;

        const parsed = values.map((value) => Number(value));
        if (parsed.some((value) => Number.isNaN(value))) {
            return { error: "Sales, growth, periods, and gross margin must all be valid numbers." };
        }

        if (parsed[0] < 0 || parsed[2] <= 0) {
            return { error: "Starting sales cannot be negative, and the number of months must be greater than zero." };
        }

        return computeSalesForecast({
            startingSales: parsed[0],
            monthlyGrowthPercent: parsed[1],
            months: Math.max(1, Math.round(parsed[2])),
            grossMarginPercent: parsed[3],
        });
    }, [grossMarginPercent, monthlyGrowthPercent, months, startingSales]);

    return (
        <CalculatorPageLayout
            badge="Entrepreneurship / Forecasting"
            title="Sales Forecast Planner"
            description="Project monthly sales and gross profit from a starting sales level and a simple growth assumption."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Starting Monthly Sales" value={startingSales} onChange={setStartingSales} placeholder="150000" />
                        <InputCard label="Monthly Growth (%)" value={monthlyGrowthPercent} onChange={setMonthlyGrowthPercent} placeholder="6" />
                        <InputCard label="Months" value={months} onChange={setMonths} placeholder="6" />
                        <InputCard label="Gross Margin (%)" value={grossMarginPercent} onChange={setGrossMarginPercent} placeholder="35" />
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
                            <ResultCard title="Total Sales" value={formatPHP(result.totalSales)} />
                            <ResultCard title="Ending Monthly Sales" value={formatPHP(result.endingSales)} tone="accent" />
                            <ResultCard title="Total Gross Profit" value={formatPHP(result.totalGrossProfit)} />
                        </ResultGrid>

                        <TrendLineChart
                            title="Sales path"
                            description="This trend is based on a constant month-over-month growth assumption."
                            points={result.rows.map((row) => ({ label: `M${row.period}`, value: row.sales }))}
                            formatter={(value) => formatPHP(value)}
                            accent="secondary"
                        />
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Projected sales for each month = starting sales × (1 + growth rate)^(period - 1)."
                        steps={[
                            `The forecast begins at ${formatPHP(Number(startingSales))}.`,
                            `Each new month grows by ${Number(monthlyGrowthPercent).toFixed(2)}%.`,
                            `The final projected month reaches ${formatPHP(result.endingSales)}.`,
                        ]}
                        interpretation={`Across ${result.rows.length} month(s), projected sales total ${formatPHP(result.totalSales)} and projected gross profit totals ${formatPHP(result.totalGrossProfit)}.`}
                        notes={[
                            "Use this for quick planning, not for seasonality-heavy businesses that need separate month-by-month assumptions.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
