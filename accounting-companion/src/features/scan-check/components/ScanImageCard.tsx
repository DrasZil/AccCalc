import ScanConfidenceBadge from "./ScanConfidenceBadge";
import type { ScanImageItem } from "../types";

type ScanImageCardProps = {
    item: ScanImageItem;
    onRemove: () => void;
    onMoveLeft: () => void;
    onMoveRight: () => void;
    onToggleSelected: () => void;
    onSendToSmartSolver: () => void;
    onTextChange: (value: string) => void;
    onReplace: (file: File) => void;
    onSetActivePreview: () => void;
};

export default function ScanImageCard({
    item,
    onRemove,
    onMoveLeft,
    onMoveRight,
    onToggleSelected,
    onSendToSmartSolver,
    onTextChange,
    onReplace,
    onSetActivePreview,
}: ScanImageCardProps) {
    return (
        <div className="app-panel rounded-[1.2rem] p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="app-card-title text-sm">{item.name}</p>
                    <p className="app-helper mt-1 text-xs uppercase tracking-[0.16em]">
                        {item.status} • {Math.round(item.progress)}%
                    </p>
                </div>
                <ScanConfidenceBadge
                    level={item.confidenceLevel}
                    score={item.ocrResult?.confidence ?? 0}
                />
            </div>

            <button type="button" onClick={onSetActivePreview} className="mt-3 block w-full">
                <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="h-40 w-full rounded-[1rem] object-cover"
                />
            </button>

            <div className="mt-3 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={onMoveLeft}
                    className="app-button-ghost rounded-xl px-3 py-2 text-xs font-medium"
                >
                    Move up
                </button>
                <button
                    type="button"
                    onClick={onMoveRight}
                    className="app-button-ghost rounded-xl px-3 py-2 text-xs font-medium"
                >
                    Move down
                </button>
                <button
                    type="button"
                    onClick={onToggleSelected}
                    className="app-button-ghost rounded-xl px-3 py-2 text-xs font-medium"
                >
                    {item.selected ? "Included in merge" : "Exclude from merge"}
                </button>
                <button
                    type="button"
                    onClick={onSendToSmartSolver}
                    className="app-button-secondary rounded-xl px-3 py-2 text-xs font-medium"
                >
                    Send to SmartSolver
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className="app-button-secondary rounded-xl px-3 py-2 text-xs font-medium"
                >
                    Remove
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

            <label className="mt-3 block">
                <span className="app-helper text-xs uppercase tracking-[0.16em]">
                    Editable extracted text
                </span>
                <textarea
                    value={item.editableText}
                    onChange={(event) => onTextChange(event.target.value)}
                    rows={7}
                    className="app-field mt-2 w-full rounded-[1rem] px-3 py-3 text-sm"
                />
            </label>

            {item.parsedResult?.likelyIssues.length ? (
                <div className="mt-3 rounded-[1rem] border app-divider px-3 py-3">
                    <p className="app-helper text-xs uppercase tracking-[0.16em]">
                        Possible issues detected
                    </p>
                    <div className="mt-2 space-y-1">
                        {item.parsedResult.likelyIssues.map((issue) => (
                            <p key={issue} className="text-sm text-[color:var(--app-text)]">
                                {issue}
                            </p>
                        ))}
                    </div>
                </div>
            ) : null}

            {item.error ? (
                <p className="app-helper mt-2 text-xs text-[color:var(--app-danger)]">
                    {item.error}
                </p>
            ) : null}
        </div>
    );
}

