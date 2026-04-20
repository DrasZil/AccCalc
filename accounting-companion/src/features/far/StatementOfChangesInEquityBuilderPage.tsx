import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import ComparisonBarsChart from "../../components/ComparisonBarsChart";
import ChartInsightPanel from "../../components/charts/ChartInsightPanel";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { buildChartHighlights } from "../../utils/charts/chartHighlights";
import { buildComparisonNarrative } from "../../utils/charts/chartNarratives";
import { computeStatementOfChangesInEquity } from "../../utils/calculatorMath";

export default function StatementOfChangesInEquityBuilderPage() {
    const [beginningShareCapital, setBeginningShareCapital] = useState("");
    const [beginningAdditionalPaidInCapital, setBeginningAdditionalPaidInCapital] = useState("");
    const [beginningRetainedEarnings, setBeginningRetainedEarnings] = useState("");
    const [beginningAccumulatedOci, setBeginningAccumulatedOci] = useState("");
    const [beginningTreasuryShares, setBeginningTreasuryShares] = useState("");
    const [shareIssuances, setShareIssuances] = useState("");
    const [additionalPaidInCapitalChanges, setAdditionalPaidInCapitalChanges] = useState("");
    const [netIncome, setNetIncome] = useState("");
    const [dividendsDeclared, setDividendsDeclared] = useState("");
    const [priorPeriodAdjustments, setPriorPeriodAdjustments] = useState("");
    const [otherComprehensiveIncome, setOtherComprehensiveIncome] = useState("");
    const [treasuryShareRepurchases, setTreasuryShareRepurchases] = useState("");
    const [treasuryShareReissuances, setTreasuryShareReissuances] = useState("");

    const result = useMemo(() => {
        const requiredValues = [
            beginningShareCapital,
            beginningAdditionalPaidInCapital,
            beginningRetainedEarnings,
            beginningAccumulatedOci,
            beginningTreasuryShares,
        ];

        if (requiredValues.some((value) => value.trim() === "")) {
            return null;
        }

        const numericValues = [
            beginningShareCapital,
            beginningAdditionalPaidInCapital,
            beginningRetainedEarnings,
            beginningAccumulatedOci,
            beginningTreasuryShares,
            shareIssuances,
            additionalPaidInCapitalChanges,
            netIncome,
            dividendsDeclared,
            priorPeriodAdjustments,
            otherComprehensiveIncome,
            treasuryShareRepurchases,
            treasuryShareReissuances,
        ].map((value) => (value.trim() === "" ? 0 : Number(value)));

        if (numericValues.some((value) => Number.isNaN(value))) {
            return {
                error: "All visible equity-builder inputs must be valid numbers before the statement can be prepared.",
            };
        }

        return computeStatementOfChangesInEquity({
            beginningShareCapital: numericValues[0],
            beginningAdditionalPaidInCapital: numericValues[1],
            beginningRetainedEarnings: numericValues[2],
            beginningAccumulatedOci: numericValues[3],
            beginningTreasuryShares: numericValues[4],
            shareIssuances: numericValues[5],
            additionalPaidInCapitalChanges: numericValues[6],
            netIncome: numericValues[7],
            dividendsDeclared: numericValues[8],
            priorPeriodAdjustments: numericValues[9],
            otherComprehensiveIncome: numericValues[10],
            treasuryShareRepurchases: numericValues[11],
            treasuryShareReissuances: numericValues[12],
        });
    }, [
        additionalPaidInCapitalChanges,
        beginningAccumulatedOci,
        beginningAdditionalPaidInCapital,
        beginningRetainedEarnings,
        beginningShareCapital,
        beginningTreasuryShares,
        dividendsDeclared,
        netIncome,
        otherComprehensiveIncome,
        priorPeriodAdjustments,
        shareIssuances,
        treasuryShareReissuances,
        treasuryShareRepurchases,
    ]);

    const equityComposition =
        result && !("error" in result)
            ? [
                  { label: "Share Capital", value: result.endingShareCapital, accent: "primary" as const },
                  { label: "APIC", value: result.endingAdditionalPaidInCapital, accent: "secondary" as const },
                  { label: "Retained Earnings", value: result.endingRetainedEarnings, accent: "highlight" as const },
                  { label: "Accumulated OCI", value: result.endingAccumulatedOci, accent: "secondary" as const },
                  { label: "Treasury Shares", value: result.endingTreasuryShares, accent: "primary" as const, note: "Contra-equity balance shown as a deduction in total equity." },
              ]
            : [];

    return (
        <CalculatorPageLayout
            badge="FAR / Equity"
            title="Statement of Changes in Equity Builder"
            description="Roll forward share capital, APIC, retained earnings, OCI, and treasury shares into an ending total-equity view that supports statement preparation and classroom analysis."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-card-title text-sm">Beginning balances</p>
                        <InputGrid columns={2}>
                            <InputCard label="Beginning Share Capital" value={beginningShareCapital} onChange={setBeginningShareCapital} placeholder="5000000" />
                            <InputCard label="Beginning APIC" value={beginningAdditionalPaidInCapital} onChange={setBeginningAdditionalPaidInCapital} placeholder="900000" />
                            <InputCard label="Beginning Retained Earnings" value={beginningRetainedEarnings} onChange={setBeginningRetainedEarnings} placeholder="2100000" />
                            <InputCard label="Beginning Accumulated OCI" value={beginningAccumulatedOci} onChange={setBeginningAccumulatedOci} placeholder="120000" />
                            <InputCard label="Beginning Treasury Shares" value={beginningTreasuryShares} onChange={setBeginningTreasuryShares} placeholder="180000" />
                        </InputGrid>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">Current-period changes</p>
                        <InputGrid columns={2}>
                            <InputCard label="Share Issuances" value={shareIssuances} onChange={setShareIssuances} placeholder="300000" />
                            <InputCard label="APIC Changes" value={additionalPaidInCapitalChanges} onChange={setAdditionalPaidInCapitalChanges} placeholder="45000" />
                            <InputCard label="Net Income" value={netIncome} onChange={setNetIncome} placeholder="680000" />
                            <InputCard label="Dividends Declared" value={dividendsDeclared} onChange={setDividendsDeclared} placeholder="210000" />
                            <InputCard label="Prior-period Adjustments" value={priorPeriodAdjustments} onChange={setPriorPeriodAdjustments} placeholder="0" />
                            <InputCard label="Other Comprehensive Income" value={otherComprehensiveIncome} onChange={setOtherComprehensiveIncome} placeholder="35000" />
                            <InputCard label="Treasury Share Repurchases" value={treasuryShareRepurchases} onChange={setTreasuryShareRepurchases} placeholder="60000" />
                            <InputCard label="Treasury Share Reissuances" value={treasuryShareReissuances} onChange={setTreasuryShareReissuances} placeholder="20000" />
                        </InputGrid>
                    </SectionCard>
                </div>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="app-tone-warning">
                        <p className="app-card-title text-sm">Input notice</p>
                        <p className="app-body-md mt-2 text-sm">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <div className="space-y-4">
                        <ResultGrid columns={4}>
                            <ResultCard title="Ending Share Capital" value={formatPHP(result.endingShareCapital)} tone="accent" />
                            <ResultCard title="Ending APIC" value={formatPHP(result.endingAdditionalPaidInCapital)} />
                            <ResultCard title="Ending Retained Earnings" value={formatPHP(result.endingRetainedEarnings)} />
                            <ResultCard title="Ending Accumulated OCI" value={formatPHP(result.endingAccumulatedOci)} />
                            <ResultCard title="Ending Treasury Shares" value={formatPHP(result.endingTreasuryShares)} />
                            <ResultCard title="Beginning Total Equity" value={formatPHP(result.totalBeginningEquity)} />
                            <ResultCard title="Ending Total Equity" value={formatPHP(result.totalEndingEquity)} />
                            <ResultCard title="Total Change in Equity" value={formatPHP(result.totalChangeInEquity)} tone={result.totalChangeInEquity >= 0 ? "success" : "warning"} />
                        </ResultGrid>

                        <ComparisonBarsChart
                            title="Ending equity composition"
                            description="Read which components are carrying the final equity balance and which balances are acting as deductions."
                            items={equityComposition}
                            formatter={formatPHP}
                            referenceValue={result.totalEndingEquity}
                            referenceLabel="ending total equity"
                            caption="Treasury shares are a contra-equity balance, so they reduce total equity even if the chart still shows the amount clearly for review purposes."
                        />

                        <ChartInsightPanel
                            title="Equity interpretation"
                            meaning={buildComparisonNarrative(
                                equityComposition.map((item) => ({
                                    label: item.label,
                                    value: Math.abs(item.value),
                                })),
                                { formatter: formatPHP }
                            )}
                            importance={`Ending total equity stands at ${formatPHP(result.totalEndingEquity)} after rolling forward capital contributions, comprehensive income items, and treasury-share activity from the beginning balance.`}
                            highlights={buildChartHighlights(
                                equityComposition.map((item) => ({
                                    label: item.label,
                                    value: Math.abs(item.value),
                                })),
                                { formatter: formatPHP }
                            )}
                        />
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Ending total equity = Ending share capital + Ending APIC + Ending retained earnings + Ending accumulated OCI - Ending treasury shares"
                        steps={[
                            `Ending share capital = ${formatPHP(result.endingShareCapital)}.`,
                            `Ending retained earnings reflects income, dividends, and prior-period adjustments at ${formatPHP(result.endingRetainedEarnings)}.`,
                            `Ending total equity = ${formatPHP(result.totalEndingEquity)} after deducting treasury shares of ${formatPHP(result.endingTreasuryShares)}.`,
                        ]}
                        glossary={[
                            { term: "APIC", meaning: "Additional paid-in capital or share premium arising from equity transactions above par or stated value." },
                            { term: "Accumulated OCI", meaning: "The cumulative other-comprehensive-income balance carried inside equity rather than current profit or loss." },
                            { term: "Treasury shares", meaning: "A contra-equity balance representing the company's reacquired own shares under the cost method used in this builder." },
                        ]}
                        interpretation="Use this builder when the case is really about rolling each equity component forward in a statement of changes in equity rather than only solving one retained-earnings line."
                        assumptions={[
                            "This builder is intentionally simplified for classwork and assumes the balances entered already belong to the same reporting entity and reporting period.",
                            "Treasury-share handling follows a practical cost-method rollforward view, not every specialized legal or quasi-reorganization case.",
                        ]}
                        warnings={[
                            "If the problem includes par-value splits, share dividends, or complex reissuance entries, review the detailed equity notes before treating this as a final disclosure answer.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
