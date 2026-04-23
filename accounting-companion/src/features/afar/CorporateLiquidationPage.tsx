import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeCorporateLiquidation } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

export default function CorporateLiquidationPage() {
    const [assetRealization, setAssetRealization] = useState("");
    const [liquidationCosts, setLiquidationCosts] = useState("");
    const [priorityLiabilities, setPriorityLiabilities] = useState("");
    const [unsecuredLiabilities, setUnsecuredLiabilities] = useState("");

    const result = useMemo(() => {
        const values = [assetRealization, liquidationCosts, priorityLiabilities, unsecuredLiabilities];
        if (values.some((value) => value.trim() === "")) return null;
        const parsed = values.map(Number);
        if (parsed.some(Number.isNaN)) return { error: "All liquidation inputs must be valid numbers." };
        if (parsed.some((value) => value < 0)) return { error: "Liquidation inputs cannot be negative." };
        return computeCorporateLiquidation({
            estimatedAssetRealization: parsed[0],
            liquidationCosts: parsed[1],
            priorityLiabilities: parsed[2],
            unsecuredLiabilities: parsed[3],
        });
    }, [assetRealization, liquidationCosts, priorityLiabilities, unsecuredLiabilities]);

    return (
        <CalculatorPageLayout
            badge="AFAR"
            title="Corporate Liquidation Recovery Planner"
            description="Estimate estate available to creditors, unsecured recovery, and deficiency in a corporate liquidation or statement-of-affairs style case."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Estimated Asset Realization" value={assetRealization} onChange={setAssetRealization} placeholder="5200000" />
                        <InputCard label="Liquidation Costs" value={liquidationCosts} onChange={setLiquidationCosts} placeholder="250000" />
                        <InputCard label="Priority / Secured Liabilities" value={priorityLiabilities} onChange={setPriorityLiabilities} placeholder="2100000" />
                        <InputCard label="Unsecured Liabilities" value={unsecuredLiabilities} onChange={setUnsecuredLiabilities} placeholder="3600000" />
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
                        <ResultCard title="Net Estate Available" value={formatPHP(result.netEstateAvailable)} />
                        <ResultCard title="For Unsecured Creditors" value={formatPHP(result.amountAvailableForUnsecured)} tone="accent" />
                        <ResultCard title="Unsecured Recovery" value={formatPercent(result.unsecuredRecoveryPercent)} />
                        <ResultCard title="Unsecured Deficiency" value={formatPHP(result.unsecuredDeficiency)} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Available for unsecured creditors = estimated realization - liquidation costs - priority liabilities"
                        steps={[
                            `Net estate = ${formatPHP(Number(assetRealization))} - ${formatPHP(Number(liquidationCosts))} = ${formatPHP(result.netEstateAvailable)}.`,
                            `Available for unsecured creditors = ${formatPHP(result.netEstateAvailable)} - ${formatPHP(Number(priorityLiabilities))} = ${formatPHP(result.amountAvailableForUnsecured)}.`,
                            `Recovery percent = available for unsecured creditors / unsecured liabilities = ${formatPercent(result.unsecuredRecoveryPercent)}.`,
                        ]}
                        interpretation="This route supports AFAR liquidation review by keeping realization, priority claims, unsecured recovery, and deficiency visible."
                    />
                ) : null
            }
        />
    );
}
