import { useEffect, useMemo, useState } from "react";
import { ShellIcon } from "../features/layout/ShellChrome";
import { shareApp, type ShareAppOutcome } from "../utils/shareApp";

type ShareAppButtonProps = {
    className?: string;
    iconOnly?: boolean;
    label?: string;
    onResult?: (result: ShareAppOutcome) => void;
    shareText?: string;
    title?: string;
    variant?: "primary" | "secondary" | "ghost" | "icon";
};

export default function ShareAppButton({
    className = "",
    iconOnly = false,
    label = "Share link",
    onResult,
    shareText,
    title = "Share AccCalc link",
    variant = "secondary",
}: ShareAppButtonProps) {
    const [status, setStatus] = useState<ShareAppOutcome | null>(null);

    useEffect(() => {
        if (!status || status === "dismissed") return;

        const timer = window.setTimeout(() => setStatus(null), 2200);
        return () => window.clearTimeout(timer);
    }, [status]);

    const buttonClassName = useMemo(() => {
        if (variant === "primary") {
            return "app-button-primary inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold";
        }

        if (variant === "ghost") {
            return "app-button-ghost inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium";
        }

        if (variant === "icon") {
            return "app-icon-button inline-flex items-center justify-center rounded-xl p-2.25";
        }

        return "app-button-secondary inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium";
    }, [variant]);

    const visibleLabel =
        status === "copied"
            ? "Link copied"
            : status === "shared"
              ? "Shared"
              : status === "unsupported"
                ? "Copy unavailable"
                : status === "failed"
                  ? "Share failed"
                  : label;

    async function handleShare() {
        const result = await shareApp({
            title,
            text: shareText,
        });

        setStatus(result);
        onResult?.(result);
    }

    return (
        <button
            type="button"
            onClick={() => {
                void handleShare();
            }}
            aria-label={iconOnly ? label : undefined}
            title={title}
            className={[buttonClassName, className].filter(Boolean).join(" ")}
        >
            {iconOnly ? (
                <>
                    <ShellIcon kind="share" className="h-[1.05rem] w-[1.05rem]" />
                    <span className="sr-only">{visibleLabel}</span>
                </>
            ) : (
                <span className="inline-flex items-center gap-2">
                    <ShellIcon kind="share" className="h-[1rem] w-[1rem]" />
                    <span>{visibleLabel}</span>
                </span>
            )}
        </button>
    );
}
