import type { ReactNode } from "react";
import MathText from "./MathText";

type FormulaBlockProps = {
    label?: string;
    text: string;
    supportingText?: ReactNode;
    className?: string;
};

export default function FormulaBlock({
    label = "Equation",
    text,
    supportingText,
    className,
}: FormulaBlockProps) {
    return (
        <div className={className}>
            <p className="app-label mb-3">{label}</p>
            <div className="app-formula-display">
                <MathText text={text} block renderMode="math" />
            </div>
            {supportingText ? (
                <div className="app-body-md mt-3 text-sm">{supportingText}</div>
            ) : null}
        </div>
    );
}

