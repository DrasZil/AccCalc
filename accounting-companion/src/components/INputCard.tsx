type InputCardProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    };

    export default function InputCard({
    label,
    value,
    onChange,
    placeholder,
    }: InputCardProps) {
    return (
        <div className="rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm">
        <label className="mb-2 block text-sm font-medium tracking-[0.01em] text-gray-200">
            {label}
        </label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            inputMode="decimal"
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-base text-white outline-none transition placeholder:text-gray-500 focus:border-green-400/40 focus:bg-black/40 focus:ring-2 focus:ring-green-400/20"
        />
        </div>
    );
}
