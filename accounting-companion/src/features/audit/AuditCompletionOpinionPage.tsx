import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import DisclosurePanel from "../../components/DisclosurePanel";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";

const COMPLETION_AREAS = {
    completion: {
        title: "Completion procedures",
        notes: [
            "Completion work ties together misstatements, disclosure review, subsequent events, and final analytical procedures.",
            "The question is often not which one procedure exists, but whether the engagement evidence now supports a conclusion.",
            "Representation letters support but do not replace other audit evidence.",
        ],
    },
    goingConcern: {
        title: "Going concern and subsequent events",
        notes: [
            "Separate conditions existing at period end from events arising after period end.",
            "A going-concern issue is not only about losses; it is about whether significant doubt and response requirements exist.",
            "The answer should connect facts, management plans, disclosures, and report consequence.",
        ],
    },
    reporting: {
        title: "Modified reports and key audit matters",
        notes: [
            "Decide first whether the issue is a misstatement, scope limitation, emphasis matter, or KAM communication matter.",
            "A KAM is not automatically a modified opinion.",
            "The reporting answer should state both the type of opinion and the reason for it.",
        ],
    },
} as const;

type CompletionKey = keyof typeof COMPLETION_AREAS;

export default function AuditCompletionOpinionPage() {
    const [selection, setSelection] = useState<CompletionKey>("completion");
    const area = useMemo(() => COMPLETION_AREAS[selection], [selection]);

    return (
        <CalculatorPageLayout
            badge="Audit & Assurance"
            title="Audit Completion and Opinion Workspace"
            description="Use a structured reviewer for completion procedures, subsequent events, going concern, representation letters, modified reports, and key audit matters."
            inputSection={
                <SectionCard>
                    <p className="app-card-title text-sm">Select an audit completion lane</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(COMPLETION_AREAS).map(([key, item]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setSelection(key as CompletionKey)}
                                className={[
                                    "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                                    selection === key ? "app-button-primary" : "app-button-ghost",
                                ].join(" ")}
                            >
                                {item.title}
                            </button>
                        ))}
                    </div>
                </SectionCard>
            }
            resultSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-section-kicker text-[0.68rem]">Completion reviewer</p>
                        <h2 className="app-section-title mt-2">{area.title}</h2>
                    </SectionCard>

                    <DisclosurePanel
                        title="Structured review notes"
                        summary="Open this when you need the decision logic before you commit to an opinion or reporting consequence."
                        defaultOpen
                    >
                        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                            <ul className="list-disc space-y-2 pl-5 text-sm">
                                {area.notes.map((note) => (
                                    <li key={note}>{note}</li>
                                ))}
                            </ul>
                        </div>
                    </DisclosurePanel>
                </div>
            }
            explanationSection={
                <RelatedLinksPanel
                    title="Related audit support"
                    summary="Use these follow-up routes when the issue moves back into planning, AIS, or broader study review."
                    badge="3 routes"
                    items={[
                        {
                            path: "/audit/audit-cycle-reviewer",
                            label: "Audit Cycle Reviewer",
                            description: "Use this if the reporting issue begins in a cycle-specific evidence or control problem.",
                        },
                        {
                            path: "/audit/audit-planning-workspace",
                            label: "Audit Planning Workspace",
                            description: "Move back here if the problem still depends on materiality or risk-response framing.",
                        },
                        {
                            path: "/study/topics/audit-completion-modified-reports-and-kams",
                            label: "Audit completion lesson",
                            description: "Open the fuller Study Hub topic for board-review style completion and reporting coverage.",
                        },
                    ]}
                    showDescriptions
                />
            }
        />
    );
}
