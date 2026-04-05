type ResultCardProps = {
    title: string;
    value: string;
    supportingText?: string;
    tone?: "default" | "accent" | "success" | "warning";
};

export default function ResultCard({
    title,
    value,
    supportingText,
    tone = "default",
}: ResultCardProps) {
    const toneClass =
        tone === "accent"
            ? "border-[color:var(--app-border-strong)] bg-[var(--app-accent-soft)]"
            : tone === "success"
              ? "app-tone-success"
              : tone === "warning"
                ? "app-tone-warning"
                : "";

    return (
        <div
            className={[
                "app-panel-elevated rounded-[calc(var(--app-radius-lg)-0.25rem)] p-4 md:p-5",
                toneClass,
            ].join(" ")}
        >
            <p className="app-label">
                {title}
            </p>
            <p className="app-value-display mt-2.5 break-words">
                {value}
            </p>
            {supportingText ? (
                <p className="app-body-md mt-2.5 text-sm">
                    {supportingText}
                </p>
            ) : null}
        </div>
    );
}
