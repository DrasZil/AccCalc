import type { ReactNode } from "react";

type SectionCardProps = {
    children: ReactNode;
    className?: string;
};

export default function SectionCard({
    children,
    className = "",
}: SectionCardProps) {
    return (
        <div
            className={`app-panel rounded-[var(--app-radius-lg)] p-4 md:p-5 lg:p-6 ${className}`}
        >
            {children}
        </div>
    );
}
