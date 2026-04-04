export const ALL_FIELD_KEYS = [
    "principal",
    "rate",
    "time",
    "cost",
    "revenue",
    "timesCompounded",
    "presentValue",
    "futureValue",
    "loanAmount",
    "annualRate",
    "years",
    "fixedCosts",
    "sellingPricePerUnit",
    "variableCostPerUnit",
    "sales",
    "variableCosts",
    "sellingPrice",
    "assets",
    "liabilities",
    "equity",
    "invoice",
    "discountRate",
    "discountDays",
    "totalDays",
    "daysPaid",
    "salvageValue",
    "usefulLife",
    "year",
    "beginningUnits",
    "beginningCost",
    "purchase1Units",
    "purchase1Cost",
    "purchase2Units",
    "purchase2Cost",
    "unitsSold",
    "netSales",
    "grossProfitRate",
    "costOfGoodsAvailable",
    "bankBalance",
    "bookBalance",
    "depositsInTransit",
    "outstandingChecks",
    "serviceCharges",
    "nsfChecks",
    "bankError",
    "bookError",
    "accountsReceivable",
    "estimatedUncollectibleRate",
    "partnershipAmount",
    "partnerARatio",
    "partnerBRatio",
    "partnerCRatio",
    "vatableSales",
    "vatablePurchases",
    "directMaterialsUsed",
    "directLabor",
    "manufacturingOverhead",
    "beginningWorkInProcess",
    "endingWorkInProcess",
    "currentAssets",
    "currentLiabilities",
    "cash",
    "marketableSecurities",
    "netReceivables",
    "netCreditSales",
    "averageAccountsReceivable",
    "costOfGoodsSold",
    "averageInventory",
    "netIncome",
    "averageTotalAssets",
    "periodicPayment",
    "periods",
    "targetProfit",
    "actualSales",
    "breakEvenSalesAmount",
    "preferredDividends",
    "weightedAverageCommonShares",
    "basePeriodAmount",
    "currentPeriodAmount",
    "statementItemAmount",
    "statementBaseAmount",
    ] as const;

    export type FieldKey = (typeof ALL_FIELD_KEYS)[number];

    export type FieldGroup =
    | "general"
    | "finance"
    | "business"
    | "accounting"
    | "inventory";

    export type FieldKind = "money" | "percent" | "time" | "number" | "text";

    export type FieldMeta = {
    label: string;
    placeholder: string;
    kind?: FieldKind;
    group?: FieldGroup;
    visibleInManualInputs?: boolean;
    aliases?: readonly string[];
    };

    export type FieldsState = Record<FieldKey, string>;

    export type ExtractedFacts = FieldsState & {
    notes: string[];
    };

    export type CalculatorConfig = {
    id: string;
    name: string;
    route: string;
    description: string;
    required: readonly FieldKey[];
    optional?: readonly FieldKey[];
    aliases?: readonly string[];
    keywords: readonly RegExp[];
    };

    export type ConfidenceLabel = "High" | "Good" | "Possible" | "Low";

    export type RankedCalculator = CalculatorConfig & {
    score: number;
    confidence: ConfidenceLabel;
    missing: FieldKey[];
    reason: string;
    };

    export type SmartSolverAnalysis = {
    extracted: ExtractedFacts;
    merged: FieldsState;
    ranked: RankedCalculator[];
    best: RankedCalculator | null;
    secondBest: RankedCalculator | null;
    followUp: string;
    hasStrongMatch: boolean;
    isReadyToRoute: boolean;
    extractedEntries: Array<[FieldKey, string]>;
};
