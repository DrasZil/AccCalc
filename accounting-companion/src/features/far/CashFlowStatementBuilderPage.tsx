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
import { buildChartHighlights } from "../../utils/charts/chartHighlights";
import { buildComparisonNarrative } from "../../utils/charts/chartNarratives";
import formatPHP from "../../utils/formatPHP";
import { computeStatementOfCashFlows } from "../../utils/calculatorMath";

export default function CashFlowStatementBuilderPage() {
    const [netIncome, setNetIncome] = useState("");
    const [depreciationExpense, setDepreciationExpense] = useState("");
    const [impairmentLoss, setImpairmentLoss] = useState("");
    const [gainOnAssetSale, setGainOnAssetSale] = useState("");
    const [accountsReceivableIncrease, setAccountsReceivableIncrease] = useState("");
    const [inventoryIncrease, setInventoryIncrease] = useState("");
    const [accountsPayableIncrease, setAccountsPayableIncrease] = useState("");
    const [capitalExpenditures, setCapitalExpenditures] = useState("");
    const [assetSaleProceeds, setAssetSaleProceeds] = useState("");
    const [debtProceeds, setDebtProceeds] = useState("");
    const [debtRepayments, setDebtRepayments] = useState("");
    const [shareIssuanceProceeds, setShareIssuanceProceeds] = useState("");
    const [dividendsPaid, setDividendsPaid] = useState("");
    const [openingCashBalance, setOpeningCashBalance] = useState("");

    const result = useMemo(() => {
        if (netIncome.trim() === "" || depreciationExpense.trim() === "") return null;
        const coreValues = [Number(netIncome), Number(depreciationExpense)];
        if (coreValues.some((value) => Number.isNaN(value))) {
            return { error: "Net income and depreciation must be valid numbers before the cash-flow builder can run." };
        }

        return computeStatementOfCashFlows({
            netIncome: coreValues[0],
            depreciationExpense: coreValues[1],
            impairmentLoss: impairmentLoss.trim() === "" ? 0 : Number(impairmentLoss),
            gainOnAssetSale: gainOnAssetSale.trim() === "" ? 0 : Number(gainOnAssetSale),
            accountsReceivableIncrease:
                accountsReceivableIncrease.trim() === "" ? 0 : Number(accountsReceivableIncrease),
            inventoryIncrease: inventoryIncrease.trim() === "" ? 0 : Number(inventoryIncrease),
            accountsPayableIncrease:
                accountsPayableIncrease.trim() === "" ? 0 : Number(accountsPayableIncrease),
            capitalExpenditures: capitalExpenditures.trim() === "" ? 0 : Number(capitalExpenditures),
            assetSaleProceeds: assetSaleProceeds.trim() === "" ? 0 : Number(assetSaleProceeds),
            debtProceeds: debtProceeds.trim() === "" ? 0 : Number(debtProceeds),
            debtRepayments: debtRepayments.trim() === "" ? 0 : Number(debtRepayments),
            shareIssuanceProceeds:
                shareIssuanceProceeds.trim() === "" ? 0 : Number(shareIssuanceProceeds),
            dividendsPaid: dividendsPaid.trim() === "" ? 0 : Number(dividendsPaid),
            openingCashBalance:
                openingCashBalance.trim() === "" ? 0 : Number(openingCashBalance),
        });
    }, [
        accountsPayableIncrease,
        accountsReceivableIncrease,
        assetSaleProceeds,
        capitalExpenditures,
        debtProceeds,
        debtRepayments,
        depreciationExpense,
        dividendsPaid,
        gainOnAssetSale,
        impairmentLoss,
        inventoryIncrease,
        netIncome,
        openingCashBalance,
        shareIssuanceProceeds,
    ]);

    return (
        <CalculatorPageLayout
            badge="FAR"
            title="Statement of Cash Flows Builder"
            description="Build an indirect-method cash-flow view across operating, investing, and financing activities, then connect the result to opening and ending cash."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-card-title text-sm">Operating activities inputs</p>
                        <InputGrid columns={2}>
                            <InputCard label="Net Income" value={netIncome} onChange={setNetIncome} placeholder="980000" />
                            <InputCard label="Depreciation Expense" value={depreciationExpense} onChange={setDepreciationExpense} placeholder="140000" />
                            <InputCard label="Impairment Loss" value={impairmentLoss} onChange={setImpairmentLoss} placeholder="0" />
                            <InputCard label="Gain on Asset Sale" value={gainOnAssetSale} onChange={setGainOnAssetSale} placeholder="25000" />
                            <InputCard label="Increase in Accounts Receivable" value={accountsReceivableIncrease} onChange={setAccountsReceivableIncrease} placeholder="40000" />
                            <InputCard label="Increase in Inventory" value={inventoryIncrease} onChange={setInventoryIncrease} placeholder="30000" />
                            <InputCard label="Increase in Accounts Payable" value={accountsPayableIncrease} onChange={setAccountsPayableIncrease} placeholder="22000" />
                        </InputGrid>
                    </SectionCard>
                    <SectionCard>
                        <p className="app-card-title text-sm">Investing and financing inputs</p>
                        <InputGrid columns={2}>
                            <InputCard label="Capital Expenditures" value={capitalExpenditures} onChange={setCapitalExpenditures} placeholder="280000" />
                            <InputCard label="Asset Sale Proceeds" value={assetSaleProceeds} onChange={setAssetSaleProceeds} placeholder="90000" />
                            <InputCard label="Debt Proceeds" value={debtProceeds} onChange={setDebtProceeds} placeholder="160000" />
                            <InputCard label="Debt Repayments" value={debtRepayments} onChange={setDebtRepayments} placeholder="70000" />
                            <InputCard label="Share Issuance Proceeds" value={shareIssuanceProceeds} onChange={setShareIssuanceProceeds} placeholder="50000" />
                            <InputCard label="Dividends Paid" value={dividendsPaid} onChange={setDividendsPaid} placeholder="60000" />
                            <InputCard label="Opening Cash Balance" value={openingCashBalance} onChange={setOpeningCashBalance} placeholder="320000" />
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
                            <ResultCard title="Cash from Operations" value={formatPHP(result.operatingCashFlow)} tone="accent" />
                            <ResultCard title="Cash from Investing" value={formatPHP(result.investingCashFlow)} />
                            <ResultCard title="Cash from Financing" value={formatPHP(result.financingCashFlow)} />
                            <ResultCard title="Net Change in Cash" value={formatPHP(result.netChangeInCash)} />
                            <ResultCard title="Ending Cash Balance" value={formatPHP(result.endingCashBalance)} />
                        </ResultGrid>
                        <ComparisonBarsChart
                            title="Cash-flow section comparison"
                            description="Read which statement section is adding cash and which section is absorbing cash in the current setup."
                            items={[
                                { label: "Operating", value: result.operatingCashFlow, accent: "primary" },
                                { label: "Investing", value: result.investingCashFlow, accent: "secondary" },
                                { label: "Financing", value: result.financingCashFlow, accent: "highlight" },
                            ]}
                            formatter={formatPHP}
                            referenceValue={0}
                            referenceLabel="neutral cash line"
                            caption="Positive bars increase cash, while negative bars show sections that consume cash in this indirect-method view."
                        />
                        <ChartInsightPanel
                            title="Cash-flow interpretation"
                            meaning={buildComparisonNarrative(
                                [
                                    { label: "Operating", value: Math.abs(result.operatingCashFlow) },
                                    { label: "Investing", value: Math.abs(result.investingCashFlow) },
                                    { label: "Financing", value: Math.abs(result.financingCashFlow) },
                                ],
                                { formatter: formatPHP }
                            )}
                            importance={`Net cash changed by ${formatPHP(result.netChangeInCash)}, leading to an ending cash balance of ${formatPHP(result.endingCashBalance)} after combining operating, investing, and financing movements.`}
                            highlights={buildChartHighlights(
                                [
                                    { label: "Operating", value: Math.abs(result.operatingCashFlow) },
                                    { label: "Investing", value: Math.abs(result.investingCashFlow) },
                                    { label: "Financing", value: Math.abs(result.financingCashFlow) },
                                ],
                                { formatter: formatPHP }
                            )}
                        />
                        <SectionCard>
                            <p className="app-card-title text-sm">Classification reminders</p>
                            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                                {result.classificationNotes.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Net change in cash = operating cash flow + investing cash flow + financing cash flow"
                        steps={[
                            `Operating cash flow = ${formatPHP(result.operatingCashFlow)}.`,
                            `Investing cash flow = ${formatPHP(result.investingCashFlow)}.`,
                            `Financing cash flow = ${formatPHP(result.financingCashFlow)}.`,
                            `Ending cash balance = opening cash + net change = ${formatPHP(result.endingCashBalance)}.`,
                        ]}
                        interpretation="Use this builder to organize an indirect-method statement of cash flows. It is especially helpful when the case is really about classification and adjustments, not just arithmetic."
                        warnings={[
                            "Keep the sign convention consistent. Increases in operating assets usually reduce operating cash flow, while increases in operating liabilities usually support it.",
                            "This first-pass builder is focused on common classroom classification patterns rather than every specialized cash-flow disclosure issue.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
