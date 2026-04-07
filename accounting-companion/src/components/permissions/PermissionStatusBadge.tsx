type PermissionStatusBadgeProps = {
    state: "enabled" | "blocked" | "unavailable" | "ask" | "unsupported";
};

export default function PermissionStatusBadge({ state }: PermissionStatusBadgeProps) {
    const toneClass =
        state === "enabled"
            ? "app-tone-success"
            : state === "blocked"
              ? "app-tone-warning"
              : state === "unavailable" || state === "unsupported"
                ? "app-subtle-surface"
                : "app-tone-info";

    return (
        <span className={`${toneClass} inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]`}>
            {state}
        </span>
    );
}

