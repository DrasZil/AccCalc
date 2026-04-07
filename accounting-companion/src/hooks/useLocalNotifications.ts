import { useEffect, useMemo, useRef, useState } from "react";
import {
    buildNextSchedule,
    sendReminderNotification,
    writeReminderSchedule,
} from "../services/notifications/notificationScheduler";
import {
    getReminderPreview,
    type ReminderCategory,
    type ReminderFrequency,
    type ReminderTone,
} from "../services/notifications/notificationCopy";

type UseLocalNotificationsOptions = {
    enabled: boolean;
    category: ReminderCategory;
    tone: ReminderTone;
    frequency: ReminderFrequency;
};

export function useLocalNotifications({
    enabled,
    category,
    tone,
    frequency,
}: UseLocalNotificationsOptions) {
    const timerRef = useRef<number | null>(null);
    const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
        typeof Notification === "undefined" ? "unsupported" : Notification.permission
    );

    const preview = useMemo(() => getReminderPreview(category, tone), [category, tone]);

    useEffect(() => {
        if (!enabled || typeof window === "undefined") {
            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            writeReminderSchedule(null);
            return;
        }

        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        const schedule = buildNextSchedule(category, tone, frequency);
        writeReminderSchedule(schedule);

        if (permission !== "granted") return;

        timerRef.current = window.setTimeout(() => {
            sendReminderNotification(category, tone);
            writeReminderSchedule(buildNextSchedule(category, tone, frequency));
        }, Math.max(schedule.nextAt - Date.now(), 1000));

        return () => {
            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [category, enabled, frequency, permission, tone]);

    async function requestPermission() {
        if (typeof Notification === "undefined") {
            setPermission("unsupported");
            return "unsupported" as const;
        }

        const nextPermission = await Notification.requestPermission();
        setPermission(nextPermission);
        return nextPermission;
    }

    function sendPreview() {
        if (permission !== "granted") return false;
        return sendReminderNotification(category, tone);
    }

    return {
        permission,
        preview,
        requestPermission,
        sendPreview,
    };
}
