import { useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import SectionCard from "../../components/SectionCard";

const TOPIC_GUIDES = {
    obligations: [
        "Identify the source of the obligation and the parties involved.",
        "Check whether performance, delay, or breach is the central issue.",
        "Separate remedies, damages, and extinguishment questions clearly.",
    ],
    contracts: [
        "Confirm consent, object, and cause before going deeper.",
        "Check if the issue is enforceability, interpretation, or breach.",
        "Classify whether the contract is valid, voidable, unenforceable, or void.",
    ],
    corporation: [
        "Identify whether the issue is formation, governance, rights, or dissolution.",
        "Separate board powers, shareholder rights, and officer authority.",
        "Check if the case turns on corporate formalities, fiduciary duties, or statutory compliance.",
    ],
} as const;

type TopicKey = keyof typeof TOPIC_GUIDES;

export default function BusinessLawReviewPage() {
    const [topic, setTopic] = useState<TopicKey>("contracts");

    return (
        <CalculatorPageLayout
            badge="RFBT & Law"
            title="Business Law Review Workspace"
            description="Use a structured issue-spotting page for obligations, contracts, and corporation-law style review questions."
            inputSection={
                <SectionCard>
                    <p className="app-card-title text-sm">Choose a law track</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {Object.keys(TOPIC_GUIDES).map((key) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setTopic(key as TopicKey)}
                                className={[
                                    "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize",
                                    topic === key ? "app-button-primary" : "app-button-ghost",
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
                        <p className="app-section-kicker text-[0.68rem]">RFBT review</p>
                        <h2 className="app-section-title mt-2">Issue-spotting sequence</h2>
                        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
                            {TOPIC_GUIDES[topic].map((step) => (
                                <li key={step}>{step}</li>
                            ))}
                        </ol>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">What to write next</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                            <li>State the governing rule in plain language before citing effects or remedies.</li>
                            <li>Apply the facts directly to the legal elements instead of summarizing the story only.</li>
                            <li>Finish with the consequence: validity, liability, remedy, or governance outcome.</li>
                        </ul>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <SectionCard>
                    <p className="app-card-title text-sm">Why this page exists</p>
                    <p className="app-body-md mt-2 text-sm">
                        RFBT problems often do not need arithmetic, but they still need structure. This page
                        keeps the app useful for business-law study by turning legal questions into a clean
                        reviewer sequence instead of leaving them outside the platform.
                    </p>
                </SectionCard>
            }
        />
    );
}
