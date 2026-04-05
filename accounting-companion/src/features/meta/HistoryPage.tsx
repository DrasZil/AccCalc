import { Link, useLocation } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import SectionCard from "../../components/SectionCard";
import {
    formatRelativeTime,
    getPinnedRoutes,
    getRecommendedRoutes,
    useAppActivity,
} from "../../utils/appActivity";
import { APP_VERSION } from "../../utils/appRelease";

export default function HistoryPage() {
    const location = useLocation();
    const activity = useAppActivity();
    const recommendations = getRecommendedRoutes(activity, location.pathname);
    const pinnedRoutes = getPinnedRoutes(activity);

    return (
        <div className="app-page-stack">
            <PageHeader
                badge="History"
                title="Saved activity and resumed workflows"
                description="Offline history now tracks recent routes, saved Smart Solver prompts, pinned tools, and recommendation signals on this device."
                meta={<span className="app-chip rounded-full px-3 py-1 text-xs">v{APP_VERSION}</span>}
            />

            <section className="grid gap-3 md:grid-cols-4">
                {[
                    { label: "App launches", value: activity.launches },
                    { label: "Saved prompts", value: activity.savedRecords.length },
                    { label: "Visited tools", value: Object.keys(activity.toolUsage).length },
                    { label: "Pinned tools", value: pinnedRoutes.length },
                ].map((item) => (
                    <SectionCard key={item.label}>
                        <p className="app-helper text-xs">{item.label}</p>
                        <p className="mt-2 text-3xl font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                            {item.value}
                        </p>
                    </SectionCard>
                ))}
            </section>

            {pinnedRoutes.length > 0 ? (
                <SectionCard>
                    <h2 className="app-section-title text-xl">Pinned tools</h2>
                    <p className="app-body-md mt-2 text-sm">
                        Keep frequently used calculators in reach across the sidebar and homepage.
                    </p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {pinnedRoutes.map((route) => (
                            <Link
                                key={route.path}
                                to={route.path}
                                className="app-link-card rounded-[1.3rem] p-4"
                            >
                                <p className="app-chip-accent inline-flex rounded-full px-3 py-1 text-xs">
                                    Pinned
                                </p>
                                <h3 className="mt-3 text-lg font-semibold text-[color:var(--app-text)]">
                                    {route.label}
                                </h3>
                                <p className="app-body-md mt-2 text-sm">{route.description}</p>
                            </Link>
                        ))}
                    </div>
                </SectionCard>
            ) : null}

            <SectionCard>
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="app-section-title text-xl">Recommended next</h2>
                        <p className="app-body-md mt-2 text-sm">
                            Recommendations combine your recent activity, pinned tools, and category habits.
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {recommendations.map((route) => (
                        <Link
                            key={route.path}
                            to={route.path}
                            className="app-link-card rounded-[1.3rem] p-4"
                        >
                            <p className="app-chip rounded-full px-3 py-1 text-xs">{route.category}</p>
                            <h3 className="mt-3 text-base font-semibold text-[color:var(--app-text)]">
                                {route.label}
                            </h3>
                            <p className="app-body-md mt-2 text-sm">{route.description}</p>
                        </Link>
                    ))}
                </div>
            </SectionCard>

            <SectionCard>
                <h2 className="app-section-title text-xl">Recent activity</h2>
                {activity.recent.length > 0 ? (
                    <div className="mt-4 space-y-3">
                        {activity.recent.map((entry) => (
                            <Link
                                key={entry.id}
                                to={entry.path}
                                className="app-list-link flex flex-col gap-3 rounded-[1.3rem] px-4 py-4 md:flex-row md:items-center md:justify-between"
                            >
                                <div className="min-w-0">
                                    <p className="app-helper text-xs uppercase tracking-[0.14em]">
                                        {entry.category}
                                    </p>
                                    <h3 className="mt-2 text-base font-semibold text-[color:var(--app-text)]">
                                        {entry.title}
                                    </h3>
                                    <p className="app-body-md mt-1 text-sm">{entry.summary}</p>
                                </div>
                                <div className="shrink-0 text-sm text-[color:var(--app-text-muted)]">
                                    {formatRelativeTime(entry.at)}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="app-body-md mt-4 text-sm">
                        Your activity trail will appear here after you open tools, save prompts, or return to calculators.
                    </p>
                )}
            </SectionCard>

            <SectionCard>
                <h2 className="app-section-title text-xl">Saved prompts and results</h2>
                {activity.savedRecords.length > 0 ? (
                    <div className="mt-4 space-y-3">
                        {activity.savedRecords.map((record) => (
                            <Link
                                key={record.id}
                                to={record.path}
                                className="app-list-link block rounded-[1.3rem] px-4 py-4"
                            >
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div className="min-w-0">
                                        <p className="app-helper text-xs uppercase tracking-[0.14em]">
                                            {record.category}
                                        </p>
                                        <h3 className="mt-2 text-base font-semibold text-[color:var(--app-text)]">
                                            {record.title}
                                        </h3>
                                        <p className="app-body-md mt-2 text-sm">{record.input}</p>
                                        {record.result ? (
                                            <p className="mt-2 text-sm font-medium text-[color:var(--app-text)]">
                                                Result: {record.result}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className="shrink-0 text-sm text-[color:var(--app-text-muted)]">
                                        {formatRelativeTime(record.at)}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="app-body-md mt-4 text-sm">
                        Saved Smart Solver prompts and calculator outputs will appear here after you use them.
                    </p>
                )}
            </SectionCard>
        </div>
    );
}
