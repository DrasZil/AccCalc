import { Link } from "react-router-dom";
import AppBrandMark from "../../components/AppBrandMark";
import { dismissFeedbackReminder } from "../../utils/appActivity";

export type Notice = {
    id: string;
    title: string;
    message: string;
    tone: "info" | "success" | "warning";
};

export function ShellIcon({
    kind,
    className = "h-5 w-5",
}: {
    kind: string;
    className?: string;
}) {
    const sharedProps = {
        "aria-hidden": true,
        viewBox: "0 0 24 24",
        className,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.8",
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
    };

    if (kind === "sidebar-open") {
        return (
            <svg {...sharedProps}>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
                <path d="M8 5v14" />
            </svg>
        );
    }

    if (kind === "sidebar-close") {
        return (
            <svg {...sharedProps}>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
                <path d="M16 5v14" />
            </svg>
        );
    }

    if (kind === "settings") {
        return (
            <svg {...sharedProps}>
                <circle cx="12" cy="12" r="3.2" />
                <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.9 1.9 0 1 1-2.7 2.7l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a1.9 1.9 0 1 1-3.8 0v-.2a1 1 0 0 0-.7-.9 1 1 0 0 0-1.1.2l-.1.1a1.9 1.9 0 1 1-2.7-2.7l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a1.9 1.9 0 1 1 0-3.8h.2a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1.1l-.1-.1a1.9 1.9 0 1 1 2.7-2.7l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V4a1.9 1.9 0 1 1 3.8 0v.2a1 1 0 0 0 .7.9 1 1 0 0 0 1.1-.2l.1-.1a1.9 1.9 0 0 1 2.7 2.7l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6h.2a1.9 1.9 0 1 1 0 3.8h-.2a1 1 0 0 0-.9.7Z" />
            </svg>
        );
    }

    if (kind === "menu") {
        return (
            <svg {...sharedProps}>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
            </svg>
        );
    }

    if (kind === "search") {
        return (
            <svg {...sharedProps}>
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4 4" />
            </svg>
        );
    }

    if (kind === "share") {
        return (
            <svg {...sharedProps}>
                <path d="M12 15.5V5" />
                <path d="M8.5 8.5L12 5l3.5 3.5" />
                <path d="M5 13.5v3A2.5 2.5 0 0 0 7.5 19h9a2.5 2.5 0 0 0 2.5-2.5v-3" />
            </svg>
        );
    }

    if (kind === "close") {
        return (
            <svg {...sharedProps}>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
            </svg>
        );
    }

    if (kind === "chevron") {
        return (
            <svg {...sharedProps}>
                <path d="M8 10l4 4 4-4" />
            </svg>
        );
    }

    if (kind === "spark") {
        return (
            <svg {...sharedProps}>
                <path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Z" />
                <path d="M18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9L18 15Z" />
            </svg>
        );
    }

    if (kind === "theme-dark") {
        return (
            <svg {...sharedProps}>
                <path d="M20 15.5A7.5 7.5 0 1 1 8.5 4a6 6 0 1 0 11.5 11.5Z" />
            </svg>
        );
    }

    if (kind === "theme-light") {
        return (
            <svg {...sharedProps}>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2.5v2.2" />
                <path d="M12 19.3v2.2" />
                <path d="M4.9 4.9l1.5 1.5" />
                <path d="M17.6 17.6l1.5 1.5" />
                <path d="M2.5 12h2.2" />
                <path d="M19.3 12h2.2" />
                <path d="M4.9 19.1l1.5-1.5" />
                <path d="M17.6 6.4l1.5-1.5" />
            </svg>
        );
    }

    if (kind === "history") {
        return (
            <svg {...sharedProps}>
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 4v4h4" />
                <path d="M12 7v5l3 2" />
            </svg>
        );
    }

    if (kind === "General") {
        return (
            <svg {...sharedProps}>
                <path d="M4 11.5L12 5l8 6.5" />
                <path d="M6.5 10.5V19h11v-8.5" />
            </svg>
        );
    }

    if (kind === "Core Tools") {
        return (
            <svg {...sharedProps}>
                <rect x="5" y="4.5" width="14" height="15" rx="2.5" />
                <path d="M8 8h8" />
                <path d="M8 12h2" />
                <path d="M12 12h2" />
                <path d="M16 12h0" />
                <path d="M8 16h2" />
                <path d="M12 16h2" />
                <path d="M16 16h0" />
            </svg>
        );
    }

    if (kind === "Smart Tools") {
        return (
            <svg {...sharedProps}>
                <path d="M9.5 18.5h5" />
                <path d="M12 3.5a6 6 0 0 0-3.8 10.6c.8.7 1.3 1.5 1.5 2.4h4.6c.2-.9.7-1.7 1.5-2.4A6 6 0 0 0 12 3.5Z" />
            </svg>
        );
    }

    if (kind === "Finance") {
        return (
            <svg {...sharedProps}>
                <path d="M5 17.5h14" />
                <path d="M7.5 14V9.5" />
                <path d="M12 14V6.5" />
                <path d="M16.5 14v-3" />
            </svg>
        );
    }

    if (kind === "Accounting") {
        return (
            <svg {...sharedProps}>
                <path d="M5 18h14" />
                <path d="M7 8h10" />
                <path d="M7 12h4" />
                <path d="M13 12h4" />
                <path d="M7 16h10" />
                <rect x="5" y="5" width="14" height="14" rx="2.5" />
            </svg>
        );
    }

    if (kind === "Business") {
        return (
            <svg {...sharedProps}>
                <path d="M4.5 19h15" />
                <path d="M7 19V9h4v10" />
                <path d="M13 19V5h4v14" />
            </svg>
        );
    }

    if (kind === "Managerial & Cost") {
        return (
            <svg {...sharedProps}>
                <path d="M6 7h12" />
                <path d="M8 4v6" />
                <path d="M16 4v6" />
                <path d="M5 10.5h14v7A2.5 2.5 0 0 1 16.5 20h-9A2.5 2.5 0 0 1 5 17.5v-7Z" />
                <path d="M10 14h4" />
            </svg>
        );
    }

    if (kind === "Business Math") {
        return (
            <svg {...sharedProps}>
                <path d="M6 6h12" />
                <path d="M6 12h12" />
                <path d="M8.5 4.5v15" />
                <path d="M15.5 4.5v15" />
            </svg>
        );
    }

    if (kind === "Statistics") {
        return (
            <svg {...sharedProps}>
                <path d="M5 18.5h14" />
                <path d="M7.5 18.5v-4" />
                <path d="M12 18.5v-8" />
                <path d="M16.5 18.5v-11" />
            </svg>
        );
    }

    return (
        <svg {...sharedProps}>
            <path d="M5 18h14" />
            <path d="M6.5 18V8.5h11V18" />
            <path d="M9 8.5V5h6v3.5" />
        </svg>
    );
}

export function NewBadge() {
    return (
        <span className="app-badge-new inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em]">
            <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                    background: "var(--app-highlight)",
                    boxShadow: "0 0 12px rgba(244, 184, 96, 0.55)",
                }}
            />
            New
        </span>
    );
}

export function LaunchScreen({ visible }: { visible: boolean }) {
    return (
        <div
            className={[
                "pointer-events-none fixed inset-0 z-[120] flex items-center justify-center px-6 transition duration-500",
                visible ? "opacity-100" : "opacity-0",
            ].join(" ")}
            style={{ background: "linear-gradient(180deg, var(--app-surface), var(--app-bg))" }}
        >
            <div className="w-full max-w-md text-center">
                <div
                    className="mx-auto"
                >
                    <AppBrandMark compact showWordmark={false} className="justify-center" />
                </div>
                <p className="app-kicker mt-6 text-[0.68rem]">
                    Accounting workspace
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                    AccCalc
                </h1>
                <p className="app-body-md mx-auto mt-3 text-sm leading-6">
                    Preparing calculators, saved history, and offline study tools.
                </p>
                <div className="mt-6 h-1.5 overflow-hidden rounded-full app-subtle-surface">
                    <div
                        className="loading-shimmer h-full w-1/2 rounded-full"
                        style={{
                            background:
                                "linear-gradient(90deg, transparent, var(--app-accent), transparent)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export function NoticeStack({
    notices,
    onDismiss,
}: {
    notices: Notice[];
    onDismiss: (id: string) => void;
}) {
    return (
        <div className="fixed right-4 z-[110] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3 md:right-6" style={{ top: "calc(var(--app-header-height) + 1rem)" }}>
            {notices.map((notice) => (
                <div
                    key={notice.id}
                    className={[
                        "rounded-[1.4rem] border px-4 py-4 backdrop-blur-xl transition duration-300",
                        notice.tone === "success"
                            ? ""
                            : notice.tone === "warning"
                              ? ""
                              : "",
                    ].join(" ")}
                    style={{
                        borderColor:
                            notice.tone === "success"
                                ? "rgba(52, 211, 153, 0.22)"
                                : notice.tone === "warning"
                                  ? "rgba(245, 158, 11, 0.22)"
                                  : "var(--app-border)",
                        background:
                            notice.tone === "success"
                                ? "var(--app-success-soft)"
                                : notice.tone === "warning"
                                  ? "var(--app-warning-soft)"
                                  : "linear-gradient(180deg, var(--app-panel-bg), var(--app-panel-bg-soft))",
                        boxShadow: "var(--app-shadow)",
                    }}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-[0.96rem] font-semibold tracking-[-0.02em] text-[color:var(--app-text)]">
                                {notice.title}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-[color:var(--app-text-secondary)]">
                                {notice.message}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onDismiss(notice.id)}
                            aria-label="Dismiss notice"
                            className="app-icon-button rounded-xl p-2"
                        >
                            <ShellIcon kind="close" className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function FeedbackReminder({
    visible,
    onClose,
}: {
    visible: boolean;
    onClose: () => void;
}) {
    if (!visible) return null;

    return (
        <div className="app-backdrop fixed inset-0 z-[115] flex items-end justify-center px-4 pb-4 md:items-center" style={{ paddingTop: "calc(var(--app-header-height) + 1rem)" }}>
            <div className="app-panel-elevated w-full max-w-lg rounded-[1.8rem] p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="app-kicker text-[0.68rem]">
                            Feedback reminder
                        </p>
                        <h2 className="mt-2 text-xl font-semibold tracking-[var(--app-letter-tight)] text-[color:var(--app-text)]">
                            Help improve AccCalc
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close feedback reminder"
                        className="app-icon-button rounded-xl p-2"
                    >
                        <ShellIcon kind="close" className="h-4 w-4" />
                    </button>
                </div>

                <p className="app-body-md mt-3 text-sm leading-6">
                    You have been actively using the app. If you have bugs, missing accounting topics, or UI suggestions, the feedback form helps prioritize the next updates.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                        to="/settings/feedback"
                        onClick={() => dismissFeedbackReminder("later")}
                        className="app-button-primary rounded-xl px-4 py-2 text-sm font-semibold"
                    >
                        Open feedback
                    </Link>
                    <button
                        type="button"
                        onClick={() => {
                            dismissFeedbackReminder("later");
                            onClose();
                        }}
                        className="app-button-secondary rounded-xl px-4 py-2 text-sm font-medium"
                    >
                        Remind later
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            dismissFeedbackReminder("forever");
                            onClose();
                        }}
                        className="app-button-ghost rounded-xl px-4 py-2 text-sm font-medium"
                    >
                        Never show
                    </button>
                </div>
            </div>
        </div>
    );
}
