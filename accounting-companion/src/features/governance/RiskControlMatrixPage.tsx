import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import SectionCard from "../../components/SectionCard";

type Rating = "low" | "moderate" | "high";

const SCORE: Record<Rating, number> = {
    low: 1,
    moderate: 2,
    high: 3,
};

export default function RiskControlMatrixPage() {
    const [riskArea, setRiskArea] = useState("Revenue recognition");
    const [likelihood, setLikelihood] = useState<Rating>("moderate");
    const [impact, setImpact] = useState<Rating>("high");
    const [controlDesign, setControlDesign] = useState<Rating>("moderate");
    const [controlOperation, setControlOperation] = useState<Rating>("moderate");

    const result = useMemo(() => {
        const inherentRiskScore = SCORE[likelihood] * SCORE[impact];
        const controlStrength = (SCORE[controlDesign] + SCORE[controlOperation]) / 2;
        const residualRiskScore = inherentRiskScore / Math.max(controlStrength, 1);

        return {
            inherentRiskScore,
            controlStrength,
            residualRiskScore,
            residualRiskLabel:
                residualRiskScore >= 4.5
                    ? "Elevated residual risk"
                    : residualRiskScore >= 3
                      ? "Moderate residual risk"
                      : "Lower residual risk",
        };
    }, [controlDesign, controlOperation, impact, likelihood]);

    const ratingBlocks = [
        ["Likelihood", likelihood, setLikelihood],
        ["Impact", impact, setImpact],
        ["Control design", controlDesign, setControlDesign],
        ["Control operation", controlOperation, setControlOperation],
    ] as const;

    return (
        <CalculatorPageLayout
            badge="Governance & Ethics"
            title="Risk and Control Matrix"
            description="Read inherent risk, control quality, and residual risk in one governance and internal-control review workspace."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <label className="app-label mb-2 block" htmlFor="risk-area">
                            Risk area
                        </label>
                        <input
                            id="risk-area"
                            value={riskArea}
                            onChange={(event) => setRiskArea(event.target.value)}
                            className="app-field w-full rounded-[1rem] px-3.5 py-2.5 text-[0.95rem] outline-none"
                        />
                    </SectionCard>

                    {ratingBlocks.map(([label, value, setter]) => (
                        <SectionCard key={label}>
                            <p className="app-card-title text-sm">{label}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {(["low", "moderate", "high"] as Rating[]).map((rating) => (
                                    <button
                                        key={rating}
                                        type="button"
                                        onClick={() => setter(rating)}
                                        className={[
                                            "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize",
                                            value === rating ? "app-button-primary" : "app-button-ghost",
                                        ].join(" ")}
                                    >
                                        {rating}
                                    </button>
                                ))}
                            </div>
                        </SectionCard>
                    ))}
                </div>
            }
            resultSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-section-kicker text-[0.68rem]">Governance and internal control</p>
                        <h2 className="app-section-title mt-2">Residual risk read</h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                {riskArea}
                            </span>
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                {result.residualRiskLabel}
                            </span>
                        </div>
                        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
                            <li>Inherent risk score: {result.inherentRiskScore.toFixed(2)}</li>
                            <li>Average control strength: {result.controlStrength.toFixed(2)} / 3.00</li>
                            <li>Residual risk score: {result.residualRiskScore.toFixed(2)}</li>
                        </ul>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">Next-step prompts</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                            <li>State whether the key issue is design weakness, operating failure, or both.</li>
                            <li>Identify the preventive and detective controls that should exist.</li>
                            <li>Link the risk to governance oversight, reporting, and ethical escalation.</li>
                            <li>Recommend the next monitoring or assurance response.</li>
                        </ul>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <SectionCard>
                    <p className="app-card-title text-sm">Framework note</p>
                    <p className="app-body-md mt-2 text-sm">
                        The scoring here is intentionally simplified for reviewer use. The real value of the
                        page is the structured risk narrative it produces: identify the risk, assess the
                        control response, and explain the remaining exposure clearly.
                    </p>
                </SectionCard>
            }
        />
    );
}
