import { useSyncExternalStore } from "react";
import { APP_NAV_GROUPS, APP_ROUTE_META, type RouteMeta } from "./appCatalog";

export type ActivityKind = "visit" | "smart" | "calculator" | "system";

export type ActivityEntry = {
    id: string;
    at: number;
    path: string;
    title: string;
    category: string;
    summary: string;
    kind: ActivityKind;
};

export type SavedToolRecord = {
    id: string;
    at: number;
    title: string;
    path: string;
    input: string;
    result?: string;
    category: string;
};

export type AppActivityState = {
    version: 1;
    launches: number;
    lastOpenedAt: number;
    lastFeedbackPromptAt: number;
    feedbackDismissedUntil: number;
    feedbackDismissedForever: boolean;
    seenNewPaths: string[];
    pinnedPaths: string[];
    toolUsage: Record<string, number>;
    recent: ActivityEntry[];
    savedRecords: SavedToolRecord[];
};

const STORAGE_KEY = "accalc-app-activity";
const UPDATED_EVENT = "accalc-app-activity-updated";
const MAX_RECENT = 80;
const MAX_SAVED = 40;
let cachedActivityRaw: string | null | undefined;
let cachedActivitySnapshot: AppActivityState;

const DEFAULT_ACTIVITY_STATE: AppActivityState = {
    version: 1,
    launches: 0,
    lastOpenedAt: 0,
    lastFeedbackPromptAt: 0,
    feedbackDismissedUntil: 0,
    feedbackDismissedForever: false,
    seenNewPaths: [],
    pinnedPaths: [],
    toolUsage: {},
    recent: [],
    savedRecords: [],
};

cachedActivitySnapshot = DEFAULT_ACTIVITY_STATE;

function sanitizeActivity(
    value: Partial<AppActivityState> | null | undefined
): AppActivityState {
    return {
        version: 1,
        launches: typeof value?.launches === "number" ? value.launches : 0,
        lastOpenedAt: typeof value?.lastOpenedAt === "number" ? value.lastOpenedAt : 0,
        lastFeedbackPromptAt:
            typeof value?.lastFeedbackPromptAt === "number" ? value.lastFeedbackPromptAt : 0,
        feedbackDismissedUntil:
            typeof value?.feedbackDismissedUntil === "number"
                ? value.feedbackDismissedUntil
                : 0,
        feedbackDismissedForever: value?.feedbackDismissedForever ?? false,
        seenNewPaths: Array.isArray(value?.seenNewPaths)
            ? value.seenNewPaths.filter((item): item is string => typeof item === "string")
            : [],
        pinnedPaths: Array.isArray(value?.pinnedPaths)
            ? value.pinnedPaths.filter((item): item is string => typeof item === "string").slice(0, 8)
            : [],
        toolUsage:
            typeof value?.toolUsage === "object" && value.toolUsage
                ? Object.fromEntries(
                    Object.entries(value.toolUsage).filter(
                        ([key, count]) => typeof key === "string" && typeof count === "number"
                    )
                )
                : {},
        recent: Array.isArray(value?.recent)
            ? value.recent
                .filter(
                    (item): item is ActivityEntry =>
                        Boolean(
                            item &&
                                typeof item.id === "string" &&
                                typeof item.path === "string" &&
                                typeof item.title === "string" &&
                                typeof item.summary === "string" &&
                                typeof item.category === "string" &&
                                typeof item.at === "number" &&
                                typeof item.kind === "string"
                        )
                )
                .slice(0, MAX_RECENT)
            : [],
        savedRecords: Array.isArray(value?.savedRecords)
            ? value.savedRecords
                .filter(
                    (item): item is SavedToolRecord =>
                        Boolean(
                            item &&
                                typeof item.id === "string" &&
                                typeof item.title === "string" &&
                                typeof item.path === "string" &&
                                typeof item.input === "string" &&
                                typeof item.category === "string" &&
                                typeof item.at === "number"
                        )
                )
                .slice(0, MAX_SAVED)
            : [],
    };
}

export function readAppActivity(): AppActivityState {
    if (typeof window === "undefined") return DEFAULT_ACTIVITY_STATE;

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw === cachedActivityRaw) {
            return cachedActivitySnapshot;
        }

        if (!raw) {
            cachedActivityRaw = raw;
            cachedActivitySnapshot = DEFAULT_ACTIVITY_STATE;
            return cachedActivitySnapshot;
        }

        cachedActivityRaw = raw;
        cachedActivitySnapshot = sanitizeActivity(
            JSON.parse(raw) as Partial<AppActivityState>
        );
        return cachedActivitySnapshot;
    } catch {
        cachedActivityRaw = null;
        cachedActivitySnapshot = DEFAULT_ACTIVITY_STATE;
        return cachedActivitySnapshot;
    }
}

function writeAppActivity(nextValue: AppActivityState) {
    if (typeof window === "undefined") return;

    const serializedActivity = JSON.stringify(nextValue);
    cachedActivityRaw = serializedActivity;
    cachedActivitySnapshot = nextValue;
    window.localStorage.setItem(STORAGE_KEY, serializedActivity);
    window.dispatchEvent(new Event(UPDATED_EVENT));
}

export function updateAppActivity(
    updater: (current: AppActivityState) => AppActivityState
) {
    if (typeof window === "undefined") return;
    writeAppActivity(updater(readAppActivity()));
}

function subscribe(callback: () => void) {
    if (typeof window === "undefined") return () => undefined;

    const handle = () => callback();
    window.addEventListener("storage", handle);
    window.addEventListener(UPDATED_EVENT, handle);

    return () => {
        window.removeEventListener("storage", handle);
        window.removeEventListener(UPDATED_EVENT, handle);
    };
}

export function useAppActivity(): AppActivityState {
    return useSyncExternalStore(subscribe, readAppActivity, () => DEFAULT_ACTIVITY_STATE);
}

function resolveMeta(path: string): RouteMeta | null {
    return APP_ROUTE_META.find((item) => item.path === path) ?? null;
}

export function recordAppLaunch() {
    updateAppActivity((current) => ({
        ...current,
        launches: current.launches + 1,
        lastOpenedAt: Date.now(),
    }));
}

export function recordToolVisit(
    path: string,
    options?: { title?: string; summary?: string; kind?: ActivityKind }
) {
    const meta = resolveMeta(path);
    const title = options?.title ?? meta?.label ?? "Visited tool";
    const category = meta?.category ?? "General";
    const summary = options?.summary ?? meta?.description ?? "Opened this page.";
    const kind = options?.kind ?? "visit";

    updateAppActivity((current) => {
        const usageCount = (current.toolUsage[path] ?? 0) + 1;
        const nextEntry: ActivityEntry = {
            id: `${path}-${Date.now()}`,
            at: Date.now(),
            path,
            title,
            category,
            summary,
            kind,
        };

        const dedupedRecent = current.recent.filter(
            (entry) =>
                !(entry.path === path && entry.summary === summary && Date.now() - entry.at < 3000)
        );

        return {
            ...current,
            toolUsage: {
                ...current.toolUsage,
                [path]: usageCount,
            },
            recent: [nextEntry, ...dedupedRecent].slice(0, MAX_RECENT),
        };
    });
}

export function saveToolRecord(record: Omit<SavedToolRecord, "id" | "at" | "category">) {
    const meta = resolveMeta(record.path);
    updateAppActivity((current) => ({
        ...current,
        savedRecords: [
            {
                id: `${record.path}-${Date.now()}`,
                at: Date.now(),
                title: record.title,
                path: record.path,
                input: record.input,
                result: record.result,
                category: meta?.category ?? "General",
            },
            ...current.savedRecords,
        ].slice(0, MAX_SAVED),
    }));
}

export function markPathSeen(path: string) {
    updateAppActivity((current) => {
        if (current.seenNewPaths.includes(path)) return current;
        return {
            ...current,
            seenNewPaths: [...current.seenNewPaths, path],
        };
    });
}

export function dismissFeedbackReminder(mode: "later" | "forever") {
    updateAppActivity((current) => ({
        ...current,
        lastFeedbackPromptAt: Date.now(),
        feedbackDismissedUntil:
            mode === "later" ? Date.now() + 1000 * 60 * 60 * 24 * 10 : current.feedbackDismissedUntil,
        feedbackDismissedForever: mode === "forever" ? true : current.feedbackDismissedForever,
    }));
}

export function noteFeedbackReminderShown() {
    updateAppActivity((current) => ({
        ...current,
        lastFeedbackPromptAt: Date.now(),
    }));
}

export function clearStoredActivity() {
    writeAppActivity(DEFAULT_ACTIVITY_STATE);
}

export function togglePinnedPath(path: string) {
    updateAppActivity((current) => {
        const nextPinnedPaths = current.pinnedPaths.includes(path)
            ? current.pinnedPaths.filter((item) => item !== path)
            : [path, ...current.pinnedPaths].slice(0, 8);

        return {
            ...current,
            pinnedPaths: nextPinnedPaths,
        };
    });
}

export function getPinnedRoutes(activity: AppActivityState) {
    return activity.pinnedPaths
        .map((path) => resolveMeta(path))
        .filter((route): route is RouteMeta => Boolean(route));
}

export function getRecentRoutes(activity: AppActivityState, limit = 4) {
    return activity.recent
        .map((entry) => resolveMeta(entry.path))
        .filter((route, index, routes): route is RouteMeta => {
            if (!route) return false;
            return routes.findIndex((candidate) => candidate?.path === route.path) === index;
        })
        .slice(0, limit);
}

export function getMostUsedRoutes(activity: AppActivityState, limit = 4) {
    return Object.entries(activity.toolUsage)
        .sort((left, right) => right[1] - left[1])
        .map(([path]) => resolveMeta(path))
        .filter((route, index, routes): route is RouteMeta => {
            if (!route) return false;
            return routes.findIndex((candidate) => candidate?.path === route.path) === index;
        })
        .slice(0, limit);
}

export function shouldShowFeedbackReminder(
    activity: AppActivityState,
    enabled: boolean
) {
    if (!enabled) return false;
    if (activity.feedbackDismissedForever) return false;
    if (activity.launches < 6) return false;
    if (activity.savedRecords.length + activity.recent.length < 10) return false;
    if (activity.feedbackDismissedUntil > Date.now()) return false;
    if (Date.now() - activity.lastFeedbackPromptAt < 1000 * 60 * 60 * 24 * 5) return false;
    return true;
}

export function getRecommendedRoutes(activity: AppActivityState, currentPath?: string) {
    const usageEntries = Object.entries(activity.toolUsage).sort((a, b) => b[1] - a[1]);
    const popularPaths = new Set(usageEntries.slice(0, 3).map(([path]) => path));
    const recentPath = activity.recent.find((entry) => entry.path !== currentPath)?.path;
    const currentMeta = currentPath ? resolveMeta(currentPath) : null;

    const ranked = APP_ROUTE_META
        .filter(
            (route) =>
                route.path !== currentPath &&
                route.path !== "/settings/about" &&
                route.path !== "/settings/install" &&
                route.path !== "/settings/feedback"
        )
        .map((route) => {
            let score = activity.toolUsage[route.path] ?? 0;

            if (activity.pinnedPaths.includes(route.path)) score += 10;
            if (popularPaths.has(route.path)) score += 6;
            if (recentPath && route.path === recentPath) score += 5;
            if (currentMeta && route.category === currentMeta.category && route.path !== "/") {
                score += 4;
            }

            if (route.category === "Accounting") score += 2;
            return { ...route, score };
        })
        .sort((a, b) => b.score - a.score);

    const fallback = APP_NAV_GROUPS.flatMap((group) => group.items)
        .filter((item) => item.path !== currentPath)
        .slice(0, 4)
        .map((item) => ({
            ...item,
            category: resolveMeta(item.path)?.category ?? "General",
            score: 0,
        }));

    return (ranked[0]?.score ?? 0) > 0 ? ranked.slice(0, 4) : fallback;
}

export function formatRelativeTime(timestamp: number) {
    const elapsed = Date.now() - timestamp;
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    if (elapsed < minute) return "Just now";
    if (elapsed < hour) return `${Math.max(1, Math.floor(elapsed / minute))}m ago`;
    if (elapsed < day) return `${Math.max(1, Math.floor(elapsed / hour))}h ago`;
    return `${Math.max(1, Math.floor(elapsed / day))}d ago`;
}
