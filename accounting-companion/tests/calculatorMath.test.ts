import assert from "node:assert/strict";
import {
    computeBreakEven,
    computeBankReconciliation,
    computeBookTaxDifference,
    computeBondAmortizationSchedule,
    computeBorrowingCostsCapitalization,
    computeBudgetVarianceAnalysis,
    computeBusinessCombination,
    computeCashDiscount,
    computeCashBudget,
    computeCashCollectionsSchedule,
    computeCashConversionCycle,
    computeCashDisbursementsSchedule,
    computeCashRatio,
    computePettyCashReconciliation,
    computeCapitalBudgetingComparison,
    computeCapitalRationingSelection,
    computeCapacityUtilization,
    computeConstructionRevenue,
    computeCustomerPayback,
    computeCoefficientOfVariation,
    computeCommonSizeStatement,
    computeConfidenceInterval,
    computeCompoundInterest,
    computeElasticityShift,
    computeCurrentRatio,
    computeDepreciationComparisonSchedule,
    computeDupontAnalysis,
    computeDiscountedPaybackPeriod,
    computeDoubleDecliningBalance,
    computeEconomicOrderQuantity,
    computeEffectiveAnnualRate,
    computeEquivalentUnitsWeightedAverage,
    computeEquityMultiplier,
    computeEarningsQuality,
    computeFlexibleBudget,
    computeFutureValue,
    computeFutureValueOfOrdinaryAnnuity,
    computeFactoryOverheadVariances,
    computeFranchiseRevenue,
    computeForeignCurrencyTranslation,
    computeGrossProfitRate,
    computeHorizontalAnalysisWorkspace,
    computeHighLowCostEstimation,
    computeInternalRateOfReturn,
    computeImpairmentLoss,
    computeInventoryBudget,
    computeInventoryShrinkage,
    computeInventoryMethodComparison,
    computeJobOrderCostSheet,
    computeLaborEfficiencyVariance,
    computeLoanAmortization,
    computeLoanAmortizationSchedule,
    computeLowerOfCostOrNrv,
    computeMarkupMargin,
    computeMaterialsQuantityVariance,
    computeNetPresentValue,
    computeOwnerSplit,
    computePartnershipAdmissionBonus,
    computePartnershipAdmissionGoodwill,
    computePartnerCapitalEndingBalance,
    computePartnershipProfitSharing,
    computePartnershipRetirementBonus,
    computePartnershipSalaryInterestAllocation,
    computeOperatingExpenseBudget,
    computeSalesBudget,
    computePaybackPeriod,
    computePresentValue,
    computePresentValueOfOrdinaryAnnuity,
    computeProductionBudget,
    computePrepaidExpenseAdjustment,
    computePricingPlanner,
    computeProfitabilityIndex,
    computeProvisionExpectedValue,
    computePriceElasticity,
    computeQuickRatio,
    computeRealInterestRate,
    computeRatioAnalysisWorkspace,
    computeRetailMarkupMarkdown,
    computeRoiRiEva,
    computeReceivablesAgingSchedule,
    computeShareBasedPayment,
    computeAccruedExpenseAdjustment,
    computeAccruedRevenueAdjustment,
    computeSalesForecast,
    computeSalesMixBreakEven,
    computeSimpleInterest,
    computeSinkingFundDeposit,
    computeStatementOfCashFlows,
    computeStandardDeviation,
    computeStartupCostPlan,
    computeStraightLineDepreciation,
    computeDirectMaterialsPurchasesBudget,
    computeDirectLaborBudget,
    computeUnearnedRevenueAdjustment,
    computeTargetProfit,
    computeTradeDiscount,
    computeTransferPricingSupport,
    computeTrialBalance,
    computeTurnoverWithDayBasis,
    computeUnitEconomics,
    computeAssetDisposal,
    computeBudgetedIncomeStatement,
    computeEquityMethodInvestment,
    computeFactoryOverheadBudget,
    computeIntercompanyInventoryProfit,
    computeIntercompanyPpeTransfer,
    computeNotesReceivableDiscounting,
    computeStatementOfChangesInEquity,
    computeVatReconciliation,
    computeWithholdingTax,
    computeWeightedMean,
    computeWorkingCapitalCycle,
    computeLeaseMeasurement,
    computeMarketEquilibrium,
    computeMakeOrBuyDecision,
    computeMovingAverageForecast,
    computeSurplusAtEquilibrium,
    computeSellProcessFurther,
    computeSpecialOrderDecision,
    computeCashRunway,
    computeConstrainedResourceProductMix,
    computeSegmentMargin,
    computeAuditSamplingPlan,
    computeAuditMisstatementEvaluation,
    computePertEstimate,
    computeQuasiReorganization,
    computeCorporateLiquidation,
    computeBusinessContinuityReadiness,
    computeBusinessCaseScore,
    computeActivityBasedCosting,
    computeSegregationOfDutiesConflict,
    computeControlEnvironmentStrength,
    computeGovernanceEscalationPlan,
    computeFinancialAssetAmortizedCost,
    computeInvestmentPropertyMeasurement,
    computeJointArrangementShare,
    computeQualityControlChart,
    computeRevenueAllocationAnalysis,
    computeTaxableIncomeBridge,
    computeTargetCostingGap,
    computeAuditEvidenceProgram,
} from "../src/utils/calculatorMath.js";
import {
    budgetVarianceAnalysisSolveDefinition,
    breakEvenSolveDefinition,
    budgetedIncomeStatementSolveDefinition,
    constrainedResourceProductMixSolveDefinition,
    currentRatioSolveDefinition,
    directLaborBudgetSolveDefinition,
    makeOrBuyDecisionSolveDefinition,
    movingAverageForecastSolveDefinition,
    priceCostMarginSolveDefinition,
    sellProcessFurtherSolveDefinition,
    simpleInterestSolveDefinition,
    specialOrderDecisionSolveDefinition,
    transferPricingSupportSolveDefinition,
    timeValueSolveDefinition,
} from "../src/utils/formulaSolveDefinitions.js";
import { searchAccountReferences } from "../src/utils/accountingReference.js";
import { searchAppRoutes } from "../src/utils/appSearch.js";
import {
    analyzeSmartInput,
    INITIAL_FIELDS,
} from "../src/features/smart/smartSolver.engine.js";
import { SMART_SOLVER_EVALUATION_PACK } from "../src/features/smart/smartSolver.evaluationPack.js";
import { suggestSolveTarget } from "../src/features/smart/smartSolver.targets.js";
import { parseOcrText } from "../src/features/scan-check/services/ocr/ocrParser.js";
import { recommendScanRoutes } from "../src/features/scan-check/services/ocr/ocrRouting.js";
import { parseNumberList } from "../src/utils/listParsers.js";
import { parseLooseNumber } from "../src/utils/numberParsing.js";
import { getNetworkStatusSnapshot } from "../src/utils/networkStatus.js";
import {
    getResultValueTone,
    isWideResultValue,
    normalizeResultValue,
} from "../src/utils/resultDisplay.js";
import { evaluateCellInput } from "../src/features/workpapers/workpaperFormula.js";
import { getWorkpaperTemplate } from "../src/features/workpapers/workpaperTemplates.js";
import {
    applyStyleToRange,
    clearRangeCells,
    createEmptySheet,
    createSelectionRange,
    createWorkbook,
    duplicateRangeToTarget,
    formatDisplayValue,
    getCellKey,
    getReadableTextColor,
    insertRows,
    MAX_WORKPAPER_COLUMN_COUNT,
    MAX_WORKPAPER_ROW_COUNT,
    resolveWorkpaperCellStyle,
    shiftFormulaReferences,
} from "../src/features/workpapers/workpaperUtils.js";
import type { WorkpaperSheet } from "../src/features/workpapers/workpaperTypes.js";

function assertClose(actual: number, expected: number, precision = 1e-6) {
    assert.ok(
        Math.abs(actual - expected) <= precision,
        `Expected ${actual} to be within ${precision} of ${expected}`
    );
}

function runTest(name: string, assertion: () => void) {
    assertion();
    process.stdout.write(`PASS ${name}\n`);
}

runTest("simple interest matches textbook result", () => {
    const result = computeSimpleInterest({
        principal: 10000,
        annualRatePercent: 12,
        timeYears: 2,
    });

    assertClose(result.interest, 2400);
    assertClose(result.totalAmount, 12400);
});

runTest("compound interest handles quarterly compounding", () => {
    const result = computeCompoundInterest({
        principal: 10000,
        annualRatePercent: 12,
        compoundsPerYear: 4,
        timeYears: 2,
    });

    assertClose(result.totalAmount, 12667.700306, 1e-3);
    assertClose(result.compoundInterest, 2667.700306, 1e-3);
});

runTest("revenue allocation separates satisfaction and contract balance", () => {
    const result = computeRevenueAllocationAnalysis({
        transactionPrice: 120000,
        standaloneSellingPriceA: 90000,
        standaloneSellingPriceB: 60000,
        percentSatisfiedA: 100,
        percentSatisfiedB: 40,
        considerationReceived: 100000,
    });

    assertClose(result.allocationA, 72000);
    assertClose(result.allocationB, 48000);
    assertClose(result.revenueRecognized, 91200);
    assertClose(result.contractLiability, 8800);
});

runTest("taxable income bridge separates current and deferred tax signals", () => {
    const result = computeTaxableIncomeBridge({
        accountingIncome: 1500000,
        permanentAdditions: 80000,
        permanentDeductions: 30000,
        taxableTemporaryDifferences: 120000,
        deductibleTemporaryDifferences: 50000,
        nolDeduction: 0,
        taxRatePercent: 25,
    });

    assertClose(result.taxableIncome, 1620000);
    assertClose(result.currentTaxExpense, 405000);
    assertClose(result.deferredTaxLiability, 30000);
    assertClose(result.deferredTaxAsset, 12500);
});

runTest("target costing identifies remaining cost gap", () => {
    const result = computeTargetCostingGap({
        targetSellingPrice: 950,
        targetProfitMarginPercent: 28,
        expectedUnitVolume: 5000,
        currentEstimatedCostPerUnit: 760,
        committedCostReductionPerUnit: 35,
    });

    assertClose(result.allowableCostPerUnit, 684);
    assertClose(result.revisedCostPerUnit, 725);
    assertClose(result.remainingCostGapPerUnit, 41);
    assertClose(result.totalCostGap, 205000);
});

runTest("audit evidence program scores contradiction pressure", () => {
    const result = computeAuditEvidenceProgram({
        assertionRisk: 4.2,
        evidenceReliability: 3.5,
        evidenceRelevance: 3.2,
        coverageDepth: 2.8,
        contradictionCount: 1,
    });

    assertClose(result.evidenceStrengthAverage, 3.1666666667);
    assertClose(result.contradictionPenalty, 0.6);
    assertClose(result.residualEvidenceGap, 1.63);
});

runTest("present and future value are inverse-style companions", () => {
    const future = computeFutureValue({
        amount: 10000,
        annualRatePercent: 5,
        timeYears: 3,
    });
    const present = computePresentValue({
        amount: future.futureValue,
        annualRatePercent: 5,
        timeYears: 3,
    });

    assertClose(future.futureValue, 11576.25);
    assertClose(present.presentValue, 10000);
});

runTest("loan amortization handles zero-interest loans", () => {
    const result = computeLoanAmortization({
        principal: 120000,
        annualRatePercent: 0,
        termYears: 5,
    });

    assertClose(result.monthlyPayment, 2000);
    assertClose(result.totalPaid, 120000);
    assertClose(result.totalInterest, 0);
});

runTest("loan amortization schedule rolls balances down to zero", () => {
    const schedule = computeLoanAmortizationSchedule({
        principal: 120000,
        annualRatePercent: 6,
        termYears: 5,
    });

    assert.equal(schedule.yearlySummary.length, 5);
    assertClose(schedule.yearlySummary.at(-1)?.endingBalance ?? 0, 0, 1e-4);
    assertClose(schedule.totalPrincipal, 120000, 1e-3);
});

runTest("break-even and target profit compute practical whole units", () => {
    const breakEven = computeBreakEven({
        fixedCosts: 100000,
        sellingPricePerUnit: 250,
        variableCostPerUnit: 150,
    });
    const target = computeTargetProfit({
        fixedCosts: 100000,
        targetProfit: 50000,
        sellingPricePerUnit: 250,
        variableCostPerUnit: 150,
    });

    assertClose(breakEven.breakEvenUnits, 1000);
    assert.equal(breakEven.practicalUnits, 1000);
    assertClose(target.requiredUnits, 1500);
    assert.equal(target.practicalUnits, 1500);
});

runTest("markup and margin stay distinct", () => {
    const result = computeMarkupMargin({
        cost: 500,
        sellingPrice: 800,
    });

    assertClose(result.profit, 300);
    assertClose(result.markup, 60);
    assertClose(result.margin, 37.5);
});

runTest("depreciation helpers respect salvage cap", () => {
    const straightLine = computeStraightLineDepreciation({
        cost: 50000,
        salvageValue: 5000,
        usefulLifeYears: 5,
    });
    const doubleDeclining = computeDoubleDecliningBalance({
        cost: 50000,
        salvageValue: 5000,
        usefulLifeYears: 5,
        yearNumber: 5,
    });

    assertClose(straightLine.annualDepreciation, 9000);
    assert.ok(doubleDeclining.endingBookValue >= 5000);
    assertClose(doubleDeclining.endingBookValue, 5000, 1e-6);
});

runTest("liquidity ratios compute from shared helpers", () => {
    const current = computeCurrentRatio({
        currentAssets: 250000,
        currentLiabilities: 100000,
    });
    const quick = computeQuickRatio({
        cash: 50000,
        marketableSecurities: 25000,
        netReceivables: 40000,
        currentLiabilities: 100000,
    });

    assertClose(current.currentRatio, 2.5);
    assertClose(current.workingCapital, 150000);
    assertClose(quick.quickAssets, 115000);
    assertClose(quick.quickRatio, 1.15);
});

runTest("cash ratio isolates the most liquid assets", () => {
    const result = computeCashRatio(50000, 25000, 100000);

    assertClose(result.cashAssets, 75000);
    assertClose(result.cashRatio, 0.75);
});

runTest("workpaper formulas evaluate references, ranges, and functions", () => {
    const sheet = createEmptySheet({
        title: "Sheet 1",
        rowCount: 6,
        columnCount: 4,
        cells: {
            [getCellKey(0, 0)]: { input: "100" },
            [getCellKey(1, 0)]: { input: "50" },
            [getCellKey(2, 0)]: { input: "=A1+A2" },
            [getCellKey(3, 0)]: { input: "=SUM(A1:A3)" },
            [getCellKey(4, 0)]: { input: "=AVERAGE(A1:A2)" },
        },
    });
    const workbook = createWorkbook({
        title: "Formula test",
        sheets: [sheet],
    });

    assert.equal(evaluateCellInput(workbook, sheet.id, "=A1+A2").display, "150");
    assert.equal(evaluateCellInput(workbook, sheet.id, "=SUM(A1:A3)").display, "300");
    assert.equal(evaluateCellInput(workbook, sheet.id, "=AVERAGE(A1:A2)").display, "75");
});

runTest("workpaper formulas support broader math functions and friendlier errors", () => {
    const sheet = createEmptySheet({
        title: "Math",
        rowCount: 8,
        columnCount: 6,
        cells: {
            [getCellKey(0, 0)]: { input: "200" },
            [getCellKey(1, 0)]: { input: "50" },
            [getCellKey(0, 1)]: { input: "=A1*10%" },
            [getCellKey(1, 1)]: { input: "=POWER(A1/A2,2)" },
            [getCellKey(2, 1)]: { input: "=ROUND(PI(),2)" },
            [getCellKey(3, 1)]: { input: "=PRODUCT(A1:A2)" },
            [getCellKey(4, 1)]: { input: "=MEDIAN(A1:A2,100)" },
        },
    });
    const workbook = createWorkbook({
        title: "Math test",
        sheets: [sheet],
    });

    assert.equal(evaluateCellInput(workbook, sheet.id, "=A1*10%").display, "20");
    assert.equal(evaluateCellInput(workbook, sheet.id, "=POWER(A1/A2,2)").display, "16");
    assert.equal(evaluateCellInput(workbook, sheet.id, "=ROUND(PI(),2)").display, "3.14");
    assert.equal(evaluateCellInput(workbook, sheet.id, "=PRODUCT(A1:A2)").display, "10000");
    assert.equal(evaluateCellInput(workbook, sheet.id, "=MEDIAN(A1:A2,100)").display, "100");
    assert.equal(
        evaluateCellInput(workbook, sheet.id, "=SQRT(-1)").errorMessage,
        "SQRT needs a zero or positive value."
    );
    assert.equal(evaluateCellInput(workbook, sheet.id, "=IF(A1>A2,1,0)").display, "1");
    assert.equal(evaluateCellInput(workbook, sheet.id, "=AND(A1>A2,A2>0)").display, "TRUE");
    assert.equal(evaluateCellInput(workbook, sheet.id, "=OR(A1<0,A2>0)").display, "TRUE");
});

runTest("workpaper cell styles resolve readable contrast without overwriting custom text colors", () => {
    assert.equal(getReadableTextColor("#FEF3C7"), "#0F172A");
    assert.equal(getReadableTextColor("#1D4ED8"), "#F8FAFC");

    const autoContrast = resolveWorkpaperCellStyle({ fillColor: "#1D4ED8" });
    const customText = resolveWorkpaperCellStyle({
        fillColor: "#FEF3C7",
        textColor: "#BE123C",
    });

    assert.equal(autoContrast.effectiveTextColor, "#F8FAFC");
    assert.equal(customText.effectiveTextColor, "#BE123C");
});

runTest("workpaper sheet dimensions are clamped for survivability", () => {
    const sheet = createEmptySheet({
        title: "Oversized Import",
        rowCount: 9999,
        columnCount: 999,
    });

    assert.equal(sheet.rowCount, MAX_WORKPAPER_ROW_COUNT);
    assert.equal(sheet.columnCount, MAX_WORKPAPER_COLUMN_COUNT);
});

runTest("workpaper range helpers support formula shifting, formatting, and structure changes", () => {
    let sheet: WorkpaperSheet = createEmptySheet({
        title: "Ops",
        rowCount: 6,
        columnCount: 4,
        cells: {
            [getCellKey(0, 0)]: { input: "100" },
            [getCellKey(0, 1)]: { input: "=A1*10%" },
        },
    });

    const range = createSelectionRange(
        { rowIndex: 0, columnIndex: 0 },
        { rowIndex: 0, columnIndex: 1 }
    );

    sheet = applyStyleToRange(sheet, range, { numberFormat: "currency", bold: true });
    assert.equal(sheet.cells[getCellKey(0, 0)]?.style?.numberFormat, "currency");
    assert.equal(sheet.cells[getCellKey(0, 1)]?.style?.bold, true);
    assert.equal(shiftFormulaReferences("=A1+B1", 1, 0), "=A2+B2");

    sheet = duplicateRangeToTarget(sheet, range, { rowIndex: 1, columnIndex: 0 });
    assert.equal(sheet.cells[getCellKey(1, 1)]?.input, "=A2*10%");

    sheet = insertRows(sheet, 1, 1);
    assert.equal(sheet.cells[getCellKey(0, 1)]?.input, "=A1*10%");

    sheet = clearRangeCells(
        sheet,
        createSelectionRange({ rowIndex: 0, columnIndex: 0 }, { rowIndex: 0, columnIndex: 0 })
    );
    assert.equal(sheet.cells[getCellKey(0, 0)], undefined);

    assert.equal(formatDisplayValue("1250", { numberFormat: "currency" }), "₱1,250.00");
    assert.equal(formatDisplayValue("15", { numberFormat: "percentage" }), "15.00%");
});

runTest("workpaper templates ship with structured starter workbooks", () => {
    const template = getWorkpaperTemplate("cash-budget-support");
    assert.ok(template);
    const workbook = template?.buildWorkbook();
    assert.ok(workbook);
    assert.equal(workbook?.sheetOrder.length, 1);
    const sheet = workbook?.sheets[workbook.activeSheetId ?? ""];
    assert.ok(sheet);
    assert.equal(sheet?.kind, "template");
    assert.equal(sheet?.templateId, "cash-budget-support");

    const pettyCash = getWorkpaperTemplate("petty-cash-count-sheet");
    const adjustments = getWorkpaperTemplate("adjusting-entries-support");
    const production = getWorkpaperTemplate("production-budget-support");
    const materials = getWorkpaperTemplate("direct-materials-purchases-support");
    const inventoryBudget = getWorkpaperTemplate("inventory-budget-support");
    const operatingExpenseBudget = getWorkpaperTemplate("operating-expense-budget-support");
    const salesBudget = getWorkpaperTemplate("sales-budget-support");
    const vatReconciliation = getWorkpaperTemplate("vat-reconciliation-support");
    const intercompanyElimination = getWorkpaperTemplate("intercompany-inventory-elimination-support");
    const equityRollforward = getWorkpaperTemplate("equity-rollforward-support");
    const transferPricing = getWorkpaperTemplate("transfer-pricing-support");

    assert.ok(pettyCash);
    assert.ok(adjustments);
    assert.ok(production);
    assert.ok(materials);
    assert.ok(inventoryBudget);
    assert.ok(operatingExpenseBudget);
    assert.ok(salesBudget);
    assert.ok(vatReconciliation);
    assert.ok(intercompanyElimination);
    assert.ok(equityRollforward);
    assert.ok(transferPricing);
});

runTest("cash discount and partnership helpers return standard values", () => {
    const cashDiscount = computeCashDiscount({
        invoiceAmount: 10000,
        discountRatePercent: 2,
        discountDays: 10,
        daysPaid: 8,
    });
    const partnership = computePartnershipProfitSharing({
        partnershipAmount: 120000,
        ratioA: 3,
        ratioB: 2,
        ratioC: 1,
    });

    assert.equal(cashDiscount.applied, true);
    assertClose(cashDiscount.discountAmount, 200);
    assertClose(cashDiscount.amountToPay, 9800);
    assertClose(partnership.shareA, 60000);
    assertClose(partnership.shareB, 40000);
    assertClose(partnership.shareC, 20000);
});

runTest("partnership admission methods stay mathematically consistent", () => {
    const bonus = computePartnershipAdmissionBonus(300000, 120000, 25);
    const goodwill = computePartnershipAdmissionGoodwill(300000, 120000, 25);

    assertClose(bonus.totalActualCapital, 420000);
    assertClose(bonus.capitalCredit, 105000);
    assertClose(bonus.bonus, 15000);
    assertClose(goodwill.impliedTotalCapital, 480000);
    assertClose(goodwill.goodwill, 60000);
});

runTest("partnership salary-interest allocation respects remainder mechanics", () => {
    const result = computePartnershipSalaryInterestAllocation({
        partnershipAmount: 150000,
        partnerASalary: 30000,
        partnerBSalary: 25000,
        partnerAAverageCapital: 200000,
        partnerBAverageCapital: 180000,
        interestRatePercent: 10,
        partnerARemainderRatio: 3,
        partnerBRemainderRatio: 2,
    });

    assertClose(result.interestShareA, 20000);
    assertClose(result.interestShareB, 18000);
    assertClose(result.remainder, 57000);
    assertClose(result.finalShareA, 84200);
    assertClose(result.finalShareB, 65800);
});

runTest("partnership retirement bonus identifies the direction of the settlement gap", () => {
    const result = computePartnershipRetirementBonus({
        totalPartnershipCapital: 500000,
        retiringPartnerCapital: 120000,
        settlementPaid: 130000,
    });

    assertClose(result.settlementDifference, 10000);
    assertClose(result.remainingCapitalAfterSettlement, 370000);
    assert.equal(result.direction, "bonus-to-retiring-partner");
});

runTest("partner capital rollforward and equity multiplier stay internally consistent", () => {
    const endingCapital = computePartnerCapitalEndingBalance({
        beginningCapital: 200000,
        additionalInvestment: 30000,
        drawings: 25000,
        incomeShare: 45000,
    });
    const multiplier = computeEquityMultiplier(800000, 320000);

    assertClose(endingCapital, 250000);
    assertClose(multiplier.equityMultiplier, 2.5);
    assertClose(multiplier.financedByDebtPortion, 0.6);
});

runTest("time value helpers handle zero periodic rate edge cases", () => {
    const futureAnnuity = computeFutureValueOfOrdinaryAnnuity(5000, 0, 12);
    const presentAnnuity = computePresentValueOfOrdinaryAnnuity(5000, 0, 12);
    const sinkingFund = computeSinkingFundDeposit(120000, 0, 12);

    assertClose(futureAnnuity.futureValue, 60000);
    assertClose(presentAnnuity.presentValue, 60000);
    assertClose(sinkingFund.requiredDeposit, 10000);
});

runTest("effective annual rate and turnover day basis remain correct", () => {
    const effectiveRate = computeEffectiveAnnualRate(12, 12);
    const turnover = computeTurnoverWithDayBasis({
        numerator: 420000,
        denominator: 70000,
        dayBasis: 365,
    });

    assertClose(effectiveRate.effectiveRate, 12.682503, 1e-4);
    assertClose(turnover.turnover, 6);
    assertClose(turnover.days, 60.833333, 1e-4);
});

runTest("gross profit rate and trade discount compute classroom values", () => {
    const grossProfitRate = computeGrossProfitRate(150000, 90000);
    const tradeDiscount = computeTradeDiscount(10000, 20);

    assertClose(grossProfitRate.grossProfit, 60000);
    assertClose(grossProfitRate.grossProfitRate, 40);
    assertClose(tradeDiscount.discountAmount, 2000);
    assertClose(tradeDiscount.netPrice, 8000);
});

runTest("capital budgeting helpers compute consistent discounted values", () => {
    const npv = computeNetPresentValue(100000, 12, [30000, 35000, 40000, 45000]);
    const profitabilityIndex = computeProfitabilityIndex(100000, 12, [
        30000,
        35000,
        40000,
        45000,
    ]);

    assertClose(npv.totalPresentValue, 111757.0234, 1e-3);
    assertClose(npv.netPresentValue, 11757.0234, 1e-3);
    assertClose(profitabilityIndex.profitabilityIndex, 1.1175702344, 1e-6);
    assertClose(profitabilityIndex.netPresentValue, npv.netPresentValue, 1e-9);
});

runTest("npv and profitability index include optional terminal cash flow", () => {
    const npv = computeNetPresentValue(250000, 12, [70000, 80000, 90000, 85000], 30000);
    const profitabilityIndex = computeProfitabilityIndex(
        250000,
        12,
        [70000, 80000, 90000, 85000],
        30000
    );

    assertClose(npv.totalPresentValue, 263420.3115, 1e-3);
    assertClose(npv.netPresentValue, 13420.3115, 1e-3);
    assertClose(profitabilityIndex.profitabilityIndex, 1.0536812461, 1e-6);
});

runTest("internal rate of return isolates a practical project rate", () => {
    const result = computeInternalRateOfReturn(180000, [60000, 70000, 80000, 90000]);

    assert.equal(result.hasSolution, true);
    assertClose(result.irrPercent ?? 0, 22.249832, 1e-3);
    assert.equal(result.multipleIrRisk, false);
});

runTest("discounted payback recognizes time-value-adjusted recovery", () => {
    const result = computeDiscountedPaybackPeriod(100000, 12, [
        30000,
        35000,
        40000,
        45000,
    ]);

    assert.equal(result.recovered, true);
    assertClose(result.paybackPeriod ?? 0, 3.5888910222, 1e-6);
});

runTest("payback period handles partial final period", () => {
    const result = computePaybackPeriod(100000, [30000, 25000, 28000, 35000]);

    assert.equal(result.recovered, true);
    assertClose(result.paybackPeriod ?? 0, 3.4857142857, 1e-6);
    assertClose(result.fractionOfPeriod ?? 0, 0.4857142857, 1e-6);
});

runTest("weighted mean and standard deviation cover quantitative basics", () => {
    const weightedMean = computeWeightedMean([85, 90, 78, 92], [0.2, 0.3, 0.2, 0.3]);
    const populationSd = computeStandardDeviation([12, 15, 18, 19, 22], false);
    const sampleSd = computeStandardDeviation([12, 15, 18, 19, 22], true);

    assertClose(weightedMean.weightedSum, 87.2);
    assertClose(weightedMean.totalWeight, 1);
    assertClose(weightedMean.weightedMean, 87.2);
    assertClose(populationSd.mean, 17.2);
    assertClose(populationSd.standardDeviation, 3.4292856399, 1e-6);
    assertClose(sampleSd.standardDeviation, 3.8340579025, 1e-6);
});

runTest("coefficient of variation compares relative spread safely", () => {
    const result = computeCoefficientOfVariation([10, 20, 30], false);

    assertClose(result.mean, 20);
    assertClose(result.standardDeviation, 8.1649658093, 1e-6);
    assertClose(result.coefficientOfVariation, 40.8248290464, 1e-6);
});

runTest("trial balance tolerance keeps tiny rounding differences balanced", () => {
    const balanced = computeTrialBalance(100.003, 100);
    const unbalanced = computeTrialBalance(250000, 249500);

    assert.equal(balanced.isBalanced, true);
    assert.equal(balanced.shortSide, "balanced");
    assert.equal(unbalanced.isBalanced, false);
    assert.equal(unbalanced.shortSide, "credits");
    assertClose(unbalanced.amountToCorrect, 500);
});

runTest("inventory comparison shows FIFO and weighted average differences", () => {
    const result = computeInventoryMethodComparison({
        beginningUnits: 100,
        beginningCost: 50,
        purchase1Units: 80,
        purchase1Cost: 55,
        purchase2Units: 120,
        purchase2Cost: 60,
        unitsSold: 150,
    });

    assertClose(result.fifo.costOfGoodsSold, 7750);
    assertClose(result.weightedAverage.costOfGoodsSold, 8300, 1e-5);
    assertClose(result.fifo.endingInventory, 8850);
    assertClose(result.weightedAverage.endingInventory, 8300, 1e-5);
});

runTest("lower of cost or nrv supports item and aggregate views", () => {
    const itemByItem = computeLowerOfCostOrNrv({
        method: "item-by-item",
        items: [
            { label: "Item A", cost: 25000, netRealizableValue: 22000 },
            { label: "Item B", cost: 18000, netRealizableValue: 19000 },
        ],
    });
    const aggregate = computeLowerOfCostOrNrv({
        method: "aggregate",
        items: [
            { label: "Item A", cost: 25000, netRealizableValue: 22000 },
            { label: "Item B", cost: 18000, netRealizableValue: 19000 },
        ],
    });

    assertClose(itemByItem.totalLowerValue, 40000);
    assertClose(itemByItem.totalWriteDown, 3000);
    assertClose(aggregate.totalLowerValue, 41000);
    assertClose(aggregate.totalWriteDown, 2000);
});

runTest("bond amortization schedule converges back to face value", () => {
    const result = computeBondAmortizationSchedule({
        faceValue: 1000000,
        statedRatePercent: 8,
        marketRatePercent: 10,
        termYears: 5,
        paymentsPerYear: 2,
        method: "effective-interest",
    });

    assert.equal(result.issueType, "discount");
    assertClose(result.schedule.at(-1)?.endingCarryingValue ?? 0, 1000000, 1e-6);
});

runTest("depreciation comparison schedule respects salvage floor", () => {
    const result = computeDepreciationComparisonSchedule({
        cost: 50000,
        salvageValue: 5000,
        usefulLifeYears: 5,
    });

    assertClose(result.straightLineAmount, 9000);
    assertClose(result.schedule[0].ddbExpense, 20000);
    assertClose(result.schedule.at(-1)?.ddbBookValue ?? 0, 5000);
});

runTest("cash conversion cycle summarizes working-capital timing", () => {
    const result = computeCashConversionCycle({
        receivablesDays: 36,
        inventoryDays: 52,
        payablesDays: 28,
    });

    assertClose(result.operatingCycle, 88);
    assertClose(result.cashConversionCycle, 60);
    assert.equal(result.pressureLevel, "elevated");
});

runTest("bank reconciliation handles book-side additions and deductions", () => {
    const result = computeBankReconciliation({
        bankBalance: 52000,
        bookBalance: 49800,
        depositsInTransit: 6000,
        outstandingChecks: 4200,
        bankCharges: 300,
        nsfChecks: 700,
        interestIncome: 450,
        notesCollectedByBank: 1750,
        bankError: 0,
        bookError: 0,
    });

    assertClose(result.adjustedBank, 53800);
    assertClose(result.adjustedBook, 51000);
    assert.equal(result.isBalanced, false);
});

runTest("receivables aging schedule derives required ending allowance", () => {
    const result = computeReceivablesAgingSchedule({
        buckets: [
            {
                label: "Current",
                amount: 50000,
                estimatedUncollectibleRatePercent: 2,
            },
            {
                label: "31-60 days",
                amount: 20000,
                estimatedUncollectibleRatePercent: 10,
            },
        ],
        existingAllowanceBalance: 1800,
    });

    assertClose(result.totalReceivables, 70000);
    assertClose(result.requiredEndingAllowance, 3000);
    assertClose(result.requiredAdjustment, 1200);
    assertClose(result.netRealizableValue, 67000);
    assert.equal(result.adjustmentDirection, "increase");
});

runTest("sales mix break-even handles composite-unit CVP", () => {
    const result = computeSalesMixBreakEven({
        fixedCosts: 180000,
        products: [
            { label: "A", sellingPrice: 240, variableCost: 150, mixShare: 3 },
            { label: "B", sellingPrice: 180, variableCost: 110, mixShare: 2 },
        ],
    });

    assertClose(result.compositeUnitContribution, 410);
    assertClose(result.compositeUnitSales, 1080);
    assertClose(result.breakEvenCompositeUnits, 439.0243902, 1e-6);
    assertClose(result.breakEvenSales, 474146.3414, 1e-3);
});

runTest("cash and flexible budgets separate financing and variance logic", () => {
    const cashBudget = computeCashBudget({
        beginningCashBalance: 50000,
        cashCollections: 180000,
        cashDisbursements: 210000,
        minimumCashBalance: 25000,
    });
    const flexibleBudget = computeFlexibleBudget({
        budgetedUnits: 10000,
        actualUnits: 12000,
        fixedCosts: 150000,
        variableCostPerUnit: 22,
        actualCost: 422000,
    });

    assertClose(cashBudget.financingNeeded, 5000);
    assertClose(cashBudget.endingCashAfterFinancing, 25000);
    assertClose(flexibleBudget.flexibleBudget, 414000);
    assertClose(flexibleBudget.spendingVariance, 8000);
});

runTest("capacity utilization keeps idle and strained capacity visible", () => {
    const result = computeCapacityUtilization({
        actualUnits: 8400,
        practicalCapacityUnits: 10000,
    });

    assertClose(result.utilizationRate, 84);
    assertClose(result.idleCapacityUnits, 1600);
    assertClose(result.idleCapacityRate, 16);
    assertClose(result.remainingCapacityUnits, 1600);
    assertClose(result.overCapacityUnits, 0);
    assert.equal(result.status, "moderate capacity use");
});

runTest("collections and disbursements schedules respect lag patterns", () => {
    const collections = computeCashCollectionsSchedule({
        periods: [
            { label: "January", amount: 100000 },
            { label: "February", amount: 120000 },
            { label: "March", amount: 90000 },
        ],
        collectionPattern: [
            { lagPeriods: 0, percent: 40 },
            { lagPeriods: 1, percent: 60 },
        ],
        beginningReceivables: 50000,
    });
    const disbursements = computeCashDisbursementsSchedule({
        periods: [
            { label: "January", amount: 80000 },
            { label: "February", amount: 95000 },
            { label: "March", amount: 110000 },
        ],
        paymentPattern: [
            { lagPeriods: 0, percent: 50 },
            { lagPeriods: 1, percent: 50 },
        ],
        beginningPayables: 30000,
    });

    assertClose(collections.rows[0].totalScheduled, 90000);
    assertClose(collections.rows[1].totalScheduled, 108000);
    assertClose(collections.totalCollections, 306000);
    assertClose(collections.endingReceivables, 54000);

    assertClose(disbursements.rows[0].totalScheduled, 70000);
    assertClose(disbursements.rows[2].totalScheduled, 102500);
    assertClose(disbursements.totalDisbursements, 260000);
    assertClose(disbursements.endingPayables, 55000);
});

runTest("equivalent units and efficiency variances stay classroom-consistent", () => {
    const equivalentUnits = computeEquivalentUnitsWeightedAverage({
        beginningWorkInProcessUnits: 1200,
        unitsStarted: 8800,
        unitsCompletedAndTransferred: 9000,
        endingWorkInProcessUnits: 1000,
        endingMaterialsCompletionPercent: 100,
        endingConversionCompletionPercent: 40,
        totalMaterialsCosts: 180000,
        totalConversionCosts: 135000,
    });
    const materialsQuantity = computeMaterialsQuantityVariance(5200, 5000, 20);
    const laborEfficiency = computeLaborEfficiencyVariance(2400, 2200, 170);

    assertClose(equivalentUnits.materialsEquivalentUnits, 10000);
    assertClose(equivalentUnits.conversionEquivalentUnits, 9400);
    assertClose(equivalentUnits.transferredOutCost, 291255.3191, 1e-3);
    assertClose(materialsQuantity.variance, 4000);
    assertClose(laborEfficiency.variance, 34000);
});

runTest("factory overhead variances separate variable and fixed overhead causes", () => {
    const result = computeFactoryOverheadVariances({
        actualVariableOverhead: 95500,
        actualFixedOverhead: 81000,
        actualHours: 4200,
        standardHoursAllowed: 4000,
        standardVariableOverheadRate: 22,
        budgetedFixedOverhead: 80000,
        denominatorHours: 5000,
    });

    assertClose(result.variableOverheadSpendingVariance, 3100);
    assertClose(result.variableOverheadEfficiencyVariance, 4400);
    assertClose(result.fixedOverheadBudgetVariance, 1000);
    assertClose(result.fixedOverheadVolumeVariance, 16000);
    assertClose(result.totalOverheadVariance, 24500);
});

runTest("job-order cost sheet keeps total, prime, conversion, and unit cost aligned", () => {
    const result = computeJobOrderCostSheet({
        directMaterialsUsed: 85000,
        directLabor: 54000,
        appliedManufacturingOverhead: 48600,
        unitsInJob: 1200,
    });

    assertClose(result.primeCost, 139000);
    assertClose(result.conversionCost, 102600);
    assertClose(result.totalJobCost, 187600);
    assertClose(result.unitCost, 156.3333333333, 1e-6);
    assertClose(result.materialsShare, 45.3091684435, 1e-6);
});

runTest("ratio analysis workspace computes a coordinated ratio set", () => {
    const result = computeRatioAnalysisWorkspace({
        currentAssets: 420000,
        currentLiabilities: 180000,
        cash: 60000,
        marketableSecurities: 15000,
        netReceivables: 95000,
        netSales: 950000,
        netCreditSales: 900000,
        costOfGoodsSold: 570000,
        netIncome: 98000,
        averageInventory: 150000,
        averageAccountsReceivable: 110000,
        averageTotalAssets: 760000,
        averageEquity: 380000,
    });

    assertClose(result.currentRatio, 2.3333333333, 1e-6);
    assertClose(result.quickRatio, 0.9444444444, 1e-6);
    assertClose(result.grossProfitRate, 0.4, 1e-9);
    assertClose(result.inventoryTurnover, 3.8, 1e-9);
    assertClose(result.receivablesTurnover, 8.1818181818, 1e-6);
    assertClose(result.returnOnAssets, 0.1289473684, 1e-6);
    assertClose(result.returnOnEquity, 0.2578947368, 1e-6);
});

runTest("common-size statements convert lines into base percentages", () => {
    const result = computeCommonSizeStatement(
        [
            { label: "Cost of Sales", amount: 320000 },
            { label: "Gross Profit", amount: 180000 },
        ],
        500000
    );

    assertClose(result.rows[0]?.percentage ?? 0, 64);
    assertClose(result.rows[1]?.percentage ?? 0, 36);
});

runTest("horizontal-analysis workspace computes line and total movement", () => {
    const result = computeHorizontalAnalysisWorkspace([
        { label: "Cash", baseAmount: 120000, currentAmount: 145000 },
        { label: "Receivables", baseAmount: 95000, currentAmount: 110000 },
    ]);

    assertClose(result.rows[0]?.amountChange ?? 0, 25000);
    assertClose(result.rows[0]?.percentageChange ?? 0, 20.8333333333, 1e-6);
    assertClose(result.totalChange, 40000);
});

runTest("working capital cycle combines balance and day measures", () => {
    const result = computeWorkingCapitalCycle({
        currentAssets: 420000,
        currentLiabilities: 180000,
        receivablesDays: 42,
        inventoryDays: 58,
        payablesDays: 35,
    });

    assertClose(result.workingCapital, 240000);
    assertClose(result.operatingCycle, 100);
    assertClose(result.cashConversionCycle, 65);
});

runTest("economics helpers cover elasticity, equilibrium, surplus, and real rate", () => {
    const elasticity = computePriceElasticity({
        initialPrice: 120,
        finalPrice: 100,
        initialQuantity: 240,
        finalQuantity: 300,
    });
    const equilibrium = computeMarketEquilibrium({
        demandIntercept: 120,
        demandSlope: 2,
        supplyIntercept: 20,
        supplySlope: 1,
    });
    const surplus = computeSurplusAtEquilibrium({
        demandIntercept: 120,
        supplyIntercept: 20,
        equilibriumPrice: equilibrium.equilibriumPrice,
        equilibriumQuantity: equilibrium.equilibriumQuantity,
    });
    const realRate = computeRealInterestRate(9, 4);

    assertClose(elasticity.elasticity, -1.2222222222, 1e-6);
    assert.equal(elasticity.classification, "Elastic");
    assertClose(equilibrium.equilibriumQuantity, 33.3333333333, 1e-6);
    assertClose(equilibrium.equilibriumPrice, 53.3333333333, 1e-6);
    assertClose(surplus.consumerSurplus, 1111.1111111, 1e-4);
    assertClose(surplus.producerSurplus, 555.5555556, 1e-4);
    assertClose(realRate.exactRealRate, 4.8076923077, 1e-6);
});

runTest("entrepreneurship helpers support startup planning and runway checks", () => {
    const startup = computeStartupCostPlan(
        [
            { label: "Permits", amount: 12000 },
            { label: "Equipment", amount: 85000 },
            { label: "Inventory", amount: 45000 },
        ],
        10,
        50000
    );
    const unitEconomics = computeUnitEconomics({
        sellingPrice: 900,
        variableCostPerUnit: 520,
        fixedCosts: 150000,
        acquisitionCostPerCustomer: 250,
        unitsPerCustomer: 2,
    });
    const forecast = computeSalesForecast({
        startingSales: 150000,
        monthlyGrowthPercent: 6,
        months: 6,
        grossMarginPercent: 35,
    });
    const runway = computeCashRunway({
        openingCash: 300000,
        averageMonthlyInflows: 90000,
        averageMonthlyOutflows: 120000,
        plannedGrowthPercent: 5,
    });

    assertClose(startup.subtotal, 142000);
    assertClose(startup.contingencyAmount, 14200);
    assertClose(startup.recommendedFunding, 206200);
    assert.equal(startup.largestItem.label, "Equipment");
    assertClose(unitEconomics.contributionPerUnit, 380);
    assertClose(unitEconomics.breakEvenUnits, 394.7368421, 1e-6);
    assertClose(unitEconomics.breakEvenCustomers, 294.1176471, 1e-6);
    assertClose(forecast.totalSales, 1046297.7806, 1e-3);
    assertClose(forecast.endingSales, 200733.8366, 1e-3);
    assertClose(runway.adjustedInflows, 94500);
    assertClose(runway.monthlyBurn, 25500);
    assertClose(runway.runwayMonths, 11.7647058824, 1e-6);
});

runTest("3.1 helper workspaces cover adjustments, pricing, splits, shrinkage, and elasticity variants", () => {
    const shrinkage = computeInventoryShrinkage({
        bookUnits: 1200,
        physicalUnits: 1160,
        costPerUnit: 145,
    });
    const prepaid = computePrepaidExpenseAdjustment({
        beginningPrepaid: 25000,
        endingPrepaid: 8000,
    });
    const unearned = computeUnearnedRevenueAdjustment({
        beginningUnearnedRevenue: 18000,
        endingUnearnedRevenue: 7000,
    });
    const accruedRevenue = computeAccruedRevenueAdjustment({
        revenueEarned: 24000,
        cashCollected: 9000,
    });
    const accruedExpense = computeAccruedExpenseAdjustment({
        expenseIncurred: 19500,
        cashPaid: 11000,
    });
    const pricing = computePricingPlanner({
        unitCost: 700,
        targetMarginPercent: 30,
        targetMonthlyIncome: 40000,
        contributionPerUnit: 120,
    });
    const split = computeOwnerSplit({
        distributableProfit: 90000,
        ratioA: 3,
        ratioB: 2,
        ratioC: 1,
    });
    const payback = computeCustomerPayback({
        acquisitionCost: 2400,
        monthlyContributionPerCustomer: 400,
    });
    const elasticity = computeElasticityShift({
        initialDriver: 100,
        finalDriver: 125,
        initialQuantity: 250,
        finalQuantity: 220,
    });

    assertClose(shrinkage.shrinkageUnits, 40);
    assertClose(shrinkage.shrinkageAmount, 5800);
    assertClose(shrinkage.shrinkageRate, 3.3333333333, 1e-6);
    assertClose(prepaid.expenseRecognized, 17000);
    assert.equal(prepaid.adjustmentDirection, "debit-expense-credit-prepaid");
    assertClose(unearned.revenueRecognized, 11000);
    assert.equal(unearned.adjustmentDirection, "debit-unearned-credit-revenue");
    assertClose(accruedRevenue.accruedRevenue, 15000);
    assertClose(accruedExpense.accruedExpense, 8500);
    assertClose(pricing.suggestedSellingPrice, 1000);
    assertClose(pricing.markUpPercent, 42.8571428571, 1e-6);
    assertClose(pricing.unitsNeededForTargetIncome, 333.3333333333, 1e-6);
    assertClose(split.shareA, 45000);
    assertClose(split.shareB, 30000);
    assertClose(split.shareC, 15000);
    assertClose(payback.paybackMonths, 6);
    assert.equal(payback.status, "Healthy payback");
    assertClose(elasticity.elasticity, -0.5744680851, 1e-6);
});

runTest("5.6.5 helper additions stay mathematically consistent", () => {
    const pettyCash = computePettyCashReconciliation({
        fundAmount: 5000,
        cashOnHand: 3200,
        pettyCashVouchers: 1400,
        stampsOnHand: 200,
        otherReceipts: 100,
    });
    const impairment = computeImpairmentLoss({
        carryingAmount: 520000,
        fairValueLessCostsToSell: 430000,
        valueInUse: 450000,
    });
    const disposal = computeAssetDisposal({
        assetCost: 500000,
        accumulatedDepreciation: 360000,
        proceeds: 155000,
        disposalCosts: 5000,
    });
    const productionBudget = computeProductionBudget({
        budgetedSalesUnits: 12000,
        desiredEndingFinishedGoodsUnits: 1800,
        beginningFinishedGoodsUnits: 1500,
    });
    const materialsBudget = computeDirectMaterialsPurchasesBudget({
        budgetedProductionUnits: 12300,
        materialsPerFinishedUnit: 2.5,
        desiredEndingMaterialsUnits: 1200,
        beginningMaterialsUnits: 900,
        materialCostPerUnit: 18,
    });
    const inventoryBudget = computeInventoryBudget({
        budgetedCostOfGoodsSold: 420000,
        desiredEndingInventoryCost: 86000,
        beginningInventoryCost: 73000,
    });
    const operatingExpenseBudget = computeOperatingExpenseBudget({
        budgetedSalesAmount: 950000,
        variableExpenseRatePercent: 6.5,
        fixedOperatingExpenses: 145000,
        nonCashOperatingExpenses: 18000,
    });
    const withholdingTax = computeWithholdingTax({
        taxBase: 85000,
        ratePercent: 10,
    });

    assertClose(pettyCash.totalAccountedFor, 4900);
    assertClose(pettyCash.shortageOrOverage, -100);
    assertClose(pettyCash.replenishmentAmount, 1800);
    assert.equal(pettyCash.status, "short");

    assertClose(impairment.recoverableAmount, 450000);
    assertClose(impairment.impairmentLoss, 70000);
    assertClose(impairment.carryingAmountAfterImpairment, 450000);
    assert.equal(impairment.measurementBasis, "value-in-use");

    assertClose(disposal.bookValue, 140000);
    assertClose(disposal.netProceeds, 150000);
    assertClose(disposal.gainOrLoss, 10000);
    assert.equal(disposal.outcome, "gain");

    assertClose(productionBudget.requiredProductionUnits, 12300);
    assertClose(productionBudget.finishedGoodsUnitsAvailable, 13800);

    assertClose(materialsBudget.materialsNeededForProduction, 30750);
    assertClose(materialsBudget.materialsRequired, 31950);
    assertClose(materialsBudget.materialsToPurchaseUnits, 31050);
    assertClose(materialsBudget.purchasesCost, 558900);

    assertClose(inventoryBudget.purchasesRequiredCost, 433000);
    assertClose(inventoryBudget.goodsAvailableForSaleCost, 506000);

    assertClose(operatingExpenseBudget.variableExpenseRateDecimal, 0.065);
    assertClose(operatingExpenseBudget.variableOperatingExpenses, 61750);
    assertClose(operatingExpenseBudget.totalOperatingExpenses, 206750);
    assertClose(operatingExpenseBudget.cashOperatingExpenses, 188750);

    assertClose(withholdingTax.rateDecimal, 0.1);
    assertClose(withholdingTax.taxWithheld, 8500);
    assertClose(withholdingTax.netAfterWithholding, 76500);
});

runTest("5.7.0 helper additions stay mathematically consistent", () => {
    const salesBudget = computeSalesBudget({
        budgetedUnitSales: 12500,
        sellingPricePerUnit: 85,
    });
    const vat = computeVatReconciliation({
        taxableSalesAmount: 850000,
        vatablePurchasesAmount: 420000,
        vatRatePercent: 12,
    });
    const intercompany = computeIntercompanyInventoryProfit({
        transferPrice: 240000,
        markupRateOnCostPercent: 25,
        percentUnsoldAtPeriodEnd: 40,
    });
    const equity = computeStatementOfChangesInEquity({
        beginningShareCapital: 5000000,
        beginningAdditionalPaidInCapital: 900000,
        beginningRetainedEarnings: 2100000,
        beginningAccumulatedOci: 120000,
        beginningTreasuryShares: 180000,
        shareIssuances: 300000,
        additionalPaidInCapitalChanges: 45000,
        netIncome: 680000,
        dividendsDeclared: 210000,
        priorPeriodAdjustments: 0,
        otherComprehensiveIncome: 35000,
        treasuryShareRepurchases: 60000,
        treasuryShareReissuances: 20000,
    });

    assertClose(salesBudget.budgetedSalesRevenue, 1062500);
    assertClose(vat.outputVat, 102000);
    assertClose(vat.inputVat, 50400);
    assertClose(vat.netVatPayable, 51600);
    assert.equal(vat.remittancePosition, "payable");
    assertClose(intercompany.transferredCost, 192000);
    assertClose(intercompany.intercompanyGrossProfit, 48000);
    assertClose(intercompany.unrealizedProfitInEndingInventory, 19200);
    assertClose(intercompany.realizedProfitPortion, 28800);
    assertClose(equity.endingRetainedEarnings, 2570000);
    assertClose(equity.endingTreasuryShares, 220000);
    assertClose(equity.totalEndingEquity, 8750000);
    assertClose(equity.totalChangeInEquity, 810000);
});

runTest("capital budgeting comparison combines project metrics", () => {
    const result = computeCapitalBudgetingComparison(
        100000,
        12,
        [30000, 35000, 40000, 45000],
        25000
    );

    assert.equal(result.decision, "Accept");
    assertClose(result.npv.netPresentValue, 27644.9754, 1e-3);
    assertClose(result.profitabilityIndex.profitabilityIndex, 1.276449754, 1e-6);
});

runTest("4.5 curriculum helpers support cost, performance, audit, tax, afar, and operations expansion", () => {
    const highLow = computeHighLowCostEstimation({
        highActivityUnits: 18000,
        highTotalCost: 420000,
        lowActivityUnits: 12000,
        lowTotalCost: 315000,
        expectedActivityUnits: 15000,
    });
    const performance = computeRoiRiEva({
        operatingIncome: 240000,
        investedCapital: 1500000,
        targetRatePercent: 12,
        sales: 3200000,
    });
    const eoq = computeEconomicOrderQuantity({
        annualDemandUnits: 24000,
        orderingCostPerOrder: 1200,
        annualCarryingCostPerUnit: 18,
        dailyDemandUnits: 80,
        leadTimeDays: 6,
        safetyStockUnits: 120,
    });
    const tax = computeBookTaxDifference({
        accountingIncomeBeforeTax: 1850000,
        permanentDifferences: 120000,
        temporaryDifferences: -80000,
        taxRatePercent: 25,
    });
    const combination = computeBusinessCombination({
        considerationTransferred: 4500000,
        netIdentifiableAssetsFairValue: 5200000,
        ownershipPercent: 80,
        nonControllingInterestMeasurement: "fair-value",
        nonControllingInterestFairValue: 1180000,
    });

    assertClose(highLow.variableCostPerUnit, 17.5, 1e-9);
    assertClose(highLow.fixedCostEstimate, 105000, 1e-6);
    assertClose(highLow.estimatedTotalCost ?? 0, 367500, 1e-6);
    assertClose(performance.roi, 16, 1e-9);
    assertClose(performance.capitalCharge, 180000, 1e-6);
    assertClose(performance.residualIncome, 60000, 1e-6);
    assertClose(eoq.eoq, 1788.854382, 1e-3);
    assertClose(eoq.reorderPointUnits, 600, 1e-6);
    assertClose(tax.taxableIncome, 1890000, 1e-6);
    assertClose(tax.currentTaxExpense, 472500, 1e-6);
    assertClose(combination.nonControllingInterest, 1180000, 1e-6);
    assertClose(combination.goodwill, 480000, 1e-6);
});

runTest("4.6 deferred-topic helpers support leases, share-based payments, cash flows, foreign currency, and construction revenue", () => {
    const lease = computeLeaseMeasurement({
        periodicLeasePayment: 85000,
        numberOfPeriods: 5,
        periodicDiscountRatePercent: 8,
        guaranteedResidualValue: 30000,
        initialDirectCosts: 5000,
        leaseIncentivesReceived: 12000,
    });
    const shareBased = computeShareBasedPayment({
        grantDateFairValuePerOption: 18.5,
        optionsGranted: 100000,
        estimatedForfeitureRatePercent: 6,
        vestingYears: 4,
        serviceYearsRendered: 2,
    });
    const cashFlows = computeStatementOfCashFlows({
        netIncome: 980000,
        depreciationExpense: 140000,
        gainOnAssetSale: 25000,
        accountsReceivableIncrease: 40000,
        inventoryIncrease: 30000,
        accountsPayableIncrease: 22000,
        capitalExpenditures: 280000,
        assetSaleProceeds: 90000,
        debtProceeds: 160000,
        debtRepayments: 70000,
        shareIssuanceProceeds: 50000,
        dividendsPaid: 60000,
        openingCashBalance: 320000,
    });
    const foreignCurrency = computeForeignCurrencyTranslation({
        foreignCurrencyAmount: 250000,
        transactionRate: 56.2,
        closingRate: 57.4,
        settlementRate: 58.1,
    });
    const construction = computeConstructionRevenue({
        contractPrice: 12000000,
        costsIncurredToDate: 4200000,
        estimatedCostsToComplete: 2800000,
        billingsToDate: 5000000,
        collectionsToDate: 4600000,
    });

    assertClose(lease.initialLeaseLiability, 359797.8491, 1e-3);
    assertClose(lease.initialRightOfUseAsset, 352797.8491, 1e-3);
    assertClose(shareBased.expectedOptionsToVest, 94000, 1e-6);
    assertClose(shareBased.cumulativeCompensationCost, 869500, 1e-6);
    assertClose(cashFlows.operatingCashFlow, 1047000, 1e-6);
    assertClose(cashFlows.netChangeInCash, 937000, 1e-6);
    assertClose(cashFlows.endingCashBalance, 1257000, 1e-6);
    assertClose(foreignCurrency.unrealizedExchangeDifference, 300000, 1e-6);
    assertClose(foreignCurrency.realizedExchangeDifference ?? 0, 475000, 1e-6);
    assertClose(construction.percentComplete, 0.6, 1e-9);
    assertClose(construction.revenueRecognizedToDate, 7200000, 1e-6);
    assertClose(construction.contractAssetLiabilityPosition, 2200000, 1e-6);
});

runTest("solve-for definitions reverse simple-interest targets safely", () => {
    const result = simpleInterestSolveDefinition.solve("principal", {
        interest: 2400,
        rate: 12,
        time: 2,
    });

    assert.equal("error" in result, false);
    if ("error" in result) return;
    assert.equal(result.primaryResult.value, "₱10,000.00");
});

runTest("time-value solve mode can isolate rate", () => {
    const result = timeValueSolveDefinition.solve("rate", {
        presentValue: 10000,
        futureValue: 11576.25,
        time: 3,
    });

    assert.equal("error" in result, false);
    if ("error" in result) return;
    assert.equal(result.primaryResult.value, "5.00%");
});

runTest("price and margin planner can solve target selling price", () => {
    const result = priceCostMarginSolveDefinition.solve("sellingPrice", {
        cost: 700,
        marginPercent: 30,
    });

    assert.equal("error" in result, false);
    if ("error" in result) return;
    assert.equal(result.primaryResult.value, "₱1,000.00");
});

runTest("current ratio solve mode can isolate current liabilities", () => {
    const result = currentRatioSolveDefinition.solve("currentLiabilities", {
        currentAssets: 250000,
        currentRatio: 2.5,
    });

    assert.equal("error" in result, false);
    if ("error" in result) return;
    assert.equal(result.primaryResult.value, "₱100,000.00");
});

runTest("break-even solve mode can isolate fixed costs", () => {
    const result = breakEvenSolveDefinition.solve("fixedCosts", {
        breakEvenUnits: 1000,
        sellingPricePerUnit: 250,
        variableCostPerUnit: 150,
    });

    assert.equal("error" in result, false);
    if ("error" in result) return;
    assert.equal(result.primaryResult.value, "₱100,000.00");
});

runTest("number list parser accepts mixed separators and rejects bad entries", () => {
    const parsed = parseNumberList("10, 20\n30;40");
    const invalid = parseNumberList("10, nope, 30");

    assert.deepEqual(parsed.values, [10, 20, 30, 40]);
    assert.equal(parsed.error, null);
    assert.equal(invalid.error !== null, true);
});

runTest("loose number parsing handles commas, parentheses, and percents safely", () => {
    assert.equal(parseLooseNumber("₱1,250.50"), 1250.5);
    assert.equal(parseLooseNumber("(1,250.50)"), -1250.5);
    assert.equal(parseLooseNumber("35%"), 35);
    assert.equal(parseLooseNumber("35%", { percentAsFraction: true }), 0.35);
    assert.equal(parseLooseNumber("units started 1,250"), 1250);
});

runTest("search indexes aliases, abbreviations, and typo-tolerant queries", () => {
    const npvResults = searchAppRoutes("npv");
    const typoResults = searchAppRoutes("trial balnce");
    const aliasResults = searchAppRoutes("benefit cost ratio");
    const cycleResults = searchAppRoutes("cash cycle");
    const leverageResults = searchAppRoutes("financial leverage");
    const retirementResults = searchAppRoutes("retiring partner settlement");
    const agingResults = searchAppRoutes("aging of receivables");
    const salesMixResults = searchAppRoutes("composite unit break even");
    const bondResults = searchAppRoutes("bond premium schedule");
    const budgetResults = searchAppRoutes("activity variance");
    const irrResults = searchAppRoutes("irr");
    const collectionsResults = searchAppRoutes("cash receipts schedule");
    const disbursementsResults = searchAppRoutes("cash payments schedule");
    const overheadResults = searchAppRoutes("overhead volume variance");
    const ratioResults = searchAppRoutes("financial ratios");
    const commonSizeResults = searchAppRoutes("common size income statement");
    const capitalComparisonResults = searchAppRoutes("capital budgeting comparison");
    const elasticityResults = searchAppRoutes("demand elasticity");
    const equilibriumResults = searchAppRoutes("equilibrium price");
    const startupResults = searchAppRoutes("startup budget");
    const runwayResults = searchAppRoutes("burn rate");
    const adjustmentsResults = searchAppRoutes("accrued expense adjustment");
    const workingCapitalPlannerResults = searchAppRoutes("operating cycle planner");
    const inventoryControlResults = searchAppRoutes("inventory shrinkage");
    const elasticityWorkspaceResults = searchAppRoutes("income elasticity");
    const toolkitResults = searchAppRoutes("owner split planner");
    const jobOrderResults = searchAppRoutes("job order cost sheet");
    const bankReconResults = searchAppRoutes("adjusted cash balance");
    const collectionLagResults = searchAppRoutes("collection lag schedule");
    const paymentScheduleResults = searchAppRoutes("purchases payment schedule");
    const workingCapitalControlResults = searchAppRoutes("working capital control");
    const physicalCountResults = searchAppRoutes("book versus physical inventory");
    const relativeVariationResults = searchAppRoutes("relative variability");
    const capacityResults = searchAppRoutes("practical capacity");
    const auditResults = searchAppRoutes("planning materiality");
    const eoqResults = searchAppRoutes("economic order quantity");
    const taxBridgeResults = searchAppRoutes("temporary differences");
    const afarResults = searchAppRoutes("non controlling interest");
    const aisResults = searchAppRoutes("it governance");
    const lawResults = searchAppRoutes("contracts review");
    const strategicResults = searchAppRoutes("board review integration");
    const leaseResults = searchAppRoutes("right of use asset");
    const shareBasedResults = searchAppRoutes("stock options vesting");
    const cashFlowResults = searchAppRoutes("indirect method cash flow statement");
    const fxResults = searchAppRoutes("foreign currency translation");
    const constructionResults = searchAppRoutes("percentage of completion");
    const taxComplianceResults = searchAppRoutes("estate tax treaty");
    const auditCycleResults = searchAppRoutes("revenue cycle audit");
    const auditOpinionResults = searchAppRoutes("key audit matters");
    const aisLifecycleResults = searchAppRoutes("disaster recovery erp");
    const transactionsResults = searchAppRoutes("contracts of security");
    const strategicAnalysisResults = searchAppRoutes("strategic cost management");
    const workpaperResults = searchAppRoutes("spreadsheet workpaper xlsx");
    const pettyCashResults = searchAppRoutes("petty cash short and over");
    const prepaidResults = searchAppRoutes("insurance expired adjusting entry");
    const productionResults = searchAppRoutes("schedule of production");
    const materialsBudgetResults = searchAppRoutes("materials purchase schedule");
    const inventoryBudgetResults = searchAppRoutes("merchandise purchases budget");
    const operatingExpenseBudgetResults = searchAppRoutes("selling and administrative budget");
    const impairmentResults = searchAppRoutes("recoverable amount value in use");
    const disposalResults = searchAppRoutes("gain on sale of equipment");
    const withholdingResults = searchAppRoutes("expanded withholding tax");
    const salesBudgetResults = searchAppRoutes("budgeted sales revenue");
    const vatResults = searchAppRoutes("output vat less input vat");
    const intercompanyResults = searchAppRoutes("inventory profit elimination");
    const equityResults = searchAppRoutes("statement of changes in equity");

    assert.equal(npvResults[0]?.path, "/finance/npv");
    assert.equal(typoResults[0]?.path, "/accounting/trial-balance-checker");
    assert.equal(aliasResults[0]?.path, "/finance/profitability-index");
    assert.equal(cycleResults[0]?.path, "/accounting/cash-conversion-cycle");
    assert.equal(leverageResults[0]?.path, "/accounting/equity-multiplier");
    assert.equal(retirementResults[0]?.path, "/accounting/partnership-retirement-bonus");
    assert.equal(agingResults[0]?.path, "/accounting/receivables-aging-schedule");
    assert.equal(salesMixResults[0]?.path, "/business/sales-mix-break-even");
    assert.equal(bondResults[0]?.path, "/accounting/bond-amortization-schedule");
    assert.equal(budgetResults[0]?.path, "/business/budget-variance-analysis");
    assert.equal(irrResults[0]?.path, "/finance/internal-rate-of-return");
    assert.equal(collectionsResults[0]?.path, "/business/cash-collections-schedule");
    assert.equal(disbursementsResults[0]?.path, "/business/cash-disbursements-schedule");
    assert.equal(overheadResults[0]?.path, "/accounting/factory-overhead-variance");
    assert.equal(ratioResults[0]?.path, "/accounting/ratio-analysis-workspace");
    assert.equal(commonSizeResults[0]?.path, "/accounting/common-size-income-statement");
    assert.equal(capitalComparisonResults[0]?.path, "/finance/capital-budgeting-comparison");
    assert.equal(elasticityResults[0]?.path, "/economics/price-elasticity-demand");
    assert.equal(equilibriumResults[0]?.path, "/economics/market-equilibrium");
    assert.equal(startupResults[0]?.path, "/entrepreneurship/startup-cost-planner");
    assert.equal(runwayResults[0]?.path, "/entrepreneurship/cash-runway-planner");
    assert.equal(adjustmentsResults[0]?.path, "/accounting/accrued-expense-adjustment");
    assert.equal(workingCapitalPlannerResults[0]?.path, "/accounting/working-capital-planner");
    assert.equal(inventoryControlResults[0]?.path, "/accounting/inventory-control-workspace");
    assert.equal(elasticityWorkspaceResults[0]?.path, "/economics/economics-analysis-workspace");
    assert.equal(toolkitResults[0]?.path, "/entrepreneurship/entrepreneurship-toolkit");
    assert.equal(jobOrderResults[0]?.path, "/accounting/job-order-cost-sheet");
    assert.equal(bankReconResults[0]?.path, "/accounting/bank-reconciliation");
    assert.equal(collectionLagResults[0]?.path, "/business/cash-collections-schedule");
    assert.equal(paymentScheduleResults[0]?.path, "/business/cash-disbursements-schedule");
    assert.equal(workingCapitalControlResults[0]?.path, "/accounting/working-capital-planner");
    assert.equal(physicalCountResults[0]?.path, "/accounting/inventory-control-workspace");
    assert.equal(relativeVariationResults[0]?.path, "/statistics/coefficient-of-variation");
    assert.equal(capacityResults[0]?.path, "/business/capacity-utilization");
    assert.equal(auditResults[0]?.path, "/audit/audit-planning-workspace");
    assert.equal(eoqResults[0]?.path, "/operations/eoq-and-reorder-point");
    assert.equal(taxBridgeResults[0]?.path, "/tax/book-tax-difference-workspace");
    assert.equal(afarResults[0]?.path, "/afar/business-combination-analysis");
    assert.equal(aisResults[0]?.path, "/ais/it-control-matrix");
    assert.equal(lawResults[0]?.path, "/rfbt/business-law-review");
    assert.equal(strategicResults[0]?.path, "/strategic/integrative-case-mapper");
    assert.equal(leaseResults[0]?.path, "/far/lease-measurement-workspace");
    assert.equal(shareBasedResults[0]?.path, "/far/share-based-payment-workspace");
    assert.equal(cashFlowResults[0]?.path, "/far/cash-flow-statement-builder");
    assert.equal(fxResults[0]?.path, "/afar/foreign-currency-translation");
    assert.equal(constructionResults[0]?.path, "/afar/construction-revenue-workspace");
    assert.equal(taxComplianceResults[0]?.path, "/tax/tax-compliance-review");
    assert.equal(auditCycleResults[0]?.path, "/audit/audit-cycle-reviewer");
    assert.equal(auditOpinionResults[0]?.path, "/audit/audit-completion-and-opinion");
    assert.equal(aisLifecycleResults[0]?.path, "/ais/ais-lifecycle-and-recovery");
    assert.equal(transactionsResults[0]?.path, "/rfbt/commercial-transactions-reviewer");
    assert.equal(strategicAnalysisResults[0]?.path, "/strategic/strategic-business-analysis");
    assert.equal(workpaperResults[0]?.path, "/workpapers");
    assert.equal(pettyCashResults[0]?.path, "/accounting/petty-cash-reconciliation");
    assert.equal(prepaidResults[0]?.path, "/accounting/prepaid-expense-adjustment");
    assert.equal(productionResults[0]?.path, "/business/production-budget");
    assert.equal(materialsBudgetResults[0]?.path, "/business/direct-materials-purchases-budget");
    assert.equal(inventoryBudgetResults[0]?.path, "/business/inventory-budget");
    assert.equal(operatingExpenseBudgetResults[0]?.path, "/business/operating-expense-budget");
    assert.equal(impairmentResults[0]?.path, "/far/impairment-loss-workspace");
    assert.equal(disposalResults[0]?.path, "/far/asset-disposal-analysis");
    assert.equal(withholdingResults[0]?.path, "/tax/withholding-tax");
    assert.equal(salesBudgetResults[0]?.path, "/business/sales-budget");
    assert.equal(vatResults[0]?.path, "/tax/vat-reconciliation");
    assert.equal(intercompanyResults[0]?.path, "/afar/intercompany-inventory-profit");
    assert.equal(
        equityResults.some(
            (result) => result.path === "/far/statement-of-changes-in-equity-builder"
        ),
        true
    );
});

runTest("smart solver target intent prefers explicit reverse-solve wording", () => {
    assert.equal(suggestSolveTarget("simple-interest", "find the principal"), "principal");
    assert.equal(
        suggestSolveTarget("markup-margin", "what selling price gives 30% margin"),
        "sellingPrice"
    );
    assert.equal(
        suggestSolveTarget(
            "current-ratio",
            "solve for current liabilities using current ratio"
        ),
        "currentLiabilities"
    );
    assert.equal(
        suggestSolveTarget("petty-cash-reconciliation", "find the shortage or overage"),
        "shortageOrOverage"
    );
    assert.equal(
        suggestSolveTarget("production-budget", "how many units should be produced"),
        "requiredProductionUnits"
    );
    assert.equal(
        suggestSolveTarget("inventory-budget", "compute required purchases"),
        "purchasesRequiredCost"
    );
    assert.equal(
        suggestSolveTarget("sales-budget", "find the budgeted sales revenue"),
        "budgetedSalesAmount"
    );
    assert.equal(
        suggestSolveTarget("operating-expense-budget", "find the cash operating expenses"),
        "cashOperatingExpenses"
    );
    assert.equal(
        suggestSolveTarget("vat-reconciliation", "compute the vat payable"),
        "netVatPayable"
    );
    assert.equal(
        suggestSolveTarget("withholding-tax", "compute the amount withheld"),
        "taxWithheld"
    );
    assert.equal(
        suggestSolveTarget(
            "intercompany-inventory-profit",
            "find unrealized profit in ending inventory"
        ),
        "unrealizedProfitInEndingInventory"
    );
    assert.equal(
        suggestSolveTarget("direct-labor-budget", "find the required labor hours"),
        "totalDirectLaborHours"
    );
    assert.equal(
        suggestSolveTarget("budgeted-income-statement", "compute net income"),
        "netIncome"
    );
    assert.equal(
        suggestSolveTarget("equity-method-investment", "find the ending investment balance"),
        "endingInvestmentBalance"
    );
    assert.equal(
        suggestSolveTarget("special-order-analysis", "find the minimum acceptable price"),
        "minimumAcceptablePricePerUnit"
    );
    assert.equal(
        suggestSolveTarget("make-or-buy-analysis", "which option has the cost advantage"),
        "costAdvantageAmount"
    );
    assert.equal(
        suggestSolveTarget("sell-or-process-further", "find incremental profit from processing"),
        "incrementalProfitFromProcessing"
    );
    assert.equal(
        suggestSolveTarget(
            "constrained-resource-product-mix",
            "compute contribution margin per constrained resource unit"
        ),
        "contributionMarginPerConstraintUnit"
    );
    assert.equal(
        suggestSolveTarget("budget-variance-analysis", "solve for spending variance"),
        "spendingVariance"
    );
    assert.equal(
        suggestSolveTarget("moving-average-forecast", "weighted moving average forecast"),
        "weightedMovingAverageForecast"
    );
});

runTest("new 6.0.0 shared budgeting and AFAR helpers compute expected rollforwards", () => {
    const labor = computeDirectLaborBudget({
        budgetedProductionUnits: 12000,
        directLaborHoursPerUnit: 1.5,
        directLaborRatePerHour: 110,
    });
    const overhead = computeFactoryOverheadBudget({
        budgetedProductionUnits: 12000,
        variableOverheadRatePerUnit: 18,
        fixedOverheadBudget: 220000,
    });
    const incomeStatement = computeBudgetedIncomeStatement({
        budgetedSalesAmount: 1450000,
        budgetedCostOfGoodsSold: 910000,
        totalOperatingExpenses: 206750,
        interestExpense: 28000,
        incomeTaxRatePercent: 25,
    });
    const equityMethod = computeEquityMethodInvestment({
        initialInvestment: 1800000,
        ownershipPercentage: 30,
        investeeNetIncome: 420000,
        investeeDividendsDeclared: 90000,
    });
    const ppe = computeIntercompanyPpeTransfer({
        transferPrice: 540000,
        carryingAmount: 480000,
        remainingUsefulLifeYears: 5,
        yearsSinceTransfer: 1,
    });

    assertClose(labor.totalDirectLaborHours, 18000);
    assertClose(labor.totalDirectLaborCost, 1980000);
    assertClose(overhead.variableFactoryOverheadBudget, 216000);
    assertClose(overhead.totalFactoryOverheadBudget, 436000);
    assertClose(incomeStatement.grossProfit, 540000);
    assertClose(incomeStatement.netIncome, 228937.5);
    assertClose(equityMethod.endingInvestmentBalance, 1899000);
    assertClose(ppe.annualExcessDepreciation, 12000);
    assertClose(ppe.unamortizedIntercompanyProfit, 48000);
});

runTest("new 7.0.0 managerial decision and forecasting helpers stay accurate", () => {
    const specialOrder = computeSpecialOrderDecision({
        specialOrderUnits: 1000,
        specialOrderPricePerUnit: 90,
        variableCostPerUnit: 65,
        incrementalFixedCosts: 12000,
    });
    const makeOrBuy = computeMakeOrBuyDecision({
        unitsNeeded: 2000,
        variableManufacturingCostPerUnit: 32,
        avoidableFixedCosts: 18000,
        purchasePricePerUnit: 44,
    });
    const processFurther = computeSellProcessFurther({
        units: 5000,
        salesValueAtSplitoffPerUnit: 20,
        salesValueAfterProcessingPerUnit: 29,
        separableProcessingCostPerUnit: 6,
    });
    const constrainedMix = computeConstrainedResourceProductMix({
        sellingPricePerUnit: 85,
        variableCostPerUnit: 55,
        constrainedResourceUnitsPerProduct: 4,
        constrainedResourceAvailableUnits: 2400,
    });
    const variance = computeBudgetVarianceAnalysis({
        actualResultAmount: 528000,
        flexibleBudgetAmount: 510000,
        staticBudgetAmount: 495000,
    });
    const forecast = computeMovingAverageForecast({
        period1Demand: 920,
        period2Demand: 980,
        period3Demand: 1040,
        weight1Percent: 20,
        weight2Percent: 30,
        weight3Percent: 50,
    });

    assertClose(specialOrder.incrementalRevenue, 90000);
    assertClose(specialOrder.incrementalCosts, 77000);
    assertClose(specialOrder.incrementalProfit, 13000);
    assertClose(specialOrder.minimumAcceptablePricePerUnit, 77);

    assertClose(makeOrBuy.relevantMakeCost, 82000);
    assertClose(makeOrBuy.relevantBuyCost, 88000);
    assertClose(makeOrBuy.costAdvantageAmount, 6000);
    assertClose(makeOrBuy.maximumAcceptablePurchasePricePerUnit, 41);
    assert.equal(makeOrBuy.preferredOption, "Make");

    assertClose(processFurther.incrementalRevenueFromProcessing, 45000);
    assertClose(processFurther.separableProcessingCosts, 30000);
    assertClose(processFurther.incrementalProfitFromProcessing, 15000);
    assertClose(processFurther.minimumFurtherProcessingPricePerUnit, 26);

    assertClose(constrainedMix.contributionMarginPerUnit, 30);
    assertClose(constrainedMix.contributionMarginPerConstraintUnit, 7.5);
    assertClose(constrainedMix.maximumUnitsFromConstraint, 600);
    assertClose(constrainedMix.totalContributionMarginAtConstraint, 18000);

    assertClose(variance.spendingVariance, 18000);
    assertClose(variance.activityVariance, 15000);
    assertClose(variance.totalBudgetVariance, 33000);
    assert.equal(variance.spendingVarianceLabel, "Unfavorable");
    assert.equal(variance.activityVarianceLabel, "Above static plan");

    assertClose(forecast.simpleMovingAverageForecast, 980);
    assertClose(forecast.weightedMovingAverageForecast, 998);
    assertClose(forecast.totalWeightPercent, 100);
    assertClose(forecast.latestTrendChange, 60);
});

runTest("new 8.1.0 transfer-pricing helper stays aligned with relevant-costing logic", () => {
    const result = computeTransferPricingSupport({
        variableCostPerUnit: 58,
        opportunityCostPerUnit: 12,
        externalMarketPricePerUnit: 85,
    });

    assertClose(result.minimumTransferPrice, 70);
    assertClose(result.marketBasedCeiling, 85);
    assertClose(result.transferPricingRangeWidth, 15);
});

runTest("notes discounting helper separates maturity value and bank discount", () => {
    const result = computeNotesReceivableDiscounting({
        faceValue: 250000,
        statedRatePercent: 10,
        bankDiscountRatePercent: 12,
        timeYears: 0.5,
    });

    assertClose(result.noteInterest, 12500);
    assertClose(result.maturityValue, 262500);
    assertClose(result.bankDiscountAmount, 15750);
    assertClose(result.proceedsFromDiscounting, 246750);
});

runTest("new formula solve definitions stay mathematically aligned", () => {
    const laborSolve = directLaborBudgetSolveDefinition.solve("totalDirectLaborCost", {
        budgetedProductionUnits: 12000,
        directLaborHoursPerUnit: 1.5,
        directLaborRatePerHour: 110,
    });
    const incomeSolve = budgetedIncomeStatementSolveDefinition.solve("netIncome", {
        budgetedSalesAmount: 1450000,
        budgetedCostOfGoodsSold: 910000,
        totalOperatingExpenses: 206750,
        interestExpense: 28000,
        ratePercent: 25,
    });

    assert.equal("error" in laborSolve, false);
    assert.equal("error" in incomeSolve, false);
    if (!("error" in laborSolve)) {
        assert.equal(laborSolve.primaryResult.value, "₱1,980,000.00");
    }
    if (!("error" in incomeSolve)) {
        assert.equal(incomeSolve.primaryResult.value, "₱228,937.50");
    }
});

runTest("new 7.0.0 solve definitions stay aligned with shared decision math", () => {
    const specialOrderSolve = specialOrderDecisionSolveDefinition.solve(
        "minimumAcceptablePricePerUnit",
        {
            specialOrderUnits: 1000,
            specialOrderPricePerUnit: 90,
            variableCostPerUnit: 65,
            incrementalFixedCosts: 12000,
        }
    );
    const makeOrBuySolve = makeOrBuyDecisionSolveDefinition.solve("costAdvantageAmount", {
        unitsNeeded: 2000,
        variableManufacturingCostPerUnit: 32,
        avoidableFixedCosts: 18000,
        purchasePricePerUnit: 44,
    });
    const processFurtherSolve = sellProcessFurtherSolveDefinition.solve(
        "incrementalProfitFromProcessing",
        {
            units: 5000,
            salesValueAtSplitoffPerUnit: 20,
            salesValueAfterProcessingPerUnit: 29,
            separableProcessingCostPerUnit: 6,
        }
    );
    const constrainedMixSolve = constrainedResourceProductMixSolveDefinition.solve(
        "contributionMarginPerConstraintUnit",
        {
            sellingPricePerUnit: 85,
            variableCostPerUnit: 55,
            constrainedResourceUnitsPerProduct: 4,
            constrainedResourceAvailableUnits: 2400,
        }
    );
    const budgetVarianceSolve = budgetVarianceAnalysisSolveDefinition.solve(
        "spendingVariance",
        {
            actualResultAmount: 528000,
            flexibleBudgetAmount: 510000,
            staticBudgetAmount: 495000,
        }
    );
    const forecastSolve = movingAverageForecastSolveDefinition.solve(
        "weightedMovingAverageForecast",
        {
            period1Demand: 920,
            period2Demand: 980,
            period3Demand: 1040,
            weight1Percent: 20,
            weight2Percent: 30,
            weight3Percent: 50,
        }
    );

    assert.equal("error" in specialOrderSolve, false);
    assert.equal("error" in makeOrBuySolve, false);
    assert.equal("error" in processFurtherSolve, false);
    assert.equal("error" in constrainedMixSolve, false);
    assert.equal("error" in budgetVarianceSolve, false);
    assert.equal("error" in forecastSolve, false);

    if (!("error" in specialOrderSolve)) {
        assert.equal(specialOrderSolve.primaryResult.value, "₱77.00");
    }
    if (!("error" in makeOrBuySolve)) {
        assert.equal(makeOrBuySolve.primaryResult.value, "₱6,000.00");
    }
    if (!("error" in processFurtherSolve)) {
        assert.equal(processFurtherSolve.primaryResult.value, "₱15,000.00");
    }
    if (!("error" in constrainedMixSolve)) {
        assert.equal(constrainedMixSolve.primaryResult.value, "₱7.50");
    }
    if (!("error" in budgetVarianceSolve)) {
        assert.equal(budgetVarianceSolve.primaryResult.value, "₱18,000.00");
    }
    if (!("error" in forecastSolve)) {
        assert.equal(forecastSolve.primaryResult.value, "998");
    }
});

runTest("new 8.1.0 transfer-pricing solve definition stays aligned with shared math", () => {
    const transferPricingSolve = transferPricingSupportSolveDefinition.solve(
        "transferPricingRangeWidth",
        {
            variableCostPerUnit: 58,
            opportunityCostPerUnit: 12,
            externalMarketPricePerUnit: 85,
        }
    );

    assert.equal("error" in transferPricingSolve, false);
    if (!("error" in transferPricingSolve)) {
        assert.equal(transferPricingSolve.primaryResult.value, "₱15.00");
    }
});

runTest("search routes surfaces new 6.0.0 budgeting and AFAR tools", () => {
    assert.equal(searchAppRoutes("direct labor budget")[0]?.path, "/business/direct-labor-budget");
    assert.equal(searchAppRoutes("pro forma income statement")[0]?.path, "/business/budgeted-income-statement");
    assert.equal(searchAppRoutes("bank discount on note")[0]?.path, "/accounting/notes-receivable-discounting");
    assert.equal(searchAppRoutes("equity method investment")[0]?.path, "/afar/equity-method-investment");
    assert.equal(searchAppRoutes("intercompany equipment transfer")[0]?.path, "/afar/intercompany-ppe-transfer");
});

runTest("search routes surfaces new 7.0.0 managerial and operations tools", () => {
    assert.equal(searchAppRoutes("special order decision")[0]?.path, "/business/special-order-analysis");
    assert.equal(searchAppRoutes("outsource or produce internally")[0]?.path, "/business/make-or-buy-analysis");
    assert.equal(searchAppRoutes("split off processing decision")[0]?.path, "/business/sell-or-process-further");
    assert.equal(searchAppRoutes("bottleneck contribution margin")[0]?.path, "/business/constrained-resource-product-mix");
    assert.equal(searchAppRoutes("spending variance activity variance")[0]?.path, "/business/budget-variance-analysis");
    assert.equal(searchAppRoutes("weighted moving average demand forecast")[0]?.path, "/operations/moving-average-forecast");
});

runTest("search routes surfaces new 8.1.0 transfer-pricing support", () => {
    assert.equal(
        searchAppRoutes("minimum transfer price")[0]?.path,
        "/business/transfer-pricing-support"
    );
});

runTest("search routes surface completion-pass FAR, operations, audit, tax, AIS, governance, RFBT, and strategic additions", () => {
    assert.equal(
        searchAppRoutes("qualifying asset avoidable interest")[0]?.path,
        "/far/borrowing-costs-capitalization"
    );
    assert.equal(
        searchAppRoutes("cost plus pricing target margin")[0]?.path,
        "/operations/cost-plus-pricing"
    );
    assert.equal(
        searchAppRoutes("audit assertion evidence working paper")[0]?.path,
        "/audit/assertion-evidence-planner"
    );
    assert.equal(
        searchAppRoutes("excise tax local taxation incentives")[0]?.path,
        "/tax/excise-local-and-incentive-review"
    );
    assert.equal(
        searchAppRoutes("erp crm business intelligence controls")[0]?.path,
        "/ais/enterprise-systems-control-mapper"
    );
    assert.equal(
        searchAppRoutes("management override stakeholder ethics")[0]?.path,
        "/governance/ethics-decision-workspace"
    );
    assert.equal(
        searchAppRoutes("insider trading corporate governance")[0]?.path,
        "/rfbt/securities-and-governance-review"
    );
    assert.equal(
        searchAppRoutes("balanced scorecard learning and growth")[0]?.path,
        "/strategic/balanced-scorecard-workspace"
    );
});

runTest("workpaper templates register completion-pass support sheets", () => {
    assert.ok(getWorkpaperTemplate("borrowing-costs-capitalization-support"));
    assert.ok(getWorkpaperTemplate("cost-plus-pricing-support"));
    assert.ok(getWorkpaperTemplate("audit-assertion-evidence-support"));
    assert.ok(getWorkpaperTemplate("enterprise-systems-control-map"));
    assert.ok(getWorkpaperTemplate("ethics-decision-support"));
    assert.ok(getWorkpaperTemplate("balanced-scorecard-support"));
});

runTest("v10 library-driven statement analysis helpers stay internally consistent", () => {
    const dupont = computeDupontAnalysis({
        netIncome: 98_000,
        netSales: 950_000,
        averageAssets: 760_000,
        averageEquity: 380_000,
    });
    assert.equal(Number(dupont.profitMargin.toFixed(6)), Number((98_000 / 950_000).toFixed(6)));
    assert.equal(Number(dupont.dupontReturnOnEquity.toFixed(6)), Number(dupont.returnOnEquity.toFixed(6)));

    const quality = computeEarningsQuality({
        netIncome: 98_000,
        operatingCashFlow: 84_000,
        averageTotalAssets: 760_000,
    });
    assert.equal(quality.totalAccruals, 14_000);
    assert.equal(Number(quality.accrualRatio.toFixed(6)), Number((14_000 / 760_000).toFixed(6)));
});

runTest("v10 provisions, franchise revenue, retail pricing, and intervals compute expected values", () => {
    const provision = computeProvisionExpectedValue([
        { label: "Low", amount: 200_000, probabilityPercent: 25 },
        { label: "Base", amount: 350_000, probabilityPercent: 50 },
        { label: "High", amount: 600_000, probabilityPercent: 25 },
    ]);
    assert.equal(provision.expectedValue, 375_000);
    assert.equal(provision.totalProbabilityPercent, 100);

    const franchise = computeFranchiseRevenue({
        initialFranchiseFee: 1_200_000,
        satisfiedPerformanceObligationPercent: 70,
        estimatedUncollectiblePercent: 5,
    });
    assert.equal(franchise.revenueRecognized, 840_000);
    assert.equal(franchise.contractLiability, 360_000);

    const retail = computeRetailMarkupMarkdown({
        unitCost: 480,
        initialRetailPrice: 800,
        markdownPercent: 15,
        unitsSold: 250,
    });
    assert.equal(retail.finalRetailPrice, 680);
    assert.equal(retail.grossProfit, 50_000);

    const interval = computeConfidenceInterval({
        sampleMean: 42.5,
        sampleStandardDeviation: 6.2,
        sampleSize: 64,
        confidenceLevelPercent: 95,
    });
    assert.equal(interval.criticalMethod, "t");
    assert.equal(Number(interval.marginOfError.toFixed(4)), 1.5422);

    const knownSigmaInterval = computeConfidenceInterval({
        sampleMean: 42.5,
        sampleStandardDeviation: 0,
        populationStandardDeviation: 6.2,
        sampleSize: 64,
        confidenceLevelPercent: 95,
    });
    assert.equal(knownSigmaInterval.criticalMethod, "z");
    assert.equal(Number(knownSigmaInterval.marginOfError.toFixed(4)), 1.519);
});

runTest("v10 capital rationing ranks by profitability index within a budget", () => {
    const result = computeCapitalRationingSelection([
        { label: "A", initialInvestment: 400_000, netPresentValue: 90_000 },
        { label: "B", initialInvestment: 500_000, netPresentValue: 75_000 },
        { label: "C", initialInvestment: 300_000, netPresentValue: 84_000 },
    ], 700_000);

    assert.deepEqual(result.selectedProjects.map((project) => project.label), ["C", "A"]);
    assert.equal(result.totalInvestment, 700_000);
    assert.equal(result.totalNpv, 174_000);
    assert.deepEqual(result.greedySelectedProjects.map((project) => project.label), ["C", "A"]);
    assert.equal(result.exactSearchEvaluated, true);
});

runTest("capital rationing exact combination can beat greedy PI ranking", () => {
    const result = computeCapitalRationingSelection([
        { label: "High PI Small", initialInvestment: 400_000, netPresentValue: 160_000 },
        { label: "Pair One", initialInvestment: 500_000, netPresentValue: 175_000 },
        { label: "Pair Two", initialInvestment: 500_000, netPresentValue: 175_000 },
    ], 1_000_000);

    assert.deepEqual(result.greedySelectedProjects.map((project) => project.label), ["High PI Small", "Pair One"]);
    assert.deepEqual(result.selectedProjects.map((project) => project.label), ["Pair One", "Pair Two"]);
    assert.equal(result.totalNpv, 350_000);
    assert.equal(result.optimizationImprovement, 15_000);
    assert.equal(result.selectionMethod, "exact-combination");
});

runTest("v10 discovery reaches book-inspired expansion routes", () => {
    assert.equal(searchAppRoutes("dupont roe equity multiplier")[0]?.path, "/accounting/dupont-analysis");
    assert.equal(searchAppRoutes("quality of earnings accrual ratio")[0]?.path, "/accounting/earnings-quality-analysis");
    assert.equal(searchAppRoutes("confidence interval margin of error")[0]?.path, "/statistics/confidence-interval");
    assert.equal(searchAppRoutes("franchise initial fee revenue")[0]?.path, "/afar/franchise-revenue-workspace");
    assert.ok(getWorkpaperTemplate("statement-analysis-quality-support"));
    assert.ok(getWorkpaperTemplate("retail-pricing-and-rationing-support"));
    assert.ok(getWorkpaperTemplate("provision-franchise-revenue-support"));
    assert.ok(getWorkpaperTemplate("confidence-interval-support"));
});

runTest("v10.1 completion-pass calculators compute expected classroom values", () => {
    const segment = computeSegmentMargin({
        sales: 950_000,
        variableCosts: 570_000,
        traceableFixedCosts: 180_000,
        commonFixedCosts: 60_000,
    });
    assert.equal(segment.contributionMargin, 380_000);
    assert.equal(segment.segmentMargin, 200_000);
    assert.equal(segment.incomeAfterAllocatedCommonCosts, 140_000);

    const sampling = computeAuditSamplingPlan({
        populationBookValue: 12_000_000,
        tolerableMisstatement: 600_000,
        expectedMisstatement: 120_000,
        confidenceFactor: 3,
    });
    assert.equal(sampling.allowanceForSamplingRisk, 480_000);
    assert.equal(sampling.sampleSize, 75);
    assert.equal(sampling.samplingInterval, 160_000);

    const pert = computePertEstimate({ optimistic: 4, mostLikely: 7, pessimistic: 13 });
    assert.equal(pert.expectedTime, 7.5);
    assert.equal(pert.standardDeviation, 1.5);
    assert.equal(pert.variance, 2.25);
});

runTest("v10.1 FAR and AFAR completion helpers keep deficit and recovery logic visible", () => {
    const quasi = computeQuasiReorganization({
        deficit: 1_800_000,
        sharePremium: 450_000,
        revaluationSurplus: 350_000,
        capitalReduction: 1_000_000,
    });
    assert.equal(quasi.totalDeficitRelief, 1_800_000);
    assert.equal(quasi.remainingDeficit, 0);
    assert.equal(quasi.cleanSurplusAchieved, true);

    const liquidation = computeCorporateLiquidation({
        estimatedAssetRealization: 5_200_000,
        liquidationCosts: 250_000,
        priorityLiabilities: 2_100_000,
        unsecuredLiabilities: 3_600_000,
    });
    assert.equal(liquidation.netEstateAvailable, 4_950_000);
    assert.equal(liquidation.amountAvailableForUnsecured, 2_850_000);
    assert.equal(liquidation.unsecuredDeficiency, 750_000);
    assertClose(liquidation.unsecuredRecoveryPercent, 79.1666666667);
});

runTest("v10.1 discovery and workpapers reach completion-pass additions", () => {
    assert.equal(searchAppRoutes("segment margin traceable fixed costs")[0]?.path, "/business/segmented-income-statement");
    assert.equal(searchAppRoutes("audit sampling sample size confidence factor")[0]?.path, "/audit/audit-sampling-planner");
    assert.equal(searchAppRoutes("pert optimistic most likely pessimistic")[0]?.path, "/operations/pert-project-estimate");
    assert.equal(searchAppRoutes("quasi reorganization deficit cleanup")[0]?.path, "/far/quasi-reorganization");
    assert.equal(searchAppRoutes("corporate liquidation statement of affairs")[0]?.path, "/afar/corporate-liquidation");
    assert.equal(searchAppRoutes("voidable unenforceable defective contracts")[0]?.path, "/rfbt/defective-contracts-classifier");
    assert.equal(searchAppRoutes("logical access privileged segregation of duties")[0]?.path, "/ais/access-control-review");
    assert.ok(getWorkpaperTemplate("segmented-income-statement-support"));
    assert.ok(getWorkpaperTemplate("audit-sampling-support"));
    assert.ok(getWorkpaperTemplate("pert-project-support"));
    assert.ok(getWorkpaperTemplate("liquidation-and-quasi-reorg-support"));
    assert.ok(getWorkpaperTemplate("rfbt-ais-review-support"));
});

runTest("v10.1 expanded completion math covers ABC, FAR assets, AFAR joint arrangements, and SQC", () => {
    const abc = computeActivityBasedCosting({
        directMaterials: 180_000,
        directLabor: 120_000,
        units: 5_000,
        activityOneCost: 300_000,
        activityOneTotalDriver: 600,
        activityOneProductDriver: 120,
        activityTwoCost: 240_000,
        activityTwoTotalDriver: 8_000,
        activityTwoProductDriver: 1_700,
    });
    assert.equal(abc.activityOneRate, 500);
    assert.equal(abc.activityTwoRate, 30);
    assert.equal(abc.totalOverheadAssigned, 111_000);
    assert.equal(abc.unitProductCost, 82.2);

    const asset = computeFinancialAssetAmortizedCost({
        openingCarryingAmount: 960_000,
        faceValue: 1_000_000,
        statedRatePercent: 8,
        effectiveRatePercent: 9,
        expectedCreditLoss: 12_000,
    });
    assert.equal(asset.cashInterest, 80_000);
    assert.equal(asset.interestRevenue, 86_400);
    assert.equal(asset.endingGrossCarryingAmount, 966_400);
    assert.equal(asset.netCarryingAmount, 954_400);

    const investmentProperty = computeInvestmentPropertyMeasurement({
        carryingAmount: 4_200_000,
        fairValue: 4_550_000,
        annualDepreciation: 160_000,
    });
    assert.equal(investmentProperty.fairValueGainOrLoss, 350_000);
    assert.equal(investmentProperty.costModelEndingCarryingAmount, 4_040_000);

    const joint = computeJointArrangementShare({
        ownershipPercent: 40,
        arrangementAssets: 3_200_000,
        arrangementLiabilities: 1_100_000,
        arrangementRevenue: 1_800_000,
        arrangementExpenses: 1_250_000,
    });
    assert.equal(joint.shareOfAssets, 1_280_000);
    assert.equal(joint.shareOfLiabilities, 440_000);
    assert.equal(joint.shareOfProfit, 220_000);

    const quality = computeQualityControlChart({
        processMean: 50,
        processStandardDeviation: 4.8,
        sampleSize: 9,
        observations: [47.9, 51.2, 55.4],
    });
    assert.equal(quality.lowerControlLimit, 45.2);
    assert.equal(quality.upperControlLimit, 54.8);
    assert.equal(quality.outOfControlCount, 1);
});

runTest("v11 shared governance, continuity, and strategic helpers stay coherent", () => {
    const continuity = computeBusinessContinuityReadiness({
        backupRecovery: 4,
        incidentResponse: 5,
        vendorResilience: 3,
        communicationsReadiness: 4,
        recoveryTimeObjectiveHours: 10,
        expectedRecoveryHours: 8,
    });
    assert.equal(continuity.readinessAverage, 4);
    assert.equal(continuity.readinessPercent, 80);
    assert.equal(continuity.recoveryGapHours, -2);
    assert.equal(continuity.withinObjective, true);

    const governance = computeControlEnvironmentStrength({
        oversightStrength: 4,
        ethicsProgramStrength: 5,
        accountabilityStrength: 3,
        competenceStrength: 4,
        escalationStrength: 4,
    });
    assert.equal(governance.controlEnvironmentAverage, 4);
    assert.equal(governance.overrideRiskIndex, 2);

    const businessCase = computeBusinessCaseScore({
        marketAttractiveness: 4.4,
        costAdvantage: 3.8,
        controlReadiness: 3.6,
        executionCapacity: 4.2,
        riskPenalty: 0.55,
    });
    assert.equal(businessCase.weightedScore, 3.46);
    assert.equal(businessCase.recommendation, "Proceed only with tighter assumptions");
});

runTest("v12.4 academic expansion helpers guide audit, AIS, and governance follow-up", () => {
    const audit = computeAuditMisstatementEvaluation({
        tolerableMisstatement: 500_000,
        projectedMisstatement: 330_000,
        allowanceForSamplingRisk: 140_000,
        clearlyTrivialThreshold: 50_000,
        qualitativeConcernCount: 1,
    });
    assert.equal(audit.upperMisstatementLimit, 470_000);
    assert.equal(audit.headroom, 30_000);
    assertClose(audit.utilizationRate, 0.94);
    assertClose(audit.qualitativePenalty, 0.08);
    assertClose(audit.adjustedRiskIndex, 1.02);
    assert.equal(audit.aboveClearlyTrivial, true);
    assert.match(audit.conclusion, /close enough to tolerable misstatement/i);

    const ais = computeSegregationOfDutiesConflict({
        authorizationCustodyConflict: 3,
        custodyRecordingConflict: 2,
        recordingReconciliationConflict: 4,
        privilegedAccessConflict: 1,
        compensatingReviewStrength: 2,
    });
    assert.equal(ais.rawConflictScore, 10);
    assertClose(ais.mitigationCredit, 0.9);
    assertClose(ais.netConflictScore, 9.1);
    assert.equal(ais.dominantConflict, "Recording with reconciliation");
    assert.equal(ais.riskLabel, "Severe segregation-of-duties exposure");
    assert.match(ais.recommendedResponse, /separate incompatible duties/i);

    const governance = computeGovernanceEscalationPlan({
        issueSeverity: 4,
        overrideRisk: 3,
        stakeholderExposure: 3,
        documentationStrength: 1,
        oversightReadiness: 2,
    });
    assert.equal(governance.escalationScore, 15);
    assert.equal(governance.preserveEvidence, true);
    assert.equal(governance.urgency, "Immediate");
    assert.equal(governance.escalationTier, "Audit committee or board-level escalation");
    assert.match(governance.recommendedMove, /preserve evidence/i);
    assert.match(governance.governanceSignal, /documentation is thin/i);
});

runTest("v12.4 academic expansion routes are discoverable through the catalog", () => {
    assert.equal(
        searchAppRoutes("audit projected misstatement allowance sampling risk")[0]?.path,
        "/audit/misstatement-evaluation-workspace"
    );
    assert.equal(
        searchAppRoutes("segregation of duties custody recording privileged access")[0]?.path,
        "/ais/segregation-of-duties-conflict-matrix"
    );
    assert.equal(
        searchAppRoutes("governance escalation management override audit committee")[0]?.path,
        "/governance/governance-escalation-planner"
    );
});

runTest("v13 academic expansion routes are discoverable and routed", () => {
    assert.equal(
        searchAppRoutes("conceptual framework recognition measurement basis")[0]?.path,
        "/far/conceptual-framework-recognition"
    );
    assert.equal(
        searchAppRoutes("standalone selling price performance obligation contract liability")[0]?.path,
        "/far/revenue-allocation-workspace"
    );
    assert.equal(
        searchAppRoutes("taxable income permanent temporary difference deferred tax")[0]?.path,
        "/tax/taxable-income-bridge"
    );
    assert.equal(
        searchAppRoutes("target costing")[0]?.path,
        "/strategic/target-costing-workspace"
    );

    const smart = analyzeSmartInput(
        { ...INITIAL_FIELDS },
        "The case asks for revenue recognition using standalone selling prices and performance obligations, then whether a contract liability remains."
    );
    assert.equal(smart.best?.route, "/far/revenue-allocation-workspace");

    const scanRoutes = recommendScanRoutes(
        "Taxable income bridge: accounting income, permanent difference, temporary difference, current tax and deferred tax.",
        "word-problem"
    );
    assert.equal(scanRoutes[0]?.path, "/tax/taxable-income-bridge");
});

runTest("v10.1 expanded completion discovery reaches new calculator and workpaper coverage", () => {
    assert.equal(searchAppRoutes("activity based costing cost pool driver")[0]?.path, "/business/activity-based-costing");
    assert.equal(searchAppRoutes("financial asset amortized cost effective interest")[0]?.path, "/far/financial-asset-amortized-cost");
    assert.equal(searchAppRoutes("investment property fair value model")[0]?.path, "/far/investment-property-measurement");
    assert.equal(searchAppRoutes("joint arrangement joint operation share of profit")[0]?.path, "/afar/joint-arrangement-analyzer");
    assert.equal(searchAppRoutes("quality control chart ucl lcl")[0]?.path, "/operations/quality-control-chart");
    assert.ok(getWorkpaperTemplate("abc-and-quality-support"));
    assert.ok(getWorkpaperTemplate("financial-assets-and-investment-property"));
    assert.ok(getWorkpaperTemplate("joint-arrangement-support"));
    assert.equal(suggestSolveTarget("activity-based-costing", "compute unit product cost"), "unitProductCost");
    assert.equal(suggestSolveTarget("quality-control-chart", "find the UCL and LCL control limits"), "controlLimits");
});

runTest("smart solver target suggestions understand transfer-pricing prompts", () => {
    assert.equal(
        suggestSolveTarget("transfer-pricing-support", "find the minimum transfer price"),
        "minimumTransferPrice"
    );
    assert.equal(
        suggestSolveTarget("transfer-pricing-support", "compute the negotiation range"),
        "transferPricingRangeWidth"
    );
    assert.equal(
        suggestSolveTarget(
            "borrowing-costs-capitalization",
            "how much avoidable interest should be capitalized"
        ),
        "capitalizableBorrowingCost"
    );
    assert.equal(
        suggestSolveTarget("cost-plus-pricing", "find the markup percent on cost"),
        "markUpPercent"
    );
    assert.equal(
        suggestSolveTarget("audit-sampling-planner", "find the sample size"),
        "sampleSize"
    );
    assert.equal(
        suggestSolveTarget("segmented-income-statement", "compute segment margin"),
        "segmentMargin"
    );
    assert.equal(
        suggestSolveTarget("pert-project-estimate", "compute expected project time"),
        "expectedTime"
    );
});

runTest("borrowing costs capitalization computes avoidable interest consistently", () => {
    const result = computeBorrowingCostsCapitalization({
        averageAccumulatedExpenditures: 8_500_000,
        capitalizationRatePercent: 9.5,
        capitalizationMonths: 8,
    });

    assert.equal(result.capitalizationFraction, 8 / 12);
    assert.equal(result.annualAvoidableInterest, 807500);
    assert.equal(
        Number(result.capitalizableBorrowingCost.toFixed(6)),
        Number((538333.3333333334).toFixed(6))
    );
});

runTest("account reference search finds aliases and abbreviations", () => {
    const adaResults = searchAccountReferences("ada");
    const payableResults = searchAccountReferences("payable");

    assert.equal(adaResults[0]?.name, "Allowance for Doubtful Accounts");
    assert.equal(payableResults.some((entry) => entry.name === "Accounts Payable"), true);
});

runTest("network status snapshots stay referentially stable", () => {
    assert.equal(getNetworkStatusSnapshot(true), getNetworkStatusSnapshot(true));
    assert.equal(getNetworkStatusSnapshot(false), getNetworkStatusSnapshot(false));
    assert.notEqual(getNetworkStatusSnapshot(true), getNetworkStatusSnapshot(false));
});

runTest("result display normalizes long plain numeric tokens", () => {
    assert.equal(normalizeResultValue("1234567.8912"), "1,234,567.8912");
    assert.equal(normalizeResultValue("$1234567.89"), "$1,234,567.89");
    assert.equal(normalizeResultValue("Recovered"), "Recovered");
});

runTest("result display tone distinguishes numeric and sentence values", () => {
    assert.equal(getResultValueTone("$1,234,567.89"), "numeric");
    assert.equal(getResultValueTone("Not yet balanced"), "label");
    assert.equal(
        getResultValueTone(
            "This route needs more values before the calculator can solve safely."
        ),
        "sentence"
    );
});

runTest("wide result heuristics flag dense cards before layout collapses", () => {
    assert.equal(
        isWideResultValue({
            title: "Required Ending Allowance",
            value: "$1,234,567.89",
        }),
        true
    );
    assert.equal(
        isWideResultValue({
            title: "Status",
            value: "Balanced",
        }),
        false
    );
});

runTest("smart solver routes bank reconciliation ahead of generic finance matches", () => {
    const analysis = analyzeSmartInput(
        { ...INITIAL_FIELDS },
        "Prepare a bank reconciliation. Bank balance is 120000, book balance is 118500, deposits in transit are 8000, outstanding checks are 6500, service charges are 500, NSF checks are 1200, and interest income is 300."
    );

    assert.equal(analysis.topicFamily?.id, "bank-reconciliation");
    assert.equal(analysis.best?.id, "bank-reconciliation");
    assert.equal(analysis.extracted.bankBalance, "120000");
    assert.equal(analysis.extracted.bookBalance, "118500");
    assert.equal(analysis.extracted.sales, "");
    assert.equal(analysis.extracted.grossProfitRate, "");
});

runTest("smart solver keeps cash-budget support routes secondary instead of contaminating the primary route", () => {
    const analysis = analyzeSmartInput(
        { ...INITIAL_FIELDS },
        "Prepare a cash budget for April with beginning cash 50000, cash collections of 180000, cash disbursements of 210000, and a minimum cash balance of 25000. We may need financing, and the instructor also wants separate cash collections and cash disbursements support schedules."
    );

    assert.equal(analysis.topicFamily?.id, "cash-budget-suite");
    assert.equal(analysis.best?.id, "cash-budget");
    assert.equal(
        analysis.secondaryRoutes.some((route) => route.id === "cash-collections-schedule"),
        true
    );
    assert.equal(
        analysis.secondaryRoutes.some((route) => route.id === "cash-disbursements-schedule"),
        true
    );
    assert.equal(analysis.extracted.beginningCashBalance, "50000");
    assert.equal(analysis.extracted.minimumCashBalance, "25000");
});

runTest("smart solver protects intercompany PPE prompts from generic rate contamination", () => {
    const analysis = analyzeSmartInput(
        { ...INITIAL_FIELDS },
        "Parent sold equipment to subsidiary for 260000 when the carrying amount was 200000. The remaining useful life is 5 years. Compute the excess depreciation and the unamortized intercompany profit for year 2."
    );

    assert.equal(analysis.topicFamily?.id, "intercompany-ppe");
    assert.equal(analysis.best?.id, "intercompany-ppe-transfer");
    assert.equal(analysis.extracted.transferPrice, "260000");
    assert.equal(analysis.extracted.carryingAmount, "200000");
    assert.equal(analysis.extracted.usefulLife, "5");
    assert.equal(analysis.extracted.year, "2");
    assert.equal(analysis.extracted.annualRate, "");
    assert.equal(analysis.extracted.grossProfitRate, "");
});

runTest("smart solver keeps study-first prompts out of false ready-to-open states", () => {
    const analysis = analyzeSmartInput(
        { ...INITIAL_FIELDS },
        "Explain the difference between markup on cost and gross profit on sales, then recommend the lesson I should study before using any calculator."
    );

    assert.equal(analysis.hasStrongMatch, false);
    assert.equal(analysis.isReadyToRoute, false);
    assert.equal(
        analysis.warnings.some((warning) => /study or explanation request/i.test(warning)),
        true
    );
});

runTest("ocr parser uses topic-first extraction for cash-budget style text", () => {
    const parsed = parseOcrText(
        [
            "Cash Budget",
            "Beginning cash balance 50,000",
            "Cash collections 180,000",
            "Cash disbursements 210,000",
            "Minimum cash balance 25,000",
            "For April 2026",
        ].join("\n"),
        88
    );

    assert.equal(parsed.routeHint, "/business/cash-budget");
    assert.equal(
        parsed.structuredFields?.some((field) => field.key === "beginningCashBalance"),
        true
    );
    assert.equal(
        parsed.structuredFields?.some(
            (field) =>
                field.key === "beginningCashBalance" && field.normalizedValue === "2026"
        ),
        false
    );
});

SMART_SOLVER_EVALUATION_PACK.forEach((testCase) => {
    runTest(`smart solver evaluation pack: ${testCase.id}`, () => {
        if (testCase.level === "OCR") {
            const parsed = parseOcrText(testCase.prompt, testCase.ocrConfidence ?? 85);

            assert.equal(parsed.routeHint, testCase.expectedRouteHint);

            Object.entries(testCase.expectedExtractedFields ?? {}).forEach(([key, value]) => {
                assert.equal(
                    parsed.structuredFields?.some(
                        (field) =>
                            field.key === key && field.normalizedValue === value
                    ),
                    true
                );
            });

            return;
        }

        const analysis = analyzeSmartInput({ ...INITIAL_FIELDS }, testCase.prompt);

        if (testCase.shouldRemainUncertain) {
            assert.equal(analysis.isReadyToRoute, false);
            assert.equal(analysis.hasStrongMatch, false);
        } else {
            assert.equal(analysis.best?.id, testCase.expectedPrimaryRoute);
        }

        (testCase.expectedSecondaryRoutes ?? []).forEach((routeId) => {
            assert.equal(
                analysis.secondaryRoutes.some((route) => route.id === routeId),
                true
            );
        });

        Object.entries(testCase.expectedExtractedFields ?? {}).forEach(([key, value]) => {
            assert.equal(analysis.extracted[key as keyof typeof analysis.extracted], value);
        });
    });
});

process.stdout.write("All calculator math tests passed.\n");
