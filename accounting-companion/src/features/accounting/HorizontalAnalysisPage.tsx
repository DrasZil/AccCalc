import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import EditableRowsCard from "../../components/EditableRowsCard";
import FormulaCard from "../../components/FormulaCard";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import {
    computeHorizontalAnalysisWorkspace,
} from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

type HorizontalRow = {
    id: string;
    label: string;
    baseAmount: string;
    currentAmount: string;
};

function createHorizontalRow(
    label = "",
    baseAmount = "",
    currentAmount = ""
): HorizontalRow {
    return {
        id: Math.random().toString(36).slice(2, 10),
        label,
        baseAmount,
        currentAmount,
    };
}

export default function HorizontalAnalysisPage() {
    const [rows, setRows] = useState<HorizontalRow[]>([
        createHorizontalRow("Cash", "120000", "145000"),
        createHorizontalRow("Receivables", "95000", "110000"),
        createHorizontalRow("Inventory", "150000", "168000"),
        createHorizontalRow("Net Sales", "680000", "742000"),
    ]);

    const result = useMemo(() => {
        const resolvedRows = rows
            .map((row) => ({
                label: row.label.trim(),
                baseAmount: row.baseAmount.trim() === "" ? null : Number(row.baseAmount),
                currentAmount:
                    row.currentAmount.trim() === "" ? null : Number(row.currentAmount),
            }))
            .filter(
                (row) =>
                    row.label !== "" || row.baseAmount !== null || row.currentAmount !== null
            );

        if (!resolvedRows.length) return null;

        if (
            resolvedRows.some(
                (row) =>
                    row.label === "" ||
                    row.baseAmount === null ||
                    row.currentAmount === null ||
                    Number.isNaN(row.baseAmount) ||
                    Number.isNaN(row.currentAmount)
            )
        ) {
            return { error: "Each visible line needs a label, a base amount, and a current amount." };
        }

        const computed = computeHorizontalAnalysisWorkspace(
            resolvedRows.map((row) => ({
                label: row.label,
                baseAmount: row.baseAmount as number,
                currentAmount: row.currentAmount as number,
            }))
        );
        const largestSwing = [...computed.rows].sort(
            (left, right) =>
                Math.abs(right.percentageChange ?? 0) - Math.abs(left.percentageChange ?? 0)
        )[0];

        return {
            ...computed,
            largestSwing,
        };
    }, [rows]);

    return (
        <CalculatorPageLayout
            badge="Accounting / Reporting & Analysis"
            title="Horizontal Analysis Workspace"
            description="Compare multiple line items at once, then read both peso change and percentage change from one worksheet-style analysis page."
            inputSection={
                <EditableRowsCard
                    title="Comparative Lines"
                    description="Add each line you want to compare across two periods."
                    rows={rows}
                    columns={[
                        { key: "label", label: "Line Label", placeholder: "Accounts Payable", inputMode: "text" },
                        { key: "baseAmount", label: "Base Period", placeholder: "120000" },
                        { key: "currentAmount", label: "Current Period", placeholder: "140000" },
                    ]}
                    addLabel="Add line"
                    onAdd={() => setRows((current) => [...current, createHorizontalRow()])}
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
                            <ResultCard title="Base Total" value={formatPHP(result.baseTotal)} />
                            <ResultCard title="Current Total" value={formatPHP(result.currentTotal)} />
                            <ResultCard title="Total Change" value={formatPHP(result.totalChange)} />
                            <ResultCard
                                title="Largest Swing"
                                value={
                                    result.largestSwing.percentageChange === null
                                        ? "N/A"
                                        : `${result.largestSwing.percentageChange.toFixed(2)}%`
                                }
                                supportingText={result.largestSwing.label}
                            />
                        </ResultGrid>

                        <SectionCard>
                            <div className="space-y-3">
                                {result.rows.map((row) => (
                                    <div
                                        key={row.label}
                                        className="grid gap-2 rounded-[1.05rem] app-subtle-surface px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto_auto_auto]"
                                    >
                                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                            {row.label}
                                        </p>
                                        <p className="text-sm text-[color:var(--app-text-muted)]">
                                            {formatPHP(row.baseAmount)}
                                        </p>
                                        <p className="text-sm text-[color:var(--app-text-muted)]">
                                            {formatPHP(row.currentAmount)}
                                        </p>
                                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                            {formatPHP(row.amountChange)}
                                            {row.percentageChange === null
                                                ? " | N/A"
                                                : ` | ${row.percentageChange.toFixed(2)}%`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    </div>
                ) : (
                    <SectionCard>
                        <p className="app-card-title text-sm">Horizontal analysis workspace</p>
                        <p className="app-body-md mt-2 text-sm">
                            Add at least one labeled line with base and current amounts to compare
                            period changes.
                        </p>
                    </SectionCard>
                )
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Amount change = Current period amount - Base period amount; Percentage change = Amount change / Base period amount"
                        steps={result.rows.map((row) => {
                            const percentageText =
                                row.percentageChange === null
                                    ? "N/A because base period is zero"
                                    : `${row.percentageChange.toFixed(2)}%`;

                            return `${row.label}: ${formatPHP(row.currentAmount)} - ${formatPHP(row.baseAmount)} = ${formatPHP(row.amountChange)}; percentage change = ${percentageText}.`;
                        })}
                        interpretation={`The largest listed movement is ${result.largestSwing.label}, with a change of ${result.largestSwing.percentageChange === null ? "N/A" : `${result.largestSwing.percentageChange.toFixed(2)}%`}.`}
                        assumptions={[
                            "Percentage change is not shown when the base-period amount is zero because that comparison is mathematically unstable.",
                        ]}
                        notes={[
                            "Use this page for comparative statements, review sheets, and quick multi-line period analysis without recalculating each line by hand.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
