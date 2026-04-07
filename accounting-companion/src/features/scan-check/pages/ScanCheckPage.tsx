import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CalculatorPageLayout from "../../../components/CalculatorPageLayout";
import DisclosurePanel from "../../../components/DisclosurePanel";
import SectionCard from "../../../components/SectionCard";
import ChartInsightPanel from "../../../components/charts/ChartInsightPanel";
import CommonMistakesBlock from "../../../components/notes/CommonMistakesBlock";
import InterpretationBlock from "../../../components/notes/InterpretationBlock";
import PracticalMeaningBlock from "../../../components/notes/PracticalMeaningBlock";
import StudyTipBlock from "../../../components/notes/StudyTipBlock";
import { buildChartHighlights } from "../../../utils/charts/chartHighlights";
import { buildComparisonNarrative } from "../../../utils/charts/chartNarratives";
import ScanActionBar from "../components/ScanActionBar";
import ScanCameraCapture from "../components/ScanCameraCapture";
import ScanDropzone from "../components/ScanDropzone";
import ScanExtractedTextPanel from "../components/ScanExtractedTextPanel";
import ScanImageQueue from "../components/ScanImageQueue";
import ScanPreprocessPreview from "../components/ScanPreprocessPreview";
import ScanProblemSessionPanel from "../components/ScanProblemSessionPanel";
import ScanProgressPanel from "../components/ScanProgressPanel";
import ScanResultOverview from "../components/ScanResultOverview";
import { buildAccountingProblemSession } from "../services/accounting/accountingProblemSession";
import { explainConfidence, getConfidenceLevel } from "../services/ocr/ocrConfidence";
import { mergeSelectedOcrText } from "../services/ocr/ocrMerge";
import { parseOcrText } from "../services/ocr/ocrParser";
import { useImagePreprocess } from "../hooks/useImagePreprocess";
import { useOcrWorker } from "../hooks/useOcrWorker";
import { useScanQueue } from "../hooks/useScanQueue";
import type {
    ScanImageItem,
    ScanProcessingPhase,
    StructuredScanField,
} from "../types";

function prefillFromStructuredFields(fields: StructuredScanField[]) {
    const byKey = new Map(fields.map((field) => [field.key, field.value]));
    return {
        departmentLabel: byKey.get("department"),
        unitsStartedOrReceived: byKey.get("units_started"),
        unitsCompletedAndTransferred: byKey.get("units_completed"),
        endingWipUnits: byKey.get("ending_wip_units"),
        currentTransferredInCost: byKey.get("transferred_in_cost"),
        currentMaterialsCost: byKey.get("materials_cost"),
        currentLaborCost: byKey.get("labor_cost"),
        currentOverheadCost: byKey.get("overhead_cost"),
        extractedCompletedCost: byKey.get("completed_cost"),
        extractedEndingWipCost: byKey.get("ending_wip_cost"),
        extractedCostPerEquivalentUnit: byKey.get("cost_per_eu"),
    };
}

const FLOW_STEPS = ["Capture", "Processing", "Review", "Result"] as const;

function getRouteLabel(routeHint?: string) {
    switch (routeHint) {
        case "/accounting/process-costing-workspace":
            return "Process Costing Workspace";
        case "/accounting/department-transferred-in-process-costing":
            return "Department 2 Process Costing";
        case "/basic":
            return "Basic Calculator";
        case "/economics/market-equilibrium":
            return "Market Equilibrium";
        case "/business/break-even":
            return "Break-even";
        case "/smart/solver":
        default:
            return "Smart Solver";
    }
}

function getSessionPhase(items: ScanImageItem[]): ScanProcessingPhase {
    const active = items.find((item) =>
        ["queued", "preprocessing", "recognizing", "classifying", "extracting", "routing"].includes(
            item.status
        )
    );
    if (!active) {
        return items.some((item) => item.status === "failed") ? "failed" : "completed";
    }
    return active.processingPhase ?? "queued";
}

function buildQuickFacts(
    items: ScanImageItem[],
    primaryItem: ScanImageItem | null,
    accountingPageCount: number
) {
    const selectedCount = items.filter((item) => item.selected).length;
    const extractedValueCount = primaryItem?.parsedResult?.extractedValues.length ?? 0;

    return [
        { label: "Images", value: String(items.length) },
        { label: "Selected", value: String(selectedCount) },
        {
            label: "Detected",
            value:
                primaryItem?.parsedResult?.kind === "accounting-worksheet"
                    ? `${accountingPageCount} worksheet`
                    : primaryItem?.parsedResult?.kind?.replaceAll("-", " ") ?? "unknown",
        },
        { label: "Values", value: String(extractedValueCount) },
    ];
}

export default function ScanCheckPage() {
    const navigate = useNavigate();
    const queue = useScanQueue();
    const ocr = useOcrWorker();
    const preprocess = useImagePreprocess();
    const processingRef = useRef(false);
    const [mergedText, setMergedText] = useState("");
    const [mergedTextDirty, setMergedTextDirty] = useState(false);
    const [activePreviewId, setActivePreviewId] = useState<string | null>(null);
    const [showAdvancedReview, setShowAdvancedReview] = useState(false);
    const [statusMessage, setStatusMessage] = useState(
        "Upload or capture image files and AccCalc will start reading them automatically."
    );

    const activePreview =
        queue.items.find((item) => item.id === activePreviewId) ?? queue.items[0] ?? null;

    const accountingSession = useMemo(
        () => buildAccountingProblemSession(queue.items.filter((item) => item.selected)),
        [queue.items]
    );

    const primaryItem = useMemo(
        () =>
            queue.items.find((item) => item.selected && item.parsedResult) ??
            queue.items.find((item) => item.parsedResult) ??
            queue.items[0] ??
            null,
        [queue.items]
    );

    const overallProgress = useMemo(() => {
        if (queue.items.length === 0) return 0;
        return (
            queue.items.reduce((sum, item) => sum + Math.max(0, item.progress), 0) /
            queue.items.length
        );
    }, [queue.items]);

    const sessionPhase = useMemo(() => getSessionPhase(queue.items), [queue.items]);
    const accountingPageCount = useMemo(
        () => queue.items.filter((item) => item.parsedResult?.accounting).length,
        [queue.items]
    );

    const flowStage = useMemo(() => {
        if (queue.items.length === 0) return 0;
        if (queue.items.some((item) => item.status === "queued" || item.status === "preprocessing" || item.status === "recognizing" || item.status === "classifying" || item.status === "extracting" || item.status === "routing")) {
            return 1;
        }
        if (
            queue.items.some(
                (item) =>
                    item.status === "needs review" ||
                    item.confidenceLevel === "low" ||
                    (item.parsedResult?.likelyIssues.length ?? 0) > 0
            )
        ) {
            return 2;
        }
        return 3;
    }, [queue.items]);

    const reviewFlags = useMemo(() => {
        const flags = new Set<string>();

        queue.items.forEach((item) => {
            if (item.confidenceLevel === "low") {
                flags.add("Low OCR confidence detected on at least one image.");
            }
            item.qualityWarnings?.forEach((warning) => flags.add(warning));
            item.parsedResult?.likelyIssues.forEach((issue) => flags.add(issue));
        });

        return Array.from(flags);
    }, [queue.items]);

    const primaryRouteHint = accountingSession?.routeHint ?? primaryItem?.parsedResult?.routeHint ?? "/smart/solver";
    const primaryActionLabel = accountingSession
        ? "Open suggested workspace"
        : primaryItem?.parsedResult?.suggestedIntent === "Check my solution"
          ? "Check this solution"
          : primaryItem?.parsedResult?.suggestedIntent === "Compare final answer"
            ? "Compare answers"
            : primaryItem?.parsedResult?.suggestedIntent === "Review extracted values"
              ? "Review extracted values"
              : primaryItem?.parsedResult?.suggestedIntent === "Extract equation"
                ? "Open suggested workspace"
                : "Continue to SmartSolver";

    async function processQueue() {
        if (processingRef.current) return;
        processingRef.current = true;

        const nextItems = [...queue.items];

        try {
            for (const item of queue.items) {
                if (
                    item.status === "completed" ||
                    item.status === "needs review"
                ) {
                    continue;
                }

                try {
                    queue.updateItem(item.id, (current) => ({
                        ...current,
                        status: "preprocessing",
                        progress: 8,
                        processingPhase: "preparing",
                        processingSummary: "Preparing image",
                        error: null,
                    }));

                    const base64Source = await queue.fileToDataUrl(item.file);

                    queue.updateItem(item.id, (current) => ({
                        ...current,
                        status: "preprocessing",
                        progress: 16,
                        processingPhase: "enhancing",
                        processingSummary: "Enhancing image for OCR",
                    }));
                    const processed = await preprocess.run(base64Source);

                    queue.updateItem(item.id, (current) => ({
                        ...current,
                        processedPreviewUrl: processed.processedDataUrl,
                        preprocessNotes: processed.notes,
                        qualityWarnings: processed.qualityWarnings,
                        status: "recognizing",
                        progress: 24,
                        processingPhase: "reading",
                        processingSummary:
                            processed.qualityWarnings?.[0] ?? "Reading text",
                    }));

                    const ocrResult = await ocr.recognize(processed.processedDataUrl, (progress) =>
                        queue.updateItem(item.id, (current) => ({
                            ...current,
                            status: "recognizing",
                            progress: Math.max(24, progress),
                            processingPhase: "reading",
                            processingSummary: "Reading text",
                        }))
                    );

                    queue.updateItem(item.id, (current) => ({
                        ...current,
                        status: "classifying",
                        progress: 74,
                        processingPhase: "classifying",
                        processingSummary: "Detecting worksheet or problem type",
                        ocrResult,
                    }));

                    const parsed = parseOcrText(ocrResult.text, ocrResult.confidence);

                    queue.updateItem(item.id, (current) => ({
                        ...current,
                        status: "extracting",
                        progress: 86,
                        processingPhase: "extracting",
                        processingSummary:
                            parsed.accounting?.fields.length
                                ? "Extracting structured fields"
                                : "Extracting values and intent",
                    }));

                    const confidenceLevel = getConfidenceLevel(ocrResult.confidence);
                    const status: ScanImageItem["status"] =
                        confidenceLevel === "low" || parsed.parseConfidence < 60
                            ? "needs review"
                            : "completed";

                    const nextItem: ScanImageItem = {
                        ...item,
                        processedPreviewUrl: processed.processedDataUrl,
                        preprocessNotes: processed.notes,
                        qualityWarnings: processed.qualityWarnings,
                        status,
                        progress: 100,
                        ocrResult,
                        parsedResult: parsed,
                        editableText: parsed.cleanedText,
                        confidenceLevel,
                        problemRole: parsed.pageType ?? null,
                        processingPhase: "completed",
                        processingSummary:
                            status === "needs review"
                                ? "Review suggested before checking"
                                : `Suggested route: ${getRouteLabel(parsed.routeHint)}`,
                        error: null,
                    };

                    const nextIndex = nextItems.findIndex((entry) => entry.id === item.id);
                    if (nextIndex >= 0) nextItems[nextIndex] = nextItem;

                    queue.updateItem(item.id, () => nextItem);
                } catch (error) {
                    queue.updateItem(item.id, (current) => ({
                        ...current,
                        status: "failed",
                        progress: 100,
                        processingPhase: "failed",
                        processingSummary: "Processing failed",
                        error: error instanceof Error ? error.message : "OCR failed.",
                    }));
                }
            }
        } finally {
            processingRef.current = false;
            startTransition(() => {
                setMergedText(mergeSelectedOcrText(nextItems));
            });
            setMergedTextDirty(false);
            setStatusMessage(
                "Scan complete. AccCalc picked a suggested route and kept the deeper OCR review behind expandable panels."
            );
        }
    }

    useEffect(() => {
        if (!activePreviewId && queue.items[0]) {
            setActivePreviewId(queue.items[0].id);
        }
    }, [activePreviewId, queue.items]);

    useEffect(() => {
        if (mergedTextDirty) return;
        setMergedText(queue.mergedSelectedText);
    }, [mergedTextDirty, queue.mergedSelectedText]);

    useEffect(() => {
        const hasQueued = queue.items.some(
            (item) => item.status === "queued" || item.status === "failed"
        );
        if (!hasQueued || processingRef.current || ocr.busy || preprocess.busy) return;
        void processQueue();
    }, [ocr.busy, preprocess.busy, queue.items]);

    function sendTextToSmartSolver(text: string) {
        if (text.trim() === "") return;
        navigate("/smart/solver", { state: { from: "scan-check", query: text } });
    }

    function handleSendSingle(item: ScanImageItem) {
        sendTextToSmartSolver(item.editableText || item.parsedResult?.cleanedText || "");
    }

    function openProcessCostingWorkspace() {
        if (!accountingSession) return;
        navigate(accountingSession.routeHint, {
            state: {
                from: "scan-check",
                prefill: prefillFromStructuredFields(accountingSession.structuredFields),
                scanReview: accountingSession,
            },
        });
    }

    function openPrimaryRoute() {
        if (accountingSession) {
            openProcessCostingWorkspace();
            return;
        }

        if (primaryRouteHint === "/basic") {
            navigate(primaryRouteHint, {
                state: { from: "scan-check", expression: primaryItem?.editableText ?? "" },
            });
            return;
        }

        navigate(primaryRouteHint, {
            state: {
                from: "scan-check",
                query:
                    primaryItem?.editableText ||
                    mergedText ||
                    queue.mergedSelectedText ||
                    primaryItem?.parsedResult?.cleanedText ||
                    "",
            },
        });
    }

    return (
        <CalculatorPageLayout
            badge="Smart Tools / Scan & Check"
            title="Scan & Check"
            description="A simpler browser-first scan flow for equations, textbook pages, worked solutions, and accounting worksheets. AccCalc now preprocesses, reads, classifies, and suggests the next tool automatically."
            prioritizeResultSection
            inputSection={
                <div className="space-y-4">
                    <SectionCard className="app-hero-panel">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="max-w-2xl">
                                <p className="app-card-title text-base">Capture or upload</p>
                                <p className="app-body-md mt-2 text-sm">
                                    Add image files and AccCalc will start preprocessing, OCR, classification, and routing automatically. Advanced controls stay hidden until review is actually needed.
                                </p>
                            </div>
                            <span className="app-chip-accent rounded-full px-3 py-1 text-[0.62rem]">
                                {FLOW_STEPS[flowStage]}
                            </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {FLOW_STEPS.map((step, index) => (
                                <span
                                    key={step}
                                    className={[
                                        "rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em]",
                                        index <= flowStage
                                            ? "app-chip-accent"
                                            : "app-chip",
                                    ].join(" ")}
                                >
                                    {step}
                                </span>
                            ))}
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <ScanDropzone onFiles={queue.addFiles} />
                            <ScanCameraCapture onCapture={(file) => void queue.addFiles([file])} />
                        </div>

                        <p className="app-helper mt-4 text-xs">{statusMessage}</p>
                        {queue.queueError ? (
                            <p className="app-helper mt-2 text-xs text-[color:var(--app-danger)]">
                                {queue.queueError}
                            </p>
                        ) : null}
                    </SectionCard>

                    {queue.items.length > 0 ? (
                        <ScanProgressPanel
                            items={queue.items}
                            overallProgress={overallProgress}
                            sessionPhase={sessionPhase}
                        />
                    ) : null}

                    {activePreview ? (
                        <DisclosurePanel
                            title="Image enhancement preview"
                            summary="Open this only if you want to compare the original with the processed OCR-ready version."
                            badge="Preview"
                            defaultOpen={false}
                        >
                            <ScanPreprocessPreview
                                originalUrl={activePreview.previewUrl}
                                processedUrl={activePreview.processedPreviewUrl}
                            />
                            {activePreview.preprocessNotes?.length ? (
                                <div className="mt-3 space-y-1">
                                    {activePreview.preprocessNotes.map((note) => (
                                        <p key={note} className="app-helper text-xs">
                                            {note}
                                        </p>
                                    ))}
                                </div>
                            ) : null}
                        </DisclosurePanel>
                    ) : null}
                </div>
            }
            resultSection={
                queue.items.length > 0 ? (
                    <div className="space-y-4">
                        <ScanResultOverview
                            title={
                                accountingSession
                                    ? "This looks like a linked accounting problem set"
                                    : "Scan understanding is ready"
                            }
                            summary={
                                accountingSession?.summary ??
                                primaryItem?.processingSummary ??
                                primaryItem?.parsedResult?.notes[0] ??
                                "Review the extracted summary and continue with the suggested tool."
                            }
                            detectedType={
                                accountingSession
                                    ? "Accounting worksheet session"
                                    : primaryItem?.parsedResult?.kind?.replaceAll("-", " ") ??
                                      "Unknown"
                            }
                            confidenceLabel={
                                primaryItem?.ocrResult
                                    ? explainConfidence(primaryItem.ocrResult.confidence)
                                    : "Confidence pending"
                            }
                            suggestedWorkspaceLabel={getRouteLabel(primaryRouteHint)}
                            quickFacts={buildQuickFacts(queue.items, primaryItem, accountingPageCount)}
                            flags={reviewFlags}
                            primaryActionLabel={primaryActionLabel}
                            onPrimaryAction={openPrimaryRoute}
                            onToggleAdvanced={() => setShowAdvancedReview((current) => !current)}
                        />

                        <ScanActionBar
                            primaryLabel={primaryActionLabel}
                            onPrimaryAction={openPrimaryRoute}
                            onReviewExtraction={() => setShowAdvancedReview((current) => !current)}
                            disabled={ocr.busy || preprocess.busy}
                            summary={
                                accountingSession
                                    ? "The merged worksheet session already has a suggested process-costing route."
                                    : "AccCalc picked one next action. Open deeper OCR review only if you want to inspect or correct details."
                            }
                        />

                        <ScanProblemSessionPanel
                            session={accountingSession}
                            onOpenWorkspace={openProcessCostingWorkspace}
                        />

                        <DisclosurePanel
                            key={showAdvancedReview ? "advanced-open" : "advanced-closed"}
                            title="Image-by-image review"
                            summary="Per-image editing, retry, and page-order controls live here instead of the default surface."
                            badge={`${queue.items.length} pages`}
                            defaultOpen={showAdvancedReview}
                        >
                            <ScanImageQueue
                                items={queue.items}
                                onRemove={queue.removeItem}
                                onMove={queue.moveItem}
                                onToggleSelected={queue.toggleSelected}
                                onSendToSmartSolver={handleSendSingle}
                                onTextChange={(id, value) =>
                                    queue.updateItem(id, (item) => ({ ...item, editableText: value }))
                                }
                                onStructuredFieldsChange={(id, nextFields) =>
                                    queue.updateItem(id, (item) => ({
                                        ...item,
                                        parsedResult: item.parsedResult
                                            ? { ...item.parsedResult, structuredFields: nextFields }
                                            : item.parsedResult,
                                    }))
                                }
                                onReplace={(id, file) => void queue.replaceFile(id, file)}
                                onSetActivePreview={setActivePreviewId}
                                onRetry={(id) =>
                                    queue.updateItem(id, (item) => ({
                                        ...item,
                                        status: "queued",
                                        progress: 0,
                                        error: null,
                                        ocrResult: null,
                                        parsedResult: null,
                                        editableText: "",
                                        processingPhase: "queued",
                                        processingSummary: "Waiting to restart",
                                        qualityWarnings: [],
                                        preprocessNotes: [],
                                        processedPreviewUrl: null,
                                    }))
                                }
                            />
                        </DisclosurePanel>

                        <ScanExtractedTextPanel
                            items={queue.items}
                            mergedText={mergedText || queue.mergedSelectedText}
                            onMergedTextChange={(value) => {
                                setMergedText(value);
                                setMergedTextDirty(true);
                            }}
                        />
                    </div>
                ) : (
                    <SectionCard>
                        <p className="app-card-title text-sm">No images queued</p>
                        <p className="app-body-md mt-2 text-sm">
                            Add one or more images to let AccCalc auto-read, classify, summarize, and suggest the best next tool.
                        </p>
                    </SectionCard>
                )
            }
            explanationSection={
                <div className="space-y-4">
                    <ChartInsightPanel
                        title="Confidence-aware workflow"
                        meaning={buildComparisonNarrative(
                            queue.items.map((item) => ({
                                label: item.name,
                                value:
                                    item.parsedResult?.extractionConfidence ??
                                    item.ocrResult?.confidence ??
                                    0,
                            }))
                        )}
                        importance="OCR confidence, structured extraction confidence, and route confidence stay separate so the simpler interface still remains transparent."
                        highlights={buildChartHighlights(
                            queue.items.map((item) => ({
                                label: item.name,
                                value:
                                    item.parsedResult?.parseConfidence ??
                                    item.ocrResult?.confidence ??
                                    0,
                            }))
                        )}
                    />
                    <InterpretationBlock body="3.2.2 simplifies Scan & Check into a clearer flow: upload, process, review only when needed, then follow one suggested next step. The OCR stack remains browser-first and confidence-aware underneath." />
                    <CommonMistakesBlock
                        mistakes={[
                            "Handwritten digits on dark worksheets can still confuse 0, 6, 8, comma placement, and percentages.",
                            "Merged image sets should still be checked for order when a problem is split across data, solution, and answer pages.",
                            "Low-confidence scans may be routed correctly at a high level while still needing field-level correction before checking results.",
                        ]}
                    />
                    <StudyTipBlock body="If the scan is low-confidence, correct the few flagged values first instead of editing every line. That keeps the review lighter and usually fixes the route and totals." />
                    <PracticalMeaningBlock body="This release broadens Scan & Check for equations, textbook pages, notes, business/econ prompts, and accounting worksheets while keeping the architecture ready for stronger OCR providers later." />
                </div>
            }
            headerMeta={
                <span className="app-chip inline-flex items-center rounded-full px-3 py-1 text-xs">
                    {ocr.engineLabel}
                </span>
            }
        />
    );
}
