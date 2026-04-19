import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import ComparisonBarsChart from "../../components/ComparisonBarsChart";
import ChartInsightPanel from "../../components/charts/ChartInsightPanel";
import ChartModeTabs from "../../components/charts/ChartModeTabs";
import CommonMistakesBlock from "../../components/notes/CommonMistakesBlock";
import InterpretationBlock from "../../components/notes/InterpretationBlock";
import StudyTipBlock from "../../components/notes/StudyTipBlock";
import formatPHP from "../../utils/formatPHP";
import { computeRatioAnalysisWorkspace } from "../../utils/calculatorMath";
import { buildChartHighlights } from "../../utils/charts/chartHighlights";
import { buildComparisonNarrative } from "../../utils/charts/chartNarratives";

function formatRatio(value: number) {
    return `${value.toFixed(2)}x`;
}

function formatPercent(value: number) {
    return `${(value * 100).toFixed(2)}%`;
}

export default function RatioAnalysisWorkspacePage() {
    const [currentAssets, setCurrentAssets] = useState("");
    const [currentLiabilities, setCurrentLiabilities] = useState("");
    const [cash, setCash] = useState("");
    const [marketableSecurities, setMarketableSecurities] = useState("");
    const [netReceivables, setNetReceivables] = useState("");
    const [netSales, setNetSales] = useState("");
    const [netCreditSales, setNetCreditSales] = useState("");
    const [costOfGoodsSold, setCostOfGoodsSold] = useState("");
    const [netIncome, setNetIncome] = useState("");
    const [averageInventory, setAverageInventory] = useState("");
    const [averageAccountsReceivable, setAverageAccountsReceivable] = useState("");
    const [averageTotalAssets, setAverageTotalAssets] = useState("");
    const [averageEquity, setAverageEquity] = useState("");
    const [chartMode, setChartMode] = useState<
        "chart" | "table" | "interpretation" | "comparison"
    >("chart");

    const result = useMemo(() => {
        const values = [
            currentAssets,
            currentLiabilities,
            cash,
            marketableSecurities,
            netReceivables,
            netSales,
            costOfGoodsSold,
            netIncome,
            averageInventory,
            averageAccountsReceivable,
            averageTotalAssets,
            averageEquity,
        ];

        if (values.some((value) => value.trim() === "")) return null;

        const parsedCurrentAssets = Number(currentAssets);
        const parsedCurrentLiabilities = Number(currentLiabilities);
        const parsedCash = Number(cash);
        const parsedMarketableSecurities = Number(marketableSecurities);
        const parsedNetReceivables = Number(netReceivables);
        const parsedNetSales = Number(netSales);
        const parsedNetCreditSales =
            netCreditSales.trim() === "" ? parsedNetSales : Number(netCreditSales);
        const parsedCostOfGoodsSold = Number(costOfGoodsSold);
        const parsedNetIncome = Number(netIncome);
        const parsedAverageInventory = Number(averageInventory);
        const parsedAverageAccountsReceivable = Number(averageAccountsReceivable);
        const parsedAverageTotalAssets = Number(averageTotalAssets);
        const parsedAverageEquity = Number(averageEquity);

        const numericValues = [
            parsedCurrentAssets,
            parsedCurrentLiabilities,
            parsedCash,
            parsedMarketableSecurities,
            parsedNetReceivables,
            parsedNetSales,
            parsedNetCreditSales,
            parsedCostOfGoodsSold,
            parsedNetIncome,
            parsedAverageInventory,
            parsedAverageAccountsReceivable,
            parsedAverageTotalAssets,
            parsedAverageEquity,
        ];

        if (numericValues.some((value) => Number.isNaN(value))) {
            return { error: "All ratio-workspace inputs must be valid numbers." };
        }

        if (
            parsedCurrentLiabilities <= 0 ||
            parsedAverageInventory <= 0 ||
            parsedAverageAccountsReceivable <= 0 ||
            parsedAverageTotalAssets <= 0 ||
            parsedAverageEquity <= 0
        ) {
            return {
                error:
                    "Current liabilities, average inventory, average receivables, average assets, and average equity must all be greater than zero.",
            };
        }

        if (
            [
                parsedCurrentAssets,
                parsedCash,
                parsedMarketableSecurities,
                parsedNetReceivables,
                parsedNetSales,
                parsedNetCreditSales,
                parsedCostOfGoodsSold,
            ].some((value) => value < 0)
        ) {
            return {
                error: "Asset, sales, and cost inputs in this workspace cannot be negative.",
            };
        }

        return computeRatioAnalysisWorkspace({
            currentAssets: parsedCurrentAssets,
            currentLiabilities: parsedCurrentLiabilities,
            cash: parsedCash,
            marketableSecurities: parsedMarketableSecurities,
            netReceivables: parsedNetReceivables,
            netSales: parsedNetSales,
            netCreditSales: parsedNetCreditSales,
            costOfGoodsSold: parsedCostOfGoodsSold,
            netIncome: parsedNetIncome,
            averageInventory: parsedAverageInventory,
            averageAccountsReceivable: parsedAverageAccountsReceivable,
            averageTotalAssets: parsedAverageTotalAssets,
            averageEquity: parsedAverageEquity,
        });
    }, [
        averageAccountsReceivable,
        averageEquity,
        averageInventory,
        averageTotalAssets,
        cash,
        costOfGoodsSold,
        currentAssets,
        currentLiabilities,
        marketableSecurities,
        netCreditSales,
        netIncome,
        netReceivables,
        netSales,
    ]);

    return (
        <CalculatorPageLayout
            badge="Accounting / Reporting & Analysis"
            title="Ratio Analysis Workspace"
            description="Compute a practical set of liquidity, efficiency, and profitability ratios from one coordinated statement-data input instead of jumping through separate pages for every basic ratio."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-card-title text-base">Liquidity base</p>
                        <div className="mt-4">
                            <InputGrid columns={2}>
                                <InputCard
                                    label="Current Assets"
                                    value={currentAssets}
                                    onChange={setCurrentAssets}
                                    placeholder="420000"
                                />
                                <InputCard
                                    label="Current Liabilities"
                                    value={currentLiabilities}
                                    onChange={setCurrentLiabilities}
                                    placeholder="180000"
                                />
                                <InputCard
                                    label="Cash"
                                    value={cash}
                                    onChange={setCash}
                                    placeholder="60000"
                                />
                                <InputCard
                                    label="Marketable Securities"
                                    value={marketableSecurities}
                                    onChange={setMarketableSecurities}
                                    placeholder="15000"
                                />
                                <InputCard
                                    label="Net Receivables"
                                    value={netReceivables}
                                    onChange={setNetReceivables}
                                    placeholder="95000"
                                />
                            </InputGrid>
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-base">Turnover and profitability base</p>
                        <div className="mt-4">
                            <InputGrid columns={2}>
                                <InputCard
                                    label="Net Sales"
                                    value={netSales}
                                    onChange={setNetSales}
                                    placeholder="950000"
                                />
                                <InputCard
                                    label="Net Credit Sales (optional override)"
                                    value={netCreditSales}
                                    onChange={setNetCreditSales}
                                    placeholder="Leave blank to use net sales"
                                    helperText="Receivables turnover uses net sales if you leave this blank."
                                />
                                <InputCard
                                    label="Cost of Goods Sold"
                                    value={costOfGoodsSold}
                                    onChange={setCostOfGoodsSold}
                                    placeholder="570000"
                                />
                                <InputCard
                                    label="Net Income"
                                    value={netIncome}
                                    onChange={setNetIncome}
                                    placeholder="98000"
                                />
                                <InputCard
                                    label="Average Inventory"
                                    value={averageInventory}
                                    onChange={setAverageInventory}
                                    placeholder="150000"
                                />
                                <InputCard
                                    label="Average Accounts Receivable"
                                    value={averageAccountsReceivable}
                                    onChange={setAverageAccountsReceivable}
                                    placeholder="110000"
                                />
                                <InputCard
                                    label="Average Total Assets"
                                    value={averageTotalAssets}
                                    onChange={setAverageTotalAssets}
                                    placeholder="760000"
                                />
                                <InputCard
                                    label="Average Equity"
                                    value={averageEquity}
                                    onChange={setAverageEquity}
                                    placeholder="380000"
                                />
                            </InputGrid>
                        </div>
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
                            <ResultCard
                                title="Current Ratio"
                                value={formatRatio(result.currentRatio)}
                            />
                            <ResultCard
                                title="Quick Ratio"
                                value={formatRatio(result.quickRatio)}
                            />
                            <ResultCard
                                title="Gross Profit Rate"
                                value={formatPercent(result.grossProfitRate)}
                            />
                            <ResultCard
                                title="Working Capital"
                                value={formatPHP(result.workingCapital)}
                            />
                            <ResultCard
                                title="Inventory Turnover"
                                value={formatRatio(result.inventoryTurnover)}
                                supportingText={`${result.inventoryDays.toFixed(2)} days in inventory`}
                            />
                            <ResultCard
                                title="Receivables Turnover"
                                value={formatRatio(result.receivablesTurnover)}
                                supportingText={`${result.collectionDays.toFixed(2)} collection days`}
                            />
                            <ResultCard
                                title="Return on Assets"
                                value={formatPercent(result.returnOnAssets)}
                            />
                            <ResultCard
                                title="Return on Equity"
                                value={formatPercent(result.returnOnEquity)}
                            />
                        </ResultGrid>

                        <SectionCard>
                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="app-subtle-surface rounded-[1.1rem] px-4 py-3.5">
                                    <p className="app-card-title text-sm">Liquidity reading</p>
                                    <p className="app-body-md mt-2 text-sm">
                                        Quick assets total {formatPHP(result.quickAssets)}. Working
                                        capital is {formatPHP(result.workingCapital)}, with current
                                        ratio at {formatRatio(result.currentRatio)} and quick ratio
                                        at {formatRatio(result.quickRatio)}.
                                    </p>
                                </div>
                                <div className="app-subtle-surface rounded-[1.1rem] px-4 py-3.5">
                                    <p className="app-card-title text-sm">
                                        Turnover and returns
                                    </p>
                                    <p className="app-body-md mt-2 text-sm">
                                        Gross profit is {formatPHP(result.grossProfit)}. Inventory
                                        turns {formatRatio(result.inventoryTurnover)}, receivables
                                        turn {formatRatio(result.receivablesTurnover)}, ROA is{" "}
                                        {formatPercent(result.returnOnAssets)}, and ROE is{" "}
                                        {formatPercent(result.returnOnEquity)}.
                                    </p>
                                </div>
                            </div>
                        </SectionCard>

                        <ChartModeTabs value={chartMode} onChange={setChartMode} />

                        {chartMode === "chart" || chartMode === "comparison" ? (
                            <ComparisonBarsChart
                                title="Ratio comparison"
                                description="See the relative scale of the key liquidity and return ratios from the same data set."
                                items={[
                                    {
                                        label: "Current ratio",
                                        value: result.currentRatio,
                                        accent: "primary",
                                    },
                                    {
                                        label: "Quick ratio",
                                        value: result.quickRatio,
                                        accent: "secondary",
                                    },
                                    {
                                        label: "ROA",
                                        value: result.returnOnAssets * 100,
                                        accent: "highlight",
                                    },
                                    {
                                        label: "ROE",
                                        value: result.returnOnEquity * 100,
                                        accent: "highlight",
                                    },
                                ]}
                                referenceValue={result.quickRatio}
                                referenceLabel="quick ratio"
                            />
                        ) : chartMode === "table" ? (
                            <SectionCard>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="app-subtle-surface rounded-[1rem] px-4 py-3">
                                        <p className="app-card-title text-sm">Turnover days</p>
                                        <p className="app-body-md mt-2 text-sm">
                                            Inventory days:{" "}
                                            {result.inventoryDays.toFixed(2)} | Collection days:{" "}
                                            {result.collectionDays.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="app-subtle-surface rounded-[1rem] px-4 py-3">
                                        <p className="app-card-title text-sm">Returns</p>
                                        <p className="app-body-md mt-2 text-sm">
                                            ROA: {formatPercent(result.returnOnAssets)} | ROE:{" "}
                                            {formatPercent(result.returnOnEquity)}
                                        </p>
                                    </div>
                                </div>
                            </SectionCard>
                        ) : (
                            <ChartInsightPanel
                                title="Ratio interpretation"
                                meaning={buildComparisonNarrative(
                                    [
                                        {
                                            label: "Current ratio",
                                            value: result.currentRatio,
                                        },
                                        {
                                            label: "Quick ratio",
                                            value: result.quickRatio,
                                        },
                                        {
                                            label: "ROE (%)",
                                            value: result.returnOnEquity * 100,
                                        },
                                    ],
                                    { formatter: (value) => value.toFixed(2) }
                                )}
                                importance="Read the ratios together. A strong current ratio can still hide slow collections or weak returns."
                                highlights={buildChartHighlights([
                                    {
                                        label: "Current ratio",
                                        value: result.currentRatio,
                                    },
                                    {
                                        label: "ROE",
                                        value: result.returnOnEquity * 100,
                                    },
                                ], {
                                    formatter: (value) => value.toFixed(2),
                                })}
                            />
                        )}
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <div className="space-y-4">
                        <FormulaCard
                            formula="This workspace combines liquidity, turnover, and profitability ratios from one shared statement-data set."
                            steps={[
                                `Current ratio = current assets ${formatPHP(Number(currentAssets || 0))} / current liabilities ${formatPHP(Number(currentLiabilities || 0))} = ${formatRatio(result.currentRatio)}.`,
                                `Quick ratio = quick assets ${formatPHP(result.quickAssets)} / current liabilities ${formatPHP(Number(currentLiabilities || 0))} = ${formatRatio(result.quickRatio)}.`,
                                `Gross profit rate = gross profit ${formatPHP(result.grossProfit)} / net sales ${formatPHP(Number(netSales || 0))} = ${formatPercent(result.grossProfitRate)}.`,
                                `Inventory turnover = cost of goods sold ${formatPHP(Number(costOfGoodsSold || 0))} / average inventory ${formatPHP(Number(averageInventory || 0))} = ${formatRatio(result.inventoryTurnover)}.`,
                                `Receivables turnover = net credit sales ${formatPHP(
                                    Number(netCreditSales || netSales || 0)
                                )} / average receivables ${formatPHP(Number(averageAccountsReceivable || 0))} = ${formatRatio(result.receivablesTurnover)}.`,
                                `ROA = net income ${formatPHP(Number(netIncome || 0))} / average assets ${formatPHP(Number(averageTotalAssets || 0))} = ${formatPercent(result.returnOnAssets)}.`,
                                `ROE = net income ${formatPHP(Number(netIncome || 0))} / average equity ${formatPHP(Number(averageEquity || 0))} = ${formatPercent(result.returnOnEquity)}.`,
                            ]}
                            glossary={[
                                {
                                    term: "Quick assets",
                                    meaning:
                                        "Cash, marketable securities, and net receivables used in the acid-test ratio.",
                                },
                                {
                                    term: "Turnover days",
                                    meaning:
                                        "The day-based reading derived from a turnover ratio, using a 365-day year in this workspace.",
                                },
                            ]}
                            interpretation="Use the workspace when you need a compact statement-analysis view for assignments, review sets, or managerial discussion before drilling into individual ratio pages."
                            assumptions={[
                                "The workspace uses a 365-day basis for turnover-day readings.",
                                "Net credit sales defaults to net sales when you leave the override blank.",
                            ]}
                        />
                        <InterpretationBlock body="Read liquidity, turnover, and return ratios together so one strong metric does not hide weakness elsewhere in the statement set." />
                        <CommonMistakesBlock
                            mistakes={[
                                "Do not mix ending balances with average-balance ratios unless the assignment explicitly allows it.",
                                "A stronger current ratio does not automatically mean stronger cash collection discipline.",
                            ]}
                        />
                        <StudyTipBlock body="If ROE is much stronger than ROA, review leverage and not just profitability. The gap often matters more than the isolated headline number." />
                    </div>
                ) : null
            }
        />
    );
}
