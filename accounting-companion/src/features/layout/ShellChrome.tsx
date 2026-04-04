import { Link } from "react-router-dom";
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

    if (kind === "Business") {
        return (
            <svg {...sharedProps}>
                <path d="M4.5 19h15" />
                <path d="M7 19V9h4v10" />
                <path d="M13 19V5h4v14" />
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
        <span className="inline-flex items-center gap-1 rounded-full border border-green-400/15 bg-green-500/12 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-green-300">
            <span className="h-1.5 w-1.5 rounded-full bg-green-300 shadow-[0_0_12px_rgba(134,239,172,0.8)]" />
            New
        </span>
    );
}

export function LaunchScreen({ visible }: { visible: boolean }) {
    return (
        <div
            className={[
                "pointer-events-none fixed inset-0 z-[120] flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(79,181,128,0.2),transparent_30%),linear-gradient(180deg,rgba(4,7,6,0.98),rgba(4,4,4,1))] px-6 transition duration-500",
                visible ? "opacity-100" : "opacity-0",
            ].join(" ")}
        >
            <div className="w-full max-w-md text-center">
                <div className="mx-auto inline-flex h-18 w-18 items-center justify-center rounded-[2rem] border border-green-400/15 bg-green-500/10 text-green-300 shadow-[0_16px_60px_rgba(34,197,94,0.18)]">
                    <ShellIcon kind="spark" className="h-8 w-8" />
                </div>
                <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-green-300">
                    Accounting workspace
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
                    AccCalc
                </h1>
                <p className="mt-3 text-sm leading-6 text-gray-400">
                    Preparing calculators, saved history, and offline study tools.
                </p>
                <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="loading-shimmer h-full w-1/2 rounded-full bg-[linear-gradient(90deg,rgba(74,222,128,0.2),rgba(134,239,172,0.95),rgba(74,222,128,0.2))]" />
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
        <div className="fixed right-4 top-18 z-[110] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3 md:right-6 md:top-20">
            {notices.map((notice) => (
                <div
                    key={notice.id}
                    className={[
                        "rounded-[1.4rem] border px-4 py-4 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl transition duration-300",
                        notice.tone === "success"
                            ? "border-green-400/20 bg-[#07140d]/92"
                            : notice.tone === "warning"
                              ? "border-amber-300/20 bg-[#181207]/92"
                              : "border-white/10 bg-[#080808]/92",
                    ].join(" ")}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-white">{notice.title}</p>
                            <p className="mt-1 text-sm leading-6 text-gray-300">{notice.message}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onDismiss(notice.id)}
                            aria-label="Dismiss notice"
                            className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-200 transition hover:bg-white/10"
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
        <div className="fixed inset-0 z-[115] flex items-end justify-center bg-black/45 px-4 pb-4 pt-20 md:items-center">
            <div className="w-full max-w-lg rounded-[1.8rem] border border-white/10 bg-[#080808]/96 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-green-300">
                            Feedback reminder
                        </p>
                        <h2 className="mt-2 text-xl font-semibold text-white">
                            Help improve AccCalc
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close feedback reminder"
                        className="rounded-xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
                    >
                        <ShellIcon kind="close" className="h-4 w-4" />
                    </button>
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-300">
                    You have been actively using the app. If you have bugs, missing accounting topics, or UI suggestions, the feedback form helps prioritize the next updates.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                        to="/settings/feedback"
                        onClick={() => dismissFeedbackReminder("later")}
                        className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-green-400"
                    >
                        Open feedback
                    </Link>
                    <button
                        type="button"
                        onClick={() => {
                            dismissFeedbackReminder("later");
                            onClose();
                        }}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                        Remind later
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            dismissFeedbackReminder("forever");
                            onClose();
                        }}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10"
                    >
                        Never show
                    </button>
                </div>
            </div>
        </div>
    );
}
