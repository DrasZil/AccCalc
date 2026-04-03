import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import type { FieldKey, FieldsState } from "./smartSolver.types";

    import {
    FIELD_KEYS,
    FIELD_META,
    INITIAL_FIELDS,
    analyzeSmartInput,
    makePrefill,
    } from "./smartSolver.engine";

    export default function SmartSolverPage() {
    const navigate = useNavigate();

    const [smartInput, setSmartInput] = useState<string>("");
    const [fields, setFields] = useState<FieldsState>(() => ({ ...INITIAL_FIELDS }));

    const visibleManualKeys = useMemo(
        () => FIELD_KEYS.filter((key) => FIELD_META[key].visibleInManualInputs !== false),
        []
    );

    const setField = (key: FieldKey) => (value: string) => {
        setFields((prev) => ({ ...prev, [key]: value }));
    };

    const analysis = useMemo(() => {
        return analyzeSmartInput(fields, smartInput);
    }, [fields, smartInput]);

    const handleApplyDetected = () => {
        setFields((prev) => ({
        ...prev,
        ...analysis.merged,
        }));
    };

    const handleClearAll = () => {
        setSmartInput("");
        setFields({ ...INITIAL_FIELDS });
    };

    const handleUseSuggestedCalculator = () => {
        if (!analysis.isReadyToRoute || !analysis.best) return;

        navigate(analysis.best.route, {
        state: {
            from: "smart-solver",
            query: smartInput,
            prefill: makePrefill(analysis.best, analysis.merged),
        },
        });
    };

    return (
        <CalculatorPageLayout
        badge="Smart Tools"
        title="Smart Solver"
        description="Describe the problem naturally or enter known values. Smart Solver interprets inputs, extracts facts, handles ambiguity, and routes to the best calculator.
        *Note: this is not perfect."
        inputSection={
            <InputGrid columns={3}>
            <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Natural Language Input
                </label>

                <textarea
                value={smartInput}
                onChange={(e) => setSmartInput(e.target.value)}
                rows={5}
                placeholder="Example: Find the simple interest on 10000 at 5% for 2 years."
                className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-slate-500 dark:border-slate-700"
                />

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Examples: "Borrowed 25000 at 6% for 18 months" or "Bought for 5000 and sold for 8000."
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={handleApplyDetected}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
                >
                    Apply Detected Values
                </button>

                <button
                    type="button"
                    onClick={handleUseSuggestedCalculator}
                    disabled={!analysis.isReadyToRoute}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
                >
                    Open Suggested Calculator
                </button>

                <button
                    type="button"
                    onClick={handleClearAll}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
                >
                    Clear All
                </button>
                </div>
            </div>

            {visibleManualKeys.map((key) => {
                const meta = FIELD_META[key];

                return (
                <InputCard
                    key={key}
                    label={meta.label}
                    value={fields[key]}
                    onChange={setField(key)}
                    placeholder={meta.placeholder}
                />
                );
            })}
            </InputGrid>
        }
        resultSection={
            <div className="space-y-4">
            <ResultGrid columns={2}>
                <ResultCard
                title="Suggested Tool"
                value={
                    analysis.best && analysis.best.score >= 35
                    ? analysis.best.name
                    : "No strong match yet"
                }
                />
                <ResultCard
                title="Confidence"
                value={
                    analysis.best
                    ? `${analysis.best.confidence} (${analysis.best.score}%)`
                    : "Low (0%)"
                }
                />
                <ResultCard
                title="Routing Status"
                value={analysis.isReadyToRoute ? "Ready to open" : "Needs more context"}
                />
                <ResultCard title="Interpreter Feedback" value={analysis.followUp} />
            </ResultGrid>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Why this match
                </h3>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {analysis.best ? analysis.best.reason : "No reliable intent match yet."}
                </p>

                {analysis.best && analysis.best.missing.length > 0 && (
                    <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
                    Missing: {analysis.best.missing
                        .map((field) => FIELD_META[field].label)
                        .join(", ")}
                    </p>
                )}

                {analysis.extracted.notes.length > 0 && (
                    <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    {analysis.extracted.notes.map((note) => (
                        <p key={note}>{note}</p>
                    ))}
                    </div>
                )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Detected values
                </h3>

                {analysis.extractedEntries.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                    {analysis.extractedEntries.map(([key, value]) => (
                        <span
                        key={key}
                        className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
                        >
                        {FIELD_META[key].label}: {value}
                        </span>
                    ))}
                    </div>
                ) : (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    No values extracted from natural-language input yet.
                    </p>
                )}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Alternative matches
                </h3>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                {analysis.ranked.slice(1, 3).map((item) => (
                    <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"
                    >
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {item.name}
                        </p>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                        {item.score}%
                        </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        {item.reason}
                    </p>
                    </div>
                ))}
                </div>
            </div>
            </div>
        }
        />
    );
}