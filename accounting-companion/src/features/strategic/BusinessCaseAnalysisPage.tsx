import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";
import { computeBusinessCaseScore } from "../../utils/calculatorMath";

function clampScoreInput(value: string) {
    const numeric = Number(value || 0);
    return Number.isFinite(numeric) ? Math.max(0, Math.min(100, numeric)) : 0;
}

export default function BusinessCaseAnalysisPage() {
    const [marketAttractiveness, setMarketAttractiveness] = useState("74");
    const [costAdvantage, setCostAdvantage] = useState("61");
    const [controlReadiness, setControlReadiness] = useState("58");
    const [executionCapacity, setExecutionCapacity] = useState("67");
    const [riskPenalty, setRiskPenalty] = useState("18");

    const result = useMemo(
        () =>
            computeBusinessCaseScore({
                marketAttractiveness: clampScoreInput(marketAttractiveness),
                costAdvantage: clampScoreInput(costAdvantage),
                controlReadiness: clampScoreInput(controlReadiness),
                executionCapacity: clampScoreInput(executionCapacity),
                riskPenalty: clampScoreInput(riskPenalty),
            }),
        [
            controlReadiness,
            costAdvantage,
            executionCapacity,
            marketAttractiveness,
            riskPenalty,
        ]
    );

    const scoreInputs = [
        ["Market attractiveness", marketAttractiveness, setMarketAttractiveness],
        ["Cost advantage", costAdvantage, setCostAdvantage],
        ["Control readiness", controlReadiness, setControlReadiness],
        ["Execution capacity", executionCapacity, setExecutionCapacity],
        ["Risk penalty", riskPenalty, setRiskPenalty],
    ] as const;

    return (
        <CalculatorPageLayout
            badge="Strategic & Integrative"
            title="Business Case Analysis Planner"
            description="Turn market, control, execution, and risk signals into a cleaner go / refine / stop recommendation for strategic and consultancy-style coursework."
            inputSection={
                <SectionCard>
                    <div className="grid gap-4 md:grid-cols-2">
                        {scoreInputs.map(([label, value, setter]) => (
                            <label key={label} className="space-y-2">
                                <span className="app-label block">{label}</span>
                                <input
                                    value={value}
                                    onChange={(event) => setter(event.target.value)}
                                    inputMode="decimal"
                                    className="app-field w-full rounded-[1rem] px-3.5 py-2.5 outline-none"
                                />
                                <span className="app-helper text-xs">
                                    Enter a 0 to 100 reviewer score.
                                </span>
                            </label>
                        ))}
                    </div>
                </SectionCard>
            }
            resultSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-section-kicker text-[0.68rem]">Business-case read</p>
                        <h2 className="app-section-title mt-2">
                            {result.weightedScore.toFixed(1)} / 100
                        </h2>
                        <p className="app-body-md mt-3 text-sm">{result.recommendation}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.68rem]">
                                Planning signal: {result.planningSignal}
                            </span>
                        </div>
                    </SectionCard>
                    <SectionCard>
                        <p className="app-card-title text-sm">How to explain the result</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                            <li>State the recommendation before listing supporting numbers.</li>
                            <li>Separate market opportunity from execution and control feasibility.</li>
                            <li>Use the risk penalty to explain why a good-looking case may still need refinement.</li>
                            <li>Route next into budgeting, ROI, or balanced scorecard work if approval is still plausible.</li>
                        </ul>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-card-title text-sm">Method note</p>
                        <p className="app-body-md mt-2 text-sm">
                            This is a structured student planner, not a corporate valuation model. It is
                            designed to keep strategic recommendations tied to market reality, control
                            readiness, and execution capacity instead of relying on one attractive metric.
                        </p>
                    </SectionCard>
                    <RelatedLinksPanel
                        title="Strategic next steps"
                        summary="Move into scorecards, investment-center measures, or the Study Hub when the case needs a broader performance story."
                        badge="3 routes"
                        items={[
                            {
                                path: "/strategic/strategic-business-analysis",
                                label: "Strategic Business Analysis Workspace",
                                description:
                                    "Use for industry, consultancy, and strategic-cost-management framing.",
                            },
                            {
                                path: "/strategic/balanced-scorecard-workspace",
                                label: "Balanced Scorecard Workspace",
                                description:
                                    "Use when the business case must become measures, owners, and follow-up indicators.",
                            },
                            {
                                path: "/study/topics/strategic-business-case-analysis-and-integration",
                                label: "Business case lesson module",
                                description:
                                    "Open the Study Hub lesson for recommendation structure, trade-offs, and practice-next guidance.",
                            },
                        ]}
                        showDescriptions
                    />
                </div>
            }
        />
    );
}
