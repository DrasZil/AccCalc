import { toneClassName } from "../../utils/notes/noteTone";

type InterpretationBlockProps = {
    title?: string;
    body: string;
};

export default function InterpretationBlock({
    title = "What this means",
    body,
}: InterpretationBlockProps) {
    return (
        <div className={`${toneClassName("accent")} rounded-[1.1rem] px-4 py-3.5`}>
            <p className="app-card-title text-sm">{title}</p>
            <p className="app-reading-content mt-2">{body}</p>
        </div>
    );
}
