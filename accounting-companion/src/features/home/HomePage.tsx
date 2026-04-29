import { useMemo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import AppBrandMark from "../../components/AppBrandMark";
import DisclosurePanel from "../../components/DisclosurePanel";
import FeatureSearch from "../../components/FeatureSearch";
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
    type RouteMeta,
} from "../../utils/appCatalog";
import {
    buildCurriculumTrackSnapshots,
    getRouteSurfaceLabel,
    inferRouteSurface,
} from "../../utils/appExperience";
import {
    APP_RELEASE_HIGHLIGHTS,
    APP_VERSION,
} from "../../utils/appRelease";
import { useNetworkStatus } from "../../utils/networkStatus";
import { useOfflineBundleStatus } from "../../utils/offlineStatus";

const PRIMARY_ENTRY_PATHS = ["/smart/solver", "/scan-check", "/workpapers", "/study"];

const DISCOVERY_PATHS = [
    "/business/cvp-analysis",
    "/far/cash-flow-statement-builder",
    "/afar/business-combination-analysis",
    "/audit/audit-planning-workspace",
    "/tax/book-tax-difference-workspace",
    "/ais/business-continuity-planner",
    "/operations/eoq-and-reorder-point",
    "/strategic/business-case-analysis",
];

const WORKFLOW_COLLECTIONS = [
    {
        title: "Solve and verify",
        description: "Move from prompt or scan into the right calculator with less browsing.",
        paths: ["/smart/solver", "/scan-check", "/workpapers"],
    },
    {
        title: "Managerial decisions",
        description: "Keep CVP, relevant costing, and budgeting tools grouped when you need action-oriented work.",
        paths: [
            "/business/cvp-analysis",
            "/business/special-order-analysis",
            "/business/make-or-buy-analysis",
            "/business/cash-budget",
        ],
    },
    {
        title: "FAR and AFAR",
        description: "Open statement, lease, combination, and translation workflows from one lane.",
        paths: [
            "/far/cash-flow-statement-builder",
            "/far/lease-measurement-workspace",
            "/afar/business-combination-analysis",
            "/afar/foreign-currency-translation",
        ],
    },
    {
        title: "Audit and tax",
        description: "Keep planning, book-tax differences, and compliance review support close together.",
        paths: [
            "/audit/audit-planning-workspace",
            "/tax/book-tax-difference-workspace",
            "/tax/percentage-tax",
            "/tax/tax-compliance-review",
        ],
    },
];

function SectionHeading({
    kicker,
    title,
    action,
}: {
    kicker: string;
    title: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex items-end justify-between gap-3">
            <div>
                <p className="app-section-kicker text-[0.68rem]">{kicker}</p>
                <h2 className="app-section-title mt-2">{title}</h2>
            </div>
            {action}
        </div>
    );
}

function RouteCard({
    route,
    availabilityLabel,
    toneLabel,
}: {
    route: RouteMeta;
    availabilityLabel?: string | null;
    toneLabel?: string;
}) {
    const surfaceLabel = getRouteSurfaceLabel(
        inferRouteSurface(route.path, route.label, route.description)
    );
    const metaLine = [toneLabel ?? route.category, surfaceLabel, availabilityLabel]
        .filter(Boolean)
        .join(" · ");

    return (
        <Link
            to={route.path}
            className="app-link-card rounded-[1.1rem] px-4 py-4"
        >
            <p className="app-helper text-[0.72rem] leading-5">{metaLine}</p>
            <h3 className="mt-3 text-[1rem] font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                {route.shortLabel ?? route.label}
            </h3>
            <p className="app-helper mt-1.5 text-xs leading-5">{route.description}</p>
        </Link>
    );
}

export default function HomePage() {
    const activity = useAppActivity();
    const studyProgress = useStudyProgress();
    const network = useNetworkStatus();
    const offlineBundle = useOfflineBundleStatus();
    const pinnedRoutes = getPinnedRoutes(activity);
    const recentRoutes = getRecentRoutes(activity, 4);
    const mostUsedRoutes = getMostUsedRoutes(activity, 4);
    const recommendedRoutes = useMemo(
        () =>
            getRecommendedRoutes(activity, "/")
                .map((route) => getRouteMeta(route.path))
                .filter((route): route is RouteMeta => Boolean(route))
                .slice(0, 6),
        [activity]
    );

    const quickStartRoutes = useMemo(() => {
        if (recentRoutes.length > 0) return recentRoutes;
        if (pinnedRoutes.length > 0) return pinnedRoutes.slice(0, 4);
        return recommendedRoutes.slice(0, 4);
    }, [pinnedRoutes, recentRoutes, recommendedRoutes]);

    const studyTopics = useMemo(
        () =>
            Object.values(studyProgress.topics)
                .sort((left, right) => right.lastViewedAt - left.lastViewedAt)
                .slice(0, 3)
                .map((topic) => ({
                    ...topic,
                    route: getRouteMeta(topic.path),
                })),
        [studyProgress.topics]
    );

    const entryRoutes = useMemo(
        () =>
            PRIMARY_ENTRY_PATHS.map((path) => getRouteMeta(path)).filter(
                (route): route is RouteMeta => Boolean(route)
            ),
        []
    );

    const discoveryRoutes = useMemo(
        () =>
            DISCOVERY_PATHS.map((path) => getRouteMeta(path)).filter(
                (route): route is RouteMeta => Boolean(route)
            ),
        []
    );

    const workflowCollections = useMemo(
        () =>
            WORKFLOW_COLLECTIONS.map((collection) => ({
                ...collection,
                routes: collection.paths
                    .map((path) => APP_ROUTE_META_MAP.get(path))
                    .filter((route): route is RouteMeta => Boolean(route)),
            })),
        []
    );

    const categoryShortcuts = useMemo(
        () =>
            APP_NAV_GROUPS.filter(
                (group) => group.title !== "General" && group.title !== "Smart Tools"
            ).map((group) => ({
                title: group.title,
                hint: group.hint,
                items: group.items.slice(0, 4),
            })),
        []
    );

    const priorityTracks = useMemo(
        () =>
            buildCurriculumTrackSnapshots()
                .filter(
                    (snapshot) =>
                        snapshot.track !== "Study Hub" && snapshot.track !== "Smart Tools"
                )
                .sort(
                    (left, right) =>
                        (left.status === "emerging"
                            ? 0
                            : left.status === "growing"
                              ? 1
                              : 2) -
                            (right.status === "emerging"
                                ? 0
                                : right.status === "growing"
                                  ? 1
                                  : 2) ||
                        left.routeCount - right.routeCount
                )
                .slice(0, 4),
        []
    );

    const unseenFeatures = useMemo(
        () =>
            Array.from(APP_ROUTE_META_MAP.values())
                .filter(
                    (route) =>
                        NEW_FEATURE_PATHS.has(route.path) &&
                        !activity.seenNewPaths.includes(route.path)
                )
                .slice(0, 4),
        [activity.seenNewPaths]
    );

    const homeStats = [
        { label: "Recent tools", value: recentRoutes.length, helper: "Resume faster" },
        { label: "Pinned", value: pinnedRoutes.length, helper: "Your shortcuts" },
        {
            label: "Study topics",
            value: Object.keys(studyProgress.topics).length,
            helper: "Tracked locally",
        },
        { label: "Priority tracks", value: priorityTracks.length, helper: "Need extra depth" },
    ];
    const favoriteRoutes = pinnedRoutes.slice(0, 4);
    const getAvailabilityLabel = (route: RouteMeta) => {
        const availability = getRouteAvailability(route, {
            online: network.online,
            bundleReady: offlineBundle.ready,
            currentPath: "/",
        });

        return availability.support === "full" ? null : availability.label;
    };

    return (
        <div className="app-page-stack">
            <section
                className="app-panel app-hero-panel rounded-[var(--app-radius-xl)] p-5 md:p-6"
                data-onboarding-target="home-hero"
            >
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] xl:items-start">
                    <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                            <AppBrandMark compact />
                            <span className="app-chip-accent rounded-full px-2.5 py-1 text-[0.62rem]">
                                v{APP_VERSION}
                            </span>
                        </div>

                        <h1 className="mt-4 max-w-2xl text-[clamp(1.7rem,1.22rem+1.48vw,2.8rem)] font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                            Start from the next task, not the whole product.
                        </h1>
                        <p className="app-body-md mt-3 max-w-2xl text-sm leading-7 md:text-[0.98rem]">
                            AccCalc now keeps the first decision calm: solve, scan, continue a lesson,
                            or open a workbook. Broader browsing is still here, but it no longer fights
                            the main path for attention.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2.5">
                            <Link
                                to="/smart/solver"
                                className="app-button-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
                                data-onboarding-target="smart-solver-entry"
                            >
                                Quick solve
                            </Link>
                            <Link
                                to="/scan-check"
                                className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
                            >
                                Quick scan
                            </Link>
                            <Link
                                to="/workpapers"
                                className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
                                data-onboarding-target="workpapers-entry"
                            >
                                Workpapers
                            </Link>
                            <Link
                                to="/study"
                                className="app-button-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
                                data-onboarding-target="study-entry"
                            >
                                Continue study
                            </Link>
                            <ShareAppButton />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div data-onboarding-target="home-search" data-onboarding-action="search-opened">
                            <FeatureSearch
                                variant="hero"
                                placeholder="Search only when you already know the tool or topic"
                            />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {homeStats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="app-subtle-surface rounded-[1rem] px-4 py-3.5"
                                >
                                    <p className="app-helper text-[0.68rem] uppercase tracking-[0.14em]">
                                        {stat.label}
                                    </p>
                                    <p className="mt-2 text-lg font-semibold text-[color:var(--app-text)]">
                                        {stat.value}
                                    </p>
                                    <p className="app-helper mt-1 text-xs">{stat.helper}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
                <div className="app-panel rounded-[var(--app-radius-xl)] p-5 md:p-6">
                    <SectionHeading
                        kicker="Open now"
                        title="Best next surfaces"
                        action={
                            <Link to="/smart/solver" className="app-link-accent text-sm font-medium">
                                Need routing help
                            </Link>
                        }
                    />
                    <p className="app-helper mt-2 text-sm leading-6">
                        These are the strongest next destinations based on your recent activity and
                        the most common first jobs inside the app.
                    </p>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {quickStartRoutes.map((route) => (
                            <RouteCard
                                key={route.path}
                                route={route}
                                availabilityLabel={getAvailabilityLabel(route)}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="app-panel rounded-[var(--app-radius-xl)] p-5 md:p-6">
                        <SectionHeading
                            kicker="Continue"
                            title="Pick up where you left off"
                            action={
                                <Link to="/study" className="app-link-accent text-sm font-medium">
                                    Open Study Hub
                                </Link>
                            }
                        />

                        {studyTopics.length > 0 ? (
                            <div className="mt-4 space-y-3">
                                {studyTopics.map((topic) => (
                                    <Link
                                        key={topic.id}
                                        to={topic.path}
                                        className="app-list-link rounded-[1rem] px-4 py-3.5"
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
                                            {topic.route?.description ??
                                                "Continue the lesson where you last stopped."}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-4 app-subtle-surface rounded-[1rem] px-4 py-4">
                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                    No current study session yet
                                </p>
                                <p className="app-helper mt-2 text-sm leading-6">
                                    Open Study Hub when you want a textbook-style reading flow first.
                                </p>
                                <Link
                                    to="/study"
                                    className="app-button-secondary mt-3 inline-flex rounded-xl px-4 py-2.5 text-sm font-semibold"
                                >
                                    Start a lesson
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="app-panel rounded-[var(--app-radius-xl)] p-5 md:p-6">
                        <SectionHeading kicker="Favorites" title="Pinned and frequent tools" />

                        {favoriteRoutes.length > 0 ? (
                            <div className="mt-4 grid gap-2">
                                {favoriteRoutes.map((route) => (
                                    <Link
                                        key={route.path}
                                        to={route.path}
                                        className="app-list-link rounded-[1rem] px-4 py-3"
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
                        ) : (
                            <div className="mt-4 app-subtle-surface rounded-[1rem] px-4 py-4">
                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                    No pinned tools yet
                                </p>
                                <p className="app-helper mt-2 text-sm leading-6">
                                    Pin a calculator or workspace from its page header to keep it
                                    closer to the launchpad.
                                </p>
                            </div>
                        )}

                        {mostUsedRoutes.length > 0 ? (
                            <div className="mt-4">
                                <p className="app-section-kicker text-[0.68rem]">Frequent here</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {mostUsedRoutes.map((route) => (
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
                        ) : null}
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <SectionHeading kicker="Primary surfaces" title="Start from the surface that matches the job" />
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {entryRoutes.map((route) => (
                        <RouteCard
                            key={route.path}
                            route={route}
                            availabilityLabel={getAvailabilityLabel(route)}
                        />
                    ))}
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
                <div className="app-panel rounded-[var(--app-radius-xl)] p-5 md:p-6">
                    <SectionHeading kicker="Focused lanes" title="Common paths through the product" />
                    <div className="mt-4 grid gap-3">
                        {workflowCollections.map((collection) => (
                            <div key={collection.title} className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                    {collection.title}
                                </p>
                                <p className="app-helper mt-1.5 text-xs leading-5">
                                    {collection.description}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
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
                </div>

                <div className="app-panel rounded-[var(--app-radius-xl)] p-5 md:p-6">
                    <SectionHeading kicker="Priority coverage" title="Tracks that still need the most linked use" />
                    <div className="mt-4 grid gap-3">
                        {priorityTracks.map((snapshot) => (
                            <div key={snapshot.track} className="app-subtle-surface rounded-[1rem] px-4 py-3.5">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                        {snapshot.track}
                                    </p>
                                    <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                                        {snapshot.calculatorCount} calc
                                    </span>
                                </div>
                                <p className="app-helper mt-2 text-xs leading-5">
                                    {snapshot.lessonCount} lessons, {snapshot.workspaceCount} workspaces,
                                    {" "}
                                    {snapshot.routeCount} linked routes in this lane.
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {snapshot.highlightPaths.map((path) => {
                                        const route = APP_ROUTE_META_MAP.get(path);
                                        if (!route) return null;
                                        return (
                                            <Link
                                                key={route.path}
                                                to={route.path}
                                                className="app-list-link rounded-full px-3 py-1.5 text-sm font-medium"
                                            >
                                                {route.shortLabel ?? route.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <DisclosurePanel
                title="Browse the wider app only when you need it"
                summary="Curriculum groups, deeper discovery, new routes, and release-level detail stay available here instead of crowding the first screen."
                badge="Discover later"
            >
                <div className="grid gap-5 xl:grid-cols-2">
                    <div className="space-y-5">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                Browse by curriculum
                            </p>
                            <div className="grid gap-4 xl:grid-cols-2">
                                {categoryShortcuts.map((group) => (
                                    <div key={group.title} className="space-y-2">
                                        <div>
                                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                                {group.title}
                                            </p>
                                            <p className="app-helper mt-1 text-xs leading-5">
                                                {group.hint}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {group.items.map((item) => (
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
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                Intentional discovery
                            </p>
                            <div className="grid gap-3 md:grid-cols-2">
                                {discoveryRoutes.map((route) => (
                                    <RouteCard
                                        key={route.path}
                                        route={route}
                                        availabilityLabel={getAvailabilityLabel(route)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {unseenFeatures.length > 0 ? (
                            <div className="space-y-2">
                                <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                    New and still unseen
                                </p>
                                <div className="grid gap-2">
                                    {unseenFeatures.map((route) => (
                                        <Link
                                            key={route.path}
                                            to={route.path}
                                            className="app-list-link rounded-[1rem] px-4 py-3"
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

                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                Release highlights
                            </p>
                            <div className="grid gap-2">
                                {APP_RELEASE_HIGHLIGHTS.map((highlight) => (
                                    <div
                                        key={highlight.title}
                                        className="app-subtle-surface rounded-[1rem] px-4 py-3"
                                    >
                                        <p className="text-sm font-semibold text-[color:var(--app-text)]">
                                            {highlight.title}
                                        </p>
                                        <p className="app-helper mt-1 text-xs leading-5">
                                            {highlight.body}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </DisclosurePanel>
        </div>
    );
}
