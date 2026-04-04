type TextAreaCardProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
};

export default function TextAreaCard({
    label,
    value,
    onChange,
    placeholder,
    rows = 5,
}: TextAreaCardProps) {
    return (
        <div className="app-input-shell rounded-[var(--app-radius-md)] p-4">
            <label className="app-label mb-2.5 block">
                {label}
            </label>
            <textarea
                rows={rows}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="app-field w-full resize-y rounded-2xl px-4 py-3.5 text-[0.98rem] outline-none"
            />
        </div>
    );
}
