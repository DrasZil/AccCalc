import { toneClassName } from "../../utils/notes/noteTone";

type StudyTipBlockProps = {
    body: string;
};

export default function StudyTipBlock({ body }: StudyTipBlockProps) {
    return (
        <div className={`${toneClassName("info")} rounded-[1.1rem] px-4 py-3.5`}>
            <p className="app-card-title text-sm">Study tip</p>
            <p className="app-reading-content mt-2">{body}</p>
        </div>
    );
}
