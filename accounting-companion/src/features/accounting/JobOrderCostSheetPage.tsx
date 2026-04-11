import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import StudySupportPanel from "../../components/StudySupportPanel";
import { buildStudyQuizPath, buildStudyTopicPath } from "../study/studyContent";
import formatPHP from "../../utils/formatPHP";
import { computeJobOrderCostSheet } from "../../utils/calculatorMath";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

function mixLabel(value: number) {
    if (value >= 50) return "Dominant";
    if (value >= 30) return "Material";
    return "Support";
}

export default function JobOrderCostSheetPage() {
    const [directMaterialsUsed, setDirectMaterialsUsed] = useState("");
    const [directLabor, setDirectLabor] = useState("");
    const [manufacturingOverhead, setManufacturingOverhead] = useState("");
    const [unitsProduced, setUnitsProduced] = useState("");

    useSmartSolverConnector({
        directMaterialsUsed: setDirectMaterialsUsed,
        directLabor: setDirectLabor,
        manufacturingOverhead: setManufacturingOverhead,
        unitsProduced: setUnitsProduced,
    });

    const result = useMemo(() => {
        const rawValues = [
            directMaterialsUsed,
            directLabor,
            manufacturingOverhead,
            unitsProduced,
        ];

        if (rawValues.some((value) => value.trim() === "")) {
            return null;
        }

        const parsedValues = rawValues.map((value) => Number(value));
        if (parsedValues.some((value) => Number.isNaN(value))) {
            return { error: "All job-order inputs must be valid numbers." };
        }

        if (parsedValues.some((value) => value < 0)) {
            return { error: "Job-order cost inputs cannot be negative." };
        }

        if (parsedValues[3] <= 0) {
            return { error: "Units in the job must be greater than zero to compute unit cost." };
        }

        return computeJobOrderCostSheet({
            directMaterialsUsed: parsedValues[0],
            directLabor: parsedValues[1],
            appliedManufacturingOverhead: parsedValues[2],
            unitsInJob: parsedValues[3],
        });
    }, [directLabor, directMaterialsUsed, manufacturingOverhead, unitsProduced]);

    return (
        <CalculatorPageLayout
            badge="Managerial & Cost / Manufacturing"
            title="Job Order Cost Sheet"
            description="Build a textbook-style job cost sheet from direct materials, direct labor, applied overhead, and job units so cost assignment and unit-cost interpretation stay tied together."
            inputSection={
                <SectionCard>
                    <InputGrid columns={2}>
                        <InputCard
                            label="Direct Materials Used"
                            value={directMaterialsUsed}
                            onChange={setDirectMaterialsUsed}
                            placeholder="85000"
                        />
                        <InputCard
                            label="Direct Labor"
                            value={directLabor}
                            onChange={setDirectLabor}
                            placeholder="54000"
                        />
                        <InputCard
                            label="Applied Manufacturing Overhead"
                            value={manufacturingOverhead}
                            onChange={setManufacturingOverhead}
                            placeholder="48600"
                            helperText="Use the overhead applied to the job, not total factory overhead for the whole period."
                        />
                        <InputCard
                            label="Units in the Job"
                            value={unitsProduced}
                            onChange={setUnitsProduced}
                            placeholder="1200"
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
                    <div className="space-y-4">
                        <ResultGrid columns={4}>
                            <ResultCard title="Total Job Cost" value={formatPHP(result.totalJobCost)} tone="accent" />
                            <ResultCard title="Unit Cost" value={formatPHP(result.unitCost)} />
                            <ResultCard title="Prime Cost" value={formatPHP(result.primeCost)} />
                            <ResultCard title="Conversion Cost" value={formatPHP(result.conversionCost)} />
                        </ResultGrid>

                        <ResultGrid columns={3}>
                            <ResultCard
                                title="Materials share"
                                value={`${result.materialsShare.toFixed(2)}%`}
                                supportingText={`${mixLabel(result.materialsShare)} share of total job cost.`}
                            />
                            <ResultCard
                                title="Labor share"
                                value={`${result.laborShare.toFixed(2)}%`}
                                supportingText={`${mixLabel(result.laborShare)} share of total job cost.`}
                            />
                            <ResultCard
                                title="Overhead share"
                                value={`${result.overheadShare.toFixed(2)}%`}
                                supportingText={`${mixLabel(result.overheadShare)} share of total job cost.`}
                            />
                        </ResultGrid>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <div className="space-y-4">
                        <StudySupportPanel
                            topicId="job-order-costing"
                            topicTitle="Job Order Costing"
                            lessonPath={buildStudyTopicPath("job-order-costing")}
                            quizPath={buildStudyQuizPath("job-order-costing")}
                            intro="Use this study layer to connect the worksheet with the textbook sequence: direct tracing, overhead application, unit-cost reading, and common job-costing mistakes."
                            sections={[
                                {
                                    key: "purpose",
                                    label: "What this tool is for",
                                    summary: "Build one clean job cost sheet without mixing period-wide totals into a single job.",
                                    content: (
                                        <p>
                                            This page is for job-order costing problems where direct materials, direct labor, and applied manufacturing overhead are assigned to one job. It helps students read total job cost, unit cost, prime cost, and conversion cost from the same cost sheet instead of solving each number in isolation.
                                        </p>
                                    ),
                                },
                                {
                                    key: "when-to-use",
                                    label: "When to use it",
                                    summary: "Use it for specific jobs, orders, or batches rather than continuous-flow departments.",
                                    content: (
                                        <p>
                                            Use this page when the problem names a specific job, batch, or customer order and asks for assigned manufacturing cost. If the case is department-wide continuous production with equivalent units and ending WIP, move to the process-costing tools instead of forcing job-order logic.
                                        </p>
                                    ),
                                },
                                {
                                    key: "worked-example",
                                    label: "Worked example",
                                    summary: "Read the current inputs as one complete job-order story.",
                                    content: (
                                        <p>
                                            The current job uses {formatPHP(Number(directMaterialsUsed || 0))} of direct materials, {formatPHP(Number(directLabor || 0))} of direct labor, and {formatPHP(Number(manufacturingOverhead || 0))} of applied overhead. That creates a total job cost of {formatPHP(result.totalJobCost)}, and when the job contains {Number(unitsProduced || 0).toLocaleString("en")} units, the assigned unit cost is {formatPHP(result.unitCost)}.
                                        </p>
                                    ),
                                },
                                {
                                    key: "common-mistakes",
                                    label: "Common mistakes",
                                    summary: "Most errors come from cost classification or overhead misuse, not arithmetic.",
                                    emphasis: "support",
                                    tone: "warning",
                                    content: (
                                        <ul className="list-disc space-y-2 pl-5">
                                            <li>Using total factory overhead instead of the amount applied to this job.</li>
                                            <li>Mixing direct materials purchased with direct materials actually used.</li>
                                            <li>Dividing by planned units instead of the units in the specific job or batch.</li>
                                            <li>Calling every cost in the sheet a prime cost instead of separating prime and conversion cost correctly.</li>
                                        </ul>
                                    ),
                                },
                                {
                                    key: "self-check",
                                    label: "Self-check",
                                    summary: "Use these prompts before you trust the final unit cost.",
                                    emphasis: "support",
                                    tone: "info",
                                    content: (
                                        <ul className="list-disc space-y-2 pl-5">
                                            <li>Did the problem give applied overhead directly, or do you still need to compute it from a predetermined rate?</li>
                                            <li>Are the units in the denominator specific to this job rather than the whole department?</li>
                                            <li>Would a process-costing schedule be more appropriate if production is continuous instead of job-specific?</li>
                                        </ul>
                                    ),
                                },
                            ]}
                            relatedTools={[
                                { path: "/accounting/cost-of-goods-manufactured", label: "Cost of Goods Manufactured" },
                                { path: "/accounting/prime-conversion-cost", label: "Prime and Conversion Cost" },
                                { path: "/accounting/process-costing-workspace", label: "Process Costing Workspace" },
                            ]}
                        />
                        <FormulaCard
                            formula="Total job cost = Direct materials used + Direct labor + Applied manufacturing overhead"
                            steps={[
                                `Prime cost = ${formatPHP(Number(directMaterialsUsed || 0))} + ${formatPHP(Number(directLabor || 0))} = ${formatPHP(result.primeCost)}.`,
                                `Conversion cost = ${formatPHP(Number(directLabor || 0))} + ${formatPHP(Number(manufacturingOverhead || 0))} = ${formatPHP(result.conversionCost)}.`,
                                `Total job cost = ${formatPHP(Number(directMaterialsUsed || 0))} + ${formatPHP(Number(directLabor || 0))} + ${formatPHP(Number(manufacturingOverhead || 0))} = ${formatPHP(result.totalJobCost)}.`,
                                `Unit cost = ${formatPHP(result.totalJobCost)} / ${Number(unitsProduced || 0).toLocaleString("en")} = ${formatPHP(result.unitCost)} per unit.`,
                            ]}
                            glossary={[
                                {
                                    term: "Applied manufacturing overhead",
                                    meaning:
                                        "The overhead assigned to this specific job using the chosen application basis or predetermined rate.",
                                },
                                {
                                    term: "Prime cost",
                                    meaning:
                                        "The sum of direct materials and direct labor traced directly to the job.",
                                },
                                {
                                    term: "Conversion cost",
                                    meaning:
                                        "The resources used to convert materials into finished output: direct labor plus applied overhead.",
                                },
                            ]}
                            interpretation={`This job cost sheet assigns ${formatPHP(result.totalJobCost)} to the job and translates it into ${formatPHP(result.unitCost)} per unit. Review the cost mix before comparing jobs because a high unit cost may come from materials intensity, labor intensity, or heavy overhead application.`}
                            assumptions={[
                                "The overhead input is the amount applied to this job, not the factory's total actual overhead for all jobs.",
                                "Units in the job represent completed or costed output for the unit-cost reading shown here.",
                            ]}
                            warnings={[
                                "If the problem gives a predetermined overhead rate and an activity base instead of applied overhead, compute applied overhead first before using this sheet.",
                                "Unit cost becomes misleading if spoiled units, incomplete units, or abnormal losses should be handled separately.",
                            ]}
                            notes={[
                                "Use this alongside prime and conversion cost when the instructor wants cost classification, and alongside COGM when the case expands from one job to period-wide manufacturing totals.",
                            ]}
                        />
                    </div>
                ) : null
            }
        />
    );
}
