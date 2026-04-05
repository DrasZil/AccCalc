import type { ReactNode } from "react";

type InputGridProps = {
    children: ReactNode;
    columns?: 1 | 2 | 3;
};

export default function InputGrid({
    children,
    columns = 2,
}: InputGridProps) {
    const columnClass =
        columns === 1
        ? "grid-cols-1"
        : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 xl:grid-cols-3";

    return <div className={`grid gap-3 md:gap-4 ${columnClass}`}>{children}</div>;
}
