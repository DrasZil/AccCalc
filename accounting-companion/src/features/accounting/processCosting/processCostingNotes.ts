import formatPHP from "../../../utils/formatPHP";
import type { ProcessCostingInput, ProcessCostingResult } from "./processCosting.types";

export function buildProcessCostingNotes(
    input: ProcessCostingInput,
    result: ProcessCostingResult
) {
    const methodLabel =
        input.method === "fifo" ? "FIFO process costing" : "weighted-average process costing";
    const costModeLabel =
        input.costSplitMode === "conversion"
            ? "combined conversion-cost mode"
            : "separate materials, labor, and overhead mode";
    const materialsTimingLabel =
        input.materialsTimingMode === "beginning"
            ? "materials added at the beginning"
            : input.materialsTimingMode === "end"
              ? "materials added at the end"
              : `custom materials completion at ${input.customMaterialsCompletionPercent}%`;

    return {
        meaning: `This worksheet uses ${methodLabel} with ${costModeLabel}. ${materialsTimingLabel} changes the equivalent-unit denominator and directly affects ending-WIP valuation.`,
        practicalMeaning: input.includeTransferredIn
            ? "Transferred-in cost behaves like another material layer from the prior department. If it is omitted or given the wrong denominator, department 2 costs usually stop reconciling."
            : "Department 1 costing focuses on current materials and conversion flow. The cleanest manual check is to reconcile units first, then equivalent units, then total cost assignment.",
        commonMistakes: [
            "Using weighted-average denominators when the question actually asks for FIFO current-period equivalent units.",
            "Forgetting that materials timing can make ending WIP carry full, zero, or custom material cost.",
            "Letting completed and transferred-out cost ignore beginning WIP carry-forward in FIFO problems.",
            "Treating transferred-in cost as part of current conversion instead of its own carry-forward stream.",
        ],
        studyTip: `Manual check: verify units to account for, equivalent units by component, cost per equivalent unit, then confirm that ${formatPHP(result.totalCostsToAccountFor)} equals ${formatPHP(result.totalCostsAccountedFor)}.`,
        whyThisDenominator:
            input.method === "fifo"
                ? "FIFO cost per equivalent unit uses current-period costs divided by current-period equivalent units only, because beginning WIP cost is carried separately."
                : "Weighted-average cost per equivalent unit blends beginning WIP cost with current cost, so the denominator covers all equivalent units completed this period plus ending WIP.",
    };
}
