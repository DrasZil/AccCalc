import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { useSmartSolverConnector } from "../smart/smartSolver.connector";

export default function PrimeConversionCostPage() {
    const [directMaterialsUsed, setDirectMaterialsUsed] = useState("");
    const [directLabor, setDirectLabor] = useState("");
    const [manufacturingOverhead, setManufacturingOverhead] = useState("");

    useSmartSolverConnector({
        directMaterialsUsed: setDirectMaterialsUsed,
        directLabor: setDirectLabor,
        manufacturingOverhead: setManufacturingOverhead,
    });

    const result = useMemo(() => {
        if (
            directMaterialsUsed.trim() === "" ||
            directLabor.trim() === "" ||
            manufacturingOverhead.trim() === ""
        ) {
            return null;
        }

        const parsedDirectMaterialsUsed = Number(directMaterialsUsed);
        const parsedDirectLabor = Number(directLabor);
        const parsedManufacturingOverhead = Number(manufacturingOverhead);

        if (
            [parsedDirectMaterialsUsed, parsedDirectLabor, parsedManufacturingOverhead].some(
                (value) => Number.isNaN(value)
            )
        ) {
            return { error: "All fields must contain valid numbers." };
        }

        const primeCost = parsedDirectMaterialsUsed + parsedDirectLabor;
        const conversionCost = parsedDirectLabor + parsedManufacturingOverhead;

        return {
            primeCost,
            conversionCost,
            formula: "Prime Cost = Direct Materials Used + Direct Labor; Conversion Cost = Direct Labor + Manufacturing Overhead",
            steps: [
                `Prime cost = ${formatPHP(parsedDirectMaterialsUsed)} + ${formatPHP(parsedDirectLabor)} = ${formatPHP(primeCost)}`,
                `Conversion cost = ${formatPHP(parsedDirectLabor)} + ${formatPHP(parsedManufacturingOverhead)} = ${formatPHP(conversionCost)}`,
            ],
            glossary: [
                {
                    term: "Prime cost",
                    meaning: "The sum of direct materials and direct labor directly traceable to production.",
                },
                {
                    term: "Conversion cost",
                    meaning: "The cost of converting materials into finished goods through labor and factory overhead.",
                },
                {
                    term: "Manufacturing overhead",
                    meaning: "Indirect production costs such as factory utilities, supervision, and depreciation.",
                },
            ],
            interpretation:
                "Prime cost highlights traceable production inputs, while conversion cost highlights the resources used to transform materials into completed output.",
        };
    }, [directLabor, directMaterialsUsed, manufacturingOverhead]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Cost"
            title="Prime and Conversion Cost"
            description="Separate direct production inputs from conversion-related costs for cost accounting analysis."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard label="Direct Materials Used" value={directMaterialsUsed} onChange={setDirectMaterialsUsed} placeholder="120000" />
                        <InputCard label="Direct Labor" value={directLabor} onChange={setDirectLabor} placeholder="90000" />
                        <InputCard label="Manufacturing Overhead" value={manufacturingOverhead} onChange={setManufacturingOverhead} placeholder="50000" />
                    </InputGrid>
                </SectionCard>
            }
            resultSection={
                result && "error" in result ? (
                    <SectionCard className="border-yellow-400/20 bg-yellow-500/10">
                        <p className="text-sm font-medium text-yellow-300">Input notice</p>
                        <p className="mt-2 text-sm leading-6 text-yellow-200">{result.error}</p>
                    </SectionCard>
                ) : result ? (
                    <ResultGrid columns={2}>
                        <ResultCard title="Prime Cost" value={formatPHP(result.primeCost)} />
                        <ResultCard title="Conversion Cost" value={formatPHP(result.conversionCost)} />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula={result.formula}
                        steps={result.steps}
                        glossary={result.glossary}
                        interpretation={result.interpretation}
                    />
                ) : null
            }
        />
    );
}
