import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeLowerOfCostOrNrv } from "../../utils/calculatorMath";

type InventoryRow = {
    id: string;
    label: string;
    cost: string;
    netRealizableValue: string;
};

const DEFAULT_ROWS: InventoryRow[] = [
    { id: "inventory-a", label: "Item A", cost: "", netRealizableValue: "" },
    { id: "inventory-b", label: "Item B", cost: "", netRealizableValue: "" },
];

function nextRowId() {
    return `lcnrv-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export default function LowerOfCostOrNRVPage() {
    const [method, setMethod] = useState<"item-by-item" | "aggregate">(
        "item-by-item"
    );
    const [rows, setRows] = useState<InventoryRow[]>(DEFAULT_ROWS);

    const result = useMemo(() => {
        const populatedRows = rows.filter(
            (row) =>
                row.label.trim() !== "" ||
                row.cost.trim() !== "" ||
                row.netRealizableValue.trim() !== ""
        );

        if (!populatedRows.length) return null;

        const parsedRows = populatedRows.map((row) => ({
            label: row.label.trim() || "Inventory item",
            cost: Number(row.cost),
            netRealizableValue: Number(row.netRealizableValue),
        }));

        if (
            parsedRows.some(
                (row) =>
                    Number.isNaN(row.cost) || Number.isNaN(row.netRealizableValue)
            )
        ) {
            return { error: "Each row needs valid cost and net realizable value amounts." };
        }

        if (parsedRows.some((row) => row.cost < 0 || row.netRealizableValue < 0)) {
            return { error: "Cost and net realizable value cannot be negative." };
        }

        return computeLowerOfCostOrNrv({ items: parsedRows, method });
    }, [method, rows]);

    function updateRow(id: string, patch: Partial<InventoryRow>) {
        setRows((current) =>
            current.map((row) => (row.id === id ? { ...row, ...patch } : row))
        );
    }

    return (
        <CalculatorPageLayout
            badge="Accounting / Inventory"
            title="Lower of Cost or NRV"
            description="Compare inventory cost against net realizable value item by item or on an aggregate basis, then surface the write-down needed under the selected textbook method."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setMethod("item-by-item")}
                                className={[
                                    "rounded-xl px-4 py-2 text-sm font-medium",
                                    method === "item-by-item"
                                        ? "app-button-primary"
                                        : "app-button-secondary",
                                ].join(" ")}
                            >
                                Item by item
                            </button>
                            <button
                                type="button"
                                onClick={() => setMethod("aggregate")}
                                className={[
                                    "rounded-xl px-4 py-2 text-sm font-medium",
                                    method === "aggregate"
                                        ? "app-button-primary"
                                        : "app-button-secondary",
                                ].join(" ")}
                            >
                                Aggregate
                            </button>
                        </div>
                        <p className="app-body-md mt-3 text-sm">
                            {method === "item-by-item"
                                ? "This is the more conservative classroom approach because each item is compared separately."
                                : "Use this only when the problem or policy explicitly permits aggregate comparison across the listed group."}
                        </p>
                    </SectionCard>

                    <SectionCard>
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="app-card-title text-base">Inventory lines</p>
                                <p className="app-body-md mt-2 text-sm">
                                    Add as many inventory items or groups as the valuation problem
                                    requires.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setRows((current) => [
                                        ...current,
                                        {
                                            id: nextRowId(),
                                            label: "",
                                            cost: "",
                                            netRealizableValue: "",
                                        },
                                    ])
                                }
                                className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                            >
                                Add line
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            {rows.map((row, index) => (
                                <div
                                    key={row.id}
                                    className="app-subtle-surface rounded-[1.25rem] p-4"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                            {row.label || `Line ${index + 1}`}
                                        </p>
                                        {rows.length > 2 ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setRows((current) =>
                                                        current.filter((entry) => entry.id !== row.id)
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
                                                label="Item or Group"
                                                value={row.label}
                                                onChange={(value) =>
                                                    updateRow(row.id, { label: value })
                                                }
                                                placeholder="Finished goods"
                                            />
                                            <InputCard
                                                label="Cost"
                                                value={row.cost}
                                                onChange={(value) =>
                                                    updateRow(row.id, { cost: value })
                                                }
                                                placeholder="25000"
                                            />
                                            <InputCard
                                                label="Net Realizable Value"
                                                value={row.netRealizableValue}
                                                onChange={(value) =>
                                                    updateRow(row.id, {
                                                        netRealizableValue: value,
                                                    })
                                                }
                                                placeholder="22000"
                                            />
                                        </InputGrid>
                                    </div>
                                </div>
                            ))}
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
                            <ResultCard title="Total Cost" value={formatPHP(result.totalCost)} />
                            <ResultCard
                                title="Total NRV"
                                value={formatPHP(result.totalNetRealizableValue)}
                            />
                            <ResultCard
                                title="Reported Inventory"
                                value={formatPHP(result.totalLowerValue)}
                            />
                            <ResultCard
                                title="Write-down"
                                value={formatPHP(result.totalWriteDown)}
                            />
                        </ResultGrid>

                        <SectionCard>
                            <div className="space-y-3">
                                {result.rows.map((row) => (
                                    <div
                                        key={row.label}
                                        className="grid gap-2 rounded-[1.15rem] border app-divider px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                {row.label}
                                            </p>
                                            <p className="app-helper mt-1 text-xs">
                                                Cost {formatPHP(row.cost)} versus NRV{" "}
                                                {formatPHP(row.netRealizableValue)}
                                            </p>
                                        </div>
                                        <div className="text-sm font-semibold text-[color:var(--app-text)] md:text-right">
                                            Lower value {formatPHP(row.lowerValue)} | write-down{" "}
                                            {formatPHP(row.writeDown)}
                                        </div>
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
                        formula={
                            result.method === "aggregate"
                                ? "Lower of cost or NRV (aggregate) = lower of total cost and total NRV."
                                : "Lower of cost or NRV (item by item) = sum of the lower amount for each listed item."
                        }
                        steps={[
                            ...result.rows.map(
                                (row) =>
                                    `${row.label}: lower of ${formatPHP(row.cost)} and ${formatPHP(row.netRealizableValue)} = ${formatPHP(row.lowerValue)}.`
                            ),
                            result.method === "aggregate"
                                ? `Aggregate comparison: lower of total cost ${formatPHP(result.totalCost)} and total NRV ${formatPHP(result.totalNetRealizableValue)} = ${formatPHP(result.totalLowerValue)}.`
                                : `Total reported inventory = sum of lower values = ${formatPHP(result.totalLowerValue)}.`,
                            `Write-down = ${formatPHP(result.totalCost)} - ${formatPHP(result.totalLowerValue)} = ${formatPHP(result.totalWriteDown)}.`,
                        ]}
                        interpretation={`Using the ${result.method === "aggregate" ? "aggregate" : "item-by-item"} method, inventory would be reported at ${formatPHP(result.totalLowerValue)}. The required write-down is ${formatPHP(result.totalWriteDown)} whenever cost exceeds net realizable value under the selected method.`}
                        assumptions={[
                            "Net realizable value is treated as the estimated selling price less reasonably predictable completion and disposal costs.",
                            "Different textbooks prefer different comparison levels, so the selected method should match the problem instructions or company policy.",
                        ]}
                        warnings={[
                            "Do not switch between item-by-item and aggregate comparison without labeling the method. The reported inventory can change materially.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
