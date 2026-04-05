import { type ReactNode } from "react";

export default function FloatingPromptDock({
    children,
    hidden = false,
}: {
    children: ReactNode;
    hidden?: boolean;
}) {
    return (
        <div
            className={[
                "pointer-events-none fixed inset-x-3 z-[108] flex flex-col gap-3 transition duration-300 md:inset-x-auto md:right-6 md:w-[min(28rem,calc(100vw-3rem))]",
                hidden ? "opacity-0" : "opacity-100",
            ].join(" ")}
            style={{
                bottom:
                    "calc(var(--app-mobile-nav-height, 0px) + var(--app-keyboard-inset, 0px) + env(safe-area-inset-bottom, 0px) + 0.75rem)",
            }}
            aria-hidden={hidden}
        >
            <div
                className={[
                    "flex flex-col gap-3",
                    hidden ? "pointer-events-none" : "pointer-events-auto",
                ].join(" ")}
            >
                {children}
            </div>
        </div>
    );
}
