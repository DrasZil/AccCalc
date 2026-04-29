import { useSyncExternalStore } from "react";
import { APP_VERSION } from "../../utils/appRelease.js";
import type { OnboardingTourId } from "./onboardingTours.js";

export type OnboardingStatus = "not-started" | "active" | "completed" | "skipped" | "dismissed";

export type OnboardingState = {
    version: 1;
    firstTourStatus: OnboardingStatus;
    firstTourSeenAt: number;
    firstTourCompletedAt: number;
    returningPromptVersion: string;
    returningPromptStatus: "not-shown" | "shown" | "skipped" | "dismissed" | "completed";
    returningDismissedForever: boolean;
    activeTourId: OnboardingTourId | null;
    activeStepIndex: number;
    replayCount: number;
    lastStartedAt: number;
    lastUpdatedAt: number;
};

const STORAGE_KEY = "accalc-onboarding-state";
const UPDATED_EVENT = "accalc-onboarding-updated";

const DEFAULT_STATE: OnboardingState = {
    version: 1,
    firstTourStatus: "not-started",
    firstTourSeenAt: 0,
    firstTourCompletedAt: 0,
    returningPromptVersion: "",
    returningPromptStatus: "not-shown",
    returningDismissedForever: false,
    activeTourId: null,
    activeStepIndex: 0,
    replayCount: 0,
    lastStartedAt: 0,
    lastUpdatedAt: 0,
};

let cachedRaw: string | null | undefined;
let cachedState = DEFAULT_STATE;

function sanitizeStatus(value: unknown): OnboardingStatus {
    return value === "active" ||
        value === "completed" ||
        value === "skipped" ||
        value === "dismissed" ||
        value === "not-started"
        ? value
        : "not-started";
}

function sanitizeReturningStatus(value: unknown): OnboardingState["returningPromptStatus"] {
    return value === "shown" ||
        value === "skipped" ||
        value === "dismissed" ||
        value === "completed" ||
        value === "not-shown"
        ? value
        : "not-shown";
}

function sanitizeTourId(value: unknown): OnboardingTourId | null {
    return value === "first-run" || value === "quick" ? value : null;
}

function sanitizeNumber(value: unknown) {
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function sanitizeState(value: Partial<OnboardingState> | null | undefined): OnboardingState {
    return {
        version: 1,
        firstTourStatus: sanitizeStatus(value?.firstTourStatus),
        firstTourSeenAt: sanitizeNumber(value?.firstTourSeenAt),
        firstTourCompletedAt: sanitizeNumber(value?.firstTourCompletedAt),
        returningPromptVersion:
            typeof value?.returningPromptVersion === "string"
                ? value.returningPromptVersion
                : "",
        returningPromptStatus: sanitizeReturningStatus(value?.returningPromptStatus),
        returningDismissedForever: value?.returningDismissedForever ?? false,
        activeTourId: sanitizeTourId(value?.activeTourId),
        activeStepIndex:
            typeof value?.activeStepIndex === "number"
                ? Math.max(0, Math.round(value.activeStepIndex))
                : 0,
        replayCount:
            typeof value?.replayCount === "number"
                ? Math.max(0, Math.round(value.replayCount))
                : 0,
        lastStartedAt: sanitizeNumber(value?.lastStartedAt),
        lastUpdatedAt: sanitizeNumber(value?.lastUpdatedAt),
    };
}

export function readOnboardingState(): OnboardingState {
    if (typeof window === "undefined") return DEFAULT_STATE;

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw === cachedRaw) return cachedState;

        if (!raw) {
            cachedRaw = raw;
            cachedState = DEFAULT_STATE;
            return cachedState;
        }

        cachedRaw = raw;
        cachedState = sanitizeState(JSON.parse(raw) as Partial<OnboardingState>);
        return cachedState;
    } catch {
        cachedRaw = null;
        cachedState = DEFAULT_STATE;
        return cachedState;
    }
}

function writeOnboardingState(nextState: OnboardingState) {
    if (typeof window === "undefined") return;

    const serialized = JSON.stringify(nextState);
    cachedRaw = serialized;
    cachedState = nextState;
    window.localStorage.setItem(STORAGE_KEY, serialized);
    window.dispatchEvent(new Event(UPDATED_EVENT));
}

export function updateOnboardingState(updater: (current: OnboardingState) => OnboardingState) {
    if (typeof window === "undefined") return;
    writeOnboardingState(updater(readOnboardingState()));
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

export function useOnboardingState() {
    return useSyncExternalStore(subscribe, readOnboardingState, () => DEFAULT_STATE);
}

export function startOnboardingTour(tourId: OnboardingTourId, options?: { replay?: boolean }) {
    const now = Date.now();
    updateOnboardingState((current) => ({
        ...current,
        firstTourStatus:
            tourId === "first-run" ? "active" : current.firstTourStatus,
        firstTourSeenAt:
            tourId === "first-run" && current.firstTourSeenAt === 0
                ? now
                : current.firstTourSeenAt,
        returningPromptVersion:
            tourId === "quick" ? APP_VERSION : current.returningPromptVersion,
        returningPromptStatus:
            tourId === "quick" ? "shown" : current.returningPromptStatus,
        activeTourId: tourId,
        activeStepIndex: 0,
        replayCount: options?.replay ? current.replayCount + 1 : current.replayCount,
        lastStartedAt: now,
        lastUpdatedAt: now,
    }));
}

export function setOnboardingStep(index: number) {
    updateOnboardingState((current) => ({
        ...current,
        activeStepIndex: Math.max(0, Math.round(index)),
        lastUpdatedAt: Date.now(),
    }));
}

export function finishOnboardingTour(status: Exclude<OnboardingStatus, "active" | "not-started">) {
    const now = Date.now();
    updateOnboardingState((current) => {
        const next: OnboardingState = {
            ...current,
            activeTourId: null,
            activeStepIndex: 0,
            lastUpdatedAt: now,
        };

        if (current.activeTourId === "first-run") {
            next.firstTourStatus = status;
            next.firstTourCompletedAt = status === "completed" ? now : current.firstTourCompletedAt;
        }

        if (current.activeTourId === "quick") {
            next.returningPromptVersion = APP_VERSION;
            next.returningPromptStatus =
                status === "completed"
                    ? "completed"
                    : status === "skipped"
                      ? "skipped"
                      : "dismissed";
        }

        return next;
    });
}

export function resolveReturningPrompt(status: "skipped" | "dismissed" | "shown") {
    updateOnboardingState((current) => ({
        ...current,
        returningPromptVersion: APP_VERSION,
        returningPromptStatus: status,
        returningDismissedForever:
            status === "dismissed" ? true : current.returningDismissedForever,
        lastUpdatedAt: Date.now(),
    }));
}

export function resetOnboardingState() {
    writeOnboardingState(DEFAULT_STATE);
}
