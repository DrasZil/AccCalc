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

type StatementRow = {
    id: string;
    label: string;
    amount: string;
};

function createRow(label = "", amount = ""): StatementRow {
    return {
        id: Math.random().toString(36).slice(2, 10),
        label,
        amount,
    };
}

export default function CommonSizeIncomeStatementPage() {
    const [netSalesBase, setNetSalesBase] = useState("500000");
    const [rows, setRows] = useState<StatementRow[]>([
        createRow("Cost of Sales", "320000"),
        createRow("Gross Profit", "180000"),
        createRow("Operating Expenses", "90000"),
        createRow("Net Income", "90000"),
    ]);

    const result = useMemo(() => {
        if (netSalesBase.trim() === "") return null;

        const parsedBase = Number(netSalesBase);
        if (Number.isNaN(parsedBase)) {
            return { error: "Net sales base must be a valid number." };
        }

        if (parsedBase <= 0) {
            return { error: "Net sales base must be greater than zero." };
        }

        const resolvedRows = rows
            .map((row) => ({
                label: row.label.trim(),
                amount: row.amount.trim() === "" ? null : Number(row.amount),
            }))
            .filter((row) => row.label !== "" || row.amount !== null);

        if (!resolvedRows.length) {
            return { error: "Add at least one income-statement line." };
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
        const largestLine = [...computed.rows].sort(
            (left, right) => Math.abs(right.percentage) - Math.abs(left.percentage)
        )[0];

        return {
            ...computed,
            largestLine,
        };
    }, [netSalesBase, rows]);

    return (
        <CalculatorPageLayout
            badge="Accounting / Reporting & Analysis"
            title="Common-Size Income Statement"
            description="Turn income-statement lines into net-sales percentages so students and reviewers can read structure, margin, and cost weight faster."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <InputCard
                            label="Net Sales Base"
                            value={netSalesBase}
                            onChange={setNetSalesBase}
                            placeholder="500000"
                            helperText="Common-size income statements normally use net sales as the 100% base."
                        />
                    </SectionCard>
                    <EditableRowsCard
                        title="Income Statement Lines"
                        description="Add the lines you want to express as a percentage of net sales."
                        rows={rows}
                        columns={[
                            { key: "label", label: "Line Label", placeholder: "Selling Expense", inputMode: "text" },
                            { key: "amount", label: "Amount", placeholder: "45000" },
                        ]}
                        addLabel="Add line"
                        onAdd={() => setRows((current) => [...current, createRow()])}
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
                            <ResultCard title="Net Sales Base" value={formatPHP(result.baseAmount)} />
                            <ResultCard
                                title="Largest Line Weight"
                                value={`${result.largestLine.percentage.toFixed(2)}%`}
                                supportingText={result.largestLine.label}
                            />
                            <ResultCard
                                title="Lines Analyzed"
                                value={result.rows.length.toLocaleString()}
                            />
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
                        formula="Common-size percentage = Statement line amount / Net sales base"
                        steps={result.rows.map(
                            (row) =>
                                `${row.label}: ${formatPHP(row.amount)} / ${formatPHP(result.baseAmount)} = ${row.percentage.toFixed(2)}%`
                        )}
                        interpretation={`This common-size view shows how heavily each income-statement line weighs against net sales. ${result.largestLine.label} is the largest listed line at ${result.largestLine.percentage.toFixed(2)}% of sales.`}
                        assumptions={[
                            "This page assumes net sales is the correct 100% base for the selected income-statement lines.",
                        ]}
                        notes={[
                            "Use the page for vertical analysis, margin reading, review drills, and quick worksheet-style structure checks.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
