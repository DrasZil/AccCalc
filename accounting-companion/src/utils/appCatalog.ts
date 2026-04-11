import {
    buildStudyQuizPath,
    buildStudyTopicPath,
    getStudyQuizTopicByPath,
    getStudyTopicByPath,
} from "../features/study/studyContent.js";

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
    | "Study Hub"
    | "Accounting"
    | "Finance"
    | "Managerial & Cost"
    | "Economics"
    | "Entrepreneurship"
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
    "Study Hub": { hint: "Lessons, quizzes, and review flow", tone: "from-emerald-300/20 to-transparent", order: 3 },
    Accounting: { hint: "Reporting, valuation, and review", tone: "from-green-400/20 to-transparent", order: 4 },
    Finance: { hint: "Time value, lending, and capital budgeting", tone: "from-sky-400/15 to-transparent", order: 5 },
    "Managerial & Cost": { hint: "CVP, budgets, costing, and variances", tone: "from-orange-400/15 to-transparent", order: 6 },
    Economics: { hint: "Elasticity, markets, and macro basics", tone: "from-teal-400/15 to-transparent", order: 7 },
    Entrepreneurship: { hint: "Startup planning and small-business decisions", tone: "from-amber-400/15 to-transparent", order: 8 },
    "Business Math": { hint: "Pricing and applied math", tone: "from-fuchsia-400/15 to-transparent", order: 9 },
    Statistics: { hint: "Core analytics", tone: "from-violet-400/15 to-transparent", order: 10 },
};

function feature(
    path: string,
    label: string,
    category: AppNavGroupTitle,
    description: string,
    aliases: string[] = [],
    tags: string[] = [],
    shortLabel?: string,
    _legacyIsNew = false,
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
        isNew: CURRENT_RELEASE_NEW_PATHS.has(path),
        keywords,
        ...inferOfflineMeta(path),
    };
}

const CURRENT_RELEASE_NEW_PATHS = new Set([
    "/scan-check",
    "/accounting/process-costing-workspace",
    "/accounting/cost-per-equivalent-unit",
    "/accounting/cost-of-production-report",
    "/accounting/department-1-process-costing",
    "/accounting/department-transferred-in-process-costing",
    "/accounting/weighted-average-process-costing",
    "/accounting/fifo-process-costing",
    "/accounting/cost-reconciliation-checker",
    "/accounting/transferred-in-cost-helper",
    "/accounting/process-costing-practice-checker",
    "/accounting/adjusting-entries-workspace",
    "/accounting/working-capital-planner",
    "/accounting/inventory-control-workspace",
    "/economics/economics-analysis-workspace",
    "/entrepreneurship/entrepreneurship-toolkit",
    "/economics/price-elasticity-demand",
    "/economics/market-equilibrium",
    "/economics/surplus-analysis",
    "/economics/real-interest-rate",
    "/entrepreneurship/startup-cost-planner",
    "/entrepreneurship/unit-economics",
    "/entrepreneurship/sales-forecast-planner",
    "/entrepreneurship/cash-runway-planner",
    "/business/cvp-analysis",
    "/accounting/partnership-dissolution",
    "/study",
    "/study/practice",
]);

const SUBTOPIC_ORDER: Partial<Record<AppNavGroupTitle, string[]>> = {
    General: ["Workspace", "Settings"],
    "Core Tools": ["Calculator"],
    "Smart Tools": ["Solver"],
    "Study Hub": ["Learning Center", "Practice"],
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
    Economics: ["Microeconomics", "Market Analysis", "Inflation & Rates"],
    Entrepreneurship: ["Startup Planning", "Unit Economics", "Forecasting", "Cash Planning"],
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
        case "Study Hub":
            return path.includes("/quiz/") || path.includes("/practice")
                ? "Practice"
                : "Learning Center";
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
                haystack.includes("internal-rate") ||
                haystack.includes("irr") ||
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
            if (
                haystack.includes("budget") ||
                haystack.includes("collection") ||
                haystack.includes("disbursement") ||
                haystack.includes("cash receipts") ||
                haystack.includes("cash payments")
            ) {
                return "Budgeting";
            }
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
        case "Economics":
            if (
                haystack.includes("elasticity") ||
                haystack.includes("surplus")
            ) {
                return "Microeconomics";
            }
            if (haystack.includes("equilibrium") || haystack.includes("market")) {
                return "Market Analysis";
            }
            return "Inflation & Rates";
        case "Entrepreneurship":
            if (haystack.includes("startup") || haystack.includes("feasibility")) {
                return "Startup Planning";
            }
            if (haystack.includes("unit economics") || haystack.includes("pricing")) {
                return "Unit Economics";
            }
            if (haystack.includes("forecast")) {
                return "Forecasting";
            }
            return "Cash Planning";
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

    if (path === "/scan-check") {
        return {
            offlineSupport: "limited",
            offlineSummary:
                "The page and review UI can open offline after caching, but first OCR language downloads and camera access still depend on the browser.",
            offlineDetail:
                "Scan & Check is browser-first and local once its OCR assets are cached, but first-use OCR downloads, camera permission prompts, and notification behavior still vary by browser and device.",
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
    feature("/basic", "Scientific Calculator", "Core Tools", "Expression calculator with scientific functions, memory, and keyboard support.", ["basic calc", "standard calculator", "scientific calculator"], ["calculator", "scientific"], "Calculator"),
    feature("/smart/solver", "Smart Solver", "Smart Tools", "Natural-language routing into the right tool.", ["prompt solver", "smart search"], ["smart", "routing"], "Solver"),
    feature("/scan-check", "Scan & Check", "Smart Tools", "Browser-first OCR review for equations, textbook problems, worked solutions, and answer checking.", ["ocr scan", "camera solve", "image to text math"], ["scan", "ocr", "review"], "Scan", true, ["ocr", "scan", "camera", "extract equation", "check solution"]),
    feature("/study", "Study Hub", "Study Hub", "Browse topic lessons, continue learning, and move into quiz-based practice from one structured review space.", ["learning center", "study topics", "review hub"], ["study", "learn", "quiz"], "Study", true, ["study hub", "topic review", "quiz mode", "learning center"]),
    feature("/study/practice", "Practice Hub", "Study Hub", "Mini quizzes and review sets by topic with local progress tracking and answer explanations.", ["quiz hub", "practice mode"], ["study", "quiz", "practice"], "Practice", true, ["practice quiz", "topic quiz", "self check"]),

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
    feature("/accounting/partnership-dissolution", "Partnership Dissolution", "Accounting", "Review realization, liquidation cash, and deficiency handling during partnership dissolution.", ["partnership liquidation", "realization and liquidation", "partner deficiency"], ["partnership", "dissolution", "liquidation"], "Dissolution", true, ["partnership", "dissolution", "liquidation", "realization", "deficiency"]),
    feature("/accounting/partners-capital-statement", "Statement of Partners' Capital", "Accounting", "Roll forward capital balances for two or three partners.", ["partners capital statement", "capital rollforward", "statement of partners capital"], ["partnership", "equity", "capital"], undefined, true, ["partnership", "capital", "rollforward", "equity", "drawings"]),
    feature("/accounting/philippine-vat", "Philippine VAT", "Accounting", "Output VAT, input VAT, and net VAT at 12%.", ["vat payable", "input vat", "output vat"], ["tax", "philippines"]),
    feature("/accounting/current-ratio", "Current Ratio", "Accounting", "Current ratio plus working capital with solve-for support.", ["working capital", "liquidity ratio"], ["ratios", "liquidity"], undefined, true, ["current ratio", "working capital", "solve for current liabilities"]),
    feature("/accounting/quick-ratio", "Quick Ratio", "Accounting", "Acid-test liquidity coverage.", ["acid test ratio"], ["ratios", "liquidity"]),
    feature("/accounting/working-capital-cycle", "Working Capital and Operating Cycle", "Accounting", "Working capital, operating cycle, and cash conversion cycle in one workspace.", ["working capital cycle", "operating cycle"], ["ratios", "working capital", "analysis"], "Working Capital", true, ["working capital", "operating cycle", "cash conversion cycle"]),
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
    feature("/accounting/ratio-analysis-workspace", "Ratio Analysis Workspace", "Accounting", "Compute a compact set of liquidity, turnover, and return ratios from one coordinated input set.", ["ratio dashboard", "ratio analysis", "financial ratios workspace"], ["ratios", "analysis", "workspace"], "Ratios", true, ["ratio analysis", "liquidity", "turnover", "roa", "roe"]),
    feature("/accounting/times-interest-earned", "Times Interest Earned", "Accounting", "Interest coverage using EBIT.", ["interest coverage", "tie ratio"], ["ratios", "solvency"], undefined, true),
    feature("/accounting/earnings-per-share", "Earnings Per Share", "Accounting", "Basic EPS from net income, preferred dividends, and weighted shares.", ["eps"], ["ratios", "equity"]),
    feature("/accounting/book-value-per-share", "Book Value Per Share", "Accounting", "Book value represented by each common share.", ["bvps"], ["ratios", "equity"], undefined, true),
    feature("/accounting/equity-multiplier", "Equity Multiplier", "Accounting", "Measure financial leverage from average assets and average equity.", ["financial leverage", "dupont leverage", "equity leverage"], ["ratios", "equity", "solvency"], undefined, true, ["equity", "multiplier", "leverage", "dupont"]),
    feature("/accounting/horizontal-analysis", "Horizontal Analysis Workspace", "Accounting", "Multi-line amount and percentage change across periods.", ["trend analysis", "comparative statements"], ["analysis", "statements", "workspace"], "Horizontal", true, ["horizontal analysis", "comparative analysis", "trend analysis"]),
    feature("/accounting/common-size-income-statement", "Common-Size Income Statement", "Accounting", "Express income-statement lines as percentages of net sales.", ["vertical analysis income statement", "common size income"], ["analysis", "statements", "common-size"], "Common-Size IS", true, ["common size", "income statement", "vertical analysis"]),
    feature("/accounting/common-size-balance-sheet", "Common-Size Balance Sheet", "Accounting", "Express balance-sheet lines as percentages of total assets.", ["vertical analysis balance sheet", "common size balance sheet"], ["analysis", "statements", "common-size"], "Common-Size BS", true, ["common size", "balance sheet", "vertical analysis"]),
    feature("/accounting/adjusting-entries-workspace", "Adjusting Entries Workspace", "Accounting", "Handle prepaid, unearned, accrued revenue, and accrued expense adjustments from one worksheet.", ["adjusting entries", "adjustment worksheet", "prepaid adjustment", "accrued expense"], ["adjustments", "worksheet", "accruals"], "Adjustments", true, ["adjusting entries", "accruals", "deferrals", "journal entry"]),
    feature("/accounting/working-capital-planner", "Working Capital Planner", "Accounting", "Combine liquidity, turnover days, operating cycle, and cash conversion cycle in one planner.", ["working capital planner", "operating cycle planner", "ccc planner"], ["working capital", "analysis", "planner", "cash"], "WC Planner", true, ["working capital", "operating cycle", "cash conversion cycle", "planner"]),
    feature("/accounting/inventory-control-workspace", "Inventory Control Workspace", "Accounting", "Review shrinkage and purchase-discount discipline in one control-focused workspace.", ["inventory control", "shrinkage", "inventory shrinkage", "purchase discount control"], ["inventory", "control", "shrinkage", "discount"], "Inventory Control", true, ["inventory shrinkage", "inventory control", "cash discount", "purchase discipline"]),
    feature("/accounting/vertical-analysis", "Vertical Analysis", "Accounting", "Common-size statement percentage.", ["common size"], ["analysis", "statements"]),
    feature("/accounting/trial-balance-checker", "Trial Balance Checker", "Accounting", "Compare total debits and credits.", ["trial balance", "tb checker"], ["accounting cycle"], undefined, true),
    feature("/accounting/account-classification", "Account Classification Helper", "Accounting", "Look up account type, statement section, and normal balance.", ["normal balance helper", "chart of accounts helper"], ["accounting cycle", "classification"], undefined, true),
    feature("/accounting/debit-credit-trainer", "Debit and Credit Trainer", "Accounting", "Practice normal debit and credit balances.", ["debit credit quiz", "dr cr trainer"], ["accounting cycle", "study"], undefined, true),

    feature("/finance/simple-interest", "Simple Interest", "Finance", "Solve for interest, principal, rate, or time under simple interest.", ["i prt", "interest only"], ["interest", "solve-for"], undefined, true, ["simple interest", "principal", "rate", "time"]),
    feature("/finance/compound-interest", "Compound Interest", "Finance", "Solve forward or reverse using compounding frequency.", ["compounded interest"], ["interest", "solve-for"], undefined, true, ["compound interest", "compounding", "rate", "time"]),
    feature("/finance/future-value", "Future Value", "Finance", "Time-value solve mode for future value, present value, rate, or time.", ["fv", "single sum future value"], ["tvm", "solve-for"], "FV", true, ["future value", "present value", "discount rate"]),
    feature("/finance/present-value", "Present Value", "Finance", "Time-value solve mode for present value, future value, rate, or time.", ["pv", "discounted value"], ["tvm", "solve-for"], "PV", true, ["present value", "future value", "discount rate"]),
    feature("/finance/future-value-annuity", "Future Value of Annuity", "Finance", "Future value of an ordinary annuity.", ["fva", "annuity accumulation"], ["annuity", "tvm"]),
    feature("/finance/present-value-annuity", "Present Value of Annuity", "Finance", "Present value of an ordinary annuity.", ["pva", "annuity present worth"], ["annuity", "tvm"]),
    feature("/finance/effective-interest-rate", "Effective Interest Rate", "Finance", "Convert nominal annual rate to effective annual rate.", ["ear", "nominal vs effective"], ["rates"]),
    feature("/finance/sinking-fund-deposit", "Sinking Fund Deposit", "Finance", "Regular deposit needed to reach a target amount.", ["required deposit", "sinking fund"], ["annuity", "savings"]),
    feature("/finance/loan-amortization", "Loan Amortization", "Finance", "Monthly payment, total paid, and total interest.", ["monthly payment", "loan payment"], ["loan", "payment"]),
    feature("/finance/npv", "Net Present Value", "Finance", "Discount cash flows and compare them with the initial investment.", ["npv", "discounted cash flow"], ["capital budgeting"], "NPV", true),
    feature("/finance/capital-budgeting-comparison", "Capital Budgeting Comparison", "Finance", "Read NPV, PI, IRR, and discounted payback from one project cash-flow set.", ["capital budgeting dashboard", "project comparison"], ["capital budgeting", "analysis", "workspace"], "Capital Compare", true, ["capital budgeting", "npv", "irr", "profitability index", "discounted payback"]),
    feature("/finance/internal-rate-of-return", "Internal Rate of Return", "Finance", "Estimate the discount rate that makes NPV equal zero and flag multiple-IRR risk when applicable.", ["irr", "internal rate", "internal rate of return"], ["capital budgeting", "irr"], "IRR", true, ["irr", "internal rate of return", "project rate"]),
    feature("/finance/profitability-index", "Profitability Index", "Finance", "Discounted inflows per peso of investment.", ["pi", "benefit cost ratio"], ["capital budgeting"], "PI", true),
    feature("/finance/payback-period", "Payback Period", "Finance", "How long it takes to recover the initial investment.", ["payback", "recovery period"], ["capital budgeting"], undefined, true),
    feature("/finance/discounted-payback-period", "Discounted Payback Period", "Finance", "Discounted recovery period using the time value of money.", ["discounted payback", "discounted recovery period"], ["capital budgeting"], undefined, true, ["discounted payback", "discounted recovery"]),

    feature("/business/profit-loss", "Profit and Loss", "Business Math", "Solve for profit, revenue, or cost from the same worksheet.", ["profit or loss", "gain or loss"], ["commercial math", "solve-for"], undefined, true, ["profit", "loss", "revenue", "cost"]),
    feature("/business/markup-margin", "Price and Margin Planner", "Business Math", "Solve for price, cost, profit, or margin from the same pricing workspace.", ["gross margin", "markup percentage"], ["pricing", "solve-for"], "Planner", true, ["selling price", "margin", "markup", "cost"]),
    feature("/business/net-profit-margin", "Net Profit Margin", "Business Math", "Net income per peso of net sales.", ["net margin"], ["profitability"]),
    feature("/business-math/weighted-mean", "Weighted Mean", "Business Math", "Weighted mean from values and weights.", ["weighted average", "average with weights"], ["statistics"], undefined, true),

    feature("/business/contribution-margin", "Contribution Margin", "Managerial & Cost", "Solve for sales, variable costs, or contribution margin.", ["cm ratio"], ["cvp", "solve-for"], undefined, true, ["contribution margin", "sales", "variable costs"]),
    feature("/business/break-even", "Break-even Point", "Managerial & Cost", "Solve for break-even units, fixed costs, selling price, or variable cost.", ["break even", "be point"], ["cvp", "solve-for"], undefined, true, ["break even", "fixed cost", "target price"]),
    feature("/business/target-profit", "Target Profit", "Managerial & Cost", "Required units and sales for a target profit.", ["target income"], ["cvp"]),
    feature("/business/margin-of-safety", "Margin of Safety", "Managerial & Cost", "How far actual sales exceed break-even sales.", ["mos"], ["cvp"]),
    feature("/business/operating-leverage", "Operating Leverage", "Managerial & Cost", "Sensitivity of operating income to sales changes.", ["dol", "degree of operating leverage"], ["cvp"]),
    feature("/business/sales-mix-break-even", "Sales Mix Break-even", "Managerial & Cost", "Break-even analysis for multi-product sales mixes.", ["multi product break even", "sales mix cvp", "composite unit break even"], ["cvp", "sales mix", "break-even"], undefined, true, ["sales mix", "composite unit", "weighted contribution margin"]),
    feature("/business/cvp-analysis", "CVP Analysis", "Managerial & Cost", "Study contribution margin, break-even, target profit, margin of safety, operating leverage, and quick sensitivity in one page.", ["cvp dashboard", "cost volume profit analysis", "managerial cvp"], ["cvp", "analysis", "decision"], "CVP Analysis", true, ["cvp", "break-even", "target profit", "margin of safety", "operating leverage"]),
    feature("/business/cash-collections-schedule", "Cash Collections Schedule", "Managerial & Cost", "Build a month-based receipts schedule from sales and collection lag patterns.", ["schedule of cash collections", "cash receipts schedule"], ["budgeting", "collections", "cash"], undefined, true, ["cash collections", "collections schedule", "cash receipts"]),
    feature("/business/cash-disbursements-schedule", "Cash Disbursements Schedule", "Managerial & Cost", "Build a month-based disbursement schedule from purchases and payment lag patterns.", ["schedule of cash disbursements", "cash payments schedule"], ["budgeting", "disbursements", "cash"], undefined, true, ["cash disbursements", "cash payments", "payments schedule"]),
    feature("/business/cash-budget", "Cash Budget", "Managerial & Cost", "Single-period cash budget with financing need visibility.", ["cash planning budget", "cash forecast budget"], ["budgeting", "cash"], undefined, true, ["cash budget", "financing", "minimum cash"]),
    feature("/business/flexible-budget", "Flexible Budget", "Managerial & Cost", "Separate activity variance from spending variance using a flexible cost budget.", ["static versus flexible budget", "budget variance"], ["budgeting", "variance"], undefined, true, ["flexible budget", "activity variance", "spending variance"]),
    feature("/economics/price-elasticity-demand", "Price Elasticity of Demand", "Economics", "Midpoint elasticity, revenue movement, and demand classification.", ["ped", "demand elasticity"], ["elasticity", "microeconomics"], "Elasticity", true, ["price elasticity", "elastic demand", "inelastic demand"]),
    feature("/economics/market-equilibrium", "Market Equilibrium", "Economics", "Solve equilibrium price and quantity from linear demand and supply equations.", ["supply and demand equilibrium", "equilibrium price"], ["market", "equilibrium"], "Equilibrium", true, ["equilibrium", "supply and demand", "market clearing"]),
    feature("/economics/surplus-analysis", "Consumer and Producer Surplus", "Economics", "Estimate welfare gains from trade at a known equilibrium.", ["consumer surplus", "producer surplus"], ["surplus", "microeconomics"], "Surplus", true, ["consumer surplus", "producer surplus", "total surplus"]),
    feature("/economics/real-interest-rate", "Real Interest Rate", "Economics", "Compare exact and approximate real rates after inflation.", ["fisher equation", "real rate"], ["inflation", "rates"], "Real Rate", true, ["real interest rate", "inflation", "fisher"]),
    feature("/economics/economics-analysis-workspace", "Economics Analysis Workspace", "Economics", "Compare price, income, and cross elasticity cases from one guided study page.", ["elasticity workspace", "price income cross elasticity"], ["elasticity", "microeconomics", "workspace"], "Elasticity Lab", true, ["elasticity workspace", "price elasticity", "income elasticity", "cross elasticity"]),

    feature("/entrepreneurship/startup-cost-planner", "Startup Cost Planner", "Entrepreneurship", "Organize launch costs, contingency, and opening cash needs.", ["startup budget", "startup costs"], ["startup", "planning"], "Startup Costs", true, ["startup cost", "launch budget", "feasibility"]),
    feature("/entrepreneurship/unit-economics", "Unit Economics Workspace", "Entrepreneurship", "Read contribution, break-even, and customer-level economics from one worksheet.", ["customer economics", "startup unit economics"], ["unit economics", "pricing"], "Unit Economics", true, ["unit economics", "cac", "contribution"]),
    feature("/entrepreneurship/sales-forecast-planner", "Sales Forecast Planner", "Entrepreneurship", "Project sales and gross profit from a monthly growth assumption.", ["sales projection", "revenue forecast"], ["forecasting", "sales"], "Sales Forecast", true, ["sales forecast", "revenue projection", "growth forecast"]),
    feature("/entrepreneurship/cash-runway-planner", "Cash Runway Planner", "Entrepreneurship", "Estimate runway from current cash, recurring inflows, and recurring outflows.", ["runway calculator", "startup runway"], ["cash", "runway"], "Cash Runway", true, ["cash runway", "burn rate", "startup cash"]),
    feature("/entrepreneurship/entrepreneurship-toolkit", "Entrepreneurship Toolkit", "Entrepreneurship", "Use one workspace for pricing targets, owner splits, and customer payback checks.", ["pricing target toolkit", "owner split planner", "customer payback"], ["unit economics", "pricing", "planning", "toolkit"], "Toolkit", true, ["selling price", "owner split", "customer payback", "startup toolkit"]),
    feature("/accounting/cost-of-goods-manufactured", "Cost of Goods Manufactured", "Managerial & Cost", "Manufacturing costs and COGM.", ["cogm"], ["cost accounting"]),
    feature("/accounting/factory-overhead-variance", "Factory Overhead Variances", "Managerial & Cost", "Separate variable and fixed overhead variances into spending, efficiency, budget, and volume components.", ["factory overhead variance", "overhead variance", "fixed overhead variance", "variable overhead variance"], ["variance", "overhead", "manufacturing"], "Overhead", true, ["factory overhead", "overhead variance", "voh", "foh"]),
    feature("/accounting/equivalent-units-weighted-average", "Equivalent Units (Weighted Average)", "Managerial & Cost", "Weighted-average process-costing equivalent units and cost assignment.", ["process costing weighted average", "equivalent units"], ["process costing", "equivalent units"], undefined, true, ["equivalent units", "weighted average", "process costing"]),
    feature("/accounting/process-costing-workspace", "Process Costing Workspace", "Managerial & Cost", "Configurable process-costing workspace for weighted average, FIFO, transferred-in cost, and reconciliation.", ["process costing workspace", "departmental costing"], ["process costing", "workspace", "manufacturing"], "Process", true, ["process costing", "cost of production report", "departmental process costing"]),
    feature("/accounting/cost-per-equivalent-unit", "Cost per Equivalent Unit", "Managerial & Cost", "Turn materials, labor, overhead, conversion, and transferred-in cost into method-aware cost per equivalent unit.", ["cost per equivalent unit", "cost per eup"], ["process costing", "equivalent units"], "Cost / EU", true, ["equivalent unit", "cost per equivalent unit", "process costing"]),
    feature("/accounting/cost-of-production-report", "Cost of Production Report", "Managerial & Cost", "Generate a clean quantity, equivalent-unit, and cost-of-production schedule from one workspace.", ["production report", "cost of production report"], ["process costing", "report", "worksheet"], "Production Report", true, ["cost of production report", "production report", "process costing"]),
    feature("/accounting/department-1-process-costing", "Department 1 Process Costing", "Managerial & Cost", "Department-1 process-costing schedule without transferred-in cost.", ["department 1 process costing", "dept 1 worksheet"], ["process costing", "department"], "Dept 1", true, ["department 1", "process costing", "equivalent units"]),
    feature("/accounting/department-transferred-in-process-costing", "Department 2+ Process Costing", "Managerial & Cost", "Later-department worksheet with transferred-in cost and carry-forward checking.", ["department 2 process costing", "transferred in process costing"], ["process costing", "department", "transferred-in"], "Dept 2+", true, ["department 2", "transferred in", "process costing"]),
    feature("/accounting/weighted-average-process-costing", "Weighted Average Process Costing", "Managerial & Cost", "Weighted-average process-costing workflow with ending-WIP and transferred-out cost assignment.", ["weighted average process costing"], ["process costing", "weighted average"], "WA Process", true, ["weighted average process costing", "ending wip", "transferred out"]),
    feature("/accounting/fifo-process-costing", "FIFO Process Costing", "Managerial & Cost", "FIFO process-costing workflow with current-period equivalent units and beginning-WIP carry-forward.", ["fifo process costing"], ["process costing", "fifo"], "FIFO Process", true, ["fifo process costing", "beginning wip", "current period equivalent units"]),
    feature("/accounting/cost-reconciliation-checker", "Cost Reconciliation Checker", "Managerial & Cost", "Check costs to be accounted for versus costs accounted for, with method-aware warnings.", ["cost reconciliation", "costs accounted for"], ["process costing", "reconciliation"], "Reconcile", true, ["cost reconciliation", "costs accounted for", "costs to be accounted for"]),
    feature("/accounting/transferred-in-cost-helper", "Transferred-In Cost Helper", "Managerial & Cost", "Isolate transferred-in cost from current department additions and verify carry-forward logic.", ["transferred in cost helper"], ["process costing", "transferred-in"], "Transferred-In", true, ["transferred in", "department 2", "carry forward"]),
    feature("/accounting/process-costing-practice-checker", "Process Costing Practice Checker", "Managerial & Cost", "Compare scanned or typed student answers against system process-costing totals.", ["process costing checker", "worksheet checker"], ["process costing", "scan review", "checker"], "Practice Check", true, ["practice problem checker", "process costing checker", "ocr worksheet checker"]),
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
    const exact = APP_ROUTE_META_MAP.get(path);
    if (exact) return exact;

    const studyTopic = getStudyTopicByPath(path);
    if (studyTopic) {
        return {
            path: buildStudyTopicPath(studyTopic.id),
            label: studyTopic.title,
            category: "Study Hub",
            subtopic: "Learning Center",
            description: studyTopic.summary,
            shortLabel: studyTopic.shortTitle,
            aliases: [studyTopic.shortTitle.toLowerCase(), `${studyTopic.title.toLowerCase()} lesson`],
            keywords: studyTopic.keywords,
            tags: ["study", "lesson", studyTopic.category.toLowerCase(), studyTopic.id],
            offlineSupport: "full",
            offlineSummary:
                "Topic lessons, explanations, and quiz links stay available offline after the current release is cached.",
            offlineDetail:
                "Study Hub lessons and practice links are browser-local after caching, with bookmarks, notes, and progress stored on this device.",
            isNew: true,
        };
    }

    const studyQuizTopic = getStudyQuizTopicByPath(path);
    if (studyQuizTopic) {
        return {
            path: buildStudyQuizPath(studyQuizTopic.id),
            label: `${studyQuizTopic.title} Quiz`,
            category: "Study Hub",
            subtopic: "Practice",
            description: `Mini practice set for ${studyQuizTopic.title} with explanations and local progress tracking.`,
            shortLabel: `${studyQuizTopic.shortTitle} Quiz`,
            aliases: [`${studyQuizTopic.title.toLowerCase()} quiz`, `${studyQuizTopic.shortTitle.toLowerCase()} practice`],
            keywords: [...studyQuizTopic.keywords, "quiz", "practice", "self check"],
            tags: ["study", "quiz", "practice", studyQuizTopic.id],
            offlineSupport: "full",
            offlineSummary:
                "Topic quizzes and answer explanations remain available offline after the current release is cached.",
            offlineDetail:
                "Practice mode runs locally in the browser, with attempts and scores saved on this device without a backend account.",
            isNew: true,
        };
    }

    return null;
}
