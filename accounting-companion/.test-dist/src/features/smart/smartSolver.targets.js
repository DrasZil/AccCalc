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
    "inventory-budget": [
        { target: "purchasesRequiredCost", patterns: [/required purchases/i, /merchandise purchases/i, /inventory budget/i] },
        { target: "budgetedCostOfGoodsSold", patterns: [/budgeted cogs/i, /budgeted cost of goods sold/i] },
        { target: "desiredEndingInventoryCost", patterns: [/desired ending inventory/i, /ending inventory target/i] },
    ],
    "operating-expense-budget": [
        { target: "totalOperatingExpenses", patterns: [/total operating expenses/i, /selling and administrative budget/i, /operating expense budget/i] },
        { target: "cashOperatingExpenses", patterns: [/cash operating expenses/i, /cash opex/i] },
        { target: "budgetedSalesAmount", patterns: [/budgeted sales/i, /sales budget/i] },
    ],
    "withholding-tax": [
        { target: "taxWithheld", patterns: [/withholding tax/i, /tax withheld/i, /amount withheld/i] },
        { target: "taxBase", patterns: [/tax base/i, /gross amount/i, /payment subject to withholding/i] },
        { target: "ratePercent", patterns: [/withholding rate/i, /rate percent/i, /ewt rate/i] },
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
