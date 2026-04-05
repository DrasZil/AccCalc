import assert from "node:assert/strict";
import {
    computeBreakEven,
    computeCashDiscount,
    computeCashConversionCycle,
    computeCashRatio,
    computeCompoundInterest,
    computeCurrentRatio,
    computeDepreciationComparisonSchedule,
    computeDoubleDecliningBalance,
    computeEffectiveAnnualRate,
    computeEquityMultiplier,
    computeFutureValue,
    computeFutureValueOfOrdinaryAnnuity,
    computeGrossProfitRate,
    computeInventoryMethodComparison,
    computeLoanAmortization,
    computeLoanAmortizationSchedule,
    computeMarkupMargin,
    computeNetPresentValue,
    computePartnershipAdmissionBonus,
    computePartnershipAdmissionGoodwill,
    computePartnerCapitalEndingBalance,
    computePartnershipProfitSharing,
    computePartnershipRetirementBonus,
    computePartnershipSalaryInterestAllocation,
    computePaybackPeriod,
    computePresentValue,
    computePresentValueOfOrdinaryAnnuity,
    computeProfitabilityIndex,
    computeQuickRatio,
    computeSimpleInterest,
    computeSinkingFundDeposit,
    computeStandardDeviation,
    computeStraightLineDepreciation,
    computeTargetProfit,
    computeTradeDiscount,
    computeTrialBalance,
    computeTurnoverWithDayBasis,
    computeWeightedMean,
} from "../src/utils/calculatorMath.js";
import { searchAccountReferences } from "../src/utils/accountingReference.js";
import { searchAppRoutes } from "../src/utils/appSearch.js";
import { parseNumberList } from "../src/utils/listParsers.js";
import { getNetworkStatusSnapshot } from "../src/utils/networkStatus.js";

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

    assert.equal(npvResults[0]?.path, "/finance/npv");
    assert.equal(typoResults[0]?.path, "/accounting/trial-balance-checker");
    assert.equal(aliasResults[0]?.path, "/finance/profitability-index");
    assert.equal(cycleResults[0]?.path, "/accounting/cash-conversion-cycle");
    assert.equal(leverageResults[0]?.path, "/accounting/equity-multiplier");
    assert.equal(retirementResults[0]?.path, "/accounting/partnership-retirement-bonus");
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

process.stdout.write("All calculator math tests passed.\n");
