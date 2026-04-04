type ResultCardProps = {
    title: string;
    value: string;
    supportingText?: string;
};

export default function ResultCard({ title, value, supportingText }: ResultCardProps) {
    return (
        <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15">
            <p className="text-sm font-medium tracking-[0.01em] text-gray-400">{title}</p>
            <p className="mt-3 break-words text-2xl font-bold tracking-tight text-white md:text-[1.9rem]">
                {value}
            </p>
            {supportingText ? (
                <p className="mt-3 text-sm leading-6 text-gray-400">{supportingText}</p>
            ) : null}
        </div>
    );
}
