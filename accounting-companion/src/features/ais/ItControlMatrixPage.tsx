import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import SectionCard from "../../components/SectionCard";

type Rating = "low" | "moderate" | "high";

const RATING_SCORE: Record<Rating, number> = {
    low: 1,
    moderate: 2,
    high: 3,
};

export default function ItControlMatrixPage() {
    const [processName, setProcessName] = useState("Revenue and collections");
    const [governanceStrength, setGovernanceStrength] = useState<Rating>("moderate");
    const [accessControlStrength, setAccessControlStrength] = useState<Rating>("moderate");
    const [changeManagementStrength, setChangeManagementStrength] = useState<Rating>("moderate");
    const [backupRecoveryStrength, setBackupRecoveryStrength] = useState<Rating>("moderate");

    const result = useMemo(() => {
        const averageStrength =
            (RATING_SCORE[governanceStrength] +
                RATING_SCORE[accessControlStrength] +
                RATING_SCORE[changeManagementStrength] +
                RATING_SCORE[backupRecoveryStrength]) /
            4;

        const reliance =
            averageStrength >= 2.6
                ? "Stronger ITGC environment"
                : averageStrength >= 1.8
                  ? "Mixed control environment"
                  : "Weak ITGC environment";

        const nextAuditMove =
            averageStrength >= 2.6
                ? "Document the control design and test whether operation matches the intended design."
                : averageStrength >= 1.8
                  ? "Expand walkthroughs, test key controls selectively, and plan stronger substantive backup procedures."
                  : "Assume lower control reliance unless evidence improves; strengthen substantive response and exception follow-up.";

        return {
            averageStrength,
            reliance,
            nextAuditMove,
        };
    }, [
        accessControlStrength,
        backupRecoveryStrength,
        changeManagementStrength,
        governanceStrength,
    ]);

    const controlSections = [
        [
            "IT Governance and policy discipline",
            governanceStrength,
            setGovernanceStrength,
            "Policies, ownership, standards, and oversight structure.",
        ],
        [
            "Logical access controls",
            accessControlStrength,
            setAccessControlStrength,
            "User provisioning, privileged access, segregation, and review.",
        ],
        [
            "Program change management",
            changeManagementStrength,
            setChangeManagementStrength,
            "Authorization, testing, migration, and version control.",
        ],
        [
            "Backup, recovery, and continuity",
            backupRecoveryStrength,
            setBackupRecoveryStrength,
            "Resilience, recovery readiness, and continuity discipline.",
        ],
    ] as const;

    return (
        <CalculatorPageLayout
            badge="AIS & IT Controls"
            title="IT Control Matrix"
            description="Review IT governance, access, change management, and continuity controls in one structured AIS and IT-audit workspace."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <label className="app-label mb-2 block" htmlFor="process-name">
                            Process or system in review
                        </label>
                        <input
                            id="process-name"
                            value={processName}
                            onChange={(event) => setProcessName(event.target.value)}
                            className="app-field w-full rounded-[1rem] px-3.5 py-2.5 text-[0.95rem] outline-none"
                        />
                    </SectionCard>

                    {controlSections.map(([label, value, setter, helper]) => (
                        <SectionCard key={label}>
                            <p className="app-card-title text-sm">{label}</p>
                            <p className="app-helper mt-1 text-xs leading-5">{helper}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {(["low", "moderate", "high"] as Rating[]).map((rating) => (
                                    <button
                                        key={rating}
                                        type="button"
                                        onClick={() => setter(rating)}
                                        className={[
                                            "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize",
                                            value === rating
                                                ? "app-button-primary"
                                                : "app-button-ghost",
                                        ].join(" ")}
                                    >
                                        {rating}
                                    </button>
                                ))}
                            </div>
                        </SectionCard>
                    ))}
                </div>
            }
            resultSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-section-kicker text-[0.68rem]">AIS / IT controls</p>
                        <h2 className="app-section-title mt-2">Control reliance snapshot</h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                {processName}
                            </span>
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                {result.reliance}
                            </span>
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                Average strength {result.averageStrength.toFixed(2)} / 3.00
                            </span>
                        </div>
                        <p className="app-body-md mt-4 text-sm">{result.nextAuditMove}</p>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">Documentation prompts</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                            <li>Document the system boundary, key applications, and interface dependencies.</li>
                            <li>Identify whether the risk is primarily governance, access, change, operations, or recovery related.</li>
                            <li>State what evidence would support reliance and what exceptions would weaken it.</li>
                            <li>Link the IT control conclusion back to financial reporting assertions and audit procedures.</li>
                        </ul>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-card-title text-sm">How to use this workspace</p>
                        <p className="app-body-md mt-2 text-sm">
                            This page is intentionally reviewer-oriented rather than purely numeric.
                            Use it to turn AIS and IT-audit readings into a structured control narrative,
                            then follow that narrative into audit documentation or Study Hub review.
                        </p>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">Key control families</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                            <li>IT governance defines accountability, policy discipline, and escalation paths.</li>
                            <li>Logical access controls protect system use, data change, and privileged activity.</li>
                            <li>Change management reduces the risk of unauthorized or untested production changes.</li>
                            <li>Continuity and recovery controls protect resilience when systems fail or are disrupted.</li>
                        </ul>
                    </SectionCard>
                </div>
            }
        />
    );
}
