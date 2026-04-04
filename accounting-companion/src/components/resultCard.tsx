type ResultCardProps = {
    title: string;
    value: string;
    supportingText?: string;
};

export default function ResultCard({ title, value, supportingText }: ResultCardProps) {
    return (
        <div className="app-panel-elevated app-card-hover rounded-[calc(var(--app-radius-lg)-0.2rem)] p-5">
            <p className="app-label">
                {title}
            </p>
            <p className="app-value-display mt-3 break-words">
                {value}
            </p>
            {supportingText ? (
                <p className="app-body-md mt-3 text-sm">
                    {supportingText}
                </p>
            ) : null}
        </div>
    );
}
