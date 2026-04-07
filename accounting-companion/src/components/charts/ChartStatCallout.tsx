type ChartStatCalloutProps = {
    title: string;
    value: string;
    supportingText?: string;
    tone?: "accent" | "success" | "warning";
};

export default function ChartStatCallout({
    title,
    value,
    supportingText,
    tone = "accent",
}: ChartStatCalloutProps) {
    const toneClass =
        tone === "success"
            ? "app-tone-success"
            : tone === "warning"
              ? "app-tone-warning"
              : "app-tone-accent";

    return (
        <div className={`${toneClass} rounded-[1.1rem] px-4 py-3.5`}>
            <p className="app-helper text-xs uppercase tracking-[0.16em]">{title}</p>
            <p className="mt-2 text-base font-semibold text-[color:var(--app-text)]">{value}</p>
            {supportingText ? <p className="app-body-md mt-1 text-sm">{supportingText}</p> : null}
        </div>
    );
}

