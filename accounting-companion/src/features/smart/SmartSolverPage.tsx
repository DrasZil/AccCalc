import {
    startTransition,
    useDeferredValue,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import DisclosurePanel from "../../components/DisclosurePanel";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import {
    APP_NAV_GROUPS,
    getRouteAvailability,
    getRouteMeta,
} from "../../utils/appCatalog";
import { recordToolVisit, saveToolRecord } from "../../utils/appActivity";
import { updateAppSettings, useAppSettings } from "../../utils/appSettings";
import { useNetworkStatus } from "../../utils/networkStatus";
import { useOfflineBundleStatus } from "../../utils/offlineStatus";
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
    CALCULATORS,
    makePrefill,
} from "./smartSolver.engine";
import type { SmartSolverRouteState } from "./smartSolver.connector";
import { suggestSolveTarget } from "./smartSolver.targets";
import { useSmartSolverAnalysis } from "./useSmartSolverAnalysis";
import { buildExtractedInputReview } from "./utils/extractedInputReview";
import { scoreSmartIntent } from "./utils/intentScoring";
import { detectPromptMistakes } from "./utils/mistakeDetection";
import { summarizeSolverConfidence } from "./utils/solverConfidence";
import { summarizeExtractedValues } from "./utils/valueExtraction";
import {
    buildStudyQuizPath,
    buildStudyTopicPath,
    recommendStudyTopicsFromText,
} from "../study/studyContent";

const SMART_PROMPT_EXAMPLES = [
    "Customers still owe us 75,000 and we expect 4% to be uncollectible.",
    "Find the quick ratio if cash is 50,000, marketable securities 25,000, receivables 40,000, and current liabilities 100,000.",
    "Compute VAT payable if vatable sales are 150,000 and vatable purchases are 80,000.",
    "Find the cash ratio if cash is 50,000, marketable securities are 25,000, and current liabilities are 100,000.",
    "Split partnership profit of 120,000 in the ratio 3:2:1.",
    "A retiring partner has capital of 120,000, receives 130,000, and total partnership capital before retirement is 500,000.",
    "Open a CVP analysis for fixed costs of 150,000, selling price 120, variable cost 70, target profit 60,000, and expected sales of 3,200 units.",
    "Find the equity multiplier if average total assets are 800,000 and average equity is 320,000.",
    "Compute gross profit rate if net sales are 150,000 and cost of goods sold is 90,000.",
    "Apply a 20% trade discount to a list price of 10,000.",
    "What is the true annual rate if the nominal rate is 12% compounded monthly?",
    "How much should we deposit every quarter to reach 500,000 in 20 periods at 3% per period?",
    "Find return on equity if net income is 120,000 and average equity is 480,000.",
    "We made 600,000 in sales, 360,000 variable costs, and 150,000 fixed costs. What is the operating leverage?",
    "Compute units of production depreciation if cost is 500,000, salvage is 50,000, total estimated units are 100,000, and this year produced 12,000 units.",
    "A new partner invests 120,000 for a 25% interest and old partners' capital is 300,000. Use the bonus method.",
    "Route me to partnership dissolution using realization cash, liabilities, partner capitals, and a 3:2:1 ratio.",
    "Find accounts payable turnover if net credit purchases are 420,000 and average accounts payable is 70,000.",
    "Compare FIFO and weighted average if beginning inventory is 100 units at 50, then purchases are 80 at 55 and 120 at 60, with 150 units sold.",
    "Find lower of cost or NRV if inventory cost is 25,000 and net realizable value is 22,000.",
    "Prepare a cash budget if beginning cash is 50,000, collections are 180,000, disbursements are 210,000, and minimum cash is 25,000.",
    "Make a flexible budget if budgeted units are 10,000, actual units are 12,000, fixed costs are 150,000, variable cost per unit is 22, and actual cost is 422,000.",
    "Prepare a bond amortization schedule for 1,000,000 face value bonds, 8% stated rate, 10% market rate, 5 years, semiannual.",
    "Find NPV for an initial investment of 250,000 at a 12% discount rate with cash flows of 70,000, 80,000, 90,000, and 85,000 plus 30,000 salvage value.",
    "Compute IRR for an initial investment of 180,000 with annual cash flows of 60,000, 70,000, 80,000, and 90,000.",
    "Route me to the cash collections schedule for monthly sales collected 40% this month and 60% next month.",
    "I need a bank reconciliation with deposits in transit, outstanding checks, bank charges, interest income, and a note collected by bank.",
    "Open the factory overhead variance tool for spending, efficiency, budget, and volume variance.",
    "Show a ratio analysis workspace for liquidity, turnover, and return ratios.",
    "Show the cash conversion cycle if receivables days are 36, inventory days are 52, and payables days are 28.",
    "Compare depreciation methods for cost 500,000, salvage 50,000, and useful life 5 years.",
    "Find the principal if simple interest is 4,800 at 12% for 2 years.",
    "What selling price gives a 30% margin if cost is 700?",
    "Solve for current liabilities if current assets are 250,000 and the current ratio should be 2.5.",
    "Show the common-size income statement workspace.",
    "Open the capital budgeting comparison tool for a 200,000 project at 11%.",
    "Find price elasticity of demand if price drops from 120 to 100 and quantity rises from 240 to 300.",
    "Solve the market equilibrium if demand is P = 120 - 2Q and supply is P = 20 + Q.",
    "Plan startup costs for permits, equipment, and opening inventory with a contingency allowance.",
    "Estimate cash runway if opening cash is 300,000, inflows are 90,000, and outflows are 120,000 per month.",
    "Open the adjusting entries workspace for prepaid expense and accrued expense review.",
    "Build a working capital planner using current assets, liabilities, receivables days, inventory days, and payables days.",
    "Check inventory shrinkage and missed purchase discounts in one inventory control workspace.",
    "Compare price, income, and cross elasticity in the economics analysis workspace.",
    "Use the entrepreneurship toolkit to find a selling price target or split profit between owners.",
    "Measure a lease liability and right-of-use asset from annual lease payments of 85,000 for 5 periods at 8%.",
    "Build an indirect-method statement of cash flows from net income, depreciation, working-capital changes, capex, and debt financing.",
    "Translate a foreign-currency receivable using transaction, closing, and settlement rates.",
    "Review modified reports, going concern, and key audit matters in one audit completion workspace.",
    "Route a mixed case with withholding tax, local taxation, and PEZA incentive issues.",
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
    children: ReactNode;
};

function dedupeFieldKeys(keys: FieldKey[]): FieldKey[] {
    return keys.filter((key, index) => keys.indexOf(key) === index);
}

function feedbackClassName(tone: ActionTone) {
    if (tone === "success") {
        return "app-tone-success";
    }

    if (tone === "warning") {
        return "app-tone-warning";
    }

    return "app-subtle-surface text-[color:var(--app-text)]";
}

function collapseButtonLabel(open: boolean) {
    return open ? "Hide" : "Show";
}

function isFarLikeRoute(category: string) {
    return category === "FAR" || category === "AFAR";
}

function isQuantitativeRoute(category: string) {
    return category === "Finance / Econ / Math";
}

function isStrategicRoute(category: string) {
    return category === "Strategic & Integrative";
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
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--app-text)]">
                        {title}
                    </h3>
                    <p className="app-body-md mt-1 text-sm">{description}</p>
                </div>
                <span className="app-chip rounded-full px-3 py-1 text-xs">
                    {collapseButtonLabel(open)}
                </span>
            </button>

            {open ? <div className="mt-4">{children}</div> : null}
        </SectionCard>
    );
}

export default function SmartSolverPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const settings = useAppSettings();
    const network = useNetworkStatus();
    const offlineBundle = useOfflineBundleStatus();

    const [smartInput, setSmartInput] = useState<string>("");
    const [fields, setFields] = useState<FieldsState>(() => ({ ...INITIAL_FIELDS }));
    const [selectedCalculatorId, setSelectedCalculatorId] = useState<string>("");
    const [lastApplyOutcome, setLastApplyOutcome] = useState<"applied" | "empty" | null>(null);
    const [lastApplySignature, setLastApplySignature] = useState<string>("");
    const [routeReviewAcknowledgedSignature, setRouteReviewAcknowledgedSignature] = useState("");
    const [actionFeedback, setActionFeedback] = useState<ActionFeedback | null>(null);
    const [showGuide, setShowGuide] = useState<boolean>(false);
    const [showExamples, setShowExamples] = useState<boolean>(false);
    const [showCoverage, setShowCoverage] = useState<boolean>(false);
    const [showDetectedValues, setShowDetectedValues] = useState<boolean>(false);
    const [showMoreMatches, setShowMoreMatches] = useState<boolean>(false);
    const [showGuidanceDetails, setShowGuidanceDetails] = useState<boolean>(false);
    const [expandedFieldKeys, setExpandedFieldKeys] = useState<FieldKey[]>([]);
    const [guidanceMode, setGuidanceMode] = useState<
        "compute" | "beginner" | "professional"
    >(() => settings.smartSolverDefaultMode);

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

    const { analysis, pendingAnalysis } = useSmartSolverAnalysis(fields, deferredSmartInput);
    const intentScores = useMemo(
        () => scoreSmartIntent(deferredSmartInput, analysis),
        [analysis, deferredSmartInput]
    );
    const promptMistakes = useMemo(
        () => detectPromptMistakes(deferredSmartInput),
        [deferredSmartInput]
    );

    const currentApplySignature = useMemo(
        () =>
            JSON.stringify({
                prompt: deferredSmartInput.trim(),
                currency: analysis.detectedCurrency,
                entries: analysis.extractedEntries,
            }),
        [analysis.detectedCurrency, analysis.extractedEntries, deferredSmartInput]
    );

    const solverCoverageRoutes = useMemo(
        () => new Set(CALCULATORS.map((calculator) => calculator.route)),
        []
    );

    const solverCoverageGroups = useMemo(
        () =>
            APP_NAV_GROUPS.map((group) => ({
                title: group.title,
                hint: group.hint,
                items: group.items.filter((item) => solverCoverageRoutes.has(item.path)),
            })).filter((group) => group.items.length > 0),
        [solverCoverageRoutes]
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
        setExpandedFieldKeys([]);
    }, [selectedCalculatorId]);

    useEffect(() => {
        setGuidanceMode(settings.smartSolverDefaultMode);
    }, [settings.smartSolverDefaultMode]);

    useEffect(() => {
        const routeState = location.state as SmartSolverRouteState | null;
        if (!routeState?.query?.trim()) return;

        setSmartInput(routeState.query);
        setActionFeedback({
            tone: "info",
            text:
                routeState.from === "scan-check"
                    ? "Scan text was loaded into Smart Solver. Review extracted values before opening a tool."
                    : "A prepared prompt was loaded into Smart Solver.",
        });
    }, [location.state]);

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
    const selectedRouteState = useMemo(() => {
        const solverConfidence = summarizeSolverConfidence(analysis, selectedCalculator);
        const extractionSummary = summarizeExtractedValues(analysis, selectedCalculator);
        const extractedInputReview = buildExtractedInputReview(analysis, selectedCalculator);
        const routeReady = Boolean(
            selectedCalculator &&
                selectedCalculator.score >= 55 &&
                selectedCalculator.missing.length === 0 &&
                solverConfidence.label !== "Low" &&
                analysis.warnings.length === 0
        );

        let interpreterFeedback = analysis.followUp;
        if (selectedCalculator) {
            if (analysis.warnings.length > 0) {
                interpreterFeedback = analysis.warnings[0];
            } else if (selectedCalculator.missing.length > 0) {
                interpreterFeedback = `To route confidently to ${selectedCalculator.name}, add ${selectedCalculator.missing
                    .map((field) => FIELD_META[field].label)
                    .join(", ")}.`;
            } else if (solverConfidence.label === "Low") {
                interpreterFeedback = `${selectedCalculator.name} is still a review-first route. Compare the primary route against the secondary options before opening it.`;
            } else if (analysis.secondaryRoutes.length > 0) {
                interpreterFeedback = `${selectedCalculator.name} is the active route. Secondary routes stayed separated so their fields do not contaminate the prepared inputs.`;
            } else {
                interpreterFeedback = `${selectedCalculator.name} is ready. You can apply detected values and open the selected tool.`;
            }
        }

        return {
            solverConfidence,
            extractionSummary,
            extractedInputReview,
            interpreterFeedback,
            routeReady,
        };
    }, [analysis, selectedCalculator]);
    const activeSolverConfidence = selectedRouteState.solverConfidence;
    const activeExtractionSummary = selectedRouteState.extractionSummary;
    const activeExtractedInputReview = selectedRouteState.extractedInputReview;
    const selectedInterpreterFeedback = selectedRouteState.interpreterFeedback;
    const routeSafetySignature = useMemo(
        () =>
            JSON.stringify({
                apply: currentApplySignature,
                calculator: selectedCalculator?.id ?? selectedCalculatorId,
                confidence: activeSolverConfidence.label,
            }),
        [activeSolverConfidence.label, currentApplySignature, selectedCalculator?.id, selectedCalculatorId]
    );
    const relatedStudyTopics = useMemo(
        () =>
            recommendStudyTopicsFromText(
                deferredSmartInput,
                selectedCalculator?.route ?? analysis.best?.route ?? null
            ),
        [analysis.best?.route, deferredSmartInput, selectedCalculator?.route]
    );

    const selectedCalculatorRouteReady = selectedRouteState.routeReady;
    const suggestedSolveTarget = useMemo(
        () =>
            selectedCalculator
                ? suggestSolveTarget(selectedCalculator.id, smartInput)
                : null,
        [selectedCalculator, smartInput]
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
    const reviewFieldKeys = useMemo(
        () => dedupeFieldKeys([...dynamicFieldKeys, ...expandedFieldKeys]),
        [dynamicFieldKeys, expandedFieldKeys]
    );
    const suggestedAdditionalFieldKeys = useMemo(() => {
        if (!selectedCalculator) return [];

        const baseGroup =
            FIELD_META[selectedCalculator.required[0] ?? selectedCalculator.optional?.[0] ?? "principal"]
                ?.group;
        const visible = new Set(reviewFieldKeys);

        return FIELD_KEYS.filter((field) => {
            if (visible.has(field)) return false;
            if (!baseGroup) return false;
            return FIELD_META[field].group === baseGroup;
        }).slice(0, 8);
    }, [reviewFieldKeys, selectedCalculator]);
    const selectedRouteMeta = useMemo(
        () => (selectedCalculator ? getRouteMeta(selectedCalculator.route) : null),
        [selectedCalculator]
    );
    const selectedRouteAvailability = useMemo(
        () =>
            selectedRouteMeta
                ? getRouteAvailability(selectedRouteMeta, {
                      online: network.online,
                      bundleReady: offlineBundle.ready,
                      currentPath: "/smart/solver",
                  })
                : null,
        [selectedRouteMeta, network.online, offlineBundle.ready]
    );
    const solverInterpretation = useMemo(() => {
        if (!selectedCalculator) return null;

        const missingLabels = selectedCalculator.missing.map((field) => FIELD_META[field].label);
        const relatedTools = analysis.secondaryRoutes.map((calculator) => calculator.name);
        const routeCategory = selectedRouteMeta?.category ?? "General";
        const methodCue =
            suggestedSolveTarget !== null
                ? `Smart Solver detected a missing-variable intent and prepared the route to solve for ${suggestedSolveTarget}.`
                : selectedCalculator.description;
        const studyTip =
            isFarLikeRoute(routeCategory)
                ? "Check whether the problem uses ending balances, average balances, or adjustment-style estimates before you finalize the answer."
                : isQuantitativeRoute(routeCategory)
                  ? "Match the rate basis, compounding basis, and time basis before trusting the result."
                : routeCategory === "Operations & Supply Chain"
                    ? "Keep the operating assumptions visible. Inventory, capacity, and reorder tools depend on demand, lead-time, and policy assumptions."
                    : isStrategicRoute(routeCategory)
                      ? "Use the result as a planning signal, then pressure-test it with a realistic scenario before making a real decision."
                      : "Verify units, period bases, and sign conventions before relying on the answer.";
        const practicalNote =
            isFarLikeRoute(routeCategory)
                ? "This route fits worksheet-style answers that still need a defensible interpretation."
                : isQuantitativeRoute(routeCategory)
                  ? "This route fits lending, valuation, and capital-budgeting decisions where assumptions change the answer materially."
                  : routeCategory === "Operations & Supply Chain"
                    ? "This route fits inventory-planning, capacity, and operations-control decisions where assumptions directly change the recommendation."
                    : isStrategicRoute(routeCategory)
                      ? "This route fits feasibility checks, startup planning, and small-business decisions."
                      : "This route is best when deterministic calculator logic is safer than free-form guessing.";

        return {
            compute:
                missingLabels.length > 0
                    ? `Best route: ${selectedCalculator.name}. Supply ${missingLabels.join(
                          ", "
                      )} to finish the calculation safely.`
                    : `Best route: ${selectedCalculator.name}. The prepared values look sufficient to open the calculator now.`,
            beginner:
                missingLabels.length > 0
                    ? `This looks most like ${selectedCalculator.name}, but it still needs ${missingLabels.join(
                          ", "
                      )} before the destination tool can solve the full problem safely.`
                    : `${selectedCalculator.name} appears ready. Review the prepared values, then open the tool to see the full formula breakdown and interpretation.`,
            professional:
                missingLabels.length > 0
                    ? `The current routing is materially consistent with ${selectedCalculator.name}, but the problem statement is still incomplete for a defensible result. Confirm ${missingLabels.join(
                          ", "
                      )} before relying on the output.`
                    : `${selectedCalculator.name} is the strongest match and the required values appear present. The next step is to verify sign conventions, period assumptions, and method choice in the destination page.`,
            relatedTools,
            methodCue,
            studyTip,
            practicalNote,
            assumptions:
                missingLabels.length > 0
                    ? [`Missing values: ${missingLabels.join(", ")}.`]
                    : [...analysis.extracted.notes.slice(0, 2), ...analysis.warnings].slice(0, 2),
        };
    }, [
        analysis.extracted.notes,
        analysis.secondaryRoutes,
        analysis.warnings,
        selectedCalculator,
        selectedRouteMeta?.category,
        suggestedSolveTarget,
    ]);

    const primarySuggestions = useMemo(
        () => analysis.secondaryRoutes.slice(0, Math.min(settings.smartSolverMaxSuggestions, 3)),
        [analysis.secondaryRoutes, settings.smartSolverMaxSuggestions]
    );

    const remainingSuggestions = useMemo(
        () =>
            analysis.ranked
                .filter(
                    (calculator) =>
                        calculator.id !== selectedCalculator?.id &&
                        !primarySuggestions.some((entry) => entry.id === calculator.id)
                )
                .slice(0, settings.smartSolverMaxSuggestions),
        [analysis.ranked, primarySuggestions, selectedCalculator?.id, settings.smartSolverMaxSuggestions]
    );

    const applyButtonLabel =
        currentApplySignature === lastApplySignature && lastApplyOutcome === "applied"
            ? "Values Applied"
            : currentApplySignature === lastApplySignature && lastApplyOutcome === "empty"
              ? "Nothing to Apply"
              : "Apply Detected Values";
    const requiresRouteReview =
        activeSolverConfidence.label === "Low" ||
        (selectedCalculator?.score ?? 0) < 60 ||
        promptMistakes.length > 0 ||
        activeExtractedInputReview.toLowerCase().includes("review") ||
        analysis.warnings.length > 0;

    const promptAudienceHint = selectedCalculator
        ? `Currently reading your prompt as ${selectedCalculator.name}.${analysis.secondaryRoutes.length > 0 ? ` ${analysis.secondaryRoutes.length} secondary route${analysis.secondaryRoutes.length === 1 ? "" : "s"} stayed separate from the primary route.` : ""}`
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
        setRouteReviewAcknowledgedSignature("");
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

        if (selectedRouteAvailability && !selectedRouteAvailability.canOpen) {
            setActionFeedback({
                tone: "warning",
                text: selectedRouteAvailability.reason,
            });
            return;
        }

        if (
            requiresRouteReview &&
            routeReviewAcknowledgedSignature !== routeSafetySignature
        ) {
            setRouteReviewAcknowledgedSignature(routeSafetySignature);
            setShowDetectedValues(true);
            setShowGuidanceDetails(true);
            setActionFeedback({
                tone: "warning",
                text:
                    "Smart Solver is not confident enough for a blind jump yet. Review the highlighted values, units, signs, and selected route, then click open again if it still looks right.",
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
                solveTarget: suggestedSolveTarget ?? undefined,
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
            description={`Describe a typed problem, cleaned worksheet text, or a mixed accounting prompt and Smart Solver will route you to the most likely supported tool first. It is best for text-based problem matching and input preparation, not for raw image OCR or open-ended general advice.`}
            prioritizeResultSection={hasAnyInput}
            startGuide={{
                badge: "What to do first",
                title: "Tell Smart Solver what the problem is before worrying about the exact calculator",
                summary:
                    "This page is meant to reduce guesswork. Write the problem naturally, check the extracted values if needed, then open the matched tool only after the route looks reasonable.",
                steps: [
                    {
                        title: "Write the problem naturally",
                        description:
                            "Use classroom wording, abbreviations, or plain language. You do not need perfect accounting jargon to start.",
                    },
                    {
                        title: "Review only the risky values",
                        description:
                            "If confidence is mixed, correct the important inputs first instead of reading every detail in the prompt.",
                    },
                    {
                        title: "Open the suggested tool",
                        description:
                            "When the match and inputs look right, continue into the calculator, lesson, or quiz that fits the problem best.",
                    },
                ],
            }}
            inputSection={
                <div className="space-y-4">
                    <SectionCard className="overflow-hidden">
                        <div className="space-y-5">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                <div className="max-w-3xl">
                                    <p className="app-section-kicker text-xs">
                                        Prompt
                                    </p>
                                    <p className="app-body-md mt-2 text-sm">
                                        Paste the full problem first. Smart Solver reads normal wording,
                                        classroom terms, and more formal accounting language, then prepares
                                        the most likely tool and its inputs.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {analysis.detectedCurrency ? (
                                        <span className="app-chip-accent rounded-full px-3 py-1 text-xs">
                                            Currency {analysis.detectedCurrency}
                                        </span>
                                    ) : null}

                                    {selectedCalculator ? (
                                        <span className="app-chip rounded-full px-3 py-1 text-xs">
                                            {selectedCalculator.confidence} Match
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <textarea
                                value={smartInput}
                                onChange={(e) => setSmartInput(e.target.value)}
                                rows={5}
                                placeholder='Example: "Customers still owe us 75,000 and 4% may not be collected."'
                                className="app-field w-full rounded-[1.45rem] px-4 py-4 text-sm outline-none"
                            />

                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                <p className="app-body-md text-sm">{promptAudienceHint}</p>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={handleApplyDetected}
                                        className={[
                                            "rounded-xl px-4 py-2 text-sm font-medium transition",
                                            currentApplySignature === lastApplySignature &&
                                            lastApplyOutcome === "applied"
                                                ? "app-button-secondary border-[color:var(--app-border-secondary)]"
                                                : currentApplySignature === lastApplySignature &&
                                                    lastApplyOutcome === "empty"
                                                  ? "app-button-secondary border-[color:rgba(245,158,11,0.22)]"
                                                  : "app-button-secondary",
                                        ].join(" ")}
                                    >
                                        {applyButtonLabel}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleUseSuggestedCalculator}
                                        disabled={!selectedCalculatorRouteReady}
                                        className="app-button-primary rounded-xl px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Open Selected Tool
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleClearAll}
                                        className="app-button-ghost rounded-xl px-4 py-2 text-sm font-medium"
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

                    <div className="grid gap-3 xl:grid-cols-3">
                        <div className="app-subtle-surface rounded-[1.15rem] px-4 py-4">
                            <p className="app-card-title text-sm">Best for</p>
                            <p className="app-body-md mt-2 text-sm">
                                Typed or pasted problem statements, mixed classroom wording, and cases where you know the topic area but not the exact calculator yet.
                            </p>
                        </div>
                        <div className="app-tone-warning rounded-[1.15rem] px-4 py-4">
                            <p className="app-card-title text-sm">Not ideal for</p>
                            <p className="app-body-md mt-2 text-sm">
                                Raw photos, unreadable worksheet images, unsupported topics, or broad “teach me everything” requests that need a lesson instead of a route.
                            </p>
                        </div>
                        <div className="app-tone-info rounded-[1.15rem] px-4 py-4">
                            <p className="app-card-title text-sm">Choose another tool when</p>
                            <p className="app-body-md mt-2 text-sm">
                                Use Scan & Check for image-based inputs, open Study Hub when the concept is still unclear, and go straight to a calculator when you already know the exact tool.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <CollapsibleSection
                            title="How Smart Solver decides"
                            description="Open this when you want to see the routing workflow without crowding the main solving surface."
                            open={showGuide}
                            onToggle={() => setShowGuide((prev) => !prev)}
                        >
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="app-subtle-surface rounded-2xl px-4 py-3">
                                    <p className="text-sm font-medium text-[color:var(--app-text)]">1. Write the problem</p>
                                    <p className="app-body-md mt-1 text-sm">
                                        Use plain English, classroom terminology, abbreviations, or accounting jargon.
                                    </p>
                                </div>
                                <div className="app-subtle-surface rounded-2xl px-4 py-3">
                                    <p className="text-sm font-medium text-[color:var(--app-text)]">2. Apply detected values</p>
                                    <p className="app-body-md mt-1 text-sm">
                                        The solver fills the review inputs and confirms whether the action worked.
                                    </p>
                                </div>
                                <div className="app-subtle-surface rounded-2xl px-4 py-3">
                                    <p className="text-sm font-medium text-[color:var(--app-text)]">3. Review and open</p>
                                    <p className="app-body-md mt-1 text-sm">
                                        Check the suggested tool, complete any missing values, then continue.
                                    </p>
                                </div>
                            </div>
                        </CollapsibleSection>

                        <CollapsibleSection
                            title="Coverage"
                            description="This catalog-backed list shows which tool groups Smart Solver can currently route into."
                            open={showCoverage}
                            onToggle={() => setShowCoverage((prev) => !prev)}
                        >
                            <div className="space-y-3">
                                <p className="app-body-md text-sm">
                                    Smart Solver currently supports {totalCoveredTools} solver-ready tools across{" "}
                                    {solverCoverageGroups.length} active calculator categories.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {solverCoverageGroups.map((group) => (
                                        <div
                                            key={group.title}
                                            className="app-subtle-surface rounded-2xl px-4 py-3"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                    {group.title}
                                                </p>
                                                <span className="app-helper text-xs uppercase tracking-[0.16em]">
                                                    {group.items.length} tools
                                                </span>
                                            </div>
                                            <p className="app-body-md mt-1 text-sm">
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
                                        className="app-list-link w-full rounded-2xl px-4 py-3 text-left text-sm leading-6"
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
                                    <h3 className="app-section-kicker text-xs">
                                        Match
                                    </h3>
                                    <p className="app-body-md mt-2 text-sm">
                                        This is the clean summary of what Smart Solver currently understands from the prompt.
                                    </p>
                                </div>

                                {selectedCalculator ? (
                                    <span className="app-chip rounded-full px-3 py-1 text-xs">
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
                                    title="Solver Confidence"
                                    value={activeSolverConfidence.label}
                                    supportingText={activeSolverConfidence.reason}
                                />
                                <ResultCard
                                    title="Next Step"
                                    value={
                                        selectedCalculator?.missing.length
                                            ? `Add ${selectedCalculator.missing
                                                  .map((field) => FIELD_META[field].label)
                                                  .join(", ")}`
                                            : selectedCalculatorRouteReady
                                              ? "Review the prepared inputs, then open the selected tool."
                                              : "Review the route and prepared values before opening it."
                                    }
                                />
                                <ResultCard
                                    title="Interpreter Feedback"
                                    value={selectedInterpreterFeedback}
                                />
                            </ResultGrid>

                            {analysis.topicFamily ? (
                                <div className="app-subtle-surface rounded-2xl px-4 py-3.5">
                                    <p className="app-helper text-xs uppercase tracking-[0.16em]">
                                        Topic-first routing
                                    </p>
                                    <p className="app-body-md mt-2 text-sm">
                                        {analysis.topicFamily.reason}
                                    </p>
                                </div>
                            ) : null}

                            {analysis.warnings.length > 0 ? (
                                <div className="app-tone-warning rounded-2xl px-4 py-3.5">
                                    {analysis.warnings.map((warning) => (
                                        <p key={warning} className="text-sm leading-6">
                                            {warning}
                                        </p>
                                    ))}
                                </div>
                            ) : null}

                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="app-subtle-surface rounded-2xl px-4 py-3.5">
                                    <p className="app-helper text-xs uppercase tracking-[0.16em]">
                                        Why this route won
                                    </p>
                                    <p className="app-body-md mt-2 text-sm">
                                        {selectedCalculator?.reason ?? selectedInterpreterFeedback}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {intentScores.slice(0, 3).map((intent) => (
                                            <span
                                                key={intent.label}
                                                className="app-list-link rounded-full px-3 py-1 text-xs font-medium"
                                            >
                                                {intent.label}: {intent.score}%
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="app-subtle-surface rounded-2xl px-4 py-3.5">
                                    <p className="app-helper text-xs uppercase tracking-[0.16em]">
                                        Value extraction
                                    </p>
                                    <p className="app-body-md mt-2 text-sm">
                                        {activeExtractionSummary.summary}
                                    </p>
                                    <p className="app-helper mt-2 text-xs leading-5">
                                        {activeExtractedInputReview}
                                    </p>
                                    {promptMistakes.length > 0 ? (
                                        <div className="mt-3 space-y-1">
                                            {promptMistakes.map((note) => (
                                                <p key={note} className="text-sm text-[color:var(--app-text)]">
                                                    {note}
                                                </p>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {selectedRouteAvailability ? (
                                <div
                                    className={[
                                        "rounded-2xl px-4 py-3 text-sm leading-6",
                                        selectedRouteAvailability.canOpen
                                            ? "app-subtle-surface"
                                            : "app-tone-warning",
                                    ].join(" ")}
                                >
                                    <strong>{selectedRouteAvailability.label}:</strong>{" "}
                                    {selectedRouteAvailability.reason}
                                </div>
                            ) : null}
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                    <h3 className="app-section-kicker text-xs">
                                        Prepared inputs
                                    </h3>
                                    <p className="app-body-md mt-1 text-sm">
                                        These inputs adapt to the active tool and should be your final check before continuing.
                                        {settings.smartSolverPreferGuidedSetup
                                            ? " Guided setup is active, so related fields from the same topic surface first."
                                            : ""}
                                    </p>
                                </div>

                                {selectedCalculator ? (
                                    <div className="flex flex-wrap gap-2">
                                        <span className="app-chip-accent rounded-full px-3 py-1 text-xs">
                                            {selectedCalculator.name}
                                        </span>
                                        {selectedCalculator.missing.length ? (
                                            <span className="app-tone-warning rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em]">
                                                {selectedCalculator.missing.length} missing
                                            </span>
                                        ) : (
                                            <span className="app-tone-success rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em]">
                                                Ready
                                            </span>
                                        )}
                                </div>
                            ) : null}
                        </div>

                        <div className="mt-4">
                            <InputGrid columns={3}>
                                {reviewFieldKeys.map((key) => {
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

                        {suggestedAdditionalFieldKeys.length > 0 ? (
                            <div className="mt-4">
                                <p className="app-helper text-xs uppercase tracking-[0.16em]">
                                    Need more fields?
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {suggestedAdditionalFieldKeys.map((field) => (
                                        <button
                                            key={field}
                                            type="button"
                                            onClick={() =>
                                                setExpandedFieldKeys((current) =>
                                                    dedupeFieldKeys([...current, field])
                                                )
                                            }
                                            className="app-button-ghost rounded-full px-3 py-2 text-xs font-medium"
                                        >
                                            Add {FIELD_META[field].label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </SectionCard>

                    {solverInterpretation ? (
                        <CollapsibleSection
                            title="Guidance and study follow-up"
                            description="Open this when you want the deeper interpretation, study note, and follow-up lesson links after the main route is already clear."
                            open={showGuidanceDetails}
                            onToggle={() => setShowGuidanceDetails((prev) => !prev)}
                        >
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setGuidanceMode("compute")}
                                    className={[
                                        "rounded-xl px-4 py-2 text-sm font-medium",
                                        guidanceMode === "compute"
                                            ? "app-button-primary"
                                            : "app-button-secondary",
                                    ].join(" ")}
                                >
                                    Compute mode
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGuidanceMode("beginner")}
                                    className={[
                                        "rounded-xl px-4 py-2 text-sm font-medium",
                                        guidanceMode === "beginner"
                                            ? "app-button-primary"
                                            : "app-button-secondary",
                                    ].join(" ")}
                                >
                                    Beginner mode
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGuidanceMode("professional")}
                                    className={[
                                        "rounded-xl px-4 py-2 text-sm font-medium",
                                        guidanceMode === "professional"
                                            ? "app-button-primary"
                                            : "app-button-secondary",
                                    ].join(" ")}
                                >
                                    Professional mode
                                </button>
                            </div>

                                <div className="app-subtle-surface mt-4 rounded-2xl px-4 py-4 text-sm leading-6">
                                    {guidanceMode === "compute"
                                        ? solverInterpretation.compute
                                        : guidanceMode === "beginner"
                                          ? solverInterpretation.beginner
                                          : solverInterpretation.professional}
                                </div>
                            {pendingAnalysis ? (
                                <p className="app-helper mt-3 text-xs">
                                    Refreshing the best calculator match in the background.
                                </p>
                            ) : null}

                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                                <div className="app-subtle-surface rounded-2xl px-4 py-3.5">
                                    <p className="app-helper text-xs uppercase tracking-[0.16em]">
                                        Method cue
                                    </p>
                                    <p className="app-body-md mt-2 text-sm">
                                        {solverInterpretation.methodCue}
                                    </p>
                                </div>
                                <div className="app-subtle-surface rounded-2xl px-4 py-3.5">
                                    <p className="app-helper text-xs uppercase tracking-[0.16em]">
                                        Practical note
                                    </p>
                                    <p className="app-body-md mt-2 text-sm">
                                        {solverInterpretation.practicalNote}
                                    </p>
                                </div>
                            </div>

                            {settings.smartSolverShowStudyNotes ? (
                                <div className="app-subtle-surface mt-4 rounded-2xl px-4 py-3.5">
                                    <p className="app-helper text-xs uppercase tracking-[0.16em]">
                                        Study note
                                    </p>
                                    <p className="app-body-md mt-2 text-sm">
                                        {solverInterpretation.studyTip}
                                    </p>
                                    {solverInterpretation.assumptions.length > 0 ? (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {solverInterpretation.assumptions.map((note) => (
                                                <span
                                                    key={note}
                                                    className="app-list-link rounded-full px-3 py-1 text-xs font-medium"
                                                >
                                                    {note}
                                                </span>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            ) : null}

                            {relatedStudyTopics.length > 0 ? (
                                <div className="app-subtle-surface mt-4 rounded-2xl px-4 py-3.5">
                                    <p className="app-helper text-xs uppercase tracking-[0.16em]">
                                        Related lesson
                                    </p>
                                    <div className="mt-3 space-y-3">
                                        {relatedStudyTopics.slice(0, 2).map((topic) => (
                                            <div key={topic.id}>
                                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                    {topic.title}
                                                </p>
                                                <p className="app-body-md mt-1 text-sm">
                                                    {topic.reason}
                                                </p>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    <Link
                                                        to={buildStudyTopicPath(topic.id)}
                                                        className="app-button-secondary rounded-full px-3 py-1.5 text-xs font-semibold"
                                                    >
                                                        Open lesson
                                                    </Link>
                                                    <Link
                                                        to={buildStudyQuizPath(topic.id)}
                                                        className="app-button-ghost rounded-full px-3 py-1.5 text-xs font-semibold"
                                                    >
                                                        Practice quiz
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}

                            {solverInterpretation.relatedTools.length > 0 ? (
                                <DisclosurePanel
                                    title="Related next tools"
                                    summary="Keep follow-up tool suggestions collapsed until you want the next route."
                                    badge={`${solverInterpretation.relatedTools.length} tools`}
                                    compact
                                    className="mt-4"
                                >
                                    <div className="app-related-link-grid app-related-link-grid--compact">
                                        {solverInterpretation.relatedTools.map((toolName) => (
                                            <div
                                                key={toolName}
                                                className="app-list-link app-related-link rounded-[1rem] px-3.5 py-3"
                                            >
                                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                    {toolName}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </DisclosurePanel>
                            ) : null}
                        </CollapsibleSection>
                    ) : null}

                    <SectionCard>
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                                    <h3 className="app-section-kicker text-xs">
                                        Secondary route options
                                    </h3>
                                    <p className="app-body-md mt-1 text-sm">
                                        The primary route stays above. These follow-up routes stay separate so they do not pollute the selected tool's prepared inputs.
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
                                                ? "border-[color:var(--app-border-secondary)] bg-[var(--app-accent-secondary-soft)]"
                                                : "app-subtle-surface hover:border-[color:var(--app-border-strong)]",
                                        ].join(" ")}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                    {calculator.name}
                                                </p>
                                                <p className="app-helper mt-1 text-xs uppercase tracking-[0.16em]">
                                                    {calculator.confidence} match
                                                </p>
                                            </div>
                                            <span className="app-chip rounded-full px-2.5 py-1 text-xs">
                                                {calculator.score}%
                                            </span>
                                        </div>

                                        <p className="app-body-md mt-3 text-sm">
                                            {calculator.reason}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </SectionCard>

                    {remainingSuggestions.length > 0 ? (
                        <CollapsibleSection
                            title="More matches"
                            description="Lower-priority matches stay collapsed so the main routing view stays clean."
                            open={showMoreMatches}
                            onToggle={() => setShowMoreMatches((prev) => !prev)}
                        >
                            <div className="grid gap-3 md:grid-cols-2">
                                {remainingSuggestions.map((calculator) => (
                                    <button
                                        key={calculator.id}
                                        type="button"
                                        onClick={() => handleSelectCalculator(calculator)}
                                        className="app-list-link rounded-2xl px-4 py-4 text-left transition"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                {calculator.name}
                                            </p>
                                            <span className="app-helper text-xs uppercase tracking-[0.16em]">
                                                {calculator.score}%
                                            </span>
                                        </div>
                                        <p className="app-body-md mt-2 text-sm">
                                            {calculator.reason}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </CollapsibleSection>
                    ) : null}

                    <CollapsibleSection
                        title="Detected values"
                        description="Open this to inspect exactly what the parser extracted from the prompt."
                        open={showDetectedValues}
                        onToggle={() => setShowDetectedValues((prev) => !prev)}
                    >
                        <div className="space-y-4">
                            {analysis.extractedEntries.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {analysis.extractedEntries.map(([key, value]) => (
                                        <span key={key} className="app-list-link rounded-full px-3 py-1 text-xs font-medium">
                                            {FIELD_META[key].label}: {value}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="app-body-md text-sm">
                                    No values extracted yet from the prompt.
                                </p>
                            )}

                            {selectedCalculator ? (
                                <div className="app-subtle-surface rounded-2xl px-4 py-3">
                                    <p className="text-sm font-medium text-[color:var(--app-text)]">Why this match</p>
                                    <p className="app-body-md mt-2 text-sm">
                                        {selectedCalculator.reason}
                                    </p>
                                </div>
                            ) : null}

                            {analysis.extracted.notes.length > 0 ? (
                                <div className="space-y-1 text-sm leading-6 text-[color:var(--app-text-secondary)]">
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
