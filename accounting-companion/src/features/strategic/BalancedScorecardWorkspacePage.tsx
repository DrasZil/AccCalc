import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import SectionCard from "../../components/SectionCard";

export default function BalancedScorecardWorkspacePage() {
    const [strategicObjective, setStrategicObjective] = useState("Improve profitability without losing service quality");
    const [financialSignal, setFinancialSignal] = useState("Margin pressure");
    const [customerSignal, setCustomerSignal] = useState("Retention risk");
    const [processSignal, setProcessSignal] = useState("Cycle-time bottleneck");
    const [learningSignal, setLearningSignal] = useState("Capability gap");

    const result = useMemo(() => {
        const dominantSignals = [
            ["Financial", financialSignal],
            ["Customer", customerSignal],
            ["Internal process", processSignal],
            ["Learning and growth", learningSignal],
        ].filter(([, signal]) => signal.trim() !== "");

        const nextMove =
            dominantSignals.length >= 4
                ? "The case is integrated enough for a full balanced-scorecard read. Translate each perspective into one measure, one target, and one follow-up owner."
                : "The case still needs at least one signal in each perspective before the strategy story is balanced.";

        return { dominantSignals, nextMove };
    }, [customerSignal, financialSignal, learningSignal, processSignal]);

    const perspectiveRows = [
        ["Financial perspective", financialSignal, setFinancialSignal],
        ["Customer perspective", customerSignal, setCustomerSignal],
        ["Internal-process perspective", processSignal, setProcessSignal],
        ["Learning-and-growth perspective", learningSignal, setLearningSignal],
    ] as const;

    return (
        <CalculatorPageLayout
            badge="Strategic & Integrative"
            title="Balanced Scorecard Workspace"
            description="Map strategy into financial, customer, process, and learning signals so integrative accounting cases move beyond one ratio or variance and into a full performance story."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <label className="app-label mb-2 block" htmlFor="strategic-objective">
                            Strategic objective
                        </label>
                        <input
                            id="strategic-objective"
                            value={strategicObjective}
                            onChange={(event) => setStrategicObjective(event.target.value)}
                            className="app-field w-full rounded-[1rem] px-3.5 py-2.5 text-[0.95rem] outline-none"
                        />
                    </SectionCard>

                    {perspectiveRows.map(([label, value, setter]) => (
                        <SectionCard key={label}>
                            <label className="app-label mb-2 block">{label}</label>
                            <input
                                value={value}
                                onChange={(event) => setter(event.target.value)}
                                className="app-field w-full rounded-[1rem] px-3.5 py-2.5 text-[0.95rem] outline-none"
                            />
                        </SectionCard>
                    ))}
                </div>
            }
            resultSection={
                <div className="space-y-4">
                    <SectionCard>
                        <p className="app-section-kicker text-[0.68rem]">Strategic integration</p>
                        <h2 className="app-section-title mt-2">{strategicObjective}</h2>
                        <p className="app-body-md mt-4 text-sm">{result.nextMove}</p>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">Perspective map</p>
                        <div className="mt-3 space-y-3">
                            {result.dominantSignals.map(([label, signal]) => (
                                <div key={label} className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                    <p className="app-helper text-[0.68rem] uppercase tracking-[0.16em]">
                                        {label}
                                    </p>
                                    <p className="app-body-md mt-2 text-sm">{signal}</p>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <p className="app-card-title text-sm">Board-review prompts</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                            <li>Name one measure and one target for each perspective.</li>
                            <li>Explain which perspective is the lead signal and which perspective is only a lag indicator.</li>
                            <li>State what governance or control issue could still block the strategy even if the metrics improve.</li>
                        </ul>
                    </SectionCard>
                </div>
            }
            explanationSection={
                <SectionCard>
                    <p className="app-card-title text-sm">Why this matters</p>
                    <p className="app-body-md mt-2 text-sm">
                        Strategic and integrative subjects are often lesson-heavy and hard to route.
                        This workspace gives them a practical surface inside the app so strategy,
                        budgeting, performance, and governance can be read as one connected answer.
                    </p>
                </SectionCard>
            }
        />
    );
}
