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
function buildTimedCashSchedule({ periods, pattern, beginningCarryover = 0, beginningCarryoverLabel, }) {
    const normalizedPattern = [...pattern].sort((left, right) => left.lagPeriods - right.lagPeriods);
    const scheduledPercent = normalizedPattern.reduce((sum, entry) => sum + entry.percent, 0);
    const rows = periods.map((period, periodIndex) => {
        const contributions = normalizedPattern
            .map((entry) => {
            const sourceIndex = periodIndex - entry.lagPeriods;
            if (sourceIndex < 0)
                return null;
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
            .filter((entry) => Boolean(entry));
        if (periodIndex === 0 && beginningCarryover !== 0) {
            contributions.unshift({
                sourceLabel: beginningCarryoverLabel,
                lagPeriods: -1,
                percent: 100,
                amount: beginningCarryover,
            });
        }
        const totalScheduled = contributions.reduce((sum, entry) => sum + entry.amount, 0);
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
            if (targetIndex >= periods.length)
                return scheduled;
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
export function computeNetPresentValue(initialInvestment, discountRatePercent, cashFlows, terminalValue = 0) {
    const rateDecimal = discountRatePercent / 100;
    const terminalPeriod = cashFlows.length;
    const discountedCashFlows = cashFlows.map((cashFlow, index) => {
        const period = index + 1;
        const terminalCashFlow = terminalValue !== 0 && period === terminalPeriod ? terminalValue : 0;
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
    const totalPresentValue = discountedCashFlows.reduce((sum, entry) => sum + entry.presentValue, 0);
    return {
        rateDecimal,
        discountedCashFlows,
        totalPresentValue,
        terminalValue,
        netPresentValue: totalPresentValue - initialInvestment,
    };
}
export function computeProfitabilityIndex(initialInvestment, discountRatePercent, cashFlows, terminalValue = 0) {
    const npv = computeNetPresentValue(initialInvestment, discountRatePercent, cashFlows, terminalValue);
    return {
        ...npv,
        profitabilityIndex: npv.totalPresentValue / initialInvestment,
    };
}
export function computeInternalRateOfReturn(initialInvestment, cashFlows, terminalValue = 0) {
    const totalPeriods = cashFlows.length;
    const resolvedCashFlows = cashFlows.map((cashFlow, index) => index === totalPeriods - 1 ? cashFlow + terminalValue : cashFlow);
    const signSeries = [-initialInvestment, ...resolvedCashFlows].filter((value) => Math.abs(value) >= 0.0000001);
    const signChanges = signSeries.reduce((count, value, index, series) => {
        if (index === 0)
            return count;
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
        npv: computeNetPresentValue(initialInvestment, ratePercent, cashFlows, terminalValue).netPresentValue,
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
            reason: "A single IRR could not be isolated across the tested discount-rate range. The project may never recover on a discounted basis or may have multiple valid IRRs.",
        };
    }
    if (Math.abs(lowerBound.npv) < 0.000001 && lowerBound.ratePercent === upperBound.ratePercent) {
        const exact = computeNetPresentValue(initialInvestment, lowerBound.ratePercent, cashFlows, terminalValue);
        return {
            hasSolution: true,
            irrPercent: lowerBound.ratePercent,
            signChanges,
            multipleIrRisk,
            iterations: 0,
            bracket: [lowerBound.ratePercent, upperBound.ratePercent],
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
        midNpv = computeNetPresentValue(initialInvestment, midRate, cashFlows, terminalValue).netPresentValue;
        if (Math.abs(midNpv) < 0.000001 || Math.abs(rightRate - leftRate) < 0.0000001) {
            break;
        }
        if (leftNpv * midNpv <= 0) {
            rightRate = midRate;
            rightNpv = midNpv;
        }
        else {
            leftRate = midRate;
            leftNpv = midNpv;
        }
    }
    const exact = computeNetPresentValue(initialInvestment, midRate, cashFlows, terminalValue);
    return {
        hasSolution: true,
        irrPercent: midRate,
        signChanges,
        multipleIrRisk,
        iterations,
        bracket: [leftRate, rightRate],
        residualNpv: midNpv,
        lowerBoundNpv: leftNpv,
        upperBoundNpv: rightNpv,
        ...exact,
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
export function computeReceivablesAgingSchedule({ buckets, existingAllowanceBalance = 0, }) {
    const rows = buckets.map((bucket) => {
        const estimatedLoss = bucket.amount * (bucket.estimatedUncollectibleRatePercent / 100);
        return {
            ...bucket,
            estimatedLoss,
        };
    });
    const totalReceivables = rows.reduce((sum, row) => sum + row.amount, 0);
    const requiredEndingAllowance = rows.reduce((sum, row) => sum + row.estimatedLoss, 0);
    const netRealizableValue = totalReceivables - requiredEndingAllowance;
    const requiredAdjustment = requiredEndingAllowance - existingAllowanceBalance;
    return {
        rows,
        totalReceivables,
        requiredEndingAllowance,
        existingAllowanceBalance,
        netRealizableValue,
        requiredAdjustment,
        adjustmentDirection: requiredAdjustment > 0
            ? "increase"
            : requiredAdjustment < 0
                ? "decrease"
                : "none",
        allowanceJournalEffect: requiredAdjustment > 0
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
export function computeBankReconciliation({ bankBalance, bookBalance, depositsInTransit, outstandingChecks, bankCharges, nsfChecks, interestIncome, notesCollectedByBank, bankError, bookError, }) {
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
export function computeCashCollectionsSchedule({ periods, collectionPattern, beginningReceivables = 0, }) {
    const schedule = buildTimedCashSchedule({
        periods,
        pattern: collectionPattern,
        beginningCarryover: beginningReceivables,
        beginningCarryoverLabel: "Prior-period receivables",
    });
    return {
        ...schedule,
        totalSales: periods.reduce((sum, period) => sum + period.amount, 0),
        totalCollections: schedule.rows.reduce((sum, row) => sum + row.totalScheduled, 0),
        endingReceivables: schedule.endingBalance,
    };
}
export function computeCashDisbursementsSchedule({ periods, paymentPattern, beginningPayables = 0, }) {
    const schedule = buildTimedCashSchedule({
        periods,
        pattern: paymentPattern,
        beginningCarryover: beginningPayables,
        beginningCarryoverLabel: "Prior-period payables",
    });
    return {
        ...schedule,
        totalPurchases: periods.reduce((sum, period) => sum + period.amount, 0),
        totalDisbursements: schedule.rows.reduce((sum, row) => sum + row.totalScheduled, 0),
        endingPayables: schedule.endingBalance,
    };
}
export function computeSalesMixBreakEven({ fixedCosts, products, }) {
    const totalMixShare = products.reduce((sum, product) => sum + product.mixShare, 0);
    const rows = products.map((product) => {
        const contributionMarginPerUnit = product.sellingPrice - product.variableCost;
        return {
            ...product,
            contributionMarginPerUnit,
            contributionMarginRatio: product.sellingPrice === 0
                ? 0
                : contributionMarginPerUnit / product.sellingPrice,
        };
    });
    const compositeUnitSales = rows.reduce((sum, row) => sum + row.sellingPrice * row.mixShare, 0);
    const compositeUnitContribution = rows.reduce((sum, row) => sum + row.contributionMarginPerUnit * row.mixShare, 0);
    const weightedAverageContributionMarginRatio = compositeUnitSales === 0 ? 0 : compositeUnitContribution / compositeUnitSales;
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
export function computeLowerOfCostOrNrv({ items, method, }) {
    const rows = items.map((item) => {
        const lowerValue = Math.min(item.cost, item.netRealizableValue);
        return {
            ...item,
            lowerValue,
            writeDown: item.cost - lowerValue,
        };
    });
    const totalCost = rows.reduce((sum, row) => sum + row.cost, 0);
    const totalNetRealizableValue = rows.reduce((sum, row) => sum + row.netRealizableValue, 0);
    const aggregateLowerValue = Math.min(totalCost, totalNetRealizableValue);
    const totalWriteDown = method === "aggregate"
        ? totalCost - aggregateLowerValue
        : rows.reduce((sum, row) => sum + row.writeDown, 0);
    return {
        rows,
        totalCost,
        totalNetRealizableValue,
        totalLowerValue: method === "aggregate"
            ? aggregateLowerValue
            : rows.reduce((sum, row) => sum + row.lowerValue, 0),
        totalWriteDown,
        method,
    };
}
export function computeBondAmortizationSchedule({ faceValue, statedRatePercent, marketRatePercent, termYears, paymentsPerYear, method, issuePrice, }) {
    const totalPeriods = termYears * paymentsPerYear;
    const periodicStatedRate = statedRatePercent / 100 / paymentsPerYear;
    const periodicMarketRate = marketRatePercent / 100 / paymentsPerYear;
    const cashInterest = faceValue * periodicStatedRate;
    const derivedIssuePrice = periodicMarketRate === 0
        ? faceValue + cashInterest * totalPeriods
        : cashInterest *
            ((1 - Math.pow(1 + periodicMarketRate, -totalPeriods)) /
                periodicMarketRate) +
            faceValue / Math.pow(1 + periodicMarketRate, totalPeriods);
    const resolvedIssuePrice = issuePrice ?? derivedIssuePrice;
    const premiumOrDiscount = faceValue - resolvedIssuePrice;
    const straightLineAmortizationPerPeriod = premiumOrDiscount / totalPeriods;
    let carryingValue = resolvedIssuePrice;
    const schedule = Array.from({ length: totalPeriods }, (_, index) => {
        const period = index + 1;
        const beginningCarryingValue = carryingValue;
        let interestExpense = method === "effective-interest"
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
        issueType: Math.abs(premiumOrDiscount) < 0.005
            ? "at par"
            : premiumOrDiscount > 0
                ? "discount"
                : "premium",
        straightLineAmortizationPerPeriod,
        schedule,
        totalInterestExpense: schedule.reduce((sum, row) => sum + row.interestExpense, 0),
    };
}
export function computeCashBudget({ beginningCashBalance, cashCollections, cashDisbursements, minimumCashBalance, }) {
    const totalCashAvailable = beginningCashBalance + cashCollections;
    const excessOrDeficiencyBeforeFinancing = totalCashAvailable - cashDisbursements;
    const financingNeeded = Math.max(minimumCashBalance - excessOrDeficiencyBeforeFinancing, 0);
    const endingCashAfterFinancing = excessOrDeficiencyBeforeFinancing + financingNeeded;
    return {
        totalCashAvailable,
        excessOrDeficiencyBeforeFinancing,
        financingNeeded,
        endingCashAfterFinancing,
        excessCashAfterFinancing: endingCashAfterFinancing - minimumCashBalance,
    };
}
export function computeFlexibleBudget({ budgetedUnits, actualUnits, fixedCosts, variableCostPerUnit, actualCost, }) {
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
export function computeFactoryOverheadVariances({ actualVariableOverhead, actualFixedOverhead, actualHours, standardHoursAllowed, standardVariableOverheadRate, budgetedFixedOverhead, denominatorHours, }) {
    const standardVariableOverheadForActualHours = actualHours * standardVariableOverheadRate;
    const appliedVariableOverhead = standardHoursAllowed * standardVariableOverheadRate;
    const variableOverheadSpendingVariance = actualVariableOverhead - standardVariableOverheadForActualHours;
    const variableOverheadEfficiencyVariance = standardVariableOverheadForActualHours - appliedVariableOverhead;
    const standardFixedOverheadRate = denominatorHours === 0 ? 0 : budgetedFixedOverhead / denominatorHours;
    const appliedFixedOverhead = standardHoursAllowed * standardFixedOverheadRate;
    const fixedOverheadBudgetVariance = actualFixedOverhead - budgetedFixedOverhead;
    const fixedOverheadVolumeVariance = budgetedFixedOverhead - appliedFixedOverhead;
    const totalActualOverhead = actualVariableOverhead + actualFixedOverhead;
    const totalAppliedOverhead = appliedVariableOverhead + appliedFixedOverhead;
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
export function computeEquivalentUnitsWeightedAverage({ beginningWorkInProcessUnits, unitsStarted, unitsCompletedAndTransferred, endingWorkInProcessUnits, endingMaterialsCompletionPercent, endingConversionCompletionPercent, totalMaterialsCosts, totalConversionCosts, }) {
    const totalUnitsToAccountFor = beginningWorkInProcessUnits + unitsStarted;
    const totalUnitsAccountedFor = unitsCompletedAndTransferred + endingWorkInProcessUnits;
    const materialsEquivalentUnits = unitsCompletedAndTransferred +
        endingWorkInProcessUnits * (endingMaterialsCompletionPercent / 100);
    const conversionEquivalentUnits = unitsCompletedAndTransferred +
        endingWorkInProcessUnits * (endingConversionCompletionPercent / 100);
    const materialsCostPerEquivalentUnit = totalMaterialsCosts / materialsEquivalentUnits;
    const conversionCostPerEquivalentUnit = totalConversionCosts / conversionEquivalentUnits;
    const transferredOutCost = unitsCompletedAndTransferred *
        (materialsCostPerEquivalentUnit + conversionCostPerEquivalentUnit);
    const endingWorkInProcessCost = endingWorkInProcessUnits *
        (endingMaterialsCompletionPercent / 100) *
        materialsCostPerEquivalentUnit +
        endingWorkInProcessUnits *
            (endingConversionCompletionPercent / 100) *
            conversionCostPerEquivalentUnit;
    return {
        totalUnitsToAccountFor,
        totalUnitsAccountedFor,
        unitReconciliationDifference: totalUnitsToAccountFor - totalUnitsAccountedFor,
        materialsEquivalentUnits,
        conversionEquivalentUnits,
        materialsCostPerEquivalentUnit,
        conversionCostPerEquivalentUnit,
        transferredOutCost,
        endingWorkInProcessCost,
        totalCostAssigned: transferredOutCost + endingWorkInProcessCost,
    };
}
export function computeMaterialsQuantityVariance(actualQuantityUsed, standardQuantityAllowed, standardPrice) {
    const variance = (actualQuantityUsed - standardQuantityAllowed) * standardPrice;
    return {
        variance,
        direction: variance > 0 ? "Unfavorable" : variance < 0 ? "Favorable" : "None",
    };
}
export function computeLaborEfficiencyVariance(actualHours, standardHoursAllowed, standardRate) {
    const variance = (actualHours - standardHoursAllowed) * standardRate;
    return {
        variance,
        direction: variance > 0 ? "Unfavorable" : variance < 0 ? "Favorable" : "None",
    };
}
export function computeDiscountedPaybackPeriod(initialInvestment, discountRatePercent, cashFlows) {
    const rateDecimal = discountRatePercent / 100;
    let cumulativeDiscountedCashFlow = 0;
    let unrecoveredDiscountedBalance = initialInvestment;
    let paybackPeriod = null;
    let fractionOfPeriod = null;
    const schedule = cashFlows.map((cashFlow, index) => {
        const period = index + 1;
        const discountFactor = 1 / Math.pow(1 + rateDecimal, period);
        const discountedCashFlow = cashFlow * discountFactor;
        const beginningUnrecovered = unrecoveredDiscountedBalance;
        cumulativeDiscountedCashFlow += discountedCashFlow;
        unrecoveredDiscountedBalance -= discountedCashFlow;
        if (paybackPeriod === null &&
            beginningUnrecovered > 0 &&
            unrecoveredDiscountedBalance <= 0 &&
            discountedCashFlow > 0) {
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
export function computeRatioAnalysisWorkspace({ currentAssets, currentLiabilities, cash, marketableSecurities, netReceivables, netSales, netCreditSales, costOfGoodsSold, netIncome, averageInventory, averageAccountsReceivable, averageTotalAssets, averageEquity, dayBasis = 365, }) {
    const currentRatio = currentLiabilities === 0 ? 0 : currentAssets / currentLiabilities;
    const workingCapital = currentAssets - currentLiabilities;
    const quickAssets = cash + marketableSecurities + netReceivables;
    const quickRatio = currentLiabilities === 0 ? 0 : quickAssets / currentLiabilities;
    const grossProfit = netSales - costOfGoodsSold;
    const grossProfitRate = netSales === 0 ? 0 : grossProfit / netSales;
    const inventoryTurnover = averageInventory === 0 ? 0 : costOfGoodsSold / averageInventory;
    const inventoryDays = inventoryTurnover === 0 ? 0 : dayBasis / inventoryTurnover;
    const receivablesTurnover = averageAccountsReceivable === 0
        ? 0
        : netCreditSales / averageAccountsReceivable;
    const collectionDays = receivablesTurnover === 0 ? 0 : dayBasis / receivablesTurnover;
    const returnOnAssets = averageTotalAssets === 0 ? 0 : netIncome / averageTotalAssets;
    const returnOnEquity = averageEquity === 0 ? 0 : netIncome / averageEquity;
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
export function computeCommonSizeStatement(lines, baseAmount) {
    const resolvedBase = baseAmount ?? lines.reduce((sum, line) => sum + line.amount, 0);
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
export function computeHorizontalAnalysisWorkspace(lines) {
    const rows = lines.map((line) => {
        const amountChange = line.currentAmount - line.baseAmount;
        const percentageChange = line.baseAmount === 0 ? null : (amountChange / line.baseAmount) * 100;
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
        totalPercentageChange: baseTotal === 0 ? null : (totalChange / baseTotal) * 100,
    };
}
export function computeWorkingCapitalCycle({ currentAssets, currentLiabilities, receivablesDays, inventoryDays, payablesDays, }) {
    const workingCapital = currentAssets - currentLiabilities;
    const operatingCycle = receivablesDays + inventoryDays;
    const cashConversionCycle = operatingCycle - payablesDays;
    return {
        workingCapital,
        operatingCycle,
        cashConversionCycle,
    };
}
export function computeCapitalBudgetingComparison(initialInvestment, discountRatePercent, cashFlows, terminalValue = 0) {
    const npv = computeNetPresentValue(initialInvestment, discountRatePercent, cashFlows, terminalValue);
    const profitabilityIndex = computeProfitabilityIndex(initialInvestment, discountRatePercent, cashFlows, terminalValue);
    const internalRateOfReturn = computeInternalRateOfReturn(initialInvestment, cashFlows, terminalValue);
    const discountedPayback = computeDiscountedPaybackPeriod(initialInvestment, discountRatePercent, cashFlows.map((cashFlow, index) => index === cashFlows.length - 1 ? cashFlow + terminalValue : cashFlow));
    return {
        npv,
        profitabilityIndex,
        internalRateOfReturn,
        discountedPayback,
        decision: npv.netPresentValue >= 0 &&
            profitabilityIndex.profitabilityIndex >= 1
            ? "Accept"
            : "Review / Reject",
    };
}
