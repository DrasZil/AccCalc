type InlineNoticeTone = "info" | "success" | "warning" | "error";

type InlineNoticeProps = {
    title: string;
    message?: string;
    tone?: InlineNoticeTone;
    compact?: boolean;
    onDismiss?: () => void;
};

const TONE_CLASS_MAP: Record<InlineNoticeTone, string> = {
    info: "app-tone-info",
    success: "app-tone-success",
    warning: "app-tone-warning",
    error: "app-tone-warning",
};

export default function InlineNotice({
    title,
    message,
    tone = "info",
    compact = false,
    onDismiss,
}: InlineNoticeProps) {
    return (
        <div
            className={[
                "rounded-[1.15rem] border px-4",
                compact ? "py-3" : "py-3.5",
                TONE_CLASS_MAP[tone],
            ].join(" ")}
            role={tone === "error" ? "alert" : "status"}
            aria-live={tone === "error" ? "assertive" : "polite"}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-[color:var(--app-text)]">{title}</p>
                    {message ? (
                        <p className="app-helper mt-1 break-words text-xs leading-5">{message}</p>
                    ) : null}
                </div>
                {onDismiss ? (
                    <button
                        type="button"
                        onClick={onDismiss}
                        className="app-button-ghost rounded-full px-2.5 py-1 text-xs font-semibold"
                    >
                        Dismiss
                    </button>
                ) : null}
            </div>
        </div>
    );
}
