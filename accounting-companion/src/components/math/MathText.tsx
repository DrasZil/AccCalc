import { useMemo } from "react";
import katex from "katex";
import { looksLikeMathText, plainTextToLatex, polishMathText } from "../../utils/mathNotation";

type MathTextProps = {
    text: string;
    block?: boolean;
    className?: string;
    renderMode?: "auto" | "plain" | "math";
};

function tryRenderKatex(source: string, displayMode: boolean) {
    try {
        return katex.renderToString(source, {
            throwOnError: false,
            strict: "ignore",
            displayMode,
            trust: false,
        });
    } catch {
        return null;
    }
}

export default function MathText({
    text,
    block = false,
    className,
    renderMode = "auto",
}: MathTextProps) {
    const shouldRenderMath = renderMode === "math" || (renderMode === "auto" && looksLikeMathText(text));
    const html = useMemo(() => {
        if (!shouldRenderMath) return null;
        return tryRenderKatex(plainTextToLatex(text), block);
    }, [block, shouldRenderMath, text]);

    if (html) {
        return (
            <span
                className={className}
                dangerouslySetInnerHTML={{ __html: html }}
            />
        );
    }

    return <span className={className}>{polishMathText(text)}</span>;
}

