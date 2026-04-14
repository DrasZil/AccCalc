import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import DisclosurePanel from "../../components/DisclosurePanel";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";

const CYCLES = {
    revenue: {
        title: "Revenue and collection cycle",
        assertions: ["Occurrence", "Cutoff", "Accuracy", "Valuation"],
        procedures: [
            "Tie the recorded sale to source documents and subsequent collection evidence.",
            "Test cutoff around period end for shipments, billings, and returns.",
            "Connect revenue assertions to receivables and allowance consequences.",
        ],
    },
    expenditure: {
        title: "Expenditure cycle",
        assertions: ["Completeness", "Occurrence", "Cutoff", "Classification"],
        procedures: [
            "Trace receiving reports and supplier documents into liabilities recording.",
            "Review unmatched receiving and invoice files near period end.",
            "Check approval, segregation, and vendor-master controls before detailed testing.",
        ],
    },
    conversion: {
        title: "Conversion and inventory cycle",
        assertions: ["Existence", "Valuation", "Completeness", "Allocation"],
        procedures: [
            "Read production flow, costing logic, and inventory movement controls together.",
            "Test standard-cost, overhead-allocation, and physical-count controls where relevant.",
            "Connect inventory assertions to cost-of-sales and impairment consequences.",
        ],
    },
    financing: {
        title: "Investing and financing cycle",
        assertions: ["Rights and obligations", "Completeness", "Presentation", "Accuracy"],
        procedures: [
            "Inspect contracts, board approvals, and supporting legal documentation.",
            "Trace debt and equity events to cash, disclosure, and covenant effects.",
            "Review classification between current and noncurrent balances carefully.",
        ],
    },
} as const;

type CycleKey = keyof typeof CYCLES;

export default function AuditCycleReviewerPage() {
    const [cycleKey, setCycleKey] = useState<CycleKey>("revenue");
    const cycle = useMemo(() => CYCLES[cycleKey], [cycleKey]);

    return (
        <CalculatorPageLayout
            badge="Audit & Assurance"
            title="Audit Cycle Reviewer"
            description="Review transaction-cycle assertions, control points, and likely procedures across revenue, expenditure, conversion, and financing cycles."
            inputSection={
                <SectionCard>
                    <p className="app-card-title text-sm">Select a transaction cycle</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(CYCLES).map(([key, item]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setCycleKey(key as CycleKey)}
                                className={[
                                    "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                                    cycleKey === key ? "app-button-primary" : "app-button-ghost",
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
                        <p className="app-section-kicker text-[0.68rem]">Cycle focus</p>
                        <h2 className="app-section-title mt-2">{cycle.title}</h2>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {cycle.assertions.map((assertion) => (
                                <span key={assertion} className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                    {assertion}
                                </span>
                            ))}
                        </div>
                    </SectionCard>

                    <DisclosurePanel
                        title="Likely procedures"
                        summary="Open this to connect the cycle to assertions, controls, and substantive response."
                        defaultOpen
                    >
                        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                            <ul className="list-disc space-y-2 pl-5 text-sm">
                                {cycle.procedures.map((procedure) => (
                                    <li key={procedure}>{procedure}</li>
                                ))}
                            </ul>
                        </div>
                    </DisclosurePanel>
                </div>
            }
            explanationSection={
                <RelatedLinksPanel
                    title="Related audit flow"
                    summary="Use the cycle reviewer first, then move into planning, completion, and AIS support as needed."
                    badge="3 routes"
                    items={[
                        {
                            path: "/audit/audit-planning-workspace",
                            label: "Audit Planning Workspace",
                            description: "Use planning materiality and risk response once the cycle risk picture is clear.",
                        },
                        {
                            path: "/audit/audit-completion-and-opinion",
                            label: "Audit Completion and Opinion Workspace",
                            description: "Move here when the issue becomes subsequent events, going concern, or modified reporting.",
                        },
                        {
                            path: "/ais/ais-lifecycle-and-recovery",
                            label: "AIS Lifecycle and Recovery Review",
                            description: "Open this when the cycle risk depends on ERP, continuity, or IT-control concerns.",
                        },
                    ]}
                    showDescriptions
                />
            }
        />
    );
}
