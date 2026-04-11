import { useNavigate } from "react-router-dom";

type PageBackButtonProps = {
    fallbackTo: string;
    label?: string;
    className?: string;
};

export default function PageBackButton({
    fallbackTo,
    label = "Back",
    className = "",
}: PageBackButtonProps) {
    const navigate = useNavigate();

    function handleClick() {
        const historyIndex =
            typeof window !== "undefined" && typeof window.history.state?.idx === "number"
                ? window.history.state.idx
                : 0;

        if (historyIndex > 0) {
            navigate(-1);
            return;
        }

        navigate(fallbackTo);
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className={[
                "app-back-link inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium",
                className,
            ].join(" ")}
        >
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M15 6l-6 6 6 6" />
                <path d="M9 12h10" />
            </svg>
            <span>{label}</span>
        </button>
    );
}
