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
        <div className="space-y-8 md:space-y-10">
            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(88,196,135,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.22)] md:p-10">
                <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
                    <div className="max-w-3xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-300">
                            Accounting-first calculator platform
                        </p>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl xl:text-6xl">
                            Reliable tools for accounting, finance, managerial work, business math, and statistics.
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
                            AccCalc is built for assignments, quizzes, reviews, and practical class use.
                            The app prioritizes formula accuracy, cleaner interpretation, and direct
                            routes into the exact tool you need.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                to="/smart/solver"
                                className="rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-black transition duration-300 hover:bg-green-400"
                            >
                                Open Smart Solver
                            </Link>
                            <Link
                                to="/history"
                                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-white/10"
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

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                        <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                            <p className="text-sm text-gray-400">Browsable tools</p>
                            <p className="mt-2 text-lg font-semibold">{totalBrowsableTools}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                            <p className="text-sm text-gray-400">Active categories</p>
                            <p className="mt-2 text-lg font-semibold">{browseGroups.length}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                            <p className="text-sm text-gray-400">Saved prompts</p>
                            <p className="mt-2 text-lg font-semibold">{savedPromptCount}</p>
                        </div>
                        <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                            <p className="text-sm text-gray-400">Used tools</p>
                            <p className="mt-2 text-lg font-semibold">{activeToolCount}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                {unseenFeatures.length > 0 ? (
                    <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-300">
                                    What is new
                                </p>
                                <h2 className="mt-3 text-2xl font-semibold text-white">
                                    {unseenFeatures.length} update{unseenFeatures.length > 1 ? "s" : ""} ready to explore.
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-gray-400">
                                    New items disappear from this section after you open them.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowWhatsNew((current) => !current)}
                                className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition duration-300 hover:bg-white/10"
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
                                        className="rounded-2xl border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-green-400/20 hover:bg-white/10"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-medium text-white">
                                                {feature.label}
                                            </p>
                                            <span className="rounded-full border border-green-400/15 bg-green-500/10 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-green-300">
                                                New
                                            </span>
                                        </div>
                                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-gray-500">
                                            {feature.category}
                                        </p>
                                        <p className="mt-3 text-sm leading-6 text-gray-400">
                                            {feature.description}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        ) : null}
                    </div>
                ) : null}

                <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-300">
                        Best use cases
                    </p>
                    <div className="mt-4 space-y-3">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-sm font-medium text-white">Assignments and activities</p>
                            <p className="mt-2 text-sm leading-6 text-gray-400">
                                Move from formulas to interpreted answers faster when checking class problems and workbook items.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-sm font-medium text-white">Quizzes and reviews</p>
                            <p className="mt-2 text-sm leading-6 text-gray-400">
                                Use the trainer and classification helpers to reinforce normal balances, account types, and ratio logic.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-sm font-medium text-white">Offline-friendly study flow</p>
                            <p className="mt-2 text-sm leading-6 text-gray-400">
                                Recent prompts, saved activity, and installed-app behavior stay available on the device.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-sm font-medium text-white">Saved offline</p>
                            <p className="mt-2 text-sm leading-6 text-gray-400">
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
                        <h2 className="text-2xl font-bold tracking-tight">Recommended for you</h2>
                        <p className="mt-1 text-sm text-gray-400">
                            Driven by recent activity and the tools you revisit most often.
                        </p>
                    </div>
                    <Link
                        to="/settings"
                        className="text-sm font-medium text-green-300 transition duration-300 hover:text-green-200"
                    >
                        Open settings
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {recommended.map((tool) => (
                        <Link
                            key={tool.path}
                            to={tool.path}
                            className="group rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-green-400/20 hover:bg-white/10"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-gray-300">
                                    {tool.category}
                                </span>
                                {NEW_FEATURE_PATHS.has(tool.path) ? (
                                    <span className="rounded-full border border-green-400/15 bg-green-500/10 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-green-300">
                                        New
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-500 transition duration-300 group-hover:text-gray-300">
                                        Open
                                    </span>
                                )}
                            </div>

                            <h3 className="mt-4 text-xl font-semibold leading-snug text-white">
                                {tool.label}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-gray-300">
                                {tool.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Spotlight tools</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Fast routes into guided solving, clean interpretation, and class-ready outputs.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {spotlightTools.map((tool) => (
                        <Link
                            key={tool.path}
                            to={tool.path}
                            className="group rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-green-400/20 hover:bg-white/10"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-gray-300">
                                    {tool.category}
                                </span>
                                <span className="text-sm text-gray-500 transition duration-300 group-hover:text-gray-300">
                                    Open
                                </span>
                            </div>

                            <h3 className="mt-4 text-xl font-semibold leading-snug text-white">
                                {tool.label}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-gray-300">
                                {tool.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Browse by category</h2>
                    <p className="mt-1 text-sm text-gray-400">
                        Organized from the shared app catalog so navigation and search stay consistent as the platform grows.
                    </p>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                    {browseGroups.map((group) => (
                        <div
                            key={group.title}
                            className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-300">
                                    {group.title}
                                </p>
                                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-medium text-gray-300">
                                    {group.items.length}
                                </span>
                            </div>

                            <h3 className="mt-3 text-2xl font-semibold text-white">
                                {group.hint}
                            </h3>

                            <div className="mt-5 space-y-2">
                                {group.featuredItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white transition duration-300 hover:border-white/15 hover:bg-white/[0.08]"
                                    >
                                        <span>{item.label}</span>
                                        <span className="text-xs uppercase tracking-[0.18em] text-gray-500">
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
