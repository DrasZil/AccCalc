import MathText from "./MathText";

type MathInlineProps = {
    text: string;
    className?: string;
    renderMode?: "auto" | "plain" | "math";
};

export default function MathInline(props: MathInlineProps) {
    return <MathText {...props} />;
}

