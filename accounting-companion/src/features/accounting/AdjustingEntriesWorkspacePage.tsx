import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import {
    computeAccruedExpenseAdjustment,
    computeAccruedRevenueAdjustment,
    computePrepaidExpenseAdjustment,
    computeUnearnedRevenueAdjustment,
} from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

type AdjustmentMode = "prepaid" | "unearned" | "accrued-revenue" | "accrued-expense";

const MODE_META: Record<
    AdjustmentMode,
    {
        title: string;
        description: string;
        labels: [string, string];
    }
> = {
    prepaid: {
        title: "Prepaid expense",
        description: "Recognize the portion of a prepaid asset that has already expired.",
        labels: ["Beginning Prepaid", "Ending Prepaid"],
    },
    unearned: {
        title: "Unearned revenue",
        description: "Recognize the amount of previously collected revenue that is now earned.",
        labels: ["Beginning Unearned Revenue", "Ending Unearned Revenue"],
    },
    "accrued-revenue": {
        title: "Accrued revenue",
        description: "Measure revenue earned but not yet collected in cash.",
        labels: ["Revenue Earned", "Cash Collected"],
    },
    "accrued-expense": {
        title: "Accrued expense",
        description: "Measure expense incurred but not yet paid in cash.",
        labels: ["Expense Incurred", "Cash Paid"],
    },
};

export default function AdjustingEntriesWorkspacePage() {
    const [mode, setMode] = useState<AdjustmentMode>("prepaid");
    const [firstValue, setFirstValue] = useState("");
    const [secondValue, setSecondValue] = useState("");

    const result = useMemo(() => {
        if (firstValue.trim() === "" || secondValue.trim() === "") return null;
        const first = Number(firstValue);
        const second = Number(secondValue);
        if (Number.isNaN(first) || Number.isNaN(second)) {
            return { error: "Both values must be valid numbers." };
        }

        switch (mode) {
            case "prepaid":
                return computePrepaidExpenseAdjustment({
                    beginningPrepaid: first,
                    endingPrepaid: second,
                });
            case "unearned":
                return computeUnearnedRevenueAdjustment({
                    beginningUnearnedRevenue: first,
                    endingUnearnedRevenue: second,
                });
            case "accrued-revenue":
                return computeAccruedRevenueAdjustment({
                    revenueEarned: first,
                    cashCollected: second,
                });
            case "accrued-expense":
                return computeAccruedExpenseAdjustment({
                    expenseIncurred: first,
                    cashPaid: second,
                });
        }
    }, [firstValue, secondValue, mode]);

    const amount =
        result && !("error" in result)
            ? "expenseRecognized" in result
                ? result.expenseRecognized
                : "revenueRecognized" in result
                  ? result.revenueRecognized
                  : "accruedRevenue" in result
                    ? result.accruedRevenue
                    : result.accruedExpense
            : null;

    const journalLine =
        mode === "prepaid"
            ? "Debit Expense, Credit Prepaid Expense"
            : mode === "unearned"
              ? "Debit Unearned Revenue, Credit Revenue"
              : mode === "accrued-revenue"
                ? "Debit Receivable, Credit Revenue"
                : "Debit Expense, Credit Payable";

    return (
        <CalculatorPageLayout
            badge="Accounting"
            title="Adjusting Entries Workspace"
            description="Handle the most common adjustment patterns without switching between separate tiny calculators."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <div className="flex flex-wrap gap-2">
                            {(Object.keys(MODE_META) as AdjustmentMode[]).map((key) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setMode(key)}
                                    className={[
                                        "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                                        mode === key ? "app-button-primary" : "app-button-ghost",
                                    ].join(" ")}
                                >
                                    {MODE_META[key].title}
                                </button>
                            ))}
                        </div>
                        <p className="app-body-md mt-3 text-sm">{MODE_META[mode].description}</p>
                    </SectionCard>

                    <SectionCard>
                        <InputGrid columns={2}>
                            <InputCard
                                label={MODE_META[mode].labels[0]}
                                value={firstValue}
                                onChange={setFirstValue}
                                placeholder="25000"
                            />
                            <InputCard
                                label={MODE_META[mode].labels[1]}
                                value={secondValue}
                                onChange={setSecondValue}
                                placeholder="8000"
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
                ) : amount !== null ? (
                    <div className="space-y-4">
                        <ResultGrid columns={3}>
                            <ResultCard
                                title="Adjustment Amount"
                                value={formatPHP(amount)}
                                tone="accent"
                            />
                            <ResultCard title="Pattern" value={MODE_META[mode].title} />
                            <ResultCard title="Entry Direction" value={journalLine} />
                        </ResultGrid>

                        <SectionCard>
                            <p className="app-card-title text-sm">Use this result</p>
                            <p className="app-body-md mt-2 text-sm">
                                {amount >= 0
                                    ? `Record ${formatPHP(amount)} using ${journalLine}.`
                                    : `The ending balance exceeds the expected pattern, so review the inputs before posting an entry.`}
                            </p>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                amount !== null && result && !("error" in result) ? (
                    <FormulaCard
                        formula="Adjustment amount = beginning related balance or earned/incurred total minus the ending or paid/collected balance."
                        steps={[
                            `${MODE_META[mode].labels[0]} = ${formatPHP(Number(firstValue))}.`,
                            `${MODE_META[mode].labels[1]} = ${formatPHP(Number(secondValue))}.`,
                            `Adjustment amount = ${formatPHP(amount)}.`,
                        ]}
                        interpretation={`This workspace turns a common adjusting-entry pattern into a direct amount plus the journal-entry direction you usually need in class or workbook problems.`}
                        warnings={[
                            "If the computed amount is negative, pause and check whether the problem already includes an adjustment or uses reversed assumptions.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
