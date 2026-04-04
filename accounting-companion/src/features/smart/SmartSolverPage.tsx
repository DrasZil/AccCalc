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
import { APP_NAV_GROUPS } from "../../utils/appCatalog";
import { recordToolVisit, saveToolRecord } from "../../utils/appActivity";
import { updateAppSettings, useAppSettings } from "../../utils/appSettings";
import type {
    CalculatorConfig,
    FieldKey,
    FieldsState,
    RankedCalculator,
} from "./smartSolver.types";
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
    "What is the true annual rate if the nominal rate is 12% compounded monthly?",
    "How much should we deposit every quarter to reach 500,000 in 20 periods at 3% per period?",
    "Find return on equity if net income is 120,000 and average equity is 480,000.",
    "We made 600,000 in sales, 360,000 variable costs, and 150,000 fixed costs. What is the operating leverage?",
    "Compute units of production depreciation if cost is 500,000, salvage is 50,000, total estimated units are 100,000, and this year produced 12,000 units.",
    "A new partner invests 120,000 for a 25% interest and old partners' capital is 300,000. Use the bonus method.",
    "Find accounts payable turnover if net credit purchases are 420,000 and average accounts payable is 70,000.",
];

type ActionTone = "success" | "warning" | "info";

type ActionFeedback = {
    tone: ActionTone;
    text: string;
};

type CollapsibleSectionProps = {
    title: string;
    description: string;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
};

function dedupeFieldKeys(keys: FieldKey[]): FieldKey[] {
    return keys.filter((key, index) => keys.indexOf(key) === index);
}

function feedbackClassName(tone: ActionTone) {
    if (tone === "success") {
        return "border-green-400/20 bg-green-500/10 text-green-100";
    }

    if (tone === "warning") {
        return "border-amber-400/20 bg-amber-500/10 text-amber-100";
    }

    return "border-white/10 bg-white/5 text-slate-200";
}

function collapseButtonLabel(open: boolean) {
    return open ? "Hide" : "Show";
}

function CollapsibleSection({
    title,
    description,
    open,
    onToggle,
    children,
}: CollapsibleSectionProps) {
    return (
        <SectionCard className="overflow-hidden">
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-start justify-between gap-4 text-left"
            >
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                        {title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-300">
                    {collapseButtonLabel(open)}
                </span>
            </button>

            {open ? <div className="mt-4">{children}</div> : null}
        </SectionCard>
    );
}

export default function SmartSolverPage() {
    const navigate = useNavigate();
    const settings = useAppSettings();

    const [smartInput, setSmartInput] = useState<string>("");
    const [fields, setFields] = useState<FieldsState>(() => ({ ...INITIAL_FIELDS }));
    const [selectedCalculatorId, setSelectedCalculatorId] = useState<string>("");
    const [lastApplyOutcome, setLastApplyOutcome] = useState<"applied" | "empty" | null>(null);
    const [lastApplySignature, setLastApplySignature] = useState<string>("");
    const [actionFeedback, setActionFeedback] = useState<ActionFeedback | null>(null);
    const [showGuide, setShowGuide] = useState<boolean>(false);
    const [showExamples, setShowExamples] = useState<boolean>(false);
    const [showCoverage, setShowCoverage] = useState<boolean>(false);
    const [showDetectedValues, setShowDetectedValues] = useState<boolean>(false);
    const [showMoreMatches, setShowMoreMatches] = useState<boolean>(false);

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

    const analysis = useMemo(() => analyzeSmartInput(fields, deferredSmartInput), [
        deferredSmartInput,
        fields,
    ]);

    const currentApplySignature = useMemo(
        () =>
            JSON.stringify({
                prompt: deferredSmartInput.trim(),
                currency: analysis.detectedCurrency,
                entries: analysis.extractedEntries,
            }),
        [analysis.detectedCurrency, analysis.extractedEntries, deferredSmartInput]
    );

    const solverCoverageGroups = useMemo(
        () =>
            APP_NAV_GROUPS.map((group) => ({
                title: group.title,
                hint: group.hint,
                items: group.items.filter(
                    (item) =>
                        !["/", "/history", "/settings", "/smart/solver"].includes(item.path)
                ),
            })).filter((group) => group.items.length > 0),
        []
    );

    const totalCoveredTools = useMemo(
        () =>
            solverCoverageGroups.reduce((count, group) => count + group.items.length, 0),
        [solverCoverageGroups]
    );

    useEffect(() => {
        if (!actionFeedback) return;

        const timer = window.setTimeout(() => {
            setActionFeedback(null);
        }, 3200);

        return () => window.clearTimeout(timer);
    }, [actionFeedback]);

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

        const primaryGroup = FIELD_META[baseFields[0]]?.group;
        const detectedExtras = analysis.extractedEntries
            .map(([key]) => key)
            .filter((key) => FIELD_META[key].group === primaryGroup);

        return dedupeFieldKeys([...baseFields, ...detectedExtras]);
    }, [analysis.extractedEntries, selectedCalculator, visibleManualKeys]);

    const primarySuggestions = useMemo(
        () => analysis.ranked.slice(0, Math.min(settings.smartSolverMaxSuggestions, 3)),
        [analysis.ranked, settings.smartSolverMaxSuggestions]
    );

    const remainingSuggestions = useMemo(
        () => analysis.ranked.slice(primarySuggestions.length, settings.smartSolverMaxSuggestions),
        [analysis.ranked, primarySuggestions.length, settings.smartSolverMaxSuggestions]
    );

    const applyButtonLabel =
        currentApplySignature === lastApplySignature && lastApplyOutcome === "applied"
            ? "Values Applied"
            : currentApplySignature === lastApplySignature && lastApplyOutcome === "empty"
              ? "Nothing to Apply"
              : "Apply Detected Values";

    const promptAudienceHint = selectedCalculator
        ? `Currently reading your prompt as ${selectedCalculator.name}. You can still switch to another matching tool below.`
        : "Type the problem naturally. Smart Solver will try to map plain language, student wording, and accounting jargon into usable values.";

    const handleApplyDetected = () => {
        const extractedCount = analysis.extractedEntries.length;
        const hasCurrency = Boolean(analysis.detectedCurrency);

        if (extractedCount === 0 && !hasCurrency) {
            setLastApplyOutcome("empty");
            setLastApplySignature(currentApplySignature);
            setActionFeedback({
                tone: "warning",
                text: "No usable values were detected yet. Add more details like amounts, rates, periods, ratios, or balances.",
            });
            return;
        }

        startTransition(() => {
            setFields((prev) => ({
                ...prev,
                ...analysis.merged,
            }));
        });

        if (analysis.detectedCurrency) {
            updateAppSettings({ preferredCurrency: analysis.detectedCurrency });
        }

        if (smartInput.trim() !== "") {
            saveToolRecord({
                title: "Smart Solver Prompt",
                path: "/smart/solver",
                input: smartInput.trim(),
                result: selectedCalculator?.name,
            });
        }

        setLastApplyOutcome("applied");
        setLastApplySignature(currentApplySignature);
        setShowDetectedValues(true);
        setActionFeedback({
            tone: "success",
            text:
                extractedCount > 0 && hasCurrency
                    ? `Applied ${extractedCount} detected value(s) and updated the display currency to ${analysis.detectedCurrency}.`
                    : extractedCount > 0
                      ? `Applied ${extractedCount} detected value(s) into the review inputs.`
                      : `Updated the display currency to ${analysis.detectedCurrency}.`,
        });
    };

    const handleClearAll = () => {
        setSmartInput("");
        setFields({ ...INITIAL_FIELDS });
        setSelectedCalculatorId("");
        setLastApplyOutcome(null);
        setLastApplySignature("");
        setShowDetectedValues(false);
        setShowMoreMatches(false);
        setActionFeedback({
            tone: "info",
            text: "Smart Solver was cleared. Paste a new problem or open the guide for sample prompts.",
        });
    };

    const handleUseSuggestedCalculator = () => {
        if (!selectedCalculator || !selectedCalculatorRouteReady) {
            setActionFeedback({
                tone: "warning",
                text: selectedCalculator
                    ? `Add the missing fields first: ${selectedCalculator.missing
                          .map((field) => FIELD_META[field].label)
                          .join(", ")}.`
                    : "Describe a problem first so Smart Solver can prepare a matching tool.",
            });
            return;
        }

        recordToolVisit(selectedCalculator.route, {
            summary: `Opened from Smart Solver using the prompt: ${smartInput.trim() || "No prompt text saved."}`,
            kind: "smart",
        });

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

        setActionFeedback({
            tone: "info",
            text: `${calculator.name} is active. Review the prepared inputs below before opening it.`,
        });
    };

    return (
        <CalculatorPageLayout
            badge="Smart Tools"
            title="Smart Solver"
            description={`Describe the problem naturally, then let Smart Solver detect values, prepare inputs, and route you into the right calculator. It currently spans ${totalCoveredTools} tools across ${solverCoverageGroups.length} calculator categories and scales with the app catalog as new tools are added.`}
            inputSection={
                <div className="space-y-4">
                    <SectionCard className="overflow-hidden">
                        <div className="space-y-5">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                <div className="max-w-3xl">
                                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                                        Prompt Workspace
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                        Paste the full problem first. Smart Solver reads normal wording,
                                        classroom terms, and more formal accounting language, then prepares
                                        the most likely tool and its inputs.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {analysis.detectedCurrency ? (
                                        <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-emerald-200">
                                            Currency {analysis.detectedCurrency}
                                        </span>
                                    ) : null}

                                    {selectedCalculator ? (
                                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-300">
                                            {selectedCalculator.confidence} Match
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <textarea
                                value={smartInput}
                                onChange={(e) => setSmartInput(e.target.value)}
                                rows={6}
                                placeholder='Example: "Customers still owe us 75,000 and 4% may not be collected."'
                                className="w-full rounded-[1.65rem] border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/35 focus:bg-black/30 focus:ring-2 focus:ring-emerald-400/15"
                            />

                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                <p className="text-sm leading-6 text-slate-400">{promptAudienceHint}</p>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={handleApplyDetected}
                                        className={[
                                            "rounded-xl border px-4 py-2 text-sm font-medium transition",
                                            currentApplySignature === lastApplySignature &&
                                            lastApplyOutcome === "applied"
                                                ? "border-emerald-400/20 bg-emerald-500/15 text-emerald-100"
                                                : currentApplySignature === lastApplySignature &&
                                                    lastApplyOutcome === "empty"
                                                  ? "border-amber-400/20 bg-amber-500/10 text-amber-100"
                                                  : "border-white/10 bg-white/5 text-white hover:bg-white/10",
                                        ].join(" ")}
                                    >
                                        {applyButtonLabel}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleUseSuggestedCalculator}
                                        disabled={!selectedCalculatorRouteReady}
                                        className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-400/50 disabled:text-black/70"
                                    >
                                        Open Selected Tool
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleClearAll}
                                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>

                            {actionFeedback ? (
                                <div
                                    className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${feedbackClassName(
                                        actionFeedback.tone
                                    )}`}
                                >
                                    {actionFeedback.text}
                                </div>
                            ) : null}
                        </div>
                    </SectionCard>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <CollapsibleSection
                            title="How To Use Smart Solver"
                            description="A short workflow so users can understand the tool quickly without extra clutter."
                            open={showGuide}
                            onToggle={() => setShowGuide((prev) => !prev)}
                        >
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                    <p className="text-sm font-medium text-white">1. Write the problem</p>
                                    <p className="mt-1 text-sm leading-6 text-slate-400">
                                        Use plain English, classroom terminology, abbreviations, or accounting jargon.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                    <p className="text-sm font-medium text-white">2. Apply detected values</p>
                                    <p className="mt-1 text-sm leading-6 text-slate-400">
                                        The solver fills the review inputs and confirms whether the action worked.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                    <p className="text-sm font-medium text-white">3. Review and open</p>
                                    <p className="mt-1 text-sm leading-6 text-slate-400">
                                        Check the suggested tool, complete any missing values, then continue.
                                    </p>
                                </div>
                            </div>
                        </CollapsibleSection>

                        <CollapsibleSection
                            title="Coverage"
                            description="This list is generated from the app catalog so new calculator categories and tools can appear here as the app grows."
                            open={showCoverage}
                            onToggle={() => setShowCoverage((prev) => !prev)}
                        >
                            <div className="space-y-3">
                                <p className="text-sm leading-6 text-slate-400">
                                    Smart Solver currently spans {totalCoveredTools} tools across{" "}
                                    {solverCoverageGroups.length} active calculator categories.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {solverCoverageGroups.map((group) => (
                                        <div
                                            key={group.title}
                                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-sm font-semibold text-white">
                                                    {group.title}
                                                </p>
                                                <span className="text-xs uppercase tracking-[0.16em] text-slate-400">
                                                    {group.items.length} tools
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm leading-6 text-slate-400">
                                                {group.hint}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CollapsibleSection>
                    </div>

                    {settings.smartSolverShowPromptExamples ? (
                        <CollapsibleSection
                            title="Prompt Examples"
                            description="Open this only when you want sample inputs or quick testing prompts."
                            open={showExamples}
                            onToggle={() => setShowExamples((prev) => !prev)}
                        >
                            <div className="grid gap-2 md:grid-cols-2">
                                {SMART_PROMPT_EXAMPLES.map((example) => (
                                    <button
                                        key={example}
                                        type="button"
                                        onClick={() => {
                                            startTransition(() => {
                                                setSmartInput(example);
                                            });
                                        }}
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm leading-6 text-slate-200 transition hover:bg-white/10"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </CollapsibleSection>
                    ) : null}
                </div>
            }
            resultSection={
                <div className="space-y-4">
                    <SectionCard className="overflow-hidden">
                        <div className="space-y-5">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                <div className="max-w-3xl">
                                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                                        Match Summary
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                        This is the clean summary of what Smart Solver currently understands from the prompt.
                                    </p>
                                </div>

                                {selectedCalculator ? (
                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-300">
                                        {selectedCalculator.score}% confidence
                                    </span>
                                ) : null}
                            </div>

                            <ResultGrid columns={2}>
                                <ResultCard
                                    title="Best Match"
                                    value={
                                        selectedCalculator && selectedCalculator.score >= 35
                                            ? selectedCalculator.name
                                            : "No strong match yet"
                                    }
                                />
                                <ResultCard
                                    title="Ready To Open"
                                    value={
                                        selectedCalculatorRouteReady
                                            ? "Yes"
                                            : "Needs more details"
                                    }
                                />
                                <ResultCard
                                    title="Next Step"
                                    value={
                                        selectedCalculator?.missing.length
                                            ? `Add ${selectedCalculator.missing
                                                  .map((field) => FIELD_META[field].label)
                                                  .join(", ")}`
                                            : "Review the inputs, then open the selected tool."
                                    }
                                />
                                <ResultCard title="Interpreter Feedback" value={analysis.followUp} />
                            </ResultGrid>
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                                    Review Inputs
                                </h3>
                                <p className="mt-1 text-sm leading-6 text-slate-400">
                                    These inputs adapt to the active tool and should be your final check before continuing.
                                </p>
                            </div>

                            {selectedCalculator ? (
                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-emerald-200">
                                        {selectedCalculator.name}
                                    </span>
                                    {selectedCalculator.missing.length ? (
                                        <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-amber-200">
                                            {selectedCalculator.missing.length} missing
                                        </span>
                                    ) : (
                                        <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-emerald-200">
                                            Ready
                                        </span>
                                    )}
                                </div>
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

                    <SectionCard>
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
                                    Matching Tools
                                </h3>
                                <p className="mt-1 text-sm leading-6 text-slate-400">
                                    The top matches are shown first. Switch tools if the current interpretation is slightly off.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {primarySuggestions.map((calculator) => {
                                const isActive = selectedCalculator?.id === calculator.id;

                                return (
                                    <button
                                        key={calculator.id}
                                        type="button"
                                        onClick={() => handleSelectCalculator(calculator)}
                                        className={[
                                            "rounded-[1.35rem] border px-4 py-4 text-left transition",
                                            isActive
                                                ? "border-emerald-400/25 bg-emerald-500/10"
                                                : "border-white/10 bg-white/5 hover:bg-white/10",
                                        ].join(" ")}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-white">
                                                    {calculator.name}
                                                </p>
                                                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                                                    {calculator.confidence} match
                                                </p>
                                            </div>
                                            <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-xs text-slate-300">
                                                {calculator.score}%
                                            </span>
                                        </div>

                                        <p className="mt-3 text-sm leading-6 text-slate-400">
                                            {calculator.reason}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </SectionCard>

                    {remainingSuggestions.length > 0 ? (
                        <CollapsibleSection
                            title="More Matches"
                            description="Lower-priority matches are hidden by default so the main routing view stays clean."
                            open={showMoreMatches}
                            onToggle={() => setShowMoreMatches((prev) => !prev)}
                        >
                            <div className="grid gap-3 md:grid-cols-2">
                                {remainingSuggestions.map((calculator) => (
                                    <button
                                        key={calculator.id}
                                        type="button"
                                        onClick={() => handleSelectCalculator(calculator)}
                                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:bg-white/10"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-sm font-semibold text-white">
                                                {calculator.name}
                                            </p>
                                            <span className="text-xs uppercase tracking-[0.16em] text-slate-400">
                                                {calculator.score}%
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm leading-6 text-slate-400">
                                            {calculator.reason}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </CollapsibleSection>
                    ) : null}

                    <CollapsibleSection
                        title="Detected Values And Notes"
                        description="Open this if you want to inspect exactly what the parser extracted from the prompt."
                        open={showDetectedValues}
                        onToggle={() => setShowDetectedValues((prev) => !prev)}
                    >
                        <div className="space-y-4">
                            {analysis.extractedEntries.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {analysis.extractedEntries.map(([key, value]) => (
                                        <span
                                            key={key}
                                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                                        >
                                            {FIELD_META[key].label}: {value}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm leading-6 text-slate-400">
                                    No values extracted yet from the prompt.
                                </p>
                            )}

                            {selectedCalculator ? (
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                    <p className="text-sm font-medium text-white">Why this match</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                        {selectedCalculator.reason}
                                    </p>
                                </div>
                            ) : null}

                            {analysis.extracted.notes.length > 0 ? (
                                <div className="space-y-1 text-sm leading-6 text-slate-400">
                                    {analysis.extracted.notes.map((note) => (
                                        <p key={note}>{note}</p>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </CollapsibleSection>
                </div>
            }
        />
    );
}
