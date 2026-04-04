type InputCardProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: "number" | "text";
    inputMode?: "decimal" | "numeric" | "text" | "search";
};

export default function InputCard({
    label,
    value,
    onChange,
    placeholder,
    type = "number",
    inputMode = "decimal",
}: InputCardProps) {
    return (
        <div className="app-input-shell rounded-[var(--app-radius-md)] p-4">
            <label className="app-label mb-2.5 block">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                inputMode={inputMode}
                className={[
                    "app-field w-full rounded-2xl px-4 py-3.5 text-[0.98rem] outline-none",
                    type === "number" ? "app-numeric" : "",
                ].join(" ")}
            />
        </div>
    );
}
