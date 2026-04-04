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

export default function CostOfGoodsManufacturedPage() {
    const [directMaterialsUsed, setDirectMaterialsUsed] = useState("");
    const [directLabor, setDirectLabor] = useState("");
    const [manufacturingOverhead, setManufacturingOverhead] = useState("");
    const [beginningWorkInProcess, setBeginningWorkInProcess] = useState("");
    const [endingWorkInProcess, setEndingWorkInProcess] = useState("");

    useSmartSolverConnector({
        directMaterialsUsed: setDirectMaterialsUsed,
        directLabor: setDirectLabor,
        manufacturingOverhead: setManufacturingOverhead,
        beginningWorkInProcess: setBeginningWorkInProcess,
        endingWorkInProcess: setEndingWorkInProcess,
    });

    const result = useMemo(() => {
        const values = [
            directMaterialsUsed,
            directLabor,
            manufacturingOverhead,
            beginningWorkInProcess,
            endingWorkInProcess,
        ];

        if (values.some((value) => value.trim() === "")) {
            return null;
        }

        const parsedDirectMaterialsUsed = Number(directMaterialsUsed);
        const parsedDirectLabor = Number(directLabor);
        const parsedManufacturingOverhead = Number(manufacturingOverhead);
        const parsedBeginningWorkInProcess = Number(beginningWorkInProcess);
        const parsedEndingWorkInProcess = Number(endingWorkInProcess);

        const parsedValues = [
            parsedDirectMaterialsUsed,
            parsedDirectLabor,
            parsedManufacturingOverhead,
            parsedBeginningWorkInProcess,
            parsedEndingWorkInProcess,
        ];

        if (parsedValues.some((value) => Number.isNaN(value))) {
            return {
                error: "All inputs must be valid numbers.",
            };
        }

        if (parsedValues.some((value) => value < 0)) {
            return {
                error: "Manufacturing cost inputs cannot be negative.",
            };
        }

        const totalManufacturingCosts =
            parsedDirectMaterialsUsed + parsedDirectLabor + parsedManufacturingOverhead;

        const totalCostOfWorkInProcess =
            parsedBeginningWorkInProcess + totalManufacturingCosts;

        const costOfGoodsManufactured =
            totalCostOfWorkInProcess - parsedEndingWorkInProcess;

        if (costOfGoodsManufactured < 0) {
            return {
                error: "Ending work in process cannot exceed the total cost of work in process.",
            };
        }

        return {
            totalManufacturingCosts,
            totalCostOfWorkInProcess,
            costOfGoodsManufactured,
            formula: (
                <>
                    Total Manufacturing Costs = Direct Materials Used + Direct Labor + Manufacturing Overhead
                    <br />
                    Cost of Goods Manufactured = Beginning Work in Process + Total Manufacturing Costs - Ending Work in Process
                </>
            ),
            steps: [
                `Total manufacturing costs = ${formatPHP(parsedDirectMaterialsUsed)} + ${formatPHP(parsedDirectLabor)} + ${formatPHP(parsedManufacturingOverhead)} = ${formatPHP(totalManufacturingCosts)}`,
                `Total cost of work in process = ${formatPHP(parsedBeginningWorkInProcess)} + ${formatPHP(totalManufacturingCosts)} = ${formatPHP(totalCostOfWorkInProcess)}`,
                `Cost of goods manufactured = ${formatPHP(totalCostOfWorkInProcess)} - ${formatPHP(parsedEndingWorkInProcess)} = ${formatPHP(costOfGoodsManufactured)}`,
            ],
            interpretation: `Current production added ${formatPHP(totalManufacturingCosts)} in manufacturing costs during the period. After combining those costs with beginning work in process of ${formatPHP(parsedBeginningWorkInProcess)} and removing ending work in process of ${formatPHP(parsedEndingWorkInProcess)}, the amount completed and transferred out is ${formatPHP(costOfGoodsManufactured)} as cost of goods manufactured.`,
        };
    }, [
        beginningWorkInProcess,
        directLabor,
        directMaterialsUsed,
        endingWorkInProcess,
        manufacturingOverhead,
    ]);

    return (
        <CalculatorPageLayout
            badge="Accounting • Cost"
            title="Cost of Goods Manufactured"
            description="Compute total manufacturing costs and cost of goods manufactured, a standard cost accounting topic in Philippine accounting programs."
            inputSection={
                <SectionCard>
                    <InputGrid columns={3}>
                        <InputCard
                            label="Direct Materials Used"
                            value={directMaterialsUsed}
                            onChange={setDirectMaterialsUsed}
                            placeholder="120000"
                        />
                        <InputCard
                            label="Direct Labor"
                            value={directLabor}
                            onChange={setDirectLabor}
                            placeholder="90000"
                        />
                        <InputCard
                            label="Manufacturing Overhead"
                            value={manufacturingOverhead}
                            onChange={setManufacturingOverhead}
                            placeholder="50000"
                        />
                        <InputCard
                            label="Beginning Work in Process"
                            value={beginningWorkInProcess}
                            onChange={setBeginningWorkInProcess}
                            placeholder="15000"
                        />
                        <InputCard
                            label="Ending Work in Process"
                            value={endingWorkInProcess}
                            onChange={setEndingWorkInProcess}
                            placeholder="10000"
                        />
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
                    <ResultGrid columns={3}>
                        <ResultCard
                            title="Total Manufacturing Costs"
                            value={formatPHP(result.totalManufacturingCosts)}
                        />
                        <ResultCard
                            title="Total Cost of Work in Process"
                            value={formatPHP(result.totalCostOfWorkInProcess)}
                        />
                        <ResultCard
                            title="Cost of Goods Manufactured"
                            value={formatPHP(result.costOfGoodsManufactured)}
                        />
                    </ResultGrid>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula={result.formula}
                        steps={result.steps}
                        interpretation={result.interpretation}
                    />
                ) : null
            }
        />
    );
}
