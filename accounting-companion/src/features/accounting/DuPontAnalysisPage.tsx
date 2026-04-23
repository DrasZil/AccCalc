import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeDupontAnalysis } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

function formatPercent(value: number) {
    return `${(value * 100).toFixed(2)}%`;
}

export default function DuPontAnalysisPage() {
    const [netIncome, setNetIncome] = useState("");
    const [netSales, setNetSales] = useState("");
    const [averageAssets, setAverageAssets] = useState("");
    const [averageEquity, setAverageEquity] = useState("");

    const result = useMemo(() => {
        if ([netIncome, netSales, averageAssets, averageEquity].some((value) => value.trim() === "")) return null;
        const numeric = [netIncome, netSales, averageAssets, averageEquity].map(Number);
        if (numeric.some(Number.isNaN)) return { error: "All DuPont inputs must be valid numbers." };
        if (numeric[1] <= 0 || numeric[2] <= 0 || numeric[3] <= 0) return { error: "Net sales, average assets, and average equity must be greater than zero." };

        return computeDupontAnalysis({
            netIncome: numeric[0],
            netSales: numeric[1],
            averageAssets: numeric[2],
            averageEquity: numeric[3],
        });
    }, [averageAssets, averageEquity, netIncome, netSales]);

    return (
        <CalculatorPageLayout
            badge="Financial Statement Analysis"
            title="DuPont ROE Analyzer"
            description="Decompose return on equity into margin, asset turnover, and leverage so statement-analysis cases explain why ROE changed."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Net Income" value={netIncome} onChange={setNetIncome} placeholder="98000" />
                        <InputCard label="Net Sales" value={netSales} onChange={setNetSales} placeholder="950000" />
                        <InputCard label="Average Total Assets" value={averageAssets} onChange={setAverageAssets} placeholder="760000" />
                        <InputCard label="Average Equity" value={averageEquity} onChange={setAverageEquity} placeholder="380000" />
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
                    <ResultGrid columns={3}>
                        <ResultCard title="Profit Margin" value={formatPercent(result.profitMargin)} />
                        <ResultCard title="Asset Turnover" value={`${result.assetTurnover.toFixed(2)}x`} />
                        <ResultCard title="Equity Multiplier" value={`${result.equityMultiplier.toFixed(2)}x`} />
                        <ResultCard title="ROA" value={formatPercent(result.returnOnAssets)} />
                        <ResultCard title="ROE" value={formatPercent(result.returnOnEquity)} tone="accent" />
                        <ResultCard title="DuPont ROE Check" value={formatPercent(result.dupontReturnOnEquity)} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="ROE = profit margin x asset turnover x equity multiplier"
                        steps={[
                            `Profit margin = ${formatPHP(Number(netIncome))} / ${formatPHP(Number(netSales))} = ${formatPercent(result.profitMargin)}.`,
                            `Asset turnover = ${formatPHP(Number(netSales))} / ${formatPHP(Number(averageAssets))} = ${result.assetTurnover.toFixed(2)}x.`,
                            `Equity multiplier = ${formatPHP(Number(averageAssets))} / ${formatPHP(Number(averageEquity))} = ${result.equityMultiplier.toFixed(2)}x.`,
                        ]}
                        interpretation="DuPont analysis helps separate profitability, efficiency, and leverage effects instead of treating ROE as one unexplained percentage."
                    />
                ) : null
            }
        />
    );
}
