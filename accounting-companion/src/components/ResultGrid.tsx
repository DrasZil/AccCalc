import type { ReactNode } from "react";

type ResultGridProps = {
    children: ReactNode;
    columns?: 1 | 2 | 3 | 4;
};

export default function ResultGrid({
    children,
    columns = 2,
}: ResultGridProps) {
    const columnClass =
        columns === 1
        ? "grid-cols-1"
        : columns === 2
        ? "sm:grid-cols-2"
        : columns === 3
        ? "sm:grid-cols-2 xl:grid-cols-3"
        : "sm:grid-cols-2 xl:grid-cols-4";

    return <div className={`grid gap-3 md:gap-4 ${columnClass}`}>{children}</div>;
}
