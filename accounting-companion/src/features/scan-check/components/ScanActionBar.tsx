type ScanActionBarProps = {
    disabled?: boolean;
    onProcessQueue: () => void;
    onMergeSelected: () => void;
    onSendMergedToSmartSolver: () => void;
};

export default function ScanActionBar({
    disabled = false,
    onProcessQueue,
    onMergeSelected,
    onSendMergedToSmartSolver,
}: ScanActionBarProps) {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                type="button"
                disabled={disabled}
                onClick={onProcessQueue}
                className="app-button-primary rounded-xl px-4 py-2 text-sm font-medium"
            >
                Process queue
            </button>
            <button
                type="button"
                disabled={disabled}
                onClick={onMergeSelected}
                className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
            >
                Merge selected text
            </button>
            <button
                type="button"
                disabled={disabled}
                onClick={onSendMergedToSmartSolver}
                className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
            >
                Send merged text to SmartSolver
            </button>
        </div>
    );
}
