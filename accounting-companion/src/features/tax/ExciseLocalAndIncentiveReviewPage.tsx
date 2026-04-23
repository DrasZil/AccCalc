import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import SectionCard from "../../components/SectionCard";

const REVIEW_LANES = {
    excise: {
        title: "Excise tax framing",
        points: [
            "Check whether the product or activity is actually inside an excise regime before looking for a rate.",
            "Separate quantity, value, and timing triggers because excise questions often hide which base applies.",
            "Keep classroom assumptions explicit when the case uses simplified rates or product classifications.",
        ],
    },
    local: {
        title: "Local taxation review",
        points: [
            "Identify the local unit, taxing power, and business activity before computing anything.",
            "Separate permit, fee, and tax language because local-government questions often test classification first.",
            "Check whether situs and business-location facts change the likely local-tax exposure.",
        ],
    },
    incentives: {
        title: "Incentive and treaty review",
        points: [
            "Confirm the incentive regime or treaty basis before assuming a preferential rate.",
            "Separate eligibility, registration, and documentary support from the arithmetic effect.",
            "State clearly when the app is acting as a study helper and not as legal filing advice.",
        ],
    },
    remedies: {
        title: "Compliance, ethics, and remedies",
        points: [
            "Separate compliance posture from remedy options so the issue does not collapse into rate math.",
            "Keep tax avoidance, tax evasion, and ethical planning distinct in the explanation.",
            "End with the likely authority, remedy path, or documentation focus rather than only the tax amount.",
        ],
    },
} as const;

type ReviewLaneKey = keyof typeof REVIEW_LANES;

export default function ExciseLocalAndIncentiveReviewPage() {
    const [lane, setLane] = useState<ReviewLaneKey>("excise");
    const content = useMemo(() => REVIEW_LANES[lane], [lane]);

    return (
        <CalculatorPageLayout
            badge="Taxation"
            title="Excise, Local Tax, and Incentive Review"
            description="Use a structured tax-review lane for excise, local taxation, incentive regimes, treaty logic, and remedy framing when the issue is more about classification and compliance than one isolated computation."
            inputSection={
                <SectionCard>
                    <p className="app-card-title text-sm">Choose a tax review lane</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {(Object.keys(REVIEW_LANES) as ReviewLaneKey[]).map((key) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setLane(key)}
                                className={[
                                    "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize",
                                    lane === key ? "app-button-primary" : "app-button-ghost",
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
                        <p className="app-section-kicker text-[0.68rem]">Tax review</p>
                        <h2 className="app-section-title mt-2">{content.title}</h2>
                        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
                            {content.points.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ol>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">Assumption discipline</p>
                        <p className="app-body-md mt-2 text-sm">
                            This workspace is intentionally review-first. If a case needs a
                            specific rate, threshold, or statutory treatment, keep the governing
                            assumption visible instead of treating the app as hidden authority.
                        </p>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <SectionCard>
                    <p className="app-card-title text-sm">Good next move</p>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                        <li>Open VAT or withholding tools if the fact pattern becomes a direct business-tax computation.</li>
                        <li>Stay in review mode if the main issue is classification, compliance, or remedy framing.</li>
                        <li>Use the Study Hub tax lessons when the case mixes ethics, legal basis, and accounting-vs-tax difference signals.</li>
                    </ul>
                </SectionCard>
            }
        />
    );
}
