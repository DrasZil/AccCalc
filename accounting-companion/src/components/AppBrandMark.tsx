type AppBrandMarkProps = {
    compact?: boolean;
    showWordmark?: boolean;
    labelClassName?: string;
    className?: string;
};

const ICON_SRC = `${import.meta.env.BASE_URL}icon-192.png`;

export default function AppBrandMark({
    compact = false,
    showWordmark = true,
    labelClassName = "",
    className = "",
}: AppBrandMarkProps) {
    const iconSizeClass = compact ? "h-10 w-10 rounded-[1rem]" : "h-12 w-12 rounded-[1.15rem]";

    return (
        <div className={["flex items-center gap-3", className].join(" ").trim()}>
            <img
                src={ICON_SRC}
                alt="AccCalc app icon"
                className={[
                    iconSizeClass,
                    "shrink-0 border border-[color:var(--app-border-strong)] bg-[var(--app-panel-bg)] object-cover shadow-[var(--app-shadow)]",
                ].join(" ")}
            />
            {showWordmark ? (
                <div className="min-w-0">
                    <p
                        className={[
                            "truncate text-[1.15rem] font-bold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]",
                            labelClassName,
                        ].join(" ")}
                    >
                        AccCalc
                    </p>
                    <p className="app-helper mt-0.5 text-xs">Accounting workspace</p>
                </div>
            ) : null}
        </div>
    );
}
