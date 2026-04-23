import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeEarningsQuality } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

function formatRatio(value: number) {
    return `${value.toFixed(3)}x`;
}

function formatPercent(value: number) {
    return `${(value * 100).toFixed(2)}%`;
}

export default function EarningsQualityPage() {
    const [netIncome, setNetIncome] = useState("");
    const [operatingCashFlow, setOperatingCashFlow] = useState("");
    const [averageAssets, setAverageAssets] = useState("");

    const result = useMemo(() => {
        if ([netIncome, operatingCashFlow, averageAssets].some((value) => value.trim() === "")) return null;
        const numeric = [netIncome, operatingCashFlow, averageAssets].map(Number);
        if (numeric.some(Number.isNaN)) return { error: "All earnings-quality inputs must be valid numbers." };
        if (numeric[2] <= 0) return { error: "Average total assets must be greater than zero." };

        return computeEarningsQuality({
            netIncome: numeric[0],
            operatingCashFlow: numeric[1],
            averageTotalAssets: numeric[2],
        });
    }, [averageAssets, netIncome, operatingCashFlow]);

    return (
        <CalculatorPageLayout
            badge="Financial Statement Analysis"
            title="Earnings Quality and Accruals Analyzer"
            description="Compare net income with operating cash flow to flag accrual pressure, cash conversion quality, and footnote-review needs."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Net Income" value={netIncome} onChange={setNetIncome} placeholder="98000" />
                        <InputCard label="Operating Cash Flow" value={operatingCashFlow} onChange={setOperatingCashFlow} placeholder="84000" />
                        <InputCard label="Average Total Assets" value={averageAssets} onChange={setAverageAssets} placeholder="760000" />
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
                        <ResultCard title="Total Accruals" value={formatPHP(result.totalAccruals)} />
                        <ResultCard title="Accrual Ratio" value={formatPercent(result.accrualRatio)} />
                        <ResultCard title="Cash Conversion" value={formatRatio(result.cashConversionRatio)} tone="accent" />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Total accruals = net income - operating cash flow; accrual ratio = total accruals / average total assets"
                        steps={[
                            `Total accruals = ${formatPHP(Number(netIncome))} - ${formatPHP(Number(operatingCashFlow))} = ${formatPHP(result.totalAccruals)}.`,
                            `Accrual ratio = ${formatPHP(result.totalAccruals)} / ${formatPHP(Number(averageAssets))} = ${formatPercent(result.accrualRatio)}.`,
                            `Cash conversion = ${formatPHP(Number(operatingCashFlow))} / ${formatPHP(Number(netIncome))} = ${formatRatio(result.cashConversionRatio)}.`,
                        ]}
                        interpretation={result.qualitySignal}
                        warnings={[
                            "This is a screening tool. Always inspect working-capital movements, noncash charges, unusual gains, and footnotes before concluding earnings quality is weak or strong.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
