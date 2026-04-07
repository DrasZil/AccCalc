import { useMemo } from "react";
import { Link } from "react-router-dom";
import AppBrandMark from "../../components/AppBrandMark";
import DisclosurePanel from "../../components/DisclosurePanel";
import FeatureSearch from "../../components/FeatureSearch";
import OfflineCapabilityBadge from "../../components/OfflineCapabilityBadge";
import ShareAppButton from "../../components/ShareAppButton";
import SupportAccCalcSection from "../settings/components/SupportAccCalcSection";
import {
    getMostUsedRoutes,
    getPinnedRoutes,
    getRecentRoutes,
    getRecommendedRoutes,
    useAppActivity,
} from "../../utils/appActivity";
import {
    APP_NAV_GROUPS,
    APP_ROUTE_META_MAP,
    NEW_FEATURE_PATHS,
    getRouteAvailability,
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
];

const FEATURED_PATHS = [
    "/scan-check",
    "/accounting/process-costing-workspace",
    "/accounting/cost-of-production-report",
    "/smart/solver",
    "/accounting/ratio-analysis-workspace",
    "/business/break-even",
    "/finance/internal-rate-of-return",
    "/finance/capital-budgeting-comparison",
    "/accounting/common-size-income-statement",
    "/accounting/adjusting-entries-workspace",
    "/economics/price-elasticity-demand",
    "/entrepreneurship/entrepreneurship-toolkit",
];

const WORKFLOW_COLLECTIONS = [
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
        description: "Extract an image, review the text and worksheet fields, then hand it into Smart Solver or a process-costing checker.",
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
        description: "Go from contribution margin to multi-product break-even and target profit.",
        paths: [
            "/business/contribution-margin",
            "/business/break-even",
            "/business/sales-mix-break-even",
            "/business/target-profit",
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
            "/business/margin-of-safety",
        ],
    },
    {
        title: "Capital budgeting",
        description: "Compare discounted value, project rate, and recovery tools in one decision workflow.",
        paths: [
            "/finance/npv",
            "/finance/capital-budgeting-comparison",
            "/finance/internal-rate-of-return",
            "/finance/profitability-index",
            "/finance/discounted-payback-period",
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
            FEATURED_PATHS.map((path) => APP_ROUTE_META_MAP.get(path)).filter(
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
                featuredItems: group.items.slice(0, group.title === "Accounting" ? 5 : 4),
            })),
        []
    );

    const quickStartRoutes = (pinnedRoutes.length > 0 ? pinnedRoutes : recommended).slice(0, 4);
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
                            Cleaner tools, quicker starts.
                        </h1>
                        <p className="app-body-md mt-2.5 max-w-2xl text-sm">
                            Search, resume a workflow, or start with Smart Solver. Deeper notes and release detail stay available without crowding the first screen.
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2.5">
                            <Link
                                to="/scan-check"
                                className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
                            >
                                Open Scan & Check
                            </Link>
                            <Link
                                to="/smart/solver"
                                className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
                            >
                                Open solver
                            </Link>
                            <Link
                                to="/history"
                                className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
                            >
                                Open history
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

            <SupportAccCalcSection spotlight compact />

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
                <div className="app-panel rounded-[var(--app-radius-xl)] p-5 md:p-6">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="app-section-kicker text-[0.68rem]">Start</p>
                            <h2 className="app-section-title mt-2">Pick up your workflow</h2>
                            <p className="app-helper mt-2 text-xs">
                                Pinned and recommended tools stay close to the top.
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

