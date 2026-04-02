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
        ? "md:grid-cols-1"
        : columns === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-3";

    return <div className={`grid gap-4 ${columnClass}`}>{children}</div>;
}