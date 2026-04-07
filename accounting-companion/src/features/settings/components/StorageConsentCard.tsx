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
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="app-card-title text-sm">Storage and scan retention</p>
                    <p className="app-body-md mt-1 text-sm">
                        Choose whether history and reviewed scan text can stay on this device. Raw image retention still depends on browser storage limits.
                    </p>
                </div>
                <PermissionStatusBadge state={storageState} />
            </div>

            <p className="app-helper text-xs leading-5">{summary}</p>

            <button
                type="button"
                onClick={() => onToggle(!enabled)}
                className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
            >
                {enabled ? "Keep local data" : "Do not retain scans"}
            </button>
        </div>
    );
}
