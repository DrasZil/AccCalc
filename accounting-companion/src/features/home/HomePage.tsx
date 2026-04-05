import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppBrandMark from "../../components/AppBrandMark";
import FeatureSearch from "../../components/FeatureSearch";
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
} from "../../utils/appCatalog";
import {
    APP_RELEASE_HIGHLIGHTS,
    APP_RELEASE_NOTES,
    APP_VERSION,
} from "../../utils/appRelease";
import { useAppSettings } from "../../utils/appSettings";
import { useNetworkStatus } from "../../utils/networkStatus";

const SMART_PROMPT_EXAMPLES = [
    "Find the quick ratio if cash is 50,000, marketable securities are 25,000, receivables are 40,000, and current liabilities are 100,000.",
    "Compare FIFO and weighted average if beginning inventory is 100 units at 50, then purchases are 80 at 55 and 120 at 60, with 150 units sold.",
    "Show the cash conversion cycle if receivables days are 36, inventory days are 52, and payables days are 28.",
    "Compute depreciation and compare straight-line with double declining for cost 500,000, salvage 50,000, and useful life 5 years.",
];

const FEATURED_PATHS = [
    "/smart/solver",
    "/accounting/current-ratio",
    "/business/break-even",
    "/finance/loan-amortization",
    "/accounting/inventory-method-comparison",
    "/accounting/depreciation-schedule-comparison",
];

const WORKFLOW_COLLECTIONS = [
    {
        title: "Liquidity and working capital",
        description: "Follow short-term financial health from ratio check to cash-cycle interpretation.",
        paths: [
            "/accounting/current-ratio",
            "/accounting/quick-ratio",
            "/accounting/cash-ratio",
            "/accounting/cash-conversion-cycle",
        ],
    },
    {
        title: "Inventory and cost flow",
        description: "Compare inventory valuation methods and move into interpretation-oriented reporting.",
        paths: [
            "/accounting/fifo-inventory",
            "/accounting/weighted-average-inventory",
            "/accounting/inventory-method-comparison",
            "/accounting/gross-profit-method",
        ],
    },
    {
        title: "Borrowing and capital planning",
        description: "Move from loan repayment planning into discounted cash flow decision tools.",
        paths: [
            "/finance/loan-amortization",
            "/finance/payback-period",
            "/finance/npv",
            "/finance/profitability-index",
        ],
    },
];

export default function HomePage() {
    const activity = useAppActivity();
    const settings = useAppSettings();
    const network = useNetworkStatus();
    const [showWhatsNew, setShowWhatsNew] = useState(true);
    const pinnedRoutes = getPinnedRoutes(activity);
    const mostUsedRoutes = getMostUsedRoutes(activity, 4);
    const recentRoutes = getRecentRoutes(activity, 6);
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

    const categoryShortcuts = useMemo(
        () =>
            APP_NAV_GROUPS.filter((group) => group.title !== "General").map((group) => ({
                ...group,
                featuredItems: group.items.slice(0, group.title === "Accounting" ? 5 : 4),
            })),
        []
    );
    const workflowCollections = useMemo(
        () =>
            WORKFLOW_COLLECTIONS.map((collection) => ({
                ...collection,
                routes: collection.paths
                    .map((path) => APP_ROUTE_META_MAP.get(path))
                    .filter((item): item is NonNullable<typeof item> => Boolean(item)),
            })),
        []
    );

    const topMetrics = [
        { label: "Pinned", value: pinnedRoutes.length, helper: "Personal quick access" },
        { label: "Recent tools", value: recentRoutes.length, helper: "Fast resume points" },
        { label: "Saved prompts", value: activity.savedRecords.length, helper: "Solver memory trail" },
        { label: "Used tools", value: Object.keys(activity.toolUsage).length, helper: "Coverage you already explored" },
    ];

    return (
        <div className="app-page-stack">
            <section className="app-panel-elevated app-hero-panel rounded-[var(--app-radius-xl)] p-5 md:p-7 xl:p-8">
                <div className="grid gap-6 xl:grid-cols-[1.22fr_0.78fr] xl:items-end">
                    <div className="max-w-3xl">
                        <AppBrandMark className="mb-4" />
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="app-chip-accent rounded-full px-3 py-1 text-xs">
                                Release {APP_VERSION}
                            </span>
                            <span className="app-chip rounded-full px-3 py-1 text-xs">
                                Accounting-first workspace
                            </span>
                        </div>

                        <h1 className="mt-4 text-[clamp(2rem,1.3rem+3vw,4.35rem)] font-bold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                            Compact, smarter calculators for accounting classwork, analysis, and practical decisions.
                        </h1>
                        <p className="app-body-lg mt-4 max-w-2xl text-sm md:text-base">
                            AccCalc now groups the strongest tools, recent work, pinned shortcuts, and Smart Solver entry points into one faster dashboard.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                            <Link
                                to="/smart/solver"
                                className="app-button-primary rounded-xl px-5 py-3 text-sm font-semibold"
                            >
                                Open Smart Solver
                            </Link>
                            <Link
                                to="/history"
                                className="app-button-secondary rounded-xl px-5 py-3 text-sm font-semibold"
                            >
                                Review recent work
                            </Link>
                        </div>

                        <FeatureSearch
                            variant="hero"
                            className="mt-5 max-w-2xl"
                            placeholder="Search ratios, inventory comparison, depreciation schedules, cash conversion cycle..."
                        />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {topMetrics.map((metric) => (
                            <div key={metric.label} className="app-metric-tile rounded-[1.35rem] p-4">
                                <p className="app-metric-label">{metric.label}</p>
                                <p className="app-metric-value mt-2">{metric.value}</p>
                                <p className="app-helper mt-2 text-xs">{metric.helper}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="app-panel rounded-[var(--app-radius-xl)] p-5 md:p-6">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="app-kicker text-xs">Quick start</p>
                            <h2 className="app-section-title mt-3 text-2xl">Start where your workflow is now</h2>
                            <p className="app-body-md mt-2 text-sm">
                                Pinned tools stay in reach. Recent tools help you resume without digging through categories.
                            </p>
                        </div>
                        {pinnedRoutes.length > 0 ? (
                            <Link to="/history" className="app-link-accent text-sm font-medium">
                                View all activity
                            </Link>
                        ) : null}
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {(pinnedRoutes.length > 0 ? pinnedRoutes : recommended).slice(0, 4).map((route) => (
                            <Link
                                key={route.path}
                                to={route.path}
                                className="app-link-card rounded-[1.35rem] p-4 transition duration-300 hover:-translate-y-0.5"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <span className="app-chip rounded-full px-3 py-1 text-xs">
                                        {pinnedRoutes.some((entry) => entry.path === route.path)
                                            ? "Pinned"
                                            : route.category}
                                    </span>
                                    <span className="app-helper text-xs uppercase tracking-[0.14em]">
                                        Open
                                    </span>
                                </div>
                                <h3 className="mt-3 text-lg font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                                    {route.label}
                                </h3>
                                <p className="app-body-md mt-2 text-sm">{route.description}</p>
                            </Link>
                        ))}
                    </div>

                    {recentRoutes.length > 0 ? (
                        <div className="mt-5">
                            <p className="app-section-kicker text-xs">Continue where you left off</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {recentRoutes.map((route) => (
                                    <Link
                                        key={route.path}
                                        to={route.path}
                                        className="app-list-link rounded-full px-3 py-2 text-sm font-medium"
                                    >
                                        {route.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="app-panel rounded-[var(--app-radius-xl)] p-5 md:p-6">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="app-kicker text-xs">What's new</p>
                            <h2 className="app-section-title mt-3 text-2xl">Major release improvements</h2>
                            <p className="app-body-md mt-2 text-sm">
                                Better layout, stronger discovery, smarter routing, and new accounting comparison tools are now live.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowWhatsNew((current) => !current)}
                            className="app-button-ghost rounded-xl px-3 py-2 text-sm font-medium"
                        >
                            {showWhatsNew ? "Hide" : "Show"}
                        </button>
                    </div>

                    {showWhatsNew ? (
                        <div className="mt-5 space-y-3">
                            {APP_RELEASE_HIGHLIGHTS.map((item) => (
                                <div key={item.title} className="app-subtle-surface rounded-[1.25rem] p-4">
                                    <p className="app-card-title text-sm">{item.title}</p>
                                    <p className="app-body-md mt-2 text-sm">{item.body}</p>
                                </div>
                            ))}
                        </div>
                    ) : null}

                    {unseenFeatures.length > 0 ? (
                        <div className="mt-5">
                            <p className="app-section-kicker text-xs">Unopened updates</p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                {unseenFeatures.slice(0, 4).map((feature) => (
                                    <Link
                                        key={feature.path}
                                        to={feature.path}
                                        className="app-list-link rounded-[1.25rem] p-4"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                {feature.label}
                                            </p>
                                            <span className="app-badge-new rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em]">
                                                New
                                            </span>
                                        </div>
                                        <p className="app-helper mt-2 text-xs">{feature.category}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>

            {mostUsedRoutes.length > 0 ? (
                <section className="app-panel rounded-[var(--app-radius-xl)] p-5 md:p-6">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="app-kicker text-xs">Momentum</p>
                            <h2 className="app-section-title mt-3 text-2xl">Most-used tools on this device</h2>
                            <p className="app-body-md mt-2 text-sm">
                                These tools are surfaced from your actual usage so repeat workflows stay fast as the app grows.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {mostUsedRoutes.map((route) => (
                            <Link
                                key={route.path}
                                to={route.path}
                                className="app-link-card rounded-[1.3rem] p-4"
                            >
                                <span className="app-chip rounded-full px-3 py-1 text-xs">
                                    {route.category}
                                </span>
                                <h3 className="mt-3 text-lg font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                                    {route.label}
                                </h3>
                                <p className="app-body-md mt-2 text-sm">{route.description}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            ) : null}

            <section className="space-y-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="app-section-title text-2xl">Featured accounting workflows</h2>
                        <p className="app-body-md mt-1 text-sm">
                            Stronger study and analysis routes across liquidity, depreciation, cost behavior, financing, and inventory.
                        </p>
                    </div>
                    <Link to="/smart/solver" className="app-link-accent text-sm font-medium">
                        Use natural-language solving
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {featuredRoutes.map((route) => (
                        <Link
                            key={route.path}
                            to={route.path}
                            className="app-link-card rounded-[var(--app-radius-xl)] p-5 transition duration-300 hover:-translate-y-0.5"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className="app-chip rounded-full px-3 py-1 text-xs">{route.category}</span>
                                {NEW_FEATURE_PATHS.has(route.path) ? (
                                    <span className="app-badge-new rounded-full px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em]">
                                        New
                                    </span>
                                ) : null}
                            </div>
                            <h3 className="mt-4 text-xl font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                                {route.label}
                            </h3>
                            <p className="app-body-md mt-2 text-sm">{route.description}</p>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <div>
                    <h2 className="app-section-title text-2xl">Guided workflow collections</h2>
                    <p className="app-body-md mt-1 text-sm">
                        These grouped routes make the growing tool set easier to understand for both classwork and practical review.
                    </p>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                    {workflowCollections.map((collection) => (
                        <div key={collection.title} className="app-panel rounded-[var(--app-radius-xl)] p-5">
                            <p className="app-kicker text-xs">Collection</p>
                            <h3 className="mt-3 text-xl font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                                {collection.title}
                            </h3>
                            <p className="app-body-md mt-2 text-sm">{collection.description}</p>
                            <div className="mt-4 space-y-2">
                                {collection.routes.map((route) => (
                                    <Link
                                        key={route.path}
                                        to={route.path}
                                        className="app-list-link flex items-center justify-between rounded-[1.15rem] px-4 py-3 text-sm font-medium"
                                    >
                                        <span className="truncate pr-3 text-[color:var(--app-text)]">
                                            {route.label}
                                        </span>
                                        <span className="app-helper text-xs uppercase tracking-[0.14em]">
                                            Open
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="app-panel rounded-[var(--app-radius-xl)] p-5 md:p-6">
                    <p className="app-kicker text-xs">Smart Solver starter prompts</p>
                    <h2 className="app-section-title mt-3 text-2xl">Try the assistant-style workflow</h2>
                    <p className="app-body-md mt-2 text-sm">
                        Smart Solver works best when you write the problem the way a classmate or client would say it.
                    </p>
                    <div className="mt-5 grid gap-3">
                        {(settings.smartSolverShowPromptExamples
                            ? SMART_PROMPT_EXAMPLES
                            : SMART_PROMPT_EXAMPLES.slice(0, 2)
                        ).map((example) => (
                            <Link
                                key={example}
                                to="/smart/solver"
                                className="app-list-link rounded-[1.25rem] p-4 text-sm leading-6"
                            >
                                {example}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="app-panel rounded-[var(--app-radius-xl)] p-5 md:p-6">
                    <p className="app-kicker text-xs">Release notes</p>
                    <h2 className="app-section-title mt-3 text-2xl">AccCalc {APP_VERSION}</h2>
                    <div className="mt-4 space-y-3">
                        {APP_RELEASE_NOTES.map((note) => (
                            <div key={note} className="app-subtle-surface rounded-[1.2rem] px-4 py-3.5">
                                <p className="app-body-md text-sm">{note}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="app-panel rounded-[var(--app-radius-xl)] p-5 md:p-6">
                    <p className="app-kicker text-xs">Offline readiness</p>
                    <h2 className="app-section-title mt-3 text-2xl">
                        {network.online ? "Offline-safe core tools are ready" : "You are offline now"}
                    </h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {[
                            "All local calculators",
                            "Smart Solver local routing",
                            "Pinned tools and recent history",
                            "Theme, settings, and saved drafts",
                        ].map((item) => (
                            <div key={item} className="app-subtle-surface rounded-[1.2rem] px-4 py-3.5">
                                <p className="text-sm font-semibold text-[color:var(--app-text)]">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="app-panel rounded-[var(--app-radius-xl)] p-5 md:p-6">
                    <p className="app-kicker text-xs">Online-only surfaces</p>
                    <h2 className="app-section-title mt-3 text-2xl">Handled safely when internet is missing</h2>
                    <div className="mt-4 space-y-3">
                        {[
                            "Feedback form and embedded Google Form",
                            "External share/link destinations",
                            "Embedded or externally hosted web content",
                        ].map((item) => (
                            <div key={item} className="app-subtle-surface rounded-[1.2rem] px-4 py-3.5">
                                <p className="app-body-md text-sm">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <div>
                    <h2 className="app-section-title text-2xl">Browse by category</h2>
                    <p className="app-body-md mt-1 text-sm">
                        Categories now prioritize strong entry points instead of overwhelming you with one long list.
                    </p>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                    {categoryShortcuts.map((group) => (
                        <div key={group.title} className="app-panel rounded-[var(--app-radius-xl)] p-5">
                            <div className="flex items-center justify-between gap-3">
                                <p className="app-kicker text-xs">{group.title}</p>
                                <span className="app-chip rounded-full px-3 py-1 text-xs">
                                    {group.items.length}
                                </span>
                            </div>
                            <h3 className="mt-3 text-xl font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                                {group.hint}
                            </h3>
                            <div className="mt-4 space-y-2">
                                {group.featuredItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="app-list-link flex items-center justify-between rounded-[1.15rem] px-4 py-3 text-sm font-medium"
                                    >
                                        <span className="truncate pr-3 text-[color:var(--app-text)]">
                                            {item.label}
                                        </span>
                                        <span className="app-helper text-xs uppercase tracking-[0.14em]">
                                            Open
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

