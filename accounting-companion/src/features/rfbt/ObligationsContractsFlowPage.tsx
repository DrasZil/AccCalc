import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";

const FLOW_GUIDE = {
    valid: "Check object, cause, consent, form when required, performance, breach, and remedy.",
    voidable: "Focus on capacity or vitiated consent, then ask whether annulment, ratification, or restitution is the remedy.",
    unenforceable: "Look for authority, Statute of Frauds style writing issues, or both parties lacking capacity.",
    void: "Treat the agreement as producing no valid obligation; focus on illegality, impossible object, or prohibited cause.",
} as const;

type ContractStatus = keyof typeof FLOW_GUIDE;

export default function ObligationsContractsFlowPage() {
    const [status, setStatus] = useState<ContractStatus>("valid");
    const [facts, setFacts] = useState("Delivery obligation with late performance and possible damages.");

    const result = useMemo(() => {
        const remedy =
            status === "valid"
                ? "Performance, damages, rescission, or specific relief depending on breach facts."
                : status === "voidable"
                  ? "Annulment or ratification analysis."
                  : status === "unenforceable"
                    ? "Ratification or written evidence issue before enforcement."
                    : "No enforcement of the void agreement; restitution may need separate analysis.";

        return { remedy, guide: FLOW_GUIDE[status] };
    }, [status]);

    return (
        <CalculatorPageLayout
            badge="RFBT"
            title="Obligations and Contracts Issue Flow"
            description="Classify obligation and contract facts into validity, breach, and remedy checkpoints for RFBT review problems."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <label className="app-label mb-2 block" htmlFor="contract-facts">Case facts</label>
                        <textarea id="contract-facts" value={facts} onChange={(event) => setFacts(event.target.value)} className="app-field min-h-28 w-full rounded-[1rem] px-3.5 py-2.5 outline-none" />
                    </SectionCard>
                    <SectionCard>
                        <p className="app-card-title text-sm">Contract classification</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {(Object.keys(FLOW_GUIDE) as ContractStatus[]).map((key) => (
                                <button key={key} type="button" onClick={() => setStatus(key)} className={["rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize", status === key ? "app-button-primary" : "app-button-ghost"].join(" ")}>
                                    {key}
                                </button>
                            ))}
                        </div>
                    </SectionCard>
                </div>
            }
            resultSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-section-kicker text-[0.68rem]">Issue flow</p>
                        <h2 className="app-section-title mt-2 capitalize">{status} contract path</h2>
                        <p className="app-body-md mt-3 text-sm">{result.guide}</p>
                    </SectionCard>
                    <SectionCard>
                        <p className="app-card-title text-sm">Likely remedy frame</p>
                        <p className="app-body-md mt-2 text-sm">{result.remedy}</p>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <RelatedLinksPanel
                    title="RFBT next steps"
                    summary="Use the broader law workspaces when the issue expands into securities, credit transactions, or corporate consequences."
                    badge="2 routes"
                    items={[
                        { path: "/rfbt/business-law-review", label: "Business Law Review", description: "Use for obligations, contracts, partnership, and corporation-law review." },
                        { path: "/rfbt/commercial-transactions-reviewer", label: "Commercial Transactions Reviewer", description: "Use for sales, credit, security contracts, securities, IP, and rehabilitation issues." },
                    ]}
                    showDescriptions
                />
            }
        />
    );
}
