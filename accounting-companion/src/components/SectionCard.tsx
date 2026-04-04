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
            className={`app-panel app-card-hover rounded-[var(--app-radius-lg)] p-5 md:p-6 lg:p-7 ${className}`}
        >
            {children}
        </div>
    );
}
