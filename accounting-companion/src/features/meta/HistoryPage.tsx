import { useMemo, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import DisclosurePanel from "../../components/DisclosurePanel";
import InputCard from "../../components/INputCard";
import PageHeader from "../../components/PageHeader";
import SectionCard from "../../components/SectionCard";
import {
    formatRelativeTime,
    getMostUsedRoutes,
    getPinnedRoutes,
    getRecommendedRoutes,
    useAppActivity,
    type ActivityEntry,
    type SavedToolRecord,
} from "../../utils/appActivity";
import { APP_VERSION } from "../../utils/appRelease";

type HistoryFilter = "all" | "recent" | "saved" | "pinned";

function groupByTime<T extends { at: number }>(items: T[]) {
    const now = Date.now();
    const dayMs = 1000 * 60 * 60 * 24;

    return [
        {
            label: "Today",
            items: items.filter((item) => now - item.at < dayMs),
        },
        {
            label: "Last 7 days",
            items: items.filter((item) => now - item.at >= dayMs && now - item.at < dayMs * 7),
        },
        {
            label: "Older",
            items: items.filter((item) => now - item.at >= dayMs * 7),
        },
    ].filter((group) => group.items.length > 0);
}

function matchesQuery(
    query: string,
    values: Array<string | undefined>
) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return true;
    return values.some((value) => value?.toLowerCase().includes(normalized));
}

function EntryCard({
    title,
    subtitle,
    summary,
    timestamp,
    to,
    extra,
}: {
    title: string;
    subtitle: string;
    summary: string;
    timestamp: number;
    to: string;
    extra?: string;
}) {
    return (
        <Link
            to={to}
            className="app-list-link block rounded-[1.05rem] px-4 py-3.5"
        >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                    <p className="app-helper text-xs uppercase tracking-[0.14em]">{subtitle}</p>
                    <h3 className="mt-1.5 text-sm font-semibold text-[color:var(--app-text)]">
                        {title}
                    </h3>
                    <p className="app-body-md mt-1.5 text-sm">{summary}</p>
                    {extra ? (
                        <p className="mt-2 text-sm font-medium text-[color:var(--app-text)]">
                            {extra}
                        </p>
                    ) : null}
                </div>
                <div className="shrink-0 text-xs text-[color:var(--app-text-muted)]">
                    {formatRelativeTime(timestamp)}
                </div>
            </div>
        </Link>
    );
}

function ActivityGroup({
    title,
    items,
    renderItem,
}: {
    title: string;
    items: Array<ActivityEntry | SavedToolRecord>;
    renderItem: (item: ActivityEntry | SavedToolRecord) => ReactNode;
}) {
    return (
        <DisclosurePanel
            title={title}
            summary={`${items.length} record${items.length === 1 ? "" : "s"}`}
            badge="History"
            compact
            defaultOpen={title === "Today"}
        >
            <div className="space-y-3">
                {items.map((item) => renderItem(item))}
            </div>
        </DisclosurePanel>
    );
}

export default function HistoryPage() {
    const location = useLocation();
    const activity = useAppActivity();
    const [filter, setFilter] = useState<HistoryFilter>("all");
    const [query, setQuery] = useState("");
    const recommendations = getRecommendedRoutes(activity, location.pathname);
    const pinnedRoutes = getPinnedRoutes(activity);
    const mostUsedRoutes = getMostUsedRoutes(activity);

    const filteredRecent = useMemo(
        () =>
            activity.recent.filter((entry) =>
                matchesQuery(query, [entry.title, entry.category, entry.summary])
            ),
        [activity.recent, query]
    );

    const filteredSaved = useMemo(
        () =>
            activity.savedRecords.filter((record) =>
                matchesQuery(query, [
                    record.title,
                    record.category,
                    record.input,
                    record.result,
                ])
            ),
        [activity.savedRecords, query]
    );

    const recentGroups = useMemo(() => groupByTime(filteredRecent), [filteredRecent]);
    const savedGroups = useMemo(() => groupByTime(filteredSaved), [filteredSaved]);

    return (
        <div className="app-page-stack">
            <PageHeader
                badge="History"
                title="Recent work and saved results"
                description="Browse pinned tools, recent routes, and saved solver or calculator records without wading through one long wall of entries."
                meta={<span className="app-chip rounded-full px-3 py-1 text-xs">v{APP_VERSION}</span>}
            />

            <section className="grid gap-3 md:grid-cols-4">
                {[
                    { label: "App launches", value: activity.launches },
                    { label: "Saved records", value: activity.savedRecords.length },
                    { label: "Visited tools", value: Object.keys(activity.toolUsage).length },
                    { label: "Pinned tools", value: pinnedRoutes.length },
                ].map((item) => (
                    <SectionCard key={item.label}>
                        <p className="app-helper text-xs">{item.label}</p>
                        <p className="mt-2 text-2xl font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)] md:text-3xl">
                            {item.value}
                        </p>
                    </SectionCard>
                ))}
            </section>

            <SectionCard>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="app-section-kicker">Browse</p>
                        <h2 className="app-section-title mt-2 text-lg">Find a record faster</h2>
                    </div>
                    <div className="w-full max-w-sm">
                        <InputCard
                            label="Search history"
                            type="text"
                            inputMode="search"
                            value={query}
                            onChange={setQuery}
                            placeholder="Search tool, category, prompt, or result"
                        />
                    </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {[
                        { key: "all", label: "All" },
                        { key: "recent", label: "Recent" },
                        { key: "saved", label: "Saved" },
                        { key: "pinned", label: "Pinned" },
                    ].map((option) => (
                        <button
                            key={option.key}
                            type="button"
                            onClick={() => setFilter(option.key as HistoryFilter)}
                            className={[
                                "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                                filter === option.key
                                    ? "app-button-primary"
                                    : "app-button-ghost",
                            ].join(" ")}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </SectionCard>

            {(filter === "all" || filter === "pinned") && pinnedRoutes.length > 0 ? (
                <DisclosurePanel
                    title="Pinned tools"
                    summary="Keep frequently used calculators within reach."
                    badge={String(pinnedRoutes.length)}
                    defaultOpen
                >
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {pinnedRoutes.map((route) => (
                            <Link
                                key={route.path}
                                to={route.path}
                                className="app-link-card rounded-[1.15rem] px-4 py-3.5"
                            >
                                <p className="app-chip-accent inline-flex rounded-full px-2.5 py-1 text-[0.62rem]">
                                    Pinned
                                </p>
                                <h3 className="mt-3 text-base font-semibold text-[color:var(--app-text)]">
                                    {route.shortLabel ?? route.label}
                                </h3>
                                <p className="app-body-md mt-1.5 text-sm">{route.description}</p>
                            </Link>
                        ))}
                    </div>
                </DisclosurePanel>
            ) : null}

            {(filter === "all" || filter === "recent") ? (
                recentGroups.length > 0 ? (
                    <section className="space-y-3">
                        <div className="px-1">
                            <p className="app-section-kicker">Recent</p>
                        </div>
                        {recentGroups.map((group) => (
                            <ActivityGroup
                                key={group.label}
                                title={group.label}
                                items={group.items}
                                renderItem={(item) => {
                                    const entry = item as ActivityEntry;
                                    return (
                                        <EntryCard
                                            key={entry.id}
                                            title={entry.title}
                                            subtitle={entry.category}
                                            summary={entry.summary}
                                            timestamp={entry.at}
                                            to={entry.path}
                                        />
                                    );
                                }}
                            />
                        ))}
                    </section>
                ) : (
                    <SectionCard>
                        <p className="app-body-md text-sm">
                            No recent records match your current search.
                        </p>
                    </SectionCard>
                )
            ) : null}

            {(filter === "all" || filter === "saved") ? (
                savedGroups.length > 0 ? (
                    <section className="space-y-3">
                        <div className="px-1">
                            <p className="app-section-kicker">Saved</p>
                        </div>
                        {savedGroups.map((group) => (
                            <ActivityGroup
                                key={group.label}
                                title={group.label}
                                items={group.items}
                                renderItem={(item) => {
                                    const record = item as SavedToolRecord;
                                    return (
                                        <EntryCard
                                            key={record.id}
                                            title={record.title}
                                            subtitle={record.category}
                                            summary={record.input}
                                            timestamp={record.at}
                                            to={record.path}
                                            extra={
                                                record.result
                                                    ? `Result: ${record.result}`
                                                    : undefined
                                            }
                                        />
                                    );
                                }}
                            />
                        ))}
                    </section>
                ) : (
                    <SectionCard>
                        <p className="app-body-md text-sm">
                            No saved prompts or results match your current search.
                        </p>
                    </SectionCard>
                )
            ) : null}

            <DisclosurePanel
                title="Most used and recommended"
                summary="Compact shortcuts based on what you use most and what fits next."
                badge="Suggested"
            >
                <div className="grid gap-4 xl:grid-cols-2">
                    <div className="space-y-3">
                        <p className="app-label text-[0.66rem]">Most used</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {mostUsedRoutes.map((route) => (
                                <Link
                                    key={route.path}
                                    to={route.path}
                                    className="app-link-card rounded-[1rem] px-4 py-3"
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

                    <div className="space-y-3">
                        <p className="app-label text-[0.66rem]">Recommended next</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {recommendations.map((route) => (
                                <Link
                                    key={route.path}
                                    to={route.path}
                                    className="app-link-card rounded-[1rem] px-4 py-3"
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
                </div>
            </DisclosurePanel>
        </div>
    );
}
