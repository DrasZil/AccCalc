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

type MaterialsMode = "direct-materials-used" | "derive-materials-used";

export default function CostOfGoodsManufacturedPage() {
    const [materialsMode, setMaterialsMode] = useState<MaterialsMode>("direct-materials-used");
    const [directMaterialsUsed, setDirectMaterialsUsed] = useState("");
    const [directLabor, setDirectLabor] = useState("");
    const [manufacturingOverhead, setManufacturingOverhead] = useState("");
    const [beginningWorkInProcess, setBeginningWorkInProcess] = useState("");
    const [endingWorkInProcess, setEndingWorkInProcess] = useState("");
    const [beginningRawMaterials, setBeginningRawMaterials] = useState("");
    const [rawMaterialsPurchases, setRawMaterialsPurchases] = useState("");
    const [freightIn, setFreightIn] = useState("");
    const [endingRawMaterials, setEndingRawMaterials] = useState("");

    useSmartSolverConnector({
        directMaterialsUsed: setDirectMaterialsUsed,
        directLabor: setDirectLabor,
        manufacturingOverhead: setManufacturingOverhead,
        beginningWorkInProcess: setBeginningWorkInProcess,
        endingWorkInProcess: setEndingWorkInProcess,
    });

    const result = useMemo(() => {
        const commonValues = [
            directLabor,
            manufacturingOverhead,
            beginningWorkInProcess,
            endingWorkInProcess,
        ];

        const materialsValues =
            materialsMode === "direct-materials-used"
                ? [directMaterialsUsed]
                : [beginningRawMaterials, rawMaterialsPurchases, freightIn, endingRawMaterials];

        const rawValues = [...commonValues, ...materialsValues];
        if (rawValues.some((value) => value.trim() === "")) {
            return null;
        }

        const parsedDirectLabor = Number(directLabor);
        const parsedManufacturingOverhead = Number(manufacturingOverhead);
        const parsedBeginningWorkInProcess = Number(beginningWorkInProcess);
        const parsedEndingWorkInProcess = Number(endingWorkInProcess);

        const numericValues = [
            parsedDirectLabor,
            parsedManufacturingOverhead,
            parsedBeginningWorkInProcess,
            parsedEndingWorkInProcess,
        ];

        if (materialsMode === "direct-materials-used") {
            numericValues.push(Number(directMaterialsUsed));
        } else {
            numericValues.push(
                Number(beginningRawMaterials),
                Number(rawMaterialsPurchases),
                Number(freightIn),
                Number(endingRawMaterials)
            );
        }

        if (numericValues.some((value) => Number.isNaN(value))) {
            return {
                error: "All inputs must be valid numbers.",
            };
        }

        if (numericValues.some((value) => value < 0)) {
            return {
                error: "Manufacturing cost inputs cannot be negative.",
            };
        }

        const parsedDirectMaterialsUsed =
            materialsMode === "direct-materials-used"
                ? Number(directMaterialsUsed)
                : Number(beginningRawMaterials) +
                  Number(rawMaterialsPurchases) +
                  Number(freightIn) -
                  Number(endingRawMaterials);

        if (parsedDirectMaterialsUsed < 0) {
            return {
                error: "Ending raw materials cannot exceed the total raw materials available for use.",
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
            materialsMode,
            directMaterialsUsed: parsedDirectMaterialsUsed,
            totalManufacturingCosts,
            totalCostOfWorkInProcess,
            costOfGoodsManufactured,
            formula:
                "COGM = Beginning Work in Process + Total Manufacturing Costs - Ending Work in Process",
            steps: [
                materialsMode === "direct-materials-used"
                    ? `Direct materials used = ${formatPHP(parsedDirectMaterialsUsed)}.`
                    : `Direct materials used = ${formatPHP(Number(beginningRawMaterials))} + ${formatPHP(Number(rawMaterialsPurchases))} + ${formatPHP(Number(freightIn))} - ${formatPHP(Number(endingRawMaterials))} = ${formatPHP(parsedDirectMaterialsUsed)}.`,
                `Total manufacturing costs = ${formatPHP(parsedDirectMaterialsUsed)} + ${formatPHP(parsedDirectLabor)} + ${formatPHP(parsedManufacturingOverhead)} = ${formatPHP(totalManufacturingCosts)}.`,
                `Total cost of work in process = ${formatPHP(parsedBeginningWorkInProcess)} + ${formatPHP(totalManufacturingCosts)} = ${formatPHP(totalCostOfWorkInProcess)}.`,
                `Cost of goods manufactured = ${formatPHP(totalCostOfWorkInProcess)} - ${formatPHP(parsedEndingWorkInProcess)} = ${formatPHP(costOfGoodsManufactured)}.`,
            ],
            interpretation: `After combining direct materials used of ${formatPHP(parsedDirectMaterialsUsed)}, direct labor of ${formatPHP(parsedDirectLabor)}, and manufacturing overhead of ${formatPHP(parsedManufacturingOverhead)}, total manufacturing costs are ${formatPHP(totalManufacturingCosts)}. Including beginning work in process and removing ending work in process leaves ${formatPHP(costOfGoodsManufactured)} transferred out as cost of goods manufactured.`,
        };
    }, [
        beginningRawMaterials,
        beginningWorkInProcess,
        directLabor,
        directMaterialsUsed,
        endingRawMaterials,
        endingWorkInProcess,
        freightIn,
        manufacturingOverhead,
        materialsMode,
        rawMaterialsPurchases,
    ]);

    return (
        <CalculatorPageLayout
            badge="Accounting / Cost"
            title="Cost of Goods Manufactured"
            description="Compute COGM either from direct materials already given or from a fuller raw-materials schedule when the problem does not hand you direct materials used directly."
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setMaterialsMode("direct-materials-used")}
                                className={[
                                    "rounded-xl px-4 py-2 text-sm font-medium",
                                    materialsMode === "direct-materials-used"
                                        ? "app-button-primary"
                                        : "app-button-secondary",
                                ].join(" ")}
                            >
                                Direct materials given
                            </button>
                            <button
                                type="button"
                                onClick={() => setMaterialsMode("derive-materials-used")}
                                className={[
                                    "rounded-xl px-4 py-2 text-sm font-medium",
                                    materialsMode === "derive-materials-used"
                                        ? "app-button-primary"
                                        : "app-button-secondary",
                                ].join(" ")}
                            >
                                Derive materials used
                            </button>
                        </div>
                        <p className="app-body-md mt-3 text-sm">
                            {materialsMode === "direct-materials-used"
                                ? "Use this when the problem already states direct materials used."
                                : "Use this when the problem provides beginning raw materials, purchases, freight-in, and ending raw materials instead."}
                        </p>
                    </SectionCard>

                    {materialsMode === "direct-materials-used" ? (
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
                    ) : (
                        <>
                            <SectionCard>
                                <InputGrid columns={2}>
                                    <InputCard
                                        label="Beginning Raw Materials"
                                        value={beginningRawMaterials}
                                        onChange={setBeginningRawMaterials}
                                        placeholder="25000"
                                    />
                                    <InputCard
                                        label="Raw Materials Purchases"
                                        value={rawMaterialsPurchases}
                                        onChange={setRawMaterialsPurchases}
                                        placeholder="105000"
                                    />
                                    <InputCard
                                        label="Freight-in"
                                        value={freightIn}
                                        onChange={setFreightIn}
                                        placeholder="5000"
                                    />
                                    <InputCard
                                        label="Ending Raw Materials"
                                        value={endingRawMaterials}
                                        onChange={setEndingRawMaterials}
                                        placeholder="15000"
                                    />
                                </InputGrid>
                            </SectionCard>

                            <SectionCard>
                                <InputGrid columns={3}>
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
                        </>
                    )}
                </div>
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
                            title="Direct Materials Used"
                            value={formatPHP(result.directMaterialsUsed)}
                        />
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
                        assumptions={[
                            "Freight-in is treated as part of raw materials available for use when deriving direct materials used.",
                            "This tool follows the standard COGM flow: materials, labor, and overhead build total manufacturing costs, which are then adjusted for work in process.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
