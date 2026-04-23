import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeCapitalRationingSelection } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

export default function CapitalRationingPage() {
    const [capitalBudget, setCapitalBudget] = useState("");
    const [projectAInvestment, setProjectAInvestment] = useState("");
    const [projectANpv, setProjectANpv] = useState("");
    const [projectBInvestment, setProjectBInvestment] = useState("");
    const [projectBNpv, setProjectBNpv] = useState("");
    const [projectCInvestment, setProjectCInvestment] = useState("");
    const [projectCNpv, setProjectCNpv] = useState("");

    const result = useMemo(() => {
        const values = [capitalBudget, projectAInvestment, projectANpv, projectBInvestment, projectBNpv, projectCInvestment, projectCNpv];
        if (values.some((value) => value.trim() === "")) return null;
        const numeric = values.map(Number);
        if (numeric.some(Number.isNaN)) return { error: "All capital-rationing inputs must be valid numbers." };
        if (numeric[0] < 0 || numeric[1] < 0 || numeric[3] < 0 || numeric[5] < 0) {
            return { error: "Capital budget and project investments cannot be negative." };
        }

        return computeCapitalRationingSelection([
            { label: "Project A", initialInvestment: numeric[1], netPresentValue: numeric[2] },
            { label: "Project B", initialInvestment: numeric[3], netPresentValue: numeric[4] },
            { label: "Project C", initialInvestment: numeric[5], netPresentValue: numeric[6] },
        ], numeric[0]);
    }, [capitalBudget, projectAInvestment, projectANpv, projectBInvestment, projectBNpv, projectCInvestment, projectCNpv]);

    return (
        <CalculatorPageLayout
            badge="Finance / MS"
            title="Capital Rationing Prioritizer"
            description="Rank mutually independent projects by profitability index and build a classroom capital-rationing selection under a limited investment budget."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <InputCard label="Capital Budget" value={capitalBudget} onChange={setCapitalBudget} placeholder="1000000" />
                    </SectionCard>
                    <div className="grid gap-4 lg:grid-cols-3">
                        {[
                            ["Project A", projectAInvestment, setProjectAInvestment, projectANpv, setProjectANpv],
                            ["Project B", projectBInvestment, setProjectBInvestment, projectBNpv, setProjectBNpv],
                            ["Project C", projectCInvestment, setProjectCInvestment, projectCNpv, setProjectCNpv],
                        ].map(([label, investment, setInvestment, npv, setNpv]) => (
                            <SectionCard key={label as string}>
                                <p className="app-card-title text-sm">{label as string}</p>
                                <div className="mt-3 space-y-3">
                                    <InputCard label="Initial Investment" value={investment as string} onChange={setInvestment as (value: string) => void} placeholder="400000" />
                                    <InputCard label="Net Present Value" value={npv as string} onChange={setNpv as (value: string) => void} placeholder="90000" />
                                </div>
                            </SectionCard>
                        ))}
                    </div>
                </div>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="app-tone-warning">
                        <p className="app-card-title text-sm">Input notice</p>
                        <p className="app-body-md mt-2 text-sm">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <div className="space-y-4">
                        <ResultGrid columns={3}>
                            <ResultCard title="Selected Investment" value={formatPHP(result.totalInvestment)} />
                            <ResultCard title="Selected NPV" value={formatPHP(result.totalNpv)} tone="accent" />
                            <ResultCard title="Remaining Budget" value={formatPHP(result.remainingBudget)} />
                        </ResultGrid>
                        <SectionCard>
                            <p className="app-card-title text-sm">Ranking by profitability index</p>
                            <div className="mt-3 space-y-2">
                                {result.rankedProjects.map((project) => (
                                    <div key={project.label} className="app-subtle-surface rounded-[1rem] px-4 py-3 text-sm">
                                        {project.label}: PI {project.profitabilityIndex.toFixed(4)} | Investment {formatPHP(project.initialInvestment)} | NPV {formatPHP(project.netPresentValue)}
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Profitability index = present value of inflows / initial investment = (investment + NPV) / investment"
                        steps={result.rankedProjects.map((project) => `${project.label}: PI = (${formatPHP(project.initialInvestment)} + ${formatPHP(project.netPresentValue)}) / ${formatPHP(project.initialInvestment)} = ${project.profitabilityIndex.toFixed(4)}`)}
                        interpretation={`Selected projects: ${result.selectedProjects.map((project) => project.label).join(", ") || "none within the capital budget"}.`}
                        warnings={[
                            "This helper uses a greedy profitability-index classroom approach. Mutually exclusive projects, indivisible combinations, or strategic constraints may require a full optimization table.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
