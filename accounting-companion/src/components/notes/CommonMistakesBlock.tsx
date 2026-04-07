import { toneClassName } from "../../utils/notes/noteTone";

type CommonMistakesBlockProps = {
    mistakes: string[];
};

export default function CommonMistakesBlock({ mistakes }: CommonMistakesBlockProps) {
    if (!mistakes.length) return null;

    return (
        <div className={`${toneClassName("warning")} rounded-[1.1rem] px-4 py-3.5`}>
            <p className="app-card-title text-sm">Common pitfalls</p>
            <div className="mt-2 space-y-2 text-sm">
                {mistakes.map((mistake) => (
                    <p key={mistake}>{mistake}</p>
                ))}
            </div>
        </div>
    );
}

