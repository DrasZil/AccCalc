export type AppNavItem = {
    label: string;
    path: string;
    shortLabel?: string;
    description?: string;
    subtopic?: string;
};

export type OfflineSupportLevel = "full" | "limited" | "online-only";

export type AppNavGroupTitle =
    | "General"
    | "Core Tools"
    | "Smart Tools"
    | "Accounting"
    | "Finance"
    | "Managerial & Cost"
    | "Business Math"
    | "Statistics";

export type AppNavGroup = {
    title: AppNavGroupTitle;
    hint: string;
    tone: string;
    items: AppNavItem[];
    sections: AppNavSection[];
};

export type AppNavSection = {
    title: string;
    items: AppNavItem[];
};

export type RouteMeta = {
    path: string;
    label: string;
    category: AppNavGroupTitle;
    subtopic: string;
    description: string;
    shortLabel?: string;
    aliases: string[];
    keywords: string[];
    tags: string[];
    offlineSupport: OfflineSupportLevel;
    offlineSummary: string;
    offlineDetail: string;
    isNew?: boolean;
};

export type RouteAvailability = {
    canOpen: boolean;
    support: OfflineSupportLevel;
    label: string;
    reason: string;
};

const GROUP_CONFIG: Record<
    AppNavGroupTitle,
    { hint: string; tone: string; order: number }
> = {
    General: { hint: "Home and activity", tone: "from-emerald-400/20 to-transparent", order: 0 },
    "Core Tools": { hint: "Everyday calculators", tone: "from-cyan-400/15 to-transparent", order: 1 },
    "Smart Tools": { hint: "Prompt routing", tone: "from-amber-300/15 to-transparent", order: 2 },
    Accounting: { hint: "Reporting, valuation, and review", tone: "from-green-400/20 to-transparent", order: 3 },
    Finance: { hint: "Time value, lending, and capital budgeting", tone: "from-sky-400/15 to-transparent", order: 4 },
    "Managerial & Cost": { hint: "CVP, budgets, costing, and variances", tone: "from-orange-400/15 to-transparent", order: 5 },
    "Business Math": { hint: "Pricing and applied math", tone: "from-fuchsia-400/15 to-transparent", order: 6 },
    Statistics: { hint: "Core analytics", tone: "from-violet-400/15 to-transparent", order: 7 },
};

function feature(
    path: string,
    label: string,
    category: AppNavGroupTitle,
    description: string,
    aliases: string[] = [],
    tags: string[] = [],
    shortLabel?: string,
    isNew = false,
    keywords: string[] = []
): RouteMeta {
    return {
        path,
        label,
        category,
        subtopic: inferSubtopic(category, path, tags, label),
        description,
        aliases,
        tags,
        shortLabel,
        isNew,
        keywords,
        ...inferOfflineMeta(path),
    };
}

const SUBTOPIC_ORDER: Partial<Record<AppNavGroupTitle, string[]>> = {
    General: ["Workspace", "Settings"],
    "Core Tools": ["Calculator"],
    "Smart Tools": ["Solver"],
    Accounting: [
        "Fundamentals",
        "Receivables & Cash",
        "Inventory",
        "Liabilities",
        "Reporting & Analysis",
        "Partnership",
        "Tax",
    ],
    Finance: ["Interest & TVM", "Loans & Annuities", "Capital Budgeting"],
    "Managerial & Cost": [
        "CVP & Decisions",
        "Budgeting",
        "Manufacturing Costs",
        "Variances",
        "Depreciation",
    ],
    "Business Math": ["Pricing & Profit", "Averages & Basics"],
    Statistics: ["Descriptive Statistics"],
};

function inferSubtopic(
    category: AppNavGroupTitle,
    path: string,
    tags: string[],
    label: string
) {
    const haystack = `${path} ${label} ${tags.join(" ")}`.toLowerCase();

    switch (category) {
        case "General":
            return path.startsWith("/settings") ? "Settings" : "Workspace";
        case "Core Tools":
            return "Calculator";
        case "Smart Tools":
            return "Solver";
        case "Accounting":
            if (
                haystack.includes("equation") ||
                haystack.includes("classification") ||
                haystack.includes("trial-balance") ||
                haystack.includes("debit") ||
                haystack.includes("fundamentals")
            ) {
                return "Fundamentals";
            }

            if (
                haystack.includes("receivable") ||
                haystack.includes("allowance") ||
                haystack.includes("aging") ||
                haystack.includes("bank") ||
                haystack.includes("discount") ||
                haystack.includes("notes-interest") ||
                haystack.includes("cash")
            ) {
                return "Receivables & Cash";
            }

            if (
                haystack.includes("inventory") ||
                haystack.includes("gross-profit") ||
                haystack.includes("nrv")
            ) {
                return "Inventory";
            }

            if (haystack.includes("bond") || haystack.includes("liabilities")) {
                return "Liabilities";
            }

            if (haystack.includes("partnership") || haystack.includes("capital")) {
                return "Partnership";
            }

            if (haystack.includes("vat") || haystack.includes("tax")) {
                return "Tax";
            }

            return "Reporting & Analysis";
        case "Finance":
            if (
                haystack.includes("npv") ||
                haystack.includes("profitability-index") ||
                haystack.includes("payback")
            ) {
                return "Capital Budgeting";
            }

            if (
                haystack.includes("loan") ||
                haystack.includes("annuity") ||
                haystack.includes("sinking-fund")
            ) {
                return "Loans & Annuities";
            }

            return "Interest & TVM";
        case "Managerial & Cost":
            if (haystack.includes("budget")) return "Budgeting";
            if (haystack.includes("variance")) return "Variances";
            if (haystack.includes("depreciation")) return "Depreciation";
            if (
                haystack.includes("break-even") ||
                haystack.includes("margin") ||
                haystack.includes("profit")
            ) {
                return "CVP & Decisions";
            }

            return "Manufacturing Costs";
        case "Business Math":
            return haystack.includes("weighted") ? "Averages & Basics" : "Pricing & Profit";
        case "Statistics":
            return "Descriptive Statistics";
        default:
            return "Tools";
    }
}

function getSubtopicSortIndex(category: AppNavGroupTitle, subtopic: string) {
    const preferred = SUBTOPIC_ORDER[category] ?? [];
    const index = preferred.indexOf(subtopic);
    return index === -1 ? preferred.length + 1 : index;
}

function inferOfflineMeta(path: string): Pick<RouteMeta, "offlineSupport" | "offlineSummary" | "offlineDetail"> {
    if (path === "/") {
        return {
            offlineSupport: "limited",
            offlineSummary: "Core dashboard content works offline once this version is cached.",
            offlineDetail:
                "Pinned tools, recent activity, and local discovery still work offline, but fresh updates, install prompts, and external share destinations still depend on internet access.",
        };
    }

    if (path === "/settings/install") {
        return {
            offlineSupport: "limited",
            offlineSummary: "The guidance stays readable offline, but install and update checks need internet.",
            offlineDetail:
                "Platform instructions remain available offline after caching, but native install prompts, version checks, and first-time asset downloads still require an online session.",
        };
    }

    if (path === "/settings/feedback") {
        return {
            offlineSupport: "limited",
            offlineSummary: "The page opens offline, but feedback submission stays online-only.",
            offlineDetail:
                "The embedded Google Form and external feedback destination require internet access even though the route itself can still explain the limitation offline.",
        };
    }

    return {
        offlineSupport: "full",
        offlineSummary: "This route is designed to keep working offline after the current version is cached.",
        offlineDetail:
            "All calculations, formulas, and educational guidance on this route run locally in the browser after the current release finishes caching successfully.",
    };
}

export function getOfflineSupportLabel(level: OfflineSupportLevel) {
    if (level === "full") return "Offline ready";
    if (level === "limited") return "Limited offline";
    return "Online required";
}

export function getRouteAvailability(
    route: Pick<RouteMeta, "path" | "offlineSupport" | "offlineSummary" | "offlineDetail">,
    options: {
        online: boolean;
        bundleReady: boolean;
        currentPath?: string;
    }
): RouteAvailability {
    if (options.online) {
        return {
            canOpen: true,
            support: route.offlineSupport,
            label: getOfflineSupportLabel(route.offlineSupport),
            reason: route.offlineSummary,
        };
    }

    if (options.currentPath === route.path) {
        return {
            canOpen: true,
            support: route.offlineSupport,
            label: getOfflineSupportLabel(route.offlineSupport),
            reason: route.offlineDetail,
        };
    }

    if (!options.bundleReady) {
        return {
            canOpen: false,
            support: route.offlineSupport,
            label: "Caching required",
            reason:
                "This browser has not finished caching the current release yet. Reconnect once so AccCalc can download the route files safely.",
        };
    }

    if (route.offlineSupport === "online-only") {
        return {
            canOpen: false,
            support: route.offlineSupport,
            label: getOfflineSupportLabel(route.offlineSupport),
            reason: route.offlineDetail,
        };
    }

    return {
        canOpen: true,
        support: route.offlineSupport,
        label: getOfflineSupportLabel(route.offlineSupport),
        reason: route.offlineDetail,
    };
}

export const APP_ROUTE_META: RouteMeta[] = [
    feature("/", "Home", "General", "Main workspace overview.", ["dashboard", "homepage"], ["home"], "Home"),
    feature("/history", "History", "General", "Saved prompts and recent activity.", ["recent", "saved work"], ["history"], "Saved", true),
    feature("/settings", "Settings", "General", "Currency, motion, and app preferences.", ["preferences", "options"], ["settings"], "Prefs"),
    feature("/settings/about", "About", "General", "App background and context.", ["about acccalc"], ["about"], "About"),
    feature("/settings/install", "Install and Offline Guide", "General", "Platform-aware install guidance plus offline support limits and safeguards.", ["pwa install", "offline guide", "add to home screen"], ["install", "offline"], "Install", true),
    feature("/settings/feedback", "Feedback", "General", "Suggestions and issue reporting.", ["support", "report issue"], ["feedback"], "Feedback"),
    feature("/basic", "Basic Calculator", "Core Tools", "Expression calculator with memory and keyboard support.", ["basic calc", "standard calculator"], ["calculator"], "Calculator"),
    feature("/smart/solver", "Smart Solver", "Smart Tools", "Natural-language routing into the right tool.", ["prompt solver", "smart search"], ["smart", "routing"], "Solver"),

    feature("/accounting/accounting-equation", "Accounting Equation", "Accounting", "Solve assets, liabilities, or equity.", ["assets liabilities equity", "ale"], ["fundamentals"]),
    feature("/accounting/notes-interest", "Notes Interest", "Accounting", "Compute note interest and maturity value.", ["note receivable interest", "maturity value"], ["notes", "interest"]),
    feature("/accounting/cash-discount", "Cash Discount", "Accounting", "Evaluate cash discount credit terms.", ["2/10 n/30", "credit terms"], ["discount", "merchandising"]),
    feature("/accounting/fifo-inventory", "FIFO Inventory", "Accounting", "FIFO cost of goods sold and ending inventory.", ["first in first out", "fifo cogs"], ["inventory", "cogs"]),
    feature("/accounting/weighted-average-inventory", "Weighted Average Inventory", "Accounting", "Weighted-average unit cost, COGS, and ending inventory.", ["average cost inventory"], ["inventory", "cogs"]),
    feature("/accounting/inventory-method-comparison", "Inventory Method Comparison", "Accounting", "Compare FIFO and weighted-average effects on COGS and ending inventory.", ["fifo vs weighted average", "inventory comparison"], ["inventory", "analysis"], undefined, true),
    feature("/accounting/gross-profit-method", "Gross Profit Method", "Accounting", "Estimate gross profit, COGS, and ending inventory.", ["gp method", "inventory estimate"], ["inventory", "estimate"]),
    feature("/accounting/lower-of-cost-or-nrv", "Lower of Cost or NRV", "Accounting", "Compare inventory cost and net realizable value item by item or in aggregate.", ["lower of cost and net realizable value", "lcnrv", "lc nrv"], ["inventory", "valuation", "nrv"], undefined, true, ["lower of cost", "nrv", "inventory write-down"]),
    feature("/accounting/bank-reconciliation", "Bank Reconciliation", "Accounting", "Reconcile bank and book balances.", ["bank recon", "cash reconciliation"], ["cash", "reconciliation"]),
    feature("/accounting/allowance-doubtful-accounts", "Allowance for Doubtful Accounts", "Accounting", "Estimate bad debt allowance and NRV.", ["bad debts", "net realizable value", "ada"], ["receivables", "allowance"]),
    feature("/accounting/receivables-aging-schedule", "Receivables Aging Schedule", "Accounting", "Build an aging-based required allowance and adjustment entry.", ["aging of receivables", "ageing schedule", "aging schedule"], ["receivables", "allowance", "aging"], undefined, true, ["receivables", "aging", "allowance", "nrv"]),
    feature("/accounting/bond-amortization-schedule", "Bond Amortization Schedule", "Accounting", "Build effective-interest or straight-line premium and discount bond schedules.", ["bond discount amortization", "bond premium schedule", "effective interest bond"], ["bonds", "liabilities", "amortization"], undefined, true, ["bond", "premium", "discount", "effective interest"]),
    feature("/accounting/partnership-profit-sharing", "Partnership Profit Sharing", "Accounting", "Allocate partnership profit or loss.", ["partnership ratio sharing"], ["partnership", "allocation"], undefined, false, ["partnership", "profit sharing", "allocation", "ratio"]),
    feature("/accounting/partnership-salary-interest", "Partnership Salary and Interest", "Accounting", "Use salary allowances, interest, and a remainder ratio.", ["salary allowance partnership", "interest on capital"], ["partnership", "allocation"], undefined, true, ["partnership", "salary", "interest", "capital", "allocation"]),
    feature("/accounting/partnership-admission-bonus", "Partnership Admission Bonus", "Accounting", "Incoming partner capital credit under the bonus method.", ["bonus method admission"], ["partnership", "admission"], undefined, true, ["partnership", "admission", "bonus", "capital"]),
    feature("/accounting/partnership-admission-goodwill", "Partnership Admission Goodwill", "Accounting", "Implied capital and goodwill under the goodwill method.", ["goodwill method admission"], ["partnership", "admission"], undefined, true, ["partnership", "admission", "goodwill", "capital"]),
    feature("/accounting/partnership-retirement-bonus", "Partnership Retirement Bonus", "Accounting", "Review a retiring partner settlement under the bonus method.", ["partner retirement", "withdrawal bonus", "retiring partner settlement"], ["partnership", "retirement", "equity"], undefined, true, ["partnership", "retirement", "withdrawal", "bonus", "settlement"]),
    feature("/accounting/partners-capital-statement", "Statement of Partners' Capital", "Accounting", "Roll forward capital balances for two or three partners.", ["partners capital statement", "capital rollforward", "statement of partners capital"], ["partnership", "equity", "capital"], undefined, true, ["partnership", "capital", "rollforward", "equity", "drawings"]),
    feature("/accounting/philippine-vat", "Philippine VAT", "Accounting", "Output VAT, input VAT, and net VAT at 12%.", ["vat payable", "input vat", "output vat"], ["tax", "philippines"]),
    feature("/accounting/current-ratio", "Current Ratio and Working Capital", "Accounting", "Current ratio plus working capital.", ["working capital", "liquidity ratio"], ["ratios", "liquidity"]),
    feature("/accounting/quick-ratio", "Quick Ratio", "Accounting", "Acid-test liquidity coverage.", ["acid test ratio"], ["ratios", "liquidity"]),
    feature("/accounting/cash-ratio", "Cash Ratio", "Accounting", "Strict liquidity using only cash and near-cash items.", ["strict liquidity ratio"], ["ratios", "liquidity"], undefined, true),
    feature("/accounting/cash-conversion-cycle", "Cash Conversion Cycle", "Accounting", "Measure how long cash stays tied up in operations.", ["ccc", "cash cycle", "working capital cycle"], ["ratios", "working capital"], undefined, true),
    feature("/accounting/receivables-turnover", "Accounts Receivable Turnover", "Accounting", "Receivables turnover and collection period.", ["ar turnover", "collection period"], ["ratios", "receivables"]),
    feature("/accounting/inventory-turnover", "Inventory Turnover", "Accounting", "Inventory turnover and days in inventory.", ["days in inventory"], ["ratios", "inventory"]),
    feature("/accounting/accounts-payable-turnover", "Accounts Payable Turnover", "Accounting", "Payables turnover and payment period.", ["ap turnover", "payment period"], ["ratios", "payables"], undefined, true),
    feature("/accounting/debt-to-equity", "Debt to Equity Ratio", "Accounting", "Leverage using total liabilities and equity.", ["de ratio", "debt equity"], ["ratios", "solvency"]),
    feature("/accounting/debt-ratio", "Debt Ratio", "Accounting", "Proportion of assets financed by liabilities.", ["liabilities to assets"], ["ratios", "solvency"]),
    feature("/accounting/return-on-assets", "Return on Assets", "Accounting", "Profitability relative to average assets.", ["roa"], ["ratios", "profitability"]),
    feature("/accounting/asset-turnover", "Asset Turnover", "Accounting", "Net sales generated per peso of average assets.", ["sales to assets"], ["ratios", "efficiency"]),
    feature("/accounting/return-on-equity", "Return on Equity", "Accounting", "Profitability relative to average equity.", ["roe"], ["ratios", "profitability"]),
    feature("/accounting/times-interest-earned", "Times Interest Earned", "Accounting", "Interest coverage using EBIT.", ["interest coverage", "tie ratio"], ["ratios", "solvency"], undefined, true),
    feature("/accounting/earnings-per-share", "Earnings Per Share", "Accounting", "Basic EPS from net income, preferred dividends, and weighted shares.", ["eps"], ["ratios", "equity"]),
    feature("/accounting/book-value-per-share", "Book Value Per Share", "Accounting", "Book value represented by each common share.", ["bvps"], ["ratios", "equity"], undefined, true),
    feature("/accounting/equity-multiplier", "Equity Multiplier", "Accounting", "Measure financial leverage from average assets and average equity.", ["financial leverage", "dupont leverage", "equity leverage"], ["ratios", "equity", "solvency"], undefined, true, ["equity", "multiplier", "leverage", "dupont"]),
    feature("/accounting/horizontal-analysis", "Horizontal Analysis", "Accounting", "Amount and percentage change across periods.", ["trend analysis"], ["analysis", "statements"]),
    feature("/accounting/vertical-analysis", "Vertical Analysis", "Accounting", "Common-size statement percentage.", ["common size"], ["analysis", "statements"]),
    feature("/accounting/trial-balance-checker", "Trial Balance Checker", "Accounting", "Compare total debits and credits.", ["trial balance", "tb checker"], ["accounting cycle"], undefined, true),
    feature("/accounting/account-classification", "Account Classification Helper", "Accounting", "Look up account type, statement section, and normal balance.", ["normal balance helper", "chart of accounts helper"], ["accounting cycle", "classification"], undefined, true),
    feature("/accounting/debit-credit-trainer", "Debit and Credit Trainer", "Accounting", "Practice normal debit and credit balances.", ["debit credit quiz", "dr cr trainer"], ["accounting cycle", "study"], undefined, true),

    feature("/finance/simple-interest", "Simple Interest", "Finance", "Simple interest and total amount.", ["i prt", "interest only"], ["interest"]),
    feature("/finance/compound-interest", "Compound Interest", "Finance", "Compound interest using compounding frequency.", ["compounded interest"], ["interest"]),
    feature("/finance/future-value", "Future Value", "Finance", "Future value of a single amount.", ["fv", "single sum future value"], ["tvm"]),
    feature("/finance/present-value", "Present Value", "Finance", "Present worth of a future amount.", ["pv", "discounted value"], ["tvm"]),
    feature("/finance/future-value-annuity", "Future Value of Annuity", "Finance", "Future value of an ordinary annuity.", ["fva", "annuity accumulation"], ["annuity", "tvm"]),
    feature("/finance/present-value-annuity", "Present Value of Annuity", "Finance", "Present value of an ordinary annuity.", ["pva", "annuity present worth"], ["annuity", "tvm"]),
    feature("/finance/effective-interest-rate", "Effective Interest Rate", "Finance", "Convert nominal annual rate to effective annual rate.", ["ear", "nominal vs effective"], ["rates"]),
    feature("/finance/sinking-fund-deposit", "Sinking Fund Deposit", "Finance", "Regular deposit needed to reach a target amount.", ["required deposit", "sinking fund"], ["annuity", "savings"]),
    feature("/finance/loan-amortization", "Loan Amortization", "Finance", "Monthly payment, total paid, and total interest.", ["monthly payment", "loan payment"], ["loan", "payment"]),
    feature("/finance/npv", "Net Present Value", "Finance", "Discount cash flows and compare them with the initial investment.", ["npv", "discounted cash flow"], ["capital budgeting"], "NPV", true),
    feature("/finance/profitability-index", "Profitability Index", "Finance", "Discounted inflows per peso of investment.", ["pi", "benefit cost ratio"], ["capital budgeting"], "PI", true),
    feature("/finance/payback-period", "Payback Period", "Finance", "How long it takes to recover the initial investment.", ["payback", "recovery period"], ["capital budgeting"], undefined, true),
    feature("/finance/discounted-payback-period", "Discounted Payback Period", "Finance", "Discounted recovery period using the time value of money.", ["discounted payback", "discounted recovery period"], ["capital budgeting"], undefined, true, ["discounted payback", "discounted recovery"]),

    feature("/business/profit-loss", "Profit and Loss", "Business Math", "Compare revenue and cost.", ["profit or loss", "gain or loss"], ["commercial math"]),
    feature("/business/markup-margin", "Markup and Margin", "Business Math", "Compare markup on cost and margin on selling price.", ["gross margin", "markup percentage"], ["pricing"]),
    feature("/business/net-profit-margin", "Net Profit Margin", "Business Math", "Net income per peso of net sales.", ["net margin"], ["profitability"]),
    feature("/business-math/weighted-mean", "Weighted Mean", "Business Math", "Weighted mean from values and weights.", ["weighted average", "average with weights"], ["statistics"], undefined, true),

    feature("/business/contribution-margin", "Contribution Margin", "Managerial & Cost", "Contribution margin amount and ratio.", ["cm ratio"], ["cvp"]),
    feature("/business/break-even", "Break-even Point", "Managerial & Cost", "Break-even units and sales.", ["break even", "be point"], ["cvp"]),
    feature("/business/target-profit", "Target Profit", "Managerial & Cost", "Required units and sales for a target profit.", ["target income"], ["cvp"]),
    feature("/business/margin-of-safety", "Margin of Safety", "Managerial & Cost", "How far actual sales exceed break-even sales.", ["mos"], ["cvp"]),
    feature("/business/operating-leverage", "Operating Leverage", "Managerial & Cost", "Sensitivity of operating income to sales changes.", ["dol", "degree of operating leverage"], ["cvp"]),
    feature("/business/sales-mix-break-even", "Sales Mix Break-even", "Managerial & Cost", "Break-even analysis for multi-product sales mixes.", ["multi product break even", "sales mix cvp", "composite unit break even"], ["cvp", "sales mix", "break-even"], undefined, true, ["sales mix", "composite unit", "weighted contribution margin"]),
    feature("/business/cash-budget", "Cash Budget", "Managerial & Cost", "Single-period cash budget with financing need visibility.", ["cash planning budget", "cash forecast budget"], ["budgeting", "cash"], undefined, true, ["cash budget", "financing", "minimum cash"]),
    feature("/business/flexible-budget", "Flexible Budget", "Managerial & Cost", "Separate activity variance from spending variance using a flexible cost budget.", ["static versus flexible budget", "budget variance"], ["budgeting", "variance"], undefined, true, ["flexible budget", "activity variance", "spending variance"]),
    feature("/accounting/cost-of-goods-manufactured", "Cost of Goods Manufactured", "Managerial & Cost", "Manufacturing costs and COGM.", ["cogm"], ["cost accounting"]),
    feature("/accounting/equivalent-units-weighted-average", "Equivalent Units (Weighted Average)", "Managerial & Cost", "Weighted-average process-costing equivalent units and cost assignment.", ["process costing weighted average", "equivalent units"], ["process costing", "equivalent units"], undefined, true, ["equivalent units", "weighted average", "process costing"]),
    feature("/accounting/prime-conversion-cost", "Prime and Conversion Cost", "Managerial & Cost", "Prime cost and conversion cost.", ["prime cost", "conversion cost"], ["cost accounting"], undefined, true),
    feature("/accounting/materials-price-variance", "Materials Price Variance", "Managerial & Cost", "Direct materials price variance.", ["mpv", "material price variance"], ["variance"], undefined, true),
    feature("/accounting/materials-quantity-variance", "Materials Quantity Variance", "Managerial & Cost", "Direct materials quantity variance.", ["materials usage variance", "mqv"], ["variance"], undefined, true, ["materials quantity variance", "usage variance", "standard quantity"]),
    feature("/accounting/labor-rate-variance", "Labor Rate Variance", "Managerial & Cost", "Direct labor rate variance.", ["labor wage variance"], ["variance"], undefined, true),
    feature("/accounting/labor-efficiency-variance", "Labor Efficiency Variance", "Managerial & Cost", "Direct labor efficiency variance.", ["labor time variance", "lev"], ["variance"], undefined, true, ["labor efficiency variance", "standard hours"]),
    feature("/accounting/straight-line-depreciation", "Straight-line Depreciation", "Managerial & Cost", "Annual depreciation under the straight-line method.", ["straight line"], ["depreciation"]),
    feature("/accounting/declining-balance-depreciation", "Declining Balance Depreciation", "Managerial & Cost", "Double declining balance depreciation.", ["ddb", "double declining balance"], ["depreciation"]),
    feature("/accounting/units-of-production-depreciation", "Units of Production Depreciation", "Managerial & Cost", "Depreciation based on actual output.", ["units of activity depreciation"], ["depreciation"], undefined, true),
    feature("/accounting/depreciation-schedule-comparison", "Depreciation Schedule Comparison", "Managerial & Cost", "Compare straight-line and double-declining schedules across an asset's life.", ["depreciation comparison", "compare depreciation methods"], ["depreciation", "analysis"], undefined, true),

    feature("/statistics/standard-deviation", "Standard Deviation", "Statistics", "Mean, variance, and standard deviation for a list of values.", ["sd", "variance"], ["statistics", "analytics"], undefined, true),
];

export const APP_ROUTE_META_MAP = new Map(APP_ROUTE_META.map((item) => [item.path, item]));

export const NEW_FEATURE_PATHS = new Set(
    APP_ROUTE_META.filter((item) => item.isNew).map((item) => item.path)
);

export const APP_NAV_GROUPS: AppNavGroup[] = Object.entries(GROUP_CONFIG)
    .sort(([, left], [, right]) => left.order - right.order)
    .map(([title, config]) => {
        const groupTitle = title as AppNavGroupTitle;
        const items = APP_ROUTE_META.filter((item) => item.category === title).map((item) => ({
            label: item.label,
            path: item.path,
            shortLabel: item.shortLabel,
            description: item.description,
            subtopic: item.subtopic,
        }));

        const sections = Array.from(
            items.reduce<Map<string, AppNavItem[]>>((map, item) => {
                const key = item.subtopic ?? "Tools";
                map.set(key, [...(map.get(key) ?? []), item]);
                return map;
            }, new Map())
        )
            .sort(
                ([left], [right]) =>
                    getSubtopicSortIndex(groupTitle, left) -
                        getSubtopicSortIndex(groupTitle, right) ||
                    left.localeCompare(right)
            )
            .map(([sectionTitle, sectionItems]) => ({
                title: sectionTitle,
                items: sectionItems,
            }));

        return {
            title: groupTitle,
            hint: config.hint,
            tone: config.tone,
            items,
            sections,
        };
    })
    .filter((group) => group.items.length > 0);

export function getRouteMeta(path: string): RouteMeta | null {
    return APP_ROUTE_META_MAP.get(path) ?? null;
}
