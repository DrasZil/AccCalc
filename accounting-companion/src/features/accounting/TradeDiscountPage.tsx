import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeTradeDiscount } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function TradeDiscountPage() {
    const [invoice, setInvoice] = useState("");
    const [discountRate, setDiscountRate] = useState("");

    useSmartSolverConnector({
        invoice: setInvoice,
        discountRate: setDiscountRate,
    });

    const result = useMemo(() => {
        if (invoice.trim() === "" || discountRate.trim() === "") return null;

        const listPrice = Number(invoice);
        const rate = Number(discountRate);

        if ([listPrice, rate].some(Number.isNaN)) {
            return { error: "Both inputs must be valid numbers." };
        }

        if (listPrice <= 0) {
            return { error: "List price must be greater than zero." };
        }

        if (rate < 0 || rate > 100) {
            return { error: "Trade discount rate must be between 0% and 100%." };
        }

        const { discountAmount, netPrice } = computeTradeDiscount(listPrice, rate);

        return {
            discountAmount,
            netPrice,
            formula: "Net Price = List Price - (List Price x Trade Discount Rate)",
            steps: [
                `Trade discount amount = ${formatPHP(listPrice)} x ${(rate / 100).toFixed(4)} = ${formatPHP(discountAmount)}`,
                `Net price = ${formatPHP(listPrice)} - ${formatPHP(discountAmount)} = ${formatPHP(netPrice)}`,
            ],
            glossary: [
                { term: "List Price", meaning: "The catalog or quoted price before trade discount." },
                { term: "Trade Discount", meaning: "A reduction from list price usually granted to distributors, resellers, or large-volume buyers." },
                { term: "Net Price", meaning: "The invoice amount after deducting the trade discount." },
            ],
            interpretation: `After applying a ${rate.toFixed(2)}% trade discount, the buyer pays a net price of ${formatPHP(netPrice)} instead of the full list price.`,
        };
    }, [discountRate, invoice]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Merchandising"
            title="Trade Discount"
            description="Compute the trade discount amount and net price based on list price and trade discount rate."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard label="List Price" value={invoice} onChange={setInvoice} placeholder="10000" />
                        <InputCard label="Trade Discount (%)" value={discountRate} onChange={setDiscountRate} placeholder="20" />
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
                        <ResultCard title="Trade Discount Amount" value={formatPHP(result.discountAmount)} />
                        <ResultCard title="Net Price" value={formatPHP(result.netPrice)} />
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
