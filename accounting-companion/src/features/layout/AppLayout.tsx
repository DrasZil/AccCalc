import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type MouseEvent as ReactMouseEvent,
    type ReactNode,
} from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import AppUpdatePrompt from "../../components/AppUpdatePrompt";
import AppBrandMark from "../../components/AppBrandMark";
import DonationPromptCard from "../../components/DonationPromptCard";
import FeatureSearch from "../../components/FeatureSearch";
import FloatingPromptDock from "../../components/FloatingPromptDock";
import InstallPrompt from "../../components/InstallPrompt";
import ReturnToTopButton from "../../components/ReturnToTopButton";
import ShareAppButton from "../../components/ShareAppButton";
import ViewportPortal from "../../components/ViewportPortal";
import OnboardingCoach from "../onboarding/OnboardingCoach";
import { emitOnboardingAction } from "../onboarding/onboardingEvents";
import { useOnboardingState } from "../onboarding/onboardingState";
import {
    getMostUsedRoutes,
    getPinnedRoutes,
    getRecentRoutes,
    markPathSeen,
    noteFeedbackReminderShown,
    recordAppLaunch,
    recordToolVisit,
    shouldShowFeedbackReminder,
    useAppActivity,
} from "../../utils/appActivity";
import {
    APP_NAV_GROUPS,
    NEW_FEATURE_PATHS,
    getRouteAvailability,
    getRouteMeta,
    type AppNavGroupTitle,
} from "../../utils/appCatalog";
import { checkForAppUpdates, useAppUpdateState } from "../../utils/appUpdate";
import { APP_VERSION } from "../../utils/appRelease";
import { updateAppSettings, useAppSettings } from "../../utils/appSettings";
import {
    buildCurriculumTrackSnapshots,
    getRouteSurfaceLabel,
    getSuggestedSiblingRoutes,
    inferRouteSurface,
} from "../../utils/appExperience";
import { useInstallExperience } from "../../utils/installExperience";
import { useNetworkStatus } from "../../utils/networkStatus";
import { clearDeploymentMismatch, useOfflineBundleStatus } from "../../utils/offlineStatus";
import { getThemeMetaColor, resolveThemeMode } from "../../utils/themePreferences";
import {
    buildStudyTopicPath,
    getStudyTopicsForRoute,
} from "../study/studyContent";
import SettingsDrawer, { SettingsPanelBody } from "../meta/SettingsDrawer";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import { useAppNotifications } from "./AppNotifications";
import {
    FeedbackReminder,
    LaunchScreen,
    NewBadge,
    ShellIcon,
} from "./ShellChrome";

type OpenGroupsState = Record<AppNavGroupTitle, boolean>;

const DEFAULT_OPEN_GROUPS: OpenGroupsState = {
    General: false,
    "Smart Tools": true,
    "Study Hub": true,
    FAR: false,
    AFAR: false,
    "Cost & Managerial": false,
    "Audit & Assurance": false,
    Taxation: false,
    "RFBT & Law": false,
    "AIS & IT Controls": false,
    "Operations & Supply Chain": false,
    "Governance & Ethics": false,
    "Strategic & Integrative": false,
    "Finance / Econ / Math": false,
};

const ROUTE_DRAFT_STORAGE_PREFIX = "accalc-route-draft";
const SUPPORT_PROMPT_STORAGE_KEY = "accalc-support-prompt";

function isPathActive(currentPath: string, itemPath: string) {
    if (itemPath === "/") return currentPath === "/";
    return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
}

function getDraftStorageKey(pathname: string) {
    return `${ROUTE_DRAFT_STORAGE_PREFIX}:${pathname}`;
}

function readSupportPromptPreference() {
    if (typeof window === "undefined") {
        return {
            dismissedUntil: 0,
            dismissedForever: false,
        };
    }

    try {
        const raw = window.localStorage.getItem(SUPPORT_PROMPT_STORAGE_KEY);
        if (!raw) {
            return {
                dismissedUntil: 0,
                dismissedForever: false,
            };
        }

        const parsed = JSON.parse(raw) as {
            dismissedUntil?: number;
            dismissedForever?: boolean;
        };

        return {
            dismissedUntil:
                typeof parsed.dismissedUntil === "number" ? parsed.dismissedUntil : 0,
            dismissedForever: parsed.dismissedForever ?? false,
        };
    } catch {
        return {
            dismissedUntil: 0,
            dismissedForever: false,
        };
    }
}

function writeSupportPromptPreference(nextValue: {
    dismissedUntil: number;
    dismissedForever: boolean;
}) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SUPPORT_PROMPT_STORAGE_KEY, JSON.stringify(nextValue));
}

function getNavLabel(route: { label: string; shortLabel?: string }) {
    return route.shortLabel ?? route.label;
}

function getGroupDisplayLabel(groupTitle: AppNavGroupTitle) {
    if (groupTitle === "Smart Tools") return "Smart";
    if (groupTitle === "Study Hub") return "Study";
    if (groupTitle === "Cost & Managerial") return "Cost & Mgmt";
    if (groupTitle === "Audit & Assurance") return "Audit";
    if (groupTitle === "RFBT & Law") return "Law";
    if (groupTitle === "AIS & IT Controls") return "AIS & IT";
    if (groupTitle === "Operations & Supply Chain") return "Operations";
    if (groupTitle === "Governance & Ethics") return "Governance";
    if (groupTitle === "Strategic & Integrative") return "Strategic";
    if (groupTitle === "Finance / Econ / Math") return "Fin / Econ / Math";
    return groupTitle;
}

function normalizeRuntimeIssue(reason: unknown) {
    const rawMessage =
        typeof reason === "string"
            ? reason
            : reason instanceof Error
              ? reason.message
              : typeof reason === "object" && reason && "message" in reason
                ? String((reason as { message?: unknown }).message ?? "")
                : "";
    const message = rawMessage.trim();

    if (!message) {
        return null;
    }

    if (
        /ResizeObserver loop limit exceeded/i.test(message) ||
        /script error\.?/i.test(message)
    ) {
        return null;
    }

    if (
        /dynamically imported module|Failed to fetch dynamically imported module|importing a module script failed/i.test(
            message
        )
    ) {
        return {
            title: "Refresh recommended",
            message:
                "This tab hit a stale route-file mismatch after a deploy. Refresh to reconnect the current shell with the latest chunk set.",
            tone: "warning" as const,
            dedupeKey: "runtime:deployment-mismatch",
            handled: true,
        };
    }

    if (
        /notification/i.test(message) &&
        /secure context|permission|denied|unsupported/i.test(message)
    ) {
        return {
            title: "Notifications limited",
            message:
                "Browser-level reminders are unavailable in this session, so AccCalc will keep using in-app notices without raising a false error state.",
            tone: "info" as const,
            dedupeKey: "runtime:notification-limited",
            handled: true,
        };
    }

    if (/service worker/i.test(message) && /register|registration|update/i.test(message)) {
        return {
            title: "Offline features limited",
            message:
                "Background update checks are unavailable in this browser session, but the main app can still keep running normally.",
            tone: "info" as const,
            dedupeKey: "runtime:service-worker-limited",
            handled: true,
        };
    }

    return {
        title: "Unexpected issue",
        message,
        tone: "warning" as const,
        dedupeKey: `runtime:${message}`,
        handled: false,
    };
}

function prefersWidePageShell(pathname: string) {
    return (
        pathname === "/" ||
        pathname === "/scan-check" ||
        pathname === "/history" ||
        pathname === "/workpapers" ||
        pathname === "/basic" ||
        pathname.startsWith("/smart/") ||
        pathname.startsWith("/accounting/") ||
        pathname.startsWith("/finance/") ||
        pathname.startsWith("/business/") ||
        pathname.startsWith("/economics/") ||
        pathname.startsWith("/entrepreneurship/") ||
        pathname.startsWith("/business-math/") ||
        pathname.startsWith("/statistics/") ||
        pathname.startsWith("/far/") ||
        pathname.startsWith("/operations/") ||
        pathname.startsWith("/audit/") ||
        pathname.startsWith("/tax/") ||
        pathname.startsWith("/afar/") ||
        pathname.startsWith("/ais/") ||
        pathname.startsWith("/governance/") ||
        pathname.startsWith("/rfbt/") ||
        pathname.startsWith("/strategic/") ||
        pathname.includes("workspace") ||
        pathname.includes("analysis") ||
        pathname.includes("comparison") ||
        pathname.includes("dissolution") ||
        pathname.includes("budget") ||
        pathname.includes("schedule")
    );
}

function prefersStudyPageShell(pathname: string) {
    return pathname.startsWith("/study");
}

function prefersDataDensePageShell(pathname: string) {
    return (
        pathname === "/scan-check" ||
        pathname.includes("workspace") ||
        pathname.includes("analysis") ||
        pathname.includes("comparison") ||
        pathname.includes("schedule") ||
        pathname.includes("budget") ||
        pathname.includes("quiz")
    );
}

function getDraftFields(root: HTMLElement) {
    return Array.from(
        root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
            "input, textarea, select"
        )
    ).filter(
        (field) =>
            !field.disabled &&
            field.type !== "hidden" &&
            field.type !== "password" &&
            !field.closest("[data-no-persist]")
    );
}

function getDraftFieldKey(
    field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    index: number
) {
    const shellLabel = field
        .closest(".app-input-shell, .app-panel, .app-panel-elevated, .app-subtle-surface")
        ?.querySelector("label")
        ?.textContent?.trim();

    return [
        field.tagName.toLowerCase(),
        field.type,
        field.name,
        field.id,
        field.getAttribute("aria-label"),
        field.getAttribute("placeholder"),
        shellLabel,
        index,
    ]
        .filter(Boolean)
        .join("|");
}

function syncPersistedField(
    field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    nextValue: string
) {
    if (
        field instanceof HTMLInputElement &&
        (field.type === "checkbox" || field.type === "radio")
    ) {
        const nextChecked = nextValue === "1";
        if (field.checked === nextChecked) return;
        field.checked = nextChecked;
        field.dispatchEvent(new Event("change", { bubbles: true }));
        return;
    }

    if (field.value === nextValue) return;

    const prototype =
        field instanceof HTMLTextAreaElement
            ? window.HTMLTextAreaElement.prototype
            : field instanceof HTMLSelectElement
              ? window.HTMLSelectElement.prototype
              : window.HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
    descriptor?.set?.call(field, nextValue);
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.dispatchEvent(new Event("change", { bubbles: true }));
}

type SidebarContentProps = {
    locationPathname: string;
    openGroups: OpenGroupsState;
    toggleGroup: (groupTitle: AppNavGroupTitle) => void;
    closeMobileSidebar: () => void;
    showNewIndicators: boolean;
    seenNewPaths: string[];
    pinnedRoutes: ReturnType<typeof getPinnedRoutes>;
    recentRoutes: ReturnType<typeof getRecentRoutes>;
    mostUsedRoutes: ReturnType<typeof getMostUsedRoutes>;
    online: boolean;
    bundleReady: boolean;
    onUnavailableRoute: (reason: string) => void;
};

function SidebarContent({
    locationPathname,
    openGroups,
    toggleGroup,
    closeMobileSidebar,
    showNewIndicators,
    seenNewPaths,
    pinnedRoutes,
    recentRoutes,
    mostUsedRoutes,
    online,
    bundleReady,
    onUnavailableRoute,
}: SidebarContentProps) {
    const [showShortcuts, setShowShortcuts] = useState(false);

    function resolveRouteAvailability(route: { path: string }) {
        const routeMeta = getRouteMeta(route.path);
        if (!routeMeta) {
            return {
                canOpen: true,
                label: "Available",
                reason: "This route is available.",
            };
        }

        return getRouteAvailability(routeMeta, {
            online,
            bundleReady,
            currentPath: locationPathname,
        });
    }

    function handleRouteIntent(
        event: ReactMouseEvent<HTMLAnchorElement>,
        route: { path: string }
    ) {
        const availability = resolveRouteAvailability(route);

        if (!availability.canOpen) {
            event.preventDefault();
            onUnavailableRoute(availability.reason);
            return;
        }

        closeMobileSidebar();
    }

    return (
        <div
            className="flex h-full flex-col"
            style={{ background: "var(--app-sidebar-bg)" }}
            data-onboarding-target="sidebar"
        >
            <div className="border-b app-divider px-3 py-2.5">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <Link to="/" onClick={closeMobileSidebar} className="block">
                            <p className="app-kicker text-[0.62rem]">AccCalc {APP_VERSION}</p>
                            <div className="mt-1.5">
                                <AppBrandMark
                                    compact
                                    labelClassName="text-[color:var(--app-sidebar-text)]"
                                />
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to="/history"
                            onClick={closeMobileSidebar}
                            className="app-button-ghost rounded-full px-2.5 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em]"
                        >
                            Activity
                        </Link>
                        <button
                            type="button"
                            onClick={closeMobileSidebar}
                            aria-label="Close sidebar"
                            className="app-icon-button inline-flex rounded-xl p-2.5 xl:hidden"
                        >
                            <ShellIcon kind="close" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2.5 py-3 scrollbar-premium">
                {(pinnedRoutes.length > 0 || mostUsedRoutes.length > 0 || recentRoutes.length > 0) ? (
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={() => setShowShortcuts((current) => !current)}
                            className="flex w-full items-center justify-between gap-3 rounded-[0.95rem] px-3 py-2 text-left app-button-ghost"
                        >
                            <div>
                                <p className="app-section-kicker text-[0.62rem]">Shortcuts</p>
                                <p className="app-helper mt-1 text-xs">
                                    Pins, recent pages, and popular routes
                                </p>
                            </div>
                            <span
                                className={`shrink-0 transition duration-300 ${
                                    showShortcuts ? "rotate-0" : "-rotate-90"
                                } text-[color:var(--app-sidebar-text-muted)]`}
                            >
                                <ShellIcon kind="chevron" className="h-4 w-4" />
                            </span>
                        </button>
                    </div>
                ) : null}

                {showShortcuts && pinnedRoutes.length > 0 ? (
                    <div className="mb-4 space-y-2">
                        <p className="app-section-kicker px-2 text-[0.64rem]">Pins</p>
                        <div className="space-y-1.5">
                            {pinnedRoutes.map((route) => (
                                (() => {
                                    const availability = resolveRouteAvailability(route);

                                    return (
                                <Link
                                    key={route.path}
                                    to={route.path}
                                    onClick={(event) => handleRouteIntent(event, route)}
                                    className={[
                                        "app-sidebar-link flex items-center justify-between gap-3 rounded-[1rem] px-3.5 py-3 text-sm font-medium leading-5 transition duration-300",
                                        isPathActive(locationPathname, route.path)
                                            ? "app-sidebar-link-active"
                                            : "",
                                        !availability.canOpen ? "opacity-75" : "",
                                    ].join(" ")}
                                    title={availability.reason}
                                >
                                    <span className="app-sidebar-link-title min-w-0 truncate text-[0.88rem]">
                                        {getNavLabel(route)}
                                    </span>
                                    <span className="app-sidebar-link-meta shrink-0 text-[0.68rem]">
                                        {availability.canOpen ? "Pinned" : availability.label}
                                    </span>
                                </Link>
                                    );
                                })()
                            ))}
                        </div>
                    </div>
                ) : null}

                {showShortcuts && mostUsedRoutes.length > 0 ? (
                    <div className="mb-4 space-y-2">
                        <p className="app-section-kicker px-2 text-[0.64rem]">Popular</p>
                        <div className="grid gap-2">
                            {mostUsedRoutes.map((route) => (
                                (() => {
                                    const availability = resolveRouteAvailability(route);

                                    return (
                                <Link
                                    key={route.path}
                                    to={route.path}
                                    onClick={(event) => handleRouteIntent(event, route)}
                                    className="app-list-link rounded-[1.05rem] px-3.5 py-2.5 text-sm font-medium"
                                    title={availability.reason}
                                >
                                    <span className="block truncate text-[color:var(--app-text)]">
                                        {getNavLabel(route)}
                                    </span>
                                    <span className="app-helper text-xs">
                                        {route.category} · {availability.label}
                                    </span>
                                </Link>
                                    );
                                })()
                            ))}
                        </div>
                    </div>
                ) : null}

                {showShortcuts && recentRoutes.length > 0 ? (
                    <div className="mb-4 space-y-2">
                        <p className="app-section-kicker px-2 text-[0.64rem]">Recent</p>
                        <div className="grid gap-2">
                            {recentRoutes.map((route) => (
                                (() => {
                                    const availability = resolveRouteAvailability(route);

                                    return (
                                <Link
                                    key={route.path}
                                    to={route.path}
                                    onClick={(event) => handleRouteIntent(event, route)}
                                    className="app-list-link rounded-[1.05rem] px-3.5 py-2.5 text-sm font-medium"
                                    title={availability.reason}
                                >
                                    <span className="block truncate text-[color:var(--app-text)]">
                                        {getNavLabel(route)}
                                    </span>
                                    <span className="app-helper text-xs">
                                        {route.category} · {availability.label}
                                    </span>
                                </Link>
                                    );
                                })()
                            ))}
                        </div>
                    </div>
                ) : null}

                <nav className="space-y-2.5">
                    {APP_NAV_GROUPS.map((group) => {
                        const groupIsOpen = openGroups[group.title];
                        const groupHasActiveItem = group.items.some((item) =>
                            isPathActive(locationPathname, item.path)
                        );
                        const hasUnseenItem =
                            showNewIndicators &&
                            group.items.some(
                                (item) =>
                                    NEW_FEATURE_PATHS.has(item.path) &&
                                    !seenNewPaths.includes(item.path)
                            );

                        return (
                            <div key={group.title}>
                                <button
                                    type="button"
                                    onClick={() => toggleGroup(group.title)}
                                    className={[
                                        "group app-sidebar-group flex w-full items-center gap-3 rounded-[1rem] px-3 py-2.5 text-left transition duration-300",
                                        groupHasActiveItem ? "app-sidebar-group-active" : "",
                                    ].join(" ")}
                                >
                                    <div className="app-sidebar-icon inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.85rem] text-[color:var(--app-sidebar-text)]">
                                        <ShellIcon kind={group.title} className="h-[0.95rem] w-[0.95rem]" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <p className="app-sidebar-group-title truncate text-[0.9rem] font-semibold tracking-[-0.02em]">
                                                    {getGroupDisplayLabel(group.title)}
                                                </p>
                                                {hasUnseenItem ? <NewBadge /> : null}
                                            </div>
                                            <span className="app-sidebar-count">
                                                {group.items.length}
                                            </span>
                                        </div>
                                    </div>

                                    <span
                                        className={`shrink-0 transition duration-300 ${
                                            groupIsOpen ? "rotate-0" : "-rotate-90"
                                        } text-[color:var(--app-sidebar-text-muted)] group-hover:text-[color:var(--app-sidebar-text)]`}
                                    >
                                        <ShellIcon kind="chevron" className="h-4 w-4" />
                                    </span>
                                </button>

                                <div
                                    className={[
                                        "grid overflow-hidden transition-all duration-300",
                                        groupIsOpen
                                            ? "mt-1.5 grid-rows-[1fr] opacity-100"
                                            : "grid-rows-[0fr] opacity-0",
                                    ].join(" ")}
                                >
                                    <div className="min-h-0 overflow-hidden">
                                        <div className="ml-4 border-l app-divider pl-3 pt-1.5">
                                            <div className="space-y-3">
                                                {group.sections.map((section) => (
                                                    <div key={`${group.title}-${section.title}`}>
                                                        {group.sections.length > 1 ? (
                                                            <p className="app-helper px-3 pb-1 text-[0.62rem] uppercase tracking-[0.14em]">
                                                                {section.title}
                                                            </p>
                                                        ) : null}
                                                        <div className="space-y-1.5">
                                                            {section.items.map((item) => {
                                                                const isActive = isPathActive(
                                                                    locationPathname,
                                                                    item.path
                                                                );
                                                                const isNew =
                                                                    showNewIndicators &&
                                                                    NEW_FEATURE_PATHS.has(item.path) &&
                                                                    !seenNewPaths.includes(item.path);

                                                                return (
                                                                    (() => {
                                                                        const availability =
                                                                            resolveRouteAvailability(item);

                                                                        return (
                                                                            <Link
                                                                                key={item.path}
                                                                                to={item.path}
                                                                                onClick={(event) =>
                                                                                    handleRouteIntent(event, item)
                                                                                }
                                                                                className={[
                                                                                    "group/item app-sidebar-link flex items-center justify-between gap-3 rounded-[0.95rem] px-3 py-2.25 text-sm font-medium leading-5 transition duration-300",
                                                                                    isActive
                                                                                        ? "app-sidebar-link-active"
                                                                                        : "",
                                                                                    !availability.canOpen
                                                                                        ? "opacity-75"
                                                                                        : "",
                                                                                ].join(" ")}
                                                                                title={availability.reason}
                                                                            >
                                                                                <div className="min-w-0">
                                                                                    <span className="app-sidebar-link-title block min-w-0 truncate text-[0.88rem]">
                                                                                        {getNavLabel(item)}
                                                                                    </span>
                                                                                    <span className="app-sidebar-link-meta mt-0.5 block text-[0.68rem]">
                                                                                        {isActive
                                                                                            ? "Current page"
                                                                                            : availability.label}
                                                                                    </span>
                                                                                </div>
                                                                                {isNew ? <NewBadge /> : null}
                                                                            </Link>
                                                                        );
                                                                    })()
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </nav>
            </div>

        </div>
    );
}

function MobileNavButton({
    active,
    label,
    icon,
    onClick,
    onboardingTarget,
    onboardingAction,
}: {
    active?: boolean;
    label: string;
    icon: ReactNode;
    onClick: () => void;
    onboardingTarget?: string;
    onboardingAction?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            data-onboarding-target={onboardingTarget}
            data-onboarding-action={onboardingAction}
            className={[
                "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[1rem] px-2 py-2 text-xs font-semibold transition",
                active
                    ? "bg-[var(--app-accent-soft)] text-[color:var(--app-accent)]"
                    : "text-[color:var(--app-text-secondary)]",
            ].join(" ")}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

function HeaderContextRail({
    route,
    availability,
    studyLinks,
    siblingRoutes,
    currentPath,
    trackSnapshot,
}: {
    route: ReturnType<typeof getRouteMeta>;
    availability: ReturnType<typeof getRouteAvailability> | null;
    studyLinks: Array<{ title: string; path: string }>;
    siblingRoutes: ReturnType<typeof getSuggestedSiblingRoutes>;
    currentPath: string;
    trackSnapshot?: ReturnType<typeof buildCurriculumTrackSnapshots>[number];
}) {
    if (!route || currentPath === "/" || currentPath.startsWith("/settings")) {
        return null;
    }

    const surface = inferRouteSurface(route.path, route.label, route.description);
    const shouldShowAvailability = availability && availability.support !== "full";
    const shouldShowCoverageChip = trackSnapshot?.status === "emerging";

    return (
        <div className="border-b app-divider md:px-5">
            <div className="mx-auto flex w-full max-w-[120rem] flex-col gap-2.5 px-3.5 py-2.5 md:px-0 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                        {route.category}
                    </span>
                    <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                        {route.subtopic}
                    </span>
                    {shouldShowAvailability ? (
                        <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                            {availability.label}
                        </span>
                    ) : null}
                    {shouldShowCoverageChip ? (
                        <span className="app-chip rounded-full px-2.5 py-1 text-[0.62rem]">
                            Needs more linked coverage
                        </span>
                    ) : null}
                </div>

                {(siblingRoutes.length > 0 || studyLinks.length > 0) ? (
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                        {siblingRoutes.slice(0, 2).map((relatedRoute) => (
                            <Link
                                key={relatedRoute.path}
                                to={relatedRoute.path}
                                className="app-list-link rounded-full px-3 py-1.5 text-xs font-semibold"
                            >
                                {relatedRoute.shortLabel ?? relatedRoute.label}
                            </Link>
                        ))}
                        {studyLinks.slice(0, 1).map((topic) => (
                            <Link
                                key={topic.path}
                                to={topic.path}
                                className="app-list-link rounded-full px-3 py-1.5 text-xs font-semibold"
                            >
                                {topic.title}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="app-helper text-xs leading-5">
                        {getRouteSurfaceLabel(surface)} workflow
                    </p>
                )}
            </div>
        </div>
    );
}

export default function AppLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const settings = useAppSettings();
    const activity = useAppActivity();
    const onboarding = useOnboardingState();
    const install = useInstallExperience();
    const network = useNetworkStatus();
    const offlineBundle = useOfflineBundleStatus();
    const update = useAppUpdateState();
    const { notify } = useAppNotifications();
    const currentMeta = getRouteMeta(location.pathname);
    const headerRef = useRef<HTMLElement | null>(null);
    const mainRef = useRef<HTMLElement | null>(null);
    const mobileNavRef = useRef<HTMLDivElement | null>(null);

    const [mobileSidebarRoute, setMobileSidebarRoute] = useState<string | null>(null);
    const [mobileSearchRoute, setMobileSearchRoute] = useState<string | null>(null);
    const [desktopSidebarWidth, setDesktopSidebarWidth] = useState<number>(() => {
        if (typeof window === "undefined") return 304;
        const saved = window.localStorage.getItem("accalc-desktop-sidebar-width");
        const parsed = saved ? Number(saved) : 304;
        return Number.isFinite(parsed) ? Math.min(420, Math.max(272, parsed)) : 304;
    });
    const [desktopSidebarVisible, setDesktopSidebarVisible] = useState<boolean>(() => {
        if (typeof window === "undefined") return true;
        const saved = window.localStorage.getItem("accalc-desktop-sidebar-visible");
        return saved === null ? true : saved === "true";
    });
    const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
        if (typeof window === "undefined") return true;
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });
    const [settingsPanelRoute, setSettingsPanelRoute] = useState<string | null>(null);
    const [openGroups, setOpenGroups] = useState<OpenGroupsState>(DEFAULT_OPEN_GROUPS);
    const [bootVisible, setBootVisible] = useState<boolean>(() => settings.showOpeningAnimation);
    const [feedbackVisible, setFeedbackVisible] = useState<boolean>(false);
    const [supportPromptVisible, setSupportPromptVisible] = useState<boolean>(false);
    const [sidebarResizeActive, setSidebarResizeActive] = useState<boolean>(false);
    const [headerCondensed, setHeaderCondensed] = useState<boolean>(false);
    const [mobileNavHidden, setMobileNavHidden] = useState<boolean>(false);

    const lastRecordedPathRef = useRef<string>("");
    const feedbackShownRef = useRef(false);
    const previousOnlineRef = useRef<boolean>(network.online);
    const previousStandaloneRef = useRef<boolean>(install.isStandalone);
    const lastScrollYRef = useRef(0);
    const updateBannerHandledRef = useRef(false);

    const mobileSidebarOpen = mobileSidebarRoute === location.pathname;
    const mobileSearchOpen = mobileSearchRoute === location.pathname;
    const settingsPanelOpen = settingsPanelRoute === location.pathname;
    const effectiveDesktopSidebarVisible = settings.rememberDesktopSidebarVisibility
        ? desktopSidebarVisible
        : true;
    const resolvedTheme = resolveThemeMode(settings.themePreference, systemPrefersDark);
    const resolvedThemeFamily = settings.themeFamily;
    const pinnedRoutes = useMemo(() => getPinnedRoutes(activity), [activity]);
    const mostUsedRoutes = useMemo(() => getMostUsedRoutes(activity), [activity]);
    const recentRoutes = useMemo(() => getRecentRoutes(activity), [activity]);
    const curriculumSnapshots = useMemo(() => buildCurriculumTrackSnapshots(), []);
    const pageShellClassName = useMemo(() => {
        const baseClassName = "app-page-shell animate-[fade-rise_0.42s_ease-out]";

        if (prefersDataDensePageShell(location.pathname)) {
            return `${baseClassName} app-page-shell-data`;
        }

        if (prefersStudyPageShell(location.pathname)) {
            return `${baseClassName} app-page-shell-study`;
        }

        if (prefersWidePageShell(location.pathname)) {
            return `${baseClassName} app-page-shell-wide`;
        }

        return baseClassName;
    }, [location.pathname]);

    const effectiveOpenGroups = useMemo(() => {
        if (!settings.autoExpandActiveNavGroup) {
            return openGroups;
        }

        const nextOpenGroups = { ...openGroups };

        APP_NAV_GROUPS.forEach((group) => {
            const hasActiveItem = group.items.some((item) =>
                isPathActive(location.pathname, item.path)
            );

            if (hasActiveItem) {
                nextOpenGroups[group.title] = true;
            }
        });

        return nextOpenGroups;
    }, [location.pathname, openGroups, settings.autoExpandActiveNavGroup]);

    const unseenCount = useMemo(
        () =>
            APP_NAV_GROUPS.flatMap((group) => group.items).filter(
                (item) =>
                    NEW_FEATURE_PATHS.has(item.path) &&
                    !activity.seenNewPaths.includes(item.path)
            ).length,
        [activity.seenNewPaths]
    );

    useEffect(() => {
        if (typeof window === "undefined") return;
        lastScrollYRef.current = window.scrollY;
        setHeaderCondensed(false);
        setMobileNavHidden(false);
    }, [location.pathname]);

    function pushNotice(
        title: string,
        message: string,
        tone: "info" | "success" | "warning" | "error" = "info",
        options?: { dedupeKey?: string; durationMs?: number }
    ) {
        notify({ title, message, tone, dedupeKey: options?.dedupeKey, durationMs: options?.durationMs });
    }

    useEffect(() => {
        if (updateBannerHandledRef.current || typeof window === "undefined") return;
        updateBannerHandledRef.current = true;

        const rawUpdateFlag = window.sessionStorage.getItem("accalc-update-banner");
        if (!rawUpdateFlag) return;

        window.sessionStorage.removeItem("accalc-update-banner");
        let activatedVersion = APP_VERSION;

        try {
            const parsed = JSON.parse(rawUpdateFlag) as { version?: string };
            if (typeof parsed.version === "string" && parsed.version.trim() !== "") {
                activatedVersion = parsed.version;
            }
        } catch {
            // Ignore malformed update banner payloads.
        }

        notify({
            title: "App updated",
            message: `AccCalc ${activatedVersion} is now active with the latest calculator and interface improvements.`,
            tone: "success",
            dedupeKey: `app-updated:${activatedVersion}`,
            durationMs: 7600,
        });
    }, [notify]);

    function dismissSupportPrompt(mode: "later" | "forever") {
        const nextValue = {
            dismissedUntil: mode === "later" ? Date.now() + 1000 * 60 * 60 * 24 * 21 : 0,
            dismissedForever: mode === "forever",
        };

        writeSupportPromptPreference(nextValue);
        setSupportPromptVisible(false);
    }

    function closeTransientPanels() {
        setMobileSidebarRoute(null);
        setMobileSearchRoute(null);
    }

    function toggleGroup(groupTitle: AppNavGroupTitle) {
        setOpenGroups((current) => ({
            ...current,
            [groupTitle]: !current[groupTitle],
        }));
    }

    useEffect(() => {
        if (typeof window === "undefined") return;

        if (
            !settings.enableMotionEffects ||
            mobileSidebarOpen ||
            mobileSearchOpen ||
            settingsPanelOpen
        ) {
            setHeaderCondensed(false);
            setMobileNavHidden(false);
            return;
        }

        const handleScroll = () => {
            const currentScrollY = Math.max(window.scrollY, 0);
            const delta = currentScrollY - lastScrollYRef.current;

            if (currentScrollY < 48) {
                setHeaderCondensed(false);
                setMobileNavHidden(false);
                lastScrollYRef.current = currentScrollY;
                return;
            }

            if (delta > 12 && currentScrollY > 96) {
                setHeaderCondensed(true);
                setMobileNavHidden(true);
            } else if (delta < -10) {
                setHeaderCondensed(false);
                setMobileNavHidden(false);
            }

            lastScrollYRef.current = currentScrollY;
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, [
        mobileSearchOpen,
        mobileSidebarOpen,
        settings.enableMotionEffects,
        settingsPanelOpen,
    ]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        if (!settings.rememberDesktopSidebarVisibility) {
            window.localStorage.removeItem("accalc-desktop-sidebar-visible");
            return;
        }

        window.localStorage.setItem(
            "accalc-desktop-sidebar-visible",
            String(desktopSidebarVisible)
        );
    }, [desktopSidebarVisible, settings.rememberDesktopSidebarVisibility]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(
            "accalc-desktop-sidebar-width",
            String(desktopSidebarWidth)
        );
    }, [desktopSidebarWidth]);

    useEffect(() => {
        if (typeof document === "undefined") return;
        document.body.dataset.motion = settings.enableMotionEffects ? "on" : "off";
    }, [settings.enableMotionEffects]);

    useEffect(() => {
        if (typeof document === "undefined") return;

        const pageTitle = currentMeta?.label ?? "AccCalc";
        document.title =
            location.pathname === "/"
                ? `AccCalc ${APP_VERSION} | Solve, Check, Learn`
                : `${pageTitle} | AccCalc ${APP_VERSION}`;
    }, [currentMeta?.label, location.pathname]);

    useEffect(() => {
        if (typeof document === "undefined") return;
        document.documentElement.dataset.contrast = settings.highContrastMode ? "high" : "normal";
        document.body.dataset.contrast = settings.highContrastMode ? "high" : "normal";
    }, [settings.highContrastMode]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches);

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    useEffect(() => {
        if (typeof document === "undefined") return;
        document.documentElement.dataset.theme = resolvedTheme;
        document.documentElement.dataset.themeFamily = resolvedThemeFamily;
        document.body.dataset.theme = resolvedTheme;
        document.body.dataset.themeFamily = resolvedThemeFamily;

        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        const nextThemeColor = getThemeMetaColor(resolvedTheme, resolvedThemeFamily);
        if (themeColorMeta) {
            themeColorMeta.setAttribute("content", nextThemeColor);
        }
    }, [resolvedTheme, resolvedThemeFamily]);

    useEffect(() => {
        if (typeof document === "undefined" || !headerRef.current) return;

        const syncHeaderHeight = () => {
            const nextHeight = Math.ceil(
                headerRef.current?.getBoundingClientRect().height ?? 92
            );
            document.documentElement.style.setProperty(
                "--app-header-height",
                `${nextHeight}px`
            );
        };

        syncHeaderHeight();

        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", syncHeaderHeight);
            return () => window.removeEventListener("resize", syncHeaderHeight);
        }

        const resizeObserver = new ResizeObserver(syncHeaderHeight);
        resizeObserver.observe(headerRef.current);
        window.addEventListener("resize", syncHeaderHeight);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", syncHeaderHeight);
        };
    }, []);

    useEffect(() => {
        if (typeof document === "undefined") return;

        const rootStyle = document.documentElement.style;
        const syncMobileNavHeight = () => {
            const navHeight = Math.ceil(
                mobileNavRef.current?.getBoundingClientRect().height ?? 0
            );
            rootStyle.setProperty("--app-mobile-nav-height", `${navHeight}px`);
        };

        syncMobileNavHeight();

        if (typeof ResizeObserver === "undefined" || !mobileNavRef.current) {
            window.addEventListener("resize", syncMobileNavHeight);
            return () => {
                rootStyle.setProperty("--app-mobile-nav-height", "0px");
                window.removeEventListener("resize", syncMobileNavHeight);
            };
        }

        const resizeObserver = new ResizeObserver(syncMobileNavHeight);
        resizeObserver.observe(mobileNavRef.current);
        window.addEventListener("resize", syncMobileNavHeight);

        return () => {
            rootStyle.setProperty("--app-mobile-nav-height", "0px");
            resizeObserver.disconnect();
            window.removeEventListener("resize", syncMobileNavHeight);
        };
    }, []);

    useEffect(() => {
        if (typeof document === "undefined") return;

        const rootStyle = document.documentElement.style;
        const syncViewportMetrics = () => {
            if (typeof window === "undefined") {
                rootStyle.setProperty("--app-keyboard-inset", "0px");
                rootStyle.setProperty("--app-viewport-height", "100vh");
                return;
            }

            const viewportHeight = Math.round(window.visualViewport?.height ?? window.innerHeight);
            rootStyle.setProperty("--app-viewport-height", `${viewportHeight}px`);

            if (!window.visualViewport) {
                rootStyle.setProperty("--app-keyboard-inset", "0px");
                return;
            }

            const viewport = window.visualViewport;
            const nextInset = Math.max(
                0,
                Math.round(window.innerHeight - (viewport.height + viewport.offsetTop))
            );
            rootStyle.setProperty("--app-keyboard-inset", `${nextInset}px`);
        };

        syncViewportMetrics();

        if (!window.visualViewport) {
            window.addEventListener("resize", syncViewportMetrics);
            return () => {
                rootStyle.setProperty("--app-keyboard-inset", "0px");
                rootStyle.setProperty("--app-viewport-height", "100vh");
                window.removeEventListener("resize", syncViewportMetrics);
            };
        }

        window.visualViewport.addEventListener("resize", syncViewportMetrics);
        window.visualViewport.addEventListener("scroll", syncViewportMetrics);
        window.addEventListener("resize", syncViewportMetrics);

        return () => {
            rootStyle.setProperty("--app-keyboard-inset", "0px");
            rootStyle.setProperty("--app-viewport-height", "100vh");
            window.visualViewport?.removeEventListener("resize", syncViewportMetrics);
            window.visualViewport?.removeEventListener("scroll", syncViewportMetrics);
            window.removeEventListener("resize", syncViewportMetrics);
        };
    }, []);

    useEffect(() => {
        if (!settings.showOpeningAnimation) return;

        const standalone =
            typeof window !== "undefined" &&
            window.matchMedia("(display-mode: standalone)").matches;
        const duration = standalone ? 1050 : 680;
        const timer = window.setTimeout(() => setBootVisible(false), duration);

        return () => window.clearTimeout(timer);
    }, [settings.showOpeningAnimation]);

    useEffect(() => {
        if (!settings.saveOfflineHistory) return;
        if (typeof window !== "undefined") {
            const launchMarker = window.sessionStorage.getItem("accalc-launch-recorded");
            if (launchMarker) return;
            window.sessionStorage.setItem("accalc-launch-recorded", "true");
        }
        recordAppLaunch();
    }, [settings.saveOfflineHistory]);

    useEffect(() => {
        if (!settings.saveOfflineHistory) return;
        if (lastRecordedPathRef.current === location.pathname) return;

        if (typeof window !== "undefined") {
            const storedPath = window.sessionStorage.getItem("accalc-last-recorded-path");
            if (storedPath === location.pathname) {
                lastRecordedPathRef.current = location.pathname;
                return;
            }
            window.sessionStorage.setItem("accalc-last-recorded-path", location.pathname);
        }

        lastRecordedPathRef.current = location.pathname;
        recordToolVisit(location.pathname);
    }, [location.pathname, settings.saveOfflineHistory]);

    useEffect(() => {
        if (!settings.showNewFeatureIndicators) return;
        if (!NEW_FEATURE_PATHS.has(location.pathname)) return;
        markPathSeen(location.pathname);
    }, [location.pathname, settings.showNewFeatureIndicators]);

    useEffect(() => {
        if (previousOnlineRef.current === network.online) return;
        previousOnlineRef.current = network.online;

        const timer = window.setTimeout(() => {
            if (network.online) {
                void checkForAppUpdates();
                pushNotice(
                    "Back online",
                    "Full app functionality is available again, including feedback and external links.",
                    "success"
                );
                return;
            }

            pushNotice(
                "Offline mode",
                offlineBundle.ready
                    ? "Offline-safe routes from this cached release can still open. Feedback submission, external web content, and update checks stay limited until you reconnect."
                    : "This device went offline before the current release finished caching. Reconnect once so AccCalc can download the route files needed for trustworthy offline use.",
                "warning"
            );
        }, 0);

        return () => window.clearTimeout(timer);
    }, [network.online, offlineBundle.ready]);

    useEffect(() => {
        if (previousStandaloneRef.current === install.isStandalone) return;
        previousStandaloneRef.current = install.isStandalone;

        if (!install.isStandalone) return;

        const timer = window.setTimeout(() => {
            pushNotice(
                "Installed",
                "AccCalc is ready from your home screen or app launcher on this device.",
                "success"
            );
        }, 0);

        return () => window.clearTimeout(timer);
    }, [install.isStandalone]);

    useEffect(() => {
        if (!offlineBundle.deploymentMismatch) return;

        const timer = window.setTimeout(() => {
            pushNotice(
                "Refresh recommended",
                "This tab hit a stale route-file mismatch after a deploy. Refresh to reconnect the current shell with the latest chunk set.",
                "warning"
            );
            clearDeploymentMismatch();
        }, 0);

        return () => window.clearTimeout(timer);
    }, [offlineBundle.deploymentMismatch]);

    useEffect(() => {
        if (!sidebarResizeActive) return;

        const handlePointerMove = (event: PointerEvent) => {
            setDesktopSidebarWidth(Math.min(420, Math.max(272, event.clientX)));
        };

        const handlePointerUp = () => setSidebarResizeActive(false);

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };
    }, [sidebarResizeActive]);

    useEffect(() => {
        if (!shouldShowFeedbackReminder(activity, settings.showFeedbackReminders)) return;
        if (feedbackShownRef.current) return;

        feedbackShownRef.current = true;
        noteFeedbackReminderShown();

        const timer = window.setTimeout(() => setFeedbackVisible(true), 0);
        return () => window.clearTimeout(timer);
    }, [activity, settings.showFeedbackReminders]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (location.pathname.startsWith("/settings")) return;
        if (feedbackVisible) return;

        const preference = readSupportPromptPreference();
        if (preference.dismissedForever) return;
        if (preference.dismissedUntil > Date.now()) return;
        if (activity.launches < 8) return;
        if (activity.recent.length + activity.savedRecords.length < 12) return;

        const timer = window.setTimeout(() => setSupportPromptVisible(true), 600);
        return () => window.clearTimeout(timer);
    }, [activity.launches, activity.recent.length, activity.savedRecords.length, feedbackVisible, location.pathname]);

    useEffect(() => {
        if (!location.pathname.startsWith("/settings")) return;
        setSupportPromptVisible(false);
    }, [location.pathname]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleError = (event: ErrorEvent) => {
            const runtimeIssue = normalizeRuntimeIssue(event.error ?? event.message);
            if (!runtimeIssue) return;

            pushNotice(runtimeIssue.title, runtimeIssue.message, runtimeIssue.tone, {
                dedupeKey: runtimeIssue.dedupeKey,
            });
        };

        const handleRejection = (event: PromiseRejectionEvent) => {
            const runtimeIssue = normalizeRuntimeIssue(event.reason);
            if (!runtimeIssue) return;

            if (runtimeIssue.handled) {
                event.preventDefault();
            }

            pushNotice(runtimeIssue.title, runtimeIssue.message, runtimeIssue.tone, {
                dedupeKey: runtimeIssue.dedupeKey,
            });
        };

        window.addEventListener("error", handleError);
        window.addEventListener("unhandledrejection", handleRejection);

        return () => {
            window.removeEventListener("error", handleError);
            window.removeEventListener("unhandledrejection", handleRejection);
        };
    }, []);

    useEffect(() => {
        if (typeof window === "undefined" || !mainRef.current) return;

        const draftStorageKey = getDraftStorageKey(location.pathname);

        if (!settings.saveOfflineHistory) {
            try {
                window.localStorage.removeItem(draftStorageKey);
            } catch {
                // Ignore storage removal failures.
            }
            return;
        }

        const root = mainRef.current;
        const persistDraft = () => {
            const fields = getDraftFields(root);
            const snapshot = fields.reduce<Record<string, string>>((record, field, index) => {
                const key = getDraftFieldKey(field, index);
                const value =
                    field instanceof HTMLInputElement &&
                    (field.type === "checkbox" || field.type === "radio")
                        ? field.checked
                            ? "1"
                            : ""
                        : field.value;

                if (value.trim() !== "") {
                    record[key] = value;
                }

                return record;
            }, {});

            try {
                if (Object.keys(snapshot).length === 0) {
                    window.localStorage.removeItem(draftStorageKey);
                    return;
                }

                window.localStorage.setItem(draftStorageKey, JSON.stringify(snapshot));
            } catch {
                // Ignore storage write failures so tools continue working.
            }
        };

        const restoreDraft = () => {
            try {
                const rawDraft = window.localStorage.getItem(draftStorageKey);
                if (!rawDraft) return;

                const parsedDraft = JSON.parse(rawDraft) as Record<string, string>;
                const fields = getDraftFields(root);

                fields.forEach((field, index) => {
                    const key = getDraftFieldKey(field, index);
                    const nextValue = parsedDraft[key];

                    if (typeof nextValue === "string") {
                        syncPersistedField(field, nextValue);
                    }
                });
            } catch {
                // Ignore malformed drafts and continue rendering normally.
            }
        };

        const restoreTimer = window.setTimeout(() => {
            restoreDraft();
            window.setTimeout(persistDraft, 0);
        }, 60);

        root.addEventListener("input", persistDraft, true);
        root.addEventListener("change", persistDraft, true);

        return () => {
            window.clearTimeout(restoreTimer);
            root.removeEventListener("input", persistDraft, true);
            root.removeEventListener("change", persistDraft, true);
        };
    }, [location.pathname, settings.saveOfflineHistory]);

    const settingsButtonClass = [
        "app-icon-button inline-flex rounded-xl p-2.25",
        settingsPanelOpen
            ? "border-[color:var(--app-border-strong)] bg-[var(--app-accent-soft)] text-[color:var(--app-accent)]"
            : "",
    ].join(" ");
    const currentRouteAvailability = currentMeta
        ? getRouteAvailability(currentMeta, {
              online: network.online,
              bundleReady: offlineBundle.ready,
              currentPath: location.pathname,
          })
        : null;
    const currentStudyLinks = useMemo(
        () =>
            getStudyTopicsForRoute(location.pathname).map((topic) => ({
                title: topic.shortTitle,
                path: buildStudyTopicPath(topic.id),
            })),
        [location.pathname]
    );
    const currentSiblingRoutes = useMemo(
        () => getSuggestedSiblingRoutes(location.pathname, 3),
        [location.pathname]
    );
    const currentTrackSnapshot = useMemo(
        () =>
            currentMeta
                ? curriculumSnapshots.find((snapshot) => snapshot.track === currentMeta.category)
                : undefined,
        [currentMeta, curriculumSnapshots]
    );
    const themeButtonLabel =
        resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    const promptDockHidden =
        mobileSearchOpen ||
        mobileSidebarOpen ||
        settingsPanelOpen ||
        Boolean(onboarding.activeTourId);
    const mobileTransientPanelOpen = mobileSidebarOpen || mobileSearchOpen;
    const desktopSettingsPanelWidth = "clamp(34rem, 42vw, 48rem)";

    useBodyScrollLock(mobileTransientPanelOpen);

    function toggleMobileSidebar() {
        setMobileSearchRoute(null);
        setSettingsPanelRoute(null);
        emitOnboardingAction("navigation-opened");
        setMobileSidebarRoute((current) =>
            current === location.pathname ? null : location.pathname
        );
    }

    function toggleMobileSearch() {
        setMobileSidebarRoute(null);
        setSettingsPanelRoute(null);
        emitOnboardingAction("search-opened");
        setMobileSearchRoute((current) =>
            current === location.pathname ? null : location.pathname
        );
    }

    function toggleSettingsPanel() {
        closeTransientPanels();
        emitOnboardingAction("settings-opened");
        setSettingsPanelRoute((current) =>
            current === location.pathname ? null : location.pathname
        );
    }

    function handleOnboardingShellAction(
        action: "open-navigation" | "open-search" | "open-settings"
    ) {
        if (action === "open-navigation") {
            setMobileSearchRoute(null);
            setSettingsPanelRoute(null);
            if (typeof window !== "undefined" && window.matchMedia("(min-width: 1280px)").matches) {
                setDesktopSidebarVisible(true);
            } else {
                setMobileSidebarRoute(location.pathname);
            }
            emitOnboardingAction("navigation-opened");
            return;
        }

        if (action === "open-search") {
            setMobileSidebarRoute(null);
            setSettingsPanelRoute(null);
            setMobileSearchRoute(location.pathname);
            emitOnboardingAction("search-opened");
            return;
        }

        closeTransientPanels();
        setSettingsPanelRoute(location.pathname);
        emitOnboardingAction("settings-opened");
    }

    return (
        <div className="min-h-screen bg-transparent text-[color:var(--app-text)]">
            <LaunchScreen visible={settings.showOpeningAnimation && bootVisible} />
            <FloatingPromptDock hidden={promptDockHidden}>
                <AppUpdatePrompt update={update} />
                <InstallPrompt blocked={update.updateReady} />
                <DonationPromptCard
                    visible={supportPromptVisible}
                    onDismiss={dismissSupportPrompt}
                />
            </FloatingPromptDock>
            <FeedbackReminder visible={feedbackVisible} onClose={() => setFeedbackVisible(false)} />

            <div className="flex min-h-screen items-start">
                {effectiveDesktopSidebarVisible ? (
                    <aside
                        className="sticky top-0 hidden h-screen shrink-0 border-r app-divider backdrop-blur-xl xl:block"
                        style={{ background: "var(--app-sidebar-bg)", width: `${desktopSidebarWidth}px` }}
                    >
                        <SidebarContent
                            locationPathname={location.pathname}
                            openGroups={effectiveOpenGroups}
                            toggleGroup={toggleGroup}
                            closeMobileSidebar={closeTransientPanels}
                            showNewIndicators={settings.showNewFeatureIndicators}
                            seenNewPaths={activity.seenNewPaths}
                            pinnedRoutes={pinnedRoutes}
                            recentRoutes={recentRoutes}
                            mostUsedRoutes={mostUsedRoutes}
                            online={network.online}
                            bundleReady={offlineBundle.ready}
                            onUnavailableRoute={(reason) =>
                                pushNotice("Unavailable offline", reason, "warning")
                            }
                        />
                    </aside>
                ) : null}

                {effectiveDesktopSidebarVisible ? (
                    <button
                        type="button"
                        aria-label="Resize sidebar"
                        onPointerDown={() => setSidebarResizeActive(true)}
                        className={[
                            "relative hidden h-screen w-2 shrink-0 cursor-col-resize xl:block",
                            sidebarResizeActive ? "bg-[var(--app-accent-soft)]" : "",
                        ].join(" ")}
                    >
                        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[color:var(--app-border-subtle)]" />
                    </button>
                ) : null}

                <div className="app-surface min-w-0 flex-1">
                    <header
                        ref={headerRef}
                        className={[
                            "app-shell-header sticky top-0 z-[90] border-b app-divider backdrop-blur-xl",
                            headerCondensed ? "app-shell-header--condensed" : "",
                        ].join(" ")}
                        style={{ background: "var(--app-header-bg)" }}
                    >
                        <div
                            className={[
                                "app-shell-header__bar flex items-center justify-between gap-3 md:px-5",
                                settings.compactMobileChrome
                                    ? "px-3.5 py-1.75 md:py-2.25"
                                    : "px-4 py-2 md:py-2.5",
                            ].join(" ")}
                        >
                            <div className="app-shell-header__intro min-w-0 flex-1 pr-2">
                                <div className="app-shell-header__eyebrow flex items-center gap-2">
                                    <p className="app-kicker hidden text-[0.58rem] sm:block">
                                        {currentMeta?.category ?? "Accounting companion"}
                                    </p>
                                    {unseenCount > 0 && location.pathname !== "/history" ? (
                                        <Link
                                            to="/history"
                                            className="app-badge-new hidden rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] lg:inline-flex"
                                        >
                                            {unseenCount} new
                                        </Link>
                                    ) : null}
                                </div>
                                <h2 className="app-shell-header__title mt-0.5 truncate text-[0.98rem] font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)] md:text-[1.08rem]">
                                    {currentMeta?.shortLabel ?? currentMeta?.label ?? "AccCalc"}
                                </h2>
                                <p className="app-shell-header__description app-clamp-1 mt-0.5 hidden text-[0.74rem] leading-5 app-helper xl:block">
                                    {currentMeta?.description ??
                                        "Solve, check, and learn across accounting, finance, business, and related coursework from one clearer workspace."}
                                </p>
                            </div>

                            <div className="app-shell-header__actions flex items-center gap-2">
                                <div
                                    className="app-shell-header__search hidden min-w-[12rem] flex-1 max-w-[18rem] md:block xl:max-w-[20rem]"
                                    data-onboarding-target="global-search"
                                    data-onboarding-action="search-opened"
                                >
                                    <FeatureSearch key={location.pathname} className="w-full" placeholder="Search" />
                                </div>

                                <Link
                                    to="/history"
                                    aria-label="Open history"
                                    title="History"
                                    className="app-icon-button hidden rounded-xl p-2.25 md:inline-flex"
                                >
                                    <ShellIcon kind="history" />
                                </Link>

                                <ShareAppButton
                                    iconOnly
                                    label="Share link"
                                    title="Share AccCalc link"
                                    variant="icon"
                                    className="hidden rounded-xl p-2.25 md:inline-flex"
                                    onResult={(result) => {
                                        if (result === "copied") {
                                            pushNotice(
                                                "Link copied",
                                                "AccCalc's live link is ready to paste or send.",
                                                "success"
                                            );
                                            return;
                                        }

                                        if (result === "shared") {
                                            pushNotice(
                                                "Share sheet opened",
                                                "Use your device's share flow to send the current live AccCalc link.",
                                                "info"
                                            );
                                            return;
                                        }

                                        if (result === "unsupported" || result === "failed") {
                                            pushNotice(
                                                "Share unavailable",
                                                "This browser could not open a share flow or copy the link automatically.",
                                                "warning"
                                            );
                                        }
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() => setDesktopSidebarVisible((current) => !current)}
                                    aria-label={
                                        effectiveDesktopSidebarVisible ? "Hide sidebar" : "Show sidebar"
                                    }
                                    title={
                                        effectiveDesktopSidebarVisible ? "Hide sidebar" : "Show sidebar"
                                    }
                                    className="app-icon-button hidden rounded-xl p-2.25 xl:inline-flex"
                                    data-onboarding-target="desktop-sidebar-toggle"
                                    data-onboarding-action="navigation-opened"
                                >
                                    <ShellIcon
                                        kind={
                                            effectiveDesktopSidebarVisible
                                                ? "sidebar-close"
                                                : "sidebar-open"
                                        }
                                    />
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        updateAppSettings({
                                            themePreference:
                                                resolvedTheme === "dark" ? "light" : "dark",
                                        })
                                    }
                                    aria-label={themeButtonLabel}
                                    title={themeButtonLabel}
                                    className="app-icon-button hidden rounded-xl p-2.25 md:inline-flex"
                                >
                                    <ShellIcon
                                        kind={resolvedTheme === "dark" ? "theme-light" : "theme-dark"}
                                    />
                                </button>

                                <button
                                    type="button"
                                    onClick={toggleSettingsPanel}
                                    aria-label={settingsPanelOpen ? "Close settings" : "Open settings"}
                                    title={settingsPanelOpen ? "Close settings" : "Open settings"}
                                    className={settingsButtonClass}
                                    data-onboarding-target="settings"
                                    data-onboarding-action="settings-opened"
                                >
                                    <ShellIcon kind="settings" />
                                </button>
                            </div>
                        </div>
                    </header>

                    <HeaderContextRail
                        route={currentMeta}
                        availability={currentRouteAvailability}
                        studyLinks={currentStudyLinks}
                        siblingRoutes={currentSiblingRoutes}
                        currentPath={location.pathname}
                        trackSnapshot={currentTrackSnapshot}
                    />

                    {!network.online ? (
                        <div
                            className={[
                                "border-b app-divider md:px-5",
                                settings.compactMobileChrome ? "px-3.5 py-2" : "px-4 py-2.5",
                            ].join(" ")}
                        >
                            <div className="app-tone-warning rounded-[1.2rem] px-4 py-3 text-sm leading-6">
                                {offlineBundle.ready
                                    ? currentRouteAvailability?.reason ??
                                      "Offline mode is active. This cached release can still open offline-safe routes, while feedback submission, external destinations, and update checks remain limited."
                                    : "Offline mode is active before this release finished caching. Reconnect once so AccCalc can download the current route bundle for trustworthy offline use."}
                            </div>
                        </div>
                    ) : null}

                    <main
                        ref={mainRef}
                        className={[
                            "md:px-5 md:pb-6",
                            settings.compactMobileChrome
                                ? "px-3.5 pt-2 md:pt-3.5"
                                : "px-4 pt-2.5 md:pt-4",
                        ].join(" ")}
                        style={{
                            paddingBottom:
                                "calc(var(--app-mobile-nav-height, 0px) + env(safe-area-inset-bottom, 0px) + 0.85rem)",
                        }}
                    >
                        <div className={pageShellClassName}>
                            <Outlet />
                        </div>
                    </main>
                </div>

                <div
                    className={[
                        "hidden shrink-0 overflow-hidden xl:block xl:transition-all xl:duration-300",
                        settingsPanelOpen ? "border-l app-divider" : "pointer-events-none",
                    ].join(" ")}
                    style={{
                        width: settingsPanelOpen ? desktopSettingsPanelWidth : "0px",
                        opacity: settingsPanelOpen ? 1 : 0,
                    }}
                    aria-hidden={!settingsPanelOpen}
                >
                    <aside
                        className="app-panel-elevated h-screen rounded-none border-y-0 border-r-0 shadow-none"
                        style={{
                            width: desktopSettingsPanelWidth,
                            transform: settingsPanelOpen ? "translateX(0)" : "translateX(2rem)",
                            transition:
                                "transform 280ms ease, opacity 220ms ease, width 280ms ease",
                        }}
                    >
                        <SettingsPanelBody onClose={() => setSettingsPanelRoute(null)} />
                    </aside>
                </div>
            </div>

            <div
                ref={mobileNavRef}
                className={[
                    "app-bottom-nav fixed inset-x-0 bottom-0 z-[95] border-t app-divider backdrop-blur-xl xl:hidden",
                    mobileNavHidden ? "app-bottom-nav--hidden" : "",
                    mobileSidebarOpen || mobileSearchOpen || settingsPanelOpen
                        ? "pointer-events-none opacity-0"
                        : "",
                ].join(" ")}
                style={{ background: "var(--app-header-bg)" }}
            >
                <div
                    className={[
                        "mx-auto max-w-3xl",
                        settings.compactMobileChrome
                            ? "px-2.5 pb-[calc(env(safe-area-inset-bottom,0px)+0.35rem)] pt-1.5"
                            : "px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] pt-2",
                    ].join(" ")}
                >
                    <div className="grid grid-cols-5 gap-1.5">
                        <MobileNavButton
                            active={location.pathname === "/"}
                            label="Home"
                            icon={<ShellIcon kind="General" className="h-5 w-5" />}
                            onClick={() => navigate("/")}
                        />
                        <MobileNavButton
                            active={location.pathname === "/smart/solver"}
                            label="Solver"
                            icon={<ShellIcon kind="spark" className="h-5 w-5" />}
                            onClick={() => navigate("/smart/solver")}
                            onboardingTarget="smart-solver-entry"
                        />
                        <MobileNavButton
                            label="Search"
                            icon={<ShellIcon kind="search" className="h-5 w-5" />}
                            onClick={toggleMobileSearch}
                            onboardingTarget="mobile-search"
                            onboardingAction="search-opened"
                        />
                        <MobileNavButton
                            active={location.pathname === "/history"}
                            label="History"
                            icon={<ShellIcon kind="history" className="h-5 w-5" />}
                            onClick={() => navigate("/history")}
                        />
                        <MobileNavButton
                            label="Menu"
                            icon={<ShellIcon kind="menu" className="h-5 w-5" />}
                            onClick={toggleMobileSidebar}
                            onboardingTarget="mobile-menu"
                            onboardingAction="navigation-opened"
                        />
                    </div>
                </div>
            </div>

            <ViewportPortal>
                <>
                    <aside
                        aria-hidden={!mobileSidebarOpen}
                        role="dialog"
                        aria-modal="true"
                        aria-label="AccCalc navigation menu"
                        className={[
                            "app-mobile-menu-panel fixed inset-0 z-[102] flex w-screen flex-col border-0 app-divider backdrop-blur-xl transition duration-300 xl:hidden",
                            mobileSidebarOpen
                                ? "translate-x-0 opacity-100"
                                : "-translate-x-full pointer-events-none opacity-0",
                        ].join(" ")}
                        style={{
                            background: "var(--app-sidebar-bg)",
                            height: "var(--app-mobile-panel-height, var(--app-viewport-height, 100dvh))",
                            paddingTop: "env(safe-area-inset-top, 0px)",
                            paddingBottom: "env(safe-area-inset-bottom, 0px)",
                        }}
                    >
                        <SidebarContent
                            locationPathname={location.pathname}
                            openGroups={effectiveOpenGroups}
                            toggleGroup={toggleGroup}
                            closeMobileSidebar={closeTransientPanels}
                            showNewIndicators={settings.showNewFeatureIndicators}
                            seenNewPaths={activity.seenNewPaths}
                            pinnedRoutes={pinnedRoutes}
                            recentRoutes={recentRoutes}
                            mostUsedRoutes={mostUsedRoutes}
                            online={network.online}
                            bundleReady={offlineBundle.ready}
                            onUnavailableRoute={(reason) =>
                                pushNotice("Unavailable offline", reason, "warning")
                            }
                        />
                    </aside>

                    <button
                        type="button"
                        onClick={closeTransientPanels}
                        aria-label="Close sidebar overlay"
                        className={[
                            "app-backdrop fixed inset-0 z-[100] transition duration-300 xl:hidden",
                            mobileTransientPanelOpen
                                ? "pointer-events-auto opacity-100"
                                : "pointer-events-none opacity-0",
                        ].join(" ")}
                    />

                    <div
                        className={[
                            "app-mobile-search-layer fixed inset-0 z-[103] transition duration-300 md:hidden",
                            mobileSearchOpen
                                ? "pointer-events-auto opacity-100"
                                : "pointer-events-none opacity-0",
                        ].join(" ")}
                        style={{
                            height: "var(--app-mobile-panel-height, var(--app-viewport-height, 100dvh))",
                            paddingTop: "max(0.85rem, env(safe-area-inset-top, 0px))",
                            paddingRight: settings.compactMobileChrome ? "0.65rem" : "0.8rem",
                            paddingBottom: "max(0.85rem, env(safe-area-inset-bottom, 0px))",
                            paddingLeft: settings.compactMobileChrome ? "0.65rem" : "0.8rem",
                        }}
                    >
                        <div
                            className={[
                                "app-search-panel flex max-h-full flex-col overflow-hidden",
                                settings.compactMobileChrome
                                    ? "rounded-[1.35rem] p-2.5"
                                    : "rounded-[1.6rem] p-3",
                            ].join(" ")}
                        >
                            <div className="flex items-center justify-between gap-3 px-1 pb-3">
                                <div>
                                    <p className="app-kicker text-[0.68rem]">Mobile search</p>
                                    <p className="app-helper mt-1 text-xs">
                                        Find tools quickly.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setMobileSearchRoute(null)}
                                    className="app-icon-button rounded-xl p-2"
                                    aria-label="Close search"
                                >
                                    <ShellIcon kind="close" className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="min-h-0 flex-1 overflow-y-auto">
                                <FeatureSearch
                                    key={`mobile-${location.pathname}`}
                                    variant="hero"
                                    autoFocus
                                    suppressMobileAutoFocus
                                    placeholder="Search ratios, depreciation, inventory..."
                                />
                            </div>
                        </div>
                    </div>
                </>
            </ViewportPortal>

            <ReturnToTopButton />
            <SettingsDrawer open={settingsPanelOpen} onClose={() => setSettingsPanelRoute(null)} />
            <OnboardingCoach
                launches={activity.launches}
                disabled={settings.showOpeningAnimation && bootVisible}
                onRequestShellAction={handleOnboardingShellAction}
            />
        </div>
    );
}
