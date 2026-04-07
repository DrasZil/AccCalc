import DisclosurePanel from "../../../components/DisclosurePanel";
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
        <DisclosurePanel
            title="Merged text and notes"
            summary="Combined review text stays available, but it only opens when you need the full extraction."
            badge={`${items.filter((item) => item.selected).length} selected`}
            defaultOpen={false}
        >
            <div className="space-y-4">
                <div className="app-subtle-surface min-w-0 rounded-[1.2rem] p-4">
                    <p className="app-card-title text-sm">Merged review text</p>
                    <p className="app-helper mt-1 text-xs">
                        Selected images are combined here before deeper review or routing into SmartSolver.
                    </p>
                    <textarea
                        value={mergedText}
                        onChange={(event) => onMergedTextChange(event.target.value)}
                        rows={10}
                        className="app-field app-wrap-anywhere mt-3 w-full rounded-[1rem] px-3 py-3 text-sm font-medium"
                    />
                </div>

                <div className="app-subtle-surface min-w-0 rounded-[1.2rem] p-4">
                    <p className="app-card-title text-sm">Per-image review hints</p>
                    <div className="mt-3 space-y-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="min-w-0 rounded-[0.9rem] border app-divider px-3 py-3"
                            >
                                <p className="app-wrap-anywhere text-sm font-semibold text-[color:var(--app-text)]">
                                    {item.name}
                                </p>
                                <p className="app-helper app-wrap-anywhere mt-1 text-xs">
                                    {item.processingSummary ||
                                        item.parsedResult?.suggestedIntent ||
                                        "Review extracted text manually before solving."}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DisclosurePanel>
    );
}
