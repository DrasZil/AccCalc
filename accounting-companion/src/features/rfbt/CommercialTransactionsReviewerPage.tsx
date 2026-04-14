import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import DisclosurePanel from "../../components/DisclosurePanel";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";

const LAW_AREAS = {
    transactions: {
        title: "Sales, credit transactions, and contracts of security",
        points: [
            "Start by naming the transaction type before discussing rights, obligations, or remedies.",
            "Credit and security cases often turn on priority, enforceability, and breach consequence rather than isolated definitions.",
            "Keep the principal obligation separate from the supporting security arrangement.",
        ],
    },
    marketConduct: {
        title: "Securities, insider trading, fraud, and manipulation",
        points: [
            "A good answer distinguishes issuer, investor, intermediary, and regulator perspectives.",
            "Market-conduct cases are often about prohibited behavior plus the policy reason for the rule.",
            "Fraud and manipulation questions usually require consequence analysis, not mere definition recall.",
        ],
    },
    rehabilitation: {
        title: "Procurement, intellectual property, and corporate rehabilitation",
        points: [
            "Classify whether the issue is procurement procedure, proprietary right, or financial distress remedy before going into details.",
            "Corporate rehabilitation questions often test the goal of business preservation and the legal effect on claims or proceedings.",
            "Intellectual-property issues usually become stronger when the protected right and the infringing act are both stated clearly.",
        ],
    },
} as const;

type LawKey = keyof typeof LAW_AREAS;

export default function CommercialTransactionsReviewerPage() {
    const [selection, setSelection] = useState<LawKey>("transactions");
    const area = useMemo(() => LAW_AREAS[selection], [selection]);

    return (
        <CalculatorPageLayout
            badge="RFBT & Law"
            title="Commercial Transactions Reviewer"
            description="Review sales, credit transactions, contracts of security, securities regulation, insider trading, IP, procurement, and rehabilitation from one structured law-support workspace."
            inputSection={
                <SectionCard>
                    <p className="app-card-title text-sm">Select an RFBT review lane</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(LAW_AREAS).map(([key, item]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setSelection(key as LawKey)}
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
                        <p className="app-section-kicker text-[0.68rem]">Business-law reviewer</p>
                        <h2 className="app-section-title mt-2">{area.title}</h2>
                    </SectionCard>
                    <DisclosurePanel
                        title="Structured issue-spotting points"
                        summary="Open this when you need the transaction or regulatory frame before discussing remedies."
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
                    title="Related RFBT flow"
                    summary="Use the broader law-review routes only when the issue is clear enough to move from classification into application."
                    badge="3 routes"
                    items={[
                        {
                            path: "/rfbt/business-law-review",
                            label: "Business Law Review Workspace",
                            description: "Use the original first-pass law workspace for obligations, contracts, and corporation-law issue spotting.",
                        },
                        {
                            path: "/study/topics/rfbt-sales-credit-security-and-securities",
                            label: "Commercial-law lesson",
                            description: "Open the fuller lesson for deferred Pass 2 commercial-law depth.",
                        },
                        {
                            path: "/governance/risk-control-matrix",
                            label: "Risk and Control Matrix",
                            description: "Use this if the legal issue overlaps with governance, fraud risk, or control failure.",
                        },
                    ]}
                    showDescriptions
                />
            }
        />
    );
}
