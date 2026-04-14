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
import { computeCashDisbursementsSchedule } from "../../utils/calculatorMath";
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
    { id: "current", lagPeriods: "0", percent: "50" },
    { id: "next", lagPeriods: "1", percent: "50" },
];

function nextId(prefix: string) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
}

export default function CashDisbursementsSchedulePage() {
    const [periods, setPeriods] = useState<ScheduleRow[]>(DEFAULT_PERIODS);
    const [pattern, setPattern] = useState<PatternRow[]>(DEFAULT_PATTERN);
    const [beginningPayables, setBeginningPayables] = useState("");

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
        const parsedBeginningPayables =
            beginningPayables.trim() === "" ? 0 : Number(beginningPayables);

        if (
            Number.isNaN(parsedBeginningPayables) ||
            parsedPeriods.some((period) => Number.isNaN(period.amount)) ||
            parsedPattern.some(
                (entry) => Number.isNaN(entry.lagPeriods) || Number.isNaN(entry.percent)
            )
        ) {
            return { error: "All purchase amounts, lag periods, and payment percentages must be valid numbers." };
        }

        if (
            parsedBeginningPayables < 0 ||
            parsedPeriods.some((period) => period.amount < 0) ||
            parsedPattern.some((entry) => entry.lagPeriods < 0 || entry.percent < 0)
        ) {
            return { error: "Purchases, beginning payables, lag periods, and percentages cannot be negative." };
        }

        if (parsedPattern.some((entry) => !Number.isInteger(entry.lagPeriods))) {
            return { error: "Lag periods must be whole numbers such as 0 for current-period payment and 1 for next-period payment." };
        }

        const patternPercent = parsedPattern.reduce((sum, entry) => sum + entry.percent, 0);
        if (patternPercent > 100.0001) {
            return { error: "Payment percentages cannot exceed 100% in total for one period's purchases." };
        }

        return computeCashDisbursementsSchedule({
            periods: parsedPeriods,
            paymentPattern: parsedPattern,
            beginningPayables: parsedBeginningPayables,
        });
    }, [beginningPayables, pattern, periods]);

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
                      title: "Cash disbursements workpaper",
                      description: "Structured export from the Cash Disbursements Schedule calculator.",
                      topic: "Cost & Managerial",
                      sourcePath: "/business/cash-disbursements-schedule",
                      sourceSummary: `Beginning payables ${beginningPayables || "0"} with ${periods.length} periods and ${pattern.length} lag rules.`,
                      recommendedTemplateId: "cash-disbursements-schedule",
                      totalLabel: "Total Disbursements",
                      endingLabel: "Ending Payables",
                      totalValue: result.totalDisbursements,
                      endingValue: result.endingPayables,
                      scheduledPercent: result.scheduledPercent,
                      rows: result.rows,
                  })
                : null,
        [beginningPayables, pattern.length, periods.length, result]
    );

    return (
        <CalculatorPageLayout
            badge="Managerial & Cost / Budgeting"
            title="Cash Disbursements Schedule"
            description="Translate planned purchases and payment lags into a clean cash-disbursement schedule for budgeting, payables planning, and working-capital control."
            desktopLayout="result-focus"
            pageWidth="data"
            headerActions={<SendToWorkpaperButton bundle={workpaperBundle} />}
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <InputGrid columns={2}>
                            <InputCard
                                label="Beginning Payables Paid in Period 1"
                                value={beginningPayables}
                                onChange={setBeginningPayables}
                                placeholder="52000"
                                helperText="Use the prior-period purchases due in the first displayed period."
                            />
                        </InputGrid>
                    </SectionCard>

                    <SectionCard>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="app-card-title text-base">Purchases by period</p>
                                <p className="app-body-md mt-2 text-sm">
                                    Enter the purchases or cost base that follows the payment pattern.
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
                                                label="Purchases Subject to Payment Pattern"
                                                value={period.amount}
                                                onChange={(value) =>
                                                    updatePeriod(period.id, { amount: value })
                                                }
                                                placeholder="145000"
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
                                <p className="app-card-title text-base">Payment pattern</p>
                                <p className="app-body-md mt-2 text-sm">
                                    Use 0 for same-period payment, 1 for payment in the next period, and so on.
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
                                            placeholder="1"
                                            helperText="0 = same period, 1 = next period."
                                        />
                                        <InputCard
                                            label="Payment Rate (%)"
                                            value={entry.percent}
                                            onChange={(value) =>
                                                updatePattern(entry.id, { percent: value })
                                            }
                                            placeholder="50"
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
                            <ResultCard title="Total Purchases" value={formatPHP(result.totalPurchases)} />
                            <ResultCard
                                title="Total Cash Disbursements"
                                value={formatPHP(result.totalDisbursements)}
                            />
                            <ResultCard
                                title="Ending Payables"
                                value={formatPHP(result.endingPayables)}
                            />
                            <ResultCard
                                title="Pattern Total"
                                value={`${result.scheduledPercent.toFixed(2)}%`}
                                supportingText={
                                    result.scheduledPercent < 100
                                        ? "Less than 100% leaves some payables unpaid after the displayed horizon."
                                        : "Full payment pattern entered for each period's purchases."
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
                                                Purchases base: {formatPHP(row.amount)}
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
                                            Disbursements: {formatPHP(row.totalScheduled)}
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
                            formula="Cash disbursements for a period equal the sum of the payment percentages that fall into that period from current and prior purchases."
                            steps={[
                                `Beginning payables paid in period 1 = ${formatPHP(
                                    Number(beginningPayables || 0)
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
                                `Ending payables after the displayed periods = ${formatPHP(result.endingPayables)}.`,
                            ]}
                            glossary={[
                                {
                                    term: "Lag period",
                                    meaning:
                                        "How many periods pass before part of one period's purchases is paid.",
                                },
                                {
                                    term: "Ending payables",
                                    meaning:
                                        "Purchases not yet paid by the end of the displayed schedule horizon.",
                                },
                            ]}
                            interpretation={`The schedule converts ${formatPHP(result.totalPurchases)} of purchases into ${formatPHP(result.totalDisbursements)} of cash disbursements across the displayed periods and leaves ${formatPHP(result.endingPayables)} payable after the schedule horizon.`}
                            assumptions={[
                                "The same payment pattern is applied to each listed period unless you change the lag percentages.",
                                "The beginning payables input is treated as a carryover amount paid in the first displayed period.",
                            ]}
                            notes={[
                                "Use this schedule as the cash disbursements input to the Cash Budget page when your budget needs a month-by-month payment build-up instead of a one-line estimate.",
                            ]}
                            warnings={[
                                "If the payment pattern total is less than 100%, some purchases remain in ending payables after the displayed periods.",
                            ]}
                        />

                        <StudySupportPanel
                            topicId="budgeting-and-planning-review"
                            topicTitle="Budgeting, Forecasting, and Planning Review"
                            lessonPath={buildStudyTopicPath("budgeting-and-planning-review")}
                            quizPath={buildStudyQuizPath("budgeting-and-planning-review")}
                            intro="Cash disbursements translates purchase timing into actual cash outflow timing. Use the wider lesson flow when you need to connect payment lags, ending payables, and cash-budget financing pressure."
                            sections={[
                                {
                                    key: "what-this-schedule-tells-you",
                                    label: "What this schedule tells you",
                                    summary: "It explains when purchases become cash outflows, not just how much was purchased.",
                                    content: (
                                        <p>
                                            A purchases figure by itself is not yet a cash-payment figure. This schedule turns supplier terms and payment lags into the actual disbursement pattern that a cash budget needs.
                                        </p>
                                    ),
                                },
                                {
                                    key: "payables-discipline",
                                    label: "Payables discipline check",
                                    summary: "Ending payables may be normal timing or a signal of cash pressure.",
                                    emphasis: "support",
                                    tone: "info",
                                    content: (
                                        <ul className="list-disc space-y-2 pl-5">
                                            <li>Ending payables are not always bad, but they should match the stated payment pattern.</li>
                                            <li>A lag pattern below 100% means some obligations remain beyond the visible schedule horizon.</li>
                                            <li>Use the cash budget next when you need to judge whether payment timing creates a financing need.</li>
                                        </ul>
                                    ),
                                },
                            ]}
                            relatedTools={[
                                { path: "/business/cash-budget", label: "Cash Budget" },
                                { path: "/business/cash-collections-schedule", label: "Cash Collections Schedule" },
                                { path: "/accounting/working-capital-planner", label: "Working Capital Planner" },
                            ]}
                        />
                    </div>
                ) : null
            }
        />
    );
}
