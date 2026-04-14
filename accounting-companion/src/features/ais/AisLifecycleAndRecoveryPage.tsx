import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import DisclosurePanel from "../../components/DisclosurePanel";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";

const AIS_AREAS = {
    continuity: {
        title: "Business continuity and disaster recovery",
        notes: [
            "Separate business continuity planning from disaster recovery: continuity keeps critical operations running, while disaster recovery restores systems and data.",
            "Good reviewer answers connect backup, recovery objectives, testing, communication, and ownership.",
            "Incident management and capacity planning matter because resilience is not only a recovery problem.",
        ],
    },
    enterprise: {
        title: "ERP, supply chain, CRM, and service management",
        notes: [
            "Classify the module or platform role before talking about control risk or implementation issues.",
            "ERP questions often mix process integration, master data, authorization, and segregation problems.",
            "Service management issues usually test incident handling, change management, and operational governance.",
        ],
    },
    systemsAndAudit: {
        title: "Systems analysis, implementation, and IT audit documentation",
        notes: [
            "Keep systems analysis, implementation, and post-implementation maintenance distinct in both design and control discussion.",
            "IT-audit documentation should show objective, scope, procedure, evidence, and conclusion rather than generic system commentary.",
            "Data warehousing and BI questions usually test data flow, integrity, and reporting usefulness together.",
        ],
    },
} as const;

type AisKey = keyof typeof AIS_AREAS;

export default function AisLifecycleAndRecoveryPage() {
    const [selection, setSelection] = useState<AisKey>("continuity");
    const area = useMemo(() => AIS_AREAS[selection], [selection]);

    return (
        <CalculatorPageLayout
            badge="AIS & IT Controls"
            title="AIS Lifecycle and Recovery Review"
            description="Review business continuity, disaster recovery, ERP and service-management concerns, systems life cycle, and IT-audit documentation from one structured AIS workspace."
            inputSection={
                <SectionCard>
                    <p className="app-card-title text-sm">Select an AIS review lane</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(AIS_AREAS).map(([key, item]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setSelection(key as AisKey)}
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
                        <p className="app-section-kicker text-[0.68rem]">AIS reviewer</p>
                        <h2 className="app-section-title mt-2">{area.title}</h2>
                    </SectionCard>
                    <DisclosurePanel
                        title="Review notes"
                        summary="Open the current AIS lane when you need the structure before going into IT controls or audit evidence."
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
                    title="Related AIS and audit flow"
                    summary="Move into control review, audit planning, or the broader lesson path as needed."
                    badge="3 routes"
                    items={[
                        {
                            path: "/ais/it-control-matrix",
                            label: "IT Control Matrix",
                            description: "Use this when the issue shifts from systems context to specific control evaluation.",
                        },
                        {
                            path: "/audit/audit-planning-workspace",
                            label: "Audit Planning Workspace",
                            description: "Open this when AIS issues start changing audit risk and response.",
                        },
                        {
                            path: "/study/topics/ais-bcp-erp-and-service-management",
                            label: "AIS deferred-topic lesson",
                            description: "Use the fuller Study Hub lesson for continuity, ERP, CRM, incident management, and disaster recovery.",
                        },
                    ]}
                    showDescriptions
                />
            }
        />
    );
}
