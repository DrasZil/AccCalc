import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import EditableRowsCard from "../../components/EditableRowsCard";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeCommonSizeStatement } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

type BalanceSheetRow = {
    id: string;
    label: string;
    amount: string;
};

function createBalanceRow(label = "", amount = ""): BalanceSheetRow {
    return {
        id: Math.random().toString(36).slice(2, 10),
        label,
        amount,
    };
}

export default function CommonSizeBalanceSheetPage() {
    const [totalAssetsBase, setTotalAssetsBase] = useState("900000");
    const [rows, setRows] = useState<BalanceSheetRow[]>([
        createBalanceRow("Cash", "120000"),
        createBalanceRow("Receivables", "140000"),
        createBalanceRow("Inventory", "210000"),
        createBalanceRow("Property, Plant, and Equipment", "430000"),
        createBalanceRow("Total Liabilities", "360000"),
        createBalanceRow("Total Equity", "540000"),
    ]);

    const result = useMemo(() => {
        if (totalAssetsBase.trim() === "") return null;

        const parsedBase = Number(totalAssetsBase);
        if (Number.isNaN(parsedBase)) {
            return { error: "Total assets base must be a valid number." };
        }

        if (parsedBase <= 0) {
            return { error: "Total assets base must be greater than zero." };
        }

        const resolvedRows = rows
            .map((row) => ({
                label: row.label.trim(),
                amount: row.amount.trim() === "" ? null : Number(row.amount),
            }))
            .filter((row) => row.label !== "" || row.amount !== null);

        if (!resolvedRows.length) {
            return { error: "Add at least one balance-sheet line." };
        }

        if (
            resolvedRows.some(
                (row) => row.label === "" || row.amount === null || Number.isNaN(row.amount)
            )
        ) {
            return { error: "Each visible line needs a label and a valid amount." };
        }

        const computed = computeCommonSizeStatement(
            resolvedRows.map((row) => ({ label: row.label, amount: row.amount as number })),
            parsedBase
        );
        const topComposition = [...computed.rows].sort(
            (left, right) => Math.abs(right.percentage) - Math.abs(left.percentage)
        )[0];

        return {
            ...computed,
            topComposition,
        };
    }, [rows, totalAssetsBase]);

    return (
        <CalculatorPageLayout
            badge="Accounting / Reporting & Analysis"
            title="Common-Size Balance Sheet"
            description="Express assets, liabilities, and equity as percentages of total assets to read financing mix and resource structure more clearly."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <InputCard
                            label="Total Assets Base"
                            value={totalAssetsBase}
                            onChange={setTotalAssetsBase}
                            placeholder="900000"
                            helperText="Common-size balance sheets usually express every line as a percentage of total assets."
                        />
                    </SectionCard>
                    <EditableRowsCard
                        title="Balance Sheet Lines"
                        description="Add the balance-sheet lines you want to express as a percentage of total assets."
                        rows={rows}
                        columns={[
                            { key: "label", label: "Line Label", placeholder: "Accounts Payable", inputMode: "text" },
                            { key: "amount", label: "Amount", placeholder: "95000" },
                        ]}
                        addLabel="Add line"
                        onAdd={() => setRows((current) => [...current, createBalanceRow()])}
                        onRemove={(id) =>
                            setRows((current) => current.filter((row) => row.id !== id))
                        }
                        onChange={(id, key, value) =>
                            setRows((current) =>
                                current.map((row) =>
                                    row.id === id ? { ...row, [key]: value } : row
                                )
                            )
                        }
                    />
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
                        <ResultGrid columns={3}>
                            <ResultCard title="Total Assets Base" value={formatPHP(result.baseAmount)} />
                            <ResultCard
                                title="Largest Composition"
                                value={`${result.topComposition.percentage.toFixed(2)}%`}
                                supportingText={result.topComposition.label}
                            />
                            <ResultCard title="Lines Analyzed" value={result.rows.length.toLocaleString()} />
                        </ResultGrid>

                        <SectionCard>
                            <div className="space-y-3">
                                {result.rows.map((row) => (
                                    <div
                                        key={row.label}
                                        className="grid gap-2 rounded-[1.05rem] app-subtle-surface px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto_auto]"
                                    >
                                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                            {row.label}
                                        </p>
                                        <p className="text-sm text-[color:var(--app-text-muted)]">
                                            {formatPHP(row.amount)}
                                        </p>
                                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                            {row.percentage.toFixed(2)}%
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
                        formula="Common-size percentage = Balance-sheet line amount / Total assets base"
                        steps={result.rows.map(
                            (row) =>
                                `${row.label}: ${formatPHP(row.amount)} / ${formatPHP(result.baseAmount)} = ${row.percentage.toFixed(2)}%`
                        )}
                        interpretation={`This common-size balance sheet highlights the composition of the statement. ${result.topComposition.label} is the largest listed item at ${result.topComposition.percentage.toFixed(2)}% of total assets.`}
                        assumptions={[
                            "This page assumes total assets is the correct 100% base for all listed balance-sheet lines.",
                        ]}
                        notes={[
                            "Use the output to discuss asset structure, leverage weight, and financing mix without first converting every line by hand.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
