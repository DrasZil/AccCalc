import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FeatureSearch from "../../components/FeatureSearch";
import { getRecommendedRoutes, useAppActivity } from "../../utils/appActivity";
import {
    APP_NAV_GROUPS,
    APP_ROUTE_META_MAP,
    NEW_FEATURE_PATHS,
} from "../../utils/appCatalog";
import { useAppSettings } from "../../utils/appSettings";

const SPOTLIGHT_PATHS = [
    "/smart/solver",
    "/accounting/trial-balance-checker",
    "/finance/npv",
    "/accounting/debit-credit-trainer",
];

const HIDDEN_HOME_PATHS = new Set(["/", "/settings/about", "/settings/feedback"]);

export default function HomePage() {
    const activity = useAppActivity();
    const settings = useAppSettings();
    const [showWhatsNew, setShowWhatsNew] = useState(true);
    const recommended = getRecommendedRoutes(activity, "/");
    const savedPromptCount = activity.savedRecords.length;
    const activeToolCount = Object.keys(activity.toolUsage).length;

    const unseenFeatures = useMemo(
        () =>
            Array.from(APP_ROUTE_META_MAP.values()).filter(
                (route) =>
                    NEW_FEATURE_PATHS.has(route.path) &&
                    !activity.seenNewPaths.includes(route.path)
            ),
        [activity.seenNewPaths]
    );

    const spotlightTools = useMemo(
        () =>
            SPOTLIGHT_PATHS.map((path) => APP_ROUTE_META_MAP.get(path)).filter(
                (item): item is NonNullable<typeof item> => Boolean(item)
            ),
        []
    );

    const browseGroups = useMemo(
        () =>
            APP_NAV_GROUPS.filter((group) => group.title !== "General").map((group) => ({
                ...group,
                items: group.items.filter((item) => !HIDDEN_HOME_PATHS.has(item.path)),
                featuredItems: group.items
                    .filter((item) => !HIDDEN_HOME_PATHS.has(item.path))
                    .slice(0, group.title === "Accounting" ? 6 : 5),
            })),
        []
    );

    const totalBrowsableTools = browseGroups.reduce(
        (total, group) => total + group.items.length,
        0
    );

    return (
        <div className="app-page-stack">
            <section className="app-panel-elevated app-hero-panel rounded-[var(--app-radius-xl)] p-6 md:p-8 xl:p-10">
                <div className="grid gap-8 xl:grid-cols-[1.16fr_0.84fr] xl:items-end">
                    <div className="max-w-3xl">
                        <p className="app-kicker">
                            Accounting-first calculator platform
                        </p>
                        <h1 className="mt-4 text-[clamp(2.3rem,1.45rem+3vw,4.85rem)] font-bold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                            Reliable tools for accounting, finance, managerial work, business math, and statistics.
                        </h1>
                        <p className="app-body-lg mt-5 max-w-2xl text-base md:text-lg">
                            AccCalc is built for assignments, quizzes, reviews, and practical class use.
                            The app prioritizes formula accuracy, cleaner interpretation, and direct
                            routes into the exact tool you need.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
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
                                Open history
                            </Link>
                        </div>

                        <FeatureSearch
                            variant="hero"
                            className="mt-6 max-w-2xl"
                            placeholder="Search NPV, debit and credit, FIFO, trial balance, gross profit, weighted mean..."
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                        <div className="app-metric-tile rounded-[1.55rem] p-4 md:p-5">
                            <p className="app-metric-label">Browsable tools</p>
                            <p className="app-metric-value mt-3">{totalBrowsableTools}</p>
                        </div>
                        <div className="app-metric-tile rounded-[1.55rem] p-4 md:p-5">
                            <p className="app-metric-label">Active categories</p>
                            <p className="app-metric-value mt-3">{browseGroups.length}</p>
                        </div>
                        <div className="app-metric-tile rounded-[1.55rem] p-4 md:p-5">
                            <p className="app-metric-label">Saved prompts</p>
                            <p className="app-metric-value mt-3">{savedPromptCount}</p>
                        </div>
                        <div className="app-metric-tile rounded-[1.55rem] p-4 md:p-5">
                            <p className="app-metric-label">Used tools</p>
                            <p className="app-metric-value mt-3">{activeToolCount}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                {unseenFeatures.length > 0 ? (
                    <div className="app-link-card rounded-[var(--app-radius-xl)] p-6">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                                <p className="app-kicker text-xs">
                                    What is new
                                </p>
                                <h2 className="mt-3 text-2xl font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                                    {unseenFeatures.length} update{unseenFeatures.length > 1 ? "s" : ""} ready to explore.
                                </h2>
                                <p className="app-body-md mt-2 text-sm">
                                    New items disappear from this section after you open them.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowWhatsNew((current) => !current)}
                                className="app-button-ghost inline-flex rounded-xl px-4 py-2 text-sm font-medium"
                            >
                                {showWhatsNew ? "Hide updates" : "Show updates"}
                            </button>
                        </div>

                        {showWhatsNew ? (
                            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                {unseenFeatures.map((feature) => (
                                    <Link
                                        key={feature.path}
                                        to={feature.path}
                                        className="app-list-link rounded-2xl p-4 transition duration-300"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-[0.98rem] font-semibold tracking-[-0.02em] text-[color:var(--app-text)]">
                                                {feature.label}
                                            </p>
                                            <span className="app-badge-new rounded-full px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.14em]">
                                                New
                                            </span>
                                        </div>
                                        <p className="app-section-kicker mt-2 text-xs">
                                            {feature.category}
                                        </p>
                                        <p className="app-body-md mt-3 text-sm">
                                            {feature.description}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        ) : null}
                    </div>
                ) : null}

                <div className="app-panel rounded-[var(--app-radius-xl)] p-6">
                    <p className="app-kicker text-xs">
                        Best use cases
                    </p>
                    <div className="mt-4 space-y-3">
                        <div className="app-subtle-surface rounded-2xl p-4">
                            <p className="app-card-title text-sm">Assignments and activities</p>
                            <p className="app-body-md mt-2 text-sm">
                                Move from formulas to interpreted answers faster when checking class problems and workbook items.
                            </p>
                        </div>
                        <div className="app-subtle-surface rounded-2xl p-4">
                            <p className="app-card-title text-sm">Quizzes and reviews</p>
                            <p className="app-body-md mt-2 text-sm">
                                Use the trainer and classification helpers to reinforce normal balances, account types, and ratio logic.
                            </p>
                        </div>
                        <div className="app-subtle-surface rounded-2xl p-4">
                            <p className="app-card-title text-sm">Offline-friendly study flow</p>
                            <p className="app-body-md mt-2 text-sm">
                                Recent prompts, saved activity, and installed-app behavior stay available on the device.
                            </p>
                        </div>
                        <div className="app-subtle-surface rounded-2xl p-4">
                            <p className="app-card-title text-sm">Saved offline</p>
                            <p className="app-body-md mt-2 text-sm">
                                {settings.saveOfflineHistory
                                    ? "History saving is enabled for this device."
                                    : "History saving is currently disabled in settings."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="app-section-title text-2xl">Recommended for you</h2>
                        <p className="app-body-md mt-1 text-sm">
                            Driven by recent activity and the tools you revisit most often.
                        </p>
                    </div>
                    <Link
                        to="/settings"
                        className="app-link-accent text-sm font-medium transition duration-300"
                    >
                        Open settings
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {recommended.map((tool) => (
                        <Link
                            key={tool.path}
                            to={tool.path}
                            className="app-link-card app-card-hover group rounded-[var(--app-radius-xl)] p-6 transition duration-300"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className="app-chip rounded-full px-3 py-1 text-xs">
                                    {tool.category}
                                </span>
                                {NEW_FEATURE_PATHS.has(tool.path) ? (
                                    <span className="app-badge-new rounded-full px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.14em]">
                                        New
                                    </span>
                                ) : (
                                    <span className="app-helper text-sm transition duration-300 group-hover:text-[color:var(--app-text-secondary)]">
                                        Open
                                    </span>
                                )}
                            </div>

                            <h3 className="mt-4 text-xl font-semibold leading-snug tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                                {tool.label}
                            </h3>
                            <p className="app-body-md mt-3 text-sm">
                                {tool.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <div>
                    <h2 className="app-section-title text-2xl">Spotlight tools</h2>
                    <p className="app-body-md mt-1 text-sm">
                        Fast routes into guided solving, clean interpretation, and class-ready outputs.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {spotlightTools.map((tool) => (
                        <Link
                            key={tool.path}
                            to={tool.path}
                            className="app-link-card app-card-hover group rounded-[var(--app-radius-xl)] p-6 transition duration-300"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className="app-chip rounded-full px-3 py-1 text-xs">
                                    {tool.category}
                                </span>
                                <span className="app-helper text-sm transition duration-300 group-hover:text-[color:var(--app-text-secondary)]">
                                    Open
                                </span>
                            </div>

                            <h3 className="mt-4 text-xl font-semibold leading-snug tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                                {tool.label}
                            </h3>
                            <p className="app-body-md mt-3 text-sm">
                                {tool.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <div>
                    <h2 className="app-section-title text-2xl">Browse by category</h2>
                    <p className="app-body-md mt-1 text-sm">
                        Organized from the shared app catalog so navigation and search stay consistent as the platform grows.
                    </p>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                    {browseGroups.map((group) => (
                        <div
                            key={group.title}
                            className="app-panel rounded-[var(--app-radius-xl)] p-6"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="app-kicker text-xs">
                                    {group.title}
                                </p>
                                <span className="app-chip rounded-full px-3 py-1 text-xs">
                                    {group.items.length}
                                </span>
                            </div>

                            <h3 className="mt-3 text-2xl font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                                {group.hint}
                            </h3>

                            <div className="mt-5 space-y-2">
                                {group.featuredItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="app-list-link flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition duration-300"
                                    >
                                        <span className="truncate pr-3 text-[0.94rem] font-medium tracking-[-0.015em] text-[color:var(--app-text)]">
                                            {item.label}
                                        </span>
                                        <span className="app-helper text-xs uppercase tracking-[0.14em]">
                                            {NEW_FEATURE_PATHS.has(item.path) ? "New" : "Open"}
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
