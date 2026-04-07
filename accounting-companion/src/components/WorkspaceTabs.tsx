type WorkspaceTab = {
    id: string;
    label: string;
};

type WorkspaceTabsProps = {
    value: string;
    onChange: (value: string) => void;
    tabs: WorkspaceTab[];
};

export default function WorkspaceTabs({
    value,
    onChange,
    tabs,
}: WorkspaceTabsProps) {
    return (
        <div className="app-panel rounded-[1rem] p-1.5">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onChange(tab.id)}
                        className={[
                            "rounded-xl px-3 py-2 text-sm font-semibold",
                            value === tab.id ? "app-button-primary" : "app-button-ghost",
                        ].join(" ")}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
