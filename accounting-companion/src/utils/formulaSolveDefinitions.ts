import formatPHP from "./formatPHP.js";
import {
    computeAccountingRateOfReturn,
    computeAccruedExpenseAdjustment,
    computeAccruedRevenueAdjustment,
    computeAssetDisposal,
    computeBudgetVarianceAnalysis,
    computeBudgetedIncomeStatement,
    computeBreakEven,
    computeCompoundInterest,
    computeConstrainedResourceProductMix,
    computeCurrentRatio,
    computeDirectMaterialsPurchasesBudget,
    computeDirectLaborBudget,
    computeEquivalentAnnualAnnuity,
    computeEquityMethodInvestment,
    computeFactoryOverheadBudget,
    computeFutureValue,
    computeGrossProfitRate,
    computeImpairmentLoss,
    computeInventoryBudget,
    computeIntercompanyInventoryProfit,
    computeIntercompanyPpeTransfer,
    computeMakeOrBuyDecision,
    computeMovingAverageForecast,
    computeMarkupMargin,
    computeNotesReceivableDiscounting,
    computeOperatingExpenseBudget,
    computePettyCashReconciliation,
    computePercentageTax,
    computePresentValue,
    computePrepaidExpenseAdjustment,
    computeProductionBudget,
    computeQuickRatio,
    computeRetainedEarningsRollforward,
    computeSalesBudget,
    computeSellProcessFurther,
    computeSimpleInterest,
    computeSpecialOrderDecision,
    computeStraightLineDepreciation,
    computeTurnoverWithDayBasis,
    computeUnearnedRevenueAdjustment,
    computeVatReconciliation,
    computeWithholdingTax,
} from "./calculatorMath.js";
import type { FormulaCalculatorDefinition } from "./formulaIntelligence.js";
import {
    buildTaxAssumptionNotes,
    PHILIPPINE_TAX_ASSUMPTIONS,
} from "./taxConfig.js";

function formatPercent(value: number, digits = 2) {
    return `${value.toFixed(digits)}%`;
}

function formatPlain(value: number, digits = 2) {
    return Number.isInteger(value) ? value.toLocaleString() : value.toFixed(digits);
}

function formatRatio(value: number) {
    return `${value.toFixed(2)} : 1`;
}

function formatTimes(value: number) {
    return `${value.toFixed(2)} times`;
}

function formatDays(value: number) {
    return `${value.toFixed(2)} days`;
}

function invalidNumberError() {
    return { error: "All visible inputs must be valid numbers." };
}

export const simpleInterestSolveDefinition: FormulaCalculatorDefinition = {
    id: "simple-interest-solve",
    defaultTarget: "interest",
    fields: {
        principal: { key: "principal", label: "Principal", placeholder: "10000", kind: "money" },
        rate: { key: "rate", label: "Rate (%)", placeholder: "5", kind: "percent" },
        time: { key: "time", label: "Time (years)", placeholder: "2", kind: "time" },
        interest: { key: "interest", label: "Interest", placeholder: "1000", kind: "money" },
    },
    targets: [
        { key: "interest", label: "Interest", summary: "Use the standard simple-interest question: find the interest earned or charged." },
        { key: "principal", label: "Principal", summary: "Back-solve the original amount when interest, rate, and time are known." },
        { key: "rate", label: "Rate", summary: "Find the annual simple-interest rate required by the given principal, interest, and time." },
        { key: "time", label: "Time", summary: "Back-solve the number of years implied by principal, interest, and annual rate." },
    ],
    getInputKeys(targetKey: string) {
        switch (targetKey) {
            case "principal":
                return ["interest", "rate", "time"];
            case "rate":
                return ["principal", "interest", "time"];
            case "time":
                return ["principal", "interest", "rate"];
            default:
                return ["principal", "rate", "time"];
        }
    },
    getEmptyState(targetKey: string) {
        return {
            title: "Ready to reverse-solve simple interest",
            body:
                targetKey === "interest"
                    ? "Enter principal, rate, and time to compute simple interest and the total amount."
                    : `Enter the remaining simple-interest values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey: string, values: Record<string, number>) {
        const numericValues = Object.values(values);
        if (numericValues.some((value) => Number.isNaN(value))) return invalidNumberError();

        let principal = values.principal;
        let rate = values.rate;
        let time = values.time;
        let interest = values.interest;

        if (targetKey === "interest") {
            if (principal <= 0) return { error: "Principal must be greater than zero." };
            if (rate < 0 || time < 0) return { error: "Rate and time cannot be negative." };

            const result = computeSimpleInterest({
                principal,
                annualRatePercent: rate,
                timeYears: time,
            });

            interest = result.interest;
            return {
                primaryResult: { title: "Interest", value: formatPHP(interest), tone: "accent" },
                supportingResults: [
                    { title: "Total Amount", value: formatPHP(result.totalAmount) },
                    { title: "Rate (decimal)", value: result.rateDecimal.toFixed(4) },
                ],
                formula: "I = P × r × t",
                steps: [
                    `Rate in decimal = ${formatPercent(rate)} = ${result.rateDecimal.toFixed(4)}.`,
                    `Interest = ${formatPHP(principal)} × ${result.rateDecimal.toFixed(4)} × ${formatPlain(time)} = ${formatPHP(interest)}.`,
                    `Total amount = ${formatPHP(principal)} + ${formatPHP(interest)} = ${formatPHP(result.totalAmount)}.`,
                ],
                glossary: [
                    { term: "Principal (P)", meaning: "The original amount borrowed or invested." },
                    { term: "Rate (r)", meaning: "The annual simple-interest rate expressed as a decimal." },
                    { term: "Time (t)", meaning: "The number of years the principal remains outstanding." },
                ],
                interpretation:
                    interest === 0
                        ? `The rate or the time is zero, so the principal stays at ${formatPHP(result.totalAmount)} with no simple interest added.`
                        : `The principal earns ${formatPHP(interest)} in simple interest over ${formatPlain(time)} year(s), bringing the total amount to ${formatPHP(result.totalAmount)}.`,
            };
        }

        if (targetKey === "principal") {
            if (rate <= 0 || time <= 0) {
                return { error: "Rate and time must both be greater than zero when solving for principal." };
            }

            principal = interest / ((rate / 100) * time);
        } else if (targetKey === "rate") {
            if (principal <= 0 || time <= 0) {
                return { error: "Principal and time must both be greater than zero when solving for rate." };
            }

            rate = (interest / (principal * time)) * 100;
        } else if (targetKey === "time") {
            if (principal <= 0 || rate <= 0) {
                return { error: "Principal and rate must both be greater than zero when solving for time." };
            }

            time = interest / (principal * (rate / 100));
        }

        if (![principal, rate, time].every((value) => Number.isFinite(value))) {
            return { error: "The selected values do not produce a valid simple-interest solution." };
        }

        if (principal <= 0 || rate < 0 || time < 0) {
            return { error: "The solved value falls outside the normal simple-interest domain." };
        }

        const recomputed = computeSimpleInterest({
            principal,
            annualRatePercent: rate,
            timeYears: time,
        });

        return {
            primaryResult: {
                title: targetKey === "principal" ? "Principal" : targetKey === "rate" ? "Rate" : "Time",
                value:
                    targetKey === "principal"
                        ? formatPHP(principal)
                        : targetKey === "rate"
                          ? formatPercent(rate)
                          : `${formatPlain(time)} year(s)`,
                tone: "accent",
            },
            supportingResults: [
                { title: "Interest", value: formatPHP(recomputed.interest) },
                { title: "Total Amount", value: formatPHP(recomputed.totalAmount) },
            ],
            formula:
                targetKey === "principal"
                    ? "P = I / (r × t)"
                    : targetKey === "rate"
                      ? "r = I / (P × t)"
                      : "t = I / (P × r)",
            steps: [
                `Use the same simple-interest relationship I = P × r × t, but isolate ${targetKey}.`,
                `Solved ${targetKey} = ${
                    targetKey === "principal"
                        ? formatPHP(principal)
                        : targetKey === "rate"
                          ? formatPercent(rate)
                          : `${formatPlain(time)} year(s)`
                }.`,
                `Check: ${formatPHP(principal)} at ${formatPercent(rate)} for ${formatPlain(time)} year(s) gives ${formatPHP(recomputed.interest)} in interest.`,
            ],
            interpretation: `The missing ${targetKey} is consistent with simple interest of ${formatPHP(recomputed.interest)} and a total amount of ${formatPHP(recomputed.totalAmount)}.`,
            assumptions: [
                "This page assumes simple interest only, so interest is computed on the original principal rather than on a compounding balance.",
            ],
        };
    },
};

export const compoundInterestSolveDefinition: FormulaCalculatorDefinition = {
    id: "compound-interest-solve",
    defaultTarget: "totalAmount",
    fields: {
        principal: { key: "principal", label: "Principal", placeholder: "10000", kind: "money" },
        rate: { key: "rate", label: "Rate (%)", placeholder: "5", kind: "percent" },
        timesCompounded: {
            key: "timesCompounded",
            label: "Compounded / Year",
            placeholder: "4",
            kind: "number",
        },
        time: { key: "time", label: "Time (years)", placeholder: "2", kind: "time" },
        totalAmount: { key: "totalAmount", label: "Total Amount", placeholder: "11025", kind: "money" },
    },
    targets: [
        { key: "totalAmount", label: "Total Amount", summary: "Project the accumulated amount using principal, annual rate, compounding frequency, and time." },
        { key: "principal", label: "Principal", summary: "Back-solve the original principal from the accumulated compound amount." },
        { key: "rate", label: "Rate", summary: "Find the annual rate implied by principal, final amount, compounding frequency, and time." },
        { key: "time", label: "Time", summary: "Find how long the compounding period lasts for the balance to reach the target amount." },
    ],
    getInputKeys(targetKey: string) {
        switch (targetKey) {
            case "principal":
                return ["totalAmount", "rate", "timesCompounded", "time"];
            case "rate":
                return ["principal", "totalAmount", "timesCompounded", "time"];
            case "time":
                return ["principal", "totalAmount", "rate", "timesCompounded"];
            default:
                return ["principal", "rate", "timesCompounded", "time"];
        }
    },
    getEmptyState(targetKey: string) {
        return {
            title: "Compound-interest solve mode",
            body: `Enter the visible compound-interest inputs to solve for ${targetKey}.`,
        };
    },
    solve(targetKey: string, values: Record<string, number>) {
        let principal = values.principal;
        let rate = values.rate;
        let timesCompounded = values.timesCompounded;
        let time = values.time;
        let totalAmount = values.totalAmount;

        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        if (timesCompounded <= 0) {
            return { error: "Compounds per year must be greater than zero." };
        }

        if (targetKey === "principal") {
            if (totalAmount <= 0 || time < 0 || rate <= -100) {
                return { error: "Total amount must be positive, time cannot be negative, and rate must stay above -100%." };
            }

            principal =
                totalAmount / Math.pow(1 + rate / 100 / timesCompounded, timesCompounded * time);
        } else if (targetKey === "rate") {
            if (principal <= 0 || totalAmount <= 0 || time <= 0) {
                return { error: "Principal, total amount, and time must all be greater than zero when solving for rate." };
            }

            const ratio = totalAmount / principal;
            if (ratio <= 0) {
                return { error: "The accumulated amount must stay positive relative to principal." };
            }

            rate =
                timesCompounded *
                (Math.pow(ratio, 1 / (timesCompounded * time)) - 1) *
                100;
        } else if (targetKey === "time") {
            if (principal <= 0 || totalAmount <= 0) {
                return { error: "Principal and total amount must both be greater than zero when solving for time." };
            }

            if (rate <= -100 || rate === 0) {
                return { error: "Rate must be above -100% and not equal to zero when solving for time." };
            }

            const compoundFactor = 1 + rate / 100 / timesCompounded;
            if (compoundFactor <= 0 || totalAmount / principal <= 0 || compoundFactor === 1) {
                return { error: "The selected values do not produce a stable logarithmic compound-interest solution." };
            }

            time = Math.log(totalAmount / principal) / (timesCompounded * Math.log(compoundFactor));
        }

        if (![principal, rate, time].every((value) => Number.isFinite(value))) {
            return { error: "The selected values do not produce a valid compound-interest answer." };
        }

        if (principal <= 0 || time < 0 || rate <= -100) {
            return { error: "The solved compound-interest value falls outside the supported domain." };
        }

        const computed = computeCompoundInterest({
            principal,
            annualRatePercent: rate,
            compoundsPerYear: timesCompounded,
            timeYears: time,
        });

        totalAmount = computed.totalAmount;

        return {
            primaryResult: {
                title:
                    targetKey === "principal"
                        ? "Principal"
                        : targetKey === "rate"
                          ? "Rate"
                          : targetKey === "time"
                            ? "Time"
                            : "Total Amount",
                value:
                    targetKey === "principal"
                        ? formatPHP(principal)
                        : targetKey === "rate"
                          ? formatPercent(rate)
                          : targetKey === "time"
                            ? `${formatPlain(time)} year(s)`
                            : formatPHP(totalAmount),
                tone: "accent",
            },
            supportingResults: [
                { title: "Compound Interest", value: formatPHP(computed.compoundInterest) },
                { title: "Compounded / Year", value: formatPlain(timesCompounded, 0) },
            ],
            formula:
                targetKey === "totalAmount"
                    ? "A = P × (1 + r / n)^(n × t)"
                    : targetKey === "principal"
                      ? "P = A / (1 + r / n)^(n × t)"
                      : targetKey === "rate"
                        ? "r = n × ((A / P)^(1 / (n × t)) - 1)"
                        : "t = ln(A / P) / (n × ln(1 + r / n))",
            steps: [
                `Compound amount check = ${formatPHP(principal)} × (1 + ${(computed.rateDecimal / timesCompounded).toFixed(6)})^(${formatPlain(timesCompounded, 0)} × ${formatPlain(time)}) = ${formatPHP(totalAmount)}.`,
                `Compound interest = ${formatPHP(totalAmount)} - ${formatPHP(principal)} = ${formatPHP(computed.compoundInterest)}.`,
            ],
            interpretation: `The selected compound-interest inputs imply an accumulated amount of ${formatPHP(totalAmount)} and compound interest of ${formatPHP(computed.compoundInterest)}.`,
            assumptions: [
                "This reverse solve assumes a constant nominal annual rate and a constant compounding frequency.",
            ],
            warnings:
                targetKey === "time"
                    ? ["When the rate is zero, compound growth disappears, so time cannot be isolated with this logarithmic form."]
                    : undefined,
        };
    },
};

export const timeValueSolveDefinition: FormulaCalculatorDefinition = {
    id: "time-value-solve",
    defaultTarget: "futureValue",
    fields: {
        presentValue: {
            key: "presentValue",
            label: "Present Value",
            placeholder: "10000",
            kind: "money",
        },
        futureValue: {
            key: "futureValue",
            label: "Future Value",
            placeholder: "11576.25",
            kind: "money",
        },
        rate: { key: "rate", label: "Rate (%)", placeholder: "5", kind: "percent" },
        time: { key: "time", label: "Time (years)", placeholder: "3", kind: "time" },
    },
    targets: [
        { key: "futureValue", label: "Future Value", summary: "Grow a present amount forward in time." },
        { key: "presentValue", label: "Present Value", summary: "Discount a future amount back to present worth." },
        { key: "rate", label: "Rate", summary: "Find the annual growth or discount rate implied by present value, future value, and time." },
        { key: "time", label: "Time", summary: "Find the number of years needed to move between present value and future value." },
    ],
    getInputKeys(targetKey: string) {
        switch (targetKey) {
            case "presentValue":
                return ["futureValue", "rate", "time"];
            case "rate":
                return ["presentValue", "futureValue", "time"];
            case "time":
                return ["presentValue", "futureValue", "rate"];
            default:
                return ["presentValue", "rate", "time"];
        }
    },
    getEmptyState(targetKey: string) {
        return {
            title: "Ready for time-value reverse solve",
            body: `Enter the visible time-value inputs to solve for ${targetKey}.`,
        };
    },
    solve(targetKey: string, values: Record<string, number>) {
        let presentValue = values.presentValue;
        let futureValue = values.futureValue;
        let rate = values.rate;
        let time = values.time;

        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        if (targetKey === "presentValue") {
            if (futureValue <= 0 || time < 0 || rate <= -100) {
                return { error: "Future value must be positive, time cannot be negative, and rate must stay above -100%." };
            }

            presentValue = computePresentValue({
                amount: futureValue,
                annualRatePercent: rate,
                timeYears: time,
            }).presentValue;
        } else if (targetKey === "futureValue") {
            if (presentValue <= 0 || time < 0 || rate <= -100) {
                return { error: "Present value must be positive, time cannot be negative, and rate must stay above -100%." };
            }

            futureValue = computeFutureValue({
                amount: presentValue,
                annualRatePercent: rate,
                timeYears: time,
            }).futureValue;
        } else if (targetKey === "rate") {
            if (presentValue <= 0 || futureValue <= 0 || time <= 0) {
                return { error: "Present value, future value, and time must all be greater than zero when solving for rate." };
            }

            rate = (Math.pow(futureValue / presentValue, 1 / time) - 1) * 100;
        } else if (targetKey === "time") {
            if (presentValue <= 0 || futureValue <= 0) {
                return { error: "Present value and future value must both be greater than zero when solving for time." };
            }

            if (rate <= -100 || rate === 0) {
                return { error: "Rate must be above -100% and not equal to zero when solving for time." };
            }

            const growthFactor = 1 + rate / 100;
            if (growthFactor <= 0 || growthFactor === 1) {
                return { error: "The selected values do not produce a stable logarithmic time-value solution." };
            }

            time = Math.log(futureValue / presentValue) / Math.log(growthFactor);
        }

        if (![presentValue, futureValue, rate, time].every((value) => Number.isFinite(value))) {
            return { error: "The time-value inputs do not resolve to a valid answer." };
        }

        if (presentValue <= 0 || futureValue <= 0 || rate <= -100 || time < 0) {
            return { error: "The solved value falls outside the supported time-value domain." };
        }

        const recomputedFuture = computeFutureValue({
            amount: presentValue,
            annualRatePercent: rate,
            timeYears: time,
        });

        return {
            primaryResult: {
                title:
                    targetKey === "presentValue"
                        ? "Present Value"
                        : targetKey === "rate"
                          ? "Rate"
                          : targetKey === "time"
                            ? "Time"
                            : "Future Value",
                value:
                    targetKey === "rate"
                        ? formatPercent(rate)
                        : targetKey === "time"
                          ? `${formatPlain(time)} year(s)`
                          : formatPHP(targetKey === "presentValue" ? presentValue : futureValue),
                tone: "accent",
            },
            supportingResults: [
                { title: "Present Value", value: formatPHP(presentValue) },
                { title: "Future Value", value: formatPHP(futureValue) },
                { title: "Rate (decimal)", value: recomputedFuture.rateDecimal.toFixed(4) },
            ],
            formula:
                targetKey === "futureValue"
                    ? "FV = PV × (1 + r)^t"
                    : targetKey === "presentValue"
                      ? "PV = FV / (1 + r)^t"
                      : targetKey === "rate"
                        ? "r = (FV / PV)^(1 / t) - 1"
                        : "t = ln(FV / PV) / ln(1 + r)",
            steps: [
                `Present value = ${formatPHP(presentValue)}.`,
                `Future value = ${formatPHP(futureValue)}.`,
                `Rate = ${formatPercent(rate)} and time = ${formatPlain(time)} year(s).`,
                `Check: ${formatPHP(presentValue)} grows to ${formatPHP(recomputedFuture.futureValue)} under the solved inputs.`,
            ],
            interpretation: `The time-value relationship is internally consistent: ${formatPHP(presentValue)} and ${formatPHP(futureValue)} are linked by ${formatPercent(rate)} across ${formatPlain(time)} year(s).`,
            assumptions: [
                "This page assumes one compounding period per year. Use the compound-interest page when a separate compounding frequency matters.",
            ],
        };
    },
};

export const profitLossSolveDefinition: FormulaCalculatorDefinition = {
    id: "profit-loss-solve",
    defaultTarget: "difference",
    fields: {
        cost: { key: "cost", label: "Cost", placeholder: "5000", kind: "money" },
        revenue: { key: "revenue", label: "Revenue", placeholder: "8000", kind: "money" },
        difference: {
            key: "difference",
            label: "Profit or Loss Amount",
            placeholder: "3000",
            kind: "money",
            helperText: "Use a negative value here if you want to back-solve from a loss.",
        },
    },
    targets: [
        { key: "difference", label: "Profit / Loss", summary: "Compare revenue and cost to see whether the outcome is profit, loss, or break-even." },
        { key: "revenue", label: "Revenue", summary: "Back-solve the revenue needed to produce the stated profit or loss amount." },
        { key: "cost", label: "Cost", summary: "Back-solve the cost implied by the stated revenue and profit or loss amount." },
    ],
    getInputKeys(targetKey: string) {
        switch (targetKey) {
            case "revenue":
                return ["cost", "difference"];
            case "cost":
                return ["revenue", "difference"];
            default:
                return ["cost", "revenue"];
        }
    },
    getEmptyState(targetKey: string) {
        return {
            title: "Profit / loss solve mode",
            body: `Enter the visible values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey: string, values: Record<string, number>) {
        let cost = values.cost;
        let revenue = values.revenue;
        let difference = values.difference;

        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        if (targetKey === "revenue") {
            revenue = cost + difference;
        } else if (targetKey === "cost") {
            cost = revenue - difference;
        } else {
            difference = revenue - cost;
        }

        if (![cost, revenue, difference].every((value) => Number.isFinite(value))) {
            return { error: "The selected values do not produce a valid profit-or-loss answer." };
        }

        if (cost < 0 || revenue < 0) {
            return { error: "The solved cost or revenue would be negative, which this page does not treat as a normal operating state." };
        }

        const status =
            difference > 0 ? "Profit" : difference < 0 ? "Loss" : "Break-even";

        return {
            primaryResult: {
                title:
                    targetKey === "revenue"
                        ? "Revenue"
                        : targetKey === "cost"
                          ? "Cost"
                          : "Profit / Loss Amount",
                value:
                    targetKey === "difference"
                        ? formatPHP(Math.abs(difference))
                        : formatPHP(targetKey === "revenue" ? revenue : cost),
                supportingText:
                    targetKey === "difference" ? `Classified as ${status}.` : undefined,
                tone: difference > 0 ? "success" : difference < 0 ? "warning" : "accent",
            },
            supportingResults: [
                { title: "Status", value: status },
                { title: "Revenue", value: formatPHP(revenue) },
                { title: "Cost", value: formatPHP(cost) },
            ],
            formula:
                targetKey === "difference"
                    ? "Profit or Loss = Revenue - Cost"
                    : targetKey === "revenue"
                      ? "Revenue = Cost + Profit or Loss"
                      : "Cost = Revenue - Profit or Loss",
            steps: [
                `Revenue = ${formatPHP(revenue)}.`,
                `Cost = ${formatPHP(cost)}.`,
                `Difference = ${formatPHP(revenue)} - ${formatPHP(cost)} = ${formatPHP(difference)}.`,
            ],
            interpretation:
                difference > 0
                    ? `Revenue exceeds cost by ${formatPHP(difference)}, so the activity produces a profit.`
                    : difference < 0
                      ? `Cost exceeds revenue by ${formatPHP(Math.abs(difference))}, so the activity produces a loss.`
                      : "Revenue and cost are equal, so the activity is exactly at break-even.",
        };
    },
};

export const priceCostMarginSolveDefinition: FormulaCalculatorDefinition = {
    id: "price-cost-margin-solve",
    defaultTarget: "profit",
    fields: {
        cost: { key: "cost", label: "Cost", placeholder: "500", kind: "money" },
        sellingPrice: {
            key: "sellingPrice",
            label: "Selling Price",
            placeholder: "800",
            kind: "money",
        },
        marginPercent: {
            key: "marginPercent",
            label: "Margin (%)",
            placeholder: "30",
            kind: "percent",
            helperText: "Margin is profit as a percentage of selling price.",
        },
        profit: { key: "profit", label: "Profit", placeholder: "300", kind: "money" },
    },
    targets: [
        { key: "profit", label: "Profit", summary: "Use cost and selling price to measure peso profit, markup, and margin." },
        { key: "sellingPrice", label: "Selling Price", summary: "Back-solve the selling price needed to hit a target margin on cost." },
        { key: "cost", label: "Cost", summary: "Back-solve the allowable cost when selling price and target margin are known." },
        { key: "marginPercent", label: "Margin %", summary: "Measure the margin percentage implied by cost and selling price." },
    ],
    getInputKeys(targetKey: string) {
        switch (targetKey) {
            case "sellingPrice":
                return ["cost", "marginPercent"];
            case "cost":
                return ["sellingPrice", "marginPercent"];
            case "marginPercent":
                return ["cost", "sellingPrice"];
            default:
                return ["cost", "sellingPrice"];
        }
    },
    getEmptyState(targetKey: string) {
        return {
            title: "Price, cost, and margin planner",
            body: `Enter the visible pricing values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey: string, values: Record<string, number>) {
        let cost = values.cost;
        let sellingPrice = values.sellingPrice;
        let marginPercent = values.marginPercent;
        let profit = values.profit;

        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        if (targetKey === "sellingPrice") {
            if (cost <= 0) return { error: "Cost must be greater than zero when solving for selling price." };
            if (marginPercent >= 100) return { error: "Margin must stay below 100% when solving for selling price." };

            sellingPrice = cost / (1 - marginPercent / 100);
        } else if (targetKey === "cost") {
            if (sellingPrice <= 0) return { error: "Selling price must be greater than zero when solving for cost." };
            if (marginPercent >= 100) return { error: "Margin must stay below 100% when solving for cost." };

            cost = sellingPrice * (1 - marginPercent / 100);
        } else {
            if (cost <= 0 || sellingPrice <= 0) {
                return { error: "Cost and selling price must both be greater than zero." };
            }

            const solved = computeMarkupMargin({ cost, sellingPrice });
            profit = solved.profit;
            marginPercent = solved.margin;
        }

        if (![cost, sellingPrice].every((value) => Number.isFinite(value))) {
            return { error: "The selected pricing values do not produce a valid solution." };
        }

        if (cost <= 0 || sellingPrice <= 0) {
            return { error: "Cost and selling price must both remain greater than zero." };
        }

        const computed = computeMarkupMargin({ cost, sellingPrice });
        profit = computed.profit;
        marginPercent = computed.margin;

        return {
            primaryResult: {
                title:
                    targetKey === "sellingPrice"
                        ? "Selling Price"
                        : targetKey === "cost"
                          ? "Cost"
                          : targetKey === "marginPercent"
                            ? "Margin %"
                            : "Profit",
                value:
                    targetKey === "marginPercent"
                        ? formatPercent(marginPercent)
                        : formatPHP(targetKey === "cost" ? cost : targetKey === "sellingPrice" ? sellingPrice : profit),
                tone: "accent",
            },
            supportingResults: [
                { title: "Profit", value: formatPHP(profit) },
                { title: "Markup %", value: formatPercent(computed.markup) },
                { title: "Margin %", value: formatPercent(marginPercent) },
            ],
            formula:
                targetKey === "sellingPrice"
                    ? "Selling Price = Cost / (1 - Margin %)"
                    : targetKey === "cost"
                      ? "Cost = Selling Price × (1 - Margin %)"
                      : targetKey === "marginPercent"
                        ? "Margin % = (Selling Price - Cost) / Selling Price"
                        : "Profit = Selling Price - Cost",
            steps: [
                `Cost = ${formatPHP(cost)} and selling price = ${formatPHP(sellingPrice)}.`,
                `Profit = ${formatPHP(sellingPrice)} - ${formatPHP(cost)} = ${formatPHP(profit)}.`,
                `Markup = ${formatPHP(profit)} / ${formatPHP(cost)} = ${formatPercent(computed.markup)}.`,
                `Margin = ${formatPHP(profit)} / ${formatPHP(sellingPrice)} = ${formatPercent(marginPercent)}.`,
            ],
            interpretation: `The pricing structure produces ${formatPHP(profit)} in profit, equal to a markup of ${formatPercent(computed.markup)} and a margin of ${formatPercent(marginPercent)}.`,
            warnings:
                targetKey === "sellingPrice" || targetKey === "cost"
                    ? ["Margin-based reverse solve becomes unstable at or above 100%, so the planner blocks that input range."]
                    : undefined,
        };
    },
};

export const breakEvenSolveDefinition: FormulaCalculatorDefinition = {
    id: "break-even-solve",
    defaultTarget: "breakEvenUnits",
    fields: {
        fixedCosts: {
            key: "fixedCosts",
            label: "Fixed Costs",
            placeholder: "10000",
            kind: "money",
        },
        sellingPricePerUnit: {
            key: "sellingPricePerUnit",
            label: "Selling Price / Unit",
            placeholder: "200",
            kind: "money",
        },
        variableCostPerUnit: {
            key: "variableCostPerUnit",
            label: "Variable Cost / Unit",
            placeholder: "120",
            kind: "money",
        },
        breakEvenUnits: {
            key: "breakEvenUnits",
            label: "Break-even Units",
            placeholder: "125",
            kind: "number",
        },
    },
    targets: [
        { key: "breakEvenUnits", label: "Break-even Units", summary: "Find how many units must be sold to cover all fixed costs." },
        { key: "fixedCosts", label: "Fixed Costs", summary: "Back-solve fixed costs when the break-even units and contribution margin are known." },
        { key: "sellingPricePerUnit", label: "Selling Price / Unit", summary: "Back-solve the selling price required to break even at the stated unit volume." },
        { key: "variableCostPerUnit", label: "Variable Cost / Unit", summary: "Back-solve the maximum variable cost allowed at the stated break-even volume." },
    ],
    getInputKeys(targetKey: string) {
        switch (targetKey) {
            case "fixedCosts":
                return ["breakEvenUnits", "sellingPricePerUnit", "variableCostPerUnit"];
            case "sellingPricePerUnit":
                return ["breakEvenUnits", "fixedCosts", "variableCostPerUnit"];
            case "variableCostPerUnit":
                return ["breakEvenUnits", "fixedCosts", "sellingPricePerUnit"];
            default:
                return ["fixedCosts", "sellingPricePerUnit", "variableCostPerUnit"];
        }
    },
    getEmptyState(targetKey: string) {
        return {
            title: "Break-even solve mode",
            body: `Enter the remaining CVP values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey: string, values: Record<string, number>) {
        let fixedCosts = values.fixedCosts;
        let sellingPricePerUnit = values.sellingPricePerUnit;
        let variableCostPerUnit = values.variableCostPerUnit;
        let breakEvenUnits = values.breakEvenUnits;

        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        if (targetKey === "fixedCosts") {
            fixedCosts = breakEvenUnits * (sellingPricePerUnit - variableCostPerUnit);
        } else if (targetKey === "sellingPricePerUnit") {
            if (breakEvenUnits <= 0) {
                return { error: "Break-even units must be greater than zero when solving for selling price." };
            }

            sellingPricePerUnit = fixedCosts / breakEvenUnits + variableCostPerUnit;
        } else if (targetKey === "variableCostPerUnit") {
            if (breakEvenUnits <= 0) {
                return { error: "Break-even units must be greater than zero when solving for variable cost." };
            }

            variableCostPerUnit = sellingPricePerUnit - fixedCosts / breakEvenUnits;
        }

        if (
            fixedCosts < 0 ||
            sellingPricePerUnit <= 0 ||
            variableCostPerUnit < 0 ||
            sellingPricePerUnit <= variableCostPerUnit
        ) {
            return { error: "The selected values do not leave a positive contribution margin per unit." };
        }

        const computed = computeBreakEven({
            fixedCosts,
            sellingPricePerUnit,
            variableCostPerUnit,
        });
        breakEvenUnits = computed.breakEvenUnits;

        return {
            primaryResult: {
                title:
                    targetKey === "fixedCosts"
                        ? "Fixed Costs"
                        : targetKey === "sellingPricePerUnit"
                          ? "Selling Price / Unit"
                          : targetKey === "variableCostPerUnit"
                            ? "Variable Cost / Unit"
                            : "Break-even Units",
                value:
                    targetKey === "breakEvenUnits"
                        ? formatPlain(breakEvenUnits)
                        : formatPHP(
                              targetKey === "fixedCosts"
                                  ? fixedCosts
                                  : targetKey === "sellingPricePerUnit"
                                    ? sellingPricePerUnit
                                    : variableCostPerUnit
                          ),
                tone: "accent",
            },
            supportingResults: [
                {
                    title: "Contribution Margin / Unit",
                    value: formatPHP(sellingPricePerUnit - variableCostPerUnit),
                },
                { title: "Break-even Sales", value: formatPHP(computed.breakEvenSales) },
                {
                    title: "Practical Whole Units",
                    value: computed.practicalUnits.toLocaleString(),
                },
            ],
            formula:
                targetKey === "breakEvenUnits"
                    ? "Break-even Units = Fixed Costs / (Selling Price - Variable Cost)"
                    : targetKey === "fixedCosts"
                      ? "Fixed Costs = Break-even Units × (Selling Price - Variable Cost)"
                      : targetKey === "sellingPricePerUnit"
                        ? "Selling Price = Variable Cost + (Fixed Costs / Break-even Units)"
                        : "Variable Cost = Selling Price - (Fixed Costs / Break-even Units)",
            steps: [
                `Contribution margin per unit = ${formatPHP(sellingPricePerUnit)} - ${formatPHP(variableCostPerUnit)} = ${formatPHP(sellingPricePerUnit - variableCostPerUnit)}.`,
                `Break-even units = ${computed.breakEvenUnits.toFixed(4)} and break-even sales = ${formatPHP(computed.breakEvenSales)}.`,
                `Practical whole-unit target = ${computed.practicalUnits.toLocaleString()} units, or about ${formatPHP(computed.practicalSales)} in sales.`,
            ],
            interpretation: `The CVP structure is consistent with a mathematical break-even point of ${computed.breakEvenUnits.toFixed(2)} units and about ${formatPHP(computed.breakEvenSales)} in sales.`,
        };
    },
};

export const contributionMarginSolveDefinition: FormulaCalculatorDefinition = {
    id: "contribution-margin-solve",
    defaultTarget: "contributionMargin",
    fields: {
        sales: { key: "sales", label: "Sales", placeholder: "20000", kind: "money" },
        variableCosts: {
            key: "variableCosts",
            label: "Variable Costs",
            placeholder: "12000",
            kind: "money",
        },
        contributionMargin: {
            key: "contributionMargin",
            label: "Contribution Margin",
            placeholder: "8000",
            kind: "money",
        },
    },
    targets: [
        { key: "contributionMargin", label: "Contribution Margin", summary: "Measure how much sales remain after variable costs." },
        { key: "sales", label: "Sales", summary: "Back-solve sales when variable costs and contribution margin are known." },
        { key: "variableCosts", label: "Variable Costs", summary: "Back-solve variable costs when sales and contribution margin are known." },
    ],
    getInputKeys(targetKey: string) {
        switch (targetKey) {
            case "sales":
                return ["variableCosts", "contributionMargin"];
            case "variableCosts":
                return ["sales", "contributionMargin"];
            default:
                return ["sales", "variableCosts"];
        }
    },
    getEmptyState(targetKey: string) {
        return {
            title: "Contribution-margin solve mode",
            body: `Enter the visible CVP values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey: string, values: Record<string, number>) {
        let sales = values.sales;
        let variableCosts = values.variableCosts;
        let contributionMargin = values.contributionMargin;

        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        if (targetKey === "sales") {
            sales = contributionMargin + variableCosts;
        } else if (targetKey === "variableCosts") {
            variableCosts = sales - contributionMargin;
        } else {
            contributionMargin = sales - variableCosts;
        }

        if (![sales, variableCosts, contributionMargin].every((value) => Number.isFinite(value))) {
            return { error: "The selected values do not produce a valid contribution-margin answer." };
        }

        if (sales < 0 || variableCosts < 0) {
            return { error: "Sales and variable costs must remain non-negative." };
        }

        const ratio = sales === 0 ? null : (contributionMargin / sales) * 100;

        return {
            primaryResult: {
                title:
                    targetKey === "sales"
                        ? "Sales"
                        : targetKey === "variableCosts"
                          ? "Variable Costs"
                          : "Contribution Margin",
                value:
                    targetKey === "sales"
                        ? formatPHP(sales)
                        : targetKey === "variableCosts"
                          ? formatPHP(variableCosts)
                          : formatPHP(contributionMargin),
                tone: "accent",
            },
            supportingResults: [
                {
                    title: "Contribution Margin Ratio",
                    value: ratio === null ? "N/A" : formatPercent(ratio),
                },
            ],
            formula:
                targetKey === "contributionMargin"
                    ? "Contribution Margin = Sales - Variable Costs"
                    : targetKey === "sales"
                      ? "Sales = Variable Costs + Contribution Margin"
                      : "Variable Costs = Sales - Contribution Margin",
            steps: [
                `Sales = ${formatPHP(sales)} and variable costs = ${formatPHP(variableCosts)}.`,
                `Contribution margin = ${formatPHP(sales)} - ${formatPHP(variableCosts)} = ${formatPHP(contributionMargin)}.`,
                ratio === null
                    ? "The contribution-margin ratio is not defined when sales is zero."
                    : `Contribution-margin ratio = ${formatPHP(contributionMargin)} / ${formatPHP(sales)} = ${formatPercent(ratio)}.`,
            ],
            interpretation:
                ratio === null
                    ? `Contribution margin totals ${formatPHP(contributionMargin)}, but the ratio is not defined because sales are zero.`
                    : `Each peso of sales contributes about ${formatPercent(ratio)} toward fixed costs and profit.`,
        };
    },
};

export const straightLineDepreciationSolveDefinition: FormulaCalculatorDefinition = {
    id: "straight-line-depreciation-solve",
    defaultTarget: "annualDepreciation",
    fields: {
        cost: { key: "cost", label: "Asset Cost", placeholder: "50000", kind: "money" },
        salvageValue: {
            key: "salvageValue",
            label: "Salvage Value",
            placeholder: "5000",
            kind: "money",
        },
        usefulLife: {
            key: "usefulLife",
            label: "Useful Life (years)",
            placeholder: "5",
            kind: "time",
        },
        annualDepreciation: {
            key: "annualDepreciation",
            label: "Annual Depreciation",
            placeholder: "9000",
            kind: "money",
        },
    },
    targets: [
        { key: "annualDepreciation", label: "Annual Depreciation", summary: "Find the annual straight-line depreciation expense." },
        { key: "cost", label: "Asset Cost", summary: "Back-solve the original asset cost from depreciation, salvage value, and useful life." },
        { key: "salvageValue", label: "Salvage Value", summary: "Back-solve the salvage value implied by cost, useful life, and annual depreciation." },
        { key: "usefulLife", label: "Useful Life", summary: "Back-solve useful life from cost, salvage value, and annual straight-line depreciation." },
    ],
    getInputKeys(targetKey: string) {
        switch (targetKey) {
            case "cost":
                return ["salvageValue", "usefulLife", "annualDepreciation"];
            case "salvageValue":
                return ["cost", "usefulLife", "annualDepreciation"];
            case "usefulLife":
                return ["cost", "salvageValue", "annualDepreciation"];
            default:
                return ["cost", "salvageValue", "usefulLife"];
        }
    },
    getEmptyState(targetKey: string) {
        return {
            title: "Straight-line reverse solve",
            body: `Enter the remaining depreciation values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey: string, values: Record<string, number>) {
        let cost = values.cost;
        let salvageValue = values.salvageValue;
        let usefulLife = values.usefulLife;
        let annualDepreciation = values.annualDepreciation;

        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        if (targetKey === "cost") {
            cost = annualDepreciation * usefulLife + salvageValue;
        } else if (targetKey === "salvageValue") {
            salvageValue = cost - annualDepreciation * usefulLife;
        } else if (targetKey === "usefulLife") {
            if (annualDepreciation <= 0) {
                return { error: "Annual depreciation must be greater than zero when solving for useful life." };
            }

            usefulLife = (cost - salvageValue) / annualDepreciation;
        }

        if (cost < 0 || salvageValue < 0 || usefulLife <= 0) {
            return { error: "The solved straight-line value falls outside the normal depreciation domain." };
        }

        if (salvageValue > cost) {
            return { error: "Salvage value cannot exceed cost." };
        }

        const computed = computeStraightLineDepreciation({
            cost,
            salvageValue,
            usefulLifeYears: usefulLife,
        });
        annualDepreciation = computed.annualDepreciation;

        return {
            primaryResult: {
                title:
                    targetKey === "cost"
                        ? "Asset Cost"
                        : targetKey === "salvageValue"
                          ? "Salvage Value"
                          : targetKey === "usefulLife"
                            ? "Useful Life"
                            : "Annual Depreciation",
                value:
                    targetKey === "usefulLife"
                        ? `${formatPlain(usefulLife)} year(s)`
                        : formatPHP(
                              targetKey === "cost"
                                  ? cost
                                  : targetKey === "salvageValue"
                                    ? salvageValue
                                    : annualDepreciation
                          ),
                tone: "accent",
            },
            supportingResults: [
                { title: "Depreciable Cost", value: formatPHP(computed.depreciableCost) },
            ],
            formula:
                targetKey === "annualDepreciation"
                    ? "Annual Depreciation = (Cost - Salvage Value) / Useful Life"
                    : targetKey === "cost"
                      ? "Cost = (Annual Depreciation × Useful Life) + Salvage Value"
                      : targetKey === "salvageValue"
                        ? "Salvage Value = Cost - (Annual Depreciation × Useful Life)"
                        : "Useful Life = (Cost - Salvage Value) / Annual Depreciation",
            steps: [
                `Depreciable cost = ${formatPHP(cost)} - ${formatPHP(salvageValue)} = ${formatPHP(computed.depreciableCost)}.`,
                `Annual straight-line depreciation = ${formatPHP(computed.depreciableCost)} / ${formatPlain(usefulLife)} = ${formatPHP(annualDepreciation)}.`,
            ],
            interpretation: `Under straight-line depreciation, the asset depreciates by ${formatPHP(annualDepreciation)} each year over ${formatPlain(usefulLife)} year(s).`,
        };
    },
};

export const currentRatioSolveDefinition: FormulaCalculatorDefinition = {
    id: "current-ratio-solve",
    defaultTarget: "currentRatio",
    fields: {
        currentAssets: {
            key: "currentAssets",
            label: "Current Assets",
            placeholder: "250000",
            kind: "money",
        },
        currentLiabilities: {
            key: "currentLiabilities",
            label: "Current Liabilities",
            placeholder: "100000",
            kind: "money",
        },
        currentRatio: {
            key: "currentRatio",
            label: "Current Ratio",
            placeholder: "2.5",
            kind: "ratio",
        },
    },
    targets: [
        { key: "currentRatio", label: "Current Ratio", summary: "Measure short-term liquidity from current assets and current liabilities." },
        { key: "currentAssets", label: "Current Assets", summary: "Back-solve the current assets implied by a target current ratio and known current liabilities." },
        { key: "currentLiabilities", label: "Current Liabilities", summary: "Back-solve the current liabilities implied by current assets and a target current ratio." },
    ],
    getInputKeys(targetKey: string) {
        switch (targetKey) {
            case "currentAssets":
                return ["currentRatio", "currentLiabilities"];
            case "currentLiabilities":
                return ["currentRatio", "currentAssets"];
            default:
                return ["currentAssets", "currentLiabilities"];
        }
    },
    getEmptyState(targetKey: string) {
        return {
            title: "Current-ratio solve mode",
            body: `Enter the visible liquidity values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey: string, values: Record<string, number>) {
        let currentAssets = values.currentAssets;
        let currentLiabilities = values.currentLiabilities;
        let currentRatio = values.currentRatio;

        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        if (targetKey === "currentAssets") {
            currentAssets = currentRatio * currentLiabilities;
        } else if (targetKey === "currentLiabilities") {
            if (currentRatio === 0) {
                return { error: "Current ratio cannot be zero when solving for current liabilities." };
            }

            currentLiabilities = currentAssets / currentRatio;
        }

        if (currentAssets < 0 || currentLiabilities <= 0) {
            return { error: "Current assets cannot be negative and current liabilities must remain greater than zero." };
        }

        const computed = computeCurrentRatio({ currentAssets, currentLiabilities });
        currentRatio = computed.currentRatio;

        return {
            primaryResult: {
                title:
                    targetKey === "currentAssets"
                        ? "Current Assets"
                        : targetKey === "currentLiabilities"
                          ? "Current Liabilities"
                          : "Current Ratio",
                value:
                    targetKey === "currentRatio"
                        ? formatRatio(currentRatio)
                        : formatPHP(
                              targetKey === "currentAssets"
                                  ? currentAssets
                                  : currentLiabilities
                          ),
                tone: "accent",
            },
            supportingResults: [
                { title: "Working Capital", value: formatPHP(computed.workingCapital) },
            ],
            formula:
                targetKey === "currentRatio"
                    ? "Current Ratio = Current Assets / Current Liabilities"
                    : targetKey === "currentAssets"
                      ? "Current Assets = Current Ratio × Current Liabilities"
                      : "Current Liabilities = Current Assets / Current Ratio",
            steps: [
                `Current ratio = ${formatPHP(currentAssets)} / ${formatPHP(currentLiabilities)} = ${formatRatio(currentRatio)}.`,
                `Working capital = ${formatPHP(currentAssets)} - ${formatPHP(currentLiabilities)} = ${formatPHP(computed.workingCapital)}.`,
            ],
            interpretation:
                currentRatio >= 1
                    ? `A current ratio of ${formatRatio(currentRatio)} suggests current assets exceed current liabilities.`
                    : `A current ratio of ${formatRatio(currentRatio)} suggests current liabilities are heavy relative to current assets.`,
        };
    },
};

export const quickRatioSolveDefinition: FormulaCalculatorDefinition = {
    id: "quick-ratio-solve",
    defaultTarget: "quickRatio",
    fields: {
        cash: { key: "cash", label: "Cash", placeholder: "50000", kind: "money" },
        marketableSecurities: {
            key: "marketableSecurities",
            label: "Marketable Securities",
            placeholder: "25000",
            kind: "money",
        },
        netReceivables: {
            key: "netReceivables",
            label: "Net Receivables",
            placeholder: "40000",
            kind: "money",
        },
        currentLiabilities: {
            key: "currentLiabilities",
            label: "Current Liabilities",
            placeholder: "100000",
            kind: "money",
        },
        quickRatio: { key: "quickRatio", label: "Quick Ratio", placeholder: "1.15", kind: "ratio" },
    },
    targets: [
        { key: "quickRatio", label: "Quick Ratio", summary: "Measure immediate liquidity using quick assets and current liabilities." },
        { key: "currentLiabilities", label: "Current Liabilities", summary: "Back-solve current liabilities from quick assets and a target quick ratio." },
        { key: "cash", label: "Cash", summary: "Back-solve cash when the other quick-asset pieces and target quick ratio are known." },
        { key: "marketableSecurities", label: "Marketable Securities", summary: "Back-solve marketable securities for the target quick ratio." },
        { key: "netReceivables", label: "Net Receivables", summary: "Back-solve net receivables for the target quick ratio." },
    ],
    getInputKeys(targetKey: string) {
        switch (targetKey) {
            case "currentLiabilities":
                return ["quickRatio", "cash", "marketableSecurities", "netReceivables"];
            case "cash":
                return ["quickRatio", "currentLiabilities", "marketableSecurities", "netReceivables"];
            case "marketableSecurities":
                return ["quickRatio", "currentLiabilities", "cash", "netReceivables"];
            case "netReceivables":
                return ["quickRatio", "currentLiabilities", "cash", "marketableSecurities"];
            default:
                return ["cash", "marketableSecurities", "netReceivables", "currentLiabilities"];
        }
    },
    getEmptyState(targetKey: string) {
        return {
            title: "Quick-ratio solve mode",
            body: `Enter the visible quick-ratio values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey: string, values: Record<string, number>) {
        let cash = values.cash;
        let marketableSecurities = values.marketableSecurities;
        let netReceivables = values.netReceivables;
        let currentLiabilities = values.currentLiabilities;
        let quickRatio = values.quickRatio;

        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        const quickAssetsTarget = quickRatio * currentLiabilities;

        if (targetKey === "currentLiabilities") {
            if (quickRatio === 0) {
                return { error: "Quick ratio cannot be zero when solving for current liabilities." };
            }

            currentLiabilities =
                (cash + marketableSecurities + netReceivables) / quickRatio;
        } else if (targetKey === "cash") {
            cash = quickAssetsTarget - marketableSecurities - netReceivables;
        } else if (targetKey === "marketableSecurities") {
            marketableSecurities = quickAssetsTarget - cash - netReceivables;
        } else if (targetKey === "netReceivables") {
            netReceivables = quickAssetsTarget - cash - marketableSecurities;
        }

        if (
            cash < 0 ||
            marketableSecurities < 0 ||
            netReceivables < 0 ||
            currentLiabilities <= 0
        ) {
            return { error: "The solved quick-ratio input would fall below zero or create non-positive current liabilities." };
        }

        const computed = computeQuickRatio({
            cash,
            marketableSecurities,
            netReceivables,
            currentLiabilities,
        });
        quickRatio = computed.quickRatio;

        return {
            primaryResult: {
                title:
                    targetKey === "quickRatio"
                        ? "Quick Ratio"
                        : targetKey === "currentLiabilities"
                          ? "Current Liabilities"
                          : targetKey === "cash"
                            ? "Cash"
                            : targetKey === "marketableSecurities"
                              ? "Marketable Securities"
                              : "Net Receivables",
                value:
                    targetKey === "quickRatio"
                        ? formatRatio(quickRatio)
                        : formatPHP(
                              targetKey === "currentLiabilities"
                                  ? currentLiabilities
                                  : targetKey === "cash"
                                    ? cash
                                    : targetKey === "marketableSecurities"
                                      ? marketableSecurities
                                      : netReceivables
                          ),
                tone: "accent",
            },
            supportingResults: [
                { title: "Quick Assets", value: formatPHP(computed.quickAssets) },
            ],
            formula:
                targetKey === "quickRatio"
                    ? "Quick Ratio = (Cash + Marketable Securities + Net Receivables) / Current Liabilities"
                    : "Quick Assets = Quick Ratio × Current Liabilities",
            steps: [
                `Quick assets = ${formatPHP(cash)} + ${formatPHP(marketableSecurities)} + ${formatPHP(netReceivables)} = ${formatPHP(computed.quickAssets)}.`,
                `Quick ratio = ${formatPHP(computed.quickAssets)} / ${formatPHP(currentLiabilities)} = ${formatRatio(quickRatio)}.`,
            ],
            interpretation:
                quickRatio >= 1
                    ? `A quick ratio of ${formatRatio(quickRatio)} suggests the entity can cover current liabilities using its most liquid assets.`
                    : `A quick ratio of ${formatRatio(quickRatio)} suggests liquid assets may not fully cover current liabilities.`,
        };
    },
};

export const grossProfitRateSolveDefinition: FormulaCalculatorDefinition = {
    id: "gross-profit-rate-solve",
    defaultTarget: "grossProfitRate",
    fields: {
        netSales: { key: "netSales", label: "Net Sales", placeholder: "150000", kind: "money" },
        costOfGoodsSold: {
            key: "costOfGoodsSold",
            label: "Cost of Goods Sold",
            placeholder: "90000",
            kind: "money",
        },
        grossProfitRate: {
            key: "grossProfitRate",
            label: "Gross Profit Rate (%)",
            placeholder: "40",
            kind: "percent",
        },
    },
    targets: [
        { key: "grossProfitRate", label: "Gross Profit Rate", summary: "Measure how much of each sales peso remains after cost of goods sold." },
        { key: "netSales", label: "Net Sales", summary: "Back-solve net sales using cost of goods sold and a target gross profit rate." },
        { key: "costOfGoodsSold", label: "Cost of Goods Sold", summary: "Back-solve cost of goods sold using net sales and a target gross profit rate." },
    ],
    getInputKeys(targetKey) {
        switch (targetKey) {
            case "netSales":
                return ["costOfGoodsSold", "grossProfitRate"];
            case "costOfGoodsSold":
                return ["netSales", "grossProfitRate"];
            default:
                return ["netSales", "costOfGoodsSold"];
        }
    },
    getEmptyState(targetKey) {
        return {
            title: "Gross-profit-rate solve mode",
            body: `Enter the visible merchandising values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        let netSales = values.netSales;
        let costOfGoodsSold = values.costOfGoodsSold;
        let grossProfitRate = values.grossProfitRate;

        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        if (targetKey === "netSales") {
            if (grossProfitRate >= 100) {
                return { error: "Gross profit rate must stay below 100% when solving for net sales." };
            }

            netSales = costOfGoodsSold / (1 - grossProfitRate / 100);
        } else if (targetKey === "costOfGoodsSold") {
            costOfGoodsSold = netSales * (1 - grossProfitRate / 100);
        }

        if (netSales <= 0 || costOfGoodsSold < 0) {
            return { error: "Net sales must be greater than zero and cost of goods sold cannot be negative." };
        }

        const computed = computeGrossProfitRate(netSales, costOfGoodsSold);
        grossProfitRate = computed.grossProfitRate;

        return {
            primaryResult: {
                title:
                    targetKey === "netSales"
                        ? "Net Sales"
                        : targetKey === "costOfGoodsSold"
                          ? "Cost of Goods Sold"
                          : "Gross Profit Rate",
                value:
                    targetKey === "grossProfitRate"
                        ? formatPercent(grossProfitRate)
                        : formatPHP(
                              targetKey === "netSales" ? netSales : costOfGoodsSold
                          ),
                tone: "accent",
            },
            supportingResults: [
                { title: "Gross Profit", value: formatPHP(computed.grossProfit) },
            ],
            formula:
                targetKey === "grossProfitRate"
                    ? "Gross Profit Rate = (Net Sales - Cost of Goods Sold) / Net Sales"
                    : targetKey === "netSales"
                      ? "Net Sales = Cost of Goods Sold / (1 - Gross Profit Rate)"
                      : "Cost of Goods Sold = Net Sales × (1 - Gross Profit Rate)",
            steps: [
                `Gross profit = ${formatPHP(netSales)} - ${formatPHP(costOfGoodsSold)} = ${formatPHP(computed.grossProfit)}.`,
                `Gross profit rate = ${formatPHP(computed.grossProfit)} / ${formatPHP(netSales)} = ${formatPercent(grossProfitRate)}.`,
            ],
            interpretation: `The merchandising data leaves ${formatPercent(grossProfitRate)} of net sales as gross profit before operating expenses.`,
        };
    },
};

function createReturnDefinition(options: {
    id: string;
    ratioKey: string;
    ratioLabel: string;
    denominatorKey: string;
    denominatorLabel: string;
}) {
    return {
        id: options.id,
        defaultTarget: options.ratioKey,
        fields: {
            netIncome: {
                key: "netIncome",
                label: "Net Income",
                placeholder: "85000",
                kind: "money",
            },
            [options.denominatorKey]: {
                key: options.denominatorKey,
                label: options.denominatorLabel,
                placeholder: "500000",
                kind: "money",
            },
            [options.ratioKey]: {
                key: options.ratioKey,
                label: `${options.ratioLabel} (%)`,
                placeholder: "17",
                kind: "percent",
            },
        },
        targets: [
            {
                key: options.ratioKey,
                label: options.ratioLabel,
                summary: `Measure ${options.ratioLabel.toLowerCase()} from net income and ${options.denominatorLabel.toLowerCase()}.`,
            },
            {
                key: "netIncome",
                label: "Net Income",
                summary: `Back-solve net income from ${options.denominatorLabel.toLowerCase()} and the target ${options.ratioLabel.toLowerCase()}.`,
            },
            {
                key: options.denominatorKey,
                label: options.denominatorLabel,
                summary: `Back-solve ${options.denominatorLabel.toLowerCase()} from net income and the target ${options.ratioLabel.toLowerCase()}.`,
            },
        ],
        getInputKeys(targetKey: string) {
            if (targetKey === "netIncome") return [options.denominatorKey, options.ratioKey];
            if (targetKey === options.denominatorKey) return ["netIncome", options.ratioKey];
            return ["netIncome", options.denominatorKey];
        },
        getEmptyState(targetKey: string) {
            return {
                title: `${options.ratioLabel} solve mode`,
                body: `Enter the visible profitability values to solve for ${targetKey}.`,
            };
        },
        solve(targetKey: string, values: Record<string, number>) {
            let netIncome = values.netIncome;
            let denominator = values[options.denominatorKey];
            let ratio = values[options.ratioKey];

            if (Object.values(values).some((value) => Number.isNaN(value))) {
                return invalidNumberError();
            }

            if (targetKey === "netIncome") {
                netIncome = (ratio / 100) * denominator;
            } else if (targetKey === options.denominatorKey) {
                if (ratio === 0) {
                    return { error: `${options.ratioLabel} cannot be zero when solving for ${options.denominatorLabel.toLowerCase()}.` };
                }

                denominator = netIncome / (ratio / 100);
            } else {
                if (denominator <= 0) {
                    return { error: `${options.denominatorLabel} must be greater than zero.` };
                }

                ratio = (netIncome / denominator) * 100;
            }

            if (!Number.isFinite(netIncome) || !Number.isFinite(denominator) || denominator <= 0) {
                return { error: `The selected values do not produce a valid ${options.ratioLabel.toLowerCase()} answer.` };
            }

            ratio = (netIncome / denominator) * 100;

            return {
                primaryResult: {
                    title:
                        targetKey === options.ratioKey
                            ? options.ratioLabel
                            : targetKey === "netIncome"
                              ? "Net Income"
                              : options.denominatorLabel,
                    value:
                        targetKey === options.ratioKey
                            ? formatPercent(ratio)
                            : formatPHP(targetKey === "netIncome" ? netIncome : denominator),
                    tone: "accent",
                },
                supportingResults: [
                    { title: "Net Income", value: formatPHP(netIncome) },
                    { title: options.denominatorLabel, value: formatPHP(denominator) },
                ],
                formula:
                    targetKey === options.ratioKey
                        ? `${options.ratioLabel} = Net Income / ${options.denominatorLabel}`
                        : targetKey === "netIncome"
                          ? `Net Income = ${options.ratioLabel} × ${options.denominatorLabel}`
                          : `${options.denominatorLabel} = Net Income / ${options.ratioLabel}`,
                steps: [
                    `${options.ratioLabel} = ${formatPHP(netIncome)} / ${formatPHP(denominator)} = ${formatPercent(ratio)}.`,
                ],
                interpretation: `${options.ratioLabel} is ${formatPercent(ratio)}, meaning the business earns ${formatPercent(ratio)} of ${options.denominatorLabel.toLowerCase()} as net income.`,
            };
        },
    } satisfies FormulaCalculatorDefinition;
}

export const returnOnAssetsSolveDefinition = createReturnDefinition({
    id: "return-on-assets-solve",
    ratioKey: "returnOnAssets",
    ratioLabel: "Return on Assets",
    denominatorKey: "averageTotalAssets",
    denominatorLabel: "Average Total Assets",
});

export const returnOnEquitySolveDefinition = createReturnDefinition({
    id: "return-on-equity-solve",
    ratioKey: "returnOnEquity",
    ratioLabel: "Return on Equity",
    denominatorKey: "averageEquity",
    denominatorLabel: "Average Equity",
});

function createTurnoverDefinition(options: {
    id: string;
    numeratorKey: string;
    numeratorLabel: string;
    denominatorKey: string;
    denominatorLabel: string;
    ratioKey: string;
    ratioLabel: string;
    dayLabel: string;
}) {
    return {
        id: options.id,
        defaultTarget: options.ratioKey,
        fields: {
            [options.numeratorKey]: {
                key: options.numeratorKey,
                label: options.numeratorLabel,
                placeholder: "300000",
                kind: "money",
            },
            [options.denominatorKey]: {
                key: options.denominatorKey,
                label: options.denominatorLabel,
                placeholder: "60000",
                kind: "money",
            },
            [options.ratioKey]: {
                key: options.ratioKey,
                label: options.ratioLabel,
                placeholder: "5",
                kind: "number",
            },
        },
        targets: [
            {
                key: options.ratioKey,
                label: options.ratioLabel,
                summary: `Compute ${options.ratioLabel.toLowerCase()} and its day-based reading.`,
            },
            {
                key: options.numeratorKey,
                label: options.numeratorLabel,
                summary: `Back-solve ${options.numeratorLabel.toLowerCase()} from turnover and the average base.`,
            },
            {
                key: options.denominatorKey,
                label: options.denominatorLabel,
                summary: `Back-solve ${options.denominatorLabel.toLowerCase()} from turnover and the numerator.`,
            },
        ],
        getInputKeys(targetKey: string) {
            if (targetKey === options.numeratorKey) {
                return [options.denominatorKey, options.ratioKey];
            }

            if (targetKey === options.denominatorKey) {
                return [options.numeratorKey, options.ratioKey];
            }

            return [options.numeratorKey, options.denominatorKey];
        },
        getEmptyState(targetKey: string) {
            return {
                title: `${options.ratioLabel} solve mode`,
                body: `Enter the visible turnover values to solve for ${targetKey}.`,
            };
        },
        solve(targetKey: string, values: Record<string, number>) {
            let numerator = values[options.numeratorKey];
            let denominator = values[options.denominatorKey];
            let ratio = values[options.ratioKey];

            if (Object.values(values).some((value) => Number.isNaN(value))) {
                return invalidNumberError();
            }

            if (targetKey === options.numeratorKey) {
                numerator = ratio * denominator;
            } else if (targetKey === options.denominatorKey) {
                if (ratio === 0) {
                    return { error: `${options.ratioLabel} cannot be zero when solving for ${options.denominatorLabel.toLowerCase()}.` };
                }

                denominator = numerator / ratio;
            }

            if (numerator < 0 || denominator <= 0) {
                return { error: `The solved ${options.numeratorLabel.toLowerCase()} or ${options.denominatorLabel.toLowerCase()} falls outside the normal turnover domain.` };
            }

            const turnover = computeTurnoverWithDayBasis({
                numerator,
                denominator,
            });
            ratio = turnover.turnover;

            return {
                primaryResult: {
                    title:
                        targetKey === options.ratioKey
                            ? options.ratioLabel
                            : targetKey === options.numeratorKey
                                ? options.numeratorLabel
                                : options.denominatorLabel,
                    value:
                        targetKey === options.ratioKey
                            ? formatTimes(ratio)
                            : formatPHP(
                                    targetKey === options.numeratorKey
                                        ? numerator
                                        : denominator
                              ),
                    tone: "accent",
                },
                supportingResults: [
                    { title: options.dayLabel, value: formatDays(turnover.days) },
                ],
                formula:
                    targetKey === options.ratioKey
                            ? `${options.ratioLabel} = ${options.numeratorLabel} / ${options.denominatorLabel}`
                            : targetKey === options.numeratorKey
                            ? `${options.numeratorLabel} = ${options.ratioLabel} × ${options.denominatorLabel}`
                            : `${options.denominatorLabel} = ${options.numeratorLabel} / ${options.ratioLabel}`,
                steps: [
                    `${options.ratioLabel} = ${formatPHP(numerator)} / ${formatPHP(denominator)} = ${formatTimes(ratio)}.`,
                    `${options.dayLabel} = 365 / ${formatTimes(ratio)} = ${formatDays(turnover.days)}.`,
                ],
                interpretation: `${options.ratioLabel} is ${formatTimes(ratio)}, which implies ${options.dayLabel.toLowerCase()} of about ${formatDays(turnover.days)}.`,
                assumptions: ["This turnover workspace uses a 365-day year for the day-based reading."],
            };
        },
    } satisfies FormulaCalculatorDefinition;
}

export const inventoryTurnoverSolveDefinition = createTurnoverDefinition({
    id: "inventory-turnover-solve",
    numeratorKey: "costOfGoodsSold",
    numeratorLabel: "Cost of Goods Sold",
    denominatorKey: "averageInventory",
    denominatorLabel: "Average Inventory",
    ratioKey: "inventoryTurnover",
    ratioLabel: "Inventory Turnover",
    dayLabel: "Days in Inventory",
});

export const receivablesTurnoverSolveDefinition = createTurnoverDefinition({
    id: "receivables-turnover-solve",
    numeratorKey: "netCreditSales",
    numeratorLabel: "Net Credit Sales",
    denominatorKey: "averageAccountsReceivable",
    denominatorLabel: "Average Accounts Receivable",
    ratioKey: "receivablesTurnover",
    ratioLabel: "Receivables Turnover",
    dayLabel: "Average Collection Period",
});

export const retainedEarningsRollforwardSolveDefinition: FormulaCalculatorDefinition = {
    id: "retained-earnings-rollforward-solve",
    defaultTarget: "endingRetainedEarnings",
    fields: {
        beginningRetainedEarnings: {
            key: "beginningRetainedEarnings",
            label: "Beginning Retained Earnings",
            placeholder: "500000",
            kind: "money",
        },
        netIncome: { key: "netIncome", label: "Net Income", placeholder: "125000", kind: "money" },
        dividendsDeclared: {
            key: "dividendsDeclared",
            label: "Dividends Declared",
            placeholder: "40000",
            kind: "money",
        },
        priorPeriodAdjustment: {
            key: "priorPeriodAdjustment",
            label: "Prior Period Adjustment",
            placeholder: "0",
            kind: "money",
            helperText: "Use a negative amount when the correction reduces retained earnings.",
        },
        endingRetainedEarnings: {
            key: "endingRetainedEarnings",
            label: "Ending Retained Earnings",
            placeholder: "585000",
            kind: "money",
        },
    },
    targets: [
        {
            key: "endingRetainedEarnings",
            label: "Ending RE",
            summary: "Roll beginning retained earnings into the ending balance after income, dividends, and prior-period corrections.",
        },
        {
            key: "beginningRetainedEarnings",
            label: "Beginning RE",
            summary: "Back-solve the opening retained earnings balance.",
        },
        {
            key: "netIncome",
            label: "Net Income",
            summary: "Solve the net income needed to reach the ending retained earnings balance.",
        },
        {
            key: "dividendsDeclared",
            label: "Dividends",
            summary: "Solve the dividends declared that reconcile beginning and ending retained earnings.",
        },
    ],
    getInputKeys(targetKey) {
        switch (targetKey) {
            case "beginningRetainedEarnings":
                return ["netIncome", "dividendsDeclared", "priorPeriodAdjustment", "endingRetainedEarnings"];
            case "netIncome":
                return ["beginningRetainedEarnings", "dividendsDeclared", "priorPeriodAdjustment", "endingRetainedEarnings"];
            case "dividendsDeclared":
                return ["beginningRetainedEarnings", "netIncome", "priorPeriodAdjustment", "endingRetainedEarnings"];
            default:
                return ["beginningRetainedEarnings", "netIncome", "dividendsDeclared", "priorPeriodAdjustment"];
        }
    },
    getEmptyState(targetKey) {
        return {
            title: "Retained earnings rollforward",
            body: `Enter the visible equity amounts to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        let beginningRetainedEarnings = values.beginningRetainedEarnings;
        let netIncome = values.netIncome;
        let dividendsDeclared = values.dividendsDeclared;
        const priorPeriodAdjustment = values.priorPeriodAdjustment ?? 0;
        let endingRetainedEarnings = values.endingRetainedEarnings;

        if (targetKey === "beginningRetainedEarnings") {
            beginningRetainedEarnings =
                endingRetainedEarnings - netIncome - priorPeriodAdjustment + dividendsDeclared;
        } else if (targetKey === "netIncome") {
            netIncome =
                endingRetainedEarnings - beginningRetainedEarnings - priorPeriodAdjustment + dividendsDeclared;
        } else if (targetKey === "dividendsDeclared") {
            dividendsDeclared =
                beginningRetainedEarnings + netIncome + priorPeriodAdjustment - endingRetainedEarnings;
        } else {
            endingRetainedEarnings = computeRetainedEarningsRollforward({
                beginningRetainedEarnings,
                netIncome,
                dividendsDeclared,
                priorPeriodAdjustment,
            }).endingRetainedEarnings;
        }

        const recomputed = computeRetainedEarningsRollforward({
            beginningRetainedEarnings,
            netIncome,
            dividendsDeclared,
            priorPeriodAdjustment,
        });

        return {
            primaryResult: {
                title:
                    targetKey === "beginningRetainedEarnings"
                        ? "Beginning Retained Earnings"
                        : targetKey === "netIncome"
                          ? "Net Income"
                          : targetKey === "dividendsDeclared"
                            ? "Dividends Declared"
                            : "Ending Retained Earnings",
                value:
                    targetKey === "beginningRetainedEarnings"
                        ? formatPHP(beginningRetainedEarnings)
                        : targetKey === "netIncome"
                          ? formatPHP(netIncome)
                          : targetKey === "dividendsDeclared"
                            ? formatPHP(dividendsDeclared)
                            : formatPHP(endingRetainedEarnings),
                tone: "accent",
            },
            supportingResults: [
                { title: "Net Income Retained", value: formatPHP(recomputed.netIncomeRetained) },
                { title: "Prior Adjustment", value: formatPHP(priorPeriodAdjustment) },
            ],
            formula: "Ending RE = Beginning RE + Net Income + Prior Period Adjustment - Dividends",
            steps: [
                `Start with beginning retained earnings of ${formatPHP(beginningRetainedEarnings)}.`,
                `Add net income of ${formatPHP(netIncome)} and prior-period adjustment of ${formatPHP(priorPeriodAdjustment)}.`,
                `Subtract dividends declared of ${formatPHP(dividendsDeclared)} to reach ending retained earnings of ${formatPHP(recomputed.endingRetainedEarnings)}.`,
            ],
            glossary: [
                { term: "Retained earnings", meaning: "Cumulative profits kept in the business rather than distributed to owners." },
                { term: "Prior period adjustment", meaning: "Correction of an error or change applied directly to retained earnings rather than current-period profit." },
            ],
            interpretation: `This rollforward explains how the equity balance moved from ${formatPHP(beginningRetainedEarnings)} to ${formatPHP(recomputed.endingRetainedEarnings)} after current-period results and distributions.`,
            assumptions: [
                "This layout assumes a simple retained-earnings rollforward and does not separate other comprehensive income or treasury-share movements.",
            ],
            notes: [
                "Use this as support for the statement of changes in equity, dividend questions, and retained-earnings reconciliation items.",
            ],
        };
    },
};

export const percentageTaxSolveDefinition: FormulaCalculatorDefinition = {
    id: "percentage-tax-solve",
    defaultTarget: "taxDue",
    fields: {
        taxableSales: { key: "taxableSales", label: "Taxable Sales", placeholder: "250000", kind: "money" },
        ratePercent: {
            key: "ratePercent",
            label: "Rate (%)",
            placeholder: String(PHILIPPINE_TAX_ASSUMPTIONS.percentageTax.defaultRatePercent),
            kind: "percent",
            helperText: "Use the rate applicable to the percentage-tax scenario being reviewed.",
        },
        taxDue: { key: "taxDue", label: "Percentage Tax Due", placeholder: "7500", kind: "money" },
    },
    targets: [
        { key: "taxDue", label: "Tax Due", summary: "Compute the percentage tax due from taxable sales and the applicable rate." },
        { key: "taxableSales", label: "Taxable Sales", summary: "Back-solve taxable sales when the tax due and rate are known." },
        { key: "ratePercent", label: "Rate", summary: "Back-solve the implied percentage-tax rate." },
    ],
    getInputKeys(targetKey) {
        if (targetKey === "taxableSales") return ["taxDue", "ratePercent"];
        if (targetKey === "ratePercent") return ["taxableSales", "taxDue"];
        return ["taxableSales", "ratePercent"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Percentage-tax check",
            body: `Enter the visible values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        let taxableSales = values.taxableSales;
        let ratePercent = values.ratePercent;
        let taxDue = values.taxDue;

        if (targetKey === "taxableSales") {
            if (ratePercent <= 0) return { error: "Rate must be greater than zero when solving for taxable sales." };
            taxableSales = taxDue / (ratePercent / 100);
        } else if (targetKey === "ratePercent") {
            if (taxableSales <= 0) return { error: "Taxable sales must be greater than zero when solving for the rate." };
            ratePercent = (taxDue / taxableSales) * 100;
        } else {
            taxDue = computePercentageTax({ taxableSales, ratePercent }).taxDue;
        }

        const computed = computePercentageTax({ taxableSales, ratePercent });

        return {
            primaryResult: {
                title:
                    targetKey === "taxableSales"
                        ? "Taxable Sales"
                        : targetKey === "ratePercent"
                          ? "Rate"
                          : "Percentage Tax Due",
                value:
                    targetKey === "taxableSales"
                        ? formatPHP(taxableSales)
                        : targetKey === "ratePercent"
                          ? formatPercent(ratePercent)
                          : formatPHP(taxDue),
                tone: "accent",
            },
            supportingResults: [
                { title: "Rate (decimal)", value: computed.rateDecimal.toFixed(4) },
                { title: "Amount Including Tax", value: formatPHP(computed.totalWithTax) },
            ],
            formula:
                targetKey === "taxDue"
                    ? "Tax Due = Taxable Sales × Rate"
                    : targetKey === "taxableSales"
                      ? "Taxable Sales = Tax Due / Rate"
                      : "Rate = Tax Due / Taxable Sales",
            steps: [
                `Convert ${formatPercent(ratePercent)} to ${computed.rateDecimal.toFixed(4)} in decimal form.`,
                `Percentage tax due = ${formatPHP(taxableSales)} × ${computed.rateDecimal.toFixed(4)} = ${formatPHP(computed.taxDue)}.`,
            ],
            interpretation: `The selected values imply percentage tax of ${formatPHP(computed.taxDue)} on taxable sales of ${formatPHP(taxableSales)}.`,
            assumptions: buildTaxAssumptionNotes(
                PHILIPPINE_TAX_ASSUMPTIONS.percentageTax,
                ["This tool is for percentage-tax drills and assumes the tax base is already identified correctly for the scenario."]
            ),
            warnings: [
                "Check whether the case should use VAT, percentage tax, or a special tax regime before relying on this result.",
            ],
        };
    },
};

export const accountingRateOfReturnSolveDefinition: FormulaCalculatorDefinition = {
    id: "accounting-rate-of-return-solve",
    defaultTarget: "accountingRateOfReturnPercent",
    fields: {
        averageAnnualAccountingIncome: {
            key: "averageAnnualAccountingIncome",
            label: "Average Annual Accounting Income",
            placeholder: "60000",
            kind: "money",
        },
        initialInvestment: { key: "initialInvestment", label: "Initial Investment", placeholder: "400000", kind: "money" },
        salvageValue: {
            key: "salvageValue",
            label: "Salvage Value",
            placeholder: "40000",
            kind: "money",
        },
        accountingRateOfReturnPercent: {
            key: "accountingRateOfReturnPercent",
            label: "ARR (%)",
            placeholder: "27.27",
            kind: "percent",
        },
    },
    targets: [
        { key: "accountingRateOfReturnPercent", label: "ARR", summary: "Compute the accounting rate of return from average accounting income and average investment." },
        { key: "averageAnnualAccountingIncome", label: "Income", summary: "Back-solve the average annual accounting income implied by the ARR target." },
        { key: "initialInvestment", label: "Initial Investment", summary: "Back-solve the initial investment while keeping the salvage estimate visible." },
    ],
    getInputKeys(targetKey) {
        if (targetKey === "averageAnnualAccountingIncome") return ["initialInvestment", "salvageValue", "accountingRateOfReturnPercent"];
        if (targetKey === "initialInvestment") return ["averageAnnualAccountingIncome", "salvageValue", "accountingRateOfReturnPercent"];
        return ["averageAnnualAccountingIncome", "initialInvestment", "salvageValue"];
    },
    getEmptyState(targetKey) {
        return {
            title: "ARR calculator",
            body: `Enter the visible project values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        let averageAnnualAccountingIncome = values.averageAnnualAccountingIncome;
        let initialInvestment = values.initialInvestment;
        const salvageValue = values.salvageValue ?? 0;
        let accountingRateOfReturnPercent = values.accountingRateOfReturnPercent;

        if (targetKey === "averageAnnualAccountingIncome") {
            averageAnnualAccountingIncome =
                ((initialInvestment + salvageValue) / 2) * (accountingRateOfReturnPercent / 100);
        } else if (targetKey === "initialInvestment") {
            if (accountingRateOfReturnPercent <= 0) {
                return { error: "ARR must be greater than zero when solving for initial investment." };
            }
            initialInvestment =
                (2 * averageAnnualAccountingIncome) / (accountingRateOfReturnPercent / 100) - salvageValue;
        } else {
            accountingRateOfReturnPercent = computeAccountingRateOfReturn({
                averageAnnualAccountingIncome,
                initialInvestment,
                salvageValue,
            }).accountingRateOfReturnPercent;
        }

        const computed = computeAccountingRateOfReturn({
            averageAnnualAccountingIncome,
            initialInvestment,
            salvageValue,
        });

        return {
            primaryResult: {
                title:
                    targetKey === "averageAnnualAccountingIncome"
                        ? "Average Annual Accounting Income"
                        : targetKey === "initialInvestment"
                          ? "Initial Investment"
                          : "ARR",
                value:
                    targetKey === "averageAnnualAccountingIncome"
                        ? formatPHP(averageAnnualAccountingIncome)
                        : targetKey === "initialInvestment"
                          ? formatPHP(initialInvestment)
                          : formatPercent(accountingRateOfReturnPercent),
                tone: "accent",
            },
            supportingResults: [
                { title: "Average Investment", value: formatPHP(computed.averageInvestment) },
                { title: "Salvage Value", value: formatPHP(salvageValue) },
            ],
            formula: "ARR = Average Annual Accounting Income / Average Investment",
            steps: [
                `Average investment = (${formatPHP(initialInvestment)} + ${formatPHP(salvageValue)}) / 2 = ${formatPHP(computed.averageInvestment)}.`,
                `ARR = ${formatPHP(averageAnnualAccountingIncome)} / ${formatPHP(computed.averageInvestment)} = ${formatPercent(computed.accountingRateOfReturnPercent)}.`,
            ],
            interpretation: `The project earns about ${formatPercent(computed.accountingRateOfReturnPercent)} on its average invested amount based on accounting income, not discounted cash flow.`,
            assumptions: [
                "ARR is accounting-based and does not discount cash flows, so it should not replace NPV or IRR for time-value-sensitive decisions.",
            ],
            notes: [
                "This measure is often used in class alongside payback, NPV, PI, and IRR to compare how accounting-based and cash-flow-based rankings differ.",
            ],
        };
    },
};

export const equivalentAnnualAnnuitySolveDefinition: FormulaCalculatorDefinition = {
    id: "equivalent-annual-annuity-solve",
    defaultTarget: "equivalentAnnualAnnuity",
    fields: {
        netPresentValue: { key: "netPresentValue", label: "Net Present Value", placeholder: "180000", kind: "money" },
        discountRatePercent: { key: "discountRatePercent", label: "Discount Rate (%)", placeholder: "10", kind: "percent" },
        projectLife: { key: "projectLife", label: "Project Life (years)", placeholder: "5", kind: "time" },
        equivalentAnnualAnnuity: { key: "equivalentAnnualAnnuity", label: "Equivalent Annual Annuity", placeholder: "47482.34", kind: "money" },
    },
    targets: [
        { key: "equivalentAnnualAnnuity", label: "EAA", summary: "Convert NPV into an annual equivalent amount for mutually exclusive projects with different lives." },
        { key: "netPresentValue", label: "NPV", summary: "Back-solve the NPV that corresponds to the annual equivalent amount." },
    ],
    getInputKeys(targetKey) {
        return targetKey === "netPresentValue"
            ? ["equivalentAnnualAnnuity", "discountRatePercent", "projectLife"]
            : ["netPresentValue", "discountRatePercent", "projectLife"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Equivalent annual annuity",
            body: `Enter the visible capital-budgeting values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        let netPresentValue = values.netPresentValue;
        const discountRatePercent = values.discountRatePercent;
        const projectLife = values.projectLife;
        let equivalentAnnualAnnuity = values.equivalentAnnualAnnuity;

        if (projectLife <= 0) return { error: "Project life must be greater than zero." };
        if (discountRatePercent < 0) return { error: "Discount rate cannot be negative." };

        const computedForInputs = computeEquivalentAnnualAnnuity({
            netPresentValue: targetKey === "netPresentValue" ? 1 : netPresentValue,
            discountRatePercent,
            projectLife,
        });

        if (targetKey === "netPresentValue") {
            netPresentValue = equivalentAnnualAnnuity * computedForInputs.annuityFactor;
        } else {
            equivalentAnnualAnnuity = computeEquivalentAnnualAnnuity({
                netPresentValue,
                discountRatePercent,
                projectLife,
            }).equivalentAnnualAnnuity;
        }

        const computed = computeEquivalentAnnualAnnuity({
            netPresentValue,
            discountRatePercent,
            projectLife,
        });

        return {
            primaryResult: {
                title: targetKey === "netPresentValue" ? "Net Present Value" : "Equivalent Annual Annuity",
                value:
                    targetKey === "netPresentValue"
                        ? formatPHP(netPresentValue)
                        : formatPHP(equivalentAnnualAnnuity),
                tone: "accent",
            },
            supportingResults: [
                { title: "Annuity Factor", value: formatPlain(computed.annuityFactor, 4) },
                { title: "Project Life", value: `${formatPlain(projectLife)} year(s)` },
            ],
            formula: "EAA = NPV / Present Value Annuity Factor",
            steps: [
                `Annuity factor at ${formatPercent(discountRatePercent)} for ${formatPlain(projectLife)} year(s) = ${formatPlain(computed.annuityFactor, 4)}.`,
                `Equivalent annual annuity = ${formatPHP(netPresentValue)} / ${formatPlain(computed.annuityFactor, 4)} = ${formatPHP(computed.equivalentAnnualAnnuity)}.`,
            ],
            interpretation: `Use the annual equivalent amount of ${formatPHP(computed.equivalentAnnualAnnuity)} when comparing projects that have unequal lives but similar risk and timing assumptions.`,
            assumptions: [
                "EAA assumes the project can be repeated on similar terms and that the discount rate stays relevant across the compared lives.",
            ],
            notes: [
                "This is most useful after NPV is already known and you need a same-length annualized comparison for mutually exclusive projects.",
            ],
        };
    },
};

export const pettyCashReconciliationSolveDefinition: FormulaCalculatorDefinition = {
    id: "petty-cash-reconciliation-solve",
    defaultTarget: "shortageOrOverage",
    fields: {
        fundAmount: { key: "fundAmount", label: "Petty Cash Fund", placeholder: "5000", kind: "money" },
        cashOnHand: { key: "cashOnHand", label: "Cash on Hand", placeholder: "3200", kind: "money" },
        pettyCashVouchers: { key: "pettyCashVouchers", label: "Petty Cash Vouchers", placeholder: "1650", kind: "money" },
        stampsOnHand: { key: "stampsOnHand", label: "Stamps on Hand", placeholder: "50", kind: "money" },
        otherReceipts: { key: "otherReceipts", label: "Other Receipts", placeholder: "0", kind: "money" },
        shortageOrOverage: { key: "shortageOrOverage", label: "Short / Over", placeholder: "0", kind: "money" },
    },
    targets: [
        { key: "shortageOrOverage", label: "Short / Over", summary: "Check whether the petty cash count is short, over, or exactly balanced." },
        { key: "fundAmount", label: "Fund Amount", summary: "Back-solve the authorized petty cash fund from the count and shortage-or-overage." },
    ],
    getInputKeys(targetKey) {
        return targetKey === "fundAmount"
            ? ["cashOnHand", "pettyCashVouchers", "stampsOnHand", "otherReceipts", "shortageOrOverage"]
            : ["fundAmount", "cashOnHand", "pettyCashVouchers", "stampsOnHand", "otherReceipts"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Petty cash count check",
            body: `Enter the petty cash count details to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        let fundAmount = values.fundAmount;
        const cashOnHand = values.cashOnHand;
        const pettyCashVouchers = values.pettyCashVouchers;
        const stampsOnHand = values.stampsOnHand ?? 0;
        const otherReceipts = values.otherReceipts ?? 0;
        let shortageOrOverage = values.shortageOrOverage ?? 0;
        const countedTotal = cashOnHand + pettyCashVouchers + stampsOnHand + otherReceipts;

        if (targetKey === "fundAmount") {
            fundAmount = countedTotal - shortageOrOverage;
        } else {
            shortageOrOverage = countedTotal - fundAmount;
        }

        const computed = computePettyCashReconciliation({
            fundAmount,
            cashOnHand,
            pettyCashVouchers,
            stampsOnHand,
            otherReceipts,
        });
        const shortOverLabel =
            computed.shortageOrOverage === 0
                ? "Balanced"
                : computed.shortageOrOverage > 0
                  ? "Over"
                  : "Short";

        return {
            primaryResult: {
                title: targetKey === "fundAmount" ? "Petty Cash Fund" : "Short / Over",
                value:
                    targetKey === "fundAmount"
                        ? formatPHP(fundAmount)
                        : `${shortOverLabel}: ${formatPHP(Math.abs(computed.shortageOrOverage))}`,
                tone: computed.shortageOrOverage === 0 ? "success" : "warning",
            },
            supportingResults: [
                { title: "Total Accounted For", value: formatPHP(computed.totalAccountedFor) },
                { title: "Replenishment", value: formatPHP(computed.replenishmentAmount) },
            ],
            formula: "Short / over = Cash + vouchers + stamps + other receipts - Petty cash fund",
            steps: [
                `Counted items = ${formatPHP(cashOnHand)} + ${formatPHP(pettyCashVouchers)} + ${formatPHP(stampsOnHand)} + ${formatPHP(otherReceipts)} = ${formatPHP(computed.totalAccountedFor)}.`,
                `Short / over = ${formatPHP(computed.totalAccountedFor)} - ${formatPHP(fundAmount)} = ${formatPHP(computed.shortageOrOverage)}.`,
                computed.shortageOrOverage === 0
                    ? "The petty cash fund balances exactly."
                    : computed.shortageOrOverage > 0
                      ? "The count is over the authorized fund, so the overage should be investigated and recorded."
                      : "The count is short of the authorized fund, so the shortage should be investigated and recorded.",
            ],
            glossary: [
                { term: "Petty cash fund", meaning: "The authorized imprest amount that should be accounted for at any point in time." },
                { term: "Petty cash vouchers", meaning: "Signed support for small disbursements already made from the fund." },
            ],
            interpretation: computed.shortageOrOverage === 0
                ? `The petty cash count supports the fund exactly at ${formatPHP(fundAmount)}.`
                : `The petty cash count is ${computed.shortageOrOverage > 0 ? "over" : "short"} by ${formatPHP(Math.abs(computed.shortageOrOverage))}, so the fund does not fully reconcile yet.`,
            assumptions: [
                "This uses the imprest-fund logic where cash plus approved support should equal the authorized fund.",
            ],
            warnings: [
                "Only include accountable items that should still be part of the petty cash count. Personal IOUs or unsupported slips should be reviewed carefully before treating them as valid support.",
            ],
        };
    },
};

export const prepaidExpenseAdjustmentSolveDefinition: FormulaCalculatorDefinition = {
    id: "prepaid-expense-adjustment-solve",
    defaultTarget: "expenseRecognized",
    fields: {
        beginningPrepaid: { key: "beginningPrepaid", label: "Beginning Prepaid", placeholder: "25000", kind: "money" },
        endingPrepaid: { key: "endingPrepaid", label: "Ending Prepaid", placeholder: "8000", kind: "money" },
        expenseRecognized: { key: "expenseRecognized", label: "Expense Recognized", placeholder: "17000", kind: "money" },
    },
    targets: [
        { key: "expenseRecognized", label: "Expense", summary: "Find the expense recognized from the prepaid balance change." },
        { key: "beginningPrepaid", label: "Beginning Prepaid", summary: "Back-solve the opening prepaid balance." },
        { key: "endingPrepaid", label: "Ending Prepaid", summary: "Back-solve the ending prepaid balance after adjustment." },
    ],
    getInputKeys(targetKey) {
        if (targetKey === "beginningPrepaid") return ["endingPrepaid", "expenseRecognized"];
        if (targetKey === "endingPrepaid") return ["beginningPrepaid", "expenseRecognized"];
        return ["beginningPrepaid", "endingPrepaid"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Prepaid expense adjustment",
            body: `Enter the visible prepaid balances to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        let beginningPrepaid = values.beginningPrepaid;
        let endingPrepaid = values.endingPrepaid;
        let expenseRecognized = values.expenseRecognized;

        if (targetKey === "beginningPrepaid") {
            beginningPrepaid = endingPrepaid + expenseRecognized;
        } else if (targetKey === "endingPrepaid") {
            endingPrepaid = beginningPrepaid - expenseRecognized;
        } else {
            expenseRecognized = computePrepaidExpenseAdjustment({
                beginningPrepaid,
                endingPrepaid,
            }).expenseRecognized;
        }

        const computed = computePrepaidExpenseAdjustment({
            beginningPrepaid,
            endingPrepaid,
        });

        return {
            primaryResult: {
                title:
                    targetKey === "beginningPrepaid"
                        ? "Beginning Prepaid"
                        : targetKey === "endingPrepaid"
                          ? "Ending Prepaid"
                          : "Expense Recognized",
                value:
                    targetKey === "beginningPrepaid"
                        ? formatPHP(beginningPrepaid)
                        : targetKey === "endingPrepaid"
                          ? formatPHP(endingPrepaid)
                          : formatPHP(expenseRecognized),
                tone: "accent",
            },
            supportingResults: [
                { title: "Adjustment Direction", value: computed.adjustmentDirection.replaceAll("-", " ") },
            ],
            formula: "Expense recognized = Beginning prepaid - Ending prepaid",
            steps: [
                `Expense recognized = ${formatPHP(beginningPrepaid)} - ${formatPHP(endingPrepaid)} = ${formatPHP(computed.expenseRecognized)}.`,
                `If the prepaid balance decreased, the consumed amount becomes expense for the period.`,
            ],
            interpretation: `The prepaid account shows that ${formatPHP(computed.expenseRecognized)} has already been used up and should appear as expense.`,
            assumptions: [
                "This focuses on a simple prepaid balance rollforward and assumes additions or corrections have already been reflected in the balances you entered.",
            ],
        };
    },
};

export const unearnedRevenueAdjustmentSolveDefinition: FormulaCalculatorDefinition = {
    id: "unearned-revenue-adjustment-solve",
    defaultTarget: "revenueRecognized",
    fields: {
        beginningUnearnedRevenue: { key: "beginningUnearnedRevenue", label: "Beginning Unearned Revenue", placeholder: "18000", kind: "money" },
        endingUnearnedRevenue: { key: "endingUnearnedRevenue", label: "Ending Unearned Revenue", placeholder: "7000", kind: "money" },
        revenueRecognized: { key: "revenueRecognized", label: "Revenue Recognized", placeholder: "11000", kind: "money" },
    },
    targets: [
        { key: "revenueRecognized", label: "Revenue", summary: "Find the revenue recognized from the unearned balance change." },
        { key: "beginningUnearnedRevenue", label: "Beginning Unearned", summary: "Back-solve the opening unearned revenue balance." },
        { key: "endingUnearnedRevenue", label: "Ending Unearned", summary: "Back-solve the ending unearned revenue balance." },
    ],
    getInputKeys(targetKey) {
        if (targetKey === "beginningUnearnedRevenue") return ["endingUnearnedRevenue", "revenueRecognized"];
        if (targetKey === "endingUnearnedRevenue") return ["beginningUnearnedRevenue", "revenueRecognized"];
        return ["beginningUnearnedRevenue", "endingUnearnedRevenue"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Unearned revenue adjustment",
            body: `Enter the visible unearned balances to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        let beginningUnearnedRevenue = values.beginningUnearnedRevenue;
        let endingUnearnedRevenue = values.endingUnearnedRevenue;
        let revenueRecognized = values.revenueRecognized;

        if (targetKey === "beginningUnearnedRevenue") {
            beginningUnearnedRevenue = endingUnearnedRevenue + revenueRecognized;
        } else if (targetKey === "endingUnearnedRevenue") {
            endingUnearnedRevenue = beginningUnearnedRevenue - revenueRecognized;
        } else {
            revenueRecognized = computeUnearnedRevenueAdjustment({
                beginningUnearnedRevenue,
                endingUnearnedRevenue,
            }).revenueRecognized;
        }

        const computed = computeUnearnedRevenueAdjustment({
            beginningUnearnedRevenue,
            endingUnearnedRevenue,
        });

        return {
            primaryResult: {
                title:
                    targetKey === "beginningUnearnedRevenue"
                        ? "Beginning Unearned Revenue"
                        : targetKey === "endingUnearnedRevenue"
                          ? "Ending Unearned Revenue"
                          : "Revenue Recognized",
                value:
                    targetKey === "beginningUnearnedRevenue"
                        ? formatPHP(beginningUnearnedRevenue)
                        : targetKey === "endingUnearnedRevenue"
                          ? formatPHP(endingUnearnedRevenue)
                          : formatPHP(revenueRecognized),
                tone: "accent",
            },
            supportingResults: [
                { title: "Adjustment Direction", value: computed.adjustmentDirection.replaceAll("-", " ") },
            ],
            formula: "Revenue recognized = Beginning unearned revenue - Ending unearned revenue",
            steps: [
                `Revenue recognized = ${formatPHP(beginningUnearnedRevenue)} - ${formatPHP(endingUnearnedRevenue)} = ${formatPHP(computed.revenueRecognized)}.`,
                "As the obligation is satisfied, the liability decreases and revenue is recognized.",
            ],
            interpretation: `The liability movement shows that ${formatPHP(computed.revenueRecognized)} has now been earned and should be recognized as revenue.`,
            assumptions: [
                "This simple rollforward assumes the entered balances already reflect collections and only the earned portion still needs interpretation.",
            ],
        };
    },
};

export const accruedRevenueAdjustmentSolveDefinition: FormulaCalculatorDefinition = {
    id: "accrued-revenue-adjustment-solve",
    defaultTarget: "accruedRevenue",
    fields: {
        revenueEarned: { key: "revenueEarned", label: "Revenue Earned", placeholder: "24000", kind: "money" },
        cashCollected: { key: "cashCollected", label: "Cash Collected", placeholder: "9000", kind: "money" },
        accruedRevenue: { key: "accruedRevenue", label: "Accrued Revenue", placeholder: "15000", kind: "money" },
    },
    targets: [
        { key: "accruedRevenue", label: "Accrued Revenue", summary: "Find the earned amount not yet collected." },
        { key: "revenueEarned", label: "Revenue Earned", summary: "Back-solve the revenue earned for the period." },
        { key: "cashCollected", label: "Cash Collected", summary: "Back-solve the cash already collected." },
    ],
    getInputKeys(targetKey) {
        if (targetKey === "revenueEarned") return ["cashCollected", "accruedRevenue"];
        if (targetKey === "cashCollected") return ["revenueEarned", "accruedRevenue"];
        return ["revenueEarned", "cashCollected"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Accrued revenue adjustment",
            body: `Enter the visible earned-and-collected amounts to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        let revenueEarned = values.revenueEarned;
        let cashCollected = values.cashCollected;
        let accruedRevenue = values.accruedRevenue;

        if (targetKey === "revenueEarned") {
            revenueEarned = cashCollected + accruedRevenue;
        } else if (targetKey === "cashCollected") {
            cashCollected = revenueEarned - accruedRevenue;
        } else {
            accruedRevenue = computeAccruedRevenueAdjustment({
                revenueEarned,
                cashCollected,
            }).accruedRevenue;
        }

        const computed = computeAccruedRevenueAdjustment({
            revenueEarned,
            cashCollected,
        });

        return {
            primaryResult: {
                title:
                    targetKey === "revenueEarned"
                        ? "Revenue Earned"
                        : targetKey === "cashCollected"
                          ? "Cash Collected"
                          : "Accrued Revenue",
                value:
                    targetKey === "revenueEarned"
                        ? formatPHP(revenueEarned)
                        : targetKey === "cashCollected"
                          ? formatPHP(cashCollected)
                          : formatPHP(accruedRevenue),
                tone: "accent",
            },
            supportingResults: [
                { title: "Adjustment Direction", value: computed.adjustmentDirection.replaceAll("-", " ") },
            ],
            formula: "Accrued revenue = Revenue earned - Cash collected",
            steps: [
                `Accrued revenue = ${formatPHP(revenueEarned)} - ${formatPHP(cashCollected)} = ${formatPHP(computed.accruedRevenue)}.`,
                "The earned-but-uncollected amount becomes a receivable at period-end.",
            ],
            interpretation: `The business has earned ${formatPHP(computed.accruedRevenue)} that still has to be recognized as a receivable.`,
            assumptions: [
                "Use this when the service or earning process is complete but the cash has not yet been collected.",
            ],
        };
    },
};

export const accruedExpenseAdjustmentSolveDefinition: FormulaCalculatorDefinition = {
    id: "accrued-expense-adjustment-solve",
    defaultTarget: "accruedExpense",
    fields: {
        expenseIncurred: { key: "expenseIncurred", label: "Expense Incurred", placeholder: "19500", kind: "money" },
        cashPaid: { key: "cashPaid", label: "Cash Paid", placeholder: "11000", kind: "money" },
        accruedExpense: { key: "accruedExpense", label: "Accrued Expense", placeholder: "8500", kind: "money" },
    },
    targets: [
        { key: "accruedExpense", label: "Accrued Expense", summary: "Find the incurred amount not yet paid." },
        { key: "expenseIncurred", label: "Expense Incurred", summary: "Back-solve the total expense incurred for the period." },
        { key: "cashPaid", label: "Cash Paid", summary: "Back-solve the cash already paid." },
    ],
    getInputKeys(targetKey) {
        if (targetKey === "expenseIncurred") return ["cashPaid", "accruedExpense"];
        if (targetKey === "cashPaid") return ["expenseIncurred", "accruedExpense"];
        return ["expenseIncurred", "cashPaid"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Accrued expense adjustment",
            body: `Enter the visible incurred-and-paid amounts to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        let expenseIncurred = values.expenseIncurred;
        let cashPaid = values.cashPaid;
        let accruedExpense = values.accruedExpense;

        if (targetKey === "expenseIncurred") {
            expenseIncurred = cashPaid + accruedExpense;
        } else if (targetKey === "cashPaid") {
            cashPaid = expenseIncurred - accruedExpense;
        } else {
            accruedExpense = computeAccruedExpenseAdjustment({
                expenseIncurred,
                cashPaid,
            }).accruedExpense;
        }

        const computed = computeAccruedExpenseAdjustment({
            expenseIncurred,
            cashPaid,
        });

        return {
            primaryResult: {
                title:
                    targetKey === "expenseIncurred"
                        ? "Expense Incurred"
                        : targetKey === "cashPaid"
                          ? "Cash Paid"
                          : "Accrued Expense",
                value:
                    targetKey === "expenseIncurred"
                        ? formatPHP(expenseIncurred)
                        : targetKey === "cashPaid"
                          ? formatPHP(cashPaid)
                          : formatPHP(accruedExpense),
                tone: "accent",
            },
            supportingResults: [
                { title: "Adjustment Direction", value: computed.adjustmentDirection.replaceAll("-", " ") },
            ],
            formula: "Accrued expense = Expense incurred - Cash paid",
            steps: [
                `Accrued expense = ${formatPHP(expenseIncurred)} - ${formatPHP(cashPaid)} = ${formatPHP(computed.accruedExpense)}.`,
                "The incurred-but-unpaid amount becomes a payable at period-end.",
            ],
            interpretation: `The business still owes ${formatPHP(computed.accruedExpense)} for expenses already incurred in the period.`,
            assumptions: [
                "Use this when the economic consumption already happened even though payment will be made later.",
            ],
        };
    },
};

export const impairmentLossSolveDefinition: FormulaCalculatorDefinition = {
    id: "impairment-loss-solve",
    defaultTarget: "impairmentLoss",
    fields: {
        carryingAmount: { key: "carryingAmount", label: "Carrying Amount", placeholder: "520000", kind: "money" },
        fairValueLessCostsToSell: { key: "fairValueLessCostsToSell", label: "Fair Value Less Costs to Sell", placeholder: "430000", kind: "money" },
        valueInUse: { key: "valueInUse", label: "Value in Use", placeholder: "450000", kind: "money" },
        impairmentLoss: { key: "impairmentLoss", label: "Impairment Loss", placeholder: "70000", kind: "money" },
    },
    targets: [
        { key: "impairmentLoss", label: "Impairment Loss", summary: "Measure the loss from carrying amount versus recoverable amount." },
        { key: "carryingAmount", label: "Carrying Amount", summary: "Back-solve the carrying amount when the impairment loss and recoverable inputs are known." },
    ],
    getInputKeys(targetKey) {
        return targetKey === "carryingAmount"
            ? ["fairValueLessCostsToSell", "valueInUse", "impairmentLoss"]
            : ["carryingAmount", "fairValueLessCostsToSell", "valueInUse"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Impairment measurement",
            body: `Enter the visible recoverable-amount inputs to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        let carryingAmount = values.carryingAmount;
        const fairValueLessCostsToSell = values.fairValueLessCostsToSell;
        const valueInUse = values.valueInUse;
        let impairmentLoss = values.impairmentLoss;
        const recoverableAmount = Math.max(fairValueLessCostsToSell, valueInUse);

        if (targetKey === "carryingAmount") {
            carryingAmount = recoverableAmount + impairmentLoss;
        } else {
            impairmentLoss = Math.max(carryingAmount - recoverableAmount, 0);
        }

        const computed = computeImpairmentLoss({
            carryingAmount,
            fairValueLessCostsToSell,
            valueInUse,
        });

        return {
            primaryResult: {
                title: targetKey === "carryingAmount" ? "Carrying Amount" : "Impairment Loss",
                value: targetKey === "carryingAmount" ? formatPHP(carryingAmount) : formatPHP(computed.impairmentLoss),
                tone: computed.impairmentLoss > 0 ? "warning" : "success",
            },
            supportingResults: [
                { title: "Recoverable Amount", value: formatPHP(computed.recoverableAmount) },
                { title: "Carrying Amount After Impairment", value: formatPHP(computed.carryingAmountAfterImpairment) },
            ],
            formula: "Recoverable amount = higher of fair value less costs to sell and value in use; Impairment loss = Carrying amount - Recoverable amount",
            steps: [
                `Recoverable amount = higher of ${formatPHP(fairValueLessCostsToSell)} and ${formatPHP(valueInUse)} = ${formatPHP(computed.recoverableAmount)}.`,
                `Impairment loss = ${formatPHP(carryingAmount)} - ${formatPHP(computed.recoverableAmount)} = ${formatPHP(computed.impairmentLoss)}.`,
                `After recognition, the carrying amount becomes ${formatPHP(computed.carryingAmountAfterImpairment)}.`,
            ],
            interpretation: computed.impairmentLoss > 0
                ? `The asset is impaired because its carrying amount exceeds the recoverable amount by ${formatPHP(computed.impairmentLoss)}.`
                : "No impairment loss is recognized because the carrying amount does not exceed the recoverable amount.",
            assumptions: [
                "This classroom tool focuses on the measurement step after the relevant fair-value-less-costs-to-sell and value-in-use estimates have already been developed.",
            ],
        };
    },
};

export const assetDisposalSolveDefinition: FormulaCalculatorDefinition = {
    id: "asset-disposal-solve",
    defaultTarget: "gainOrLoss",
    fields: {
        assetCost: { key: "assetCost", label: "Asset Cost", placeholder: "500000", kind: "money" },
        accumulatedDepreciation: { key: "accumulatedDepreciation", label: "Accumulated Depreciation", placeholder: "360000", kind: "money" },
        proceeds: { key: "proceeds", label: "Proceeds", placeholder: "165000", kind: "money" },
        disposalCosts: { key: "disposalCosts", label: "Disposal Costs", placeholder: "5000", kind: "money" },
        gainOrLoss: { key: "gainOrLoss", label: "Gain / Loss", placeholder: "20000", kind: "money" },
    },
    targets: [
        { key: "gainOrLoss", label: "Gain / Loss", summary: "Find the gain or loss on retirement or disposal." },
        { key: "proceeds", label: "Proceeds", summary: "Back-solve the proceeds needed to produce a known gain or loss." },
    ],
    getInputKeys(targetKey) {
        return targetKey === "proceeds"
            ? ["assetCost", "accumulatedDepreciation", "disposalCosts", "gainOrLoss"]
            : ["assetCost", "accumulatedDepreciation", "proceeds", "disposalCosts"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Asset disposal analysis",
            body: `Enter the visible disposal values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        const assetCost = values.assetCost;
        const accumulatedDepreciation = values.accumulatedDepreciation;
        let proceeds = values.proceeds;
        const disposalCosts = values.disposalCosts ?? 0;
        let gainOrLoss = values.gainOrLoss;
        const bookValue = assetCost - accumulatedDepreciation;

        if (targetKey === "proceeds") {
            proceeds = bookValue + gainOrLoss + disposalCosts;
        } else {
            gainOrLoss = proceeds - disposalCosts - bookValue;
        }

        const computed = computeAssetDisposal({
            assetCost,
            accumulatedDepreciation,
            proceeds,
            disposalCosts,
        });

        return {
            primaryResult: {
                title: targetKey === "proceeds" ? "Proceeds" : "Gain / Loss",
                value:
                    targetKey === "proceeds"
                        ? formatPHP(proceeds)
                        : `${computed.outcome === "gain" ? "Gain" : computed.outcome === "loss" ? "Loss" : "No gain or loss"}${computed.outcome === "break-even" ? "" : `: ${formatPHP(Math.abs(computed.gainOrLoss))}`}`,
                tone: computed.outcome === "loss" ? "warning" : computed.outcome === "gain" ? "success" : "accent",
            },
            supportingResults: [
                { title: "Book Value", value: formatPHP(computed.bookValue) },
                { title: "Net Proceeds", value: formatPHP(computed.netProceeds) },
            ],
            formula: "Book value = Cost - Accumulated depreciation; Gain or loss = Net proceeds - Book value",
            steps: [
                `Book value = ${formatPHP(assetCost)} - ${formatPHP(accumulatedDepreciation)} = ${formatPHP(computed.bookValue)}.`,
                `Net proceeds = ${formatPHP(proceeds)} - ${formatPHP(disposalCosts)} = ${formatPHP(computed.netProceeds)}.`,
                `Gain / loss = ${formatPHP(computed.netProceeds)} - ${formatPHP(computed.bookValue)} = ${formatPHP(computed.gainOrLoss)}.`,
            ],
            interpretation: computed.outcome === "gain"
                ? `The asset was disposed of at a gain because net proceeds exceeded book value by ${formatPHP(computed.gainOrLoss)}.`
                : computed.outcome === "loss"
                  ? `The asset was disposed of at a loss because net proceeds fell short of book value by ${formatPHP(Math.abs(computed.gainOrLoss))}.`
                  : "Net proceeds equal book value, so the disposal produces no gain or loss.",
            assumptions: [
                "This tool assumes the asset has already been updated for current-period depreciation before disposal is analyzed.",
            ],
        };
    },
};

export const productionBudgetSolveDefinition: FormulaCalculatorDefinition = {
    id: "production-budget-solve",
    defaultTarget: "requiredProductionUnits",
    fields: {
        budgetedSalesUnits: { key: "budgetedSalesUnits", label: "Budgeted Sales Units", placeholder: "12000", kind: "number" },
        desiredEndingFinishedGoodsUnits: { key: "desiredEndingFinishedGoodsUnits", label: "Desired Ending FG Units", placeholder: "1800", kind: "number" },
        beginningFinishedGoodsUnits: { key: "beginningFinishedGoodsUnits", label: "Beginning FG Units", placeholder: "1500", kind: "number" },
        requiredProductionUnits: { key: "requiredProductionUnits", label: "Required Production Units", placeholder: "12300", kind: "number" },
    },
    targets: [
        { key: "requiredProductionUnits", label: "Required Production", summary: "Compute the production budget in units." },
        { key: "budgetedSalesUnits", label: "Budgeted Sales", summary: "Back-solve budgeted sales units from the production relationship." },
    ],
    getInputKeys(targetKey) {
        return targetKey === "budgetedSalesUnits"
            ? ["desiredEndingFinishedGoodsUnits", "beginningFinishedGoodsUnits", "requiredProductionUnits"]
            : ["budgetedSalesUnits", "desiredEndingFinishedGoodsUnits", "beginningFinishedGoodsUnits"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Production budget",
            body: `Enter the visible finished-goods planning values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        let budgetedSalesUnits = values.budgetedSalesUnits;
        const desiredEndingFinishedGoodsUnits = values.desiredEndingFinishedGoodsUnits;
        const beginningFinishedGoodsUnits = values.beginningFinishedGoodsUnits;
        let requiredProductionUnits = values.requiredProductionUnits;

        if (targetKey === "budgetedSalesUnits") {
            budgetedSalesUnits =
                requiredProductionUnits -
                desiredEndingFinishedGoodsUnits +
                beginningFinishedGoodsUnits;
        } else {
            requiredProductionUnits = computeProductionBudget({
                budgetedSalesUnits,
                desiredEndingFinishedGoodsUnits,
                beginningFinishedGoodsUnits,
            }).requiredProductionUnits;
        }

        const computed = computeProductionBudget({
            budgetedSalesUnits,
            desiredEndingFinishedGoodsUnits,
            beginningFinishedGoodsUnits,
        });

        return {
            primaryResult: {
                title: targetKey === "budgetedSalesUnits" ? "Budgeted Sales Units" : "Required Production Units",
                value: formatPlain(targetKey === "budgetedSalesUnits" ? budgetedSalesUnits : computed.requiredProductionUnits, 0),
                tone: "accent",
            },
            supportingResults: [
                { title: "Finished Goods Available", value: formatPlain(computed.finishedGoodsUnitsAvailable, 0) },
            ],
            formula: "Required production = Budgeted sales + Desired ending FG - Beginning FG",
            steps: [
                `Required production = ${formatPlain(budgetedSalesUnits, 0)} + ${formatPlain(desiredEndingFinishedGoodsUnits, 0)} - ${formatPlain(beginningFinishedGoodsUnits, 0)} = ${formatPlain(computed.requiredProductionUnits, 0)} units.`,
            ],
            interpretation: `The production budget shows the plant must produce ${formatPlain(computed.requiredProductionUnits, 0)} units to support sales and the desired ending finished-goods level.`,
            assumptions: [
                "This unit-only budget assumes the desired ending finished-goods inventory policy is already known.",
            ],
            notes: [
                "Production budgets normally come after the sales budget and before direct materials, direct labor, and overhead budgets.",
            ],
        };
    },
};

export const salesBudgetSolveDefinition: FormulaCalculatorDefinition = {
    id: "sales-budget-solve",
    defaultTarget: "budgetedSalesAmount",
    fields: {
        budgetedSalesUnits: {
            key: "budgetedSalesUnits",
            label: "Budgeted Unit Sales",
            placeholder: "12500",
            kind: "number",
        },
        sellingPricePerUnit: {
            key: "sellingPricePerUnit",
            label: "Selling Price / Unit",
            placeholder: "85",
            kind: "money",
        },
        budgetedSalesAmount: {
            key: "budgetedSalesAmount",
            label: "Budgeted Sales Revenue",
            placeholder: "1062500",
            kind: "money",
        },
    },
    targets: [
        {
            key: "budgetedSalesAmount",
            label: "Sales Revenue",
            summary: "Compute the sales budget in currency terms from units and selling price.",
        },
        {
            key: "budgetedSalesUnits",
            label: "Unit Sales",
            summary: "Back-solve the unit-sales plan implied by the total sales budget and price per unit.",
        },
        {
            key: "sellingPricePerUnit",
            label: "Selling Price / Unit",
            summary: "Back-solve the planned selling price from unit sales and total sales budget.",
        },
    ],
    getInputKeys(targetKey) {
        if (targetKey === "budgetedSalesUnits") {
            return ["budgetedSalesAmount", "sellingPricePerUnit"];
        }
        if (targetKey === "sellingPricePerUnit") {
            return ["budgetedSalesUnits", "budgetedSalesAmount"];
        }
        return ["budgetedSalesUnits", "sellingPricePerUnit"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Sales budget support",
            body: `Enter the visible sales-budget values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        let budgetedSalesUnits = values.budgetedSalesUnits;
        let sellingPricePerUnit = values.sellingPricePerUnit;
        let budgetedSalesAmount = values.budgetedSalesAmount;

        if (targetKey === "budgetedSalesUnits") {
            if (sellingPricePerUnit <= 0) {
                return { error: "Selling price per unit must be greater than zero when solving for unit sales." };
            }
            budgetedSalesUnits = budgetedSalesAmount / sellingPricePerUnit;
        } else if (targetKey === "sellingPricePerUnit") {
            if (budgetedSalesUnits <= 0) {
                return { error: "Budgeted unit sales must be greater than zero when solving for selling price." };
            }
            sellingPricePerUnit = budgetedSalesAmount / budgetedSalesUnits;
        } else {
            budgetedSalesAmount = computeSalesBudget({
                budgetedUnitSales: budgetedSalesUnits,
                sellingPricePerUnit,
            }).budgetedSalesRevenue;
        }

        if (
            ![budgetedSalesUnits, sellingPricePerUnit, budgetedSalesAmount].every(Number.isFinite) ||
            budgetedSalesUnits < 0 ||
            sellingPricePerUnit < 0 ||
            budgetedSalesAmount < 0
        ) {
            return { error: "The selected sales-budget values do not produce a valid non-negative answer." };
        }

        const computed = computeSalesBudget({
            budgetedUnitSales: budgetedSalesUnits,
            sellingPricePerUnit,
        });

        return {
            primaryResult: {
                title:
                    targetKey === "budgetedSalesUnits"
                        ? "Budgeted Unit Sales"
                        : targetKey === "sellingPricePerUnit"
                          ? "Selling Price / Unit"
                          : "Budgeted Sales Revenue",
                value:
                    targetKey === "budgetedSalesUnits"
                        ? `${formatPlain(budgetedSalesUnits, 2)} units`
                        : targetKey === "sellingPricePerUnit"
                          ? formatPHP(sellingPricePerUnit)
                          : formatPHP(computed.budgetedSalesRevenue),
                tone: "accent",
            },
            supportingResults: [
                { title: "Budgeted Unit Sales", value: `${formatPlain(budgetedSalesUnits, 2)} units` },
                { title: "Selling Price / Unit", value: formatPHP(sellingPricePerUnit) },
            ],
            formula: "Sales budget = Budgeted unit sales x Selling price per unit",
            steps: [
                `Budgeted sales revenue = ${formatPlain(budgetedSalesUnits, 2)} x ${formatPHP(sellingPricePerUnit)} = ${formatPHP(computed.budgetedSalesRevenue)}.`,
                "This sales plan usually becomes the starting point for collections, production, and operating-expense budgeting.",
            ],
            interpretation: `The sales budget points to ${formatPHP(computed.budgetedSalesRevenue)} of planned revenue from ${formatPlain(budgetedSalesUnits, 2)} units at ${formatPHP(sellingPricePerUnit)} each.`,
            assumptions: [
                "This page assumes one planned selling price for the units in the period and does not yet separate cash timing or sales-mix complications.",
            ],
            notes: [
                "Move next into collections, production, or operating-expense budgeting depending on whether the case is merchandising or manufacturing.",
            ],
        };
    },
};

export const directMaterialsPurchasesBudgetSolveDefinition: FormulaCalculatorDefinition = {
    id: "direct-materials-purchases-budget-solve",
    defaultTarget: "materialsToPurchaseUnits",
    fields: {
        budgetedProductionUnits: { key: "budgetedProductionUnits", label: "Budgeted Production Units", placeholder: "12300", kind: "number" },
        materialsPerFinishedUnit: { key: "materialsPerFinishedUnit", label: "Materials per Finished Unit", placeholder: "2.5", kind: "number" },
        desiredEndingMaterialsUnits: { key: "desiredEndingMaterialsUnits", label: "Desired Ending Materials Units", placeholder: "1800", kind: "number" },
        beginningMaterialsUnits: { key: "beginningMaterialsUnits", label: "Beginning Materials Units", placeholder: "1500", kind: "number" },
        materialCostPerUnit: { key: "materialCostPerUnit", label: "Material Cost per Unit", placeholder: "18", kind: "money" },
        materialsToPurchaseUnits: { key: "materialsToPurchaseUnits", label: "Materials to Purchase", placeholder: "31050", kind: "number" },
        purchasesCost: { key: "purchasesCost", label: "Purchases Cost", placeholder: "558900", kind: "money" },
    },
    targets: [
        { key: "materialsToPurchaseUnits", label: "Units to Purchase", summary: "Compute the direct materials purchases budget in units." },
        { key: "purchasesCost", label: "Purchases Cost", summary: "Compute the direct materials purchases budget in currency." },
    ],
    getInputKeys() {
        return ["budgetedProductionUnits", "materialsPerFinishedUnit", "desiredEndingMaterialsUnits", "beginningMaterialsUnits", "materialCostPerUnit"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Direct materials purchases budget",
            body: `Enter the production and materials-policy values to solve for ${targetKey}.`,
        };
    },
    solve(_targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        const computed = computeDirectMaterialsPurchasesBudget({
            budgetedProductionUnits: values.budgetedProductionUnits,
            materialsPerFinishedUnit: values.materialsPerFinishedUnit,
            desiredEndingMaterialsUnits: values.desiredEndingMaterialsUnits,
            beginningMaterialsUnits: values.beginningMaterialsUnits,
            materialCostPerUnit: values.materialCostPerUnit,
        });

        return {
            primaryResult: {
                title: "Materials to Purchase",
                value: `${formatPlain(computed.materialsToPurchaseUnits, 2)} units`,
                tone: "accent",
            },
            supportingResults: [
                { title: "Materials Needed for Production", value: `${formatPlain(computed.materialsNeededForProduction, 2)} units` },
                { title: "Total Materials Required", value: `${formatPlain(computed.materialsRequired, 2)} units` },
                { title: "Purchases Cost", value: formatPHP(computed.purchasesCost) },
            ],
            formula: "Materials to purchase = (Production units x Materials per unit) + Desired ending materials - Beginning materials",
            steps: [
                `Materials needed for production = ${formatPlain(values.budgetedProductionUnits, 2)} x ${formatPlain(values.materialsPerFinishedUnit, 2)} = ${formatPlain(computed.materialsNeededForProduction, 2)} units.`,
                `Total materials required = ${formatPlain(computed.materialsNeededForProduction, 2)} + ${formatPlain(values.desiredEndingMaterialsUnits, 2)} = ${formatPlain(computed.materialsRequired, 2)} units.`,
                `Materials to purchase = ${formatPlain(computed.materialsRequired, 2)} - ${formatPlain(values.beginningMaterialsUnits, 2)} = ${formatPlain(computed.materialsToPurchaseUnits, 2)} units.`,
                `Purchases cost = ${formatPlain(computed.materialsToPurchaseUnits, 2)} x ${formatPHP(values.materialCostPerUnit)} = ${formatPHP(computed.purchasesCost)}.`,
            ],
            interpretation: `The materials budget shows that ${formatPlain(computed.materialsToPurchaseUnits, 2)} material units should be purchased, costing ${formatPHP(computed.purchasesCost)} at the stated price.`,
            assumptions: [
                "This assumes a direct-material quantity standard per finished unit and a desired ending materials policy are already established.",
            ],
            notes: [
                "Use this after the production budget, not before it, because production drives the materials requirement.",
            ],
        };
    },
};

export const inventoryBudgetSolveDefinition: FormulaCalculatorDefinition = {
    id: "inventory-budget-solve",
    defaultTarget: "purchasesRequiredCost",
    fields: {
        budgetedCostOfGoodsSold: {
            key: "budgetedCostOfGoodsSold",
            label: "Budgeted Cost of Goods Sold",
            placeholder: "420000",
            kind: "money",
        },
        desiredEndingInventoryCost: {
            key: "desiredEndingInventoryCost",
            label: "Desired Ending Inventory",
            placeholder: "86000",
            kind: "money",
        },
        beginningInventoryCost: {
            key: "beginningInventoryCost",
            label: "Beginning Inventory",
            placeholder: "73000",
            kind: "money",
        },
        purchasesRequiredCost: {
            key: "purchasesRequiredCost",
            label: "Required Purchases",
            placeholder: "433000",
            kind: "money",
        },
    },
    targets: [
        {
            key: "purchasesRequiredCost",
            label: "Required Purchases",
            summary: "Compute the merchandise purchases budget in currency terms.",
        },
        {
            key: "budgetedCostOfGoodsSold",
            label: "Budgeted COGS",
            summary: "Back-solve the planned cost of goods sold from the inventory policy and required purchases.",
        },
        {
            key: "desiredEndingInventoryCost",
            label: "Desired Ending Inventory",
            summary: "Back-solve the ending inventory target implied by the other budget amounts.",
        },
    ],
    getInputKeys(targetKey) {
        if (targetKey === "budgetedCostOfGoodsSold") {
            return [
                "purchasesRequiredCost",
                "desiredEndingInventoryCost",
                "beginningInventoryCost",
            ];
        }
        if (targetKey === "desiredEndingInventoryCost") {
            return [
                "purchasesRequiredCost",
                "budgetedCostOfGoodsSold",
                "beginningInventoryCost",
            ];
        }
        return [
            "budgetedCostOfGoodsSold",
            "desiredEndingInventoryCost",
            "beginningInventoryCost",
        ];
    },
    getEmptyState(targetKey) {
        return {
            title: "Inventory budget support",
            body: `Enter the visible inventory-budget values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        let budgetedCostOfGoodsSold = values.budgetedCostOfGoodsSold;
        let desiredEndingInventoryCost = values.desiredEndingInventoryCost;
        const beginningInventoryCost = values.beginningInventoryCost;
        let purchasesRequiredCost = values.purchasesRequiredCost;

        if (beginningInventoryCost < 0) {
            return { error: "Beginning inventory cannot be negative." };
        }

        if (targetKey === "budgetedCostOfGoodsSold") {
            budgetedCostOfGoodsSold =
                purchasesRequiredCost + beginningInventoryCost - desiredEndingInventoryCost;
        } else if (targetKey === "desiredEndingInventoryCost") {
            desiredEndingInventoryCost =
                purchasesRequiredCost - budgetedCostOfGoodsSold + beginningInventoryCost;
        } else {
            purchasesRequiredCost = computeInventoryBudget({
                budgetedCostOfGoodsSold,
                desiredEndingInventoryCost,
                beginningInventoryCost,
            }).purchasesRequiredCost;
        }

        if (
            ![
                budgetedCostOfGoodsSold,
                desiredEndingInventoryCost,
                beginningInventoryCost,
                purchasesRequiredCost,
            ].every((value) => Number.isFinite(value))
        ) {
            return { error: "The selected inventory-budget values do not produce a valid answer." };
        }

        if (
            budgetedCostOfGoodsSold < 0 ||
            desiredEndingInventoryCost < 0 ||
            purchasesRequiredCost < 0
        ) {
            return {
                error: "Budgeted COGS, desired ending inventory, and required purchases must remain non-negative.",
            };
        }

        const computed = computeInventoryBudget({
            budgetedCostOfGoodsSold,
            desiredEndingInventoryCost,
            beginningInventoryCost,
        });

        return {
            primaryResult: {
                title:
                    targetKey === "budgetedCostOfGoodsSold"
                        ? "Budgeted COGS"
                        : targetKey === "desiredEndingInventoryCost"
                          ? "Desired Ending Inventory"
                          : "Required Purchases",
                value:
                    targetKey === "budgetedCostOfGoodsSold"
                        ? formatPHP(budgetedCostOfGoodsSold)
                        : targetKey === "desiredEndingInventoryCost"
                          ? formatPHP(desiredEndingInventoryCost)
                          : formatPHP(computed.purchasesRequiredCost),
                tone: "accent",
            },
            supportingResults: [
                {
                    title: "Goods Available for Sale",
                    value: formatPHP(computed.goodsAvailableForSaleCost),
                },
                {
                    title: "Beginning Inventory",
                    value: formatPHP(beginningInventoryCost),
                },
            ],
            formula:
                "Required purchases = Budgeted cost of goods sold + Desired ending inventory - Beginning inventory",
            steps: [
                `Required purchases = ${formatPHP(budgetedCostOfGoodsSold)} + ${formatPHP(desiredEndingInventoryCost)} - ${formatPHP(beginningInventoryCost)} = ${formatPHP(computed.purchasesRequiredCost)}.`,
                `Goods available for sale = ${formatPHP(beginningInventoryCost)} + ${formatPHP(computed.purchasesRequiredCost)} = ${formatPHP(computed.goodsAvailableForSaleCost)}.`,
                `Check: goods available for sale ${formatPHP(computed.goodsAvailableForSaleCost)} less desired ending inventory ${formatPHP(desiredEndingInventoryCost)} leaves budgeted COGS of ${formatPHP(budgetedCostOfGoodsSold)}.`,
            ],
            interpretation: `The inventory budget indicates merchandise purchases of ${formatPHP(computed.purchasesRequiredCost)} so the planned cost of goods sold can be met while still ending with ${formatPHP(desiredEndingInventoryCost)} in inventory.`,
            assumptions: [
                "This is a merchandising-style inventory budget stated in cost amounts rather than in physical material units.",
            ],
            notes: [
                "This budget usually sits between the sales forecast and the cash-disbursements or cash-budget schedules.",
            ],
        };
    },
};

export const operatingExpenseBudgetSolveDefinition: FormulaCalculatorDefinition = {
    id: "operating-expense-budget-solve",
    defaultTarget: "totalOperatingExpenses",
    fields: {
        budgetedSalesAmount: {
            key: "budgetedSalesAmount",
            label: "Budgeted Sales",
            placeholder: "950000",
            kind: "money",
        },
        variableExpenseRatePercent: {
            key: "variableExpenseRatePercent",
            label: "Variable Expense Rate (%)",
            placeholder: "6.5",
            kind: "percent",
        },
        fixedOperatingExpenses: {
            key: "fixedOperatingExpenses",
            label: "Fixed Operating Expenses",
            placeholder: "145000",
            kind: "money",
        },
        nonCashOperatingExpenses: {
            key: "nonCashOperatingExpenses",
            label: "Non-cash Expenses",
            placeholder: "18000",
            kind: "money",
        },
        totalOperatingExpenses: {
            key: "totalOperatingExpenses",
            label: "Total Operating Expenses",
            placeholder: "206750",
            kind: "money",
        },
        cashOperatingExpenses: {
            key: "cashOperatingExpenses",
            label: "Cash Operating Expenses",
            placeholder: "188750",
            kind: "money",
        },
    },
    targets: [
        {
            key: "totalOperatingExpenses",
            label: "Total Expenses",
            summary: "Compute total selling and administrative or operating expenses for the budget period.",
        },
        {
            key: "cashOperatingExpenses",
            label: "Cash Expenses",
            summary: "Compute the cash portion after removing non-cash operating expenses.",
        },
        {
            key: "budgetedSalesAmount",
            label: "Budgeted Sales",
            summary: "Back-solve the sales base implied by the expense budget structure.",
        },
    ],
    getInputKeys(targetKey) {
        if (targetKey === "budgetedSalesAmount") {
            return [
                "totalOperatingExpenses",
                "variableExpenseRatePercent",
                "fixedOperatingExpenses",
            ];
        }
        return [
            "budgetedSalesAmount",
            "variableExpenseRatePercent",
            "fixedOperatingExpenses",
            "nonCashOperatingExpenses",
        ];
    },
    getEmptyState(targetKey) {
        return {
            title: "Operating expense budget",
            body: `Enter the visible expense-budget inputs to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        let budgetedSalesAmount = values.budgetedSalesAmount;
        const variableExpenseRatePercent = values.variableExpenseRatePercent;
        const fixedOperatingExpenses = values.fixedOperatingExpenses;
        const nonCashOperatingExpenses = values.nonCashOperatingExpenses ?? 0;
        const totalOperatingExpensesInput = values.totalOperatingExpenses;

        if (variableExpenseRatePercent < 0 || fixedOperatingExpenses < 0 || nonCashOperatingExpenses < 0) {
            return { error: "Expense rates and expense amounts cannot be negative." };
        }

        if (targetKey === "budgetedSalesAmount") {
            const variableRateDecimal = variableExpenseRatePercent / 100;
            if (variableRateDecimal <= 0) {
                return {
                    error: "Variable expense rate must be greater than zero when solving for budgeted sales.",
                };
            }

            budgetedSalesAmount =
                (totalOperatingExpensesInput - fixedOperatingExpenses) / variableRateDecimal;
        }

        if (!Number.isFinite(budgetedSalesAmount) || budgetedSalesAmount < 0) {
            return {
                error: "The selected values do not produce a valid non-negative sales base for the operating expense budget.",
            };
        }

        const computed = computeOperatingExpenseBudget({
            budgetedSalesAmount,
            variableExpenseRatePercent,
            fixedOperatingExpenses,
            nonCashOperatingExpenses,
        });

        return {
            primaryResult: {
                title:
                    targetKey === "budgetedSalesAmount"
                        ? "Budgeted Sales"
                        : targetKey === "cashOperatingExpenses"
                          ? "Cash Operating Expenses"
                          : "Total Operating Expenses",
                value:
                    targetKey === "budgetedSalesAmount"
                        ? formatPHP(budgetedSalesAmount)
                        : targetKey === "cashOperatingExpenses"
                          ? formatPHP(computed.cashOperatingExpenses)
                          : formatPHP(computed.totalOperatingExpenses),
                tone: "accent",
            },
            supportingResults: [
                {
                    title: "Variable Operating Expenses",
                    value: formatPHP(computed.variableOperatingExpenses),
                },
                {
                    title: "Fixed Operating Expenses",
                    value: formatPHP(fixedOperatingExpenses),
                },
                {
                    title: "Non-cash Expenses",
                    value: formatPHP(nonCashOperatingExpenses),
                },
            ],
            formula:
                "Total operating expenses = (Budgeted sales x Variable expense rate) + Fixed operating expenses",
            steps: [
                `Variable operating expenses = ${formatPHP(budgetedSalesAmount)} x ${computed.variableExpenseRateDecimal.toFixed(4)} = ${formatPHP(computed.variableOperatingExpenses)}.`,
                `Total operating expenses = ${formatPHP(computed.variableOperatingExpenses)} + ${formatPHP(fixedOperatingExpenses)} = ${formatPHP(computed.totalOperatingExpenses)}.`,
                `Cash operating expenses = ${formatPHP(computed.totalOperatingExpenses)} - ${formatPHP(nonCashOperatingExpenses)} = ${formatPHP(computed.cashOperatingExpenses)}.`,
            ],
            interpretation: `The operating expense budget projects ${formatPHP(computed.totalOperatingExpenses)} in total expenses, of which ${formatPHP(computed.cashOperatingExpenses)} would require cash outflow after excluding non-cash items.`,
            assumptions: [
                "The variable expense rate is assumed to stay stable over the relevant sales range for the budget period.",
            ],
            notes: [
                "Use the cash portion when preparing the cash budget, because depreciation and other non-cash items affect expense but not cash disbursement.",
            ],
        };
    },
};

export const directLaborBudgetSolveDefinition: FormulaCalculatorDefinition = {
    id: "direct-labor-budget-solve",
    defaultTarget: "totalDirectLaborCost",
    fields: {
        budgetedProductionUnits: { key: "budgetedProductionUnits", label: "Budgeted Production Units", placeholder: "12300", kind: "number" },
        directLaborHoursPerUnit: { key: "directLaborHoursPerUnit", label: "Direct Labor Hours / Unit", placeholder: "1.5", kind: "number" },
        directLaborRatePerHour: { key: "directLaborRatePerHour", label: "Labor Rate / Hour", placeholder: "110", kind: "money" },
        totalDirectLaborHours: { key: "totalDirectLaborHours", label: "Total Direct Labor Hours", placeholder: "18450", kind: "number" },
        totalDirectLaborCost: { key: "totalDirectLaborCost", label: "Total Direct Labor Cost", placeholder: "2029500", kind: "money" },
    },
    targets: [
        { key: "totalDirectLaborCost", label: "Labor Cost", summary: "Compute the direct labor budget in currency from planned production, hours, and rate." },
        { key: "totalDirectLaborHours", label: "Labor Hours", summary: "Compute the total labor hours required by the production plan." },
        { key: "directLaborRatePerHour", label: "Labor Rate / Hour", summary: "Back-solve the hourly rate implied by total labor cost and required hours." },
    ],
    getInputKeys(targetKey) {
        if (targetKey === "directLaborRatePerHour") {
            return ["budgetedProductionUnits", "directLaborHoursPerUnit", "totalDirectLaborCost"];
        }
        return ["budgetedProductionUnits", "directLaborHoursPerUnit", "directLaborRatePerHour"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Direct labor budget",
            body: `Enter the visible labor-budget inputs to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        const budgetedProductionUnits = values.budgetedProductionUnits;
        const directLaborHoursPerUnit = values.directLaborHoursPerUnit;
        let directLaborRatePerHour = values.directLaborRatePerHour;
        let totalDirectLaborCost = values.totalDirectLaborCost;

        if (budgetedProductionUnits < 0 || directLaborHoursPerUnit < 0) {
            return { error: "Production units and hours per unit must stay non-negative." };
        }

        const totalDirectLaborHours = budgetedProductionUnits * directLaborHoursPerUnit;
        if (targetKey === "directLaborRatePerHour") {
            if (totalDirectLaborHours <= 0) {
                return { error: "Required labor hours must be greater than zero when solving for the hourly labor rate." };
            }
            directLaborRatePerHour = totalDirectLaborCost / totalDirectLaborHours;
        } else {
            totalDirectLaborCost = computeDirectLaborBudget({
                budgetedProductionUnits,
                directLaborHoursPerUnit,
                directLaborRatePerHour,
            }).totalDirectLaborCost;
        }

        const computed = computeDirectLaborBudget({
            budgetedProductionUnits,
            directLaborHoursPerUnit,
            directLaborRatePerHour,
        });

        return {
            primaryResult: {
                title: targetKey === "totalDirectLaborHours" ? "Total Labor Hours" : targetKey === "directLaborRatePerHour" ? "Labor Rate / Hour" : "Total Direct Labor Cost",
                value: targetKey === "totalDirectLaborHours" ? formatPlain(computed.totalDirectLaborHours) : targetKey === "directLaborRatePerHour" ? formatPHP(directLaborRatePerHour) : formatPHP(computed.totalDirectLaborCost),
                tone: "accent",
            },
            supportingResults: [
                { title: "Budgeted Production Units", value: formatPlain(budgetedProductionUnits) },
                { title: "Hours per Unit", value: formatPlain(directLaborHoursPerUnit) },
                { title: "Total Labor Hours", value: formatPlain(computed.totalDirectLaborHours) },
            ],
            formula: "Direct labor budget = Budgeted production units × Direct labor hours per unit × Labor rate per hour",
            steps: [
                `Required labor hours = ${formatPlain(budgetedProductionUnits)} × ${formatPlain(directLaborHoursPerUnit)} = ${formatPlain(computed.totalDirectLaborHours)} hours.`,
                `Direct labor cost = ${formatPlain(computed.totalDirectLaborHours)} × ${formatPHP(directLaborRatePerHour)} = ${formatPHP(computed.totalDirectLaborCost)}.`,
            ],
            interpretation: `The direct labor budget supports ${formatPlain(computed.totalDirectLaborHours)} labor hours and ${formatPHP(computed.totalDirectLaborCost)} of planned direct labor for the selected production volume.`,
            notes: [
                "Use this page after the production budget and before the overhead, cash, and budgeted-income-statement schedules so the master-budget flow stays connected.",
            ],
        };
    },
};

export const factoryOverheadBudgetSolveDefinition: FormulaCalculatorDefinition = {
    id: "factory-overhead-budget-solve",
    defaultTarget: "totalFactoryOverheadBudget",
    fields: {
        budgetedProductionUnits: { key: "budgetedProductionUnits", label: "Budgeted Activity Units", placeholder: "12300", kind: "number" },
        variableOverheadRatePerUnit: { key: "variableOverheadRatePerUnit", label: "Variable OH Rate / Unit", placeholder: "18", kind: "money" },
        fixedOverheadBudget: { key: "fixedOverheadBudget", label: "Fixed OH Budget", placeholder: "220000", kind: "money" },
        variableFactoryOverheadBudget: { key: "variableFactoryOverheadBudget", label: "Variable OH Budget", placeholder: "221400", kind: "money" },
        totalFactoryOverheadBudget: { key: "totalFactoryOverheadBudget", label: "Total Factory OH Budget", placeholder: "441400", kind: "money" },
    },
    targets: [
        { key: "totalFactoryOverheadBudget", label: "Total OH Budget", summary: "Compute total budgeted factory overhead from variable and fixed components." },
        { key: "variableFactoryOverheadBudget", label: "Variable OH Budget", summary: "Compute only the variable overhead portion of the factory overhead budget." },
        { key: "variableOverheadRatePerUnit", label: "Variable OH Rate / Unit", summary: "Back-solve the rate per unit when the variable overhead budget is known." },
    ],
    getInputKeys(targetKey) {
        if (targetKey === "variableOverheadRatePerUnit") {
            return ["budgetedProductionUnits", "variableFactoryOverheadBudget"];
        }
        return ["budgetedProductionUnits", "variableOverheadRatePerUnit", "fixedOverheadBudget"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Factory overhead budget",
            body: `Enter the visible overhead-budget inputs to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        const budgetedProductionUnits = values.budgetedProductionUnits;
        let variableOverheadRatePerUnit = values.variableOverheadRatePerUnit;
        const fixedOverheadBudget = values.fixedOverheadBudget ?? 0;
        const variableFactoryOverheadBudgetInput = values.variableFactoryOverheadBudget;

        if (budgetedProductionUnits < 0 || fixedOverheadBudget < 0) {
            return { error: "Budgeted activity and fixed overhead must stay non-negative." };
        }

        if (targetKey === "variableOverheadRatePerUnit") {
            if (budgetedProductionUnits <= 0) {
                return { error: "Budgeted activity units must be greater than zero when solving for the variable overhead rate." };
            }
            variableOverheadRatePerUnit = variableFactoryOverheadBudgetInput / budgetedProductionUnits;
        }

        const computed = computeFactoryOverheadBudget({
            budgetedProductionUnits,
            variableOverheadRatePerUnit,
            fixedOverheadBudget,
        });

        return {
            primaryResult: {
                title: targetKey === "variableFactoryOverheadBudget" ? "Variable OH Budget" : targetKey === "variableOverheadRatePerUnit" ? "Variable OH Rate / Unit" : "Total Factory OH Budget",
                value: targetKey === "variableOverheadRatePerUnit" ? formatPHP(variableOverheadRatePerUnit) : targetKey === "variableFactoryOverheadBudget" ? formatPHP(computed.variableFactoryOverheadBudget) : formatPHP(computed.totalFactoryOverheadBudget),
                tone: "accent",
            },
            supportingResults: [
                { title: "Variable OH Budget", value: formatPHP(computed.variableFactoryOverheadBudget) },
                { title: "Fixed OH Budget", value: formatPHP(fixedOverheadBudget) },
                { title: "Total Factory OH", value: formatPHP(computed.totalFactoryOverheadBudget) },
            ],
            formula: "Factory overhead budget = (Budgeted activity × Variable OH rate) + Fixed OH budget",
            steps: [
                `Variable overhead = ${formatPlain(budgetedProductionUnits)} × ${formatPHP(variableOverheadRatePerUnit)} = ${formatPHP(computed.variableFactoryOverheadBudget)}.`,
                `Total factory overhead = ${formatPHP(computed.variableFactoryOverheadBudget)} + ${formatPHP(fixedOverheadBudget)} = ${formatPHP(computed.totalFactoryOverheadBudget)}.`,
            ],
            interpretation: `The factory overhead budget sets aside ${formatPHP(computed.totalFactoryOverheadBudget)} in total overhead support for the planned activity, including ${formatPHP(computed.variableFactoryOverheadBudget)} that changes with volume.`,
        };
    },
};

export const budgetedIncomeStatementSolveDefinition: FormulaCalculatorDefinition = {
    id: "budgeted-income-statement-solve",
    defaultTarget: "netIncome",
    fields: {
        budgetedSalesAmount: { key: "budgetedSalesAmount", label: "Budgeted Sales", placeholder: "1450000", kind: "money" },
        budgetedCostOfGoodsSold: { key: "budgetedCostOfGoodsSold", label: "Budgeted Cost of Goods Sold", placeholder: "910000", kind: "money" },
        totalOperatingExpenses: { key: "totalOperatingExpenses", label: "Total Operating Expenses", placeholder: "206750", kind: "money" },
        interestExpense: { key: "interestExpense", label: "Interest Expense", placeholder: "28000", kind: "money" },
        ratePercent: { key: "ratePercent", label: "Income Tax Rate (%)", placeholder: "25", kind: "percent" },
        grossProfit: { key: "grossProfit", label: "Gross Profit", placeholder: "540000", kind: "money" },
        incomeBeforeTax: { key: "incomeBeforeTax", label: "Income Before Tax", placeholder: "305250", kind: "money" },
        netIncome: { key: "netIncome", label: "Net Income", placeholder: "228937.50", kind: "money" },
    },
    targets: [
        { key: "netIncome", label: "Net Income", summary: "Complete the budgeted income statement through income tax and net income." },
        { key: "grossProfit", label: "Gross Profit", summary: "Back up to the gross-profit layer from budgeted sales and COGS." },
        { key: "incomeBeforeTax", label: "Income Before Tax", summary: "Review operating income after interest but before tax." },
    ],
    getInputKeys(targetKey) {
        if (targetKey === "grossProfit") return ["budgetedSalesAmount", "budgetedCostOfGoodsSold"];
        return ["budgetedSalesAmount", "budgetedCostOfGoodsSold", "totalOperatingExpenses", "interestExpense", "ratePercent"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Budgeted income statement",
            body: `Enter the visible master-budget amounts to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        const budgetedSalesAmount = values.budgetedSalesAmount;
        const budgetedCostOfGoodsSold = values.budgetedCostOfGoodsSold;
        const totalOperatingExpenses = values.totalOperatingExpenses ?? 0;
        const interestExpense = values.interestExpense ?? 0;
        const ratePercent = values.ratePercent ?? 0;

        if ([budgetedSalesAmount, budgetedCostOfGoodsSold, totalOperatingExpenses, interestExpense].some((value) => value < 0)) {
            return { error: "Budgeted statement amounts must stay non-negative." };
        }

        const computed = computeBudgetedIncomeStatement({
            budgetedSalesAmount,
            budgetedCostOfGoodsSold,
            totalOperatingExpenses,
            interestExpense,
            incomeTaxRatePercent: ratePercent,
        });

        return {
            primaryResult: {
                title: targetKey === "grossProfit" ? "Gross Profit" : targetKey === "incomeBeforeTax" ? "Income Before Tax" : "Net Income",
                value: targetKey === "grossProfit" ? formatPHP(computed.grossProfit) : targetKey === "incomeBeforeTax" ? formatPHP(computed.incomeBeforeTax) : formatPHP(computed.netIncome),
                tone: "accent",
            },
            supportingResults: [
                { title: "Gross Profit", value: formatPHP(computed.grossProfit) },
                { title: "Income Tax Expense", value: formatPHP(computed.incomeTaxExpense) },
                { title: "Net Income", value: formatPHP(computed.netIncome) },
            ],
            formula: "Net income = (Budgeted sales - Budgeted COGS - Operating expenses - Interest expense) - Income tax",
            steps: [
                `Gross profit = ${formatPHP(budgetedSalesAmount)} - ${formatPHP(budgetedCostOfGoodsSold)} = ${formatPHP(computed.grossProfit)}.`,
                `Income before tax = ${formatPHP(computed.grossProfit)} - ${formatPHP(totalOperatingExpenses)} - ${formatPHP(interestExpense)} = ${formatPHP(computed.incomeBeforeTax)}.`,
                `Income tax expense = ${formatPHP(computed.incomeBeforeTax)} × ${computed.incomeTaxRateDecimal.toFixed(4)} = ${formatPHP(computed.incomeTaxExpense)}.`,
                `Net income = ${formatPHP(computed.incomeBeforeTax)} - ${formatPHP(computed.incomeTaxExpense)} = ${formatPHP(computed.netIncome)}.`,
            ],
            interpretation: computed.incomeBeforeTax < 0 ? `The draft budget points to a pre-tax loss of ${formatPHP(Math.abs(computed.incomeBeforeTax))}, so no current tax expense is recognized in this simplified classroom view.` : `The budgeted income statement ends with projected net income of ${formatPHP(computed.netIncome)} after covering cost of goods sold, operating expenses, interest, and the selected tax rate.`,
            assumptions: [
                "This first-pass builder assumes no other income or unusual items outside the lines shown on the page.",
            ],
            notes: [
                "Use the production, materials, labor, overhead, and operating-expense budgets first so the budgeted income statement is tied to the rest of the master-budget flow.",
            ],
        };
    },
};

export const specialOrderDecisionSolveDefinition: FormulaCalculatorDefinition = {
    id: "special-order-decision-solve",
    defaultTarget: "incrementalProfit",
    fields: {
        specialOrderUnits: { key: "specialOrderUnits", label: "Special Order Units", placeholder: "4000", kind: "number" },
        specialOrderPricePerUnit: { key: "specialOrderPricePerUnit", label: "Special Order Price / Unit", placeholder: "82", kind: "money" },
        variableCostPerUnit: { key: "variableCostPerUnit", label: "Variable Cost / Unit", placeholder: "64", kind: "money" },
        incrementalFixedCosts: { key: "incrementalFixedCosts", label: "Incremental Fixed Costs", placeholder: "18000", kind: "money" },
        incrementalRevenue: { key: "incrementalRevenue", label: "Incremental Revenue", placeholder: "328000", kind: "money" },
        incrementalCost: { key: "incrementalCost", label: "Incremental Cost", placeholder: "274000", kind: "money" },
        incrementalProfit: { key: "incrementalProfit", label: "Incremental Profit", placeholder: "54000", kind: "money" },
        minimumAcceptablePricePerUnit: { key: "minimumAcceptablePricePerUnit", label: "Minimum Acceptable Price / Unit", placeholder: "68.5", kind: "money" },
    },
    targets: [
        { key: "incrementalProfit", label: "Incremental Profit", summary: "Measure whether the special order adds or reduces operating income under a relevant-cost view." },
        { key: "minimumAcceptablePricePerUnit", label: "Minimum Price / Unit", summary: "Compute the break-even selling price per unit needed for the order to cover relevant costs." },
        { key: "incrementalRevenue", label: "Incremental Revenue", summary: "Compute the extra revenue generated by the special order volume and price." },
    ],
    getInputKeys(targetKey) {
        if (targetKey === "incrementalRevenue") {
            return ["specialOrderUnits", "specialOrderPricePerUnit"];
        }
        return ["specialOrderUnits", "specialOrderPricePerUnit", "variableCostPerUnit", "incrementalFixedCosts"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Special-order decision support",
            body: `Enter the visible special-order values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        const specialOrderUnits = values.specialOrderUnits;
        const specialOrderPricePerUnit = values.specialOrderPricePerUnit;
        const variableCostPerUnit = values.variableCostPerUnit ?? 0;
        const incrementalFixedCosts = values.incrementalFixedCosts ?? 0;

        if (specialOrderUnits <= 0) {
            return { error: "Special-order units must be greater than zero." };
        }

        const computed = computeSpecialOrderDecision({
            specialOrderUnits,
            specialOrderPricePerUnit,
            variableCostPerUnit,
            incrementalFixedCosts,
        });

        return {
            primaryResult: {
                title:
                    targetKey === "minimumAcceptablePricePerUnit"
                        ? "Minimum Acceptable Price / Unit"
                        : targetKey === "incrementalRevenue"
                          ? "Incremental Revenue"
                          : "Incremental Profit",
                value:
                    targetKey === "minimumAcceptablePricePerUnit"
                        ? formatPHP(computed.minimumAcceptablePricePerUnit)
                        : targetKey === "incrementalRevenue"
                          ? formatPHP(computed.incrementalRevenue)
                          : formatPHP(computed.incrementalProfit),
                tone: targetKey === "incrementalProfit" && computed.incrementalProfit < 0 ? "warning" : "accent",
            },
            supportingResults: [
                { title: "Incremental Revenue", value: formatPHP(computed.incrementalRevenue) },
                { title: "Incremental Cost", value: formatPHP(computed.incrementalCosts) },
                { title: "Variable Cost Portion", value: formatPHP(computed.incrementalVariableCosts) },
            ],
            formula: "Incremental profit = (Special-order units x Special-order price) - [(Units x Variable cost) + Incremental fixed costs]",
            steps: [
                `Incremental revenue = ${formatPlain(specialOrderUnits)} x ${formatPHP(specialOrderPricePerUnit)} = ${formatPHP(computed.incrementalRevenue)}.`,
                `Incremental variable cost = ${formatPlain(specialOrderUnits)} x ${formatPHP(variableCostPerUnit)} = ${formatPHP(computed.incrementalVariableCosts)}.`,
                `Incremental total cost = ${formatPHP(computed.incrementalVariableCosts)} + ${formatPHP(incrementalFixedCosts)} = ${formatPHP(computed.incrementalCosts)}.`,
                `Incremental profit = ${formatPHP(computed.incrementalRevenue)} - ${formatPHP(computed.incrementalCosts)} = ${formatPHP(computed.incrementalProfit)}.`,
            ],
            interpretation: computed.recommendation,
            assumptions: [
                "This helper assumes regular fixed costs that do not change are irrelevant to the decision.",
                "Capacity, customer relationship, and pricing-policy effects still need judgment outside this numeric screen.",
            ],
        };
    },
};

export const makeOrBuyDecisionSolveDefinition: FormulaCalculatorDefinition = {
    id: "make-or-buy-decision-solve",
    defaultTarget: "costAdvantageAmount",
    fields: {
        unitsNeeded: { key: "unitsNeeded", label: "Units Needed", placeholder: "12000", kind: "number" },
        variableManufacturingCostPerUnit: { key: "variableManufacturingCostPerUnit", label: "Variable Make Cost / Unit", placeholder: "38", kind: "money" },
        avoidableFixedCosts: { key: "avoidableFixedCosts", label: "Avoidable Fixed Costs", placeholder: "90000", kind: "money" },
        purchasePricePerUnit: { key: "purchasePricePerUnit", label: "Buy Price / Unit", placeholder: "44", kind: "money" },
        relevantMakeCost: { key: "relevantMakeCost", label: "Relevant Make Cost", placeholder: "546000", kind: "money" },
        relevantBuyCost: { key: "relevantBuyCost", label: "Relevant Buy Cost", placeholder: "528000", kind: "money" },
        costAdvantageAmount: { key: "costAdvantageAmount", label: "Cost Advantage", placeholder: "-18000", kind: "money" },
        maximumAcceptablePurchasePricePerUnit: { key: "maximumAcceptablePurchasePricePerUnit", label: "Maximum Buy Price / Unit", placeholder: "45.5", kind: "money" },
    },
    targets: [
        { key: "costAdvantageAmount", label: "Cost Advantage", summary: "Compare relevant make and buy costs to identify the financially preferable option." },
        { key: "relevantMakeCost", label: "Relevant Make Cost", summary: "Compute the relevant total cost of making internally." },
        { key: "maximumAcceptablePurchasePricePerUnit", label: "Maximum Buy Price / Unit", summary: "Compute the purchase price per unit that would leave make and buy financially indifferent." },
    ],
    getInputKeys(targetKey) {
        if (targetKey === "relevantMakeCost") {
            return ["unitsNeeded", "variableManufacturingCostPerUnit", "avoidableFixedCosts"];
        }
        return ["unitsNeeded", "variableManufacturingCostPerUnit", "avoidableFixedCosts", "purchasePricePerUnit"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Make-or-buy analysis",
            body: `Enter the visible relevant-cost values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        const unitsNeeded = values.unitsNeeded;
        const variableManufacturingCostPerUnit = values.variableManufacturingCostPerUnit;
        const avoidableFixedCosts = values.avoidableFixedCosts ?? 0;
        const purchasePricePerUnit = values.purchasePricePerUnit ?? 0;

        if (unitsNeeded <= 0) {
            return { error: "Units needed must be greater than zero." };
        }

        const computed = computeMakeOrBuyDecision({
            unitsNeeded,
            variableManufacturingCostPerUnit,
            avoidableFixedCosts,
            purchasePricePerUnit,
        });

        return {
            primaryResult: {
                title:
                    targetKey === "relevantMakeCost"
                        ? "Relevant Make Cost"
                        : targetKey === "maximumAcceptablePurchasePricePerUnit"
                          ? "Maximum Buy Price / Unit"
                          : "Cost Advantage",
                value:
                    targetKey === "relevantMakeCost"
                        ? formatPHP(computed.relevantMakeCost)
                        : targetKey === "maximumAcceptablePurchasePricePerUnit"
                          ? formatPHP(computed.maximumAcceptablePurchasePricePerUnit)
                          : formatPHP(computed.costAdvantageAmount),
                tone: "accent",
            },
            supportingResults: [
                { title: "Relevant Make Cost", value: formatPHP(computed.relevantMakeCost) },
                { title: "Relevant Buy Cost", value: formatPHP(computed.relevantBuyCost) },
                { title: "Preferred Option", value: computed.preferredOption },
            ],
            formula: "Relevant make cost = (Units x Variable make cost) + Avoidable fixed costs; compare that against Units x Buy price",
            steps: [
                `Relevant make cost = (${formatPlain(unitsNeeded)} x ${formatPHP(variableManufacturingCostPerUnit)}) + ${formatPHP(avoidableFixedCosts)} = ${formatPHP(computed.relevantMakeCost)}.`,
                `Relevant buy cost = ${formatPlain(unitsNeeded)} x ${formatPHP(purchasePricePerUnit)} = ${formatPHP(computed.relevantBuyCost)}.`,
                `Cost advantage = ${formatPHP(computed.relevantBuyCost)} - ${formatPHP(computed.relevantMakeCost)} = ${formatPHP(computed.costAdvantageAmount)}.`,
            ],
            interpretation:
                computed.preferredOption === "Indifferent"
                    ? "The entered make and buy costs are financially equal before qualitative factors are considered."
                    : `${computed.preferredOption} is financially better under the entered relevant-cost assumptions.`,
            assumptions: [
                "Only avoidable fixed costs belong in the make-or-buy comparison.",
                "Capacity reuse, supplier quality, and strategic sourcing effects should still be evaluated separately.",
            ],
        };
    },
};

export const sellProcessFurtherSolveDefinition: FormulaCalculatorDefinition = {
    id: "sell-process-further-solve",
    defaultTarget: "incrementalProfitFromProcessing",
    fields: {
        units: { key: "units", label: "Units", placeholder: "6000", kind: "number" },
        salesValueAtSplitoffPerUnit: { key: "salesValueAtSplitoffPerUnit", label: "Split-off Sales Value / Unit", placeholder: "48", kind: "money" },
        salesValueAfterProcessingPerUnit: { key: "salesValueAfterProcessingPerUnit", label: "Sales Value after Processing / Unit", placeholder: "63", kind: "money" },
        separableProcessingCostPerUnit: { key: "separableProcessingCostPerUnit", label: "Separable Processing Cost / Unit", placeholder: "9", kind: "money" },
        incrementalRevenueFromProcessing: { key: "incrementalRevenueFromProcessing", label: "Incremental Revenue", placeholder: "90000", kind: "money" },
        incrementalProfitFromProcessing: { key: "incrementalProfitFromProcessing", label: "Incremental Profit", placeholder: "36000", kind: "money" },
        minimumFurtherProcessingPricePerUnit: { key: "minimumFurtherProcessingPricePerUnit", label: "Minimum After-Processing Price / Unit", placeholder: "57", kind: "money" },
    },
    targets: [
        { key: "incrementalProfitFromProcessing", label: "Incremental Profit", summary: "Compare incremental revenue and separable processing cost to decide whether further processing adds value." },
        { key: "incrementalRevenueFromProcessing", label: "Incremental Revenue", summary: "Measure only the extra revenue created by selling after additional processing." },
        { key: "minimumFurtherProcessingPricePerUnit", label: "Minimum After-Processing Price", summary: "Compute the selling price per unit needed after processing to break even with the split-off option." },
    ],
    getInputKeys() {
        return ["units", "salesValueAtSplitoffPerUnit", "salesValueAfterProcessingPerUnit", "separableProcessingCostPerUnit"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Sell-or-process-further support",
            body: `Enter the visible split-off and further-processing values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        const units = values.units;
        const salesValueAtSplitoffPerUnit = values.salesValueAtSplitoffPerUnit;
        const salesValueAfterProcessingPerUnit = values.salesValueAfterProcessingPerUnit;
        const separableProcessingCostPerUnit = values.separableProcessingCostPerUnit;

        if (units <= 0) {
            return { error: "Units must be greater than zero." };
        }

        const computed = computeSellProcessFurther({
            units,
            salesValueAtSplitoffPerUnit,
            salesValueAfterProcessingPerUnit,
            separableProcessingCostPerUnit,
        });

        return {
            primaryResult: {
                title:
                    targetKey === "incrementalRevenueFromProcessing"
                        ? "Incremental Revenue"
                        : targetKey === "minimumFurtherProcessingPricePerUnit"
                          ? "Minimum After-Processing Price / Unit"
                          : "Incremental Profit",
                value:
                    targetKey === "incrementalRevenueFromProcessing"
                        ? formatPHP(computed.incrementalRevenueFromProcessing)
                        : targetKey === "minimumFurtherProcessingPricePerUnit"
                          ? formatPHP(computed.minimumFurtherProcessingPricePerUnit)
                          : formatPHP(computed.incrementalProfitFromProcessing),
                tone: targetKey === "incrementalProfitFromProcessing" && computed.incrementalProfitFromProcessing < 0 ? "warning" : "accent",
            },
            supportingResults: [
                { title: "Incremental Revenue", value: formatPHP(computed.incrementalRevenueFromProcessing) },
                { title: "Separable Costs", value: formatPHP(computed.separableProcessingCosts) },
                { title: "Break-even After-Processing Price", value: formatPHP(computed.minimumFurtherProcessingPricePerUnit) },
            ],
            formula: "Incremental profit from further processing = [(After-processing price - Split-off price) x Units] - Separable processing costs",
            steps: [
                `Incremental revenue = (${formatPHP(salesValueAfterProcessingPerUnit)} - ${formatPHP(salesValueAtSplitoffPerUnit)}) x ${formatPlain(units)} = ${formatPHP(computed.incrementalRevenueFromProcessing)}.`,
                `Separable processing costs = ${formatPHP(separableProcessingCostPerUnit)} x ${formatPlain(units)} = ${formatPHP(computed.separableProcessingCosts)}.`,
                `Incremental profit = ${formatPHP(computed.incrementalRevenueFromProcessing)} - ${formatPHP(computed.separableProcessingCosts)} = ${formatPHP(computed.incrementalProfitFromProcessing)}.`,
            ],
            interpretation: computed.recommendation,
            assumptions: [
                "Joint costs incurred before split-off are irrelevant to this decision because they do not change between the alternatives.",
            ],
        };
    },
};

export const constrainedResourceProductMixSolveDefinition: FormulaCalculatorDefinition = {
    id: "constrained-resource-product-mix-solve",
    defaultTarget: "contributionMarginPerConstraintUnit",
    fields: {
        sellingPricePerUnit: { key: "sellingPricePerUnit", label: "Selling Price / Unit", placeholder: "165", kind: "money" },
        variableCostPerUnit: { key: "variableCostPerUnit", label: "Variable Cost / Unit", placeholder: "105", kind: "money" },
        constrainedResourceUnitsPerProduct: { key: "constrainedResourceUnitsPerProduct", label: "Constraint Units per Product", placeholder: "3", kind: "number" },
        constrainedResourceAvailableUnits: { key: "constrainedResourceAvailableUnits", label: "Available Constraint Units", placeholder: "18000", kind: "number" },
        contributionMarginPerConstraintUnit: { key: "contributionMarginPerConstraintUnit", label: "CM per Constraint Unit", placeholder: "20", kind: "money" },
        maximumUnitsFromConstraint: { key: "maximumUnitsFromConstraint", label: "Maximum Units from Constraint", placeholder: "6000", kind: "number" },
        totalContributionMarginAtConstraint: { key: "totalContributionMarginAtConstraint", label: "Total CM at Constraint", placeholder: "360000", kind: "money" },
    },
    targets: [
        { key: "contributionMarginPerConstraintUnit", label: "CM per Constraint Unit", summary: "Rank products by contribution margin per scarce resource unit rather than by unit contribution alone." },
        { key: "maximumUnitsFromConstraint", label: "Maximum Units from Constraint", summary: "Estimate how many units the scarce resource can support." },
        { key: "totalContributionMarginAtConstraint", label: "Total CM at Constraint", summary: "Estimate total contribution margin if the scarce resource is dedicated to this product." },
    ],
    getInputKeys() {
        return ["sellingPricePerUnit", "variableCostPerUnit", "constrainedResourceUnitsPerProduct", "constrainedResourceAvailableUnits"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Constrained-resource product mix",
            body: `Enter the visible contribution and bottleneck values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        const sellingPricePerUnit = values.sellingPricePerUnit;
        const variableCostPerUnit = values.variableCostPerUnit;
        const constrainedResourceUnitsPerProduct = values.constrainedResourceUnitsPerProduct;
        const constrainedResourceAvailableUnits = values.constrainedResourceAvailableUnits;

        if (constrainedResourceUnitsPerProduct <= 0 || constrainedResourceAvailableUnits < 0) {
            return { error: "Constraint usage per product must be greater than zero and available constraint units cannot be negative." };
        }

        const computed = computeConstrainedResourceProductMix({
            sellingPricePerUnit,
            variableCostPerUnit,
            constrainedResourceUnitsPerProduct,
            constrainedResourceAvailableUnits,
        });

        return {
            primaryResult: {
                title:
                    targetKey === "maximumUnitsFromConstraint"
                        ? "Maximum Units from Constraint"
                        : targetKey === "totalContributionMarginAtConstraint"
                          ? "Total Contribution Margin at Constraint"
                          : "CM per Constraint Unit",
                value:
                    targetKey === "maximumUnitsFromConstraint"
                        ? formatPlain(computed.maximumUnitsFromConstraint)
                        : targetKey === "totalContributionMarginAtConstraint"
                          ? formatPHP(computed.totalContributionMarginAtConstraint)
                          : formatPHP(computed.contributionMarginPerConstraintUnit),
                tone: "accent",
            },
            supportingResults: [
                { title: "Contribution Margin / Unit", value: formatPHP(computed.contributionMarginPerUnit) },
                { title: "Maximum Units", value: formatPlain(computed.maximumUnitsFromConstraint) },
                { title: "Total CM at Constraint", value: formatPHP(computed.totalContributionMarginAtConstraint) },
            ],
            formula: "Contribution margin per constraint unit = (Selling price - Variable cost) / Constraint units per product",
            steps: [
                `Contribution margin per unit = ${formatPHP(sellingPricePerUnit)} - ${formatPHP(variableCostPerUnit)} = ${formatPHP(computed.contributionMarginPerUnit)}.`,
                `Contribution margin per constraint unit = ${formatPHP(computed.contributionMarginPerUnit)} / ${formatPlain(constrainedResourceUnitsPerProduct)} = ${formatPHP(computed.contributionMarginPerConstraintUnit)}.`,
                `Maximum units from the constraint = ${formatPlain(constrainedResourceAvailableUnits)} / ${formatPlain(constrainedResourceUnitsPerProduct)} = ${formatPlain(computed.maximumUnitsFromConstraint)}.`,
            ],
            interpretation:
                "Use the contribution margin per scarce-resource unit to rank competing products before using raw unit margin alone.",
            assumptions: [
                "This screen evaluates one product at a time. Multi-product optimization still needs ranking across competing products and may require demand limits or other constraints.",
            ],
        };
    },
};

export const budgetVarianceAnalysisSolveDefinition: FormulaCalculatorDefinition = {
    id: "budget-variance-analysis-solve",
    defaultTarget: "totalBudgetVariance",
    fields: {
        actualResultAmount: { key: "actualResultAmount", label: "Actual Amount", placeholder: "528000", kind: "money" },
        flexibleBudgetAmount: { key: "flexibleBudgetAmount", label: "Flexible Budget Amount", placeholder: "510000", kind: "money" },
        staticBudgetAmount: { key: "staticBudgetAmount", label: "Static Budget Amount", placeholder: "495000", kind: "money" },
        spendingVariance: { key: "spendingVariance", label: "Spending Variance", placeholder: "18000", kind: "money" },
        activityVariance: { key: "activityVariance", label: "Activity Variance", placeholder: "15000", kind: "money" },
        totalBudgetVariance: { key: "totalBudgetVariance", label: "Total Variance", placeholder: "33000", kind: "money" },
    },
    targets: [
        { key: "totalBudgetVariance", label: "Total Variance", summary: "Compare actual performance against the static plan." },
        { key: "spendingVariance", label: "Spending Variance", summary: "Isolate the gap between actual results and the flexible-budget benchmark." },
        { key: "activityVariance", label: "Activity Variance", summary: "Isolate the gap between flexible and static budget caused by the activity level." },
    ],
    getInputKeys() {
        return ["actualResultAmount", "flexibleBudgetAmount", "staticBudgetAmount"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Budget variance analysis",
            body: `Enter the visible actual, flexible, and static budget amounts to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        const computed = computeBudgetVarianceAnalysis({
            actualResultAmount: values.actualResultAmount,
            flexibleBudgetAmount: values.flexibleBudgetAmount,
            staticBudgetAmount: values.staticBudgetAmount,
        });

        return {
            primaryResult: {
                title:
                    targetKey === "spendingVariance"
                        ? "Spending Variance"
                        : targetKey === "activityVariance"
                          ? "Activity Variance"
                          : "Total Variance",
                value:
                    targetKey === "spendingVariance"
                        ? formatPHP(computed.spendingVariance)
                        : targetKey === "activityVariance"
                          ? formatPHP(computed.activityVariance)
                          : formatPHP(computed.totalBudgetVariance),
                tone: "accent",
            },
            supportingResults: [
                { title: "Spending Variance", value: `${formatPHP(computed.spendingVariance)} | ${computed.spendingVarianceLabel}` },
                { title: "Activity Variance", value: `${formatPHP(computed.activityVariance)} | ${computed.activityVarianceLabel}` },
                { title: "Total Variance", value: formatPHP(computed.totalBudgetVariance) },
            ],
            formula: "Total variance = Actual - Static budget; Spending variance = Actual - Flexible budget; Activity variance = Flexible budget - Static budget",
            steps: [
                `Spending variance = ${formatPHP(values.actualResultAmount)} - ${formatPHP(values.flexibleBudgetAmount)} = ${formatPHP(computed.spendingVariance)}.`,
                `Activity variance = ${formatPHP(values.flexibleBudgetAmount)} - ${formatPHP(values.staticBudgetAmount)} = ${formatPHP(computed.activityVariance)}.`,
                `Total variance = ${formatPHP(values.actualResultAmount)} - ${formatPHP(values.staticBudgetAmount)} = ${formatPHP(computed.totalBudgetVariance)}.`,
            ],
            interpretation:
                "This view helps separate execution performance from the effect of operating at a different activity level than the static plan assumed.",
        };
    },
};

export const movingAverageForecastSolveDefinition: FormulaCalculatorDefinition = {
    id: "moving-average-forecast-solve",
    defaultTarget: "weightedMovingAverageForecast",
    fields: {
        period1Demand: { key: "period1Demand", label: "Oldest Period Demand", placeholder: "920", kind: "number" },
        period2Demand: { key: "period2Demand", label: "Middle Period Demand", placeholder: "980", kind: "number" },
        period3Demand: { key: "period3Demand", label: "Latest Period Demand", placeholder: "1040", kind: "number" },
        weight1Percent: { key: "weight1Percent", label: "Oldest Weight (%)", placeholder: "20", kind: "percent" },
        weight2Percent: { key: "weight2Percent", label: "Middle Weight (%)", placeholder: "30", kind: "percent" },
        weight3Percent: { key: "weight3Percent", label: "Latest Weight (%)", placeholder: "50", kind: "percent" },
        simpleMovingAverageForecast: { key: "simpleMovingAverageForecast", label: "Simple Moving Average Forecast", placeholder: "980", kind: "number" },
        weightedMovingAverageForecast: { key: "weightedMovingAverageForecast", label: "Weighted Moving Average Forecast", placeholder: "1004", kind: "number" },
    },
    targets: [
        { key: "weightedMovingAverageForecast", label: "Weighted Forecast", summary: "Forecast the next period using custom weights that emphasize recent demand." },
        { key: "simpleMovingAverageForecast", label: "Simple Forecast", summary: "Forecast the next period using an equal-weight three-period moving average." },
    ],
    getInputKeys() {
        return ["period1Demand", "period2Demand", "period3Demand", "weight1Percent", "weight2Percent", "weight3Percent"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Moving-average forecasting",
            body: `Enter the recent demand history and weights to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        const computed = computeMovingAverageForecast({
            period1Demand: values.period1Demand,
            period2Demand: values.period2Demand,
            period3Demand: values.period3Demand,
            weight1Percent: values.weight1Percent,
            weight2Percent: values.weight2Percent,
            weight3Percent: values.weight3Percent,
        });

        if (!Number.isFinite(computed.weightedMovingAverageForecast)) {
            return { error: "The total weight must be greater than zero to compute a weighted moving-average forecast." };
        }

        return {
            primaryResult: {
                title:
                    targetKey === "simpleMovingAverageForecast"
                        ? "Simple Moving Average Forecast"
                        : "Weighted Moving Average Forecast",
                value:
                    targetKey === "simpleMovingAverageForecast"
                        ? formatPlain(computed.simpleMovingAverageForecast)
                        : formatPlain(computed.weightedMovingAverageForecast),
                tone: "accent",
            },
            supportingResults: [
                { title: "Simple Forecast", value: formatPlain(computed.simpleMovingAverageForecast) },
                { title: "Weighted Forecast", value: formatPlain(computed.weightedMovingAverageForecast) },
                { title: "Latest Change", value: formatPlain(computed.latestTrendChange) },
            ],
            formula: "Weighted forecast = Sum(Demand x Weight) / Total weight",
            steps: [
                `Simple moving average = (${formatPlain(values.period1Demand)} + ${formatPlain(values.period2Demand)} + ${formatPlain(values.period3Demand)}) / 3 = ${formatPlain(computed.simpleMovingAverageForecast)}.`,
                `Weighted forecast uses a total weight of ${formatPercent(computed.totalWeightPercent)} and produces ${formatPlain(computed.weightedMovingAverageForecast)}.`,
                `Latest trend change = ${formatPlain(values.period3Demand)} - ${formatPlain(values.period2Demand)} = ${formatPlain(computed.latestTrendChange)}.`,
            ],
            interpretation:
                "Use the weighted version when recent periods deserve more influence than older demand observations.",
            assumptions: [
                "This page keeps the horizon deliberately short for quick coursework and operational planning checks. Seasonal patterns may still need a broader forecasting method.",
            ],
        };
    },
};

export const intercompanyInventoryProfitSolveDefinition: FormulaCalculatorDefinition = {
    id: "intercompany-inventory-profit-solve",
    defaultTarget: "unrealizedProfitInEndingInventory",
    fields: {
        transferPrice: {
            key: "transferPrice",
            label: "Intercompany Transfer Price",
            placeholder: "240000",
            kind: "money",
        },
        markupRateOnCostPercent: {
            key: "markupRateOnCostPercent",
            label: "Markup on Cost (%)",
            placeholder: "25",
            kind: "percent",
        },
        percentUnsoldAtPeriodEnd: {
            key: "percentUnsoldAtPeriodEnd",
            label: "Unsold at Period-End (%)",
            placeholder: "40",
            kind: "percent",
        },
        unrealizedProfitInEndingInventory: {
            key: "unrealizedProfitInEndingInventory",
            label: "Unrealized Profit",
            placeholder: "19200",
            kind: "money",
        },
    },
    targets: [
        {
            key: "unrealizedProfitInEndingInventory",
            label: "Unrealized Profit",
            summary: "Compute the intercompany profit still trapped in ending inventory.",
        },
        {
            key: "transferPrice",
            label: "Transfer Price",
            summary: "Back-solve the intercompany transfer amount implied by markup and unrealized profit.",
        },
    ],
    getInputKeys(targetKey) {
        return targetKey === "transferPrice"
            ? [
                  "markupRateOnCostPercent",
                  "percentUnsoldAtPeriodEnd",
                  "unrealizedProfitInEndingInventory",
              ]
            : [
                  "transferPrice",
                  "markupRateOnCostPercent",
                  "percentUnsoldAtPeriodEnd",
              ];
    },
    getEmptyState(targetKey) {
        return {
            title: "Intercompany inventory profit elimination",
            body: `Enter the transfer and inventory values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        let transferPrice = values.transferPrice;
        const markupRateOnCostPercent = values.markupRateOnCostPercent;
        const percentUnsoldAtPeriodEnd = values.percentUnsoldAtPeriodEnd;
        let unrealizedProfitInEndingInventory = values.unrealizedProfitInEndingInventory;

        if (
            markupRateOnCostPercent < 0 ||
            percentUnsoldAtPeriodEnd < 0 ||
            percentUnsoldAtPeriodEnd > 100
        ) {
            return {
                error: "Markup rate must stay non-negative and the unsold percentage must stay between 0 and 100.",
            };
        }

        const eliminationRate =
            (markupRateOnCostPercent / 100) /
            (1 + markupRateOnCostPercent / 100) *
            (percentUnsoldAtPeriodEnd / 100);

        if (targetKey === "transferPrice") {
            if (eliminationRate <= 0) {
                return {
                    error: "Markup and unsold percentage must both be greater than zero when solving for transfer price.",
                };
            }

            transferPrice = unrealizedProfitInEndingInventory / eliminationRate;
        } else {
            unrealizedProfitInEndingInventory = computeIntercompanyInventoryProfit({
                transferPrice,
                markupRateOnCostPercent,
                percentUnsoldAtPeriodEnd,
            }).unrealizedProfitInEndingInventory;
        }

        if (
            ![transferPrice, unrealizedProfitInEndingInventory].every(Number.isFinite) ||
            transferPrice < 0 ||
            unrealizedProfitInEndingInventory < 0
        ) {
            return { error: "The selected intercompany-inventory values do not produce a valid non-negative answer." };
        }

        const computed = computeIntercompanyInventoryProfit({
            transferPrice,
            markupRateOnCostPercent,
            percentUnsoldAtPeriodEnd,
        });

        return {
            primaryResult: {
                title:
                    targetKey === "transferPrice"
                        ? "Intercompany Transfer Price"
                        : "Unrealized Profit in Ending Inventory",
                value:
                    targetKey === "transferPrice"
                        ? formatPHP(transferPrice)
                        : formatPHP(computed.unrealizedProfitInEndingInventory),
                tone: "accent",
            },
            supportingResults: [
                { title: "Transferred Cost", value: formatPHP(computed.transferredCost) },
                { title: "Intercompany Gross Profit", value: formatPHP(computed.intercompanyGrossProfit) },
                { title: "Realized Profit Portion", value: formatPHP(computed.realizedProfitPortion) },
            ],
            formula: "Unrealized profit = Transfer price x [markup / (100 + markup)] x Unsold %",
            steps: [
                `Profit in the transfer = ${formatPHP(transferPrice)} - ${formatPHP(computed.transferredCost)} = ${formatPHP(computed.intercompanyGrossProfit)}.`,
                `Unrealized portion = ${formatPHP(computed.intercompanyGrossProfit)} x ${formatPercent(percentUnsoldAtPeriodEnd)} = ${formatPHP(computed.unrealizedProfitInEndingInventory)}.`,
            ],
            interpretation: `The group still carries ${formatPHP(computed.unrealizedProfitInEndingInventory)} of seller profit inside ending inventory, so that amount normally needs elimination in consolidation support.`,
            assumptions: [
                "This helper assumes markup is stated on cost and focuses only on the unrealized-profit amount, not the full upstream-versus-downstream attribution entry.",
            ],
            warnings: [
                "If the case gives markup on selling price instead of markup on cost, convert the basis before relying on this result.",
            ],
        };
    },
};

export const notesReceivableDiscountingSolveDefinition: FormulaCalculatorDefinition = {
    id: "notes-receivable-discounting-solve",
    defaultTarget: "proceedsFromDiscounting",
    fields: {
        faceValue: { key: "faceValue", label: "Face Value", placeholder: "250000", kind: "money" },
        statedRate: { key: "statedRate", label: "Note Rate (%)", placeholder: "10", kind: "percent" },
        marketRate: { key: "marketRate", label: "Bank Discount Rate (%)", placeholder: "12", kind: "percent" },
        time: { key: "time", label: "Remaining Term (years)", placeholder: "0.5", kind: "time" },
        maturityValue: { key: "maturityValue", label: "Maturity Value", placeholder: "262500", kind: "money" },
        bankDiscountAmount: { key: "bankDiscountAmount", label: "Bank Discount", placeholder: "15750", kind: "money" },
        proceedsFromDiscounting: { key: "proceedsFromDiscounting", label: "Proceeds", placeholder: "246750", kind: "money" },
    },
    targets: [
        { key: "proceedsFromDiscounting", label: "Discounting Proceeds", summary: "Compute the cash proceeds when a note receivable is discounted before maturity." },
        { key: "maturityValue", label: "Maturity Value", summary: "Review the maturity amount of the note before the bank discount is deducted." },
        { key: "bankDiscountAmount", label: "Bank Discount", summary: "Compute the amount kept by the bank when the note is discounted." },
    ],
    getInputKeys(targetKey) {
        if (targetKey === "maturityValue") return ["faceValue", "statedRate", "time"];
        return ["faceValue", "statedRate", "marketRate", "time"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Notes receivable discounting",
            body: `Enter the visible note and bank-discount values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        const faceValue = values.faceValue;
        const statedRatePercent = values.statedRate;
        const bankDiscountRatePercent = values.marketRate ?? 0;
        const timeYears = values.time;

        if ([faceValue, statedRatePercent, bankDiscountRatePercent, timeYears].some((value) => value < 0)) {
            return { error: "Face value, rates, and remaining term must stay non-negative." };
        }

        const computed = computeNotesReceivableDiscounting({
            faceValue,
            statedRatePercent,
            bankDiscountRatePercent,
            timeYears,
        });

        return {
            primaryResult: {
                title: targetKey === "maturityValue" ? "Maturity Value" : targetKey === "bankDiscountAmount" ? "Bank Discount" : "Discounting Proceeds",
                value: targetKey === "maturityValue" ? formatPHP(computed.maturityValue) : targetKey === "bankDiscountAmount" ? formatPHP(computed.bankDiscountAmount) : formatPHP(computed.proceedsFromDiscounting),
                tone: "accent",
            },
            supportingResults: [
                { title: "Note Interest", value: formatPHP(computed.noteInterest) },
                { title: "Maturity Value", value: formatPHP(computed.maturityValue) },
                { title: "Bank Discount", value: formatPHP(computed.bankDiscountAmount) },
            ],
            formula: "Proceeds = Maturity value - Bank discount, where Maturity value = Face value + (Face value × Note rate × Remaining term)",
            steps: [
                `Note interest = ${formatPHP(faceValue)} × ${computed.statedRateDecimal.toFixed(4)} × ${formatPlain(timeYears)} = ${formatPHP(computed.noteInterest)}.`,
                `Maturity value = ${formatPHP(faceValue)} + ${formatPHP(computed.noteInterest)} = ${formatPHP(computed.maturityValue)}.`,
                `Bank discount = ${formatPHP(computed.maturityValue)} × ${computed.bankDiscountRateDecimal.toFixed(4)} × ${formatPlain(timeYears)} = ${formatPHP(computed.bankDiscountAmount)}.`,
                `Proceeds = ${formatPHP(computed.maturityValue)} - ${formatPHP(computed.bankDiscountAmount)} = ${formatPHP(computed.proceedsFromDiscounting)}.`,
            ],
            interpretation: `Discounting the note would bring in ${formatPHP(computed.proceedsFromDiscounting)} in cash, after the bank keeps ${formatPHP(computed.bankDiscountAmount)} from the note's maturity value.`,
            warnings: [
                "This helper treats the remaining term as one simple-interest period. If the case uses exact days or a different discount basis, adjust the time basis before relying on the result.",
            ],
        };
    },
};

export const equityMethodInvestmentSolveDefinition: FormulaCalculatorDefinition = {
    id: "equity-method-investment-solve",
    defaultTarget: "endingInvestmentBalance",
    fields: {
        initialInvestment: { key: "initialInvestment", label: "Beginning Investment Balance", placeholder: "1800000", kind: "money" },
        ownershipPercentage: { key: "ownershipPercentage", label: "Ownership (%)", placeholder: "30", kind: "percent" },
        netIncome: { key: "netIncome", label: "Investee Net Income", placeholder: "420000", kind: "money" },
        dividendsDeclared: { key: "dividendsDeclared", label: "Investee Dividends Declared", placeholder: "90000", kind: "money" },
        investorShareInIncome: { key: "investorShareInIncome", label: "Investor Share in Income", placeholder: "126000", kind: "money" },
        dividendsReceived: { key: "dividendsReceived", label: "Dividends Received", placeholder: "27000", kind: "money" },
        endingInvestmentBalance: { key: "endingInvestmentBalance", label: "Ending Investment Balance", placeholder: "1899000", kind: "money" },
    },
    targets: [
        { key: "endingInvestmentBalance", label: "Ending Investment", summary: "Roll the investment balance forward under the equity method." },
        { key: "investorShareInIncome", label: "Share in Income", summary: "Compute the investor's income share from ownership percentage and investee earnings." },
        { key: "dividendsReceived", label: "Dividends Received", summary: "Compute the investor's share of investee dividends." },
    ],
    getInputKeys(targetKey) {
        if (targetKey === "endingInvestmentBalance") {
            return ["initialInvestment", "ownershipPercentage", "netIncome", "dividendsDeclared"];
        }
        return ["ownershipPercentage", targetKey === "investorShareInIncome" ? "netIncome" : "dividendsDeclared"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Equity method investment support",
            body: `Enter the visible equity-method inputs to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        const initialInvestment = values.initialInvestment ?? 0;
        const ownershipPercentage = values.ownershipPercentage;
        const investeeNetIncome = values.netIncome ?? 0;
        const investeeDividendsDeclared = values.dividendsDeclared ?? 0;

        if (ownershipPercentage < 0 || ownershipPercentage > 100) {
            return { error: "Ownership percentage must stay between 0 and 100." };
        }

        const computed = computeEquityMethodInvestment({
            initialInvestment,
            ownershipPercentage,
            investeeNetIncome,
            investeeDividendsDeclared,
        });

        return {
            primaryResult: {
                title: targetKey === "investorShareInIncome" ? "Investor Share in Income" : targetKey === "dividendsReceived" ? "Dividends Received" : "Ending Investment Balance",
                value: targetKey === "investorShareInIncome" ? formatPHP(computed.investorShareInIncome) : targetKey === "dividendsReceived" ? formatPHP(computed.dividendsReceived) : formatPHP(computed.endingInvestmentBalance),
                tone: "accent",
            },
            supportingResults: [
                { title: "Ownership Decimal", value: computed.ownershipDecimal.toFixed(4) },
                { title: "Share in Income", value: formatPHP(computed.investorShareInIncome) },
                { title: "Dividends Received", value: formatPHP(computed.dividendsReceived) },
            ],
            formula: "Ending investment = Beginning investment + Investor share in income - Dividends received",
            steps: [
                `Investor share in income = ${formatPHP(investeeNetIncome)} × ${computed.ownershipDecimal.toFixed(4)} = ${formatPHP(computed.investorShareInIncome)}.`,
                `Dividends received = ${formatPHP(investeeDividendsDeclared)} × ${computed.ownershipDecimal.toFixed(4)} = ${formatPHP(computed.dividendsReceived)}.`,
                `Ending investment = ${formatPHP(initialInvestment)} + ${formatPHP(computed.investorShareInIncome)} - ${formatPHP(computed.dividendsReceived)} = ${formatPHP(computed.endingInvestmentBalance)}.`,
            ],
            interpretation: `Under this simplified equity-method view, the investor ends the period with an investment balance of ${formatPHP(computed.endingInvestmentBalance)} after recognizing its share of investee income and reducing the carrying amount for dividends.`,
            assumptions: [
                "This helper focuses on the core equity-method rollforward only. It does not add fair-value differentials, amortization of acquisition-date excess, or impairment testing.",
            ],
        };
    },
};

export const intercompanyPpeTransferSolveDefinition: FormulaCalculatorDefinition = {
    id: "intercompany-ppe-transfer-solve",
    defaultTarget: "unamortizedIntercompanyProfit",
    fields: {
        transferPrice: { key: "transferPrice", label: "Transfer Price", placeholder: "540000", kind: "money" },
        carryingAmount: { key: "carryingAmount", label: "Seller Carrying Amount", placeholder: "480000", kind: "money" },
        usefulLife: { key: "usefulLife", label: "Remaining Useful Life (years)", placeholder: "5", kind: "time" },
        year: { key: "year", label: "Years Since Transfer", placeholder: "1", kind: "time" },
        annualExcessDepreciation: { key: "annualExcessDepreciation", label: "Annual Excess Depreciation", placeholder: "12000", kind: "money" },
        unamortizedIntercompanyProfit: { key: "unamortizedIntercompanyProfit", label: "Unamortized Intercompany Profit", placeholder: "48000", kind: "money" },
    },
    targets: [
        { key: "unamortizedIntercompanyProfit", label: "Unamortized Profit", summary: "Compute the intercompany profit still embedded in the transferred PPE after excess depreciation." },
        { key: "annualExcessDepreciation", label: "Annual Excess Depreciation", summary: "Compute the yearly excess depreciation created by the transfer gain." },
    ],
    getInputKeys(_targetKey) {
        return ["transferPrice", "carryingAmount", "usefulLife", "year"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Intercompany PPE transfer elimination",
            body: `Enter the visible transfer values to solve for ${targetKey}.`,
        };
    },
    solve(_targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        const transferPrice = values.transferPrice;
        const carryingAmount = values.carryingAmount;
        const remainingUsefulLifeYears = values.usefulLife;
        const yearsSinceTransfer = values.year;

        if (remainingUsefulLifeYears <= 0 || yearsSinceTransfer < 0) {
            return { error: "Remaining useful life must be greater than zero and elapsed years cannot be negative." };
        }

        const computed = computeIntercompanyPpeTransfer({
            transferPrice,
            carryingAmount,
            remainingUsefulLifeYears,
            yearsSinceTransfer,
        });

        if (!Number.isFinite(computed.annualExcessDepreciation)) {
            return { error: "The selected intercompany-PPE values do not produce a valid excess-depreciation schedule." };
        }

        return {
            primaryResult: {
                title: "Unamortized Intercompany Profit",
                value: formatPHP(computed.unamortizedIntercompanyProfit),
                tone: "accent",
            },
            supportingResults: [
                { title: "Unrealized Gain on Transfer", value: formatPHP(computed.unrealizedGainOnTransfer) },
                { title: "Annual Excess Depreciation", value: formatPHP(computed.annualExcessDepreciation) },
                { title: "Recognized to Date", value: formatPHP(computed.depreciationAdjustmentRecognizedToDate) },
            ],
            formula: "Unamortized profit = (Transfer price - Seller carrying amount) - Annual excess depreciation recognized to date",
            steps: [
                `Unrealized gain on transfer = ${formatPHP(transferPrice)} - ${formatPHP(carryingAmount)} = ${formatPHP(computed.unrealizedGainOnTransfer)}.`,
                `Annual excess depreciation = ${formatPHP(computed.unrealizedGainOnTransfer)} / ${formatPlain(remainingUsefulLifeYears)} = ${formatPHP(computed.annualExcessDepreciation)}.`,
                `Recognized to date = ${formatPHP(computed.annualExcessDepreciation)} × ${formatPlain(yearsSinceTransfer)} = ${formatPHP(computed.depreciationAdjustmentRecognizedToDate)}.`,
                `Unamortized profit = ${formatPHP(computed.unrealizedGainOnTransfer)} - ${formatPHP(computed.depreciationAdjustmentRecognizedToDate)} = ${formatPHP(computed.unamortizedIntercompanyProfit)}.`,
            ],
            interpretation: `The group still carries ${formatPHP(computed.unamortizedIntercompanyProfit)} of intercompany profit in the transferred PPE, while ${formatPHP(computed.annualExcessDepreciation)} becomes the recurring consolidation depreciation adjustment per year.`,
            assumptions: [
                "This helper assumes straight-line depreciation over the remaining life and focuses on the core elimination logic for classroom AFAR cases.",
            ],
        };
    },
};

export const vatReconciliationSolveDefinition: FormulaCalculatorDefinition = {
    id: "vat-reconciliation-solve",
    defaultTarget: "netVatPayable",
    fields: {
        taxableSalesAmount: {
            key: "taxableSalesAmount",
            label: "Taxable Sales",
            placeholder: "850000",
            kind: "money",
        },
        vatablePurchasesAmount: {
            key: "vatablePurchasesAmount",
            label: "Vatable Purchases",
            placeholder: "420000",
            kind: "money",
        },
        vatRatePercent: {
            key: "vatRatePercent",
            label: "VAT Rate (%)",
            placeholder: String(PHILIPPINE_TAX_ASSUMPTIONS.vat.ratePercent),
            kind: "percent",
        },
        netVatPayable: {
            key: "netVatPayable",
            label: "Net VAT Payable",
            placeholder: "51600",
            kind: "money",
        },
    },
    targets: [
        {
            key: "netVatPayable",
            label: "Net VAT Payable",
            summary: "Compute output VAT less input VAT from one sales-and-purchases setup.",
        },
        {
            key: "taxableSalesAmount",
            label: "Taxable Sales",
            summary: "Back-solve the taxable sales base implied by VAT rate, purchases, and the net VAT position.",
        },
    ],
    getInputKeys(targetKey) {
        return targetKey === "taxableSalesAmount"
            ? ["vatablePurchasesAmount", "vatRatePercent", "netVatPayable"]
            : ["taxableSalesAmount", "vatablePurchasesAmount", "vatRatePercent"];
    },
    getEmptyState(targetKey) {
        return {
            title: "VAT reconciliation support",
            body: `Enter the visible VAT values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        let taxableSalesAmount = values.taxableSalesAmount;
        const vatablePurchasesAmount = values.vatablePurchasesAmount;
        const vatRatePercent = values.vatRatePercent;
        let netVatPayable = values.netVatPayable;

        if (vatRatePercent < 0 || vatablePurchasesAmount < 0) {
            return { error: "VAT rate and vatable purchases must stay non-negative." };
        }

        const vatRateDecimal = vatRatePercent / 100;
        if (targetKey === "taxableSalesAmount") {
            if (vatRateDecimal <= 0) {
                return { error: "VAT rate must be greater than zero when solving for taxable sales." };
            }
            taxableSalesAmount =
                (netVatPayable + vatablePurchasesAmount * vatRateDecimal) / vatRateDecimal;
        } else {
            netVatPayable = computeVatReconciliation({
                taxableSalesAmount,
                vatablePurchasesAmount,
                vatRatePercent,
            }).netVatPayable;
        }

        if (!Number.isFinite(taxableSalesAmount) || taxableSalesAmount < 0) {
            return { error: "The selected VAT values do not produce a valid non-negative taxable-sales base." };
        }

        const computed = computeVatReconciliation({
            taxableSalesAmount,
            vatablePurchasesAmount,
            vatRatePercent,
        });

        return {
            primaryResult: {
                title:
                    targetKey === "taxableSalesAmount"
                        ? "Taxable Sales"
                        : "Net VAT Payable",
                value:
                    targetKey === "taxableSalesAmount"
                        ? formatPHP(taxableSalesAmount)
                        : formatPHP(computed.netVatPayable),
                tone:
                    computed.remittancePosition === "payable"
                        ? "accent"
                        : computed.remittancePosition === "balanced"
                          ? "success"
                          : "warning",
            },
            supportingResults: [
                { title: "Output VAT", value: formatPHP(computed.outputVat) },
                { title: "Input VAT", value: formatPHP(computed.inputVat) },
                { title: "Position", value: computed.remittancePosition.replaceAll("-", " ") },
            ],
            formula: "Net VAT payable = Output VAT - Input VAT",
            steps: [
                `Output VAT = ${formatPHP(taxableSalesAmount)} x ${computed.vatRateDecimal.toFixed(4)} = ${formatPHP(computed.outputVat)}.`,
                `Input VAT = ${formatPHP(vatablePurchasesAmount)} x ${computed.vatRateDecimal.toFixed(4)} = ${formatPHP(computed.inputVat)}.`,
                `Net VAT payable = ${formatPHP(computed.outputVat)} - ${formatPHP(computed.inputVat)} = ${formatPHP(computed.netVatPayable)}.`,
            ],
            interpretation:
                computed.remittancePosition === "payable"
                    ? `Output VAT exceeds input VAT by ${formatPHP(computed.netVatPayable)}, so the period points to a VAT remittance payable.`
                    : computed.remittancePosition === "balanced"
                      ? "Output VAT and input VAT offset each other exactly in this simplified setup."
                      : `Input VAT exceeds output VAT by ${formatPHP(Math.abs(computed.netVatPayable))}, so the setup points to excess input VAT rather than an immediate net payable.`,
            assumptions: buildTaxAssumptionNotes(
                PHILIPPINE_TAX_ASSUMPTIONS.vat,
                ["This classroom helper assumes one VAT rate across the entered taxable sales and vatable purchases and does not replace full legal classification of zero-rated, exempt, or specially treated items."]
            ),
            warnings: [
                "Always confirm that the sales and purchases you entered are actually VATable and belong to the same reporting period before treating the result as a filing answer.",
            ],
        };
    },
};

export const withholdingTaxSolveDefinition: FormulaCalculatorDefinition = {
    id: "withholding-tax-solve",
    defaultTarget: "taxWithheld",
    fields: {
        taxBase: { key: "taxBase", label: "Tax Base", placeholder: "85000", kind: "money" },
        ratePercent: { key: "ratePercent", label: "Rate (%)", placeholder: "10", kind: "percent" },
        taxWithheld: { key: "taxWithheld", label: "Tax Withheld", placeholder: "8500", kind: "money" },
    },
    targets: [
        { key: "taxWithheld", label: "Tax Withheld", summary: "Compute the amount to withhold from the tax base." },
        { key: "taxBase", label: "Tax Base", summary: "Back-solve the base amount from the withholding amount and rate." },
        { key: "ratePercent", label: "Rate", summary: "Back-solve the implied withholding rate." },
    ],
    getInputKeys(targetKey) {
        if (targetKey === "taxBase") return ["taxWithheld", "ratePercent"];
        if (targetKey === "ratePercent") return ["taxBase", "taxWithheld"];
        return ["taxBase", "ratePercent"];
    },
    getEmptyState(targetKey) {
        return {
            title: "Withholding tax check",
            body: `Enter the visible tax values to solve for ${targetKey}.`,
        };
    },
    solve(targetKey, values) {
        if (Object.values(values).some((value) => Number.isNaN(value))) return invalidNumberError();

        let taxBase = values.taxBase;
        let ratePercent = values.ratePercent;
        let taxWithheld = values.taxWithheld;

        if (targetKey === "taxBase") {
            if (ratePercent <= 0) return { error: "Rate must be greater than zero when solving for the tax base." };
            taxBase = taxWithheld / (ratePercent / 100);
        } else if (targetKey === "ratePercent") {
            if (taxBase <= 0) return { error: "Tax base must be greater than zero when solving for the rate." };
            ratePercent = (taxWithheld / taxBase) * 100;
        } else {
            taxWithheld = computeWithholdingTax({
                taxBase,
                ratePercent,
            }).taxWithheld;
        }

        const computed = computeWithholdingTax({
            taxBase,
            ratePercent,
        });

        return {
            primaryResult: {
                title:
                    targetKey === "taxBase"
                        ? "Tax Base"
                        : targetKey === "ratePercent"
                          ? "Rate"
                          : "Tax Withheld",
                value:
                    targetKey === "taxBase"
                        ? formatPHP(taxBase)
                        : targetKey === "ratePercent"
                          ? formatPercent(ratePercent)
                          : formatPHP(computed.taxWithheld),
                tone: "accent",
            },
            supportingResults: [
                { title: "Net After Withholding", value: formatPHP(computed.netAfterWithholding) },
                { title: "Rate (decimal)", value: computed.rateDecimal.toFixed(4) },
            ],
            formula: "Tax withheld = Tax base x Rate",
            steps: [
                `Tax withheld = ${formatPHP(taxBase)} x ${computed.rateDecimal.toFixed(4)} = ${formatPHP(computed.taxWithheld)}.`,
                `Net after withholding = ${formatPHP(taxBase)} - ${formatPHP(computed.taxWithheld)} = ${formatPHP(computed.netAfterWithholding)}.`,
            ],
            interpretation: `The withholding amount is ${formatPHP(computed.taxWithheld)}, leaving ${formatPHP(computed.netAfterWithholding)} after withholding from the stated base.`,
            assumptions: buildTaxAssumptionNotes(
                PHILIPPINE_TAX_ASSUMPTIONS.withholding,
                ["This calculator assumes the correct withholding regime and applicable rate have already been identified from the problem or tax reference."]
            ),
            warnings: [
                "Check whether the case involves final withholding, creditable withholding, or a different tax treatment before relying on the result.",
            ],
        };
    },
};
