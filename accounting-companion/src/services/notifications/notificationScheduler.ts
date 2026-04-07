import {
    getReminderCopy,
    getReminderFrequencyMs,
    type ReminderCategory,
    type ReminderFrequency,
    type ReminderTone,
} from "./notificationCopy";

const REMINDER_STORAGE_KEY = "accalc-reminder-schedule";

export type ReminderSchedule = {
    category: ReminderCategory;
    tone: ReminderTone;
    frequency: ReminderFrequency;
    nextAt: number;
};

export function readReminderSchedule() {
    if (typeof window === "undefined") return null;

    try {
        const raw = window.localStorage.getItem(REMINDER_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as ReminderSchedule;
    } catch {
        return null;
    }
}

export function writeReminderSchedule(schedule: ReminderSchedule | null) {
    if (typeof window === "undefined") return;
    if (!schedule) {
        window.localStorage.removeItem(REMINDER_STORAGE_KEY);
        return;
    }
    window.localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(schedule));
}

export function buildNextSchedule(
    category: ReminderCategory,
    tone: ReminderTone,
    frequency: ReminderFrequency
) {
    return {
        category,
        tone,
        frequency,
        nextAt: Date.now() + getReminderFrequencyMs(frequency),
    } satisfies ReminderSchedule;
}

export function sendReminderNotification(
    category: ReminderCategory,
    tone: ReminderTone
) {
    if (typeof window === "undefined" || typeof Notification === "undefined") {
        return false;
    }

    if (Notification.permission !== "granted") return false;

    const body = getReminderCopy(category, tone)[
        Math.floor(Math.random() * getReminderCopy(category, tone).length)
    ];

    new Notification("AccCalc reminder", {
        body,
        icon: `${window.location.origin}${import.meta.env.BASE_URL}icon-192.png`,
        tag: "accalc-local-reminder",
    });

    return true;
}

