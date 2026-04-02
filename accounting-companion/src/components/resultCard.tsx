type ResultCardProps = {
    title: string;
    value: string;
    };

    export default function ResultCard({ title, value }: ResultCardProps) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-white wrap-break-words">
            {value}
        </p>
        </div>
    );
}