import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import ComparisonBarsChart from "../../components/ComparisonBarsChart";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import { computeElasticityShift } from "../../utils/calculatorMath";

type ElasticityMode = "price" | "income" | "cross";

const MODE_LABELS: Record<ElasticityMode, { title: string; driver: string }> = {
    price: { title: "Price elasticity", driver: "Price" },
    income: { title: "Income elasticity", driver: "Income" },
    cross: { title: "Cross elasticity", driver: "Related good price" },
};

export default function EconomicsAnalysisWorkspacePage() {
    const [mode, setMode] = useState<ElasticityMode>("price");
    const [initialDriver, setInitialDriver] = useState("");
    const [finalDriver, setFinalDriver] = useState("");
    const [initialQuantity, setInitialQuantity] = useState("");
    const [finalQuantity, setFinalQuantity] = useState("");

    const result = useMemo(() => {
        const values = [initialDriver, finalDriver, initialQuantity, finalQuantity];
        if (values.some((value) => value.trim() === "")) return null;
        const parsed = values.map((value) => Number(value));
        if (parsed.some((value) => Number.isNaN(value) || value <= 0)) {
            return { error: "All elasticity inputs must be valid positive numbers." };
        }

        const analysis = computeElasticityShift({
            initialDriver: parsed[0],
            finalDriver: parsed[1],
            initialQuantity: parsed[2],
            finalQuantity: parsed[3],
        });
        const signedElasticity =
            mode === "price" ? analysis.elasticity : Math.abs(analysis.elasticity);
        const absoluteElasticity = Math.abs(signedElasticity);

        return {
            ...analysis,
            signedElasticity,
            classification:
                absoluteElasticity > 1
                    ? "Elastic"
                    : absoluteElasticity < 1
                      ? "Inelastic"
                      : "Unit elastic",
        };
    }, [finalDriver, finalQuantity, initialDriver, initialQuantity, mode]);

    return (
        <CalculatorPageLayout
            badge="Economics"
            title="Economics Analysis Workspace"
            description="Work through price, income, and cross-elasticity cases from one compact study surface."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <div className="flex flex-wrap gap-2">
                            {(Object.keys(MODE_LABELS) as ElasticityMode[]).map((key) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setMode(key)}
                                    className={[
                                        "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                                        mode === key ? "app-button-primary" : "app-button-ghost",
                                    ].join(" ")}
                                >
                                    {MODE_LABELS[key].title}
                                </button>
                            ))}
                        </div>
                    </SectionCard>
                    <SectionCard>
                        <InputGrid columns={2}>
                            <InputCard label={`Initial ${MODE_LABELS[mode].driver}`} value={initialDriver} onChange={setInitialDriver} placeholder="120" />
                            <InputCard label={`Final ${MODE_LABELS[mode].driver}`} value={finalDriver} onChange={setFinalDriver} placeholder="100" />
                            <InputCard label="Initial Quantity" value={initialQuantity} onChange={setInitialQuantity} placeholder="240" />
                            <InputCard label="Final Quantity" value={finalQuantity} onChange={setFinalQuantity} placeholder="300" />
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
                        <ResultGrid columns={3}>
                            <ResultCard title="Elasticity" value={result.signedElasticity.toFixed(3)} tone="accent" />
                            <ResultCard title="Classification" value={result.classification} />
                            <ResultCard title="Quantity Change" value={`${(result.quantityChangePercent * 100).toFixed(2)}%`} />
                        </ResultGrid>

                        <ComparisonBarsChart
                            title="Change comparison"
                            description="Compare the size of the driver change with the resulting quantity change."
                            items={[
                                { label: "Driver change %", value: Math.abs(result.driverChangePercent * 100), accent: "secondary" },
                                { label: "Quantity change %", value: Math.abs(result.quantityChangePercent * 100), accent: "primary" },
                            ]}
                            formatter={(value) => `${value.toFixed(2)}%`}
                        />
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Elasticity = percentage change in quantity / percentage change in the selected driver, using midpoint percentages."
                        steps={[
                            `Driver change = ${(result.driverChangePercent * 100).toFixed(2)}%.`,
                            `Quantity change = ${(result.quantityChangePercent * 100).toFixed(2)}%.`,
                            `Elasticity = ${result.signedElasticity.toFixed(3)}.`,
                        ]}
                        interpretation={`This workspace helps compare three elasticity cases without forcing you into separate pages. For ${MODE_LABELS[mode].title.toLowerCase()}, the computed elasticity is ${result.signedElasticity.toFixed(3)}, which is classified as ${result.classification.toLowerCase()}.`}
                        warnings={[
                            "Price elasticity is usually interpreted with the sign, while income and cross elasticity are often discussed using sign plus economic meaning.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
