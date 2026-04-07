export type ProcessCostingMethod = "weighted-average" | "fifo";
export type MaterialsTimingMode = "beginning" | "end" | "custom";
export type CostSplitMode = "separate" | "conversion";
export type ProcessCostingVariant =
    | "workspace"
    | "equivalent-units"
    | "cost-per-eu"
    | "report"
    | "department-1"
    | "department-2"
    | "weighted-average"
    | "fifo"
    | "reconciliation"
    | "practice-checker"
    | "transferred-in";

export type ProcessCostingInput = {
    departmentLabel: string;
    method: ProcessCostingMethod;
    materialsTimingMode: MaterialsTimingMode;
    costSplitMode: CostSplitMode;
    includeTransferredIn: boolean;
    beginningWipUnits: number;
    unitsStartedOrReceived: number;
    unitsCompletedAndTransferred: number;
    endingWipUnits: number;
    beginningMaterialsCompletionPercent: number;
    beginningConversionCompletionPercent: number;
    beginningLaborCompletionPercent: number;
    beginningOverheadCompletionPercent: number;
    endingMaterialsCompletionPercent: number;
    endingConversionCompletionPercent: number;
    endingLaborCompletionPercent: number;
    endingOverheadCompletionPercent: number;
    customMaterialsCompletionPercent: number;
    beginningTransferredInCost: number;
    beginningMaterialsCost: number;
    beginningLaborCost: number;
    beginningOverheadCost: number;
    currentTransferredInCost: number;
    currentMaterialsCost: number;
    currentLaborCost: number;
    currentOverheadCost: number;
    extractedCompletedCost?: number | null;
    extractedEndingWipCost?: number | null;
    extractedCostPerEquivalentUnit?: number | null;
    extractedPageSummary?: string | null;
};

export type ProcessCostComponentKey =
    | "transferredIn"
    | "materials"
    | "labor"
    | "overhead"
    | "conversion";

export type ProcessCostingEquivalentUnits = Record<ProcessCostComponentKey, number>;
export type ProcessCostingMoneyBreakdown = Record<ProcessCostComponentKey, number>;

export type ProcessCostingResult = {
    method: ProcessCostingMethod;
    costSplitMode: CostSplitMode;
    includeTransferredIn: boolean;
    totalUnitsToAccountFor: number;
    totalUnitsAccountedFor: number;
    unitReconciliationDifference: number;
    unitsStartedAndCompleted: number;
    equivalentUnits: ProcessCostingEquivalentUnits;
    costPerEquivalentUnit: ProcessCostingMoneyBreakdown;
    transferredOutBreakdown: ProcessCostingMoneyBreakdown;
    endingWipBreakdown: ProcessCostingMoneyBreakdown;
    costsToBeAccountedFor: ProcessCostingMoneyBreakdown;
    currentCostsAdded: ProcessCostingMoneyBreakdown;
    totalCostsToAccountFor: number;
    totalCostsAccountedFor: number;
    totalTransferredOutCost: number;
    totalEndingWipCost: number;
    costReconciliationDifference: number;
    comparisonWarnings: string[];
    validationWarnings: string[];
};
