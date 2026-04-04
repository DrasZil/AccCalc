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

const ROUTE_DRAFT_STORAGE_PREFIX = "accalc-route-draft";

function getDraftStorageKey(pathname: string) {
    return `${ROUTE_DRAFT_STORAGE_PREFIX}:${pathname}`;
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
    if (field instanceof HTMLInputElement && (field.type === "checkbox" || field.type === "radio")) {
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
};

function SidebarContent({
    locationPathname,
    openGroups,
    toggleGroup,
    closeMobileSidebar,
    showNewIndicators,
    seenNewPaths,
}: SidebarContentProps) {
    return (
        <div
            className="flex h-full flex-col"
            style={{ background: "linear-gradient(180deg, var(--app-surface), var(--app-elevated))" }}
        >
            <div className="border-b app-divider px-4 py-3.5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <Link to="/" onClick={closeMobileSidebar} className="block">
                            <div className="app-chip-accent inline-flex items-center rounded-full px-2.5 py-1 text-[0.62rem]">
                                Study workspace
                            </div>
                            <h1 className="mt-2 truncate text-[1.55rem] font-bold tracking-[var(--app-letter-tight)] text-[color:var(--app-sidebar-text)]">
                                AccCalc
                            </h1>
                        </Link>

                        <p className="mt-1.5 max-w-xs text-[0.8rem] leading-5 app-sidebar-group-hint">
                            Accounting, finance, business math, and study helpers in one cleaner workspace.
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
                                        "group app-sidebar-group flex w-full items-center gap-3 rounded-[1.2rem] px-3.5 py-3 text-left transition duration-300",
                                        groupHasActiveItem ? "app-sidebar-group-active" : "",
                                    ].join(" ")}
                                >
                                    <div
                                        className="app-sidebar-icon inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[1.05rem] text-[color:var(--app-sidebar-text)]"
                                        style={{ background: getSidebarTone(group.title) }}
                                    >
                                        <ShellIcon
                                            kind={group.title}
                                            className="h-[1rem] w-[1rem]"
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <p className="app-sidebar-group-title truncate text-[0.92rem] font-semibold tracking-[-0.02em]">
                                                    {group.title}
                                                </p>
                                                {hasUnseenItem ? <NewBadge /> : null}
                                            </div>
                                            <span className="app-chip rounded-full px-2.5 py-1">
                                                {group.items.length}
                                            </span>
                                        </div>
                                        <p className="app-sidebar-group-hint mt-1 text-[0.76rem] leading-5">
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
                                            <div className="space-y-1.5">
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
                                                                "group/item app-sidebar-link flex items-center justify-between gap-3 rounded-[1.05rem] px-3.5 py-2.5 text-sm font-medium leading-5 transition duration-300",
                                                                isActive
                                                                    ? "app-sidebar-link-active"
                                                                    : "",
                                                            ].join(" ")}
                                                        >
                                                            <span className="app-sidebar-link-title min-w-0 truncate text-[0.9rem]">
                                                                {item.label}
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


        </div>
    );
}

export default function AppLayout() {
    const location = useLocation();
    const settings = useAppSettings();
    const activity = useAppActivity();
    const currentMeta = getRouteMeta(location.pathname);
    const headerRef = useRef<HTMLElement | null>(null);
    const mainRef = useRef<HTMLElement | null>(null);

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
    function toggleGroup(groupTitle: AppNavGroupTitle) {
        setOpenGroups((current) => ({
            ...current,
            [groupTitle]: !current[groupTitle],
        }));
    }

    const settingsButtonClass = [
        "app-icon-button inline-flex rounded-xl p-2.25",
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
                        className="sticky top-0 hidden h-screen w-[18.75rem] shrink-0 border-r app-divider backdrop-blur-xl xl:block"
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
                        "fixed inset-y-0 left-0 z-[92] w-[84vw] max-w-[18.75rem] border-r app-divider backdrop-blur-xl transition-transform duration-300 xl:hidden",
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
                        <div className="flex items-center justify-between gap-3 px-4 py-2 md:px-5 md:py-2.5">
                            <div className="min-w-0 flex-1 pr-2">
                                <p className="app-kicker hidden text-[0.62rem] sm:block">
                                    {currentMeta?.category ?? "Accounting companion"}
                                </p>
                                <div className="flex items-center gap-2">
                                    <h2 className="truncate text-[1rem] font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)] md:text-[1.12rem]">
                                        {currentMeta?.label ??
                                            "Learn faster. Calculate with confidence."}
                                    </h2>
                                    {unseenCount > 0 && location.pathname !== "/history" ? (
                                        <Link
                                            to="/history"
                                            className="app-badge-new hidden rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] lg:inline-flex"
                                        >
                                            {unseenCount} new
                                        </Link>
                                    ) : null}
                                </div>
                                <p className="mt-0.5 hidden text-[0.76rem] leading-5 app-helper xl:block">
                                    {currentMeta?.description ??
                                        "Cleaner accounting, business, and finance tools for study and practical work."}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div
                                    data-header-search
                                    className="hidden min-w-[12rem] flex-1 max-w-[16rem] md:block lg:max-w-[18rem] xl:max-w-[20rem]"
                                >
                                    <FeatureSearch
                                        className="w-full"
                                        placeholder="Search tools"
                                    />
                                </div>

                                <Link
                                    to="/history"
                                    aria-label="Open history"
                                    title="History"
                                    className="app-icon-button hidden rounded-xl p-2.25 md:inline-flex"
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
                                    className="app-icon-button rounded-xl p-2.25 xl:hidden"
                                >
                                    <ShellIcon kind="menu" />
                                </button>
                            </div>
                        </div>
                    </header>

                    <main ref={mainRef} className="px-4 py-4 md:px-5 md:py-6">
                        <div className="app-page-shell animate-[fade-rise_0.42s_ease-out]">
                            <Outlet />
                        </div>
                    </main>

                    {settings.showInstallPrompt ? (
                        <div className="px-4 pb-6 md:px-5">
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







