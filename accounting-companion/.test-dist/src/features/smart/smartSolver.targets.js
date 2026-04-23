const SOLVE_TARGET_RULES = {
    "simple-interest": [
        { target: "principal", patterns: [/find (the )?principal/i, /solve for principal/i, /what principal/i] },
        { target: "rate", patterns: [/find (the )?rate/i, /what rate/i, /solve for rate/i] },
        { target: "time", patterns: [/solve for time/i, /how many years/i, /find the time/i] },
        { target: "interest", patterns: [/solve for interest/i, /how much interest/i, /\binterest\b/i] },
    ],
    "compound-interest": [
        { target: "principal", patterns: [/find (the )?principal/i, /solve for principal/i] },
        { target: "rate", patterns: [/find (the )?rate/i, /what rate/i, /solve for rate/i] },
        { target: "time", patterns: [/solve for time/i, /how many years/i] },
        { target: "totalAmount", patterns: [/maturity value/i, /future amount/i, /total amount/i, /compound amount/i] },
    ],
    "future-value": [
        { target: "futureValue", patterns: [/future value/i, /future amount/i, /amount after/i, /grow to/i] },
        { target: "presentValue", patterns: [/present value/i, /worth today/i, /present worth/i] },
        { target: "rate", patterns: [/what rate/i, /find (the )?rate/i, /solve for rate/i] },
        { target: "time", patterns: [/how many years/i, /solve for time/i] },
    ],
    "present-value": [
        { target: "presentValue", patterns: [/present value/i, /present worth/i, /worth today/i] },
        { target: "futureValue", patterns: [/future value/i, /future amount/i] },
        { target: "rate", patterns: [/what discount rate/i, /what rate/i, /solve for rate/i] },
        { target: "time", patterns: [/how many years/i, /solve for time/i] },
    ],
    "profit-loss": [
        { target: "revenue", patterns: [/solve for revenue/i, /what revenue/i, /find sales/i] },
        { target: "cost", patterns: [/solve for cost/i, /what cost/i] },
        { target: "difference", patterns: [/profit/i, /\bloss\b/i, /gain/i] },
    ],
    "markup-margin": [
        { target: "sellingPrice", patterns: [/what selling price/i, /what price/i, /find selling price/i] },
        { target: "cost", patterns: [/what cost/i, /allowable cost/i, /target cost/i] },
        { target: "marginPercent", patterns: [/what margin/i, /margin percentage/i, /margin %/i] },
        { target: "profit", patterns: [/profit/i, /markup/i] },
    ],
    "break-even": [
        { target: "breakEvenUnits", patterns: [/how many units/i, /units to break even/i, /break even units/i] },
        { target: "fixedCosts", patterns: [/find fixed cost/i, /what fixed cost/i, /solve for fixed costs/i] },
        { target: "sellingPricePerUnit", patterns: [/what selling price/i, /target selling price/i] },
        { target: "variableCostPerUnit", patterns: [/what variable cost/i, /target variable cost/i] },
    ],
    "contribution-margin": [
        { target: "contributionMargin", patterns: [/contribution margin/i, /\bcm\b/i] },
        { target: "sales", patterns: [/solve for sales/i, /what sales/i] },
        { target: "variableCosts", patterns: [/solve for variable cost/i, /what variable cost/i] },
    ],
    "current-ratio": [
        { target: "currentLiabilities", patterns: [/current liabilities/i, /solve for current liabilities/i] },
        { target: "currentAssets", patterns: [/current assets/i, /solve for current assets/i] },
        { target: "currentRatio", patterns: [/current ratio/i, /liquidity ratio/i] },
    ],
    "quick-ratio": [
        { target: "currentLiabilities", patterns: [/current liabilities/i, /solve for current liabilities/i] },
        { target: "cash", patterns: [/solve for cash/i, /what cash/i] },
        { target: "netReceivables", patterns: [/receivables/i, /solve for receivables/i] },
        { target: "quickRatio", patterns: [/quick ratio/i, /acid[- ]test/i] },
    ],
    "gross-profit-rate": [
        { target: "netSales", patterns: [/net sales/i, /solve for sales/i] },
        { target: "costOfGoodsSold", patterns: [/\bcogs\b/i, /cost of goods sold/i] },
        { target: "grossProfitRate", patterns: [/gross profit rate/i, /gross margin/i] },
    ],
    "return-on-assets": [
        { target: "netIncome", patterns: [/net income/i, /solve for net income/i] },
        { target: "averageTotalAssets", patterns: [/average assets/i, /average total assets/i] },
        { target: "returnOnAssets", patterns: [/\broa\b/i, /return on assets/i] },
    ],
    "return-on-equity": [
        { target: "netIncome", patterns: [/net income/i, /solve for net income/i] },
        { target: "averageEquity", patterns: [/average equity/i, /owners'? equity/i] },
        { target: "returnOnEquity", patterns: [/\broe\b/i, /return on equity/i] },
    ],
    "inventory-turnover": [
        { target: "averageInventory", patterns: [/average inventory/i, /solve for inventory/i] },
        { target: "costOfGoodsSold", patterns: [/\bcogs\b/i, /cost of goods sold/i] },
        { target: "inventoryTurnover", patterns: [/inventory turnover/i, /days in inventory/i] },
    ],
    "receivables-turnover": [
        { target: "averageAccountsReceivable", patterns: [/average receivables/i, /average accounts receivable/i] },
        { target: "netCreditSales", patterns: [/net credit sales/i, /credit sales/i] },
        { target: "receivablesTurnover", patterns: [/receivables turnover/i, /collection period/i] },
    ],
    "petty-cash-reconciliation": [
        { target: "shortageOrOverage", patterns: [/short(?:age)? and over/i, /shortage or overage/i, /cash short/i] },
        { target: "fundAmount", patterns: [/petty cash fund/i, /imprest fund/i, /fund amount/i] },
        { target: "cashOnHand", patterns: [/cash on hand/i, /cash counted/i, /actual cash/i] },
    ],
    "prepaid-expense-adjustment": [
        { target: "expenseRecognized", patterns: [/expense recognized/i, /prepaid expense adjustment/i, /adjusting entry/i] },
        { target: "endingPrepaid", patterns: [/ending prepaid/i, /remaining prepaid/i, /unused prepaid/i] },
        { target: "beginningPrepaid", patterns: [/beginning prepaid/i, /opening prepaid/i] },
    ],
    "unearned-revenue-adjustment": [
        { target: "revenueRecognized", patterns: [/revenue recognized/i, /earned portion/i, /unearned revenue adjustment/i] },
        { target: "endingUnearnedRevenue", patterns: [/ending unearned revenue/i, /remaining unearned/i] },
        { target: "beginningUnearnedRevenue", patterns: [/beginning unearned revenue/i, /opening unearned revenue/i] },
    ],
    "accrued-revenue-adjustment": [
        { target: "accruedRevenue", patterns: [/accrued revenue/i, /revenue earned but uncollected/i, /receivable adjustment/i] },
        { target: "revenueEarned", patterns: [/revenue earned/i, /service revenue earned/i] },
        { target: "cashCollected", patterns: [/cash collected/i, /cash received/i] },
    ],
    "accrued-expense-adjustment": [
        { target: "accruedExpense", patterns: [/accrued expense/i, /expense incurred but unpaid/i, /payable adjustment/i] },
        { target: "expenseIncurred", patterns: [/expense incurred/i, /total expense incurred/i] },
        { target: "cashPaid", patterns: [/cash paid/i, /cash payment/i] },
    ],
    "impairment-loss-workspace": [
        { target: "impairmentLoss", patterns: [/impairment loss/i, /write[- ]down/i] },
        { target: "carryingAmount", patterns: [/carrying amount/i, /book value before impairment/i] },
        { target: "valueInUse", patterns: [/value in use/i] },
    ],
    "asset-disposal-analysis": [
        { target: "gainOrLoss", patterns: [/gain or loss/i, /gain on disposal/i, /loss on disposal/i] },
        { target: "proceeds", patterns: [/proceeds/i, /selling price/i, /cash received on disposal/i] },
        { target: "accumulatedDepreciation", patterns: [/accumulated depreciation/i] },
    ],
    "production-budget": [
        { target: "requiredProductionUnits", patterns: [/required production/i, /units to produce/i, /production required/i, /units should be produced/i, /how many units should be produced/i] },
        { target: "budgetedSalesUnits", patterns: [/budgeted sales units/i, /expected sales units/i] },
        { target: "desiredEndingFinishedGoodsUnits", patterns: [/desired ending finished goods/i, /ending finished goods/i] },
    ],
    "direct-materials-purchases-budget": [
        { target: "materialsToPurchaseUnits", patterns: [/materials to purchase/i, /units to purchase/i, /materials purchases budget/i] },
        { target: "purchasesCost", patterns: [/purchase cost/i, /budgeted purchase cost/i] },
        { target: "budgetedProductionUnits", patterns: [/budgeted production units/i, /planned production units/i] },
    ],
    "direct-labor-budget": [
        { target: "totalDirectLaborCost", patterns: [/direct labor budget/i, /labor cost budget/i, /total direct labor cost/i] },
        { target: "totalDirectLaborHours", patterns: [/required labor hours/i, /total direct labor hours/i, /labor hours required/i] },
        { target: "directLaborRatePerHour", patterns: [/hourly labor rate/i, /labor rate per hour/i, /wage rate/i] },
    ],
    "factory-overhead-budget": [
        { target: "totalFactoryOverheadBudget", patterns: [/factory overhead budget/i, /manufacturing overhead budget/i, /total overhead budget/i] },
        { target: "variableFactoryOverheadBudget", patterns: [/variable overhead budget/i, /variable factory overhead/i] },
        { target: "variableOverheadRatePerUnit", patterns: [/variable overhead rate/i, /overhead rate per unit/i] },
    ],
    "inventory-budget": [
        { target: "purchasesRequiredCost", patterns: [/required purchases/i, /merchandise purchases/i, /inventory budget/i] },
        { target: "budgetedCostOfGoodsSold", patterns: [/budgeted cogs/i, /budgeted cost of goods sold/i] },
        { target: "desiredEndingInventoryCost", patterns: [/desired ending inventory/i, /ending inventory target/i] },
    ],
    "sales-budget": [
        { target: "budgetedSalesAmount", patterns: [/sales budget/i, /budgeted sales revenue/i, /sales revenue budget/i] },
        { target: "budgetedSalesUnits", patterns: [/budgeted unit sales/i, /planned unit sales/i, /sales units/i] },
        { target: "sellingPricePerUnit", patterns: [/selling price per unit/i, /planned selling price/i, /price per unit/i] },
    ],
    "operating-expense-budget": [
        { target: "totalOperatingExpenses", patterns: [/total operating expenses/i, /selling and administrative budget/i, /operating expense budget/i] },
        { target: "cashOperatingExpenses", patterns: [/cash operating expenses/i, /cash opex/i] },
        { target: "budgetedSalesAmount", patterns: [/budgeted sales/i, /sales budget/i] },
    ],
    "budgeted-income-statement": [
        { target: "netIncome", patterns: [/budgeted net income/i, /pro forma net income/i, /net income/i] },
        { target: "grossProfit", patterns: [/gross profit/i, /gross margin amount/i] },
        { target: "incomeBeforeTax", patterns: [/income before tax/i, /pretax income/i, /profit before tax/i] },
    ],
    "special-order-analysis": [
        { target: "incrementalProfit", patterns: [/incremental profit/i, /special order decision/i, /accept the special order/i] },
        { target: "minimumAcceptablePricePerUnit", patterns: [/minimum acceptable price/i, /break even special order price/i] },
        { target: "incrementalRevenue", patterns: [/incremental revenue/i, /additional revenue/i] },
    ],
    "make-or-buy-analysis": [
        { target: "costAdvantageAmount", patterns: [/cost advantage/i, /make or buy/i, /which is cheaper/i] },
        { target: "relevantMakeCost", patterns: [/relevant make cost/i, /cost to make/i] },
        { target: "maximumAcceptablePurchasePricePerUnit", patterns: [/maximum buy price/i, /indifference buy price/i] },
    ],
    "sell-or-process-further": [
        { target: "incrementalProfitFromProcessing", patterns: [/incremental profit/i, /sell or process further/i, /process further decision/i] },
        { target: "incrementalRevenueFromProcessing", patterns: [/incremental revenue/i, /additional revenue from processing/i] },
        { target: "minimumFurtherProcessingPricePerUnit", patterns: [/minimum after processing price/i, /break even processed selling price/i] },
    ],
    "constrained-resource-product-mix": [
        { target: "contributionMarginPerConstraintUnit", patterns: [/contribution per machine hour/i, /cm per constraint unit/i, /contribution margin per constrained resource unit/i, /bottleneck ranking/i] },
        { target: "maximumUnitsFromConstraint", patterns: [/maximum units from constraint/i, /units supported by bottleneck/i] },
        { target: "totalContributionMarginAtConstraint", patterns: [/total contribution margin/i, /total cm at constraint/i] },
    ],
    "transfer-pricing-support": [
        { target: "minimumTransferPrice", patterns: [/minimum transfer price/i, /lowest transfer price/i] },
        { target: "marketBasedCeiling", patterns: [/market[- ]based ceiling/i, /external market price/i, /outside market price/i] },
        { target: "transferPricingRangeWidth", patterns: [/transfer pricing range/i, /negotiation range/i, /pricing band/i] },
    ],
    "borrowing-costs-capitalization": [
        { target: "capitalizableBorrowingCost", patterns: [/capitalizable borrowing cost/i, /borrow(?:ing)? cost to capitalize/i, /avoidable interest .*capitali[sz]/i, /capitali[sz].*avoidable interest/i] },
        { target: "annualAvoidableInterest", patterns: [/annual avoidable interest/i, /avoidable interest/i] },
        { target: "capitalizationFraction", patterns: [/capitalization fraction/i, /months over 12/i, /fraction of the year/i] },
    ],
    "cost-plus-pricing": [
        { target: "suggestedSellingPrice", patterns: [/suggested selling price/i, /cost plus price/i, /price using target margin/i] },
        { target: "markUpPercent", patterns: [/markup on cost/i, /markup percent/i, /mark up percent/i] },
        { target: "unitsNeededForTargetIncome", patterns: [/units needed/i, /units for target income/i, /required unit volume/i] },
    ],
    "budget-variance-analysis": [
        { target: "totalBudgetVariance", patterns: [/total budget variance/i, /overall variance/i] },
        { target: "spendingVariance", patterns: [/spending variance/i, /flexible budget variance/i] },
        { target: "activityVariance", patterns: [/activity variance/i, /volume variance/i] },
    ],
    "sales-volume-variance": [
        { target: "salesVolumeVariance", patterns: [/sales volume variance/i, /sales quantity variance/i, /volume variance/i] },
        { target: "actualUnitsSold", patterns: [/actual units sold/i, /actual sales units/i] },
        { target: "budgetedUnitsSold", patterns: [/budgeted units sold/i, /planned sales units/i] },
    ],
    "sales-mix-variance": [
        { target: "salesMixVariance", patterns: [/sales mix variance/i, /mix variance/i] },
        { target: "actualMixPercent", patterns: [/actual mix/i, /actual mix percent/i] },
        { target: "budgetedMixPercent", patterns: [/budgeted mix/i, /planned mix/i] },
    ],
    "notes-receivable-discounting": [
        { target: "proceedsFromDiscounting", patterns: [/discounting proceeds/i, /cash proceeds from note/i, /proceeds from discounting/i] },
        { target: "maturityValue", patterns: [/maturity value/i, /note maturity value/i] },
        { target: "bankDiscountAmount", patterns: [/bank discount/i, /discount amount/i] },
    ],
    "vat-reconciliation": [
        { target: "netVatPayable", patterns: [/net vat payable/i, /vat payable/i, /output vat less input vat/i] },
        { target: "taxableSalesAmount", patterns: [/taxable sales/i, /vatable sales/i, /sales subject to vat/i] },
        { target: "vatRatePercent", patterns: [/vat rate/i, /value added tax rate/i] },
    ],
    "withholding-tax": [
        { target: "taxWithheld", patterns: [/withholding tax/i, /tax withheld/i, /amount withheld/i] },
        { target: "taxBase", patterns: [/tax base/i, /gross amount/i, /payment subject to withholding/i] },
        { target: "ratePercent", patterns: [/withholding rate/i, /rate percent/i, /ewt rate/i] },
    ],
    "estate-tax-helper": [
        { target: "estateTaxDue", patterns: [/estate tax due/i, /estate tax/i] },
        { target: "netEstate", patterns: [/net estate/i, /taxable estate/i] },
        { target: "grossEstate", patterns: [/gross estate/i] },
    ],
    "donors-tax-helper": [
        { target: "donorsTaxDue", patterns: [/donor'?s tax/i, /donors tax/i, /gift tax/i] },
        { target: "taxableGift", patterns: [/taxable gift/i, /net gift/i] },
        { target: "grossGift", patterns: [/gross gift/i, /gift amount/i] },
    ],
    "documentary-stamp-tax-helper": [
        { target: "documentaryStampTaxDue", patterns: [/documentary stamp tax/i, /\bdst\b/i, /stamp tax/i] },
        { target: "taxableUnits", patterns: [/taxable units/i, /number of units/i] },
        { target: "ratePerUnit", patterns: [/rate per unit/i, /tax per unit/i] },
    ],
    "intercompany-inventory-profit": [
        { target: "unrealizedProfitInEndingInventory", patterns: [/unrealized profit/i, /inventory profit elimination/i, /profit in ending inventory/i] },
        { target: "transferPrice", patterns: [/transfer price/i, /intercompany selling price/i] },
        { target: "percentUnsoldAtPeriodEnd", patterns: [/percent unsold/i, /ending inventory unsold/i, /remaining unsold/i] },
    ],
    "equity-method-investment": [
        { target: "endingInvestmentBalance", patterns: [/ending investment balance/i, /investment carrying amount/i, /equity method/i] },
        { target: "investorShareInIncome", patterns: [/share in income/i, /equity in investee income/i] },
        { target: "dividendsReceived", patterns: [/dividends received/i, /share of dividends/i] },
    ],
    "consignment-settlement": [
        { target: "cashStillDueToConsignor", patterns: [/cash still due/i, /balance due consignor/i, /cash due to consignor/i] },
        { target: "commissionAmount", patterns: [/commission amount/i, /consignee commission/i] },
        { target: "commissionRatePercent", patterns: [/commission rate/i, /commission percent/i] },
    ],
    "branch-inventory-loading": [
        { target: "inventoryAtCost", patterns: [/inventory at cost/i, /inventory net of loading/i] },
        { target: "inventoryLoadingAllowance", patterns: [/loading allowance/i, /allowance for overvaluation/i] },
        { target: "loadingRateOnBilledPrice", patterns: [/loading rate on billed price/i, /loading on billed price/i] },
    ],
    "intercompany-ppe-transfer": [
        { target: "unamortizedIntercompanyProfit", patterns: [/unamortized intercompany profit/i, /remaining unrealized gain/i] },
        { target: "annualExcessDepreciation", patterns: [/annual excess depreciation/i, /excess depreciation/i] },
    ],
    "moving-average-forecast": [
        { target: "weightedMovingAverageForecast", patterns: [/weighted moving average/i, /weighted forecast/i] },
        { target: "simpleMovingAverageForecast", patterns: [/simple moving average/i, /moving average forecast/i] },
    ],
    "safety-stock-planner": [
        { target: "safetyStock", patterns: [/safety stock/i, /buffer stock/i] },
        { target: "reorderPoint", patterns: [/reorder point/i, /reorder level/i] },
        { target: "maxLeadTimeDays", patterns: [/maximum lead time/i, /worst case lead time/i] },
    ],
    "dividend-allocation": [
        { target: "preferredDividendAllocated", patterns: [/preferred dividend allocation/i, /preferred dividends?/i] },
        { target: "commonDividendAllocated", patterns: [/common dividend allocation/i, /common dividends?/i] },
        { target: "commonDividendPerShare", patterns: [/common dividend per share/i, /dividend per share/i] },
    ],
};
export function suggestSolveTarget(calculatorId, query) {
    const rules = SOLVE_TARGET_RULES[calculatorId];
    if (!rules)
        return null;
    for (const rule of rules) {
        if (rule.patterns.some((pattern) => pattern.test(query))) {
            return rule.target;
        }
    }
    return null;
}
