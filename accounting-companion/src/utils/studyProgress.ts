import { useSyncExternalStore } from "react";
import { APP_ROUTE_META_MAP } from "./appCatalog.js";

export type StudyTopicRecord = {
    id: string;
    path: string;
    title: string;
    lastViewedAt: number;
    bookmarked: boolean;
    completedSections: string[];
    lastSectionKey?: string;
};

export type StudyProgressState = {
    version: 1;
    topics: Record<string, StudyTopicRecord>;
};

const STORAGE_KEY = "accalc-study-progress";
const UPDATED_EVENT = "accalc-study-progress-updated";

const DEFAULT_STUDY_PROGRESS: StudyProgressState = {
    version: 1,
    topics: {},
};

let cachedRaw: string | null | undefined;
let cachedSnapshot: StudyProgressState = DEFAULT_STUDY_PROGRESS;

function sanitizeStudyProgress(
    value: Partial<StudyProgressState> | null | undefined
): StudyProgressState {
    const rawTopics =
        typeof value?.topics === "object" && value.topics ? value.topics : {};

    const topics = Object.fromEntries(
        Object.entries(rawTopics).flatMap(([key, entry]) => {
            if (
                !entry ||
                typeof entry !== "object" ||
                typeof entry.id !== "string" ||
                typeof entry.path !== "string" ||
                typeof entry.title !== "string" ||
                typeof entry.lastViewedAt !== "number"
            ) {
                return [];
            }

            return [
                [
                    key,
                    {
                        id: entry.id,
                        path: entry.path,
                        title: entry.title,
                        lastViewedAt: entry.lastViewedAt,
                        bookmarked: entry.bookmarked ?? false,
                        completedSections: Array.isArray(entry.completedSections)
                            ? entry.completedSections.filter(
                                  (section): section is string => typeof section === "string"
                              )
                            : [],
                        lastSectionKey:
                            typeof entry.lastSectionKey === "string"
                                ? entry.lastSectionKey
                                : undefined,
                    } satisfies StudyTopicRecord,
                ],
            ];
        })
    );

    return {
        version: 1,
        topics,
    };
}

export function readStudyProgress(): StudyProgressState {
    if (typeof window === "undefined") return DEFAULT_STUDY_PROGRESS;

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw === cachedRaw) {
            return cachedSnapshot;
        }

        if (!raw) {
            cachedRaw = raw;
            cachedSnapshot = DEFAULT_STUDY_PROGRESS;
            return cachedSnapshot;
        }

        cachedRaw = raw;
        cachedSnapshot = sanitizeStudyProgress(
            JSON.parse(raw) as Partial<StudyProgressState>
        );
        return cachedSnapshot;
    } catch {
        cachedRaw = null;
        cachedSnapshot = DEFAULT_STUDY_PROGRESS;
        return cachedSnapshot;
    }
}

function writeStudyProgress(nextValue: StudyProgressState) {
    if (typeof window === "undefined") return;

    const serialized = JSON.stringify(nextValue);
    cachedRaw = serialized;
    cachedSnapshot = nextValue;
    window.localStorage.setItem(STORAGE_KEY, serialized);
    window.dispatchEvent(new Event(UPDATED_EVENT));
}

export function updateStudyProgress(
    updater: (current: StudyProgressState) => StudyProgressState
) {
    if (typeof window === "undefined") return;
    writeStudyProgress(updater(readStudyProgress()));
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

export function useStudyProgress() {
    return useSyncExternalStore(subscribe, readStudyProgress, () => DEFAULT_STUDY_PROGRESS);
}

export function touchStudyTopic(topic: { id: string; path: string; title: string }) {
    updateStudyProgress((current) => ({
        ...current,
        topics: {
            ...current.topics,
            [topic.id]: {
                ...(current.topics[topic.id] ?? {
                    id: topic.id,
                    path: topic.path,
                    title: topic.title,
                    bookmarked: false,
                    completedSections: [],
                }),
                path: topic.path,
                title: topic.title,
                lastViewedAt: Date.now(),
            },
        },
    }));
}

export function toggleStudyBookmark(topic: { id: string; path: string; title: string }) {
    updateStudyProgress((current) => {
        const existing = current.topics[topic.id];
        const nextRecord: StudyTopicRecord = {
            id: topic.id,
            path: topic.path,
            title: topic.title,
            lastViewedAt: Date.now(),
            bookmarked: !(existing?.bookmarked ?? false),
            completedSections: existing?.completedSections ?? [],
            lastSectionKey: existing?.lastSectionKey,
        };

        return {
            ...current,
            topics: {
                ...current.topics,
                [topic.id]: nextRecord,
            },
        };
    });
}

export function markStudySectionComplete(
    topic: { id: string; path: string; title: string },
    sectionKey: string
) {
    updateStudyProgress((current) => {
        const existing = current.topics[topic.id];
        const completedSections = Array.from(
            new Set([...(existing?.completedSections ?? []), sectionKey])
        );

        return {
            ...current,
            topics: {
                ...current.topics,
                [topic.id]: {
                    id: topic.id,
                    path: topic.path,
                    title: topic.title,
                    lastViewedAt: Date.now(),
                    bookmarked: existing?.bookmarked ?? false,
                    completedSections,
                    lastSectionKey: sectionKey,
                },
            },
        };
    });
}

export function getBookmarkedStudyTopics(limit = 4) {
    return Object.values(readStudyProgress().topics)
        .filter((topic) => topic.bookmarked)
        .sort((left, right) => right.lastViewedAt - left.lastViewedAt)
        .slice(0, limit)
        .map((topic) => ({
            ...topic,
            route: APP_ROUTE_META_MAP.get(topic.path) ?? null,
        }));
}

export function getRecentStudyTopics(limit = 4) {
    return Object.values(readStudyProgress().topics)
        .sort((left, right) => right.lastViewedAt - left.lastViewedAt)
        .slice(0, limit)
        .map((topic) => ({
            ...topic,
            route: APP_ROUTE_META_MAP.get(topic.path) ?? null,
        }));
}
