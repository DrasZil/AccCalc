export function computeSimpleInterest({ principal, annualRatePercent, timeYears, }) {
    const rateDecimal = annualRatePercent / 100;
    const interest = principal * rateDecimal * timeYears;
    const totalAmount = principal + interest;
    return {
        rateDecimal,
        interest,
        totalAmount,
    };
}
export function computeCompoundInterest({ principal, annualRatePercent, compoundsPerYear, timeYears, }) {
    const rateDecimal = annualRatePercent / 100;
    const totalAmount = principal * Math.pow(1 + rateDecimal / compoundsPerYear, compoundsPerYear * timeYears);
    const compoundInterest = totalAmount - principal;
    return {
        rateDecimal,
        totalAmount,
        compoundInterest,
    };
}
export function computeFutureValue({ amount, annualRatePercent, timeYears, }) {
    const rateDecimal = annualRatePercent / 100;
    const futureValue = amount * Math.pow(1 + rateDecimal, timeYears);
    return {
        rateDecimal,
        futureValue,
    };
}
export function computePresentValue({ amount, annualRatePercent, timeYears, }) {
    const rateDecimal = annualRatePercent / 100;
    const presentValue = amount / Math.pow(1 + rateDecimal, timeYears);
    return {
        rateDecimal,
        presentValue,
    };
}
export function computeLoanAmortization({ principal, annualRatePercent, termYears, }) {
    const monthlyRate = annualRatePercent / 100 / 12;
    const totalPayments = termYears * 12;
    const monthlyPayment = monthlyRate === 0
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
export function computeLoanAmortizationSchedule({ principal, annualRatePercent, termYears, }) {
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
            const principalPortion = Math.min(remainingBalance, monthlyRate === 0 ? monthlyPayment : Math.max(scheduledPrincipal, 0));
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
export function computeBreakEven({ fixedCosts, sellingPricePerUnit, variableCostPerUnit, }) {
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
export function computeTargetProfit({ fixedCosts, targetProfit, sellingPricePerUnit, variableCostPerUnit, }) {
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
export function computeMarkupMargin({ cost, sellingPrice }) {
    const profit = sellingPrice - cost;
    const markup = (profit / cost) * 100;
    const margin = (profit / sellingPrice) * 100;
    return {
        profit,
        markup,
        margin,
    };
}
export function computeStraightLineDepreciation({ cost, salvageValue, usefulLifeYears, }) {
    const depreciableCost = cost - salvageValue;
    const annualDepreciation = depreciableCost / usefulLifeYears;
    return {
        depreciableCost,
        annualDepreciation,
    };
}
export function computeDoubleDecliningBalance({ cost, salvageValue, usefulLifeYears, yearNumber, }) {
    const rate = 2 / usefulLifeYears;
    let beginningBookValue = cost;
    let depreciationExpense = 0;
    let endingBookValue = cost;
    for (let currentYear = 1; currentYear <= yearNumber; currentYear += 1) {
        beginningBookValue = endingBookValue;
        depreciationExpense = Math.min(beginningBookValue * rate, beginningBookValue - salvageValue);
        endingBookValue = beginningBookValue - depreciationExpense;
    }
    return {
        rate,
        beginningBookValue,
        depreciationExpense,
        endingBookValue,
    };
}
export function computeCurrentRatio({ currentAssets, currentLiabilities }) {
    return {
        currentRatio: currentAssets / currentLiabilities,
        workingCapital: currentAssets - currentLiabilities,
    };
}
export function computeQuickRatio({ cash, marketableSecurities, netReceivables, currentLiabilities, }) {
    const quickAssets = cash + marketableSecurities + netReceivables;
    return {
        quickAssets,
        quickRatio: quickAssets / currentLiabilities,
    };
}
export function computeCashRatio(cash, marketableSecurities, currentLiabilities) {
    const cashAssets = cash + marketableSecurities;
    return {
        cashAssets,
        cashRatio: cashAssets / currentLiabilities,
    };
}
export function computeGrossProfitRate(netSales, costOfGoodsSold) {
    const grossProfit = netSales - costOfGoodsSold;
    return {
        grossProfit,
        grossProfitRate: (grossProfit / netSales) * 100,
    };
}
export function computeTurnoverWithDayBasis({ numerator, denominator, dayBasis = 365, }) {
    const turnover = numerator / denominator;
    return {
        turnover,
        days: dayBasis / turnover,
    };
}
export function computeCashDiscount({ invoiceAmount, discountRatePercent, discountDays, daysPaid, }) {
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
export function computeTradeDiscount(listPrice, discountRatePercent) {
    const discountAmount = listPrice * (discountRatePercent / 100);
    const netPrice = listPrice - discountAmount;
    return {
        discountAmount,
        netPrice,
    };
}
export function computePartnershipProfitSharing({ partnershipAmount, ratioA, ratioB, ratioC = 0, }) {
    const totalRatio = ratioA + ratioB + ratioC;
    return {
        totalRatio,
        shareA: partnershipAmount * (ratioA / totalRatio),
        shareB: partnershipAmount * (ratioB / totalRatio),
        shareC: partnershipAmount * (ratioC / totalRatio),
    };
}
export function computePartnershipAdmissionBonus(totalOldCapital, partnerInvestment, ownershipPercentage) {
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
export function computePartnershipAdmissionGoodwill(totalOldCapital, partnerInvestment, ownershipPercentage) {
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
export function computePartnershipSalaryInterestAllocation({ partnershipAmount, partnerASalary, partnerBSalary, partnerAAverageCapital, partnerBAverageCapital, interestRatePercent, partnerARemainderRatio, partnerBRemainderRatio, }) {
    const ratioTotal = partnerARemainderRatio + partnerBRemainderRatio;
    const interestShareA = partnerAAverageCapital * (interestRatePercent / 100);
    const interestShareB = partnerBAverageCapital * (interestRatePercent / 100);
    const totalAppropriation = partnerASalary + partnerBSalary + interestShareA + interestShareB;
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
export function computePartnershipRetirementBonus({ totalPartnershipCapital, retiringPartnerCapital, settlementPaid, }) {
    const settlementDifference = settlementPaid - retiringPartnerCapital;
    const remainingCapitalAfterSettlement = totalPartnershipCapital - settlementPaid;
    return {
        settlementDifference,
        remainingCapitalAfterSettlement,
        direction: settlementDifference > 0
            ? "bonus-to-retiring-partner"
            : settlementDifference < 0
                ? "bonus-to-remaining-partners"
                : "no-bonus",
    };
}
export function computePartnerCapitalEndingBalance({ beginningCapital, additionalInvestment, drawings, incomeShare, }) {
    return beginningCapital + additionalInvestment + incomeShare - drawings;
}
export function computeEquityMultiplier(averageTotalAssets, averageTotalEquity) {
    return {
        equityMultiplier: averageTotalAssets / averageTotalEquity,
        financedByDebtPortion: (averageTotalAssets - averageTotalEquity) / averageTotalAssets,
    };
}
export function computeEffectiveAnnualRate(nominalRatePercent, compoundsPerYear) {
    const nominalRateDecimal = nominalRatePercent / 100;
    const effectiveRate = (Math.pow(1 + nominalRateDecimal / compoundsPerYear, compoundsPerYear) - 1) * 100;
    return {
        nominalRateDecimal,
        effectiveRate,
    };
}
export function computeFutureValueOfOrdinaryAnnuity(periodicPayment, periodicRatePercent, periods) {
    const rateDecimal = periodicRatePercent / 100;
    const futureValue = rateDecimal === 0
        ? periodicPayment * periods
        : periodicPayment * ((Math.pow(1 + rateDecimal, periods) - 1) / rateDecimal);
    return {
        rateDecimal,
        futureValue,
    };
}
export function computePresentValueOfOrdinaryAnnuity(periodicPayment, periodicRatePercent, periods) {
    const rateDecimal = periodicRatePercent / 100;
    const presentValue = rateDecimal === 0
        ? periodicPayment * periods
        : periodicPayment * ((1 - Math.pow(1 + rateDecimal, -periods)) / rateDecimal);
    return {
        rateDecimal,
        presentValue,
    };
}
export function computeSinkingFundDeposit(futureValueTarget, periodicRatePercent, periods) {
    const rateDecimal = periodicRatePercent / 100;
    const requiredDeposit = rateDecimal === 0
        ? futureValueTarget / periods
        : futureValueTarget / ((Math.pow(1 + rateDecimal, periods) - 1) / rateDecimal);
    return {
        rateDecimal,
        requiredDeposit,
    };
}
export function computeNetPresentValue(initialInvestment, discountRatePercent, cashFlows) {
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
    const totalPresentValue = discountedCashFlows.reduce((sum, entry) => sum + entry.presentValue, 0);
    return {
        rateDecimal,
        discountedCashFlows,
        totalPresentValue,
        netPresentValue: totalPresentValue - initialInvestment,
    };
}
export function computeProfitabilityIndex(initialInvestment, discountRatePercent, cashFlows) {
    const npv = computeNetPresentValue(initialInvestment, discountRatePercent, cashFlows);
    return {
        ...npv,
        profitabilityIndex: npv.totalPresentValue / initialInvestment,
    };
}
export function computePaybackPeriod(initialInvestment, cashFlows) {
    let unrecoveredBalance = initialInvestment;
    let cumulativeCashFlow = 0;
    let paybackPeriod = null;
    let fractionOfPeriod = null;
    const schedule = cashFlows.map((cashFlow, index) => {
        const period = index + 1;
        const beginningUnrecovered = unrecoveredBalance;
        cumulativeCashFlow += cashFlow;
        unrecoveredBalance -= cashFlow;
        if (paybackPeriod === null &&
            beginningUnrecovered > 0 &&
            unrecoveredBalance <= 0 &&
            cashFlow > 0) {
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
export function computeWeightedMean(values, weights) {
    const weightedSum = values.reduce((sum, value, index) => sum + value * weights[index], 0);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    return {
        weightedSum,
        totalWeight,
        weightedMean: weightedSum / totalWeight,
    };
}
export function computeStandardDeviation(values, sample = false) {
    const count = values.length;
    const mean = values.reduce((sum, value) => sum + value, 0) / count;
    const sumOfSquaredDeviations = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0);
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
export function computeTrialBalance(totalDebits, totalCredits) {
    const difference = totalDebits - totalCredits;
    const isBalanced = Math.abs(difference) < 0.005;
    return {
        difference,
        isBalanced,
        shortSide: isBalanced ? "balanced" : difference > 0 ? "credits" : "debits",
        amountToCorrect: Math.abs(difference),
    };
}
function inventoryLayersFromInputs({ beginningUnits, beginningCost, purchase1Units, purchase1Cost, purchase2Units, purchase2Cost, }) {
    return [
        { label: "Beginning Inventory", units: beginningUnits, unitCost: beginningCost },
        { label: "Purchase 1", units: purchase1Units, unitCost: purchase1Cost },
        { label: "Purchase 2", units: purchase2Units, unitCost: purchase2Cost },
    ];
}
export function computeInventoryMethodComparison({ beginningUnits, beginningCost, purchase1Units, purchase1Cost, purchase2Units, purchase2Cost, unitsSold, }) {
    const layers = inventoryLayersFromInputs({
        beginningUnits,
        beginningCost,
        purchase1Units,
        purchase1Cost,
        purchase2Units,
        purchase2Cost,
    });
    const totalUnitsAvailable = layers.reduce((sum, layer) => sum + layer.units, 0);
    const totalCostAvailable = layers.reduce((sum, layer) => sum + layer.units * layer.unitCost, 0);
    let unitsToIssue = unitsSold;
    let fifoCostOfGoodsSold = 0;
    const fifoIssueLines = [];
    const remainingLayers = layers.map((layer) => ({ ...layer }));
    for (const layer of remainingLayers) {
        if (unitsToIssue <= 0)
            break;
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
    const fifoEndingInventory = remainingLayers.reduce((sum, layer) => sum + layer.units * layer.unitCost, 0);
    const weightedAverageUnitCost = totalUnitsAvailable === 0 ? 0 : totalCostAvailable / totalUnitsAvailable;
    const weightedAverageCostOfGoodsSold = unitsSold * weightedAverageUnitCost;
    const weightedAverageEndingInventory = (totalUnitsAvailable - unitsSold) * weightedAverageUnitCost;
    const costTrendDirection = purchase2Cost > purchase1Cost && purchase1Cost >= beginningCost
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
            costOfGoodsSold: fifoCostOfGoodsSold - weightedAverageCostOfGoodsSold,
            endingInventory: fifoEndingInventory - weightedAverageEndingInventory,
        },
        costTrendDirection,
    };
}
export function computeDepreciationComparisonSchedule({ cost, salvageValue, usefulLifeYears, }) {
    const straightLineAmount = (cost - salvageValue) / usefulLifeYears;
    const ddbRate = 2 / usefulLifeYears;
    let ddbBookValue = cost;
    let straightLineBookValue = cost;
    const schedule = Array.from({ length: usefulLifeYears }, (_, index) => {
        const year = index + 1;
        const straightLineExpense = straightLineAmount;
        straightLineBookValue -= straightLineExpense;
        const ddbExpense = Math.min(ddbBookValue * ddbRate, ddbBookValue - salvageValue);
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
export function computeCashConversionCycle({ receivablesDays, inventoryDays, payablesDays, }) {
    const operatingCycle = receivablesDays + inventoryDays;
    const cashConversionCycle = operatingCycle - payablesDays;
    return {
        operatingCycle,
        cashConversionCycle,
        workingCapitalDays: Math.max(cashConversionCycle, 0),
        pressureLevel: cashConversionCycle <= 0
            ? "low"
            : cashConversionCycle <= 30
                ? "moderate"
                : cashConversionCycle <= 60
                    ? "elevated"
                    : "high",
    };
}
