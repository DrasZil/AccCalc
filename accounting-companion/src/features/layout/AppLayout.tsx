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
import FeatureSearch from "../../components/FeatureSearch";
import FloatingPromptDock from "../../components/FloatingPromptDock";
import InstallPrompt from "../../components/InstallPrompt";
import ReturnToTopButton from "../../components/ReturnToTopButton";
import ShareAppButton from "../../components/ShareAppButton";
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
import { useInstallExperience } from "../../utils/installExperience";
import { useNetworkStatus } from "../../utils/networkStatus";
import { clearDeploymentMismatch, useOfflineBundleStatus } from "../../utils/offlineStatus";
import SettingsDrawer, { SettingsPanelBody } from "../meta/SettingsDrawer";
import {
    FeedbackReminder,
    LaunchScreen,
    NewBadge,
    NoticeStack,
    ShellIcon,
    type Notice,
} from "./ShellChrome";

type OpenGroupsState = Record<AppNavGroupTitle, boolean>;

const DEFAULT_OPEN_GROUPS: OpenGroupsState = {
    General: false,
    "Core Tools": false,
    "Smart Tools": false,
    Accounting: false,
    Finance: false,
    "Managerial & Cost": false,
    "Business Math": false,
    Statistics: false,
};

const ROUTE_DRAFT_STORAGE_PREFIX = "accalc-route-draft";

function isPathActive(currentPath: string, itemPath: string) {
    if (itemPath === "/") return currentPath === "/";
    return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
}

function getSidebarTone(groupTitle: AppNavGroupTitle) {
    switch (groupTitle) {
        case "General":
            return "linear-gradient(135deg, rgba(220, 146, 71, 0.24), rgba(28, 121, 204, 0.08))";
        case "Core Tools":
            return "linear-gradient(135deg, rgba(28, 121, 204, 0.24), rgba(14, 148, 136, 0.08))";
        case "Smart Tools":
            return "linear-gradient(135deg, rgba(220, 146, 71, 0.2), rgba(14, 148, 136, 0.1))";
        case "Accounting":
            return "linear-gradient(135deg, rgba(14, 148, 136, 0.24), rgba(28, 121, 204, 0.08))";
        case "Finance":
            return "linear-gradient(135deg, rgba(28, 121, 204, 0.2), rgba(43, 70, 229, 0.1))";
        case "Managerial & Cost":
            return "linear-gradient(135deg, rgba(220, 146, 71, 0.18), rgba(43, 70, 229, 0.08))";
        case "Business Math":
            return "linear-gradient(135deg, rgba(43, 70, 229, 0.18), rgba(220, 146, 71, 0.08))";
        case "Statistics":
            return "linear-gradient(135deg, rgba(28, 121, 204, 0.2), rgba(14, 148, 136, 0.1))";
        default:
            return "linear-gradient(135deg, rgba(43, 70, 229, 0.16), rgba(14, 148, 136, 0.06))";
    }
}

function getDraftStorageKey(pathname: string) {
    return `${ROUTE_DRAFT_STORAGE_PREFIX}:${pathname}`;
}

function getNavLabel(route: { label: string; shortLabel?: string }) {
    return route.shortLabel ?? route.label;
}

function getGroupDisplayLabel(groupTitle: AppNavGroupTitle) {
    if (groupTitle === "Core Tools") return "Core";
    if (groupTitle === "Smart Tools") return "Smart";
    if (groupTitle === "Managerial & Cost") return "Mgmt & Cost";
    if (groupTitle === "Business Math") return "Business Math";
    return groupTitle;
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
            style={{
                background: "linear-gradient(180deg, var(--app-surface), var(--app-elevated))",
            }}
        >
            <div className="border-b app-divider px-4 py-3.5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <Link to="/" onClick={closeMobileSidebar} className="block">
                            <div className="app-chip-accent inline-flex items-center rounded-full px-2.5 py-1 text-[0.62rem]">
                                Release {APP_VERSION}
                            </div>
                            <div className="mt-3">
                                <AppBrandMark
                                    compact
                                    labelClassName="text-[color:var(--app-sidebar-text)]"
                                />
                            </div>
                        </Link>

                        <p className="mt-1.5 max-w-xs text-[0.76rem] leading-5 app-sidebar-group-hint">
                            Accounting, finance, and business tools with calmer offline-aware navigation.
                        </p>
                    </div>

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

            <div className="flex-1 overflow-y-auto px-2.5 py-3 scrollbar-premium">
                {pinnedRoutes.length > 0 ? (
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
                                        "app-sidebar-link flex items-center justify-between gap-3 rounded-[1.05rem] px-3.5 py-3 text-sm font-medium leading-5 transition duration-300",
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
                                    <span className="app-chip-accent rounded-full px-2.5 py-1 text-[0.62rem]">
                                        {availability.canOpen ? "Pin" : availability.label}
                                    </span>
                                </Link>
                                    );
                                })()
                            ))}
                        </div>
                    </div>
                ) : null}

                {mostUsedRoutes.length > 0 ? (
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

                {recentRoutes.length > 0 ? (
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
                                        "group app-sidebar-group flex w-full items-center gap-3 rounded-[1.1rem] px-3 py-2.5 text-left transition duration-300",
                                        groupHasActiveItem ? "app-sidebar-group-active" : "",
                                    ].join(" ")}
                                >
                                    <div
                                        className="app-sidebar-icon inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.95rem] text-[color:var(--app-sidebar-text)]"
                                        style={{ background: getSidebarTone(group.title) }}
                                    >
                                        <ShellIcon kind={group.title} className="h-[1rem] w-[1rem]" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <p className="app-sidebar-group-title truncate text-[0.9rem] font-semibold tracking-[-0.02em]">
                                                    {getGroupDisplayLabel(group.title)}
                                                </p>
                                                {hasUnseenItem ? <NewBadge /> : null}
                                            </div>
                                            <span className="app-chip rounded-full px-2.5 py-1">
                                                {group.items.length}
                                            </span>
                                        </div>
                                        <p className="app-sidebar-group-hint mt-0.5 text-[0.72rem] leading-5">
                                            {group.hint}
                                        </p>
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
                                                                                    "group/item app-sidebar-link flex items-center justify-between gap-3 rounded-[1rem] px-3 py-2.25 text-sm font-medium leading-5 transition duration-300",
                                                                                    isActive
                                                                                        ? "app-sidebar-link-active"
                                                                                        : "",
                                                                                    !availability.canOpen
                                                                                        ? "opacity-75"
                                                                                        : "",
                                                                                ].join(" ")}
                                                                                title={availability.reason}
                                                                            >
                                                                                <span className="app-sidebar-link-title min-w-0 truncate text-[0.88rem]">
                                                                                    {getNavLabel(item)}
                                                                                </span>
                                                                                {isNew ? (
                                                                                    <NewBadge />
                                                                                ) : (
                                                                                    <span
                                                                                        className={[
                                                                                            "app-sidebar-link-meta rounded-full px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.14em]",
                                                                                            isActive
                                                                                                ? "app-chip-accent"
                                                                                                : "",
                                                                                        ].join(" ")}
                                                                                    >
                                                                                        {isActive
                                                                                            ? "Open"
                                                                                            : availability.label}
                                                                                    </span>
                                                                                )}
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

            <div className="border-t app-divider px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="app-helper text-xs">Release</p>
                        <p className="text-sm font-semibold text-[color:var(--app-sidebar-text)]">
                            Version {APP_VERSION}
                        </p>
                    </div>
                    <Link
                        to="/history"
                        onClick={closeMobileSidebar}
                        className="app-button-ghost rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em]"
                    >
                        Activity
                    </Link>
                </div>
            </div>
        </div>
    );
}

function MobileNavButton({
    active,
    label,
    icon,
    onClick,
}: {
    active?: boolean;
    label: string;
    icon: ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
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

export default function AppLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const settings = useAppSettings();
    const activity = useAppActivity();
    const install = useInstallExperience();
    const network = useNetworkStatus();
    const offlineBundle = useOfflineBundleStatus();
    const update = useAppUpdateState();
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
    const [notices, setNotices] = useState<Notice[]>(() => {
        if (typeof window === "undefined") return [];

        const rawUpdateFlag = window.sessionStorage.getItem("accalc-update-banner");
        if (!rawUpdateFlag) return [];

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

        return [
            {
                id: `app-updated-${Date.now()}`,
                title: "App updated",
                message: `AccCalc ${activatedVersion} is now active with the latest calculator and interface improvements.`,
                tone: "success",
            },
        ];
    });
    const [bootVisible, setBootVisible] = useState<boolean>(() => settings.showOpeningAnimation);
    const [feedbackVisible, setFeedbackVisible] = useState<boolean>(false);
    const [sidebarResizeActive, setSidebarResizeActive] = useState<boolean>(false);

    const lastRecordedPathRef = useRef<string>("");
    const feedbackShownRef = useRef(false);
    const previousOnlineRef = useRef<boolean>(network.online);
    const previousStandaloneRef = useRef<boolean>(install.isStandalone);

    const mobileSidebarOpen = mobileSidebarRoute === location.pathname;
    const mobileSearchOpen = mobileSearchRoute === location.pathname;
    const settingsPanelOpen = settingsPanelRoute === location.pathname;
    const effectiveDesktopSidebarVisible = settings.rememberDesktopSidebarVisibility
        ? desktopSidebarVisible
        : true;
    const resolvedTheme =
        settings.themePreference === "system"
            ? systemPrefersDark
                ? "dark"
                : "light"
            : settings.themePreference;
    const pinnedRoutes = useMemo(() => getPinnedRoutes(activity), [activity]);
    const mostUsedRoutes = useMemo(() => getMostUsedRoutes(activity), [activity]);
    const recentRoutes = useMemo(() => getRecentRoutes(activity), [activity]);

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

    function pushNotice(title: string, message: string, tone: Notice["tone"] = "info") {
        const id = `${title}-${Date.now()}`;
        setNotices((current) => [...current, { id, title, message, tone }].slice(-4));
        window.setTimeout(() => {
            setNotices((current) => current.filter((notice) => notice.id !== id));
        }, 7000);
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
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches);

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    useEffect(() => {
        if (typeof document === "undefined") return;
        document.documentElement.dataset.theme = resolvedTheme;
        document.body.dataset.theme = resolvedTheme;
    }, [resolvedTheme]);

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
        const syncViewportInsets = () => {
            if (typeof window === "undefined" || !window.visualViewport) {
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

        syncViewportInsets();

        if (!window.visualViewport) {
            window.addEventListener("resize", syncViewportInsets);
            return () => {
                rootStyle.setProperty("--app-keyboard-inset", "0px");
                window.removeEventListener("resize", syncViewportInsets);
            };
        }

        window.visualViewport.addEventListener("resize", syncViewportInsets);
        window.visualViewport.addEventListener("scroll", syncViewportInsets);
        window.addEventListener("resize", syncViewportInsets);

        return () => {
            rootStyle.setProperty("--app-keyboard-inset", "0px");
            window.visualViewport?.removeEventListener("resize", syncViewportInsets);
            window.visualViewport?.removeEventListener("scroll", syncViewportInsets);
            window.removeEventListener("resize", syncViewportInsets);
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

        const handleError = (event: ErrorEvent) => {
            pushNotice(
                "Unexpected error",
                event.message || "Something went wrong while using the app.",
                "warning"
            );
        };

        const handleRejection = (event: PromiseRejectionEvent) => {
            const reason =
                typeof event.reason === "string"
                    ? event.reason
                    : event.reason?.message || "Unexpected background failure.";

            pushNotice("Action issue", reason, "warning");
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
    const themeButtonLabel =
        resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    const promptDockHidden = mobileSearchOpen || mobileSidebarOpen;

    return (
        <div className="min-h-screen bg-transparent text-[color:var(--app-text)]">
            <LaunchScreen visible={settings.showOpeningAnimation && bootVisible} />
            <NoticeStack
                notices={notices}
                onDismiss={(id) =>
                    setNotices((current) => current.filter((notice) => notice.id !== id))
                }
            />
            <FloatingPromptDock hidden={promptDockHidden}>
                <AppUpdatePrompt update={update} />
                <InstallPrompt blocked={update.updateReady} />
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

                <aside
                    className={[
                        "fixed inset-y-0 left-0 z-[92] w-[84vw] max-w-[19rem] border-r app-divider backdrop-blur-xl transition-transform duration-300 xl:hidden",
                        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
                    ].join(" ")}
                    style={{ background: "var(--app-sidebar-bg)" }}
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
                        "app-backdrop fixed inset-0 z-[91] transition duration-300 xl:hidden",
                        mobileSidebarOpen || mobileSearchOpen
                            ? "pointer-events-auto opacity-100"
                            : "pointer-events-none opacity-0",
                    ].join(" ")}
                />

                <div className="app-surface min-w-0 flex-1">
                    <header
                        ref={headerRef}
                        className="sticky top-0 z-[90] border-b app-divider backdrop-blur-xl"
                        style={{ background: "var(--app-header-bg)" }}
                    >
                        <div className="flex items-center justify-between gap-3 px-4 py-2 md:px-5 md:py-2.5">
                            <div className="min-w-0 flex-1 pr-2">
                                <div className="flex items-center gap-2">
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
                                <h2 className="mt-0.5 truncate text-[0.98rem] font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)] md:text-[1.08rem]">
                                    {currentMeta?.shortLabel ?? currentMeta?.label ?? "AccCalc"}
                                </h2>
                                <p className="app-clamp-1 mt-0.5 hidden text-[0.74rem] leading-5 app-helper xl:block">
                                    {currentMeta?.description ??
                                        "Accounting, finance, and business tools with calmer utility-first navigation."}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="hidden min-w-[12rem] flex-1 max-w-[18rem] md:block xl:max-w-[20rem]">
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
                                    label="Share AccCalc"
                                    title="Share AccCalc"
                                    variant="icon"
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
                                    onClick={() => setMobileSearchRoute(location.pathname)}
                                    aria-label="Open mobile search"
                                    title="Search"
                                    className="app-icon-button rounded-xl p-2.25 md:hidden"
                                >
                                    <ShellIcon kind="search" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSettingsPanelRoute((current) =>
                                            current === location.pathname ? null : location.pathname
                                        )
                                    }
                                    aria-label={settingsPanelOpen ? "Close settings" : "Open settings"}
                                    title={settingsPanelOpen ? "Close settings" : "Open settings"}
                                    className={settingsButtonClass}
                                >
                                    <ShellIcon kind="settings" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setMobileSidebarRoute(location.pathname)}
                                    aria-label="Open menu"
                                    className="app-icon-button rounded-xl p-2.25 xl:hidden"
                                >
                                    <ShellIcon kind="menu" />
                                </button>
                            </div>
                        </div>
                    </header>

                    {!network.online ? (
                        <div className="border-b app-divider px-4 py-2.5 md:px-5">
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
                        className="px-4 pt-2.5 md:px-5 md:pb-6 md:pt-4"
                        style={{
                            paddingBottom:
                                "calc(var(--app-mobile-nav-height, 0px) + env(safe-area-inset-bottom, 0px) + 1.35rem)",
                        }}
                    >
                        <div className="app-page-shell animate-[fade-rise_0.42s_ease-out]">
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
                        width: settingsPanelOpen ? "min(34rem, 38vw)" : "0px",
                        opacity: settingsPanelOpen ? 1 : 0,
                    }}
                    aria-hidden={!settingsPanelOpen}
                >
                    <aside
                        className="app-panel-elevated h-screen rounded-none border-y-0 border-r-0 shadow-none"
                        style={{
                            width: "min(34rem, 38vw)",
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
                    "fixed inset-x-3 bottom-3 z-[95] xl:hidden",
                    mobileSearchOpen ? "pointer-events-none opacity-0" : "",
                ].join(" ")}
            >
                <div className="app-panel rounded-[1.6rem] p-2 shadow-[var(--app-shadow-lg)]">
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
                        />
                        <MobileNavButton
                            label="Search"
                            icon={<ShellIcon kind="search" className="h-5 w-5" />}
                            onClick={() => setMobileSearchRoute(location.pathname)}
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
                            onClick={() => setMobileSidebarRoute(location.pathname)}
                        />
                    </div>
                </div>
            </div>

            <div
                className={[
                    "fixed inset-x-3 top-[calc(var(--app-header-height)+0.75rem)] z-[96] transition duration-300 md:hidden",
                    mobileSearchOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
                ].join(" ")}
            >
                <div className="app-search-panel rounded-[1.6rem] p-3">
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
                    <FeatureSearch
                        key={`mobile-${location.pathname}`}
                        variant="hero"
                        autoFocus
                        placeholder="Search ratios, depreciation, inventory..."
                    />
                </div>
            </div>

            <ReturnToTopButton />
            <SettingsDrawer open={settingsPanelOpen} onClose={() => setSettingsPanelRoute(null)} />
        </div>
    );
}
