import ChartStatCallout from "./ChartStatCallout";
import type { ChartHighlight } from "../../utils/charts/chartHighlights";

type ChartInsightPanelProps = {
    title?: string;
    meaning: string;
    importance: string;
    highlights?: ChartHighlight[];
};

export default function ChartInsightPanel({
    title = "Chart insight",
    meaning,
    importance,
    highlights = [],
}: ChartInsightPanelProps) {
    return (
        <div className="app-panel rounded-[var(--app-radius-lg)] p-5 md:p-6">
            <div className="max-w-2xl">
                <p className="app-section-kicker">Interpretation</p>
                <h3 className="app-section-title mt-2 text-xl">{title}</h3>
                <p className="app-reading-content mt-2">{meaning}</p>
                <p className="app-reading-content mt-2">{importance}</p>
            </div>

            {highlights.length > 0 ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {highlights.map((highlight) => (
                        <ChartStatCallout
                            key={highlight.title}
                            title={highlight.title}
                            value={highlight.value}
                            tone={highlight.tone}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
}
