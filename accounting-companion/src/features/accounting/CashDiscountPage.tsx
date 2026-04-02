import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";

export default function CashDiscountPage() {
    const [invoice, setInvoice] = useState("");
    const [discountRate, setDiscountRate] = useState("");
    const [discountDays, setDiscountDays] = useState("");
    const [totalDays, setTotalDays] = useState("");
    const [daysPaid, setDaysPaid] = useState("");

    const result = useMemo(() => {
        if (!invoice || !discountRate || !discountDays || !totalDays || !daysPaid)
        return null;

        const inv = Number(invoice);
        const rate = Number(discountRate);
        const dDays = Number(discountDays);
        const tDays = Number(totalDays);
        const paid = Number(daysPaid);

        if ([inv, rate, dDays, tDays, paid].some(isNaN)) {
        return { error: "All inputs must be valid numbers." };
        }

        const rateDecimal = rate / 100;
        const discountAmount = inv * rateDecimal;

        let applied = false;
        let amountToPay = inv;

        if (paid <= dDays) {
        applied = true;
        amountToPay = inv - discountAmount;
        }

        return {
        applied,
        discountAmount,
        amountToPay,
        formula: <>Discount = Invoice × Rate</>,
        steps: [
            <>Invoice = {inv}</>,
            <>Rate = {rate}% = {rateDecimal}</>,
            <>Discount Period = {dDays} days</>,
            <>Payment made in {paid} days</>,
            <>
            Discount = {inv} × {rateDecimal.toFixed(4)} = {discountAmount.toFixed(2)}
            </>,
            applied ? (
            <>
                Payment is within discount period → Discount applies  
                Amount to Pay = {inv} - {discountAmount.toFixed(2)} = {amountToPay.toFixed(2)}
            </>
            ) : (
            <>
                Payment is beyond discount period → No discount  
                Amount to Pay = {amountToPay.toFixed(2)}
            </>
            ),
        ],
        };
    }, [invoice, discountRate, discountDays, totalDays, daysPaid]);

    return (
        <CalculatorPageLayout
        badge="Accounting"
        title="Cash Discount / Credit Terms"
        description="Solve discount and payment amount for Terms (e.g. 2/10, n/30)"
        inputSection={
            <InputGrid columns={3}>
            <InputCard label="Invoice Amount" value={invoice} onChange={setInvoice} placeholder="10000" />
            <InputCard label="Discount (%)" value={discountRate} onChange={setDiscountRate} placeholder="2" />
            <InputCard label="Discount Days" value={discountDays} onChange={setDiscountDays} placeholder="10" />
            <InputCard label="Total Days" value={totalDays} onChange={setTotalDays} placeholder="30" />
            <InputCard label="Days Before Payment" value={daysPaid} onChange={setDaysPaid} placeholder="8" />
            </InputGrid>
        }
        resultSection={
            result && "error" in result ? (
            <SectionCard className="border-yellow-400/20 bg-yellow-500/10">
                <p className="text-yellow-300">{result.error}</p>
            </SectionCard>
            ) : result ? (
            <ResultGrid columns={2}>
                <ResultCard
                title="Discount Applied"
                value={result.applied ? "Yes" : "No"}
                />
                <ResultCard
                title="Amount to Pay"
                value={formatPHP(result.amountToPay)}
                />
                <ResultCard
                title="Discount Amount"
                value={formatPHP(result.discountAmount)}
                />
            </ResultGrid>
            ) : null
        }
        explanationSection={
            result && !("error" in result) ? (
            <FormulaCard formula={result.formula} steps={result.steps} />
            ) : null
        }
        />
    );
}