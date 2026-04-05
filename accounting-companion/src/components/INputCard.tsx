type InputCardProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: "number" | "text";
    inputMode?: "decimal" | "numeric" | "text" | "search";
    helperText?: string;
};

export default function InputCard({
    label,
    value,
    onChange,
    placeholder,
    type = "number",
    inputMode = "decimal",
    helperText,
}: InputCardProps) {
    return (
        <div className="app-input-shell rounded-[var(--app-radius-md)] p-3.5 md:p-4">
            <label className="app-label mb-2 block">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                inputMode={inputMode}
                className={[
                    "app-field w-full rounded-2xl px-4 py-3 text-[0.96rem] outline-none",
                    type === "number" ? "app-numeric" : "",
                ].join(" ")}
            />
            {helperText ? (
                <p className="app-helper mt-2 text-xs leading-5">{helperText}</p>
            ) : null}
        </div>
    );
}
