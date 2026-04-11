import type { ReactNode } from "react";
import MathText from "./MathText";
import { looksLikeStandaloneMathText } from "../../utils/mathNotation";

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
    const renderMode = looksLikeStandaloneMathText(text) ? "math" : "plain";

    return (
        <div className={className}>
            <p className="app-label mb-3">{label}</p>
            <div className="app-formula-display app-formula-shell">
                <MathText
                    text={text}
                    block
                    renderMode={renderMode}
                    className={renderMode === "math" ? "app-formula-rich" : "app-formula-text"}
                />
            </div>
            {supportingText ? (
                <div className="app-reading-content mt-3">{supportingText}</div>
            ) : null}
        </div>
    );
}
