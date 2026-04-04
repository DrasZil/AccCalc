import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getRecommendedRoutes, useAppActivity } from "../../utils/appActivity";
import { APP_ROUTE_META, NEW_FEATURE_PATHS } from "../../utils/appCatalog";
import { useAppSettings } from "../../utils/appSettings";

const spotlightTools = [
    {
        title: "Smart Solver",
        description: "Describe a problem naturally and get matched with the right calculator plus dynamic inputs.",
        path: "/smart/solver",
        category: "Smart Tools",
    },
    {
        title: "Basic Calculator",
        description: "Open the upgraded calculator pad with memory, keyboard support, and proper expression handling.",
        path: "/basic",
        category: "Core",
    },
    {
        title: "Vertical Analysis",
        description: "Translate statement items into common-size percentages for classroom or reporting work.",
        path: "/accounting/vertical-analysis",
        category: "Accounting",
    },
    {
        title: "History",
        description: "Return to saved prompts, prior routes, and recommendations that persist on this device.",
        path: "/history",
        category: "General",
    },
];

const categoryDecks = [
    {
        title: "Finance",
        description: "Time value, annuities, rates, and loan work.",
        links: [
            { label: "Simple Interest", path: "/finance/simple-interest" },
            { label: "Loan Amortization", path: "/finance/loan-amortization" },
            { label: "Effective Interest Rate", path: "/finance/effective-interest-rate" },
            { label: "Sinking Fund Deposit", path: "/finance/sinking-fund-deposit" },
        ],
    },
    {
        title: "Business",
        description: "CVP analysis, margins, and operating performance.",
        links: [
            { label: "Break-even Point", path: "/business/break-even" },
            { label: "Margin of Safety", path: "/business/margin-of-safety" },
            { label: "Net Profit Margin", path: "/business/net-profit-margin" },
            { label: "Operating Leverage", path: "/business/operating-leverage" },
        ],
    },
    {
        title: "Accounting",
        description: "Core accounting procedures, partnerships, cost accounting, and statement analysis.",
        links: [
            { label: "Gross Profit Rate", path: "/accounting/gross-profit-rate" },
            { label: "Cash Ratio", path: "/accounting/cash-ratio" },
            { label: "Trade Discount", path: "/accounting/trade-discount" },
            { label: "Partnership Salary & Interest", path: "/accounting/partnership-salary-interest" },
            { label: "Prime & Conversion Cost", path: "/accounting/prime-conversion-cost" },
            { label: "Materials Price Variance", path: "/accounting/materials-price-variance" },
            { label: "Labor Rate Variance", path: "/accounting/labor-rate-variance" },
            { label: "Partnership Admission Bonus", path: "/accounting/partnership-admission-bonus" },
            { label: "Book Value Per Share", path: "/accounting/book-value-per-share" },
        ],
    },
];

export default function HomePage() {
    const activity = useAppActivity();
    const settings = useAppSettings();
    const [showWhatsNew, setShowWhatsNew] = useState(true);
    const recommended = getRecommendedRoutes(activity, "/");
    const savedPromptCount = activity.savedRecords.length;
    const activeToolCount = Object.keys(activity.toolUsage).length;
    const unseenFeatures = useMemo(
        () =>
            APP_ROUTE_META.filter(
                (route) =>
                    NEW_FEATURE_PATHS.has(route.path) &&
                    !activity.seenNewPaths.includes(route.path)
            ),
        [activity.seenNewPaths]
    );

    return (
        <div className="space-y-8 md:space-y-10">
            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(88,196,135,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.22)] md:p-10">
                <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
                    <div className="max-w-3xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-300">
                            Smart Accounting Toolkit
                        </p>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl xl:text-6xl">
                            Premium accounting tools for study, drills, and practical work.
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
                            AccCalc is built for Philippine students, reviewees, and working users who need reliable formulas, cleaner interfaces, stronger explanations, and offline-friendly access across finance, business, and accounting topics.
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
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                        <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                            <p className="text-sm text-gray-400">Saved offline</p>
                            <p className="mt-2 text-lg font-semibold">
                                {settings.saveOfflineHistory ? "History enabled" : "History disabled"}
                            </p>
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
                                    {unseenFeatures.length} new update{unseenFeatures.length > 1 ? "s" : ""} waiting for you.
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
                            <p className="text-sm font-medium text-white">Students and reviewees</p>
                            <p className="mt-2 text-sm leading-6 text-gray-400">
                                Use formulas, term explanations, and interpretations to study faster and check answers with context.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-sm font-medium text-white">Professionals and staff</p>
                            <p className="mt-2 text-sm leading-6 text-gray-400">
                                Open a focused tool directly or let Smart Solver route plain-language requests into the correct calculator.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-sm font-medium text-white">Installed app users</p>
                            <p className="mt-2 text-sm leading-6 text-gray-400">
                                Use the PWA for faster relaunches, offline-friendly access, update notices, and saved activity on the device.
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
                        Fast routes into guided solving, proper computation, and saved progress.
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
                                {tool.title}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-gray-300">
                                {tool.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-3">
                {categoryDecks.map((deck) => (
                    <div
                        key={deck.title}
                        className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-300">
                            {deck.title}
                        </p>
                        <h3 className="mt-3 text-2xl font-semibold text-white">
                            {deck.description}
                        </h3>

                        <div className="mt-5 space-y-2">
                            {deck.links.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white transition duration-300 hover:border-white/15 hover:bg-white/[0.08]"
                                >
                                    <span>{link.label}</span>
                                    <span className="text-xs uppercase tracking-[0.18em] text-gray-500">
                                        {NEW_FEATURE_PATHS.has(link.path) ? "New" : "Open"}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
