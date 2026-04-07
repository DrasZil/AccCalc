import { toneClassName } from "../../utils/notes/noteTone";

type PracticalMeaningBlockProps = {
    body: string;
};

export default function PracticalMeaningBlock({ body }: PracticalMeaningBlockProps) {
    return (
        <div className={`${toneClassName("default")} rounded-[1.1rem] px-4 py-3.5`}>
            <p className="app-card-title text-sm">Why it matters</p>
            <p className="app-reading-content mt-2">{body}</p>
        </div>
    );
}
