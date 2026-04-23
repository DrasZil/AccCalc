import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import SectionCard from "../../components/SectionCard";

const REVIEW_TRACKS = {
    securities: [
        "Start with the security, offering, or market-conduct issue before discussing penalties or disclosure details.",
        "Separate issuance compliance from secondary-market conduct such as fraud, manipulation, or insider trading.",
        "Finish with the likely regulatory consequence or governance concern instead of restating the facts only.",
    ],
    governance: [
        "Identify which governance body or fiduciary duty is actually under pressure in the case.",
        "Separate board oversight, management action, and shareholder rights before applying consequences.",
        "Check whether the issue is disclosure, duty, authority, or abuse of control.",
    ],
    restructuring: [
        "Distinguish merger, consolidation, rehabilitation, and liquidation because the legal effects are not interchangeable.",
        "State which rights, obligations, or claims survive the restructuring path chosen.",
        "End with the consequence to the corporation, investors, and creditors.",
    ],
} as const;

type ReviewTrackKey = keyof typeof REVIEW_TRACKS;

export default function SecuritiesGovernanceReviewPage() {
    const [track, setTrack] = useState<ReviewTrackKey>("securities");
    const steps = useMemo(() => REVIEW_TRACKS[track], [track]);

    return (
        <CalculatorPageLayout
            badge="RFBT & Law"
            title="Securities and Corporate Governance Review"
            description="Use a structured reviewer path for securities regulation, governance duties, insider-trading and market-conduct issues, and corporate restructuring consequences."
            inputSection={
                <SectionCard>
                    <p className="app-card-title text-sm">Choose the RFBT lane</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {(Object.keys(REVIEW_TRACKS) as ReviewTrackKey[]).map((key) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setTrack(key)}
                                className={[
                                    "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize",
                                    track === key ? "app-button-primary" : "app-button-ghost",
                                ].join(" ")}
                            >
                                {key}
                            </button>
                        ))}
                    </div>
                </SectionCard>
            }
            resultSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-section-kicker text-[0.68rem]">RFBT reviewer</p>
                        <h2 className="app-section-title mt-2">Issue-spotting sequence</h2>
                        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
                            {steps.map((step) => (
                                <li key={step}>{step}</li>
                            ))}
                        </ol>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">What a strong answer sounds like</p>
                        <p className="app-body-md mt-2 text-sm">
                            It names the controlling issue, applies the correct legal frame, and
                            states the practical corporate or market consequence without turning the
                            answer into a long story retell.
                        </p>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <SectionCard>
                    <p className="app-card-title text-sm">Related legal support</p>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                        <li>Use the Business Law Review Workspace for obligations, contracts, and baseline corporation-law structure.</li>
                        <li>Use the Commercial Transactions Reviewer for sales, credit, security contracts, procurement, rehabilitation, and IP follow-up.</li>
                        <li>Use governance routes if the case becomes more about control environment and ethical oversight than legal classification.</li>
                    </ul>
                </SectionCard>
            }
        />
    );
}
