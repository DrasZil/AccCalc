import type { ReactNode } from "react";

type ResultGridProps = {
    children: ReactNode;
    columns?: 1 | 2 | 3 | 4;
    className?: string;
};

export default function ResultGrid({
    children,
    columns = 2,
    className = "",
}: ResultGridProps) {
    return (
        <div
            className={[
                "app-result-grid gap-3 md:gap-4",
                `app-result-grid-${columns}`,
                className,
            ].join(" ")}
        >
            {children}
        </div>
    );
}
