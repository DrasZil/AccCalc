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
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

type MethodMode = "percent" | "aging";

type AgingRow = {
    id: string;
    label: string;
    amount: string;
    rate: string;
};

const DEFAULT_AGING_ROWS: AgingRow[] = [
    { id: "current", label: "Current", amount: "", rate: "1" },
    { id: "past-due", label: "Past due", amount: "", rate: "8" },
];

function nextRowId() {
    return `allowance-aging-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export default function AllowanceForDoubtfulAccountsPage() {
    const [method, setMethod] = useState<MethodMode>("percent");
    const [accountsReceivable, setAccountsReceivable] = useState("");
    const [estimatedUncollectibleRate, setEstimatedUncollectibleRate] = useState("");
    const [existingAllowanceBalance, setExistingAllowanceBalance] = useState("");
    const [agingRows, setAgingRows] = useState<AgingRow[]>(DEFAULT_AGING_ROWS);

    useSmartSolverConnector({
        accountsReceivable: setAccountsReceivable,
        estimatedUncollectibleRate: setEstimatedUncollectibleRate,
    });

    const result = useMemo(() => {
        if (method === "percent") {
            const values = [accountsReceivable, estimatedUncollectibleRate];

            if (values.some((value) => value.trim() === "")) return null;

            const parsedAccountsReceivable = Number(accountsReceivable);
            const parsedEstimatedUncollectibleRate = Number(estimatedUncollectibleRate);
            const numericValues = [parsedAccountsReceivable, parsedEstimatedUncollectibleRate];

            if (numericValues.some((value) => Number.isNaN(value))) {
                return {
                    error: "All inputs must be valid numbers.",
                };
            }

            if (parsedAccountsReceivable < 0 || parsedEstimatedUncollectibleRate < 0) {
                return {
                    error: "Values cannot be negative.",
                };
            }

            if (parsedEstimatedUncollectibleRate > 100) {
                return {
                    error: "Estimated uncollectible rate cannot be greater than 100%.",
                };
            }

            const allowance =
                parsedAccountsReceivable * (parsedEstimatedUncollectibleRate / 100);
            const netRealizableValue = parsedAccountsReceivable - allowance;

            return {
                mode: "percent" as const,
                allowance,
                netRealizableValue,
                formula:
                    "Allowance for Doubtful Accounts = Accounts Receivable x Estimated Uncollectible Rate",
                steps: [
                    `Allowance = ${formatPHP(parsedAccountsReceivable)} x ${parsedEstimatedUncollectibleRate}% = ${formatPHP(allowance)}`,
                    `Net realizable value = ${formatPHP(parsedAccountsReceivable)} - ${formatPHP(allowance)} = ${formatPHP(netRealizableValue)}`,
                ],
                interpretation: `Using the percentage-of-receivables method, the allowance is ${formatPHP(allowance)} on accounts receivable of ${formatPHP(parsedAccountsReceivable)}. The remaining ${formatPHP(netRealizableValue)} is the net amount expected to be collected.`,
            };
        }

        const populatedRows = agingRows.filter(
            (row) => row.label.trim() !== "" || row.amount.trim() !== "" || row.rate.trim() !== ""
        );

        if (!populatedRows.length) return null;

        const parsedRows = populatedRows.map((row) => ({
            label: row.label.trim() || "Aging bucket",
            amount: Number(row.amount),
            estimatedUncollectibleRatePercent: Number(row.rate),
        }));

        if (
            parsedRows.some(
                (row) =>
                    Number.isNaN(row.amount) ||
                    Number.isNaN(row.estimatedUncollectibleRatePercent)
            )
        ) {
            return {
                error: "Each aging bucket needs a valid amount and estimated loss rate.",
            };
        }

        if (
            parsedRows.some(
                (row) => row.amount < 0 || row.estimatedUncollectibleRatePercent < 0
            )
        ) {
            return {
                error: "Aging amounts and estimated loss rates cannot be negative.",
            };
        }

        if (parsedRows.some((row) => row.estimatedUncollectibleRatePercent > 100)) {
            return {
                error: "Estimated loss rates cannot exceed 100%.",
            };
        }

        const parsedExistingAllowance =
            existingAllowanceBalance.trim() === "" ? 0 : Number(existingAllowanceBalance);

        if (Number.isNaN(parsedExistingAllowance)) {
            return {
                error: "Existing allowance balance must be a valid number.",
            };
        }

        return {
            mode: "aging" as const,
            ...computeReceivablesAgingSchedule({
                buckets: parsedRows,
                existingAllowanceBalance: parsedExistingAllowance,
            }),
        };
    }, [
        accountsReceivable,
        agingRows,
        estimatedUncollectibleRate,
        existingAllowanceBalance,
        method,
    ]);

    function updateAgingRow(id: string, patch: Partial<AgingRow>) {
        setAgingRows((current) =>
            current.map((row) => (row.id === id ? { ...row, ...patch } : row))
        );
    }

    return (
        <CalculatorPageLayout
            badge="Accounting / Receivables"
            title="Allowance for Doubtful Accounts"
            description="Switch between a quick percentage estimate and an aging-of-receivables schedule so the tool fits both straightforward classwork and more realistic allowance analysis."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setMethod("percent")}
                                className={[
                                    "rounded-xl px-4 py-2 text-sm font-medium",
                                    method === "percent" ? "app-button-primary" : "app-button-secondary",
                                ].join(" ")}
                            >
                                Percentage method
                            </button>
                            <button
                                type="button"
                                onClick={() => setMethod("aging")}
                                className={[
                                    "rounded-xl px-4 py-2 text-sm font-medium",
                                    method === "aging" ? "app-button-primary" : "app-button-secondary",
                                ].join(" ")}
                            >
                                Aging schedule
                            </button>
                        </div>
                        <p className="app-body-md mt-3 text-sm">
                            {method === "percent"
                                ? "Use this for direct percentage-of-receivables problems where one estimated loss rate applies to the whole balance."
                                : "Use this when different aging buckets carry different expected loss rates and you need the required ending allowance plus the adjusting entry amount."}
                        </p>
                    </SectionCard>

                    {method === "percent" ? (
                        <SectionCard>
                            <InputGrid columns={2}>
                                <InputCard
                                    label="Accounts Receivable"
                                    value={accountsReceivable}
                                    onChange={setAccountsReceivable}
                                    placeholder="50000"
                                />
                                <InputCard
                                    label="Estimated Uncollectible Rate (%)"
                                    value={estimatedUncollectibleRate}
                                    onChange={setEstimatedUncollectibleRate}
                                    placeholder="5"
                                />
                            </InputGrid>
                        </SectionCard>
                    ) : (
                        <>
                            <SectionCard>
                                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                    <div>
                                        <p className="app-card-title text-base">Aging buckets</p>
                                        <p className="app-body-md mt-2 text-sm">
                                            Expand the schedule whenever one rate is too simplistic for
                                            the receivables mix.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setAgingRows((current) => [
                                                ...current,
                                                {
                                                    id: nextRowId(),
                                                    label: "",
                                                    amount: "",
                                                    rate: "",
                                                },
                                            ])
                                        }
                                        className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                                    >
                                        Add bucket
                                    </button>
                                </div>

                                <div className="mt-4 space-y-3">
                                    {agingRows.map((row) => (
                                        <div
                                            key={row.id}
                                            className="app-subtle-surface rounded-[1.3rem] p-4"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                    {row.label || "Aging bucket"}
                                                </p>
                                                {agingRows.length > 1 ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setAgingRows((current) =>
                                                                current.filter(
                                                                    (entry) => entry.id !== row.id
                                                                )
                                                            )
                                                        }
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
                                                        onChange={(value) =>
                                                            updateAgingRow(row.id, { label: value })
                                                        }
                                                        placeholder="Current"
                                                    />
                                                    <InputCard
                                                        label="Receivable Amount"
                                                        value={row.amount}
                                                        onChange={(value) =>
                                                            updateAgingRow(row.id, { amount: value })
                                                        }
                                                        placeholder="25000"
                                                    />
                                                    <InputCard
                                                        label="Estimated Loss Rate (%)"
                                                        value={row.rate}
                                                        onChange={(value) =>
                                                            updateAgingRow(row.id, { rate: value })
                                                        }
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
                        </>
                    )}
                </div>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="app-tone-warning">
                        <p className="app-card-title text-sm">Input notice</p>
                        <p className="app-body-md mt-2 text-sm">{result.error}</p>
                    </SectionCard>
                ) : result?.mode === "percent" ? (
                    <ResultGrid columns={2}>
                        <ResultCard
                            title="Allowance for Doubtful Accounts"
                            value={formatPHP(result.allowance)}
                        />
                        <ResultCard
                            title="Net Realizable Value"
                            value={formatPHP(result.netRealizableValue)}
                        />
                    </ResultGrid>
                ) : result?.mode === "aging" ? (
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
                                title="Needed Adjustment"
                                value={formatPHP(Math.abs(result.requiredAdjustment))}
                                supportingText={
                                    result.adjustmentDirection === "increase"
                                        ? "Increase allowance"
                                        : result.adjustmentDirection === "decrease"
                                          ? "Decrease allowance"
                                          : "No adjustment"
                                }
                            />
                            <ResultCard
                                title="Net Realizable Value"
                                value={formatPHP(result.netRealizableValue)}
                            />
                        </ResultGrid>

                        <SectionCard>
                            <div className="space-y-3">
                                {result.rows.map((row) => (
                                    <div
                                        key={row.label}
                                        className="grid gap-2 rounded-[1.2rem] border app-divider px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                {row.label}
                                            </p>
                                            <p className="app-helper mt-1 text-xs">
                                                {formatPHP(row.amount)} at{" "}
                                                {row.estimatedUncollectibleRatePercent.toFixed(2)}%
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold text-[color:var(--app-text)] md:text-right">
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
                result?.mode === "percent" ? (
                    <FormulaCard
                        formula={result.formula}
                        steps={result.steps}
                        interpretation={result.interpretation}
                        assumptions={[
                            "This quick method applies one rate to the full receivables balance instead of targeting an ending allowance by aging bucket.",
                        ]}
                    />
                ) : result?.mode === "aging" ? (
                    <FormulaCard
                        formula="Required ending allowance = Sum of (Receivable bucket amount x estimated loss rate) across all aging buckets."
                        steps={[
                            ...result.rows.map(
                                (row) =>
                                    `${row.label}: ${formatPHP(row.amount)} x ${row.estimatedUncollectibleRatePercent.toFixed(
                                        2
                                    )}% = ${formatPHP(row.estimatedLoss)}`
                            ),
                            `Required ending allowance = ${formatPHP(result.requiredEndingAllowance)}.`,
                            `Required adjustment = ${formatPHP(result.requiredEndingAllowance)} - ${formatPHP(result.existingAllowanceBalance)} = ${formatPHP(result.requiredAdjustment)}.`,
                            `Net realizable value = ${formatPHP(result.totalReceivables)} - ${formatPHP(result.requiredEndingAllowance)} = ${formatPHP(result.netRealizableValue)}.`,
                        ]}
                        interpretation={`The aging schedule calls for an ending allowance of ${formatPHP(result.requiredEndingAllowance)}. Against the existing allowance balance of ${formatPHP(result.existingAllowanceBalance)}, the period-end adjustment is ${formatPHP(result.requiredAdjustment)} and the receivables should be reported at a net realizable value of ${formatPHP(result.netRealizableValue)}.`}
                        assumptions={[
                            "A positive existing allowance balance represents a normal credit balance. Enter a debit balance as a negative number.",
                            "The aging method targets the required ending allowance, so the adjusting entry is the difference between the required ending balance and the current allowance balance.",
                        ]}
                        warnings={[
                            "Do not confuse the required ending allowance with the adjustment amount. The adjusting entry is only the amount needed to move from the current allowance balance to the required ending balance.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
