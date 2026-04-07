type ScanActionBarProps = {
    primaryLabel: string;
    onPrimaryAction: () => void;
    onReviewExtraction: () => void;
    disabled?: boolean;
    summary?: string;
};

export default function ScanActionBar({
    primaryLabel,
    onPrimaryAction,
    onReviewExtraction,
    disabled = false,
    summary,
}: ScanActionBarProps) {
    return (
        <div className="app-subtle-surface rounded-[1.2rem] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-2xl">
                    <p className="app-card-title text-sm">Suggested next step</p>
                    <p className="app-helper mt-1 text-xs">
                        {summary ??
                            "AccCalc now prioritizes one next action and keeps the extraction controls behind review."}
                    </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={onPrimaryAction}
                        className="app-button-primary min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold"
                    >
                        {primaryLabel}
                    </button>
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={onReviewExtraction}
                        className="app-button-secondary min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold"
                    >
                        Review extraction
                    </button>
                </div>
            </div>
        </div>
    );
}
