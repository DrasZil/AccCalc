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
        <div className={`rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-md transition duration-300 hover:border-white/[0.12] md:p-6 ${className}`}>
        {children}
        </div>
    );
}
