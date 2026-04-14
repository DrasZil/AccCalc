import { useMemo, useState } from "react";
import CalculatorPageLayout from "../../components/CalculatorPageLayout";
import FormulaCard from "../../components/FormulaCard";
import InputCard from "../../components/INputCard";
import InputGrid from "../../components/InputGrid";
import ResultCard from "../../components/resultCard";
import ResultGrid from "../../components/ResultGrid";
import SectionCard from "../../components/SectionCard";
import formatPHP from "../../utils/formatPHP";
import { computeHighLowCostEstimation } from "../../utils/calculatorMath";
import SendToWorkpaperButton from "../workpapers/SendToWorkpaperButton";
import { buildHighLowTransferBundle } from "../workpapers/workpaperTransferBuilders";

export default function HighLowCostEstimationPage() {
    const [highActivityUnits, setHighActivityUnits] = useState("");
    const [highTotalCost, setHighTotalCost] = useState("");
    const [lowActivityUnits, setLowActivityUnits] = useState("");
    const [lowTotalCost, setLowTotalCost] = useState("");
    const [expectedActivityUnits, setExpectedActivityUnits] = useState("");

    const result = useMemo(() => {
        const required = [highActivityUnits, highTotalCost, lowActivityUnits, lowTotalCost];
        if (required.some((value) => value.trim() === "")) return null;

        const highUnits = Number(highActivityUnits);
        const highCost = Number(highTotalCost);
        const lowUnits = Number(lowActivityUnits);
        const lowCost = Number(lowTotalCost);
        const expectedUnits =
            expectedActivityUnits.trim() === "" ? undefined : Number(expectedActivityUnits);

        if ([highUnits, highCost, lowUnits, lowCost].some((value) => Number.isNaN(value))) {
            return { error: "All required values must be valid numbers." };
        }

        if (expectedUnits !== undefined && Number.isNaN(expectedUnits)) {
            return { error: "Expected activity must be a valid number when provided." };
        }

        if (highUnits <= lowUnits) {
            return {
                error: "High activity units must be greater than low activity units for the high-low method.",
            };
        }

        return computeHighLowCostEstimation({
            highActivityUnits: highUnits,
            highTotalCost: highCost,
            lowActivityUnits: lowUnits,
            lowTotalCost: lowCost,
            expectedActivityUnits: expectedUnits,
        });
    }, [
        expectedActivityUnits,
        highActivityUnits,
        highTotalCost,
        lowActivityUnits,
        lowTotalCost,
    ]);

    const workpaperBundle = useMemo(
        () =>
            result && !("error" in result)
                ? buildHighLowTransferBundle({
                      highActivityUnits,
                      highTotalCost,
                      lowActivityUnits,
                      lowTotalCost,
                      expectedActivityUnits,
                      result,
                  })
                : null,
        [
            expectedActivityUnits,
            highActivityUnits,
            highTotalCost,
            lowActivityUnits,
            lowTotalCost,
            result,
        ]
    );

    return (
        <CalculatorPageLayout
            badge="Cost & Managerial"
            title="High-Low Cost Estimation"
            description="Split mixed cost into estimated variable and fixed components using the high-low method, then project total cost at an expected activity level."
            headerActions={<SendToWorkpaperButton bundle={workpaperBundle} />}
            inputSection={
                <div className="space-y-4">
                    <SectionCard>
                        <InputGrid columns={2}>
                            <InputCard
                                label="High Activity Units"
                                value={highActivityUnits}
                                onChange={setHighActivityUnits}
                                placeholder="18000"
                            />
                            <InputCard
                                label="High Total Cost"
                                value={highTotalCost}
                                onChange={setHighTotalCost}
                                placeholder="420000"
                            />
                            <InputCard
                                label="Low Activity Units"
                                value={lowActivityUnits}
                                onChange={setLowActivityUnits}
                                placeholder="12000"
                            />
                            <InputCard
                                label="Low Total Cost"
                                value={lowTotalCost}
                                onChange={setLowTotalCost}
                                placeholder="315000"
                            />
                        </InputGrid>
                    </SectionCard>

                    <SectionCard>
                        <InputGrid columns={1}>
                            <InputCard
                                label="Expected Activity Units (optional)"
                                value={expectedActivityUnits}
                                onChange={setExpectedActivityUnits}
                                placeholder="15000"
                                helperText="Use this when you want the mixed-cost estimate at a specific activity level."
                            />
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
                            <ResultCard
                                title="Variable Cost / Unit"
                                value={formatPHP(result.variableCostPerUnit)}
                                tone="accent"
                            />
                            <ResultCard
                                title="Estimated Fixed Cost"
                                value={formatPHP(result.fixedCostEstimate)}
                            />
                            <ResultCard
                                title="Activity Spread"
                                value={result.activitySpread.toLocaleString()}
                            />
                            <ResultCard title="Estimated Cost Formula" value={result.costFormula} />
                        </ResultGrid>

                        {result.estimatedTotalCost !== null ? (
                            <SectionCard>
                                <p className="app-card-title text-sm">Projected mixed cost</p>
                                <p className="app-body-md mt-2 text-sm">
                                    At {Number(expectedActivityUnits).toLocaleString()} units, the
                                    estimated mixed cost is {formatPHP(result.estimatedTotalCost)}.
                                </p>
                            </SectionCard>
                        ) : null}
                    </div>
                ) : null
            }
            explanationSection={
                result && !("error" in result) ? (
                    <FormulaCard
                        formula="Variable cost per unit = (High cost - Low cost) / (High activity - Low activity)"
                        steps={[
                            `Variable cost per unit = (${formatPHP(Number(highTotalCost))} - ${formatPHP(Number(lowTotalCost))}) / (${Number(highActivityUnits).toLocaleString()} - ${Number(lowActivityUnits).toLocaleString()}).`,
                            `Estimated variable cost per unit = ${formatPHP(result.variableCostPerUnit)}.`,
                            `Estimated fixed cost = High cost - (Variable cost per unit x High activity) = ${formatPHP(result.fixedCostEstimate)}.`,
                            result.estimatedTotalCost !== null
                                ? `Estimated total cost at ${Number(expectedActivityUnits).toLocaleString()} units = ${formatPHP(result.estimatedTotalCost)}.`
                                : "Use the optional expected activity field when you want a projected total cost.",
                        ]}
                        interpretation="The high-low method gives a quick first-pass mixed-cost split. It is useful for reviewer problems and planning checks, but it should not be treated as the final word when richer cost data is available."
                        warnings={[
                            "Choose the highest and lowest activity points, not merely the highest and lowest total costs.",
                            "If the activity range is unusual or distorted by outliers, the estimate can be misleading.",
                        ]}
                    />
                ) : null
            }
        />
    );
}
