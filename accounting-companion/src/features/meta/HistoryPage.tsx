import { Link, useLocation } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SectionCard from "../../components/SectionCard";
import {
    formatRelativeTime,
    getRecommendedRoutes,
    useAppActivity,
} from "../../utils/appActivity";

export default function HistoryPage() {
    const location = useLocation();
    const activity = useAppActivity();
    const recommendations = getRecommendedRoutes(activity, location.pathname);

    return (
        <div className="space-y-6">
            <PageHeader
                badge="History"
                title="Saved Activity"
                description="Recent routes, saved prompts, calculator memory trails, and recommended tools are stored offline on this device when history is enabled."
            />

            <section className="grid gap-4 md:grid-cols-3">
                <SectionCard>
                    <p className="text-sm text-gray-400">App launches</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{activity.launches}</p>
                </SectionCard>
                <SectionCard>
                    <p className="text-sm text-gray-400">Saved records</p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                        {activity.savedRecords.length}
                    </p>
                </SectionCard>
                <SectionCard>
                    <p className="text-sm text-gray-400">Visited tools</p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                        {Object.keys(activity.toolUsage).length}
                    </p>
                </SectionCard>
            </section>

            <SectionCard>
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Recommended next</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-400">
                            Based on your recent activity, category usage, and the tools you open most often.
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {recommendations.map((route) => (
                        <Link
                            key={route.path}
                            to={route.path}
                            className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-white/15 hover:bg-white/[0.06]"
                        >
                            <p className="text-xs uppercase tracking-[0.18em] text-green-300">
                                {route.category}
                            </p>
                            <h3 className="mt-3 text-base font-semibold text-white">
                                {route.label}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-gray-400">
                                {route.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </SectionCard>

            <SectionCard>
                <h2 className="text-lg font-semibold text-white">Recent activity</h2>

                {activity.recent.length > 0 ? (
                    <div className="mt-4 space-y-3">
                        {activity.recent.map((entry) => (
                            <Link
                                key={entry.id}
                                to={entry.path}
                                className="flex flex-col gap-3 rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-4 transition duration-300 hover:border-white/15 hover:bg-white/[0.06] md:flex-row md:items-center md:justify-between"
                            >
                                <div className="min-w-0">
                                    <p className="text-xs uppercase tracking-[0.18em] text-green-300">
                                        {entry.category}
                                    </p>
                                    <h3 className="mt-2 text-base font-semibold text-white">
                                        {entry.title}
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-gray-400">
                                        {entry.summary}
                                    </p>
                                </div>

                                <div className="shrink-0 text-sm text-gray-500">
                                    {formatRelativeTime(entry.at)}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="mt-4 text-sm leading-6 text-gray-400">
                        Your activity trail will appear here once you start opening tools and saving prompts.
                    </p>
                )}
            </SectionCard>

            <SectionCard>
                <h2 className="text-lg font-semibold text-white">Saved prompts and results</h2>

                {activity.savedRecords.length > 0 ? (
                    <div className="mt-4 space-y-3">
                        {activity.savedRecords.map((record) => (
                            <Link
                                key={record.id}
                                to={record.path}
                                className="block rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-4 transition duration-300 hover:border-white/15 hover:bg-white/[0.06]"
                            >
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div className="min-w-0">
                                        <p className="text-xs uppercase tracking-[0.18em] text-green-300">
                                            {record.category}
                                        </p>
                                        <h3 className="mt-2 text-base font-semibold text-white">
                                            {record.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-gray-300">
                                            {record.input}
                                        </p>
                                        {record.result ? (
                                            <p className="mt-2 text-sm font-medium text-white">
                                                Result: {record.result}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="shrink-0 text-sm text-gray-500">
                                        {formatRelativeTime(record.at)}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="mt-4 text-sm leading-6 text-gray-400">
                        Saved Smart Solver prompts and calculator outputs will appear here after use.
                    </p>
                )}
            </SectionCard>
        </div>
    );
}
