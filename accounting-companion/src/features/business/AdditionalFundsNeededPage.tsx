import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";

export default function AdditionalFundsNeededPage() {
    const [currentSales, setCurrentSales] = useState("");
    const [projectedSales, setProjectedSales] = useState("");
    const [assetToSalesRatio, setAssetToSalesRatio] = useState("");
    const [spontaneousLiabilityRatio, setSpontaneousLiabilityRatio] = useState("");
    const [profitMarginPercent, setProfitMarginPercent] = useState("");
    const [retentionRatioPercent, setRetentionRatioPercent] = useState("");

    const result = useMemo(() => {
        const rawValues = [
            currentSales,
            projectedSales,
            assetToSalesRatio,
            spontaneousLiabilityRatio,
            profitMarginPercent,
            retentionRatioPercent,
        ];

        if (rawValues.some((value) => value.trim() === "")) return null;

        const parsed = rawValues.map((value) => Number(value));
        if (parsed.some((value) => Number.isNaN(value))) {
            return { error: "All AFN inputs must be valid numbers." };
        }

        const [
            currentSalesValue,
            projectedSalesValue,
            assetToSalesRatioValue,
            spontaneousLiabilityRatioValue,
            profitMarginPercentValue,
            retentionRatioPercentValue,
        ] = parsed;

        if (currentSalesValue <= 0 || projectedSalesValue <= 0) {
            return { error: "Current and projected sales must both be greater than zero." };
        }

        const deltaSales = projectedSalesValue - currentSalesValue;
        const assetRatioDecimal = assetToSalesRatioValue / 100;
        const liabilityRatioDecimal = spontaneousLiabilityRatioValue / 100;
        const profitMarginDecimal = profitMarginPercentValue / 100;
        const retentionRatioDecimal = retentionRatioPercentValue / 100;

        const requiredAssetIncrease = assetRatioDecimal * deltaSales;
        const spontaneousLiabilitySupport = liabilityRatioDecimal * deltaSales;
        const internallyGeneratedFinancing =
            profitMarginDecimal * projectedSalesValue * retentionRatioDecimal;
        const additionalFundsNeeded =
            requiredAssetIncrease -
            spontaneousLiabilitySupport -
            internallyGeneratedFinancing;

        return {
            deltaSales,
            requiredAssetIncrease,
            spontaneousLiabilitySupport,
            internallyGeneratedFinancing,
            additionalFundsNeeded,
            formula:
                "AFN = (Asset-to-sales ratio × change in sales) - (Spontaneous liability ratio × change in sales) - (Projected sales × profit margin × retention ratio)",
            steps: [
                `Change in sales = ${formatPHP(projectedSalesValue)} - ${formatPHP(currentSalesValue)} = ${formatPHP(deltaSales)}.`,
                `Required asset increase = ${assetToSalesRatioValue.toFixed(2)}% × ${formatPHP(deltaSales)} = ${formatPHP(requiredAssetIncrease)}.`,
                `Spontaneous liability support = ${spontaneousLiabilityRatioValue.toFixed(2)}% × ${formatPHP(deltaSales)} = ${formatPHP(spontaneousLiabilitySupport)}.`,
                `Internally generated financing = ${formatPHP(projectedSalesValue)} × ${profitMarginPercentValue.toFixed(2)}% × ${retentionRatioPercentValue.toFixed(2)}% = ${formatPHP(internallyGeneratedFinancing)}.`,
                `AFN = ${formatPHP(requiredAssetIncrease)} - ${formatPHP(spontaneousLiabilitySupport)} - ${formatPHP(internallyGeneratedFinancing)} = ${formatPHP(additionalFundsNeeded)}.`,
            ],
            glossary: [
                { term: "AFN", meaning: "Additional funds needed to support forecasted growth after spontaneous liabilities and retained earnings support are considered." },
                { term: "Spontaneous liabilities", meaning: "Liabilities such as payables that tend to rise naturally with sales." },
                { term: "Retention ratio", meaning: "The share of earnings kept in the business rather than paid out as dividends." },
            ],
            interpretation:
                additionalFundsNeeded > 0
                    ? `The forecast suggests the business still needs ${formatPHP(additionalFundsNeeded)} of outside financing to support the projected sales level.`
                    : `The forecast generates ${formatPHP(Math.abs(additionalFundsNeeded))} more internal support than the growth plan requires, so outside financing may not be needed under these assumptions.`,
            assumptions: [
                "AFN assumes the chosen asset and spontaneous-liability ratios remain relevant as sales grow.",
                "This version uses a compact percentage-of-sales approach for classroom forecasting and planning drills.",
            ],
            notes: [
                "Use this together with working-capital, budget, and financing discussions when the class asks how fast growth can be supported.",
            ],
        };
    }, [
        assetToSalesRatio,
        currentSales,
        profitMarginPercent,
        projectedSales,
        retentionRatioPercent,
        spontaneousLiabilityRatio,
    ]);

    return (
        <CalculatorPageLayout
            badge="Cost & Managerial / Forecasting"
            title="Additional Funds Needed"
            description="Estimate how much outside financing a growth forecast still needs after spontaneous liabilities and retained earnings support are considered."
            inputSection={
                <InputGrid columns={3}>
                    <InputCard label="Current Sales" value={currentSales} onChange={setCurrentSales} placeholder="1200000" />
                    <InputCard label="Projected Sales" value={projectedSales} onChange={setProjectedSales} placeholder="1500000" />
                    <InputCard label="Asset-to-Sales Ratio (%)" value={assetToSalesRatio} onChange={setAssetToSalesRatio} placeholder="65" helperText="Use the operating asset support ratio applied in the forecast." />
                    <InputCard label="Spontaneous Liability Ratio (%)" value={spontaneousLiabilityRatio} onChange={setSpontaneousLiabilityRatio} placeholder="18" helperText="Examples include payables and accruals that rise with sales." />
                    <InputCard label="Profit Margin (%)" value={profitMarginPercent} onChange={setProfitMarginPercent} placeholder="9" />
                    <InputCard label="Retention Ratio (%)" value={retentionRatioPercent} onChange={setRetentionRatioPercent} placeholder="70" helperText="Use the share of earnings kept in the business." />
                </InputGrid>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="app-tone-warning">
                        <p className="app-card-title text-sm">Input notice</p>
                        <p className="app-body-md mt-2 text-sm">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={4}>
                        <ResultCard
                            title="Additional Funds Needed"
                            value={formatPHP(result.additionalFundsNeeded)}
                            tone={result.additionalFundsNeeded > 0 ? "warning" : "success"}
                        />
                        <ResultCard title="Required Asset Increase" value={formatPHP(result.requiredAssetIncrease)} />
                        <ResultCard title="Spontaneous Liability Support" value={formatPHP(result.spontaneousLiabilitySupport)} />
                        <ResultCard title="Internal Financing" value={formatPHP(result.internallyGeneratedFinancing)} />
                    </ResultGrid>
                ) : (
                    <SectionCard>
                        <p className="app-card-title text-sm">Forecast support first</p>
                        <p className="app-body-md mt-2 text-sm">
                            Enter the current and projected sales levels plus the planning ratios to estimate how much growth financing the forecast still needs.
                        </p>
                    </SectionCard>
                )
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
