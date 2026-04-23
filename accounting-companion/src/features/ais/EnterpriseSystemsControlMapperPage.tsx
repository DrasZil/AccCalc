import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import SectionCard from "../../components/SectionCard";

type Strength = "low" | "moderate" | "high";

const SCORE: Record<Strength, number> = {
    low: 1,
    moderate: 2,
    high: 3,
};

const SYSTEM_GUIDANCE = {
    ERP: "Integrated ERP environments need strong master-data, change, interface, and segregation controls because one weak point can spread across modules.",
    SCM: "Supply-chain platforms need order, inventory, vendor, and logistics controls so operational speed does not outrun reporting reliability.",
    CRM: "CRM environments need customer-data integrity, pricing approval, revenue-interface, and access controls so front-end speed does not distort revenue data.",
    BI: "Analytics and BI layers need source-to-report traceability, approved transformations, and report governance so dashboards do not become unsupported evidence.",
} as const;

type SystemKey = keyof typeof SYSTEM_GUIDANCE;

export default function EnterpriseSystemsControlMapperPage() {
    const [system, setSystem] = useState<SystemKey>("ERP");
    const [accessStrength, setAccessStrength] = useState<Strength>("moderate");
    const [changeStrength, setChangeStrength] = useState<Strength>("moderate");
    const [interfaceStrength, setInterfaceStrength] = useState<Strength>("moderate");
    const [documentationStrength, setDocumentationStrength] = useState<Strength>("moderate");

    const result = useMemo(() => {
        const average =
            (SCORE[accessStrength] +
                SCORE[changeStrength] +
                SCORE[interfaceStrength] +
                SCORE[documentationStrength]) /
            4;

        return {
            average,
            label:
                average >= 2.6
                    ? "More reliable systems-control environment"
                    : average >= 1.8
                      ? "Mixed systems-control environment"
                      : "Control design needs reinforcement",
            nextStep:
                average >= 2.6
                    ? "Document system boundaries, confirm that the controls actually operate, and tie the control story back to reporting assertions or operational decisions."
                    : average >= 1.8
                      ? "Clarify the weak layer first, then decide whether compensating controls and additional audit work can close the gap."
                      : "Treat the environment as high-risk until access, change, interface, or documentation weaknesses are addressed explicitly.",
        };
    }, [accessStrength, changeStrength, documentationStrength, interfaceStrength]);

    const ratingGroups = [
        ["Access and authorization", accessStrength, setAccessStrength],
        ["Change and release discipline", changeStrength, setChangeStrength],
        ["Interfaces and data movement", interfaceStrength, setInterfaceStrength],
        ["Documentation and traceability", documentationStrength, setDocumentationStrength],
    ] as const;

    return (
        <CalculatorPageLayout
            badge="AIS & IT Controls"
            title="Enterprise Systems and Control Mapper"
            description="Review ERP, SCM, CRM, and analytics environments through access, change, interface, and documentation controls so AIS coverage reaches real enterprise-system topics instead of stopping at generic ITGC language."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-card-title text-sm">System family</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {(Object.keys(SYSTEM_GUIDANCE) as SystemKey[]).map((key) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setSystem(key)}
                                    className={[
                                        "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                                        system === key ? "app-button-primary" : "app-button-ghost",
                                    ].join(" ")}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>
                    </SectionCard>

                    {ratingGroups.map(([label, value, setter]) => (
                        <SectionCard key={label}>
                            <p className="app-card-title text-sm">{label}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {(["low", "moderate", "high"] as Strength[]).map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setter(level)}
                                        className={[
                                            "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize",
                                            value === level ? "app-button-primary" : "app-button-ghost",
                                        ].join(" ")}
                                    >
                                        {level}
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
                        <p className="app-section-kicker text-[0.68rem]">AIS and enterprise systems</p>
                        <h2 className="app-section-title mt-2">{result.label}</h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                {system}
                            </span>
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                Average strength {result.average.toFixed(2)} / 3.00
                            </span>
                        </div>
                        <p className="app-body-md mt-4 text-sm">{SYSTEM_GUIDANCE[system]}</p>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">Next-step prompt</p>
                        <p className="app-body-md mt-2 text-sm">{result.nextStep}</p>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <SectionCard>
                    <p className="app-card-title text-sm">Why this fills a curriculum gap</p>
                    <p className="app-body-md mt-2 text-sm">
                        BSAIS and IT-audit syllabi often move beyond generic controls into ERP,
                        SCM, CRM, BI, documentation, and systems life-cycle consequences. This page
                        keeps those enterprise-system topics inside the same control-review flow as
                        the rest of the app.
                    </p>
                </SectionCard>
            }
        />
    );
}
