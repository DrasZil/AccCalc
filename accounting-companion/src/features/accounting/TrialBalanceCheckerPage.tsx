import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeTrialBalance } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

type EntryMode = "totals" | "line-items";

type TrialBalanceRow = {
    id: string;
    account: string;
    debit: string;
    credit: string;
};

const DEFAULT_ROWS: TrialBalanceRow[] = [
    { id: "cash", account: "Cash", debit: "", credit: "" },
    { id: "capital", account: "Owner's Capital", debit: "", credit: "" },
];

function nextRowId() {
    return `tb-row-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export default function TrialBalanceCheckerPage() {
    const [entryMode, setEntryMode] = useState<EntryMode>("totals");
    const [totalDebits, setTotalDebits] = useState("");
    const [totalCredits, setTotalCredits] = useState("");
    const [rows, setRows] = useState<TrialBalanceRow[]>(DEFAULT_ROWS);

    const result = useMemo(() => {
        let parsedTotalDebits: number;
        let parsedTotalCredits: number;
        let populatedRows: TrialBalanceRow[] = [];

        if (entryMode === "totals") {
            if (totalDebits.trim() === "" || totalCredits.trim() === "") return null;

            parsedTotalDebits = Number(totalDebits);
            parsedTotalCredits = Number(totalCredits);

            if ([parsedTotalDebits, parsedTotalCredits].some((value) => Number.isNaN(value))) {
                return { error: "Total debits and total credits must both be valid numbers." };
            }

            if (parsedTotalDebits < 0 || parsedTotalCredits < 0) {
                return { error: "Total debits and total credits cannot be negative." };
            }
        } else {
            populatedRows = rows.filter(
                (row) =>
                    row.account.trim() !== "" || row.debit.trim() !== "" || row.credit.trim() !== ""
            );

            if (!populatedRows.length) return null;

            const parsedRows = populatedRows.map((row) => ({
                ...row,
                debitValue: row.debit.trim() === "" ? 0 : Number(row.debit),
                creditValue: row.credit.trim() === "" ? 0 : Number(row.credit),
            }));

            if (
                parsedRows.some(
                    (row) =>
                        Number.isNaN(row.debitValue) ||
                        Number.isNaN(row.creditValue) ||
                        row.debitValue < 0 ||
                        row.creditValue < 0
                )
            ) {
                return {
                    error: "Every account row must use valid non-negative debit and credit amounts.",
                };
            }

            if (
                parsedRows.some(
                    (row) =>
                        (row.debitValue === 0 && row.creditValue === 0) ||
                        (row.debitValue > 0 && row.creditValue > 0)
                )
            ) {
                return {
                    error: "Each line item should contain either a debit or a credit, not both and not neither.",
                };
            }

            parsedTotalDebits = parsedRows.reduce((sum, row) => sum + row.debitValue, 0);
            parsedTotalCredits = parsedRows.reduce((sum, row) => sum + row.creditValue, 0);
        }

        const balance = computeTrialBalance(parsedTotalDebits, parsedTotalCredits);
        const possibleTransposition =
            !balance.isBalanced &&
            Number.isInteger(balance.amountToCorrect) &&
            balance.amountToCorrect % 9 === 0;

        return {
            ...balance,
            parsedTotalDebits,
            parsedTotalCredits,
            entryMode,
            populatedRows,
            possibleTransposition,
            formula: "Difference = Total Debits - Total Credits",
            steps: [
                entryMode === "totals"
                    ? `Difference = ${formatPHP(parsedTotalDebits)} - ${formatPHP(parsedTotalCredits)} = ${formatPHP(balance.difference)}`
                    : `Summed line items to total debits of ${formatPHP(parsedTotalDebits)} and total credits of ${formatPHP(parsedTotalCredits)}.`,
                balance.isBalanced
                    ? "The trial balance is in balance because total debits equal total credits within rounding tolerance."
                    : `The ${balance.shortSide} side is short by ${formatPHP(balance.amountToCorrect)}.`,
            ],
            glossary: [
                {
                    term: "Balanced trial balance",
                    meaning: "A trial balance where total debits equal total credits.",
                },
                {
                    term: "Short side",
                    meaning: "The column that needs additional amount to match the other side.",
                },
            ],
            interpretation: balance.isBalanced
                ? "The totals agree, so the trial balance is arithmetically balanced. Errors of omission or incorrect account classification can still exist."
                : `The trial balance does not balance yet. ${formatPHP(balance.amountToCorrect)} is needed on the ${balance.shortSide} side to make the totals equal.`,
            warnings: possibleTransposition
                ? [
                      "Because the difference is divisible by 9, review for a possible transposition or slide error in one of the posted amounts.",
                  ]
                : [],
            assumptions: [
                "This checker confirms arithmetic balance only. A balanced trial balance does not guarantee every journal entry was correct.",
            ],
        };
    }, [entryMode, rows, totalCredits, totalDebits]);

    function updateRow(id: string, patch: Partial<TrialBalanceRow>) {
        setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
    }

    return (
        <CalculatorPageLayout
            badge="Accounting"
            title="Trial Balance Checker"
            description="Check total debits and credits directly or switch to line-item mode when the raw account list is more useful than precomputed totals."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setEntryMode("totals")}
                                className={[
                                    "rounded-xl px-4 py-2 text-sm font-medium",
                                    entryMode === "totals" ? "app-button-primary" : "app-button-secondary",
                                ].join(" ")}
                            >
                                Totals only
                            </button>
                            <button
                                type="button"
                                onClick={() => setEntryMode("line-items")}
                                className={[
                                    "rounded-xl px-4 py-2 text-sm font-medium",
                                    entryMode === "line-items"
                                        ? "app-button-primary"
                                        : "app-button-secondary",
                                ].join(" ")}
                            >
                                Line items
                            </button>
                        </div>
                    </SectionCard>

                    {entryMode === "totals" ? (
                        <SectionCard>
                            <InputGrid columns={2}>
                                <InputCard
                                    label="Total Debits"
                                    value={totalDebits}
                                    onChange={setTotalDebits}
                                    placeholder="250000"
                                />
                                <InputCard
                                    label="Total Credits"
                                    value={totalCredits}
                                    onChange={setTotalCredits}
                                    placeholder="249500"
                                />
                            </InputGrid>
                        </SectionCard>
                    ) : (
                        <SectionCard>
                            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <p className="app-card-title text-base">Account list</p>
                                    <p className="app-body-md mt-2 text-sm">
                                        Enter each account once with either a debit or a credit amount.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setRows((current) => [
                                            ...current,
                                            {
                                                id: nextRowId(),
                                                account: "",
                                                debit: "",
                                                credit: "",
                                            },
                                        ])
                                    }
                                    className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                                >
                                    Add account
                                </button>
                            </div>

                            <div className="mt-4 space-y-3">
                                {rows.map((row) => (
                                    <div key={row.id} className="app-subtle-surface rounded-[1.3rem] p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                {row.account || "Account line"}
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
                                                    label="Account"
                                                    value={row.account}
                                                    onChange={(value) =>
                                                        updateRow(row.id, { account: value })
                                                    }
                                                    placeholder="Cash"
                                                />
                                                <InputCard
                                                    label="Debit"
                                                    value={row.debit}
                                                    onChange={(value) =>
                                                        updateRow(row.id, { debit: value })
                                                    }
                                                    placeholder="25000"
                                                />
                                                <InputCard
                                                    label="Credit"
                                                    value={row.credit}
                                                    onChange={(value) =>
                                                        updateRow(row.id, { credit: value })
                                                    }
                                                    placeholder="25000"
                                                />
                                            </InputGrid>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    )}
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
                                title="Status"
                                value={result.isBalanced ? "Balanced" : "Not Balanced"}
                            />
                            <ResultCard
                                title="Difference"
                                value={formatPHP(Math.abs(result.difference))}
                            />
                            <ResultCard
                                title="Short Side"
                                value={result.isBalanced ? "None" : result.shortSide}
                            />
                            <ResultCard
                                title="Amount to Correct"
                                value={formatPHP(result.amountToCorrect)}
                            />
                        </ResultGrid>

                        {result.entryMode === "line-items" ? (
                            <SectionCard>
                                <ResultGrid columns={2}>
                                    <ResultCard
                                        title="Summed Debits"
                                        value={formatPHP(result.parsedTotalDebits)}
                                    />
                                    <ResultCard
                                        title="Summed Credits"
                                        value={formatPHP(result.parsedTotalCredits)}
                                    />
                                </ResultGrid>
                            </SectionCard>
                        ) : null}
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula={result.formula}
                        steps={result.steps}
                        glossary={result.glossary}
                        interpretation={result.interpretation}
                        warnings={result.warnings}
                        assumptions={result.assumptions}
                    />
                ) : null
            }
        />
    );
}
