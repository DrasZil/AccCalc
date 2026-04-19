import assert from "node:assert/strict";
import { computeBreakEven, computeBankReconciliation, computeBookTaxDifference, computeBondAmortizationSchedule, computeBusinessCombination, computeCashDiscount, computeCashBudget, computeCashCollectionsSchedule, computeCashConversionCycle, computeCashDisbursementsSchedule, computeCashRatio, computePettyCashReconciliation, computeCapitalBudgetingComparison, computeCapacityUtilization, computeConstructionRevenue, computeCustomerPayback, computeCoefficientOfVariation, computeCommonSizeStatement, computeCompoundInterest, computeElasticityShift, computeCurrentRatio, computeDepreciationComparisonSchedule, computeDiscountedPaybackPeriod, computeDoubleDecliningBalance, computeEconomicOrderQuantity, computeEffectiveAnnualRate, computeEquivalentUnitsWeightedAverage, computeEquityMultiplier, computeFlexibleBudget, computeFutureValue, computeFutureValueOfOrdinaryAnnuity, computeFactoryOverheadVariances, computeForeignCurrencyTranslation, computeGrossProfitRate, computeHorizontalAnalysisWorkspace, computeHighLowCostEstimation, computeInternalRateOfReturn, computeImpairmentLoss, computeInventoryShrinkage, computeInventoryMethodComparison, computeJobOrderCostSheet, computeLaborEfficiencyVariance, computeLoanAmortization, computeLoanAmortizationSchedule, computeLowerOfCostOrNrv, computeMarkupMargin, computeMaterialsQuantityVariance, computeNetPresentValue, computeOwnerSplit, computePartnershipAdmissionBonus, computePartnershipAdmissionGoodwill, computePartnerCapitalEndingBalance, computePartnershipProfitSharing, computePartnershipRetirementBonus, computePartnershipSalaryInterestAllocation, computePaybackPeriod, computePresentValue, computePresentValueOfOrdinaryAnnuity, computeProductionBudget, computePrepaidExpenseAdjustment, computePricingPlanner, computeProfitabilityIndex, computePriceElasticity, computeQuickRatio, computeRealInterestRate, computeRatioAnalysisWorkspace, computeRoiRiEva, computeReceivablesAgingSchedule, computeShareBasedPayment, computeAccruedExpenseAdjustment, computeAccruedRevenueAdjustment, computeSalesForecast, computeSalesMixBreakEven, computeSimpleInterest, computeSinkingFundDeposit, computeStatementOfCashFlows, computeStandardDeviation, computeStartupCostPlan, computeStraightLineDepreciation, computeDirectMaterialsPurchasesBudget, computeUnearnedRevenueAdjustment, computeTargetProfit, computeTradeDiscount, computeTrialBalance, computeTurnoverWithDayBasis, computeUnitEconomics, computeAssetDisposal, computeWithholdingTax, computeWeightedMean, computeWorkingCapitalCycle, computeLeaseMeasurement, computeMarketEquilibrium, computeSurplusAtEquilibrium, computeCashRunway, } from "../src/utils/calculatorMath.js";
import { breakEvenSolveDefinition, currentRatioSolveDefinition, priceCostMarginSolveDefinition, simpleInterestSolveDefinition, timeValueSolveDefinition, } from "../src/utils/formulaSolveDefinitions.js";
import { searchAccountReferences } from "../src/utils/accountingReference.js";
import { searchAppRoutes } from "../src/utils/appSearch.js";
import { suggestSolveTarget } from "../src/features/smart/smartSolver.targets.js";
import { parseNumberList } from "../src/utils/listParsers.js";
import { getNetworkStatusSnapshot } from "../src/utils/networkStatus.js";
import { getResultValueTone, isWideResultValue, normalizeResultValue, } from "../src/utils/resultDisplay.js";
import { evaluateCellInput } from "../src/features/workpapers/workpaperFormula.js";
import { getWorkpaperTemplate } from "../src/features/workpapers/workpaperTemplates.js";
import { applyStyleToRange, clearRangeCells, createEmptySheet, createSelectionRange, createWorkbook, duplicateRangeToTarget, formatDisplayValue, getCellKey, getReadableTextColor, insertRows, resolveWorkpaperCellStyle, shiftFormulaReferences, } from "../src/features/workpapers/workpaperUtils.js";
function assertClose(actual, expected, precision = 1e-6) {
    assert.ok(Math.abs(actual - expected) <= precision, `Expected ${actual} to be within ${precision} of ${expected}`);
}
function runTest(name, assertion) {
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
    assert.equal(evaluateCellInput(workbook, sheet.id, "=SQRT(-1)").errorMessage, "SQRT needs a zero or positive value.");
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
runTest("workpaper range helpers support formula shifting, formatting, and structure changes", () => {
    let sheet = createEmptySheet({
        title: "Ops",
        rowCount: 6,
        columnCount: 4,
        cells: {
            [getCellKey(0, 0)]: { input: "100" },
            [getCellKey(0, 1)]: { input: "=A1*10%" },
        },
    });
    const range = createSelectionRange({ rowIndex: 0, columnIndex: 0 }, { rowIndex: 0, columnIndex: 1 });
    sheet = applyStyleToRange(sheet, range, { numberFormat: "currency", bold: true });
    assert.equal(sheet.cells[getCellKey(0, 0)]?.style?.numberFormat, "currency");
    assert.equal(sheet.cells[getCellKey(0, 1)]?.style?.bold, true);
    assert.equal(shiftFormulaReferences("=A1+B1", 1, 0), "=A2+B2");
    sheet = duplicateRangeToTarget(sheet, range, { rowIndex: 1, columnIndex: 0 });
    assert.equal(sheet.cells[getCellKey(1, 1)]?.input, "=A2*10%");
    sheet = insertRows(sheet, 1, 1);
    assert.equal(sheet.cells[getCellKey(0, 1)]?.input, "=A1*10%");
    sheet = clearRangeCells(sheet, createSelectionRange({ rowIndex: 0, columnIndex: 0 }, { rowIndex: 0, columnIndex: 0 }));
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
    assert.ok(pettyCash);
    assert.ok(adjustments);
    assert.ok(production);
    assert.ok(materials);
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
    const profitabilityIndex = computeProfitabilityIndex(250000, 12, [70000, 80000, 90000, 85000], 30000);
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
    const result = computeCommonSizeStatement([
        { label: "Cost of Sales", amount: 320000 },
        { label: "Gross Profit", amount: 180000 },
    ], 500000);
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
    const startup = computeStartupCostPlan([
        { label: "Permits", amount: 12000 },
        { label: "Equipment", amount: 85000 },
        { label: "Inventory", amount: 45000 },
    ], 10, 50000);
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
    assertClose(withholdingTax.rateDecimal, 0.1);
    assertClose(withholdingTax.taxWithheld, 8500);
    assertClose(withholdingTax.netAfterWithholding, 76500);
});
runTest("capital budgeting comparison combines project metrics", () => {
    const result = computeCapitalBudgetingComparison(100000, 12, [30000, 35000, 40000, 45000], 25000);
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
    if ("error" in result)
        return;
    assert.equal(result.primaryResult.value, "₱10,000.00");
});
runTest("time-value solve mode can isolate rate", () => {
    const result = timeValueSolveDefinition.solve("rate", {
        presentValue: 10000,
        futureValue: 11576.25,
        time: 3,
    });
    assert.equal("error" in result, false);
    if ("error" in result)
        return;
    assert.equal(result.primaryResult.value, "5.00%");
});
runTest("price and margin planner can solve target selling price", () => {
    const result = priceCostMarginSolveDefinition.solve("sellingPrice", {
        cost: 700,
        marginPercent: 30,
    });
    assert.equal("error" in result, false);
    if ("error" in result)
        return;
    assert.equal(result.primaryResult.value, "₱1,000.00");
});
runTest("current ratio solve mode can isolate current liabilities", () => {
    const result = currentRatioSolveDefinition.solve("currentLiabilities", {
        currentAssets: 250000,
        currentRatio: 2.5,
    });
    assert.equal("error" in result, false);
    if ("error" in result)
        return;
    assert.equal(result.primaryResult.value, "₱100,000.00");
});
runTest("break-even solve mode can isolate fixed costs", () => {
    const result = breakEvenSolveDefinition.solve("fixedCosts", {
        breakEvenUnits: 1000,
        sellingPricePerUnit: 250,
        variableCostPerUnit: 150,
    });
    assert.equal("error" in result, false);
    if ("error" in result)
        return;
    assert.equal(result.primaryResult.value, "₱100,000.00");
});
runTest("number list parser accepts mixed separators and rejects bad entries", () => {
    const parsed = parseNumberList("10, 20\n30;40");
    const invalid = parseNumberList("10, nope, 30");
    assert.deepEqual(parsed.values, [10, 20, 30, 40]);
    assert.equal(parsed.error, null);
    assert.equal(invalid.error !== null, true);
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
    const impairmentResults = searchAppRoutes("recoverable amount value in use");
    const disposalResults = searchAppRoutes("gain on sale of equipment");
    const withholdingResults = searchAppRoutes("expanded withholding tax");
    assert.equal(npvResults[0]?.path, "/finance/npv");
    assert.equal(typoResults[0]?.path, "/accounting/trial-balance-checker");
    assert.equal(aliasResults[0]?.path, "/finance/profitability-index");
    assert.equal(cycleResults[0]?.path, "/accounting/cash-conversion-cycle");
    assert.equal(leverageResults[0]?.path, "/accounting/equity-multiplier");
    assert.equal(retirementResults[0]?.path, "/accounting/partnership-retirement-bonus");
    assert.equal(agingResults[0]?.path, "/accounting/receivables-aging-schedule");
    assert.equal(salesMixResults[0]?.path, "/business/sales-mix-break-even");
    assert.equal(bondResults[0]?.path, "/accounting/bond-amortization-schedule");
    assert.equal(budgetResults[0]?.path, "/business/flexible-budget");
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
    assert.equal(impairmentResults[0]?.path, "/far/impairment-loss-workspace");
    assert.equal(disposalResults[0]?.path, "/far/asset-disposal-analysis");
    assert.equal(withholdingResults[0]?.path, "/tax/withholding-tax");
});
runTest("smart solver target intent prefers explicit reverse-solve wording", () => {
    assert.equal(suggestSolveTarget("simple-interest", "find the principal"), "principal");
    assert.equal(suggestSolveTarget("markup-margin", "what selling price gives 30% margin"), "sellingPrice");
    assert.equal(suggestSolveTarget("current-ratio", "solve for current liabilities using current ratio"), "currentLiabilities");
    assert.equal(suggestSolveTarget("petty-cash-reconciliation", "find the shortage or overage"), "shortageOrOverage");
    assert.equal(suggestSolveTarget("production-budget", "how many units should be produced"), "requiredProductionUnits");
    assert.equal(suggestSolveTarget("withholding-tax", "compute the amount withheld"), "taxWithheld");
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
    assert.equal(getResultValueTone("This route needs more values before the calculator can solve safely."), "sentence");
});
runTest("wide result heuristics flag dense cards before layout collapses", () => {
    assert.equal(isWideResultValue({
        title: "Required Ending Allowance",
        value: "$1,234,567.89",
    }), true);
    assert.equal(isWideResultValue({
        title: "Status",
        value: "Balanced",
    }), false);
});
process.stdout.write("All calculator math tests passed.\n");
