import {
    startTransition,
    useDeferredValue,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import type { CalculatorConfig, FieldKey, FieldsState, RankedCalculator } from "./smartSolver.types";
import {
    FIELD_KEYS,
    FIELD_META,
    INITIAL_FIELDS,
    analyzeSmartInput,
    makePrefill,
} from "./smartSolver.engine";

const SMART_PROMPT_EXAMPLES = [
    "Customers still owe us 75,000 and we expect 4% to be uncollectible.",
    "Find the quick ratio if cash is 50,000, marketable securities 25,000, receivables 40,000, and current liabilities 100,000.",
    "Compute VAT payable if vatable sales are 150,000 and vatable purchases are 80,000.",
    "Split partnership profit of 120,000 in the ratio 3:2:1.",
];

function dedupeFieldKeys(keys: FieldKey[]): FieldKey[] {
    return keys.filter((key, index) => keys.indexOf(key) === index);
}

export default function SmartSolverPage() {
    const navigate = useNavigate();

    const [smartInput, setSmartInput] = useState<string>("");
    const [fields, setFields] = useState<FieldsState>(() => ({ ...INITIAL_FIELDS }));
    const [selectedCalculatorId, setSelectedCalculatorId] = useState<string>("");
    const deferredSmartInput = useDeferredValue(smartInput);
    const hasAnyInput = useMemo(
        () =>
            deferredSmartInput.trim() !== "" ||
            Object.values(fields).some((value) => value.trim() !== ""),
        [deferredSmartInput, fields]
    );

    const visibleManualKeys = useMemo(
        () => FIELD_KEYS.filter((key) => FIELD_META[key].visibleInManualInputs !== false),
        []
    );

    const setField = (key: FieldKey) => (value: string) => {
        setFields((prev) => ({ ...prev, [key]: value }));
    };

    const analysis = useMemo(() => {
        return analyzeSmartInput(fields, deferredSmartInput);
    }, [deferredSmartInput, fields]);

    useEffect(() => {
        if (!hasAnyInput) return;
        if (!analysis.best) return;

        if (!selectedCalculatorId) {
            startTransition(() => {
                setSelectedCalculatorId(analysis.best?.id ?? "");
            });
            return;
        }

        const selectedStillExists = analysis.ranked.some(
            (calculator) => calculator.id === selectedCalculatorId
        );

        if (!selectedStillExists) {
            startTransition(() => {
                setSelectedCalculatorId(analysis.best?.id ?? "");
            });
        }
    }, [analysis.best, analysis.ranked, hasAnyInput, selectedCalculatorId]);

    const selectedCalculator = useMemo<RankedCalculator | null>(() => {
        if (!hasAnyInput) return null;
        if (!analysis.ranked.length) return null;

        return (
            analysis.ranked.find((calculator) => calculator.id === selectedCalculatorId) ??
            analysis.best
        );
    }, [analysis.best, analysis.ranked, hasAnyInput, selectedCalculatorId]);

    const selectedCalculatorRouteReady = Boolean(
        selectedCalculator &&
            selectedCalculator.score >= 35 &&
            selectedCalculator.missing.length === 0
    );

    const dynamicFieldKeys = useMemo(() => {
        if (!selectedCalculator) {
            return visibleManualKeys;
        }

        const baseFields = [
            ...selectedCalculator.required,
            ...(selectedCalculator.optional ?? []),
        ];

        const detectedExtras = analysis.extractedEntries
            .map(([key]) => key)
            .filter((key) => FIELD_META[key].group === FIELD_META[baseFields[0]]?.group);

        return dedupeFieldKeys([...baseFields, ...detectedExtras]);
    }, [analysis.extractedEntries, selectedCalculator, visibleManualKeys]);

    const handleApplyDetected = () => {
        startTransition(() => {
            setFields((prev) => ({
                ...prev,
                ...analysis.merged,
            }));
        });
    };

    const handleClearAll = () => {
        setSmartInput("");
        setFields({ ...INITIAL_FIELDS });
        setSelectedCalculatorId("");
    };

    const handleUseSuggestedCalculator = () => {
        if (!selectedCalculator || !selectedCalculatorRouteReady) return;

        navigate(selectedCalculator.route, {
            state: {
                from: "smart-solver",
                query: smartInput,
                prefill: makePrefill(selectedCalculator, analysis.merged),
            },
        });
    };

    const handleSelectCalculator = (calculator: CalculatorConfig) => {
        startTransition(() => {
            setSelectedCalculatorId(calculator.id);
        });
    };

    const promptAudienceHint = selectedCalculator
        ? `Understood as ${selectedCalculator.name}. The solver accepts casual wording, classroom terminology, and professional accounting jargon.`
        : "Type the problem the way you naturally would. The solver will try to translate plain language into accounting fields.";

    return (
        <CalculatorPageLayout
            badge="Smart Tools"
            title="Smart Solver"
            description="Describe the problem naturally. Smart Solver expands accounting vocabulary, detects values, adapts the input form to the most likely calculator, and lets you route directly once the needed fields are complete."
            inputSection={
                <div className="space-y-4">
                    <SectionCard className="overflow-hidden">
                        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                            <div>
                                <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-gray-200">
                                    Natural Language Prompt
                                </label>

                                <textarea
                                    value={smartInput}
                                    onChange={(e) => setSmartInput(e.target.value)}
                                    rows={6}
                                    placeholder='Example: "Our customers still owe us 75,000 and 4% may not be collected."'
                                    className="w-full rounded-[1.5rem] border border-white/10 bg-black/25 px-4 py-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-green-400/40 focus:bg-black/35 focus:ring-2 focus:ring-green-400/20"
                                />

                                <p className="mt-3 text-sm leading-6 text-gray-400">
                                    {promptAudienceHint}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={handleApplyDetected}
                                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                                    >
                                        Apply Detected Values
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleUseSuggestedCalculator}
                                        disabled={!selectedCalculatorRouteReady}
                                        className="rounded-xl bg-green-500/90 px-4 py-2 text-sm font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Open Selected Calculator
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleClearAll}
                                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                                    >
                                        Clear All
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-300">
                                    Prompt ideas
                                </p>
                                <div className="mt-4 space-y-2">
                                    {SMART_PROMPT_EXAMPLES.map((example) => (
                                        <button
                                            key={example}
                                            type="button"
                                            onClick={() => setSmartInput(example)}
                                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm leading-6 text-gray-200 transition hover:bg-white/10"
                                        >
                                            {example}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                                    Dynamic Inputs
                                </h3>
                                <p className="mt-1 text-sm text-gray-400">
                                    Fields change with the selected calculator and the accounting context inferred from your prompt.
                                </p>
                            </div>

                            {selectedCalculator ? (
                                <span className="rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-green-300">
                                    {selectedCalculator.name}
                                </span>
                            ) : null}
                        </div>

                        <div className="mt-4">
                            <InputGrid columns={3}>
                                {dynamicFieldKeys.map((key) => {
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
                        </div>
                    </SectionCard>
                </div>
            }
            resultSection={
                <div className="space-y-4">
                    <ResultGrid columns={2}>
                        <ResultCard
                            title="Selected Tool"
                            value={
                                selectedCalculator && selectedCalculator.score >= 35
                                    ? selectedCalculator.name
                                    : "No strong match yet"
                            }
                        />
                        <ResultCard
                            title="Confidence"
                            value={
                                selectedCalculator
                                    ? `${selectedCalculator.confidence} (${selectedCalculator.score}%)`
                                    : "Low (0%)"
                            }
                        />
                        <ResultCard
                            title="Routing Status"
                            value={
                                selectedCalculatorRouteReady
                                    ? "Ready to open"
                                    : "Needs more context"
                            }
                        />
                        <ResultCard title="Interpreter Feedback" value={analysis.followUp} />
                    </ResultGrid>

                    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                        <SectionCard>
                            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">Why this match</h3>

                            <p className="mt-2 text-sm leading-6 text-gray-300">
                                {selectedCalculator
                                    ? selectedCalculator.reason
                                    : "No reliable intent match yet."}
                            </p>

                            {selectedCalculator && selectedCalculator.missing.length > 0 ? (
                                <p className="mt-3 text-sm text-yellow-300">
                                    Missing:{" "}
                                    {selectedCalculator.missing
                                        .map((field) => FIELD_META[field].label)
                                        .join(", ")}
                                </p>
                            ) : null}

                            {analysis.extracted.notes.length > 0 ? (
                                <div className="mt-3 space-y-1 text-xs text-gray-400">
                                    {analysis.extracted.notes.map((note) => (
                                        <p key={note}>{note}</p>
                                    ))}
                                </div>
                            ) : null}
                        </SectionCard>

                        <SectionCard>
                            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">Detected values</h3>

                            {analysis.extractedEntries.length > 0 ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {analysis.extractedEntries.map(([key, value]) => (
                                        <span
                                            key={key}
                                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-200"
                                        >
                                            {FIELD_META[key].label}: {value}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-2 text-sm text-gray-400">
                                    No values extracted yet from the prompt.
                                </p>
                            )}
                        </SectionCard>
                    </div>

                    <SectionCard>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">Suggested calculators</h3>
                        <p className="mt-1 text-sm text-gray-400">
                            Switch the active calculator if the same prompt could fit another accounting topic.
                        </p>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {analysis.ranked.slice(0, 4).map((calculator) => {
                                const isActive = selectedCalculator?.id === calculator.id;

                                return (
                                    <button
                                        key={calculator.id}
                                        type="button"
                                        onClick={() => handleSelectCalculator(calculator)}
                                        className={[
                                            "rounded-2xl border p-4 text-left transition",
                                            isActive
                                                ? "border-green-400/30 bg-green-500/10"
                                                : "border-white/10 bg-white/5 hover:bg-white/10",
                                        ].join(" ")}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-semibold text-white">
                                                {calculator.name}
                                            </p>
                                            <span className="text-xs text-gray-400">
                                                {calculator.score}%
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xs leading-6 text-gray-400">
                                            {calculator.reason}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </SectionCard>
                </div>
            }
        />
    );
}
