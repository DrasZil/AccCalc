import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import DisclosurePanel from "../../components/DisclosurePanel";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";

const STRATEGIC_AREAS = {
    businessAnalysis: {
        title: "Strategic business analysis",
        points: [
            "Start with industry, customer, and competitive context before diving into detailed ratios or budgets.",
            "A strong strategic answer explains what matters commercially, not just what changed numerically.",
            "Use the primary issue first, then connect the accounting effect, control issue, or tax consequence after.",
        ],
    },
    costManagement: {
        title: "Strategic cost management and consultancy framing",
        points: [
            "Separate cost behavior, capacity, quality, and strategic positioning so one cost figure does not hide the real issue.",
            "Consultancy-style questions usually need diagnosis, options, tradeoffs, and implementation consequences.",
            "Good advice links operational practicality to financial and control effects.",
        ],
    },
    researchAndIntegration: {
        title: "Research methods and integrative review framing",
        points: [
            "State the question, evidence need, and decision use before presenting conclusions.",
            "Integrative review is strongest when FAR, AFAR, tax, audit, and law issues are ranked instead of treated as equal noise.",
            "Research-method questions become clearer when data quality, scope, and limitation are explicit.",
        ],
    },
} as const;

type StrategicKey = keyof typeof STRATEGIC_AREAS;

export default function StrategicBusinessAnalysisPage() {
    const [selection, setSelection] = useState<StrategicKey>("businessAnalysis");
    const area = useMemo(() => STRATEGIC_AREAS[selection], [selection]);

    return (
        <CalculatorPageLayout
            badge="Strategic & Integrative"
            title="Strategic Business Analysis Workspace"
            description="Review strategic business analysis, strategic cost management, consultancy-style case framing, research-method logic, and integrated board-review thinking."
            inputSection={
                <SectionCard>
                    <p className="app-card-title text-sm">Select a strategic review lane</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(STRATEGIC_AREAS).map(([key, item]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setSelection(key as StrategicKey)}
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
                        <p className="app-section-kicker text-[0.68rem]">Strategic reviewer</p>
                        <h2 className="app-section-title mt-2">{area.title}</h2>
                    </SectionCard>
                    <DisclosurePanel
                        title="Review prompts"
                        summary="Open this to keep strategic and integrative answers structured instead of becoming long unfocused commentary."
                        defaultOpen
                    >
                        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                            <ul className="list-disc space-y-2 pl-5 text-sm">
                                {area.points.map((point) => (
                                    <li key={point}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    </DisclosurePanel>
                </div>
            }
            explanationSection={
                <RelatedLinksPanel
                    title="Related integrative flow"
                    summary="Move into the case mapper, operations, or financial-analysis tools when the strategic issue is clear enough to route."
                    badge="3 routes"
                    items={[
                        {
                            path: "/strategic/integrative-case-mapper",
                            label: "Integrative Case Mapper",
                            description: "Use this when the mixed-topic case needs a primary-versus-secondary issue map.",
                        },
                        {
                            path: "/business/roi-ri-eva",
                            label: "ROI, RI, and EVA Workspace",
                            description: "Open this when the strategic issue shifts into investment-center performance evaluation.",
                        },
                        {
                            path: "/study/topics/strategic-business-analysis-and-cost-management",
                            label: "Strategic deferred-topic lesson",
                            description: "Use the Study Hub lesson for strategic business analysis, consultancy framing, and research-method support.",
                        },
                    ]}
                    showDescriptions
                />
            }
        />
    );
}
