import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function CashDiscountPage() {
    const [invoice, setInvoice] = useState("");
    const [discountRate, setDiscountRate] = useState("");
    const [discountDays, setDiscountDays] = useState("");
    const [totalDays, setTotalDays] = useState("");
    const [daysPaid, setDaysPaid] = useState("");

    useSmartSolverConnector({
        invoice: setInvoice,
        discountRate: setDiscountRate,
        discountDays: setDiscountDays,
        totalDays: setTotalDays,
        daysPaid: setDaysPaid,
    });

    const result = useMemo(() => {
        if (
            invoice.trim() === "" ||
            discountRate.trim() === "" ||
            discountDays.trim() === "" ||
            totalDays.trim() === "" ||
            daysPaid.trim() === ""
        ) {
            return null;
        }

        const inv = Number(invoice);
        const rate = Number(discountRate);
        const dDays = Number(discountDays);
        const tDays = Number(totalDays);
        const paid = Number(daysPaid);

        if ([inv, rate, dDays, tDays, paid].some((value) => Number.isNaN(value))) {
            return { error: "All inputs must be valid numbers." };
        }

        if (inv <= 0) {
            return { error: "Invoice amount must be greater than zero." };
        }

        if (rate < 0 || rate > 100) {
            return { error: "Discount rate must be between 0% and 100%." };
        }

        if (dDays < 0 || tDays <= 0 || paid < 0) {
            return {
                error: "Discount days and days before payment cannot be negative, and total days must be greater than zero.",
            };
        }

        if (dDays > tDays) {
            return { error: "Discount days cannot be greater than the full credit term." };
        }

        const rateDecimal = rate / 100;
        const discountAmount = inv * rateDecimal;
        const applied = paid <= dDays;
        const amountToPay = applied ? inv - discountAmount : inv;

        return {
            applied,
            discountAmount,
            amountToPay,
            formula: "Discount = Invoice Amount x Discount Rate",
            steps: [
                `Invoice amount = ${formatPHP(inv)}`,
                `Discount rate = ${rate.toFixed(2)}% = ${rateDecimal.toFixed(4)}`,
                `Credit terms = ${rate.toFixed(2)}/${dDays}, n/${tDays}`,
                `Payment made after ${paid} day(s)`,
                `Discount amount = ${formatPHP(inv)} x ${rateDecimal.toFixed(4)} = ${formatPHP(discountAmount)}`,
                applied
                    ? `Payment is within the discount period, so amount to pay = ${formatPHP(inv)} - ${formatPHP(discountAmount)} = ${formatPHP(amountToPay)}`
                    : `Payment is beyond the discount period, so no cash discount applies and amount to pay remains ${formatPHP(amountToPay)}.`,
            ],
            glossary: [
                { term: "Cash Discount", meaning: "A reduction in the invoice amount for paying within the discount period." },
                { term: "Discount Period", meaning: "The number of days within which the customer may deduct the stated discount." },
                { term: "Full Credit Term", meaning: "The final due date for paying the invoice amount in full." },
            ],
            interpretation: applied
                ? `Because payment was made within ${dDays} day(s), the discount applies and the customer pays ${formatPHP(amountToPay)} instead of the full invoice amount.`
                : `Because payment was made after the ${dDays}-day discount period, the customer pays the full invoice amount of ${formatPHP(amountToPay)}.`,
        };
    }, [invoice, discountRate, discountDays, totalDays, daysPaid]);

    return (
        <CalculatorPageLayout
            badge="Accounting"
            title="Cash Discount / Credit Terms"
            description="Solve discount and payment amount for terms such as 2/10, n/30."
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
                        <p className="text-sm font-medium text-yellow-300">Input notice</p>
                        <p className="mt-2 text-sm leading-6 text-yellow-200">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={2}>
                        <ResultCard title="Discount Applied" value={result.applied ? "Yes" : "No"} />
                        <ResultCard title="Amount to Pay" value={formatPHP(result.amountToPay)} />
                        <ResultCard title="Discount Amount" value={formatPHP(result.discountAmount)} />
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
