type InputCardProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: "number" | "text";
    inputMode?: "decimal" | "numeric" | "text" | "search";
    helperText?: string;
    step?: string;
    autoFocus?: boolean;
    enterKeyHint?: "done" | "next" | "go" | "search" | "send";
};

export default function InputCard({
    label,
    value,
    onChange,
    placeholder,
    type = "number",
    inputMode = "decimal",
    helperText,
    step = "any",
    autoFocus = false,
    enterKeyHint = "done",
}: InputCardProps) {
    return (
        <div className="app-input-shell rounded-[var(--app-radius-md)] p-3.5">
            <label className="app-label mb-2 block">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                inputMode={inputMode}
                aria-label={label}
                autoFocus={autoFocus}
                autoComplete="off"
                enterKeyHint={enterKeyHint}
                spellCheck={false}
                step={type === "number" ? step : undefined}
                className={[
                    "app-field w-full rounded-[1rem] px-3.5 py-3 text-[0.95rem] outline-none",
                    type === "number" ? "app-numeric" : "",
                ].join(" ")}
            />
            {helperText ? (
                <p className="app-helper mt-2 text-xs leading-5">{helperText}</p>
            ) : null}
        </div>
    );
}
