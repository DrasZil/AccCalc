import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function AssetTurnoverPage() {
    const [netSales, setNetSales] = useState("");
    const [averageTotalAssets, setAverageTotalAssets] = useState("");

    useSmartSolverConnector({
        netSales: setNetSales,
        averageTotalAssets: setAverageTotalAssets,
    });

    const result = useMemo(() => {
        if (netSales.trim() === "" || averageTotalAssets.trim() === "") return null;

        const parsedNetSales = Number(netSales);
        const parsedAverageTotalAssets = Number(averageTotalAssets);

        if ([parsedNetSales, parsedAverageTotalAssets].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (parsedNetSales < 0 || parsedAverageTotalAssets <= 0) {
            return { error: "Net sales cannot be negative, and average total assets must be greater than zero." };
        }

        const turnover = parsedNetSales / parsedAverageTotalAssets;

        return {
            turnover,
            formula: "Asset Turnover = Net Sales / Average Total Assets",
            steps: [
                `Net sales = ${formatPHP(parsedNetSales)}`,
                `Average total assets = ${formatPHP(parsedAverageTotalAssets)}`,
                `Asset turnover = ${formatPHP(parsedNetSales)} / ${formatPHP(parsedAverageTotalAssets)} = ${turnover.toFixed(2)}`,
            ],
            glossary: [
                { term: "Net Sales", meaning: "Revenue from sales after returns, allowances, and discounts." },
                { term: "Average Total Assets", meaning: "The average total assets used during the period, often based on beginning and ending balances." },
                { term: "Asset Turnover", meaning: "A ratio showing how efficiently the business uses its assets to generate sales." },
            ],
            interpretation: `The company generated ${turnover.toFixed(2)} pesos of net sales for every peso invested in average total assets.`,
        };
    }, [averageTotalAssets, netSales]);

    return (
        <CalculatorPageLayout
            badge="Accounting"
            title="Asset Turnover"
            description="Measure how efficiently assets are being used to generate sales revenue."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Net Sales"
                            value={netSales}
                            onChange={setNetSales}
                            placeholder="850000"
                        />
                        <InputCard
                            label="Average Total Assets"
                            value={averageTotalAssets}
                            onChange={setAverageTotalAssets}
                            placeholder="425000"
                        />
                    </InputGrid>
                </SectionCard>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="border-yellow-400/20 bg-yellow-500/10">
                        <p className="text-sm font-medium text-yellow-300">Input notice</p>
                        <p className="mt-2 text-sm leading-6 text-yellow-200">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={3}>
                        <ResultCard title="Asset Turnover" value={result.turnover.toFixed(2)} />
                        <ResultCard title="Net Sales" value={formatPHP(Number(netSales))} />
                        <ResultCard title="Average Total Assets" value={formatPHP(Number(averageTotalAssets))} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula={result.formula}
                        steps={result.steps}
                        glossary={result.glossary}
                        interpretation={result.interpretation}
                    />
                ) : null
            }
        />
    );
}
