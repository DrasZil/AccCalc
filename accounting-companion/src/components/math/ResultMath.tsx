import MathText from "./MathText";

type ResultMathProps = {
    value: string;
    className?: string;
};

export default function ResultMath({ value, className }: ResultMathProps) {
    return <MathText text={value} className={className} renderMode="auto" />;
}

