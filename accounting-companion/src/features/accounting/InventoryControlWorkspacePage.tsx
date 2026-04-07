import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import ComparisonBarsChart from "../../components/ComparisonBarsChart";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeCashDiscount, computeInventoryShrinkage } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

export default function InventoryControlWorkspacePage() {
    const [bookUnits, setBookUnits] = useState("");
    const [physicalUnits, setPhysicalUnits] = useState("");
    const [costPerUnit, setCostPerUnit] = useState("");
    const [invoiceAmount, setInvoiceAmount] = useState("");
    const [discountRate, setDiscountRate] = useState("");
    const [discountDays, setDiscountDays] = useState("");
    const [daysPaid, setDaysPaid] = useState("");

    const result = useMemo(() => {
        const values = [
            bookUnits,
            physicalUnits,
            costPerUnit,
            invoiceAmount,
            discountRate,
            discountDays,
            daysPaid,
        ];
        if (values.some((value) => value.trim() === "")) return null;
        const parsed = values.map((value) => Number(value));
        if (parsed.some((value) => Number.isNaN(value) || value < 0)) {
            return { error: "All values must be valid non-negative numbers." };
        }

        return {
            shrinkage: computeInventoryShrinkage({
                bookUnits: parsed[0],
                physicalUnits: parsed[1],
                costPerUnit: parsed[2],
            }),
            discount: computeCashDiscount({
                invoiceAmount: parsed[3],
                discountRatePercent: parsed[4],
                discountDays: parsed[5],
                daysPaid: parsed[6],
            }),
        };
    }, [bookUnits, costPerUnit, daysPaid, discountDays, discountRate, invoiceAmount, physicalUnits]);

    return (
        <CalculatorPageLayout
            badge="Accounting"
            title="Inventory Control Workspace"
            description="Review shrinkage and purchase-discount discipline in one accounting control view."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Book Units" value={bookUnits} onChange={setBookUnits} placeholder="1200" />
                        <InputCard label="Physical Units" value={physicalUnits} onChange={setPhysicalUnits} placeholder="1160" />
                        <InputCard label="Cost per Unit" value={costPerUnit} onChange={setCostPerUnit} placeholder="145" />
                        <InputCard label="Invoice Amount" value={invoiceAmount} onChange={setInvoiceAmount} placeholder="82000" />
                        <InputCard label="Discount Rate (%)" value={discountRate} onChange={setDiscountRate} placeholder="2" />
                        <InputCard label="Discount Days" value={discountDays} onChange={setDiscountDays} placeholder="10" />
                        <InputCard label="Days Paid" value={daysPaid} onChange={setDaysPaid} placeholder="18" />
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
                            <ResultCard title="Shrinkage Units" value={result.shrinkage.shrinkageUnits.toFixed(0)} />
                            <ResultCard title="Shrinkage Amount" value={formatPHP(result.shrinkage.shrinkageAmount)} tone="accent" />
                            <ResultCard title="Discount Amount" value={formatPHP(result.discount.discountAmount)} />
                            <ResultCard title="Amount to Pay" value={formatPHP(result.discount.amountToPay)} />
                        </ResultGrid>

                        <ComparisonBarsChart
                            title="Control view"
                            description="Shrinkage highlights inventory control pressure, while discount discipline shows whether supplier terms are being used well."
                            items={[
                                { label: "Shrinkage amount", value: result.shrinkage.shrinkageAmount, accent: "highlight" },
                                { label: "Discount available", value: result.discount.discountAmount, accent: "primary" },
                                { label: "Cash paid", value: result.discount.amountToPay, accent: "secondary" },
                            ]}
                            formatter={(value) => formatPHP(value)}
                        />
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Shrinkage = book units - physical units. Discount savings follow the supplier's cash-discount terms."
                        steps={[
                            `Shrinkage units = ${bookUnits} - ${physicalUnits} = ${result.shrinkage.shrinkageUnits.toFixed(0)}.`,
                            `Shrinkage amount = ${result.shrinkage.shrinkageUnits.toFixed(0)} × ${formatPHP(Number(costPerUnit))} = ${formatPHP(result.shrinkage.shrinkageAmount)}.`,
                            `Discount amount = ${formatPHP(Number(invoiceAmount))} × ${Number(discountRate).toFixed(2)}% = ${formatPHP(result.discount.discountAmount)}.`,
                        ]}
                        interpretation={`This workspace shows whether inventory records are overstated relative to the count on hand and whether payment timing is using available purchase discounts efficiently.`}
                    />
                ) : null
            }
        />
    );
}
