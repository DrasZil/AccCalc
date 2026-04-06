import { useEffect, useState } from "react";

function ArrowUpIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 18V6" />
            <path d="M7 11l5-5 5 5" />
        </svg>
    );
}

export default function ReturnToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleScroll = () => {
            setVisible(window.scrollY > 520);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <button
            type="button"
            aria-label="Return to top"
            title="Return to top"
            onClick={() =>
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                })
            }
            className={[
                "app-scrolltop fixed right-3 z-[94] inline-flex items-center justify-center rounded-full p-3 transition duration-300 md:right-5",
                visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
            ].join(" ")}
            style={{
                bottom: "calc(var(--app-mobile-nav-height, 0px) + env(safe-area-inset-bottom, 0px) + 1rem)",
            }}
        >
            <ArrowUpIcon />
        </button>
    );
}
