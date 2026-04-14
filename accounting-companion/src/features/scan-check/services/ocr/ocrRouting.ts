import type {
    ScanPageType,
    ScanProblemKind,
    ScanRouteRecommendation,
} from "../../types";

type RouteRule = {
    path: string;
    label: string;
    category: string;
    patterns: RegExp[];
    bonus?: RegExp[];
    kindBoosts?: Partial<Record<ScanProblemKind, number>>;
    pageTypeBoosts?: Partial<Record<ScanPageType, number>>;
};

const ROUTE_RULES: RouteRule[] = [
    {
        path: "/accounting/process-costing-workspace",
        label: "Process Costing Workspace",
        category: "Accounting",
        patterns: [
            /\bequivalent units?\b/i,
            /\bcompleted and transferred\b/i,
            /\bwork in process\b/i,
            /\btransferred[- ]in\b/i,
            /\bcost per equivalent\b/i,
            /\bproduction report\b/i,
        ],
        bonus: [/\bdepartment\b/i, /\bmaterials\b/i, /\boverhead\b/i],
        kindBoosts: { "accounting-worksheet": 14 },
        pageTypeBoosts: {
            "department-1-worksheet": 16,
            "department-2-worksheet": 18,
            "cost-schedule-page": 12,
        },
    },
    {
        path: "/business/cvp-analysis",
        label: "CVP Analysis",
        category: "Managerial & Cost",
        patterns: [
            /\bcvp\b/i,
            /\bbreak[- ]even\b/i,
            /\bcontribution margin\b/i,
            /\btarget profit\b/i,
            /\bmargin of safety\b/i,
            /\boperating leverage\b/i,
        ],
        bonus: [/\bfixed costs?\b/i, /\bvariable costs?\b/i, /\bselling price\b/i],
        kindBoosts: { "word-problem": 4, "textbook-page": 3, "notes-reference": 2 },
    },
    {
        path: "/business/sales-mix-break-even",
        label: "Sales Mix Break-even",
        category: "Managerial & Cost",
        patterns: [
            /\bsales mix\b/i,
            /\bmulti[- ]product\b/i,
            /\bcomposite unit\b/i,
            /\bweighted average contribution margin\b/i,
        ],
        bonus: [/\bmix share\b/i, /\bproduct a\b/i, /\bproduct b\b/i],
        kindBoosts: { "word-problem": 4, "textbook-page": 2 },
    },
    {
        path: "/business/break-even",
        label: "Break-even",
        category: "Managerial & Cost",
        patterns: [/\bbreak[- ]even\b/i, /\bbep\b/i, /\bunits to break even\b/i],
        bonus: [/\bfixed costs?\b/i, /\bvariable cost\b/i, /\bselling price\b/i],
        kindBoosts: { "equation": 3, "word-problem": 4 },
    },
    {
        path: "/business/target-profit",
        label: "Target Profit",
        category: "Managerial & Cost",
        patterns: [/\btarget profit\b/i, /\brequired sales\b/i, /\brequired units\b/i],
        bonus: [/\bdesired profit\b/i, /\bplanned profit\b/i],
        kindBoosts: { "word-problem": 4, "equation": 2 },
    },
    {
        path: "/business/contribution-margin",
        label: "Contribution Margin",
        category: "Managerial & Cost",
        patterns: [/\bcontribution margin\b/i, /\bcm ratio\b/i],
        bonus: [/\bsales\b/i, /\bvariable costs?\b/i],
        kindBoosts: { "equation": 3, "word-problem": 3 },
    },
    {
        path: "/business/margin-of-safety",
        label: "Margin of Safety",
        category: "Managerial & Cost",
        patterns: [/\bmargin of safety\b/i, /\bsafety margin\b/i],
        bonus: [/\bactual sales\b/i, /\bbreak[- ]even sales\b/i],
    },
    {
        path: "/business/operating-leverage",
        label: "Operating Leverage",
        category: "Managerial & Cost",
        patterns: [/\boperating leverage\b/i, /\bdegree of operating leverage\b/i, /\bdol\b/i],
        bonus: [/\bcontribution margin\b/i, /\boperating income\b/i],
    },
    {
        path: "/accounting/partnership-dissolution",
        label: "Partnership Dissolution",
        category: "Accounting",
        patterns: [
            /\bpartnership dissolution\b/i,
            /\bdissolution\b/i,
            /\bliquidation\b/i,
            /\brealization\b/i,
            /\bdeficiency\b/i,
        ],
        bonus: [/\bpartners?[ ]+capital\b/i, /\bgain or loss on realization\b/i],
        kindBoosts: { "word-problem": 4, "worked-solution": 4, "textbook-page": 2 },
    },
    {
        path: "/accounting/partnership-retirement-bonus",
        label: "Partnership Retirement Bonus",
        category: "Accounting",
        patterns: [/\bretiring partner\b/i, /\bretirement bonus\b/i, /\bpartner withdrawal\b/i],
        bonus: [/\bsettlement paid\b/i, /\bcapital balance\b/i],
        kindBoosts: { "word-problem": 4, "worked-solution": 3 },
    },
    {
        path: "/accounting/partnership-profit-sharing",
        label: "Partnership Profit Sharing",
        category: "Accounting",
        patterns: [/\bprofit sharing\b/i, /\bprofit and loss ratio\b/i, /\bshare net income\b/i],
        bonus: [/\bratio\b/i, /\bpartner a\b/i, /\bpartner b\b/i],
    },
    {
        path: "/economics/price-elasticity-demand",
        label: "Price Elasticity",
        category: "Economics",
        patterns: [/\belasticity\b/i, /\bpercentage change in quantity\b/i, /\bpercentage change in price\b/i],
        bonus: [/\bdemand\b/i, /\bquantity demanded\b/i],
    },
    {
        path: "/economics/market-equilibrium",
        label: "Market Equilibrium",
        category: "Economics",
        patterns: [/\bequilibrium\b/i, /\bshortage\b/i, /\bsurplus\b/i],
        bonus: [/\bdemand\b/i, /\bsupply\b/i],
    },
    {
        path: "/entrepreneurship/startup-cost-planner",
        label: "Startup Cost Planner",
        category: "Entrepreneurship",
        patterns: [/\bstartup costs?\b/i, /\blaunch costs?\b/i, /\bcontingency\b/i],
        bonus: [/\bpermits?\b/i, /\bequipment\b/i, /\binventory\b/i],
    },
    {
        path: "/accounting/fifo-inventory",
        label: "FIFO Inventory",
        category: "Accounting",
        patterns: [/\bfifo\b/i, /\bfirst in first out\b/i],
        bonus: [/\binventory\b/i, /\bunits sold\b/i],
    },
    {
        path: "/accounting/weighted-average-inventory",
        label: "Weighted Average Inventory",
        category: "Accounting",
        patterns: [/\bweighted average\b/i, /\baverage cost\b/i],
        bonus: [/\binventory\b/i, /\bunits sold\b/i],
    },
    {
        path: "/accounting/trial-balance-checker",
        label: "Trial Balance Checker",
        category: "Accounting",
        patterns: [/\btrial balance\b/i, /\bdebits?\b/i, /\bcredits?\b/i],
        bonus: [/\bunadjusted\b/i, /\badjusted\b/i],
    },
    {
        path: "/finance/npv",
        label: "Net Present Value",
        category: "Finance",
        patterns: [/\bnet present value\b/i, /\bnpv\b/i],
        bonus: [/\bcash flows?\b/i, /\bdiscount rate\b/i],
    },
    {
        path: "/finance/internal-rate-of-return",
        label: "Internal Rate of Return",
        category: "Finance",
        patterns: [/\binternal rate of return\b/i, /\birr\b/i],
        bonus: [/\bcash flows?\b/i, /\binitial investment\b/i],
    },
    {
        path: "/audit/audit-planning-workspace",
        label: "Audit Planning Workspace",
        category: "Audit & Assurance",
        patterns: [/\baudit planning\b/i, /\bmateriality\b/i, /\baudit risk\b/i],
        bonus: [/\binherent risk\b/i, /\bcontrol risk\b/i, /\bdetection risk\b/i],
        kindBoosts: { "textbook-page": 3, "notes-reference": 3, "word-problem": 2 },
    },
    {
        path: "/far/lease-measurement-workspace",
        label: "Lease Measurement Workspace",
        category: "FAR",
        patterns: [/\blease liability\b/i, /\bright[- ]of[- ]use\b/i, /\blease payment\b/i],
        bonus: [/\bdiscount rate\b/i, /\bpresent value\b/i, /\bresidual value\b/i],
        kindBoosts: { "word-problem": 4, "worked-solution": 3 },
    },
    {
        path: "/far/share-based-payment-workspace",
        label: "Share-Based Payment Workspace",
        category: "FAR",
        patterns: [/\bshare[- ]based payment\b/i, /\bstock options?\b/i, /\bvesting\b/i],
        bonus: [/\bgrant date fair value\b/i, /\bforfeiture\b/i, /\bcompensation cost\b/i],
        kindBoosts: { "word-problem": 3, "notes-reference": 3 },
    },
    {
        path: "/far/cash-flow-statement-builder",
        label: "Statement of Cash Flows Builder",
        category: "FAR",
        patterns: [/\bstatement of cash flows\b/i, /\bindirect method\b/i, /\bcash flows from operating\b/i],
        bonus: [/\binvesting activities\b/i, /\bfinancing activities\b/i, /\bworking capital changes\b/i],
        kindBoosts: { "worked-solution": 3, "textbook-page": 3 },
    },
    {
        path: "/tax/book-tax-difference-workspace",
        label: "Book-Tax Difference Workspace",
        category: "Taxation",
        patterns: [/\bbook tax\b/i, /\btemporary difference\b/i, /\bdeferred tax\b/i],
        bonus: [/\btaxable income\b/i, /\bpermanent difference\b/i],
        kindBoosts: { "word-problem": 3, "notes-reference": 3 },
    },
    {
        path: "/tax/tax-compliance-review",
        label: "Tax Compliance and Incentive Review",
        category: "Taxation",
        patterns: [/\bwithholding tax\b/i, /\bestate tax\b/i, /\bdonor'?s tax\b/i, /\btax treaty\b/i],
        bonus: [/\bdocumentary stamp\b/i, /\bexcise tax\b/i, /\bpeza|boi|bcda|bmbe\b/i],
        kindBoosts: { "notes-reference": 4, "textbook-page": 3 },
    },
    {
        path: "/operations/eoq-and-reorder-point",
        label: "EOQ and Reorder Point",
        category: "Operations & Supply Chain",
        patterns: [/\beoq\b/i, /\beconomic order quantity\b/i, /\breorder point\b/i],
        bonus: [/\blead time\b/i, /\bsafety stock\b/i, /\bordering cost\b/i],
        kindBoosts: { "word-problem": 3, "textbook-page": 2 },
    },
    {
        path: "/afar/business-combination-analysis",
        label: "Business Combination Analysis",
        category: "AFAR",
        patterns: [/\bbusiness combination\b/i, /\bgoodwill\b/i, /\bnon[- ]controlling interest\b/i],
        bonus: [/\bconsolidated\b/i, /\bconsideration transferred\b/i],
        kindBoosts: { "word-problem": 4, "worked-solution": 3 },
    },
    {
        path: "/afar/foreign-currency-translation",
        label: "Foreign Currency Translation Workspace",
        category: "AFAR",
        patterns: [/\bforeign currency\b/i, /\bexchange difference\b/i, /\bclosing rate\b/i],
        bonus: [/\bsettlement rate\b/i, /\btransaction rate\b/i, /\btranslation\b/i],
        kindBoosts: { "word-problem": 4, "worked-solution": 3 },
    },
    {
        path: "/afar/construction-revenue-workspace",
        label: "Construction Revenue Workspace",
        category: "AFAR",
        patterns: [/\bpercentage of completion\b/i, /\bconstruction contract\b/i, /\bcontract asset\b/i],
        bonus: [/\bcost to cost\b/i, /\bbillings to date\b/i, /\bgross profit recognized\b/i],
        kindBoosts: { "word-problem": 4, "worked-solution": 3 },
    },
    {
        path: "/ais/it-control-matrix",
        label: "IT Control Matrix",
        category: "AIS & IT Controls",
        patterns: [/\bit governance\b/i, /\bit controls?\b/i, /\bapplication controls?\b/i],
        bonus: [/\bchange management\b/i, /\baccess controls?\b/i, /\bbackup\b/i],
        kindBoosts: { "notes-reference": 3, "textbook-page": 2 },
    },
    {
        path: "/audit/audit-cycle-reviewer",
        label: "Audit Cycle Reviewer",
        category: "Audit & Assurance",
        patterns: [/\brevenue cycle\b/i, /\bexpenditure cycle\b/i, /\bconversion cycle\b/i],
        bonus: [/\btransaction cycle\b/i, /\bassertions\b/i, /\bsubstantive procedures\b/i],
        kindBoosts: { "textbook-page": 3, "notes-reference": 3 },
    },
    {
        path: "/audit/audit-completion-and-opinion",
        label: "Audit Completion and Opinion Workspace",
        category: "Audit & Assurance",
        patterns: [/\bgoing concern\b/i, /\bsubsequent events\b/i, /\bmodified opinion\b/i],
        bonus: [/\bkey audit matters?\b/i, /\brepresentation letter\b/i, /\bcompletion procedures\b/i],
        kindBoosts: { "textbook-page": 4, "notes-reference": 3 },
    },
    {
        path: "/ais/ais-lifecycle-and-recovery",
        label: "AIS Lifecycle and Recovery Review",
        category: "AIS & IT Controls",
        patterns: [/\bbusiness continuity\b/i, /\bdisaster recovery\b/i, /\berp\b/i],
        bonus: [/\bincident management\b/i, /\bcapacity planning\b/i, /\bcrm\b/i],
        kindBoosts: { "notes-reference": 4, "textbook-page": 3 },
    },
    {
        path: "/rfbt/commercial-transactions-reviewer",
        label: "Commercial Transactions Reviewer",
        category: "RFBT & Law",
        patterns: [/\bcredit transactions\b/i, /\bcontracts? of security\b/i, /\binsider trading\b/i],
        bonus: [/\bprocurement\b/i, /\bintellectual property\b/i, /\brehabilitation\b/i],
        kindBoosts: { "notes-reference": 4, "textbook-page": 3 },
    },
    {
        path: "/strategic/strategic-business-analysis",
        label: "Strategic Business Analysis Workspace",
        category: "Strategic & Integrative",
        patterns: [/\bstrategic business analysis\b/i, /\bstrategic cost management\b/i, /\bindustry analysis\b/i],
        bonus: [/\bconsultancy\b/i, /\bresearch methods\b/i, /\bcompetition analysis\b/i],
        kindBoosts: { "notes-reference": 4, "textbook-page": 3 },
    },
];

function clampScore(value: number) {
    return Math.max(0, Math.min(100, value));
}

export function recommendScanRoutes(
    text: string,
    kind: ScanProblemKind,
    pageType: ScanPageType = "unknown"
) {
    const normalized = text.toLowerCase();

    const ranked = ROUTE_RULES.map((rule) => {
        const baseMatches = rule.patterns.filter((pattern) => pattern.test(normalized)).length;
        const bonusMatches = (rule.bonus ?? []).filter((pattern) => pattern.test(normalized)).length;
        const score =
            baseMatches * 11 +
            bonusMatches * 4 +
            (rule.kindBoosts?.[kind] ?? 0) +
            (rule.pageTypeBoosts?.[pageType] ?? 0);

        const confidence =
            score >= 28 ? "high" : score >= 16 ? "moderate" : score >= 8 ? "low" : null;

        return confidence
            ? ({
                  path: rule.path,
                  label: rule.label,
                  category: rule.category,
                  reason:
                      baseMatches > 0
                          ? `Matched ${baseMatches} topic signal${baseMatches === 1 ? "" : "s"} from the scanned text and found language that fits ${rule.label.toLowerCase()}.`
                          : `This route is a weaker fallback based on the detected problem style and keywords.`,
                  score: clampScore(score),
                  confidence,
              } satisfies ScanRouteRecommendation)
            : null;
    })
        .filter((entry): entry is ScanRouteRecommendation => Boolean(entry))
        .sort((left, right) => right.score - left.score);

    if (ranked.length === 0) {
        return [
            {
                path: "/smart/solver",
                label: "Smart Solver",
                category: "Smart Tools",
                reason:
                    "The scan is still too ambiguous for a specialized calculator, so Smart Solver is the safest next step.",
                score: 12,
                confidence: "low",
            } satisfies ScanRouteRecommendation,
        ];
    }

    if (ranked[0]?.score < 22) {
        ranked.push({
            path: "/smart/solver",
            label: "Smart Solver",
            category: "Smart Tools",
            reason:
                "Use Smart Solver if the scan is incomplete, mixed-topic, or still needs a human-style interpretation before opening a calculator.",
            score: 18,
            confidence: "moderate",
        });
    }

    return ranked
        .filter(
            (entry, index, list) =>
                list.findIndex((candidate) => candidate.path === entry.path) === index
        )
        .slice(0, 4);
}
