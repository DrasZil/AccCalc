import type { ReactNode } from "react";
import SectionCard from "./SectionCard";

type FormulaCardProps = {
    formula: ReactNode | string;
    steps: ReactNode[] | string[];
    };

    export default function FormulaCard({ formula, steps }: FormulaCardProps) {
    return (
        <SectionCard>
        <p className="text-sm font-medium text-gray-400">Formula Used</p>
        <p className="mt-3 text-xl font-bold text-center text-white">{formula}</p>

        <p className="mt-5 text-sm font-medium text-gray-400">Steps</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-white">
            {steps.map((step, i) => (
            <li key={i}>{step}</li>
            ))}
        </ul>
        </SectionCard>
    );
}