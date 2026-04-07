import DisclosurePanel from "../../../components/DisclosurePanel";
import ScanConfidenceBadge from "./ScanConfidenceBadge";
import ScanStructuredFieldsEditor from "./ScanStructuredFieldsEditor";
import type { ScanImageItem } from "../types";

type ScanImageCardProps = {
    item: ScanImageItem;
    onRemove: () => void;
    onMoveLeft: () => void;
    onMoveRight: () => void;
    onToggleSelected: () => void;
    onSendToSmartSolver: () => void;
    onTextChange: (value: string) => void;
    onStructuredFieldsChange: (
        nextFields: NonNullable<ScanImageItem["parsedResult"]>["structuredFields"]
    ) => void;
    onReplace: (file: File) => void;
    onSetActivePreview: () => void;
    onRetry: () => void;
};

export default function ScanImageCard({
    item,
    onRemove,
    onMoveLeft,
    onMoveRight,
    onToggleSelected,
    onSendToSmartSolver,
    onTextChange,
    onStructuredFieldsChange,
    onReplace,
    onSetActivePreview,
    onRetry,
}: ScanImageCardProps) {
    const primaryIssue = item.parsedResult?.likelyIssues[0] ?? item.qualityWarnings?.[0] ?? null;

    return (
        <div className="app-panel min-w-0 rounded-[1.2rem] p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="app-card-title app-wrap-anywhere text-sm">{item.name}</p>
                    <p className="app-helper mt-1 text-xs uppercase tracking-[0.16em]">
                        {(item.processingPhase ?? item.status).replaceAll("-", " ")} • {Math.round(item.progress)}%
                    </p>
                    {item.parsedResult?.pageType && item.parsedResult.pageType !== "unknown" ? (
                        <p className="app-helper app-wrap-anywhere mt-1 text-xs">
                            Detected page type: {item.parsedResult.pageType}
                        </p>
                    ) : null}
                </div>
                <div className="flex items-start gap-2">
                    <ScanConfidenceBadge
                        level={item.confidenceLevel}
                        score={item.ocrResult?.confidence ?? 0}
                    />
                    <button
                        type="button"
                        onClick={onRemove}
                        aria-label={`Remove ${item.name}`}
                        className="app-button-ghost rounded-full px-2.5 py-1.5 text-xs font-semibold"
                    >
                        x
                    </button>
                </div>
            </div>

            <button type="button" onClick={onSetActivePreview} className="mt-3 block w-full min-w-0">
                <div className="app-image-frame h-40 w-full rounded-[1rem] p-2 sm:h-44">
                    <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="h-full w-full rounded-[0.85rem] object-contain"
                    />
                </div>
            </button>

            <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="app-subtle-surface min-w-0 rounded-[1rem] px-3.5 py-3">
                    <p className="app-helper text-xs uppercase tracking-[0.16em]">Quick read</p>
                    <p className="app-wrap-anywhere mt-1 text-sm text-[color:var(--app-text)]">
                        {item.processingSummary ??
                            item.parsedResult?.suggestedIntent ??
                            "Review the extraction before solving."}
                    </p>
                    {primaryIssue ? (
                        <p className="app-helper app-wrap-anywhere mt-2 text-xs text-[color:var(--app-warning)]">
                            {primaryIssue}
                        </p>
                    ) : null}
                </div>
                <button
                    type="button"
                    onClick={onSendToSmartSolver}
                    className="app-button-secondary min-h-11 w-full rounded-xl px-4 py-2.5 text-sm font-semibold sm:w-auto"
                >
                    Continue
                </button>
            </div>

            <DisclosurePanel
                title="Advanced review"
                summary="Edit fields, inspect OCR text, change page order, or retry only when needed."
                badge={item.selected ? "Merged" : "Separate"}
                compact
                className="mt-3"
            >
                <div className="space-y-3">
                    {item.parsedResult?.likelyIssues.length ? (
                        <div className="rounded-[1rem] border app-divider px-3 py-3">
                            <p className="app-helper text-xs uppercase tracking-[0.16em]">
                                Possible issues detected
                            </p>
                            <div className="mt-2 space-y-1">
                                {item.parsedResult.likelyIssues.map((issue) => (
                                    <p key={issue} className="app-wrap-anywhere text-sm text-[color:var(--app-text)]">
                                        {issue}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {item.qualityWarnings?.length ? (
                        <div className="app-tone-warning rounded-[1rem] px-3 py-3">
                            <p className="app-helper text-xs uppercase tracking-[0.16em]">
                                Image quality tips
                            </p>
                            <div className="mt-2 space-y-1">
                                {item.qualityWarnings.map((warning) => (
                                    <p key={warning} className="app-wrap-anywhere text-sm text-[color:var(--app-text)]">
                                        {warning}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={onMoveLeft}
                            className="app-button-ghost min-h-10 rounded-xl px-3 py-2 text-xs font-medium"
                        >
                            Move up
                        </button>
                        <button
                            type="button"
                            onClick={onMoveRight}
                            className="app-button-ghost min-h-10 rounded-xl px-3 py-2 text-xs font-medium"
                        >
                            Move down
                        </button>
                        <button
                            type="button"
                            onClick={onToggleSelected}
                            className="app-button-ghost min-h-10 rounded-xl px-3 py-2 text-xs font-medium"
                        >
                            {item.selected ? "Keep in merged session" : "Treat separately"}
                        </button>
                        <button
                            type="button"
                            onClick={onRetry}
                            className="app-button-ghost min-h-10 rounded-xl px-3 py-2 text-xs font-medium"
                        >
                            Reprocess
                        </button>
                        <label className="app-button-secondary cursor-pointer rounded-xl px-3 py-2 text-xs font-medium">
                            Replace
                            <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) onReplace(file);
                                    event.currentTarget.value = "";
                                }}
                            />
                        </label>
                    </div>

                    <label className="block">
                        <span className="app-helper text-xs uppercase tracking-[0.16em]">
                            Editable extracted text
                        </span>
                        <textarea
                            value={item.editableText}
                            onChange={(event) => onTextChange(event.target.value)}
                            rows={7}
                            className="app-field app-wrap-anywhere mt-2 w-full rounded-[1rem] px-3 py-3 text-sm"
                        />
                    </label>

                    <ScanStructuredFieldsEditor
                        fields={item.parsedResult?.structuredFields ?? []}
                        onChange={onStructuredFieldsChange}
                    />

                    {item.ocrResult?.text ? (
                        <div className="rounded-[1rem] border app-divider px-3 py-3">
                            <p className="app-helper text-xs uppercase tracking-[0.16em]">
                                Raw OCR text
                            </p>
                            <p className="app-wrap-anywhere mt-2 whitespace-pre-wrap text-sm text-[color:var(--app-text)]">
                                {item.ocrResult.text}
                            </p>
                        </div>
                    ) : null}
                </div>
            </DisclosurePanel>

            {item.error ? (
                <p className="app-helper mt-2 text-xs text-[color:var(--app-danger)]">
                    {item.error}
                </p>
            ) : null}
        </div>
    );
}
