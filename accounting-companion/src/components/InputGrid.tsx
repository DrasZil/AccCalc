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
            ? "app-input-grid--1"
            : columns === 2
              ? "app-input-grid--2"
              : "app-input-grid--3";

    return <div className={`app-input-grid ${columnClass}`}>{children}</div>;
}
