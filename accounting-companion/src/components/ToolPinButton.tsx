import { togglePinnedPath, useAppActivity } from "../utils/appActivity";

type ToolPinButtonProps = {
    path: string;
    label: string;
    className?: string;
    variant?: "pill" | "icon";
};

function PinIcon({ filled }: { filled: boolean }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 4.5h6" />
            <path d="M10 4.5v4.2l-3.6 3.6v1.2H17.6v-1.2L14 8.7V4.5" />
            <path d="M12 13.5V20" />
        </svg>
    );
}

export default function ToolPinButton({
    path,
    label,
    className = "",
    variant = "pill",
}: ToolPinButtonProps) {
    const activity = useAppActivity();
    const isPinned = activity.pinnedPaths.includes(path);

    if (variant === "icon") {
        return (
            <button
                type="button"
                onClick={() => togglePinnedPath(path)}
                aria-pressed={isPinned}
                aria-label={isPinned ? `Unpin ${label}` : `Pin ${label}`}
                title={isPinned ? `Unpin ${label}` : `Pin ${label}`}
                className={[
                    "app-icon-button inline-flex items-center justify-center rounded-full p-2.5",
                    isPinned
                        ? "border-[color:var(--app-border-strong)] bg-[var(--app-accent-soft)] text-[color:var(--app-accent)]"
                        : "",
                    className,
                ].join(" ")}
            >
                <PinIcon filled={isPinned} />
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={() => togglePinnedPath(path)}
            aria-pressed={isPinned}
            aria-label={isPinned ? `Unpin ${label}` : `Pin ${label}`}
            title={isPinned ? `Unpin ${label}` : `Pin ${label}`}
            className={[
                "app-icon-button inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em]",
                isPinned
                    ? "border-[color:var(--app-border-strong)] bg-[var(--app-accent-soft)] text-[color:var(--app-accent)]"
                    : "",
                className,
            ].join(" ")}
        >
            <PinIcon filled={isPinned} />
            {isPinned ? "Pinned" : "Pin"}
        </button>
    );
}
