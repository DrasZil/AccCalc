import type { WorkpaperCellRecord, WorkpaperTemplateDefinition } from "./workpaperTypes.js";
import {
    createCell,
    createEmptySheet,
    createWorkbook,
    getCellKey,
} from "./workpaperUtils.js";

function sheetCells(entries: Array<[number, number, string]>) {
    const cells: WorkpaperCellRecord = {};
    for (const [rowIndex, columnIndex, input] of entries) {
        cells[getCellKey(rowIndex, columnIndex)] = createCell(input);
    }
    return cells;
}

function headingCell(input: string) {
    return createCell(input, undefined, {
        bold: true,
        fillColor: "#DBEAFE",
        textColor: "#0F172A",
    });
}

function labelCell(input: string) {
    return createCell(input, undefined, {
        bold: true,
        fillColor: "#F8FAFC",
        textColor: "#0F172A",
    });
}

function buildSingleSheetTemplate(config: {
    title: string;
    description: string;
    topic: string;
    templateId: string;
    sheetTitle: string;
    rowCount: number;
    columnCount: number;
    note: string;
    tags: string[];
    relatedPaths: string[];
    entries: Array<[number, number, string]>;
}) {
    const baseCells = sheetCells(config.entries);
    if (!baseCells[getCellKey(0, 0)]) {
        baseCells[getCellKey(0, 0)] = headingCell(config.title);
    } else {
        baseCells[getCellKey(0, 0)] = headingCell(baseCells[getCellKey(0, 0)]?.input ?? config.title);
    }
    for (let columnIndex = 0; columnIndex < config.columnCount; columnIndex += 1) {
        const key = getCellKey(1, columnIndex);
        const existing = baseCells[key];
        if (existing?.input) {
            baseCells[key] = {
                ...existing,
                style: {
                    ...(existing.style ?? {}),
                    ...labelCell(existing.input).style,
                },
            };
        }
    }

    return {
        id: config.templateId,
        title: config.title,
        description: config.description,
        topic: config.topic,
        tags: config.tags,
        relatedPaths: config.relatedPaths,
        buildWorkbook: () =>
            createWorkbook({
                title: config.title,
                description: config.description,
                topic: config.topic,
                sheets: [
                    createEmptySheet({
                        title: config.sheetTitle,
                        kind: "template",
                        rowCount: config.rowCount,
                        columnCount: config.columnCount,
                        note: config.note,
                        templateId: config.templateId,
                        freezeRows: 2,
                        freezeColumns: 1,
                        cells: baseCells,
                    }),
                ],
            }),
    } satisfies WorkpaperTemplateDefinition;
}

export const WORKPAPER_TEMPLATES: WorkpaperTemplateDefinition[] = [
    buildSingleSheetTemplate({
        templateId: "cash-collections-schedule",
        title: "Cash Collections Schedule",
        description: "Collect period sales, lag rules, and total collections in one budget-support sheet.",
        topic: "Cost & Managerial",
        sheetTitle: "Collections Schedule",
        rowCount: 20,
        columnCount: 7,
        note: "Enter sales by period, then update collection rates or add supporting note rows underneath the schedule.",
        tags: ["budgeting", "cash collections", "receivables", "schedule"],
        relatedPaths: ["/business/cash-collections-schedule", "/business/cash-budget"],
        entries: [
            [0, 0, "Cash Collections Schedule"],
            [1, 0, "Period"],
            [1, 1, "Budgeted Sales"],
            [1, 2, "Current Collection"],
            [1, 3, "Lag 1 Collection"],
            [1, 4, "Lag 2 Collection"],
            [1, 5, "Beginning AR"],
            [1, 6, "Total Collections"],
            [2, 0, "Month 1"],
            [2, 6, "=SUM(B3:F3)"],
            [3, 0, "Month 2"],
            [3, 6, "=SUM(B4:F4)"],
            [4, 0, "Month 3"],
            [4, 6, "=SUM(B5:F5)"],
        ],
    }),
    buildSingleSheetTemplate({
        templateId: "cash-disbursements-schedule",
        title: "Cash Disbursements Schedule",
        description: "Track purchases, payment lags, and total cash outflows for budget planning.",
        topic: "Cost & Managerial",
        sheetTitle: "Disbursements Schedule",
        rowCount: 20,
        columnCount: 7,
        note: "Use payment-lag columns for purchases, payroll, and operating expense support as needed.",
        tags: ["budgeting", "cash disbursements", "payables", "schedule"],
        relatedPaths: ["/business/cash-disbursements-schedule", "/business/cash-budget"],
        entries: [
            [0, 0, "Cash Disbursements Schedule"],
            [1, 0, "Period"],
            [1, 1, "Purchases / Spend"],
            [1, 2, "Current Payment"],
            [1, 3, "Lag 1 Payment"],
            [1, 4, "Lag 2 Payment"],
            [1, 5, "Beginning AP"],
            [1, 6, "Total Payments"],
            [2, 0, "Month 1"],
            [2, 6, "=SUM(B3:F3)"],
            [3, 0, "Month 2"],
            [3, 6, "=SUM(B4:F4)"],
            [4, 0, "Month 3"],
            [4, 6, "=SUM(B5:F5)"],
        ],
    }),
    buildSingleSheetTemplate({
        templateId: "cash-budget-support",
        title: "Cash Budget Support Sheet",
        description: "Organize beginning cash, inflows, outflows, financing, and ending balance support.",
        topic: "Cost & Managerial",
        sheetTitle: "Cash Budget",
        rowCount: 24,
        columnCount: 6,
        note: "Use this sheet to bridge collections and disbursements into minimum-cash and financing decisions.",
        tags: ["cash budget", "budgeting", "planning"],
        relatedPaths: ["/business/cash-budget", "/business/cash-collections-schedule", "/business/cash-disbursements-schedule"],
        entries: [
            [0, 0, "Cash Budget Support"],
            [1, 0, "Line Item"],
            [1, 1, "Month 1"],
            [1, 2, "Month 2"],
            [1, 3, "Month 3"],
            [1, 4, "Quarter"],
            [2, 0, "Beginning Cash"],
            [3, 0, "Cash Collections"],
            [4, 0, "Total Cash Available"],
            [4, 1, "=B3+B4"],
            [4, 2, "=C3+C4"],
            [4, 3, "=D3+D4"],
            [5, 0, "Cash Disbursements"],
            [6, 0, "Financing"],
            [7, 0, "Ending Cash"],
            [7, 1, "=B5-B6+B7"],
            [7, 2, "=C5-C6+C7"],
            [7, 3, "=D5-D6+D7"],
            [7, 4, "=SUM(B8:D8)"],
        ],
    }),
    buildSingleSheetTemplate({
        templateId: "ratio-summary",
        title: "Ratio Summary Workpaper",
        description: "Record formulas, raw amounts, and interpretation notes for ratio analysis.",
        topic: "Strategic & Integrative",
        sheetTitle: "Ratio Summary",
        rowCount: 24,
        columnCount: 6,
        note: "Use the notes section under the grid for interpretation, trend reading, and peer comparison comments.",
        tags: ["ratio analysis", "financial analysis", "statement analysis"],
        relatedPaths: ["/accounting/ratio-analysis-workspace", "/accounting/common-size-income-statement"],
        entries: [
            [0, 0, "Ratio Summary Sheet"],
            [1, 0, "Ratio"],
            [1, 1, "Formula"],
            [1, 2, "Current Year"],
            [1, 3, "Prior Year"],
            [1, 4, "Variance"],
            [1, 5, "Interpretation"],
            [2, 0, "Current Ratio"],
            [3, 0, "Quick Ratio"],
            [4, 0, "Gross Margin"],
            [5, 0, "Return on Assets"],
            [6, 0, "Receivables Turnover"],
        ],
    }),
    buildSingleSheetTemplate({
        templateId: "inventory-planning",
        title: "Inventory Planning Sheet",
        description: "Combine demand assumptions, reorder planning, lead times, and safety-stock support.",
        topic: "Operations & Supply Chain",
        sheetTitle: "Inventory Planning",
        rowCount: 20,
        columnCount: 7,
        note: "Best used with EOQ, reorder point, and inventory-control review workflows.",
        tags: ["inventory", "operations", "eoq", "reorder point"],
        relatedPaths: ["/operations/eoq-and-reorder-point", "/accounting/inventory-control-workspace"],
        entries: [
            [0, 0, "Inventory Planning Sheet"],
            [1, 0, "Item"],
            [1, 1, "Annual Demand"],
            [1, 2, "Order Cost"],
            [1, 3, "Holding Cost"],
            [1, 4, "Lead Time (days)"],
            [1, 5, "Safety Stock"],
            [1, 6, "Reorder Point"],
            [2, 0, "SKU A"],
            [2, 6, "=((B3/365)*E3)+F3"],
        ],
    }),
    buildSingleSheetTemplate({
        templateId: "cvp-analysis",
        title: "CVP Analysis Workpaper",
        description: "Lay out contribution margin, break-even, target profit, and sensitivity support in one worksheet.",
        topic: "Cost & Managerial",
        sheetTitle: "CVP Workpaper",
        rowCount: 22,
        columnCount: 6,
        note: "This template works well for classroom solve-check-revise cycles and managerial planning comparisons.",
        tags: ["cvp", "break-even", "target profit", "managerial"],
        relatedPaths: ["/business/cvp-analysis", "/business/target-profit", "/business/margin-of-safety"],
        entries: [
            [0, 0, "CVP Analysis Workpaper"],
            [1, 0, "Input"],
            [1, 1, "Amount"],
            [2, 0, "Fixed Costs"],
            [3, 0, "Selling Price / Unit"],
            [4, 0, "Variable Cost / Unit"],
            [5, 0, "Contribution Margin / Unit"],
            [5, 1, "=B4-B5"],
            [6, 0, "Break-even Units"],
            [6, 1, "=B3/B6"],
            [7, 0, "Target Profit"],
            [8, 0, "Required Units"],
            [8, 1, "=(B3+B8)/B6"],
        ],
    }),
    buildSingleSheetTemplate({
        templateId: "capital-budgeting-comparison",
        title: "Capital Budgeting Comparison",
        description: "Compare project cash flows, NPV, PI, payback, and recommendation notes.",
        topic: "Finance / Econ / Math",
        sheetTitle: "Capital Budgeting",
        rowCount: 20,
        columnCount: 7,
        note: "Keep assumptions, hurdle rate notes, and ranking rationale in the lower part of the sheet.",
        tags: ["capital budgeting", "npv", "irr", "payback"],
        relatedPaths: ["/finance/capital-budgeting-comparison", "/finance/npv", "/finance/internal-rate-of-return"],
        entries: [
            [0, 0, "Capital Budgeting Comparison"],
            [1, 0, "Metric"],
            [1, 1, "Project A"],
            [1, 2, "Project B"],
            [1, 3, "Project C"],
            [2, 0, "Initial Investment"],
            [3, 0, "NPV"],
            [4, 0, "IRR"],
            [5, 0, "PI"],
            [6, 0, "Discounted Payback"],
            [7, 0, "Recommendation"],
        ],
    }),
    buildSingleSheetTemplate({
        templateId: "retained-earnings-rollforward",
        title: "Retained Earnings Rollforward",
        description: "Track beginning retained earnings, current-period profit, dividends, and ending balance support.",
        topic: "FAR",
        sheetTitle: "Retained Earnings",
        rowCount: 18,
        columnCount: 5,
        note: "Use this for statement-of-changes-in-equity support, dividend questions, and retained-earnings reconciliation work.",
        tags: ["equity", "retained earnings", "dividends", "far"],
        relatedPaths: ["/far/retained-earnings-rollforward"],
        entries: [
            [0, 0, "Retained Earnings Rollforward"],
            [1, 0, "Line Item"],
            [1, 1, "Amount"],
            [2, 0, "Beginning Retained Earnings"],
            [3, 0, "Net Income"],
            [4, 0, "Prior Period Adjustment"],
            [5, 0, "Dividends Declared"],
            [6, 0, "Ending Retained Earnings"],
            [6, 1, "=B3+B4+B5-B6"],
        ],
    }),
    buildSingleSheetTemplate({
        templateId: "business-tax-review",
        title: "Business Tax Review Sheet",
        description: "Organize taxable sales, rates, VAT-versus-percentage-tax notes, and filing reminders in one support sheet.",
        topic: "Taxation",
        sheetTitle: "Business Tax",
        rowCount: 18,
        columnCount: 6,
        note: "Useful for reviewing whether a problem belongs to VAT, percentage tax, or another business-tax track before computing the answer.",
        tags: ["tax", "percentage tax", "vat", "business taxation"],
        relatedPaths: ["/tax/percentage-tax", "/tax/tax-compliance-review"],
        entries: [
            [0, 0, "Business Tax Review"],
            [1, 0, "Item"],
            [1, 1, "Amount / Rate"],
            [1, 2, "Base"],
            [1, 3, "Tax Due"],
            [1, 4, "Regime"],
            [1, 5, "Notes"],
            [2, 0, "Percentage Tax"],
            [3, 0, "VAT"],
        ],
    }),
    buildSingleSheetTemplate({
        templateId: "afn-forecast-support",
        title: "AFN Forecast Support",
        description: "Lay out sales growth, asset support, spontaneous liabilities, retained earnings support, and the outside financing gap.",
        topic: "Cost & Managerial",
        sheetTitle: "AFN Forecast",
        rowCount: 20,
        columnCount: 5,
        note: "Use this when you need to explain where the financing gap comes from instead of showing only the final AFN number.",
        tags: ["afn", "forecasting", "planning", "financing"],
        relatedPaths: ["/business/additional-funds-needed"],
        entries: [
            [0, 0, "AFN Forecast Support"],
            [1, 0, "Line Item"],
            [1, 1, "Amount"],
            [2, 0, "Current Sales"],
            [3, 0, "Projected Sales"],
            [4, 0, "Change in Sales"],
            [4, 1, "=B4-B3"],
            [5, 0, "Required Asset Increase"],
            [6, 0, "Spontaneous Liability Support"],
            [7, 0, "Internal Financing"],
            [8, 0, "Additional Funds Needed"],
            [8, 1, "=B6-B7-B8"],
        ],
    }),
    buildSingleSheetTemplate({
        templateId: "audit-planning",
        title: "Audit Planning Workpaper",
        description: "Capture engagement objectives, risks, materiality, procedures, and staffing support.",
        topic: "Audit & Assurance",
        sheetTitle: "Audit Planning",
        rowCount: 24,
        columnCount: 6,
        note: "Use rows below the main matrix for control-risk notes, fraud risk factors, and timing decisions.",
        tags: ["audit", "planning", "materiality", "risk"],
        relatedPaths: ["/audit/audit-planning-workspace", "/audit/audit-cycle-reviewer"],
        entries: [
            [0, 0, "Audit Planning Workpaper"],
            [1, 0, "Area / Cycle"],
            [1, 1, "Assertion Focus"],
            [1, 2, "Risk Rating"],
            [1, 3, "Materiality Link"],
            [1, 4, "Planned Procedure"],
            [1, 5, "Notes"],
            [2, 0, "Revenue and Collection"],
            [3, 0, "Expenditure"],
            [4, 0, "Inventory / Conversion"],
            [5, 0, "Investing / Financing"],
        ],
    }),
    buildSingleSheetTemplate({
        templateId: "risk-control-matrix",
        title: "Risk and Control Matrix",
        description: "Document risks, controls, gaps, owners, and follow-up actions in a reusable matrix.",
        topic: "Governance & Ethics",
        sheetTitle: "Risk Control Matrix",
        rowCount: 24,
        columnCount: 7,
        note: "Pair this with audit planning, AIS control reviews, and governance lessons for integrative use.",
        tags: ["risk", "control", "governance", "matrix"],
        relatedPaths: ["/governance/risk-control-matrix", "/ais/it-control-matrix"],
        entries: [
            [0, 0, "Risk and Control Matrix"],
            [1, 0, "Process"],
            [1, 1, "Risk"],
            [1, 2, "Control"],
            [1, 3, "Control Owner"],
            [1, 4, "Assessment"],
            [1, 5, "Gap / Issue"],
            [1, 6, "Action"],
            [2, 0, "Cash Handling"],
            [3, 0, "Revenue Recognition"],
            [4, 0, "User Access"],
        ],
    }),
    buildSingleSheetTemplate({
        templateId: "tax-difference-bridge",
        title: "Book-Tax Difference Bridge",
        description: "Track permanent and temporary differences with supporting tax effect notes.",
        topic: "Taxation",
        sheetTitle: "Book-Tax Bridge",
        rowCount: 22,
        columnCount: 6,
        note: "This template works well for tax-compliance review and accounting-vs-tax comparison problems.",
        tags: ["tax", "book tax difference", "temporary differences"],
        relatedPaths: ["/tax/book-tax-difference-workspace", "/tax/tax-compliance-review"],
        entries: [
            [0, 0, "Book-Tax Difference Bridge"],
            [1, 0, "Difference"],
            [1, 1, "Book Amount"],
            [1, 2, "Tax Amount"],
            [1, 3, "Difference"],
            [1, 4, "Type"],
            [1, 5, "Tax Effect Note"],
            [2, 0, "Depreciation"],
            [3, 0, "Estimated Warranty"],
            [4, 0, "Non-deductible Expense"],
        ],
    }),
    buildSingleSheetTemplate({
        templateId: "assumptions-and-summary",
        title: "Assumptions and Summary Sheet",
        description: "Capture assumptions, key metrics, notes, and reviewer conclusions in one workpaper.",
        topic: "General",
        sheetTitle: "Assumptions & Summary",
        rowCount: 18,
        columnCount: 6,
        note: "Use this as a summary or cover sheet for multi-sheet workbooks and reporting-ready exports.",
        tags: ["summary", "assumptions", "reporting", "review"],
        relatedPaths: ["/workpapers", "/study-hub"],
        entries: [
            [0, 0, "Assumptions and Summary"],
            [1, 0, "Section"],
            [1, 1, "Details"],
            [2, 0, "Objective"],
            [3, 0, "Key assumptions"],
            [4, 0, "Data source"],
            [5, 0, "Result summary"],
            [6, 0, "Reviewer note"],
            [8, 0, "Next steps"],
        ],
    }),
];

export function getWorkpaperTemplate(templateId: string) {
    return WORKPAPER_TEMPLATES.find((template) => template.id === templateId) ?? null;
}
