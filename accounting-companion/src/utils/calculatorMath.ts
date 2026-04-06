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

export function computeNetPresentValue(
    initialInvestment: number,
    discountRatePercent: number,
    cashFlows: number[]
) {
    const rateDecimal = discountRatePercent / 100;
    const discountedCashFlows = cashFlows.map((cashFlow, index) => {
        const period = index + 1;
        const discountFactor = 1 / Math.pow(1 + rateDecimal, period);
        const presentValue = cashFlow * discountFactor;

        return {
            period,
            cashFlow,
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
        netPresentValue: totalPresentValue - initialInvestment,
    };
}

export function computeProfitabilityIndex(
    initialInvestment: number,
    discountRatePercent: number,
    cashFlows: number[]
) {
    const npv = computeNetPresentValue(initialInvestment, discountRatePercent, cashFlows);

    return {
        ...npv,
        profitabilityIndex: npv.totalPresentValue / initialInvestment,
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
