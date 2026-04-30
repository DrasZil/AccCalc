import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeInstallmentSalesReview } from "../../utils/calculatorMath";

export default function InstallmentSalesReviewPage() {
    const [contractPrice, setContractPrice] = useState("500000");
    const [costOfSales, setCostOfSales] = useState("350000");
    const [cashCollectedCurrent, setCashCollectedCurrent] = useState("180000");
    const [priorDeferredGrossProfit, setPriorDeferredGrossProfit] = useState("0");
    const [repossessedFairValue, setRepossessedFairValue] = useState("0");

    const result = useMemo(() => {
        const values = [
            contractPrice,
            costOfSales,
            cashCollectedCurrent,
            priorDeferredGrossProfit,
            repossessedFairValue,
        ];
        if (values.some((value) => value.trim() === "")) return null;

        const numeric = values.map((value) => Number(value));
        if (numeric.some((value) => Number.isNaN(value))) {
            return { error: "All installment-sales inputs must be valid numbers." };
        }
        if (numeric[0] <= 0 || numeric.slice(1).some((value) => value < 0)) {
            return {
                error:
                    "Contract price must be greater than zero, and cost, collections, deferred profit, and repossession value cannot be negative.",
            };
        }
        if (numeric[1] > numeric[0]) {
            return { error: "Cost of sales cannot exceed the contract price in this classroom review model." };
        }

        return computeInstallmentSalesReview({
            contractPrice: numeric[0],
            costOfSales: numeric[1],
            cashCollectedCurrent: numeric[2],
            priorDeferredGrossProfit: numeric[3],
            repossessedFairValue: numeric[4],
        });
    }, [
        cashCollectedCurrent,
        contractPrice,
        costOfSales,
        priorDeferredGrossProfit,
        repossessedFairValue,
    ]);

    return (
        <CalculatorPageLayout
            badge="AFAR | Special sales"
            title="Installment Sales Gross Profit Review"
            description="Review gross profit rate, realized gross profit from collections, ending deferred gross profit, and a repossession recovery signal for installment-sales style AFAR problems."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Contract Price" value={contractPrice} onChange={setContractPrice} />
                        <InputCard label="Cost of Sales" value={costOfSales} onChange={setCostOfSales} />
                        <InputCard label="Current Cash Collections" value={cashCollectedCurrent} onChange={setCashCollectedCurrent} />
                        <InputCard label="Prior Deferred Gross Profit" value={priorDeferredGrossProfit} onChange={setPriorDeferredGrossProfit} />
                        <InputCard label="Repossessed Asset Fair Value" value={repossessedFairValue} onChange={setRepossessedFairValue} />
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
                    <div className="space-y-4">
                        <ResultGrid columns={4}>
                            <ResultCard title="Gross Profit" value={formatPHP(result.grossProfit)} tone="accent" />
                            <ResultCard title="Gross Profit Rate" value={`${result.grossProfitRate.toFixed(2)}%`} />
                            <ResultCard title="Realized GP" value={formatPHP(result.realizedGrossProfit)} />
                            <ResultCard title="Ending Deferred GP" value={formatPHP(result.deferredGrossProfitEnd)} />
                        </ResultGrid>
                        <SectionCard>
                            <p className="app-card-title text-sm">Review signal</p>
                            <p className="app-body-md mt-2 text-sm">{result.reviewSignal}</p>
                            {Number(repossessedFairValue) > 0 ? (
                                <p className="app-helper mt-3 text-xs">
                                    Repossession comparison: {formatPHP(result.repossessionGainLoss)}.
                                </p>
                            ) : null}
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Gross profit rate = gross profit / contract price; realized GP = collections x gross profit rate"
                        steps={[
                            `Gross profit = ${formatPHP(Number(contractPrice))} - ${formatPHP(Number(costOfSales))} = ${formatPHP(result.grossProfit)}.`,
                            `Gross profit rate = ${result.grossProfitRate.toFixed(2)}%.`,
                            `Realized gross profit = collections x rate = ${formatPHP(result.realizedGrossProfit)}.`,
                            `Ending deferred gross profit = gross profit plus prior deferred GP less realized GP = ${formatPHP(result.deferredGrossProfitEnd)}.`,
                        ]}
                        interpretation="Use this as an AFAR reviewer aid for installment-sales style problems. Confirm the course's required reporting model and any updated standards before using it outside classroom review."
                        warnings={[
                            "Separate cash collection from revenue recognition before computing realized gross profit.",
                            "Repossession problems need fair value, remaining receivable, and deferred gross profit facts before a full conclusion.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
