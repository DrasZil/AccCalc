import { percentToDecimal } from "./calc/percentUtils.js";
import { roundTo } from "./calc/precision.js";
import { sanitizeNumberOutput } from "./calc/numberSafety.js";
import { safeAdd, safeDivide, safeMultiply, safePow, safeSubtract, } from "./calc/safeOperators.js";
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
    const monthlyRate = safeDivide(percentToDecimal(annualRatePercent), 12);
    const totalPayments = termYears * 12;
    const monthlyPayment = monthlyRate === 0
        ? safeDivide(principal, totalPayments)
        : safeMultiply(principal, safeDivide(safeMultiply(monthlyRate, safePow(safeAdd(1, monthlyRate), totalPayments, 0)), safeSubtract(safePow(safeAdd(1, monthlyRate), totalPayments, 0), 1)));
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
    const contributionMarginPerUnit = safeSubtract(sellingPricePerUnit, variableCostPerUnit);
    const breakEvenUnits = contributionMarginPerUnit <= 0 ? 0 : safeDivide(fixedCosts, contributionMarginPerUnit);
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
export function computeTargetProfit({ fixedCosts, targetProfit, sellingPricePerUnit, variableCostPerUnit, }) {
    const contributionMarginPerUnit = safeSubtract(sellingPricePerUnit, variableCostPerUnit);
    const requiredUnits = contributionMarginPerUnit <= 0
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
export function computeCvpAnalysis({ fixedCosts, sellingPricePerUnit, variableCostPerUnit, targetProfit, expectedUnitSales, sensitivityPercent = 10, }) {
    const contributionMarginPerUnit = safeSubtract(sellingPricePerUnit, variableCostPerUnit);
    const contributionMarginRatio = sellingPricePerUnit === 0 ? 0 : safeDivide(contributionMarginPerUnit, sellingPricePerUnit);
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
    const marginOfSafetyRatio = expectedSales === 0 ? 0 : safeDivide(marginOfSafetyAmount, expectedSales);
    const degreeOfOperatingLeverage = operatingIncome <= 0 ? Infinity : safeDivide(expectedContributionMargin, operatingIncome);
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
        const scenarioContributionPerUnit = safeSubtract(scenario.sellingPricePerUnit, scenario.variableCostPerUnit);
        const scenarioBreakEvenUnits = scenarioContributionPerUnit <= 0
            ? Infinity
            : safeDivide(fixedCosts, scenarioContributionPerUnit);
        const scenarioOperatingIncome = safeMultiply(scenarioContributionPerUnit, scenario.expectedUnitSales) - fixedCosts;
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
export function computeMarkupMargin({ cost, sellingPrice }) {
    const profit = safeSubtract(sellingPrice, cost);
    const markup = safeMultiply(safeDivide(profit, cost), 100);
    const margin = safeMultiply(safeDivide(profit, sellingPrice), 100);
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
export function computeImpairmentLoss({ carryingAmount, fairValueLessCostsToSell, valueInUse, }) {
    const recoverableAmount = Math.max(fairValueLessCostsToSell, valueInUse);
    const impairmentLoss = Math.max(carryingAmount - recoverableAmount, 0);
    const carryingAmountAfterImpairment = carryingAmount - impairmentLoss;
    return {
        recoverableAmount,
        impairmentLoss,
        carryingAmountAfterImpairment,
        measurementBasis: fairValueLessCostsToSell >= valueInUse
            ? "fair-value-less-costs-to-sell"
            : "value-in-use",
    };
}
export function computeAssetDisposal({ assetCost, accumulatedDepreciation, proceeds, disposalCosts = 0, }) {
    const bookValue = safeSubtract(assetCost, accumulatedDepreciation);
    const netProceeds = safeSubtract(proceeds, disposalCosts);
    const gainOrLoss = safeSubtract(netProceeds, bookValue);
    return {
        bookValue,
        netProceeds,
        gainOrLoss,
        outcome: gainOrLoss === 0 ? "break-even" : gainOrLoss > 0 ? "gain" : "loss",
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
        currentRatio: safeDivide(currentAssets, currentLiabilities),
        workingCapital: safeSubtract(currentAssets, currentLiabilities),
    };
}
export function computeQuickRatio({ cash, marketableSecurities, netReceivables, currentLiabilities, }) {
    const quickAssets = safeAdd(safeAdd(cash, marketableSecurities), netReceivables);
    return {
        quickAssets,
        quickRatio: safeDivide(quickAssets, currentLiabilities),
    };
}
export function computeCashRatio(cash, marketableSecurities, currentLiabilities) {
    const cashAssets = safeAdd(cash, marketableSecurities);
    return {
        cashAssets,
        cashRatio: safeDivide(cashAssets, currentLiabilities),
    };
}
export function computeGrossProfitRate(netSales, costOfGoodsSold) {
    const grossProfit = safeSubtract(netSales, costOfGoodsSold);
    return {
        grossProfit,
        grossProfitRate: safeMultiply(safeDivide(grossProfit, netSales), 100),
    };
}
export function computeTurnoverWithDayBasis({ numerator, denominator, dayBasis = 365, }) {
    const turnover = safeDivide(numerator, denominator);
    return {
        turnover,
        days: safeDivide(dayBasis, turnover),
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
export function computePettyCashReconciliation({ fundAmount, cashOnHand, pettyCashVouchers, stampsOnHand = 0, otherReceipts = 0, }) {
    const totalAccountedFor = safeAdd(safeAdd(cashOnHand, pettyCashVouchers), safeAdd(stampsOnHand, otherReceipts));
    const shortageOrOverage = safeSubtract(totalAccountedFor, fundAmount);
    return {
        totalAccountedFor,
        shortageOrOverage,
        status: shortageOrOverage === 0
            ? "balanced"
            : shortageOrOverage > 0
                ? "over"
                : "short",
        replenishmentAmount: safeSubtract(fundAmount, cashOnHand),
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
export function computePartnershipDissolution({ bookValueNoncashAssets, cashFromRealization, liabilitiesToSettle, partners, assumeDeficiencyInsolvent = false, }) {
    const totalRatio = partners.reduce((sum, partner) => sum + partner.ratio, 0);
    const gainOrLossOnRealization = cashFromRealization - bookValueNoncashAssets;
    const cashAvailableForPartners = cashFromRealization - liabilitiesToSettle;
    const bookNetAssets = bookValueNoncashAssets - liabilitiesToSettle;
    const capitalTotal = partners.reduce((sum, partner) => sum + partner.capital, 0);
    const capitalConsistencyGap = capitalTotal - bookNetAssets;
    const allocated = partners.map((partner) => {
        const realizationShare = totalRatio === 0 ? 0 : (gainOrLossOnRealization * partner.ratio) / totalRatio;
        const adjustedCapital = partner.capital + realizationShare;
        return {
            ...partner,
            realizationShare,
            adjustedCapital,
        };
    });
    const deficiencyPartners = allocated.filter((partner) => partner.adjustedCapital < 0);
    const deficiencyTotal = Math.abs(deficiencyPartners.reduce((sum, partner) => sum + partner.adjustedCapital, 0));
    const solventPartners = allocated.filter((partner) => partner.adjustedCapital > 0);
    const solventRatioTotal = solventPartners.reduce((sum, partner) => sum + partner.ratio, 0);
    const finalPartners = allocated.map((partner) => {
        if (assumeDeficiencyInsolvent &&
            deficiencyTotal > 0 &&
            partner.adjustedCapital > 0 &&
            solventRatioTotal > 0) {
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
        finalDistributionTotal: finalPartners.reduce((sum, partner) => sum + partner.finalCashDistribution, 0),
        finalPartners,
        assumeDeficiencyInsolvent,
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
export function computeCapitalRationingSelection(projects, capitalBudget) {
    const MAX_EXACT_COMBINATION_PROJECTS = 20;
    const rankedProjects = projects
        .filter((project) => project.initialInvestment > 0)
        .map((project) => ({
        ...project,
        profitabilityIndex: (project.initialInvestment + project.netPresentValue) / project.initialInvestment,
    }))
        .sort((a, b) => b.profitabilityIndex - a.profitabilityIndex);
    let greedyRemainingBudget = capitalBudget;
    const greedySelectedProjects = rankedProjects.filter((project) => {
        if (project.initialInvestment > greedyRemainingBudget)
            return false;
        greedyRemainingBudget -= project.initialInvestment;
        return true;
    });
    let optimalProjects = [];
    let optimalInvestment = 0;
    let optimalNpv = Number.NEGATIVE_INFINITY;
    const candidateProjects = rankedProjects.filter((project) => project.netPresentValue > 0);
    const exactSearchEvaluated = candidateProjects.length <= MAX_EXACT_COMBINATION_PROJECTS;
    if (exactSearchEvaluated) {
        const totalCombinations = 2 ** candidateProjects.length;
        for (let mask = 1; mask < totalCombinations; mask += 1) {
            const selected = candidateProjects.filter((_, index) => (mask & (1 << index)) !== 0);
            const investment = selected.reduce((sum, project) => sum + project.initialInvestment, 0);
            if (investment > capitalBudget)
                continue;
            const npv = selected.reduce((sum, project) => sum + project.netPresentValue, 0);
            const isBetterNpv = npv > optimalNpv + 0.000001;
            const isTieWithBetterBudgetUse = Math.abs(npv - optimalNpv) <= 0.000001 && investment > optimalInvestment;
            if (isBetterNpv || isTieWithBetterBudgetUse) {
                optimalProjects = selected;
                optimalInvestment = investment;
                optimalNpv = npv;
            }
        }
    }
    if (optimalProjects.length === 0) {
        optimalNpv = 0;
    }
    const selectedProjects = optimalProjects.length > 0 ? optimalProjects : greedySelectedProjects;
    const totalInvestment = selectedProjects.reduce((sum, project) => sum + project.initialInvestment, 0);
    const totalNpv = selectedProjects.reduce((sum, project) => sum + project.netPresentValue, 0);
    const remainingBudget = safeSubtract(capitalBudget, totalInvestment);
    const greedyTotalInvestment = greedySelectedProjects.reduce((sum, project) => sum + project.initialInvestment, 0);
    const greedyTotalNpv = greedySelectedProjects.reduce((sum, project) => sum + project.netPresentValue, 0);
    return {
        rankedProjects,
        greedySelectedProjects,
        greedyTotalInvestment,
        greedyTotalNpv,
        optimalProjects,
        optimalInvestment,
        optimalNpv,
        optimizationImprovement: safeSubtract(totalNpv, greedyTotalNpv),
        exactSearchEvaluated,
        optimizationNote: exactSearchEvaluated
            ? "Exact combination search evaluated all positive-NPV independent project subsets."
            : `Exact subset search is capped at ${MAX_EXACT_COMBINATION_PROJECTS} positive-NPV projects; PI ranking is shown as the practical classroom fallback.`,
        selectionMethod: exactSearchEvaluated ? "exact-combination" : "greedy-pi-fallback",
        selectedProjects,
        totalInvestment,
        totalNpv,
        remainingBudget,
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
export function computeCoefficientOfVariation(values, sample = false) {
    const standardDeviationResult = computeStandardDeviation(values, sample);
    const coefficientOfVariation = standardDeviationResult.mean === 0
        ? Infinity
        : (standardDeviationResult.standardDeviation / Math.abs(standardDeviationResult.mean)) * 100;
    return {
        ...standardDeviationResult,
        coefficientOfVariation,
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
const TWO_TAILED_Z_CRITICALS = {
    80: 1.282,
    90: 1.645,
    95: 1.96,
    98: 2.326,
    99: 2.576,
};
const TWO_TAILED_T_CRITICALS = {
    90: { 1: 6.314, 2: 2.92, 3: 2.353, 4: 2.132, 5: 2.015, 6: 1.943, 7: 1.895, 8: 1.86, 9: 1.833, 10: 1.812, 12: 1.782, 15: 1.753, 20: 1.725, 25: 1.708, 30: 1.697, 40: 1.684, 60: 1.671, 80: 1.664, 100: 1.66, 120: 1.658 },
    95: { 1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571, 6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228, 12: 2.179, 15: 2.131, 20: 2.086, 25: 2.06, 30: 2.042, 40: 2.021, 60: 2, 80: 1.99, 100: 1.984, 120: 1.98 },
    98: { 1: 31.821, 2: 6.965, 3: 4.541, 4: 3.747, 5: 3.365, 6: 3.143, 7: 2.998, 8: 2.896, 9: 2.821, 10: 2.764, 12: 2.681, 15: 2.602, 20: 2.528, 25: 2.485, 30: 2.457, 40: 2.423, 60: 2.39, 80: 2.374, 100: 2.364, 120: 2.358 },
    99: { 1: 63.657, 2: 9.925, 3: 5.841, 4: 4.604, 5: 4.032, 6: 3.707, 7: 3.499, 8: 3.355, 9: 3.25, 10: 3.169, 12: 3.055, 15: 2.947, 20: 2.845, 25: 2.787, 30: 2.75, 40: 2.704, 60: 2.66, 80: 2.639, 100: 2.626, 120: 2.617 },
};
function normalizeSupportedConfidenceLevel(confidenceLevelPercent) {
    const supportedLevels = [80, 90, 95, 98, 99];
    return supportedLevels.reduce((best, level) => Math.abs(level - confidenceLevelPercent) < Math.abs(best - confidenceLevelPercent)
        ? level
        : best);
}
function getTwoTailedTCritical(confidenceLevelPercent, degreesOfFreedom) {
    const normalizedLevel = normalizeSupportedConfidenceLevel(confidenceLevelPercent);
    const table = TWO_TAILED_T_CRITICALS[normalizedLevel];
    if (!table || degreesOfFreedom > 120) {
        return TWO_TAILED_Z_CRITICALS[normalizedLevel] ?? 1.96;
    }
    const bucket = Object.keys(table)
        .map(Number)
        .find((df) => degreesOfFreedom <= df);
    return table[bucket ?? 120];
}
function getTwoTailedZCritical(confidenceLevelPercent) {
    const normalizedLevel = normalizeSupportedConfidenceLevel(confidenceLevelPercent);
    return TWO_TAILED_Z_CRITICALS[normalizedLevel] ?? 1.96;
}
export function computeConfidenceInterval({ sampleMean, sampleStandardDeviation, sampleSize, confidenceLevelPercent, populationStandardDeviation, }) {
    const usesPopulationStandardDeviation = typeof populationStandardDeviation === "number" &&
        Number.isFinite(populationStandardDeviation) &&
        populationStandardDeviation >= 0;
    const degreesOfFreedom = Math.max(1, Math.round(sampleSize) - 1);
    const confidenceLevelUsed = normalizeSupportedConfidenceLevel(confidenceLevelPercent);
    const criticalValue = usesPopulationStandardDeviation
        ? getTwoTailedZCritical(confidenceLevelPercent)
        : getTwoTailedTCritical(confidenceLevelPercent, degreesOfFreedom);
    const standardDeviationUsed = usesPopulationStandardDeviation
        ? populationStandardDeviation
        : sampleStandardDeviation;
    const standardError = safeDivide(standardDeviationUsed, Math.sqrt(sampleSize));
    const marginOfError = safeMultiply(criticalValue, standardError);
    return {
        zCritical: usesPopulationStandardDeviation ? criticalValue : getTwoTailedZCritical(confidenceLevelPercent),
        tCritical: usesPopulationStandardDeviation ? null : criticalValue,
        criticalValue,
        criticalMethod: usesPopulationStandardDeviation ? "z" : "t",
        confidenceLevelUsed,
        degreesOfFreedom,
        standardDeviationUsed,
        standardError,
        marginOfError,
        lowerBound: safeSubtract(sampleMean, marginOfError),
        upperBound: safeAdd(sampleMean, marginOfError),
    };
}
export function computeProvisionExpectedValue(scenarios) {
    const totalProbabilityPercent = scenarios.reduce((sum, scenario) => sum + scenario.probabilityPercent, 0);
    const expectedValue = scenarios.reduce((sum, scenario) => safeAdd(sum, safeMultiply(scenario.amount, percentToDecimal(scenario.probabilityPercent))), 0);
    return {
        totalProbabilityPercent,
        expectedValue,
        rows: scenarios.map((scenario) => ({
            ...scenario,
            weightedAmount: safeMultiply(scenario.amount, percentToDecimal(scenario.probabilityPercent)),
        })),
    };
}
export function computeDupontAnalysis({ netIncome, netSales, averageAssets, averageEquity, }) {
    const profitMargin = safeDivide(netIncome, netSales);
    const assetTurnover = safeDivide(netSales, averageAssets);
    const equityMultiplier = safeDivide(averageAssets, averageEquity);
    const returnOnAssets = safeDivide(netIncome, averageAssets);
    const returnOnEquity = safeDivide(netIncome, averageEquity);
    return {
        profitMargin,
        assetTurnover,
        equityMultiplier,
        returnOnAssets,
        returnOnEquity,
        dupontReturnOnEquity: safeMultiply(safeMultiply(profitMargin, assetTurnover), equityMultiplier),
    };
}
export function computeEarningsQuality({ netIncome, operatingCashFlow, averageTotalAssets, }) {
    const totalAccruals = safeSubtract(netIncome, operatingCashFlow);
    const accrualRatio = safeDivide(totalAccruals, averageTotalAssets);
    const cashConversionRatio = netIncome === 0 ? 0 : safeDivide(operatingCashFlow, netIncome);
    return {
        totalAccruals,
        accrualRatio,
        cashConversionRatio,
        qualitySignal: operatingCashFlow >= netIncome
            ? "Cash flow supports or exceeds reported earnings."
            : "Reported earnings exceed operating cash flow; review accrual quality and working-capital movements.",
    };
}
export function computeRetailMarkupMarkdown({ unitCost, initialRetailPrice, markdownPercent, unitsSold, }) {
    const markdownDecimal = percentToDecimal(markdownPercent);
    const markdownAmount = safeMultiply(initialRetailPrice, markdownDecimal);
    const finalRetailPrice = safeSubtract(initialRetailPrice, markdownAmount);
    const markupOnCostPercent = unitCost === 0 ? 0 : safeMultiply(safeDivide(safeSubtract(initialRetailPrice, unitCost), unitCost), 100);
    const maintainedMarginPercent = finalRetailPrice === 0
        ? 0
        : safeMultiply(safeDivide(safeSubtract(finalRetailPrice, unitCost), finalRetailPrice), 100);
    const grossProfit = safeMultiply(safeSubtract(finalRetailPrice, unitCost), unitsSold);
    return {
        markdownAmount,
        finalRetailPrice,
        markupOnCostPercent,
        maintainedMarginPercent,
        grossProfit,
        salesRevenue: safeMultiply(finalRetailPrice, unitsSold),
    };
}
export function computeFranchiseRevenue({ initialFranchiseFee, satisfiedPerformanceObligationPercent, estimatedUncollectiblePercent, }) {
    const satisfiedRevenue = safeMultiply(initialFranchiseFee, percentToDecimal(satisfiedPerformanceObligationPercent));
    const expectedCollectibleAmount = safeMultiply(initialFranchiseFee, safeSubtract(1, percentToDecimal(estimatedUncollectiblePercent)));
    const revenueRecognized = Math.min(satisfiedRevenue, expectedCollectibleAmount);
    return {
        satisfiedRevenue,
        expectedCollectibleAmount,
        revenueRecognized,
        contractLiability: Math.max(safeSubtract(initialFranchiseFee, revenueRecognized), 0),
    };
}
export function computeCapacityUtilization({ actualUnits, practicalCapacityUnits, }) {
    const utilizationRate = practicalCapacityUnits === 0 ? 0 : (actualUnits / practicalCapacityUnits) * 100;
    const idleCapacityUnits = practicalCapacityUnits - actualUnits;
    const idleCapacityRate = 100 - utilizationRate;
    return {
        utilizationRate,
        idleCapacityUnits,
        idleCapacityRate,
        remainingCapacityUnits: Math.max(practicalCapacityUnits - actualUnits, 0),
        overCapacityUnits: Math.max(actualUnits - practicalCapacityUnits, 0),
        status: actualUnits > practicalCapacityUnits
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
export function computeProductionBudget({ budgetedSalesUnits, desiredEndingFinishedGoodsUnits, beginningFinishedGoodsUnits, }) {
    const requiredProductionUnits = budgetedSalesUnits +
        desiredEndingFinishedGoodsUnits -
        beginningFinishedGoodsUnits;
    return {
        requiredProductionUnits,
        finishedGoodsUnitsAvailable: beginningFinishedGoodsUnits + requiredProductionUnits,
    };
}
export function computeDirectMaterialsPurchasesBudget({ budgetedProductionUnits, materialsPerFinishedUnit, desiredEndingMaterialsUnits, beginningMaterialsUnits, materialCostPerUnit, }) {
    const materialsNeededForProduction = safeMultiply(budgetedProductionUnits, materialsPerFinishedUnit);
    const materialsRequired = safeAdd(materialsNeededForProduction, desiredEndingMaterialsUnits);
    const materialsToPurchaseUnits = safeSubtract(materialsRequired, beginningMaterialsUnits);
    const purchasesCost = safeMultiply(materialsToPurchaseUnits, materialCostPerUnit);
    return {
        materialsNeededForProduction,
        materialsRequired,
        materialsToPurchaseUnits,
        purchasesCost,
    };
}
export function computeInventoryBudget({ budgetedCostOfGoodsSold, desiredEndingInventoryCost, beginningInventoryCost, }) {
    const purchasesRequiredCost = safeSubtract(safeAdd(budgetedCostOfGoodsSold, desiredEndingInventoryCost), beginningInventoryCost);
    return {
        purchasesRequiredCost,
        goodsAvailableForSaleCost: safeAdd(beginningInventoryCost, purchasesRequiredCost),
    };
}
export function computeOperatingExpenseBudget({ budgetedSalesAmount, variableExpenseRatePercent, fixedOperatingExpenses, nonCashOperatingExpenses = 0, }) {
    const variableExpenseRateDecimal = variableExpenseRatePercent / 100;
    const variableOperatingExpenses = safeMultiply(budgetedSalesAmount, variableExpenseRateDecimal);
    const totalOperatingExpenses = safeAdd(variableOperatingExpenses, fixedOperatingExpenses);
    const cashOperatingExpenses = safeSubtract(totalOperatingExpenses, nonCashOperatingExpenses);
    return {
        variableExpenseRateDecimal,
        variableOperatingExpenses,
        totalOperatingExpenses,
        cashOperatingExpenses,
    };
}
export function computeDirectLaborBudget({ budgetedProductionUnits, directLaborHoursPerUnit, directLaborRatePerHour, }) {
    const totalDirectLaborHours = safeMultiply(budgetedProductionUnits, directLaborHoursPerUnit);
    const totalDirectLaborCost = safeMultiply(totalDirectLaborHours, directLaborRatePerHour);
    return {
        totalDirectLaborHours,
        totalDirectLaborCost,
    };
}
export function computeFactoryOverheadBudget({ budgetedProductionUnits, variableOverheadRatePerUnit, fixedOverheadBudget, }) {
    const variableFactoryOverheadBudget = safeMultiply(budgetedProductionUnits, variableOverheadRatePerUnit);
    const totalFactoryOverheadBudget = safeAdd(variableFactoryOverheadBudget, fixedOverheadBudget);
    return {
        variableFactoryOverheadBudget,
        totalFactoryOverheadBudget,
    };
}
export function computeSalesBudget({ budgetedUnitSales, sellingPricePerUnit, }) {
    return {
        budgetedSalesRevenue: safeMultiply(budgetedUnitSales, sellingPricePerUnit),
    };
}
export function computeBudgetedIncomeStatement({ budgetedSalesAmount, budgetedCostOfGoodsSold, totalOperatingExpenses, interestExpense = 0, incomeTaxRatePercent = 0, }) {
    const grossProfit = safeSubtract(budgetedSalesAmount, budgetedCostOfGoodsSold);
    const incomeBeforeTax = safeSubtract(safeSubtract(grossProfit, totalOperatingExpenses), interestExpense);
    const incomeTaxRateDecimal = incomeTaxRatePercent / 100;
    const incomeTaxExpense = incomeBeforeTax > 0
        ? safeMultiply(incomeBeforeTax, incomeTaxRateDecimal)
        : 0;
    const netIncome = safeSubtract(incomeBeforeTax, incomeTaxExpense);
    return {
        grossProfit,
        incomeBeforeTax,
        incomeTaxRateDecimal,
        incomeTaxExpense,
        netIncome,
    };
}
export function computeSpecialOrderDecision({ specialOrderUnits, specialOrderPricePerUnit, variableCostPerUnit, incrementalFixedCosts = 0, }) {
    const incrementalRevenue = safeMultiply(specialOrderUnits, specialOrderPricePerUnit);
    const incrementalVariableCosts = safeMultiply(specialOrderUnits, variableCostPerUnit);
    const incrementalCosts = safeAdd(incrementalVariableCosts, incrementalFixedCosts);
    const incrementalProfit = safeSubtract(incrementalRevenue, incrementalCosts);
    const minimumAcceptablePricePerUnit = specialOrderUnits <= 0
        ? Number.NaN
        : safeDivide(incrementalCosts, specialOrderUnits);
    return {
        incrementalRevenue,
        incrementalVariableCosts,
        incrementalCosts,
        incrementalProfit,
        minimumAcceptablePricePerUnit,
        recommendation: incrementalProfit > 0
            ? "Accepting the special order improves operating income under these assumptions."
            : incrementalProfit < 0
                ? "Rejecting the special order is safer because the order lowers operating income under these assumptions."
                : "The order is financially indifferent before qualitative factors are considered.",
    };
}
export function computeMakeOrBuyDecision({ unitsNeeded, variableManufacturingCostPerUnit, avoidableFixedCosts = 0, purchasePricePerUnit, }) {
    const relevantMakeCost = safeAdd(safeMultiply(unitsNeeded, variableManufacturingCostPerUnit), avoidableFixedCosts);
    const relevantBuyCost = safeMultiply(unitsNeeded, purchasePricePerUnit);
    const costAdvantageAmount = safeSubtract(relevantBuyCost, relevantMakeCost);
    const maximumAcceptablePurchasePricePerUnit = unitsNeeded <= 0
        ? Number.NaN
        : safeDivide(relevantMakeCost, unitsNeeded);
    return {
        relevantMakeCost,
        relevantBuyCost,
        costAdvantageAmount,
        maximumAcceptablePurchasePricePerUnit,
        preferredOption: costAdvantageAmount > 0
            ? "Make"
            : costAdvantageAmount < 0
                ? "Buy"
                : "Indifferent",
    };
}
export function computeSellProcessFurther({ units, salesValueAtSplitoffPerUnit, salesValueAfterProcessingPerUnit, separableProcessingCostPerUnit, }) {
    const incrementalRevenueFromProcessing = safeMultiply(units, safeSubtract(salesValueAfterProcessingPerUnit, salesValueAtSplitoffPerUnit));
    const separableProcessingCosts = safeMultiply(units, separableProcessingCostPerUnit);
    const incrementalProfitFromProcessing = safeSubtract(incrementalRevenueFromProcessing, separableProcessingCosts);
    const minimumFurtherProcessingPricePerUnit = safeAdd(salesValueAtSplitoffPerUnit, separableProcessingCostPerUnit);
    return {
        incrementalRevenueFromProcessing,
        separableProcessingCosts,
        incrementalProfitFromProcessing,
        minimumFurtherProcessingPricePerUnit,
        recommendation: incrementalProfitFromProcessing > 0
            ? "Processing further adds incremental profit under the entered assumptions."
            : incrementalProfitFromProcessing < 0
                ? "Selling at split-off is financially better because further processing destroys value under these assumptions."
                : "Both choices are financially indifferent before qualitative factors are considered.",
    };
}
export function computeConstrainedResourceProductMix({ sellingPricePerUnit, variableCostPerUnit, constrainedResourceUnitsPerProduct, constrainedResourceAvailableUnits, }) {
    const contributionMarginPerUnit = safeSubtract(sellingPricePerUnit, variableCostPerUnit);
    const contributionMarginPerConstraintUnit = constrainedResourceUnitsPerProduct <= 0
        ? Number.NaN
        : safeDivide(contributionMarginPerUnit, constrainedResourceUnitsPerProduct);
    const maximumUnitsFromConstraint = constrainedResourceUnitsPerProduct <= 0
        ? Number.NaN
        : safeDivide(constrainedResourceAvailableUnits, constrainedResourceUnitsPerProduct);
    const totalContributionMarginAtConstraint = Number.isFinite(maximumUnitsFromConstraint)
        ? safeMultiply(contributionMarginPerUnit, maximumUnitsFromConstraint)
        : Number.NaN;
    return {
        contributionMarginPerUnit,
        contributionMarginPerConstraintUnit,
        maximumUnitsFromConstraint,
        totalContributionMarginAtConstraint,
    };
}
export function computeBudgetVarianceAnalysis({ actualResultAmount, flexibleBudgetAmount, staticBudgetAmount, }) {
    const spendingVariance = safeSubtract(actualResultAmount, flexibleBudgetAmount);
    const activityVariance = safeSubtract(flexibleBudgetAmount, staticBudgetAmount);
    const totalBudgetVariance = safeSubtract(actualResultAmount, staticBudgetAmount);
    return {
        spendingVariance,
        activityVariance,
        totalBudgetVariance,
        spendingVarianceLabel: spendingVariance > 0
            ? "Unfavorable"
            : spendingVariance < 0
                ? "Favorable"
                : "On target",
        activityVarianceLabel: activityVariance > 0
            ? "Above static plan"
            : activityVariance < 0
                ? "Below static plan"
                : "On static plan",
    };
}
export function computeMovingAverageForecast({ period1Demand, period2Demand, period3Demand, weight1Percent, weight2Percent, weight3Percent, }) {
    const simpleMovingAverageForecast = safeDivide(safeAdd(safeAdd(period1Demand, period2Demand), period3Demand), 3);
    const totalWeightPercent = safeAdd(safeAdd(weight1Percent, weight2Percent), weight3Percent);
    const weightedMovingAverageForecast = totalWeightPercent === 0
        ? Number.NaN
        : safeDivide(safeAdd(safeAdd(safeMultiply(period1Demand, weight1Percent), safeMultiply(period2Demand, weight2Percent)), safeMultiply(period3Demand, weight3Percent)), totalWeightPercent);
    return {
        simpleMovingAverageForecast,
        weightedMovingAverageForecast,
        totalWeightPercent,
        latestTrendChange: safeSubtract(period3Demand, period2Demand),
    };
}
export function computeSalesVolumeVariance({ actualUnitsSold, budgetedUnitsSold, budgetedContributionMarginPerUnit, }) {
    const unitDifference = safeSubtract(actualUnitsSold, budgetedUnitsSold);
    const salesVolumeVariance = safeMultiply(unitDifference, budgetedContributionMarginPerUnit);
    return {
        unitDifference,
        salesVolumeVariance,
        salesVolumeVarianceLabel: salesVolumeVariance > 0
            ? "Favorable"
            : salesVolumeVariance < 0
                ? "Unfavorable"
                : "On target",
    };
}
export function computeSalesMixVariance({ actualTotalUnitsSold, actualProductUnitsSold, budgetedMixPercent, budgetedContributionMarginPerUnit, }) {
    const actualMixPercent = actualTotalUnitsSold <= 0
        ? Number.NaN
        : safeMultiply(safeDivide(actualProductUnitsSold, actualTotalUnitsSold), 100);
    const mixPercentagePointDifference = safeSubtract(actualMixPercent, budgetedMixPercent);
    const equivalentUnitDifference = safeMultiply(actualTotalUnitsSold, percentToDecimal(mixPercentagePointDifference));
    const salesMixVariance = safeMultiply(equivalentUnitDifference, budgetedContributionMarginPerUnit);
    return {
        actualMixPercent,
        mixPercentagePointDifference,
        equivalentUnitDifference,
        salesMixVariance,
        salesMixVarianceLabel: salesMixVariance > 0
            ? "Favorable"
            : salesMixVariance < 0
                ? "Unfavorable"
                : "On target",
    };
}
export function computeTransferPricingSupport({ variableCostPerUnit, opportunityCostPerUnit = 0, externalMarketPricePerUnit = 0, }) {
    const minimumTransferPrice = safeAdd(variableCostPerUnit, opportunityCostPerUnit);
    const marketBasedCeiling = externalMarketPricePerUnit > 0
        ? externalMarketPricePerUnit
        : minimumTransferPrice;
    return {
        minimumTransferPrice,
        marketBasedCeiling,
        opportunityCostPerUnit,
        transferPricingRangeWidth: safeSubtract(marketBasedCeiling, minimumTransferPrice),
    };
}
export function computeSafetyStockPlanner({ averageDailyUsage, maxDailyUsage, averageLeadTimeDays, maxLeadTimeDays, }) {
    const maximumUsageDuringLeadTime = safeMultiply(maxDailyUsage, maxLeadTimeDays);
    const averageUsageDuringLeadTime = safeMultiply(averageDailyUsage, averageLeadTimeDays);
    const safetyStock = safeSubtract(maximumUsageDuringLeadTime, averageUsageDuringLeadTime);
    const reorderPoint = safeAdd(averageUsageDuringLeadTime, safetyStock);
    return {
        maximumUsageDuringLeadTime,
        averageUsageDuringLeadTime,
        safetyStock,
        reorderPoint,
    };
}
export function computeEstateTax({ grossEstate, allowableDeductions = 0, taxRatePercent = 6, }) {
    const netEstate = Math.max(0, safeSubtract(grossEstate, allowableDeductions));
    const estateTaxDue = safeMultiply(netEstate, percentToDecimal(taxRatePercent));
    return {
        netEstate,
        estateTaxDue,
        taxRatePercent,
    };
}
export function computeDonorsTax({ grossGift, allowableDeductions = 0, taxRatePercent = 6, }) {
    const taxableGift = Math.max(0, safeSubtract(grossGift, allowableDeductions));
    const donorsTaxDue = safeMultiply(taxableGift, percentToDecimal(taxRatePercent));
    return {
        taxableGift,
        donorsTaxDue,
        taxRatePercent,
    };
}
export function computeDocumentaryStampTax({ taxableBaseAmount, taxableUnitSize, ratePerUnit, }) {
    const taxableUnits = taxableBaseAmount <= 0 || taxableUnitSize <= 0
        ? Number.NaN
        : Math.ceil(safeDivide(taxableBaseAmount, taxableUnitSize));
    const documentaryStampTaxDue = Number.isFinite(taxableUnits)
        ? safeMultiply(taxableUnits, ratePerUnit)
        : Number.NaN;
    return {
        taxableUnits,
        documentaryStampTaxDue,
    };
}
export function computeConsignmentSettlement({ grossSales, commissionRatePercent, freightAndOtherExpenses = 0, advancesRemitted = 0, }) {
    const commissionAmount = safeMultiply(grossSales, percentToDecimal(commissionRatePercent));
    const totalCharges = safeAdd(commissionAmount, freightAndOtherExpenses);
    const cashStillDueToConsignor = safeSubtract(safeSubtract(grossSales, totalCharges), advancesRemitted);
    return {
        commissionAmount,
        totalCharges,
        cashStillDueToConsignor,
    };
}
export function computeBranchInventoryLoading({ billedPriceInventory, loadingPercentOnCost, }) {
    const loadingRateOnBilledPrice = loadingPercentOnCost <= -100
        ? Number.NaN
        : safeMultiply(safeDivide(loadingPercentOnCost, safeAdd(100, loadingPercentOnCost)), 100);
    const inventoryLoadingAllowance = safeMultiply(billedPriceInventory, percentToDecimal(loadingRateOnBilledPrice));
    const inventoryAtCost = safeSubtract(billedPriceInventory, inventoryLoadingAllowance);
    return {
        loadingRateOnBilledPrice,
        inventoryLoadingAllowance,
        inventoryAtCost,
    };
}
export function computeDividendAllocation({ totalDividendsDeclared, preferredShares, preferredParValue, preferredDividendRatePercent, yearsInArrears = 0, commonSharesOutstanding = 0, }) {
    const annualPreferredDividend = safeMultiply(safeMultiply(preferredShares, preferredParValue), percentToDecimal(preferredDividendRatePercent));
    const preferredArrearsDividend = safeMultiply(annualPreferredDividend, yearsInArrears);
    const totalPreferredRequirement = safeAdd(preferredArrearsDividend, annualPreferredDividend);
    const preferredDividendAllocated = Math.min(totalDividendsDeclared, totalPreferredRequirement);
    const commonDividendAllocated = Math.max(0, safeSubtract(totalDividendsDeclared, preferredDividendAllocated));
    const commonDividendPerShare = commonSharesOutstanding > 0
        ? safeDivide(commonDividendAllocated, commonSharesOutstanding)
        : Number.NaN;
    return {
        annualPreferredDividend,
        preferredArrearsDividend,
        totalPreferredRequirement,
        preferredDividendAllocated,
        commonDividendAllocated,
        commonDividendPerShare,
        unpaidPreferredBalance: safeSubtract(totalPreferredRequirement, preferredDividendAllocated),
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
export function computePriceElasticity({ initialPrice, finalPrice, initialQuantity, finalQuantity, }) {
    const priceMidpoint = (initialPrice + finalPrice) / 2;
    const quantityMidpoint = (initialQuantity + finalQuantity) / 2;
    const priceChangePercent = safeMultiply(safeDivide(safeSubtract(finalPrice, initialPrice), priceMidpoint), 100);
    const quantityChangePercent = safeMultiply(safeDivide(safeSubtract(finalQuantity, initialQuantity), quantityMidpoint), 100);
    const elasticity = safeDivide(quantityChangePercent, priceChangePercent);
    const absElasticity = Math.abs(elasticity);
    return {
        priceChangePercent,
        quantityChangePercent,
        elasticity,
        absElasticity,
        classification: absElasticity > 1
            ? "Elastic"
            : absElasticity < 1
                ? "Inelastic"
                : "Unit elastic",
        initialRevenue: safeMultiply(initialPrice, initialQuantity),
        finalRevenue: safeMultiply(finalPrice, finalQuantity),
    };
}
export function computeMarketEquilibrium({ demandIntercept, demandSlope, supplyIntercept, supplySlope, }) {
    const denominator = safeAdd(demandSlope, supplySlope);
    const equilibriumQuantity = safeDivide(safeSubtract(demandIntercept, supplyIntercept), denominator);
    const equilibriumPrice = safeSubtract(demandIntercept, safeMultiply(demandSlope, equilibriumQuantity));
    return {
        equilibriumQuantity: roundTo(equilibriumQuantity, 8),
        equilibriumPrice: roundTo(equilibriumPrice, 8),
        demandAtZeroPrice: safeDivide(demandIntercept, demandSlope),
        supplyAtZeroPrice: sanitizeNumberOutput(safeDivide(-supplyIntercept, supplySlope)),
        isFeasible: Number.isFinite(equilibriumQuantity) &&
            Number.isFinite(equilibriumPrice) &&
            equilibriumQuantity >= 0 &&
            equilibriumPrice >= 0,
    };
}
export function computeSurplusAtEquilibrium({ demandIntercept, supplyIntercept, equilibriumPrice, equilibriumQuantity, }) {
    const consumerSurplus = 0.5 * Math.max(demandIntercept - equilibriumPrice, 0) * equilibriumQuantity;
    const producerSurplus = 0.5 * Math.max(equilibriumPrice - supplyIntercept, 0) * equilibriumQuantity;
    return {
        consumerSurplus,
        producerSurplus,
        totalSurplus: consumerSurplus + producerSurplus,
    };
}
export function computeRealInterestRate(nominalRatePercent, inflationRatePercent) {
    const nominalDecimal = percentToDecimal(nominalRatePercent);
    const inflationDecimal = percentToDecimal(inflationRatePercent);
    const exactRealRate = safeMultiply(safeSubtract(safeDivide(safeAdd(1, nominalDecimal), safeAdd(1, inflationDecimal)), 1), 100);
    const approximateRealRate = safeSubtract(nominalRatePercent, inflationRatePercent);
    return {
        exactRealRate,
        approximateRealRate,
    };
}
export function computeStartupCostPlan(items, contingencyPercent, openingCashBuffer) {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const contingencyAmount = subtotal * (contingencyPercent / 100);
    const recommendedFunding = subtotal + contingencyAmount + openingCashBuffer;
    const largestItem = items.reduce((largest, item) => (!largest || item.amount > largest.amount ? item : largest), null) ?? { label: "None", amount: 0 };
    return {
        subtotal,
        contingencyAmount,
        openingCashBuffer,
        recommendedFunding,
        largestItem,
    };
}
export function computeUnitEconomics({ sellingPrice, variableCostPerUnit, fixedCosts, acquisitionCostPerCustomer, unitsPerCustomer, }) {
    const contributionPerUnit = sellingPrice - variableCostPerUnit;
    const grossMarginPercent = sellingPrice === 0 ? 0 : (contributionPerUnit / sellingPrice) * 100;
    const contributionPerCustomer = contributionPerUnit * unitsPerCustomer;
    const contributionAfterAcquisition = contributionPerCustomer - acquisitionCostPerCustomer;
    const breakEvenUnits = contributionPerUnit <= 0 ? Infinity : fixedCosts / contributionPerUnit;
    const breakEvenCustomers = contributionAfterAcquisition <= 0
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
export function computeSalesForecast({ startingSales, monthlyGrowthPercent, months, grossMarginPercent = 0, }) {
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
export function computeCashRunway({ openingCash, averageMonthlyInflows, averageMonthlyOutflows, plannedGrowthPercent = 0, }) {
    const adjustedInflows = averageMonthlyInflows * (1 + plannedGrowthPercent / 100);
    const monthlyNetCashFlow = adjustedInflows - averageMonthlyOutflows;
    const monthlyBurn = averageMonthlyOutflows - adjustedInflows;
    const runwayMonths = monthlyBurn <= 0 ? Infinity : openingCash / monthlyBurn;
    return {
        adjustedInflows,
        monthlyNetCashFlow,
        monthlyBurn,
        runwayMonths,
        status: monthlyBurn <= 0
            ? "Positive or break-even cash flow"
            : runwayMonths < 6
                ? "Short runway"
                : runwayMonths < 12
                    ? "Moderate runway"
                    : "Comfortable runway",
    };
}
export function computeInventoryShrinkage({ bookUnits, physicalUnits, costPerUnit, }) {
    const shrinkageUnits = Math.max(bookUnits - physicalUnits, 0);
    const shrinkageAmount = shrinkageUnits * costPerUnit;
    const shrinkageRate = bookUnits === 0 ? 0 : (shrinkageUnits / bookUnits) * 100;
    return {
        shrinkageUnits,
        shrinkageAmount,
        shrinkageRate,
    };
}
export function computeJobOrderCostSheet({ directMaterialsUsed, directLabor, appliedManufacturingOverhead, unitsInJob, }) {
    const primeCost = directMaterialsUsed + directLabor;
    const conversionCost = directLabor + appliedManufacturingOverhead;
    const totalJobCost = directMaterialsUsed + directLabor + appliedManufacturingOverhead;
    const unitCost = unitsInJob <= 0 ? Infinity : totalJobCost / unitsInJob;
    const materialsShare = totalJobCost === 0 ? 0 : (directMaterialsUsed / totalJobCost) * 100;
    const laborShare = totalJobCost === 0 ? 0 : (directLabor / totalJobCost) * 100;
    const overheadShare = totalJobCost === 0 ? 0 : (appliedManufacturingOverhead / totalJobCost) * 100;
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
export function computePrepaidExpenseAdjustment({ beginningPrepaid, endingPrepaid, }) {
    const expenseRecognized = beginningPrepaid - endingPrepaid;
    return {
        expenseRecognized,
        adjustmentDirection: expenseRecognized >= 0 ? "debit-expense-credit-prepaid" : "reverse-balance",
    };
}
export function computeUnearnedRevenueAdjustment({ beginningUnearnedRevenue, endingUnearnedRevenue, }) {
    const revenueRecognized = beginningUnearnedRevenue - endingUnearnedRevenue;
    return {
        revenueRecognized,
        adjustmentDirection: revenueRecognized >= 0 ? "debit-unearned-credit-revenue" : "reverse-balance",
    };
}
export function computeAccruedRevenueAdjustment({ revenueEarned, cashCollected, }) {
    const accruedRevenue = revenueEarned - cashCollected;
    return {
        accruedRevenue,
        adjustmentDirection: accruedRevenue >= 0 ? "debit-receivable-credit-revenue" : "reverse-balance",
    };
}
export function computeAccruedExpenseAdjustment({ expenseIncurred, cashPaid, }) {
    const accruedExpense = expenseIncurred - cashPaid;
    return {
        accruedExpense,
        adjustmentDirection: accruedExpense >= 0 ? "debit-expense-credit-payable" : "reverse-balance",
    };
}
export function computePricingPlanner({ unitCost, targetMarginPercent, targetMonthlyIncome, contributionPerUnit, }) {
    const targetMarginDecimal = targetMarginPercent / 100;
    const suggestedSellingPrice = targetMarginDecimal >= 1 ? Infinity : unitCost / (1 - targetMarginDecimal);
    const unitsNeededForTargetIncome = contributionPerUnit <= 0 ? Infinity : targetMonthlyIncome / contributionPerUnit;
    return {
        suggestedSellingPrice,
        markUpPercent: unitCost === 0 ? 0 : ((suggestedSellingPrice - unitCost) / unitCost) * 100,
        unitsNeededForTargetIncome,
    };
}
export function computeBorrowingCostsCapitalization({ averageAccumulatedExpenditures, capitalizationRatePercent, capitalizationMonths, }) {
    const capitalizationFraction = safeDivide(capitalizationMonths, 12);
    const annualAvoidableInterest = safeMultiply(averageAccumulatedExpenditures, percentToDecimal(capitalizationRatePercent));
    const capitalizableBorrowingCost = safeMultiply(annualAvoidableInterest, capitalizationFraction);
    return {
        capitalizationFraction,
        annualAvoidableInterest,
        capitalizableBorrowingCost,
    };
}
export function computeOwnerSplit({ distributableProfit, ratioA, ratioB, ratioC = 0, }) {
    const totalRatio = ratioA + ratioB + ratioC;
    return {
        totalRatio,
        shareA: distributableProfit * (ratioA / totalRatio),
        shareB: distributableProfit * (ratioB / totalRatio),
        shareC: distributableProfit * (ratioC / totalRatio),
    };
}
export function computeCustomerPayback({ acquisitionCost, monthlyContributionPerCustomer, }) {
    const paybackMonths = monthlyContributionPerCustomer <= 0
        ? Infinity
        : acquisitionCost / monthlyContributionPerCustomer;
    return {
        paybackMonths,
        status: paybackMonths === Infinity
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
export function computeElasticityShift({ initialDriver, finalDriver, initialQuantity, finalQuantity, }) {
    const driverMidpoint = (initialDriver + finalDriver) / 2;
    const quantityMidpoint = (initialQuantity + finalQuantity) / 2;
    const driverChangePercent = driverMidpoint === 0 ? 0 : (finalDriver - initialDriver) / driverMidpoint;
    const quantityChangePercent = quantityMidpoint === 0 ? 0 : (finalQuantity - initialQuantity) / quantityMidpoint;
    return {
        elasticity: driverChangePercent === 0 ? 0 : quantityChangePercent / driverChangePercent,
        driverChangePercent,
        quantityChangePercent,
    };
}
export function computeHighLowCostEstimation({ highActivityUnits, highTotalCost, lowActivityUnits, lowTotalCost, expectedActivityUnits, }) {
    const activitySpread = safeSubtract(highActivityUnits, lowActivityUnits);
    const variableCostPerUnit = activitySpread === 0
        ? 0
        : safeDivide(safeSubtract(highTotalCost, lowTotalCost), activitySpread);
    const fixedCostEstimate = safeSubtract(highTotalCost, safeMultiply(variableCostPerUnit, highActivityUnits));
    const costFormula = `Y = ${roundTo(fixedCostEstimate, 2)} + ${roundTo(variableCostPerUnit, 4)}X`;
    const estimatedTotalCost = expectedActivityUnits === undefined
        ? null
        : safeAdd(fixedCostEstimate, safeMultiply(variableCostPerUnit, expectedActivityUnits));
    return {
        activitySpread,
        variableCostPerUnit,
        fixedCostEstimate,
        estimatedTotalCost,
        costFormula,
    };
}
export function computeRoiRiEva({ operatingIncome, investedCapital, targetRatePercent, sales = 0, }) {
    const targetRateDecimal = percentToDecimal(targetRatePercent);
    const roi = safeMultiply(safeDivide(operatingIncome, investedCapital), 100);
    const capitalCharge = safeMultiply(investedCapital, targetRateDecimal);
    const residualIncome = safeSubtract(operatingIncome, capitalCharge);
    const eva = residualIncome;
    const profitMargin = sales === 0 ? 0 : safeMultiply(safeDivide(operatingIncome, sales), 100);
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
export function computeEconomicOrderQuantity({ annualDemandUnits, orderingCostPerOrder, annualCarryingCostPerUnit, dailyDemandUnits, leadTimeDays, safetyStockUnits = 0, }) {
    const eoq = annualCarryingCostPerUnit <= 0
        ? 0
        : Math.sqrt(safeDivide(safeMultiply(safeMultiply(2, annualDemandUnits), orderingCostPerOrder), annualCarryingCostPerUnit));
    const ordersPerYear = eoq <= 0 ? 0 : safeDivide(annualDemandUnits, eoq);
    const averageInventoryUnits = safeAdd(safeDivide(eoq, 2), safetyStockUnits);
    const annualOrderingCost = safeMultiply(ordersPerYear, orderingCostPerOrder);
    const annualCarryingCost = safeMultiply(averageInventoryUnits, annualCarryingCostPerUnit);
    const reorderPointUnits = safeAdd(safeMultiply(dailyDemandUnits, leadTimeDays), safetyStockUnits);
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
export function computeAuditPlanning({ benchmarkAmount, materialityPercent, performanceMaterialityPercent, inherentRiskPercent, controlRiskPercent, }) {
    const planningMateriality = safeMultiply(benchmarkAmount, percentToDecimal(materialityPercent));
    const performanceMateriality = safeMultiply(planningMateriality, percentToDecimal(performanceMaterialityPercent));
    const inherentRiskDecimal = percentToDecimal(inherentRiskPercent);
    const controlRiskDecimal = percentToDecimal(controlRiskPercent);
    const riskOfMaterialMisstatement = safeMultiply(inherentRiskDecimal, controlRiskDecimal);
    const plannedDetectionRisk = riskOfMaterialMisstatement === 0
        ? 0
        : safeDivide(0.05, riskOfMaterialMisstatement);
    return {
        planningMateriality,
        performanceMateriality,
        inherentRiskDecimal,
        controlRiskDecimal,
        riskOfMaterialMisstatement,
        plannedDetectionRisk,
        auditFocus: plannedDetectionRisk <= 0.3
            ? "More substantive work is likely needed."
            : plannedDetectionRisk <= 0.6
                ? "Balanced control and substantive testing may be appropriate."
                : "Control reliance may support a lighter substantive response if evidence holds.",
    };
}
export function computeBookTaxDifference({ accountingIncomeBeforeTax, permanentDifferences, temporaryDifferences, taxRatePercent, }) {
    const taxableIncome = safeAdd(safeAdd(accountingIncomeBeforeTax, permanentDifferences), temporaryDifferences);
    const currentTaxExpense = safeMultiply(taxableIncome, percentToDecimal(taxRatePercent));
    const deferredTaxEffect = safeMultiply(temporaryDifferences, percentToDecimal(taxRatePercent));
    const effectiveTaxRate = accountingIncomeBeforeTax === 0
        ? 0
        : safeMultiply(safeDivide(currentTaxExpense, accountingIncomeBeforeTax), 100);
    return {
        taxableIncome,
        currentTaxExpense,
        deferredTaxEffect,
        effectiveTaxRate,
    };
}
export function computeBusinessCombination({ considerationTransferred, netIdentifiableAssetsFairValue, ownershipPercent, nonControllingInterestMeasurement, nonControllingInterestFairValue = 0, }) {
    const ownershipDecimal = percentToDecimal(ownershipPercent);
    const nonControllingInterest = nonControllingInterestMeasurement === "fair-value"
        ? nonControllingInterestFairValue
        : safeMultiply(netIdentifiableAssetsFairValue, safeSubtract(1, ownershipDecimal));
    const impliedAcquireeFairValue = safeAdd(considerationTransferred, nonControllingInterest);
    const goodwill = safeSubtract(impliedAcquireeFairValue, netIdentifiableAssetsFairValue);
    return {
        ownershipDecimal,
        nonControllingInterest,
        impliedAcquireeFairValue,
        goodwill,
        resultLabel: goodwill >= 0 ? "Goodwill recognized" : "Bargain purchase gain indicated",
    };
}
export function computeLeaseMeasurement({ periodicLeasePayment, numberOfPeriods, periodicDiscountRatePercent, guaranteedResidualValue = 0, bargainPurchaseOption = 0, initialDirectCosts = 0, leaseIncentivesReceived = 0, }) {
    const discountRateDecimal = percentToDecimal(periodicDiscountRatePercent);
    const annuityFactor = discountRateDecimal === 0
        ? numberOfPeriods
        : safeDivide(safeSubtract(1, Math.pow(1 + discountRateDecimal, -numberOfPeriods)), discountRateDecimal);
    const presentValueOfLeasePayments = safeMultiply(periodicLeasePayment, annuityFactor);
    const residualAndOptionAmount = safeAdd(guaranteedResidualValue, bargainPurchaseOption);
    const discountedResidualAndOption = residualAndOptionAmount === 0
        ? 0
        : safeDivide(residualAndOptionAmount, Math.pow(1 + discountRateDecimal, numberOfPeriods));
    const initialLeaseLiability = safeAdd(presentValueOfLeasePayments, discountedResidualAndOption);
    const initialRightOfUseAsset = safeAdd(safeAdd(initialLeaseLiability, initialDirectCosts), -leaseIncentivesReceived);
    const totalUndiscountedPayments = safeAdd(safeMultiply(periodicLeasePayment, numberOfPeriods), residualAndOptionAmount);
    return {
        discountRateDecimal,
        annuityFactor,
        presentValueOfLeasePayments,
        discountedResidualAndOption,
        initialLeaseLiability,
        initialRightOfUseAsset,
        totalUndiscountedPayments,
        totalFinanceCharge: safeSubtract(totalUndiscountedPayments, initialLeaseLiability),
    };
}
export function computeShareBasedPayment({ grantDateFairValuePerOption, optionsGranted, estimatedForfeitureRatePercent, vestingYears, serviceYearsRendered, }) {
    const expectedVestPercent = safeSubtract(1, percentToDecimal(estimatedForfeitureRatePercent));
    const expectedOptionsToVest = safeMultiply(optionsGranted, expectedVestPercent);
    const totalCompensationCost = safeMultiply(expectedOptionsToVest, grantDateFairValuePerOption);
    const recognizedYears = Math.min(Math.max(serviceYearsRendered, 0), vestingYears);
    const cumulativeCompensationCost = vestingYears <= 0
        ? totalCompensationCost
        : safeMultiply(totalCompensationCost, safeDivide(recognizedYears, vestingYears));
    const currentPeriodExpense = vestingYears <= 0
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
export function computeStatementOfCashFlows({ netIncome, depreciationExpense, impairmentLoss = 0, gainOnAssetSale = 0, accountsReceivableIncrease = 0, inventoryIncrease = 0, accountsPayableIncrease = 0, capitalExpenditures = 0, assetSaleProceeds = 0, debtProceeds = 0, debtRepayments = 0, shareIssuanceProceeds = 0, dividendsPaid = 0, openingCashBalance = 0, }) {
    const operatingCashFlow = safeAdd(safeAdd(safeAdd(netIncome, depreciationExpense), impairmentLoss), safeAdd(safeAdd(-gainOnAssetSale, -accountsReceivableIncrease), safeAdd(-inventoryIncrease, accountsPayableIncrease)));
    const investingCashFlow = safeAdd(-capitalExpenditures, assetSaleProceeds);
    const financingCashFlow = safeAdd(safeAdd(debtProceeds, shareIssuanceProceeds), safeAdd(-debtRepayments, -dividendsPaid));
    const netChangeInCash = safeAdd(safeAdd(operatingCashFlow, investingCashFlow), financingCashFlow);
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
export function computeStatementOfChangesInEquity({ beginningShareCapital, beginningAdditionalPaidInCapital, beginningRetainedEarnings, beginningAccumulatedOci, beginningTreasuryShares, shareIssuances = 0, additionalPaidInCapitalChanges = 0, netIncome = 0, dividendsDeclared = 0, priorPeriodAdjustments = 0, otherComprehensiveIncome = 0, treasuryShareRepurchases = 0, treasuryShareReissuances = 0, }) {
    const endingShareCapital = safeAdd(beginningShareCapital, shareIssuances);
    const endingAdditionalPaidInCapital = safeAdd(beginningAdditionalPaidInCapital, additionalPaidInCapitalChanges);
    const endingRetainedEarnings = safeAdd(safeAdd(beginningRetainedEarnings, netIncome), safeSubtract(priorPeriodAdjustments, dividendsDeclared));
    const endingAccumulatedOci = safeAdd(beginningAccumulatedOci, otherComprehensiveIncome);
    const endingTreasuryShares = safeAdd(beginningTreasuryShares, safeSubtract(treasuryShareRepurchases, treasuryShareReissuances));
    const totalBeginningEquity = safeSubtract(safeAdd(safeAdd(safeAdd(beginningShareCapital, beginningAdditionalPaidInCapital), beginningRetainedEarnings), beginningAccumulatedOci), beginningTreasuryShares);
    const totalEndingEquity = safeSubtract(safeAdd(safeAdd(safeAdd(endingShareCapital, endingAdditionalPaidInCapital), endingRetainedEarnings), endingAccumulatedOci), endingTreasuryShares);
    return {
        endingShareCapital,
        endingAdditionalPaidInCapital,
        endingRetainedEarnings,
        endingAccumulatedOci,
        endingTreasuryShares,
        totalBeginningEquity,
        totalEndingEquity,
        totalChangeInEquity: safeSubtract(totalEndingEquity, totalBeginningEquity),
    };
}
export function computeForeignCurrencyTranslation({ foreignCurrencyAmount, transactionRate, closingRate, settlementRate, }) {
    const initialRecognitionAmount = safeMultiply(foreignCurrencyAmount, transactionRate);
    const closingCarryingAmount = safeMultiply(foreignCurrencyAmount, closingRate);
    const unrealizedExchangeDifference = safeSubtract(closingCarryingAmount, initialRecognitionAmount);
    const settledAmount = settlementRate === undefined
        ? null
        : safeMultiply(foreignCurrencyAmount, settlementRate);
    const realizedExchangeDifference = settledAmount === null
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
export function computeConstructionRevenue({ contractPrice, costsIncurredToDate, estimatedCostsToComplete, billingsToDate = 0, collectionsToDate = 0, }) {
    const estimatedTotalCost = safeAdd(costsIncurredToDate, estimatedCostsToComplete);
    const percentComplete = estimatedTotalCost === 0
        ? 0
        : safeDivide(costsIncurredToDate, estimatedTotalCost);
    const revenueRecognizedToDate = safeMultiply(contractPrice, percentComplete);
    const grossProfitRecognizedToDate = safeSubtract(revenueRecognizedToDate, costsIncurredToDate);
    const contractAssetLiabilityPosition = safeSubtract(revenueRecognizedToDate, billingsToDate);
    const uncollectedBillings = safeSubtract(billingsToDate, collectionsToDate);
    return {
        estimatedTotalCost,
        percentComplete,
        revenueRecognizedToDate,
        grossProfitRecognizedToDate,
        contractAssetLiabilityPosition,
        uncollectedBillings,
        positionLabel: contractAssetLiabilityPosition >= 0
            ? "Contract asset / due from customer"
            : "Contract liability / due to customer",
    };
}
export function computeRetainedEarningsRollforward({ beginningRetainedEarnings, netIncome, dividendsDeclared, priorPeriodAdjustment = 0, }) {
    const endingRetainedEarnings = beginningRetainedEarnings + netIncome + priorPeriodAdjustment - dividendsDeclared;
    return {
        endingRetainedEarnings,
        netIncomeRetained: netIncome - dividendsDeclared,
    };
}
export function computePercentageTax({ taxableSales, ratePercent, }) {
    const rateDecimal = ratePercent / 100;
    const taxDue = taxableSales * rateDecimal;
    return {
        rateDecimal,
        taxDue,
        totalWithTax: taxableSales + taxDue,
    };
}
export function computeWithholdingTax({ taxBase, ratePercent, }) {
    const rateDecimal = ratePercent / 100;
    const taxWithheld = taxBase * rateDecimal;
    return {
        rateDecimal,
        taxWithheld,
        netAfterWithholding: taxBase - taxWithheld,
    };
}
export function computeVatReconciliation({ taxableSalesAmount, vatablePurchasesAmount, vatRatePercent, }) {
    const vatRateDecimal = vatRatePercent / 100;
    const outputVat = safeMultiply(taxableSalesAmount, vatRateDecimal);
    const inputVat = safeMultiply(vatablePurchasesAmount, vatRateDecimal);
    const netVatPayable = safeSubtract(outputVat, inputVat);
    return {
        vatRateDecimal,
        outputVat,
        inputVat,
        netVatPayable,
        grossSalesInclusiveOfVat: safeAdd(taxableSalesAmount, outputVat),
        grossPurchasesInclusiveOfVat: safeAdd(vatablePurchasesAmount, inputVat),
        remittancePosition: netVatPayable > 0
            ? "payable"
            : netVatPayable < 0
                ? "excess-input-vat"
                : "balanced",
    };
}
export function computeIntercompanyInventoryProfit({ transferPrice, markupRateOnCostPercent, percentUnsoldAtPeriodEnd, }) {
    const markupRateDecimal = markupRateOnCostPercent / 100;
    const percentUnsoldDecimal = percentUnsoldAtPeriodEnd / 100;
    const transferredCost = markupRateDecimal === -1
        ? Number.NaN
        : transferPrice / (1 + markupRateDecimal);
    const intercompanyGrossProfit = safeSubtract(transferPrice, transferredCost);
    const unrealizedProfitInEndingInventory = safeMultiply(intercompanyGrossProfit, percentUnsoldDecimal);
    return {
        markupRateDecimal,
        percentUnsoldDecimal,
        transferredCost,
        intercompanyGrossProfit,
        unrealizedProfitInEndingInventory,
        realizedProfitPortion: safeSubtract(intercompanyGrossProfit, unrealizedProfitInEndingInventory),
    };
}
export function computeNotesReceivableDiscounting({ faceValue, statedRatePercent, bankDiscountRatePercent, timeYears, }) {
    const statedRateDecimal = statedRatePercent / 100;
    const bankDiscountRateDecimal = bankDiscountRatePercent / 100;
    const noteInterest = safeMultiply(safeMultiply(faceValue, statedRateDecimal), timeYears);
    const maturityValue = safeAdd(faceValue, noteInterest);
    const bankDiscountAmount = safeMultiply(safeMultiply(maturityValue, bankDiscountRateDecimal), timeYears);
    const proceedsFromDiscounting = safeSubtract(maturityValue, bankDiscountAmount);
    return {
        statedRateDecimal,
        bankDiscountRateDecimal,
        noteInterest,
        maturityValue,
        bankDiscountAmount,
        proceedsFromDiscounting,
    };
}
export function computeEquityMethodInvestment({ initialInvestment, ownershipPercentage, investeeNetIncome, investeeDividendsDeclared, }) {
    const ownershipDecimal = ownershipPercentage / 100;
    const investorShareInIncome = safeMultiply(investeeNetIncome, ownershipDecimal);
    const dividendsReceived = safeMultiply(investeeDividendsDeclared, ownershipDecimal);
    const endingInvestmentBalance = safeAdd(safeAdd(initialInvestment, investorShareInIncome), -dividendsReceived);
    return {
        ownershipDecimal,
        investorShareInIncome,
        dividendsReceived,
        endingInvestmentBalance,
    };
}
export function computeIntercompanyPpeTransfer({ transferPrice, carryingAmount, remainingUsefulLifeYears, yearsSinceTransfer, }) {
    const unrealizedGainOnTransfer = safeSubtract(transferPrice, carryingAmount);
    const annualExcessDepreciation = remainingUsefulLifeYears === 0
        ? Number.NaN
        : safeDivide(unrealizedGainOnTransfer, remainingUsefulLifeYears);
    const depreciationAdjustmentRecognizedToDate = Number.isFinite(annualExcessDepreciation)
        ? safeMultiply(annualExcessDepreciation, yearsSinceTransfer)
        : Number.NaN;
    const unamortizedIntercompanyProfit = Number.isFinite(depreciationAdjustmentRecognizedToDate)
        ? safeSubtract(unrealizedGainOnTransfer, depreciationAdjustmentRecognizedToDate)
        : Number.NaN;
    return {
        unrealizedGainOnTransfer,
        annualExcessDepreciation,
        depreciationAdjustmentRecognizedToDate,
        unamortizedIntercompanyProfit,
    };
}
export function computeAccountingRateOfReturn({ averageAnnualAccountingIncome, initialInvestment, salvageValue = 0, }) {
    const averageInvestment = (initialInvestment + salvageValue) / 2;
    const accountingRateOfReturnPercent = averageInvestment === 0
        ? 0
        : (averageAnnualAccountingIncome / averageInvestment) * 100;
    return {
        averageInvestment,
        accountingRateOfReturnPercent,
    };
}
export function computeEquivalentAnnualAnnuity({ netPresentValue, discountRatePercent, projectLife, }) {
    const rateDecimal = discountRatePercent / 100;
    const annuityFactor = rateDecimal === 0
        ? projectLife
        : (1 - Math.pow(1 + rateDecimal, -projectLife)) / rateDecimal;
    const equivalentAnnualAnnuity = annuityFactor === 0 ? 0 : netPresentValue / annuityFactor;
    return {
        rateDecimal,
        annuityFactor,
        equivalentAnnualAnnuity,
    };
}
export function computeSegmentMargin({ sales, variableCosts, traceableFixedCosts, commonFixedCosts = 0, }) {
    const contributionMargin = safeSubtract(sales, variableCosts);
    const segmentMargin = safeSubtract(contributionMargin, traceableFixedCosts);
    const segmentMarginRatio = sales === 0 ? 0 : safeDivide(segmentMargin, sales);
    const incomeAfterAllocatedCommonCosts = safeSubtract(segmentMargin, commonFixedCosts);
    return {
        contributionMargin,
        segmentMargin,
        segmentMarginRatio,
        incomeAfterAllocatedCommonCosts,
        decisionSignal: segmentMargin >= 0
            ? "Segment covers its traceable fixed costs before common-cost allocation."
            : "Segment does not cover traceable fixed costs; review avoidability before discontinuing.",
    };
}
export function computeAuditSamplingPlan({ populationBookValue, tolerableMisstatement, expectedMisstatement, confidenceFactor, }) {
    const allowanceForSamplingRisk = safeSubtract(tolerableMisstatement, expectedMisstatement);
    const sampleSize = allowanceForSamplingRisk <= 0
        ? Infinity
        : Math.ceil(safeDivide(safeMultiply(populationBookValue, confidenceFactor), allowanceForSamplingRisk));
    return {
        allowanceForSamplingRisk,
        sampleSize,
        samplingInterval: Number.isFinite(sampleSize) && sampleSize > 0
            ? safeDivide(populationBookValue, sampleSize)
            : Infinity,
        riskSignal: allowanceForSamplingRisk <= 0
            ? "Expected misstatement already meets or exceeds tolerable misstatement."
            : "Sampling plan is mathematically workable under the selected classroom confidence factor.",
    };
}
export function computeAuditMisstatementEvaluation({ tolerableMisstatement, projectedMisstatement, allowanceForSamplingRisk, clearlyTrivialThreshold, qualitativeConcernCount, }) {
    const upperMisstatementLimit = safeAdd(projectedMisstatement, allowanceForSamplingRisk);
    const headroom = safeSubtract(tolerableMisstatement, upperMisstatementLimit);
    const utilizationRate = tolerableMisstatement === 0
        ? 0
        : safeDivide(upperMisstatementLimit, tolerableMisstatement);
    const qualitativePenalty = safeMultiply(qualitativeConcernCount, 0.08);
    const adjustedRiskIndex = roundTo(safeAdd(utilizationRate, qualitativePenalty), 2);
    const aboveClearlyTrivial = projectedMisstatement >= clearlyTrivialThreshold;
    return {
        upperMisstatementLimit,
        headroom,
        utilizationRate,
        qualitativePenalty,
        adjustedRiskIndex,
        aboveClearlyTrivial,
        conclusion: upperMisstatementLimit > tolerableMisstatement || qualitativeConcernCount >= 3
            ? "Projected misstatement plus sampling allowance now pushes the case beyond the safer tolerable range, so additional work or adjustment is likely needed."
            : utilizationRate >= 0.85 || aboveClearlyTrivial || qualitativeConcernCount > 0
                ? "The case is still close enough to tolerable misstatement that more evidence, stronger explanation, or a proposed adjustment should be considered."
                : "The projected misstatement stays below the selected tolerable range, but the team should still document why qualitative matters do or do not change the conclusion.",
    };
}
export function computePertEstimate({ optimistic, mostLikely, pessimistic, }) {
    const expectedTime = safeDivide(safeAdd(safeAdd(optimistic, safeMultiply(4, mostLikely)), pessimistic), 6);
    const standardDeviation = safeDivide(safeSubtract(pessimistic, optimistic), 6);
    const variance = safeMultiply(standardDeviation, standardDeviation);
    return {
        expectedTime,
        standardDeviation,
        variance,
    };
}
export function computeQuasiReorganization({ deficit, sharePremium, revaluationSurplus, capitalReduction, }) {
    const totalDeficitRelief = safeAdd(safeAdd(sharePremium, revaluationSurplus), capitalReduction);
    const remainingDeficit = Math.max(safeSubtract(deficit, totalDeficitRelief), 0);
    const excessRelief = Math.max(safeSubtract(totalDeficitRelief, deficit), 0);
    return {
        totalDeficitRelief,
        remainingDeficit,
        excessRelief,
        cleanSurplusAchieved: remainingDeficit === 0,
    };
}
export function computeCorporateLiquidation({ estimatedAssetRealization, liquidationCosts, priorityLiabilities, unsecuredLiabilities, }) {
    const netEstateAvailable = safeSubtract(estimatedAssetRealization, liquidationCosts);
    const amountAvailableForUnsecured = Math.max(safeSubtract(netEstateAvailable, priorityLiabilities), 0);
    const unsecuredRecoveryPercent = unsecuredLiabilities === 0
        ? 100
        : safeMultiply(safeDivide(Math.min(amountAvailableForUnsecured, unsecuredLiabilities), unsecuredLiabilities), 100);
    const unsecuredDeficiency = Math.max(safeSubtract(unsecuredLiabilities, amountAvailableForUnsecured), 0);
    return {
        netEstateAvailable,
        amountAvailableForUnsecured,
        unsecuredRecoveryPercent,
        unsecuredDeficiency,
    };
}
export function computeActivityBasedCosting({ directMaterials, directLabor, units, activityOneCost, activityOneTotalDriver, activityOneProductDriver, activityTwoCost, activityTwoTotalDriver, activityTwoProductDriver, }) {
    const activityOneRate = activityOneTotalDriver === 0 ? 0 : safeDivide(activityOneCost, activityOneTotalDriver);
    const activityTwoRate = activityTwoTotalDriver === 0 ? 0 : safeDivide(activityTwoCost, activityTwoTotalDriver);
    const activityOneAssigned = safeMultiply(activityOneRate, activityOneProductDriver);
    const activityTwoAssigned = safeMultiply(activityTwoRate, activityTwoProductDriver);
    const totalOverheadAssigned = safeAdd(activityOneAssigned, activityTwoAssigned);
    const totalProductCost = safeAdd(safeAdd(directMaterials, directLabor), totalOverheadAssigned);
    const unitProductCost = units === 0 ? 0 : safeDivide(totalProductCost, units);
    return {
        activityOneRate,
        activityTwoRate,
        activityOneAssigned,
        activityTwoAssigned,
        totalOverheadAssigned,
        totalProductCost,
        unitProductCost,
        costSignal: totalOverheadAssigned > directLabor + directMaterials
            ? "Overhead is a major cost driver; ABC may explain product cost better than a single plantwide rate."
            : "Direct costs dominate this product cost under the selected activity assumptions.",
    };
}
export function computeFinancialAssetAmortizedCost({ openingCarryingAmount, faceValue, statedRatePercent, effectiveRatePercent, expectedCreditLoss = 0, }) {
    const cashInterest = safeMultiply(faceValue, percentToDecimal(statedRatePercent));
    const interestRevenue = safeMultiply(openingCarryingAmount, percentToDecimal(effectiveRatePercent));
    const amortization = safeSubtract(interestRevenue, cashInterest);
    const endingGrossCarryingAmount = safeAdd(openingCarryingAmount, amortization);
    const netCarryingAmount = Math.max(safeSubtract(endingGrossCarryingAmount, expectedCreditLoss), 0);
    return {
        cashInterest,
        interestRevenue,
        amortization,
        endingGrossCarryingAmount,
        netCarryingAmount,
        measurementSignal: amortization >= 0
            ? "The asset is accreting toward face value because the effective yield exceeds the stated coupon."
            : "The asset is amortizing downward because cash interest exceeds effective-interest revenue.",
    };
}
export function computeInvestmentPropertyMeasurement({ carryingAmount, fairValue, annualDepreciation = 0, impairmentLoss = 0, }) {
    const fairValueGainOrLoss = safeSubtract(fairValue, carryingAmount);
    const costModelEndingCarryingAmount = Math.max(safeSubtract(safeSubtract(carryingAmount, annualDepreciation), impairmentLoss), 0);
    return {
        fairValueGainOrLoss,
        fairValueEndingCarryingAmount: fairValue,
        costModelEndingCarryingAmount,
        measurementSignal: fairValueGainOrLoss >= 0
            ? "Fair value model produces a gain under the selected classroom facts."
            : "Fair value model produces a loss under the selected classroom facts.",
    };
}
export function computeJointArrangementShare({ ownershipPercent, arrangementAssets, arrangementLiabilities, arrangementRevenue, arrangementExpenses, }) {
    const share = percentToDecimal(ownershipPercent);
    const shareOfAssets = safeMultiply(arrangementAssets, share);
    const shareOfLiabilities = safeMultiply(arrangementLiabilities, share);
    const shareOfRevenue = safeMultiply(arrangementRevenue, share);
    const shareOfExpenses = safeMultiply(arrangementExpenses, share);
    const shareOfProfit = safeSubtract(shareOfRevenue, shareOfExpenses);
    const netPosition = safeSubtract(shareOfAssets, shareOfLiabilities);
    return {
        share,
        shareOfAssets,
        shareOfLiabilities,
        shareOfRevenue,
        shareOfExpenses,
        shareOfProfit,
        netPosition,
        classificationReminder: "Joint operations usually recognize direct rights to assets and obligations for liabilities; joint ventures are commonly accounted for through the investment/equity-method lens.",
    };
}
export function computeQualityControlChart({ processMean, processStandardDeviation, sampleSize, observations, }) {
    const standardError = sampleSize <= 0 ? 0 : safeDivide(processStandardDeviation, Math.sqrt(sampleSize));
    const controlSpread = safeMultiply(3, standardError);
    const upperControlLimit = safeAdd(processMean, controlSpread);
    const lowerControlLimit = safeSubtract(processMean, controlSpread);
    const outOfControlObservations = observations.filter((value) => value > upperControlLimit || value < lowerControlLimit);
    return {
        standardError,
        upperControlLimit,
        lowerControlLimit,
        outOfControlCount: outOfControlObservations.length,
        outOfControlObservations,
        controlSignal: outOfControlObservations.length > 0
            ? "At least one observation falls outside the three-sigma control limits; investigate assignable causes."
            : "No entered observation falls outside the three-sigma control limits under the selected assumptions.",
    };
}
export function computeBusinessContinuityReadiness({ backupRecovery, incidentResponse, vendorResilience, communicationsReadiness, recoveryTimeObjectiveHours, expectedRecoveryHours, }) {
    const readinessAverage = safeDivide(safeAdd(safeAdd(backupRecovery, incidentResponse), safeAdd(vendorResilience, communicationsReadiness)), 4);
    const readinessPercent = safeMultiply(safeDivide(readinessAverage, 5), 100);
    const recoveryGapHours = safeSubtract(expectedRecoveryHours, recoveryTimeObjectiveHours);
    const withinObjective = recoveryGapHours <= 0;
    return {
        readinessAverage,
        readinessPercent,
        recoveryGapHours,
        withinObjective,
        continuitySignal: withinObjective && readinessAverage >= 4
            ? "Recovery posture is relatively aligned with the stated classroom objective."
            : withinObjective
                ? "Recovery timing is currently acceptable, but control depth still needs reinforcement."
                : "Expected recovery time exceeds the stated objective, so continuity controls need a stronger response plan.",
    };
}
export function computeSegregationOfDutiesConflict({ authorizationCustodyConflict, custodyRecordingConflict, recordingReconciliationConflict, privilegedAccessConflict, compensatingReviewStrength, }) {
    const rawConflictScore = safeAdd(safeAdd(authorizationCustodyConflict, custodyRecordingConflict), safeAdd(recordingReconciliationConflict, privilegedAccessConflict));
    const mitigationCredit = roundTo(safeMultiply(Math.max(safeSubtract(compensatingReviewStrength, 1), 0), 0.9), 2);
    const netConflictScore = roundTo(Math.max(safeSubtract(rawConflictScore, mitigationCredit), 1), 2);
    const conflictRows = [
        {
            label: "Authorization with custody",
            value: authorizationCustodyConflict,
        },
        {
            label: "Custody with recording",
            value: custodyRecordingConflict,
        },
        {
            label: "Recording with reconciliation",
            value: recordingReconciliationConflict,
        },
        {
            label: "Privileged access override",
            value: privilegedAccessConflict,
        },
    ].sort((left, right) => right.value - left.value);
    return {
        rawConflictScore,
        mitigationCredit,
        netConflictScore,
        dominantConflict: conflictRows[0]?.label ?? "Role overlap",
        riskLabel: netConflictScore >= 9
            ? "Severe segregation-of-duties exposure"
            : netConflictScore >= 7
                ? "Elevated segregation-of-duties exposure"
                : "Manageable but review-worthy segregation exposure",
        recommendedResponse: netConflictScore >= 9
            ? "Separate incompatible duties or add truly independent review immediately, especially where privileged access can bypass normal approval."
            : netConflictScore >= 7
                ? "Reduce overlapping roles, formalize exception approval, and strengthen recurring conflict review and log monitoring."
                : "Document the remaining conflict, confirm the compensating review evidence, and keep periodic recertification on schedule.",
    };
}
export function computeControlEnvironmentStrength({ oversightStrength, ethicsProgramStrength, accountabilityStrength, competenceStrength, escalationStrength, }) {
    const controlEnvironmentAverage = safeDivide(safeAdd(safeAdd(oversightStrength, ethicsProgramStrength), safeAdd(accountabilityStrength, safeAdd(competenceStrength, escalationStrength))), 5);
    const overrideRiskIndex = roundTo(Math.max(safeSubtract(6, controlEnvironmentAverage), 1), 2);
    return {
        controlEnvironmentAverage,
        overrideRiskIndex,
        environmentSignal: controlEnvironmentAverage >= 4
            ? "Tone at the top and supporting governance factors look stronger under the selected facts."
            : controlEnvironmentAverage >= 3
                ? "Control-environment strength is mixed, so students should identify where discipline may break first."
                : "Weak control-environment fundamentals make override, inconsistency, and poor follow-through more likely.",
    };
}
export function computeGovernanceEscalationPlan({ issueSeverity, overrideRisk, stakeholderExposure, documentationStrength, oversightReadiness, }) {
    const evidenceGap = Math.max(safeSubtract(4, documentationStrength), 0);
    const oversightGap = Math.max(safeSubtract(4, oversightReadiness), 0);
    const escalationScore = safeAdd(safeAdd(issueSeverity, overrideRisk), safeAdd(stakeholderExposure, safeAdd(evidenceGap, oversightGap)));
    const preserveEvidence = overrideRisk >= 2 || documentationStrength <= 1;
    return {
        escalationScore,
        preserveEvidence,
        urgency: escalationScore >= 12 || overrideRisk === 3
            ? "Immediate"
            : escalationScore >= 9
                ? "Prompt"
                : "Structured follow-up",
        escalationTier: escalationScore >= 12 || overrideRisk === 3
            ? "Audit committee or board-level escalation"
            : escalationScore >= 9
                ? "Executive, compliance, or internal-audit escalation"
                : "Control-owner and management escalation",
        recommendedMove: escalationScore >= 12 || overrideRisk === 3
            ? "Preserve evidence, document the issue clearly, and escalate outside the normal operating chain if management override risk is part of the case."
            : escalationScore >= 9
                ? "Document the issue, identify affected stakeholders, and move it into formal compliance, governance, or internal-audit review."
                : "Record the issue, assign accountable follow-up, and confirm whether governance oversight needs to monitor the remediation plan.",
        governanceSignal: oversightReadiness <= 1
            ? "Oversight readiness is weak, so even a well-documented concern may stall without a stronger escalation path."
            : documentationStrength <= 1
                ? "Documentation is thin, so evidence preservation should happen before the issue is challenged."
                : "Oversight and documentation are more usable, so the main decision is how high and how fast the escalation should go.",
    };
}
export function computeBusinessCaseScore({ marketAttractiveness, costAdvantage, controlReadiness, executionCapacity, riskPenalty, }) {
    const weightedScore = roundTo(safeSubtract(safeAdd(safeAdd(safeMultiply(marketAttractiveness, 0.3), safeMultiply(costAdvantage, 0.25)), safeAdd(safeMultiply(controlReadiness, 0.25), safeMultiply(executionCapacity, 0.2))), riskPenalty), 2);
    return {
        weightedScore,
        recommendation: weightedScore >= 3.8
            ? "Stronger classroom case to pursue"
            : weightedScore >= 2.8
                ? "Proceed only with tighter assumptions"
                : "Case needs major redesign or a safer alternative",
        planningSignal: weightedScore >= 3.8
            ? "The opportunity looks comparatively balanced across market, cost, control, and execution."
            : weightedScore >= 2.8
                ? "The case has promise, but one weak layer could still undermine the plan."
                : "Strategic enthusiasm is outrunning the underlying economics or control readiness.",
    };
}
export function computeRevenueAllocationAnalysis({ transactionPrice, standaloneSellingPriceA, standaloneSellingPriceB, percentSatisfiedA, percentSatisfiedB, considerationReceived, }) {
    const totalStandaloneSellingPrice = safeAdd(standaloneSellingPriceA, standaloneSellingPriceB);
    const allocationA = safeMultiply(transactionPrice, safeDivide(standaloneSellingPriceA, totalStandaloneSellingPrice));
    const allocationB = safeMultiply(transactionPrice, safeDivide(standaloneSellingPriceB, totalStandaloneSellingPrice));
    const revenueA = safeMultiply(allocationA, percentToDecimal(percentSatisfiedA));
    const revenueB = safeMultiply(allocationB, percentToDecimal(percentSatisfiedB));
    const revenueRecognized = safeAdd(revenueA, revenueB);
    const contractLiability = Math.max(safeSubtract(considerationReceived, revenueRecognized), 0);
    const contractAsset = Math.max(safeSubtract(revenueRecognized, considerationReceived), 0);
    return {
        totalStandaloneSellingPrice,
        allocationA,
        allocationB,
        revenueA,
        revenueB,
        revenueRecognized,
        contractLiability,
        contractAsset,
        recognitionSignal: contractLiability > 0
            ? "Cash or billings exceed revenue recognized, so the unsatisfied portion is presented as a contract liability under the stated facts."
            : contractAsset > 0
                ? "Revenue recognized exceeds consideration received, so the case needs a contract-asset or receivable analysis depending on billing rights."
                : "Revenue recognized and consideration received are aligned under the entered assumptions.",
    };
}
export function computeTaxableIncomeBridge({ accountingIncome, permanentAdditions, permanentDeductions, taxableTemporaryDifferences, deductibleTemporaryDifferences, nolDeduction, taxRatePercent, }) {
    const taxableIncomeBeforeNol = safeSubtract(safeAdd(accountingIncome, safeAdd(permanentAdditions, taxableTemporaryDifferences)), safeAdd(permanentDeductions, deductibleTemporaryDifferences));
    const taxableIncome = Math.max(safeSubtract(taxableIncomeBeforeNol, nolDeduction), 0);
    const currentTaxExpense = safeMultiply(taxableIncome, percentToDecimal(taxRatePercent));
    const deferredTaxLiability = safeMultiply(Math.max(taxableTemporaryDifferences, 0), percentToDecimal(taxRatePercent));
    const deferredTaxAsset = safeMultiply(Math.max(deductibleTemporaryDifferences, 0), percentToDecimal(taxRatePercent));
    return {
        taxableIncomeBeforeNol,
        taxableIncome,
        currentTaxExpense,
        deferredTaxLiability,
        deferredTaxAsset,
        bridgeSignal: taxableIncome <= 0
            ? "The bridge produces no current taxable income after the entered deductions; confirm whether carryover or minimum-tax rules are relevant to the classroom problem."
            : "The bridge separates permanent items, temporary items, and loss deductions so income-tax computation does not get mixed with financial-reporting income.",
    };
}
export function computeTargetCostingGap({ targetSellingPrice, targetProfitMarginPercent, expectedUnitVolume, currentEstimatedCostPerUnit, committedCostReductionPerUnit, }) {
    const targetProfitPerUnit = safeMultiply(targetSellingPrice, percentToDecimal(targetProfitMarginPercent));
    const allowableCostPerUnit = safeSubtract(targetSellingPrice, targetProfitPerUnit);
    const revisedCostPerUnit = safeSubtract(currentEstimatedCostPerUnit, committedCostReductionPerUnit);
    const remainingCostGapPerUnit = safeSubtract(revisedCostPerUnit, allowableCostPerUnit);
    const totalCostGap = safeMultiply(remainingCostGapPerUnit, expectedUnitVolume);
    const requiredReductionPercent = safeMultiply(safeDivide(Math.max(remainingCostGapPerUnit, 0), revisedCostPerUnit), 100);
    return {
        targetProfitPerUnit,
        allowableCostPerUnit,
        revisedCostPerUnit,
        remainingCostGapPerUnit,
        totalCostGap,
        requiredReductionPercent,
        targetCostSignal: remainingCostGapPerUnit <= 0
            ? "The revised estimated cost is within the allowable target cost under the entered assumptions."
            : "The product still exceeds allowable cost, so design, process, supplier, or feature trade-off work is needed before launch.",
    };
}
export function computeAuditEvidenceProgram({ assertionRisk, evidenceReliability, evidenceRelevance, coverageDepth, contradictionCount, }) {
    const evidenceStrengthAverage = safeDivide(safeAdd(safeAdd(evidenceReliability, evidenceRelevance), coverageDepth), 3);
    const contradictionPenalty = safeMultiply(contradictionCount, 0.6);
    const residualEvidenceGap = roundTo(Math.max(safeSubtract(assertionRisk, safeSubtract(evidenceStrengthAverage, contradictionPenalty)), 0), 2);
    return {
        evidenceStrengthAverage,
        contradictionPenalty,
        residualEvidenceGap,
        procedureIntensity: residualEvidenceGap >= 2.5
            ? "Expand substantive procedures and obtain stronger external or independently generated evidence."
            : residualEvidenceGap >= 1
                ? "Add targeted follow-up procedures around the weakest assertion or contradictory item."
                : "Evidence coverage appears directionally adequate for the entered classroom risk level.",
        evidenceSignal: contradictionCount > 0
            ? "Contradictory evidence prevents a clean conclusion until it is explained, corroborated, or resolved."
            : "No contradiction count was entered, so the main issue is whether relevance, reliability, and coverage match assertion risk.",
    };
}
