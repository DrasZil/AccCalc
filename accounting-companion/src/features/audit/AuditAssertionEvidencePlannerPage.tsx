import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";

type RiskLevel = "low" | "moderate" | "high";

const RISK_SCORE: Record<RiskLevel, number> = {
    low: 1,
    moderate: 2,
    high: 3,
};

const ASSERTION_GUIDE = {
    occurrence: {
        procedure: "Push toward vouching, contract support, and cut-off checks that prove recorded items really happened.",
        risk: "Overstatement and fictitious recording risk stay highest here.",
    },
    completeness: {
        procedure: "Push toward tracing, sequence checks, and liability-search style procedures that find what was left out.",
        risk: "Understatement risk matters most when the issue is completeness.",
    },
    valuation: {
        procedure: "Emphasize recalculation, aging, impairment, estimate challenge, and management-bias review.",
        risk: "Judgment-heavy balances need stronger evidence quality, not just more items tested.",
    },
    rights: {
        procedure: "Focus on title, ownership, agreements, and legal support that prove the entity controls the item.",
        risk: "Classification can look fine while rights or obligations are still wrong.",
    },
    presentation: {
        procedure: "Review classification, disclosure wording, and cross-footing so the statements tell the full story clearly.",
        risk: "Presentation failures often survive when the audit response focuses only on existence or amount.",
    },
} as const;

type AssertionKey = keyof typeof ASSERTION_GUIDE;

export default function AuditAssertionEvidencePlannerPage() {
    const [cycle, setCycle] = useState("Revenue and collection");
    const [assertion, setAssertion] = useState<AssertionKey>("occurrence");
    const [inherentRisk, setInherentRisk] = useState<RiskLevel>("high");
    const [controlReliance, setControlReliance] = useState<RiskLevel>("moderate");

    const result = useMemo(() => {
        const evidencePressure = RISK_SCORE[inherentRisk] + (4 - RISK_SCORE[controlReliance]);
        const evidenceDepth =
            evidencePressure >= 5
                ? "Heavy substantive response"
                : evidencePressure >= 4
                  ? "Balanced control and substantive response"
                  : "Targeted testing with documented reliance";

        const workingPaperPrompt =
            evidencePressure >= 5
                ? "Document the assertion risk, why control reliance is limited, and the specific evidence that directly addresses the risk."
                : evidencePressure >= 4
                  ? "Document which controls can be tested, then show how substantive work backs up the residual risk."
                  : "Document why the controls can be relied on and what focused procedures still support the final conclusion.";

        return {
            evidenceDepth,
            workingPaperPrompt,
            assertionGuide: ASSERTION_GUIDE[assertion],
        };
    }, [assertion, controlReliance, inherentRisk]);

    return (
        <CalculatorPageLayout
            badge="Audit & Assurance"
            title="Audit Assertion and Evidence Planner"
            description="Turn textbook audit facts into an assertion-first evidence plan so procedures, working papers, and report consequences stay tied to the actual risk."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <label className="app-label mb-2 block" htmlFor="audit-cycle">
                            Cycle or area under review
                        </label>
                        <input
                            id="audit-cycle"
                            value={cycle}
                            onChange={(event) => setCycle(event.target.value)}
                            className="app-field w-full rounded-[1rem] px-3.5 py-2.5 text-[0.95rem] outline-none"
                        />
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">Primary assertion focus</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {(Object.keys(ASSERTION_GUIDE) as AssertionKey[]).map((key) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setAssertion(key)}
                                    className={[
                                        "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize",
                                        assertion === key ? "app-button-primary" : "app-button-ghost",
                                    ].join(" ")}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">Risk and reliance snapshot</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <div>
                                <p className="app-helper text-xs">Inherent risk</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {(["low", "moderate", "high"] as RiskLevel[]).map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setInherentRisk(level)}
                                            className={[
                                                "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize",
                                                inherentRisk === level ? "app-button-primary" : "app-button-ghost",
                                            ].join(" ")}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="app-helper text-xs">Control reliance</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {(["low", "moderate", "high"] as RiskLevel[]).map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setControlReliance(level)}
                                            className={[
                                                "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize",
                                                controlReliance === level ? "app-button-primary" : "app-button-ghost",
                                            ].join(" ")}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SectionCard>
                </div>
            }
            resultSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-section-kicker text-[0.68rem]">Audit planning</p>
                        <h2 className="app-section-title mt-2">Evidence response for {cycle}</h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                Assertion: {assertion}
                            </span>
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                {result.evidenceDepth}
                            </span>
                        </div>
                        <p className="app-body-md mt-4 text-sm">
                            {result.assertionGuide.procedure}
                        </p>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">Why this matters</p>
                        <p className="app-body-md mt-2 text-sm">{result.assertionGuide.risk}</p>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">Working-paper prompt</p>
                        <p className="app-body-md mt-2 text-sm">{result.workingPaperPrompt}</p>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <RelatedLinksPanel
                    title="Audit next steps"
                    summary="Move into the broader planning, cycle, or completion route after the assertion and evidence direction is clear."
                    badge="3 routes"
                    items={[
                        {
                            path: "/audit/audit-planning-workspace",
                            label: "Audit Planning Workspace",
                            description: "Use this when materiality and audit-risk percentages are part of the case.",
                        },
                        {
                            path: "/audit/audit-cycle-reviewer",
                            label: "Audit Cycle Reviewer",
                            description: "Use this when the problem shifts into revenue, expenditure, conversion, or financing cycles.",
                        },
                        {
                            path: "/audit/audit-completion-and-opinion",
                            label: "Audit Completion and Opinion Workspace",
                            description: "Use this when the issue moves into going concern, subsequent events, or report type.",
                        },
                    ]}
                    showDescriptions
                />
            }
        />
    );
}
