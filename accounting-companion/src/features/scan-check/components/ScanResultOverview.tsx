type ScanResultOverviewProps = {
    title: string;
    summary: string;
    detectedType: string;
    confidenceLabel: string;
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
    suggestedWorkspaceLabel,
    quickFacts,
    flags,
    primaryActionLabel,
    onPrimaryAction,
    onToggleAdvanced,
}: ScanResultOverviewProps) {
    return (
        <div className="app-panel app-hero-panel rounded-[1.35rem] p-4 md:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="max-w-2xl">
                    <p className="app-card-title text-base">{title}</p>
                    <p className="app-body-md mt-2 text-sm">{summary}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className="app-chip rounded-full px-3 py-1 text-[0.62rem]">
                        {detectedType}
                    </span>
                    <span className="app-chip-accent rounded-full px-3 py-1 text-[0.62rem]">
                        {confidenceLabel}
                    </span>
                </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="app-subtle-surface rounded-[1rem] px-4 py-3">
                    <p className="app-metric-label">Suggested next tool</p>
                    <p className="mt-2 text-sm font-semibold text-[color:var(--app-text)]">
                        {suggestedWorkspaceLabel}
                    </p>
                </div>
                <div className="app-subtle-surface rounded-[1rem] px-4 py-3">
                    <p className="app-metric-label">Quick summary</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {quickFacts.map((fact) => (
                            <span
                                key={`${fact.label}-${fact.value}`}
                                className="app-list-link rounded-full px-3 py-1.5 text-xs font-medium"
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
                            <p key={flag} className="text-sm text-[color:var(--app-text)]">
                                {flag}
                            </p>
                        ))}
                    </div>
                </div>
            ) : null}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                    type="button"
                    onClick={onPrimaryAction}
                    className="app-button-primary min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold"
                >
                    {primaryActionLabel}
                </button>
                <button
                    type="button"
                    onClick={onToggleAdvanced}
                    className="app-button-secondary min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold"
                >
                    Review extraction
                </button>
            </div>
        </div>
    );
}
