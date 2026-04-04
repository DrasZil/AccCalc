type ResultCardProps = {
    title: string;
    value: string;
    };

    export default function ResultCard({ title, value }: ResultCardProps) {
    return (
        <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
        <p className="text-sm font-medium tracking-[0.01em] text-gray-400">{title}</p>
        <p className="mt-3 text-2xl font-bold tracking-tight text-white wrap-break-words md:text-[1.9rem]">
            {value}
        </p>
        </div>
    );
}
