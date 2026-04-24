import PermissionStatusBadge from "../../../components/permissions/PermissionStatusBadge";

type StorageConsentCardProps = {
    enabled: boolean;
    onToggle: (value: boolean) => void;
    storageState: "enabled" | "blocked" | "unavailable" | "ask" | "unsupported";
    summary: string;
};

export default function StorageConsentCard({
    enabled,
    onToggle,
    storageState,
    summary,
}: StorageConsentCardProps) {
    return (
        <div className="space-y-3 rounded-[1rem] border app-divider px-4 py-4">
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="app-card-title text-sm">Storage and scan retention</p>
                    <p className="app-body-md mt-1 text-sm">
                        Choose whether history and reviewed scan text can stay on this device. Raw image retention still depends on browser storage limits.
                    </p>
                </div>
                <div className="shrink-0">
                    <PermissionStatusBadge state={storageState} />
                </div>
            </div>

            <p className="app-helper app-wrap-anywhere text-xs leading-5">{summary}</p>

            <button
                type="button"
                onClick={() => onToggle(!enabled)}
                className="app-button-secondary w-full rounded-xl px-4 py-2 text-sm font-medium sm:w-auto"
            >
                {enabled ? "Keep local data" : "Do not retain scans"}
            </button>
        </div>
    );
}
