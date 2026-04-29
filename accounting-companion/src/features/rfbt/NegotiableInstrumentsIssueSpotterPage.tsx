import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import RelatedLinksPanel from "../../components/RelatedLinksPanel";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";

type HolderStatus = "ordinary" | "possible-hdc" | "not-hdc";
type DefectType = "none" | "personal-defense" | "real-defense" | "overdue-or-notice";
type PartyType = "maker" | "drawer" | "indorser" | "acceptor";
type DishonorStep = "not-yet" | "presented-dishonored" | "notice-given";

const HOLDER_LABEL: Record<HolderStatus, string> = {
    ordinary: "Ordinary holder",
    "possible-hdc": "Possible holder in due course",
    "not-hdc": "Not holder in due course",
};

const DEFECT_LABEL: Record<DefectType, string> = {
    none: "No known defense",
    "personal-defense": "Personal defense",
    "real-defense": "Real defense",
    "overdue-or-notice": "Overdue or notice problem",
};

const PARTY_LABEL: Record<PartyType, string> = {
    maker: "Maker",
    drawer: "Drawer",
    indorser: "Indorser",
    acceptor: "Acceptor",
};

export default function NegotiableInstrumentsIssueSpotterPage() {
    const [holderStatus, setHolderStatus] = useState<HolderStatus>("possible-hdc");
    const [defectType, setDefectType] = useState<DefectType>("personal-defense");
    const [partyType, setPartyType] = useState<PartyType>("indorser");
    const [dishonorStep, setDishonorStep] = useState<DishonorStep>("presented-dishonored");
    const [facts, setFacts] = useState(
        "Holder took the note for value before maturity, but the maker alleges failure of consideration."
    );

    const result = useMemo(() => {
        const hdcProtected = holderStatus === "possible-hdc" && defectType === "personal-defense";
        const blockedByRealDefense = defectType === "real-defense";
        const secondaryParty = partyType === "drawer" || partyType === "indorser";
        const noticeNeeded = secondaryParty && dishonorStep !== "notice-given";
        const enforcementPosture = blockedByRealDefense
            ? "Weak: a real defense can defeat even holder-in-due-course style protection."
            : hdcProtected
              ? "Strong if holder-in-due-course elements are proven and no real defense appears."
              : holderStatus === "not-hdc" || defectType === "overdue-or-notice"
                ? "Limited: ordinary-holder defenses or notice problems need closer review."
                : "Moderate: enforceability depends on transfer, delivery, defenses, and party liability facts.";
        const liabilityFocus = secondaryParty
            ? "Secondary liability depends on presentment, dishonor, notice, and any valid excuse."
            : "Primary liability focuses on the instrument terms and available defenses.";
        const nextStep = noticeNeeded
            ? "Document presentment, dishonor, and notice before concluding against a secondary party."
            : blockedByRealDefense
              ? "Identify whether the asserted defense is truly real, such as forgery, fraud in factum, material alteration, incapacity, illegality, discharge, or similar classroom categories."
              : "Confirm holder status, value, good faith, notice, maturity, and chain of transfer.";

        return {
            enforcementPosture,
            liabilityFocus,
            nextStep,
            hdcProtected,
            noticeNeeded,
        };
    }, [defectType, dishonorStep, holderStatus, partyType]);

    return (
        <CalculatorPageLayout
            badge="RFBT | Commercial Law"
            title="Negotiable Instruments Issue Spotter"
            description="Classify holder status, defenses, party liability, dishonor, and notice issues for commercial-law review without pretending legal classification is just arithmetic."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <label className="app-label mb-2 block" htmlFor="ni-facts">
                            Case facts
                        </label>
                        <textarea
                            id="ni-facts"
                            value={facts}
                            onChange={(event) => setFacts(event.target.value)}
                            className="app-field min-h-28 w-full rounded-[1rem] px-3.5 py-2.5 outline-none"
                        />
                    </SectionCard>
                    <SectionCard>
                        <div className="grid gap-4 md:grid-cols-2">
                            <OptionGroup
                                title="Holder posture"
                                options={Object.keys(HOLDER_LABEL) as HolderStatus[]}
                                labels={HOLDER_LABEL}
                                value={holderStatus}
                                onChange={setHolderStatus}
                            />
                            <OptionGroup
                                title="Defense or defect"
                                options={Object.keys(DEFECT_LABEL) as DefectType[]}
                                labels={DEFECT_LABEL}
                                value={defectType}
                                onChange={setDefectType}
                            />
                            <OptionGroup
                                title="Party being analyzed"
                                options={Object.keys(PARTY_LABEL) as PartyType[]}
                                labels={PARTY_LABEL}
                                value={partyType}
                                onChange={setPartyType}
                            />
                            <div>
                                <p className="app-card-title text-sm">Dishonor status</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {([
                                        ["not-yet", "Not yet presented"],
                                        ["presented-dishonored", "Dishonored"],
                                        ["notice-given", "Notice given"],
                                    ] as Array<[DishonorStep, string]>).map(([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setDishonorStep(value)}
                                            className={[
                                                "rounded-full px-3 py-1.5 text-xs font-semibold",
                                                dishonorStep === value ? "app-button-primary" : "app-button-ghost",
                                            ].join(" ")}
                                        >
                                            {label}
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
                    <ResultGrid columns={3}>
                        <ResultCard
                            title="HDC Shield"
                            value={result.hdcProtected ? "Likely Relevant" : "Not Enough"}
                            tone={result.hdcProtected ? "success" : "default"}
                        />
                        <ResultCard
                            title="Notice Issue"
                            value={result.noticeNeeded ? "Check Notice" : "Not Primary"}
                            tone={result.noticeNeeded ? "warning" : "default"}
                        />
                        <ResultCard title="Party Focus" value={PARTY_LABEL[partyType]} tone="accent" />
                    </ResultGrid>
                    <SectionCard>
                        <p className="app-card-title text-sm">Enforcement posture</p>
                        <p className="app-body-md mt-2 text-sm">{result.enforcementPosture}</p>
                    </SectionCard>
                    <SectionCard>
                        <p className="app-card-title text-sm">Liability focus</p>
                        <p className="app-body-md mt-2 text-sm">{result.liabilityFocus}</p>
                        <p className="app-helper mt-3 text-xs">{result.nextStep}</p>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <RelatedLinksPanel
                    title="RFBT review loop"
                    summary="Move from negotiable-instrument issue spotting into broader commercial-law and obligation analysis."
                    badge="3 routes"
                    items={[
                        {
                            path: "/rfbt/commercial-transactions-reviewer",
                            label: "Commercial Transactions Reviewer",
                            description: "Review sales, credit transactions, securities, and special commercial topics.",
                        },
                        {
                            path: "/rfbt/obligations-contracts-flow",
                            label: "Obligations and Contracts Issue Flow",
                            description: "Use when the same case turns on obligation, breach, or remedy logic.",
                        },
                        {
                            path: "/study/practice",
                            label: "Practice Hub",
                            description: "Take linked RFBT checks after classifying the issue.",
                        },
                    ]}
                    showDescriptions
                />
            }
        />
    );
}

function OptionGroup<T extends string>({
    title,
    options,
    labels,
    value,
    onChange,
}: {
    title: string;
    options: T[];
    labels: Record<T, string>;
    value: T;
    onChange: (next: T) => void;
}) {
    return (
        <div>
            <p className="app-card-title text-sm">{title}</p>
            <div className="mt-3 flex flex-wrap gap-2">
                {options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onChange(option)}
                        className={[
                            "rounded-full px-3 py-1.5 text-xs font-semibold",
                            value === option ? "app-button-primary" : "app-button-ghost",
                        ].join(" ")}
                    >
                        {labels[option]}
                    </button>
                ))}
            </div>
        </div>
    );
}
