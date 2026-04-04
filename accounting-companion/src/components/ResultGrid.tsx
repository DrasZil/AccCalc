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
        ? "md:grid-cols-1"
        : columns === 2
        ? "md:grid-cols-2"
        : columns === 3
        ? "md:grid-cols-3"
        : "md:grid-cols-4";

    return <div className={`grid gap-4 ${columnClass}`}>{children}</div>;
}
