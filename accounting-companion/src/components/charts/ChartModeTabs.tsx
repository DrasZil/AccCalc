type ChartMode = "chart" | "table" | "interpretation" | "comparison";

type ChartModeTabsProps = {
    value: ChartMode;
    onChange: (value: ChartMode) => void;
    modes?: ChartMode[];
};

export default function ChartModeTabs({
    value,
    onChange,
    modes = ["chart", "table", "interpretation", "comparison"],
}: ChartModeTabsProps) {
    return (
        <div className="app-panel rounded-[1rem] p-1.5">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {modes.map((mode) => (
                    <button
                        key={mode}
                        type="button"
                        onClick={() => onChange(mode)}
                        className={[
                            "rounded-xl px-3 py-2 text-sm font-semibold capitalize",
                            value === mode ? "app-button-primary" : "app-button-ghost",
                        ].join(" ")}
                    >
                        {mode}
                    </button>
                ))}
            </div>
        </div>
    );
}

