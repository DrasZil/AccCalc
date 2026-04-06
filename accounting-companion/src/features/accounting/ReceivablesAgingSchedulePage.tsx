import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeReceivablesAgingSchedule } from "../../utils/calculatorMath";

type AgingRow = {
    id: string;
    label: string;
    amount: string;
    rate: string;
};

const DEFAULT_ROWS: AgingRow[] = [
    { id: "current", label: "Current", amount: "", rate: "1" },
    { id: "1-30", label: "1-30 days past due", amount: "", rate: "4" },
    { id: "31-60", label: "31-60 days past due", amount: "", rate: "10" },
    { id: "61-90", label: "61-90 days past due", amount: "", rate: "25" },
    { id: "90+", label: "Over 90 days", amount: "", rate: "50" },
];

function nextRowId() {
    return `aging-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export default function ReceivablesAgingSchedulePage() {
    const [rows, setRows] = useState<AgingRow[]>(DEFAULT_ROWS);
    const [existingAllowanceBalance, setExistingAllowanceBalance] = useState("");

    const result = useMemo(() => {
        const populatedRows = rows.filter(
            (row) => row.label.trim() !== "" || row.amount.trim() !== "" || row.rate.trim() !== ""
        );

        if (!populatedRows.length) return null;

        const parsedRows = populatedRows.map((row) => ({
            id: row.id,
            label: row.label.trim() || "Aging bucket",
            amount: Number(row.amount),
            estimatedUncollectibleRatePercent: Number(row.rate),
        }));

        const invalidRow = parsedRows.find(
            (row) =>
                Number.isNaN(row.amount) ||
                Number.isNaN(row.estimatedUncollectibleRatePercent)
        );

        if (invalidRow) {
            return { error: "Every aging row must contain a valid receivable amount and loss rate." };
        }

        if (
            parsedRows.some(
                (row) => row.amount < 0 || row.estimatedUncollectibleRatePercent < 0
            )
        ) {
            return { error: "Aging amounts and estimated loss rates cannot be negative." };
        }

        if (parsedRows.some((row) => row.estimatedUncollectibleRatePercent > 100)) {
            return { error: "Estimated uncollectible rates cannot exceed 100%." };
        }

        const parsedExistingAllowance =
            existingAllowanceBalance.trim() === "" ? 0 : Number(existingAllowanceBalance);

        if (Number.isNaN(parsedExistingAllowance)) {
            return { error: "Existing allowance balance must be a valid number." };
        }

        return computeReceivablesAgingSchedule({
            buckets: parsedRows,
            existingAllowanceBalance: parsedExistingAllowance,
        });
    }, [existingAllowanceBalance, rows]);

    function updateRow(id: string, patch: Partial<AgingRow>) {
        setRows((current) =>
            current.map((row) => (row.id === id ? { ...row, ...patch } : row))
        );
    }

    function addRow() {
        setRows((current) => [
            ...current,
            {
                id: nextRowId(),
                label: "",
                amount: "",
                rate: "",
            },
        ]);
    }

    function removeRow(id: string) {
        setRows((current) => current.filter((row) => row.id !== id));
    }

    return (
        <CalculatorPageLayout
            badge="Accounting / Receivables"
            title="Receivables Aging Schedule"
            description="Estimate the required ending allowance by aging receivables into risk buckets, then compare it with the existing allowance balance for the needed adjustment."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="app-card-title text-base">Aging buckets</p>
                                <p className="app-body-md mt-2 text-sm">
                                    Use as many buckets as you need. The schedule totals each bucket's
                                    expected loss and rolls it into the required ending allowance.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={addRow}
                                className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                            >
                                Add bucket
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            {rows.map((row, index) => (
                                <div key={row.id} className="app-subtle-surface rounded-[1.3rem] p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                            Bucket {index + 1}
                                        </p>
                                        {rows.length > 1 ? (
                                            <button
                                                type="button"
                                                onClick={() => removeRow(row.id)}
                                                className="app-button-ghost rounded-xl px-3 py-1.5 text-xs font-medium"
                                            >
                                                Remove
                                            </button>
                                        ) : null}
                                    </div>
                                    <div className="mt-3">
                                        <InputGrid columns={3}>
                                            <InputCard
                                                label="Bucket Label"
                                                value={row.label}
                                                onChange={(value) => updateRow(row.id, { label: value })}
                                                placeholder="Current"
                                            />
                                            <InputCard
                                                label="Receivable Amount"
                                                value={row.amount}
                                                onChange={(value) => updateRow(row.id, { amount: value })}
                                                placeholder="50000"
                                            />
                                            <InputCard
                                                label="Estimated Loss Rate (%)"
                                                value={row.rate}
                                                onChange={(value) => updateRow(row.id, { rate: value })}
                                                placeholder="4"
                                            />
                                        </InputGrid>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <InputGrid columns={1}>
                            <InputCard
                                label="Existing Allowance Balance (credit positive, debit negative)"
                                value={existingAllowanceBalance}
                                onChange={setExistingAllowanceBalance}
                                placeholder="3000"
                            />
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
                            <ResultCard
                                title="Total Receivables"
                                value={formatPHP(result.totalReceivables)}
                            />
                            <ResultCard
                                title="Required Ending Allowance"
                                value={formatPHP(result.requiredEndingAllowance)}
                            />
                            <ResultCard
                                title="Net Realizable Value"
                                value={formatPHP(result.netRealizableValue)}
                            />
                            <ResultCard
                                title="Needed Adjustment"
                                value={formatPHP(Math.abs(result.requiredAdjustment))}
                                supportingText={
                                    result.adjustmentDirection === "increase"
                                        ? "Increase allowance"
                                        : result.adjustmentDirection === "decrease"
                                          ? "Decrease allowance"
                                          : "No adjustment needed"
                                }
                            />
                        </ResultGrid>

                        <SectionCard>
                            <div className="space-y-3">
                                {result.rows.map((row) => (
                                    <div
                                        key={row.label}
                                        className="flex flex-col gap-2 rounded-[1.2rem] border app-divider px-4 py-3 md:flex-row md:items-center md:justify-between"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                {row.label}
                                            </p>
                                            <p className="app-helper mt-1 text-xs">
                                                {formatPHP(row.amount)} at{" "}
                                                {row.estimatedUncollectibleRatePercent.toFixed(2)}%
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                            Estimated loss: {formatPHP(row.estimatedLoss)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Required ending allowance = Sum of (Receivable bucket amount x estimated loss rate) for each aging bucket."
                        steps={[
                            ...result.rows.map(
                                (row) =>
                                    `${row.label}: ${formatPHP(row.amount)} x ${row.estimatedUncollectibleRatePercent.toFixed(
                                        2
                                    )}% = ${formatPHP(row.estimatedLoss)}`
                            ),
                            `Required ending allowance = ${formatPHP(result.requiredEndingAllowance)}.`,
                            `Existing allowance balance = ${formatPHP(result.existingAllowanceBalance)}.`,
                            `Required adjustment = ${formatPHP(result.requiredEndingAllowance)} - ${formatPHP(result.existingAllowanceBalance)} = ${formatPHP(result.requiredAdjustment)}.`,
                            `Net realizable value = ${formatPHP(result.totalReceivables)} - ${formatPHP(result.requiredEndingAllowance)} = ${formatPHP(result.netRealizableValue)}.`,
                        ]}
                        glossary={[
                            {
                                term: "Required ending allowance",
                                meaning:
                                    "The allowance balance that should remain after the adjusting entry based on the aging analysis.",
                            },
                            {
                                term: "Required adjustment",
                                meaning:
                                    "The period-end amount needed to raise or lower the current allowance balance to the required ending balance.",
                            },
                            {
                                term: "Net realizable value",
                                meaning:
                                    "The amount of receivables expected to be collected after deducting the required allowance.",
                            },
                        ]}
                        interpretation={`The aging schedule suggests an ending allowance of ${formatPHP(result.requiredEndingAllowance)} on total receivables of ${formatPHP(result.totalReceivables)}. That leaves a net realizable value of ${formatPHP(result.netRealizableValue)} and ${
                            result.adjustmentDirection === "increase"
                                ? "requires additional bad debt expense."
                                : result.adjustmentDirection === "decrease"
                                  ? "indicates the existing allowance is higher than required."
                                  : "does not require any allowance adjustment."
                        }`}
                        assumptions={[
                            "Enter an existing credit allowance balance as a positive amount. Enter a debit balance as a negative amount.",
                            "This page applies the aging-of-receivables approach, which targets the required ending allowance rather than applying one flat percentage to total receivables.",
                        ]}
                        warnings={[
                            "Do not add the required ending allowance directly to receivables. The allowance remains a contra asset and reduces receivables to net realizable value.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
