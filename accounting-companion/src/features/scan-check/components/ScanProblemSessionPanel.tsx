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
        <div className="app-panel rounded-[1.2rem] p-4">
            <p className="app-card-title text-base">Merged problem understanding</p>
            <p className="app-body-md mt-2 text-sm">{session.summary}</p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
                {session.pageRoles.map((page) => (
                    <div
                        key={`${page.id}-${page.role}`}
                        className="rounded-[1rem] border app-divider px-4 py-3"
                    >
                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                            {page.name}
                        </p>
                        <p className="app-helper mt-1 text-xs">{page.role}</p>
                    </div>
                ))}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
                {session.structuredFields.slice(0, 8).map((field) => (
                    <div
                        key={`${field.key}-${field.value}`}
                        className="app-subtle-surface rounded-[1rem] px-4 py-3"
                    >
                        <p className="app-helper text-xs uppercase tracking-[0.16em]">
                            {field.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[color:var(--app-text)]">
                            {field.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={onOpenWorkspace}
                    className="app-button-primary rounded-xl px-4 py-2 text-sm font-medium"
                >
                    Open Process Costing Workspace
                </button>
                <span className="app-chip rounded-full px-3 py-1 text-xs">
                    Route hint: {session.routeHint}
                </span>
            </div>
        </div>
    );
}
