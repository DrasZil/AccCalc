import type { ScanImageItem, ScanProcessingPhase } from "../types";

const PHASE_LABELS: Record<ScanProcessingPhase, string> = {
    queued: "Queued",
    preparing: "Preparing image",
    enhancing: "Enhancing image",
    reading: "Reading text",
    classifying: "Detecting worksheet type",
    extracting: "Extracting fields",
    routing: "Matching calculator",
    completed: "Ready",
    failed: "Needs retry",
};

type ScanProgressPanelProps = {
    items: ScanImageItem[];
    overallProgress: number;
    sessionPhase: ScanProcessingPhase;
};

export default function ScanProgressPanel({
    items,
    overallProgress,
    sessionPhase,
}: ScanProgressPanelProps) {
    const activeItems = items.slice(0, 4);

    return (
        <div className="app-panel rounded-[1.2rem] p-4 md:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="app-card-title text-base">Processing</p>
                    <p className="app-helper mt-1 text-xs">
                        {PHASE_LABELS[sessionPhase]}. This may take a moment on larger or handwritten pages.
                    </p>
                </div>
                <span className="app-chip-accent rounded-full px-3 py-1 text-[0.62rem]">
                    {Math.round(overallProgress)}%
                </span>
            </div>

            <div className="mt-4 overflow-hidden rounded-full bg-[color:var(--app-field-bg)]">
                <div
                    className="h-2 rounded-full bg-[color:var(--app-accent)] transition-[width] duration-300"
                    style={{ width: `${Math.max(4, overallProgress)}%` }}
                />
            </div>

            <div className="mt-4 space-y-3">
                {activeItems.map((item) => (
                    <div key={item.id} className="app-subtle-surface rounded-[1rem] px-3.5 py-3">
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[color:var(--app-text)]">
                                    {item.name}
                                </p>
                                <p className="app-helper mt-1 text-xs">
                                    {PHASE_LABELS[item.processingPhase ?? "queued"]}
                                    {item.processingSummary ? ` • ${item.processingSummary}` : ""}
                                </p>
                            </div>
                            <span className="text-xs font-semibold text-[color:var(--app-text-secondary)]">
                                {Math.round(item.progress)}%
                            </span>
                        </div>
                        <div className="mt-3 overflow-hidden rounded-full bg-[color:var(--app-panel-bg-soft)]">
                            <div
                                className="h-1.5 rounded-full bg-[color:var(--app-accent-secondary)] transition-[width] duration-300"
                                style={{ width: `${Math.max(3, item.progress)}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
