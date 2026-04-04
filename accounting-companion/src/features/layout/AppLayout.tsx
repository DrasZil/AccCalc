import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
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
import { useAppSettings } from "../../utils/appSettings";
import SettingsDrawer from "../meta/SettingsDrawer";
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
    Finance: false,
    Business: false,
    Accounting: false,
};

function isPathActive(currentPath: string, itemPath: string) {
    if (itemPath === "/") return currentPath === "/";
    return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
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
        <div className="flex h-full flex-col bg-[linear-gradient(180deg,rgba(8,15,11,0.99),rgba(5,7,7,0.99))]">
            <div className="border-b border-white/10 px-4 py-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <Link to="/" onClick={closeMobileSidebar} className="block">
                            <div className="inline-flex items-center rounded-full border border-green-400/15 bg-green-500/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-green-300">
                                Study workspace
                            </div>
                            <h1 className="mt-3 truncate text-2xl font-bold tracking-tight text-white">
                                AccCalc
                            </h1>
                        </Link>

                        <p className="mt-2 max-w-xs text-sm leading-6 text-gray-400">
                            Finance, business, and accounting tools with guided interpretation, offline history, and cleaner study flow.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={closeMobileSidebar}
                        aria-label="Close sidebar"
                        className="inline-flex rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-white transition hover:bg-white/[0.08] xl:hidden"
                    >
                        <ShellIcon kind="close" />
                    </button>
                </div>
            </div>

            <div className="border-b border-white/10 px-4 py-4">
                <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-3">
                    <p className="text-[0.65rem] uppercase tracking-[0.18em] text-gray-500">
                        Available tools
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="text-lg font-semibold text-white">{toolCount}</p>
                        <p className="text-xs leading-5 text-gray-400">
                            Grouped by general, core, smart, finance, business, and accounting.
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
                                        "group flex w-full items-center gap-3 rounded-[1.35rem] border px-4 py-3 text-left transition duration-300",
                                        groupHasActiveItem
                                            ? "border-green-400/25 bg-green-500/10 text-green-100"
                                            : "border-white/10 bg-white/[0.04] text-white hover:border-white/15 hover:bg-white/[0.07]",
                                    ].join(" ")}
                                >
                                    <div
                                        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${group.tone} text-white`}
                                    >
                                        <ShellIcon
                                            kind={group.title}
                                            className="h-[1.125rem] w-[1.125rem]"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <p className="truncate text-sm font-semibold">
                                                    {group.title}
                                                </p>
                                                {hasUnseenItem ? <NewBadge /> : null}
                                            </div>
                                            <span className="rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.18em] text-gray-400">
                                                {group.items.length}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs leading-5 text-gray-400">
                                            {group.hint}
                                        </p>
                                    </div>

                                    <span
                                        className={`shrink-0 transition duration-300 ${
                                            groupIsOpen ? "rotate-0" : "-rotate-90"
                                        }`}
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
                                        <div className="ml-5 border-l border-white/10 pl-4 pt-2">
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
                                                                "group/item flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-medium leading-5 transition duration-300",
                                                                isActive
                                                                    ? "bg-green-500/15 text-green-300 ring-1 ring-green-400/20"
                                                                    : "bg-white/[0.03] text-gray-100 hover:bg-white/[0.06] hover:text-white",
                                                            ].join(" ")}
                                                        >
                                                            <span className="min-w-0 truncate">
                                                                {item.label}
                                                            </span>
                                                            {isNew ? (
                                                                <NewBadge />
                                                            ) : (
                                                                <span
                                                                    className={[
                                                                        "rounded-full px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.18em]",
                                                                        isActive
                                                                            ? "bg-green-400/10 text-green-300"
                                                                            : "text-gray-500 group-hover/item:text-gray-300",
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

            <div className="border-t border-white/10 p-4">
                <p className="text-xs leading-6 text-gray-500">
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

    const [mobileSidebarRoute, setMobileSidebarRoute] = useState<string | null>(null);
    const [desktopSidebarVisible, setDesktopSidebarVisible] = useState<boolean>(() => {
        if (typeof window === "undefined") return true;

        const saved = window.localStorage.getItem("accalc-desktop-sidebar-visible");
        return saved === null ? true : saved === "true";
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
    const settingsPanelOpen =
        settingsPanelRoute === location.pathname || location.pathname.startsWith("/settings");
    const effectiveDesktopSidebarVisible = settings.rememberDesktopSidebarVisibility
        ? desktopSidebarVisible
        : true;
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
        "inline-flex rounded-xl border p-2.5 text-white transition duration-300",
        settingsPanelOpen
            ? "border-green-400/20 bg-green-500/15 text-green-300"
            : "border-white/10 bg-white/[0.05] hover:bg-white/[0.08]",
    ].join(" ");

    return (
        <div className="min-h-screen bg-transparent text-white">
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
                    <aside className="sticky top-0 hidden h-screen w-80 shrink-0 border-r border-white/10 bg-[#0a0a0a]/85 backdrop-blur-xl xl:block">
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
                        "fixed inset-y-0 left-0 z-[70] w-[88vw] max-w-[21rem] border-r border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl transition-transform duration-300 xl:hidden",
                        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
                    ].join(" ")}
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
                        "fixed inset-0 z-[60] bg-black/60 transition duration-300 xl:hidden",
                        mobileSidebarOpen
                            ? "pointer-events-auto opacity-100"
                            : "pointer-events-none opacity-0",
                    ].join(" ")}
                />

                <div className="min-w-0 flex-1">
                    <header className="sticky top-0 z-[80] border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-3 px-4 py-2.5 md:px-6 md:py-3">
                            <div className="min-w-0">
                                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-green-300 md:text-[0.68rem]">
                                    {currentMeta?.category ?? "Accounting companion"}
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                    <h2 className="truncate text-sm font-bold tracking-tight text-white sm:text-base md:text-xl">
                                        {currentMeta?.label ??
                                            "Learn faster. Calculate with confidence."}
                                    </h2>
                                    {unseenCount > 0 && location.pathname !== "/history" ? (
                                        <Link
                                            to="/history"
                                            className="hidden rounded-full border border-green-400/15 bg-green-500/10 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-green-300 sm:inline-flex"
                                        >
                                            {unseenCount} new
                                        </Link>
                                    ) : null}
                                </div>
                                <p className="mt-1 hidden text-xs leading-5 text-gray-500 md:block">
                                    {currentMeta?.description ??
                                        "Cleaner accounting, business, and finance tools for study and practical work."}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    to="/history"
                                    aria-label="Open history"
                                    title="History"
                                    className="hidden rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-white transition duration-300 hover:bg-white/[0.08] md:inline-flex"
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
                                    className="hidden rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-white transition duration-300 hover:bg-white/[0.08] xl:inline-flex"
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
                                    className="rounded-xl border border-white/10 bg-white/[0.05] p-2.5 text-white transition duration-300 hover:bg-white/[0.08] xl:hidden"
                                >
                                    <ShellIcon kind="menu" />
                                </button>
                            </div>
                        </div>
                    </header>

                    <main className="px-4 py-5 md:px-6 md:py-7">
                        <div className="mx-auto w-full max-w-7xl animate-[fade-rise_0.42s_ease-out]">
                            <Outlet />
                        </div>
                    </main>

                    {settings.showInstallPrompt ? (
                        <div className="px-4 pb-6 md:px-6">
                            <div className="mx-auto w-full max-w-7xl">
                                <InstallPrompt />
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            <SettingsDrawer
                open={settingsPanelOpen}
                onClose={() => setSettingsPanelRoute(null)}
            />
        </div>
    );
}
