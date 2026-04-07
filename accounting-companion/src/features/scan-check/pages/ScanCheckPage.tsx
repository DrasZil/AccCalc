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
import { getConfidenceLevel } from "../services/ocr/ocrConfidence";
import { mergeSelectedOcrText } from "../services/ocr/ocrMerge";
import { parseOcrText } from "../services/ocr/ocrParser";
import ScanActionBar from "../components/ScanActionBar";
import ScanCameraCapture from "../components/ScanCameraCapture";
import ScanDropzone from "../components/ScanDropzone";
import ScanExtractedTextPanel from "../components/ScanExtractedTextPanel";
import ScanImageQueue from "../components/ScanImageQueue";
import ScanPreprocessPreview from "../components/ScanPreprocessPreview";
import { useImagePreprocess } from "../hooks/useImagePreprocess";
import { useOcrWorker } from "../hooks/useOcrWorker";
import { useScanQueue } from "../hooks/useScanQueue";
import type { ScanImageItem } from "../types";

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

    const queueSummary = useMemo(
        () => [
            { label: "Images", value: queue.items.length },
            { label: "Selected", value: queue.items.filter((item) => item.selected).length },
            {
                label: "Ready",
                value: queue.items.filter((item) => item.status === "completed").length,
            },
        ],
        [queue.items]
    );

    async function processQueue() {
        const nextItems = [...queue.items];

        for (const item of queue.items) {
            try {
                queue.setItemStatus(item.id, "preprocessing", 12);
                const base64Source = await queue.fileToDataUrl(item.file);
                const processed = await preprocess.run(base64Source);

                queue.updateItem(item.id, (current) => ({
                    ...current,
                    processedPreviewUrl: processed.processedDataUrl,
                }));

                queue.setItemStatus(item.id, "recognizing", 20);
                const ocrResult = await ocr.recognize(processed.processedDataUrl, (progress) => {
                    queue.setItemStatus(item.id, "recognizing", Math.max(progress, 20));
                });
                const parsed = parseOcrText(ocrResult.text, ocrResult.confidence);
                const confidenceLevel = getConfidenceLevel(ocrResult.confidence);
                const nextItem = {
                    ...item,
                    processedPreviewUrl: processed.processedDataUrl,
                    status:
                        confidenceLevel === "low" || parsed.parseConfidence < 60
                            ? ("needs review" as const)
                            : ("completed" as const),
                    progress: 100,
                    ocrResult,
                    parsedResult: parsed,
                    editableText: parsed.cleanedText,
                    confidenceLevel,
                    error: null,
                };

                const nextIndex = nextItems.findIndex((entry) => entry.id === item.id);
                if (nextIndex >= 0) {
                    nextItems[nextIndex] = nextItem;
                }

                queue.updateItem(item.id, (current) => ({
                    ...current,
                    status:
                        confidenceLevel === "low" || parsed.parseConfidence < 60
                            ? "needs review"
                            : "completed",
                    progress: 100,
                    ocrResult,
                    parsedResult: parsed,
                    editableText: parsed.cleanedText,
                    confidenceLevel,
                    error: null,
                }));
            } catch (error) {
                const nextIndex = nextItems.findIndex((entry) => entry.id === item.id);
                if (nextIndex >= 0) {
                    nextItems[nextIndex] = {
                        ...nextItems[nextIndex],
                        status: "failed",
                        error: error instanceof Error ? error.message : "OCR failed.",
                    };
                }

                queue.updateItem(item.id, (current) => ({
                    ...current,
                    status: "failed",
                    error: error instanceof Error ? error.message : "OCR failed.",
                }));
            }
        }

        setMergedText(mergeSelectedOcrText(nextItems));
        setStatusMessage(
            "OCR finished. Review extracted values and confidence before sending anything to SmartSolver."
        );
    }

    function sendTextToSmartSolver(text: string) {
        if (text.trim() === "") return;

        navigate("/smart/solver", {
            state: {
                from: "scan-check",
                query: text,
            },
        });
    }

    function handleSendSingle(item: ScanImageItem) {
        sendTextToSmartSolver(item.editableText || item.parsedResult?.cleanedText || "");
    }

    return (
        <CalculatorPageLayout
            badge="Smart Tools / Scan & Check"
            title="Scan & Check"
            description="Browser-first OCR for equations, textbook problems, worked solutions, and answer checks. It is strongest on printed text and clear screenshots, and it stays confidence-aware instead of pretending certainty."
            prioritizeResultSection
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-card-title text-base">What this is good at</p>
                        <p className="app-body-md mt-2 text-sm">
                            Clear screenshots, textbook pages, printed worksheets, and decent handwriting. Review is always required when confidence is not strong.
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
                                Grayscale and contrast cleanup help OCR, but they do not guarantee perfect symbol recognition.
                            </p>
                            <div className="mt-4">
                                <ScanPreprocessPreview
                                    originalUrl={activePreview.previewUrl}
                                    processedUrl={activePreview.processedPreviewUrl}
                                />
                            </div>
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
                                        sendTextToSmartSolver(mergedText || queue.mergedSelectedText)
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

                        <ScanImageQueue
                            items={queue.items}
                            onRemove={queue.removeItem}
                            onMove={queue.moveItem}
                            onToggleSelected={queue.toggleSelected}
                            onSendToSmartSolver={handleSendSingle}
                            onTextChange={(id, value) =>
                                queue.updateItem(id, (item) => ({
                                    ...item,
                                    editableText: value,
                                }))
                            }
                            onReplace={(id, file) => void queue.replaceFile(id, file)}
                            onSetActivePreview={setActivePreviewId}
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
                            Add one or more images to start OCR, editing, and answer checking.
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
                                value: item.ocrResult?.confidence ?? 0,
                            }))
                        )}
                        importance="OCR confidence, parse confidence, and solver confidence are kept separate so weak extraction does not look more certain than it is."
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
                    <InterpretationBlock body="Use Scan & Check to extract, review, and route problems into the right calculator or SmartSolver flow. It shows what was extracted, what was inferred, and what still needs confirmation." />
                    <CommonMistakesBlock
                        mistakes={[
                            "Low-confidence OCR can confuse minus signs, decimals, and multiplication symbols.",
                            "Worked solutions may contain copied-number errors even when the final answer looks neat.",
                            "Word problems often need unit and period confirmation before solving.",
                        ]}
                    />
                    <StudyTipBlock body="If confidence is low, correct the extracted text first, then send the cleaned version to SmartSolver rather than trusting the raw OCR output." />
                    <PracticalMeaningBlock body="This release keeps OCR in the browser for privacy and portability. That means it is useful now, but still less capable than cloud OCR or a dedicated handwriting model." />
                </div>
            }
            headerMeta={
                <span className="app-chip inline-flex items-center rounded-full px-3 py-1 text-xs">
                    Browser OCR
                </span>
            }
        />
    );
}
