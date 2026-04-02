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
        <div className={`rounded-2xl border border-white/10 bg-white/5 p-5 ${className}`}>
        {children}
        </div>
    );
}