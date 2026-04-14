import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import DisclosurePanel from "../../components/DisclosurePanel";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";

const TAX_TOPICS = {
    withholding: {
        title: "Withholding tax logic",
        summary: "Use this when the case is about collection-at-source, timing, and the compliance link between payer and payee.",
        points: [
            "Start by identifying whether the withholding is creditable, final, or a transaction-triggered collection mechanism in the problem context.",
            "Separate the tax base from the settlement amount so you do not net figures too early.",
            "Ask whether the classroom issue is recognition, remittance, documentation, or final tax burden.",
        ],
        traps: [
            "Students often confuse tax withheld with the final tax expense of the period.",
            "Some cases really test documentation and compliance timing, not just arithmetic.",
        ],
    },
    transfer: {
        title: "Documentary stamp, excise, estate, and donor's taxes",
        summary: "Use this for transfer and special taxes where the core issue is usually tax type, base, and triggering event.",
        points: [
            "Identify the transaction or transfer event first before reading the tax base.",
            "Check whether the problem is about property transfer, gratuitous transfer, or an excise-triggered event.",
            "State what the tax is attached to before discussing rates or compliance.",
        ],
        traps: [
            "Estate and donor's tax questions often hide the transfer nature inside long fact patterns.",
            "Excise-tax cases are frequently misread as ordinary business taxes.",
        ],
    },
    localAndTreaty: {
        title: "Local taxation, tax treaties, and incentives",
        summary: "Use this for jurisdiction questions, local tax overlap, and incentive-regime classification such as PEZA, BOI, BCDA, or BMBE framing.",
        points: [
            "Classify the taxpayer or transaction regime before discussing the numerical consequence.",
            "Check whether the case is about situs, jurisdiction, treaty relief, or an incentive-based exception.",
            "State whether the question is asking for eligibility, conflict, or ethical planning boundaries.",
        ],
        traps: [
            "Treaty and incentive questions are often classification problems before they become computation problems.",
            "Tax planning is not the same as evasion; keep legal and ethical framing explicit.",
        ],
    },
} as const;

type TaxTopicKey = keyof typeof TAX_TOPICS;

export default function TaxComplianceReviewPage() {
    const [topicKey, setTopicKey] = useState<TaxTopicKey>("withholding");
    const topic = useMemo(() => TAX_TOPICS[topicKey], [topicKey]);

    return (
        <CalculatorPageLayout
            badge="Taxation"
            title="Tax Compliance and Incentive Review"
            description="Review withholding, transfer and special taxes, local taxation, treaty concepts, and incentive-regime logic from one structured tax-support workspace."
            inputSection={
                <SectionCard>
                    <p className="app-card-title text-sm">Select a tax-review lane</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(TAX_TOPICS).map(([key, item]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setTopicKey(key as TaxTopicKey)}
                                className={[
                                    "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                                    topicKey === key ? "app-button-primary" : "app-button-ghost",
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
                        <p className="app-section-kicker text-[0.68rem]">Tax reviewer</p>
                        <h2 className="app-section-title mt-2">{topic.title}</h2>
                        <p className="app-body-md mt-2 text-sm">{topic.summary}</p>
                    </SectionCard>

                    <DisclosurePanel
                        title="Core review points"
                        summary="Open the main classification and compliance points for this tax lane."
                        defaultOpen
                    >
                        <div className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                            <ul className="list-disc space-y-2 pl-5 text-sm">
                                {topic.points.map((point) => (
                                    <li key={point}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    </DisclosurePanel>

                    <DisclosurePanel
                        title="Common traps"
                        summary="Use this before practice questions so legal and accounting labels do not get mixed."
                    >
                        <div className="app-tone-warning rounded-[1rem] px-4 py-3.5">
                            <ul className="list-disc space-y-2 pl-5 text-sm">
                                {topic.traps.map((trap) => (
                                    <li key={trap}>{trap}</li>
                                ))}
                            </ul>
                        </div>
                    </DisclosurePanel>
                </div>
            }
            explanationSection={
                <RelatedLinksPanel
                    title="Related next steps"
                    summary="Move from this reviewer into the more specific tax tools and broader integrative support only when you need them."
                    badge="3 routes"
                    items={[
                        {
                            path: "/tax/book-tax-difference-workspace",
                            label: "Book-Tax Difference Workspace",
                            description: "Use this when the issue becomes accounting-versus-tax timing differences.",
                        },
                        {
                            path: "/study/topics/tax-withholding-transfer-and-incentive-regimes",
                            label: "Tax deferred-topic lesson",
                            description: "Open the broader Study Hub lesson for withholding, transfer taxes, treaty handling, and incentives.",
                        },
                        {
                            path: "/strategic/integrative-case-mapper",
                            label: "Integrative Case Mapper",
                            description: "Use this if the tax question is mixed with FAR, audit, governance, or law issues.",
                        },
                    ]}
                    showDescriptions
                />
            }
        />
    );
}
