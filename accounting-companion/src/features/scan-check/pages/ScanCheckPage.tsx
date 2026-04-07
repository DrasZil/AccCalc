import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CalculatorPageLayout from "../../../components/CalculatorPageLayout";
import SectionCard from "../../../components/SectionCard";
import ChartInsightPanel from "../../../components/charts/ChartInsightPanel";
import CommonMistakesBlock from "../../../components/notes/CommonMistakesBlock";
import InterpretationBlock from "../../../components/notes/InterpretationBlock";
import PracticalMeaningBlock from "../../../components/notes/PracticalMeaningBlock";
import StudyTipBlock from "../../../components/notes/StudyTipBlock";
import { buildChartHighlights } from "../../../utils/charts/chartHighlights";
import { buildComparisonNarrative } from "../../../utils/charts/chartNarratives";
import { buildAccountingProblemSession } from "../services/accounting/accountingProblemSession";
import { getConfidenceLevel } from "../services/ocr/ocrConfidence";
import { mergeSelectedOcrText } from "../services/ocr/ocrMerge";
import { parseOcrText } from "../services/ocr/ocrParser";
import ScanActionBar from "../components/ScanActionBar";
import ScanCameraCapture from "../components/ScanCameraCapture";
import ScanDropzone from "../components/ScanDropzone";
import ScanExtractedTextPanel from "../components/ScanExtractedTextPanel";
import ScanImageQueue from "../components/ScanImageQueue";
import ScanPreprocessPreview from "../components/ScanPreprocessPreview";
import ScanProblemSessionPanel from "../components/ScanProblemSessionPanel";
import { useImagePreprocess } from "../hooks/useImagePreprocess";
import { useOcrWorker } from "../hooks/useOcrWorker";
import { useScanQueue } from "../hooks/useScanQueue";
import type { ScanImageItem, StructuredScanField } from "../types";

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

export default function ScanCheckPage() {
    const navigate = useNavigate();
    const queue = useScanQueue();
    const ocr = useOcrWorker();
    const preprocess = useImagePreprocess();
    const [mergedText, setMergedText] = useState("");
    const [activePreviewId, setActivePreviewId] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState(
        "Add one or more images, review the extraction, then confirm before solving."
    );

    const activePreview =
        queue.items.find((item) => item.id === activePreviewId) ?? queue.items[0] ?? null;
    const accountingSession = useMemo(
        () => buildAccountingProblemSession(queue.items.filter((item) => item.selected)),
        [queue.items]
    );

    const queueSummary = useMemo(
        () => [
            { label: "Images", value: queue.items.length },
            { label: "Selected", value: queue.items.filter((item) => item.selected).length },
            {
                label: "Accounting pages",
                value: queue.items.filter((item) => item.parsedResult?.accounting).length,
            },
        ],
        [queue.items]
    );

    async function processQueue() {
        const nextItems = [...queue.items];

        for (const item of queue.items) {
            if (item.status === "completed" && item.ocrResult) continue;

            try {
                queue.setItemStatus(item.id, "preprocessing", 12);
                const base64Source = await queue.fileToDataUrl(item.file);
                const processed = await preprocess.run(base64Source);

                queue.updateItem(item.id, (current) => ({
                    ...current,
                    processedPreviewUrl: processed.processedDataUrl,
                    preprocessNotes: processed.notes,
                }));

                queue.setItemStatus(item.id, "recognizing", 20);
                const ocrResult = await ocr.recognize(processed.processedDataUrl, (progress) =>
                    queue.setItemStatus(item.id, "recognizing", Math.max(progress, 20))
                );
                const parsed = parseOcrText(ocrResult.text, ocrResult.confidence);
                const confidenceLevel = getConfidenceLevel(ocrResult.confidence);
                const status: ScanImageItem["status"] =
                    confidenceLevel === "low" || parsed.parseConfidence < 60
                        ? "needs review"
                        : "completed";

                const nextItem = {
                    ...item,
                    processedPreviewUrl: processed.processedDataUrl,
                    preprocessNotes: processed.notes,
                    status,
                    progress: 100,
                    ocrResult,
                    parsedResult: parsed,
                    editableText: parsed.cleanedText,
                    confidenceLevel,
                    problemRole: parsed.pageType ?? null,
                    error: null,
                };

                const nextIndex = nextItems.findIndex((entry) => entry.id === item.id);
                if (nextIndex >= 0) nextItems[nextIndex] = nextItem;

                queue.updateItem(item.id, () => nextItem);
            } catch (error) {
                queue.updateItem(item.id, (current) => ({
                    ...current,
                    status: "failed",
                    error: error instanceof Error ? error.message : "OCR failed.",
                }));
            }
        }

        setMergedText(mergeSelectedOcrText(nextItems));
        setStatusMessage(
            "OCR finished. Review raw text, structured fields, page roles, and extracted totals before checking the worksheet."
        );
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

    return (
        <CalculatorPageLayout
            badge="Smart Tools / Scan & Check"
            title="Scan & Check"
            description="Browser-first OCR for equations, textbook problems, worked solutions, and accounting worksheets. It is strongest on printed text, screenshots, and guided review of handwritten practice sheets."
            prioritizeResultSection
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-card-title text-base">What this is good at</p>
                        <p className="app-body-md mt-2 text-sm">
                            Clear screenshots, textbook pages, accounting worksheets, and decent handwriting. For dark-background process-costing pages, review remains mandatory before checking totals.
                        </p>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <ScanDropzone onFiles={queue.addFiles} />
                            <ScanCameraCapture onCapture={(file) => void queue.addFiles([file])} />
                        </div>
                        {queue.queueError ? (
                            <p className="app-helper mt-3 text-xs text-[color:var(--app-danger)]">
                                {queue.queueError}
                            </p>
                        ) : null}
                    </SectionCard>

                    {activePreview ? (
                        <SectionCard>
                            <p className="app-card-title text-base">Image preprocessing preview</p>
                            <p className="app-helper mt-1 text-xs">
                                Dark-background cleanup, contrast enhancement, and grid detection are applied when useful. They improve OCR, but they do not guarantee perfect handwritten accounting recognition.
                            </p>
                            <div className="mt-4">
                                <ScanPreprocessPreview
                                    originalUrl={activePreview.previewUrl}
                                    processedUrl={activePreview.processedPreviewUrl}
                                />
                            </div>
                            {activePreview.preprocessNotes?.length ? (
                                <div className="mt-3 space-y-1">
                                    {activePreview.preprocessNotes.map((note) => (
                                        <p key={note} className="app-helper text-xs">
                                            {note}
                                        </p>
                                    ))}
                                </div>
                            ) : null}
                        </SectionCard>
                    ) : null}

                    {queue.items.length > 0 ? (
                        <SectionCard>
                            <p className="app-card-title text-base">Queue actions</p>
                            <p className="app-helper mt-1 text-xs">{statusMessage}</p>
                            <div className="mt-4">
                                <ScanActionBar
                                    disabled={ocr.busy || preprocess.busy}
                                    onProcessQueue={() => void processQueue()}
                                    onMergeSelected={() =>
                                        setMergedText(mergeSelectedOcrText(queue.items))
                                    }
                                    onSendMergedToSmartSolver={() =>
                                        sendTextToSmartSolver(
                                            mergedText || queue.mergedSelectedText
                                        )
                                    }
                                    onOpenProcessCostingWorkspace={
                                        accountingSession ? openProcessCostingWorkspace : undefined
                                    }
                                />
                            </div>
                        </SectionCard>
                    ) : null}
                </div>
            }
            resultSection={
                queue.items.length > 0 ? (
                    <div className="space-y-4">
                        <SectionCard>
                            <p className="app-card-title text-base">Queue summary</p>
                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                {queueSummary.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="app-subtle-surface rounded-[1rem] px-4 py-3"
                                    >
                                        <p className="app-metric-label">{stat.label}</p>
                                        <p className="mt-2 text-lg font-semibold text-[color:var(--app-text)]">
                                            {stat.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>

                        <ScanProblemSessionPanel
                            session={accountingSession}
                            onOpenWorkspace={openProcessCostingWorkspace}
                        />

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
                                }))
                            }
                        />

                        <ScanExtractedTextPanel
                            items={queue.items}
                            mergedText={mergedText || queue.mergedSelectedText}
                            onMergedTextChange={setMergedText}
                        />
                    </div>
                ) : (
                    <SectionCard>
                        <p className="app-card-title text-sm">No images queued</p>
                        <p className="app-body-md mt-2 text-sm">
                            Add one or more images to start OCR, field review, and accounting worksheet checking.
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
                                value: item.parsedResult?.extractionConfidence ??
                                    item.ocrResult?.confidence ??
                                    0,
                            }))
                        )}
                        importance="OCR confidence, extraction confidence, and worksheet-check confidence stay separate so weak handwriting recognition does not look more certain than it is."
                        highlights={buildChartHighlights(
                            queue.items.map((item) => ({
                                label: item.name,
                                value: item.parsedResult?.parseConfidence ??
                                    item.ocrResult?.confidence ??
                                    0,
                            }))
                        )}
                    />
                    <InterpretationBlock body="Scan & Check now treats accounting worksheets as structured pages, not just plain text. It shows raw OCR, editable fields, page roles, and the route hint before sending anything into a checker." />
                    <CommonMistakesBlock
                        mistakes={[
                            "Dark worksheets can still confuse 0, 6, 8, and comma placement in large accounting amounts.",
                            "Department 2 pages often hide transferred-in cost assumptions that must be reviewed manually.",
                            "Merged image sets should be checked for page order before comparing student answers with system output.",
                        ]}
                    />
                    <StudyTipBlock body="For process-costing problems, confirm units, page role, and materials timing first. Wrong structure usually causes more downstream error than one arithmetic slip." />
                    <PracticalMeaningBlock body="This release keeps OCR in the browser for privacy and portability. It is useful now for worksheet review, but still weaker than a dedicated handwritten accounting model." />
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
