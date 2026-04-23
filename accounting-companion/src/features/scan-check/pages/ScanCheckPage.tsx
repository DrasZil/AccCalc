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
import RelatedLinksPanel from "../../../components/RelatedLinksPanel";
import { buildChartHighlights } from "../../../utils/charts/chartHighlights";
import { buildComparisonNarrative } from "../../../utils/charts/chartNarratives";
import { getRouteMeta } from "../../../utils/appCatalog";
import { useAppNotifications } from "../../layout/AppNotifications";
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
import StudySupportPanel from "../../../components/StudySupportPanel";
import { useImagePreprocess } from "../hooks/useImagePreprocess";
import { useOcrWorker } from "../hooks/useOcrWorker";
import { useScanQueue } from "../hooks/useScanQueue";
import { buildAccountingProblemSession } from "../services/accounting/accountingProblemSession";
import { explainConfidence, getConfidenceLevel } from "../services/ocr/ocrConfidence";
import { mergeSelectedOcrText } from "../services/ocr/ocrMerge";
import { parseScanTextInBackground } from "../services/ocr/scanProcessingClient";
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
    return (
        getRouteMeta(routeHint ?? "")?.shortLabel ??
        getRouteMeta(routeHint ?? "")?.label ??
        "Smart Solver"
    );
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

function buildQuickFacts(
    items: ScanImageItem[],
    primaryItem: ScanImageItem | null,
    accountingPageCount: number
) {
    const selectedCount = items.filter((item) => item.selected).length;
    const extractedValues = primaryItem?.parsedResult?.extractedValues ?? [];
    const structuredFields = primaryItem?.parsedResult?.structuredFields ?? [];
    const reviewFieldCount = structuredFields.filter((field) => field.needsReview).length;
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
        { label: "Fields", value: String(structuredFields.length) },
        { label: "Review", value: String(reviewFieldCount) },
    ];
}

type ToastState = {
    title: string;
    body?: string;
    tone?: "info" | "success" | "warning";
};

export default function ScanCheckPage() {
    const navigate = useNavigate();
    const { notify } = useAppNotifications();
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
    const [routeReviewAcknowledgedKey, setRouteReviewAcknowledgedKey] = useState("");
    const [statusMessage, setStatusMessage] = useState(
        "Upload or capture images and AccCalc will process them automatically."
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
    const studyRecommendations = primaryItem?.parsedResult?.studyRecommendations ?? [];
    const primaryStudyRecommendation = studyRecommendations[0] ?? null;
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
    const routeReviewKey = [
        primaryItem?.id ?? "none",
        primaryRouteHint,
        primaryItem?.confidenceLevel ?? "unknown",
        reviewFlags.slice(0, 4).join("|"),
    ].join(":");
    const shouldReviewBeforeRoute =
        reviewFlags.length > 0 ||
        primaryItem?.confidenceLevel === "low" ||
        (primaryItem?.parsedResult?.parseConfidence ?? 100) < 60 ||
        (primaryItem?.parsedResult?.structuredFields ?? []).some((field) => field.needsReview);

    function showToast(nextToast: ToastState) {
        notify({
            title: nextToast.title,
            message: nextToast.body,
            tone: nextToast.tone ?? "info",
            dedupeKey: `scan:${nextToast.title}:${nextToast.body ?? ""}`,
        });
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
        if (shouldReviewBeforeRoute && routeReviewAcknowledgedKey !== routeReviewKey) {
            setRouteReviewAcknowledgedKey(routeReviewKey);
            setShowAdvancedReview(true);
            handleScanFeedback(
                "Review the flagged OCR values before opening the suggested route. Click the primary action again after the risky fields look right.",
                "warning"
            );
            return;
        }

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
                    const parsed = await parseScanTextInBackground(
                        ocrResult.text,
                        ocrResult.confidence
                    );
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
                description="Upload a worksheet, textbook page, or worked solution, let AccCalc read it, then review only the uncertain parts before moving into the next tool or lesson."
                desktopLayout="result-focus"
                pageWidth="data"
                prioritizeResultSection
                startGuide={{
                    badge: "How to use it",
                    title: "Check the uncertain parts first",
                    summary:
                        "This workflow is meant to stay calm: upload the page, verify the risky values, then continue into the suggested route when the text already makes sense.",
                    steps: [
                        {
                            title: "Add the image or worksheet page",
                            description:
                                "AccCalc preprocesses and reads it automatically, then detects the likely topic and next route.",
                        },
                        {
                            title: "Review flagged values only",
                            description:
                                "Focus on low-confidence numbers, labels, and percentages instead of re-reading every clean line.",
                        },
                        {
                            title: "Open the suggested tool or lesson",
                            description:
                                "Once the important values look right, continue into the matched workspace, study topic, or quiz.",
                        },
                    ],
                }}
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

                            <div className="app-adaptive-main app-adaptive-main--balanced mt-4">
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

                        <div className="grid gap-3 xl:grid-cols-3">
                            <div className="app-subtle-surface rounded-[1.15rem] px-4 py-4">
                                <p className="app-card-title text-sm">Best for</p>
                                <p className="app-body-md mt-2 text-sm">
                                    Worksheet photos, textbook pages, screenshots, and worked solutions that need cleanup before solving or checking.
                                </p>
                            </div>
                            <div className="app-tone-warning rounded-[1.15rem] px-4 py-4">
                                <p className="app-card-title text-sm">Not ideal for</p>
                                <p className="app-body-md mt-2 text-sm">
                                    Trusting every extracted number instantly, using OCR as a final answer checker, or solving a topic before the risky values are verified.
                                </p>
                            </div>
                            <div className="app-tone-info rounded-[1.15rem] px-4 py-4">
                                <p className="app-card-title text-sm">Choose another tool when</p>
                                <p className="app-body-md mt-2 text-sm">
                                    Use Smart Solver when the text is already typed, and open a lesson or quiz when the topic itself is still unclear after the scan.
                                </p>
                            </div>
                        </div>

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
                                <div className="app-adaptive-main app-adaptive-main--balanced">
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
                            <div className="app-workspace-grid app-workspace-grid--scan">
                                <div className="app-workspace-main">
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

                                    <DisclosurePanel
                                        title="Merged extracted text"
                                        summary="Open this when you want to edit, copy, or send the cleaned text to another tool."
                                        badge={mergedTextDirty ? "Edited" : "Review"}
                                    >
                                        <ScanExtractedTextPanel
                                            items={queue.items}
                                            mergedText={mergedText || queue.mergedSelectedText}
                                            onMergedTextChange={(value) => {
                                                setMergedText(value);
                                                setMergedTextDirty(true);
                                            }}
                                        />
                                    </DisclosurePanel>
                                </div>

                                <div className="app-workspace-side">
                                    <SectionCard>
                                        <p className="app-card-title text-sm">Next best move</p>
                                        <div className="mt-3 space-y-2">
                                            <p className="app-helper app-wrap-anywhere text-xs">
                                                Best next tool: {getRouteLabel(primaryRouteHint)}.
                                            </p>
                                            <p className="app-helper app-wrap-anywhere text-xs">
                                                Review only flagged values first, then use the merged text editor only if the important lines still look wrong.
                                            </p>
                                            <p className="app-helper app-wrap-anywhere text-xs">
                                                {primaryStudyRecommendation
                                                    ? `Study follow-up: ${primaryStudyRecommendation.title}.`
                                                    : "If the topic still feels mixed or incomplete, continue into Smart Solver after the scan summary is clear."}
                                            </p>
                                        </div>
                                        {primaryStudyRecommendation ? (
                                            <div className="app-card-grid-readable--compact mt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(primaryStudyRecommendation.path)}
                                                    className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
                                                >
                                                    Open lesson
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(primaryStudyRecommendation.quizPath)}
                                                    className="app-button-ghost rounded-xl px-4 py-2.5 text-sm font-semibold"
                                                >
                                                    Practice quiz
                                                </button>
                                            </div>
                                        ) : null}
                                    </SectionCard>

                                    <DisclosurePanel
                                        title="Route and worksheet details"
                                        summary="Open this when you want the full session reasoning, accounting worksheet grouping, or the detailed after-processing checklist."
                                        badge={accountingSession ? "Worksheet" : "Route"}
                                        compact
                                    >
                                        <div className="space-y-4">
                                            <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                                <p className="app-card-title text-sm">After processing</p>
                                                <div className="mt-3 space-y-2">
                                                    <p className="app-helper app-wrap-anywhere text-xs">
                                                        1. Confirm the detected topic, then verify only flagged values first.
                                                    </p>
                                                    <p className="app-helper app-wrap-anywhere text-xs">
                                                        2. Use the merged text editor when OCR is mostly right but still needs cleanup.
                                                    </p>
                                                    <p className="app-helper app-wrap-anywhere text-xs">
                                                        3. Continue into the suggested workspace, lesson, or quiz once the risky lines make sense.
                                                    </p>
                                                </div>
                                            </div>

                                            <ScanProblemSessionPanel
                                                session={accountingSession}
                                                onOpenWorkspace={openProcessCostingWorkspace}
                                            />
                                        </div>
                                    </DisclosurePanel>

                                    {(scanRecommendations.length > 0 || primaryStudyRecommendation) ? (
                                        <DisclosurePanel
                                            title="Other study and tool options"
                                            summary="Keep alternate routes and follow-up study hidden until you actually want a second path."
                                            badge={`${scanRecommendations.length + (primaryStudyRecommendation ? 1 : 0)} options`}
                                            compact
                                        >
                                            <div className="space-y-4">
                                                {primaryStudyRecommendation ? (
                                                    <div className="app-tone-info rounded-[1rem] px-4 py-3.5">
                                                        <p className="app-card-title text-sm">Study follow-up</p>
                                                        <p className="app-body-md mt-2 text-sm">
                                                            {primaryStudyRecommendation.title}
                                                        </p>
                                                        <p className="app-helper app-wrap-anywhere mt-2 text-xs leading-5">
                                                            {primaryStudyRecommendation.reason}
                                                        </p>
                                                    </div>
                                                ) : null}

                                                {scanRecommendations.length > 0 ? (
                                                    <RelatedLinksPanel
                                                        title="Other suggested tools"
                                                        summary="Alternate calculators stay tucked away until you want to compare a second route."
                                                        badge={`${scanRecommendations.length} routes`}
                                                        showDescriptions
                                                        compact
                                                        defaultOpen
                                                        items={scanRecommendations.map((entry) => ({
                                                            path: entry.path,
                                                            label: entry.label,
                                                            description: entry.reason,
                                                        }))}
                                                    />
                                                ) : null}
                                            </div>
                                        </DisclosurePanel>
                                    ) : null}
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
                        <StudySupportPanel
                            topicId="scan-review"
                            topicTitle="Scan & Check"
                            lessonPath="/study/topics/scan-review"
                            quizPath="/study/quiz/scan-review"
                            intro="Scan & Check is a study workflow, not just an OCR utility. Use it to review uncertain text carefully, confirm the best next tool, and keep your scan session moving without pretending every extracted number is fully trustworthy."
                            sections={[
                                {
                                    key: "purpose",
                                    label: "What this tool is for",
                                    summary: "Read, clean, review, and route messy problem text without hiding uncertainty.",
                                    content: (
                                        <p>
                                            Use this page when a worksheet, screenshot, or photo needs to become workable digital text before you solve or verify it. The goal is not just to read the image, but to separate safe cleanup from risky correction and guide you into the next best tool.
                                        </p>
                                    ),
                                },
                                {
                                    key: "review-flow",
                                    label: "How to review a scan",
                                    summary: "Check the risky parts first instead of rereading everything.",
                                    content: (
                                        <ol className="list-decimal space-y-2 pl-5">
                                            <li>Confirm the detected problem type and suggested route.</li>
                                            <li>Review flagged numbers, percentages, and broken labels before anything else.</li>
                                            <li>Open image-by-image review only for the pages that still look suspicious.</li>
                                            <li>Continue into the suggested tool once the risky values make sense.</li>
                                        </ol>
                                    ),
                                },
                                {
                                    key: "self-check",
                                    label: "Self-check",
                                    summary: "Quick prompts before trusting the route or the cleaned text.",
                                    emphasis: "support",
                                    tone: "info",
                                    content: (
                                        <ul className="list-disc space-y-2 pl-5">
                                            <li>Do the cleaned values still match the image if you compare them line by line?</li>
                                            <li>Does the suggested tool fit the actual topic words in the problem statement?</li>
                                            <li>Would Smart Solver be safer if the scan still mixes multiple topics or partial pages?</li>
                                        </ul>
                                    ),
                                },
                            ]}
                            relatedTools={[
                                { path: "/smart/solver", label: "Smart Solver" },
                                { path: "/business/cvp-analysis", label: "CVP Analysis" },
                                { path: "/accounting/process-costing-workspace", label: "Process Costing Workspace" },
                            ]}
                        />
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
                        <InterpretationBlock body="This update keeps Scan & Check browser-first and confidence-aware, but makes the flow more resilient: images fit better, sessions persist on-device, and the review surface is easier to read on wide screens as well as narrow ones." />
                        <CommonMistakesBlock
                            mistakes={[
                                "Dark handwritten worksheets can still confuse 0, 6, 8, comma placement, and percentage symbols.",
                                "Wide labels and long file names now wrap better, but low-confidence scans still need focused review before checking totals.",
                                "Merged image sets should still be checked for logical order when a problem spans data, solution, and answer pages.",
                            ]}
                        />
                        <StudyTipBlock body="If the scan looks mostly correct, focus on flagged lines first. Reviewing a few risky values is usually faster than rewriting the whole OCR output." />
                        <PracticalMeaningBlock body="AccCalc stores recent scan sessions locally so you can leave, come back, and keep working without restarting the OCR flow from scratch." />
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

        </>
    );
}
