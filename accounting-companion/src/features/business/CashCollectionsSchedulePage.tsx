import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import StudySupportPanel from "../../components/StudySupportPanel";
import { buildStudyQuizPath, buildStudyTopicPath } from "../study/studyContent";
import formatPHP from "../../utils/formatPHP";
import { computeCashCollectionsSchedule } from "../../utils/calculatorMath";
import SendToWorkpaperButton from "../workpapers/SendToWorkpaperButton";
import { buildTimedScheduleTransferBundle } from "../workpapers/workpaperTransferBuilders";

type ScheduleRow = {
    id: string;
    label: string;
    amount: string;
};

type PatternRow = {
    id: string;
    lagPeriods: string;
    percent: string;
};

const DEFAULT_PERIODS: ScheduleRow[] = [
    { id: "jan", label: "January", amount: "" },
    { id: "feb", label: "February", amount: "" },
    { id: "mar", label: "March", amount: "" },
];

const DEFAULT_PATTERN: PatternRow[] = [
    { id: "current", lagPeriods: "0", percent: "40" },
    { id: "next", lagPeriods: "1", percent: "60" },
];

function nextId(prefix: string) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
}

export default function CashCollectionsSchedulePage() {
    const [periods, setPeriods] = useState<ScheduleRow[]>(DEFAULT_PERIODS);
    const [pattern, setPattern] = useState<PatternRow[]>(DEFAULT_PATTERN);
    const [beginningReceivables, setBeginningReceivables] = useState("");

    const result = useMemo(() => {
        const activePeriods = periods.filter(
            (period) => period.label.trim() !== "" || period.amount.trim() !== ""
        );
        const activePattern = pattern.filter(
            (entry) => entry.lagPeriods.trim() !== "" || entry.percent.trim() !== ""
        );

        if (!activePeriods.length || !activePattern.length) return null;

        const parsedPeriods = activePeriods.map((period) => ({
            label: period.label.trim() || "Period",
            amount: Number(period.amount),
        }));
        const parsedPattern = activePattern.map((entry) => ({
            lagPeriods: Number(entry.lagPeriods),
            percent: Number(entry.percent),
        }));
        const parsedBeginningReceivables =
            beginningReceivables.trim() === "" ? 0 : Number(beginningReceivables);

        if (
            Number.isNaN(parsedBeginningReceivables) ||
            parsedPeriods.some((period) => Number.isNaN(period.amount)) ||
            parsedPattern.some(
                (entry) => Number.isNaN(entry.lagPeriods) || Number.isNaN(entry.percent)
            )
        ) {
            return { error: "All period amounts, lag periods, and collection percentages must be valid numbers." };
        }

        if (
            parsedBeginningReceivables < 0 ||
            parsedPeriods.some((period) => period.amount < 0) ||
            parsedPattern.some((entry) => entry.lagPeriods < 0 || entry.percent < 0)
        ) {
            return { error: "Sales, beginning receivables, lag periods, and percentages cannot be negative." };
        }

        if (parsedPattern.some((entry) => !Number.isInteger(entry.lagPeriods))) {
            return { error: "Lag periods must be whole numbers such as 0 for current month and 1 for the next month." };
        }

        const patternPercent = parsedPattern.reduce((sum, entry) => sum + entry.percent, 0);
        if (patternPercent > 100.0001) {
            return { error: "Collection percentages cannot exceed 100% in total for one month's sales." };
        }

        return computeCashCollectionsSchedule({
            periods: parsedPeriods,
            collectionPattern: parsedPattern,
            beginningReceivables: parsedBeginningReceivables,
        });
    }, [beginningReceivables, pattern, periods]);

    function updatePeriod(id: string, patch: Partial<ScheduleRow>) {
        setPeriods((current) =>
            current.map((period) => (period.id === id ? { ...period, ...patch } : period))
        );
    }

    function updatePattern(id: string, patch: Partial<PatternRow>) {
        setPattern((current) =>
            current.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry))
        );
    }

    const workpaperBundle = useMemo(
        () =>
            result && !("error" in result)
                ? buildTimedScheduleTransferBundle({
                      title: "Cash collections workpaper",
                      description: "Structured export from the Cash Collections Schedule calculator.",
                      topic: "Cost & Managerial",
                      sourcePath: "/business/cash-collections-schedule",
                      sourceSummary: `Beginning receivables ${beginningReceivables || "0"} with ${periods.length} periods and ${pattern.length} lag rules.`,
                      recommendedTemplateId: "cash-collections-schedule",
                      totalLabel: "Total Collections",
                      endingLabel: "Ending Receivables",
                      totalValue: result.totalCollections,
                      endingValue: result.endingReceivables,
                      scheduledPercent: result.scheduledPercent,
                      rows: result.rows,
                  })
                : null,
        [beginningReceivables, pattern.length, periods.length, result]
    );

    return (
        <CalculatorPageLayout
            badge="Managerial & Cost / Budgeting"
            title="Cash Collections Schedule"
            description="Lay out period sales and collection lags into a month-based schedule that ties directly into cash-budget planning and receivables control."
            desktopLayout="result-focus"
            pageWidth="data"
            headerActions={<SendToWorkpaperButton bundle={workpaperBundle} />}
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <InputGrid columns={2}>
                            <InputCard
                                label="Beginning Receivables Collected in Period 1"
                                value={beginningReceivables}
                                onChange={setBeginningReceivables}
                                placeholder="45000"
                                helperText="Use the amount from the prior period that is due in the first displayed month."
                            />
                        </InputGrid>
                    </SectionCard>

                    <SectionCard>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="app-card-title text-base">Sales by period</p>
                                <p className="app-body-md mt-2 text-sm">
                                    Enter the budgeted credit sales or sales subject to the collection pattern.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setPeriods((current) => [
                                        ...current,
                                        { id: nextId("period"), label: "", amount: "" },
                                    ])
                                }
                                className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                            >
                                Add period
                            </button>
                        </div>
                        <div className="mt-4 space-y-3">
                            {periods.map((period, index) => (
                                <div key={period.id} className="app-subtle-surface rounded-[1.15rem] p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                            Period {index + 1}
                                        </p>
                                        {periods.length > 2 ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setPeriods((current) =>
                                                        current.filter((entry) => entry.id !== period.id)
                                                    )
                                                }
                                                className="app-button-ghost rounded-xl px-3 py-1.5 text-xs font-medium"
                                            >
                                                Remove
                                            </button>
                                        ) : null}
                                    </div>
                                    <div className="mt-3">
                                        <InputGrid columns={2}>
                                            <InputCard
                                                label="Period Label"
                                                value={period.label}
                                                onChange={(value) =>
                                                    updatePeriod(period.id, { label: value })
                                                }
                                                placeholder="April"
                                                type="text"
                                                inputMode="text"
                                            />
                                            <InputCard
                                                label="Sales Subject to Collection Pattern"
                                                value={period.amount}
                                                onChange={(value) =>
                                                    updatePeriod(period.id, { amount: value })
                                                }
                                                placeholder="180000"
                                            />
                                        </InputGrid>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="app-card-title text-base">Collection pattern</p>
                                <p className="app-body-md mt-2 text-sm">
                                    Use 0 for current-period collections, 1 for next-period collections, and so on.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setPattern((current) => [
                                        ...current,
                                        { id: nextId("pattern"), lagPeriods: "", percent: "" },
                                    ])
                                }
                                className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                            >
                                Add lag
                            </button>
                        </div>
                        <div className="mt-4 space-y-3">
                            {pattern.map((entry) => (
                                <div key={entry.id} className="app-subtle-surface rounded-[1.15rem] p-4">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                            Lag rule
                                        </p>
                                        {pattern.length > 1 ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setPattern((current) =>
                                                        current.filter((rule) => rule.id !== entry.id)
                                                    )
                                                }
                                                className="app-button-ghost rounded-xl px-3 py-1.5 text-xs font-medium"
                                            >
                                                Remove
                                            </button>
                                        ) : null}
                                    </div>
                                    <InputGrid columns={2}>
                                        <InputCard
                                            label="Lag Periods"
                                            value={entry.lagPeriods}
                                            onChange={(value) =>
                                                updatePattern(entry.id, { lagPeriods: value })
                                            }
                                            placeholder="0"
                                            helperText="0 = current period, 1 = next period."
                                        />
                                        <InputCard
                                            label="Collection Rate (%)"
                                            value={entry.percent}
                                            onChange={(value) =>
                                                updatePattern(entry.id, { percent: value })
                                            }
                                            placeholder="60"
                                        />
                                    </InputGrid>
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
                            <ResultCard title="Total Sales" value={formatPHP(result.totalSales)} />
                            <ResultCard
                                title="Total Collections"
                                value={formatPHP(result.totalCollections)}
                            />
                            <ResultCard
                                title="Ending Receivables"
                                value={formatPHP(result.endingReceivables)}
                            />
                            <ResultCard
                                title="Pattern Total"
                                value={`${result.scheduledPercent.toFixed(2)}%`}
                                supportingText={
                                    result.scheduledPercent < 100
                                        ? "Less than 100% leaves some receivables after the displayed horizon."
                                        : "Full pattern entered for each period's sales."
                                }
                            />
                        </ResultGrid>

                        <SectionCard>
                            <div className="space-y-3">
                                {result.rows.map((row) => (
                                    <div
                                        key={row.label}
                                        className="grid gap-3 rounded-[1.15rem] border app-divider px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                {row.label}
                                            </p>
                                            <p className="app-helper mt-1 text-xs">
                                                Sales base: {formatPHP(row.amount)}
                                            </p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {row.contributions.map((contribution, index) => (
                                                    <span
                                                        key={`${contribution.sourceLabel}-${index}`}
                                                        className="app-chip rounded-full px-2.5 py-1 text-[0.68rem]"
                                                    >
                                                        {contribution.sourceLabel}: {formatPHP(contribution.amount)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-[color:var(--app-text)] md:text-right">
                                            Collections: {formatPHP(row.totalScheduled)}
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
                    <div className="space-y-4">
                        <FormulaCard
                            formula="Cash collections for a period equal the sum of the collection percentages that fall into that period from current and prior sales."
                            steps={[
                                `Beginning receivables collected in period 1 = ${formatPHP(
                                    Number(beginningReceivables || 0)
                                )}.`,
                                ...result.rows.map(
                                    (row) =>
                                        `${row.label}: ${row.contributions
                                            .map(
                                                (contribution) =>
                                                    `${contribution.sourceLabel} at ${contribution.percent.toFixed(2)}% = ${formatPHP(contribution.amount)}`
                                            )
                                            .join(" + ")} = ${formatPHP(row.totalScheduled)}`
                                ),
                                `Ending receivables after the displayed periods = ${formatPHP(result.endingReceivables)}.`,
                            ]}
                            glossary={[
                                {
                                    term: "Lag period",
                                    meaning:
                                        "How many periods pass before a portion of one month's sales is collected.",
                                },
                                {
                                    term: "Ending receivables",
                                    meaning:
                                        "Sales not yet collected by the end of the displayed schedule horizon.",
                                },
                            ]}
                            interpretation={`This schedule converts ${formatPHP(result.totalSales)} of sales into ${formatPHP(result.totalCollections)} of cash collections across the displayed periods and leaves ${formatPHP(result.endingReceivables)} in receivables for later collection or follow-up.`}
                            assumptions={[
                                "The same collection pattern is applied to every listed period unless you change the percentages.",
                                "The beginning receivables input is treated as a carryover amount collected in the first displayed period.",
                            ]}
                            notes={[
                                "Use this schedule as a direct input to the Cash Budget page when you need a cleaner receipts line instead of a one-number estimate.",
                            ]}
                            warnings={[
                                "If the collection pattern total is less than 100%, the uncollected remainder stays in ending receivables after the displayed schedule.",
                            ]}
                        />

                        <StudySupportPanel
                            topicId="budgeting-and-planning-review"
                            topicTitle="Budgeting, Forecasting, and Planning Review"
                            lessonPath={buildStudyTopicPath("budgeting-and-planning-review")}
                            quizPath={buildStudyQuizPath("budgeting-and-planning-review")}
                            intro="Cash collections is usually the first planning schedule in a budget workflow because it converts sales timing into actual cash timing. Use the deeper lesson when you need to connect this schedule to cash budgets, financing need, and planning interpretation."
                            sections={[
                                {
                                    key: "when-to-build",
                                    label: "When to build this schedule",
                                    summary: "Prepare it before the cash budget whenever revenue and cash do not happen in the same period.",
                                    content: (
                                        <p>
                                            This schedule belongs early in the workflow. Once sales timing separates from collection timing, the cash budget depends on a clean receipts schedule rather than on sales totals alone.
                                        </p>
                                    ),
                                },
                                {
                                    key: "mistake-check",
                                    label: "Common mistake check",
                                    summary: "Sales are not automatically collections in the same period.",
                                    emphasis: "support",
                                    tone: "warning",
                                    content: (
                                        <ul className="list-disc space-y-2 pl-5">
                                            <li>Do not treat the sales figure as cash if the problem gives collection lags.</li>
                                            <li>Check whether beginning receivables belong in the first displayed period.</li>
                                            <li>Confirm whether the pattern totals 100% or leaves ending receivables beyond the visible schedule horizon.</li>
                                        </ul>
                                    ),
                                },
                            ]}
                            relatedTools={[
                                { path: "/business/cash-budget", label: "Cash Budget" },
                                { path: "/business/cash-disbursements-schedule", label: "Cash Disbursements Schedule" },
                                { path: "/smart/solver", label: "Smart Solver" },
                            ]}
                        />
                    </div>
                ) : null
            }
        />
    );
}
