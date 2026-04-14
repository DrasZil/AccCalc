import type { WorkpaperTransferBundle } from "./workpaperTypes.js";
import { createCell, createWorkpaperId, getCellKey } from "./workpaperUtils.js";

type BundleConfig = {
    title: string;
    description: string;
    topic: string;
    sheetTitle: string;
    rowCount: number;
    columnCount: number;
    note?: string;
    recommendedTemplateIds?: string[];
    rows: string[][];
    sourceSummary: string;
    sourcePath: string;
};

function bundleFromRows(config: BundleConfig): WorkpaperTransferBundle {
    const createdAt = Date.now();
    const cells = Object.fromEntries(
        config.rows.flatMap((row, rowIndex) =>
            row.flatMap((value, columnIndex) =>
                value === "" ? [] : [[getCellKey(rowIndex, columnIndex), createCell(value)]]
            )
        )
    );

    return {
        id: createWorkpaperId("transfer"),
        title: config.title,
        description: config.description,
        topic: config.topic,
        createdAt,
        recommendedTemplateIds: config.recommendedTemplateIds,
        source: {
            id: createWorkpaperId("source"),
            kind: "calculator",
            title: config.title,
            path: config.sourcePath,
            summary: config.sourceSummary,
            capturedAt: createdAt,
        },
        sheet: {
            title: config.sheetTitle,
            kind: "calculator",
            rowCount: config.rowCount,
            columnCount: config.columnCount,
            note: config.note,
            cells,
        },
    };
}

export function buildCvpTransferBundle(input: {
    fixedCosts: string;
    sellingPricePerUnit: string;
    variableCostPerUnit: string;
    targetProfit: string;
    expectedUnitSales: string;
    result: {
        contributionMarginPerUnit: number;
        contributionMarginRatio: number;
        breakEvenUnits: number;
        breakEvenSales: number;
        targetUnits: number;
        targetSales: number;
        expectedSales: number;
        marginOfSafetyAmount: number;
        marginOfSafetyRatio: number;
        operatingIncome: number;
        degreeOfOperatingLeverage: number;
    } | null;
}) {
    if (!input.result) return null;

    return bundleFromRows({
        title: "CVP Analysis workpaper",
        description: "Structured export from the CVP Analysis calculator.",
        topic: "Cost & Managerial",
        sheetTitle: "CVP Analysis",
        rowCount: 16,
        columnCount: 4,
        note: "Use this exported sheet to compare assumptions, add sensitivity notes, or append classroom interpretation.",
        recommendedTemplateIds: ["cvp-analysis"],
        sourcePath: "/business/cvp-analysis",
        sourceSummary: `Fixed ${input.fixedCosts}, price ${input.sellingPricePerUnit}, variable ${input.variableCostPerUnit}, target ${input.targetProfit}, expected units ${input.expectedUnitSales}.`,
        rows: [
            ["CVP Analysis Export", "", "", ""],
            ["Input", "Amount", "", ""],
            ["Fixed Costs", input.fixedCosts, "", ""],
            ["Selling Price / Unit", input.sellingPricePerUnit, "", ""],
            ["Variable Cost / Unit", input.variableCostPerUnit, "", ""],
            ["Target Profit", input.targetProfit, "", ""],
            ["Expected Unit Sales", input.expectedUnitSales, "", ""],
            ["Result", "Value", "", ""],
            ["Contribution Margin / Unit", String(input.result.contributionMarginPerUnit), "", ""],
            ["Contribution Margin Ratio", String(input.result.contributionMarginRatio), "", ""],
            ["Break-even Units", String(input.result.breakEvenUnits), "", ""],
            ["Break-even Sales", String(input.result.breakEvenSales), "", ""],
            ["Required Units", String(input.result.targetUnits), "", ""],
            ["Required Sales", String(input.result.targetSales), "", ""],
            ["Margin of Safety", String(input.result.marginOfSafetyAmount), String(input.result.marginOfSafetyRatio), ""],
            ["Operating Leverage", String(input.result.degreeOfOperatingLeverage), String(input.result.operatingIncome), ""],
        ],
    });
}

export function buildTimedScheduleTransferBundle(config: {
    title: string;
    description: string;
    topic: string;
    sourcePath: string;
    sourceSummary: string;
    recommendedTemplateId: string;
    totalLabel: string;
    endingLabel: string;
    totalValue: number;
    endingValue: number;
    scheduledPercent: number;
    rows: Array<{
        label: string;
        amount: number;
        totalScheduled: number;
        contributions: Array<{ sourceLabel: string; percent: number; amount: number }>;
    }>;
}) {
    const bodyRows = config.rows.flatMap((row) => [
        [row.label, String(row.amount), "", "", String(row.totalScheduled)],
        ...row.contributions.map((contribution) => [
            `  ${contribution.sourceLabel}`,
            "",
            `${contribution.percent.toFixed(2)}%`,
            String(contribution.amount),
            "",
        ]),
    ]);

    return bundleFromRows({
        title: config.title,
        description: config.description,
        topic: config.topic,
        sheetTitle: config.title,
        rowCount: Math.max(12, bodyRows.length + 8),
        columnCount: 5,
        note: "The transferred rows preserve the period-by-period schedule and source contributions for traceable review.",
        recommendedTemplateIds: [config.recommendedTemplateId],
        sourcePath: config.sourcePath,
        sourceSummary: config.sourceSummary,
        rows: [
            [config.title, "", "", "", ""],
            ["Period", "Base Amount", "Percent", "Contribution", "Scheduled Total"],
            ...bodyRows,
            [config.totalLabel, String(config.totalValue), "", "", ""],
            [config.endingLabel, String(config.endingValue), "", "", ""],
            ["Pattern Total", `${config.scheduledPercent.toFixed(2)}%`, "", "", ""],
        ],
    });
}

export function buildCashBudgetTransferBundle(input: {
    beginningCashBalance: string;
    cashCollections: string;
    cashDisbursements: string;
    minimumCashBalance: string;
    result: {
        totalCashAvailable: number;
        excessOrDeficiencyBeforeFinancing: number;
        financingNeeded: number;
        endingCashAfterFinancing: number;
        excessCashAfterFinancing: number;
    } | null;
}) {
    if (!input.result) return null;

    return bundleFromRows({
        title: "Cash Budget workpaper",
        description: "Structured export from the Cash Budget calculator.",
        topic: "Cost & Managerial",
        sheetTitle: "Cash Budget",
        rowCount: 12,
        columnCount: 3,
        note: "Use this sheet as a bridge between collections, disbursements, and financing support.",
        recommendedTemplateIds: ["cash-budget-support"],
        sourcePath: "/business/cash-budget",
        sourceSummary: `Beginning cash ${input.beginningCashBalance}, collections ${input.cashCollections}, disbursements ${input.cashDisbursements}, minimum cash ${input.minimumCashBalance}.`,
        rows: [
            ["Cash Budget Export", "", ""],
            ["Beginning Cash Balance", input.beginningCashBalance, ""],
            ["Cash Collections", input.cashCollections, ""],
            ["Cash Disbursements", input.cashDisbursements, ""],
            ["Minimum Cash Balance", input.minimumCashBalance, ""],
            ["Total Cash Available", String(input.result.totalCashAvailable), ""],
            ["Excess / Deficiency Before Financing", String(input.result.excessOrDeficiencyBeforeFinancing), ""],
            ["Financing Needed", String(input.result.financingNeeded), ""],
            ["Ending Cash After Financing", String(input.result.endingCashAfterFinancing), ""],
            ["Excess Cash After Financing", String(input.result.excessCashAfterFinancing), ""],
        ],
    });
}

export function buildHighLowTransferBundle(input: {
    highActivityUnits: string;
    highTotalCost: string;
    lowActivityUnits: string;
    lowTotalCost: string;
    expectedActivityUnits: string;
    result: {
        variableCostPerUnit: number;
        fixedCostEstimate: number;
        activitySpread: number;
        costFormula: string;
        estimatedTotalCost: number | null;
    } | null;
}) {
    if (!input.result) return null;

    return bundleFromRows({
        title: "High-Low cost workpaper",
        description: "Structured export from the High-Low Cost Estimation calculator.",
        topic: "Cost & Managerial",
        sheetTitle: "High-Low Analysis",
        rowCount: 12,
        columnCount: 3,
        note: "Keep this sheet with mixed-cost assumptions, outlier notes, and expected-activity comparisons.",
        recommendedTemplateIds: ["cvp-analysis"],
        sourcePath: "/business/high-low-cost-estimation",
        sourceSummary: `High ${input.highActivityUnits}/${input.highTotalCost}, low ${input.lowActivityUnits}/${input.lowTotalCost}.`,
        rows: [
            ["High-Low Cost Estimation", "", ""],
            ["High Activity Units", input.highActivityUnits, ""],
            ["High Total Cost", input.highTotalCost, ""],
            ["Low Activity Units", input.lowActivityUnits, ""],
            ["Low Total Cost", input.lowTotalCost, ""],
            ["Expected Activity Units", input.expectedActivityUnits || "", ""],
            ["Variable Cost / Unit", String(input.result.variableCostPerUnit), ""],
            ["Estimated Fixed Cost", String(input.result.fixedCostEstimate), ""],
            ["Activity Spread", String(input.result.activitySpread), ""],
            ["Cost Formula", input.result.costFormula, ""],
            ["Estimated Total Cost", input.result.estimatedTotalCost === null ? "" : String(input.result.estimatedTotalCost), ""],
        ],
    });
}

export function buildRoiTransferBundle(input: {
    operatingIncome: string;
    investedCapital: string;
    targetRatePercent: string;
    sales: string;
    result: {
        roi: number;
        capitalCharge: number;
        residualIncome: number;
        eva: number;
        profitMargin: number;
        investmentTurnover: number;
    } | null;
}) {
    if (!input.result) return null;

    return bundleFromRows({
        title: "ROI, RI, and EVA workpaper",
        description: "Structured export from the ROI, RI, and EVA workspace.",
        topic: "Cost & Managerial",
        sheetTitle: "ROI RI EVA",
        rowCount: 12,
        columnCount: 3,
        note: "Use this sheet for divisional-performance comparisons and capital-charge commentary.",
        recommendedTemplateIds: [],
        sourcePath: "/business/roi-ri-eva",
        sourceSummary: `Income ${input.operatingIncome}, capital ${input.investedCapital}, target rate ${input.targetRatePercent}, sales ${input.sales || "0"}.`,
        rows: [
            ["ROI, RI, and EVA Export", "", ""],
            ["Operating Income", input.operatingIncome, ""],
            ["Invested Capital", input.investedCapital, ""],
            ["Target Rate", input.targetRatePercent, ""],
            ["Sales", input.sales || "", ""],
            ["ROI", String(input.result.roi), ""],
            ["Capital Charge", String(input.result.capitalCharge), ""],
            ["Residual Income", String(input.result.residualIncome), ""],
            ["EVA-style Read", String(input.result.eva), ""],
            ["Profit Margin", String(input.result.profitMargin), ""],
            ["Investment Turnover", String(input.result.investmentTurnover), ""],
        ],
    });
}

export function buildEoqTransferBundle(input: {
    annualDemandUnits: string;
    orderingCostPerOrder: string;
    annualCarryingCostPerUnit: string;
    dailyDemandUnits: string;
    leadTimeDays: string;
    safetyStockUnits: string;
    result: {
        eoq: number;
        ordersPerYear: number;
        averageInventoryUnits: number;
        annualOrderingCost: number;
        annualCarryingCost: number;
        relevantInventoryCost: number;
        reorderPointUnits: number;
    } | null;
}) {
    if (!input.result) return null;

    return bundleFromRows({
        title: "EOQ and reorder workpaper",
        description: "Structured export from the EOQ and Reorder Point calculator.",
        topic: "Operations & Supply Chain",
        sheetTitle: "EOQ and Reorder Point",
        rowCount: 14,
        columnCount: 3,
        note: "Use this workpaper to compare inventory policy assumptions and supplier changes over time.",
        recommendedTemplateIds: ["inventory-planning"],
        sourcePath: "/operations/eoq-and-reorder-point",
        sourceSummary: `Annual demand ${input.annualDemandUnits}, order cost ${input.orderingCostPerOrder}, carrying ${input.annualCarryingCostPerUnit}.`,
        rows: [
            ["EOQ and Reorder Point Export", "", ""],
            ["Annual Demand Units", input.annualDemandUnits, ""],
            ["Ordering Cost / Order", input.orderingCostPerOrder, ""],
            ["Annual Carrying Cost / Unit", input.annualCarryingCostPerUnit, ""],
            ["Daily Demand Units", input.dailyDemandUnits, ""],
            ["Lead Time Days", input.leadTimeDays, ""],
            ["Safety Stock Units", input.safetyStockUnits || "0", ""],
            ["EOQ", String(input.result.eoq), ""],
            ["Orders / Year", String(input.result.ordersPerYear), ""],
            ["Average Inventory Units", String(input.result.averageInventoryUnits), ""],
            ["Annual Ordering Cost", String(input.result.annualOrderingCost), ""],
            ["Annual Carrying Cost", String(input.result.annualCarryingCost), ""],
            ["Relevant Inventory Cost", String(input.result.relevantInventoryCost), ""],
            ["Reorder Point Units", String(input.result.reorderPointUnits), ""],
        ],
    });
}
