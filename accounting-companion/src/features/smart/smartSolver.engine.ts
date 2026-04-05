import type {
    CalculatorConfig,
    ConfidenceLabel,
    ExtractedFacts,
    FieldKey,
    FieldMeta,
    FieldsState,
    RankedCalculator,
    SmartSolverAnalysis,
    } from "./smartSolver.types";
    import { ALL_FIELD_KEYS } from "./smartSolver.types";
import { detectCurrencyFromText, stripCurrencyMarkers } from "../../utils/currency";

    /* -------------------------------------------------------------------------- */
    /* FIELDS */
    /* -------------------------------------------------------------------------- */

    export const FIELD_KEYS: FieldKey[] = [...ALL_FIELD_KEYS];

    export const FIELD_META: Record<FieldKey, FieldMeta> = {
    principal: {
        label: "Principal",
        placeholder: "10000",
        kind: "money",
        group: "finance",
        visibleInManualInputs: true,
        aliases: [
        "principal",
        "capital",
        "amount borrowed",
        "borrowed",
        "investment",
        "invested",
        ],
    },

    rate: {
        label: "Rate (%)",
        placeholder: "5",
        kind: "percent",
        group: "finance",
        visibleInManualInputs: true,
        aliases: ["rate", "interest rate", "rate of interest"],
    },

    time: {
        label: "Time (years)",
        placeholder: "2",
        kind: "time",
        group: "finance",
        visibleInManualInputs: true,
        aliases: ["time", "term", "period"],
    },

    cost: {
        label: "Cost",
        placeholder: "5000",
        kind: "money",
        group: "business",
        visibleInManualInputs: true,
        aliases: ["cost", "expense", "expenses", "buying price", "purchase price"],
    },

    revenue: {
        label: "Revenue",
        placeholder: "8000",
        kind: "money",
        group: "business",
        visibleInManualInputs: true,
        aliases: ["revenue", "sales", "income", "selling amount", "money earned", "amount sold for"],
    },

    timesCompounded: {
        label: "Times Compounded / Year",
        placeholder: "12",
        kind: "number",
        group: "finance",
        visibleInManualInputs: false,
        aliases: [
        "times compounded",
        "compounding frequency",
        "compounds per year",
        ],
    },

    presentValue: {
        label: "Present Value",
        placeholder: "10000",
        kind: "money",
        group: "finance",
        visibleInManualInputs: false,
        aliases: ["present value", "present worth", "worth today", "current worth"],
    },

    futureValue: {
        label: "Future Value",
        placeholder: "15000",
        kind: "money",
        group: "finance",
        visibleInManualInputs: false,
        aliases: [
        "future value",
            "future worth",
            "maturity value",
            "amount after",
            "value after",
            "target amount",
            "goal amount",
        ],
    },

    loanAmount: {
        label: "Loan Amount",
        placeholder: "50000",
        kind: "money",
        group: "finance",
        visibleInManualInputs: false,
        aliases: ["loan amount", "amount financed", "borrowed money"],
    },

    annualRate: {
        label: "Annual Rate (%)",
        placeholder: "10",
        kind: "percent",
        group: "finance",
        visibleInManualInputs: false,
        aliases: ["annual rate", "yearly rate", "nominal rate", "stated rate"],
    },

    years: {
        label: "Years",
        placeholder: "5",
        kind: "time",
        group: "finance",
        visibleInManualInputs: false,
        aliases: ["years", "loan term"],
    },

    fixedCosts: {
        label: "Fixed Costs",
        placeholder: "30000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["fixed cost", "fixed costs"],
    },

    sellingPricePerUnit: {
        label: "Selling Price / Unit",
        placeholder: "120",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["selling price per unit", "price per unit", "selling price each"],
    },

    variableCostPerUnit: {
        label: "Variable Cost / Unit",
        placeholder: "70",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["variable cost per unit", "variable cost each", "cost per unit"],
    },

    sales: {
        label: "Sales",
        placeholder: "15000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["sales", "net sales"],
    },

    variableCosts: {
        label: "Variable Costs",
        placeholder: "9000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["variable costs", "variable cost"],
    },

    sellingPrice: {
        label: "Selling Price",
        placeholder: "9000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["selling price", "sale price", "sold for"],
    },

    assets: {
        label: "Assets",
        placeholder: "100000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["assets", "total assets", "resources owned", "what the business owns"],
    },

    liabilities: {
        label: "Liabilities",
        placeholder: "40000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["liabilities", "total liabilities", "obligations", "what the business owes"],
    },

    equity: {
        label: "Equity",
        placeholder: "60000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["equity", "owner's equity", "owners equity", "owner claim", "residual interest"],
    },

    invoice: {
        label: "Invoice Amount",
        placeholder: "10000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["invoice", "invoice amount", "list price", "catalog price", "quoted price"],
    },

    discountRate: {
        label: "Discount Rate (%)",
        placeholder: "2",
        kind: "percent",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["discount rate", "cash discount", "trade discount", "trade discount rate"],
    },

    discountDays: {
        label: "Discount Days",
        placeholder: "10",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["discount days", "discount period"],
    },

    totalDays: {
        label: "Total Days",
        placeholder: "30",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["total days", "net days"],
    },

    daysPaid: {
        label: "Days Paid",
        placeholder: "8",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["days paid", "paid after", "payment after", "paid on day"],
    },

    salvageValue: {
        label: "Salvage Value",
        placeholder: "5000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["salvage value", "residual value"],
    },

    totalEstimatedUnits: {
        label: "Total Estimated Units",
        placeholder: "50000",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["total estimated units", "estimated total units", "total units of output"],
    },

    unitsProduced: {
        label: "Units Produced",
        placeholder: "12000",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["units produced", "actual units produced", "units this period"],
    },

    usefulLife: {
        label: "Useful Life",
        placeholder: "5",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["useful life", "life of asset", "service life"],
    },

    year: {
        label: "Year",
        placeholder: "2",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["year"],
    },

    beginningUnits: {
        label: "Beginning Units",
        placeholder: "100",
        kind: "number",
        group: "inventory",
        visibleInManualInputs: false,
        aliases: ["beginning units", "beginning inventory units"],
    },

    beginningCost: {
        label: "Beginning Cost",
        placeholder: "50",
        kind: "money",
        group: "inventory",
        visibleInManualInputs: false,
        aliases: ["beginning cost", "beginning inventory cost"],
    },

    purchase1Units: {
        label: "Purchase 1 Units",
        placeholder: "80",
        kind: "number",
        group: "inventory",
        visibleInManualInputs: false,
        aliases: ["purchase 1 units", "first purchase units"],
    },

    purchase1Cost: {
        label: "Purchase 1 Cost",
        placeholder: "55",
        kind: "money",
        group: "inventory",
        visibleInManualInputs: false,
        aliases: ["purchase 1 cost", "first purchase cost"],
    },

    purchase2Units: {
        label: "Purchase 2 Units",
        placeholder: "120",
        kind: "number",
        group: "inventory",
        visibleInManualInputs: false,
        aliases: ["purchase 2 units", "second purchase units"],
    },

    purchase2Cost: {
        label: "Purchase 2 Cost",
        placeholder: "60",
        kind: "money",
        group: "inventory",
        visibleInManualInputs: false,
        aliases: ["purchase 2 cost", "second purchase cost"],
    },

    unitsSold: {
        label: "Units Sold",
        placeholder: "150",
        kind: "number",
        group: "inventory",
        visibleInManualInputs: false,
        aliases: ["units sold", "sold units"],
    },

    netSales: {
        label: "Net Sales",
        placeholder: "150000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
        "net sales",
        "sales",
        "total sales",
        "sales revenue",
        "net revenue",
        ],
    },

    grossProfitRate: {
        label: "Gross Profit Rate (%)",
        placeholder: "25",
        kind: "percent",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
        "gross profit rate",
        "gross profit percentage",
        "gp rate",
        "gross margin rate",
        "gross margin percentage",
        ],
    },

    costOfGoodsAvailable: {
        label: "Cost of Goods Available for Sale",
        placeholder: "110000",
        kind: "money",
        group: "inventory",
        visibleInManualInputs: false,
        aliases: [
            "cost of goods available",
            "cost of goods available for sale",
            "goods available",
            "goods available for sale",
            "cost available for sale",
            "total available goods cost",
        ],
    },

    bankBalance: {
        label: "Bank Statement Balance",
        placeholder: "50000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
        "bank balance",
        "bank statement balance",
        "balance per bank",
        "bank statement",
        ],
    },

    bookBalance: {
        label: "Book / Cash Balance",
        placeholder: "48500",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
        "book balance",
        "cash balance",
        "balance per books",
        "book cash balance",
        ],
    },

    depositsInTransit: {
        label: "Deposits in Transit",
        placeholder: "3500",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
        "deposits in transit",
        "deposit in transit",
        "outstanding deposits",
        ],
    },

    outstandingChecks: {
        label: "Outstanding Checks",
        placeholder: "2000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
        "outstanding checks",
        "outstanding check",
        "checks outstanding",
        ],
    },

    serviceCharges: {
        label: "Service Charges",
        placeholder: "300",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
        "service charges",
        "bank service charges",
        "bank charges",
        "service charge",
        ],
    },

    nsfChecks: {
        label: "NSF Checks",
        placeholder: "700",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
        "nsf",
        "nsf checks",
        "nsf check",
        "non sufficient funds",
        "dishonored checks",
        "dishonored check",
        ],
    },

    bankError: {
        label: "Bank Error Adjustment",
        placeholder: "200",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
        "bank error",
        "bank error adjustment",
        "error in bank statement",
        ],
    },

    bookError: {
        label: "Book Error Adjustment",
        placeholder: "150",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
        "book error",
        "book error adjustment",
        "error in books",
        "error in book record",
        ],
    },
    accountsReceivable: {
        label: "Accounts Receivable",
        placeholder: "50000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "accounts receivable",
            "receivables",
            "trade receivables",
            "ar",
            "money customers owe us",
            "amount due from customers",
        ],
    },

    estimatedUncollectibleRate: {
        label: "Estimated Uncollectible Rate (%)",
        placeholder: "5",
        kind: "percent",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "estimated uncollectible rate",
            "uncollectible rate",
            "bad debt rate",
            "doubtful accounts rate",
            "estimated bad debt percentage",
            "portion expected to be uncollectible",
        ],
    },

    partnershipAmount: {
        label: "Partnership Profit or Loss",
        placeholder: "120000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "partnership profit",
            "partnership loss",
            "partnership income",
            "net income",
            "net loss",
            "profit to be shared",
            "loss to be shared",
        ],
    },

    totalOldCapital: {
        label: "Total Old Partners' Capital",
        placeholder: "300000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["total old capital", "old partners capital", "capital before admission"],
    },

    partnerInvestment: {
        label: "Incoming Partner Investment",
        placeholder: "120000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["partner investment", "incoming partner investment", "new partner investment"],
    },

    ownershipPercentage: {
        label: "Ownership Percentage (%)",
        placeholder: "25",
        kind: "percent",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["ownership percentage", "ownership interest", "capital interest percentage"],
    },

    partnerARatio: {
        label: "Partner A Ratio",
        placeholder: "3",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["partner a ratio", "a ratio", "a share ratio"],
    },

    partnerBRatio: {
        label: "Partner B Ratio",
        placeholder: "2",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["partner b ratio", "b ratio", "b share ratio"],
    },

    partnerCRatio: {
        label: "Partner C Ratio",
        placeholder: "1",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["partner c ratio", "c ratio", "c share ratio"],
    },

    vatableSales: {
        label: "VATable Sales",
        placeholder: "150000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["vatable sales", "sales subject to vat", "output vat base"],
    },

    vatablePurchases: {
        label: "VATable Purchases",
        placeholder: "80000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["vatable purchases", "purchases subject to vat", "input vat base"],
    },

    directMaterialsUsed: {
        label: "Direct Materials Used",
        placeholder: "120000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["direct materials used", "direct materials"],
    },

    directLabor: {
        label: "Direct Labor",
        placeholder: "90000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["direct labor", "direct labour"],
    },

    manufacturingOverhead: {
        label: "Manufacturing Overhead",
        placeholder: "50000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["manufacturing overhead", "factory overhead", "factory burden"],
    },

    beginningWorkInProcess: {
        label: "Beginning Work in Process",
        placeholder: "15000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "beginning work in process",
            "beginning wip",
            "beginning work in process inventory",
        ],
    },

    endingWorkInProcess: {
        label: "Ending Work in Process",
        placeholder: "10000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "ending work in process",
            "ending wip",
            "ending work in process inventory",
        ],
    },

    currentAssets: {
        label: "Current Assets",
        placeholder: "250000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "current assets",
            "total current assets",
            "short term assets",
            "short-term assets",
            "assets due within one year",
            "assets available within one year",
        ],
    },

    currentLiabilities: {
        label: "Current Liabilities",
        placeholder: "100000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "current liabilities",
            "total current liabilities",
            "short term liabilities",
            "short-term liabilities",
            "short term debts",
            "debts due within one year",
            "obligations due within one year",
        ],
    },

    cash: {
        label: "Cash",
        placeholder: "50000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "cash",
            "cash on hand",
            "available cash",
            "cash available",
            "cash balance",
        ],
    },

    marketableSecurities: {
        label: "Marketable Securities",
        placeholder: "25000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "marketable securities",
            "temporary investments",
            "short term investments",
            "cash equivalents",
            "near cash investments",
            "liquid investments",
        ],
    },

    netReceivables: {
        label: "Net Receivables",
        placeholder: "40000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "net receivables",
            "net accounts receivable",
            "receivables",
            "collectible receivables",
            "collectible accounts receivable",
            "customer balances after allowance",
        ],
    },

    netCreditSales: {
        label: "Net Credit Sales",
        placeholder: "600000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "net credit sales",
            "credit sales",
            "sales on credit",
            "sales made on account",
            "sales on account",
        ],
    },

    averageAccountsReceivable: {
        label: "Average Accounts Receivable",
        placeholder: "75000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "average accounts receivable",
            "average receivables",
            "average ar",
            "average customer receivables",
            "average customer balances",
            "average trade receivables",
        ],
    },

    costOfGoodsSold: {
        label: "Cost of Goods Sold",
        placeholder: "300000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "cost of goods sold",
            "cogs",
            "cost of sales",
            "cost of items sold",
        ],
    },

    averageInventory: {
        label: "Average Inventory",
        placeholder: "60000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "average inventory",
            "average merchandise inventory",
            "average stock on hand",
        ],
    },

    netCreditPurchases: {
        label: "Net Credit Purchases",
        placeholder: "420000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "net credit purchases",
            "credit purchases",
            "purchases on account",
            "purchases on credit",
            "goods bought on credit",
            "goods purchased on account",
        ],
    },

    averageAccountsPayable: {
        label: "Average Accounts Payable",
        placeholder: "70000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "average accounts payable",
            "average payables",
            "average ap",
            "average supplier payables",
            "average trade payables",
            "average amount owed to suppliers",
        ],
    },

    netIncome: {
        label: "Net Income",
        placeholder: "85000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "net income",
            "profit after tax",
            "earnings",
            "bottom line",
            "net earnings",
        ],
    },

    incomeBeforeInterestAndTaxes: {
        label: "Income Before Interest and Taxes",
        placeholder: "250000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "income before interest and taxes",
            "ebit",
            "earnings before interest and taxes",
            "profit before interest and tax",
            "income before finance cost and tax",
            "operating profit before interest and tax",
        ],
    },

    interestExpense: {
        label: "Interest Expense",
        placeholder: "50000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "interest expense",
            "finance cost",
            "borrowing cost",
            "interest cost",
            "loan interest",
            "finance charges",
        ],
    },

    commonEquity: {
        label: "Common Equity",
        placeholder: "900000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "common equity",
            "equity available to common shareholders",
            "common stockholders equity",
            "common shareholders equity",
            "ordinary shareholders equity",
            "equity for common shareholders",
        ],
    },

    outstandingCommonShares: {
        label: "Outstanding Common Shares",
        placeholder: "100000",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["outstanding common shares", "common shares outstanding", "number of common shares"],
    },

    averageTotalAssets: {
        label: "Average Total Assets",
        placeholder: "500000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "average total assets",
            "average assets",
            "average asset base",
            "average total resources",
            "average resources",
        ],
    },

    averageEquity: {
        label: "Average Equity",
        placeholder: "350000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "average equity",
            "average owners equity",
            "average owner's equity",
            "average shareholders equity",
            "average stockholders equity",
            "average owners funds",
            "average shareholders funds",
        ],
    },

    periodicPayment: {
        label: "Periodic Payment",
        placeholder: "5000",
        kind: "money",
        group: "finance",
        visibleInManualInputs: false,
        aliases: [
            "periodic payment",
            "regular payment",
            "annuity payment",
            "payment each period",
            "deposit each period",
        ],
    },

    periods: {
        label: "Number of Periods",
        placeholder: "12",
        kind: "number",
        group: "finance",
        visibleInManualInputs: false,
        aliases: [
            "number of periods",
            "periods",
            "installments",
            "payment periods",
        ],
    },

    targetProfit: {
        label: "Target Profit",
        placeholder: "50000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["target profit", "desired profit", "required profit"],
    },

    actualSales: {
        label: "Actual Sales",
        placeholder: "400000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["actual sales", "current sales", "real sales"],
    },

    breakEvenSalesAmount: {
        label: "Break-even Sales",
        placeholder: "300000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["break-even sales", "breakeven sales", "sales at break even"],
    },

    preferredDividends: {
        label: "Preferred Dividends",
        placeholder: "15000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["preferred dividends", "preferred dividend requirement"],
    },

    weightedAverageCommonShares: {
        label: "Weighted Average Common Shares",
        placeholder: "100000",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "weighted average common shares",
            "weighted average shares",
            "average common shares",
        ],
    },

    basePeriodAmount: {
        label: "Base Period Amount",
        placeholder: "120000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "base period amount",
            "previous period amount",
            "last year amount",
            "prior period amount",
            "earlier period amount",
            "previous year amount",
        ],
    },

    currentPeriodAmount: {
        label: "Current Period Amount",
        placeholder: "150000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "current period amount",
            "this year amount",
            "current year amount",
            "this period amount",
            "latest period amount",
            "present period amount",
        ],
    },

    statementItemAmount: {
        label: "Statement Item Amount",
        placeholder: "45000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "statement item amount",
            "line item amount",
            "account balance",
            "specific line item",
            "account being analyzed",
            "line amount",
        ],
    },

    statementBaseAmount: {
        label: "Statement Base Amount",
        placeholder: "300000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "statement base amount",
            "base total",
            "sales total",
            "asset total",
            "total used as base",
            "base denominator",
            "base amount for percentage",
        ],
    },

    receivablesDays: {
        label: "Receivables Days",
        placeholder: "36",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["receivables days", "collection days", "days sales outstanding", "dso"],
    },

    inventoryDays: {
        label: "Inventory Days",
        placeholder: "52",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["inventory days", "days in inventory", "days inventory stays on hand"],
    },

    payablesDays: {
        label: "Payables Days",
        placeholder: "28",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["payables days", "days payable outstanding", "days to pay suppliers", "dpo"],
    },
    };

    export const INITIAL_FIELDS: FieldsState = FIELD_KEYS.reduce((acc, key) => {
    acc[key] = "";
    return acc;
    }, {} as FieldsState);

    export function createEmptyFields(): FieldsState {
    return { ...INITIAL_FIELDS };
    }

    /* -------------------------------------------------------------------------- */
    /* CALCULATORS */
    /* -------------------------------------------------------------------------- */

    export const CALCULATORS: CalculatorConfig[] = [
    {
        id: "simple-interest",
        name: "Simple Interest Calculator",
        route: "/finance/simple-interest",
        description:
        "Best when the user provides principal, rate, and time for straightforward interest problems.",
        required: ["principal", "rate", "time"],
        keywords: [
        /simple interest/i,
        /\binterest\b/i,
        /principal/i,
        /\brate\b/i,
        /borrow(?:ed|ing)?/i,
        /\bloan\b/i,
        /invest(?:ed|ment)?/i,
        /maturity value/i,
        ],
    },

    {
        id: "compound-interest",
        name: "Compound Interest Calculator",
        route: "/finance/compound-interest",
        description:
        "Best when the user provides principal, rate, time, and compounding frequency.",
        required: ["principal", "rate", "timesCompounded", "time"],
        keywords: [
        /compound interest/i,
        /compounded/i,
        /compounding/i,
        /interest compounded/i,
        /quarterly/i,
        /monthly compounding/i,
        /annually/i,
        /semi[- ]annually/i,
        ],
    },

    {
        id: "future-value",
        name: "Future Value Calculator",
        route: "/finance/future-value",
        description:
        "Best when the user wants to know how much a present amount will grow in the future.",
        required: ["presentValue", "rate", "time"],
        keywords: [
        /future value/i,
        /\bfv\b/i,
        /future worth/i,
        /grow/i,
        /growth/i,
        /amount after/i,
        /value after/i,
        ],
    },

    {
        id: "present-value",
        name: "Present Value Calculator",
        route: "/finance/present-value",
        description:
        "Best when the user wants the present worth of a future amount using discounting.",
        required: ["futureValue", "rate", "time"],
        keywords: [
        /present value/i,
        /\bpv\b/i,
        /present worth/i,
        /discount(?:ed|ing)?/i,
        /worth today/i,
        /current worth/i,
        /future amount/i,
        ],
    },
    {
        id: "future-value-annuity",
        name: "Future Value of Annuity",
        route: "/finance/future-value-annuity",
        description:
        "Best when the user gives a regular payment, periodic rate, and number of periods for an annuity accumulation problem.",
        required: ["periodicPayment", "rate", "periods"],
        aliases: ["annuity future value", "ordinary annuity future value", "sinking fund"],
        keywords: [
        /future value of annuity/i,
        /annuity future value/i,
        /ordinary annuity/i,
        /regular payment/i,
        /deposit each period/i,
        /sinking fund/i,
        ],
    },
    {
        id: "present-value-annuity",
        name: "Present Value of Annuity",
        route: "/finance/present-value-annuity",
        description:
        "Best when the user gives a regular payment, periodic rate, and number of periods for an annuity present value problem.",
        required: ["periodicPayment", "rate", "periods"],
        aliases: ["annuity present value", "ordinary annuity present value"],
        keywords: [
        /present value of annuity/i,
        /annuity present value/i,
        /ordinary annuity/i,
        /installment value/i,
        /regular payment/i,
        ],
    },
    {
        id: "effective-interest-rate",
        name: "Effective Interest Rate",
        route: "/finance/effective-interest-rate",
        description:
        "Best when the user wants the true annual rate after compounding.",
        required: ["annualRate", "timesCompounded"],
        aliases: ["effective annual rate", "ear", "eir", "true annual rate"],
        keywords: [
        /effective interest rate/i,
        /effective annual rate/i,
        /\bear\b/i,
        /\beir\b/i,
        /true annual rate/i,
        /nominal rate/i,
        /stated rate/i,
        ],
    },
    {
        id: "sinking-fund-deposit",
        name: "Sinking Fund Deposit",
        route: "/finance/sinking-fund-deposit",
        description:
        "Best when the user wants the regular deposit needed to reach a future target amount.",
        required: ["futureValue", "rate", "periods"],
        aliases: ["sinking fund", "deposit needed", "required periodic deposit"],
        keywords: [
        /sinking fund/i,
        /required deposit/i,
        /deposit needed/i,
        /target amount/i,
        /future fund/i,
        /save up/i,
        ],
    },

    {
        id: "loan-amortization",
        name: "Loan / Amortization Calculator",
        route: "/finance/loan-amortization",
        description:
        "Best when the user wants monthly payment, total paid, or total interest on a loan.",
        required: ["loanAmount", "annualRate", "years"],
        keywords: [
        /\bloan\b/i,
        /amortization/i,
        /monthly payment/i,
        /installment/i,
        /borrowed money/i,
        /total interest/i,
        /total paid/i,
        /payment per month/i,
        ],
    },

    {
        id: "profit-loss",
        name: "Profit / Loss Calculator",
        route: "/business/profit-loss",
        description:
        "Best when the user is comparing cost against revenue to determine profit or loss.",
        required: ["cost", "revenue"],
        keywords: [
        /\bprofit\b/i,
        /\bloss\b/i,
        /revenue/i,
        /sales?/i,
        /selling price/i,
        /\bcost\b/i,
        /expense/i,
        /gain/i,
        ],
    },

    {
        id: "break-even",
        name: "Break-even Calculator",
        route: "/business/break-even",
        description:
        "Best when the user wants break-even units or break-even sales using fixed cost and per-unit inputs.",
        required: ["fixedCosts", "sellingPricePerUnit", "variableCostPerUnit"],
        keywords: [
        /break[- ]?even/i,
        /break[- ]?even point/i,
        /\bbep\b/i,
        /fixed costs?/i,
        /selling price per unit/i,
        /variable cost per unit/i,
        /units to break even/i,
        ],
    },
    {
        id: "target-profit",
        name: "Target Profit Calculator",
        route: "/business/target-profit",
        description:
        "Best when the user wants the required units or sales needed to reach a target profit.",
        required: ["fixedCosts", "targetProfit", "sellingPricePerUnit", "variableCostPerUnit"],
        aliases: ["required profit", "desired profit", "sales for target profit"],
        keywords: [
        /target profit/i,
        /desired profit/i,
        /required profit/i,
        /required sales/i,
        /required units/i,
        ],
    },
    {
        id: "margin-of-safety",
        name: "Margin of Safety",
        route: "/business/margin-of-safety",
        description:
        "Best when the user compares actual sales with break-even sales.",
        required: ["actualSales", "breakEvenSalesAmount"],
        aliases: ["safety margin", "sales cushion", "how much sales can drop"],
        keywords: [
        /margin of safety/i,
        /safety margin/i,
        /break-even sales/i,
        /actual sales/i,
        /sales can drop/i,
        ],
    },
    {
        id: "net-profit-margin",
        name: "Net Profit Margin",
        route: "/business/net-profit-margin",
        description:
        "Best when the user wants net income as a percentage of net sales.",
        required: ["netIncome", "netSales"],
        aliases: ["profit margin", "return on sales", "bottom line margin"],
        keywords: [
        /net profit margin/i,
        /profit margin/i,
        /return on sales/i,
        /net income margin/i,
        /bottom line margin/i,
        ],
    },
    {
        id: "operating-leverage",
        name: "Operating Leverage",
        route: "/business/operating-leverage",
        description:
        "Best when the user wants to measure how strongly operating income responds to sales changes.",
        required: ["sales", "variableCosts", "fixedCosts"],
        aliases: ["degree of operating leverage", "dol", "sales sensitivity"],
        keywords: [
        /operating leverage/i,
        /degree of operating leverage/i,
        /\bdol\b/i,
        /sensitivity of profit/i,
        /sales sensitivity/i,
        ],
    },

    {
        id: "contribution-margin",
        name: "Contribution Margin Calculator",
        route: "/business/contribution-margin",
        description:
        "Best when the user wants contribution margin or contribution margin ratio.",
        required: ["sales", "variableCosts"],
        keywords: [
        /contribution margin/i,
        /contribution margin ratio/i,
        /cm ratio/i,
        /variable costs?/i,
        /\bsales\b/i,
        /margin ratio/i,
        ],
    },

    {
        id: "markup-margin",
        name: "Markup & Margin Calculator",
        route: "/business/markup-margin",
        description:
        "Best when the user provides cost and selling price and wants markup, margin, or profit percentage.",
        required: ["cost", "sellingPrice"],
        keywords: [
        /\bmarkup\b/i,
        /\bmargin\b/i,
        /gross margin/i,
        /selling price/i,
        /\bcost\b/i,
        /profit percentage/i,
        /markup percentage/i,
        /margin percentage/i,
        ],
    },

    {
        id: "accounting-equation",
        name: "Accounting Equation Solver",
        route: "/accounting/accounting-equation",
        description:
        "Best when the user is solving for assets, liabilities, or equity.",
        required: ["assets", "liabilities", "equity"],
        keywords: [
        /accounting equation/i,
        /\bassets\b/i,
        /\bliabilities\b/i,
        /\bequity\b/i,
        /owner'?s equity/i,
        /assets\s*=\s*liabilities\s*\+\s*equity/i,
        /\ba\s*=\s*l\s*\+\s*e\b/i,
        ],
    },

    {
        id: "notes-interest",
        name: "Notes Interest Solver",
        route: "/accounting/notes-interest",
        description:
        "Best when the user wants interest or maturity value for notes receivable or notes payable.",
        required: ["principal", "rate", "time"],
        keywords: [
        /notes interest/i,
        /note receivable/i,
        /notes receivable/i,
        /note payable/i,
        /notes payable/i,
        /maturity value/i,
        /ordinary interest/i,
        /exact interest/i,
        /promissory note/i,
        ],
    },

    {
        id: "cash-discount",
        name: "Cash Discount / Credit Terms",
        route: "/accounting/cash-discount",
        description:
        "Best when the user is solving discount and payment amounts for terms like 2/10, n/30.",
        required: ["invoice", "discountRate", "discountDays", "totalDays", "daysPaid"],
        keywords: [
        /cash discount/i,
        /credit terms/i,
        /2\/10,\s*n\/30/i,
        /1\/10,\s*n\/30/i,
        /discount period/i,
        /invoice amount/i,
        /terms/i,
        /net amount/i,
        /discount allowed/i,
        ],
    },

    {
        id: "straight-line-depreciation",
        name: "Straight-Line Depreciation",
        route: "/accounting/straight-line-depreciation",
        description:
        "Best when the user wants annual depreciation using cost, salvage value, and useful life.",
        required: ["cost", "salvageValue", "usefulLife"],
        keywords: [
        /straight[- ]line depreciation/i,
        /\bdepreciation\b/i,
        /salvage value/i,
        /useful life/i,
        /annual depreciation/i,
        /depreciation expense/i,
        ],
    },

    {
        id: "declining-balance-depreciation",
        name: "Declining Balance Depreciation",
        route: "/accounting/declining-balance-depreciation",
        description:
        "Best when the user wants depreciation expense or book value using declining balance inputs.",
        required: ["cost", "usefulLife", "year"],
        keywords: [
        /declining balance/i,
        /double declining/i,
        /double declining balance/i,
        /accelerated depreciation/i,
        /book value/i,
        /depreciation expense/i,
        ],
    },
    {
        id: "units-of-production-depreciation",
        name: "Units of Production Depreciation",
        route: "/accounting/units-of-production-depreciation",
        description:
        "Best when depreciation is based on actual units produced versus total estimated units.",
        required: ["cost", "salvageValue", "totalEstimatedUnits", "unitsProduced"],
        aliases: ["units of production", "activity method depreciation", "depreciation per unit"],
        keywords: [
        /units of production/i,
        /activity method/i,
        /depreciation per unit/i,
        /units produced/i,
        /estimated units/i,
        ],
    },

    {
        id: "fifo-inventory",
        name: "FIFO Inventory Calculator",
        route: "/accounting/fifo-inventory",
        description:
        "Best when the user wants cost of goods sold and ending inventory using FIFO.",
        required: [
        "beginningUnits",
        "beginningCost",
        "purchase1Units",
        "purchase1Cost",
        "purchase2Units",
        "purchase2Cost",
        "unitsSold",
        ],
        keywords: [
        /\bfifo\b/i,
        /first in first out/i,
        /\binventory\b/i,
        /ending inventory/i,
        /cost of goods sold/i,
        /\bcogs\b/i,
        /inventory layers/i,
        /earliest costs/i,
        ],
    },

    {
        id: "weighted-average-inventory",
        name: "Weighted Average Inventory Calculator",
        route: "/accounting/weighted-average-inventory",
        description:
        "Best when the user wants weighted average unit cost, cost of goods sold, and ending inventory.",
        required: [
        "beginningUnits",
        "beginningCost",
        "purchase1Units",
        "purchase1Cost",
        "purchase2Units",
        "purchase2Cost",
        "unitsSold",
        ],
        keywords: [
        /weighted average/i,
        /weighted average inventory/i,
        /average cost/i,
        /average inventory cost/i,
        /\binventory\b/i,
        /ending inventory/i,
        /cost of goods sold/i,
        /\bcogs\b/i,
        ],
    },

    {
        id: "gross-profit-method",
        name: "Gross Profit Method",
        route: "/accounting/gross-profit-method",
        description: "Estimate gross profit, COGS, and ending inventory.",
        required: ["netSales", "grossProfitRate", "costOfGoodsAvailable"],
        keywords: [
        /gross profit/i,
        /gross profit method/i,
        /gross margin/i,
        /ending inventory/i,
        /estimated inventory/i,
        /\bcogs\b/i,
        /merchandising/i,
        ],
    },
    {
        id: "gross-profit-rate",
        name: "Gross Profit Rate",
        route: "/accounting/gross-profit-rate",
        description: "Compute gross profit and gross profit rate using net sales and cost of goods sold.",
        required: ["netSales", "costOfGoodsSold"],
        aliases: ["gross margin ratio", "gross profit percentage", "gross margin percentage"],
        keywords: [
        /gross profit rate/i,
        /gross margin ratio/i,
        /gross profit percentage/i,
        /gross margin percentage/i,
        /gross profit over sales/i,
        /\bcogs\b/i,
        ],
    },
    {
        id: "inventory-method-comparison",
        name: "Inventory Method Comparison",
        route: "/accounting/inventory-method-comparison",
        description:
            "Compare FIFO and weighted average results using the same inventory layers and units sold.",
        required: [
            "beginningUnits",
            "beginningCost",
            "purchase1Units",
            "purchase1Cost",
            "purchase2Units",
            "purchase2Cost",
            "unitsSold",
        ],
        aliases: ["fifo vs weighted average", "inventory comparison", "compare inventory methods"],
        keywords: [
            /fifo vs weighted average/i,
            /compare inventory methods/i,
            /inventory method comparison/i,
            /fifo compared with weighted average/i,
            /\bfifo\b/i,
            /weighted average/i,
        ],
    },

    {
        id: "bank-reconciliation",
        name: "Bank Reconciliation",
        route: "/accounting/bank-reconciliation",
        description:
        "Reconcile bank and book balances using deposits in transit, outstanding checks, service charges, NSF checks, and errors.",
        required: ["bankBalance", "bookBalance"],
        keywords: [
        /bank reconciliation/i,
        /reconcile bank/i,
        /reconcile books/i,
        /deposits in transit/i,
        /outstanding checks?/i,
        /service charges?/i,
        /\bnsf\b/i,
        /dishonored checks?/i,
        /balance per bank/i,
        /balance per books/i,
        ],
    },
    {
        id: "allowance-doubtful-accounts",
        name: "Allowance for Doubtful Accounts",
        route: "/accounting/allowance-doubtful-accounts",
        description:
            "Estimate uncollectible accounts and net realizable value using accounts receivable and an estimated uncollectible rate.",
        required: ["accountsReceivable", "estimatedUncollectibleRate"],
        aliases: ["allowance method", "bad debt expense", "nrv of receivables"],
        keywords: [
            /allowance for doubtful accounts/i,
            /doubtful accounts/i,
            /bad debts?/i,
            /uncollectible accounts?/i,
            /accounts receivable/i,
            /net realizable value/i,
        ],
    },
    {
        id: "partnership-profit-sharing",
        name: "Partnership Profit Sharing",
        route: "/accounting/partnership-profit-sharing",
        description:
            "Allocate partnership profit or loss among partners using agreed ratios.",
        required: ["partnershipAmount", "partnerARatio", "partnerBRatio"],
        optional: ["partnerCRatio"],
        aliases: [
            "partnership distribution",
            "profit sharing ratio",
            "profit and loss sharing",
        ],
        keywords: [
            /partnership profit/i,
            /partnership loss/i,
            /profit and loss ratio/i,
            /profit sharing/i,
            /divide partnership income/i,
            /share net income/i,
            /share net loss/i,
            /partner a/i,
        /partner b/i,
        ],
    },
    {
        id: "partnership-admission-bonus",
        name: "Partnership Admission Bonus",
        route: "/accounting/partnership-admission-bonus",
        description:
            "Best when a new partner is admitted and bonus method capital credit is needed.",
        required: ["totalOldCapital", "partnerInvestment", "ownershipPercentage"],
        aliases: ["bonus method admission", "admission bonus", "partnership bonus method"],
        keywords: [
            /bonus method/i,
            /partner admission/i,
            /admit a new partner/i,
            /bonus to old partners/i,
            /capital credit/i,
        ],
    },
    {
        id: "partnership-admission-goodwill",
        name: "Partnership Admission Goodwill",
        route: "/accounting/partnership-admission-goodwill",
        description:
            "Best when a new partner admission problem requires implied goodwill.",
        required: ["totalOldCapital", "partnerInvestment", "ownershipPercentage"],
        aliases: ["goodwill method admission", "partnership goodwill method", "implied goodwill"],
        keywords: [
            /goodwill method/i,
            /implied goodwill/i,
            /partner admission/i,
            /admit a new partner/i,
            /goodwill on admission/i,
        ],
    },
    {
        id: "philippine-vat",
        name: "Philippine VAT",
        route: "/accounting/philippine-vat",
        description:
            "Compute output VAT, input VAT, and VAT payable using VATable sales and purchases.",
        required: ["vatableSales", "vatablePurchases"],
        aliases: ["philippine vat", "vat computation", "output vat and input vat"],
        keywords: [
            /vat/i,
            /value added tax/i,
            /output vat/i,
            /input vat/i,
            /vat payable/i,
            /vatable sales/i,
            /vatable purchases/i,
            /\b12%\b/i,
        ],
    },
    {
        id: "trade-discount",
        name: "Trade Discount",
        route: "/accounting/trade-discount",
        description:
            "Compute trade discount amount and net price from list price and trade discount rate.",
        required: ["invoice", "discountRate"],
        aliases: ["net price after discount", "list price discount", "catalog price discount"],
        keywords: [
            /trade discount/i,
            /list price/i,
            /catalog price/i,
            /net price/i,
            /discount from list price/i,
        ],
    },
    {
        id: "cost-of-goods-manufactured",
        name: "Cost of Goods Manufactured",
        route: "/accounting/cost-of-goods-manufactured",
        description:
            "Compute total manufacturing costs and cost of goods manufactured.",
        required: [
            "directMaterialsUsed",
            "directLabor",
            "manufacturingOverhead",
            "beginningWorkInProcess",
            "endingWorkInProcess",
        ],
        aliases: ["manufacturing costs", "factory costs schedule", "schedule of cgm"],
        keywords: [
            /cost of goods manufactured/i,
            /\bcogm\b/i,
            /total manufacturing costs/i,
            /direct materials/i,
            /direct labor/i,
            /manufacturing overhead/i,
            /work in process/i,
            /\bwip\b/i,
        ],
    },
    {
        id: "current-ratio",
        name: "Current Ratio & Working Capital",
        route: "/accounting/current-ratio",
        description:
            "Measure liquidity using current assets and current liabilities.",
        required: ["currentAssets", "currentLiabilities"],
        aliases: ["working capital", "liquidity ratio", "short term solvency"],
        keywords: [
            /current ratio/i,
            /working capital/i,
            /liquidity/i,
            /current assets/i,
            /current liabilities/i,
        ],
    },
    {
        id: "quick-ratio",
        name: "Quick Ratio",
        route: "/accounting/quick-ratio",
        description:
            "Measure immediate liquidity using cash, marketable securities, receivables, and current liabilities.",
        required: ["cash", "marketableSecurities", "netReceivables", "currentLiabilities"],
        aliases: ["acid test ratio", "acid-test ratio", "immediate liquidity"],
        keywords: [
            /quick ratio/i,
            /acid[- ]test/i,
            /cash/i,
            /marketable securities/i,
            /receivables/i,
            /current liabilities/i,
        ],
    },
    {
        id: "cash-ratio",
        name: "Cash Ratio",
        route: "/accounting/cash-ratio",
        description:
            "Measure the strictest liquidity coverage using cash, marketable securities, and current liabilities.",
        required: ["cash", "marketableSecurities", "currentLiabilities"],
        aliases: ["immediate cash coverage", "cash to current liabilities", "cash liquidity ratio"],
        keywords: [
            /cash ratio/i,
            /cash to current liabilities/i,
            /strict liquidity/i,
            /cash coverage/i,
            /cash and marketable securities/i,
            /marketable securities/i,
        ],
    },
    {
        id: "cash-conversion-cycle",
        name: "Cash Conversion Cycle",
        route: "/accounting/cash-conversion-cycle",
        description:
            "Measure how long cash is tied up in receivables and inventory after considering supplier payment timing.",
        required: ["receivablesDays", "inventoryDays", "payablesDays"],
        aliases: ["ccc", "cash cycle", "working capital cycle"],
        keywords: [
            /cash conversion cycle/i,
            /\bccc\b/i,
            /cash cycle/i,
            /working capital cycle/i,
            /receivables days/i,
            /inventory days/i,
            /payables days/i,
        ],
    },
    {
        id: "receivables-turnover",
        name: "Accounts Receivable Turnover",
        route: "/accounting/receivables-turnover",
        description:
            "Compute receivables turnover and average collection period.",
        required: ["netCreditSales", "averageAccountsReceivable"],
        aliases: ["ar turnover", "receivable turnover", "collection period"],
        keywords: [
            /accounts receivable turnover/i,
            /receivables turnover/i,
            /average collection period/i,
            /collection period/i,
            /credit sales/i,
            /average accounts receivable/i,
        ],
    },
    {
        id: "inventory-turnover",
        name: "Inventory Turnover",
        route: "/accounting/inventory-turnover",
        description:
            "Compute inventory turnover and days in inventory for merchandising analysis.",
        required: ["costOfGoodsSold", "averageInventory"],
        aliases: ["stock turnover", "days in inventory", "inventory movement"],
        keywords: [
            /inventory turnover/i,
            /stock turnover/i,
            /days in inventory/i,
            /\bcogs\b/i,
        /average inventory/i,
        ],
    },
    {
        id: "accounts-payable-turnover",
        name: "Accounts Payable Turnover",
        route: "/accounting/accounts-payable-turnover",
        description:
            "Compute payable turnover and average payment period.",
        required: ["netCreditPurchases", "averageAccountsPayable"],
        aliases: ["ap turnover", "payables turnover", "days to pay suppliers"],
        keywords: [
            /accounts payable turnover/i,
            /payables turnover/i,
            /average payment period/i,
            /days to pay suppliers/i,
            /credit purchases/i,
            /average accounts payable/i,
        ],
    },
    {
        id: "times-interest-earned",
        name: "Times Interest Earned",
        route: "/accounting/times-interest-earned",
        description:
            "Measure interest coverage using income before interest and taxes.",
        required: ["incomeBeforeInterestAndTaxes", "interestExpense"],
        aliases: ["interest coverage", "tie ratio", "earnings coverage"],
        keywords: [
            /times interest earned/i,
            /interest coverage/i,
            /\btie\b/i,
            /ebit/i,
            /interest expense/i,
        ],
    },
    {
        id: "book-value-per-share",
        name: "Book Value Per Share",
        route: "/accounting/book-value-per-share",
        description:
            "Compute book value attributed to each outstanding common share.",
        required: ["commonEquity", "outstandingCommonShares"],
        aliases: ["bvps", "book value of common share", "equity per share"],
        keywords: [
            /book value per share/i,
            /\bbvps\b/i,
            /book value of common share/i,
            /equity per share/i,
            /outstanding common shares/i,
        ],
    },
    {
        id: "debt-to-equity",
        name: "Debt to Equity Ratio",
        route: "/accounting/debt-to-equity",
        description:
            "Measure leverage using total liabilities and total equity.",
        required: ["liabilities", "equity"],
        aliases: ["de ratio", "leverage ratio", "debt equity"],
        keywords: [
            /debt to equity/i,
            /debt[- ]equity/i,
            /leverage ratio/i,
            /total liabilities/i,
            /total equity/i,
        ],
    },
    {
        id: "return-on-assets",
        name: "Return on Assets",
        route: "/accounting/return-on-assets",
        description:
            "Compute return on assets using net income and average total assets.",
        required: ["netIncome", "averageTotalAssets"],
        aliases: ["roa", "profitability ratio", "asset return"],
        keywords: [
            /return on assets/i,
            /\broa\b/i,
            /profitability/i,
            /net income/i,
        /average total assets/i,
        ],
    },
    {
        id: "asset-turnover",
        name: "Asset Turnover",
        route: "/accounting/asset-turnover",
        description:
            "Compute how efficiently assets are used to generate net sales.",
        required: ["netSales", "averageTotalAssets"],
        aliases: ["assets turnover", "sales to assets", "asset efficiency"],
        keywords: [
            /asset turnover/i,
            /assets turnover/i,
            /sales to assets/i,
            /asset efficiency/i,
            /net sales/i,
            /average total assets/i,
        ],
    },
    {
        id: "return-on-equity",
        name: "Return on Equity",
        route: "/accounting/return-on-equity",
        description:
            "Compute return on owners' equity using net income and average equity.",
        required: ["netIncome", "averageEquity"],
        aliases: ["roe", "owners equity return", "shareholders return"],
        keywords: [
            /return on equity/i,
            /\broe\b/i,
            /owners'? equity/i,
            /shareholders'? equity/i,
            /stockholders'? equity/i,
            /average equity/i,
        ],
    },
    {
        id: "debt-ratio",
        name: "Debt Ratio",
        route: "/accounting/debt-ratio",
        description:
            "Measure the proportion of assets financed by liabilities.",
        required: ["liabilities", "assets"],
        aliases: ["total debt ratio", "liabilities to assets", "debt percentage"],
        keywords: [
            /debt ratio/i,
            /liabilities to assets/i,
            /total liabilities/i,
            /total assets/i,
            /debt percentage/i,
        ],
    },
    {
        id: "earnings-per-share",
        name: "Earnings Per Share",
        route: "/accounting/earnings-per-share",
        description:
            "Compute EPS using net income, preferred dividends, and weighted average common shares.",
        required: ["netIncome", "preferredDividends", "weightedAverageCommonShares"],
        aliases: ["eps", "basic earnings per share", "profit per share"],
        keywords: [
            /earnings per share/i,
            /\beps\b/i,
            /basic eps/i,
            /preferred dividends/i,
            /weighted average common shares/i,
        ],
    },
    {
        id: "horizontal-analysis",
        name: "Horizontal Analysis",
        route: "/accounting/horizontal-analysis",
        description:
            "Compute amount change and percentage change between a base period and a current period.",
        required: ["basePeriodAmount", "currentPeriodAmount"],
        aliases: ["trend analysis", "period-to-period analysis", "year-over-year change"],
        keywords: [
            /horizontal analysis/i,
            /trend analysis/i,
            /increase or decrease/i,
            /year over year/i,
            /base period/i,
            /current period/i,
        ],
    },
    {
        id: "vertical-analysis",
        name: "Vertical Analysis",
        route: "/accounting/vertical-analysis",
        description:
            "Compute the percentage of a statement item against a base total.",
        required: ["statementItemAmount", "statementBaseAmount"],
        aliases: ["common size analysis", "common-size percentage", "statement percentage"],
        keywords: [
            /vertical analysis/i,
            /common size/i,
            /common-size/i,
            /statement item/i,
            /base total/i,
        ],
    },
    {
        id: "depreciation-schedule-comparison",
        name: "Depreciation Schedule Comparison",
        route: "/accounting/depreciation-schedule-comparison",
        description:
            "Compare straight-line and double-declining depreciation schedules across the asset life.",
        required: ["cost", "salvageValue", "usefulLife"],
        aliases: ["compare depreciation methods", "depreciation comparison", "straight line vs ddb"],
        keywords: [
            /compare depreciation methods/i,
            /depreciation comparison/i,
            /straight line vs ddb/i,
            /straight[- ]line/i,
            /double declining/i,
        ],
    },
    ];

    /* -------------------------------------------------------------------------- */
    /* HELPERS */
    /* -------------------------------------------------------------------------- */

    function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

export function normalizeText(text: string = ""): string {
    const normalized = String(text)
        .toLowerCase()
        .replace(/₱/g, " php ")
        .replace(/[,_]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    return VOCABULARY_NORMALIZATIONS.reduce((value, [pattern, replacement]) => {
        return value.replace(pattern, replacement);
    }, normalized);
    }

    const MATCH_STOP_WORDS = new Set([
    "a",
    "an",
    "and",
    "as",
    "at",
    "for",
    "from",
    "in",
    "into",
    "is",
    "of",
    "on",
    "or",
    "the",
    "to",
    "with",
    ]);

    function tokenizeForMatching(value: string): string[] {
    return normalizeText(value)
        .replace(/['’]/g, "")
        .replace(/[/:()-]/g, " ")
        .split(/\s+/)
        .filter((token) => token.length > 1 && !MATCH_STOP_WORDS.has(token));
    }

    function buildPhraseVariants(phrase: string): string[] {
    const normalized = normalizeText(phrase);
    if (!normalized) return [];

    const variants = new Set<string>([normalized]);

    variants.add(normalized.replace(/['’]/g, ""));
    variants.add(normalized.replace(/\s*&\s*/g, " and "));
    variants.add(normalized.replace(/\band\b/g, "&"));
    variants.add(normalized.replace(/-/g, " "));
    variants.add(normalized.replace(/\//g, " "));
    variants.add(normalized.replace(/\bshort term\b/g, "short-term"));
    variants.add(normalized.replace(/\bshort-term\b/g, "short term"));
    variants.add(normalized.replace(/\byear\b/g, "yr"));
    variants.add(normalized.replace(/\byears\b/g, "yrs"));
    variants.add(normalized.replace(/\baccounts receivable\b/g, "receivables"));
    variants.add(normalized.replace(/\baccounts payable\b/g, "payables"));

    return [...variants].filter(Boolean);
    }

    function buildAliasRegexGroup(aliases: readonly string[]): string {
    return [...new Set(aliases.flatMap(buildPhraseVariants))]
        .map((alias) =>
        escapeRegExp(alias)
            .replace(/\\ /g, "\\s+")
            .replace(/\\-/g, "(?:-|\\\\s)")
            .replace(/\\\//g, "(?:/|\\\\s)")
            .replace(/&/g, "(?:&|and)")
        )
        .join("|");
    }

    export function toNumber(value: string | number | null | undefined): number | null {
    if (value === null || value === undefined) return null;

    let cleaned = String(value).trim();
    cleaned = stripCurrencyMarkers(cleaned);
    cleaned = cleaned.replace(/,/g, "");
    cleaned = cleaned.replace(/[\u20B1$%\s]/g, "");

    if (!cleaned) return null;

    const match = cleaned.match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : null;
    }

    export function numberToInput(value: number | null | undefined): string {
    return value === null || value === undefined || Number.isNaN(value)
        ? ""
        : String(value);
    }

    export function extractFirstNumber(text: string, patterns: RegExp[]): number | null {
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && match[1] !== undefined) {
        const value = toNumber(match[1]);
        if (value !== null) return value;
        }
    }
    return null;
    }

    function extractNumberByAliases(
    text: string,
    aliases: readonly string[],
    options?: {
        percent?: boolean;
        allowCurrency?: boolean;
    }
    ): number | null {
    if (!aliases.length) return null;

    const joined = buildAliasRegexGroup(aliases);
    const currencyPrefix = options?.allowCurrency === false ? "" : "[\u20B1$]?";
    const percentSuffix = options?.percent ? "\\s*%?" : "";
    const fillerWords = "(?:\\s+(?:is|are|was|were|=|:|of|for|at|to|worth|totals?|totaling|amounting|came|comes|comes to|stands at))?";

    return extractFirstNumber(text, [
        new RegExp(
        `(?:${joined})${fillerWords}\\s*${currencyPrefix}(-?\\d+(?:\\.\\d+)?)${percentSuffix}`,
        "i"
        ),
        new RegExp(
        `${currencyPrefix}(-?\\d+(?:\\.\\d+)?)${percentSuffix}${fillerWords}\\s*(?:${joined})`,
        "i"
        ),
        new RegExp(
        `(?:${joined})[^\\d\\n]{0,24}${currencyPrefix}(-?\\d+(?:\\.\\d+)?)${percentSuffix}`,
        "i"
        ),
        new RegExp(
        `${currencyPrefix}(-?\\d+(?:\\.\\d+)?)${percentSuffix}[^\\d\\n]{0,24}(?:${joined})`,
        "i"
        ),
    ]);
    }

    function countPhraseMatches(text: string, phrases: readonly string[] = []): number {
    if (!phrases.length || !text) return 0;

    const normalizedText = normalizeText(text);
    const textTokens = new Set(tokenizeForMatching(normalizedText));

    return phrases.reduce((count, phrase) => {
        const variants = buildPhraseVariants(phrase);
        if (!variants.length) return count;

        const matched = variants.some((variant) => {
        if (normalizedText.includes(variant)) return true;

        const tokens = tokenizeForMatching(variant);
        if (tokens.length < 2) return false;

        const overlap = tokens.filter((token) => textTokens.has(token)).length;
        return overlap >= Math.max(2, Math.ceil(tokens.length * 0.6));
        });

        return matched ? count + 1 : count;
    }, 0);
    }

    const VOCABULARY_NORMALIZATIONS: Array<[RegExp, string]> = [
    [/\bwhat the business owns\b/g, "assets"],
    [/\bwhat we own\b/g, "assets"],
    [/\bthings we own\b/g, "assets"],
    [/\bwhat the business owes\b/g, "liabilities"],
    [/\bwhat we owe\b/g, "liabilities"],
    [/\bthings we owe\b/g, "liabilities"],
    [/\bowner(?:'s)? claim\b/g, "equity"],
    [/\bowner(?:'s)? stake\b/g, "equity"],
    [/\bmoney customers owe us\b/g, "accounts receivable"],
    [/\bamount customers owe\b/g, "accounts receivable"],
    [/\bcredit customers still owe\b/g, "accounts receivable"],
    [/\bunpaid customer balances\b/g, "accounts receivable"],
    [/\bmoney owed by customers\b/g, "accounts receivable"],
    [/\bamount collectible from customers\b/g, "accounts receivable"],
    [/\bcustomer balances after allowance\b/g, "net receivables"],
    [/\bmoney in the bank\b/g, "cash"],
    [/\bcash in bank\b/g, "cash"],
    [/\bshort term investments\b/g, "marketable securities"],
    [/\bitems easy to convert to cash\b/g, "marketable securities"],
    [/\bcash equivalents\b/g, "marketable securities"],
    [/\bnear cash investments\b/g, "marketable securities"],
    [/\bshort term assets\b/g, "current assets"],
    [/\bshort-term assets\b/g, "current assets"],
    [/\bassets due within one year\b/g, "current assets"],
    [/\bshort term liabilities\b/g, "current liabilities"],
    [/\bshort-term liabilities\b/g, "current liabilities"],
    [/\bshort term debts\b/g, "current liabilities"],
    [/\bdebts due within one year\b/g, "current liabilities"],
    [/\bobligations due within one year\b/g, "current liabilities"],
    [/\bsales on account\b/g, "net credit sales"],
    [/\bcredit revenue\b/g, "net credit sales"],
    [/\bsales on credit\b/g, "net credit sales"],
    [/\bsales made on account\b/g, "net credit sales"],
    [/\baverage customer balances\b/g, "average accounts receivable"],
    [/\baverage customer receivables\b/g, "average accounts receivable"],
    [/\bstock on hand\b/g, "inventory"],
    [/\baverage stock on hand\b/g, "average inventory"],
    [/\bcost of items sold\b/g, "cost of goods sold"],
    [/\bpurchases on credit\b/g, "net credit purchases"],
    [/\bpurchases made on credit\b/g, "net credit purchases"],
    [/\bgoods bought on credit\b/g, "net credit purchases"],
    [/\bgoods purchased on account\b/g, "net credit purchases"],
    [/\baverage amount owed to suppliers\b/g, "average accounts payable"],
    [/\baverage supplier balances\b/g, "average accounts payable"],
    [/\bprofit after tax\b/g, "net income"],
    [/\bearned after all costs\b/g, "net income"],
    [/\basset base\b/g, "total assets"],
    [/\bprofit before interest and tax\b/g, "income before interest and taxes"],
    [/\bincome before finance cost and tax\b/g, "income before interest and taxes"],
    [/\boperating profit before interest and tax\b/g, "income before interest and taxes"],
    [/\bfinance charges\b/g, "interest expense"],
    [/\binterest cost\b/g, "interest expense"],
    [/\bloan interest\b/g, "interest expense"],
    [/\bordinary shareholders equity\b/g, "common equity"],
    [/\bequity for common shareholders\b/g, "common equity"],
    [/\bcommon shareholders equity\b/g, "common equity"],
    [/\bamount due after vat\b/g, "vat payable"],
    [/\btax on sales\b/g, "output vat"],
    [/\btax on purchases\b/g, "input vat"],
    [/\bwork being processed\b/g, "work in process"],
    [/\bfactory overhead\b/g, "manufacturing overhead"],
    [/\bproduction overhead\b/g, "manufacturing overhead"],
    [/\bprofit sharing\b/g, "partnership profit sharing"],
    [/\bshare the income\b/g, "partnership profit sharing"],
    [/\bshare the loss\b/g, "partnership profit sharing"],
    [/\bliquidity check\b/g, "current ratio"],
    [/\bimmediate liquidity\b/g, "quick ratio"],
    [/\bcollect receivables\b/g, "accounts receivable turnover"],
    [/\bhow fast inventory moves\b/g, "inventory turnover"],
    [/\bregular deposit each period\b/g, "periodic payment"],
    [/\bpayment every period\b/g, "periodic payment"],
    [/\bnumber of installments\b/g, "periods"],
    [/\bdesired profit\b/g, "target profit"],
    [/\brequired profit\b/g, "target profit"],
    [/\bcurrent sales\b/g, "actual sales"],
    [/\bsales at break even\b/g, "break-even sales"],
    [/\bprofit per share\b/g, "earnings per share"],
    [/\bbasic eps\b/g, "earnings per share"],
    [/\byear over year change\b/g, "horizontal analysis"],
    [/\btrend percentage\b/g, "horizontal analysis"],
    [/\bcommon size\b/g, "vertical analysis"],
    [/\bcommon-size\b/g, "vertical analysis"],
    [/\bdays sales outstanding\b/g, "receivables days"],
    [/\bdso\b/g, "receivables days"],
    [/\bdays payable outstanding\b/g, "payables days"],
    [/\bdpo\b/g, "payables days"],
    [/\bcash cycle\b/g, "cash conversion cycle"],
    [/\bworking capital cycle\b/g, "cash conversion cycle"],
    [/\btrue annual rate\b/g, "effective annual rate"],
    [/\bactual annual rate\b/g, "effective annual rate"],
    [/\bnominal annual rate\b/g, "nominal rate"],
    [/\bamount i want to have later\b/g, "future value"],
    [/\bmoney i want to accumulate\b/g, "future value"],
    [/\bdeposit needed every period\b/g, "required periodic deposit"],
    [/\bhow much to save each period\b/g, "required periodic deposit"],
    [/\bbottom line margin\b/g, "net profit margin"],
    [/\bprofit from each peso of sales\b/g, "net profit margin"],
    [/\boperating profit sensitivity\b/g, "operating leverage"],
    [/\bhow sensitive profit is to sales\b/g, "operating leverage"],
    [/\bassets generate sales\b/g, "asset turnover"],
    [/\bsales produced by assets\b/g, "asset turnover"],
    [/\breturn for owners\b/g, "return on equity"],
    [/\bowners'? return\b/g, "return on equity"],
    [/\bdepreciation by units\b/g, "units of production depreciation"],
    [/\bdepreciation based on output\b/g, "units of production depreciation"],
    [/\bbonus on admission\b/g, "partnership admission bonus"],
    [/\bgoodwill on admission\b/g, "partnership admission goodwill"],
    [/\bpay suppliers\b/g, "accounts payable turnover"],
    [/\bhow fast we pay creditors\b/g, "accounts payable turnover"],
    [/\binterest coverage\b/g, "times interest earned"],
    [/\bearnings cover interest\b/g, "times interest earned"],
    [/\bbook value of share\b/g, "book value per share"],
    [/\bequity per share\b/g, "book value per share"],
    ];

    export function extractTime(text: string): {
    raw: number | null;
    years: number | null;
    note: string;
    } {
    const match = text.match(/(\d+(?:\.\d+)?)\s*(years?|yrs?|months?|mos?|days?)/i);

    if (!match) {
        return { raw: null, years: null, note: "" };
    }

    const value = Number(match[1]);
    const unit = match[2].toLowerCase();

    if (unit.startsWith("year") || unit.startsWith("yr")) {
        return { raw: value, years: value, note: "" };
    }

    if (unit.startsWith("month") || unit.startsWith("mo")) {
        const years = Number((value / 12).toFixed(4));
        return {
        raw: value,
        years,
        note: `${value} month(s) detected and normalized to ${years} year(s).`,
        };
    }

    if (unit.startsWith("day")) {
        const years = Number((value / 365).toFixed(4));
        return {
        raw: value,
        years,
        note: `${value} day(s) detected and normalized to ${years} year(s).`,
        };
    }

    return { raw: null, years: null, note: "" };
    }

    function extractCompounding(text: string): { value: number | null; note: string } {
    if (/monthly/i.test(text)) {
        return {
        value: 12,
        note: "Monthly compounding detected and normalized to 12 times per year.",
        };
    }

    if (/quarterly/i.test(text)) {
        return {
        value: 4,
        note: "Quarterly compounding detected and normalized to 4 times per year.",
        };
    }

    if (/semi[- ]?annually/i.test(text)) {
        return {
        value: 2,
        note: "Semi-annual compounding detected and normalized to 2 times per year.",
        };
    }

    if (/annually|annual|yearly/i.test(text)) {
        return {
        value: 1,
        note: "Annual compounding detected and normalized to 1 time per year.",
        };
    }

    const explicit = extractFirstNumber(text, [
        /(?:times compounded|compounding frequency|compounds per year)\s*(?:is|=|:|of|for)?\s*(-?\d+(?:\.\d+)?)/i,
        /(-?\d+(?:\.\d+)?)\s*(?:times per year|compounds per year)/i,
    ]);

    return {
        value: explicit,
        note: explicit !== null ? "Explicit compounding frequency detected." : "",
    };
    }

    function extractCreditTerms(text: string): Partial<Record<FieldKey, string>> {
    const result: Partial<Record<FieldKey, string>> = {};
    const match = text.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+)\s*,\s*n\s*\/\s*(\d+)/i);

    if (!match) return result;

    result.discountRate = numberToInput(Number(match[1]));
    result.discountDays = numberToInput(Number(match[2]));
    result.totalDays = numberToInput(Number(match[3]));

    return result;
    }

    function extractPartnershipRatios(text: string): Partial<Record<FieldKey, string>> {
    const result: Partial<Record<FieldKey, string>> = {};
    const ratioMatch = text.match(
        /(?:ratio|sharing|share)\s*(?:of|is|=|:)?\s*(\d+(?:\.\d+)?)\s*[:-]\s*(\d+(?:\.\d+)?)(?:\s*[:-]\s*(\d+(?:\.\d+)?))?/i
    );

    if (!ratioMatch) return result;

    result.partnerARatio = numberToInput(Number(ratioMatch[1]));
    result.partnerBRatio = numberToInput(Number(ratioMatch[2]));

    if (ratioMatch[3] !== undefined) {
        result.partnerCRatio = numberToInput(Number(ratioMatch[3]));
    }

    return result;
    }

    function setFact(
    target: Partial<Record<FieldKey, string>>,
    key: FieldKey,
    value: string | number | null | undefined
    ) {
    if (value === null || value === undefined || value === "") return;
    if (target[key]) return;

    target[key] = typeof value === "number" ? numberToInput(value) : String(value);
    }

    function applyMirrors(facts: Partial<Record<FieldKey, string>>) {
    if (facts.principal) {
        if (!facts.loanAmount) facts.loanAmount = facts.principal;
        if (!facts.presentValue) facts.presentValue = facts.principal;
    }

    if (facts.loanAmount && !facts.principal) {
        facts.principal = facts.loanAmount;
    }

    if (facts.presentValue && !facts.principal) {
        facts.principal = facts.presentValue;
    }

    if (facts.rate && !facts.annualRate) {
        facts.annualRate = facts.rate;
    }

    if (facts.annualRate && !facts.rate) {
        facts.rate = facts.annualRate;
    }

    if (facts.time && !facts.years) {
        facts.years = facts.time;
    }

    if (facts.years && !facts.time) {
        facts.time = facts.years;
    }

    if (facts.revenue && !facts.sales) {
        facts.sales = facts.revenue;
    }

    if (facts.sales && !facts.revenue) {
        facts.revenue = facts.sales;
    }

    if (facts.accountsReceivable && !facts.netReceivables) {
        facts.netReceivables = facts.accountsReceivable;
    }

    if (facts.netReceivables && !facts.accountsReceivable) {
        facts.accountsReceivable = facts.netReceivables;
    }

    if (facts.assets && !facts.averageTotalAssets) {
        facts.averageTotalAssets = facts.assets;
    }

    if (facts.averageTotalAssets && !facts.assets) {
        facts.assets = facts.averageTotalAssets;
    }

    if (facts.equity && !facts.averageEquity) {
        facts.averageEquity = facts.equity;
    }

    if (facts.averageEquity && !facts.equity) {
        facts.equity = facts.averageEquity;
    }

    if (facts.equity && !facts.commonEquity) {
        facts.commonEquity = facts.equity;
    }

    if (facts.sales && !facts.actualSales) {
        facts.actualSales = facts.sales;
    }

    if (facts.actualSales && !facts.sales) {
        facts.sales = facts.actualSales;
    }
    }

    /* -------------------------------------------------------------------------- */
    /* EXTRACTION */
    /* -------------------------------------------------------------------------- */

    export function extractFacts(query: string): ExtractedFacts {
    const text = normalizeText(query);

    if (!text) {
        return {
        ...INITIAL_FIELDS,
        notes: [],
        };
    }

    const notes: string[] = [];
    const facts: Partial<Record<FieldKey, string>> = {};

    const principal = extractFirstNumber(text, [
        /(?:principal|capital|loan amount|amount borrowed|investment|invested|borrowed)\s*(?:is|=|:|of|for)?\s*[\u20B1$]?(-?\d+(?:\.\d+)?)/i,
        /\bon\s*[\u20B1$]?(-?\d+(?:\.\d+)?)(?=.*(?:interest|rate|years?|months?|days?))/i,
    ]);

    const rate = extractFirstNumber(text, [
        /(?:interest rate|rate of interest|rate|annual rate|yearly rate)\s*(?:is|=|:|of|at)?\s*(-?\d+(?:\.\d+)?)\s*%/i,
        /\bat\s*(-?\d+(?:\.\d+)?)\s*%/i,
        /(-?\d+(?:\.\d+)?)\s*%/i,
    ]);

    const { years, note } = extractTime(text);
    if (note) notes.push(note);

    const compounding = extractCompounding(text);
    if (compounding.note) notes.push(compounding.note);

    const cost = extractFirstNumber(text, [
        /(?:cost|expense|expenses|buying price|purchase price)\s*(?:is|=|:|of|for)?\s*[\u20B1$]?(-?\d+(?:\.\d+)?)/i,
        /(?:bought|purchased)\s*(?:for)?\s*[\u20B1$]?(-?\d+(?:\.\d+)?)/i,
    ]);

    const revenue = extractFirstNumber(text, [
        /(?:revenue|sales|income|selling price|selling amount)\s*(?:is|=|:|of|for)?\s*[\u20B1$]?(-?\d+(?:\.\d+)?)/i,
        /(?:sold|sell)\s*(?:for)?\s*[\u20B1$]?(-?\d+(?:\.\d+)?)/i,
    ]);

    const presentValue = extractNumberByAliases(text, FIELD_META.presentValue.aliases ?? []);
    const futureValue = extractNumberByAliases(text, FIELD_META.futureValue.aliases ?? []);
    const loanAmount = extractNumberByAliases(text, FIELD_META.loanAmount.aliases ?? []);
    const annualRate = extractNumberByAliases(text, FIELD_META.annualRate.aliases ?? [], {
        percent: true,
    });
    const fixedCosts = extractNumberByAliases(text, FIELD_META.fixedCosts.aliases ?? []);
    const sellingPricePerUnit = extractNumberByAliases(
        text,
        FIELD_META.sellingPricePerUnit.aliases ?? []
    );
    const variableCostPerUnit = extractNumberByAliases(
        text,
        FIELD_META.variableCostPerUnit.aliases ?? []
    );
    const accountsReceivable = extractNumberByAliases(
        text,
        FIELD_META.accountsReceivable.aliases ?? []
    );

    const estimatedUncollectibleRate = extractNumberByAliases(
        text,
        FIELD_META.estimatedUncollectibleRate.aliases ?? [],
        { percent: true }
    );
    const partnershipAmount = extractNumberByAliases(
        text,
        FIELD_META.partnershipAmount.aliases ?? []
    );
    const totalOldCapital = extractNumberByAliases(text, FIELD_META.totalOldCapital.aliases ?? []);
    const partnerInvestment = extractNumberByAliases(text, FIELD_META.partnerInvestment.aliases ?? []);
    const ownershipPercentage = extractNumberByAliases(text, FIELD_META.ownershipPercentage.aliases ?? [], {
        percent: true,
    });
    const partnerARatio = extractNumberByAliases(text, FIELD_META.partnerARatio.aliases ?? [], {
        allowCurrency: false,
    });
    const partnerBRatio = extractNumberByAliases(text, FIELD_META.partnerBRatio.aliases ?? [], {
        allowCurrency: false,
    });
    const partnerCRatio = extractNumberByAliases(text, FIELD_META.partnerCRatio.aliases ?? [], {
        allowCurrency: false,
    });
    const vatableSales = extractNumberByAliases(text, FIELD_META.vatableSales.aliases ?? []);
    const vatablePurchases = extractNumberByAliases(
        text,
        FIELD_META.vatablePurchases.aliases ?? []
    );
    const directMaterialsUsed = extractNumberByAliases(
        text,
        FIELD_META.directMaterialsUsed.aliases ?? []
    );
    const directLabor = extractNumberByAliases(text, FIELD_META.directLabor.aliases ?? []);
    const manufacturingOverhead = extractNumberByAliases(
        text,
        FIELD_META.manufacturingOverhead.aliases ?? []
    );
    const beginningWorkInProcess = extractNumberByAliases(
        text,
        FIELD_META.beginningWorkInProcess.aliases ?? []
    );
    const endingWorkInProcess = extractNumberByAliases(
        text,
        FIELD_META.endingWorkInProcess.aliases ?? []
    );
    const currentAssets = extractNumberByAliases(text, FIELD_META.currentAssets.aliases ?? []);
    const currentLiabilities = extractNumberByAliases(
        text,
        FIELD_META.currentLiabilities.aliases ?? []
    );
    const cash = extractNumberByAliases(text, FIELD_META.cash.aliases ?? []);
    const marketableSecurities = extractNumberByAliases(
        text,
        FIELD_META.marketableSecurities.aliases ?? []
    );
    const netReceivables = extractNumberByAliases(text, FIELD_META.netReceivables.aliases ?? []);
    const netCreditSales = extractNumberByAliases(text, FIELD_META.netCreditSales.aliases ?? []);
    const averageAccountsReceivable = extractNumberByAliases(
        text,
        FIELD_META.averageAccountsReceivable.aliases ?? []
    );
    const costOfGoodsSold = extractNumberByAliases(text, FIELD_META.costOfGoodsSold.aliases ?? []);
    const averageInventory = extractNumberByAliases(text, FIELD_META.averageInventory.aliases ?? []);
    const netIncome = extractNumberByAliases(text, FIELD_META.netIncome.aliases ?? []);
    const netCreditPurchases = extractNumberByAliases(text, FIELD_META.netCreditPurchases.aliases ?? []);
    const averageAccountsPayable = extractNumberByAliases(text, FIELD_META.averageAccountsPayable.aliases ?? []);
    const incomeBeforeInterestAndTaxes = extractNumberByAliases(text, FIELD_META.incomeBeforeInterestAndTaxes.aliases ?? []);
    const interestExpense = extractNumberByAliases(text, FIELD_META.interestExpense.aliases ?? []);
    const commonEquity = extractNumberByAliases(text, FIELD_META.commonEquity.aliases ?? []);
    const outstandingCommonShares = extractNumberByAliases(text, FIELD_META.outstandingCommonShares.aliases ?? [], {
        allowCurrency: false,
    });
    const averageTotalAssets = extractNumberByAliases(
        text,
        FIELD_META.averageTotalAssets.aliases ?? []
    );
    const averageEquity = extractNumberByAliases(text, FIELD_META.averageEquity.aliases ?? []);
    const periodicPayment = extractNumberByAliases(text, FIELD_META.periodicPayment.aliases ?? []);
    const periods = extractNumberByAliases(text, FIELD_META.periods.aliases ?? [], {
        allowCurrency: false,
    });
    const targetProfit = extractNumberByAliases(text, FIELD_META.targetProfit.aliases ?? []);
    const actualSales = extractNumberByAliases(text, FIELD_META.actualSales.aliases ?? []);
    const breakEvenSalesAmount = extractNumberByAliases(
        text,
        FIELD_META.breakEvenSalesAmount.aliases ?? []
    );
    const preferredDividends = extractNumberByAliases(
        text,
        FIELD_META.preferredDividends.aliases ?? []
    );
    const weightedAverageCommonShares = extractNumberByAliases(
        text,
        FIELD_META.weightedAverageCommonShares.aliases ?? [],
        { allowCurrency: false }
    );
    const basePeriodAmount = extractNumberByAliases(
        text,
        FIELD_META.basePeriodAmount.aliases ?? []
    );
    const currentPeriodAmount = extractNumberByAliases(
        text,
        FIELD_META.currentPeriodAmount.aliases ?? []
    );
    const statementItemAmount = extractNumberByAliases(
        text,
        FIELD_META.statementItemAmount.aliases ?? []
    );
    const statementBaseAmount = extractNumberByAliases(
        text,
        FIELD_META.statementBaseAmount.aliases ?? []
    );
    const receivablesDays = extractNumberByAliases(text, FIELD_META.receivablesDays.aliases ?? [], {
        allowCurrency: false,
    });
    const inventoryDays = extractNumberByAliases(text, FIELD_META.inventoryDays.aliases ?? [], {
        allowCurrency: false,
    });
    const payablesDays = extractNumberByAliases(text, FIELD_META.payablesDays.aliases ?? [], {
        allowCurrency: false,
    });
    const sales = extractNumberByAliases(text, FIELD_META.sales.aliases ?? []);
    const variableCosts = extractNumberByAliases(text, FIELD_META.variableCosts.aliases ?? []);
    const sellingPrice = extractNumberByAliases(text, FIELD_META.sellingPrice.aliases ?? []);
    const assets = extractNumberByAliases(text, FIELD_META.assets.aliases ?? []);
    const liabilities = extractNumberByAliases(text, FIELD_META.liabilities.aliases ?? []);
    const equity = extractNumberByAliases(text, FIELD_META.equity.aliases ?? []);
    const invoice = extractNumberByAliases(text, FIELD_META.invoice.aliases ?? []);
    const discountRate = extractNumberByAliases(text, FIELD_META.discountRate.aliases ?? [], {
        percent: true,
    });
    const totalEstimatedUnits = extractNumberByAliases(text, FIELD_META.totalEstimatedUnits.aliases ?? [], {
        allowCurrency: false,
    });
    const unitsProduced = extractNumberByAliases(text, FIELD_META.unitsProduced.aliases ?? [], {
        allowCurrency: false,
    });
    const daysPaid = extractNumberByAliases(text, FIELD_META.daysPaid.aliases ?? [], {
        allowCurrency: false,
    });
    const usefulLife = extractNumberByAliases(text, FIELD_META.usefulLife.aliases ?? [], {
        allowCurrency: false,
    });
    const salvageValue = extractNumberByAliases(text, FIELD_META.salvageValue.aliases ?? []);
    const year = extractNumberByAliases(text, FIELD_META.year.aliases ?? [], {
        allowCurrency: false,
    });
    const beginningUnits = extractNumberByAliases(text, FIELD_META.beginningUnits.aliases ?? [], {
        allowCurrency: false,
    });
    const beginningCost = extractNumberByAliases(text, FIELD_META.beginningCost.aliases ?? []);
    const purchase1Units = extractNumberByAliases(text, FIELD_META.purchase1Units.aliases ?? [], {
        allowCurrency: false,
    });
    const purchase1Cost = extractNumberByAliases(text, FIELD_META.purchase1Cost.aliases ?? []);
    const purchase2Units = extractNumberByAliases(text, FIELD_META.purchase2Units.aliases ?? [], {
        allowCurrency: false,
    });
    const purchase2Cost = extractNumberByAliases(text, FIELD_META.purchase2Cost.aliases ?? []);
    const unitsSold = extractNumberByAliases(text, FIELD_META.unitsSold.aliases ?? [], {
        allowCurrency: false,
    });

    const netSales = extractNumberByAliases(text, FIELD_META.netSales.aliases ?? []);
    const grossProfitRate = extractNumberByAliases(
        text,
        FIELD_META.grossProfitRate.aliases ?? [],
        { percent: true }
    );
    const costOfGoodsAvailable = extractNumberByAliases(
        text,
        FIELD_META.costOfGoodsAvailable.aliases ?? []
    );

    const bankBalance = extractNumberByAliases(text, FIELD_META.bankBalance.aliases ?? []);
    const bookBalance = extractNumberByAliases(text, FIELD_META.bookBalance.aliases ?? []);
    const depositsInTransit = extractNumberByAliases(
        text,
        FIELD_META.depositsInTransit.aliases ?? []
    );
    const outstandingChecks = extractNumberByAliases(
        text,
        FIELD_META.outstandingChecks.aliases ?? []
    );
    const serviceCharges = extractNumberByAliases(
        text,
        FIELD_META.serviceCharges.aliases ?? []
    );
    const nsfChecks = extractNumberByAliases(text, FIELD_META.nsfChecks.aliases ?? []);
    const bankError = extractNumberByAliases(text, FIELD_META.bankError.aliases ?? []);
    const bookError = extractNumberByAliases(text, FIELD_META.bookError.aliases ?? []);

    const creditTerms = extractCreditTerms(text);
    const partnershipRatios = extractPartnershipRatios(text);

    setFact(facts, "principal", principal);
    setFact(facts, "rate", rate);
    setFact(facts, "time", years);
    setFact(facts, "cost", cost);
    setFact(facts, "revenue", revenue);
    setFact(facts, "timesCompounded", compounding.value);
    setFact(facts, "presentValue", presentValue);
    setFact(facts, "futureValue", futureValue);
    setFact(facts, "loanAmount", loanAmount);
    setFact(facts, "annualRate", annualRate);
    setFact(facts, "years", years);
    setFact(facts, "fixedCosts", fixedCosts);
    setFact(facts, "sellingPricePerUnit", sellingPricePerUnit);
    setFact(facts, "variableCostPerUnit", variableCostPerUnit);
    setFact(facts, "sales", sales);
    setFact(facts, "variableCosts", variableCosts);
    setFact(facts, "sellingPrice", sellingPrice);
    setFact(facts, "assets", assets);
    setFact(facts, "liabilities", liabilities);
    setFact(facts, "equity", equity);
    setFact(facts, "invoice", invoice);
    setFact(facts, "discountRate", discountRate);
    setFact(facts, "totalEstimatedUnits", totalEstimatedUnits);
    setFact(facts, "unitsProduced", unitsProduced);
    setFact(facts, "daysPaid", daysPaid);
    setFact(facts, "salvageValue", salvageValue);
    setFact(facts, "usefulLife", usefulLife);
    setFact(facts, "year", year);
    setFact(facts, "beginningUnits", beginningUnits);
    setFact(facts, "beginningCost", beginningCost);
    setFact(facts, "purchase1Units", purchase1Units);
    setFact(facts, "purchase1Cost", purchase1Cost);
    setFact(facts, "purchase2Units", purchase2Units);
    setFact(facts, "purchase2Cost", purchase2Cost);
    setFact(facts, "unitsSold", unitsSold);

    setFact(facts, "netSales", netSales);
    setFact(facts, "grossProfitRate", grossProfitRate);
    setFact(facts, "costOfGoodsAvailable", costOfGoodsAvailable);

    setFact(facts, "bankBalance", bankBalance);
    setFact(facts, "bookBalance", bookBalance);
    setFact(facts, "depositsInTransit", depositsInTransit);
    setFact(facts, "outstandingChecks", outstandingChecks);
    setFact(facts, "serviceCharges", serviceCharges);
    setFact(facts, "nsfChecks", nsfChecks);
    setFact(facts, "bankError", bankError);
    setFact(facts, "bookError", bookError);

    setFact(facts, "accountsReceivable", accountsReceivable);
    setFact(facts, "estimatedUncollectibleRate", estimatedUncollectibleRate);
    setFact(facts, "partnershipAmount", partnershipAmount);
    setFact(facts, "totalOldCapital", totalOldCapital);
    setFact(facts, "partnerInvestment", partnerInvestment);
    setFact(facts, "ownershipPercentage", ownershipPercentage);
    setFact(facts, "partnerARatio", partnerARatio);
    setFact(facts, "partnerBRatio", partnerBRatio);
    setFact(facts, "partnerCRatio", partnerCRatio);
    setFact(facts, "vatableSales", vatableSales);
    setFact(facts, "vatablePurchases", vatablePurchases);
    setFact(facts, "directMaterialsUsed", directMaterialsUsed);
    setFact(facts, "directLabor", directLabor);
    setFact(facts, "manufacturingOverhead", manufacturingOverhead);
    setFact(facts, "beginningWorkInProcess", beginningWorkInProcess);
    setFact(facts, "endingWorkInProcess", endingWorkInProcess);
    setFact(facts, "currentAssets", currentAssets);
    setFact(facts, "currentLiabilities", currentLiabilities);
    setFact(facts, "cash", cash);
    setFact(facts, "marketableSecurities", marketableSecurities);
    setFact(facts, "netReceivables", netReceivables);
    setFact(facts, "netCreditSales", netCreditSales);
    setFact(facts, "averageAccountsReceivable", averageAccountsReceivable);
    setFact(facts, "costOfGoodsSold", costOfGoodsSold);
    setFact(facts, "averageInventory", averageInventory);
    setFact(facts, "netIncome", netIncome);
    setFact(facts, "netCreditPurchases", netCreditPurchases);
    setFact(facts, "averageAccountsPayable", averageAccountsPayable);
    setFact(facts, "incomeBeforeInterestAndTaxes", incomeBeforeInterestAndTaxes);
    setFact(facts, "interestExpense", interestExpense);
    setFact(facts, "commonEquity", commonEquity);
    setFact(facts, "outstandingCommonShares", outstandingCommonShares);
    setFact(facts, "averageTotalAssets", averageTotalAssets);
    setFact(facts, "averageEquity", averageEquity);
    setFact(facts, "periodicPayment", periodicPayment);
    setFact(facts, "periods", periods);
    setFact(facts, "targetProfit", targetProfit);
    setFact(facts, "actualSales", actualSales);
    setFact(facts, "breakEvenSalesAmount", breakEvenSalesAmount);
    setFact(facts, "preferredDividends", preferredDividends);
    setFact(facts, "weightedAverageCommonShares", weightedAverageCommonShares);
    setFact(facts, "basePeriodAmount", basePeriodAmount);
    setFact(facts, "currentPeriodAmount", currentPeriodAmount);
    setFact(facts, "statementItemAmount", statementItemAmount);
    setFact(facts, "statementBaseAmount", statementBaseAmount);
    setFact(facts, "receivablesDays", receivablesDays);
    setFact(facts, "inventoryDays", inventoryDays);
    setFact(facts, "payablesDays", payablesDays);

    Object.entries(creditTerms).forEach(([key, value]) => {
        setFact(facts, key as FieldKey, value);
    });

    Object.entries(partnershipRatios).forEach(([key, value]) => {
        setFact(facts, key as FieldKey, value);
    });

    applyMirrors(facts);

    return {
        ...INITIAL_FIELDS,
        ...facts,
        notes,
    };
    }

    /* -------------------------------------------------------------------------- */
    /* MERGE / TEXT */
    /* -------------------------------------------------------------------------- */

    export function mergeInputs(manual: FieldsState, extracted: ExtractedFacts): FieldsState {
    return FIELD_KEYS.reduce<FieldsState>((acc, key) => {
        acc[key] = manual[key] !== "" ? manual[key] : extracted[key] || "";
        return acc;
    }, { ...INITIAL_FIELDS });
    }

    export function humanizeField(field: FieldKey): string {
    return FIELD_META[field]?.label ?? field;
    }

    /* -------------------------------------------------------------------------- */
    /* SCORING */
    /* -------------------------------------------------------------------------- */

export function buildReason(
    calculator: CalculatorConfig,
    merged: FieldsState,
    query: string
    ): string {
    const matchedFields = calculator.required.filter((field) => merged[field] !== "");
    const matchedKeywords = calculator.keywords.filter((keyword) => keyword.test(query)).length;
    const matchedAliases = countPhraseMatches(query, calculator.aliases);

    if (
        matchedFields.length === calculator.required.length &&
        (matchedKeywords > 0 || matchedAliases > 0)
    ) {
        return `Matched all required values (${matchedFields
        .map(humanizeField)
        .join(", ")}) and recognized related accounting vocabulary from your natural-language input.`;
    }

    if (matchedFields.length === calculator.required.length) {
        return `Matched all required values: ${matchedFields.map(humanizeField).join(", ")}.`;
    }

    if (matchedFields.length > 0) {
        return `Partially matched ${matchedFields
        .map(humanizeField)
        .join(", ")} but still needs ${calculator.required
        .filter((field) => merged[field] === "")
        .map(humanizeField)
        .join(", ")}.`;
    }

    return calculator.description;
    }

export function scoreCalculator(
    calculator: CalculatorConfig,
    merged: FieldsState,
    query: string,
    extracted: ExtractedFacts
    ): number {
    let score = 0;

    const presentRequired = calculator.required.filter((field) => merged[field] !== "");
    const missingRequired = calculator.required.filter((field) => merged[field] === "");
    const extractedRequired = calculator.required.filter((field) => extracted[field] !== "");

    score += presentRequired.length * 24;
    score += extractedRequired.length * 5;

    if (missingRequired.length === 0) score += 20;
    score += (calculator.optional ?? []).filter((field) => merged[field] !== "").length * 8;

    calculator.keywords.forEach((keyword) => {
        if (keyword.test(query)) score += 7;
    });

    score += countPhraseMatches(query, calculator.aliases) * 9;
    score += countPhraseMatches(query, [calculator.name]) * 6;

    calculator.required.forEach((field) => {
        const aliases = FIELD_META[field]?.aliases ?? [];
        score += countPhraseMatches(query, aliases) * 2;
    });

    if (presentRequired.length === 0 && missingRequired.length > 0) {
        score -= 5;
    }

    return Math.max(0, Math.min(100, score));
    }

    export function confidenceLabel(score: number): ConfidenceLabel {
    if (score >= 80) return "High";
    if (score >= 55) return "Good";
    if (score >= 35) return "Possible";
    return "Low";
    }

    export function buildFollowUp(
    best: RankedCalculator | null,
    secondBest: RankedCalculator | null
    ): string {
    if (!best || best.score < 35) {
        return 'Try typing your full problem naturally, like: "Find simple interest for 10000 at 5% for 2 years" or "I bought for 5000 and sold for 8000."';
    }

    if (
        secondBest &&
        Math.abs(best.score - secondBest.score) <= 8 &&
        secondBest.score >= 35
    ) {
        return `This looks slightly ambiguous between ${best.name} and ${secondBest.name}. Add one more clue or value so Smart Solver can route with more confidence.`;
    }

    if (best.missing.length > 0) {
        return `To route confidently to ${best.name}, add ${best.missing
        .map(humanizeField)
        .join(" and ")}.`;
    }

    return `${best.name} is ready. You can apply detected values and open the calculator.`;
    }

export function makePrefill(
    calculator: { required: readonly FieldKey[]; optional?: readonly FieldKey[] },
    merged: FieldsState
    ): Partial<FieldsState> {
    const fieldsToPrefill = [
        ...calculator.required,
        ...(calculator.optional ?? []),
    ] as FieldKey[];

    return fieldsToPrefill.reduce<Partial<FieldsState>>((acc, field) => {
        acc[field] = merged[field] ?? "";
        return acc;
    }, {});
    }

    export function analyzeSmartInput(
    fields: FieldsState,
    smartInput: string
    ): SmartSolverAnalysis {
    const extracted = extractFacts(smartInput);
    const merged = mergeInputs(fields, extracted);
    const normalizedQuery = normalizeText(smartInput);
    const detectedCurrency = detectCurrencyFromText(smartInput);

    const ranked: RankedCalculator[] = CALCULATORS.map((calculator) => {
        const score = scoreCalculator(calculator, merged, normalizedQuery, extracted);
        const missing = calculator.required.filter((field) => merged[field] === "");

        return {
        ...calculator,
        score,
        confidence: confidenceLabel(score),
        missing,
        reason: buildReason(calculator, merged, normalizedQuery),
        };
    }).sort((a, b) => b.score - a.score);

    const best = ranked[0] ?? null;
    const secondBest = ranked[1] ?? null;

    const extractedEntries: Array<[FieldKey, string]> = FIELD_KEYS.flatMap((key) =>
        extracted[key] !== "" ? [[key, extracted[key]]] : []
    );

    return {
        extracted,
        merged,
        ranked,
        best,
        secondBest,
        detectedCurrency,
        followUp: buildFollowUp(best, secondBest),
        hasStrongMatch: Boolean(best && best.score >= 55),
        isReadyToRoute: Boolean(best && best.score >= 55 && best.missing.length === 0),
        extractedEntries,
    };
}

