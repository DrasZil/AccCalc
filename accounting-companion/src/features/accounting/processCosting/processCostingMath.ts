import { roundTo } from "../../../utils/calc/precision";
import { safeAdd, safeDivide, safeMultiply, safeSubtract } from "../../../utils/calc/safeOperators";
import type {
    ProcessCostComponentKey,
    ProcessCostingEquivalentUnits,
    ProcessCostingInput,
    ProcessCostingMoneyBreakdown,
    ProcessCostingResult,
} from "./processCosting.types";

const COMPONENT_ORDER: ProcessCostComponentKey[] = [
    "transferredIn",
    "materials",
    "labor",
    "overhead",
    "conversion",
];

function emptyBreakdown(): ProcessCostingMoneyBreakdown {
    return {
        transferredIn: 0,
        materials: 0,
        labor: 0,
        overhead: 0,
        conversion: 0,
    };
}

function clampPercent(value: number) {
    return Math.max(0, Math.min(100, value));
}

function resolveMaterialsPercent(input: ProcessCostingInput) {
    if (input.materialsTimingMode === "beginning") return 100;
    if (input.materialsTimingMode === "end") return 0;
    return clampPercent(input.customMaterialsCompletionPercent);
}

function activeComponentKeys(input: ProcessCostingInput) {
    return COMPONENT_ORDER.filter((component) => {
        if (component === "transferredIn") return input.includeTransferredIn;
        if (input.costSplitMode === "conversion") {
            return component === "materials" || component === "conversion";
        }
        return component !== "conversion";
    });
}

function getBeginningCompletionPercent(
    input: ProcessCostingInput,
    component: ProcessCostComponentKey
) {
    switch (component) {
        case "transferredIn":
            return input.includeTransferredIn ? 100 : 0;
        case "materials":
            return clampPercent(input.beginningMaterialsCompletionPercent);
        case "labor":
            return clampPercent(input.beginningLaborCompletionPercent);
        case "overhead":
            return clampPercent(input.beginningOverheadCompletionPercent);
        case "conversion":
            return clampPercent(input.beginningConversionCompletionPercent);
    }
}

function getEndingCompletionPercent(
    input: ProcessCostingInput,
    component: ProcessCostComponentKey
) {
    switch (component) {
        case "transferredIn":
            return input.includeTransferredIn ? 100 : 0;
        case "materials":
            return resolveMaterialsPercent(input);
        case "labor":
            return clampPercent(input.endingLaborCompletionPercent);
        case "overhead":
            return clampPercent(input.endingOverheadCompletionPercent);
        case "conversion":
            return clampPercent(input.endingConversionCompletionPercent);
    }
}

function getBeginningCost(
    input: ProcessCostingInput,
    component: ProcessCostComponentKey
) {
    switch (component) {
        case "transferredIn":
            return input.beginningTransferredInCost;
        case "materials":
            return input.beginningMaterialsCost;
        case "labor":
            return input.beginningLaborCost;
        case "overhead":
            return input.beginningOverheadCost;
        case "conversion":
            return safeAdd(input.beginningLaborCost, input.beginningOverheadCost);
    }
}

function getCurrentCost(input: ProcessCostingInput, component: ProcessCostComponentKey) {
    switch (component) {
        case "transferredIn":
            return input.currentTransferredInCost;
        case "materials":
            return input.currentMaterialsCost;
        case "labor":
            return input.currentLaborCost;
        case "overhead":
            return input.currentOverheadCost;
        case "conversion":
            return safeAdd(input.currentLaborCost, input.currentOverheadCost);
    }
}

function applyBreakdownTotal(breakdown: ProcessCostingMoneyBreakdown) {
    return roundTo(
        COMPONENT_ORDER.reduce((sum, key) => safeAdd(sum, breakdown[key]), 0),
        2
    );
}

function calculateWeightedAverageEquivalentUnits(
    input: ProcessCostingInput
): ProcessCostingEquivalentUnits {
    const equivalentUnits = emptyBreakdown();

    activeComponentKeys(input).forEach((component) => {
        equivalentUnits[component] = roundTo(
            safeAdd(
                input.unitsCompletedAndTransferred,
                safeMultiply(
                    input.endingWipUnits,
                    getEndingCompletionPercent(input, component) / 100
                )
            ),
            4
        );
    });

    return equivalentUnits;
}

function calculateFifoEquivalentUnits(input: ProcessCostingInput) {
    const equivalentUnits = emptyBreakdown();
    const unitsStartedAndCompleted = Math.max(
        0,
        safeSubtract(input.unitsCompletedAndTransferred, input.beginningWipUnits)
    );

    activeComponentKeys(input).forEach((component) => {
        const toCompleteBeginning =
            component === "transferredIn"
                ? 0
                : safeMultiply(
                      input.beginningWipUnits,
                      1 - getBeginningCompletionPercent(input, component) / 100
                  );
        const ending = safeMultiply(
            input.endingWipUnits,
            getEndingCompletionPercent(input, component) / 100
        );

        equivalentUnits[component] = roundTo(
            safeAdd(safeAdd(toCompleteBeginning, unitsStartedAndCompleted), ending),
            4
        );
    });

    return {
        equivalentUnits,
        unitsStartedAndCompleted,
    };
}

function calculateCostPerEquivalentUnit(
    input: ProcessCostingInput,
    equivalentUnits: ProcessCostingEquivalentUnits
) {
    const breakdown = emptyBreakdown();
    activeComponentKeys(input).forEach((component) => {
        const numerator =
            input.method === "weighted-average"
                ? safeAdd(getBeginningCost(input, component), getCurrentCost(input, component))
                : getCurrentCost(input, component);
        breakdown[component] = roundTo(
            safeDivide(numerator, equivalentUnits[component], 0),
            6
        );
    });
    return breakdown;
}

function calculateTransferredOutBreakdown(
    input: ProcessCostingInput,
    costPerEquivalentUnit: ProcessCostingMoneyBreakdown,
    unitsStartedAndCompleted: number
) {
    const breakdown = emptyBreakdown();

    if (input.method === "weighted-average") {
        activeComponentKeys(input).forEach((component) => {
            breakdown[component] = roundTo(
                safeMultiply(input.unitsCompletedAndTransferred, costPerEquivalentUnit[component]),
                2
            );
        });
        return breakdown;
    }

    activeComponentKeys(input).forEach((component) => {
        const beginningCarry = getBeginningCost(input, component);
        const beginningCompletionCost =
            component === "transferredIn"
                ? 0
                : safeMultiply(
                      safeMultiply(
                          input.beginningWipUnits,
                          1 - getBeginningCompletionPercent(input, component) / 100
                      ),
                      costPerEquivalentUnit[component]
                  );
        const startedAndCompletedCost = safeMultiply(
            unitsStartedAndCompleted,
            costPerEquivalentUnit[component]
        );

        breakdown[component] = roundTo(
            safeAdd(safeAdd(beginningCarry, beginningCompletionCost), startedAndCompletedCost),
            2
        );
    });

    return breakdown;
}

function calculateEndingWipBreakdown(
    input: ProcessCostingInput,
    costPerEquivalentUnit: ProcessCostingMoneyBreakdown
) {
    const breakdown = emptyBreakdown();

    activeComponentKeys(input).forEach((component) => {
        breakdown[component] = roundTo(
            safeMultiply(
                safeMultiply(
                    input.endingWipUnits,
                    getEndingCompletionPercent(input, component) / 100
                ),
                costPerEquivalentUnit[component]
            ),
            2
        );
    });

    return breakdown;
}

function buildCostsToBeAccountedFor(input: ProcessCostingInput) {
    const breakdown = emptyBreakdown();
    activeComponentKeys(input).forEach((component) => {
        breakdown[component] = roundTo(
            safeAdd(getBeginningCost(input, component), getCurrentCost(input, component)),
            2
        );
    });
    return breakdown;
}

function buildCurrentCostsAdded(input: ProcessCostingInput) {
    const breakdown = emptyBreakdown();
    activeComponentKeys(input).forEach((component) => {
        breakdown[component] = roundTo(getCurrentCost(input, component), 2);
    });
    return breakdown;
}

function buildValidationWarnings(
    input: ProcessCostingInput,
    result: Omit<
        ProcessCostingResult,
        "comparisonWarnings" | "validationWarnings"
    >
) {
    const warnings: string[] = [];

    if (input.unitsCompletedAndTransferred > result.totalUnitsToAccountFor) {
        warnings.push("Completed and transferred units exceed total units to account for.");
    }

    if (Math.abs(result.unitReconciliationDifference) > 0.005) {
        warnings.push("Unit flow does not reconcile. Review beginning WIP, units started/received, completed, and ending WIP.");
    }

    if (Math.abs(result.costReconciliationDifference) > 0.5) {
        warnings.push("Costs to be accounted for do not reconcile with costs accounted for.");
    }

    if (input.method === "fifo" && input.beginningWipUnits > input.unitsCompletedAndTransferred) {
        warnings.push("FIFO usually requires completed units to at least cover beginning WIP if beginning work was finished this period.");
    }

    if (
        input.includeTransferredIn &&
        result.costPerEquivalentUnit.transferredIn === 0 &&
        input.currentTransferredInCost + input.beginningTransferredInCost > 0
    ) {
        warnings.push("Transferred-in costs were entered but transferred-in equivalent units are zero.");
    }

    if (input.materialsTimingMode === "end" && input.endingWipUnits > 0) {
        warnings.push("Materials-at-end mode treats ending WIP as carrying no material cost unless you switch to a custom completion point.");
    }

    return warnings;
}

function buildComparisonWarnings(input: ProcessCostingInput, result: ProcessCostingResult) {
    const warnings: string[] = [];

    if (
        typeof input.extractedCompletedCost === "number" &&
        Math.abs(input.extractedCompletedCost - result.totalTransferredOutCost) > 1
    ) {
        warnings.push("The scanned completed/transferred-out total does not match the system-computed total.");
    }

    if (
        typeof input.extractedEndingWipCost === "number" &&
        Math.abs(input.extractedEndingWipCost - result.totalEndingWipCost) > 1
    ) {
        warnings.push("The scanned ending WIP amount does not reconcile with the computed ending WIP cost.");
    }

    if (
        typeof input.extractedCostPerEquivalentUnit === "number" &&
        activeComponentKeys(input).every(
            (component) =>
                Math.abs(
                    result.costPerEquivalentUnit[component] - input.extractedCostPerEquivalentUnit!
                ) > 0.5
        )
    ) {
        warnings.push("The scanned cost per equivalent unit appears to use a different denominator or method.");
    }

    return warnings;
}

export function computeProcessCosting(input: ProcessCostingInput): ProcessCostingResult {
    const totalUnitsToAccountFor = roundTo(
        safeAdd(input.beginningWipUnits, input.unitsStartedOrReceived),
        4
    );
    const totalUnitsAccountedFor = roundTo(
        safeAdd(input.unitsCompletedAndTransferred, input.endingWipUnits),
        4
    );
    const fifoEquivalent = calculateFifoEquivalentUnits(input);
    const equivalentUnits =
        input.method === "weighted-average"
            ? calculateWeightedAverageEquivalentUnits(input)
            : fifoEquivalent.equivalentUnits;
    const unitsStartedAndCompleted =
        input.method === "weighted-average"
            ? Math.max(
                  0,
                  safeSubtract(input.unitsCompletedAndTransferred, input.beginningWipUnits)
              )
            : fifoEquivalent.unitsStartedAndCompleted;
    const costPerEquivalentUnit = calculateCostPerEquivalentUnit(input, equivalentUnits);
    const transferredOutBreakdown = calculateTransferredOutBreakdown(
        input,
        costPerEquivalentUnit,
        unitsStartedAndCompleted
    );
    const endingWipBreakdown = calculateEndingWipBreakdown(input, costPerEquivalentUnit);
    const costsToBeAccountedFor = buildCostsToBeAccountedFor(input);
    const currentCostsAdded = buildCurrentCostsAdded(input);
    const totalCostsToAccountFor = applyBreakdownTotal(costsToBeAccountedFor);
    const totalTransferredOutCost = applyBreakdownTotal(transferredOutBreakdown);
    const totalEndingWipCost = applyBreakdownTotal(endingWipBreakdown);
    const totalCostsAccountedFor = roundTo(
        safeAdd(totalTransferredOutCost, totalEndingWipCost),
        2
    );

    const baseResult = {
        method: input.method,
        costSplitMode: input.costSplitMode,
        includeTransferredIn: input.includeTransferredIn,
        totalUnitsToAccountFor,
        totalUnitsAccountedFor,
        unitReconciliationDifference: roundTo(
            safeSubtract(totalUnitsToAccountFor, totalUnitsAccountedFor),
            4
        ),
        unitsStartedAndCompleted: roundTo(unitsStartedAndCompleted, 4),
        equivalentUnits,
        costPerEquivalentUnit,
        transferredOutBreakdown,
        endingWipBreakdown,
        costsToBeAccountedFor,
        currentCostsAdded,
        totalCostsToAccountFor,
        totalCostsAccountedFor,
        totalTransferredOutCost,
        totalEndingWipCost,
        costReconciliationDifference: roundTo(
            safeSubtract(totalCostsToAccountFor, totalCostsAccountedFor),
            2
        ),
    };

    const result: ProcessCostingResult = {
        ...baseResult,
        comparisonWarnings: [],
        validationWarnings: [],
    };

    result.validationWarnings = buildValidationWarnings(input, baseResult);
    result.comparisonWarnings = buildComparisonWarnings(input, result);

    return result;
}
