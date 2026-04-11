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
import ScanImagePreviewModal from "../components/ScanImagePreviewModal";
import ScanImageQueue from "../components/ScanImageQueue";
import ScanPreprocessPreview from "../components/ScanPreprocessPreview";
import ScanProblemSessionPanel from "../components/ScanProblemSessionPanel";
import ScanProgressPanel from "../components/ScanProgressPanel";
import ScanResultOverview from "../components/ScanResultOverview";
import ScanToast from "../components/ScanToast";
import { useImagePreprocess } from "../hooks/useImagePreprocess";
import { useOcrWorker } from "../hooks/useOcrWorker";
import { useScanQueue } from "../hooks/useScanQueue";
import { buildAccountingProblemSession } from "../services/accounting/accountingProblemSession";
import { explainConfidence, getConfidenceLevel } from "../services/ocr/ocrConfidence";
import { mergeSelectedOcrText } from "../services/ocr/ocrMerge";
import { parseOcrText } from "../services/ocr/ocrParser";
import type { ScanImageItem, ScanProcessingPhase, StructuredScanField } from "../types";

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
const PAGE_STATE_KEY = "acccalc.scan.page-state";

function getRouteLabel(routeHint?: string) {
    switch (routeHint) {
        case "/accounting/process-costing-workspace":
            return "Process Costing Workspace";
        case "/accounting/department-transferred-in-process-costing":
            return "Department 2 Process Costing";
        case "/business/cvp-analysis":
            return "CVP Analysis";
        case "/basic":
            return "Basic Calculator";
        case "/economics/market-equilibrium":
            return "Market Equilibrium";
        case "/business/break-even":
            return "Break-even";
        case "/accounting/partnership-dissolution":
            return "Partnership Dissolution";
        default:
            return "Smart Solver";
    }
}

function getConfidenceChipLabel(score?: number) {
    if (!score) return "Pending";
    if (score >= 85) return "High confidence";
    if (score >= 60) return "Review advised";
    return "Low confidence";
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

function buildQuickFacts(items: ScanImageItem[], primaryItem: ScanImageItem | null, accountingPageCount: number) {
    const selectedCount = items.filter((item) => item.selected).length;
    const extractedValues = primaryItem?.parsedResult?.extractedValues ?? [];
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
        { label: "Values", value: String(extractedValues.length) },
    ];
}

type ToastState = {
    title: string;
    body?: string;
    tone?: "info" | "success" | "warning";
};

export default function ScanCheckPage() {
    const navigate = useNavigate();
    const queue = useScanQueue();
    const ocr = useOcrWorker();
    const preprocess = useImagePreprocess();
    const processingRef = useRef(false);
    const restoredToastShownRef = useRef(false);
    const [mergedText, setMergedText] = useState("");
    const [mergedTextDirty, setMergedTextDirty] = useState(false);
    const [activePreviewId, setActivePreviewId] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [showAdvancedReview, setShowAdvancedReview] = useState(false);
    const [statusMessage, setStatusMessage] = useState(
        "Upload or capture images and AccCalc will process them automatically."
    );
    const [toast, setToast] = useState<ToastState | null>(null);

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
        return queue.items.reduce((sum, item) => sum + Math.max(0, item.progress), 0) / queue.items.length;
    }, [queue.items]);
    const sessionPhase = useMemo(() => getSessionPhase(queue.items), [queue.items]);
    const accountingPageCount = useMemo(
        () => queue.items.filter((item) => item.parsedResult?.accounting).length,
        [queue.items]
    );
    const flowStage = useMemo(() => {
        if (queue.items.length === 0) return 0;
        if (queue.items.some((item) =>
            ["queued", "preprocessing", "recognizing", "classifying", "extracting", "routing"].includes(item.status)
        )) return 1;
        if (queue.items.some((item) => item.status === "needs review" || item.confidenceLevel === "low" || ((item.parsedResult?.likelyIssues ?? []).length > 0))) {
            return 2;
        }
        return 3;
    }, [queue.items]);
    const reviewFlags = useMemo(() => {
        const flags = new Set<string>();
        queue.items.forEach((item) => {
            if (item.confidenceLevel === "low") flags.add("Low OCR confidence detected on at least one image.");
            item.qualityWarnings?.forEach((warning) => flags.add(warning));
            (item.parsedResult?.likelyIssues ?? []).forEach((issue) => flags.add(issue));
            (item.parsedResult?.flaggedValues ?? []).forEach((flag) => flags.add(flag));
        });
        return Array.from(flags);
    }, [queue.items]);
    const primaryRouteHint = accountingSession?.routeHint ?? primaryItem?.parsedResult?.routeHint ?? "/smart/solver";
    const scanRecommendations = primaryItem?.parsedResult?.recommendations ?? [];
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

    function showToast(nextToast: ToastState) {
        setToast(nextToast);
    }

    function handleScanFeedback(
        message: string,
        tone: "info" | "success" | "warning" = "info"
    ) {
        setStatusMessage(message);
        showToast({
            title:
                tone === "success"
                    ? "Scan updated"
                    : tone === "warning"
                      ? "Scan attention"
                      : "Scan status",
            body: message,
            tone,
        });
    }

    function clearSavedPageState() {
        if (typeof window === "undefined") return;
        window.localStorage.removeItem(PAGE_STATE_KEY);
    }

    async function handleAddFiles(files: File[]) {
        const result = await queue.addFiles(files);
        if (result.added > 0) {
            setStatusMessage(`${result.added} image${result.added === 1 ? "" : "s"} added. AccCalc is processing them now.`);
            showToast({
                title: `${result.added} image${result.added === 1 ? "" : "s"} added`,
                body: "Processing has started automatically.",
                tone: "info",
            });
        }
    }

    async function handleReplaceImage(id: string, file: File) {
        const success = await queue.replaceFile(id, file);
        if (!success) return;
        showToast({
            title: "Image updated",
            body: "The page was replaced and the results will refresh automatically.",
            tone: "info",
        });
    }

    function handleRemoveImage(id: string) {
        queue.removeItem(id);
        showToast({
            title: "Image removed",
            body: "The scan session was updated.",
            tone: "info",
        });
    }

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
                query: primaryItem?.editableText || mergedText || queue.mergedSelectedText || primaryItem?.parsedResult?.cleanedText || "",
            },
        });
    }

    async function processQueue() {
        if (processingRef.current) return;
        processingRef.current = true;
        const nextItems = [...queue.items];
        try {
            for (const item of queue.items) {
                if (item.status === "completed" || item.status === "needs review") continue;
                try {
                    queue.updateItem(item.id, (current) => ({
                        ...current,
                        status: "preprocessing",
                        progress: 8,
                        processingPhase: "preparing",
                        processingSummary: "Preparing image",
                        error: null,
                    }));
                    const base64Source = item.sourceDataUrl ?? (await queue.fileToDataUrl(item.file));
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
                        detectedImageType: processed.detectedImageType,
                        qualityScore: processed.qualityScore,
                        preprocessNotes: processed.notes,
                        qualityWarnings: processed.qualityWarnings,
                        status: "recognizing",
                        progress: 24,
                        processingPhase: "reading",
                        processingSummary:
                            processed.qualityWarnings?.[0] ??
                            `Reading ${processed.detectedImageType.replaceAll("-", " ")} text`,
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
                            (parsed.accounting?.fields ?? []).length > 0
                                ? "Extracting structured fields"
                                : "Extracting values and cleaning text",
                    }));
                    const confidenceLevel = getConfidenceLevel(ocrResult.confidence);
                    const status: ScanImageItem["status"] =
                        confidenceLevel === "low" || parsed.parseConfidence < 60 ? "needs review" : "completed";
                    const nextItem: ScanImageItem = {
                        ...item,
                        processedPreviewUrl: processed.processedDataUrl,
                        detectedImageType: processed.detectedImageType,
                        qualityScore: processed.qualityScore,
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
                                ? parsed.flaggedValues.length > 0
                                    ? "Review flagged numbers before checking"
                                    : "Review suggested before checking"
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
            startTransition(() => setMergedText(mergeSelectedOcrText(nextItems)));
            setMergedTextDirty(false);
            setStatusMessage("Processing finished. AccCalc refreshed the extraction and suggested the next best path.");
            const nextFlags = new Set<string>();
            nextItems.forEach((item) => {
                if (item.confidenceLevel === "low") nextFlags.add("low");
                item.qualityWarnings?.forEach((warning) => nextFlags.add(warning));
                (item.parsedResult?.likelyIssues ?? []).forEach((issue) => nextFlags.add(issue));
                (item.parsedResult?.flaggedValues ?? []).forEach((flag) => nextFlags.add(flag));
            });
            showToast({
                title: `${nextItems.length} image${nextItems.length === 1 ? "" : "s"} processed`,
                body:
                    nextFlags.size > 0
                        ? "Text cleaned for easier review, but some values still need checking before solving."
                        : "Text cleaned and normalized. Review extracted values, then continue with the suggested tool.",
                tone: nextFlags.size > 0 ? "warning" : "success",
            });
        }
    }

    useEffect(() => {
        if (!activePreviewId && queue.items[0]) setActivePreviewId(queue.items[0].id);
        if (activePreviewId && !queue.items.some((item) => item.id === activePreviewId)) {
            setActivePreviewId(queue.items[0]?.id ?? null);
            setPreviewOpen(false);
        }
    }, [activePreviewId, queue.items]);

    useEffect(() => {
        if (mergedTextDirty) return;
        setMergedText(queue.mergedSelectedText);
    }, [mergedTextDirty, queue.mergedSelectedText]);

    useEffect(() => {
        if (!queue.hydrated || typeof window === "undefined") return;
        const raw = window.localStorage.getItem(PAGE_STATE_KEY);
        if (!raw) return;
        try {
            const parsed = JSON.parse(raw) as {
                mergedText?: string;
                mergedTextDirty?: boolean;
                activePreviewId?: string | null;
            };
            if (parsed.mergedTextDirty && parsed.mergedText) {
                setMergedText(parsed.mergedText);
                setMergedTextDirty(true);
            }
            if (parsed.activePreviewId) {
                setActivePreviewId(parsed.activePreviewId);
            }
        } catch {
            clearSavedPageState();
        }
    }, [queue.hydrated]);

    useEffect(() => {
        if (!queue.hydrated || typeof window === "undefined") return;
        window.localStorage.setItem(
            PAGE_STATE_KEY,
            JSON.stringify({
                mergedText,
                mergedTextDirty,
                activePreviewId,
            })
        );
    }, [activePreviewId, mergedText, mergedTextDirty, queue.hydrated]);

    useEffect(() => {
        if (!queue.restoredFromSession || restoredToastShownRef.current) return;
        restoredToastShownRef.current = true;
        showToast({
            title: "Previous scan restored",
            body: queue.restoredWithRepair
                ? "A partially invalid saved scan session was repaired and restored safely."
                : "Your images and extracted results are back so you can continue where you left off.",
            tone: "info",
        });
    }, [queue.restoredFromSession, queue.restoredWithRepair]);

    useEffect(() => {
        const hasQueued = queue.items.some((item) => item.status === "queued" || item.status === "failed");
        if (!hasQueued || processingRef.current || ocr.busy || preprocess.busy || !queue.hydrated) return;
        void processQueue();
    }, [ocr.busy, preprocess.busy, queue.hydrated, queue.items]);

    return (
        <>
            <CalculatorPageLayout
                badge="Smart Tools / Scan & Check"
                title="Scan & Check"
                description="A cleaner browser-first scan flow for equations, textbook pages, worked solutions, and accounting worksheets. It now keeps your scan session on-device while using a lighter review experience across mobile and desktop."
                prioritizeResultSection
                inputSection={
                    <div className="space-y-4">
                        <SectionCard className="app-hero-panel">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0 max-w-2xl">
                                    <p className="app-card-title text-base">Capture or upload</p>
                                    <p className="app-body-md app-wrap-anywhere mt-2 text-sm">
                                        Add images and AccCalc will preprocess, read, classify, and suggest the best next step automatically. Your current scan session now stays available when you leave and come back.
                                    </p>
                                </div>
                                <span className="app-chip-accent max-w-full rounded-full px-3 py-1 text-[0.62rem] whitespace-normal">
                                    {FLOW_STEPS[flowStage]}
                                </span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {FLOW_STEPS.map((step, index) => (
                                    <span
                                        key={step}
                                        className={[
                                            "rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em]",
                                            index <= flowStage ? "app-chip-accent" : "app-chip",
                                            "max-w-full whitespace-normal",
                                        ].join(" ")}
                                    >
                                        {step}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(19rem,0.9fr)]">
                                <ScanDropzone onFiles={handleAddFiles} />
                                <ScanCameraCapture
                                    onCapture={(file) => handleAddFiles([file])}
                                    onFeedback={handleScanFeedback}
                                />
                            </div>

                            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                <p className="app-helper app-wrap-anywhere text-xs">{statusMessage}</p>
                                {queue.items.length > 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            void queue.resetSession();
                                            setMergedText("");
                                            setMergedTextDirty(false);
                                            setActivePreviewId(null);
                                            clearSavedPageState();
                                            showToast({
                                                title: "Scan session cleared",
                                                body: "Saved images and OCR results were removed from this device.",
                                                tone: "info",
                                            });
                                        }}
                                        className="app-button-ghost min-h-10 rounded-xl px-4 py-2 text-sm font-medium"
                                    >
                                        Clear session
                                    </button>
                                ) : null}
                            </div>

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
                        ) : !queue.hydrated ? (
                            <SectionCard>
                                <p className="app-card-title text-sm">Restoring scan session</p>
                                <p className="app-helper mt-2 text-xs">
                                    Loading any recent images and OCR results saved on this device.
                                </p>
                            </SectionCard>
                        ) : null}

                        {activePreview ? (
                            <DisclosurePanel
                                title="Image enhancement preview"
                                summary="Compare the original and processed version when OCR quality looks off."
                                badge="Preview"
                                defaultOpen={false}
                            >
                                <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
                                    <ScanPreprocessPreview
                                        originalUrl={activePreview.previewUrl}
                                        processedUrl={activePreview.processedPreviewUrl}
                                    />
                                    <div className="space-y-3">
                                        <div className="app-subtle-surface rounded-[1rem] px-4 py-3">
                                            <p className="app-card-title text-sm">Current image</p>
                                            <p className="app-helper app-wrap-anywhere mt-1 text-xs">
                                                {activePreview.name}
                                            </p>
                                            {activePreview.detectedImageType ? (
                                                <p className="app-helper app-wrap-anywhere mt-2 text-xs">
                                                    Detected as {activePreview.detectedImageType.replaceAll("-", " ")}
                                                    {typeof activePreview.qualityScore === "number"
                                                        ? ` with quality score ${activePreview.qualityScore}/100.`
                                                        : "."}
                                                </p>
                                            ) : null}
                                        </div>
                                        {activePreview.preprocessNotes?.length ? (
                                            <div className="app-subtle-surface rounded-[1rem] px-4 py-3">
                                                <p className="app-card-title text-sm">Enhancement notes</p>
                                                <div className="mt-2 space-y-1">
                                                    {activePreview.preprocessNotes.map((note) => (
                                                        <p key={note} className="app-helper app-wrap-anywhere text-xs">
                                                            {note}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </DisclosurePanel>
                        ) : null}
                    </div>
                }
                resultSection={
                    queue.items.length > 0 ? (
                        <div className="space-y-4">
                            <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)]">
                                <div className="min-w-0 space-y-4">
                                    <ScanResultOverview
                                        title={
                                            accountingSession
                                                ? "This looks like a linked accounting problem set"
                                                : "Scan understanding is ready"
                                        }
                                        summary={
                                            accountingSession?.summary ??
                                            primaryItem?.processingSummary ??
                                            (primaryItem?.parsedResult?.notes ?? [])[0] ??
                                            "Review the extracted summary and continue with the suggested tool."
                                        }
                                        detectedType={
                                            accountingSession
                                                ? "Accounting worksheet session"
                                                : primaryItem?.parsedResult?.kind?.replaceAll("-", " ") ??
                                                  "Unknown"
                                        }
                                        confidenceLabel={getConfidenceChipLabel(primaryItem?.ocrResult?.confidence)}
                                        confidenceSummary={
                                            primaryItem?.ocrResult
                                                ? explainConfidence(primaryItem.ocrResult.confidence)
                                                : "Confidence is still being calculated."
                                        }
                                        suggestedWorkspaceLabel={getRouteLabel(primaryRouteHint)}
                                        routeReason={
                                            accountingSession
                                                ? "The selected pages behave like one accounting worksheet session, so AccCalc is keeping the workflow together."
                                                : primaryItem?.parsedResult?.routeReason
                                        }
                                        alternatives={scanRecommendations
                                            .filter((entry) => entry.path !== primaryRouteHint)
                                            .map((entry) => ({
                                                label: entry.label,
                                                reason: entry.reason,
                                                confidence: entry.confidence,
                                            }))}
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
                                                : "AccCalc picked one next action. Open the deeper review only when you want to inspect or correct details."
                                        }
                                    />
                                </div>

                                <div className="min-w-0 space-y-4">
                                    <SectionCard>
                                        <p className="app-card-title text-sm">After processing</p>
                                        <div className="mt-3 space-y-2">
                                            <p className="app-helper app-wrap-anywhere text-xs">
                                                1. Glance at the detected type and suggested route.
                                            </p>
                                            <p className="app-helper app-wrap-anywhere text-xs">
                                                2. If warnings appear, review only the flagged values first.
                                            </p>
                                            <p className="app-helper app-wrap-anywhere text-xs">
                                                3. Continue into the suggested workspace or SmartSolver when the extraction looks right.
                                            </p>
                                        </div>
                                    </SectionCard>

                                    <ScanProblemSessionPanel
                                        session={accountingSession}
                                        onOpenWorkspace={openProcessCostingWorkspace}
                                    />
                                </div>
                            </div>

                            <DisclosurePanel
                                key={showAdvancedReview ? "advanced-open" : "advanced-closed"}
                                title="Image-by-image review"
                                summary="Preview, remove, replace, reorder, or edit only the pages that need more attention."
                                badge={`${queue.items.length} pages`}
                                defaultOpen={showAdvancedReview}
                            >
                                <ScanImageQueue
                                    items={queue.items}
                                    onRemove={handleRemoveImage}
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
                                    onReplace={(id, file) => void handleReplaceImage(id, file)}
                                    onSetActivePreview={(id) => {
                                        setActivePreviewId(id);
                                        setPreviewOpen(true);
                                    }}
                                    onRetry={(id) => {
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
                                            detectedImageType: undefined,
                                            qualityScore: undefined,
                                        }));
                                        showToast({
                                            title: "Reprocessing image",
                                            body: "AccCalc restarted OCR for that page.",
                                            tone: "info",
                                        });
                                    }}
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
                            <p className="app-card-title text-sm">
                                {queue.hydrated ? "No images queued" : "Loading saved scan data"}
                            </p>
                            <p className="app-body-md mt-2 text-sm">
                                {queue.hydrated
                                    ? "Add one or more images to let AccCalc auto-read, classify, summarize, and suggest the best next tool."
                                    : "Recent scan images and OCR results are being restored from this device if available."}
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
                            importance="OCR confidence, structured extraction confidence, and route confidence stay separate so the interface can stay simpler without hiding uncertainty."
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
                        <InterpretationBlock body="This update keeps Scan & Check browser-first and confidence-aware, but makes the flow more resilient: images fit better, sessions persist on-device, and the review surface is easier to read on narrow screens." />
                        <CommonMistakesBlock
                            mistakes={[
                                "Dark handwritten worksheets can still confuse 0, 6, 8, comma placement, and percentage symbols.",
                                "Wide labels and long file names now wrap better, but low-confidence scans still need focused review before checking totals.",
                                "Merged image sets should still be checked for logical order when a problem spans data, solution, and answer pages.",
                            ]}
                        />
                        <StudyTipBlock body="If the scan looks mostly correct, focus on flagged lines first. Reviewing a few risky values is usually faster than rewriting the whole OCR output." />
                        <PracticalMeaningBlock body="AccCalc now stores recent scan sessions locally so you can leave, come back, and keep working without restarting the OCR flow from scratch." />
                    </div>
                }
                headerMeta={
                    <span className="app-chip inline-flex items-center rounded-full px-3 py-1 text-xs">
                        {ocr.engineLabel}
                    </span>
                }
            />

            <ScanImagePreviewModal
                open={previewOpen}
                title={activePreview?.name ?? "Scan image"}
                imageSrc={activePreview?.previewUrl ?? null}
                helperText="Use this larger preview to confirm page order, cropping, and handwriting clarity before trusting the extracted values."
                onClose={() => setPreviewOpen(false)}
            />

            <ScanToast
                open={Boolean(toast)}
                title={toast?.title ?? ""}
                body={toast?.body}
                tone={toast?.tone}
                onClose={() => setToast(null)}
            />
        </>
    );
}
