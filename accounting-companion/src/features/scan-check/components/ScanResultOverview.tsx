type ScanResultOverviewProps = {
    title: string;
    summary: string;
    detectedType: string;
    confidenceLabel: string;
    confidenceSummary?: string;
    suggestedWorkspaceLabel: string;
    quickFacts: Array<{ label: string; value: string }>;
    flags: string[];
    primaryActionLabel: string;
    onPrimaryAction: () => void;
    onToggleAdvanced: () => void;
};

export default function ScanResultOverview({
    title,
    summary,
    detectedType,
    confidenceLabel,
    confidenceSummary,
    suggestedWorkspaceLabel,
    quickFacts,
    flags,
    primaryActionLabel,
    onPrimaryAction,
    onToggleAdvanced,
}: ScanResultOverviewProps) {
    return (
        <div className="app-panel app-hero-panel min-w-0 rounded-[1.35rem] p-4 md:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 max-w-2xl">
                    <p className="app-card-title app-wrap-anywhere text-base">{title}</p>
                    <p className="app-body-md app-wrap-anywhere mt-2 text-sm">{summary}</p>
                </div>
                <div className="flex min-w-0 flex-wrap gap-2">
                    <span className="app-chip app-wrap-anywhere max-w-full rounded-full px-3 py-1 text-[0.62rem] whitespace-normal">
                        {detectedType}
                    </span>
                    <span className="app-chip-accent app-wrap-anywhere max-w-full rounded-full px-3 py-1 text-[0.62rem] whitespace-normal">
                        {confidenceLabel}
                    </span>
                </div>
            </div>

            {confidenceSummary ? (
                <p className="app-helper app-wrap-anywhere mt-3 text-xs">{confidenceSummary}</p>
            ) : null}

            <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="app-subtle-surface min-w-0 rounded-[1rem] px-4 py-3">
                    <p className="app-metric-label">Suggested next tool</p>
                    <p className="app-wrap-anywhere mt-2 text-sm font-semibold text-[color:var(--app-text)]">
                        {suggestedWorkspaceLabel}
                    </p>
                </div>
                <div className="app-subtle-surface min-w-0 rounded-[1rem] px-4 py-3">
                    <p className="app-metric-label">Quick summary</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {quickFacts.map((fact) => (
                            <span
                                key={`${fact.label}-${fact.value}`}
                                className="app-list-link app-wrap-anywhere max-w-full rounded-full px-3 py-1.5 text-xs font-medium whitespace-normal"
                            >
                                {fact.label}: {fact.value}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {flags.length > 0 ? (
                <div className="app-tone-warning mt-4 rounded-[1rem] px-4 py-3">
                    <p className="text-sm font-semibold text-[color:var(--app-text)]">
                        Review flags
                    </p>
                    <div className="mt-2 space-y-1">
                        {flags.slice(0, 3).map((flag) => (
                            <p key={flag} className="app-wrap-anywhere text-sm text-[color:var(--app-text)]">
                                {flag}
                            </p>
                        ))}
                    </div>
                </div>
            ) : null}

            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:max-w-xl">
                <button
                    type="button"
                    onClick={onPrimaryAction}
                    className="app-button-primary app-wrap-anywhere min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold"
                >
                    {primaryActionLabel}
                </button>
                <button
                    type="button"
                    onClick={onToggleAdvanced}
                    className="app-button-secondary app-wrap-anywhere min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold"
                >
                    Review extraction
                </button>
            </div>
        </div>
    );
}
