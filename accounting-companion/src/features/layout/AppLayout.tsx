import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import FeatureSearch from "../../components/FeatureSearch";
import InstallPrompt from "../../components/InstallPrompt";
import {
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
    getRouteMeta,
    type AppNavGroupTitle,
} from "../../utils/appCatalog";
import { updateAppSettings, useAppSettings } from "../../utils/appSettings";
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

function isPathActive(currentPath: string, itemPath: string) {
    if (itemPath === "/") return currentPath === "/";
    return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
}

function getSidebarTone(groupTitle: AppNavGroupTitle) {
    switch (groupTitle) {
        case "General":
            return "linear-gradient(135deg, rgba(244, 184, 96, 0.24), rgba(176, 124, 255, 0.06))";
        case "Core Tools":
            return "linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(176, 124, 255, 0.05))";
        case "Smart Tools":
            return "linear-gradient(135deg, rgba(244, 184, 96, 0.22), rgba(61, 214, 181, 0.08))";
        case "Accounting":
            return "linear-gradient(135deg, rgba(61, 214, 181, 0.22), rgba(176, 124, 255, 0.06))";
        case "Finance":
            return "linear-gradient(135deg, rgba(176, 124, 255, 0.22), rgba(96, 165, 250, 0.07))";
        case "Managerial & Cost":
            return "linear-gradient(135deg, rgba(244, 184, 96, 0.18), rgba(96, 165, 250, 0.06))";
        case "Business Math":
            return "linear-gradient(135deg, rgba(176, 124, 255, 0.18), rgba(244, 184, 96, 0.08))";
        case "Statistics":
            return "linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(61, 214, 181, 0.08))";
        default:
            return "linear-gradient(135deg, rgba(176, 124, 255, 0.16), rgba(61, 214, 181, 0.06))";
    }
}

type SidebarContentProps = {
    locationPathname: string;
    openGroups: OpenGroupsState;
    toggleGroup: (groupTitle: AppNavGroupTitle) => void;
    closeMobileSidebar: () => void;
    showNewIndicators: boolean;
    seenNewPaths: string[];
};

function SidebarContent({
    locationPathname,
    openGroups,
    toggleGroup,
    closeMobileSidebar,
    showNewIndicators,
    seenNewPaths,
}: SidebarContentProps) {
    const toolCount = APP_NAV_GROUPS.reduce((total, group) => total + group.items.length, 0);

    return (
        <div
            className="flex h-full flex-col"
            style={{ background: "linear-gradient(180deg, var(--app-surface), var(--app-elevated))" }}
        >
            <div className="border-b app-divider px-4 py-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <Link to="/" onClick={closeMobileSidebar} className="block">
                            <div className="app-chip-accent inline-flex items-center rounded-full px-3 py-1">
                                Study workspace
                            </div>
                            <h1 className="mt-3 truncate text-[1.9rem] font-bold tracking-[var(--app-letter-tight)] text-[color:var(--app-sidebar-text)]">
                                AccCalc
                            </h1>
                        </Link>

                        <p className="mt-2 max-w-xs text-[0.94rem] leading-7 app-sidebar-group-hint">
                            Finance, business, and accounting tools with guided interpretation, offline history, and cleaner study flow.
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

            <div className="border-b app-divider px-4 py-4">
                <div className="app-subtle-surface rounded-[1.35rem] px-4 py-3">
                    <p className="app-section-kicker">
                        Available tools
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="app-metric-value text-[1.5rem]">{toolCount}</p>
                        <p className="max-w-[13rem] text-[0.82rem] leading-5 app-sidebar-group-hint">
                            Grouped by accounting, finance, managerial and cost, business math, and statistics.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 scrollbar-premium">
                <nav className="space-y-4">
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
                                        "group app-sidebar-group flex w-full items-center gap-3 rounded-[1.35rem] px-4 py-3.5 text-left transition duration-300",
                                        groupHasActiveItem ? "app-sidebar-group-active" : "",
                                    ].join(" ")}
                                >
                                    <div
                                        className="app-sidebar-icon inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-[color:var(--app-sidebar-text)]"
                                        style={{ background: getSidebarTone(group.title) }}
                                    >
                                        <ShellIcon
                                            kind={group.title}
                                            className="h-[1.125rem] w-[1.125rem]"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <p className="app-sidebar-group-title truncate text-[0.96rem] font-semibold tracking-[-0.02em]">
                                                    {group.title}
                                                </p>
                                                {hasUnseenItem ? <NewBadge /> : null}
                                            </div>
                                            <span className="app-chip rounded-full px-2.5 py-1">
                                                {group.items.length}
                                            </span>
                                        </div>
                                        <p className="app-sidebar-group-hint mt-1 text-[0.82rem] leading-5">
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
                                            ? "mt-2 grid-rows-[1fr] opacity-100"
                                            : "grid-rows-[0fr] opacity-0",
                                    ].join(" ")}
                                >
                                    <div className="min-h-0 overflow-hidden">
                                        <div className="ml-5 border-l app-divider pl-4 pt-2">
                                            <div className="space-y-2">
                                                {group.items.map((item) => {
                                                    const isActive = isPathActive(
                                                        locationPathname,
                                                        item.path
                                                    );
                                                    const isNew =
                                                        showNewIndicators &&
                                                        NEW_FEATURE_PATHS.has(item.path) &&
                                                        !seenNewPaths.includes(item.path);

                                                    return (
                                                        <Link
                                                            key={item.path}
                                                            to={item.path}
                                                            onClick={closeMobileSidebar}
                                                            className={[
                                                                "group/item app-sidebar-link flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium leading-5 transition duration-300",
                                                                isActive
                                                                    ? "app-sidebar-link-active"
                                                                    : "",
                                                            ].join(" ")}
                                                        >
                                                            <span className="app-sidebar-link-title min-w-0 truncate">
                                                                {item.label}
                                                            </span>
                                                            {isNew ? (
                                                                <NewBadge />
                                                            ) : (
                                                                <span
                                                                    className={[
                                                                        "app-sidebar-link-meta rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em]",
                                                                        isActive
                                                                            ? "app-chip-accent"
                                                                            : "",
                                                                    ].join(" ")}
                                                                >
                                                                    {isActive
                                                                        ? "Open"
                                                                        : item.shortLabel ?? "Tool"}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t app-divider p-4">
                <p className="app-sidebar-footer text-xs leading-6">
                    Collapsed-first navigation with group counts, new markers, and offline history support.
                </p>
            </div>
        </div>
    );
}

export default function AppLayout() {
    const location = useLocation();
    const settings = useAppSettings();
    const activity = useAppActivity();
    const currentMeta = getRouteMeta(location.pathname);
    const headerRef = useRef<HTMLElement | null>(null);

    const [mobileSidebarRoute, setMobileSidebarRoute] = useState<string | null>(null);
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
        return [
            {
                id: `app-updated-${Date.now()}`,
                title: "App updated",
                message:
                    "AccCalc refreshed to the latest deployed version. Your installed app should now match the newest release.",
                tone: "success",
            },
        ];
    });
    const [bootVisible, setBootVisible] = useState<boolean>(() => settings.showOpeningAnimation);
    const [feedbackVisible, setFeedbackVisible] = useState<boolean>(false);

    const lastRecordedPathRef = useRef<string>("");
    const feedbackShownRef = useRef(false);

    const mobileSidebarOpen = mobileSidebarRoute === location.pathname;
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
        if (typeof document === "undefined") return;
        document.body.dataset.motion = settings.enableMotionEffects ? "on" : "off";
    }, [settings.enableMotionEffects]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (event: MediaQueryListEvent) => {
            setSystemPrefersDark(event.matches);
        };

        setSystemPrefersDark(mediaQuery.matches);
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
        if (!shouldShowFeedbackReminder(activity, settings.showFeedbackReminders)) return;
        if (feedbackShownRef.current) return;

        feedbackShownRef.current = true;
        noteFeedbackReminderShown();

        const timer = window.setTimeout(() => {
            setFeedbackVisible(true);
        }, 0);

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

    function toggleGroup(groupTitle: AppNavGroupTitle) {
        setOpenGroups((current) => ({
            ...current,
            [groupTitle]: !current[groupTitle],
        }));
    }

    const settingsButtonClass = [
        "app-icon-button inline-flex rounded-xl p-2.5",
        settingsPanelOpen
            ? "border-[color:var(--app-border-strong)] bg-[var(--app-accent-soft)] text-[color:var(--app-accent)]"
            : "",
    ].join(" ");
    const themeButtonLabel =
        resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";

    return (
        <div className="min-h-screen bg-transparent text-[color:var(--app-text)]">
            <LaunchScreen visible={settings.showOpeningAnimation && bootVisible} />
            <NoticeStack
                notices={notices}
                onDismiss={(id) =>
                    setNotices((current) => current.filter((notice) => notice.id !== id))
                }
            />
            <FeedbackReminder
                visible={feedbackVisible}
                onClose={() => setFeedbackVisible(false)}
            />

            <div className="flex min-h-screen items-start">
                {effectiveDesktopSidebarVisible ? (
                    <aside
                        className="sticky top-0 hidden h-screen w-80 shrink-0 border-r app-divider backdrop-blur-xl xl:block"
                        style={{ background: "var(--app-sidebar-bg)" }}
                    >
                        <SidebarContent
                            locationPathname={location.pathname}
                            openGroups={effectiveOpenGroups}
                            toggleGroup={toggleGroup}
                            closeMobileSidebar={() => setMobileSidebarRoute(null)}
                            showNewIndicators={settings.showNewFeatureIndicators}
                            seenNewPaths={activity.seenNewPaths}
                        />
                    </aside>
                ) : null}

                <aside
                    className={[
                        "fixed inset-y-0 left-0 z-[92] w-[88vw] max-w-[21rem] border-r app-divider backdrop-blur-xl transition-transform duration-300 xl:hidden",
                        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
                    ].join(" ")}
                    style={{ background: "var(--app-sidebar-bg)" }}
                >
                    <SidebarContent
                        locationPathname={location.pathname}
                        openGroups={effectiveOpenGroups}
                        toggleGroup={toggleGroup}
                        closeMobileSidebar={() => setMobileSidebarRoute(null)}
                        showNewIndicators={settings.showNewFeatureIndicators}
                        seenNewPaths={activity.seenNewPaths}
                    />
                </aside>

                <button
                    type="button"
                    onClick={() => setMobileSidebarRoute(null)}
                    aria-label="Close sidebar overlay"
                    className={[
                        "app-backdrop fixed inset-0 z-[91] transition duration-300 xl:hidden",
                        mobileSidebarOpen
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
                        <div className="flex items-center justify-between gap-3 px-4 py-2.5 md:px-6 md:py-3">
                            <div className="min-w-0">
                                <p className="app-kicker text-[0.64rem] md:text-[0.68rem]">
                                    {currentMeta?.category ?? "Accounting companion"}
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                    <h2 className="truncate text-base font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)] sm:text-lg md:text-[1.35rem]">
                                        {currentMeta?.label ??
                                            "Learn faster. Calculate with confidence."}
                                    </h2>
                                    {unseenCount > 0 && location.pathname !== "/history" ? (
                                        <Link
                                            to="/history"
                                            className="app-badge-new hidden rounded-full px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em] sm:inline-flex"
                                        >
                                            {unseenCount} new
                                        </Link>
                                    ) : null}
                                </div>
                                <p className="mt-1 hidden text-[0.82rem] leading-5 app-helper md:block">
                                    {currentMeta?.description ??
                                        "Cleaner accounting, business, and finance tools for study and practical work."}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    to="/history"
                                    aria-label="Open history"
                                    title="History"
                                    className="app-icon-button hidden rounded-xl p-2.5 md:inline-flex"
                                >
                                    <ShellIcon kind="history" />
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => setDesktopSidebarVisible((current) => !current)}
                                    aria-label={
                                        effectiveDesktopSidebarVisible
                                            ? "Hide sidebar"
                                            : "Show sidebar"
                                    }
                                    title={
                                        effectiveDesktopSidebarVisible
                                            ? "Hide sidebar"
                                            : "Show sidebar"
                                    }
                                    className="app-icon-button hidden rounded-xl p-2.5 xl:inline-flex"
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
                                    className="app-icon-button hidden rounded-xl p-2.5 md:inline-flex"
                                >
                                    <ShellIcon
                                        kind={
                                            resolvedTheme === "dark"
                                                ? "theme-light"
                                                : "theme-dark"
                                        }
                                    />
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSettingsPanelRoute((current) =>
                                            current === location.pathname ? null : location.pathname
                                        )
                                    }
                                    aria-label={
                                        settingsPanelOpen ? "Close settings" : "Open settings"
                                    }
                                    title={settingsPanelOpen ? "Close settings" : "Open settings"}
                                    className={settingsButtonClass}
                                >
                                    <ShellIcon kind="settings" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setMobileSidebarRoute(location.pathname)}
                                    aria-label="Open menu"
                                    className="app-icon-button rounded-xl p-2.5 xl:hidden"
                                >
                                    <ShellIcon kind="menu" />
                                </button>
                            </div>
                        </div>
                        <div className="px-4 pb-3 md:px-6">
                            <FeatureSearch />
                        </div>
                    </header>

                    <main className="px-4 py-5 md:px-6 md:py-7">
                        <div className="app-page-shell animate-[fade-rise_0.42s_ease-out]">
                            <Outlet />
                        </div>
                    </main>

                    {settings.showInstallPrompt ? (
                        <div className="px-4 pb-6 md:px-6">
                            <div className="app-page-shell">
                                <InstallPrompt />
                            </div>
                        </div>
                    ) : null}
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
                            transform: settingsPanelOpen
                                ? "translateX(0)"
                                : "translateX(2rem)",
                            transition:
                                "transform 280ms ease, opacity 220ms ease, width 280ms ease",
                        }}
                    >
                        <SettingsPanelBody onClose={() => setSettingsPanelRoute(null)} />
                    </aside>
                </div>
            </div>

            <SettingsDrawer
                open={settingsPanelOpen}
                onClose={() => setSettingsPanelRoute(null)}
            />
        </div>
    );
}
