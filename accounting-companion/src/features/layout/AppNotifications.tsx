import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { NoticeStack, type Notice } from "./ShellChrome";

type NotifyInput = {
    title: string;
    message?: string;
    tone?: Notice["tone"];
    dedupeKey?: string;
    durationMs?: number;
};

type AppNotificationsContextValue = {
    notices: Notice[];
    notify: (input: NotifyInput) => string;
    dismiss: (id: string) => void;
    clearAll: () => void;
};

const AppNotificationsContext = createContext<AppNotificationsContextValue | null>(null);

function getNoticeDuration(tone: Notice["tone"], durationMs?: number) {
    if (typeof durationMs === "number" && Number.isFinite(durationMs)) {
        return Math.max(2000, durationMs);
    }

    if (tone === "warning" || tone === "error") {
        return 7800;
    }

    return 5200;
}

export function AppNotificationProvider({ children }: { children: ReactNode }) {
    const [notices, setNotices] = useState<Notice[]>([]);
    const noticeTimersRef = useRef<Record<string, number>>({});

    const dismiss = useCallback((id: string) => {
        const timer = noticeTimersRef.current[id];
        if (timer) {
            window.clearTimeout(timer);
            delete noticeTimersRef.current[id];
        }

        setNotices((current) => current.filter((notice) => notice.id !== id));
    }, []);

    const notify = useCallback(
        ({ title, message = "", tone = "info", dedupeKey, durationMs }: NotifyInput) => {
            const id = dedupeKey ?? `${tone}:${title}:${message}`;

            if (noticeTimersRef.current[id]) {
                window.clearTimeout(noticeTimersRef.current[id]);
            }

            setNotices((current) => {
                const existing = current.find((notice) => notice.id === id);
                const withoutExisting = current.filter((notice) => notice.id !== id);

                return [
                    ...withoutExisting,
                    {
                        id,
                        title,
                        message,
                        tone,
                        repeatCount: existing ? (existing.repeatCount ?? 1) + 1 : 1,
                    },
                ].slice(-4);
            });

            noticeTimersRef.current[id] = window.setTimeout(() => {
                setNotices((current) => current.filter((notice) => notice.id !== id));
                delete noticeTimersRef.current[id];
            }, getNoticeDuration(tone, durationMs));

            return id;
        },
        []
    );

    const clearAll = useCallback(() => {
        Object.values(noticeTimersRef.current).forEach((timer) => window.clearTimeout(timer));
        noticeTimersRef.current = {};
        setNotices([]);
    }, []);

    useEffect(
        () => () => {
            Object.values(noticeTimersRef.current).forEach((timer) =>
                window.clearTimeout(timer)
            );
            noticeTimersRef.current = {};
        },
        []
    );

    const value = useMemo(
        () => ({
            notices,
            notify,
            dismiss,
            clearAll,
        }),
        [clearAll, dismiss, notices, notify]
    );

    return (
        <AppNotificationsContext.Provider value={value}>
            {children}
            <NoticeStack notices={notices} onDismiss={dismiss} />
        </AppNotificationsContext.Provider>
    );
}

export function useAppNotifications() {
    const context = useContext(AppNotificationsContext);

    if (!context) {
        throw new Error("useAppNotifications must be used inside AppNotificationProvider.");
    }

    return context;
}
