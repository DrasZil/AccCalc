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
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <label className="mb-2 block text-sm font-medium text-gray-300">
            {label}
        </label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-green-400/40 focus:ring-2 focus:ring-green-400/20"
        />
        </div>
    );
}