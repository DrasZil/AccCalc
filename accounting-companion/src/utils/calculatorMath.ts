type SimpleInterestParams = {
    principal: number;
    annualRatePercent: number;
    timeYears: number;
};

type CompoundInterestParams = {
    principal: number;
    annualRatePercent: number;
    compoundsPerYear: number;
    timeYears: number;
};

type ValueGrowthParams = {
    amount: number;
    annualRatePercent: number;
    timeYears: number;
};

type LoanAmortizationParams = {
    principal: number;
    annualRatePercent: number;
    termYears: number;
};

type BreakEvenParams = {
    fixedCosts: number;
    sellingPricePerUnit: number;
    variableCostPerUnit: number;
};

type TargetProfitParams = BreakEvenParams & {
    targetProfit: number;
};

type MarkupMarginParams = {
    cost: number;
    sellingPrice: number;
};

type StraightLineParams = {
    cost: number;
    salvageValue: number;
    usefulLifeYears: number;
};

type DoubleDecliningParams = {
    cost: number;
    salvageValue: number;
    usefulLifeYears: number;
    yearNumber: number;
};

type LiquidityRatioParams = {
    currentAssets: number;
    currentLiabilities: number;
};

type QuickRatioParams = {
    cash: number;
    marketableSecurities: number;
    netReceivables: number;
    currentLiabilities: number;
};

type TurnoverParams = {
    numerator: number;
    denominator: number;
    dayBasis?: number;
};

type CashDiscountParams = {
    invoiceAmount: number;
    discountRatePercent: number;
    discountDays: number;
    daysPaid: number;
};

type PartnershipSharingParams = {
    partnershipAmount: number;
    ratioA: number;
    ratioB: number;
    ratioC?: number;
};

export function computeSimpleInterest({
    principal,
    annualRatePercent,
    timeYears,
}: SimpleInterestParams) {
    const rateDecimal = annualRatePercent / 100;
    const interest = principal * rateDecimal * timeYears;
    const totalAmount = principal + interest;

    return {
        rateDecimal,
        interest,
        totalAmount,
    };
}

export function computeCompoundInterest({
    principal,
    annualRatePercent,
    compoundsPerYear,
    timeYears,
}: CompoundInterestParams) {
    const rateDecimal = annualRatePercent / 100;
    const totalAmount = principal * Math.pow(1 + rateDecimal / compoundsPerYear, compoundsPerYear * timeYears);
    const compoundInterest = totalAmount - principal;

    return {
        rateDecimal,
        totalAmount,
        compoundInterest,
    };
}

export function computeFutureValue({
    amount,
    annualRatePercent,
    timeYears,
}: ValueGrowthParams) {
    const rateDecimal = annualRatePercent / 100;
    const futureValue = amount * Math.pow(1 + rateDecimal, timeYears);

    return {
        rateDecimal,
        futureValue,
    };
}

export function computePresentValue({
    amount,
    annualRatePercent,
    timeYears,
}: ValueGrowthParams) {
    const rateDecimal = annualRatePercent / 100;
    const presentValue = amount / Math.pow(1 + rateDecimal, timeYears);

    return {
        rateDecimal,
        presentValue,
    };
}

export function computeLoanAmortization({
    principal,
    annualRatePercent,
    termYears,
}: LoanAmortizationParams) {
    const monthlyRate = annualRatePercent / 100 / 12;
    const totalPayments = termYears * 12;
    const monthlyPayment =
        monthlyRate === 0
            ? principal / totalPayments
            : principal *
              ((monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
                  (Math.pow(1 + monthlyRate, totalPayments) - 1));
    const totalPaid = monthlyPayment * totalPayments;
    const totalInterest = totalPaid - principal;

    return {
        monthlyRate,
        totalPayments,
        monthlyPayment,
        totalPaid,
        totalInterest,
    };
}

export function computeBreakEven({
    fixedCosts,
    sellingPricePerUnit,
    variableCostPerUnit,
}: BreakEvenParams) {
    const contributionMarginPerUnit = sellingPricePerUnit - variableCostPerUnit;
    const breakEvenUnits = fixedCosts / contributionMarginPerUnit;
    const practicalUnits = Math.ceil(breakEvenUnits);
    const breakEvenSales = breakEvenUnits * sellingPricePerUnit;
    const practicalSales = practicalUnits * sellingPricePerUnit;

    return {
        contributionMarginPerUnit,
        breakEvenUnits,
        practicalUnits,
        breakEvenSales,
        practicalSales,
    };
}

export function computeTargetProfit({
    fixedCosts,
    targetProfit,
    sellingPricePerUnit,
    variableCostPerUnit,
}: TargetProfitParams) {
    const contributionMarginPerUnit = sellingPricePerUnit - variableCostPerUnit;
    const requiredUnits = (fixedCosts + targetProfit) / contributionMarginPerUnit;
    const practicalUnits = Math.ceil(requiredUnits);
    const requiredSales = requiredUnits * sellingPricePerUnit;
    const practicalSales = practicalUnits * sellingPricePerUnit;

    return {
        contributionMarginPerUnit,
        requiredUnits,
        practicalUnits,
        requiredSales,
        practicalSales,
    };
}

export function computeMarkupMargin({ cost, sellingPrice }: MarkupMarginParams) {
    const profit = sellingPrice - cost;
    const markup = (profit / cost) * 100;
    const margin = (profit / sellingPrice) * 100;

    return {
        profit,
        markup,
        margin,
    };
}

export function computeStraightLineDepreciation({
    cost,
    salvageValue,
    usefulLifeYears,
}: StraightLineParams) {
    const depreciableCost = cost - salvageValue;
    const annualDepreciation = depreciableCost / usefulLifeYears;

    return {
        depreciableCost,
        annualDepreciation,
    };
}

export function computeDoubleDecliningBalance({
    cost,
    salvageValue,
    usefulLifeYears,
    yearNumber,
}: DoubleDecliningParams) {
    const rate = 2 / usefulLifeYears;
    let beginningBookValue = cost;
    let depreciationExpense = 0;
    let endingBookValue = cost;

    for (let currentYear = 1; currentYear <= yearNumber; currentYear += 1) {
        beginningBookValue = endingBookValue;
        depreciationExpense = Math.min(
            beginningBookValue * rate,
            beginningBookValue - salvageValue
        );
        endingBookValue = beginningBookValue - depreciationExpense;
    }

    return {
        rate,
        beginningBookValue,
        depreciationExpense,
        endingBookValue,
    };
}

export function computeCurrentRatio({ currentAssets, currentLiabilities }: LiquidityRatioParams) {
    return {
        currentRatio: currentAssets / currentLiabilities,
        workingCapital: currentAssets - currentLiabilities,
    };
}

export function computeQuickRatio({
    cash,
    marketableSecurities,
    netReceivables,
    currentLiabilities,
}: QuickRatioParams) {
    const quickAssets = cash + marketableSecurities + netReceivables;

    return {
        quickAssets,
        quickRatio: quickAssets / currentLiabilities,
    };
}

export function computeCashRatio(
    cash: number,
    marketableSecurities: number,
    currentLiabilities: number
) {
    const cashAssets = cash + marketableSecurities;

    return {
        cashAssets,
        cashRatio: cashAssets / currentLiabilities,
    };
}

export function computeGrossProfitRate(netSales: number, costOfGoodsSold: number) {
    const grossProfit = netSales - costOfGoodsSold;

    return {
        grossProfit,
        grossProfitRate: (grossProfit / netSales) * 100,
    };
}

export function computeTurnoverWithDayBasis({
    numerator,
    denominator,
    dayBasis = 365,
}: TurnoverParams) {
    const turnover = numerator / denominator;

    return {
        turnover,
        days: dayBasis / turnover,
    };
}

export function computeCashDiscount({
    invoiceAmount,
    discountRatePercent,
    discountDays,
    daysPaid,
}: CashDiscountParams) {
    const rateDecimal = discountRatePercent / 100;
    const discountAmount = invoiceAmount * rateDecimal;
    const applied = daysPaid <= discountDays;
    const amountToPay = applied ? invoiceAmount - discountAmount : invoiceAmount;

    return {
        applied,
        rateDecimal,
        discountAmount,
        amountToPay,
    };
}

export function computeTradeDiscount(listPrice: number, discountRatePercent: number) {
    const discountAmount = listPrice * (discountRatePercent / 100);
    const netPrice = listPrice - discountAmount;

    return {
        discountAmount,
        netPrice,
    };
}

export function computePartnershipProfitSharing({
    partnershipAmount,
    ratioA,
    ratioB,
    ratioC = 0,
}: PartnershipSharingParams) {
    const totalRatio = ratioA + ratioB + ratioC;

    return {
        totalRatio,
        shareA: partnershipAmount * (ratioA / totalRatio),
        shareB: partnershipAmount * (ratioB / totalRatio),
        shareC: partnershipAmount * (ratioC / totalRatio),
    };
}

export function computePartnershipAdmissionBonus(
    totalOldCapital: number,
    partnerInvestment: number,
    ownershipPercentage: number
) {
    const ownershipDecimal = ownershipPercentage / 100;
    const totalActualCapital = totalOldCapital + partnerInvestment;
    const capitalCredit = totalActualCapital * ownershipDecimal;
    const bonus = partnerInvestment - capitalCredit;

    return {
        ownershipDecimal,
        totalActualCapital,
        capitalCredit,
        bonus,
    };
}

export function computePartnershipAdmissionGoodwill(
    totalOldCapital: number,
    partnerInvestment: number,
    ownershipPercentage: number
) {
    const ownershipDecimal = ownershipPercentage / 100;
    const impliedTotalCapital = partnerInvestment / ownershipDecimal;
    const actualCapitalAfterInvestment = totalOldCapital + partnerInvestment;
    const goodwill = impliedTotalCapital - actualCapitalAfterInvestment;

    return {
        ownershipDecimal,
        impliedTotalCapital,
        actualCapitalAfterInvestment,
        goodwill,
    };
}

export function computeEffectiveAnnualRate(
    nominalRatePercent: number,
    compoundsPerYear: number
) {
    const nominalRateDecimal = nominalRatePercent / 100;
    const effectiveRate =
        (Math.pow(1 + nominalRateDecimal / compoundsPerYear, compoundsPerYear) - 1) * 100;

    return {
        nominalRateDecimal,
        effectiveRate,
    };
}

export function computeFutureValueOfOrdinaryAnnuity(
    periodicPayment: number,
    periodicRatePercent: number,
    periods: number
) {
    const rateDecimal = periodicRatePercent / 100;
    const futureValue =
        rateDecimal === 0
            ? periodicPayment * periods
            : periodicPayment * ((Math.pow(1 + rateDecimal, periods) - 1) / rateDecimal);

    return {
        rateDecimal,
        futureValue,
    };
}

export function computePresentValueOfOrdinaryAnnuity(
    periodicPayment: number,
    periodicRatePercent: number,
    periods: number
) {
    const rateDecimal = periodicRatePercent / 100;
    const presentValue =
        rateDecimal === 0
            ? periodicPayment * periods
            : periodicPayment * ((1 - Math.pow(1 + rateDecimal, -periods)) / rateDecimal);

    return {
        rateDecimal,
        presentValue,
    };
}

export function computeSinkingFundDeposit(
    futureValueTarget: number,
    periodicRatePercent: number,
    periods: number
) {
    const rateDecimal = periodicRatePercent / 100;
    const requiredDeposit =
        rateDecimal === 0
            ? futureValueTarget / periods
            : futureValueTarget / ((Math.pow(1 + rateDecimal, periods) - 1) / rateDecimal);

    return {
        rateDecimal,
        requiredDeposit,
    };
}
