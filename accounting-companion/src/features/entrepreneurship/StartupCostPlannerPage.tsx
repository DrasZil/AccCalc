import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import ComparisonBarsChart from "../../components/ComparisonBarsChart";
import EditableRowsCard from "../../components/EditableRowsCard";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeStartupCostPlan } from "../../utils/calculatorMath";
import formatPHP from "../../utils/formatPHP";

type CostRow = {
    id: string;
    label: string;
    amount: string;
};

function createRow(label = "", amount = ""): CostRow {
    return {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        label,
        amount,
    };
}

export default function StartupCostPlannerPage() {
    const [rows, setRows] = useState<CostRow[]>([
        createRow("Permits and registration", "12000"),
        createRow("Equipment", "85000"),
        createRow("Opening inventory", "45000"),
    ]);
    const [contingencyPercent, setContingencyPercent] = useState("10");
    const [openingCashBuffer, setOpeningCashBuffer] = useState("50000");

    const result = useMemo(() => {
        if (contingencyPercent.trim() === "" || openingCashBuffer.trim() === "") {
            return null;
        }

        const contingency = Number(contingencyPercent);
        const cashBuffer = Number(openingCashBuffer);
        if (Number.isNaN(contingency) || Number.isNaN(cashBuffer) || contingency < 0 || cashBuffer < 0) {
            return { error: "Contingency and opening cash buffer must be valid non-negative numbers." };
        }

        const parsedRows = rows.map((row) => ({
            label: row.label.trim() || "Untitled cost",
            amount: Number(row.amount),
        }));

        if (parsedRows.some((row) => Number.isNaN(row.amount) || row.amount < 0)) {
            return { error: "Each startup-cost row needs a valid non-negative amount." };
        }

        return computeStartupCostPlan(parsedRows, contingency, cashBuffer);
    }, [contingencyPercent, openingCashBuffer, rows]);

    return (
        <CalculatorPageLayout
            badge="Entrepreneurship / Planning"
            title="Startup Cost Planner"
            description="Organize launch costs, add a contingency allowance, and estimate the funding level needed before opening."
            inputSection={
                <div className="space-y-4">
                    <EditableRowsCard
                        title="Startup cost lines"
                        description="Add the one-time costs that must be covered before operations start."
                        rows={rows}
                        columns={[
                            { key: "label", label: "Cost line", placeholder: "Lease deposit" },
                            { key: "amount", label: "Amount", placeholder: "25000" },
                        ]}
                        addLabel="Add cost"
                        onAdd={() => setRows((current) => [...current, createRow()])}
                        onRemove={(id) =>
                            setRows((current) => current.filter((row) => row.id !== id))
                        }
                        onChange={(id, key, value) =>
                            setRows((current) =>
                                current.map((row) =>
                                    row.id === id ? { ...row, [key]: value } : row
                                )
                            )
                        }
                    />

                    <SectionCard>
                        <InputGrid columns={2}>
                            <InputCard label="Contingency (%)" value={contingencyPercent} onChange={setContingencyPercent} placeholder="10" />
                            <InputCard label="Opening Cash Buffer" value={openingCashBuffer} onChange={setOpeningCashBuffer} placeholder="50000" />
                        </InputGrid>
                    </SectionCard>
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
                        <ResultGrid columns={4}>
                            <ResultCard title="Startup Subtotal" value={formatPHP(result.subtotal)} />
                            <ResultCard title="Contingency" value={formatPHP(result.contingencyAmount)} />
                            <ResultCard title="Cash Buffer" value={formatPHP(result.openingCashBuffer)} />
                            <ResultCard title="Recommended Funding" value={formatPHP(result.recommendedFunding)} tone="accent" />
                        </ResultGrid>

                        <ComparisonBarsChart
                            title="Funding mix"
                            description="Use this split to separate pure setup spending from the reserve you want on hand when operations begin."
                            items={[
                                { label: "Subtotal", value: result.subtotal, accent: "primary" },
                                { label: "Contingency", value: result.contingencyAmount, accent: "highlight" },
                                { label: "Cash Buffer", value: result.openingCashBuffer, accent: "secondary" },
                            ]}
                            formatter={(value) => formatPHP(value)}
                        />
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Recommended funding = startup subtotal + contingency allowance + opening cash buffer."
                        steps={[
                            `Startup subtotal = ${formatPHP(result.subtotal)}.`,
                            `Contingency allowance = ${formatPHP(result.subtotal)} × ${Number(contingencyPercent).toFixed(2)}% = ${formatPHP(result.contingencyAmount)}.`,
                            `Recommended funding = ${formatPHP(result.recommendedFunding)}.`,
                        ]}
                        interpretation={`A launch budget of about ${formatPHP(result.recommendedFunding)} gives the business room to cover setup costs and still begin operations with working cash.`}
                        notes={[
                            `The largest startup line right now is ${result.largestItem.label} at ${formatPHP(result.largestItem.amount)}.`,
                            "This planner is useful for school feasibility work, business-plan drafts, and pre-opening funding conversations.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
