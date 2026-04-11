import { startTransition, useEffect, useState } from "react";
import { createSafeMarkup } from "../../utils/trustedHtml";
import { renderMathMarkupAsync } from "../../utils/mathRender";
import { looksLikeMathText, polishMathText } from "../../utils/mathNotation";

type MathTextProps = {
    text: string;
    block?: boolean;
    className?: string;
    renderMode?: "auto" | "plain" | "math";
};

export default function MathText({
    text,
    block = false,
    className,
    renderMode = "auto",
}: MathTextProps) {
    const shouldRenderMath = renderMode === "math" || (renderMode === "auto" && looksLikeMathText(text));
    const [html, setHtml] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        if (!shouldRenderMath) {
            setHtml(null);
            return;
        }

        setHtml(null);

        void renderMathMarkupAsync(text, { block }).then((nextHtml) => {
            if (cancelled) return;
            startTransition(() => {
                setHtml(nextHtml);
            });
        });

        return () => {
            cancelled = true;
        };
    }, [block, shouldRenderMath, text]);

    if (html) {
        return (
            <span
                className={className}
                dangerouslySetInnerHTML={createSafeMarkup(html)}
            />
        );
    }

    return <span className={className}>{polishMathText(text)}</span>;
}
