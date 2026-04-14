import { useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import SectionCard from "../../components/SectionCard";

export default function IntegrativeCaseMapperPage() {
    const [focus, setFocus] = useState("Board review integration");

    return (
        <CalculatorPageLayout
            badge="Strategic & Integrative"
            title="Integrative Case Mapper"
            description="Map mixed-topic cases into FAR, AFAR, cost, audit, tax, law, governance, and AIS follow-up tracks before solving in detail."
            inputSection={
                <SectionCard>
                    <label className="app-label mb-2 block" htmlFor="integrative-focus">
                        Case focus
                    </label>
                    <input
                        id="integrative-focus"
                        value={focus}
                        onChange={(event) => setFocus(event.target.value)}
                        className="app-field w-full rounded-[1rem] px-3.5 py-2.5 text-[0.95rem] outline-none"
                    />
                </SectionCard>
            }
            resultSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-section-kicker text-[0.68rem]">Strategic review</p>
                        <h2 className="app-section-title mt-2">Case map for {focus}</h2>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {[
                                "FAR: identify recognition, measurement, and reporting issues first.",
                                "AFAR: check consolidation, partnership, branch, or foreign-currency angles.",
                                "Managerial: isolate cost behavior, planning, pricing, or performance-control decisions.",
                                "Audit: identify risk, evidence, assertions, and report implications.",
                                "Tax: separate book income from taxable effects and compliance consequences.",
                                "Law and governance: check rights, duties, governance, and ethical escalation.",
                            ].map((item) => (
                                <div key={item} className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                    <p className="app-body-md text-sm">{item}</p>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">Board-review prompts</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                            <li>What is the primary issue and what secondary topics are embedded in the facts?</li>
                            <li>Which calculator or worksheet can handle the quantitative part cleanly?</li>
                            <li>Which lesson should be reviewed before finalizing the answer?</li>
                            <li>What common trap could cause an otherwise correct computation to be interpreted wrongly?</li>
                        </ul>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <SectionCard>
                    <p className="app-card-title text-sm">Why integrative mapping matters</p>
                    <p className="app-body-md mt-2 text-sm">
                        Many capstone and board-review cases fail because the solver jumps straight into one
                        familiar formula. This page slows the process down just enough to map the case
                        properly before routing into the more specialized AccCalc tools.
                    </p>
                </SectionCard>
            }
        />
    );
}
