import { Fragment } from "react";
import {
    getResultValueSegments,
    getResultValueTone,
    isWideResultValue,
} from "../utils/resultDisplay";
import ResultMath from "./math/ResultMath";

type ResultCardProps = {
    title: string;
    value: string;
    supportingText?: string;
    tone?: "default" | "accent" | "success" | "warning";
};

export default function ResultCard({
    title,
    value,
    supportingText,
    tone = "default",
}: ResultCardProps) {
    const valueTone = getResultValueTone(value);
    const shouldSpanWide = isWideResultValue({ title, value, supportingText });
    const toneClass =
        tone === "accent"
            ? "border-[color:var(--app-border-strong)] bg-[var(--app-accent-soft)]"
            : tone === "success"
              ? "app-tone-success"
              : tone === "warning"
                ? "app-tone-warning"
                : "";

    return (
        <div
            className={[
                "app-result-card app-panel-elevated min-w-0 rounded-[calc(var(--app-radius-lg)-0.25rem)] p-4 md:p-4.5",
                shouldSpanWide ? "app-result-card-wide" : "",
                toneClass,
            ].join(" ")}
        >
            <p className="app-label app-result-label">
                {title}
            </p>
            <p
                className={[
                    "mt-2 max-w-none min-w-0",
                    valueTone === "numeric"
                        ? "app-value-display app-result-value"
                        : valueTone === "sentence"
                          ? "app-result-text app-result-text-sentence"
                        : "app-result-text",
                ].join(" ")}
            >
                {valueTone === "numeric" ? (
                    getResultValueSegments(value).map((segment, index) => (
                        <Fragment key={`${segment.text}-${index}`}>
                            {segment.text}
                            {segment.breakAfter ? <wbr /> : null}
                        </Fragment>
                    ))
                ) : (
                    <ResultMath value={value} />
                )}
            </p>
            {supportingText ? (
                <p className="app-body-md app-result-supporting mt-2 text-sm">
                    {supportingText}
                </p>
            ) : null}
        </div>
    );
}
