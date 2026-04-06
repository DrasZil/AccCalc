import {
    getOfflineSupportLabel,
    type OfflineSupportLevel,
} from "../utils/appCatalog";

function getToneClass(level: OfflineSupportLevel) {
    if (level === "full") {
        return "app-chip-accent";
    }

    if (level === "limited") {
        return "app-chip";
    }

    return "app-tone-warning";
}

export default function OfflineCapabilityBadge({
    level,
    className = "",
    label,
}: {
    level: OfflineSupportLevel;
    className?: string;
    label?: string;
}) {
    return (
        <span
            className={`${getToneClass(level)} inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`.trim()}
        >
            {label ?? getOfflineSupportLabel(level)}
        </span>
    );
}
