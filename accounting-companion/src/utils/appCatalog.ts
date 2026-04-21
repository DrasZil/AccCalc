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

type LegacyRouteCategory =
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

export type AppNavGroupTitle =
    | "General"
    | "Smart Tools"
    | "Study Hub"
    | "FAR"
    | "AFAR"
    | "Cost & Managerial"
    | "Audit & Assurance"
    | "Taxation"
    | "RFBT & Law"
    | "AIS & IT Controls"
    | "Operations & Supply Chain"
    | "Governance & Ethics"
    | "Strategic & Integrative"
    | "Finance / Econ / Math";

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
    General: { hint: "Home, settings, and utility access", tone: "from-emerald-400/20 to-transparent", order: 0 },
    "Smart Tools": { hint: "Prompt routing, scan review, and discovery", tone: "from-amber-300/15 to-transparent", order: 1 },
    "Study Hub": { hint: "Lessons, quizzes, and curriculum review flow", tone: "from-emerald-300/20 to-transparent", order: 2 },
    FAR: { hint: "Financial accounting, reporting, and statement preparation", tone: "from-green-400/20 to-transparent", order: 3 },
    AFAR: { hint: "Special accounting topics, consolidations, and partnership flows", tone: "from-cyan-400/16 to-transparent", order: 4 },
    "Cost & Managerial": { hint: "CVP, costing, budgeting, pricing, and performance", tone: "from-orange-400/15 to-transparent", order: 5 },
    "Audit & Assurance": { hint: "Audit planning, risk, evidence, and reporting", tone: "from-sky-400/15 to-transparent", order: 6 },
    Taxation: { hint: "Tax logic, VAT, and accounting-vs-tax reconciliation", tone: "from-rose-400/15 to-transparent", order: 7 },
    "RFBT & Law": { hint: "Business law, obligations, contracts, and governance law", tone: "from-indigo-400/15 to-transparent", order: 8 },
    "AIS & IT Controls": { hint: "IT governance, application controls, and IT audit", tone: "from-teal-400/15 to-transparent", order: 9 },
    "Operations & Supply Chain": { hint: "Inventory, capacity, forecasting, and operating flow", tone: "from-amber-400/15 to-transparent", order: 10 },
    "Governance & Ethics": { hint: "Risk, control, ethics, and internal-governance support", tone: "from-violet-400/15 to-transparent", order: 11 },
    "Strategic & Integrative": { hint: "Board-review integration, analytics, and case mapping", tone: "from-fuchsia-400/15 to-transparent", order: 12 },
    "Finance / Econ / Math": { hint: "Finance, economics, analytics, and applied quantitative tools", tone: "from-blue-400/15 to-transparent", order: 13 },
};

function feature(
    path: string,
    label: string,
    legacyCategory: LegacyRouteCategory,
    description: string,
    aliases: string[] = [],
    tags: string[] = [],
    shortLabel?: string,
    _legacyIsNew = false,
    keywords: string[] = []
): RouteMeta {
    const category = inferCurriculumTrack(path, legacyCategory, tags, label);
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
    "/workpapers",
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
    "/accounting/petty-cash-reconciliation",
    "/accounting/prepaid-expense-adjustment",
    "/accounting/unearned-revenue-adjustment",
    "/accounting/accrued-revenue-adjustment",
    "/accounting/accrued-expense-adjustment",
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
    "/business/special-order-analysis",
    "/business/make-or-buy-analysis",
    "/business/sell-or-process-further",
    "/business/constrained-resource-product-mix",
    "/business/budget-variance-analysis",
    "/business/capacity-utilization",
    "/business/additional-funds-needed",
    "/business/high-low-cost-estimation",
    "/business/production-budget",
    "/business/direct-materials-purchases-budget",
    "/business/direct-labor-budget",
    "/business/factory-overhead-budget",
    "/business/sales-budget",
    "/business/inventory-budget",
    "/business/operating-expense-budget",
    "/business/budgeted-income-statement",
    "/business/roi-ri-eva",
    "/accounting/partnership-dissolution",
    "/study",
    "/study/practice",
    "/accounting/job-order-cost-sheet",
    "/statistics/coefficient-of-variation",
    "/operations/eoq-and-reorder-point",
    "/operations/moving-average-forecast",
    "/far/lease-measurement-workspace",
    "/far/share-based-payment-workspace",
    "/far/impairment-loss-workspace",
    "/far/asset-disposal-analysis",
    "/far/retained-earnings-rollforward",
    "/far/cash-flow-statement-builder",
    "/far/statement-of-changes-in-equity-builder",
    "/audit/audit-planning-workspace",
    "/audit/audit-cycle-reviewer",
    "/audit/audit-completion-and-opinion",
    "/tax/book-tax-difference-workspace",
    "/tax/vat-reconciliation",
    "/tax/percentage-tax",
    "/tax/withholding-tax",
    "/tax/tax-compliance-review",
    "/afar/business-combination-analysis",
    "/afar/equity-method-investment",
    "/afar/intercompany-inventory-profit",
    "/afar/intercompany-ppe-transfer",
    "/afar/foreign-currency-translation",
    "/afar/construction-revenue-workspace",
    "/ais/it-control-matrix",
    "/ais/ais-lifecycle-and-recovery",
    "/governance/risk-control-matrix",
    "/rfbt/business-law-review",
    "/rfbt/commercial-transactions-reviewer",
    "/strategic/integrative-case-mapper",
    "/strategic/strategic-business-analysis",
    "/finance/accounting-rate-of-return",
    "/finance/equivalent-annual-annuity",
]);

const SUBTOPIC_ORDER: Partial<Record<AppNavGroupTitle, string[]>> = {
    General: ["Workspace", "Utilities", "Settings"],
    "Smart Tools": ["Solver"],
    "Study Hub": ["Learning Center", "Practice"],
    FAR: [
        "Fundamentals",
        "Receivables & Cash",
        "Inventory",
        "Assets & Measurement",
        "Liabilities & Equity",
        "Financial Statements",
    ],
    AFAR: ["Partnership", "Business Combination", "Foreign Operations", "Special Topics"],
    "Cost & Managerial": [
        "CVP & Decisions",
        "Budgeting",
        "Planning & Operations",
        "Manufacturing Costs",
        "Variances",
        "Performance Management",
    ],
    "Audit & Assurance": ["Planning & Risk", "Evidence & Procedures", "Reporting & Completion"],
    Taxation: ["VAT & Business Taxes", "Income Tax & Differences", "Compliance & Remedies"],
    "RFBT & Law": ["Obligations & Contracts", "Corporation Law", "Commercial Law"],
    "AIS & IT Controls": ["IT Governance", "General Controls", "Application Controls"],
    "Operations & Supply Chain": ["Inventory Planning", "Capacity & Scheduling", "Forecasting & Quality"],
    "Governance & Ethics": ["Risk & Control", "Ethics & Governance"],
    "Strategic & Integrative": ["Financial Analysis", "Case Integration", "Startup & Strategy"],
    "Finance / Econ / Math": ["Interest & TVM", "Capital Budgeting", "Economics", "Analytics"],
};

function inferCurriculumTrack(
    path: string,
    legacyCategory: LegacyRouteCategory,
    tags: string[],
    label: string
): AppNavGroupTitle {
    const haystack = `${path} ${label} ${tags.join(" ")}`.toLowerCase();

    if (legacyCategory === "General" || legacyCategory === "Core Tools") return "General";
    if (legacyCategory === "Smart Tools") return "Smart Tools";
    if (legacyCategory === "Study Hub") return "Study Hub";
    if (path.startsWith("/far/")) return "FAR";
    if (path.startsWith("/audit/")) return "Audit & Assurance";
    if (path.startsWith("/tax/")) return "Taxation";
    if (path.startsWith("/rfbt/")) return "RFBT & Law";
    if (path.startsWith("/ais/")) return "AIS & IT Controls";
    if (path.startsWith("/governance/")) return "Governance & Ethics";
    if (path.startsWith("/strategic/")) return "Strategic & Integrative";
    if (path.startsWith("/operations/")) return "Operations & Supply Chain";
    if (path.startsWith("/afar/")) return "AFAR";

    if (legacyCategory === "Accounting") {
        if (haystack.includes("partnership") || haystack.includes("business combination")) {
            return "AFAR";
        }
        if (haystack.includes("vat") || haystack.includes("tax")) return "Taxation";
        if (
            haystack.includes("ratio") ||
            haystack.includes("return on") ||
            haystack.includes("turnover") ||
            haystack.includes("working capital") ||
            haystack.includes("analysis")
        ) {
            return "Strategic & Integrative";
        }
        return "FAR";
    }

    if (legacyCategory === "Managerial & Cost") {
        if (
            haystack.includes("capacity") ||
            haystack.includes("inventory control") ||
            haystack.includes("eoq") ||
            haystack.includes("reorder point")
        ) {
            return "Operations & Supply Chain";
        }
        return "Cost & Managerial";
    }

    if (
        legacyCategory === "Finance" ||
        legacyCategory === "Economics" ||
        legacyCategory === "Entrepreneurship" ||
        legacyCategory === "Business Math" ||
        legacyCategory === "Statistics"
    ) {
        if (
            haystack.includes("startup") ||
            haystack.includes("runway") ||
            haystack.includes("unit economics")
        ) {
            return "Strategic & Integrative";
        }
        return "Finance / Econ / Math";
    }

    return "General";
}

function inferSubtopic(
    category: AppNavGroupTitle,
    path: string,
    tags: string[],
    label: string
) {
    const haystack = `${path} ${label} ${tags.join(" ")}`.toLowerCase();

    switch (category) {
        case "General":
            if (path.startsWith("/settings")) return "Settings";
            if (path === "/basic") return "Utilities";
            return "Workspace";
        case "Smart Tools":
            return "Solver";
        case "Study Hub":
            return path.includes("/quiz/") || path.includes("/practice")
                ? "Practice"
                : "Learning Center";
        case "FAR":
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

            if (
                haystack.includes("depreciation") ||
                haystack.includes("bond") ||
                haystack.includes("asset") ||
                haystack.includes("investment property") ||
                haystack.includes("impairment")
            ) {
                return "Assets & Measurement";
            }

            if (
                haystack.includes("liabilities") ||
                haystack.includes("equity") ||
                haystack.includes("eps") ||
                haystack.includes("book value per share")
            ) {
                return "Liabilities & Equity";
            }

            return "Financial Statements";
        case "AFAR":
            if (haystack.includes("partnership")) return "Partnership";
            if (haystack.includes("combination") || haystack.includes("consolid")) {
                return "Business Combination";
            }
            if (haystack.includes("foreign") || haystack.includes("branch")) {
                return "Foreign Operations";
            }
            return "Special Topics";
        case "Cost & Managerial":
            if (
                haystack.includes("budget") ||
                haystack.includes("collection") ||
                haystack.includes("disbursement")
            ) {
                return "Budgeting";
            }
            if (haystack.includes("variance")) return "Variances";
            if (
                haystack.includes("roi") ||
                haystack.includes("residual") ||
                haystack.includes("eva") ||
                haystack.includes("transfer pricing")
            ) {
                return "Performance Management";
            }
            if (
                haystack.includes("capacity") ||
                haystack.includes("high-low") ||
                haystack.includes("planning")
            ) {
                return "Planning & Operations";
            }
            if (
                haystack.includes("break-even") ||
                haystack.includes("margin") ||
                haystack.includes("profit")
            ) {
                return "CVP & Decisions";
            }
            return "Manufacturing Costs";
        case "Audit & Assurance":
            if (haystack.includes("planning") || haystack.includes("materiality") || haystack.includes("risk")) {
                return "Planning & Risk";
            }
            if (haystack.includes("evidence") || haystack.includes("control") || haystack.includes("procedure")) {
                return "Evidence & Procedures";
            }
            return "Reporting & Completion";
        case "Taxation":
            if (haystack.includes("vat") || haystack.includes("business tax") || haystack.includes("percentage tax")) {
                return "VAT & Business Taxes";
            }
            if (haystack.includes("difference") || haystack.includes("income")) {
                return "Income Tax & Differences";
            }
            return "Compliance & Remedies";
        case "RFBT & Law":
            if (haystack.includes("obligation") || haystack.includes("contract")) {
                return "Obligations & Contracts";
            }
            if (haystack.includes("corporation")) return "Corporation Law";
            return "Commercial Law";
        case "AIS & IT Controls":
            if (haystack.includes("governance") || haystack.includes("policy")) return "IT Governance";
            if (haystack.includes("application")) return "Application Controls";
            return "General Controls";
        case "Operations & Supply Chain":
            if (haystack.includes("eoq") || haystack.includes("reorder") || haystack.includes("inventory")) {
                return "Inventory Planning";
            }
            if (haystack.includes("capacity") || haystack.includes("schedule")) {
                return "Capacity & Scheduling";
            }
            return "Forecasting & Quality";
        case "Governance & Ethics":
            return haystack.includes("ethic") ? "Ethics & Governance" : "Risk & Control";
        case "Strategic & Integrative":
            if (haystack.includes("analysis") || haystack.includes("ratio")) return "Financial Analysis";
            if (haystack.includes("startup") || haystack.includes("strategy")) return "Startup & Strategy";
            return "Case Integration";
        case "Finance / Econ / Math":
            if (
                haystack.includes("npv") ||
                haystack.includes("internal-rate") ||
                haystack.includes("irr") ||
                haystack.includes("profitability-index") ||
                haystack.includes("payback") ||
                haystack.includes("arr") ||
                haystack.includes("annual annuity") ||
                haystack.includes("eaa")
            ) {
                return "Capital Budgeting";
            }

            if (
                haystack.includes("loan") ||
                haystack.includes("annuity") ||
                haystack.includes("sinking-fund")
            ) {
                return "Interest & TVM";
            }
            if (
                haystack.includes("elasticity") ||
                haystack.includes("equilibrium") ||
                haystack.includes("surplus") ||
                haystack.includes("real interest")
            ) {
                return "Economics";
            }
            return "Analytics";
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
    feature("/workpapers", "Workpaper Studio", "General", "Workbook-style workpapers with templates, autosave, calculator transfer inbox, and XLSX or CSV import-export support.", ["spreadsheet", "workbook", "workpaper", "schedule builder"], ["workpaper", "spreadsheet", "workspace"], "Workpapers", true, ["workpaper studio", "spreadsheet workpaper", "xlsx import", "xlsx export", "calculator to workbook"]),
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
    feature("/accounting/notes-receivable-discounting", "Notes Receivable Discounting", "Accounting", "Compute maturity value, bank discount, and proceeds when a note receivable is discounted before maturity.", ["discounting of note receivable", "discounted note", "note discounting"], ["notes", "receivables", "cash"], "Note Discount", true, ["notes receivable discounting", "bank discount", "discounted note", "proceeds on discounting"]),
    feature("/accounting/cash-discount", "Cash Discount", "Accounting", "Evaluate cash discount credit terms.", ["2/10 n/30", "credit terms"], ["discount", "merchandising"]),
    feature("/accounting/fifo-inventory", "FIFO Inventory", "Accounting", "FIFO cost of goods sold and ending inventory.", ["first in first out", "fifo cogs"], ["inventory", "cogs"]),
    feature("/accounting/weighted-average-inventory", "Weighted Average Inventory", "Accounting", "Weighted-average unit cost, COGS, and ending inventory.", ["average cost inventory"], ["inventory", "cogs"]),
    feature("/accounting/inventory-method-comparison", "Inventory Method Comparison", "Accounting", "Compare FIFO and weighted-average effects on COGS and ending inventory.", ["fifo vs weighted average", "inventory comparison"], ["inventory", "analysis"], undefined, true),
    feature("/accounting/gross-profit-method", "Gross Profit Method", "Accounting", "Estimate gross profit, COGS, and ending inventory.", ["gp method", "inventory estimate"], ["inventory", "estimate"]),
    feature("/accounting/lower-of-cost-or-nrv", "Lower of Cost or NRV", "Accounting", "Compare inventory cost and net realizable value item by item or in aggregate.", ["lower of cost and net realizable value", "lcnrv", "lc nrv"], ["inventory", "valuation", "nrv"], undefined, true, ["lower of cost", "nrv", "inventory write-down"]),
    feature("/accounting/bank-reconciliation", "Bank Reconciliation", "Accounting", "Reconcile bank and book balances.", ["bank recon", "cash reconciliation", "adjusted cash balance", "balance per books"], ["cash", "reconciliation"], undefined, true, ["bank reconciliation", "balance per bank", "balance per books", "deposits in transit", "outstanding checks"]),
    feature("/accounting/petty-cash-reconciliation", "Petty Cash Reconciliation", "Accounting", "Reconcile a petty cash fund using cash on hand, vouchers, and other accountable items.", ["petty cash count", "petty cash proof", "petty cash fund reconciliation"], ["cash", "reconciliation", "control"], "Petty Cash", true, ["petty cash", "cash count", "short and over", "vouchers", "replenishment"]),
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
    feature("/accounting/prepaid-expense-adjustment", "Prepaid Expense Adjustment", "Accounting", "Compute expense recognized or ending prepaid balance for a deferral adjustment.", ["prepaid adjustment", "insurance adjustment", "supplies adjustment", "insurance expired adjusting entry", "supplies used adjusting entry"], ["adjustments", "deferrals", "accruals"], "Prepaid", true, ["prepaid expense", "deferral", "expense recognized", "adjusting entry", "insurance expired", "supplies used"]),
    feature("/accounting/unearned-revenue-adjustment", "Unearned Revenue Adjustment", "Accounting", "Compute revenue recognized or ending unearned revenue for a deferral adjustment.", ["unearned revenue adjustment", "deferred revenue adjustment", "liability method adjustment"], ["adjustments", "deferrals", "revenue"], "Unearned", true, ["unearned revenue", "deferred revenue", "revenue recognized", "adjusting entry"]),
    feature("/accounting/accrued-revenue-adjustment", "Accrued Revenue Adjustment", "Accounting", "Compute accrued revenue when services are earned before cash collection.", ["accrued revenue adjustment", "revenue earned not collected", "receivable adjustment"], ["adjustments", "accruals", "revenue"], "Accrued Rev", true, ["accrued revenue", "revenue earned", "cash collected", "adjusting entry"]),
    feature("/accounting/accrued-expense-adjustment", "Accrued Expense Adjustment", "Accounting", "Compute accrued expense when costs are incurred before cash payment.", ["accrued expense adjustment", "expense incurred not paid", "payable adjustment"], ["adjustments", "accruals", "expense"], "Accrued Exp", true, ["accrued expense", "expense incurred", "cash paid", "adjusting entry"]),
    feature("/accounting/working-capital-planner", "Working Capital Planner", "Accounting", "Combine liquidity, turnover days, operating cycle, and cash conversion cycle in one planner.", ["working capital planner", "operating cycle planner", "ccc planner", "working capital control"], ["working capital", "analysis", "planner", "cash"], "WC Planner", true, ["working capital", "operating cycle", "cash conversion cycle", "planner", "cash pressure", "short-term liquidity"]),
    feature("/accounting/inventory-control-workspace", "Inventory Control Workspace", "Accounting", "Review shrinkage and purchase-discount discipline in one control-focused workspace.", ["inventory control", "shrinkage", "inventory shrinkage", "purchase discount control", "stock shrinkage review"], ["inventory", "control", "shrinkage", "discount"], "Inventory Control", true, ["inventory shrinkage", "inventory control", "cash discount", "purchase discipline", "book versus physical", "physical count"]),
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
    feature("/finance/accounting-rate-of-return", "Accounting Rate of Return", "Finance", "Read ARR from average accounting income and average investment, or reverse-solve the supporting project figures.", ["arr", "accounting rate of return", "average investment"], ["capital budgeting", "arr", "project evaluation"], "ARR", true, ["accounting rate of return", "arr", "average investment", "capital budgeting"]),
    feature("/finance/capital-budgeting-comparison", "Capital Budgeting Comparison", "Finance", "Read NPV, PI, IRR, and discounted payback from one project cash-flow set.", ["capital budgeting dashboard", "project comparison"], ["capital budgeting", "analysis", "workspace"], "Capital Compare", true, ["capital budgeting", "npv", "irr", "profitability index", "discounted payback"]),
    feature("/finance/equivalent-annual-annuity", "Equivalent Annual Annuity", "Finance", "Annualize NPV for projects with unequal lives so rankings can be compared on a yearly basis.", ["eaa", "equivalent annual annuity", "annualized npv"], ["capital budgeting", "eaa", "analysis"], "EAA", true, ["equivalent annual annuity", "eaa", "annualized npv", "unequal project lives"]),
    feature("/finance/internal-rate-of-return", "Internal Rate of Return", "Finance", "Estimate the discount rate that makes NPV equal zero and flag multiple-IRR risk when applicable.", ["irr", "internal rate", "internal rate of return"], ["capital budgeting", "irr"], "IRR", true, ["irr", "internal rate of return", "project rate"]),
    feature("/finance/profitability-index", "Profitability Index", "Finance", "Discounted inflows per peso of investment.", ["pi", "benefit cost ratio"], ["capital budgeting"], "PI", true),
    feature("/finance/payback-period", "Payback Period", "Finance", "How long it takes to recover the initial investment.", ["payback", "recovery period"], ["capital budgeting"], undefined, true),
    feature("/finance/discounted-payback-period", "Discounted Payback Period", "Finance", "Discounted recovery period using the time value of money.", ["discounted payback", "discounted recovery period"], ["capital budgeting"], undefined, true, ["discounted payback", "discounted recovery"]),

    feature("/business/profit-loss", "Profit and Loss", "Business Math", "Solve for profit, revenue, or cost from the same worksheet.", ["profit or loss", "gain or loss", "loss or profit", "gross profit check"], ["commercial math", "solve-for"], undefined, true, ["profit", "loss", "revenue", "cost", "gross profit"]),
    feature("/business/markup-margin", "Price and Margin Planner", "Business Math", "Solve for price, cost, profit, or margin from the same pricing workspace.", ["gross margin", "markup percentage", "selling price planning", "pricing worksheet"], ["pricing", "solve-for"], "Planner", true, ["selling price", "margin", "markup", "cost", "pricing"]),
    feature("/business/net-profit-margin", "Net Profit Margin", "Business Math", "Net income per peso of net sales.", ["net margin"], ["profitability"]),
    feature("/business-math/weighted-mean", "Weighted Mean", "Business Math", "Weighted mean from values and weights.", ["weighted average", "average with weights", "weighted average grade", "weighted score"], ["statistics", "business analytics"], undefined, true, ["weighted mean", "weighted average", "weights", "average"]),

    feature("/business/contribution-margin", "Contribution Margin", "Managerial & Cost", "Solve for sales, variable costs, or contribution margin.", ["cm ratio"], ["cvp", "solve-for"], undefined, true, ["contribution margin", "sales", "variable costs"]),
    feature("/business/break-even", "Break-even Point", "Managerial & Cost", "Solve for break-even units, fixed costs, selling price, or variable cost.", ["break even", "be point"], ["cvp", "solve-for"], undefined, true, ["break even", "fixed cost", "target price"]),
    feature("/business/target-profit", "Target Profit", "Managerial & Cost", "Required units and sales for a target profit.", ["target income"], ["cvp"]),
    feature("/business/margin-of-safety", "Margin of Safety", "Managerial & Cost", "How far actual sales exceed break-even sales.", ["mos"], ["cvp"]),
    feature("/business/operating-leverage", "Operating Leverage", "Managerial & Cost", "Sensitivity of operating income to sales changes.", ["dol", "degree of operating leverage"], ["cvp"]),
    feature("/business/sales-mix-break-even", "Sales Mix Break-even", "Managerial & Cost", "Break-even analysis for multi-product sales mixes.", ["multi product break even", "sales mix cvp", "composite unit break even"], ["cvp", "sales mix", "break-even"], undefined, true, ["sales mix", "composite unit", "weighted contribution margin"]),
    feature("/business/cvp-analysis", "CVP Analysis", "Managerial & Cost", "Study contribution margin, break-even, target profit, margin of safety, operating leverage, and quick sensitivity in one page.", ["cvp dashboard", "cost volume profit analysis", "managerial cvp"], ["cvp", "analysis", "decision"], "CVP Analysis", true, ["cvp", "break-even", "target profit", "margin of safety", "operating leverage"]),
    feature("/business/special-order-analysis", "Special Order Decision", "Managerial & Cost", "Evaluate whether a special order adds incremental profit and identify the break-even special-order price.", ["special order", "incremental order analysis", "special order decision"], ["relevant costing", "special order", "decision"], "Special Order", true, ["special order", "incremental profit", "special-order price", "relevant costing"]),
    feature("/business/make-or-buy-analysis", "Make or Buy Decision", "Managerial & Cost", "Compare relevant make and buy costs and surface the maximum outside purchase price the business can accept.", ["make or buy", "outsourcing decision", "insource or outsource", "outsource or produce internally", "produce internally or buy outside"], ["relevant costing", "make or buy", "decision"], "Make or Buy", true, ["make or buy", "outsourcing", "buy versus make", "relevant make cost", "outsource", "produce internally"]),
    feature("/business/sell-or-process-further", "Sell or Process Further", "Managerial & Cost", "Compare split-off value against additional revenue and separable processing cost using a joint-product decision lens.", ["split-off decision", "sell or process further", "joint product decision"], ["relevant costing", "joint products", "decision"], "Process Further", true, ["sell or process further", "split off", "separable cost", "joint products"]),
    feature("/business/constrained-resource-product-mix", "Constrained Resource Product Mix", "Managerial & Cost", "Rank output by contribution margin per scarce-resource unit so bottleneck decisions become clearer.", ["product mix", "bottleneck product mix", "constraint analysis"], ["management services", "product mix", "constraint"], "Product Mix", true, ["constrained resource", "product mix", "bottleneck", "contribution per machine hour"]),
    feature("/business/budget-variance-analysis", "Budget Variance Analysis", "Managerial & Cost", "Separate spending variance, activity variance, and the total gap from plan.", ["budget variance", "spending variance", "activity variance"], ["budgeting", "variance", "performance report"], "Variance Analysis", true, ["budget variance", "activity variance", "spending variance", "performance report"]),
    feature("/business/cash-collections-schedule", "Cash Collections Schedule", "Managerial & Cost", "Build a month-based receipts schedule from sales and collection lag patterns.", ["schedule of cash collections", "cash receipts schedule", "receivables collection schedule", "collections lag schedule"], ["budgeting", "collections", "cash"], undefined, true, ["cash collections", "collections schedule", "cash receipts", "receivables collection", "collection lag", "receipts timing"]),
    feature("/business/cash-disbursements-schedule", "Cash Disbursements Schedule", "Managerial & Cost", "Build a month-based disbursement schedule from purchases and payment lag patterns.", ["schedule of cash disbursements", "cash payments schedule", "accounts payable payment schedule", "purchases payment schedule"], ["budgeting", "disbursements", "cash"], undefined, true, ["cash disbursements", "cash payments", "payments schedule", "payment lag", "accounts payable schedule", "purchases timing"]),
    feature("/business/cash-budget", "Cash Budget", "Managerial & Cost", "Single-period cash budget with financing need visibility.", ["cash planning budget", "cash forecast budget", "minimum cash planning", "cash budget with financing"], ["budgeting", "cash"], undefined, true, ["cash budget", "financing", "minimum cash", "ending cash balance", "financing need"]),
    feature("/business/production-budget", "Production Budget", "Managerial & Cost", "Translate sales and desired finished-goods policy into required production units.", ["schedule of production", "production planning budget", "finished goods budget"], ["budgeting", "production", "manufacturing"], "Production", true, ["production budget", "required production", "finished goods policy", "budgeted sales units"]),
    feature("/business/direct-materials-purchases-budget", "Direct Materials Purchases Budget", "Managerial & Cost", "Convert production requirements and materials policy into units to purchase and budgeted purchase cost.", ["materials purchases budget", "direct materials budget", "materials purchase schedule"], ["budgeting", "materials", "manufacturing"], "DM Budget", true, ["direct materials purchases", "materials to purchase", "materials required", "purchase cost"]),
    feature("/business/direct-labor-budget", "Direct Labor Budget", "Managerial & Cost", "Translate production volume into required labor hours and total direct labor cost for the master budget.", ["labor budget", "direct labor schedule", "factory labor budget"], ["budgeting", "labor", "manufacturing"], "DL Budget", true, ["direct labor budget", "labor hours", "labor cost budget", "hourly wage budget"]),
    feature("/business/factory-overhead-budget", "Factory Overhead Budget", "Managerial & Cost", "Separate variable and fixed factory overhead, then read the total overhead budget for the planned activity level.", ["manufacturing overhead budget", "factory overhead budget", "overhead budget"], ["budgeting", "overhead", "manufacturing"], "FOH Budget", true, ["factory overhead budget", "manufacturing overhead budget", "variable overhead budget", "fixed overhead budget"]),
    feature("/business/sales-budget", "Sales Budget", "Managerial & Cost", "Translate budgeted unit sales and planned selling price into the revenue target that anchors the wider master-budget flow.", ["sales budget", "budgeted sales revenue", "sales planning budget", "sales forecast budget"], ["budgeting", "sales", "master budget"], "Sales Budget", true, ["sales budget", "budgeted sales", "sales revenue budget", "selling price per unit", "budgeted unit sales"]),
    feature("/business/inventory-budget", "Inventory Budget", "Managerial & Cost", "Plan merchandise purchases from budgeted cost of goods sold and ending-inventory policy.", ["merchandise purchases budget", "inventory purchases budget", "ending inventory policy"], ["budgeting", "inventory", "merchandising"], "Inventory Budget", true, ["inventory budget", "merchandise purchases", "budgeted cogs", "desired ending inventory"]),
    feature("/business/operating-expense-budget", "Operating Expense Budget", "Managerial & Cost", "Separate variable, fixed, total, and cash operating expenses from one budget setup.", ["selling and administrative budget", "operating expenses budget", "s and a budget"], ["budgeting", "operating expenses", "planning"], "OpEx Budget", true, ["operating expense budget", "selling and administrative budget", "cash operating expenses", "variable expense rate"]),
    feature("/business/budgeted-income-statement", "Budgeted Income Statement", "Managerial & Cost", "Bring budgeted sales, COGS, operating expenses, interest, and tax into one statement-level budget view.", ["pro forma income statement", "budget income statement", "budgeted statement of profit or loss"], ["budgeting", "financial statements", "master budget"], "Budgeted IS", true, ["budgeted income statement", "pro forma income statement", "budgeted net income", "master budget statement"]),
    feature("/business/flexible-budget", "Flexible Budget", "Managerial & Cost", "Separate activity variance from spending variance using a flexible cost budget.", ["static versus flexible budget", "budget variance"], ["budgeting", "variance"], undefined, true, ["flexible budget", "activity variance", "spending variance"]),
    feature("/business/capacity-utilization", "Capacity Utilization", "Managerial & Cost", "Compare actual output with practical capacity so idle or strained capacity stays visible.", ["capacity usage", "practical capacity", "idle capacity", "capacity rate"], ["operations", "capacity", "planning"], undefined, true, ["capacity utilization", "practical capacity", "idle capacity", "operating capacity", "capacity planning"]),
    feature("/business/additional-funds-needed", "Additional Funds Needed", "Managerial & Cost", "Estimate the outside financing required to support forecasted sales growth using a compact percentage-of-sales model.", ["afn", "additional funds needed", "forecast financing"], ["forecasting", "planning", "financing"], "AFN", true, ["additional funds needed", "afn", "forecast financing", "percentage of sales"]),
    feature("/business/high-low-cost-estimation", "High-Low Cost Estimation", "Managerial & Cost", "Estimate variable and fixed cost components from high-low activity data.", ["mixed cost split", "high low method", "cost behavior estimate"], ["cost behavior", "mixed cost", "planning"], "High-Low", true, ["high-low", "mixed cost", "cost behavior", "cost estimation"]),
    feature("/business/roi-ri-eva", "ROI, RI, and EVA Workspace", "Managerial & Cost", "Compare ROI, residual income, and EVA-style capital-charge reading from one performance workspace.", ["roi", "residual income", "eva", "investment center"], ["performance", "responsibility accounting", "roi"], "ROI / RI", true, ["roi", "residual income", "eva", "investment center", "responsibility accounting"]),
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
    feature("/operations/eoq-and-reorder-point", "EOQ and Reorder Point", "Managerial & Cost", "Plan order quantity, order frequency, and reorder point from one inventory-management workspace.", ["economic order quantity", "reorder point", "inventory replenishment"], ["operations", "inventory planning", "supply chain"], "EOQ", true, ["eoq", "reorder point", "economic order quantity", "inventory control"]),
    feature("/operations/moving-average-forecast", "Moving Average Forecast", "Managerial & Cost", "Forecast short-term demand using simple and weighted moving averages for replenishment and operations planning.", ["moving average forecast", "weighted moving average", "demand forecast"], ["operations", "forecasting", "planning"], "Forecast", true, ["moving average", "weighted moving average", "forecasting", "demand planning"]),
    feature("/far/lease-measurement-workspace", "Lease Measurement Workspace", "Accounting", "Estimate the initial lease liability and right-of-use asset using lease payments, discounting, and related adjustments.", ["lease accounting", "right of use asset", "lease liability"], ["far", "lease", "measurement"], "Leases", true, ["lease liability", "right-of-use asset", "lease measurement", "lease accounting"]),
    feature("/far/share-based-payment-workspace", "Share-Based Payment Workspace", "Accounting", "Estimate expected vesting, cumulative compensation cost, and current-period expense for equity-settled awards.", ["stock options", "share options", "equity settled award"], ["far", "equity", "share-based payment"], "Share-Based", true, ["share-based payment", "stock options", "compensation cost", "vesting"]),
    feature("/far/impairment-loss-workspace", "Impairment Loss Workspace", "Accounting", "Compare carrying amount with recoverable amount using fair value less costs to sell and value in use.", ["asset impairment", "recoverable amount", "impairment testing"], ["far", "impairment", "assets"], "Impairment", true, ["impairment loss", "recoverable amount", "value in use", "fair value less costs to sell"]),
    feature("/far/asset-disposal-analysis", "Asset Disposal Analysis", "Accounting", "Review book value, net proceeds, and gain or loss on disposal of long-lived assets.", ["disposal of asset", "gain on sale of equipment", "retirement and disposal"], ["far", "disposal", "ppe"], "Disposal", true, ["asset disposal", "gain or loss", "book value", "net proceeds", "retirement"]),
    feature("/far/retained-earnings-rollforward", "Retained Earnings Rollforward", "Accounting", "Reconcile beginning retained earnings, net income, dividends, and prior-period adjustments into the ending equity balance.", ["retained earnings", "dividends", "statement of changes in equity"], ["far", "equity", "retained earnings"], "Retained Earnings", true, ["retained earnings", "dividends", "statement of changes in equity", "equity rollforward"]),
    feature("/far/cash-flow-statement-builder", "Statement of Cash Flows Builder", "Accounting", "Build an indirect-method cash-flow view across operating, investing, and financing activities.", ["cash flow statement", "indirect method", "cash flows from operations"], ["far", "cash flows", "financial statements"], "Cash Flows", true, ["statement of cash flows", "indirect method", "cash flow classification", "operating investing financing"]),
    feature("/far/statement-of-changes-in-equity-builder", "Statement of Changes in Equity Builder", "Accounting", "Roll forward share capital, APIC, retained earnings, OCI, and treasury shares into a cleaner FAR equity statement view.", ["statement of changes in equity", "equity rollforward", "share capital rollforward", "treasury shares"], ["far", "equity", "financial statements"], "SoCE", true, ["statement of changes in equity", "equity builder", "share capital", "apic", "treasury shares", "oci"]),
    feature("/audit/audit-planning-workspace", "Audit Planning Workspace", "Accounting", "Estimate materiality, performance materiality, and an audit-risk response signal from one planning workspace.", ["audit materiality", "audit risk", "planning materiality"], ["audit", "materiality", "risk"], "Audit Plan", true, ["audit planning", "planning materiality", "performance materiality", "audit risk"]),
    feature("/audit/audit-cycle-reviewer", "Audit Cycle Reviewer", "Accounting", "Review assertions, control points, and likely procedures across revenue, expenditure, conversion, and financing cycles.", ["transaction cycle auditing", "revenue cycle audit", "expenditure cycle audit"], ["audit", "cycle", "assertions"], "Audit Cycles", true, ["audit cycle", "revenue cycle", "expenditure cycle", "conversion cycle", "financing cycle"]),
    feature("/audit/audit-completion-and-opinion", "Audit Completion and Opinion Workspace", "Accounting", "Review completion procedures, going concern, subsequent events, modified reports, and key audit matters.", ["modified audit report", "key audit matters", "going concern audit"], ["audit", "reporting", "completion"], "Audit Opinion", true, ["completion procedures", "going concern", "subsequent events", "modified report", "key audit matters"]),
    feature("/tax/book-tax-difference-workspace", "Book-Tax Difference Workspace", "Accounting", "Bridge accounting income and taxable income through book-tax difference analysis.", ["book tax differences", "tax reconciliation", "temporary differences"], ["tax", "income tax", "differences"], "Book-Tax", true, ["book tax differences", "temporary differences", "current tax", "deferred tax"]),
    feature("/tax/percentage-tax", "Percentage Tax", "Accounting", "Compute percentage tax due or reverse-solve the tax base and rate for business-tax review questions.", ["business tax", "percentage tax due", "gross receipts tax"], ["tax", "business tax", "percentage tax"], "Percentage Tax", true, ["percentage tax", "business tax", "tax due", "gross receipts"]),
    feature("/tax/vat-reconciliation", "VAT Reconciliation", "Accounting", "Compare output VAT and input VAT to read the net payable or excess-input position from one period setup.", ["vat payable", "output vat less input vat", "vat reconciliation", "vat worksheet"], ["tax", "vat", "reconciliation"], "VAT Recon", true, ["vat reconciliation", "output vat", "input vat", "vat payable", "vatable sales", "vatable purchases"]),
    feature("/tax/withholding-tax", "Withholding Tax", "Accounting", "Compute withholding tax, rate effect, and net amount after withholding for Philippine tax review problems.", ["expanded withholding tax", "creditable withholding tax", "tax withheld"], ["tax", "withholding", "philippines"], "WHT", true, ["withholding tax", "tax withheld", "net of withholding", "expanded withholding"]),
    feature("/tax/tax-compliance-review", "Tax Compliance and Incentive Review", "Accounting", "Review withholding, transfer and special taxes, local taxation, treaty concepts, and incentive-regime logic.", ["withholding tax review", "estate donor tax", "tax treaty"], ["tax", "compliance", "incentives"], "Tax Review", true, ["withholding tax", "documentary stamp tax", "estate tax", "donor's tax", "local taxation", "tax treaty", "peza", "boi", "bmbe"]),
    feature("/afar/business-combination-analysis", "Business Combination Analysis", "Accounting", "Estimate goodwill or bargain purchase gain under full-goodwill or proportionate-share measurement.", ["goodwill calculator", "business combination", "consolidation goodwill", "non controlling interest", "non-controlling interest"], ["afar", "business combination", "goodwill", "non controlling interest"], "Combination", true, ["business combination", "goodwill", "nci", "consolidation", "non controlling interest", "non-controlling interest"]),
    feature("/afar/equity-method-investment", "Equity Method Investment", "Accounting", "Roll forward the carrying amount of an associate investment using share in income and dividends.", ["associate accounting", "equity method", "investment in associate"], ["afar", "equity method", "investment"], "Equity Method", true, ["equity method", "associate", "share in income", "investment carrying amount"]),
    feature("/afar/intercompany-inventory-profit", "Intercompany Inventory Profit Elimination", "Accounting", "Estimate the unrealized profit embedded in ending inventory for consolidation-support schedules and AFAR elimination review.", ["intercompany profit", "upstream downstream profit elimination", "unrealized profit in inventory"], ["afar", "consolidation", "inventory"], "Inventory Elim", true, ["intercompany inventory profit", "unrealized profit", "inventory elimination", "markup on cost", "upstream downstream"]),
    feature("/afar/intercompany-ppe-transfer", "Intercompany PPE Transfer", "Accounting", "Review unrealized transfer gain, annual excess depreciation, and remaining intercompany profit on transferred PPE.", ["intercompany ppe transfer", "intercompany equipment transfer", "downstream ppe transfer"], ["afar", "consolidation", "ppe"], "PPE Elim", true, ["intercompany ppe", "excess depreciation", "unamortized intercompany profit", "equipment transfer"]),
    feature("/afar/foreign-currency-translation", "Foreign Currency Translation Workspace", "Accounting", "Translate foreign-currency monetary items at transaction, closing, and settlement rates.", ["foreign currency transaction", "exchange difference", "forex translation"], ["afar", "foreign currency", "translation"], "FX Translation", true, ["foreign currency", "exchange difference", "translation", "settlement rate"]),
    feature("/afar/construction-revenue-workspace", "Construction Revenue Workspace", "Accounting", "Estimate percentage of completion, revenue recognized to date, gross profit, and the contract asset-or-liability position.", ["long term construction", "percentage of completion", "construction contract"], ["afar", "construction", "revenue"], "Construction", true, ["construction contract", "percentage of completion", "contract asset", "contract liability"]),
    feature("/ais/it-control-matrix", "IT Control Matrix", "Accounting", "Review IT governance, access, change management, and continuity controls in one AIS and IT-audit workspace.", ["itgc", "it controls", "application controls", "it audit"], ["ais", "it controls", "governance"], "IT Controls", true, ["it governance", "it controls", "it audit", "logical access"]),
    feature("/ais/ais-lifecycle-and-recovery", "AIS Lifecycle and Recovery Review", "Accounting", "Review business continuity, disaster recovery, ERP and service management, systems life cycle, and IT-audit documentation.", ["business continuity planning", "disaster recovery", "erp controls"], ["ais", "continuity", "systems"], "AIS Review", true, ["business continuity", "disaster recovery", "erp", "crm", "incident management", "it audit documentation"]),
    feature("/governance/risk-control-matrix", "Risk and Control Matrix", "Accounting", "Read inherent risk, control quality, and residual risk in one governance and internal-control workspace.", ["internal control evaluation", "risk matrix", "ethics and control"], ["governance", "risk", "control"], "Risk Matrix", true, ["risk control matrix", "internal control", "residual risk", "governance"]),
    feature("/rfbt/business-law-review", "Business Law Review Workspace", "Accounting", "Use a structured issue-spotting page for obligations, contracts, and corporation-law review questions.", ["rfbt reviewer", "contracts review", "corporation law"], ["rfbt", "law", "contracts"], "Law Review", true, ["obligations", "contracts", "corporation law", "rfbt"]),
    feature("/rfbt/commercial-transactions-reviewer", "Commercial Transactions Reviewer", "Accounting", "Review sales, credit transactions, security arrangements, securities regulation, IP, procurement, and rehabilitation topics.", ["credit transactions review", "contracts of security", "insider trading"], ["rfbt", "commercial law", "transactions"], "Transactions", true, ["sales law", "credit transactions", "contracts of security", "insider trading", "procurement", "intellectual property", "rehabilitation"]),
    feature("/strategic/integrative-case-mapper", "Integrative Case Mapper", "Accounting", "Map mixed-topic cases into FAR, AFAR, cost, audit, tax, and governance follow-up tracks before solving in detail.", ["integrated case analysis", "board review integration", "strategic accounting review"], ["strategic", "integrative", "case mapping"], "Case Map", true, ["integrative case", "board review", "strategic analysis", "capstone review"]),
    feature("/strategic/strategic-business-analysis", "Strategic Business Analysis Workspace", "Accounting", "Review strategic business analysis, strategic cost management, consultancy framing, research methods, and integrative case-reading support.", ["strategic management analysis", "consultancy review", "industry analysis"], ["strategic", "analysis", "integrative"], "Strategic Review", true, ["strategic business analysis", "strategic cost management", "industry analysis", "consultancy", "research methods"]),
    feature("/accounting/cost-of-goods-manufactured", "Cost of Goods Manufactured", "Managerial & Cost", "Manufacturing costs and COGM.", ["cogm"], ["cost accounting"]),
    feature("/accounting/job-order-cost-sheet", "Job Order Cost Sheet", "Managerial & Cost", "Assign direct materials, direct labor, and applied overhead to one job, then read total and per-unit job cost.", ["job order costing", "job cost sheet", "job order cost"], ["job order costing", "manufacturing", "cost accounting"], "Job Order", true, ["job order", "job cost sheet", "applied overhead", "unit cost"]),
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

    feature("/statistics/standard-deviation", "Standard Deviation", "Statistics", "Mean, variance, and standard deviation for a list of values.", ["sd", "variance", "dispersion", "spread of data"], ["statistics", "analytics"], undefined, true, ["standard deviation", "variance", "dispersion", "spread", "volatility"]),
    feature("/statistics/coefficient-of-variation", "Coefficient of Variation", "Statistics", "Relative variability from standard deviation and mean.", ["cv statistics", "relative variation", "relative variability"], ["statistics", "analytics", "variation"], "CV", true, ["coefficient of variation", "relative variability", "relative variation", "variation rate"]),
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
