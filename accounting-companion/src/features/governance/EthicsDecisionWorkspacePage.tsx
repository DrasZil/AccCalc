import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import SectionCard from "../../components/SectionCard";

type PressureLevel = "low" | "moderate" | "high";

const SCORE: Record<PressureLevel, number> = {
    low: 1,
    moderate: 2,
    high: 3,
};

export default function EthicsDecisionWorkspacePage() {
    const [issueArea, setIssueArea] = useState("Revenue pressure and reporting targets");
    const [ethicalPressure, setEthicalPressure] = useState<PressureLevel>("high");
    const [stakeholderImpact, setStakeholderImpact] = useState<PressureLevel>("high");
    const [overrideRisk, setOverrideRisk] = useState<PressureLevel>("moderate");

    const result = useMemo(() => {
        const totalScore =
            SCORE[ethicalPressure] + SCORE[stakeholderImpact] + SCORE[overrideRisk];

        return {
            totalScore,
            label:
                totalScore >= 8
                    ? "Immediate escalation and control response needed"
                    : totalScore >= 6
                      ? "Structured ethics review and monitoring needed"
                      : "Documented review still needed, but pressure is less severe",
            recommendedMove:
                totalScore >= 8
                    ? "Escalate through governance channels, protect evidence, and reassess whether existing controls can really resist management override."
                    : totalScore >= 6
                      ? "Document the issue, identify the affected stakeholders, and test whether monitoring and approval controls are strong enough."
                      : "Document the issue clearly and confirm whether preventive controls and review procedures already address it.",
        };
    }, [ethicalPressure, overrideRisk, stakeholderImpact]);

    const ratingRows = [
        ["Ethical pressure", ethicalPressure, setEthicalPressure],
        ["Stakeholder impact", stakeholderImpact, setStakeholderImpact],
        ["Override risk", overrideRisk, setOverrideRisk],
    ] as const;

    return (
        <CalculatorPageLayout
            badge="Governance & Ethics"
            title="Ethics Decision Workspace"
            description="Structure governance and ethics problems around pressure, stakeholder impact, and override risk so decision ethics is handled as a practical control issue instead of a vague reflection prompt."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <label className="app-label mb-2 block" htmlFor="issue-area">
                            Ethical issue area
                        </label>
                        <input
                            id="issue-area"
                            value={issueArea}
                            onChange={(event) => setIssueArea(event.target.value)}
                            className="app-field w-full rounded-[1rem] px-3.5 py-2.5 text-[0.95rem] outline-none"
                        />
                    </SectionCard>

                    {ratingRows.map(([label, value, setter]) => (
                        <SectionCard key={label}>
                            <p className="app-card-title text-sm">{label}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {(["low", "moderate", "high"] as PressureLevel[]).map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setter(level)}
                                        className={[
                                            "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize",
                                            value === level ? "app-button-primary" : "app-button-ghost",
                                        ].join(" ")}
                                    >
                                        {level}
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
                        <p className="app-section-kicker text-[0.68rem]">Governance and ethics</p>
                        <h2 className="app-section-title mt-2">{result.label}</h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                {issueArea}
                            </span>
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                Score {result.totalScore} / 9
                            </span>
                        </div>
                        <p className="app-body-md mt-4 text-sm">{result.recommendedMove}</p>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">Decision prompts</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                            <li>Name the stakeholder group most exposed if the issue is ignored.</li>
                            <li>State which governance or approval layer should respond first.</li>
                            <li>Explain whether the real risk is misconduct, weak oversight, or ineffective monitoring.</li>
                        </ul>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <SectionCard>
                    <p className="app-card-title text-sm">Framework note</p>
                    <p className="app-body-md mt-2 text-sm">
                        This page is a structured ethics-and-governance helper, not a moral score.
                        Its purpose is to keep stakeholder impact, control override, and escalation
                        logic visible when the case pressure is high.
                    </p>
                </SectionCard>
            }
        />
    );
}
