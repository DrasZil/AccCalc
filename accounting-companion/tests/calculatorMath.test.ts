import assert from "node:assert/strict";
import {
    computeBreakEven,
    computeCashDiscount,
    computeCompoundInterest,
    computeCurrentRatio,
    computeCashRatio,
    computeDoubleDecliningBalance,
    computeEffectiveAnnualRate,
    computeFutureValue,
    computeFutureValueOfOrdinaryAnnuity,
    computeGrossProfitRate,
    computeLoanAmortization,
    computeMarkupMargin,
    computePartnershipAdmissionBonus,
    computePartnershipAdmissionGoodwill,
    computePartnershipProfitSharing,
    computePresentValue,
    computePresentValueOfOrdinaryAnnuity,
    computeQuickRatio,
    computeSimpleInterest,
    computeSinkingFundDeposit,
    computeStraightLineDepreciation,
    computeTargetProfit,
    computeTradeDiscount,
    computeTurnoverWithDayBasis,
} from "../src/utils/calculatorMath.js";

function assertClose(actual: number, expected: number, precision = 1e-6) {
    assert.ok(Math.abs(actual - expected) <= precision, `Expected ${actual} to be within ${precision} of ${expected}`);
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

process.stdout.write("All calculator math tests passed.\n");
