import { useMemo } from "react";
import { Link } from "react-router-dom";
import AppBrandMark from "../../components/AppBrandMark";
import DisclosurePanel from "../../components/DisclosurePanel";
import FeatureSearch from "../../components/FeatureSearch";
import GuidedStartPanel from "../../components/GuidedStartPanel";
import OfflineCapabilityBadge from "../../components/OfflineCapabilityBadge";
import ShareAppButton from "../../components/ShareAppButton";
import {
    getMostUsedRoutes,
    getPinnedRoutes,
    getRecentRoutes,
    getRecommendedRoutes,
    useAppActivity,
} from "../../utils/appActivity";
import { useStudyProgress } from "../../utils/studyProgress";
import {
    APP_NAV_GROUPS,
    APP_ROUTE_META_MAP,
    NEW_FEATURE_PATHS,
    getRouteAvailability,
    getRouteMeta,
} from "../../utils/appCatalog";
import {
    APP_RELEASE_HIGHLIGHTS,
    APP_RELEASE_NOTES,
    APP_VERSION,
} from "../../utils/appRelease";
import { useAppSettings } from "../../utils/appSettings";
import { useNetworkStatus } from "../../utils/networkStatus";
import { useOfflineBundleStatus } from "../../utils/offlineStatus";

const SMART_PROMPT_EXAMPLES = [
    "Check a process-costing worksheet with equivalent units, completed and transferred out, ending WIP, and transferred-in cost.",
    "Scan a worked solution, review the extracted steps, and send the corrected text to Smart Solver.",
    "Find the quick ratio if cash is 50,000, marketable securities are 25,000, receivables are 40,000, and current liabilities are 100,000.",
    "What selling price gives a 30% margin if cost is 700?",
    "Find the principal if simple interest is 4,800 at 12% for 2 years.",
    "Compare FIFO and weighted average if beginning inventory is 100 units at 50, then purchases are 80 at 55 and 120 at 60, with 150 units sold.",
    "Open the common-size income statement workspace.",
    "Compare NPV, PI, IRR, and discounted payback for a 200,000 project at 11%.",
    "Find price elasticity if price falls from 120 to 100 and quantity rises from 240 to 300.",
    "Plan startup costs with permits, equipment, inventory, and a 10% contingency.",
    "Build an adjusting entry for prepaid expense or accrued expense.",
    "Use the entrepreneurship toolkit to find a selling price target or customer payback.",
    "Estimate mixed cost using the high-low method.",
    "Plan EOQ and reorder point with lead time and safety stock.",
    "Review audit planning materiality and risk from one workspace.",
    "Bridge accounting income and taxable income through book-tax differences.",
    "Measure a lease liability and right-of-use asset from periodic lease payments.",
    "Build an indirect-method statement of cash flows with working-capital changes and financing items.",
    "Translate a foreign-currency receivable using transaction, closing, and settlement rates.",
    "Review withholding tax, estate tax, treaty handling, or incentive-regime logic.",
    "Send a CVP result into Workpaper Studio and export the workbook as XLSX.",
];

const FEATURED_PATHS = [
    "/workpapers",
    "/scan-check",
    "/study",
    "/study/practice",
    "/business/cvp-analysis",
    "/business/special-order-analysis",
    "/business/make-or-buy-analysis",
    "/business/constrained-resource-product-mix",
    "/business/additional-funds-needed",
    "/accounting/partnership-dissolution",
    "/accounting/process-costing-workspace",
    "/smart/solver",
    "/accounting/ratio-analysis-workspace",
    "/finance/internal-rate-of-return",
    "/finance/accounting-rate-of-return",
    "/finance/equivalent-annual-annuity",
    "/finance/capital-budgeting-comparison",
    "/accounting/common-size-income-statement",
    "/audit/audit-planning-workspace",
    "/tax/book-tax-difference-workspace",
    "/tax/percentage-tax",
    "/tax/tax-compliance-review",
    "/operations/eoq-and-reorder-point",
    "/operations/moving-average-forecast",
    "/far/lease-measurement-workspace",
    "/far/retained-earnings-rollforward",
    "/far/cash-flow-statement-builder",
    "/afar/business-combination-analysis",
    "/afar/foreign-currency-translation",
    "/economics/price-elasticity-demand",
    "/entrepreneurship/entrepreneurship-toolkit",
];

const WORKFLOW_COLLECTIONS = [
    {
        title: "Workpaper Studio",
        description: "Capture calculator outputs, import spreadsheets, and organize multi-sheet workbooks for class or professional solving files.",
        paths: [
            "/workpapers",
            "/history",
            "/business/cvp-analysis",
            "/business/cash-budget",
            "/operations/eoq-and-reorder-point",
        ],
    },
    {
        title: "Process costing",
        description: "Move from unit flow and equivalent units into departmental costing, production reports, and practice checking.",
        paths: [
            "/accounting/process-costing-workspace",
            "/accounting/equivalent-units-weighted-average",
            "/accounting/cost-per-equivalent-unit",
            "/accounting/cost-of-production-report",
            "/accounting/process-costing-practice-checker",
        ],
    },
    {
        title: "Scan to solve",
        description: "Upload a page, let AccCalc auto-read and classify it, then follow one suggested next step into Smart Solver or the right workspace.",
        paths: [
            "/scan-check",
            "/accounting/process-costing-practice-checker",
            "/smart/solver",
            "/basic",
        ],
    },
    {
        title: "Liquidity",
        description: "Move from quick liquidity checks into working-capital interpretation.",
        paths: [
            "/accounting/current-ratio",
            "/accounting/quick-ratio",
            "/accounting/working-capital-cycle",
            "/accounting/cash-conversion-cycle",
        ],
    },
    {
        title: "Receivables",
        description: "Estimate allowance quality from flat estimates through aging analysis.",
        paths: [
            "/accounting/allowance-doubtful-accounts",
            "/accounting/receivables-aging-schedule",
            "/accounting/receivables-turnover",
        ],
    },
    {
        title: "CVP planning",
        description: "Move from a broad CVP read into contribution margin, break-even, target profit, and sales-mix analysis.",
        paths: [
            "/business/cvp-analysis",
            "/business/contribution-margin",
            "/business/break-even",
            "/business/sales-mix-break-even",
            "/business/target-profit",
        ],
    },
    {
        title: "Relevant costing decisions",
        description: "Move through special orders, sourcing choices, further-processing decisions, and bottleneck-based product ranking.",
        paths: [
            "/business/special-order-analysis",
            "/business/make-or-buy-analysis",
            "/business/sell-or-process-further",
            "/business/constrained-resource-product-mix",
        ],
    },
    {
        title: "Partnership accounting",
        description: "Move from allocation into retirement, dissolution, and capital rollforward work without leaving the app.",
        paths: [
            "/accounting/partnership-profit-sharing",
            "/accounting/partnership-retirement-bonus",
            "/accounting/partnership-dissolution",
            "/accounting/partners-capital-statement",
        ],
    },
    {
        title: "Budgeting",
        description: "Move from operating cash planning into flexible-budget variance reading.",
        paths: [
            "/business/cash-collections-schedule",
            "/business/cash-disbursements-schedule",
            "/business/cash-budget",
            "/business/flexible-budget",
            "/business/additional-funds-needed",
            "/business/margin-of-safety",
        ],
    },
    {
        title: "Capital budgeting",
        description: "Compare discounted value, project rate, and recovery tools in one decision workflow.",
        paths: [
            "/finance/npv",
            "/finance/accounting-rate-of-return",
            "/finance/capital-budgeting-comparison",
            "/finance/equivalent-annual-annuity",
            "/finance/internal-rate-of-return",
            "/finance/profitability-index",
            "/finance/discounted-payback-period",
        ],
    },
    {
        title: "FAR depth",
        description: "Move from lease and cash-flow measurement into broader statement and equity review support.",
        paths: [
            "/far/lease-measurement-workspace",
            "/far/share-based-payment-workspace",
            "/far/retained-earnings-rollforward",
            "/far/cash-flow-statement-builder",
            "/accounting/earnings-per-share",
        ],
    },
    {
        title: "Audit planning",
        description: "Move from planning materiality and audit risk into IT controls and broader governance review.",
        paths: [
            "/audit/audit-planning-workspace",
            "/audit/audit-cycle-reviewer",
            "/audit/audit-completion-and-opinion",
            "/ais/it-control-matrix",
            "/governance/risk-control-matrix",
        ],
    },
    {
        title: "Tax bridge",
        description: "Move from book-tax differences into VAT review and broader integrative tax interpretation.",
        paths: [
            "/tax/book-tax-difference-workspace",
            "/tax/percentage-tax",
            "/tax/tax-compliance-review",
            "/accounting/philippine-vat",
            "/strategic/integrative-case-mapper",
        ],
    },
    {
        title: "Operations and supply chain",
        description: "Move from short-term forecasting into EOQ, reorder points, capacity, and inventory-control follow-through.",
        paths: [
            "/operations/moving-average-forecast",
            "/operations/eoq-and-reorder-point",
            "/business/capacity-utilization",
            "/accounting/inventory-control-workspace",
        ],
    },
    {
        title: "AFAR and consolidation",
        description: "Start from business-combination measurement, then move into partnership and integrative review support.",
        paths: [
            "/afar/business-combination-analysis",
            "/afar/foreign-currency-translation",
            "/afar/construction-revenue-workspace",
            "/accounting/partnership-dissolution",
            "/strategic/integrative-case-mapper",
        ],
    },
    {
        title: "AIS and continuity",
        description: "Move from control review into continuity, ERP, and audit-response support.",
        paths: [
            "/ais/it-control-matrix",
            "/ais/ais-lifecycle-and-recovery",
            "/audit/audit-planning-workspace",
        ],
    },
    {
        title: "Commercial-law review",
        description: "Start from core law issue spotting, then move into commercial transactions and integrative governance links.",
        paths: [
            "/rfbt/business-law-review",
            "/rfbt/commercial-transactions-reviewer",
            "/governance/risk-control-matrix",
        ],
    },
    {
        title: "Strategic review",
        description: "Move from strategic business analysis into integrative case mapping and performance evaluation.",
        paths: [
            "/strategic/strategic-business-analysis",
            "/strategic/integrative-case-mapper",
            "/business/roi-ri-eva",
        ],
    },
    {
        title: "Statement analysis",
        description: "Move from common-size views into horizontal and ratio-based interpretation.",
        paths: [
            "/accounting/common-size-income-statement",
            "/accounting/common-size-balance-sheet",
            "/accounting/horizontal-analysis",
            "/accounting/ratio-analysis-workspace",
        ],
    },
    {
        title: "Adjustment and control",
        description: "Move from routine adjusting entries into working-capital and inventory-control review.",
        paths: [
            "/accounting/adjusting-entries-workspace",
            "/accounting/working-capital-planner",
            "/accounting/inventory-control-workspace",
        ],
    },
    {
        title: "Economics review",
        description: "Start with elasticity, move into equilibrium, and finish with surplus or inflation-adjusted interpretation.",
        paths: [
            "/economics/price-elasticity-demand",
            "/economics/market-equilibrium",
            "/economics/surplus-analysis",
            "/economics/real-interest-rate",
        ],
    },
    {
        title: "Startup planning",
        description: "Move from launch cost planning into unit economics, sales forecasting, and runway checks.",
        paths: [
            "/entrepreneurship/startup-cost-planner",
            "/entrepreneurship/entrepreneurship-toolkit",
            "/entrepreneurship/unit-economics",
            "/entrepreneurship/sales-forecast-planner",
            "/entrepreneurship/cash-runway-planner",
        ],
    },
    {
        title: "Valuation",
        description: "Handle inventory write-downs, bonds, and other valuation-heavy classroom cases.",
        paths: [
            "/accounting/lower-of-cost-or-nrv",
            "/accounting/bond-amortization-schedule",
            "/finance/discounted-payback-period",
        ],
    },
];

export default function HomePage() {
    const activity = useAppActivity();
    const studyProgress = useStudyProgress();
    const settings = useAppSettings();
    const network = useNetworkStatus();
    const offlineBundle = useOfflineBundleStatus();
    const pinnedRoutes = getPinnedRoutes(activity);
    const mostUsedRoutes = getMostUsedRoutes(activity, 4);
    const recentRoutes = getRecentRoutes(activity, 5);
    const recommended = getRecommendedRoutes(activity, "/");

    const unseenFeatures = useMemo(
        () =>
            Array.from(APP_ROUTE_META_MAP.values()).filter(
                (route) =>
                    NEW_FEATURE_PATHS.has(route.path) &&
                    !activity.seenNewPaths.includes(route.path)
            ),
        [activity.seenNewPaths]
    );

    const featuredRoutes = useMemo(
        () =>
            FEATURED_PATHS.map((path) => getRouteMeta(path)).filter(
                (item): item is NonNullable<typeof item> => Boolean(item)
            ),
        []
    );

    const collections = useMemo(
        () =>
            WORKFLOW_COLLECTIONS.map((collection) => ({
                ...collection,
                routes: collection.paths
                    .map((path) => APP_ROUTE_META_MAP.get(path))
                    .filter((item): item is NonNullable<typeof item> => Boolean(item)),
            })),
        []
    );

    const categoryShortcuts = useMemo(
        () =>
            APP_NAV_GROUPS.filter((group) => group.title !== "General").map((group) => ({
                ...group,
                featuredItems: group.items.slice(
                    0,
                    group.title === "FAR" || group.title === "Cost & Managerial" ? 5 : 4
                ),
            })),
        []
    );

    const quickStartRoutes = (pinnedRoutes.length > 0 ? pinnedRoutes : recommended).slice(0, 4);
    const studyTopics = useMemo(
        () =>
            Object.values(studyProgress.topics)
                .sort((left, right) => right.lastViewedAt - left.lastViewedAt)
                .slice(0, 4)
                    .map((topic) => ({
                    ...topic,
                    route: getRouteMeta(topic.path),
                })),
        [studyProgress.topics]
    );
    const bookmarkedStudyTopics = useMemo(
        () => studyTopics.filter((topic) => topic.bookmarked).slice(0, 3),
        [studyTopics]
    );
    const statusStats = [
        { label: "Pins", value: pinnedRoutes.length, helper: "Quick access" },
        { label: "Saved", value: activity.savedRecords.length, helper: "Stored prompts" },
    ];

    return (
        <div className="app-page-stack">
            <section className="app-panel rounded-[var(--app-radius-xl)] p-4.5 md:p-6">
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(17rem,0.88fr)] xl:items-start">
                    <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="shrink-0">
                                <AppBrandMark compact />
                            </div>
                            <span className="app-chip-accent rounded-full px-2.5 py-1 text-[0.62rem]">
                                v{APP_VERSION}
                            </span>
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                Workspace
                            </span>
                        </div>

                        <h1 className="mt-3.5 max-w-2xl text-[clamp(1.55rem,1.2rem+1.25vw,2.35rem)] font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                            Solve, check, and learn accounting with less overwhelm.
                        </h1>
                        <p className="app-body-md mt-2.5 max-w-2xl text-sm">
                            Pick one clear path: solve a known topic, check a worksheet or worked answer, or open a lesson when the terms still feel unfamiliar. AccCalc is built to help beginners start quickly without losing access to deeper review.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2.5">
                            <Link
                                to="/smart/solver"
                                className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
                            >
                                Start with Smart Solver
                            </Link>
                            <Link
                                to="/scan-check"
                                className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
                            >
                                Open Scan & Check
                            </Link>
                            <Link
                                to="/study"
                                className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
                            >
                                Open Study Hub
                            </Link>
                            <Link
                                to="/study/practice"
                                className="app-button-ghost rounded-xl px-4 py-2.5 text-sm font-semibold"
                            >
                                Practice quizzes
                            </Link>
                            <ShareAppButton
                                className="rounded-xl px-4 py-2.5"
                                label="Share link"
                                shareText="Try AccCalc for accounting, finance, and business calculations with truthful offline support after caching."
                            />
                        </div>

                        <FeatureSearch
                            variant="hero"
                            className="mt-5 max-w-2xl"
                            placeholder="Search ratios, inventory, depreciation, Smart Solver..."
                        />
                        <p className="app-helper mt-3 text-xs leading-5">
                            New to the topic? Search plain-language terms like “break-even,” “journal entry,” “loan payment,” or “partnership dissolution.”
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                            {statusStats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="app-subtle-surface rounded-[1.15rem] px-4 py-3.5"
                                >
                                    <p className="app-metric-label">{stat.label}</p>
                                    <p className="app-metric-value mt-2">{stat.value}</p>
                                    <p className="app-helper mt-1 text-xs">{stat.helper}</p>
                                </div>
                            ))}
                        </div>
                        <div className="app-subtle-surface rounded-[1.15rem] px-4 py-3.5">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                    Offline status
                                </p>
                                <OfflineCapabilityBadge
                                    level={offlineBundle.ready ? "full" : "limited"}
                                    className="px-2.5 py-1 text-[0.62rem]"
                                    label={offlineBundle.ready ? "Cached" : "Preparing"}
                                />
                            </div>
                            <p className="app-helper mt-2 text-xs leading-5">
                                {network.online
                                    ? offlineBundle.ready
                                        ? `${offlineBundle.assetCount} assets cached for this release.`
                                        : "Stay online once so this release can finish caching."
                                    : offlineBundle.ready
                                      ? "Offline-safe local routes can still open from cache."
                                      : "This device is offline before the current release finished caching."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <GuidedStartPanel
                badge="Beginner flow"
                title="Choose the simplest first step"
                summary="AccCalc works best when you start with the path that matches your situation instead of opening a random calculator."
                steps={[
                    {
                        title: "Solve a known topic",
                        description:
                            "Use Smart Solver or search when you already know the type of problem but want the fastest route into the right tool.",
                        badge: "Solve",
                    },
                    {
                        title: "Check a worksheet or answer",
                        description:
                            "Use Scan & Check when the problem is in an image, handwritten sheet, or worked solution that still needs careful review.",
                        badge: "Check",
                    },
                    {
                        title: "Study before solving",
                        description:
                            "Open Study Hub when the formula, terms, or interpretation still feel unclear and you want a lesson or quiz first.",
                        badge: "Learn",
                    },
                ]}
            />
            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
                <div className="app-panel rounded-[var(--app-radius-xl)] p-5 md:p-6">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                                <p className="app-section-kicker text-[0.68rem]">Start</p>
                            <h2 className="app-section-title mt-2">Continue from where you are</h2>
                            <p className="app-helper mt-2 text-xs">
                                Pinned and recommended tools stay near the top so you do not need to browse the full catalog first.
                            </p>
                        </div>
                        <Link to="/history" className="app-link-accent text-sm font-medium">
                            View all
                        </Link>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {quickStartRoutes.map((route) => {
                            const routeMeta = APP_ROUTE_META_MAP.get(route.path);
                            const availability = routeMeta
                                ? getRouteAvailability(routeMeta, {
                                      online: network.online,
                                      bundleReady: offlineBundle.ready,
                                      currentPath: "/",
                                  })
                                : { label: "Available", reason: route.description };

                            return (
                                <Link
                                    key={route.path}
                                    to={route.path}
                                    className="app-link-card rounded-[1.15rem] px-4 py-3.5"
                                    title={availability.reason}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                            {pinnedRoutes.some((entry) => entry.path === route.path)
                                                ? "Pinned"
                                                : route.category}
                                        </span>
                                        {routeMeta ? (
                                            <OfflineCapabilityBadge
                                                level={routeMeta.offlineSupport}
                                                className="px-2.5 py-1 text-[0.62rem]"
                                                label={availability.label}
                                            />
                                        ) : null}
                                    </div>
                                <h3 className="mt-3 text-[1rem] font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                                    {route.shortLabel ?? route.label}
                                </h3>
                                    <p className="app-helper mt-1 text-xs leading-5">
                                        {route.description}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>

                    {recentRoutes.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {recentRoutes.map((route) => (
                                <Link
                                    key={route.path}
                                    to={route.path}
                                    className="app-list-link rounded-full px-3 py-1.5 text-sm font-medium"
                                >
                                    {route.shortLabel ?? route.label}
                                </Link>
                            ))}
                        </div>
                    ) : null}
                </div>

                <DisclosurePanel
                    title="What changed"
                    summary="The highest-signal improvements from the current release."
                    badge={unseenFeatures.length > 0 ? `${unseenFeatures.length} new` : "Release"}
                >
                    <div className="space-y-3">
                        {APP_RELEASE_HIGHLIGHTS.slice(0, 3).map((item) => (
                            <div
                                key={item.title}
                                className="app-subtle-surface rounded-[1.15rem] px-4 py-3.5"
                            >
                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                    {item.title}
                                </p>
                                <p className="app-helper mt-1.5 text-xs leading-5">{item.body}</p>
                            </div>
                        ))}

                        {unseenFeatures.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {unseenFeatures.slice(0, 4).map((feature) => (
                                    <Link
                                        key={feature.path}
                                        to={feature.path}
                                        className="app-list-link rounded-full px-3 py-1.5 text-sm font-medium"
                                    >
                                        {feature.shortLabel ?? feature.label}
                                    </Link>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </DisclosurePanel>
            </section>

            {studyTopics.length > 0 ? (
                <section className="grid gap-4 xl:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]">
                    <div className="app-panel rounded-[var(--app-radius-xl)] p-5 md:p-6">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="app-section-kicker text-[0.68rem]">Study</p>
                                <h2 className="app-section-title mt-2">Continue learning</h2>
                                <p className="app-helper mt-2 text-xs">
                                    Topic study progress is stored locally on this device.
                                </p>
                            </div>
                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                On-device
                            </span>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {studyTopics.map((topic) => (
                                <Link
                                    key={topic.id}
                                    to={topic.path}
                                    className="app-link-card rounded-[1.15rem] px-4 py-3.5"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                            {topic.bookmarked ? "Bookmarked" : "Recent study"}
                                        </span>
                                        <span className="app-helper text-xs">
                                            {topic.completedSections.length} reviewed
                                        </span>
                                    </div>
                                    <h3 className="mt-3 text-[1rem] font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                                        {topic.route?.shortLabel ?? topic.title}
                                    </h3>
                                    <p className="app-helper mt-1 text-xs leading-5">
                                        {topic.route?.description ??
                                            "Pick up the topic where you left off."}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <DisclosurePanel
                        title="Bookmarked topics"
                        summary="Topics you marked for return study, all stored locally."
                        badge={bookmarkedStudyTopics.length > 0 ? `${bookmarkedStudyTopics.length} saved` : "Recent"}
                    >
                        <div className="grid gap-3">
                            {(bookmarkedStudyTopics.length > 0 ? bookmarkedStudyTopics : studyTopics).map(
                                (topic) => (
                                    <Link
                                        key={`study-${topic.id}`}
                                        to={topic.path}
                                        className="app-list-link rounded-[1rem] px-4 py-3"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-sm font-semibold text-[color:var(--app-text)]">
                                                {topic.route?.shortLabel ?? topic.title}
                                            </span>
                                            <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                                {topic.completedSections.length} reviewed
                                            </span>
                                        </div>
                                        <p className="app-helper mt-1 text-xs leading-5">
                                            {topic.route?.category ?? "Study topic"}
                                        </p>
                                    </Link>
                                )
                            )}
                        </div>
                    </DisclosurePanel>
                </section>
            ) : null}

            <section className="space-y-3">
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <p className="app-section-kicker text-[0.68rem]">Featured</p>
                        <h2 className="app-section-title mt-2">Strong starting tools</h2>
                    </div>
                    <Link to="/smart/solver" className="app-link-accent text-sm font-medium">
                        Use solver
                    </Link>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {featuredRoutes.map((route) => {
                        const availability = getRouteAvailability(route, {
                            online: network.online,
                            bundleReady: offlineBundle.ready,
                            currentPath: "/",
                        });

                        return (
                            <Link
                                key={route.path}
                                to={route.path}
                                className="app-link-card rounded-[1.15rem] px-4 py-4"
                                title={availability.reason}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                        {route.category}
                                    </span>
                                    <OfflineCapabilityBadge
                                        level={route.offlineSupport}
                                        className="px-2.5 py-1 text-[0.62rem]"
                                        label={availability.label}
                                    />
                                </div>
                                <h3 className="mt-3 text-[1.02rem] font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                                    {route.shortLabel ?? route.label}
                                </h3>
                                <p className="app-helper mt-1.5 text-xs leading-5">
                                    {route.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
                <DisclosurePanel
                    title="Workflow collections"
                    summary="Grouped paths for common study and practice sequences."
                    badge={`${collections.length} sets`}
                >
                    <div className="grid gap-4">
                        {collections.map((collection) => (
                            <div key={collection.title} className="space-y-2">
                                <div>
                                    <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                        {collection.title}
                                    </p>
                                    <p className="app-helper mt-1 text-xs leading-5">
                                        {collection.description}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {collection.routes.map((route) => (
                                        <Link
                                            key={route.path}
                                            to={route.path}
                                            className="app-list-link rounded-full px-3 py-1.5 text-sm font-medium"
                                        >
                                            {route.shortLabel ?? route.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </DisclosurePanel>

                <DisclosurePanel
                    title="Smart Solver prompts"
                    summary="Quick examples for the assistant-style workflow."
                    badge="Examples"
                >
                    <div className="grid gap-2">
                        {(settings.smartSolverShowPromptExamples
                            ? SMART_PROMPT_EXAMPLES
                            : SMART_PROMPT_EXAMPLES.slice(0, 2)
                        ).map((example) => (
                            <Link
                                key={example}
                                to="/smart/solver"
                                className="app-list-link rounded-[1rem] px-4 py-3 text-sm leading-6"
                            >
                                {example}
                            </Link>
                        ))}
                    </div>
                </DisclosurePanel>

                <DisclosurePanel
                    title="Browse categories"
                    summary="Short entry lists instead of a long homepage dump."
                    badge={`${categoryShortcuts.length} groups`}
                >
                    <div className="grid gap-4 xl:grid-cols-2">
                        {categoryShortcuts.map((group) => (
                            <div key={group.title} className="space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                        {group.title}
                                    </p>
                                    <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                        {group.items.length}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {group.featuredItems.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className="app-list-link rounded-full px-3 py-1.5 text-sm font-medium"
                                        >
                                            {item.shortLabel ?? item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </DisclosurePanel>
            </section>

            {mostUsedRoutes.length > 0 || APP_RELEASE_NOTES.length > 0 ? (
                <section className="grid gap-4 xl:grid-cols-2">
                    {mostUsedRoutes.length > 0 ? (
                        <div className="app-panel rounded-[var(--app-radius-xl)] p-5 md:p-6">
                            <p className="app-section-kicker text-[0.68rem]">Momentum</p>
                            <h2 className="app-section-title mt-2">Most used here</h2>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                {mostUsedRoutes.map((route) => (
                                    <Link
                                        key={route.path}
                                        to={route.path}
                                        className="app-link-card rounded-[1.05rem] px-4 py-3.5"
                                    >
                                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                            {route.shortLabel ?? route.label}
                                        </p>
                                        <p className="app-helper mt-1 text-xs leading-5">
                                            {route.description}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <DisclosurePanel
                        title={`Release notes | ${APP_VERSION}`}
                                                summary="The detailed shipping log for this release."
                        badge={`${APP_RELEASE_NOTES.length} notes`}
                    >
                        <div className="space-y-2">
                            {APP_RELEASE_NOTES.map((note) => (
                                <div
                                    key={note}
                                    className="app-subtle-surface rounded-[1rem] px-4 py-3 text-sm leading-6"
                                >
                                    {note}
                                </div>
                            ))}
                        </div>
                    </DisclosurePanel>
                </section>
            ) : null}
        </div>
    );
}

