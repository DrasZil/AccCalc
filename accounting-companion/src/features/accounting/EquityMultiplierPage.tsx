import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeEquityMultiplier } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function EquityMultiplierPage() {
    const [averageTotalAssets, setAverageTotalAssets] = useState("");
    const [averageTotalEquity, setAverageTotalEquity] = useState("");

    useSmartSolverConnector({
        averageTotalAssets: setAverageTotalAssets,
        averageEquity: setAverageTotalEquity,
    });

    const result = useMemo(() => {
        if (averageTotalAssets.trim() === "" || averageTotalEquity.trim() === "") {
            return null;
        }

        const assets = Number(averageTotalAssets);
        const equity = Number(averageTotalEquity);

        if (Number.isNaN(assets) || Number.isNaN(equity)) {
            return { error: "Both inputs must be valid numbers." };
        }

        if (assets <= 0 || equity <= 0) {
            return { error: "Average total assets and average total equity must both be greater than zero." };
        }

        if (equity > assets) {
            return {
                error: "Average total equity cannot exceed average total assets in a standard equity-multiplier analysis.",
            };
        }

        const multiplier = computeEquityMultiplier(assets, equity);

        return {
            ...multiplier,
            formula: "Equity Multiplier = Average Total Assets / Average Total Equity",
            steps: [
                `Equity multiplier = ${formatPHP(assets)} / ${formatPHP(equity)} = ${multiplier.equityMultiplier.toFixed(2)}`,
                `Debt-financed portion = (${formatPHP(assets)} - ${formatPHP(equity)}) / ${formatPHP(assets)} = ${(multiplier.financedByDebtPortion * 100).toFixed(2)}%`,
            ],
            glossary: [
                {
                    term: "Equity multiplier",
                    meaning: "A leverage measure showing how many pesos of assets are supported by each peso of equity.",
                },
                {
                    term: "Average total assets",
                    meaning: "Usually the average of beginning and ending total assets for the period.",
                },
                {
                    term: "Average total equity",
                    meaning: "Usually the average of beginning and ending total equity for the period.",
                },
            ],
            interpretation:
                multiplier.equityMultiplier >= 3
                    ? `An equity multiplier of ${multiplier.equityMultiplier.toFixed(2)} suggests relatively high leverage. Higher ROE may be supported by heavier financing risk.`
                    : multiplier.equityMultiplier >= 2
                      ? `An equity multiplier of ${multiplier.equityMultiplier.toFixed(2)} suggests moderate leverage and should be read together with debt ratio, debt-to-equity, and ROE.`
                      : `An equity multiplier of ${multiplier.equityMultiplier.toFixed(2)} suggests a more equity-funded asset base, though the broader capital structure still needs supporting ratio analysis.`,
            assumptions: [
                "This ratio is most informative when average balances for the same period are used consistently.",
                "Interpret the multiplier together with profitability and solvency ratios instead of treating it as a complete financing verdict by itself.",
            ],
            notes: [
                `About ${(multiplier.financedByDebtPortion * 100).toFixed(2)}% of the asset base is financed by liabilities under these average balances.`,
            ],
        };
    }, [averageTotalAssets, averageTotalEquity]);

    return (
        <CalculatorPageLayout
            badge="Accounting | Equity"
            title="Equity Multiplier"
            description="Measure financial leverage by comparing average total assets with average total equity."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Average Total Assets"
                            value={averageTotalAssets}
                            onChange={setAverageTotalAssets}
                            placeholder="800000"
                        />
                        <InputCard
                            label="Average Total Equity"
                            value={averageTotalEquity}
                            onChange={setAverageTotalEquity}
                            placeholder="320000"
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
                    <ResultGrid columns={2}>
                        <ResultCard
                            title="Equity Multiplier"
                            value={`${result.equityMultiplier.toFixed(2)} x`}
                            tone="accent"
                        />
                        <ResultCard
                            title="Debt-Financed Portion"
                            value={`${(result.financedByDebtPortion * 100).toFixed(2)}%`}
                        />
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
                        assumptions={result.assumptions}
                        notes={result.notes}
                    />
                ) : null
            }
        />
    );
}
