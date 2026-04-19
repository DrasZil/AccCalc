import { percentToDecimal } from "./calc/percentUtils.js";
import { roundTo } from "./calc/precision.js";
import { sanitizeNumberOutput } from "./calc/numberSafety.js";
import {
    safeAdd,
    safeDivide,
    safeMultiply,
    safePow,
    safeSubtract,
} from "./calc/safeOperators.js";

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

type CvpAnalysisParams = BreakEvenParams & {
    targetProfit: number;
    expectedUnitSales: number;
    sensitivityPercent?: number;
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

type PartnershipSalaryInterestParams = {
    partnershipAmount: number;
    partnerASalary: number;
    partnerBSalary: number;
    partnerAAverageCapital: number;
    partnerBAverageCapital: number;
    interestRatePercent: number;
    partnerARemainderRatio: number;
    partnerBRemainderRatio: number;
};

type PartnershipRetirementBonusParams = {
    totalPartnershipCapital: number;
    retiringPartnerCapital: number;
    settlementPaid: number;
};

type PartnershipDissolutionPartnerInput = {
    label: string;
    capital: number;
    ratio: number;
};

type PartnershipDissolutionParams = {
    bookValueNoncashAssets: number;
    cashFromRealization: number;
    liabilitiesToSettle: number;
    partners: PartnershipDissolutionPartnerInput[];
    assumeDeficiencyInsolvent?: boolean;
};

type PartnerCapitalRollforwardParams = {
    beginningCapital: number;
    additionalInvestment: number;
    drawings: number;
    incomeShare: number;
};

type InventoryLayerInput = {
    label: string;
    units: number;
    unitCost: number;
};

type InventoryComparisonParams = {
    beginningUnits: number;
    beginningCost: number;
    purchase1Units: number;
    purchase1Cost: number;
    purchase2Units: number;
    purchase2Cost: number;
    unitsSold: number;
};

type DepreciationComparisonParams = {
    cost: number;
    salvageValue: number;
    usefulLifeYears: number;
};

type CashConversionCycleParams = {
    receivablesDays: number;
    inventoryDays: number;
    payablesDays: number;
};

type ReceivablesAgingBucketInput = {
    label: string;
    amount: number;
    estimatedUncollectibleRatePercent: number;
};

type ReceivablesAgingParams = {
    buckets: ReceivablesAgingBucketInput[];
    existingAllowanceBalance?: number;
};

type SalesMixProductInput = {
    label: string;
    sellingPrice: number;
    variableCost: number;
    mixShare: number;
};

type SalesMixBreakEvenParams = {
    fixedCosts: number;
    products: SalesMixProductInput[];
};

type LowerOfCostOrNrvItemInput = {
    label: string;
    cost: number;
    netRealizableValue: number;
};

type LowerOfCostOrNrvParams = {
    items: LowerOfCostOrNrvItemInput[];
    method: "item-by-item" | "aggregate";
};

type BondAmortizationParams = {
    faceValue: number;
    statedRatePercent: number;
    marketRatePercent: number;
    termYears: number;
    paymentsPerYear: number;
    method: "effective-interest" | "straight-line";
    issuePrice?: number;
};

type CashBudgetParams = {
    beginningCashBalance: number;
    cashCollections: number;
    cashDisbursements: number;
    minimumCashBalance: number;
};

type CapacityUtilizationParams = {
    actualUnits: number;
    practicalCapacityUnits: number;
};

type FlexibleBudgetParams = {
    budgetedUnits: number;
    actualUnits: number;
    fixedCosts: number;
    variableCostPerUnit: number;
    actualCost: number;
};

type CashSchedulePeriodInput = {
    label: string;
    amount: number;
};

type CashSchedulePatternInput = {
    lagPeriods: number;
    percent: number;
};

type EquivalentUnitsParams = {
    beginningWorkInProcessUnits: number;
    unitsStarted: number;
    unitsCompletedAndTransferred: number;
    endingWorkInProcessUnits: number;
    endingMaterialsCompletionPercent: number;
    endingConversionCompletionPercent: number;
    totalMaterialsCosts: number;
    totalConversionCosts: number;
};

type BankReconciliationParams = {
    bankBalance: number;
    bookBalance: number;
    depositsInTransit: number;
    outstandingChecks: number;
    bankCharges: number;
    nsfChecks: number;
    interestIncome: number;
    notesCollectedByBank: number;
    bankError: number;
    bookError: number;
};

type CashCollectionsScheduleParams = {
    periods: CashSchedulePeriodInput[];
    collectionPattern: CashSchedulePatternInput[];
    beginningReceivables?: number;
};

type CashDisbursementsScheduleParams = {
    periods: CashSchedulePeriodInput[];
    paymentPattern: CashSchedulePatternInput[];
    beginningPayables?: number;
};

type FactoryOverheadVarianceParams = {
    actualVariableOverhead: number;
    actualFixedOverhead: number;
    actualHours: number;
    standardHoursAllowed: number;
    standardVariableOverheadRate: number;
    budgetedFixedOverhead: number;
    denominatorHours: number;
};

type RatioAnalysisWorkspaceParams = {
    currentAssets: number;
    currentLiabilities: number;
    cash: number;
    marketableSecurities: number;
    netReceivables: number;
    netSales: number;
    netCreditSales: number;
    costOfGoodsSold: number;
    netIncome: number;
    averageInventory: number;
    averageAccountsReceivable: number;
    averageTotalAssets: number;
    averageEquity: number;
    dayBasis?: number;
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
    const monthlyRate = safeDivide(percentToDecimal(annualRatePercent), 12);
    const totalPayments = termYears * 12;
    const monthlyPayment =
        monthlyRate === 0
            ? safeDivide(principal, totalPayments)
            : safeMultiply(
                  principal,
                  safeDivide(
                      safeMultiply(
                          monthlyRate,
                          safePow(safeAdd(1, monthlyRate), totalPayments, 0)
                      ),
                      safeSubtract(
                          safePow(safeAdd(1, monthlyRate), totalPayments, 0),
                          1
                      )
                  )
              );
    const totalPaid = safeMultiply(monthlyPayment, totalPayments);
    const totalInterest = safeSubtract(totalPaid, principal);

    return {
        monthlyRate,
        totalPayments,
        monthlyPayment,
        totalPaid,
        totalInterest,
    };
}

export function computeLoanAmortizationSchedule({
    principal,
    annualRatePercent,
    termYears,
}: LoanAmortizationParams) {
    const monthlyRate = annualRatePercent / 100 / 12;
    const { monthlyPayment } = computeLoanAmortization({
        principal,
        annualRatePercent,
        termYears,
    });

    let remainingBalance = principal;
    const yearlySummary = Array.from({ length: termYears }, (_, index) => {
        const year = index + 1;
        let interestPaid = 0;
        let principalPaid = 0;

        for (let month = 0; month < 12; month += 1) {
            const interestPortion = remainingBalance * monthlyRate;
            const scheduledPrincipal = monthlyPayment - interestPortion;
            const principalPortion = Math.min(
                remainingBalance,
                monthlyRate === 0 ? monthlyPayment : Math.max(scheduledPrincipal, 0)
            );
            const paymentForMonth = interestPortion + principalPortion;

            interestPaid += interestPortion;
            principalPaid += principalPortion;
            remainingBalance = Math.max(remainingBalance - principalPortion, 0);

            if (remainingBalance === 0) {
                interestPaid += (12 - month - 1) * 0;
                principalPaid += (12 - month - 1) * 0;
                break;
            }

            if (paymentForMonth <= 0) {
                break;
            }
        }

        return {
            year,
            interestPaid,
            principalPaid,
            endingBalance: remainingBalance,
        };
    });

    return {
        monthlyPayment,
        yearlySummary,
        totalInterest: yearlySummary.reduce((sum, year) => sum + year.interestPaid, 0),
        totalPrincipal: yearlySummary.reduce((sum, year) => sum + year.principalPaid, 0),
    };
}

export function computeBreakEven({
    fixedCosts,
    sellingPricePerUnit,
    variableCostPerUnit,
}: BreakEvenParams) {
    const contributionMarginPerUnit = safeSubtract(sellingPricePerUnit, variableCostPerUnit);
    const breakEvenUnits =
        contributionMarginPerUnit <= 0 ? 0 : safeDivide(fixedCosts, contributionMarginPerUnit);
    const practicalUnits = Math.ceil(breakEvenUnits);
    const breakEvenSales = safeMultiply(breakEvenUnits, sellingPricePerUnit);
    const practicalSales = safeMultiply(practicalUnits, sellingPricePerUnit);

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
    const contributionMarginPerUnit = safeSubtract(sellingPricePerUnit, variableCostPerUnit);
    const requiredUnits =
        contributionMarginPerUnit <= 0
            ? 0
            : safeDivide(safeAdd(fixedCosts, targetProfit), contributionMarginPerUnit);
    const practicalUnits = Math.ceil(requiredUnits);
    const requiredSales = safeMultiply(requiredUnits, sellingPricePerUnit);
    const practicalSales = safeMultiply(practicalUnits, sellingPricePerUnit);

    return {
        contributionMarginPerUnit,
        requiredUnits,
        practicalUnits,
        requiredSales,
        practicalSales,
    };
}

export function computeCvpAnalysis({
    fixedCosts,
    sellingPricePerUnit,
    variableCostPerUnit,
    targetProfit,
    expectedUnitSales,
    sensitivityPercent = 10,
}: CvpAnalysisParams) {
    const contributionMarginPerUnit = safeSubtract(sellingPricePerUnit, variableCostPerUnit);
    const contributionMarginRatio =
        sellingPricePerUnit === 0 ? 0 : safeDivide(contributionMarginPerUnit, sellingPricePerUnit);
    const breakEven = computeBreakEven({
        fixedCosts,
        sellingPricePerUnit,
        variableCostPerUnit,
    });
    const target = computeTargetProfit({
        fixedCosts,
        targetProfit,
        sellingPricePerUnit,
        variableCostPerUnit,
    });
    const expectedSales = safeMultiply(expectedUnitSales, sellingPricePerUnit);
    const expectedContributionMargin = safeMultiply(expectedUnitSales, contributionMarginPerUnit);
    const operatingIncome = safeSubtract(expectedContributionMargin, fixedCosts);
    const marginOfSafetyAmount = safeSubtract(expectedSales, breakEven.breakEvenSales);
    const marginOfSafetyRatio =
        expectedSales === 0 ? 0 : safeDivide(marginOfSafetyAmount, expectedSales);
    const degreeOfOperatingLeverage =
        operatingIncome <= 0 ? Infinity : safeDivide(expectedContributionMargin, operatingIncome);

    const scenarioInputs = [
        {
            label: `Price +${sensitivityPercent}%`,
            sellingPricePerUnit: sellingPricePerUnit * (1 + sensitivityPercent / 100),
            variableCostPerUnit,
            expectedUnitSales,
        },
        {
            label: `Price -${sensitivityPercent}%`,
            sellingPricePerUnit: sellingPricePerUnit * (1 - sensitivityPercent / 100),
            variableCostPerUnit,
            expectedUnitSales,
        },
        {
            label: `Variable cost +${sensitivityPercent}%`,
            sellingPricePerUnit,
            variableCostPerUnit: variableCostPerUnit * (1 + sensitivityPercent / 100),
            expectedUnitSales,
        },
        {
            label: `Volume +${sensitivityPercent}%`,
            sellingPricePerUnit,
            variableCostPerUnit,
            expectedUnitSales: expectedUnitSales * (1 + sensitivityPercent / 100),
        },
    ];

    const scenarios = scenarioInputs.map((scenario) => {
        const scenarioContributionPerUnit = safeSubtract(
            scenario.sellingPricePerUnit,
            scenario.variableCostPerUnit
        );
        const scenarioBreakEvenUnits =
            scenarioContributionPerUnit <= 0
                ? Infinity
                : safeDivide(fixedCosts, scenarioContributionPerUnit);
        const scenarioOperatingIncome =
            safeMultiply(scenarioContributionPerUnit, scenario.expectedUnitSales) - fixedCosts;

        return {
            label: scenario.label,
            breakEvenUnits: scenarioBreakEvenUnits,
            operatingIncome: scenarioOperatingIncome,
        };
    });

    return {
        contributionMarginPerUnit,
        contributionMarginRatio,
        breakEvenUnits: breakEven.breakEvenUnits,
        breakEvenSales: breakEven.breakEvenSales,
        targetUnits: target.requiredUnits,
        targetSales: target.requiredSales,
        expectedSales,
        expectedContributionMargin,
        operatingIncome,
        marginOfSafetyAmount,
        marginOfSafetyRatio,
        degreeOfOperatingLeverage,
        scenarios,
    };
}

export function computeMarkupMargin({ cost, sellingPrice }: MarkupMarginParams) {
    const profit = safeSubtract(sellingPrice, cost);
    const markup = safeMultiply(safeDivide(profit, cost), 100);
    const margin = safeMultiply(safeDivide(profit, sellingPrice), 100);

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
        currentRatio: safeDivide(currentAssets, currentLiabilities),
        workingCapital: safeSubtract(currentAssets, currentLiabilities),
    };
}

export function computeQuickRatio({
    cash,
    marketableSecurities,
    netReceivables,
    currentLiabilities,
}: QuickRatioParams) {
    const quickAssets = safeAdd(safeAdd(cash, marketableSecurities), netReceivables);

    return {
        quickAssets,
        quickRatio: safeDivide(quickAssets, currentLiabilities),
    };
}

export function computeCashRatio(
    cash: number,
    marketableSecurities: number,
    currentLiabilities: number
) {
    const cashAssets = safeAdd(cash, marketableSecurities);

    return {
        cashAssets,
        cashRatio: safeDivide(cashAssets, currentLiabilities),
    };
}

export function computeGrossProfitRate(netSales: number, costOfGoodsSold: number) {
    const grossProfit = safeSubtract(netSales, costOfGoodsSold);

    return {
        grossProfit,
        grossProfitRate: safeMultiply(safeDivide(grossProfit, netSales), 100),
    };
}

export function computeTurnoverWithDayBasis({
    numerator,
    denominator,
    dayBasis = 365,
}: TurnoverParams) {
    const turnover = safeDivide(numerator, denominator);

    return {
        turnover,
        days: safeDivide(dayBasis, turnover),
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

export function computePartnershipSalaryInterestAllocation({
    partnershipAmount,
    partnerASalary,
    partnerBSalary,
    partnerAAverageCapital,
    partnerBAverageCapital,
    interestRatePercent,
    partnerARemainderRatio,
    partnerBRemainderRatio,
}: PartnershipSalaryInterestParams) {
    const ratioTotal = partnerARemainderRatio + partnerBRemainderRatio;
    const interestShareA = partnerAAverageCapital * (interestRatePercent / 100);
    const interestShareB = partnerBAverageCapital * (interestRatePercent / 100);
    const totalAppropriation =
        partnerASalary + partnerBSalary + interestShareA + interestShareB;
    const remainder = partnershipAmount - totalAppropriation;
    const remainderShareA = remainder * (partnerARemainderRatio / ratioTotal);
    const remainderShareB = remainder * (partnerBRemainderRatio / ratioTotal);

    return {
        ratioTotal,
        interestShareA,
        interestShareB,
        totalAppropriation,
        remainder,
        remainderShareA,
        remainderShareB,
        finalShareA: partnerASalary + interestShareA + remainderShareA,
        finalShareB: partnerBSalary + interestShareB + remainderShareB,
    };
}

export function computePartnershipRetirementBonus({
    totalPartnershipCapital,
    retiringPartnerCapital,
    settlementPaid,
}: PartnershipRetirementBonusParams) {
    const settlementDifference = settlementPaid - retiringPartnerCapital;
    const remainingCapitalAfterSettlement = totalPartnershipCapital - settlementPaid;

    return {
        settlementDifference,
        remainingCapitalAfterSettlement,
        direction:
            settlementDifference > 0
                ? "bonus-to-retiring-partner"
                : settlementDifference < 0
                  ? "bonus-to-remaining-partners"
                  : "no-bonus",
    };
}

export function computePartnershipDissolution({
    bookValueNoncashAssets,
    cashFromRealization,
    liabilitiesToSettle,
    partners,
    assumeDeficiencyInsolvent = false,
}: PartnershipDissolutionParams) {
    const totalRatio = partners.reduce((sum, partner) => sum + partner.ratio, 0);
    const gainOrLossOnRealization = cashFromRealization - bookValueNoncashAssets;
    const cashAvailableForPartners = cashFromRealization - liabilitiesToSettle;
    const bookNetAssets = bookValueNoncashAssets - liabilitiesToSettle;
    const capitalTotal = partners.reduce((sum, partner) => sum + partner.capital, 0);
    const capitalConsistencyGap = capitalTotal - bookNetAssets;

    const allocated = partners.map((partner) => {
        const realizationShare =
            totalRatio === 0 ? 0 : (gainOrLossOnRealization * partner.ratio) / totalRatio;
        const adjustedCapital = partner.capital + realizationShare;

        return {
            ...partner,
            realizationShare,
            adjustedCapital,
        };
    });

    const deficiencyPartners = allocated.filter((partner) => partner.adjustedCapital < 0);
    const deficiencyTotal = Math.abs(
        deficiencyPartners.reduce((sum, partner) => sum + partner.adjustedCapital, 0)
    );
    const solventPartners = allocated.filter((partner) => partner.adjustedCapital > 0);
    const solventRatioTotal = solventPartners.reduce((sum, partner) => sum + partner.ratio, 0);

    const finalPartners = allocated.map((partner) => {
        if (
            assumeDeficiencyInsolvent &&
            deficiencyTotal > 0 &&
            partner.adjustedCapital > 0 &&
            solventRatioTotal > 0
        ) {
            const absorbedDeficiency = (deficiencyTotal * partner.ratio) / solventRatioTotal;
            const finalCashDistribution = Math.max(0, partner.adjustedCapital - absorbedDeficiency);

            return {
                ...partner,
                absorbedDeficiency,
                finalCashDistribution,
                contributionRequired: 0,
            };
        }

        return {
            ...partner,
            absorbedDeficiency: 0,
            finalCashDistribution: Math.max(0, partner.adjustedCapital),
            contributionRequired: partner.adjustedCapital < 0 ? Math.abs(partner.adjustedCapital) : 0,
        };
    });

    return {
        gainOrLossOnRealization,
        cashAvailableForPartners,
        bookNetAssets,
        capitalTotal,
        capitalConsistencyGap,
        deficiencyTotal,
        finalDistributionTotal: finalPartners.reduce(
            (sum, partner) => sum + partner.finalCashDistribution,
            0
        ),
        finalPartners,
        assumeDeficiencyInsolvent,
    };
}

export function computePartnerCapitalEndingBalance({
    beginningCapital,
    additionalInvestment,
    drawings,
    incomeShare,
}: PartnerCapitalRollforwardParams) {
    return beginningCapital + additionalInvestment + incomeShare - drawings;
}

export function computeEquityMultiplier(
    averageTotalAssets: number,
    averageTotalEquity: number
) {
    return {
        equityMultiplier: averageTotalAssets / averageTotalEquity,
        financedByDebtPortion:
            (averageTotalAssets - averageTotalEquity) / averageTotalAssets,
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

function buildTimedCashSchedule({
    periods,
    pattern,
    beginningCarryover = 0,
    beginningCarryoverLabel,
}: {
    periods: CashSchedulePeriodInput[];
    pattern: CashSchedulePatternInput[];
    beginningCarryover?: number;
    beginningCarryoverLabel: string;
}) {
    const normalizedPattern = [...pattern].sort(
        (left, right) => left.lagPeriods - right.lagPeriods
    );
    const scheduledPercent = normalizedPattern.reduce(
        (sum, entry) => sum + entry.percent,
        0
    );

    const rows = periods.map((period, periodIndex) => {
        const contributions = normalizedPattern
            .map((entry) => {
                const sourceIndex = periodIndex - entry.lagPeriods;
                if (sourceIndex < 0) return null;

                const sourcePeriod = periods[sourceIndex];
                const amount = sourcePeriod.amount * (entry.percent / 100);

                return amount === 0
                    ? null
                    : {
                          sourceLabel: sourcePeriod.label,
                          lagPeriods: entry.lagPeriods,
                          percent: entry.percent,
                          amount,
                      };
            })
            .filter(
                (
                    entry
                ): entry is {
                    sourceLabel: string;
                    lagPeriods: number;
                    percent: number;
                    amount: number;
                } => Boolean(entry)
            );

        if (periodIndex === 0 && beginningCarryover !== 0) {
            contributions.unshift({
                sourceLabel: beginningCarryoverLabel,
                lagPeriods: -1,
                percent: 100,
                amount: beginningCarryover,
            });
        }

        const totalScheduled = contributions.reduce(
            (sum, entry) => sum + entry.amount,
            0
        );

        return {
            label: period.label,
            amount: period.amount,
            contributions,
            totalScheduled,
        };
    });

    const endingBalance = periods.reduce((sum, period, sourceIndex) => {
        const scheduledInsideWindow = normalizedPattern.reduce((scheduled, entry) => {
            const targetIndex = sourceIndex + entry.lagPeriods;
            if (targetIndex >= periods.length) return scheduled;

            return scheduled + period.amount * (entry.percent / 100);
        }, 0);

        return sum + (period.amount - scheduledInsideWindow);
    }, 0);

    return {
        rows,
        scheduledPercent,
        endingBalance,
    };
}

export function computeNetPresentValue(
    initialInvestment: number,
    discountRatePercent: number,
    cashFlows: number[],
    terminalValue = 0
) {
    const rateDecimal = discountRatePercent / 100;
    const terminalPeriod = cashFlows.length;
    const discountedCashFlows = cashFlows.map((cashFlow, index) => {
        const period = index + 1;
        const terminalCashFlow =
            terminalValue !== 0 && period === terminalPeriod ? terminalValue : 0;
        const totalCashFlow = cashFlow + terminalCashFlow;
        const discountFactor = 1 / Math.pow(1 + rateDecimal, period);
        const presentValue = totalCashFlow * discountFactor;

        return {
            period,
            operatingCashFlow: cashFlow,
            terminalCashFlow,
            cashFlow: totalCashFlow,
            discountFactor,
            presentValue,
        };
    });

    const totalPresentValue = discountedCashFlows.reduce(
        (sum, entry) => sum + entry.presentValue,
        0
    );

    return {
        rateDecimal,
        discountedCashFlows,
        totalPresentValue,
        terminalValue,
        netPresentValue: totalPresentValue - initialInvestment,
    };
}

export function computeProfitabilityIndex(
    initialInvestment: number,
    discountRatePercent: number,
    cashFlows: number[],
    terminalValue = 0
) {
    const npv = computeNetPresentValue(
        initialInvestment,
        discountRatePercent,
        cashFlows,
        terminalValue
    );

    return {
        ...npv,
        profitabilityIndex: npv.totalPresentValue / initialInvestment,
    };
}

export function computeInternalRateOfReturn(
    initialInvestment: number,
    cashFlows: number[],
    terminalValue = 0
) {
    const totalPeriods = cashFlows.length;
    const resolvedCashFlows = cashFlows.map((cashFlow, index) =>
        index === totalPeriods - 1 ? cashFlow + terminalValue : cashFlow
    );
    const signSeries = [-initialInvestment, ...resolvedCashFlows].filter(
        (value) => Math.abs(value) >= 0.0000001
    );
    const signChanges = signSeries.reduce((count, value, index, series) => {
        if (index === 0) return count;
        return Math.sign(value) !== Math.sign(series[index - 1]) ? count + 1 : count;
    }, 0);
    const multipleIrRisk = signChanges > 1;
    const sampledRates = [
        -99.9,
        -90,
        -75,
        -50,
        -25,
        -10,
        0,
        5,
        10,
        15,
        20,
        30,
        40,
        50,
        75,
        100,
        150,
        200,
        300,
        500,
        800,
        1000,
    ];
    const evaluated = sampledRates.map((ratePercent) => ({
        ratePercent,
        npv: computeNetPresentValue(
            initialInvestment,
            ratePercent,
            cashFlows,
            terminalValue
        ).netPresentValue,
    }));

    let lowerBound = evaluated[0];
    let upperBound = evaluated[1];
    let foundBracket = false;

    for (let index = 0; index < evaluated.length - 1; index += 1) {
        const current = evaluated[index];
        const next = evaluated[index + 1];

        if (Math.abs(current.npv) < 0.000001) {
            lowerBound = current;
            upperBound = current;
            foundBracket = true;
            break;
        }

        if (current.npv === 0 || next.npv === 0 || current.npv * next.npv < 0) {
            lowerBound = current;
            upperBound = next;
            foundBracket = true;
            break;
        }
    }

    if (!foundBracket) {
        return {
            hasSolution: false,
            irrPercent: null,
            signChanges,
            multipleIrRisk,
            sampledRates: evaluated,
            reason:
                "A single IRR could not be isolated across the tested discount-rate range. The project may never recover on a discounted basis or may have multiple valid IRRs.",
        };
    }

    if (Math.abs(lowerBound.npv) < 0.000001 && lowerBound.ratePercent === upperBound.ratePercent) {
        const exact = computeNetPresentValue(
            initialInvestment,
            lowerBound.ratePercent,
            cashFlows,
            terminalValue
        );

        return {
            hasSolution: true,
            irrPercent: lowerBound.ratePercent,
            signChanges,
            multipleIrRisk,
            iterations: 0,
            bracket: [lowerBound.ratePercent, upperBound.ratePercent] as const,
            ...exact,
        };
    }

    let leftRate = lowerBound.ratePercent;
    let rightRate = upperBound.ratePercent;
    let leftNpv = lowerBound.npv;
    let rightNpv = upperBound.npv;
    let midRate = leftRate;
    let midNpv = leftNpv;
    let iterations = 0;

    while (iterations < 120) {
        iterations += 1;
        midRate = (leftRate + rightRate) / 2;
        midNpv = computeNetPresentValue(
            initialInvestment,
            midRate,
            cashFlows,
            terminalValue
        ).netPresentValue;

        if (Math.abs(midNpv) < 0.000001 || Math.abs(rightRate - leftRate) < 0.0000001) {
            break;
        }

        if (leftNpv * midNpv <= 0) {
            rightRate = midRate;
            rightNpv = midNpv;
        } else {
            leftRate = midRate;
            leftNpv = midNpv;
        }
    }

    const exact = computeNetPresentValue(
        initialInvestment,
        midRate,
        cashFlows,
        terminalValue
    );

    return {
        hasSolution: true,
        irrPercent: midRate,
        signChanges,
        multipleIrRisk,
        iterations,
        bracket: [leftRate, rightRate] as const,
        residualNpv: midNpv,
        lowerBoundNpv: leftNpv,
        upperBoundNpv: rightNpv,
        ...exact,
    };
}

export function computePaybackPeriod(initialInvestment: number, cashFlows: number[]) {
    let unrecoveredBalance = initialInvestment;
    let cumulativeCashFlow = 0;
    let paybackPeriod: number | null = null;
    let fractionOfPeriod: number | null = null;

    const schedule = cashFlows.map((cashFlow, index) => {
        const period = index + 1;
        const beginningUnrecovered = unrecoveredBalance;
        cumulativeCashFlow += cashFlow;
        unrecoveredBalance -= cashFlow;

        if (
            paybackPeriod === null &&
            beginningUnrecovered > 0 &&
            unrecoveredBalance <= 0 &&
            cashFlow > 0
        ) {
            fractionOfPeriod = beginningUnrecovered / cashFlow;
            paybackPeriod = index + fractionOfPeriod;
        }

        return {
            period,
            cashFlow,
            cumulativeCashFlow,
            unrecoveredBalance,
        };
    });

    return {
        schedule,
        recovered: paybackPeriod !== null,
        paybackPeriod,
        fractionOfPeriod,
        unrecoveredBalance,
        cumulativeCashFlow,
    };
}

export function computeWeightedMean(values: number[], weights: number[]) {
    const weightedSum = values.reduce(
        (sum, value, index) => sum + value * weights[index],
        0
    );
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

    return {
        weightedSum,
        totalWeight,
        weightedMean: weightedSum / totalWeight,
    };
}

export function computeCoefficientOfVariation(values: number[], sample = false) {
    const standardDeviationResult = computeStandardDeviation(values, sample);
    const coefficientOfVariation =
        standardDeviationResult.mean === 0
            ? Infinity
            : (standardDeviationResult.standardDeviation / Math.abs(standardDeviationResult.mean)) * 100;

    return {
        ...standardDeviationResult,
        coefficientOfVariation,
    };
}

export function computeStandardDeviation(values: number[], sample = false) {
    const count = values.length;
    const mean = values.reduce((sum, value) => sum + value, 0) / count;
    const sumOfSquaredDeviations = values.reduce(
        (sum, value) => sum + Math.pow(value - mean, 2),
        0
    );
    const divisor = sample ? count - 1 : count;
    const variance = sumOfSquaredDeviations / divisor;

    return {
        count,
        mean,
        sumOfSquaredDeviations,
        variance,
        standardDeviation: Math.sqrt(variance),
    };
}

export function computeCapacityUtilization({
    actualUnits,
    practicalCapacityUnits,
}: CapacityUtilizationParams) {
    const utilizationRate =
        practicalCapacityUnits === 0 ? 0 : (actualUnits / practicalCapacityUnits) * 100;
    const idleCapacityUnits = practicalCapacityUnits - actualUnits;
    const idleCapacityRate = 100 - utilizationRate;

    return {
        utilizationRate,
        idleCapacityUnits,
        idleCapacityRate,
        remainingCapacityUnits: Math.max(practicalCapacityUnits - actualUnits, 0),
        overCapacityUnits: Math.max(actualUnits - practicalCapacityUnits, 0),
        status:
            actualUnits > practicalCapacityUnits
                ? "above practical capacity"
                : actualUnits === practicalCapacityUnits
                  ? "at practical capacity"
                  : utilizationRate >= 85
                    ? "strong capacity use"
                    : utilizationRate >= 60
                      ? "moderate capacity use"
                      : "light capacity use",
    };
}

export function computeTrialBalance(totalDebits: number, totalCredits: number) {
    const difference = totalDebits - totalCredits;
    const isBalanced = Math.abs(difference) < 0.005;

    return {
        difference,
        isBalanced,
        shortSide: isBalanced ? "balanced" : difference > 0 ? "credits" : "debits",
        amountToCorrect: Math.abs(difference),
    };
}

function inventoryLayersFromInputs({
    beginningUnits,
    beginningCost,
    purchase1Units,
    purchase1Cost,
    purchase2Units,
    purchase2Cost,
}: Omit<InventoryComparisonParams, "unitsSold">): InventoryLayerInput[] {
    return [
        { label: "Beginning Inventory", units: beginningUnits, unitCost: beginningCost },
        { label: "Purchase 1", units: purchase1Units, unitCost: purchase1Cost },
        { label: "Purchase 2", units: purchase2Units, unitCost: purchase2Cost },
    ];
}

export function computeInventoryMethodComparison({
    beginningUnits,
    beginningCost,
    purchase1Units,
    purchase1Cost,
    purchase2Units,
    purchase2Cost,
    unitsSold,
}: InventoryComparisonParams) {
    const layers = inventoryLayersFromInputs({
        beginningUnits,
        beginningCost,
        purchase1Units,
        purchase1Cost,
        purchase2Units,
        purchase2Cost,
    });

    const totalUnitsAvailable = layers.reduce((sum, layer) => sum + layer.units, 0);
    const totalCostAvailable = layers.reduce(
        (sum, layer) => sum + layer.units * layer.unitCost,
        0
    );

    let unitsToIssue = unitsSold;
    let fifoCostOfGoodsSold = 0;
    const fifoIssueLines: Array<InventoryLayerInput & { amount: number }> = [];
    const remainingLayers = layers.map((layer) => ({ ...layer }));

    for (const layer of remainingLayers) {
        if (unitsToIssue <= 0) break;

        const unitsIssued = Math.min(layer.units, unitsToIssue);
        const amount = unitsIssued * layer.unitCost;

        if (unitsIssued > 0) {
            fifoIssueLines.push({
                label: layer.label,
                units: unitsIssued,
                unitCost: layer.unitCost,
                amount,
            });
        }

        fifoCostOfGoodsSold += amount;
        layer.units -= unitsIssued;
        unitsToIssue -= unitsIssued;
    }

    const fifoEndingInventory = remainingLayers.reduce(
        (sum, layer) => sum + layer.units * layer.unitCost,
        0
    );
    const weightedAverageUnitCost =
        totalUnitsAvailable === 0 ? 0 : totalCostAvailable / totalUnitsAvailable;
    const weightedAverageCostOfGoodsSold = unitsSold * weightedAverageUnitCost;
    const weightedAverageEndingInventory =
        (totalUnitsAvailable - unitsSold) * weightedAverageUnitCost;
    const costTrendDirection =
        purchase2Cost > purchase1Cost && purchase1Cost >= beginningCost
            ? "rising"
            : purchase2Cost < purchase1Cost && purchase1Cost <= beginningCost
              ? "falling"
              : "mixed";

    return {
        totalUnitsAvailable,
        totalCostAvailable,
        weightedAverageUnitCost,
        fifo: {
            costOfGoodsSold: fifoCostOfGoodsSold,
            endingInventory: fifoEndingInventory,
            issueLines: fifoIssueLines,
        },
        weightedAverage: {
            costOfGoodsSold: weightedAverageCostOfGoodsSold,
            endingInventory: weightedAverageEndingInventory,
        },
        deltas: {
            costOfGoodsSold:
                fifoCostOfGoodsSold - weightedAverageCostOfGoodsSold,
            endingInventory:
                fifoEndingInventory - weightedAverageEndingInventory,
        },
        costTrendDirection,
    };
}

export function computeDepreciationComparisonSchedule({
    cost,
    salvageValue,
    usefulLifeYears,
}: DepreciationComparisonParams) {
    const straightLineAmount = (cost - salvageValue) / usefulLifeYears;
    const ddbRate = 2 / usefulLifeYears;
    let ddbBookValue = cost;
    let straightLineBookValue = cost;

    const schedule = Array.from({ length: usefulLifeYears }, (_, index) => {
        const year = index + 1;
        const straightLineExpense = straightLineAmount;
        straightLineBookValue -= straightLineExpense;

        const ddbExpense = Math.min(
            ddbBookValue * ddbRate,
            ddbBookValue - salvageValue
        );
        ddbBookValue -= ddbExpense;

        return {
            year,
            straightLineExpense,
            straightLineBookValue: Math.max(straightLineBookValue, salvageValue),
            ddbExpense,
            ddbBookValue: Math.max(ddbBookValue, salvageValue),
        };
    });

    return {
        straightLineAmount,
        ddbRate,
        schedule,
        totalDepreciation: cost - salvageValue,
    };
}

export function computeCashConversionCycle({
    receivablesDays,
    inventoryDays,
    payablesDays,
}: CashConversionCycleParams) {
    const operatingCycle = receivablesDays + inventoryDays;
    const cashConversionCycle = operatingCycle - payablesDays;

    return {
        operatingCycle,
        cashConversionCycle,
        workingCapitalDays: Math.max(cashConversionCycle, 0),
        pressureLevel:
            cashConversionCycle <= 0
                ? "low"
                : cashConversionCycle <= 30
                    ? "moderate"
                    : cashConversionCycle <= 60
                        ? "elevated"
                    : "high",
        };
    }

export function computeReceivablesAgingSchedule({
    buckets,
    existingAllowanceBalance = 0,
}: ReceivablesAgingParams) {
    const rows = buckets.map((bucket) => {
        const estimatedLoss =
            bucket.amount * (bucket.estimatedUncollectibleRatePercent / 100);

        return {
            ...bucket,
            estimatedLoss,
        };
    });

    const totalReceivables = rows.reduce((sum, row) => sum + row.amount, 0);
    const requiredEndingAllowance = rows.reduce(
        (sum, row) => sum + row.estimatedLoss,
        0
    );
    const netRealizableValue = totalReceivables - requiredEndingAllowance;
    const requiredAdjustment = requiredEndingAllowance - existingAllowanceBalance;

    return {
        rows,
        totalReceivables,
        requiredEndingAllowance,
        existingAllowanceBalance,
        netRealizableValue,
        requiredAdjustment,
        adjustmentDirection:
            requiredAdjustment > 0
                ? "increase"
                : requiredAdjustment < 0
                  ? "decrease"
                  : "none",
        allowanceJournalEffect:
            requiredAdjustment > 0
                ? {
                      debit: "Bad Debt Expense",
                      credit: "Allowance for Doubtful Accounts",
                      amount: requiredAdjustment,
                  }
                : requiredAdjustment < 0
                  ? {
                        debit: "Allowance for Doubtful Accounts",
                        credit: "Bad Debt Expense",
                        amount: Math.abs(requiredAdjustment),
                    }
                  : null,
    };
}

export function computeBankReconciliation({
    bankBalance,
    bookBalance,
    depositsInTransit,
    outstandingChecks,
    bankCharges,
    nsfChecks,
    interestIncome,
    notesCollectedByBank,
    bankError,
    bookError,
}: BankReconciliationParams) {
    const bankAdjustments = [
        { label: "Balance per bank", amount: bankBalance },
        { label: "Add: Deposits in transit", amount: depositsInTransit },
        { label: "Less: Outstanding checks", amount: -outstandingChecks },
        { label: "Bank error adjustment", amount: bankError },
    ];
    const bookAdjustments = [
        { label: "Balance per books", amount: bookBalance },
        { label: "Less: Bank charges", amount: -bankCharges },
        { label: "Less: NSF checks", amount: -nsfChecks },
        { label: "Add: Interest income", amount: interestIncome },
        { label: "Add: Note collected by bank", amount: notesCollectedByBank },
        { label: "Book error adjustment", amount: bookError },
    ];
    const adjustedBank = bankAdjustments.reduce((sum, entry) => sum + entry.amount, 0);
    const adjustedBook = bookAdjustments.reduce((sum, entry) => sum + entry.amount, 0);
    const difference = adjustedBank - adjustedBook;

    return {
        adjustedBank,
        adjustedBook,
        difference,
        isBalanced: Math.abs(difference) < 0.005,
        bankAdjustments,
        bookAdjustments,
    };
}

export function computeCashCollectionsSchedule({
    periods,
    collectionPattern,
    beginningReceivables = 0,
}: CashCollectionsScheduleParams) {
    const schedule = buildTimedCashSchedule({
        periods,
        pattern: collectionPattern,
        beginningCarryover: beginningReceivables,
        beginningCarryoverLabel: "Prior-period receivables",
    });

    return {
        ...schedule,
        totalSales: periods.reduce((sum, period) => sum + period.amount, 0),
        totalCollections: schedule.rows.reduce(
            (sum, row) => sum + row.totalScheduled,
            0
        ),
        endingReceivables: schedule.endingBalance,
    };
}

export function computeCashDisbursementsSchedule({
    periods,
    paymentPattern,
    beginningPayables = 0,
}: CashDisbursementsScheduleParams) {
    const schedule = buildTimedCashSchedule({
        periods,
        pattern: paymentPattern,
        beginningCarryover: beginningPayables,
        beginningCarryoverLabel: "Prior-period payables",
    });

    return {
        ...schedule,
        totalPurchases: periods.reduce((sum, period) => sum + period.amount, 0),
        totalDisbursements: schedule.rows.reduce(
            (sum, row) => sum + row.totalScheduled,
            0
        ),
        endingPayables: schedule.endingBalance,
    };
}

export function computeSalesMixBreakEven({
    fixedCosts,
    products,
}: SalesMixBreakEvenParams) {
    const totalMixShare = products.reduce((sum, product) => sum + product.mixShare, 0);
    const rows = products.map((product) => {
        const contributionMarginPerUnit = product.sellingPrice - product.variableCost;
        return {
            ...product,
            contributionMarginPerUnit,
            contributionMarginRatio:
                product.sellingPrice === 0
                    ? 0
                    : contributionMarginPerUnit / product.sellingPrice,
        };
    });

    const compositeUnitSales = rows.reduce(
        (sum, row) => sum + row.sellingPrice * row.mixShare,
        0
    );
    const compositeUnitContribution = rows.reduce(
        (sum, row) => sum + row.contributionMarginPerUnit * row.mixShare,
        0
    );
    const weightedAverageContributionMarginRatio =
        compositeUnitSales === 0 ? 0 : compositeUnitContribution / compositeUnitSales;
    const breakEvenCompositeUnits = fixedCosts / compositeUnitContribution;
    const breakEvenSales = fixedCosts / weightedAverageContributionMarginRatio;

    return {
        rows,
        totalMixShare,
        compositeUnitSales,
        compositeUnitContribution,
        weightedAverageContributionMarginRatio,
        breakEvenCompositeUnits,
        breakEvenSales,
        breakEvenUnitsByProduct: rows.map((row) => ({
            label: row.label,
            mixShare: row.mixShare,
            breakEvenUnits: breakEvenCompositeUnits * row.mixShare,
            breakEvenSales: breakEvenCompositeUnits * row.mixShare * row.sellingPrice,
        })),
    };
}

export function computeLowerOfCostOrNrv({
    items,
    method,
}: LowerOfCostOrNrvParams) {
    const rows = items.map((item) => {
        const lowerValue = Math.min(item.cost, item.netRealizableValue);
        return {
            ...item,
            lowerValue,
            writeDown: item.cost - lowerValue,
        };
    });

    const totalCost = rows.reduce((sum, row) => sum + row.cost, 0);
    const totalNetRealizableValue = rows.reduce(
        (sum, row) => sum + row.netRealizableValue,
        0
    );
    const aggregateLowerValue = Math.min(totalCost, totalNetRealizableValue);
    const totalWriteDown =
        method === "aggregate"
            ? totalCost - aggregateLowerValue
            : rows.reduce((sum, row) => sum + row.writeDown, 0);

    return {
        rows,
        totalCost,
        totalNetRealizableValue,
        totalLowerValue:
            method === "aggregate"
                ? aggregateLowerValue
                : rows.reduce((sum, row) => sum + row.lowerValue, 0),
        totalWriteDown,
        method,
    };
}

export function computeBondAmortizationSchedule({
    faceValue,
    statedRatePercent,
    marketRatePercent,
    termYears,
    paymentsPerYear,
    method,
    issuePrice,
}: BondAmortizationParams) {
    const totalPeriods = termYears * paymentsPerYear;
    const periodicStatedRate = statedRatePercent / 100 / paymentsPerYear;
    const periodicMarketRate = marketRatePercent / 100 / paymentsPerYear;
    const cashInterest = faceValue * periodicStatedRate;
    const derivedIssuePrice =
        periodicMarketRate === 0
            ? faceValue + cashInterest * totalPeriods
            : cashInterest *
                  ((1 - Math.pow(1 + periodicMarketRate, -totalPeriods)) /
                      periodicMarketRate) +
              faceValue / Math.pow(1 + periodicMarketRate, totalPeriods);
    const resolvedIssuePrice = issuePrice ?? derivedIssuePrice;
    const premiumOrDiscount = faceValue - resolvedIssuePrice;
    const straightLineAmortizationPerPeriod =
        premiumOrDiscount / totalPeriods;
    let carryingValue = resolvedIssuePrice;

    const schedule = Array.from({ length: totalPeriods }, (_, index) => {
        const period = index + 1;
        const beginningCarryingValue = carryingValue;
        let interestExpense =
            method === "effective-interest"
                ? beginningCarryingValue * periodicMarketRate
                : cashInterest + straightLineAmortizationPerPeriod;
        let amortization = interestExpense - cashInterest;
        let endingCarryingValue = beginningCarryingValue + amortization;

        if (period === totalPeriods) {
            amortization = faceValue - beginningCarryingValue;
            interestExpense = cashInterest + amortization;
            endingCarryingValue = faceValue;
        }

        carryingValue = endingCarryingValue;

        return {
            period,
            beginningCarryingValue,
            cashInterest,
            interestExpense,
            amortization,
            endingCarryingValue,
        };
    });

    return {
        totalPeriods,
        periodicStatedRate,
        periodicMarketRate,
        cashInterest,
        issuePrice: resolvedIssuePrice,
        premiumOrDiscount,
        issueType:
            Math.abs(premiumOrDiscount) < 0.005
                ? "at par"
                : premiumOrDiscount > 0
                  ? "discount"
                  : "premium",
        straightLineAmortizationPerPeriod,
        schedule,
        totalInterestExpense: schedule.reduce(
            (sum, row) => sum + row.interestExpense,
            0
        ),
    };
}

export function computeCashBudget({
    beginningCashBalance,
    cashCollections,
    cashDisbursements,
    minimumCashBalance,
}: CashBudgetParams) {
    const totalCashAvailable = beginningCashBalance + cashCollections;
    const excessOrDeficiencyBeforeFinancing =
        totalCashAvailable - cashDisbursements;
    const financingNeeded = Math.max(
        minimumCashBalance - excessOrDeficiencyBeforeFinancing,
        0
    );
    const endingCashAfterFinancing =
        excessOrDeficiencyBeforeFinancing + financingNeeded;

    return {
        totalCashAvailable,
        excessOrDeficiencyBeforeFinancing,
        financingNeeded,
        endingCashAfterFinancing,
        excessCashAfterFinancing:
            endingCashAfterFinancing - minimumCashBalance,
    };
}

export function computeFlexibleBudget({
    budgetedUnits,
    actualUnits,
    fixedCosts,
    variableCostPerUnit,
    actualCost,
}: FlexibleBudgetParams) {
    const staticBudget = fixedCosts + variableCostPerUnit * budgetedUnits;
    const flexibleBudget = fixedCosts + variableCostPerUnit * actualUnits;
    const activityVariance = flexibleBudget - staticBudget;
    const spendingVariance = actualCost - flexibleBudget;
    const staticBudgetVariance = actualCost - staticBudget;

    return {
        staticBudget,
        flexibleBudget,
        activityVariance,
        spendingVariance,
        staticBudgetVariance,
    };
}

export function computeFactoryOverheadVariances({
    actualVariableOverhead,
    actualFixedOverhead,
    actualHours,
    standardHoursAllowed,
    standardVariableOverheadRate,
    budgetedFixedOverhead,
    denominatorHours,
}: FactoryOverheadVarianceParams) {
    const standardVariableOverheadForActualHours =
        actualHours * standardVariableOverheadRate;
    const appliedVariableOverhead =
        standardHoursAllowed * standardVariableOverheadRate;
    const variableOverheadSpendingVariance =
        actualVariableOverhead - standardVariableOverheadForActualHours;
    const variableOverheadEfficiencyVariance =
        standardVariableOverheadForActualHours - appliedVariableOverhead;
    const standardFixedOverheadRate =
        denominatorHours === 0 ? 0 : budgetedFixedOverhead / denominatorHours;
    const appliedFixedOverhead = standardHoursAllowed * standardFixedOverheadRate;
    const fixedOverheadBudgetVariance =
        actualFixedOverhead - budgetedFixedOverhead;
    const fixedOverheadVolumeVariance =
        budgetedFixedOverhead - appliedFixedOverhead;
    const totalActualOverhead = actualVariableOverhead + actualFixedOverhead;
    const totalAppliedOverhead =
        appliedVariableOverhead + appliedFixedOverhead;
    const totalOverheadVariance = totalActualOverhead - totalAppliedOverhead;

    return {
        standardVariableOverheadForActualHours,
        appliedVariableOverhead,
        standardFixedOverheadRate,
        appliedFixedOverhead,
        variableOverheadSpendingVariance,
        variableOverheadEfficiencyVariance,
        fixedOverheadBudgetVariance,
        fixedOverheadVolumeVariance,
        totalActualOverhead,
        totalAppliedOverhead,
        totalOverheadVariance,
    };
}

export function computeEquivalentUnitsWeightedAverage({
    beginningWorkInProcessUnits,
    unitsStarted,
    unitsCompletedAndTransferred,
    endingWorkInProcessUnits,
    endingMaterialsCompletionPercent,
    endingConversionCompletionPercent,
    totalMaterialsCosts,
    totalConversionCosts,
}: EquivalentUnitsParams) {
    const totalUnitsToAccountFor =
        beginningWorkInProcessUnits + unitsStarted;
    const totalUnitsAccountedFor =
        unitsCompletedAndTransferred + endingWorkInProcessUnits;
    const materialsEquivalentUnits =
        unitsCompletedAndTransferred +
        endingWorkInProcessUnits * (endingMaterialsCompletionPercent / 100);
    const conversionEquivalentUnits =
        unitsCompletedAndTransferred +
        endingWorkInProcessUnits * (endingConversionCompletionPercent / 100);
    const materialsCostPerEquivalentUnit =
        totalMaterialsCosts / materialsEquivalentUnits;
    const conversionCostPerEquivalentUnit =
        totalConversionCosts / conversionEquivalentUnits;
    const transferredOutCost =
        unitsCompletedAndTransferred *
        (materialsCostPerEquivalentUnit + conversionCostPerEquivalentUnit);
    const endingWorkInProcessCost =
        endingWorkInProcessUnits *
            (endingMaterialsCompletionPercent / 100) *
            materialsCostPerEquivalentUnit +
        endingWorkInProcessUnits *
            (endingConversionCompletionPercent / 100) *
            conversionCostPerEquivalentUnit;

    return {
        totalUnitsToAccountFor,
        totalUnitsAccountedFor,
        unitReconciliationDifference:
            totalUnitsToAccountFor - totalUnitsAccountedFor,
        materialsEquivalentUnits,
        conversionEquivalentUnits,
        materialsCostPerEquivalentUnit,
        conversionCostPerEquivalentUnit,
        transferredOutCost,
        endingWorkInProcessCost,
        totalCostAssigned: transferredOutCost + endingWorkInProcessCost,
    };
}

export function computeMaterialsQuantityVariance(
    actualQuantityUsed: number,
    standardQuantityAllowed: number,
    standardPrice: number
) {
    const variance =
        (actualQuantityUsed - standardQuantityAllowed) * standardPrice;

    return {
        variance,
        direction:
            variance > 0 ? "Unfavorable" : variance < 0 ? "Favorable" : "None",
    };
}

export function computeLaborEfficiencyVariance(
    actualHours: number,
    standardHoursAllowed: number,
    standardRate: number
) {
    const variance = (actualHours - standardHoursAllowed) * standardRate;

    return {
        variance,
        direction:
            variance > 0 ? "Unfavorable" : variance < 0 ? "Favorable" : "None",
    };
}

export function computeDiscountedPaybackPeriod(
    initialInvestment: number,
    discountRatePercent: number,
    cashFlows: number[]
) {
    const rateDecimal = discountRatePercent / 100;
    let cumulativeDiscountedCashFlow = 0;
    let unrecoveredDiscountedBalance = initialInvestment;
    let paybackPeriod: number | null = null;
    let fractionOfPeriod: number | null = null;

    const schedule = cashFlows.map((cashFlow, index) => {
        const period = index + 1;
        const discountFactor = 1 / Math.pow(1 + rateDecimal, period);
        const discountedCashFlow = cashFlow * discountFactor;
        const beginningUnrecovered = unrecoveredDiscountedBalance;

        cumulativeDiscountedCashFlow += discountedCashFlow;
        unrecoveredDiscountedBalance -= discountedCashFlow;

        if (
            paybackPeriod === null &&
            beginningUnrecovered > 0 &&
            unrecoveredDiscountedBalance <= 0 &&
            discountedCashFlow > 0
        ) {
            fractionOfPeriod = beginningUnrecovered / discountedCashFlow;
            paybackPeriod = index + fractionOfPeriod;
        }

        return {
            period,
            cashFlow,
            discountFactor,
            discountedCashFlow,
            cumulativeDiscountedCashFlow,
            unrecoveredDiscountedBalance,
        };
    });

    return {
        rateDecimal,
        schedule,
        recovered: paybackPeriod !== null,
        paybackPeriod,
        fractionOfPeriod,
        cumulativeDiscountedCashFlow,
        unrecoveredDiscountedBalance,
    };
}

export function computeRatioAnalysisWorkspace({
    currentAssets,
    currentLiabilities,
    cash,
    marketableSecurities,
    netReceivables,
    netSales,
    netCreditSales,
    costOfGoodsSold,
    netIncome,
    averageInventory,
    averageAccountsReceivable,
    averageTotalAssets,
    averageEquity,
    dayBasis = 365,
}: RatioAnalysisWorkspaceParams) {
    const currentRatio = safeDivide(currentAssets, currentLiabilities);
    const workingCapital = safeSubtract(currentAssets, currentLiabilities);
    const quickAssets = safeAdd(safeAdd(cash, marketableSecurities), netReceivables);
    const quickRatio = safeDivide(quickAssets, currentLiabilities);
    const grossProfit = safeSubtract(netSales, costOfGoodsSold);
    const grossProfitRate = safeDivide(grossProfit, netSales);
    const inventoryTurnover = safeDivide(costOfGoodsSold, averageInventory);
    const inventoryDays = safeDivide(dayBasis, inventoryTurnover);
    const receivablesTurnover = safeDivide(netCreditSales, averageAccountsReceivable);
    const collectionDays = safeDivide(dayBasis, receivablesTurnover);
    const returnOnAssets = safeDivide(netIncome, averageTotalAssets);
    const returnOnEquity = safeDivide(netIncome, averageEquity);

    return {
        currentRatio,
        workingCapital,
        quickAssets,
        quickRatio,
        grossProfit,
        grossProfitRate,
        inventoryTurnover,
        inventoryDays,
        receivablesTurnover,
        collectionDays,
        returnOnAssets,
        returnOnEquity,
        dayBasis,
    };
}

type StatementLineInput = {
    label: string;
    amount: number;
};

type HorizontalAnalysisLineInput = {
    label: string;
    baseAmount: number;
    currentAmount: number;
};

type WorkingCapitalCycleParams = {
    currentAssets: number;
    currentLiabilities: number;
    receivablesDays: number;
    inventoryDays: number;
    payablesDays: number;
};

export function computeCommonSizeStatement(
    lines: StatementLineInput[],
    baseAmount?: number
) {
    const resolvedBase =
        baseAmount ?? lines.reduce((sum, line) => sum + line.amount, 0);

    const rows = lines.map((line) => ({
        ...line,
        percentage: resolvedBase === 0 ? 0 : (line.amount / resolvedBase) * 100,
    }));

    return {
        baseAmount: resolvedBase,
        rows,
        totalAmount: lines.reduce((sum, line) => sum + line.amount, 0),
    };
}

export function computeHorizontalAnalysisWorkspace(
    lines: HorizontalAnalysisLineInput[]
) {
    const rows = lines.map((line) => {
        const amountChange = line.currentAmount - line.baseAmount;
        const percentageChange =
            line.baseAmount === 0 ? null : (amountChange / line.baseAmount) * 100;

        return {
            ...line,
            amountChange,
            percentageChange,
        };
    });

    const baseTotal = rows.reduce((sum, row) => sum + row.baseAmount, 0);
    const currentTotal = rows.reduce((sum, row) => sum + row.currentAmount, 0);
    const totalChange = currentTotal - baseTotal;

    return {
        rows,
        baseTotal,
        currentTotal,
        totalChange,
        totalPercentageChange:
            baseTotal === 0 ? null : (totalChange / baseTotal) * 100,
    };
}

export function computeWorkingCapitalCycle({
    currentAssets,
    currentLiabilities,
    receivablesDays,
    inventoryDays,
    payablesDays,
}: WorkingCapitalCycleParams) {
    const workingCapital = currentAssets - currentLiabilities;
    const operatingCycle = receivablesDays + inventoryDays;
    const cashConversionCycle = operatingCycle - payablesDays;

    return {
        workingCapital,
        operatingCycle,
        cashConversionCycle,
    };
}

export function computeCapitalBudgetingComparison(
    initialInvestment: number,
    discountRatePercent: number,
    cashFlows: number[],
    terminalValue = 0
) {
    const npv = computeNetPresentValue(
        initialInvestment,
        discountRatePercent,
        cashFlows,
        terminalValue
    );
    const profitabilityIndex = computeProfitabilityIndex(
        initialInvestment,
        discountRatePercent,
        cashFlows,
        terminalValue
    );
    const internalRateOfReturn = computeInternalRateOfReturn(
        initialInvestment,
        cashFlows,
        terminalValue
    );
    const discountedPayback = computeDiscountedPaybackPeriod(
        initialInvestment,
        discountRatePercent,
        cashFlows.map((cashFlow, index) =>
            index === cashFlows.length - 1 ? cashFlow + terminalValue : cashFlow
        )
    );

    return {
        npv,
        profitabilityIndex,
        internalRateOfReturn,
        discountedPayback,
        decision:
            npv.netPresentValue >= 0 &&
            profitabilityIndex.profitabilityIndex >= 1
                ? "Accept"
                : "Review / Reject",
    };
}

type PriceElasticityParams = {
    initialPrice: number;
    finalPrice: number;
    initialQuantity: number;
    finalQuantity: number;
};

type MarketEquilibriumParams = {
    demandIntercept: number;
    demandSlope: number;
    supplyIntercept: number;
    supplySlope: number;
};

type SurplusAnalysisParams = {
    demandIntercept: number;
    supplyIntercept: number;
    equilibriumPrice: number;
    equilibriumQuantity: number;
};

type StartupCostItem = {
    label: string;
    amount: number;
};

type UnitEconomicsParams = {
    sellingPrice: number;
    variableCostPerUnit: number;
    fixedCosts: number;
    acquisitionCostPerCustomer: number;
    unitsPerCustomer: number;
};

type SalesForecastParams = {
    startingSales: number;
    monthlyGrowthPercent: number;
    months: number;
    grossMarginPercent?: number;
};

type CashRunwayParams = {
    openingCash: number;
    averageMonthlyInflows: number;
    averageMonthlyOutflows: number;
    plannedGrowthPercent?: number;
};

type InventoryShrinkageParams = {
    bookUnits: number;
    physicalUnits: number;
    costPerUnit: number;
};

type JobOrderCostSheetParams = {
    directMaterialsUsed: number;
    directLabor: number;
    appliedManufacturingOverhead: number;
    unitsInJob: number;
};

type PrepaidExpenseAdjustmentParams = {
    beginningPrepaid: number;
    endingPrepaid: number;
};

type UnearnedRevenueAdjustmentParams = {
    beginningUnearnedRevenue: number;
    endingUnearnedRevenue: number;
};

type AccruedRevenueAdjustmentParams = {
    revenueEarned: number;
    cashCollected: number;
};

type AccruedExpenseAdjustmentParams = {
    expenseIncurred: number;
    cashPaid: number;
};

type PricingPlannerParams = {
    unitCost: number;
    targetMarginPercent: number;
    targetMonthlyIncome: number;
    contributionPerUnit: number;
};

type OwnerSplitParams = {
    distributableProfit: number;
    ratioA: number;
    ratioB: number;
    ratioC?: number;
};

type CustomerPaybackParams = {
    acquisitionCost: number;
    monthlyContributionPerCustomer: number;
};

type ElasticityShiftParams = {
    initialDriver: number;
    finalDriver: number;
    initialQuantity: number;
    finalQuantity: number;
};

type HighLowCostEstimationParams = {
    highActivityUnits: number;
    highTotalCost: number;
    lowActivityUnits: number;
    lowTotalCost: number;
    expectedActivityUnits?: number;
};

type RoiRiEvaParams = {
    operatingIncome: number;
    investedCapital: number;
    targetRatePercent: number;
    sales?: number;
};

type EconomicOrderQuantityParams = {
    annualDemandUnits: number;
    orderingCostPerOrder: number;
    annualCarryingCostPerUnit: number;
    dailyDemandUnits: number;
    leadTimeDays: number;
    safetyStockUnits?: number;
};

type AuditPlanningParams = {
    benchmarkAmount: number;
    materialityPercent: number;
    performanceMaterialityPercent: number;
    inherentRiskPercent: number;
    controlRiskPercent: number;
};

type BookTaxDifferenceParams = {
    accountingIncomeBeforeTax: number;
    permanentDifferences: number;
    temporaryDifferences: number;
    taxRatePercent: number;
};

type BusinessCombinationParams = {
    considerationTransferred: number;
    netIdentifiableAssetsFairValue: number;
    ownershipPercent: number;
    nonControllingInterestMeasurement: "fair-value" | "proportionate-share";
    nonControllingInterestFairValue?: number;
};

type LeaseMeasurementParams = {
    periodicLeasePayment: number;
    numberOfPeriods: number;
    periodicDiscountRatePercent: number;
    guaranteedResidualValue?: number;
    bargainPurchaseOption?: number;
    initialDirectCosts?: number;
    leaseIncentivesReceived?: number;
};

type ShareBasedPaymentParams = {
    grantDateFairValuePerOption: number;
    optionsGranted: number;
    estimatedForfeitureRatePercent: number;
    vestingYears: number;
    serviceYearsRendered: number;
};

type StatementOfCashFlowsParams = {
    netIncome: number;
    depreciationExpense: number;
    impairmentLoss?: number;
    gainOnAssetSale?: number;
    accountsReceivableIncrease?: number;
    inventoryIncrease?: number;
    accountsPayableIncrease?: number;
    capitalExpenditures?: number;
    assetSaleProceeds?: number;
    debtProceeds?: number;
    debtRepayments?: number;
    shareIssuanceProceeds?: number;
    dividendsPaid?: number;
    openingCashBalance?: number;
};

type ForeignCurrencyTranslationParams = {
    foreignCurrencyAmount: number;
    transactionRate: number;
    closingRate: number;
    settlementRate?: number;
};

type ConstructionRevenueParams = {
    contractPrice: number;
    costsIncurredToDate: number;
    estimatedCostsToComplete: number;
    billingsToDate?: number;
    collectionsToDate?: number;
};

export function computePriceElasticity({
    initialPrice,
    finalPrice,
    initialQuantity,
    finalQuantity,
}: PriceElasticityParams) {
    const priceMidpoint = (initialPrice + finalPrice) / 2;
    const quantityMidpoint = (initialQuantity + finalQuantity) / 2;
    const priceChangePercent = safeMultiply(
        safeDivide(safeSubtract(finalPrice, initialPrice), priceMidpoint),
        100
    );
    const quantityChangePercent = safeMultiply(
        safeDivide(safeSubtract(finalQuantity, initialQuantity), quantityMidpoint),
        100
    );
    const elasticity = safeDivide(quantityChangePercent, priceChangePercent);
    const absElasticity = Math.abs(elasticity);

    return {
        priceChangePercent,
        quantityChangePercent,
        elasticity,
        absElasticity,
        classification:
            absElasticity > 1
                ? "Elastic"
                : absElasticity < 1
                  ? "Inelastic"
                  : "Unit elastic",
        initialRevenue: safeMultiply(initialPrice, initialQuantity),
        finalRevenue: safeMultiply(finalPrice, finalQuantity),
    };
}

export function computeMarketEquilibrium({
    demandIntercept,
    demandSlope,
    supplyIntercept,
    supplySlope,
}: MarketEquilibriumParams) {
    const denominator = safeAdd(demandSlope, supplySlope);
    const equilibriumQuantity = safeDivide(
        safeSubtract(demandIntercept, supplyIntercept),
        denominator
    );
    const equilibriumPrice = safeSubtract(
        demandIntercept,
        safeMultiply(demandSlope, equilibriumQuantity)
    );

    return {
        equilibriumQuantity: roundTo(equilibriumQuantity, 8),
        equilibriumPrice: roundTo(equilibriumPrice, 8),
        demandAtZeroPrice: safeDivide(demandIntercept, demandSlope),
        supplyAtZeroPrice: sanitizeNumberOutput(safeDivide(-supplyIntercept, supplySlope)),
        isFeasible:
            Number.isFinite(equilibriumQuantity) &&
            Number.isFinite(equilibriumPrice) &&
            equilibriumQuantity >= 0 &&
            equilibriumPrice >= 0,
    };
}

export function computeSurplusAtEquilibrium({
    demandIntercept,
    supplyIntercept,
    equilibriumPrice,
    equilibriumQuantity,
}: SurplusAnalysisParams) {
    const consumerSurplus =
        0.5 * Math.max(demandIntercept - equilibriumPrice, 0) * equilibriumQuantity;
    const producerSurplus =
        0.5 * Math.max(equilibriumPrice - supplyIntercept, 0) * equilibriumQuantity;

    return {
        consumerSurplus,
        producerSurplus,
        totalSurplus: consumerSurplus + producerSurplus,
    };
}

export function computeRealInterestRate(
    nominalRatePercent: number,
    inflationRatePercent: number
) {
    const nominalDecimal = percentToDecimal(nominalRatePercent);
    const inflationDecimal = percentToDecimal(inflationRatePercent);
    const exactRealRate = safeMultiply(
        safeSubtract(safeDivide(safeAdd(1, nominalDecimal), safeAdd(1, inflationDecimal)), 1),
        100
    );
    const approximateRealRate = safeSubtract(nominalRatePercent, inflationRatePercent);

    return {
        exactRealRate,
        approximateRealRate,
    };
}

export function computeStartupCostPlan(
    items: StartupCostItem[],
    contingencyPercent: number,
    openingCashBuffer: number
) {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const contingencyAmount = subtotal * (contingencyPercent / 100);
    const recommendedFunding = subtotal + contingencyAmount + openingCashBuffer;
    const largestItem =
        items.reduce<StartupCostItem | null>(
            (largest, item) => (!largest || item.amount > largest.amount ? item : largest),
            null
        ) ?? { label: "None", amount: 0 };

    return {
        subtotal,
        contingencyAmount,
        openingCashBuffer,
        recommendedFunding,
        largestItem,
    };
}

export function computeUnitEconomics({
    sellingPrice,
    variableCostPerUnit,
    fixedCosts,
    acquisitionCostPerCustomer,
    unitsPerCustomer,
}: UnitEconomicsParams) {
    const contributionPerUnit = sellingPrice - variableCostPerUnit;
    const grossMarginPercent =
        sellingPrice === 0 ? 0 : (contributionPerUnit / sellingPrice) * 100;
    const contributionPerCustomer = contributionPerUnit * unitsPerCustomer;
    const contributionAfterAcquisition =
        contributionPerCustomer - acquisitionCostPerCustomer;
    const breakEvenUnits =
        contributionPerUnit <= 0 ? Infinity : fixedCosts / contributionPerUnit;
    const breakEvenCustomers =
        contributionAfterAcquisition <= 0
            ? Infinity
            : fixedCosts / contributionAfterAcquisition;

    return {
        contributionPerUnit,
        grossMarginPercent,
        contributionPerCustomer,
        contributionAfterAcquisition,
        breakEvenUnits,
        breakEvenCustomers,
    };
}

export function computeSalesForecast({
    startingSales,
    monthlyGrowthPercent,
    months,
    grossMarginPercent = 0,
}: SalesForecastParams) {
    const growthFactor = 1 + monthlyGrowthPercent / 100;
    const rows = Array.from({ length: months }, (_, index) => {
        const sales = startingSales * Math.pow(growthFactor, index);
        const grossProfit = sales * (grossMarginPercent / 100);

        return {
            period: index + 1,
            sales,
            grossProfit,
        };
    });

    return {
        rows,
        totalSales: rows.reduce((sum, row) => sum + row.sales, 0),
        totalGrossProfit: rows.reduce((sum, row) => sum + row.grossProfit, 0),
        endingSales: rows.at(-1)?.sales ?? 0,
    };
}

export function computeCashRunway({
    openingCash,
    averageMonthlyInflows,
    averageMonthlyOutflows,
    plannedGrowthPercent = 0,
}: CashRunwayParams) {
    const adjustedInflows =
        averageMonthlyInflows * (1 + plannedGrowthPercent / 100);
    const monthlyNetCashFlow = adjustedInflows - averageMonthlyOutflows;
    const monthlyBurn = averageMonthlyOutflows - adjustedInflows;
    const runwayMonths =
        monthlyBurn <= 0 ? Infinity : openingCash / monthlyBurn;

    return {
        adjustedInflows,
        monthlyNetCashFlow,
        monthlyBurn,
        runwayMonths,
        status:
            monthlyBurn <= 0
                ? "Positive or break-even cash flow"
                : runwayMonths < 6
                  ? "Short runway"
                  : runwayMonths < 12
                    ? "Moderate runway"
                    : "Comfortable runway",
    };
}

export function computeInventoryShrinkage({
    bookUnits,
    physicalUnits,
    costPerUnit,
}: InventoryShrinkageParams) {
    const shrinkageUnits = Math.max(bookUnits - physicalUnits, 0);
    const shrinkageAmount = shrinkageUnits * costPerUnit;
    const shrinkageRate = bookUnits === 0 ? 0 : (shrinkageUnits / bookUnits) * 100;

    return {
        shrinkageUnits,
        shrinkageAmount,
        shrinkageRate,
    };
}

export function computeJobOrderCostSheet({
    directMaterialsUsed,
    directLabor,
    appliedManufacturingOverhead,
    unitsInJob,
}: JobOrderCostSheetParams) {
    const primeCost = directMaterialsUsed + directLabor;
    const conversionCost = directLabor + appliedManufacturingOverhead;
    const totalJobCost = directMaterialsUsed + directLabor + appliedManufacturingOverhead;
    const unitCost = unitsInJob <= 0 ? Infinity : totalJobCost / unitsInJob;
    const materialsShare = totalJobCost === 0 ? 0 : (directMaterialsUsed / totalJobCost) * 100;
    const laborShare = totalJobCost === 0 ? 0 : (directLabor / totalJobCost) * 100;
    const overheadShare =
        totalJobCost === 0 ? 0 : (appliedManufacturingOverhead / totalJobCost) * 100;

    return {
        primeCost,
        conversionCost,
        totalJobCost,
        unitCost,
        materialsShare,
        laborShare,
        overheadShare,
    };
}

export function computePrepaidExpenseAdjustment({
    beginningPrepaid,
    endingPrepaid,
}: PrepaidExpenseAdjustmentParams) {
    const expenseRecognized = beginningPrepaid - endingPrepaid;
    return {
        expenseRecognized,
        adjustmentDirection:
            expenseRecognized >= 0 ? "debit-expense-credit-prepaid" : "reverse-balance",
    };
}

export function computeUnearnedRevenueAdjustment({
    beginningUnearnedRevenue,
    endingUnearnedRevenue,
}: UnearnedRevenueAdjustmentParams) {
    const revenueRecognized = beginningUnearnedRevenue - endingUnearnedRevenue;
    return {
        revenueRecognized,
        adjustmentDirection:
            revenueRecognized >= 0 ? "debit-unearned-credit-revenue" : "reverse-balance",
    };
}

export function computeAccruedRevenueAdjustment({
    revenueEarned,
    cashCollected,
}: AccruedRevenueAdjustmentParams) {
    const accruedRevenue = revenueEarned - cashCollected;
    return {
        accruedRevenue,
        adjustmentDirection:
            accruedRevenue >= 0 ? "debit-receivable-credit-revenue" : "reverse-balance",
    };
}

export function computeAccruedExpenseAdjustment({
    expenseIncurred,
    cashPaid,
}: AccruedExpenseAdjustmentParams) {
    const accruedExpense = expenseIncurred - cashPaid;
    return {
        accruedExpense,
        adjustmentDirection:
            accruedExpense >= 0 ? "debit-expense-credit-payable" : "reverse-balance",
    };
}

export function computePricingPlanner({
    unitCost,
    targetMarginPercent,
    targetMonthlyIncome,
    contributionPerUnit,
}: PricingPlannerParams) {
    const targetMarginDecimal = targetMarginPercent / 100;
    const suggestedSellingPrice =
        targetMarginDecimal >= 1 ? Infinity : unitCost / (1 - targetMarginDecimal);
    const unitsNeededForTargetIncome =
        contributionPerUnit <= 0 ? Infinity : targetMonthlyIncome / contributionPerUnit;

    return {
        suggestedSellingPrice,
        markUpPercent:
            unitCost === 0 ? 0 : ((suggestedSellingPrice - unitCost) / unitCost) * 100,
        unitsNeededForTargetIncome,
    };
}

export function computeOwnerSplit({
    distributableProfit,
    ratioA,
    ratioB,
    ratioC = 0,
}: OwnerSplitParams) {
    const totalRatio = ratioA + ratioB + ratioC;
    return {
        totalRatio,
        shareA: distributableProfit * (ratioA / totalRatio),
        shareB: distributableProfit * (ratioB / totalRatio),
        shareC: distributableProfit * (ratioC / totalRatio),
    };
}

export function computeCustomerPayback({
    acquisitionCost,
    monthlyContributionPerCustomer,
}: CustomerPaybackParams) {
    const paybackMonths =
        monthlyContributionPerCustomer <= 0
            ? Infinity
            : acquisitionCost / monthlyContributionPerCustomer;

    return {
        paybackMonths,
        status:
            paybackMonths === Infinity
                ? "No payback"
                : paybackMonths <= 3
                  ? "Fast payback"
                  : paybackMonths <= 6
                    ? "Healthy payback"
                    : paybackMonths <= 12
                      ? "Long payback"
                      : "Slow payback",
    };
}

export function computeElasticityShift({
    initialDriver,
    finalDriver,
    initialQuantity,
    finalQuantity,
}: ElasticityShiftParams) {
    const driverMidpoint = (initialDriver + finalDriver) / 2;
    const quantityMidpoint = (initialQuantity + finalQuantity) / 2;
    const driverChangePercent =
        driverMidpoint === 0 ? 0 : (finalDriver - initialDriver) / driverMidpoint;
    const quantityChangePercent =
        quantityMidpoint === 0 ? 0 : (finalQuantity - initialQuantity) / quantityMidpoint;

    return {
        elasticity:
            driverChangePercent === 0 ? 0 : quantityChangePercent / driverChangePercent,
        driverChangePercent,
        quantityChangePercent,
    };
}

export function computeHighLowCostEstimation({
    highActivityUnits,
    highTotalCost,
    lowActivityUnits,
    lowTotalCost,
    expectedActivityUnits,
}: HighLowCostEstimationParams) {
    const activitySpread = safeSubtract(highActivityUnits, lowActivityUnits);
    const variableCostPerUnit =
        activitySpread === 0
            ? 0
            : safeDivide(safeSubtract(highTotalCost, lowTotalCost), activitySpread);
    const fixedCostEstimate = safeSubtract(
        highTotalCost,
        safeMultiply(variableCostPerUnit, highActivityUnits)
    );
    const costFormula = `Y = ${roundTo(fixedCostEstimate, 2)} + ${roundTo(variableCostPerUnit, 4)}X`;
    const estimatedTotalCost =
        expectedActivityUnits === undefined
            ? null
            : safeAdd(
                  fixedCostEstimate,
                  safeMultiply(variableCostPerUnit, expectedActivityUnits)
              );

    return {
        activitySpread,
        variableCostPerUnit,
        fixedCostEstimate,
        estimatedTotalCost,
        costFormula,
    };
}

export function computeRoiRiEva({
    operatingIncome,
    investedCapital,
    targetRatePercent,
    sales = 0,
}: RoiRiEvaParams) {
    const targetRateDecimal = percentToDecimal(targetRatePercent);
    const roi = safeMultiply(safeDivide(operatingIncome, investedCapital), 100);
    const capitalCharge = safeMultiply(investedCapital, targetRateDecimal);
    const residualIncome = safeSubtract(operatingIncome, capitalCharge);
    const eva = residualIncome;
    const profitMargin =
        sales === 0 ? 0 : safeMultiply(safeDivide(operatingIncome, sales), 100);
    const investmentTurnover = sales === 0 ? 0 : safeDivide(sales, investedCapital);

    return {
        roi,
        capitalCharge,
        residualIncome,
        eva,
        profitMargin,
        investmentTurnover,
        targetRateDecimal,
    };
}

export function computeEconomicOrderQuantity({
    annualDemandUnits,
    orderingCostPerOrder,
    annualCarryingCostPerUnit,
    dailyDemandUnits,
    leadTimeDays,
    safetyStockUnits = 0,
}: EconomicOrderQuantityParams) {
    const eoq =
        annualCarryingCostPerUnit <= 0
            ? 0
            : Math.sqrt(
                  safeDivide(
                      safeMultiply(
                          safeMultiply(2, annualDemandUnits),
                          orderingCostPerOrder
                      ),
                      annualCarryingCostPerUnit
                  )
              );
    const ordersPerYear = eoq <= 0 ? 0 : safeDivide(annualDemandUnits, eoq);
    const averageInventoryUnits = safeAdd(safeDivide(eoq, 2), safetyStockUnits);
    const annualOrderingCost = safeMultiply(ordersPerYear, orderingCostPerOrder);
    const annualCarryingCost = safeMultiply(
        averageInventoryUnits,
        annualCarryingCostPerUnit
    );
    const reorderPointUnits = safeAdd(
        safeMultiply(dailyDemandUnits, leadTimeDays),
        safetyStockUnits
    );

    return {
        eoq,
        ordersPerYear,
        averageInventoryUnits,
        annualOrderingCost,
        annualCarryingCost,
        relevantInventoryCost: safeAdd(annualOrderingCost, annualCarryingCost),
        reorderPointUnits,
    };
}

export function computeAuditPlanning({
    benchmarkAmount,
    materialityPercent,
    performanceMaterialityPercent,
    inherentRiskPercent,
    controlRiskPercent,
}: AuditPlanningParams) {
    const planningMateriality = safeMultiply(
        benchmarkAmount,
        percentToDecimal(materialityPercent)
    );
    const performanceMateriality = safeMultiply(
        planningMateriality,
        percentToDecimal(performanceMaterialityPercent)
    );
    const inherentRiskDecimal = percentToDecimal(inherentRiskPercent);
    const controlRiskDecimal = percentToDecimal(controlRiskPercent);
    const riskOfMaterialMisstatement = safeMultiply(
        inherentRiskDecimal,
        controlRiskDecimal
    );
    const plannedDetectionRisk =
        riskOfMaterialMisstatement === 0
            ? 0
            : safeDivide(0.05, riskOfMaterialMisstatement);

    return {
        planningMateriality,
        performanceMateriality,
        inherentRiskDecimal,
        controlRiskDecimal,
        riskOfMaterialMisstatement,
        plannedDetectionRisk,
        auditFocus:
            plannedDetectionRisk <= 0.3
                ? "More substantive work is likely needed."
                : plannedDetectionRisk <= 0.6
                  ? "Balanced control and substantive testing may be appropriate."
                  : "Control reliance may support a lighter substantive response if evidence holds.",
    };
}

export function computeBookTaxDifference({
    accountingIncomeBeforeTax,
    permanentDifferences,
    temporaryDifferences,
    taxRatePercent,
}: BookTaxDifferenceParams) {
    const taxableIncome = safeAdd(
        safeAdd(accountingIncomeBeforeTax, permanentDifferences),
        temporaryDifferences
    );
    const currentTaxExpense = safeMultiply(taxableIncome, percentToDecimal(taxRatePercent));
    const deferredTaxEffect = safeMultiply(
        temporaryDifferences,
        percentToDecimal(taxRatePercent)
    );
    const effectiveTaxRate =
        accountingIncomeBeforeTax === 0
            ? 0
            : safeMultiply(
                  safeDivide(currentTaxExpense, accountingIncomeBeforeTax),
                  100
              );

    return {
        taxableIncome,
        currentTaxExpense,
        deferredTaxEffect,
        effectiveTaxRate,
    };
}

export function computeBusinessCombination({
    considerationTransferred,
    netIdentifiableAssetsFairValue,
    ownershipPercent,
    nonControllingInterestMeasurement,
    nonControllingInterestFairValue = 0,
}: BusinessCombinationParams) {
    const ownershipDecimal = percentToDecimal(ownershipPercent);
    const nonControllingInterest =
        nonControllingInterestMeasurement === "fair-value"
            ? nonControllingInterestFairValue
            : safeMultiply(
                  netIdentifiableAssetsFairValue,
                  safeSubtract(1, ownershipDecimal)
              );
    const impliedAcquireeFairValue = safeAdd(
        considerationTransferred,
        nonControllingInterest
    );
    const goodwill = safeSubtract(
        impliedAcquireeFairValue,
        netIdentifiableAssetsFairValue
    );

    return {
        ownershipDecimal,
        nonControllingInterest,
        impliedAcquireeFairValue,
        goodwill,
        resultLabel:
            goodwill >= 0 ? "Goodwill recognized" : "Bargain purchase gain indicated",
    };
}

export function computeLeaseMeasurement({
    periodicLeasePayment,
    numberOfPeriods,
    periodicDiscountRatePercent,
    guaranteedResidualValue = 0,
    bargainPurchaseOption = 0,
    initialDirectCosts = 0,
    leaseIncentivesReceived = 0,
}: LeaseMeasurementParams) {
    const discountRateDecimal = percentToDecimal(periodicDiscountRatePercent);
    const annuityFactor =
        discountRateDecimal === 0
            ? numberOfPeriods
            : safeDivide(
                  safeSubtract(1, Math.pow(1 + discountRateDecimal, -numberOfPeriods)),
                  discountRateDecimal
              );
    const presentValueOfLeasePayments = safeMultiply(periodicLeasePayment, annuityFactor);
    const residualAndOptionAmount = safeAdd(
        guaranteedResidualValue,
        bargainPurchaseOption
    );
    const discountedResidualAndOption =
        residualAndOptionAmount === 0
            ? 0
            : safeDivide(
                  residualAndOptionAmount,
                  Math.pow(1 + discountRateDecimal, numberOfPeriods)
              );
    const initialLeaseLiability = safeAdd(
        presentValueOfLeasePayments,
        discountedResidualAndOption
    );
    const initialRightOfUseAsset = safeAdd(
        safeAdd(initialLeaseLiability, initialDirectCosts),
        -leaseIncentivesReceived
    );
    const totalUndiscountedPayments = safeAdd(
        safeMultiply(periodicLeasePayment, numberOfPeriods),
        residualAndOptionAmount
    );

    return {
        discountRateDecimal,
        annuityFactor,
        presentValueOfLeasePayments,
        discountedResidualAndOption,
        initialLeaseLiability,
        initialRightOfUseAsset,
        totalUndiscountedPayments,
        totalFinanceCharge: safeSubtract(
            totalUndiscountedPayments,
            initialLeaseLiability
        ),
    };
}

export function computeShareBasedPayment({
    grantDateFairValuePerOption,
    optionsGranted,
    estimatedForfeitureRatePercent,
    vestingYears,
    serviceYearsRendered,
}: ShareBasedPaymentParams) {
    const expectedVestPercent = safeSubtract(
        1,
        percentToDecimal(estimatedForfeitureRatePercent)
    );
    const expectedOptionsToVest = safeMultiply(optionsGranted, expectedVestPercent);
    const totalCompensationCost = safeMultiply(
        expectedOptionsToVest,
        grantDateFairValuePerOption
    );
    const recognizedYears = Math.min(Math.max(serviceYearsRendered, 0), vestingYears);
    const cumulativeCompensationCost =
        vestingYears <= 0
            ? totalCompensationCost
            : safeMultiply(totalCompensationCost, safeDivide(recognizedYears, vestingYears));
    const currentPeriodExpense =
        vestingYears <= 0
            ? totalCompensationCost
            : safeMultiply(totalCompensationCost, safeDivide(1, vestingYears));

    return {
        expectedVestPercent,
        expectedOptionsToVest,
        totalCompensationCost,
        cumulativeCompensationCost,
        currentPeriodExpense,
        recognizedYears,
    };
}

export function computeStatementOfCashFlows({
    netIncome,
    depreciationExpense,
    impairmentLoss = 0,
    gainOnAssetSale = 0,
    accountsReceivableIncrease = 0,
    inventoryIncrease = 0,
    accountsPayableIncrease = 0,
    capitalExpenditures = 0,
    assetSaleProceeds = 0,
    debtProceeds = 0,
    debtRepayments = 0,
    shareIssuanceProceeds = 0,
    dividendsPaid = 0,
    openingCashBalance = 0,
}: StatementOfCashFlowsParams) {
    const operatingCashFlow = safeAdd(
        safeAdd(
            safeAdd(netIncome, depreciationExpense),
            impairmentLoss
        ),
        safeAdd(
            safeAdd(-gainOnAssetSale, -accountsReceivableIncrease),
            safeAdd(-inventoryIncrease, accountsPayableIncrease)
        )
    );
    const investingCashFlow = safeAdd(-capitalExpenditures, assetSaleProceeds);
    const financingCashFlow = safeAdd(
        safeAdd(debtProceeds, shareIssuanceProceeds),
        safeAdd(-debtRepayments, -dividendsPaid)
    );
    const netChangeInCash = safeAdd(
        safeAdd(operatingCashFlow, investingCashFlow),
        financingCashFlow
    );
    const endingCashBalance = safeAdd(openingCashBalance, netChangeInCash);

    return {
        operatingCashFlow,
        investingCashFlow,
        financingCashFlow,
        netChangeInCash,
        endingCashBalance,
        classificationNotes: [
            "Noncash charges such as depreciation and impairment are added back in operating activities under the indirect method.",
            "Gains on disposals are removed from operating cash flow because the cash proceeds belong in investing activities.",
            "Increases in receivables and inventory usually reduce operating cash flow, while increases in payables usually support it.",
        ],
    };
}

export function computeForeignCurrencyTranslation({
    foreignCurrencyAmount,
    transactionRate,
    closingRate,
    settlementRate,
}: ForeignCurrencyTranslationParams) {
    const initialRecognitionAmount = safeMultiply(
        foreignCurrencyAmount,
        transactionRate
    );
    const closingCarryingAmount = safeMultiply(
        foreignCurrencyAmount,
        closingRate
    );
    const unrealizedExchangeDifference = safeSubtract(
        closingCarryingAmount,
        initialRecognitionAmount
    );
    const settledAmount =
        settlementRate === undefined
            ? null
            : safeMultiply(foreignCurrencyAmount, settlementRate);
    const realizedExchangeDifference =
        settledAmount === null
            ? null
            : safeSubtract(settledAmount, initialRecognitionAmount);

    return {
        initialRecognitionAmount,
        closingCarryingAmount,
        unrealizedExchangeDifference,
        settledAmount,
        realizedExchangeDifference,
    };
}

export function computeConstructionRevenue({
    contractPrice,
    costsIncurredToDate,
    estimatedCostsToComplete,
    billingsToDate = 0,
    collectionsToDate = 0,
}: ConstructionRevenueParams) {
    const estimatedTotalCost = safeAdd(costsIncurredToDate, estimatedCostsToComplete);
    const percentComplete =
        estimatedTotalCost === 0
            ? 0
            : safeDivide(costsIncurredToDate, estimatedTotalCost);
    const revenueRecognizedToDate = safeMultiply(contractPrice, percentComplete);
    const grossProfitRecognizedToDate = safeSubtract(
        revenueRecognizedToDate,
        costsIncurredToDate
    );
    const contractAssetLiabilityPosition = safeSubtract(
        revenueRecognizedToDate,
        billingsToDate
    );
    const uncollectedBillings = safeSubtract(billingsToDate, collectionsToDate);

    return {
        estimatedTotalCost,
        percentComplete,
        revenueRecognizedToDate,
        grossProfitRecognizedToDate,
        contractAssetLiabilityPosition,
        uncollectedBillings,
        positionLabel:
            contractAssetLiabilityPosition >= 0
                ? "Contract asset / due from customer"
                : "Contract liability / due to customer",
    };
}

export function computeRetainedEarningsRollforward({
    beginningRetainedEarnings,
    netIncome,
    dividendsDeclared,
    priorPeriodAdjustment = 0,
}: {
    beginningRetainedEarnings: number;
    netIncome: number;
    dividendsDeclared: number;
    priorPeriodAdjustment?: number;
}) {
    const endingRetainedEarnings =
        beginningRetainedEarnings + netIncome + priorPeriodAdjustment - dividendsDeclared;

    return {
        endingRetainedEarnings,
        netIncomeRetained: netIncome - dividendsDeclared,
    };
}

export function computePercentageTax({
    taxableSales,
    ratePercent,
}: {
    taxableSales: number;
    ratePercent: number;
}) {
    const rateDecimal = ratePercent / 100;
    const taxDue = taxableSales * rateDecimal;

    return {
        rateDecimal,
        taxDue,
        totalWithTax: taxableSales + taxDue,
    };
}

export function computeAccountingRateOfReturn({
    averageAnnualAccountingIncome,
    initialInvestment,
    salvageValue = 0,
}: {
    averageAnnualAccountingIncome: number;
    initialInvestment: number;
    salvageValue?: number;
}) {
    const averageInvestment = (initialInvestment + salvageValue) / 2;
    const accountingRateOfReturnPercent =
        averageInvestment === 0
            ? 0
            : (averageAnnualAccountingIncome / averageInvestment) * 100;

    return {
        averageInvestment,
        accountingRateOfReturnPercent,
    };
}

export function computeEquivalentAnnualAnnuity({
    netPresentValue,
    discountRatePercent,
    projectLife,
}: {
    netPresentValue: number;
    discountRatePercent: number;
    projectLife: number;
}) {
    const rateDecimal = discountRatePercent / 100;
    const annuityFactor =
        rateDecimal === 0
            ? projectLife
            : (1 - Math.pow(1 + rateDecimal, -projectLife)) / rateDecimal;
    const equivalentAnnualAnnuity =
        annuityFactor === 0 ? 0 : netPresentValue / annuityFactor;

    return {
        rateDecimal,
        annuityFactor,
        equivalentAnnualAnnuity,
    };
}
