export type AppNavItem = {
    label: string;
    path: string;
    shortLabel?: string;
    description?: string;
};

export type AppNavGroupTitle =
    | "General"
    | "Core Tools"
    | "Smart Tools"
    | "Finance"
    | "Business"
    | "Accounting";

export type AppNavGroup = {
    title: AppNavGroupTitle;
    hint: string;
    tone: string;
    items: AppNavItem[];
};

export type RouteMeta = {
    path: string;
    label: string;
    category: AppNavGroupTitle;
    description: string;
    shortLabel?: string;
};

export const APP_NAV_GROUPS: AppNavGroup[] = [
    {
        title: "General",
        hint: "Home, settings, and saved activity",
        tone: "from-emerald-400/20 to-transparent",
        items: [
            {
                label: "Home",
                path: "/",
                shortLabel: "Home",
                description: "Return to the main workspace overview.",
            },
            {
                label: "History",
                path: "/history",
                shortLabel: "Saved",
                description: "Review your recent routes, prompts, and saved activity.",
            },
            {
                label: "Settings",
                path: "/settings",
                shortLabel: "Prefs",
                description: "Control app behavior, reminders, currency, and motion.",
            },
        ],
    },
    {
        title: "Core Tools",
        hint: "Daily utility calculators",
        tone: "from-cyan-400/15 to-transparent",
        items: [
            {
                label: "Basic Calculator",
                path: "/basic",
                shortLabel: "Calculator",
                description: "Proper calculator with memory, keyboard support, and history.",
            },
        ],
    },
    {
        title: "Smart Tools",
        hint: "Prompt-driven routing",
        tone: "from-amber-300/15 to-transparent",
        items: [
            {
                label: "Smart Solver",
                path: "/smart/solver",
                shortLabel: "Solver",
                description: "Interpret natural language and route to the right tool.",
            },
        ],
    },
    {
        title: "Finance",
        hint: "Time value, loans, and rates",
        tone: "from-sky-400/15 to-transparent",
        items: [
            { label: "Simple Interest", path: "/finance/simple-interest" },
            { label: "Compound Interest", path: "/finance/compound-interest" },
            { label: "Future Value", path: "/finance/future-value" },
            { label: "Present Value", path: "/finance/present-value" },
            { label: "Future Value of Annuity", path: "/finance/future-value-annuity" },
            { label: "Present Value of Annuity", path: "/finance/present-value-annuity" },
            { label: "Loan Amortization", path: "/finance/loan-amortization" },
            { label: "Effective Interest Rate", path: "/finance/effective-interest-rate" },
            { label: "Sinking Fund Deposit", path: "/finance/sinking-fund-deposit" },
        ],
    },
    {
        title: "Business",
        hint: "CVP and performance measures",
        tone: "from-orange-400/15 to-transparent",
        items: [
            { label: "Profit / Loss", path: "/business/profit-loss" },
            { label: "Break-even Point", path: "/business/break-even" },
            { label: "Contribution Margin", path: "/business/contribution-margin" },
            { label: "Markup & Margin", path: "/business/markup-margin" },
            { label: "Target Profit", path: "/business/target-profit" },
            { label: "Margin of Safety", path: "/business/margin-of-safety" },
            { label: "Net Profit Margin", path: "/business/net-profit-margin" },
            { label: "Operating Leverage", path: "/business/operating-leverage" },
        ],
    },
    {
        title: "Accounting",
        hint: "University-ready accounting topics",
        tone: "from-green-400/20 to-transparent",
        items: [
            { label: "Accounting Equation", path: "/accounting/accounting-equation" },
            { label: "Notes Interest", path: "/accounting/notes-interest" },
            { label: "Straight-line Depreciation", path: "/accounting/straight-line-depreciation" },
            { label: "Declining Balance Depreciation", path: "/accounting/declining-balance-depreciation" },
            { label: "Units of Production Depreciation", path: "/accounting/units-of-production-depreciation" },
            { label: "Cash Discount", path: "/accounting/cash-discount" },
            { label: "FIFO Inventory", path: "/accounting/fifo-inventory" },
            { label: "Weighted Average Inventory", path: "/accounting/weighted-average-inventory" },
            { label: "Gross Profit Method", path: "/accounting/gross-profit-method" },
            { label: "Bank Reconciliation", path: "/accounting/bank-reconciliation" },
            { label: "Allowance for Doubtful Accounts", path: "/accounting/allowance-doubtful-accounts" },
            { label: "Partnership Profit Sharing", path: "/accounting/partnership-profit-sharing" },
            { label: "Partnership Salary & Interest", path: "/accounting/partnership-salary-interest" },
            { label: "Partnership Admission Bonus", path: "/accounting/partnership-admission-bonus" },
            { label: "Partnership Admission Goodwill", path: "/accounting/partnership-admission-goodwill" },
            { label: "Philippine VAT", path: "/accounting/philippine-vat" },
            { label: "Cost of Goods Manufactured", path: "/accounting/cost-of-goods-manufactured" },
            { label: "Prime & Conversion Cost", path: "/accounting/prime-conversion-cost" },
            { label: "Materials Price Variance", path: "/accounting/materials-price-variance" },
            { label: "Labor Rate Variance", path: "/accounting/labor-rate-variance" },
            { label: "Current Ratio & Working Capital", path: "/accounting/current-ratio" },
            { label: "Quick Ratio", path: "/accounting/quick-ratio" },
            { label: "Accounts Receivable Turnover", path: "/accounting/receivables-turnover" },
            { label: "Inventory Turnover", path: "/accounting/inventory-turnover" },
            { label: "Accounts Payable Turnover", path: "/accounting/accounts-payable-turnover" },
            { label: "Debt to Equity Ratio", path: "/accounting/debt-to-equity" },
            { label: "Return on Assets", path: "/accounting/return-on-assets" },
            { label: "Times Interest Earned", path: "/accounting/times-interest-earned" },
            { label: "Debt Ratio", path: "/accounting/debt-ratio" },
            { label: "Earnings Per Share", path: "/accounting/earnings-per-share" },
            { label: "Book Value Per Share", path: "/accounting/book-value-per-share" },
            { label: "Horizontal Analysis", path: "/accounting/horizontal-analysis" },
            { label: "Vertical Analysis", path: "/accounting/vertical-analysis" },
            { label: "Asset Turnover", path: "/accounting/asset-turnover" },
            { label: "Return on Equity", path: "/accounting/return-on-equity" },
        ],
    },
];

export const NEW_FEATURE_PATHS = new Set<string>([
    "/history",
    "/accounting/partnership-salary-interest",
    "/accounting/prime-conversion-cost",
    "/accounting/materials-price-variance",
    "/accounting/labor-rate-variance",
    "/accounting/units-of-production-depreciation",
    "/accounting/partnership-admission-bonus",
    "/accounting/partnership-admission-goodwill",
    "/accounting/accounts-payable-turnover",
    "/accounting/times-interest-earned",
    "/accounting/book-value-per-share",
]);

export const APP_ROUTE_META: RouteMeta[] = APP_NAV_GROUPS.flatMap((group) =>
    group.items.map((item) => ({
        path: item.path,
        label: item.label,
        category: group.title,
        description: item.description ?? `${item.label} in the ${group.title} category.`,
        shortLabel: item.shortLabel,
    }))
);

export const APP_ROUTE_META_MAP = new Map(APP_ROUTE_META.map((item) => [item.path, item]));

export function getRouteMeta(path: string): RouteMeta | null {
    return APP_ROUTE_META_MAP.get(path) ?? null;
}
