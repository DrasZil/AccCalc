import { useEffect, useMemo, useRef, useState } from "react";
import {
    buildNextSchedule,
    isBrowserNotificationRuntimeSupported,
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
        isBrowserNotificationRuntimeSupported() ? Notification.permission : "unsupported"
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

        if (!isBrowserNotificationRuntimeSupported()) {
            setPermission("unsupported");
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

        const scheduleNext = (nextScheduleAt: number) => {
            timerRef.current = window.setTimeout(() => {
                sendReminderNotification(category, tone);
                const nextSchedule = buildNextSchedule(category, tone, frequency);
                writeReminderSchedule(nextSchedule);
                scheduleNext(Math.max(nextSchedule.nextAt - Date.now(), 1000));
            }, nextScheduleAt);
        };

        scheduleNext(Math.max(schedule.nextAt - Date.now(), 1000));

        return () => {
            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [category, enabled, frequency, permission, tone]);

    async function requestPermission() {
        if (!isBrowserNotificationRuntimeSupported()) {
            setPermission("unsupported");
            return "unsupported" as const;
        }

        try {
            const nextPermission = await Notification.requestPermission();
            setPermission(nextPermission);
            return nextPermission;
        } catch {
            setPermission("unsupported");
            return "unsupported" as const;
        }
    }

    function sendPreview() {
        if (permission !== "granted" || !isBrowserNotificationRuntimeSupported()) return false;
        return sendReminderNotification(category, tone);
    }

    return {
        permission,
        preview,
        requestPermission,
        sendPreview,
    };
}
