import type { ReactNode } from "react";
import SectionCard from "./SectionCard";

type FormulaCardProps = {
    formula: ReactNode | string;
    steps: ReactNode[] | string[];
    };

    export default function FormulaCard({ formula, steps }: FormulaCardProps) {
    return (
        <SectionCard>
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-gray-400">Formula Used</p>
        <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-black/20 px-5 py-4">
            <p className="text-center text-lg font-bold text-white md:text-xl">{formula}</p>
        </div>

        <p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-gray-400">Steps</p>
        <ul className="mt-3 space-y-3 text-sm leading-6 text-white">
            {steps.map((step, i) => (
            <li key={i} className="rounded-2xl border border-white/8 bg-black/15 px-4 py-3">
                {step}
            </li>
            ))}
        </ul>
        </SectionCard>
    );
}
