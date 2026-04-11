import type { ReactNode } from "react";
import MathText from "./MathText";
import { formatGuideText } from "../../utils/guideTextFormatting";
import { looksLikeStandaloneMathText } from "../../utils/mathNotation";

type FormulaBlockProps = {
    label?: string;
    text: string;
    supportingText?: ReactNode;
    className?: string;
};

function sentenceCase(input: string) {
    const trimmed = input.trim();
    if (!trimmed) return trimmed;
    return trimmed.replace(/^[a-z]/, (character) => character.toUpperCase());
}

function buildStructuredStatements(text: string) {
    const normalized = formatGuideText(text)
        .replace(/\s*[•·]\s*/g, "; ")
        .replace(/\s*;\s*/g, "; ")
        .replace(/\s{2,}/g, " ")
        .trim();

    if (!normalized) {
        return {
            lead: null,
            statements: [] as string[],
        };
    }

    const split = normalized
        .split(/;\s+/)
        .map((entry) => entry.trim())
        .filter(Boolean);

    const first = split[0] ?? normalized;
    const labelMatch = first.match(/^([^:=]{4,48}):\s*(.+)$/);
    const lead =
        labelMatch && split.length > 0 && /=/.test(labelMatch[2])
            ? sentenceCase(labelMatch[1])
            : null;

    const statements = (labelMatch && lead
        ? [labelMatch[2], ...split.slice(1)]
        : split
    )
        .map((entry) =>
            sentenceCase(
                entry
                    .replace(/\s*=\s*/g, " = ")
                    .replace(/\s*-\s*/g, " - ")
                    .replace(/\s*\/\s*/g, " / ")
                    .replace(/\s{2,}/g, " ")
                    .trim()
            )
        )
        .filter(Boolean);

    return {
        lead,
        statements,
    };
}

export default function FormulaBlock({
    label = "Equation",
    text,
    supportingText,
    className,
}: FormulaBlockProps) {
    const renderMode = looksLikeStandaloneMathText(text) ? "math" : "plain";
    const structuredContent = buildStructuredStatements(text);
    const shouldRenderStructuredStatements =
        renderMode === "plain" && structuredContent.statements.length >= 2;

    return (
        <div className={className}>
            <p className="app-label mb-3">{label}</p>
            {shouldRenderStructuredStatements ? (
                <div className="app-formula-structured">
                    {structuredContent.lead ? (
                        <p className="app-helper text-xs leading-5">{structuredContent.lead}</p>
                    ) : null}
                    <div className="app-formula-structured-list">
                        {structuredContent.statements.map((statement) => (
                            <div key={statement} className="app-formula-structured-item">
                                <span className="app-formula-structured-marker" aria-hidden="true" />
                                <MathText
                                    text={statement}
                                    block={false}
                                    renderMode="plain"
                                    className="app-formula-statement"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div
                    className={
                        renderMode === "math"
                            ? "app-formula-display app-formula-shell"
                            : "app-reading-content"
                    }
                >
                    <MathText
                        text={text}
                        block
                        renderMode={renderMode}
                        className={renderMode === "math" ? "app-formula-rich" : "app-formula-text"}
                    />
                </div>
            )}
            {supportingText ? (
                <div className="app-reading-content mt-3">{supportingText}</div>
            ) : null}
        </div>
    );
}
