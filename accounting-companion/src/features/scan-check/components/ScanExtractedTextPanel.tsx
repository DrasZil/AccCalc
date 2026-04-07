import type { ScanImageItem } from "../types";

type ScanExtractedTextPanelProps = {
    items: ScanImageItem[];
    mergedText: string;
    onMergedTextChange: (value: string) => void;
};

export default function ScanExtractedTextPanel({
    items,
    mergedText,
    onMergedTextChange,
}: ScanExtractedTextPanelProps) {
    return (
        <div className="space-y-4">
            <div className="app-panel rounded-[1.2rem] p-4">
                <p className="app-card-title text-sm">Merged review text</p>
                <p className="app-helper mt-1 text-xs">
                    Selected images are combined here before routing into SmartSolver.
                </p>
                <textarea
                    value={mergedText}
                    onChange={(event) => onMergedTextChange(event.target.value)}
                    rows={10}
                    className="app-field mt-3 w-full rounded-[1rem] px-3 py-3 text-sm"
                />
            </div>

            <div className="app-subtle-surface rounded-[1.2rem] p-4">
                <p className="app-card-title text-sm">Per-image review checklist</p>
                <div className="mt-3 space-y-2">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-[0.9rem] border app-divider px-3 py-3"
                        >
                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                {item.name}
                            </p>
                            <p className="app-helper mt-1 text-xs">
                                {item.parsedResult?.suggestedIntent ??
                                    "Review extracted text manually before solving."}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
