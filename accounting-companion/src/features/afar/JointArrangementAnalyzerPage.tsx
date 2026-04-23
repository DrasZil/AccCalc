import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeJointArrangementShare } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

export default function JointArrangementAnalyzerPage() {
    const [ownershipPercent, setOwnershipPercent] = useState("");
    const [arrangementAssets, setArrangementAssets] = useState("");
    const [arrangementLiabilities, setArrangementLiabilities] = useState("");
    const [arrangementRevenue, setArrangementRevenue] = useState("");
    const [arrangementExpenses, setArrangementExpenses] = useState("");

    const result = useMemo(() => {
        const values = [ownershipPercent, arrangementAssets, arrangementLiabilities, arrangementRevenue, arrangementExpenses];
        if (values.some((value) => value.trim() === "")) return null;
        const parsed = values.map(Number);
        if (parsed.some(Number.isNaN)) return { error: "All joint arrangement inputs must be valid numbers." };
        if (parsed.some((value) => value < 0)) return { error: "Joint arrangement inputs cannot be negative." };
        if (parsed[0] > 100) return { error: "Ownership percentage cannot exceed 100%." };

        return computeJointArrangementShare({
            ownershipPercent: parsed[0],
            arrangementAssets: parsed[1],
            arrangementLiabilities: parsed[2],
            arrangementRevenue: parsed[3],
            arrangementExpenses: parsed[4],
        });
    }, [arrangementAssets, arrangementExpenses, arrangementLiabilities, arrangementRevenue, ownershipPercent]);

    return (
        <CalculatorPageLayout
            badge="AFAR"
            title="Joint Arrangement Share Analyzer"
            description="Estimate a venturer's share of assets, liabilities, revenue, expenses, profit, and net position while keeping classification cautions visible."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Ownership / Participation %" value={ownershipPercent} onChange={setOwnershipPercent} placeholder="40" />
                        <InputCard label="Arrangement Assets" value={arrangementAssets} onChange={setArrangementAssets} placeholder="3200000" />
                        <InputCard label="Arrangement Liabilities" value={arrangementLiabilities} onChange={setArrangementLiabilities} placeholder="1100000" />
                        <InputCard label="Arrangement Revenue" value={arrangementRevenue} onChange={setArrangementRevenue} placeholder="1800000" />
                        <InputCard label="Arrangement Expenses" value={arrangementExpenses} onChange={setArrangementExpenses} placeholder="1250000" />
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
                        <ResultCard title="Share of Assets" value={formatPHP(result.shareOfAssets)} />
                        <ResultCard title="Share of Liabilities" value={formatPHP(result.shareOfLiabilities)} />
                        <ResultCard title="Share of Profit" value={formatPHP(result.shareOfProfit)} tone="accent" />
                        <ResultCard title="Net Position" value={formatPHP(result.netPosition)} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Share = arrangement amount x participation percentage"
                        steps={[
                            `Share of assets = ${formatPHP(Number(arrangementAssets))} x ${Number(ownershipPercent).toFixed(2)}% = ${formatPHP(result.shareOfAssets)}.`,
                            `Share of profit = (${formatPHP(Number(arrangementRevenue))} - ${formatPHP(Number(arrangementExpenses))}) x ${Number(ownershipPercent).toFixed(2)}% = ${formatPHP(result.shareOfProfit)}.`,
                        ]}
                        interpretation={result.classificationReminder}
                        warnings={["Do not use percentage share alone to classify the arrangement. Rights to assets and obligations for liabilities drive joint-operation analysis."]}
                    />
                ) : null
            }
        />
    );
}
