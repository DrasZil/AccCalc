import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeForeignCurrencyTranslation } from "../../utils/calculatorMath";

export default function ForeignCurrencyTranslationPage() {
    const [foreignCurrencyAmount, setForeignCurrencyAmount] = useState("");
    const [transactionRate, setTransactionRate] = useState("");
    const [closingRate, setClosingRate] = useState("");
    const [settlementRate, setSettlementRate] = useState("");

    const result = useMemo(() => {
        if (
            foreignCurrencyAmount.trim() === "" ||
            transactionRate.trim() === "" ||
            closingRate.trim() === ""
        ) {
            return null;
        }

        const required = [
            Number(foreignCurrencyAmount),
            Number(transactionRate),
            Number(closingRate),
        ];

        if (required.some((value) => Number.isNaN(value))) {
            return { error: "Foreign amount, transaction rate, and closing rate must be valid numbers." };
        }

        return computeForeignCurrencyTranslation({
            foreignCurrencyAmount: required[0],
            transactionRate: required[1],
            closingRate: required[2],
            settlementRate: settlementRate.trim() === "" ? undefined : Number(settlementRate),
        });
    }, [closingRate, foreignCurrencyAmount, settlementRate, transactionRate]);

    return (
        <CalculatorPageLayout
            badge="AFAR"
            title="Foreign Currency Translation Workspace"
            description="Translate a foreign-currency monetary item at the transaction date, closing date, and settlement date so exchange differences stay visible."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="Foreign-Currency Amount" value={foreignCurrencyAmount} onChange={setForeignCurrencyAmount} placeholder="250000" />
                        <InputCard label="Transaction Rate" value={transactionRate} onChange={setTransactionRate} placeholder="56.20" helperText="Enter the reporting-currency equivalent for one unit of foreign currency." />
                        <InputCard label="Closing Rate" value={closingRate} onChange={setClosingRate} placeholder="57.40" />
                        <InputCard label="Settlement Rate" value={settlementRate} onChange={setSettlementRate} placeholder="58.10" helperText="Optional. Leave blank when the item has not yet settled." />
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
                        <ResultCard title="Initial Recognition" value={formatPHP(result.initialRecognitionAmount)} tone="accent" />
                        <ResultCard title="Closing Carrying Amount" value={formatPHP(result.closingCarryingAmount)} />
                        <ResultCard title="Unrealized Exchange Difference" value={formatPHP(result.unrealizedExchangeDifference)} />
                        <ResultCard title="Realized Exchange Difference" value={result.realizedExchangeDifference === null ? "Not settled" : formatPHP(result.realizedExchangeDifference)} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Reporting-currency amount = foreign-currency amount x applicable exchange rate"
                        steps={[
                            `Initial recognition amount = ${formatPHP(result.initialRecognitionAmount)}.`,
                            `Closing carrying amount = ${formatPHP(result.closingCarryingAmount)}.`,
                            `Unrealized exchange difference = ${formatPHP(result.unrealizedExchangeDifference)}.`,
                            result.realizedExchangeDifference === null
                                ? "No settlement rate was entered, so realized exchange difference is not yet computed."
                                : `Realized exchange difference = ${formatPHP(result.realizedExchangeDifference)}.`,
                        ]}
                        interpretation="This workspace is most useful for monetary foreign-currency items. It helps separate transaction-date recognition from closing translation and final settlement."
                        warnings={[
                            "Foreign operations translation, OCI treatment, and consolidation translation adjustments need broader AFAR analysis beyond this page.",
                            "Keep the exchange-rate quote convention consistent across all rates in the case.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
