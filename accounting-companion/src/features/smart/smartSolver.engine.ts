import type {
    CalculatorConfig,
    ConfidenceLabel,
    ExtractedFacts,
    FieldKey,
    FieldMeta,
    FieldsState,
    RankedCalculator,
    SmartSolverAnalysis,
    TopicFamilyConfidence,
    TopicFamilyMatch,
} from "./smartSolver.types.js";
import { ALL_FIELD_KEYS } from "./smartSolver.types.js";
import { detectCurrencyFromText } from "../../utils/currency.js";
import {
    FLEXIBLE_NUMBER_CAPTURE_PATTERN,
    parseLooseNumber,
} from "../../utils/numberParsing.js";

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

    initialInvestment: {
        label: "Initial Investment",
        placeholder: "100000",
        kind: "money",
        group: "finance",
        visibleInManualInputs: false,
        aliases: [
        "initial investment",
        "initial outlay",
        "project investment",
        "investment cost",
        "cash outflow at start",
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

    beginningCashBalance: {
        label: "Beginning Cash Balance",
        placeholder: "50000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["beginning cash", "beginning cash balance", "opening cash"],
    },

    cashCollections: {
        label: "Cash Collections",
        placeholder: "180000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["cash collections", "cash receipts", "collections"],
    },

    cashDisbursements: {
        label: "Cash Disbursements",
        placeholder: "210000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["cash disbursements", "cash payments", "disbursements"],
    },

    minimumCashBalance: {
        label: "Minimum Cash Balance",
        placeholder: "25000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["minimum cash balance", "required cash balance", "minimum cash"],
    },

    budgetedUnits: {
        label: "Budgeted Units",
        placeholder: "10000",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: [
            "budgeted units",
            "planned units",
            "static budget units",
            "practical capacity",
            "capacity units",
            "available capacity",
        ],
    },

    actualUnits: {
        label: "Actual Units",
        placeholder: "12000",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: [
            "actual units",
            "actual output",
            "units actually produced",
            "actual volume",
            "actual activity",
        ],
    },

    actualCost: {
        label: "Actual Cost",
        placeholder: "422000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["actual cost", "actual total cost"],
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
    opportunityCostPerUnit: {
        label: "Opportunity Cost / Unit",
        placeholder: "12",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["opportunity cost per unit", "opportunity cost each", "foregone contribution per unit"],
    },
    externalMarketPricePerUnit: {
        label: "External Market Price / Unit",
        placeholder: "85",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["external market price", "outside market price", "market price per unit"],
    },
    minimumTransferPrice: {
        label: "Minimum Transfer Price",
        placeholder: "70",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["minimum transfer price", "lowest transfer price", "transfer price floor"],
    },
    marketBasedCeiling: {
        label: "Market-Based Ceiling",
        placeholder: "85",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["market based ceiling", "external market ceiling", "outside market ceiling"],
    },
    transferPricingRangeWidth: {
        label: "Transfer Pricing Range Width",
        placeholder: "15",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["transfer pricing range", "negotiation range", "pricing band"],
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

    faceValue: {
        label: "Face Value",
        placeholder: "1000000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["face value", "bond face value", "maturity value of bond", "par value"],
    },

    statedRate: {
        label: "Stated Rate (%)",
        placeholder: "8",
        kind: "percent",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["stated rate", "coupon rate", "contract rate", "bond rate"],
    },

    marketRate: {
        label: "Market Rate (%)",
        placeholder: "10",
        kind: "percent",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["market rate", "effective rate", "yield rate", "investor yield"],
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
        aliases: [
        "discount rate",
        "required return",
        "hurdle rate",
        "cost of capital",
        "cash discount",
        "trade discount",
        "trade discount rate",
        ],
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

    inventoryCost: {
        label: "Inventory Cost",
        placeholder: "25000",
        kind: "money",
        group: "inventory",
        visibleInManualInputs: false,
        aliases: ["inventory cost", "cost amount", "inventory amount at cost"],
    },

    netRealizableValue: {
        label: "Net Realizable Value",
        placeholder: "22000",
        kind: "money",
        group: "inventory",
        visibleInManualInputs: false,
        aliases: ["net realizable value", "nrv", "estimated selling value less costs"],
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

    units: {
        label: "Units",
        placeholder: "6000",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["units", "quantity", "number of units"],
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

    interestIncome: {
        label: "Interest Income",
        placeholder: "350",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["interest income", "interest earned", "bank interest"],
    },

    notesCollectedByBank: {
        label: "Notes Collected by Bank",
        placeholder: "5000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
        "notes collected by bank",
        "note collected by bank",
        "collection by bank",
        "bank collection",
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
    fundAmount: {
        label: "Petty Cash Fund",
        placeholder: "5000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["petty cash fund", "imprest fund", "fund amount"],
    },
    cashOnHand: {
        label: "Cash on Hand",
        placeholder: "3200",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["cash on hand", "cash counted", "actual cash"],
    },
    pettyCashVouchers: {
        label: "Petty Cash Vouchers",
        placeholder: "1400",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["petty cash vouchers", "vouchers", "paid vouchers"],
    },
    stampsOnHand: {
        label: "Stamps on Hand",
        placeholder: "200",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["stamps on hand", "unused stamps", "postage on hand"],
    },
    otherReceipts: {
        label: "Other Receipts",
        placeholder: "100",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["other receipts", "other accountable items", "miscellaneous receipts"],
    },
    shortageOrOverage: {
        label: "Shortage or Overage",
        placeholder: "0",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["shortage or overage", "short and over", "cash shortage", "cash overage"],
    },
    beginningPrepaid: {
        label: "Beginning Prepaid",
        placeholder: "25000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["beginning prepaid", "opening prepaid", "prepaid balance at start"],
    },
    endingPrepaid: {
        label: "Ending Prepaid",
        placeholder: "8000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["ending prepaid", "remaining prepaid", "unused prepaid"],
    },
    expenseRecognized: {
        label: "Expense Recognized",
        placeholder: "17000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["expense recognized", "adjustment expense", "expired portion"],
    },
    beginningUnearnedRevenue: {
        label: "Beginning Unearned Revenue",
        placeholder: "18000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["beginning unearned revenue", "opening unearned revenue", "deferred revenue at start"],
    },
    endingUnearnedRevenue: {
        label: "Ending Unearned Revenue",
        placeholder: "7000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["ending unearned revenue", "remaining unearned revenue", "deferred revenue at end"],
    },
    revenueRecognized: {
        label: "Revenue Recognized",
        placeholder: "11000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["revenue recognized", "earned revenue", "revenue earned from unearned"],
    },
    revenueEarned: {
        label: "Revenue Earned",
        placeholder: "24000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["revenue earned", "service revenue earned", "earned this period"],
    },
    cashCollected: {
        label: "Cash Collected",
        placeholder: "9000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["cash collected", "cash received", "collections to date"],
    },
    accruedRevenue: {
        label: "Accrued Revenue",
        placeholder: "15000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["accrued revenue", "revenue earned but not collected", "receivable adjustment"],
    },
    expenseIncurred: {
        label: "Expense Incurred",
        placeholder: "19500",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["expense incurred", "incurred expense", "expense for the period"],
    },
    cashPaid: {
        label: "Cash Paid",
        placeholder: "11000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["cash paid", "cash payment", "paid to date"],
    },
    accruedExpense: {
        label: "Accrued Expense",
        placeholder: "8500",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["accrued expense", "expense incurred but unpaid", "payable adjustment"],
    },
    carryingAmount: {
        label: "Carrying Amount",
        placeholder: "520000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["carrying amount", "book value before impairment", "asset carrying value"],
    },
    fairValueLessCostsToSell: {
        label: "Fair Value Less Costs to Sell",
        placeholder: "430000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["fair value less costs to sell", "fvlcts", "fair value net of disposal costs"],
    },
    valueInUse: {
        label: "Value in Use",
        placeholder: "450000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["value in use", "present value of future cash flows", "discounted use value"],
    },
    impairmentLoss: {
        label: "Impairment Loss",
        placeholder: "70000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["impairment loss", "write-down", "loss on impairment"],
    },
    assetCost: {
        label: "Asset Cost",
        placeholder: "500000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["asset cost", "cost of asset", "historical cost"],
    },
    accumulatedDepreciation: {
        label: "Accumulated Depreciation",
        placeholder: "360000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["accumulated depreciation", "accumulated depreciation at disposal"],
    },
    proceeds: {
        label: "Proceeds",
        placeholder: "155000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["proceeds", "selling price", "cash received on disposal"],
    },
    disposalCosts: {
        label: "Disposal Costs",
        placeholder: "5000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["disposal costs", "costs to sell", "selling costs"],
    },
    gainOrLoss: {
        label: "Gain or Loss",
        placeholder: "10000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["gain or loss", "gain on disposal", "loss on disposal"],
    },
    budgetedSalesUnits: {
        label: "Budgeted Sales Units",
        placeholder: "12000",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["budgeted sales units", "expected sales units", "planned sales units"],
    },
    desiredEndingFinishedGoodsUnits: {
        label: "Desired Ending FG Units",
        placeholder: "1800",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["desired ending finished goods", "ending finished goods units", "target ending fg"],
    },
    beginningFinishedGoodsUnits: {
        label: "Beginning FG Units",
        placeholder: "1500",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["beginning finished goods units", "opening finished goods units", "beginning fg"],
    },
    requiredProductionUnits: {
        label: "Required Production Units",
        placeholder: "12300",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["required production units", "units to produce", "production required"],
    },
    budgetedProductionUnits: {
        label: "Budgeted Production Units",
        placeholder: "12300",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["budgeted production units", "planned production units", "units planned for production"],
    },
    materialsPerFinishedUnit: {
        label: "Materials per Finished Unit",
        placeholder: "2.5",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["materials per finished unit", "materials per unit", "direct materials per unit"],
    },
    desiredEndingMaterialsUnits: {
        label: "Desired Ending Materials Units",
        placeholder: "1200",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["desired ending materials units", "ending materials inventory", "target ending materials"],
    },
    beginningMaterialsUnits: {
        label: "Beginning Materials Units",
        placeholder: "900",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["beginning materials units", "opening materials inventory", "beginning materials"],
    },
    materialCostPerUnit: {
        label: "Material Cost per Unit",
        placeholder: "18",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["material cost per unit", "cost per material unit", "purchase cost per unit"],
    },
    materialsToPurchaseUnits: {
        label: "Materials to Purchase",
        placeholder: "31050",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["materials to purchase", "units to purchase", "purchases units"],
    },
    purchasesCost: {
        label: "Purchases Cost",
        placeholder: "558900",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["purchases cost", "budgeted purchase cost", "direct materials purchases cost"],
    },
    directLaborHoursPerUnit: {
        label: "Direct Labor Hours / Unit",
        placeholder: "1.5",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["direct labor hours per unit", "labor hours per unit", "hours per unit"],
    },
    directLaborRatePerHour: {
        label: "Direct Labor Rate / Hour",
        placeholder: "110",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["direct labor rate per hour", "labor rate per hour", "hourly labor rate", "wage rate"],
    },
    totalDirectLaborHours: {
        label: "Total Direct Labor Hours",
        placeholder: "18450",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["total direct labor hours", "required labor hours", "budgeted labor hours"],
    },
    totalDirectLaborCost: {
        label: "Total Direct Labor Cost",
        placeholder: "2029500",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["total direct labor cost", "direct labor budget", "labor cost budget"],
    },
    variableOverheadRatePerUnit: {
        label: "Variable OH Rate / Unit",
        placeholder: "18",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["variable overhead rate per unit", "variable overhead rate", "variable oh rate"],
    },
    fixedOverheadBudget: {
        label: "Fixed OH Budget",
        placeholder: "220000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["fixed overhead budget", "fixed factory overhead", "budgeted fixed overhead"],
    },
    variableFactoryOverheadBudget: {
        label: "Variable Factory OH Budget",
        placeholder: "221400",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["variable factory overhead budget", "variable overhead budget", "budgeted variable overhead"],
    },
    totalFactoryOverheadBudget: {
        label: "Total Factory OH Budget",
        placeholder: "441400",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["total factory overhead budget", "factory overhead budget", "manufacturing overhead budget"],
    },
    budgetedCostOfGoodsSold: {
        label: "Budgeted Cost of Goods Sold",
        placeholder: "420000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["budgeted cost of goods sold", "budgeted cogs", "planned cost of goods sold"],
    },
    desiredEndingInventoryCost: {
        label: "Desired Ending Inventory",
        placeholder: "86000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["desired ending inventory", "ending inventory target", "target ending inventory"],
    },
    beginningInventoryCost: {
        label: "Beginning Inventory",
        placeholder: "73000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["beginning inventory", "opening inventory"],
    },
    purchasesRequiredCost: {
        label: "Required Purchases",
        placeholder: "433000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["required purchases", "inventory purchases required", "merchandise purchases"],
    },
    budgetedSalesAmount: {
        label: "Budgeted Sales",
        placeholder: "950000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["budgeted sales", "planned sales amount", "sales budget"],
    },
    specialOrderUnits: {
        label: "Special Order Units",
        placeholder: "4000",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["special order units", "units in special order", "special order quantity"],
    },
    specialOrderPricePerUnit: {
        label: "Special Order Price / Unit",
        placeholder: "82",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["special order price", "special order price per unit", "special order selling price"],
    },
    incrementalFixedCosts: {
        label: "Incremental Fixed Costs",
        placeholder: "18000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["incremental fixed costs", "additional fixed costs", "extra fixed costs"],
    },
    incrementalRevenue: {
        label: "Incremental Revenue",
        placeholder: "328000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["incremental revenue", "additional revenue", "extra revenue"],
    },
    incrementalCost: {
        label: "Incremental Cost",
        placeholder: "274000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["incremental cost", "relevant cost", "additional cost"],
    },
    incrementalProfit: {
        label: "Incremental Profit",
        placeholder: "54000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["incremental profit", "incremental income", "extra profit"],
    },
    minimumAcceptablePricePerUnit: {
        label: "Minimum Acceptable Price / Unit",
        placeholder: "68.5",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["minimum acceptable price", "minimum special order price", "break even special order price"],
    },
    unitsNeeded: {
        label: "Units Needed",
        placeholder: "12000",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["units needed", "required units", "units required"],
    },
    variableManufacturingCostPerUnit: {
        label: "Variable Make Cost / Unit",
        placeholder: "38",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["variable manufacturing cost per unit", "variable make cost", "variable production cost"],
    },
    avoidableFixedCosts: {
        label: "Avoidable Fixed Costs",
        placeholder: "90000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["avoidable fixed costs", "avoidable fixed cost", "avoidable overhead"],
    },
    purchasePricePerUnit: {
        label: "Buy Price / Unit",
        placeholder: "44",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["purchase price per unit", "buy price per unit", "outside purchase price"],
    },
    relevantMakeCost: {
        label: "Relevant Make Cost",
        placeholder: "546000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["relevant make cost", "total make cost", "cost to make"],
    },
    relevantBuyCost: {
        label: "Relevant Buy Cost",
        placeholder: "528000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["relevant buy cost", "total buy cost", "cost to buy"],
    },
    costAdvantageAmount: {
        label: "Cost Advantage",
        placeholder: "18000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["cost advantage", "advantage amount", "cost difference"],
    },
    maximumAcceptablePurchasePricePerUnit: {
        label: "Maximum Buy Price / Unit",
        placeholder: "45.5",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["maximum acceptable purchase price", "maximum buy price", "indifference buy price"],
    },
    salesValueAtSplitoffPerUnit: {
        label: "Split-off Sales Value / Unit",
        placeholder: "48",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["sales value at splitoff", "split-off value per unit", "splitoff price"],
    },
    salesValueAfterProcessingPerUnit: {
        label: "Sales Value after Processing / Unit",
        placeholder: "63",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["sales value after processing", "selling price after processing", "final selling price per unit"],
    },
    separableProcessingCostPerUnit: {
        label: "Separable Processing Cost / Unit",
        placeholder: "9",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["separable processing cost", "additional processing cost", "further processing cost per unit"],
    },
    incrementalRevenueFromProcessing: {
        label: "Incremental Revenue from Processing",
        placeholder: "90000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["incremental revenue from processing", "additional revenue from processing", "further processing revenue"],
    },
    incrementalProfitFromProcessing: {
        label: "Incremental Profit from Processing",
        placeholder: "36000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["incremental profit from processing", "profit from further processing", "additional profit from processing"],
    },
    minimumFurtherProcessingPricePerUnit: {
        label: "Minimum After-Processing Price / Unit",
        placeholder: "57",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["minimum after processing price", "minimum further processing price", "break even processed selling price"],
    },
    constrainedResourceUnitsPerProduct: {
        label: "Constraint Units / Product",
        placeholder: "3",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["constraint units per product", "machine hours per unit", "scarce resource units per product"],
    },
    constrainedResourceAvailableUnits: {
        label: "Available Constraint Units",
        placeholder: "18000",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["available constraint units", "available machine hours", "available scarce resource units"],
    },
    contributionMarginPerConstraintUnit: {
        label: "CM per Constraint Unit",
        placeholder: "20",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["contribution margin per constraint unit", "cm per machine hour", "contribution per bottleneck unit"],
    },
    maximumUnitsFromConstraint: {
        label: "Maximum Units from Constraint",
        placeholder: "6000",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["maximum units from constraint", "units supported by bottleneck", "maximum production from constraint"],
    },
    totalContributionMarginAtConstraint: {
        label: "Total CM at Constraint",
        placeholder: "360000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["total contribution margin at constraint", "total contribution from bottleneck", "total cm from product mix"],
    },
    actualResultAmount: {
        label: "Actual Amount",
        placeholder: "528000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["actual amount", "actual result", "actual total"],
    },
    flexibleBudgetAmount: {
        label: "Flexible Budget Amount",
        placeholder: "510000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["flexible budget amount", "flex budget amount", "allowed budget amount"],
    },
    staticBudgetAmount: {
        label: "Static Budget Amount",
        placeholder: "495000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["static budget amount", "planned budget amount", "original budget amount"],
    },
    spendingVariance: {
        label: "Spending Variance",
        placeholder: "18000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["spending variance", "rate variance", "price variance at flexible budget"],
    },
    activityVariance: {
        label: "Activity Variance",
        placeholder: "15000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["activity variance", "volume variance", "activity-level variance"],
    },
    totalBudgetVariance: {
        label: "Total Budget Variance",
        placeholder: "33000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["total budget variance", "total variance", "overall budget variance"],
    },
    taxableSalesAmount: {
        label: "Taxable Sales",
        placeholder: "850000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["taxable sales", "vatable sales amount", "sales subject to vat", "vatable sales"],
    },
    vatablePurchasesAmount: {
        label: "Vatable Purchases",
        placeholder: "420000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["vatable purchases", "taxable purchases", "purchases subject to vat", "input vat base"],
    },
    vatRatePercent: {
        label: "VAT Rate (%)",
        placeholder: "12",
        kind: "percent",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["vat rate", "value added tax rate", "vat percentage", "vat percent"],
    },
    netVatPayable: {
        label: "Net VAT Payable",
        placeholder: "51600",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["net vat payable", "vat payable", "net vat due", "vat remittance"],
    },
    variableExpenseRatePercent: {
        label: "Variable Expense Rate (%)",
        placeholder: "6.5",
        kind: "percent",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["variable expense rate", "variable operating expense rate", "selling expense rate"],
    },
    fixedOperatingExpenses: {
        label: "Fixed Operating Expenses",
        placeholder: "145000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["fixed operating expenses", "fixed selling expenses", "fixed administrative expenses"],
    },
    nonCashOperatingExpenses: {
        label: "Non-cash Operating Expenses",
        placeholder: "18000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["non-cash operating expenses", "depreciation expense", "noncash expenses"],
    },
    totalOperatingExpenses: {
        label: "Total Operating Expenses",
        placeholder: "206750",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["total operating expenses", "total selling and administrative expenses", "total opex"],
    },
    cashOperatingExpenses: {
        label: "Cash Operating Expenses",
        placeholder: "188750",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["cash operating expenses", "cash selling and administrative expenses", "cash opex"],
    },
    grossProfit: {
        label: "Gross Profit",
        placeholder: "540000",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["gross profit", "gross margin amount"],
    },
    incomeBeforeTax: {
        label: "Income Before Tax",
        placeholder: "305250",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["income before tax", "pretax income", "profit before tax"],
    },
    dividendsDeclared: {
        label: "Dividends Declared",
        placeholder: "90000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["dividends declared", "investee dividends", "dividends declared by investee"],
    },
    investorShareInIncome: {
        label: "Investor Share in Income",
        placeholder: "126000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["share in income", "investor share in income", "equity in investee income"],
    },
    dividendsReceived: {
        label: "Dividends Received",
        placeholder: "27000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["dividends received", "share of dividends", "cash dividends received"],
    },
    endingInvestmentBalance: {
        label: "Ending Investment Balance",
        placeholder: "1899000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["ending investment balance", "ending carrying amount", "investment carrying amount"],
    },
    maturityValue: {
        label: "Maturity Value",
        placeholder: "262500",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["maturity value", "note maturity value"],
    },
    bankDiscountAmount: {
        label: "Bank Discount",
        placeholder: "15750",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["bank discount", "discount on note", "discount amount"],
    },
    proceedsFromDiscounting: {
        label: "Discounting Proceeds",
        placeholder: "246750",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["proceeds from discounting", "discounting proceeds", "cash proceeds from note"],
    },
    transferPrice: {
        label: "Transfer Price",
        placeholder: "240000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["transfer price", "intercompany transfer price", "intra-group selling price"],
    },
    markupRateOnCostPercent: {
        label: "Markup on Cost (%)",
        placeholder: "25",
        kind: "percent",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["markup on cost", "markup rate on cost", "gross profit on cost"],
    },
    percentUnsoldAtPeriodEnd: {
        label: "Unsold at Period-End (%)",
        placeholder: "40",
        kind: "percent",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["percent unsold", "unsold at period end", "remaining in ending inventory", "ending inventory unsold percent"],
    },
    unrealizedProfitInEndingInventory: {
        label: "Unrealized Profit",
        placeholder: "19200",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["unrealized profit", "unrealized profit in ending inventory", "inventory profit elimination"],
    },
    annualExcessDepreciation: {
        label: "Annual Excess Depreciation",
        placeholder: "12000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["annual excess depreciation", "excess depreciation", "depreciation adjustment per year"],
    },
    unamortizedIntercompanyProfit: {
        label: "Unamortized Intercompany Profit",
        placeholder: "48000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["unamortized intercompany profit", "remaining unrealized gain", "remaining intercompany profit"],
    },
    taxBase: {
        label: "Tax Base",
        placeholder: "85000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["tax base", "amount subject to withholding", "gross amount"],
    },
    ratePercent: {
        label: "Rate (%)",
        placeholder: "10",
        kind: "percent",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["withholding rate", "rate percent", "ewt rate", "tax rate"],
    },
    taxWithheld: {
        label: "Tax Withheld",
        placeholder: "8500",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["tax withheld", "withholding tax", "amount withheld"],
    },
    period1Demand: {
        label: "Oldest Period Demand",
        placeholder: "920",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["period 1 demand", "oldest demand", "first period demand"],
    },
    period2Demand: {
        label: "Middle Period Demand",
        placeholder: "980",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["period 2 demand", "middle demand", "second period demand"],
    },
    period3Demand: {
        label: "Latest Period Demand",
        placeholder: "1040",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["period 3 demand", "latest demand", "most recent demand"],
    },
    weight1Percent: {
        label: "Oldest Weight (%)",
        placeholder: "20",
        kind: "percent",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["weight 1", "oldest weight", "first weight percent"],
    },
    weight2Percent: {
        label: "Middle Weight (%)",
        placeholder: "30",
        kind: "percent",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["weight 2", "middle weight", "second weight percent"],
    },
    weight3Percent: {
        label: "Latest Weight (%)",
        placeholder: "50",
        kind: "percent",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["weight 3", "latest weight", "third weight percent"],
    },
    simpleMovingAverageForecast: {
        label: "Simple Moving Average Forecast",
        placeholder: "980",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["simple moving average forecast", "simple moving average", "sma forecast"],
    },
    weightedMovingAverageForecast: {
        label: "Weighted Moving Average Forecast",
        placeholder: "1004",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["weighted moving average forecast", "weighted forecast", "wma forecast"],
    },
    actualUnitsSold: {
        label: "Actual Units Sold",
        placeholder: "9200",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["actual units sold", "actual sales units", "actual quantity sold"],
    },
    budgetedUnitsSold: {
        label: "Budgeted Units Sold",
        placeholder: "10000",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["budgeted units sold", "planned sales units", "budgeted quantity sold"],
    },
    budgetedContributionMarginPerUnit: {
        label: "Budgeted CM / Unit",
        placeholder: "18",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: [
            "budgeted contribution margin per unit",
            "budgeted cm per unit",
            "standard contribution margin per unit",
        ],
    },
    salesVolumeVariance: {
        label: "Sales Volume Variance",
        placeholder: "-14400",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["sales volume variance", "sales quantity variance", "volume variance"],
    },
    actualTotalUnitsSold: {
        label: "Actual Total Units Sold",
        placeholder: "10000",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["actual total units sold", "total actual units sold", "actual total sales units"],
    },
    actualProductUnitsSold: {
        label: "Actual Product Units Sold",
        placeholder: "4200",
        kind: "number",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["actual product units sold", "actual units of product", "actual units sold for product"],
    },
    budgetedMixPercent: {
        label: "Budgeted Mix (%)",
        placeholder: "40",
        kind: "percent",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["budgeted mix percent", "planned sales mix", "budgeted product mix"],
    },
    actualMixPercent: {
        label: "Actual Mix (%)",
        placeholder: "42",
        kind: "percent",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["actual mix percent", "actual sales mix", "actual product mix"],
    },
    salesMixVariance: {
        label: "Sales Mix Variance",
        placeholder: "3600",
        kind: "money",
        group: "business",
        visibleInManualInputs: false,
        aliases: ["sales mix variance", "mix variance", "sales mix effect"],
    },
    averageDailyUsage: {
        label: "Average Daily Usage",
        placeholder: "35",
        kind: "number",
        group: "inventory",
        visibleInManualInputs: false,
        aliases: ["average daily usage", "average daily demand", "average usage per day"],
    },
    maxDailyUsage: {
        label: "Maximum Daily Usage",
        placeholder: "48",
        kind: "number",
        group: "inventory",
        visibleInManualInputs: false,
        aliases: ["maximum daily usage", "maximum daily demand", "peak daily usage"],
    },
    averageLeadTimeDays: {
        label: "Average Lead Time (days)",
        placeholder: "6",
        kind: "time",
        group: "inventory",
        visibleInManualInputs: false,
        aliases: ["average lead time", "average lead time days", "normal lead time"],
    },
    maxLeadTimeDays: {
        label: "Maximum Lead Time (days)",
        placeholder: "8",
        kind: "time",
        group: "inventory",
        visibleInManualInputs: false,
        aliases: ["maximum lead time", "maximum lead time days", "worst case lead time"],
    },
    safetyStock: {
        label: "Safety Stock",
        placeholder: "174",
        kind: "number",
        group: "inventory",
        visibleInManualInputs: false,
        aliases: ["safety stock", "buffer stock", "reserve inventory"],
    },
    reorderPoint: {
        label: "Reorder Point",
        placeholder: "384",
        kind: "number",
        group: "inventory",
        visibleInManualInputs: false,
        aliases: ["reorder point", "reorder level", "when to reorder"],
    },
    grossEstate: {
        label: "Gross Estate",
        placeholder: "8500000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["gross estate", "estate gross value", "decedent gross estate"],
    },
    allowableDeductions: {
        label: "Allowable Deductions",
        placeholder: "1500000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["allowable deductions", "estate deductions", "deductible estate items"],
    },
    taxRatePercent: {
        label: "Tax Rate (%)",
        placeholder: "6",
        kind: "percent",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["tax rate", "estate tax rate", "donor tax rate", "rate percent"],
    },
    netEstate: {
        label: "Net Estate",
        placeholder: "7000000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["net estate", "taxable estate", "estate after deductions"],
    },
    estateTaxDue: {
        label: "Estate Tax Due",
        placeholder: "420000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["estate tax due", "estate tax payable", "estate tax"],
    },
    grossGift: {
        label: "Gross Gift",
        placeholder: "1500000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["gross gift", "gift amount", "property donated"],
    },
    taxableGift: {
        label: "Taxable Gift",
        placeholder: "1250000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["taxable gift", "gift net of exemption", "net gift"],
    },
    donorsTaxDue: {
        label: "Donor's Tax Due",
        placeholder: "75000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["donors tax due", "donor's tax due", "gift tax due"],
    },
    taxableBaseAmount: {
        label: "Taxable Base Amount",
        placeholder: "250000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["taxable base amount", "documentary stamp base", "tax base amount"],
    },
    taxableUnitSize: {
        label: "Taxable Unit Size",
        placeholder: "200",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["taxable unit size", "tax unit size", "dst unit size"],
    },
    ratePerUnit: {
        label: "Rate / Unit",
        placeholder: "1.5",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["rate per unit", "dst rate per unit", "tax per unit"],
    },
    taxableUnits: {
        label: "Taxable Units",
        placeholder: "1250",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["taxable units", "number of taxable units", "stamp tax units"],
    },
    documentaryStampTaxDue: {
        label: "Documentary Stamp Tax Due",
        placeholder: "1875",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["documentary stamp tax due", "dst due", "documentary stamp tax"],
    },
    commissionRatePercent: {
        label: "Commission Rate (%)",
        placeholder: "10",
        kind: "percent",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["commission rate", "consignee commission rate", "commission percent"],
    },
    freightAndOtherExpenses: {
        label: "Freight and Other Expenses",
        placeholder: "15000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["freight and other expenses", "consignee expenses", "freight charges and expenses"],
    },
    advancesRemitted: {
        label: "Advances Remitted",
        placeholder: "50000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["advances remitted", "cash advances from consignee", "advance remittance"],
    },
    commissionAmount: {
        label: "Commission Amount",
        placeholder: "25000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["commission amount", "consignee commission", "commission earned"],
    },
    cashStillDueToConsignor: {
        label: "Cash Still Due to Consignor",
        placeholder: "160000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["cash still due to consignor", "balance due consignor", "cash due to consignor"],
    },
    billedPriceInventory: {
        label: "Billed Price Inventory",
        placeholder: "480000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["billed price inventory", "branch inventory at billed price", "inventory at invoice price"],
    },
    loadingPercentOnCost: {
        label: "Loading on Cost (%)",
        placeholder: "25",
        kind: "percent",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["loading percent on cost", "markup on cost", "loading on cost"],
    },
    loadingRateOnBilledPrice: {
        label: "Loading Rate on Billed Price (%)",
        placeholder: "20",
        kind: "percent",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["loading rate on billed price", "loading rate on invoice price", "loading percent on billed price"],
    },
    inventoryLoadingAllowance: {
        label: "Inventory Loading Allowance",
        placeholder: "96000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["inventory loading allowance", "allowance for loading", "branch loading allowance"],
    },
    inventoryAtCost: {
        label: "Inventory at Cost",
        placeholder: "384000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["inventory at cost", "branch inventory at cost", "inventory net of loading"],
    },
    totalDividendsDeclared: {
        label: "Total Dividends Declared",
        placeholder: "500000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["total dividends declared", "dividends declared", "cash dividends declared"],
    },
    preferredShares: {
        label: "Preferred Shares",
        placeholder: "10000",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["preferred shares", "preferred shares outstanding", "preferred stock shares"],
    },
    preferredParValue: {
        label: "Preferred Par Value",
        placeholder: "100",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["preferred par value", "par value per preferred share", "preferred stock par"],
    },
    preferredDividendRatePercent: {
        label: "Preferred Dividend Rate (%)",
        placeholder: "8",
        kind: "percent",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["preferred dividend rate", "preferred rate percent", "dividend rate on preferred shares"],
    },
    yearsInArrears: {
        label: "Years in Arrears",
        placeholder: "2",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["years in arrears", "dividend arrears years", "unpaid preferred dividend years"],
    },
    commonSharesOutstanding: {
        label: "Common Shares Outstanding",
        placeholder: "50000",
        kind: "number",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["common shares outstanding", "common shares", "ordinary shares outstanding"],
    },
    preferredDividendAllocated: {
        label: "Preferred Dividend Allocated",
        placeholder: "240000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["preferred dividend allocated", "preferred dividend distribution", "allocation to preferred"],
    },
    commonDividendAllocated: {
        label: "Common Dividend Allocated",
        placeholder: "260000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["common dividend allocated", "common dividend distribution", "allocation to common"],
    },
    commonDividendPerShare: {
        label: "Common Dividend / Share",
        placeholder: "5.2",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: ["common dividend per share", "dividend per common share", "common dps"],
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

    totalPartnershipCapital: {
        label: "Total Partnership Capital",
        placeholder: "500000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "total partnership capital",
            "partnership capital before retirement",
            "capital before retirement",
        ],
    },

    retiringPartnerCapital: {
        label: "Retiring Partner Capital",
        placeholder: "120000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "retiring partner capital",
            "capital of retiring partner",
            "withdrawn partner capital",
        ],
    },

    settlementPaid: {
        label: "Settlement Paid",
        placeholder: "130000",
        kind: "money",
        group: "accounting",
        visibleInManualInputs: false,
        aliases: [
            "settlement paid",
            "payment to retiring partner",
            "amount paid to retiring partner",
            "retirement settlement",
        ],
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
        id: "net-present-value",
        name: "Net Present Value",
        route: "/finance/npv",
        description:
        "Best when the user wants discounted cash-flow analysis using an initial investment, a discount rate, and period cash flows.",
        required: ["initialInvestment", "discountRate"],
        aliases: ["npv", "discounted cash flow", "capital budgeting"],
        keywords: [
        /\bnpv\b/i,
        /net present value/i,
        /discounted cash flow/i,
        /initial investment/i,
        /required return/i,
        /hurdle rate/i,
        ],
    },
    {
        id: "capital-budgeting-comparison",
        name: "Capital Budgeting Comparison",
        route: "/finance/capital-budgeting-comparison",
        description:
        "Best when the user wants NPV, PI, IRR, and discounted payback reviewed together from one project.",
        required: ["initialInvestment", "discountRate"],
        aliases: ["capital budgeting comparison", "project comparison", "capital budgeting dashboard"],
        keywords: [
        /capital budgeting comparison/i,
        /project comparison/i,
        /compare npv/i,
        /compare irr/i,
        /profitability index/i,
        /discounted payback/i,
        ],
    },
    {
        id: "internal-rate-of-return",
        name: "Internal Rate of Return",
        route: "/finance/internal-rate-of-return",
        description:
        "Best when the user asks for IRR or the break-even rate of return for a project cash-flow stream.",
        required: ["initialInvestment"],
        aliases: ["irr", "internal rate", "project irr"],
        keywords: [
        /\birr\b/i,
        /internal rate of return/i,
        /internal rate/i,
        /project rate of return/i,
        /discount rate that makes npv zero/i,
        ],
    },
    {
        id: "profitability-index",
        name: "Profitability Index",
        route: "/finance/profitability-index",
        description:
        "Best when the user wants discounted inflows per peso invested or benefit-cost style screening under capital budgeting assumptions.",
        required: ["initialInvestment", "discountRate"],
        aliases: ["profitability index", "benefit cost ratio", "pi"],
        keywords: [
        /profitability index/i,
        /benefit cost ratio/i,
        /\bpi\b/i,
        /discounted inflows per peso/i,
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
        aliases: [
        "required profit",
        "desired profit",
        "sales for target profit",
        "required units for target profit",
        "required sales for target profit",
        ],
        keywords: [
        /target profit/i,
        /desired profit/i,
        /required profit/i,
        /required sales/i,
        /required units/i,
        /sales needed for target profit/i,
        /units needed for target profit/i,
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
        id: "sales-mix-break-even",
        name: "Sales Mix Break-even",
        route: "/business/sales-mix-break-even",
        description:
        "Best when the user is working on multi-product CVP, composite units, target-profit planning, or sales-mix break-even analysis.",
        required: [],
        aliases: [
        "sales mix break even",
        "multi product break even",
        "composite unit break even",
        "weighted contribution margin",
        "product mix analysis",
        ],
        keywords: [
        /sales mix/i,
        /multi[- ]product/i,
        /composite unit/i,
        /weighted contribution/i,
        /mix break[- ]even/i,
        /product mix/i,
        ],
    },
    {
        id: "cvp-analysis",
        name: "CVP Analysis",
        route: "/business/cvp-analysis",
        description:
        "Best when the user wants a broader CVP read that combines contribution margin, break-even, target profit, margin of safety, operating leverage, and sensitivity cues in one page.",
        required: [],
        optional: [
            "fixedCosts",
            "sellingPricePerUnit",
            "variableCostPerUnit",
            "targetProfit",
            "actualUnits",
        ],
        aliases: [
        "cost volume profit analysis",
        "cvp analysis",
        "cvp dashboard",
        "managerial cvp",
        ],
        keywords: [
        /\bcvp\b/i,
        /cost[- ]volume[- ]profit/i,
        /contribution margin/i,
        /break[- ]even/i,
        /target profit/i,
        /margin of safety/i,
        /operating leverage/i,
        ],
    },
    {
        id: "cash-collections-schedule",
        name: "Cash Collections Schedule",
        route: "/business/cash-collections-schedule",
        description:
        "Best when the user is laying out cash receipts from current and lagged collection percentages by month or period.",
        required: [],
        aliases: [
        "schedule of cash collections",
        "cash receipts schedule",
        "collections schedule",
        "receivables collection schedule",
        "collections lag schedule",
        "receipts timing schedule",
        ],
        keywords: [
        /cash collections schedule/i,
        /schedule of cash collections/i,
        /cash receipts schedule/i,
        /collections schedule/i,
        /collection pattern/i,
        /receivables collection/i,
        /collections lag/i,
        ],
    },
    {
        id: "cash-disbursements-schedule",
        name: "Cash Disbursements Schedule",
        route: "/business/cash-disbursements-schedule",
        description:
        "Best when the user is laying out cash payments from current and lagged payment percentages by month or period.",
        required: [],
        aliases: ["schedule of cash disbursements", "cash payments schedule", "disbursements schedule", "purchases payment schedule", "accounts payable schedule"],
        keywords: [
        /cash disbursements schedule/i,
        /schedule of cash disbursements/i,
        /cash payments schedule/i,
        /disbursements schedule/i,
        /payment pattern/i,
        ],
    },
    {
        id: "cash-budget",
        name: "Cash Budget",
        route: "/business/cash-budget",
        description:
        "Best when the user is planning cash receipts, cash payments, minimum cash, or financing need for a budget period.",
        required: [
        "beginningCashBalance",
        "cashCollections",
        "cashDisbursements",
        "minimumCashBalance",
        ],
        aliases: ["cash budget", "cash planning", "cash receipts and disbursements budget", "cash budget with financing", "minimum cash budget"],
        keywords: [
        /cash budget/i,
        /cash planning/i,
        /cash receipts/i,
        /cash disbursements/i,
        /minimum cash/i,
        /financing needed/i,
        /ending cash balance/i,
        /borrow to maintain minimum cash/i,
        ],
    },
    {
        id: "production-budget",
        name: "Production Budget",
        route: "/business/production-budget",
        description:
        "Best when the user is converting budgeted sales and finished-goods policy into required production units.",
        required: [
        "budgetedSalesUnits",
        "desiredEndingFinishedGoodsUnits",
        "beginningFinishedGoodsUnits",
        ],
        optional: ["requiredProductionUnits"],
        aliases: ["schedule of production", "production planning budget", "finished goods budget"],
        keywords: [
        /production budget/i,
        /required production/i,
        /units to produce/i,
        /desired ending finished goods/i,
        /budgeted sales units/i,
        ],
    },
    {
        id: "direct-materials-purchases-budget",
        name: "Direct Materials Purchases Budget",
        route: "/business/direct-materials-purchases-budget",
        description:
        "Best when the user wants materials required, materials to purchase, or budgeted purchases cost from a production plan.",
        required: [
        "budgetedProductionUnits",
        "materialsPerFinishedUnit",
        "desiredEndingMaterialsUnits",
        "beginningMaterialsUnits",
        "materialCostPerUnit",
        ],
        optional: ["materialsToPurchaseUnits", "purchasesCost"],
        aliases: ["materials purchases budget", "direct materials budget", "materials purchase schedule"],
        keywords: [
        /direct materials purchases budget/i,
        /materials to purchase/i,
        /materials required/i,
        /materials per unit/i,
        /desired ending materials/i,
        /purchase cost/i,
        ],
    },
    {
        id: "direct-labor-budget",
        name: "Direct Labor Budget",
        route: "/business/direct-labor-budget",
        description:
        "Best when the user needs required labor hours or total labor cost from planned production volume and wage assumptions.",
        required: ["budgetedProductionUnits", "directLaborHoursPerUnit", "directLaborRatePerHour"],
        optional: ["totalDirectLaborHours", "totalDirectLaborCost"],
        aliases: ["direct labor budget", "labor budget", "direct labor schedule"],
        keywords: [/direct labor budget/i, /labor budget/i, /labor hours per unit/i, /hourly labor rate/i, /required labor hours/i],
    },
    {
        id: "factory-overhead-budget",
        name: "Factory Overhead Budget",
        route: "/business/factory-overhead-budget",
        description:
        "Best when the user needs a manufacturing-overhead budget split into variable and fixed components.",
        required: ["budgetedProductionUnits", "variableOverheadRatePerUnit", "fixedOverheadBudget"],
        optional: ["variableFactoryOverheadBudget", "totalFactoryOverheadBudget"],
        aliases: ["factory overhead budget", "manufacturing overhead budget", "overhead budget"],
        keywords: [/factory overhead budget/i, /manufacturing overhead budget/i, /variable overhead budget/i, /fixed overhead budget/i],
    },
    {
        id: "inventory-budget",
        name: "Inventory Budget",
        route: "/business/inventory-budget",
        description:
        "Best when the user needs merchandise purchases from budgeted cost of goods sold plus ending-inventory policy.",
        required: [
        "budgetedCostOfGoodsSold",
        "desiredEndingInventoryCost",
        "beginningInventoryCost",
        ],
        optional: ["purchasesRequiredCost"],
        aliases: ["merchandise purchases budget", "inventory purchases budget", "ending inventory policy"],
        keywords: [
        /inventory budget/i,
        /merchandise purchases/i,
        /budgeted cogs/i,
        /desired ending inventory/i,
        /required purchases/i,
        ],
    },
    {
        id: "sales-budget",
        name: "Sales Budget",
        route: "/business/sales-budget",
        description:
        "Best when the user needs budgeted sales revenue, planned unit sales, or implied selling price from a sales-budget setup.",
        required: ["budgetedSalesUnits", "sellingPricePerUnit"],
        optional: ["budgetedSalesAmount"],
        aliases: ["sales budget", "budgeted sales revenue", "master budget sales"],
        keywords: [
        /sales budget/i,
        /budgeted sales/i,
        /sales revenue budget/i,
        /planned selling price/i,
        /budgeted unit sales/i,
        ],
    },
    {
        id: "operating-expense-budget",
        name: "Operating Expense Budget",
        route: "/business/operating-expense-budget",
        description:
        "Best when the user needs total or cash operating expenses from budgeted sales, variable-rate expenses, and fixed costs.",
        required: [
        "budgetedSalesAmount",
        "variableExpenseRatePercent",
        "fixedOperatingExpenses",
        ],
        optional: ["nonCashOperatingExpenses", "totalOperatingExpenses", "cashOperatingExpenses"],
        aliases: ["selling and administrative budget", "operating expenses budget", "cash operating expenses"],
        keywords: [
        /operating expense budget/i,
        /selling and administrative budget/i,
        /variable expense rate/i,
        /cash operating expenses/i,
        /operating expenses/i,
        ],
    },
    {
        id: "budgeted-income-statement",
        name: "Budgeted Income Statement",
        route: "/business/budgeted-income-statement",
        description:
        "Best when the user wants a pro forma income statement from budgeted sales, COGS, operating expenses, interest, and tax.",
        required: ["budgetedSalesAmount", "budgetedCostOfGoodsSold", "totalOperatingExpenses"],
        optional: ["interestExpense", "ratePercent", "grossProfit", "incomeBeforeTax", "netIncome"],
        aliases: ["budgeted income statement", "pro forma income statement", "budget income statement"],
        keywords: [/budgeted income statement/i, /pro forma income statement/i, /budgeted net income/i, /profit before tax/i],
    },
    {
        id: "special-order-analysis",
        name: "Special Order Decision",
        route: "/business/special-order-analysis",
        description:
        "Best when the user wants incremental profit or a break-even price for a one-time special order.",
        required: ["specialOrderUnits", "specialOrderPricePerUnit", "variableCostPerUnit"],
        optional: ["incrementalFixedCosts", "incrementalRevenue", "incrementalCost", "incrementalProfit", "minimumAcceptablePricePerUnit"],
        aliases: ["special order", "special order decision", "incremental order analysis"],
        keywords: [/special order/i, /incremental profit/i, /special order price/i, /relevant cost/i],
    },
    {
        id: "make-or-buy-analysis",
        name: "Make or Buy Decision",
        route: "/business/make-or-buy-analysis",
        description:
        "Best when the user wants relevant make cost, relevant buy cost, or the indifference purchase price.",
        required: ["unitsNeeded", "variableManufacturingCostPerUnit", "purchasePricePerUnit"],
        optional: ["avoidableFixedCosts", "relevantMakeCost", "relevantBuyCost", "costAdvantageAmount", "maximumAcceptablePurchasePricePerUnit"],
        aliases: ["make or buy", "outsourcing decision", "buy versus make"],
        keywords: [/make or buy/i, /outsourcing decision/i, /purchase price/i, /avoidable fixed cost/i],
    },
    {
        id: "sell-or-process-further",
        name: "Sell or Process Further",
        route: "/business/sell-or-process-further",
        description:
        "Best when the user compares split-off value against additional processing revenue and separable cost.",
        required: ["units", "salesValueAtSplitoffPerUnit", "salesValueAfterProcessingPerUnit", "separableProcessingCostPerUnit"],
        optional: ["incrementalRevenueFromProcessing", "incrementalProfitFromProcessing", "minimumFurtherProcessingPricePerUnit"],
        aliases: ["sell or process further", "split off decision", "joint product decision"],
        keywords: [/sell or process further/i, /split[- ]off/i, /separable processing cost/i, /joint product/i],
    },
    {
        id: "constrained-resource-product-mix",
        name: "Constrained Resource Product Mix",
        route: "/business/constrained-resource-product-mix",
        description:
        "Best when the user ranks a product by contribution margin per scarce-resource unit.",
        required: ["sellingPricePerUnit", "variableCostPerUnit", "constrainedResourceUnitsPerProduct", "constrainedResourceAvailableUnits"],
        optional: ["contributionMarginPerConstraintUnit", "maximumUnitsFromConstraint", "totalContributionMarginAtConstraint"],
        aliases: ["product mix", "bottleneck product mix", "constraint analysis"],
        keywords: [/product mix/i, /bottleneck/i, /constraint/i, /machine hours per unit/i],
    },
    {
        id: "transfer-pricing-support",
        name: "Transfer Pricing Support",
        route: "/business/transfer-pricing-support",
        description:
        "Best when the user needs a minimum transfer price, an outside-market ceiling, or a negotiation range for divisional transfer pricing.",
        required: ["variableCostPerUnit"],
        optional: [
            "opportunityCostPerUnit",
            "externalMarketPricePerUnit",
            "minimumTransferPrice",
            "marketBasedCeiling",
            "transferPricingRangeWidth",
        ],
        aliases: ["transfer pricing", "minimum transfer price", "divisional transfer price"],
        keywords: [/transfer pricing/i, /minimum transfer price/i, /opportunity cost/i, /external market price/i],
    },
    {
        id: "budget-variance-analysis",
        name: "Budget Variance Analysis",
        route: "/business/budget-variance-analysis",
        description:
        "Best when the user wants spending variance, activity variance, or the total budget gap.",
        required: ["actualResultAmount", "flexibleBudgetAmount", "staticBudgetAmount"],
        optional: ["spendingVariance", "activityVariance", "totalBudgetVariance"],
        aliases: ["budget variance", "spending variance", "activity variance", "performance report"],
        keywords: [/budget variance/i, /spending variance/i, /activity variance/i, /performance report/i],
    },
    {
        id: "sales-volume-variance",
        name: "Sales Volume Variance",
        route: "/business/sales-volume-variance",
        description:
        "Best when the user compares actual sales volume with budgeted sales volume using a budgeted contribution margin per unit.",
        required: ["actualUnitsSold", "budgetedUnitsSold", "budgetedContributionMarginPerUnit"],
        optional: ["salesVolumeVariance"],
        aliases: ["sales volume variance", "sales quantity variance", "sales volume effect"],
        keywords: [/sales volume variance/i, /sales quantity variance/i, /budgeted contribution margin/i],
    },
    {
        id: "sales-mix-variance",
        name: "Sales Mix Variance",
        route: "/business/sales-mix-variance",
        description:
        "Best when the user needs the effect of actual product mix versus budgeted sales mix.",
        required: ["actualTotalUnitsSold", "actualProductUnitsSold", "budgetedMixPercent", "budgetedContributionMarginPerUnit"],
        optional: ["actualMixPercent", "salesMixVariance"],
        aliases: ["sales mix variance", "mix variance", "sales mix effect"],
        keywords: [/sales mix variance/i, /sales mix/i, /budgeted mix/i, /actual mix/i],
    },
    {
        id: "flexible-budget",
        name: "Flexible Budget",
        route: "/business/flexible-budget",
        description:
        "Best when the user wants a flexible budget, activity variance, or spending variance from budgeted versus actual output.",
        required: ["budgetedUnits", "actualUnits", "fixedCosts", "variableCostPerUnit", "actualCost"],
        aliases: ["static versus flexible budget", "activity variance", "spending variance"],
        keywords: [
        /flexible budget/i,
        /static budget/i,
        /activity variance/i,
        /spending variance/i,
        /budget variance/i,
        ],
    },

    {
        id: "capacity-utilization",
        name: "Capacity Utilization",
        route: "/business/capacity-utilization",
        description:
        "Best when the user compares actual output with practical or available capacity and wants idle-capacity interpretation.",
        required: ["actualUnits", "budgetedUnits"],
        aliases: [
        "capacity utilization",
        "capacity usage",
        "practical capacity",
        "idle capacity",
        "capacity planning",
        ],
        keywords: [
        /capacity utilization/i,
        /capacity usage/i,
        /practical capacity/i,
        /idle capacity/i,
        /available capacity/i,
        /capacity planning/i,
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
        id: "weighted-mean",
        name: "Weighted Mean",
        route: "/business-math/weighted-mean",
        description:
        "Best when the user needs a weighted average from values with different frequencies, shares, or importance.",
        required: [],
        aliases: [
        "weighted mean",
        "weighted average",
        "weighted score",
        "weighted grade",
        ],
        keywords: [
        /weighted mean/i,
        /weighted average/i,
        /weighted score/i,
        /weighted grade/i,
        /weights/i,
        ],
    },

    {
        id: "standard-deviation",
        name: "Standard Deviation",
        route: "/statistics/standard-deviation",
        description:
        "Best when the user asks for variance, standard deviation, dispersion, or spread of a numeric dataset.",
        required: [],
        aliases: ["standard deviation", "variance", "dispersion", "spread of data"],
        keywords: [
        /standard deviation/i,
        /\bvariance\b/i,
        /dispersion/i,
        /spread of data/i,
        /dataset spread/i,
        ],
    },

    {
        id: "coefficient-of-variation",
        name: "Coefficient of Variation",
        route: "/statistics/coefficient-of-variation",
        description:
        "Best when the user wants relative variability or a spread comparison across datasets with different means.",
        required: [],
        aliases: [
        "coefficient of variation",
        "relative variation",
        "relative variability",
        "cv statistics",
        ],
        keywords: [
        /coefficient of variation/i,
        /relative variability/i,
        /relative variation/i,
        /\bcv\b/i,
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
        id: "notes-receivable-discounting",
        name: "Notes Receivable Discounting",
        route: "/accounting/notes-receivable-discounting",
        description:
        "Best when the user needs maturity value, bank discount, or proceeds from discounting a note before maturity.",
        required: ["faceValue", "statedRate", "marketRate", "time"],
        optional: ["maturityValue", "bankDiscountAmount", "proceedsFromDiscounting"],
        aliases: ["discounting of note receivable", "discounted note", "bank discount on note"],
        keywords: [
        /discounted note/i,
        /discounting of note/i,
        /bank discount/i,
        /proceeds from discounting/i,
        ],
    },
    {
        id: "bond-amortization-schedule",
        name: "Bond Amortization Schedule",
        route: "/accounting/bond-amortization-schedule",
        description:
        "Best when the user is working on bond premium or discount amortization with stated and market rates.",
        required: ["faceValue", "statedRate", "marketRate", "years"],
        aliases: ["bond amortization", "effective interest bond", "bond premium schedule", "bond discount schedule"],
        keywords: [
        /bond amortization/i,
        /effective interest/i,
        /bond premium/i,
        /bond discount/i,
        /coupon rate/i,
        /market rate/i,
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
        id: "lower-of-cost-or-nrv",
        name: "Lower of Cost or NRV",
        route: "/accounting/lower-of-cost-or-nrv",
        description:
        "Best when the user mentions lower of cost and NRV, inventory write-down, or inventory valuation below cost.",
        required: ["inventoryCost", "netRealizableValue"],
        aliases: ["lower of cost or nrv", "inventory write-down", "lower of cost and net realizable value"],
        keywords: [
        /lower of cost/i,
        /net realizable value/i,
        /\bnrv\b/i,
        /inventory write[- ]down/i,
        /inventory valuation/i,
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
        "Reconcile bank and book balances using deposits in transit, outstanding checks, bank charges, NSF checks, interest income, collections by bank, and errors.",
        required: ["bankBalance", "bookBalance"],
        aliases: [
        "balance per bank and balance per books",
        "adjusted cash balance",
        "reconciling items",
        ],
        keywords: [
        /bank reconciliation/i,
        /reconcile bank/i,
        /reconcile books/i,
        /deposits in transit/i,
        /outstanding checks?/i,
        /service charges?/i,
        /bank charges?/i,
        /\bnsf\b/i,
        /interest income/i,
        /notes? collected by bank/i,
        /dishonored checks?/i,
        /balance per bank/i,
        /balance per books/i,
        /adjusted cash balance/i,
        /reconciling items?/i,
        /balance per books/i,
        ],
    },
    {
        id: "petty-cash-reconciliation",
        name: "Petty Cash Reconciliation",
        route: "/accounting/petty-cash-reconciliation",
        description:
        "Best when the user is proving a petty cash fund using cash on hand, vouchers, stamps, and a short-or-over check.",
        required: ["fundAmount", "cashOnHand", "pettyCashVouchers"],
        optional: ["stampsOnHand", "otherReceipts", "shortageOrOverage"],
        aliases: ["petty cash count", "petty cash proof", "petty cash fund reconciliation"],
        keywords: [
        /petty cash/i,
        /imprest fund/i,
        /short and over/i,
        /cash on hand/i,
        /petty cash vouchers?/i,
        /replenishment/i,
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
        id: "receivables-aging-schedule",
        name: "Receivables Aging Schedule",
        route: "/accounting/receivables-aging-schedule",
        description:
            "Best when the user mentions aging buckets, age analysis, or an allowance based on receivables aging rather than one flat percentage.",
        required: [],
        aliases: [
            "aging of receivables",
            "ageing schedule",
            "aging schedule",
            "receivables aging",
            "aged accounts receivable",
        ],
        keywords: [
            /aging schedule/i,
            /ageing schedule/i,
            /aging of receivables/i,
            /aged receivables?/i,
            /age analysis/i,
            /past due bucket/i,
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
        id: "partnership-retirement-bonus",
        name: "Partnership Retirement Bonus",
        route: "/accounting/partnership-retirement-bonus",
        description:
            "Review a retiring partner settlement under the partnership bonus method.",
        required: [
            "totalPartnershipCapital",
            "retiringPartnerCapital",
            "settlementPaid",
        ],
        aliases: [
            "retirement bonus",
            "partner withdrawal bonus",
            "retiring partner settlement",
        ],
        keywords: [
            /retiring partner/i,
            /partnership retirement/i,
            /partner withdrawal/i,
            /settlement paid/i,
            /bonus on retirement/i,
        ],
    },
    {
        id: "partnership-dissolution",
        name: "Partnership Dissolution",
        route: "/accounting/partnership-dissolution",
        description:
            "Best when the problem involves realization, liquidation, deficiency handling, or final partner cash distribution during dissolution.",
        required: [],
        aliases: [
            "partnership dissolution",
            "partnership liquidation",
            "realization and liquidation",
            "partner deficiency",
        ],
        keywords: [
            /partnership dissolution/i,
            /partnership liquidation/i,
            /realization and liquidation/i,
            /gain or loss on realization/i,
            /capital deficiency/i,
            /liquidation/i,
            /realization/i,
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
        id: "job-order-cost-sheet",
        name: "Job Order Cost Sheet",
        route: "/accounting/job-order-cost-sheet",
        description:
            "Best when the problem asks for total job cost, unit cost, prime cost, conversion cost, or applied overhead assigned to a specific job or batch.",
        required: [
            "directMaterialsUsed",
            "directLabor",
            "manufacturingOverhead",
            "unitsProduced",
        ],
        aliases: [
            "job order cost sheet",
            "job cost sheet",
            "job order costing",
            "batch cost sheet",
        ],
        keywords: [
            /job order cost(?:ing| sheet)?/i,
            /job cost sheet/i,
            /specific job/i,
            /customer order/i,
            /batch cost/i,
            /applied manufacturing overhead/i,
            /prime cost/i,
            /conversion cost/i,
        ],
    },
    {
        id: "equivalent-units-weighted-average",
        name: "Equivalent Units (Weighted Average)",
        route: "/accounting/equivalent-units-weighted-average",
        description:
            "Best when the user is solving weighted-average process costing or equivalent units of production.",
        required: [],
        aliases: ["equivalent units", "weighted average process costing", "equivalent units of production"],
        keywords: [
            /equivalent units/i,
            /weighted average process/i,
            /process costing/i,
            /ending work in process/i,
            /transferred out/i,
        ],
    },
    {
        id: "process-costing-workspace",
        name: "Process Costing Workspace",
        route: "/accounting/process-costing-workspace",
        description:
            "Best when the user needs a full process-costing workspace with equivalent units, departmental schedules, transferred-in cost, or cost reconciliation.",
        required: [],
        aliases: [
            "process costing workspace",
            "cost of production report",
            "departmental process costing",
            "process costing checker",
        ],
        keywords: [
            /process costing/i,
            /equivalent units of production/i,
            /cost of production report/i,
            /costs accounted for/i,
            /costs to be accounted for/i,
            /transferred-?in/i,
            /department 2/i,
            /ending wip/i,
        ],
    },
    {
        id: "factory-overhead-variance",
        name: "Factory Overhead Variances",
        route: "/accounting/factory-overhead-variance",
        description:
            "Best when the user needs variable and fixed overhead variances such as spending, efficiency, budget, or volume variance.",
        required: [],
        aliases: [
            "factory overhead variance",
            "variable overhead variance",
            "fixed overhead variance",
            "overhead variance",
        ],
        keywords: [
            /factory overhead variance/i,
            /variable overhead variance/i,
            /fixed overhead variance/i,
            /overhead spending variance/i,
            /overhead efficiency variance/i,
            /overhead volume variance/i,
        ],
    },
    {
        id: "materials-quantity-variance",
        name: "Materials Quantity Variance",
        route: "/accounting/materials-quantity-variance",
        description:
            "Best when the user wants to compare actual material usage with the standard quantity allowed.",
        required: [],
        aliases: ["materials usage variance", "mqv"],
        keywords: [
            /materials quantity variance/i,
            /materials usage variance/i,
            /standard quantity allowed/i,
            /actual quantity used/i,
        ],
    },
    {
        id: "labor-efficiency-variance",
        name: "Labor Efficiency Variance",
        route: "/accounting/labor-efficiency-variance",
        description:
            "Best when the user wants to compare actual labor hours with standard hours allowed.",
        required: [],
        aliases: ["labor time variance", "labor efficiency"],
        keywords: [
            /labor efficiency variance/i,
            /labor time variance/i,
            /standard hours allowed/i,
            /actual hours/i,
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
        id: "working-capital-cycle",
        name: "Working Capital & Operating Cycle",
        route: "/accounting/working-capital-cycle",
        description:
            "Best when the user wants working capital, operating cycle, and cash conversion cycle together.",
        required: [
            "currentAssets",
            "currentLiabilities",
            "receivablesDays",
            "inventoryDays",
            "payablesDays",
        ],
        aliases: ["working capital cycle", "operating cycle", "cash conversion cycle"],
        keywords: [
            /working capital/i,
            /operating cycle/i,
            /cash conversion cycle/i,
            /\bccc\b/i,
            /receivables days/i,
            /inventory days/i,
            /payables days/i,
        ],
    },
    {
        id: "ratio-analysis-workspace",
        name: "Ratio Analysis Workspace",
        route: "/accounting/ratio-analysis-workspace",
        description:
            "Best when the user wants a compact ratio set covering liquidity, turnover, and profitability from one coordinated input base.",
        required: [],
        aliases: ["ratio analysis", "financial ratios", "ratio dashboard"],
        keywords: [
            /ratio analysis/i,
            /financial ratios/i,
            /ratio dashboard/i,
            /liquidity ratios/i,
            /profitability ratios/i,
            /turnover ratios/i,
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
        id: "equity-multiplier",
        name: "Equity Multiplier",
        route: "/accounting/equity-multiplier",
        description:
            "Measure financial leverage using average total assets and average equity.",
        required: ["averageTotalAssets", "averageEquity"],
        aliases: ["financial leverage", "dupont leverage", "equity leverage"],
        keywords: [
            /equity multiplier/i,
            /financial leverage/i,
            /dupont leverage/i,
            /average total assets/i,
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
        name: "Horizontal Analysis Workspace",
        route: "/accounting/horizontal-analysis",
        description:
            "Compute multi-line amount change and percentage change between a base period and a current period.",
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
        id: "common-size-income-statement",
        name: "Common-Size Income Statement",
        route: "/accounting/common-size-income-statement",
        description:
            "Best when the user wants income-statement lines expressed as percentages of net sales.",
        required: [],
        aliases: ["vertical analysis income statement", "common size income statement"],
        keywords: [
            /common[- ]size income statement/i,
            /vertical analysis income statement/i,
            /common size income/i,
            /income statement percentages/i,
        ],
    },
    {
        id: "common-size-balance-sheet",
        name: "Common-Size Balance Sheet",
        route: "/accounting/common-size-balance-sheet",
        description:
            "Best when the user wants balance-sheet lines expressed as percentages of total assets.",
        required: [],
        aliases: ["vertical analysis balance sheet", "common size balance sheet"],
        keywords: [
            /common[- ]size balance sheet/i,
            /vertical analysis balance sheet/i,
            /balance sheet percentages/i,
            /common size balance/i,
        ],
    },
    {
        id: "adjusting-entries-workspace",
        name: "Adjusting Entries Workspace",
        route: "/accounting/adjusting-entries-workspace",
        description:
            "Best when the user wants prepaid, unearned, accrued revenue, or accrued expense adjustments from one structured worksheet.",
        required: [],
        aliases: [
            "adjusting entries",
            "adjustment worksheet",
            "prepaid adjustment",
            "accrued expense",
            "accrued revenue",
            "unearned revenue adjustment",
        ],
        keywords: [
            /adjusting entries/i,
            /prepaid expense/i,
            /unearned revenue/i,
            /accrued revenue/i,
            /accrued expense/i,
            /adjustment entry/i,
        ],
    },
    {
        id: "prepaid-expense-adjustment",
        name: "Prepaid Expense Adjustment",
        route: "/accounting/prepaid-expense-adjustment",
        description:
            "Best when the user is adjusting a prepaid asset into expense recognized for the period.",
        required: ["beginningPrepaid", "endingPrepaid"],
        optional: ["expenseRecognized"],
        aliases: ["prepaid adjustment", "insurance adjustment", "supplies adjustment"],
        keywords: [
            /prepaid expense/i,
            /prepaid adjustment/i,
            /insurance expired/i,
            /supplies used/i,
            /expense recognized/i,
        ],
    },
    {
        id: "unearned-revenue-adjustment",
        name: "Unearned Revenue Adjustment",
        route: "/accounting/unearned-revenue-adjustment",
        description:
            "Best when the user is moving part of unearned revenue into earned revenue through an adjusting entry.",
        required: ["beginningUnearnedRevenue", "endingUnearnedRevenue"],
        optional: ["revenueRecognized"],
        aliases: ["deferred revenue adjustment", "unearned revenue adjustment"],
        keywords: [
            /unearned revenue/i,
            /deferred revenue/i,
            /revenue recognized/i,
            /earned portion/i,
            /adjusting entry/i,
        ],
    },
    {
        id: "accrued-revenue-adjustment",
        name: "Accrued Revenue Adjustment",
        route: "/accounting/accrued-revenue-adjustment",
        description:
            "Best when revenue has been earned before collection and the user needs the accrued amount or adjustment.",
        required: ["revenueEarned", "cashCollected"],
        optional: ["accruedRevenue"],
        aliases: ["accrued revenue adjustment", "revenue earned but uncollected", "receivable adjustment"],
        keywords: [
            /accrued revenue/i,
            /revenue earned but not collected/i,
            /service revenue earned/i,
            /cash collected/i,
            /receivable adjustment/i,
        ],
    },
    {
        id: "accrued-expense-adjustment",
        name: "Accrued Expense Adjustment",
        route: "/accounting/accrued-expense-adjustment",
        description:
            "Best when an expense has been incurred before payment and the user needs the accrued amount or adjustment.",
        required: ["expenseIncurred", "cashPaid"],
        optional: ["accruedExpense"],
        aliases: ["accrued expense adjustment", "expense incurred but unpaid", "payable adjustment"],
        keywords: [
            /accrued expense/i,
            /expense incurred but unpaid/i,
            /cash paid/i,
            /payable adjustment/i,
            /adjusting entry/i,
        ],
    },
    {
        id: "working-capital-planner",
        name: "Working Capital Planner",
        route: "/accounting/working-capital-planner",
        description:
            "Best when the user wants current ratio, operating cycle, receivables days, inventory days, or cash conversion cycle in one planner.",
        required: [],
        aliases: ["working capital planner", "operating cycle planner", "ccc planner", "working capital control"],
        keywords: [
            /working capital planner/i,
            /operating cycle/i,
            /cash conversion cycle/i,
            /\bccc\b/i,
            /receivables days/i,
            /inventory days/i,
            /payables days/i,
        ],
    },
    {
        id: "inventory-control-workspace",
        name: "Inventory Control Workspace",
        route: "/accounting/inventory-control-workspace",
        description:
            "Best when the user wants shrinkage and purchase-discount control signals in one inventory review.",
        required: [],
        aliases: [
            "inventory control",
            "inventory shrinkage",
            "shrinkage analysis",
            "purchase discount control",
            "stock shrinkage review",
            "book versus physical inventory",
        ],
        keywords: [
            /inventory control/i,
            /inventory shrinkage/i,
            /shrinkage/i,
            /purchase discount/i,
            /discount discipline/i,
            /physical count/i,
            /book inventory/i,
        ],
    },
    {
        id: "price-elasticity-demand",
        name: "Price Elasticity of Demand",
        route: "/economics/price-elasticity-demand",
        description:
            "Best when the user wants midpoint elasticity, elastic versus inelastic classification, or price-response analysis.",
        required: [],
        aliases: ["ped", "demand elasticity", "price elasticity"],
        keywords: [
            /price elasticity/i,
            /demand elasticity/i,
            /\bped\b/i,
            /elastic demand/i,
            /inelastic demand/i,
        ],
    },
    {
        id: "market-equilibrium",
        name: "Supply and Demand Equilibrium",
        route: "/economics/market-equilibrium",
        description:
            "Best when the user wants equilibrium price and quantity from linear demand and supply equations.",
        required: [],
        aliases: ["supply and demand equilibrium", "market clearing"],
        keywords: [
            /market equilibrium/i,
            /equilibrium price/i,
            /equilibrium quantity/i,
            /supply and demand/i,
            /market clearing/i,
        ],
    },
    {
        id: "surplus-analysis",
        name: "Consumer and Producer Surplus",
        route: "/economics/surplus-analysis",
        description:
            "Best when the user wants consumer surplus, producer surplus, or total surplus at equilibrium.",
        required: [],
        aliases: ["consumer surplus", "producer surplus", "total surplus"],
        keywords: [
            /consumer surplus/i,
            /producer surplus/i,
            /total surplus/i,
            /gains from trade/i,
        ],
    },
    {
        id: "real-interest-rate",
        name: "Real Interest Rate",
        route: "/economics/real-interest-rate",
        description:
            "Best when the user wants to compare nominal rate, inflation, and real purchasing-power return.",
        required: [],
        aliases: ["real rate", "fisher equation", "inflation adjusted return"],
        keywords: [
            /real interest rate/i,
            /real rate/i,
            /fisher equation/i,
            /inflation adjusted/i,
        ],
    },
    {
        id: "economics-analysis-workspace",
        name: "Economics Analysis Workspace",
        route: "/economics/economics-analysis-workspace",
        description:
            "Best when the user wants to compare price, income, and cross elasticity from one guided workspace.",
        required: [],
        aliases: [
            "elasticity workspace",
            "income elasticity",
            "cross elasticity",
            "economics analysis workspace",
        ],
        keywords: [
            /economics analysis workspace/i,
            /income elasticity/i,
            /cross elasticity/i,
            /elasticity workspace/i,
        ],
    },
    {
        id: "startup-cost-planner",
        name: "Startup Cost Planner",
        route: "/entrepreneurship/startup-cost-planner",
        description:
            "Best when the user wants launch costs, contingency planning, or a startup funding estimate.",
        required: [],
        aliases: ["startup budget", "launch budget", "startup costs"],
        keywords: [
            /startup cost/i,
            /startup budget/i,
            /launch budget/i,
            /feasibility budget/i,
        ],
    },
    {
        id: "unit-economics",
        name: "Unit Economics Workspace",
        route: "/entrepreneurship/unit-economics",
        description:
            "Best when the user wants contribution per unit, CAC impact, or break-even customers from one startup worksheet.",
        required: [],
        aliases: ["customer economics", "startup unit economics", "cac payback"],
        keywords: [
            /unit economics/i,
            /customer acquisition cost/i,
            /\bcac\b/i,
            /break[- ]even customers/i,
        ],
    },
    {
        id: "sales-forecast-planner",
        name: "Sales Forecast Planner",
        route: "/entrepreneurship/sales-forecast-planner",
        description:
            "Best when the user wants simple month-based revenue growth planning or a startup sales forecast.",
        required: [],
        aliases: ["sales projection", "revenue forecast", "growth forecast"],
        keywords: [
            /sales forecast/i,
            /sales projection/i,
            /revenue forecast/i,
            /growth forecast/i,
        ],
    },
    {
        id: "cash-runway-planner",
        name: "Cash Runway Planner",
        route: "/entrepreneurship/cash-runway-planner",
        description:
            "Best when the user wants burn rate or runway planning from opening cash and monthly cash flow assumptions.",
        required: [],
        aliases: ["runway calculator", "burn rate", "startup runway"],
        keywords: [
            /cash runway/i,
            /startup runway/i,
            /burn rate/i,
            /runway calculator/i,
        ],
    },
    {
        id: "entrepreneurship-toolkit",
        name: "Entrepreneurship Toolkit",
        route: "/entrepreneurship/entrepreneurship-toolkit",
        description:
            "Best when the user wants pricing targets, owner profit splits, or customer payback from one small-business worksheet.",
        required: [],
        aliases: [
            "entrepreneurship toolkit",
            "pricing target toolkit",
            "owner split planner",
            "customer payback",
        ],
        keywords: [
            /entrepreneurship toolkit/i,
            /owner split/i,
            /customer payback/i,
            /pricing target/i,
            /target selling price/i,
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
    {
        id: "high-low-cost-estimation",
        name: "High-Low Cost Estimation",
        route: "/business/high-low-cost-estimation",
        description:
            "Estimate variable and fixed cost components from high-low activity data.",
        required: [],
        aliases: ["high low method", "mixed cost split", "cost behavior estimate"],
        keywords: [/high[- ]low/i, /mixed cost/i, /cost behavior/i, /high low method/i],
    },
    {
        id: "roi-ri-eva",
        name: "ROI, RI, and EVA Workspace",
        route: "/business/roi-ri-eva",
        description:
            "Compare ROI, residual income, and EVA-style performance reading from one route.",
        required: [],
        aliases: ["roi", "residual income", "eva", "investment center"],
        keywords: [/return on investment/i, /\broi\b/i, /residual income/i, /\beva\b/i, /investment center/i],
    },
    {
        id: "eoq-and-reorder-point",
        name: "EOQ and Reorder Point",
        route: "/operations/eoq-and-reorder-point",
        description:
            "Plan economic order quantity and reorder point from one inventory route.",
        required: [],
        aliases: ["economic order quantity", "reorder point", "inventory replenishment"],
        keywords: [/\beoq\b/i, /economic order quantity/i, /reorder point/i, /safety stock/i, /lead time/i],
    },
    {
        id: "safety-stock-planner",
        name: "Safety Stock Planner",
        route: "/operations/safety-stock-planner",
        description:
            "Best when the user wants safety stock and reorder point from average and maximum usage plus lead time assumptions.",
        required: ["averageDailyUsage", "maxDailyUsage", "averageLeadTimeDays", "maxLeadTimeDays"],
        optional: ["safetyStock", "reorderPoint"],
        aliases: ["safety stock", "buffer stock", "reorder level planner"],
        keywords: [/safety stock/i, /buffer stock/i, /reorder point/i, /lead time/i, /daily usage/i],
    },
    {
        id: "moving-average-forecast",
        name: "Moving Average Forecast",
        route: "/operations/moving-average-forecast",
        description:
            "Forecast short-term demand using simple and weighted moving averages.",
        required: ["period1Demand", "period2Demand", "period3Demand", "weight1Percent", "weight2Percent", "weight3Percent"],
        optional: ["simpleMovingAverageForecast", "weightedMovingAverageForecast"],
        aliases: ["moving average forecast", "weighted moving average", "demand forecast"],
        keywords: [/moving average/i, /weighted moving average/i, /forecast/i, /demand planning/i],
    },
    {
        id: "dividend-allocation",
        name: "Dividend Allocation",
        route: "/far/dividend-allocation",
        description:
            "Best when the user allocates total dividends between preferred and common shareholders, including preferred arrears when present.",
        required: ["totalDividendsDeclared", "preferredShares", "preferredParValue", "preferredDividendRatePercent", "commonSharesOutstanding"],
        optional: ["yearsInArrears", "preferredDividendAllocated", "commonDividendAllocated", "commonDividendPerShare"],
        aliases: ["dividend allocation", "preferred and common dividends", "dividends in arrears"],
        keywords: [/dividend allocation/i, /preferred dividends/i, /dividends in arrears/i, /common dividend per share/i],
    },
    {
        id: "lease-measurement-workspace",
        name: "Lease Measurement Workspace",
        route: "/far/lease-measurement-workspace",
        description:
            "Review lease liability and right-of-use asset measurement from one FAR route.",
        required: [],
        aliases: ["lease accounting", "right of use asset", "lease liability"],
        keywords: [/lease liability/i, /right of use/i, /right-of-use/i, /lease measurement/i, /lease accounting/i],
    },
    {
        id: "share-based-payment-workspace",
        name: "Share-Based Payment Workspace",
        route: "/far/share-based-payment-workspace",
        description:
            "Review equity-settled share-based payment measurement and compensation cost timing.",
        required: [],
        aliases: ["stock options", "share options", "equity settled award"],
        keywords: [/share[- ]based payment/i, /stock options?/i, /share options?/i, /vesting/i, /compensation cost/i],
    },
    {
        id: "impairment-loss-workspace",
        name: "Impairment Loss Workspace",
        route: "/far/impairment-loss-workspace",
        description:
            "Best when the user is comparing carrying amount with recoverable amount using fair value less costs to sell and value in use.",
        required: ["carryingAmount"],
        optional: ["fairValueLessCostsToSell", "valueInUse", "impairmentLoss"],
        aliases: ["asset impairment", "recoverable amount", "impairment testing"],
        keywords: [/impairment loss/i, /recoverable amount/i, /value in use/i, /fair value less costs to sell/i, /write[- ]down/i],
    },
    {
        id: "asset-disposal-analysis",
        name: "Asset Disposal Analysis",
        route: "/far/asset-disposal-analysis",
        description:
            "Best when the user needs book value, net proceeds, or gain or loss on disposal of property, plant, and equipment.",
        required: ["assetCost", "accumulatedDepreciation", "proceeds"],
        optional: ["disposalCosts", "gainOrLoss"],
        aliases: ["disposal of asset", "gain on sale of equipment", "retirement and disposal"],
        keywords: [/asset disposal/i, /gain or loss on sale/i, /retirement of asset/i, /accumulated depreciation/i, /book value/i],
    },
    {
        id: "cash-flow-statement-builder",
        name: "Statement of Cash Flows Builder",
        route: "/far/cash-flow-statement-builder",
        description:
            "Build and classify operating, investing, and financing cash flows.",
        required: [],
        aliases: ["cash flow statement", "indirect method", "cash flow classification"],
        keywords: [/statement of cash flows/i, /indirect method/i, /cash flow classification/i, /operating activities/i, /financing activities/i],
    },
    {
        id: "audit-planning-workspace",
        name: "Audit Planning Workspace",
        route: "/audit/audit-planning-workspace",
        description:
            "Review planning materiality, performance materiality, and audit-risk response.",
        required: [],
        aliases: ["audit materiality", "planning materiality", "audit risk"],
        keywords: [/audit planning/i, /planning materiality/i, /performance materiality/i, /audit risk/i],
    },
    {
        id: "audit-cycle-reviewer",
        name: "Audit Cycle Reviewer",
        route: "/audit/audit-cycle-reviewer",
        description:
            "Review transaction-cycle assertions, controls, and likely procedures.",
        required: [],
        aliases: ["transaction cycle auditing", "revenue cycle audit", "expenditure cycle audit"],
        keywords: [/transaction cycle/i, /revenue cycle/i, /expenditure cycle/i, /conversion cycle/i, /financing cycle/i],
    },
    {
        id: "audit-completion-and-opinion",
        name: "Audit Completion and Opinion Workspace",
        route: "/audit/audit-completion-and-opinion",
        description:
            "Review completion procedures, going concern, modified reports, and KAMs.",
        required: [],
        aliases: ["modified audit report", "key audit matters", "going concern audit"],
        keywords: [/completion procedures/i, /going concern/i, /subsequent events/i, /modified opinion/i, /key audit matters?/i],
    },
    {
        id: "book-tax-difference-workspace",
        name: "Book-Tax Difference Workspace",
        route: "/tax/book-tax-difference-workspace",
        description:
            "Bridge accounting income and taxable income through book-tax differences.",
        required: [],
        aliases: ["book tax differences", "temporary differences", "tax reconciliation"],
        keywords: [/book tax/i, /temporary differences/i, /deferred tax/i, /tax reconciliation/i],
    },
    {
        id: "vat-reconciliation",
        name: "VAT Reconciliation",
        route: "/tax/vat-reconciliation",
        description:
            "Best when the user is comparing output VAT and input VAT to read the net payable or excess-input position.",
        required: ["taxableSalesAmount", "vatablePurchasesAmount", "vatRatePercent"],
        optional: ["netVatPayable"],
        aliases: ["vat payable", "output vat less input vat", "vat reconciliation"],
        keywords: [/vat reconciliation/i, /output vat/i, /input vat/i, /vat payable/i, /vatable sales/i],
    },
    {
        id: "withholding-tax",
        name: "Withholding Tax",
        route: "/tax/withholding-tax",
        description:
            "Best when the user is computing tax withheld or net proceeds after withholding from a payment base and rate.",
        required: ["taxBase", "ratePercent"],
        optional: ["taxWithheld"],
        aliases: ["expanded withholding tax", "creditable withholding tax", "tax withheld"],
        keywords: [/withholding tax/i, /tax withheld/i, /expanded withholding/i, /creditable withholding/i, /withholding rate/i],
    },
    {
        id: "estate-tax-helper",
        name: "Estate Tax Helper",
        route: "/tax/estate-tax-helper",
        description:
            "Best when the user wants net estate and estate tax due from gross estate, deductions, and a visible tax rate assumption.",
        required: ["grossEstate", "allowableDeductions", "taxRatePercent"],
        optional: ["netEstate", "estateTaxDue"],
        aliases: ["estate tax", "net estate", "estate tax due"],
        keywords: [/estate tax/i, /gross estate/i, /net estate/i, /allowable deductions/i],
    },
    {
        id: "donors-tax-helper",
        name: "Donor's Tax Helper",
        route: "/tax/donors-tax-helper",
        description:
            "Best when the user needs taxable gift or donor's tax due using visible classroom assumptions.",
        required: ["grossGift", "taxRatePercent"],
        optional: ["taxableGift", "donorsTaxDue"],
        aliases: ["donor's tax", "donors tax", "gift tax"],
        keywords: [/donor'?s tax/i, /donors tax/i, /gift tax/i, /gross gift/i, /taxable gift/i],
    },
    {
        id: "documentary-stamp-tax-helper",
        name: "Documentary Stamp Tax Helper",
        route: "/tax/documentary-stamp-tax-helper",
        description:
            "Best when the user needs DST due from a taxable base amount, unit size, and rate per taxable unit.",
        required: ["taxableBaseAmount", "taxableUnitSize", "ratePerUnit"],
        optional: ["taxableUnits", "documentaryStampTaxDue"],
        aliases: ["documentary stamp tax", "dst", "stamp tax"],
        keywords: [/documentary stamp tax/i, /\bdst\b/i, /stamp tax/i, /rate per unit/i],
    },
    {
        id: "tax-compliance-review",
        name: "Tax Compliance and Incentive Review",
        route: "/tax/tax-compliance-review",
        description:
            "Review withholding, transfer taxes, treaty handling, and incentive regimes.",
        required: [],
        aliases: ["withholding tax review", "estate donor tax", "tax treaty"],
        keywords: [/withholding tax/i, /documentary stamp/i, /estate tax/i, /donor'?s tax/i, /tax treaty/i, /peza|boi|bcda|bmbe/i],
    },
    {
        id: "business-combination-analysis",
        name: "Business Combination Analysis",
        route: "/afar/business-combination-analysis",
        description:
            "Study goodwill, NCI measurement, and acquisition-date business-combination logic.",
        required: [],
        aliases: ["goodwill calculator", "business combination", "nci measurement"],
        keywords: [/business combination/i, /goodwill/i, /\bnci\b/i, /consolidation goodwill/i],
    },
    {
        id: "intercompany-inventory-profit",
        name: "Intercompany Inventory Profit Elimination",
        route: "/afar/intercompany-inventory-profit",
        description:
            "Best when the user needs the unrealized intercompany profit still embedded in ending inventory.",
        required: ["transferPrice", "markupRateOnCostPercent", "percentUnsoldAtPeriodEnd"],
        optional: ["unrealizedProfitInEndingInventory"],
        aliases: ["intercompany inventory profit", "inventory profit elimination", "unrealized profit in inventory"],
        keywords: [
            /intercompany inventory/i,
            /unrealized profit/i,
            /inventory elimination/i,
            /markup on cost/i,
            /ending inventory unsold/i,
        ],
    },
    {
        id: "equity-method-investment",
        name: "Equity Method Investment",
        route: "/afar/equity-method-investment",
        description:
            "Best when the user wants the carrying amount of an associate investment after share in income and dividends.",
        required: ["initialInvestment", "ownershipPercentage"],
        optional: ["netIncome", "dividendsDeclared", "investorShareInIncome", "dividendsReceived", "endingInvestmentBalance"],
        aliases: ["equity method", "investment in associate", "associate accounting"],
        keywords: [/equity method/i, /investment in associate/i, /share in income/i, /associate accounting/i],
    },
    {
        id: "consignment-settlement",
        name: "Consignment Settlement",
        route: "/afar/consignment-settlement",
        description:
            "Best when the user needs consignee commission, related charges, and the balance still due to the consignor.",
        required: ["sales", "commissionRatePercent"],
        optional: ["freightAndOtherExpenses", "advancesRemitted", "commissionAmount", "cashStillDueToConsignor"],
        aliases: ["consignment settlement", "consignee settlement", "cash due consignor"],
        keywords: [/consignment/i, /consignee/i, /commission rate/i, /cash due to consignor/i],
    },
    {
        id: "branch-inventory-loading",
        name: "Branch Inventory Loading",
        route: "/afar/branch-inventory-loading",
        description:
            "Best when the user converts branch inventory at billed price into loading allowance and inventory at cost.",
        required: ["billedPriceInventory", "loadingPercentOnCost"],
        optional: ["loadingRateOnBilledPrice", "inventoryLoadingAllowance", "inventoryAtCost"],
        aliases: ["branch inventory loading", "branch loading", "allowance for overvaluation"],
        keywords: [/branch inventory/i, /loading on cost/i, /allowance for overvaluation/i, /inventory at billed price/i],
    },
    {
        id: "intercompany-ppe-transfer",
        name: "Intercompany PPE Transfer",
        route: "/afar/intercompany-ppe-transfer",
        description:
            "Best when the user needs remaining unrealized gain or excess depreciation on an intercompany PPE transfer.",
        required: ["transferPrice", "carryingAmount", "usefulLife", "year"],
        optional: ["annualExcessDepreciation", "unamortizedIntercompanyProfit"],
        aliases: ["intercompany ppe transfer", "intercompany equipment transfer", "excess depreciation"],
        keywords: [/intercompany ppe/i, /excess depreciation/i, /equipment transfer/i, /unamortized intercompany profit/i],
    },
    {
        id: "foreign-currency-translation",
        name: "Foreign Currency Translation Workspace",
        route: "/afar/foreign-currency-translation",
        description:
            "Review transaction-date, closing-rate, and settlement-rate foreign-currency effects.",
        required: [],
        aliases: ["foreign currency transaction", "exchange difference", "forex translation"],
        keywords: [/foreign currency/i, /exchange difference/i, /closing rate/i, /settlement rate/i, /translation/i],
    },
    {
        id: "construction-revenue-workspace",
        name: "Construction Revenue Workspace",
        route: "/afar/construction-revenue-workspace",
        description:
            "Review long-term construction revenue, percent complete, and contract position.",
        required: [],
        aliases: ["long term construction", "percentage of completion", "construction contract"],
        keywords: [/percentage of completion/i, /construction contract/i, /contract asset/i, /contract liability/i, /cost to cost/i],
    },
    {
        id: "it-control-matrix",
        name: "IT Control Matrix",
        route: "/ais/it-control-matrix",
        description:
            "Review IT governance, general controls, and application-control implications.",
        required: [],
        aliases: ["itgc", "it controls", "it audit"],
        keywords: [/it governance/i, /it controls/i, /\bitgc\b/i, /application controls/i, /it audit/i],
    },
    {
        id: "ais-lifecycle-and-recovery",
        name: "AIS Lifecycle and Recovery Review",
        route: "/ais/ais-lifecycle-and-recovery",
        description:
            "Review ERP, continuity, disaster recovery, and systems life-cycle concerns.",
        required: [],
        aliases: ["business continuity planning", "disaster recovery", "erp controls"],
        keywords: [/business continuity/i, /disaster recovery/i, /\berp\b/i, /\bcrm\b/i, /incident management/i, /capacity planning/i],
    },
    {
        id: "business-continuity-planner",
        name: "Business Continuity Planner",
        route: "/ais/business-continuity-planner",
        description:
            "Score continuity readiness, compare expected recovery with the target RTO, and keep AIS disruption cases structured.",
        required: [],
        aliases: ["business continuity planner", "continuity readiness", "recovery time objective", "rto"],
        keywords: [/business continuity/i, /recovery time objective|rto/i, /disaster recovery/i, /incident response/i, /vendor resilience/i],
    },
    {
        id: "commercial-transactions-reviewer",
        name: "Commercial Transactions Reviewer",
        route: "/rfbt/commercial-transactions-reviewer",
        description:
            "Review commercial-law, securities, procurement, and rehabilitation topics.",
        required: [],
        aliases: ["credit transactions review", "contracts of security", "insider trading"],
        keywords: [/credit transactions/i, /contracts? of security/i, /insider trading/i, /procurement/i, /intellectual property/i, /rehabilitation/i],
    },
    {
        id: "borrowing-costs-capitalization",
        name: "Borrowing Costs Capitalization",
        route: "/far/borrowing-costs-capitalization",
        description:
            "Estimate capitalizable borrowing cost for qualifying assets using average accumulated expenditures, a capitalization rate, and the construction period.",
        required: [],
        aliases: ["borrowing costs capitalization", "avoidable interest", "capitalized borrowing cost", "qualifying asset borrowing cost"],
        keywords: [/borrowing costs?/i, /avoidable interest/i, /qualifying asset/i, /capitali[sz]ation rate/i, /average accumulated expenditures/i],
    },
    {
        id: "cost-plus-pricing",
        name: "Cost-Plus Pricing Planner",
        route: "/operations/cost-plus-pricing",
        description:
            "Bridge costing and pricing by turning cost, target margin language, and target income into a usable selling-price plan.",
        required: [],
        aliases: ["cost plus pricing", "target margin pricing", "markup pricing planner", "costing and pricing"],
        keywords: [/cost[- ]plus/i, /target margin/i, /markup on cost/i, /pricing planner/i, /costing and pricing/i],
    },
    {
        id: "audit-assertion-evidence-planner",
        name: "Audit Assertion and Evidence Planner",
        route: "/audit/assertion-evidence-planner",
        description:
            "Choose assertion-focused procedures and working-paper direction from the audit cycle, risk, and control-reliance mix in a case.",
        required: [],
        aliases: ["audit assertions", "audit evidence planner", "working paper evidence plan", "occurrence completeness valuation"],
        keywords: [/audit assertions?/i, /audit evidence/i, /working papers?/i, /occurrence|completeness|valuation|rights|presentation/i, /control reliance/i],
    },
    {
        id: "excise-local-and-incentive-review",
        name: "Excise, Local, and Incentive Tax Review",
        route: "/tax/excise-local-and-incentive-review",
        description:
            "Review excise tax, local taxation, and incentive-regime issues in one route when the problem is more conceptual than purely computational.",
        required: [],
        aliases: ["excise tax review", "local taxation review", "peza boi incentives", "preferential taxation review"],
        keywords: [/excise tax/i, /local taxation/i, /preferential taxation/i, /peza|boi|bcda|bmbe/i, /tax incentives?/i],
    },
    {
        id: "enterprise-systems-control-mapper",
        name: "Enterprise Systems Control Mapper",
        route: "/ais/enterprise-systems-control-mapper",
        description:
            "Map ERP, SCM, CRM, and data-flow control issues so AIS cases connect systems modules to control design and audit implications.",
        required: [],
        aliases: ["enterprise systems control", "erp scm crm controls", "ais systems control map", "enterprise process controls"],
        keywords: [/enterprise systems?/i, /\berp\b/i, /\bscm\b/i, /\bcrm\b/i, /application controls?/i, /data flow controls?/i],
    },
    {
        id: "ethics-decision-workspace",
        name: "Ethics Decision Workspace",
        route: "/governance/ethics-decision-workspace",
        description:
            "Frame governance, ethics, risk, and control-environment dilemmas through practical decision prompts instead of leaving them as isolated reviewer notes.",
        required: [],
        aliases: ["ethics decision", "governance ethics", "management override ethics", "corporate citizenship review"],
        keywords: [/business ethics/i, /good governance/i, /management override/i, /corporate citizenship/i, /ethical decision/i],
    },
    {
        id: "control-environment-review",
        name: "Control Environment Review",
        route: "/governance/control-environment-review",
        description:
            "Evaluate oversight, ethics, accountability, competence, and escalation readiness in governance cases.",
        required: [],
        aliases: ["control environment review", "tone at the top", "good governance controls", "ethical escalation"],
        keywords: [/control environment/i, /tone at the top/i, /management override/i, /escalation/i, /good governance/i],
    },
    {
        id: "securities-and-governance-review",
        name: "Securities and Governance Review",
        route: "/rfbt/securities-and-governance-review",
        description:
            "Review securities regulation, insider trading, corporate-governance, and disclosure topics inside the RFBT track.",
        required: [],
        aliases: ["securities review", "corporate governance review", "insider trading review", "securities regulation"],
        keywords: [/securities/i, /insider trading/i, /fraud and manipulation/i, /corporate governance/i, /merger and consolidation/i],
    },
    {
        id: "balanced-scorecard-workspace",
        name: "Balanced Scorecard Workspace",
        route: "/strategic/balanced-scorecard-workspace",
        description:
            "Turn strategic objectives into a four-perspective performance story so integrative cases link planning, controls, and accountability.",
        required: [],
        aliases: ["balanced scorecard", "strategy map", "learning and growth perspective", "strategic performance map"],
        keywords: [/balanced scorecard/i, /strategy map/i, /financial perspective/i, /customer perspective/i, /learning and growth/i],
    },
    {
        id: "integrative-case-mapper",
        name: "Integrative Case Mapper",
        route: "/strategic/integrative-case-mapper",
        description:
            "Map mixed-topic cases before choosing the detailed route.",
        required: [],
        aliases: ["board review integration", "integrative case", "capstone review"],
        keywords: [/integrative case/i, /board review/i, /capstone/i, /mixed topic/i],
    },
    {
        id: "strategic-business-analysis",
        name: "Strategic Business Analysis Workspace",
        route: "/strategic/strategic-business-analysis",
        description:
            "Review strategic analysis, strategic cost management, and consultancy framing.",
        required: [],
        aliases: ["strategic management analysis", "consultancy review", "industry analysis"],
        keywords: [/strategic business analysis/i, /strategic cost management/i, /industry analysis/i, /consultancy/i, /research methods/i],
    },
    {
        id: "business-case-analysis",
        name: "Business Case Analysis Planner",
        route: "/strategic/business-case-analysis",
        description:
            "Blend market, execution, control, and risk signals into a cleaner strategic recommendation.",
        required: [],
        aliases: ["business case analysis", "go no-go analysis", "case recommendation", "strategic recommendation"],
        keywords: [/business case/i, /go no-go/i, /market attractiveness/i, /execution readiness/i, /recommendation/i, /risk penalty/i],
    },
    {
        id: "dupont-analysis",
        name: "DuPont ROE Analyzer",
        route: "/accounting/dupont-analysis",
        description:
            "Decompose ROE into profit margin, asset turnover, and leverage when statement-analysis prompts ask why returns changed.",
        required: [],
        aliases: ["dupont analysis", "dupont roe", "roe decomposition", "equity multiplier"],
        keywords: [/dupont/i, /return on equity/i, /profit margin/i, /asset turnover/i, /equity multiplier/i],
    },
    {
        id: "earnings-quality-analysis",
        name: "Earnings Quality and Accruals Analyzer",
        route: "/accounting/earnings-quality-analysis",
        description:
            "Compare net income with operating cash flow when a financial-statement analysis prompt asks about accrual pressure or quality of earnings.",
        required: [],
        aliases: ["earnings quality", "quality of earnings", "accrual ratio", "cash conversion of income"],
        keywords: [/earnings quality/i, /quality of earnings/i, /accrual ratio/i, /operating cash flow/i],
    },
    {
        id: "provision-expected-value",
        name: "Provision Expected Value Planner",
        route: "/far/provision-expected-value",
        description:
            "Estimate a probability-weighted provision for FAR cases involving contingencies, obligations, and multiple possible outcomes.",
        required: [],
        aliases: ["provision expected value", "contingency estimate", "probability weighted provision"],
        keywords: [/provision/i, /contingenc(?:y|ies)/i, /expected value/i, /probability weighted/i],
    },
    {
        id: "franchise-revenue-workspace",
        name: "Franchise Revenue Workspace",
        route: "/afar/franchise-revenue-workspace",
        description:
            "Analyze initial franchise fee revenue using satisfied performance obligation and collectability assumptions.",
        required: [],
        aliases: ["franchise accounting", "initial franchise fee", "franchise revenue recognition"],
        keywords: [/franchise accounting/i, /initial franchise fee/i, /performance obligation/i, /contract liability/i],
    },
    {
        id: "retail-markup-markdown",
        name: "Retail Markup and Markdown Planner",
        route: "/operations/retail-markup-markdown",
        description:
            "Analyze retail pricing cases with markup, markdown, maintained margin, revenue, and gross profit.",
        required: [],
        aliases: ["retail markup", "markdown planner", "maintained margin", "retail pricing"],
        keywords: [/retail markup/i, /markdown/i, /maintained margin/i, /retail pricing/i],
    },
    {
        id: "confidence-interval",
        name: "Confidence Interval Helper",
        route: "/statistics/confidence-interval",
        description:
            "Build a z or t confidence interval for statistics, audit sampling, forecasting, or marketing-research estimates.",
        required: [],
        aliases: ["confidence interval", "margin of error", "standard error", "sampling estimate", "t interval", "z interval"],
        keywords: [/confidence interval/i, /margin of error/i, /standard error/i, /sample mean/i, /t critical|z critical/i],
    },
    {
        id: "capital-rationing-prioritizer",
        name: "Capital Rationing Prioritizer",
        route: "/finance/capital-rationing-prioritizer",
        description:
            "Compare profitability-index ranking with exact project-combination selection under a limited capital budget.",
        required: [],
        aliases: ["capital rationing", "project prioritization", "profitability index ranking", "project combination"],
        keywords: [/capital rationing/i, /profitability index/i, /project selection/i, /investment budget/i, /project combination/i],
    },
    {
        id: "segmented-income-statement",
        name: "Segmented Income Statement Analyzer",
        route: "/business/segmented-income-statement",
        description:
            "Compute contribution margin, segment margin, and allocated common-cost effect for responsibility-accounting cases.",
        required: [],
        aliases: ["segmented income statement", "segment margin", "traceable fixed costs", "responsibility accounting"],
        keywords: [/segmented income/i, /segment margin/i, /traceable fixed/i, /common fixed/i],
    },
    {
        id: "audit-sampling-planner",
        name: "Audit Sampling Planner",
        route: "/audit/audit-sampling-planner",
        description:
            "Estimate sample size, sampling interval, and allowance for sampling risk from population, tolerable misstatement, expected misstatement, and confidence factor.",
        required: [],
        aliases: ["audit sampling", "monetary unit sampling", "sample size", "tolerable misstatement"],
        keywords: [/audit sampling/i, /sample size/i, /tolerable misstatement/i, /expected misstatement/i, /monetary unit/i],
    },
    {
        id: "pert-project-estimate",
        name: "PERT Project Estimate Helper",
        route: "/operations/pert-project-estimate",
        description:
            "Use optimistic, most-likely, and pessimistic estimates to compute expected project time and uncertainty.",
        required: [],
        aliases: ["pert estimate", "project management estimate", "optimistic most likely pessimistic"],
        keywords: [/\bpert\b/i, /optimistic/i, /most likely/i, /pessimistic/i, /project estimate/i],
    },
    {
        id: "quasi-reorganization",
        name: "Quasi-Reorganization Deficit Cleanup",
        route: "/far/quasi-reorganization",
        description:
            "Review whether share premium, revaluation surplus, and capital reduction can remove a deficit under classroom assumptions.",
        required: [],
        aliases: ["quasi reorganization", "deficit cleanup", "capital reduction", "clean surplus"],
        keywords: [/quasi[- ]reorganization/i, /deficit/i, /capital reduction/i, /share premium/i],
    },
    {
        id: "corporate-liquidation",
        name: "Corporate Liquidation Recovery Planner",
        route: "/afar/corporate-liquidation",
        description:
            "Estimate net estate available, unsecured creditor recovery, and deficiency for corporate liquidation review.",
        required: [],
        aliases: ["corporate liquidation", "statement of affairs", "unsecured recovery", "liquidation"],
        keywords: [/corporate liquidation/i, /statement of affairs/i, /unsecured creditors?/i, /liquidation costs?/i],
    },
    {
        id: "obligations-contracts-flow",
        name: "Obligations and Contracts Issue Flow",
        route: "/rfbt/obligations-contracts-flow",
        description:
            "Classify obligations, defective contracts, remedies, and next review steps for RFBT prompts.",
        required: [],
        aliases: ["obligations", "contracts", "defective contracts", "voidable unenforceable void"],
        keywords: [/obligations?/i, /defective contracts?/i, /voidable/i, /unenforceable/i, /void contract/i],
    },
    {
        id: "defective-contracts-classifier",
        name: "Defective Contracts Classifier",
        route: "/rfbt/defective-contracts-classifier",
        description:
            "Classify defective contracts while keeping enforceability, ratification, and remedy logic visible.",
        required: [],
        aliases: ["defective contracts classifier", "rescissible contract", "annulment and ratification", "voidable contract review"],
        keywords: [/defective contracts?/i, /rescissible/i, /ratification/i, /annulment/i, /unenforceable/i, /voidable/i],
    },
    {
        id: "access-control-review",
        name: "Access Control Review Workspace",
        route: "/ais/access-control-review",
        description:
            "Review logical access, privileged access, change risk, monitoring, and evidence needs in AIS and IT-audit cases.",
        required: [],
        aliases: ["logical access", "privileged access", "segregation of duties", "access control"],
        keywords: [/logical access/i, /privileged access/i, /segregation of duties/i, /access controls?/i],
    },
    {
        id: "activity-based-costing",
        name: "Activity-Based Costing Allocator",
        route: "/business/activity-based-costing",
        description:
            "Allocate activity cost pools with driver rates and compute product overhead, total cost, and unit product cost.",
        required: [],
        aliases: ["activity based costing", "abc costing", "cost pool", "cost driver", "activity rate"],
        keywords: [/activity[- ]based costing/i, /\babc\b/i, /cost pools?/i, /cost drivers?/i, /activity rate/i],
    },
    {
        id: "financial-asset-amortized-cost",
        name: "Financial Asset Amortized Cost Schedule",
        route: "/far/financial-asset-amortized-cost",
        description:
            "Compute effective-interest revenue, cash interest, amortization, and ECL-adjusted carrying amount for financial assets.",
        required: [],
        aliases: ["financial asset", "amortized cost", "effective interest asset", "expected credit loss"],
        keywords: [/financial asset/i, /amortized cost/i, /effective interest/i, /expected credit loss|ecl/i],
    },
    {
        id: "investment-property-measurement",
        name: "Investment Property Measurement Helper",
        route: "/far/investment-property-measurement",
        description:
            "Compare fair value model gain or loss with cost-model carrying amount for investment property cases.",
        required: [],
        aliases: ["investment property", "fair value model", "cost model"],
        keywords: [/investment property/i, /fair value model/i, /cost model/i],
    },
    {
        id: "joint-arrangement-analyzer",
        name: "Joint Arrangement Share Analyzer",
        route: "/afar/joint-arrangement-analyzer",
        description:
            "Estimate a venturer's share of assets, liabilities, revenue, expenses, and profit with joint-operation classification reminders.",
        required: [],
        aliases: ["joint arrangement", "joint operation", "joint venture"],
        keywords: [/joint arrangement/i, /joint operation/i, /joint venture/i, /rights to assets/i],
    },
    {
        id: "quality-control-chart",
        name: "Quality Control Chart Helper",
        route: "/operations/quality-control-chart",
        description:
            "Build three-sigma control limits and flag out-of-control observations for operations quality-control cases.",
        required: [],
        aliases: ["quality control chart", "control limits", "statistical quality control", "three sigma"],
        keywords: [/quality control/i, /control chart/i, /\bucl\b|\blcl\b/i, /three sigma/i, /statistical quality/i],
    },
    {
        id: "workpaper-studio",
        name: "Workpaper Studio",
        route: "/workpapers",
        description:
            "Use when the user wants a workbook, workpaper, spreadsheet-style schedule, or exportable solving file rather than a single one-off result.",
        required: [],
        aliases: ["spreadsheet workpaper", "workbook builder", "send to workbook", "xlsx export"],
        keywords: [/workpaper/i, /workbook/i, /spreadsheet/i, /xlsx/i, /csv export/i, /schedule builder/i, /supporting schedule/i, /working paper/i],
    },
    ];

type RouteFamilyRule = {
    id: string;
    label: string;
    calculatorIds: readonly string[];
    extractionFieldKeys?: readonly FieldKey[];
    positivePatterns?: readonly RegExp[];
    contradictionPatterns?: readonly RegExp[];
    relatedCalculatorIds?: readonly string[];
};

type RankedTopicFamily = TopicFamilyMatch & {
    contradictionPenalty: number;
};

const SPECIAL_ROUTE_FAMILY_RULES: RouteFamilyRule[] = [
    {
        id: "cash-budget-suite",
        label: "Cash Budget Suite",
        calculatorIds: [
            "cash-budget",
            "cash-collections-schedule",
            "cash-disbursements-schedule",
            "sales-budget",
            "production-budget",
            "direct-materials-purchases-budget",
            "direct-labor-budget",
            "factory-overhead-budget",
            "budgeted-income-statement",
        ],
        positivePatterns: [
            /\bcash budget\b/i,
            /\bcash collections?\b/i,
            /\bcash disbursements?\b/i,
            /\bminimum cash\b/i,
            /\bfinancing need\b/i,
            /\bcash receipts?\b/i,
        ],
        contradictionPatterns: [
            /\bbank reconciliation\b/i,
            /\bgross profit rate\b/i,
            /\bloan amortization\b/i,
            /\bconfidence interval\b/i,
        ],
        relatedCalculatorIds: [
            "cash-collections-schedule",
            "cash-disbursements-schedule",
            "direct-materials-purchases-budget",
            "sales-budget",
        ],
    },
    {
        id: "bank-reconciliation",
        label: "Bank Reconciliation",
        calculatorIds: ["bank-reconciliation"],
        positivePatterns: [
            /\bbank reconciliation\b/i,
            /\bdeposits in transit\b/i,
            /\boutstanding checks?\b/i,
            /\bbook balance\b/i,
            /\bbank balance\b/i,
            /\bnsf\b/i,
        ],
        contradictionPatterns: [
            /\bgross profit\b/i,
            /\bcash budget\b/i,
            /\bloan amortization\b/i,
            /\bpresent value\b/i,
            /\bbreak[- ]even\b/i,
        ],
    },
    {
        id: "intercompany-inventory",
        label: "Intercompany Inventory",
        calculatorIds: ["intercompany-inventory-profit"],
        positivePatterns: [
            /\bintercompany inventory\b/i,
            /\bunrealized profit\b/i,
            /\bending inventory unsold\b/i,
            /\bmarkup on cost\b/i,
        ],
        contradictionPatterns: [
            /\buseful life\b/i,
            /\bexcess depreciation\b/i,
            /\bbank reconciliation\b/i,
        ],
    },
    {
        id: "intercompany-ppe",
        label: "Intercompany PPE Transfer",
        calculatorIds: ["intercompany-ppe-transfer"],
        positivePatterns: [
            /\bintercompany ppe\b/i,
            /\bintercompany equipment\b/i,
            /\bcarrying amount\b/i,
            /\buseful life\b/i,
            /\bexcess depreciation\b/i,
            /\bunamortized intercompany profit\b/i,
        ],
        contradictionPatterns: [
            /\bending inventory unsold\b/i,
            /\bmarkup on cost\b/i,
            /\bbank reconciliation\b/i,
            /\bloan amortization\b/i,
        ],
    },
];

const SPECIAL_ROUTE_FAMILY_BY_CALCULATOR_ID = new Map(
    SPECIAL_ROUTE_FAMILY_RULES.flatMap((family) =>
        family.calculatorIds.map((calculatorId) => [calculatorId, family] as const)
    )
);

function clampScore(value: number) {
    return Math.max(0, Math.min(100, value));
}

function dedupeFieldKeys(keys: readonly FieldKey[]): FieldKey[] {
    return Array.from(new Set(keys)) as FieldKey[];
}

function getRouteFamilyRule(calculator: CalculatorConfig): RouteFamilyRule {
    const special = SPECIAL_ROUTE_FAMILY_BY_CALCULATOR_ID.get(calculator.id);
    if (special) {
        return {
            ...special,
            extractionFieldKeys:
                special.extractionFieldKeys ??
                dedupeFieldKeys(
                    special.calculatorIds.flatMap((calculatorId) => {
                        const matchedCalculator = CALCULATORS.find(
                            (entry) => entry.id === calculatorId
                        );
                        return matchedCalculator
                            ? [
                                  ...matchedCalculator.required,
                                  ...(matchedCalculator.optional ?? []),
                              ]
                            : [];
                    })
                ),
        };
    }

    return {
        id: calculator.id,
        label: calculator.name,
        calculatorIds: [calculator.id],
        extractionFieldKeys: dedupeFieldKeys([
            ...calculator.required,
            ...(calculator.optional ?? []),
        ]),
        relatedCalculatorIds: [],
    };
}

function getTopicFamilyConfidence(score: number): TopicFamilyConfidence {
    if (score >= 70) return "high";
    if (score >= 42) return "moderate";
    return "low";
}

function looksLikeCalendarYear(value: number | null) {
    if (value === null || !Number.isFinite(value)) return false;
    return Number.isInteger(value) && value >= 1900 && value <= 2100;
}

function isStudyFirstPrompt(query: string) {
    if (!query.trim()) return false;

    const studySignals =
        (query.match(/\b(explain|lesson|learn|study|reviewer|review|concept|why|meaning|difference between|theory|journalize)\b/gi) ?? [])
            .length;
    const calculatorSignals =
        (query.match(/\b(calculate|compute|solve|determine|prepare|cash budget|bank reconciliation|break[- ]even|intercompany|depreciation)\b/gi) ?? [])
            .length;

    return studySignals >= 2 && calculatorSignals === 0;
}

function findNearbyAliasWindow(text: string, aliases: readonly string[]) {
    if (!aliases.length) return "";

    const variants = [...new Set(aliases.flatMap(buildPhraseVariants))];
    for (const alias of variants) {
        const index = text.indexOf(alias);
        if (index === -1) continue;

        return text.slice(Math.max(0, index - 24), Math.min(text.length, index + alias.length + 24));
    }

    return "";
}

function sanitizeExtractedFactValue(
    key: FieldKey,
    value: string | number,
    query: string
) {
    const numericValue = typeof value === "number" ? value : toNumber(value);
    if (numericValue === null) {
        return typeof value === "number" ? null : String(value);
    }

    const meta = FIELD_META[key];
    const nearbyWindow = findNearbyAliasWindow(query, meta.aliases ?? []);
    const explicitPercentNearby = /%|percent|percentage|rate/i.test(nearbyWindow);
    const explicitDateNearby =
        /\b(year ended|fiscal year|calendar year|as of|dated|date)\b/i.test(nearbyWindow);

    if (meta.kind === "percent") {
        if (looksLikeCalendarYear(numericValue)) return null;
        if (!explicitPercentNearby && Math.abs(numericValue) > 100) return null;
    }

    if (meta.kind === "money" && looksLikeCalendarYear(numericValue) && !explicitDateNearby) {
        return null;
    }

    if (
        (meta.kind === "number" || meta.kind === "time") &&
        key !== "year" &&
        key !== "years" &&
        key !== "yearsInArrears" &&
        looksLikeCalendarYear(numericValue)
    ) {
        return null;
    }

    return typeof value === "number" ? numberToInput(value) : String(value);
}

type ExtractionGuardContext = {
    allowedFields?: Set<FieldKey>;
    query?: string;
};

let activeExtractionGuardContext: ExtractionGuardContext | null = null;

function withExtractionGuardContext<T>(
    context: ExtractionGuardContext,
    run: () => T
) {
    const previous = activeExtractionGuardContext;
    activeExtractionGuardContext = context;

    try {
        return run();
    } finally {
        activeExtractionGuardContext = previous;
    }
}

function computeTopicSignalScore(
    calculator: CalculatorConfig,
    query: string
) {
    const familyRule = getRouteFamilyRule(calculator);
    const keywordMatches = calculator.keywords.filter((keyword) => keyword.test(query)).length;
    const aliasMatches = countPhraseMatches(query, calculator.aliases);
    const nameMatches = countPhraseMatches(query, [calculator.name]);
    const familyMatches =
        (familyRule.positivePatterns ?? []).filter((pattern) => pattern.test(query)).length;
    const contradictionPenalty =
        (familyRule.contradictionPatterns ?? []).filter((pattern) => pattern.test(query)).length *
        12;

    const topicScore =
        keywordMatches * 12 +
        aliasMatches * 14 +
        nameMatches * 8 +
        familyMatches * 10 -
        contradictionPenalty;

    return {
        familyRule,
        topicScore: clampScore(topicScore),
        contradictionPenalty,
        keywordMatches,
        aliasMatches,
        familyMatches,
    };
}

function rankTopicFamilies(query: string): RankedTopicFamily[] {
    const familyMap = new Map<string, RankedTopicFamily>();

    CALCULATORS.forEach((calculator) => {
        const topic = computeTopicSignalScore(calculator, query);
        const existing = familyMap.get(topic.familyRule.id);

        if (!existing || topic.topicScore > existing.score) {
            familyMap.set(topic.familyRule.id, {
                id: topic.familyRule.id,
                label: topic.familyRule.label,
                score: topic.topicScore,
                confidence: getTopicFamilyConfidence(topic.topicScore),
                reason:
                    topic.familyMatches > 0
                        ? `${topic.familyRule.label} won on topic-specific wording before field extraction was applied.`
                        : `${topic.familyRule.label} currently has the strongest vocabulary match.`,
                calculatorIds: [...topic.familyRule.calculatorIds],
                contradictionPenalty: topic.contradictionPenalty,
            });
        }
    });

    return [...familyMap.values()].sort((left, right) => right.score - left.score);
}

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
        .replace(/(?<=\d),(?=\d)/g, "")
        .replace(/_/g, " ")
        .replace(/,/g, " ")
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
    return parseLooseNumber(value);
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
    const percentSuffix = options?.percent ? "\\s*%?" : "";
    const fillerWords = "(?:\\s+(?:is|are|was|were|=|:|of|for|at|to|worth|totals?|totaling|amounting|came|comes|comes to|stands at))?";
    const numericCapture = options?.allowCurrency === false
        ? "(-?(?:\\d[\\d,]*(?:\\.\\d+)?|\\(\\d[\\d,]*(?:\\.\\d+)?\\)))"
        : `(${FLEXIBLE_NUMBER_CAPTURE_PATTERN})`;

    return extractFirstNumber(text, [
        new RegExp(
        `(?:${joined})${fillerWords}\\s*${numericCapture}${percentSuffix}`,
        "i"
        ),
        new RegExp(
        `${numericCapture}${percentSuffix}${fillerWords}\\s*(?:${joined})`,
        "i"
        ),
        new RegExp(
        `(?:${joined})[^\\d\\n]{0,24}${numericCapture}${percentSuffix}`,
        "i"
        ),
        new RegExp(
        `${numericCapture}${percentSuffix}[^\\d\\n]{0,24}(?:${joined})`,
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
    [/\bretiring partner\b/g, "partnership retirement bonus"],
    [/\bpartner withdrawal\b/g, "partnership retirement bonus"],
    [/\bpay suppliers\b/g, "accounts payable turnover"],
    [/\bhow fast we pay creditors\b/g, "accounts payable turnover"],
    [/\binterest coverage\b/g, "times interest earned"],
    [/\bearnings cover interest\b/g, "times interest earned"],
    [/\bbook value of share\b/g, "book value per share"],
    [/\bequity per share\b/g, "book value per share"],
    [/\bfinancial leverage\b/g, "equity multiplier"],
    [/\bdupont leverage\b/g, "equity multiplier"],
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
    if (
        activeExtractionGuardContext?.allowedFields &&
        !activeExtractionGuardContext.allowedFields.has(key)
    ) return;
    if (target[key]) return;

    const sanitized = sanitizeExtractedFactValue(
        key,
        value,
        activeExtractionGuardContext?.query ?? ""
    );
    if (!sanitized) return;

    target[key] = sanitized;
    }

    function applyMirrors(facts: Partial<Record<FieldKey, string>>) {
    const canSet = (field: FieldKey) =>
        !activeExtractionGuardContext?.allowedFields ||
        activeExtractionGuardContext.allowedFields.has(field);

    if (facts.principal) {
        if (canSet("loanAmount") && !facts.loanAmount) facts.loanAmount = facts.principal;
        if (canSet("presentValue") && !facts.presentValue) facts.presentValue = facts.principal;
    }

    if (facts.loanAmount && !facts.principal && canSet("principal")) {
        facts.principal = facts.loanAmount;
    }

    if (facts.presentValue && !facts.principal && canSet("principal")) {
        facts.principal = facts.presentValue;
    }

    if (facts.rate && !facts.annualRate && canSet("annualRate")) {
        facts.annualRate = facts.rate;
    }

    if (facts.annualRate && !facts.rate && canSet("rate")) {
        facts.rate = facts.annualRate;
    }

    if (facts.time && !facts.years && canSet("years")) {
        facts.years = facts.time;
    }

    if (facts.years && !facts.time && canSet("time")) {
        facts.time = facts.years;
    }

    if (facts.revenue && !facts.sales && canSet("sales")) {
        facts.sales = facts.revenue;
    }

    if (facts.sales && !facts.revenue && canSet("revenue")) {
        facts.revenue = facts.sales;
    }

    if (facts.accountsReceivable && !facts.netReceivables && canSet("netReceivables")) {
        facts.netReceivables = facts.accountsReceivable;
    }

    if (facts.netReceivables && !facts.accountsReceivable && canSet("accountsReceivable")) {
        facts.accountsReceivable = facts.netReceivables;
    }

    if (facts.assets && !facts.averageTotalAssets && canSet("averageTotalAssets")) {
        facts.averageTotalAssets = facts.assets;
    }

    if (facts.averageTotalAssets && !facts.assets && canSet("assets")) {
        facts.assets = facts.averageTotalAssets;
    }

    if (facts.equity && !facts.averageEquity && canSet("averageEquity")) {
        facts.averageEquity = facts.equity;
    }

    if (facts.averageEquity && !facts.equity && canSet("equity")) {
        facts.equity = facts.averageEquity;
    }

    if (facts.equity && !facts.commonEquity && canSet("commonEquity")) {
        facts.commonEquity = facts.equity;
    }

    if (facts.sales && !facts.actualSales && canSet("actualSales")) {
        facts.actualSales = facts.sales;
    }

    if (facts.actualSales && !facts.sales && canSet("sales")) {
        facts.sales = facts.actualSales;
    }
    }

    /* -------------------------------------------------------------------------- */
    /* EXTRACTION */
    /* -------------------------------------------------------------------------- */

    export function extractFacts(
    query: string,
    allowedFields?: readonly FieldKey[]
    ): ExtractedFacts {
    const text = normalizeText(query);

    if (!text) {
        return {
        ...INITIAL_FIELDS,
        notes: [],
        };
    }

    const allowedFieldSet = allowedFields ? new Set(allowedFields) : undefined;

    return withExtractionGuardContext(
        {
            allowedFields: allowedFieldSet,
            query: text,
        },
        () => {

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

    const initialInvestment = extractNumberByAliases(
        text,
        FIELD_META.initialInvestment.aliases ?? []
    );
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
    const totalPartnershipCapital = extractNumberByAliases(
        text,
        FIELD_META.totalPartnershipCapital.aliases ?? []
    );
    const retiringPartnerCapital = extractNumberByAliases(
        text,
        FIELD_META.retiringPartnerCapital.aliases ?? []
    );
    const settlementPaid = extractNumberByAliases(text, FIELD_META.settlementPaid.aliases ?? []);
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
    const beginningCashBalance = extractNumberByAliases(
        text,
        FIELD_META.beginningCashBalance.aliases ?? []
    );
    const cashCollections = extractNumberByAliases(
        text,
        FIELD_META.cashCollections.aliases ?? []
    );
    const cashDisbursements = extractNumberByAliases(
        text,
        FIELD_META.cashDisbursements.aliases ?? []
    );
    const minimumCashBalance = extractNumberByAliases(
        text,
        FIELD_META.minimumCashBalance.aliases ?? []
    );
    const budgetedUnits = extractNumberByAliases(text, FIELD_META.budgetedUnits.aliases ?? [], {
        allowCurrency: false,
    });
    const actualUnits = extractNumberByAliases(text, FIELD_META.actualUnits.aliases ?? [], {
        allowCurrency: false,
    });
    const actualCost = extractNumberByAliases(text, FIELD_META.actualCost.aliases ?? []);
    const sales = extractNumberByAliases(text, FIELD_META.sales.aliases ?? []);
    const variableCosts = extractNumberByAliases(text, FIELD_META.variableCosts.aliases ?? []);
    const sellingPrice = extractNumberByAliases(text, FIELD_META.sellingPrice.aliases ?? []);
    const assets = extractNumberByAliases(text, FIELD_META.assets.aliases ?? []);
    const liabilities = extractNumberByAliases(text, FIELD_META.liabilities.aliases ?? []);
    const equity = extractNumberByAliases(text, FIELD_META.equity.aliases ?? []);
    const faceValue = extractNumberByAliases(text, FIELD_META.faceValue.aliases ?? []);
    const statedRate = extractNumberByAliases(text, FIELD_META.statedRate.aliases ?? [], {
        percent: true,
    });
    const marketRate = extractNumberByAliases(text, FIELD_META.marketRate.aliases ?? [], {
        percent: true,
    });
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
    const units = extractNumberByAliases(text, FIELD_META.units.aliases ?? [], {
        allowCurrency: false,
    });
    const unitsSold = extractNumberByAliases(text, FIELD_META.unitsSold.aliases ?? [], {
        allowCurrency: false,
    });
    const inventoryCost = extractNumberByAliases(text, FIELD_META.inventoryCost.aliases ?? []);
    const netRealizableValue = extractNumberByAliases(
        text,
        FIELD_META.netRealizableValue.aliases ?? []
    );

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
    const interestIncome = extractNumberByAliases(
        text,
        FIELD_META.interestIncome.aliases ?? []
    );
    const notesCollectedByBank = extractNumberByAliases(
        text,
        FIELD_META.notesCollectedByBank.aliases ?? []
    );
    const bankError = extractNumberByAliases(text, FIELD_META.bankError.aliases ?? []);
    const bookError = extractNumberByAliases(text, FIELD_META.bookError.aliases ?? []);
    const fundAmount = extractNumberByAliases(text, FIELD_META.fundAmount.aliases ?? []);
    const cashOnHand = extractNumberByAliases(text, FIELD_META.cashOnHand.aliases ?? []);
    const pettyCashVouchers = extractNumberByAliases(
        text,
        FIELD_META.pettyCashVouchers.aliases ?? []
    );
    const stampsOnHand = extractNumberByAliases(text, FIELD_META.stampsOnHand.aliases ?? []);
    const otherReceipts = extractNumberByAliases(text, FIELD_META.otherReceipts.aliases ?? []);
    const shortageOrOverage = extractNumberByAliases(
        text,
        FIELD_META.shortageOrOverage.aliases ?? []
    );
    const beginningPrepaid = extractNumberByAliases(
        text,
        FIELD_META.beginningPrepaid.aliases ?? []
    );
    const endingPrepaid = extractNumberByAliases(text, FIELD_META.endingPrepaid.aliases ?? []);
    const expenseRecognized = extractNumberByAliases(
        text,
        FIELD_META.expenseRecognized.aliases ?? []
    );
    const beginningUnearnedRevenue = extractNumberByAliases(
        text,
        FIELD_META.beginningUnearnedRevenue.aliases ?? []
    );
    const endingUnearnedRevenue = extractNumberByAliases(
        text,
        FIELD_META.endingUnearnedRevenue.aliases ?? []
    );
    const revenueRecognized = extractNumberByAliases(
        text,
        FIELD_META.revenueRecognized.aliases ?? []
    );
    const revenueEarned = extractNumberByAliases(text, FIELD_META.revenueEarned.aliases ?? []);
    const cashCollected = extractNumberByAliases(text, FIELD_META.cashCollected.aliases ?? []);
    const accruedRevenue = extractNumberByAliases(
        text,
        FIELD_META.accruedRevenue.aliases ?? []
    );
    const expenseIncurred = extractNumberByAliases(
        text,
        FIELD_META.expenseIncurred.aliases ?? []
    );
    const cashPaid = extractNumberByAliases(text, FIELD_META.cashPaid.aliases ?? []);
    const accruedExpense = extractNumberByAliases(text, FIELD_META.accruedExpense.aliases ?? []);
    const carryingAmount = extractNumberByAliases(text, FIELD_META.carryingAmount.aliases ?? []);
    const fairValueLessCostsToSell = extractNumberByAliases(
        text,
        FIELD_META.fairValueLessCostsToSell.aliases ?? []
    );
    const valueInUse = extractNumberByAliases(text, FIELD_META.valueInUse.aliases ?? []);
    const impairmentLoss = extractNumberByAliases(text, FIELD_META.impairmentLoss.aliases ?? []);
    const assetCost = extractNumberByAliases(text, FIELD_META.assetCost.aliases ?? []);
    const accumulatedDepreciation = extractNumberByAliases(
        text,
        FIELD_META.accumulatedDepreciation.aliases ?? []
    );
    const proceeds = extractNumberByAliases(text, FIELD_META.proceeds.aliases ?? []);
    const disposalCosts = extractNumberByAliases(text, FIELD_META.disposalCosts.aliases ?? []);
    const gainOrLoss = extractNumberByAliases(text, FIELD_META.gainOrLoss.aliases ?? []);
    const budgetedSalesUnits = extractNumberByAliases(
        text,
        FIELD_META.budgetedSalesUnits.aliases ?? [],
        { allowCurrency: false }
    );
    const desiredEndingFinishedGoodsUnits = extractNumberByAliases(
        text,
        FIELD_META.desiredEndingFinishedGoodsUnits.aliases ?? [],
        { allowCurrency: false }
    );
    const beginningFinishedGoodsUnits = extractNumberByAliases(
        text,
        FIELD_META.beginningFinishedGoodsUnits.aliases ?? [],
        { allowCurrency: false }
    );
    const requiredProductionUnits = extractNumberByAliases(
        text,
        FIELD_META.requiredProductionUnits.aliases ?? [],
        { allowCurrency: false }
    );
    const budgetedProductionUnits = extractNumberByAliases(
        text,
        FIELD_META.budgetedProductionUnits.aliases ?? [],
        { allowCurrency: false }
    );
    const materialsPerFinishedUnit = extractNumberByAliases(
        text,
        FIELD_META.materialsPerFinishedUnit.aliases ?? [],
        { allowCurrency: false }
    );
    const desiredEndingMaterialsUnits = extractNumberByAliases(
        text,
        FIELD_META.desiredEndingMaterialsUnits.aliases ?? [],
        { allowCurrency: false }
    );
    const beginningMaterialsUnits = extractNumberByAliases(
        text,
        FIELD_META.beginningMaterialsUnits.aliases ?? [],
        { allowCurrency: false }
    );
    const materialCostPerUnit = extractNumberByAliases(
        text,
        FIELD_META.materialCostPerUnit.aliases ?? []
    );
    const materialsToPurchaseUnits = extractNumberByAliases(
        text,
        FIELD_META.materialsToPurchaseUnits.aliases ?? [],
        { allowCurrency: false }
    );
    const purchasesCost = extractNumberByAliases(text, FIELD_META.purchasesCost.aliases ?? []);
    const directLaborHoursPerUnit = extractNumberByAliases(
        text,
        FIELD_META.directLaborHoursPerUnit.aliases ?? [],
        { allowCurrency: false }
    );
    const directLaborRatePerHour = extractNumberByAliases(
        text,
        FIELD_META.directLaborRatePerHour.aliases ?? []
    );
    const totalDirectLaborHours = extractNumberByAliases(
        text,
        FIELD_META.totalDirectLaborHours.aliases ?? [],
        { allowCurrency: false }
    );
    const totalDirectLaborCost = extractNumberByAliases(
        text,
        FIELD_META.totalDirectLaborCost.aliases ?? []
    );
    const variableOverheadRatePerUnit = extractNumberByAliases(
        text,
        FIELD_META.variableOverheadRatePerUnit.aliases ?? []
    );
    const fixedOverheadBudget = extractNumberByAliases(
        text,
        FIELD_META.fixedOverheadBudget.aliases ?? []
    );
    const variableFactoryOverheadBudget = extractNumberByAliases(
        text,
        FIELD_META.variableFactoryOverheadBudget.aliases ?? []
    );
    const totalFactoryOverheadBudget = extractNumberByAliases(
        text,
        FIELD_META.totalFactoryOverheadBudget.aliases ?? []
    );
    const budgetedCostOfGoodsSold = extractNumberByAliases(
        text,
        FIELD_META.budgetedCostOfGoodsSold.aliases ?? []
    );
    const desiredEndingInventoryCost = extractNumberByAliases(
        text,
        FIELD_META.desiredEndingInventoryCost.aliases ?? []
    );
    const beginningInventoryCost = extractNumberByAliases(
        text,
        FIELD_META.beginningInventoryCost.aliases ?? []
    );
    const purchasesRequiredCost = extractNumberByAliases(
        text,
        FIELD_META.purchasesRequiredCost.aliases ?? []
    );
    const budgetedSalesAmount = extractNumberByAliases(
        text,
        FIELD_META.budgetedSalesAmount.aliases ?? []
    );
    const specialOrderUnits = extractNumberByAliases(
        text,
        FIELD_META.specialOrderUnits.aliases ?? [],
        { allowCurrency: false }
    );
    const specialOrderPricePerUnit = extractNumberByAliases(
        text,
        FIELD_META.specialOrderPricePerUnit.aliases ?? []
    );
    const incrementalFixedCosts = extractNumberByAliases(
        text,
        FIELD_META.incrementalFixedCosts.aliases ?? []
    );
    const incrementalRevenue = extractNumberByAliases(
        text,
        FIELD_META.incrementalRevenue.aliases ?? []
    );
    const incrementalCost = extractNumberByAliases(
        text,
        FIELD_META.incrementalCost.aliases ?? []
    );
    const incrementalProfit = extractNumberByAliases(
        text,
        FIELD_META.incrementalProfit.aliases ?? []
    );
    const minimumAcceptablePricePerUnit = extractNumberByAliases(
        text,
        FIELD_META.minimumAcceptablePricePerUnit.aliases ?? []
    );
    const unitsNeeded = extractNumberByAliases(
        text,
        FIELD_META.unitsNeeded.aliases ?? [],
        { allowCurrency: false }
    );
    const variableManufacturingCostPerUnit = extractNumberByAliases(
        text,
        FIELD_META.variableManufacturingCostPerUnit.aliases ?? []
    );
    const avoidableFixedCosts = extractNumberByAliases(
        text,
        FIELD_META.avoidableFixedCosts.aliases ?? []
    );
    const purchasePricePerUnit = extractNumberByAliases(
        text,
        FIELD_META.purchasePricePerUnit.aliases ?? []
    );
    const relevantMakeCost = extractNumberByAliases(
        text,
        FIELD_META.relevantMakeCost.aliases ?? []
    );
    const relevantBuyCost = extractNumberByAliases(
        text,
        FIELD_META.relevantBuyCost.aliases ?? []
    );
    const costAdvantageAmount = extractNumberByAliases(
        text,
        FIELD_META.costAdvantageAmount.aliases ?? []
    );
    const maximumAcceptablePurchasePricePerUnit = extractNumberByAliases(
        text,
        FIELD_META.maximumAcceptablePurchasePricePerUnit.aliases ?? []
    );
    const salesValueAtSplitoffPerUnit = extractNumberByAliases(
        text,
        FIELD_META.salesValueAtSplitoffPerUnit.aliases ?? []
    );
    const salesValueAfterProcessingPerUnit = extractNumberByAliases(
        text,
        FIELD_META.salesValueAfterProcessingPerUnit.aliases ?? []
    );
    const separableProcessingCostPerUnit = extractNumberByAliases(
        text,
        FIELD_META.separableProcessingCostPerUnit.aliases ?? []
    );
    const incrementalRevenueFromProcessing = extractNumberByAliases(
        text,
        FIELD_META.incrementalRevenueFromProcessing.aliases ?? []
    );
    const incrementalProfitFromProcessing = extractNumberByAliases(
        text,
        FIELD_META.incrementalProfitFromProcessing.aliases ?? []
    );
    const minimumFurtherProcessingPricePerUnit = extractNumberByAliases(
        text,
        FIELD_META.minimumFurtherProcessingPricePerUnit.aliases ?? []
    );
    const constrainedResourceUnitsPerProduct = extractNumberByAliases(
        text,
        FIELD_META.constrainedResourceUnitsPerProduct.aliases ?? [],
        { allowCurrency: false }
    );
    const constrainedResourceAvailableUnits = extractNumberByAliases(
        text,
        FIELD_META.constrainedResourceAvailableUnits.aliases ?? [],
        { allowCurrency: false }
    );
    const contributionMarginPerConstraintUnit = extractNumberByAliases(
        text,
        FIELD_META.contributionMarginPerConstraintUnit.aliases ?? []
    );
    const maximumUnitsFromConstraint = extractNumberByAliases(
        text,
        FIELD_META.maximumUnitsFromConstraint.aliases ?? [],
        { allowCurrency: false }
    );
    const totalContributionMarginAtConstraint = extractNumberByAliases(
        text,
        FIELD_META.totalContributionMarginAtConstraint.aliases ?? []
    );
    const actualResultAmount = extractNumberByAliases(
        text,
        FIELD_META.actualResultAmount.aliases ?? []
    );
    const flexibleBudgetAmount = extractNumberByAliases(
        text,
        FIELD_META.flexibleBudgetAmount.aliases ?? []
    );
    const staticBudgetAmount = extractNumberByAliases(
        text,
        FIELD_META.staticBudgetAmount.aliases ?? []
    );
    const spendingVariance = extractNumberByAliases(
        text,
        FIELD_META.spendingVariance.aliases ?? []
    );
    const activityVariance = extractNumberByAliases(
        text,
        FIELD_META.activityVariance.aliases ?? []
    );
    const totalBudgetVariance = extractNumberByAliases(
        text,
        FIELD_META.totalBudgetVariance.aliases ?? []
    );
    const taxableSalesAmount = extractNumberByAliases(
        text,
        FIELD_META.taxableSalesAmount.aliases ?? []
    );
    const vatablePurchasesAmount = extractNumberByAliases(
        text,
        FIELD_META.vatablePurchasesAmount.aliases ?? []
    );
    const vatRatePercent = extractNumberByAliases(
        text,
        FIELD_META.vatRatePercent.aliases ?? [],
        { percent: true }
    );
    const netVatPayable = extractNumberByAliases(
        text,
        FIELD_META.netVatPayable.aliases ?? []
    );
    const variableExpenseRatePercent = extractNumberByAliases(
        text,
        FIELD_META.variableExpenseRatePercent.aliases ?? [],
        { percent: true }
    );
    const fixedOperatingExpenses = extractNumberByAliases(
        text,
        FIELD_META.fixedOperatingExpenses.aliases ?? []
    );
    const nonCashOperatingExpenses = extractNumberByAliases(
        text,
        FIELD_META.nonCashOperatingExpenses.aliases ?? []
    );
    const totalOperatingExpenses = extractNumberByAliases(
        text,
        FIELD_META.totalOperatingExpenses.aliases ?? []
    );
    const cashOperatingExpenses = extractNumberByAliases(
        text,
        FIELD_META.cashOperatingExpenses.aliases ?? []
    );
    const grossProfit = extractNumberByAliases(text, FIELD_META.grossProfit.aliases ?? []);
    const incomeBeforeTax = extractNumberByAliases(
        text,
        FIELD_META.incomeBeforeTax.aliases ?? []
    );
    const dividendsDeclared = extractNumberByAliases(
        text,
        FIELD_META.dividendsDeclared.aliases ?? []
    );
    const investorShareInIncome = extractNumberByAliases(
        text,
        FIELD_META.investorShareInIncome.aliases ?? []
    );
    const dividendsReceived = extractNumberByAliases(
        text,
        FIELD_META.dividendsReceived.aliases ?? []
    );
    const endingInvestmentBalance = extractNumberByAliases(
        text,
        FIELD_META.endingInvestmentBalance.aliases ?? []
    );
    const maturityValue = extractNumberByAliases(text, FIELD_META.maturityValue.aliases ?? []);
    const bankDiscountAmount = extractNumberByAliases(
        text,
        FIELD_META.bankDiscountAmount.aliases ?? []
    );
    const proceedsFromDiscounting = extractNumberByAliases(
        text,
        FIELD_META.proceedsFromDiscounting.aliases ?? []
    );
    const transferPrice =
        extractNumberByAliases(text, FIELD_META.transferPrice.aliases ?? []) ??
        extractFirstNumber(text, [
            /(?:sold|transferred)\s+(?:equipment|asset|ppe|property|machine|machinery)[\s\S]{0,80}?\b(?:to\s+(?:the\s+)?(?:subsidiary|parent|affiliate|related party))[\s\S]{0,30}?\bfor\s*[\u20B1$]?(-?\d+(?:\.\d+)?)/i,
            /(?:intercompany|intra[- ]group)\s+(?:sale|transfer)[\s\S]{0,40}?\bfor\s*[\u20B1$]?(-?\d+(?:\.\d+)?)/i,
        ]);
    const markupRateOnCostPercent = extractNumberByAliases(
        text,
        FIELD_META.markupRateOnCostPercent.aliases ?? [],
        { percent: true }
    );
    const percentUnsoldAtPeriodEnd = extractNumberByAliases(
        text,
        FIELD_META.percentUnsoldAtPeriodEnd.aliases ?? [],
        { percent: true }
    );
    const unrealizedProfitInEndingInventory = extractNumberByAliases(
        text,
        FIELD_META.unrealizedProfitInEndingInventory.aliases ?? []
    );
    const annualExcessDepreciation = extractNumberByAliases(
        text,
        FIELD_META.annualExcessDepreciation.aliases ?? []
    );
    const unamortizedIntercompanyProfit = extractNumberByAliases(
        text,
        FIELD_META.unamortizedIntercompanyProfit.aliases ?? []
    );
    const taxBase = extractNumberByAliases(text, FIELD_META.taxBase.aliases ?? []);
    const ratePercent = extractNumberByAliases(text, FIELD_META.ratePercent.aliases ?? [], {
        percent: true,
    });
    const taxWithheld = extractNumberByAliases(text, FIELD_META.taxWithheld.aliases ?? []);
    const period1Demand = extractNumberByAliases(
        text,
        FIELD_META.period1Demand.aliases ?? [],
        { allowCurrency: false }
    );
    const period2Demand = extractNumberByAliases(
        text,
        FIELD_META.period2Demand.aliases ?? [],
        { allowCurrency: false }
    );
    const period3Demand = extractNumberByAliases(
        text,
        FIELD_META.period3Demand.aliases ?? [],
        { allowCurrency: false }
    );
    const weight1Percent = extractNumberByAliases(text, FIELD_META.weight1Percent.aliases ?? [], {
        percent: true,
    });
    const weight2Percent = extractNumberByAliases(text, FIELD_META.weight2Percent.aliases ?? [], {
        percent: true,
    });
    const weight3Percent = extractNumberByAliases(text, FIELD_META.weight3Percent.aliases ?? [], {
        percent: true,
    });
    const simpleMovingAverageForecast = extractNumberByAliases(
        text,
        FIELD_META.simpleMovingAverageForecast.aliases ?? [],
        { allowCurrency: false }
    );
    const weightedMovingAverageForecast = extractNumberByAliases(
        text,
        FIELD_META.weightedMovingAverageForecast.aliases ?? [],
        { allowCurrency: false }
    );
    const actualUnitsSold = extractNumberByAliases(
        text,
        FIELD_META.actualUnitsSold.aliases ?? [],
        { allowCurrency: false }
    );
    const budgetedUnitsSold = extractNumberByAliases(
        text,
        FIELD_META.budgetedUnitsSold.aliases ?? [],
        { allowCurrency: false }
    );
    const budgetedContributionMarginPerUnit = extractNumberByAliases(
        text,
        FIELD_META.budgetedContributionMarginPerUnit.aliases ?? []
    );
    const salesVolumeVariance = extractNumberByAliases(
        text,
        FIELD_META.salesVolumeVariance.aliases ?? []
    );
    const actualTotalUnitsSold = extractNumberByAliases(
        text,
        FIELD_META.actualTotalUnitsSold.aliases ?? [],
        { allowCurrency: false }
    );
    const actualProductUnitsSold = extractNumberByAliases(
        text,
        FIELD_META.actualProductUnitsSold.aliases ?? [],
        { allowCurrency: false }
    );
    const budgetedMixPercent = extractNumberByAliases(
        text,
        FIELD_META.budgetedMixPercent.aliases ?? [],
        { percent: true }
    );
    const actualMixPercent = extractNumberByAliases(
        text,
        FIELD_META.actualMixPercent.aliases ?? [],
        { percent: true }
    );
    const salesMixVariance = extractNumberByAliases(
        text,
        FIELD_META.salesMixVariance.aliases ?? []
    );
    const averageDailyUsage = extractNumberByAliases(
        text,
        FIELD_META.averageDailyUsage.aliases ?? [],
        { allowCurrency: false }
    );
    const maxDailyUsage = extractNumberByAliases(
        text,
        FIELD_META.maxDailyUsage.aliases ?? [],
        { allowCurrency: false }
    );
    const averageLeadTimeDays = extractNumberByAliases(
        text,
        FIELD_META.averageLeadTimeDays.aliases ?? [],
        { allowCurrency: false }
    );
    const maxLeadTimeDays = extractNumberByAliases(
        text,
        FIELD_META.maxLeadTimeDays.aliases ?? [],
        { allowCurrency: false }
    );
    const safetyStock = extractNumberByAliases(text, FIELD_META.safetyStock.aliases ?? [], {
        allowCurrency: false,
    });
    const reorderPoint = extractNumberByAliases(text, FIELD_META.reorderPoint.aliases ?? [], {
        allowCurrency: false,
    });
    const grossEstate = extractNumberByAliases(text, FIELD_META.grossEstate.aliases ?? []);
    const allowableDeductions = extractNumberByAliases(
        text,
        FIELD_META.allowableDeductions.aliases ?? []
    );
    const taxRatePercent = extractNumberByAliases(
        text,
        FIELD_META.taxRatePercent.aliases ?? [],
        { percent: true }
    );
    const netEstate = extractNumberByAliases(text, FIELD_META.netEstate.aliases ?? []);
    const estateTaxDue = extractNumberByAliases(text, FIELD_META.estateTaxDue.aliases ?? []);
    const grossGift = extractNumberByAliases(text, FIELD_META.grossGift.aliases ?? []);
    const taxableGift = extractNumberByAliases(text, FIELD_META.taxableGift.aliases ?? []);
    const donorsTaxDue = extractNumberByAliases(text, FIELD_META.donorsTaxDue.aliases ?? []);
    const taxableBaseAmount = extractNumberByAliases(
        text,
        FIELD_META.taxableBaseAmount.aliases ?? []
    );
    const taxableUnitSize = extractNumberByAliases(
        text,
        FIELD_META.taxableUnitSize.aliases ?? []
    );
    const ratePerUnit = extractNumberByAliases(text, FIELD_META.ratePerUnit.aliases ?? []);
    const taxableUnits = extractNumberByAliases(text, FIELD_META.taxableUnits.aliases ?? [], {
        allowCurrency: false,
    });
    const documentaryStampTaxDue = extractNumberByAliases(
        text,
        FIELD_META.documentaryStampTaxDue.aliases ?? []
    );
    const commissionRatePercent = extractNumberByAliases(
        text,
        FIELD_META.commissionRatePercent.aliases ?? [],
        { percent: true }
    );
    const freightAndOtherExpenses = extractNumberByAliases(
        text,
        FIELD_META.freightAndOtherExpenses.aliases ?? []
    );
    const advancesRemitted = extractNumberByAliases(
        text,
        FIELD_META.advancesRemitted.aliases ?? []
    );
    const commissionAmount = extractNumberByAliases(
        text,
        FIELD_META.commissionAmount.aliases ?? []
    );
    const cashStillDueToConsignor = extractNumberByAliases(
        text,
        FIELD_META.cashStillDueToConsignor.aliases ?? []
    );
    const billedPriceInventory = extractNumberByAliases(
        text,
        FIELD_META.billedPriceInventory.aliases ?? []
    );
    const loadingPercentOnCost = extractNumberByAliases(
        text,
        FIELD_META.loadingPercentOnCost.aliases ?? [],
        { percent: true }
    );
    const loadingRateOnBilledPrice = extractNumberByAliases(
        text,
        FIELD_META.loadingRateOnBilledPrice.aliases ?? [],
        { percent: true }
    );
    const inventoryLoadingAllowance = extractNumberByAliases(
        text,
        FIELD_META.inventoryLoadingAllowance.aliases ?? []
    );
    const inventoryAtCost = extractNumberByAliases(text, FIELD_META.inventoryAtCost.aliases ?? []);
    const totalDividendsDeclared = extractNumberByAliases(
        text,
        FIELD_META.totalDividendsDeclared.aliases ?? []
    );
    const preferredShares = extractNumberByAliases(
        text,
        FIELD_META.preferredShares.aliases ?? [],
        { allowCurrency: false }
    );
    const preferredParValue = extractNumberByAliases(
        text,
        FIELD_META.preferredParValue.aliases ?? []
    );
    const preferredDividendRatePercent = extractNumberByAliases(
        text,
        FIELD_META.preferredDividendRatePercent.aliases ?? [],
        { percent: true }
    );
    const yearsInArrears = extractNumberByAliases(
        text,
        FIELD_META.yearsInArrears.aliases ?? [],
        { allowCurrency: false }
    );
    const commonSharesOutstanding = extractNumberByAliases(
        text,
        FIELD_META.commonSharesOutstanding.aliases ?? [],
        { allowCurrency: false }
    );
    const preferredDividendAllocated = extractNumberByAliases(
        text,
        FIELD_META.preferredDividendAllocated.aliases ?? []
    );
    const commonDividendAllocated = extractNumberByAliases(
        text,
        FIELD_META.commonDividendAllocated.aliases ?? []
    );
    const commonDividendPerShare = extractNumberByAliases(
        text,
        FIELD_META.commonDividendPerShare.aliases ?? []
    );

    const creditTerms = extractCreditTerms(text);
    const partnershipRatios = extractPartnershipRatios(text);

    setFact(facts, "principal", principal);
    setFact(facts, "initialInvestment", initialInvestment);
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
    setFact(facts, "beginningCashBalance", beginningCashBalance);
    setFact(facts, "cashCollections", cashCollections);
    setFact(facts, "cashDisbursements", cashDisbursements);
    setFact(facts, "minimumCashBalance", minimumCashBalance);
    setFact(facts, "budgetedUnits", budgetedUnits);
    setFact(facts, "actualUnits", actualUnits);
    setFact(facts, "actualCost", actualCost);
    setFact(facts, "sellingPricePerUnit", sellingPricePerUnit);
    setFact(facts, "variableCostPerUnit", variableCostPerUnit);
    setFact(facts, "sales", sales);
    setFact(facts, "variableCosts", variableCosts);
    setFact(facts, "sellingPrice", sellingPrice);
    setFact(facts, "assets", assets);
    setFact(facts, "liabilities", liabilities);
    setFact(facts, "equity", equity);
    setFact(facts, "faceValue", faceValue);
    setFact(facts, "statedRate", statedRate);
    setFact(facts, "marketRate", marketRate);
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
    setFact(facts, "units", units);
    setFact(facts, "unitsSold", unitsSold);
    setFact(facts, "inventoryCost", inventoryCost);
    setFact(facts, "netRealizableValue", netRealizableValue);

    setFact(facts, "netSales", netSales);
    setFact(facts, "grossProfitRate", grossProfitRate);
    setFact(facts, "costOfGoodsAvailable", costOfGoodsAvailable);

    setFact(facts, "bankBalance", bankBalance);
    setFact(facts, "bookBalance", bookBalance);
    setFact(facts, "depositsInTransit", depositsInTransit);
    setFact(facts, "outstandingChecks", outstandingChecks);
    setFact(facts, "serviceCharges", serviceCharges);
    setFact(facts, "nsfChecks", nsfChecks);
    setFact(facts, "interestIncome", interestIncome);
    setFact(facts, "notesCollectedByBank", notesCollectedByBank);
    setFact(facts, "bankError", bankError);
    setFact(facts, "bookError", bookError);
    setFact(facts, "fundAmount", fundAmount);
    setFact(facts, "cashOnHand", cashOnHand);
    setFact(facts, "pettyCashVouchers", pettyCashVouchers);
    setFact(facts, "stampsOnHand", stampsOnHand);
    setFact(facts, "otherReceipts", otherReceipts);
    setFact(facts, "shortageOrOverage", shortageOrOverage);
    setFact(facts, "beginningPrepaid", beginningPrepaid);
    setFact(facts, "endingPrepaid", endingPrepaid);
    setFact(facts, "expenseRecognized", expenseRecognized);
    setFact(facts, "beginningUnearnedRevenue", beginningUnearnedRevenue);
    setFact(facts, "endingUnearnedRevenue", endingUnearnedRevenue);
    setFact(facts, "revenueRecognized", revenueRecognized);
    setFact(facts, "revenueEarned", revenueEarned);
    setFact(facts, "cashCollected", cashCollected);
    setFact(facts, "accruedRevenue", accruedRevenue);
    setFact(facts, "expenseIncurred", expenseIncurred);
    setFact(facts, "cashPaid", cashPaid);
    setFact(facts, "accruedExpense", accruedExpense);
    setFact(facts, "carryingAmount", carryingAmount);
    setFact(facts, "fairValueLessCostsToSell", fairValueLessCostsToSell);
    setFact(facts, "valueInUse", valueInUse);
    setFact(facts, "impairmentLoss", impairmentLoss);
    setFact(facts, "assetCost", assetCost);
    setFact(facts, "accumulatedDepreciation", accumulatedDepreciation);
    setFact(facts, "proceeds", proceeds);
    setFact(facts, "disposalCosts", disposalCosts);
    setFact(facts, "gainOrLoss", gainOrLoss);
    setFact(facts, "budgetedSalesUnits", budgetedSalesUnits);
    setFact(facts, "desiredEndingFinishedGoodsUnits", desiredEndingFinishedGoodsUnits);
    setFact(facts, "beginningFinishedGoodsUnits", beginningFinishedGoodsUnits);
    setFact(facts, "requiredProductionUnits", requiredProductionUnits);
    setFact(facts, "budgetedProductionUnits", budgetedProductionUnits);
    setFact(facts, "materialsPerFinishedUnit", materialsPerFinishedUnit);
    setFact(facts, "desiredEndingMaterialsUnits", desiredEndingMaterialsUnits);
    setFact(facts, "beginningMaterialsUnits", beginningMaterialsUnits);
    setFact(facts, "materialCostPerUnit", materialCostPerUnit);
    setFact(facts, "materialsToPurchaseUnits", materialsToPurchaseUnits);
    setFact(facts, "purchasesCost", purchasesCost);
    setFact(facts, "directLaborHoursPerUnit", directLaborHoursPerUnit);
    setFact(facts, "directLaborRatePerHour", directLaborRatePerHour);
    setFact(facts, "totalDirectLaborHours", totalDirectLaborHours);
    setFact(facts, "totalDirectLaborCost", totalDirectLaborCost);
    setFact(facts, "variableOverheadRatePerUnit", variableOverheadRatePerUnit);
    setFact(facts, "fixedOverheadBudget", fixedOverheadBudget);
    setFact(facts, "variableFactoryOverheadBudget", variableFactoryOverheadBudget);
    setFact(facts, "totalFactoryOverheadBudget", totalFactoryOverheadBudget);
    setFact(facts, "budgetedCostOfGoodsSold", budgetedCostOfGoodsSold);
    setFact(facts, "desiredEndingInventoryCost", desiredEndingInventoryCost);
    setFact(facts, "beginningInventoryCost", beginningInventoryCost);
    setFact(facts, "purchasesRequiredCost", purchasesRequiredCost);
    setFact(facts, "budgetedSalesAmount", budgetedSalesAmount);
    setFact(facts, "specialOrderUnits", specialOrderUnits);
    setFact(facts, "specialOrderPricePerUnit", specialOrderPricePerUnit);
    setFact(facts, "incrementalFixedCosts", incrementalFixedCosts);
    setFact(facts, "incrementalRevenue", incrementalRevenue);
    setFact(facts, "incrementalCost", incrementalCost);
    setFact(facts, "incrementalProfit", incrementalProfit);
    setFact(facts, "minimumAcceptablePricePerUnit", minimumAcceptablePricePerUnit);
    setFact(facts, "unitsNeeded", unitsNeeded);
    setFact(facts, "variableManufacturingCostPerUnit", variableManufacturingCostPerUnit);
    setFact(facts, "avoidableFixedCosts", avoidableFixedCosts);
    setFact(facts, "purchasePricePerUnit", purchasePricePerUnit);
    setFact(facts, "relevantMakeCost", relevantMakeCost);
    setFact(facts, "relevantBuyCost", relevantBuyCost);
    setFact(facts, "costAdvantageAmount", costAdvantageAmount);
    setFact(facts, "maximumAcceptablePurchasePricePerUnit", maximumAcceptablePurchasePricePerUnit);
    setFact(facts, "salesValueAtSplitoffPerUnit", salesValueAtSplitoffPerUnit);
    setFact(facts, "salesValueAfterProcessingPerUnit", salesValueAfterProcessingPerUnit);
    setFact(facts, "separableProcessingCostPerUnit", separableProcessingCostPerUnit);
    setFact(facts, "incrementalRevenueFromProcessing", incrementalRevenueFromProcessing);
    setFact(facts, "incrementalProfitFromProcessing", incrementalProfitFromProcessing);
    setFact(facts, "minimumFurtherProcessingPricePerUnit", minimumFurtherProcessingPricePerUnit);
    setFact(facts, "constrainedResourceUnitsPerProduct", constrainedResourceUnitsPerProduct);
    setFact(facts, "constrainedResourceAvailableUnits", constrainedResourceAvailableUnits);
    setFact(facts, "contributionMarginPerConstraintUnit", contributionMarginPerConstraintUnit);
    setFact(facts, "maximumUnitsFromConstraint", maximumUnitsFromConstraint);
    setFact(facts, "totalContributionMarginAtConstraint", totalContributionMarginAtConstraint);
    setFact(facts, "actualResultAmount", actualResultAmount);
    setFact(facts, "flexibleBudgetAmount", flexibleBudgetAmount);
    setFact(facts, "staticBudgetAmount", staticBudgetAmount);
    setFact(facts, "spendingVariance", spendingVariance);
    setFact(facts, "activityVariance", activityVariance);
    setFact(facts, "totalBudgetVariance", totalBudgetVariance);
    setFact(facts, "taxableSalesAmount", taxableSalesAmount);
    setFact(facts, "vatablePurchasesAmount", vatablePurchasesAmount);
    setFact(facts, "vatRatePercent", vatRatePercent);
    setFact(facts, "netVatPayable", netVatPayable);
    setFact(facts, "variableExpenseRatePercent", variableExpenseRatePercent);
    setFact(facts, "fixedOperatingExpenses", fixedOperatingExpenses);
    setFact(facts, "nonCashOperatingExpenses", nonCashOperatingExpenses);
    setFact(facts, "totalOperatingExpenses", totalOperatingExpenses);
    setFact(facts, "cashOperatingExpenses", cashOperatingExpenses);
    setFact(facts, "grossProfit", grossProfit);
    setFact(facts, "incomeBeforeTax", incomeBeforeTax);
    setFact(facts, "dividendsDeclared", dividendsDeclared);
    setFact(facts, "investorShareInIncome", investorShareInIncome);
    setFact(facts, "dividendsReceived", dividendsReceived);
    setFact(facts, "endingInvestmentBalance", endingInvestmentBalance);
    setFact(facts, "maturityValue", maturityValue);
    setFact(facts, "bankDiscountAmount", bankDiscountAmount);
    setFact(facts, "proceedsFromDiscounting", proceedsFromDiscounting);
    setFact(facts, "transferPrice", transferPrice);
    setFact(facts, "markupRateOnCostPercent", markupRateOnCostPercent);
    setFact(facts, "percentUnsoldAtPeriodEnd", percentUnsoldAtPeriodEnd);
    setFact(facts, "unrealizedProfitInEndingInventory", unrealizedProfitInEndingInventory);
    setFact(facts, "annualExcessDepreciation", annualExcessDepreciation);
    setFact(facts, "unamortizedIntercompanyProfit", unamortizedIntercompanyProfit);
    setFact(facts, "taxBase", taxBase);
    setFact(facts, "ratePercent", ratePercent);
    setFact(facts, "taxWithheld", taxWithheld);
    setFact(facts, "period1Demand", period1Demand);
    setFact(facts, "period2Demand", period2Demand);
    setFact(facts, "period3Demand", period3Demand);
    setFact(facts, "weight1Percent", weight1Percent);
    setFact(facts, "weight2Percent", weight2Percent);
    setFact(facts, "weight3Percent", weight3Percent);
    setFact(facts, "simpleMovingAverageForecast", simpleMovingAverageForecast);
    setFact(facts, "weightedMovingAverageForecast", weightedMovingAverageForecast);
    setFact(facts, "actualUnitsSold", actualUnitsSold);
    setFact(facts, "budgetedUnitsSold", budgetedUnitsSold);
    setFact(
        facts,
        "budgetedContributionMarginPerUnit",
        budgetedContributionMarginPerUnit
    );
    setFact(facts, "salesVolumeVariance", salesVolumeVariance);
    setFact(facts, "actualTotalUnitsSold", actualTotalUnitsSold);
    setFact(facts, "actualProductUnitsSold", actualProductUnitsSold);
    setFact(facts, "budgetedMixPercent", budgetedMixPercent);
    setFact(facts, "actualMixPercent", actualMixPercent);
    setFact(facts, "salesMixVariance", salesMixVariance);
    setFact(facts, "averageDailyUsage", averageDailyUsage);
    setFact(facts, "maxDailyUsage", maxDailyUsage);
    setFact(facts, "averageLeadTimeDays", averageLeadTimeDays);
    setFact(facts, "maxLeadTimeDays", maxLeadTimeDays);
    setFact(facts, "safetyStock", safetyStock);
    setFact(facts, "reorderPoint", reorderPoint);
    setFact(facts, "grossEstate", grossEstate);
    setFact(facts, "allowableDeductions", allowableDeductions);
    setFact(facts, "taxRatePercent", taxRatePercent);
    setFact(facts, "netEstate", netEstate);
    setFact(facts, "estateTaxDue", estateTaxDue);
    setFact(facts, "grossGift", grossGift);
    setFact(facts, "taxableGift", taxableGift);
    setFact(facts, "donorsTaxDue", donorsTaxDue);
    setFact(facts, "taxableBaseAmount", taxableBaseAmount);
    setFact(facts, "taxableUnitSize", taxableUnitSize);
    setFact(facts, "ratePerUnit", ratePerUnit);
    setFact(facts, "taxableUnits", taxableUnits);
    setFact(facts, "documentaryStampTaxDue", documentaryStampTaxDue);
    setFact(facts, "commissionRatePercent", commissionRatePercent);
    setFact(facts, "freightAndOtherExpenses", freightAndOtherExpenses);
    setFact(facts, "advancesRemitted", advancesRemitted);
    setFact(facts, "commissionAmount", commissionAmount);
    setFact(facts, "cashStillDueToConsignor", cashStillDueToConsignor);
    setFact(facts, "billedPriceInventory", billedPriceInventory);
    setFact(facts, "loadingPercentOnCost", loadingPercentOnCost);
    setFact(facts, "loadingRateOnBilledPrice", loadingRateOnBilledPrice);
    setFact(facts, "inventoryLoadingAllowance", inventoryLoadingAllowance);
    setFact(facts, "inventoryAtCost", inventoryAtCost);
    setFact(facts, "totalDividendsDeclared", totalDividendsDeclared);
    setFact(facts, "preferredShares", preferredShares);
    setFact(facts, "preferredParValue", preferredParValue);
    setFact(facts, "preferredDividendRatePercent", preferredDividendRatePercent);
    setFact(facts, "yearsInArrears", yearsInArrears);
    setFact(facts, "commonSharesOutstanding", commonSharesOutstanding);
    setFact(facts, "preferredDividendAllocated", preferredDividendAllocated);
    setFact(facts, "commonDividendAllocated", commonDividendAllocated);
    setFact(facts, "commonDividendPerShare", commonDividendPerShare);

    setFact(facts, "accountsReceivable", accountsReceivable);
    setFact(facts, "estimatedUncollectibleRate", estimatedUncollectibleRate);
    setFact(facts, "partnershipAmount", partnershipAmount);
    setFact(facts, "totalOldCapital", totalOldCapital);
    setFact(facts, "partnerInvestment", partnerInvestment);
    setFact(facts, "ownershipPercentage", ownershipPercentage);
    setFact(facts, "totalPartnershipCapital", totalPartnershipCapital);
    setFact(facts, "retiringPartnerCapital", retiringPartnerCapital);
    setFact(facts, "settlementPaid", settlementPaid);
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
    );
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
    query: string,
    topicScore = 0,
    fieldScore = 0
    ): string {
    const matchedFields = calculator.required.filter((field) => merged[field] !== "");
    const matchedKeywords = calculator.keywords.filter((keyword) => keyword.test(query)).length;
    const matchedAliases = countPhraseMatches(query, calculator.aliases);
    const routeFamily = getRouteFamilyRule(calculator);

    if (
        matchedFields.length === calculator.required.length &&
        (matchedKeywords > 0 || matchedAliases > 0)
    ) {
        return `Won on ${routeFamily.label.toLowerCase()} topic evidence and matched all required values (${matchedFields
        .map(humanizeField)
        .join(", ")}) and recognized related accounting vocabulary from your natural-language input.`;
    }

    if (matchedFields.length === calculator.required.length && topicScore > 0) {
        return `Won on topic-specific language and matched all required values: ${matchedFields
            .map(humanizeField)
            .join(", ")}.`;
    }

    if (matchedFields.length > 0) {
        return `Won on ${topicScore}% topic fit and ${fieldScore}% route-specific extraction. It matched ${matchedFields
        .map(humanizeField)
        .join(", ")} but still needs ${calculator.required
        .filter((field) => merged[field] === "")
        .map(humanizeField)
        .join(", ")}.`;
    }

    if (topicScore > 0) {
        return `The route won mainly on topic wording. Review the prepared values before trusting it because the extraction is still thin.`;
    }

    return calculator.description;
    }

function scoreFieldContribution(
    calculator: CalculatorConfig,
    merged: FieldsState,
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

    if (presentRequired.length === 0 && missingRequired.length > 0) {
        score -= 5;
    }

    return Math.max(0, Math.min(100, score));
    }

export function scoreCalculator(
    calculator: CalculatorConfig,
    merged: FieldsState,
    extracted: ExtractedFacts,
    topicScore: number,
    contradictionPenalty: number,
    familyGatePenalty: number
    ): number {
    const fieldScore = scoreFieldContribution(calculator, merged, extracted);
    return clampScore(topicScore + fieldScore - contradictionPenalty - familyGatePenalty);
    }

    export function confidenceLabel(score: number): ConfidenceLabel {
    if (score >= 80) return "High";
    if (score >= 55) return "Good";
    if (score >= 35) return "Possible";
    return "Low";
    }

    export function buildFollowUp(
    best: RankedCalculator | null,
    secondBest: RankedCalculator | null,
    query = "",
    topicFamily: TopicFamilyMatch | null = null,
    warnings: string[] = []
    ): string {
    if (isStudyFirstPrompt(query)) {
        return "This reads more like a study or explanation prompt than a single calculator request. Review the lesson suggestions first or keep the route in review mode.";
    }

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

    if (warnings.length > 0) {
        return warnings[0];
    }

    if (best.missing.length > 0) {
        return `To route confidently to ${best.name}, add ${best.missing
        .map(humanizeField)
        .join(" and ")}.`;
    }

      if (/\b(and|plus|while|together with|together)\b/i.test(query)) {
          return `${best.name} looks like the best first route, but your wording may span more than one concept. Solve the primary issue first, then use the related next-step suggestions if a second topic remains.`;
      }

      if (/\b(workpaper|workbook|spreadsheet|xlsx|csv export|supporting schedule)\b/i.test(query)) {
          return `${best.name} is the best solving route. After solving, send the result to Workpaper Studio if you want an exportable workbook, supporting schedule, or reusable working paper.`;
      }

      if (topicFamily?.confidence === "low") {
          return `${best.name} is the current best route, but the topic family is still weak. Review the prepared values and related routes before opening it.`;
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

const SOLVE_TARGET_RULES: Record<
    string,
    Array<{ target: string; patterns: RegExp[] }>
> = {
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
};

export function suggestSolveTarget(calculatorId: string, query: string) {
    const rules = SOLVE_TARGET_RULES[calculatorId];
    if (!rules) return null;

    for (const rule of rules) {
        if (rule.patterns.some((pattern) => pattern.test(query))) {
            return rule.target;
        }
    }

    return null;
}

    export function analyzeSmartInput(
    fields: FieldsState,
    smartInput: string
    ): SmartSolverAnalysis {
    const normalizedQuery = normalizeText(smartInput);
    const detectedCurrency = detectCurrencyFromText(smartInput);
    const topicFamilies = rankTopicFamilies(normalizedQuery);
    const topicFamily = topicFamilies[0] ?? null;
    const topicFamilyGap =
        topicFamily && topicFamilies[1]
            ? topicFamily.score - topicFamilies[1].score
            : null;
    const strongFamilyGate = Boolean(
        topicFamily &&
            topicFamily.confidence !== "low" &&
            (topicFamilyGap === null || topicFamilyGap >= 10)
    );
    const extractionFamilies = topicFamily
        ? strongFamilyGate
            ? [topicFamily]
            : topicFamilies
                  .filter(
                      (_, index) =>
                          index === 0 ||
                          (index === 1 &&
                              (topicFamilyGap === null ||
                                  topicFamilyGap <= 6 ||
                                  topicFamily.confidence === "low"))
                  )
                  .slice(0, 2)
        : [];
    const allowedFieldKeys =
        extractionFamilies.length > 0
            ? dedupeFieldKeys(
                  extractionFamilies.flatMap((family) =>
                      family.calculatorIds.flatMap((calculatorId) => {
                          const calculator = CALCULATORS.find(
                              (entry) => entry.id === calculatorId
                          );
                          if (!calculator) return [];
                          return getRouteFamilyRule(calculator).extractionFieldKeys ?? [
                              ...calculator.required,
                              ...(calculator.optional ?? []),
                          ];
                      })
                  )
              )
            : undefined;
    const extracted = extractFacts(smartInput, allowedFieldKeys);
    const merged = mergeInputs(fields, extracted);
    const warnings: string[] = [];

    if (isStudyFirstPrompt(normalizedQuery)) {
        warnings.push(
            "The prompt looks more like a study or explanation request than a single calculator instruction."
        );
    }

    if (topicFamilyGap !== null && topicFamilyGap <= 6 && topicFamilies[1]) {
        warnings.push(
            `Topic-family routing is still close between ${topicFamily.label} and ${topicFamilies[1].label}.`
        );
    }

    const ranked: RankedCalculator[] = CALCULATORS.map((calculator) => {
        const topicSignals = computeTopicSignalScore(calculator, normalizedQuery);
        const familyGatePenalty =
            strongFamilyGate && topicFamily && topicSignals.familyRule.id !== topicFamily.id
                ? 24
                : topicFamily && topicSignals.familyRule.id !== topicFamily.id
                  ? 10
                  : 0;
        const score = scoreCalculator(
            calculator,
            merged,
            extracted,
            topicSignals.topicScore,
            0,
            familyGatePenalty
        );
        const missing = calculator.required.filter((field) => merged[field] === "");
        const fieldScore = scoreFieldContribution(calculator, merged, extracted);

        return {
        ...calculator,
        score,
        confidence: confidenceLabel(score),
        missing,
        reason: buildReason(calculator, merged, normalizedQuery, topicSignals.topicScore, fieldScore),
        topicScore: topicSignals.topicScore,
        fieldScore,
        contradictionPenalty: topicSignals.contradictionPenalty,
        familyGatePenalty,
        familyId: topicSignals.familyRule.id,
        };
    }).sort((a, b) => b.score - a.score);

    const best = ranked[0] ?? null;
    const secondBest = ranked[1] ?? null;
    const relatedCalculatorIds =
        best ? getRouteFamilyRule(best).relatedCalculatorIds ?? [] : [];
    const secondaryRoutes = ranked
        .filter((calculator) => calculator.id !== best?.id)
        .filter(
            (calculator) =>
                relatedCalculatorIds.includes(calculator.id) ||
                (calculator.score >= 35 && calculator.topicScore >= 24)
        )
        .slice(0, 4);

    const extractedEntries: Array<[FieldKey, string]> = (
        allowedFieldKeys && allowedFieldKeys.length > 0 ? allowedFieldKeys : FIELD_KEYS
    ).flatMap((key) => (extracted[key] !== "" ? [[key, extracted[key]]] : []));

    if (best && best.familyGatePenalty > 0 && best.score < 55) {
        warnings.push(
            "The selected route is being held below auto-open strength because the topic signals are still mixed."
        );
    }

    return {
        extracted,
        merged,
        ranked,
        best,
        secondBest,
        topicFamily,
        secondaryRoutes,
        detectedCurrency,
        followUp: buildFollowUp(best, secondBest, smartInput, topicFamily, warnings),
        hasStrongMatch: Boolean(
            best &&
                best.score >= 55 &&
                !isStudyFirstPrompt(normalizedQuery) &&
                topicFamily?.confidence !== "low"
        ),
        isReadyToRoute: Boolean(
            best &&
                best.score >= 55 &&
                best.missing.length === 0 &&
                !isStudyFirstPrompt(normalizedQuery) &&
                topicFamily?.confidence !== "low"
        ),
        extractedEntries,
        warnings,
    };
}

