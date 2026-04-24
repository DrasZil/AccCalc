import type { FieldKey } from "./smartSolver.types.js";

export type SmartSolverEvaluationLevel = "L1" | "L2" | "L3" | "OCR";

export type SmartSolverEvaluationCase = {
    id: string;
    area: "FAR" | "AFAR" | "Cost & Managerial" | "Audit" | "Tax" | "Study";
    level: SmartSolverEvaluationLevel;
    prompt: string;
    expectedPrimaryRoute?: string;
    expectedRouteHint?: string;
    expectedSecondaryRoutes?: string[];
    expectedExtractedFields?: Partial<Record<FieldKey, string>>;
    shouldRemainUncertain?: boolean;
    ocrConfidence?: number;
};

export const SMART_SOLVER_EVALUATION_PACK: SmartSolverEvaluationCase[] = [
    {
        id: "audit-bank-rec-l1",
        area: "Audit",
        level: "L1",
        prompt:
            "Prepare a bank reconciliation. Bank balance is 120000, book balance is 118500, deposits in transit are 8000, outstanding checks are 6500, service charges are 500, NSF checks are 1200, and interest income is 300.",
        expectedPrimaryRoute: "bank-reconciliation",
        expectedExtractedFields: {
            bankBalance: "120000",
            bookBalance: "118500",
        },
    },
    {
        id: "managerial-cash-budget-l2",
        area: "Cost & Managerial",
        level: "L2",
        prompt:
            "Prepare a cash budget for April with beginning cash 50000, cash collections of 180000, cash disbursements of 210000, and a minimum cash balance of 25000. We may need financing, and the instructor also wants separate cash collections and cash disbursements support schedules.",
        expectedPrimaryRoute: "cash-budget",
        expectedSecondaryRoutes: [
            "cash-collections-schedule",
            "cash-disbursements-schedule",
        ],
        expectedExtractedFields: {
            beginningCashBalance: "50000",
            minimumCashBalance: "25000",
        },
    },
    {
        id: "afar-intercompany-ppe-l3",
        area: "AFAR",
        level: "L3",
        prompt:
            "Parent sold equipment to subsidiary for 260000 when the carrying amount was 200000. The remaining useful life is 5 years. Compute the excess depreciation and the unamortized intercompany profit for year 2.",
        expectedPrimaryRoute: "intercompany-ppe-transfer",
        expectedExtractedFields: {
            transferPrice: "260000",
            carryingAmount: "200000",
            usefulLife: "5",
            year: "2",
        },
    },
    {
        id: "far-gross-profit-method-l2",
        area: "FAR",
        level: "L2",
        prompt:
            "A fire destroyed inventory records. Beginning inventory was 90000, purchases were 260000, net sales were 400000, and the normal gross profit rate on sales is 30%. Estimate ending inventory using the gross profit method.",
        expectedPrimaryRoute: "gross-profit-method",
        expectedExtractedFields: {
            netSales: "400000",
            grossProfitRate: "30",
        },
    },
    {
        id: "tax-vat-reconciliation-l2",
        area: "Tax",
        level: "L2",
        prompt:
            "Compute VAT payable when taxable sales are 500000, taxable purchases are 320000, and the VAT rate is 12%. Show the output VAT less input VAT reconciliation.",
        expectedPrimaryRoute: "vat-reconciliation",
        expectedExtractedFields: {
            taxableSalesAmount: "500000",
            vatablePurchasesAmount: "320000",
            vatRatePercent: "12",
        },
    },
    {
        id: "study-routing-l2",
        area: "Study",
        level: "L2",
        prompt:
            "Explain the difference between markup on cost and gross profit on sales, then recommend the lesson I should study before using any calculator.",
        shouldRemainUncertain: true,
    },
    {
        id: "ocr-cash-budget-structure",
        area: "Cost & Managerial",
        level: "OCR",
        prompt: [
            "Cash Budget",
            "Beginning cash balance 50,000",
            "Cash collections 180,000",
            "Cash disbursements 210,000",
            "Minimum cash balance 25,000",
            "For April 2026",
        ].join("\n"),
        expectedPrimaryRoute: "cash-budget",
        expectedRouteHint: "/business/cash-budget",
        expectedExtractedFields: {
            beginningCashBalance: "50000",
            minimumCashBalance: "25000",
        },
        ocrConfidence: 88,
    },
];
