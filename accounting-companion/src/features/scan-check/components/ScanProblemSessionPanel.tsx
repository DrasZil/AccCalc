import DisclosurePanel from "../../../components/DisclosurePanel";
import type { AccountingProblemSession } from "../types";

type ScanProblemSessionPanelProps = {
    session: AccountingProblemSession | null;
    onOpenWorkspace: () => void;
};

export default function ScanProblemSessionPanel({
    session,
    onOpenWorkspace,
}: ScanProblemSessionPanelProps) {
    if (!session) return null;

    return (
        <DisclosurePanel
            title="Accounting session understanding"
            summary={session.summary}
            badge={`${session.pageRoles.length} pages`}
            defaultOpen={false}
        >
            <div className="space-y-4">
                <div className="app-card-grid-readable--compact">
                    {session.pageRoles.map((page) => (
                        <div
                            key={`${page.id}-${page.role}`}
                            className="min-w-0 rounded-[1rem] border app-divider px-4 py-3"
                        >
                            <p className="app-wrap-anywhere text-sm font-semibold text-[color:var(--app-text)]">
                                {page.name}
                            </p>
                            <p className="app-helper app-wrap-anywhere mt-1 text-xs">{page.role}</p>
                        </div>
                    ))}
                </div>

                <div className="app-card-grid-readable--compact">
                    {session.structuredFields.slice(0, 10).map((field) => (
                        <div
                            key={`${field.key}-${field.value}`}
                            className="app-subtle-surface min-w-0 rounded-[1rem] px-4 py-3"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="app-helper text-xs uppercase tracking-[0.16em]">
                                    {field.label}
                                </p>
                                {field.valueKind ? (
                                    <span className="app-chip rounded-full px-2 py-0.5 text-[0.58rem]">
                                        {field.valueKind}
                                    </span>
                                ) : null}
                                {field.needsReview ? (
                                    <span className="app-chip-accent rounded-full px-2 py-0.5 text-[0.58rem]">
                                        Review
                                    </span>
                                ) : null}
                            </div>
                            <p className="app-wrap-anywhere mt-1 text-sm font-semibold text-[color:var(--app-text)]">
                                {field.value}
                            </p>
                            {field.normalizedValue && field.normalizedValue !== field.value ? (
                                <p className="app-helper mt-1 text-xs">
                                    Normalized: {field.normalizedValue}
                                </p>
                            ) : null}
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={onOpenWorkspace}
                    className="app-button-primary min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold"
                >
                    Open Process Costing Workspace
                </button>
            </div>
        </DisclosurePanel>
    );
}
