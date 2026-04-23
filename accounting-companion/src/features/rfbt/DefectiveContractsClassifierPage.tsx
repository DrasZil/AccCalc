import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import SectionCard from "../../components/SectionCard";

type ContractDefect = "valid" | "voidable" | "unenforceable" | "void" | "rescissible";

const DEFECT_GUIDE: Record<
    ContractDefect,
    {
        label: string;
        focus: string;
        remedy: string;
        trustNote: string;
    }
> = {
    valid: {
        label: "Valid",
        focus: "Elements exist and enforcement is generally available.",
        remedy: "Focus on breach, performance, damages, or rescission only if later facts justify it.",
        trustNote: "Do not overclassify a normal breach problem as a defective-contract issue.",
    },
    voidable: {
        label: "Voidable",
        focus: "Capacity or vitiated-consent issues may permit annulment unless ratified.",
        remedy: "Check whether annulment, ratification, restitution, or damages is the better frame.",
        trustNote: "Ask whether the aggrieved party can still ratify before concluding the contract is unusable.",
    },
    unenforceable: {
        label: "Unenforceable",
        focus: "The agreement may exist but cannot yet be enforced because of authority, writing, or capacity issues.",
        remedy: "Look for ratification, written evidence, or authority correction before treating the problem as void.",
        trustNote: "Unenforceable is not automatically void. The main question is enforceability, not existence.",
    },
    void: {
        label: "Void",
        focus: "No valid contractual effect because the cause, object, or legality requirement fundamentally fails.",
        remedy: "State that enforcement is unavailable and shift the analysis to restitution or separate liability if needed.",
        trustNote: "A void contract does not become valid through simple ratification.",
    },
    rescissible: {
        label: "Rescissible",
        focus: "The contract may be valid but prejudicial to parties who need rescission relief.",
        remedy: "Check economic prejudice, subsidiary character of rescission, and available legal alternatives.",
        trustNote: "Rescission is usually a remedy of last resort, not the first answer.",
    },
};

export default function DefectiveContractsClassifierPage() {
    const [defectType, setDefectType] = useState<ContractDefect>("voidable");
    const [factPattern, setFactPattern] = useState(
        "A party alleges consent was obtained through intimidation and now wants to avoid enforcement."
    );
    const [hasRatificationRisk, setHasRatificationRisk] = useState(true);
    const [hasWritingGap, setHasWritingGap] = useState(false);

    const result = useMemo(() => {
        const base = DEFECT_GUIDE[defectType];
        const emphasis = [
            hasRatificationRisk && defectType === "voidable"
                ? "Check whether later conduct amounts to ratification."
                : null,
            hasWritingGap && defectType === "unenforceable"
                ? "The writing or authority issue is central to enforceability."
                : null,
            defectType === "void"
                ? "Keep illegality or impossible object analysis visible."
                : null,
        ]
            .filter((item): item is string => Boolean(item))
            .join(" ");

        return {
            ...base,
            emphasis:
                emphasis ||
                "Start with classification before discussing damages, performance, or corporate consequences.",
        };
    }, [defectType, hasRatificationRisk, hasWritingGap]);

    return (
        <CalculatorPageLayout
            badge="RFBT"
            title="Defective Contracts Classifier"
            description="Classify defective-contract scenarios, keep remedy logic visible, and prevent students from confusing void, voidable, unenforceable, and rescissible cases."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <label className="app-label mb-2 block" htmlFor="defective-contract-facts">
                            Fact pattern
                        </label>
                        <textarea
                            id="defective-contract-facts"
                            value={factPattern}
                            onChange={(event) => setFactPattern(event.target.value)}
                            className="app-field min-h-28 w-full rounded-[1rem] px-3.5 py-2.5 outline-none"
                        />
                    </SectionCard>
                    <SectionCard>
                        <p className="app-card-title text-sm">Primary classification</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {(Object.keys(DEFECT_GUIDE) as ContractDefect[]).map((key) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setDefectType(key)}
                                    className={[
                                        "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize",
                                        defectType === key ? "app-button-primary" : "app-button-ghost",
                                    ].join(" ")}
                                >
                                    {DEFECT_GUIDE[key].label}
                                </button>
                            ))}
                        </div>
                    </SectionCard>
                    <SectionCard>
                        <div className="grid gap-3 md:grid-cols-2">
                            <label className="flex items-start gap-3 rounded-[1rem] border border-[color:var(--app-border)] px-3.5 py-3 text-sm">
                                <input
                                    type="checkbox"
                                    checked={hasRatificationRisk}
                                    onChange={(event) => setHasRatificationRisk(event.target.checked)}
                                    className="mt-1"
                                />
                                <span>Possible ratification or later confirming act</span>
                            </label>
                            <label className="flex items-start gap-3 rounded-[1rem] border border-[color:var(--app-border)] px-3.5 py-3 text-sm">
                                <input
                                    type="checkbox"
                                    checked={hasWritingGap}
                                    onChange={(event) => setHasWritingGap(event.target.checked)}
                                    className="mt-1"
                                />
                                <span>Possible writing, authority, or enforceability gap</span>
                            </label>
                        </div>
                    </SectionCard>
                </div>
            }
            resultSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-section-kicker text-[0.68rem]">Contract classification</p>
                        <h2 className="app-section-title mt-2">{result.label} path</h2>
                        <p className="app-body-md mt-3 text-sm">{result.focus}</p>
                        <p className="app-body-md mt-3 text-sm">{result.emphasis}</p>
                    </SectionCard>
                    <SectionCard>
                        <p className="app-card-title text-sm">Remedy frame</p>
                        <p className="app-body-md mt-2 text-sm">{result.remedy}</p>
                        <p className="app-helper mt-3 text-xs">{result.trustNote}</p>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <RelatedLinksPanel
                    title="RFBT next routes"
                    summary="Use the broader issue-flow and reviewer pages when the contract problem expands into obligations, damages, securities, or corporate-law consequences."
                    badge="3 routes"
                    items={[
                        {
                            path: "/rfbt/obligations-contracts-flow",
                            label: "Obligations and Contracts Issue Flow",
                            description:
                                "Use for validity, breach, damages, and remedy checkpoints in mixed obligations cases.",
                        },
                        {
                            path: "/rfbt/business-law-review",
                            label: "Business Law Review Workspace",
                            description:
                                "Use for broader issue spotting across obligations, contracts, partnership, and corporation law.",
                        },
                        {
                            path: "/study/topics/rfbt-defective-contracts-remedies-and-enforcement",
                            label: "Defective contracts lesson module",
                            description:
                                "Open the Study Hub lesson for defect classes, rescission, annulment, and remedy caution points.",
                        },
                    ]}
                    showDescriptions
                />
            }
        />
    );
}
