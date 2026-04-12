import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import StudySupportPanel from "../../components/StudySupportPanel";
import { computeCapacityUtilization } from "../../utils/calculatorMath";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";
import { buildStudyQuizPath, buildStudyTopicPath } from "../study/studyContent";

function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

export default function CapacityUtilizationPage() {
    const [actualUnits, setActualUnits] = useState("");
    const [practicalCapacityUnits, setPracticalCapacityUnits] = useState("");

    useSmartSolverConnector(
        {
            actualUnits: setActualUnits,
            budgetedUnits: setPracticalCapacityUnits,
        },
        {
            normalizeValue: (key, value) =>
                key === "budgetedUnits" ? value : value,
        }
    );

    const result = useMemo(() => {
        if (actualUnits.trim() === "" || practicalCapacityUnits.trim() === "") {
            return null;
        }

        const actual = Number(actualUnits);
        const capacity = Number(practicalCapacityUnits);

        if (Number.isNaN(actual) || Number.isNaN(capacity)) {
            return { error: "Capacity inputs must be valid numbers." };
        }

        if (actual < 0 || capacity <= 0) {
            return {
                error: "Actual output cannot be negative, and practical capacity must be greater than zero.",
            };
        }

        return computeCapacityUtilization({
            actualUnits: actual,
            practicalCapacityUnits: capacity,
        });
    }, [actualUnits, practicalCapacityUnits]);

    return (
        <CalculatorPageLayout
            badge="Managerial & Cost / Operations"
            title="Capacity Utilization"
            description="Compare actual output with practical capacity so idle capacity, over-capacity pressure, and planning implications stay visible."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Actual Output Units"
                            value={actualUnits}
                            onChange={setActualUnits}
                            placeholder="8400"
                            helperText="Use actual units produced or serviced for the period."
                        />
                        <InputCard
                            label="Practical Capacity Units"
                            value={practicalCapacityUnits}
                            onChange={setPracticalCapacityUnits}
                            placeholder="10000"
                            helperText="Use practical or available operating capacity for the same period."
                        />
                    </InputGrid>
                </SectionCard>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="app-tone-warning">
                        <p className="app-card-title text-sm">Input notice</p>
                        <p className="app-body-md mt-2 text-sm">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={4}>
                        <ResultCard
                            title="Capacity Utilization"
                            value={formatPercent(result.utilizationRate)}
                            tone="accent"
                        />
                        <ResultCard
                            title="Idle Capacity Units"
                            value={result.idleCapacityUnits.toLocaleString()}
                        />
                        <ResultCard
                            title="Idle Capacity Rate"
                            value={formatPercent(result.idleCapacityRate)}
                        />
                        <ResultCard
                            title="Operating Read"
                            value={result.status}
                            supportingText="Use this as a planning signal, not as a standalone performance verdict."
                        />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <div className="space-y-4">
                        <FormulaCard
                            formula="Capacity utilization = Actual output / Practical capacity"
                            steps={[
                                `Capacity utilization = ${actualUnits} / ${practicalCapacityUnits} = ${formatPercent(result.utilizationRate)}.`,
                                `Idle capacity units = ${practicalCapacityUnits} - ${actualUnits} = ${result.idleCapacityUnits.toLocaleString()}.`,
                                `Idle capacity rate = 100% - ${formatPercent(result.utilizationRate)} = ${formatPercent(result.idleCapacityRate)}.`,
                            ]}
                            glossary={[
                                {
                                    term: "Practical capacity",
                                    meaning:
                                        "A realistic operating ceiling after allowing for normal downtime and unavoidable interruptions.",
                                },
                                {
                                    term: "Idle capacity",
                                    meaning:
                                        "Available operating capacity that the business did not use during the period.",
                                },
                            ]}
                            interpretation={`The operation is running at ${formatPercent(result.utilizationRate)} of practical capacity. Read that alongside demand, staffing, and cost structure before deciding whether the level is healthy, underused, or strained.`}
                            warnings={[
                                "A very high utilization rate can look efficient while still creating bottlenecks or service-quality pressure.",
                            ]}
                        />

                        <StudySupportPanel
                            topicId="operating-capacity-and-planning-review"
                            topicTitle="Operating Capacity and Planning Review"
                            intro="Use the connected lesson when you need to relate capacity utilization to flexible budgeting, demand planning, and operating control."
                            lessonPath={buildStudyTopicPath("operating-capacity-and-planning-review")}
                            quizPath={buildStudyQuizPath("operating-capacity-and-planning-review")}
                            relatedTools={[
                                {
                                    path: "/business/flexible-budget",
                                    label: "Flexible Budget",
                                },
                                {
                                    path: "/business/cash-budget",
                                    label: "Cash Budget",
                                },
                            ]}
                            sections={[
                                {
                                    key: "why-it-matters",
                                    label: "Why it matters",
                                    summary: "Capacity is one of the cleanest operating decision signals in the app.",
                                    content: (
                                        <p>
                                            Capacity utilization helps students explain whether low volume means
                                            unused resources, while very high volume may signal the need for
                                            staffing, scheduling, or budgeting adjustments.
                                        </p>
                                    ),
                                },
                                {
                                    key: "next-check",
                                    label: "What to review next",
                                    summary: "Capacity alone does not explain budget behavior.",
                                    emphasis: "support",
                                    content: (
                                        <p>
                                            Review flexible budgets next if the instructor wants activity
                                            variance, spending variance, or cost behavior interpretation after
                                            the utilization reading.
                                        </p>
                                    ),
                                },
                            ]}
                        />
                    </div>
                ) : null
            }
        />
    );
}
