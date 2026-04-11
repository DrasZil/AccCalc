import { useSyncExternalStore } from "react";
import { getRouteMeta } from "./appCatalog.js";

export type StudyTopicRecord = {
    id: string;
    path: string;
    title: string;
    lastViewedAt: number;
    bookmarked: boolean;
    completedSections: string[];
    lastSectionKey?: string;
    note?: string;
};

export type StudyQuizRecord = {
    topicId: string;
    topicPath: string;
    topicTitle: string;
    attempts: number;
    bestScore: number;
    lastScore: number;
    totalQuestions: number;
    lastCompletedAt: number;
};

export type StudyProgressState = {
    version: 2;
    topics: Record<string, StudyTopicRecord>;
    quizzes: Record<string, StudyQuizRecord>;
};

const STORAGE_KEY = "accalc-study-progress";
const UPDATED_EVENT = "accalc-study-progress-updated";

const DEFAULT_STUDY_PROGRESS: StudyProgressState = {
    version: 2,
    topics: {},
    quizzes: {},
};

let cachedRaw: string | null | undefined;
let cachedSnapshot: StudyProgressState = DEFAULT_STUDY_PROGRESS;

function sanitizeStudyProgress(
    value: Partial<StudyProgressState> | null | undefined
): StudyProgressState {
    const rawTopics =
        typeof value?.topics === "object" && value.topics ? value.topics : {};
    const rawQuizzes =
        typeof value?.quizzes === "object" && value.quizzes ? value.quizzes : {};

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
                        note: typeof entry.note === "string" ? entry.note : undefined,
                    } satisfies StudyTopicRecord,
                ],
            ];
        })
    );

    const quizzes = Object.fromEntries(
        Object.entries(rawQuizzes).flatMap(([key, entry]) => {
            if (
                !entry ||
                typeof entry !== "object" ||
                typeof entry.topicId !== "string" ||
                typeof entry.topicPath !== "string" ||
                typeof entry.topicTitle !== "string" ||
                typeof entry.attempts !== "number" ||
                typeof entry.bestScore !== "number" ||
                typeof entry.lastScore !== "number" ||
                typeof entry.totalQuestions !== "number" ||
                typeof entry.lastCompletedAt !== "number"
            ) {
                return [];
            }

            return [
                [
                    key,
                    {
                        topicId: entry.topicId,
                        topicPath: entry.topicPath,
                        topicTitle: entry.topicTitle,
                        attempts: entry.attempts,
                        bestScore: entry.bestScore,
                        lastScore: entry.lastScore,
                        totalQuestions: entry.totalQuestions,
                        lastCompletedAt: entry.lastCompletedAt,
                    } satisfies StudyQuizRecord,
                ],
            ];
        })
    );

    return {
        version: 2,
        topics,
        quizzes,
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

function getExistingTopic(
    current: StudyProgressState,
    topic: { id: string; path: string; title: string }
) {
    return (
        current.topics[topic.id] ?? {
            id: topic.id,
            path: topic.path,
            title: topic.title,
            lastViewedAt: Date.now(),
            bookmarked: false,
            completedSections: [],
        }
    );
}

export function touchStudyTopic(topic: { id: string; path: string; title: string }) {
    updateStudyProgress((current) => {
        const existing = getExistingTopic(current, topic);

        return {
            ...current,
            topics: {
                ...current.topics,
                [topic.id]: {
                    ...existing,
                    path: topic.path,
                    title: topic.title,
                    lastViewedAt: Date.now(),
                },
            },
        };
    });
}

export function toggleStudyBookmark(topic: { id: string; path: string; title: string }) {
    updateStudyProgress((current) => {
        const existing = getExistingTopic(current, topic);

        return {
            ...current,
            topics: {
                ...current.topics,
                [topic.id]: {
                    ...existing,
                    path: topic.path,
                    title: topic.title,
                    lastViewedAt: Date.now(),
                    bookmarked: !existing.bookmarked,
                },
            },
        };
    });
}

export function markStudySectionComplete(
    topic: { id: string; path: string; title: string },
    sectionKey: string
) {
    updateStudyProgress((current) => {
        const existing = getExistingTopic(current, topic);
        const completedSections = Array.from(
            new Set([...(existing.completedSections ?? []), sectionKey])
        );

        return {
            ...current,
            topics: {
                ...current.topics,
                [topic.id]: {
                    ...existing,
                    path: topic.path,
                    title: topic.title,
                    lastViewedAt: Date.now(),
                    completedSections,
                    lastSectionKey: sectionKey,
                },
            },
        };
    });
}

export function setStudyTopicNote(
    topic: { id: string; path: string; title: string },
    note: string
) {
    updateStudyProgress((current) => {
        const existing = getExistingTopic(current, topic);

        return {
            ...current,
            topics: {
                ...current.topics,
                [topic.id]: {
                    ...existing,
                    path: topic.path,
                    title: topic.title,
                    lastViewedAt: Date.now(),
                    note: note.trim() === "" ? undefined : note,
                },
            },
        };
    });
}

export function recordStudyQuizAttempt(
    topic: { id: string; path: string; title: string },
    payload: { score: number; totalQuestions: number }
) {
    updateStudyProgress((current) => {
        const existing = current.quizzes[topic.id];

        return {
            ...current,
            topics: {
                ...current.topics,
                [topic.id]: {
                    ...getExistingTopic(current, topic),
                    path: topic.path,
                    title: topic.title,
                    lastViewedAt: Date.now(),
                    lastSectionKey: "quiz",
                    completedSections: Array.from(
                        new Set([
                            ...(current.topics[topic.id]?.completedSections ?? []),
                            "quiz",
                        ])
                    ),
                },
            },
            quizzes: {
                ...current.quizzes,
                [topic.id]: {
                    topicId: topic.id,
                    topicPath: topic.path,
                    topicTitle: topic.title,
                    attempts: (existing?.attempts ?? 0) + 1,
                    bestScore: Math.max(existing?.bestScore ?? 0, payload.score),
                    lastScore: payload.score,
                    totalQuestions: payload.totalQuestions,
                    lastCompletedAt: Date.now(),
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
            route: getRouteMeta(topic.path),
        }));
}

export function getRecentStudyTopics(limit = 4) {
    return Object.values(readStudyProgress().topics)
        .sort((left, right) => right.lastViewedAt - left.lastViewedAt)
        .slice(0, limit)
        .map((topic) => ({
            ...topic,
            route: getRouteMeta(topic.path),
        }));
}

export function getRecentStudyQuizAttempts(limit = 4) {
    return Object.values(readStudyProgress().quizzes)
        .sort((left, right) => right.lastCompletedAt - left.lastCompletedAt)
        .slice(0, limit)
        .map((quiz) => ({
            ...quiz,
            route: getRouteMeta(quiz.topicPath),
        }));
}
