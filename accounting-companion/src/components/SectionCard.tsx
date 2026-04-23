import type { CSSProperties, ReactNode } from "react";

type SectionCardProps = {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
};

export default function SectionCard({
    children,
    className = "",
    style,
}: SectionCardProps) {
    return (
        <div
            className={`app-panel rounded-[var(--app-radius-lg)] p-4.5 md:p-5.5 lg:p-6 ${className}`}
            style={style}
        >
            {children}
        </div>
    );
}
